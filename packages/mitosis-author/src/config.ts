import { createOpenAI } from '@ai-sdk/openai';
import type { OpenAIProvider } from '@ai-sdk/openai';

export interface AuthorConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  session: string;
}

export function getAuthorConfig(): AuthorConfig {
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

  const session = process.env.OPENCODE_SESSION?.trim() || 'supernova';

  return {
    baseUrl,
    apiKey,
    model,
    session,
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
