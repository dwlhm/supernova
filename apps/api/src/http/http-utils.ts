import * as crypto from 'node:crypto';
import type * as http from 'node:http';
import { DomainError } from '../domain/models.js';

/** Figma document payloads are ~22 MB; anything far beyond that is rejected before buffering. */
export const MAX_BODY_BYTES = 64 * 1024 * 1024;

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-GitHub-Event, X-Hub-Signature-256',
};

export function writeJSON(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
  res.end(JSON.stringify(data));
}

export function writeError(res: http.ServerResponse, status: number, code: string, message: string): void {
  writeJSON(res, status, { code, message });
}

export async function readBodyBuffer(req: http.IncomingMessage, limit = MAX_BODY_BYTES): Promise<Buffer> {
  const tooLarge = () => new DomainError('PAYLOAD_TOO_LARGE', `request body exceeds ${limit} bytes`);
  if (Number(req.headers['content-length'] || 0) > limit) throw tooLarge();
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer);
    size += buf.byteLength;
    if (size > limit) {
      req.destroy();
      throw tooLarge();
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}

/** Parses an optional JSON request body; an empty body yields `undefined`. */
export async function readOptionalJSONBody<T>(req: http.IncomingMessage): Promise<T | undefined> {
  const raw = await readBodyBuffer(req);
  if (raw.length === 0) return undefined;
  try {
    return JSON.parse(raw.toString('utf8')) as T;
  } catch (err) {
    throw new DomainError('INVALID_PAYLOAD', `Failed to parse request JSON: ${(err as Error).message}`);
  }
}

export async function readJSONBody<T>(req: http.IncomingMessage): Promise<T> {
  const body = await readOptionalJSONBody<T>(req);
  if (body === undefined) throw new DomainError('INVALID_PAYLOAD', 'request body is required');
  return body;
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function checkBearerAuth(req: http.IncomingMessage, apiToken?: string): boolean {
  if (!apiToken) return true;
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return false;
  return safeEqual(auth.slice('Bearer '.length).trim(), apiToken);
}

/** Fail-closed: callers must reject webhooks before verification when no secret is configured. */
export function verifyWebhookSignature(rawBody: Buffer, sigHeader: string, secret: string): boolean {
  if (!sigHeader.startsWith('sha256=')) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqual(sigHeader, expected);
}

const ERROR_STATUS: Partial<Record<DomainError['code'], [number, string]>> = {
  INVALID_PAYLOAD: [400, 'INVALID_PAYLOAD'],
  PAYLOAD_TOO_LARGE: [413, 'PAYLOAD_TOO_LARGE'],
  JOB_NOT_FOUND: [404, 'NOT_FOUND'],
  EXTRACTION_NOT_FOUND: [404, 'NOT_FOUND'],
  SYNC_PLAN_NOT_FOUND: [404, 'NOT_FOUND'],
  JOB_NOT_FINISHED: [409, 'JOB_NOT_READY'],
  WEBHOOK_NOT_CONFIGURED: [503, 'WEBHOOK_NOT_CONFIGURED'],
};

export function writeDomainError(res: http.ServerResponse, err: unknown): void {
  if (err instanceof DomainError) {
    const mapped = ERROR_STATUS[err.code];
    if (mapped) return writeError(res, mapped[0], mapped[1], err.message);
  }
  writeError(res, 500, 'INTERNAL_ERROR', err instanceof Error ? err.message : String(err));
}
