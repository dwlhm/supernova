#!/usr/bin/env node
import * as http from 'node:http';
import * as path from 'node:path';
import { DevMockAuthor, InProcessAuthor } from './app/author-runner.js';
import { Service } from './app/service.js';
import { findRepoRoot, loadConfig, loadDotEnv } from './config.js';
import { createRouter } from './http/router.js';
import {
  runLocalBuildCommand,
  runLocalInspectCommand,
  runLocalRegenCommand,
  runLocalSyncCommand,
} from './local-runner.js';
import { DownloadPublisher } from './publisher/download-publisher.js';
import { GitHubPublisher } from './publisher/github-publisher.js';
import { LocalWorkspacePublisher } from './publisher/local-publisher.js';
import { MemStore } from './store/mem-store.js';
import type { JobStore } from './store/store.js';

const SHUTDOWN_GRACE_MS = 5_000;

async function startServer(loopbackNoAuthDefault: boolean): Promise<void> {
  const root = findRepoRoot(process.cwd());
  if (root) {
    loadDotEnv(path.join(root, '.env'));
  }

  const cfg = loadConfig(
    (k) =>
      loopbackNoAuthDefault &&
      (k === 'KOMERCE_INSECURE_NO_AUTH' || k === 'SUPERNOVA_INSECURE_NO_AUTH') &&
      !process.env.API_TOKEN
        ? 'true'
        : process.env[k],
    root
  );

  const store: JobStore = new MemStore();

  const docsDir = cfg.docsDir || (root ? path.join(root, 'apps', 'docs') : '');
  const author = cfg.devMockLLM ? new DevMockAuthor() : new InProcessAuthor();
  const publishers = [
    new LocalWorkspacePublisher(root || process.cwd(), {
      store,
      docsDir,
      compileLibrary: true,
    }),
    new DownloadPublisher(store),
    new GitHubPublisher(cfg.github.token, cfg.github.repo, cfg.github.baseBranch, store),
  ];

  const svc = new Service(store, author, publishers, {
    extractionsDir: cfg.extractionsDir,
    docsDir,
    generatedDir: cfg.generatedDir,
    workspaceDir: root || process.cwd(),
  });

  const recovered = await svc.recoverInterruptedJobs();
  if (recovered > 0) console.error(`[API] Marked ${recovered} interrupted job(s) as failed`);
  if (!loopbackNoAuthDefault && !cfg.github.webhookSecret) {
    console.error('[API] GITHUB_WEBHOOK_SECRET not set: /v1/webhooks/github is disabled');
  }

  const server = http.createServer(
    createRouter(svc, {
      apiToken: cfg.apiToken,
      webhookSecret: cfg.github.webhookSecret,
    })
  );

  const port = Number(cfg.port) || 8080;
  const host = loopbackNoAuthDefault ? '127.0.0.1' : undefined;
  server.listen(port, host, () => {
    console.error(
      loopbackNoAuthDefault
        ? `[Komerce Design] Local Figma listener ready on http://127.0.0.1:${port} (writes directly to src/ & library/*)`
        : `[API] Komerce Design TypeScript API server listening on :${port}`
    );
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    // Long-lived SSE streams would otherwise keep close() pending forever.
    setTimeout(() => server.closeAllConnections(), SHUTDOWN_GRACE_MS).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'sync') {
    await runLocalSyncCommand(rest);
    return;
  }
  if (cmd === 'regen' || cmd === 'regenerate') {
    await runLocalRegenCommand(rest);
    return;
  }
  if (cmd === 'inspect') {
    await runLocalInspectCommand(rest);
    return;
  }
  if (cmd === 'build' || cmd === 'compile') {
    await runLocalBuildCommand(rest);
    return;
  }
  if (cmd === 'listen') {
    await startServer(true);
    return;
  }
  await startServer(false);
}

main().catch((err) => {
  console.error('[Komerce Design] Error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
