import { Readable } from 'node:stream';

export function invokeRouter(router, { method = 'GET', url = '/', headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const bodyBuf =
      body === undefined
        ? Buffer.alloc(0)
        : typeof body === 'string'
          ? Buffer.from(body, 'utf8')
          : Buffer.isBuffer(body)
            ? body
            : Buffer.from(JSON.stringify(body), 'utf8');

    const req = Readable.from(bodyBuf.length > 0 ? [bodyBuf] : []);
    req.method = method;
    req.url = url;
    req.headers = Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
    );

    let statusCode = 200;
    let resHeaders = {};
    const chunks = [];

    const res = {
      writeHead(status, hdrs = {}) {
        statusCode = status;
        resHeaders = { ...resHeaders, ...hdrs };
      },
      write(chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      },
      end(chunk) {
        if (chunk !== undefined) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
        }
        const buffer = Buffer.concat(chunks);
        resolve({
          status: statusCode,
          headers: resHeaders,
          buffer,
          json: () => JSON.parse(buffer.toString('utf8')),
        });
      },
    };

    Promise.resolve(router(req, res)).catch(reject);
  });
}

export async function waitForJobCompletion(router, jobId, token) {
  for (let i = 0; i < 60; i++) {
    const res = await invokeRouter(router, {
      method: 'GET',
      url: `/v1/jobs/${jobId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.json();
    if (['succeeded', 'partially_succeeded', 'failed'].includes(data.status)) {
      return data;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('Timed out waiting for job completion');
}
