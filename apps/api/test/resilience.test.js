import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as os from 'node:os';
import * as path from 'node:path';
import { Service, MemStore, DevMockAuthor, DownloadPublisher, GitHubPublisher, createRouter } from '../dist/index.js';
import { invokeRouter } from './helpers.js';

const doc = (...names) => ({
  document: { name: 'ResilienceDS', tokens: [], components: names.map((name, i) => ({ id: String(i), name })) },
});

function makeService({ author = new DevMockAuthor(), docsDir } = {}) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-resilience-'));
  const store = new MemStore();
  const svc = new Service(store, author, [new DownloadPublisher(store)], {
    extractionsDir: path.join(tmpDir, 'extractions'),
    ...(docsDir ? { docsDir: docsDir(tmpDir) } : {}),
  });
  return { svc, store, tmpDir };
}

async function waitTerminal(svc, jobId) {
  for (let i = 0; i < 100; i++) {
    const job = await svc.getJob(jobId);
    if (['succeeded', 'partially_succeeded', 'failed'].includes(job.status)) return job;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error('job never reached a terminal state');
}

describe('Job lifecycle resilience (@komerce-design/api)', () => {
  it('drives a job to failed instead of crashing when an unexpected error escapes the runner', async () => {
    // docsDir points below a regular file, so writing token CSS throws ENOTDIR mid-job.
    const { svc, tmpDir } = makeService({
      docsDir: (dir) => {
        fs.writeFileSync(path.join(dir, 'blocker'), '');
        return path.join(dir, 'blocker', 'docs');
      },
    });
    const job = await waitTerminal(svc, await svc.submitExtraction(doc('Button')));
    assert.equal(job.status, 'failed');
    assert.equal(job.error.stage, 'internal');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('reports partially_succeeded when some components fail, and keeps artifacts downloadable', async () => {
    const mock = new DevMockAuthor();
    const author = {
      async authorDesignSystem(req) {
        if (req.componentName === 'Broken') throw new Error('compile failed');
        return mock.authorDesignSystem(req);
      },
    };
    const { svc, tmpDir } = makeService({ author });
    svc.setMaxRetries(0);
    const job = await waitTerminal(svc, await svc.submitExtraction(doc('Button', 'Broken')));
    assert.equal(job.status, 'partially_succeeded');
    assert.match(job.error.message, /Broken/);
    assert.ok((await svc.getDownloadZip(job.id)).byteLength > 0);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('marks jobs interrupted by a restart as failed', async () => {
    const { svc, store, tmpDir } = makeService();
    const now = new Date().toISOString();
    await store.save({
      id: 'stuck', documentName: 'x', document: { components: [] }, targets: [], publishers: [],
      status: 'authoring', tasks: [], components: [], artifacts: [], publishResults: {}, createdAt: now, updatedAt: now,
    });
    assert.equal(await svc.recoverInterruptedJobs(), 1);
    const job = await store.get('stuck');
    assert.equal(job.status, 'failed');
    assert.equal(job.error.stage, 'recovery');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe('HTTP hardening (@komerce-design/api)', () => {
  it('rejects webhooks fail-closed, bad signatures, oversized and malformed bodies', async () => {
    const { svc, tmpDir } = makeService();
    const open = createRouter(svc, { apiToken: 't' });
    const secured = createRouter(svc, { apiToken: 't', webhookSecret: 'whsec' });
    const body = JSON.stringify({ action: 'created' });
    const sign = (b) => 'sha256=' + crypto.createHmac('sha256', 'whsec').update(b).digest('hex');
    const hook = (router, sig) => invokeRouter(router, {
      method: 'POST', url: '/v1/webhooks/github', body,
      headers: { 'X-GitHub-Event': 'issue_comment', 'X-Hub-Signature-256': sig },
    });

    assert.equal((await hook(open, sign(body))).status, 503);
    assert.equal((await hook(secured, 'sha256=deadbeef')).status, 401);
    const ok = await hook(secured, sign(body));
    assert.equal(ok.status, 200);
    assert.equal(ok.json().status, 'ignored');

    const auth = { Authorization: 'Bearer t' };
    const tooLarge = await invokeRouter(open, {
      method: 'POST', url: '/v1/extractions', body: '{}', headers: { ...auth, 'Content-Length': String(65 * 1024 * 1024) },
    });
    assert.equal(tooLarge.status, 413);
    const malformed = await invokeRouter(open, { method: 'POST', url: '/v1/extractions', body: '{nope', headers: auth });
    assert.equal(malformed.status, 400);
    assert.equal(malformed.json().code, 'INVALID_PAYLOAD');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('closes the SSE stream with the terminal status for an already-finished job', async () => {
    const { svc, tmpDir } = makeService();
    const jobId = await svc.submitExtraction(doc('Button'));
    await waitTerminal(svc, jobId);
    const res = await invokeRouter(createRouter(svc, { apiToken: 't' }), {
      url: `/v1/jobs/${jobId}/events`, headers: { Authorization: 'Bearer t' },
    });
    const text = res.buffer.toString('utf8');
    assert.match(text, /event: job_completed/);
    assert.match(text, /"status":"succeeded"/);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe('GitHubPublisher (@komerce-design/api)', () => {
  async function withGitHub(handler, fn) {
    const calls = [];
    const server = http.createServer(async (req, res) => {
      let raw = '';
      for await (const c of req) raw += c;
      const call = { method: req.method, url: req.url, body: raw ? JSON.parse(raw) : undefined };
      calls.push(call);
      const [status, payload, type = 'application/json'] = handler(call);
      res.writeHead(status, { 'Content-Type': type });
      res.end(typeof payload === 'string' ? payload : JSON.stringify(payload));
    });
    await new Promise((r) => server.listen(0, r));
    const pub = new GitHubPublisher('tok', 'komerce/ds');
    pub.setBaseURL(`http://127.0.0.1:${server.address().port}`);
    try {
      await fn(pub, calls);
    } finally {
      server.close();
    }
  }

  it('stacks regenerate commits on the branch head without force-pushing', async () => {
    await withGitHub(({ method, url }) => {
      if (method === 'GET' && url.includes('/git/ref/heads/review')) return [200, { object: { sha: 'head1' } }];
      if (url.endsWith('/git/trees')) return [201, { sha: 'tree1' }];
      if (url.endsWith('/git/commits')) return [201, { sha: 'commit1' }];
      if (method === 'PATCH') return [200, {}];
      return [404, {}];
    }, async (pub, calls) => {
      const sha = await pub.commitArtifacts('komerce', 'ds', 'review', [
        { target: 'mitosis', fileName: 'Badge.lite.tsx', group: 'components', code: 'x' },
      ], 'msg');
      assert.equal(sha, 'commit1');
      assert.deepEqual(calls.find((c) => c.url.endsWith('/git/commits')).body.parents, ['head1']);
      assert.equal(calls.find((c) => c.method === 'PATCH').body.force, false);
    });
  });

  it('surfaces non-JSON GitHub failures as descriptive errors', async () => {
    await withGitHub(({ url }) => {
      if (url.includes('/git/ref/heads/review')) return [200, { object: { sha: 'head1' } }];
      return [502, '<html>Bad Gateway</html>', 'text/html'];
    }, async (pub) => {
      await assert.rejects(
        pub.commitArtifacts('komerce', 'ds', 'review', [], 'msg'),
        /failed to create git tree: HTTP 502: <html>Bad Gateway/
      );
    });
  });
});
