import type * as http from 'node:http';
import type { Service } from '../app/service.js';
import type { JobEvent, JobStatus } from '../domain/models.js';
import { CORS_HEADERS } from './http-utils.js';

const HEARTBEAT_MS = 15_000;
const TERMINAL: ReadonlySet<JobStatus> = new Set(['succeeded', 'partially_succeeded', 'failed']);

function isTerminalEvent(ev: JobEvent): boolean {
  return ev.eventType === 'job_completed' || ev.eventType === 'job_failed';
}

/**
 * SSE stream: emits the current job status first (so late subscribers never hang on an
 * already-finished job), then live events until a terminal event or client disconnect.
 */
export async function streamJobEvents(
  svc: Service,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  jobId: string
): Promise<void> {
  let closed = false;
  let heartbeat: NodeJS.Timeout | undefined;
  const pending: JobEvent[] = [];
  let ready = false;

  const send = (ev: JobEvent) => {
    if (closed) return;
    res.write(`event: ${ev.eventType}\ndata: ${JSON.stringify(ev)}\n\n`);
    if (isTerminalEvent(ev)) close();
  };
  const { job, unsubscribe } = await svc.subscribeJobEvents(jobId, (ev) => (ready ? send(ev) : pending.push(ev)));
  const close = () => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    unsubscribe();
    res.end();
  };

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': CORS_HEADERS['Access-Control-Allow-Origin'],
  });
  req.on('close', close);
  heartbeat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);

  const terminal = TERMINAL.has(job.status);
  send({
    eventType: terminal ? (job.status === 'failed' ? 'job_failed' : 'job_completed') : 'job_status',
    jobId,
    ...(job.runId ? { runId: job.runId } : {}),
    status: job.status,
    ...(job.error ? { error: job.error.message } : {}),
    timestamp: job.updatedAt,
  });
  ready = true;
  for (const ev of pending.splice(0)) send(ev);
}
