import { createOpenAI } from '@ai-sdk/openai';
import type { OpenAIProvider } from '@ai-sdk/openai';

export type AuthorProvider = 'openai' | 'agy';

export interface AuthorConfig {
  provider: AuthorProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  session: string;
  agyBin: string;
  /** Wall-clock cap for a single authoring call (`LLM_TIMEOUT`, e.g. `180s`; default 10m). */
  timeoutMs: number;
}

const DEFAULT_TIMEOUT = '10m';
const DEFAULT_AGY_MODEL = 'gemini-4-argon-medium';
const VALID_AGY_MODEL_RE = /^(?:gemini-|claude-|gpt-oss-)/i;
const DURATION_UNITS_MS: Record<string, number> = { ms: 1, s: 1000, m: 60_000 };

function parseDuration(raw: string): number {
  const match = /^(\d+)(ms|s|m)$/.exec(raw);
  const ms = match ? Number(match[1]) * DURATION_UNITS_MS[match[2]!]! : 0;
  if (ms <= 0) throw new Error(`Invalid LLM_TIMEOUT "${raw}": expected a positive duration like 180s, 5m or 90000ms`);
  return ms;
}

function parseProvider(raw?: string): AuthorProvider {
  const normalized = (raw || 'openai').trim().toLowerCase();
  if (normalized === 'openai' || normalized === 'agy') {
    return normalized;
  }
  throw new Error(`Invalid LLM_PROVIDER "${raw}": expected "openai" or "agy"`);
}

function resolveAgyModel(): string {
  const explicitAgy = process.env.AGY_MODEL?.trim();
  if (explicitAgy) return explicitAgy;
  const llmModel = process.env.LLM_MODEL?.trim();
  if (llmModel && VALID_AGY_MODEL_RE.test(llmModel)) {
    return llmModel;
  }
  return DEFAULT_AGY_MODEL;
}

export function getAuthorConfig(): AuthorConfig {
  const provider = parseProvider(process.env.LLM_PROVIDER);
  const session = process.env.OPENCODE_SESSION?.trim() || 'supernova';
  const agyBin = process.env.AGY_BIN?.trim() || 'agy';
  const timeoutMs = parseDuration(process.env.LLM_TIMEOUT?.trim() || DEFAULT_TIMEOUT);

  if (provider === 'agy') {
    const model = resolveAgyModel();
    return {
      provider,
      baseUrl: process.env.LLM_BASE_URL?.trim() || '',
      apiKey: process.env.LLM_API_KEY?.trim() || '',
      model,
      session,
      agyBin,
      timeoutMs,
    };
  }

  const baseUrl = process.env.LLM_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('Missing required environment variable: LLM_BASE_URL');
  }

  const apiKey = process.env.LLM_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing required environment variable: LLM_API_KEY');
  }

  const model = process.env.LLM_MODEL?.trim();
  if (!model) {
    throw new Error('Missing required environment variable: LLM_MODEL');
  }

  return {
    provider,
    baseUrl,
    apiKey,
    model,
    session,
    agyBin,
    timeoutMs,
  };
}

export function createAuthorOpenAI(config: AuthorConfig = getAuthorConfig()): OpenAIProvider {
  return createOpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey,
    headers: {
      'x-opencode-session': config.session,
    },
  });
}

export function getAuthorModel(config: AuthorConfig = getAuthorConfig()) {
  const openai = createAuthorOpenAI(config);
  return openai(config.model);
}
