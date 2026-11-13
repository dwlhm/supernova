import * as fs from 'node:fs';
import * as path from 'node:path';

export interface GitHubConfig {
  token: string;
  repo: string;
  baseBranch: string;
  webhookSecret: string;
}

export interface Config {
  port: string;
  apiToken: string;
  insecureNoAuth: boolean;
  devMockLLM: boolean;
  extractionsDir: string;
  docsDir: string;
  generatedDir: string;
  github: GitHubConfig;
}

export class MissingApiTokenError extends Error {
  constructor() {
    super(
      'API_TOKEN is required; set KOMERCE_INSECURE_NO_AUTH=true to run without auth in local development'
    );
    this.name = 'MissingApiTokenError';
  }
}

export function findRepoRoot(startDir: string): string {
  let d = path.resolve(startDir);
  while (d) {
    if (fs.existsSync(path.join(d, 'pnpm-workspace.yaml'))) {
      return d;
    }
    const parent = path.dirname(d);
    if (parent === d) return '';
    d = parent;
  }
  return '';
}

export function loadDotEnv(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function absPath(p: string): string {
  if (!p) return '';
  return path.resolve(p);
}

export function loadConfig(
  getenv: (key: string) => string | undefined = (k) => process.env[k],
  repoRoot = findRepoRoot(process.cwd())
): Config {
  const env = (key: string, def: string): string => {
    const v = (getenv(key) ?? '').trim();
    return v !== '' ? v : def;
  };
  const fromRoot = (rel: string): string => (repoRoot ? path.join(repoRoot, rel) : '');

  const cfg: Config = {
    port: env('PORT', '8080'),
    apiToken: env('API_TOKEN', ''),
    insecureNoAuth:
      env('KOMERCE_INSECURE_NO_AUTH', env('SUPERNOVA_INSECURE_NO_AUTH', '')) === 'true',
    devMockLLM:
      env('KOMERCE_DEV_MOCK_LLM', env('SUPERNOVA_DEV_MOCK_LLM', '')) === 'true',
    extractionsDir: absPath(env('EXTRACTIONS_DIR', fromRoot('var/extractions'))),
    docsDir: absPath(env('APPS_DOCS_DIR', '')),
    generatedDir: absPath(env('GENERATED_DIR', '')),
    github: {
      token: env('GITHUB_TOKEN', ''),
      repo: env('GITHUB_REPO', ''),
      baseBranch: env('GITHUB_BASE_BRANCH', 'main'),
      webhookSecret: env('GITHUB_WEBHOOK_SECRET', ''),
    },
  };

  if (!cfg.apiToken && !cfg.insecureNoAuth) {
    throw new MissingApiTokenError();
  }
  if (!cfg.extractionsDir) {
    throw new Error('EXTRACTIONS_DIR is required when the repository root cannot be detected');
  }
  return cfg;
}
