import type * as http from 'node:http';
import type { Service } from '../app/service.js';
import {
  DomainError,
  taskToContract,
  type ApplySyncRequest,
  type ExtractionOptions,
  type ExtractionRequest,
  type SyncPlan,
  type SyncRequest,
} from '../domain/models.js';
import {
  CORS_HEADERS,
  checkBearerAuth,
  readBodyBuffer,
  readJSONBody,
  readOptionalJSONBody,
  verifyWebhookSignature,
  writeDomainError,
  writeError,
  writeJSON,
} from './http-utils.js';
import { streamJobEvents } from './job-events.js';

export interface RouterOptions {
  apiToken?: string;
  webhookSecret?: string;
}

const trimSlashes = (s: string) => s.replace(/^\/+|\/+$/g, '');

function syncPlanResponse(plan: SyncPlan) {
  const { syncId, documentName, summary, components, tokens, createdAt } = plan;
  return { syncId, documentName, summary, components, tokens, createdAt };
}

const queued = (jobId: string) => ({ jobId, status: 'queued', createdAt: new Date().toISOString() });

async function handleJobRoutes(svc: Service, req: http.IncomingMessage, res: http.ServerResponse, subpath: string): Promise<void> {
  if (req.method !== 'GET') return writeError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
  if (!subpath) return writeError(res, 404, 'NOT_FOUND', 'Not found');

  if (subpath.endsWith('/download')) {
    const zipBytes = await svc.getDownloadZip(trimSlashes(subpath.slice(0, -'/download'.length)));
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="components.zip"',
      'Content-Length': String(zipBytes.byteLength),
      'Access-Control-Allow-Origin': CORS_HEADERS['Access-Control-Allow-Origin'],
    });
    res.end(Buffer.from(zipBytes));
    return;
  }

  if (subpath.endsWith('/events')) {
    return streamJobEvents(svc, req, res, trimSlashes(subpath.slice(0, -'/events'.length)));
  }

  const job = await svc.getJob(trimSlashes(subpath));
  writeJSON(res, 200, {
    jobId: job.id,
    status: job.status,
    ...(job.runId ? { runId: job.runId } : {}),
    ...(job.tasks?.length ? { tasks: job.tasks.map(taskToContract) } : {}),
    targets: job.targets,
    publishers: job.publishers,
    components: job.components,
    publishResults: job.publishResults,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    ...(job.error ? { error: job.error } : {}),
  });
}

async function handleWebhook(svc: Service, req: http.IncomingMessage, res: http.ServerResponse, secret?: string): Promise<void> {
  if (!secret) throw new DomainError('WEBHOOK_NOT_CONFIGURED', 'GITHUB_WEBHOOK_SECRET is not configured');
  const rawBody = await readBodyBuffer(req);
  const sig = String(req.headers['x-hub-signature-256'] || '');
  if (!verifyWebhookSignature(rawBody, sig, secret)) {
    return writeError(res, 401, 'UNAUTHORIZED', 'Invalid webhook signature');
  }
  const { accepted } = svc.handleGitHubWebhook(String(req.headers['x-github-event'] || ''), rawBody);
  writeJSON(res, accepted ? 202 : 200, { status: accepted ? 'accepted' : 'ignored' });
}

type PostHandler = (svc: Service, req: http.IncomingMessage) => Promise<[number, unknown]>;

const POST_ROUTES: Record<string, PostHandler> = {
  '/v1/extractions': async (svc, req) => [202, queued(await svc.submitExtraction(await readJSONBody<ExtractionRequest>(req)))],
  '/v1/extractions/replay': async (svc, req) => {
    const body = (await readOptionalJSONBody<{ jobId?: string }>(req)) ?? {};
    return [202, queued(await svc.replayExtraction(body.jobId))];
  },
  '/v1/syncs': async (svc, req) => [200, syncPlanResponse(await svc.submitSync(await readJSONBody<SyncRequest>(req)))],
  '/v1/syncs/replay': async (svc, req) => {
    const body = (await readOptionalJSONBody<{ jobId?: string; fixture?: string; options?: ExtractionOptions }>(req)) ?? {};
    return [200, syncPlanResponse(await svc.replaySync(body.jobId || body.fixture, body.options))];
  },
};

async function route(svc: Service, req: http.IncomingMessage, res: http.ServerResponse, opts: RouterOptions): Promise<void> {
  const { pathname } = new URL(req.url || '/', 'http://localhost');

  if (pathname === '/v1/health') {
    if (req.method !== 'GET') return writeError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    return writeJSON(res, 200, { status: 'ok', version: '1.0.0' });
  }
  if (pathname === '/v1/webhooks/github') {
    if (req.method !== 'POST') return writeError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    return handleWebhook(svc, req, res, opts.webhookSecret);
  }
  if (!checkBearerAuth(req, opts.apiToken)) {
    return writeError(res, 401, 'UNAUTHORIZED', 'Missing or invalid authentication token');
  }

  const post = POST_ROUTES[pathname];
  if (post || (pathname.startsWith('/v1/syncs/') && pathname.endsWith('/apply'))) {
    if (req.method !== 'POST') return writeError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    if (post) {
      const [status, body] = await post(svc, req);
      return writeJSON(res, status, body);
    }
    const syncId = trimSlashes(pathname.slice('/v1/syncs/'.length, -'/apply'.length));
    const overrides = await readOptionalJSONBody<ApplySyncRequest>(req);
    return writeJSON(res, 202, queued(await svc.applySync(syncId, overrides)));
  }
  if (pathname.startsWith('/v1/jobs/')) {
    return handleJobRoutes(svc, req, res, pathname.slice('/v1/jobs/'.length));
  }
  writeError(res, 404, 'NOT_FOUND', 'Route not found');
}

export function createRouter(svc: Service, opts: RouterOptions = {}): http.RequestListener {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }
    try {
      await route(svc, req, res, opts);
    } catch (err: unknown) {
      if (res.headersSent) {
        res.end();
        return;
      }
      writeDomainError(res, err);
    }
  };
}
