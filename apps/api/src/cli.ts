#!/usr/bin/env node
import * as http from 'node:http';
import * as path from 'node:path';
import { DevMockAuthor, InProcessAuthor } from './app/author-runner.js';
import { Service } from './app/service.js';
import { findRepoRoot, loadConfig, loadDotEnv } from './config.js';
import { createRouter } from './http/router.js';
import { DownloadPublisher } from './publisher/download-publisher.js';
import { GitHubPublisher } from './publisher/github-publisher.js';
import { MemStore } from './store/mem-store.js';
import { SqliteStore } from './store/sqlite-store.js';
import type { JobStore } from './store/store.js';

const SHUTDOWN_GRACE_MS = 5_000;

async function main(): Promise<void> {
  const root = findRepoRoot(process.cwd());
  if (root) {
    loadDotEnv(path.join(root, '.env'));
  }

  const cfg = loadConfig(
    (k) => process.env[k],
    root
  );

  // A configured database that cannot be opened is fatal: silently degrading to memory loses data.
  const store: JobStore = cfg.databasePath ? new SqliteStore(cfg.databasePath) : new MemStore();
  if (cfg.databasePath) console.error(`[API] SQLite database initialized at ${cfg.databasePath}`);

  const author = cfg.devMockLLM ? new DevMockAuthor() : new InProcessAuthor();
  const publishers = [
    new DownloadPublisher(store),
    new GitHubPublisher(cfg.github.token, cfg.github.repo, cfg.github.baseBranch, store),
  ];

  const svc = new Service(store, author, publishers, {
    extractionsDir: cfg.extractionsDir,
    docsDir: cfg.docsDir,
    generatedDir: cfg.generatedDir,
  });

  const recovered = await svc.recoverInterruptedJobs();
  if (recovered > 0) console.error(`[API] Marked ${recovered} interrupted job(s) as failed`);
  if (!cfg.github.webhookSecret) {
    console.error('[API] GITHUB_WEBHOOK_SECRET not set: /v1/webhooks/github is disabled');
  }

  const server = http.createServer(
    createRouter(svc, {
      apiToken: cfg.apiToken,
      webhookSecret: cfg.github.webhookSecret,
    })
  );

  const port = Number(cfg.port) || 8080;
  server.listen(port, () => {
    console.error(`[API] Supernova TypeScript API server listening on :${port}`);
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

main().catch((err) => {
  console.error('[API] Fatal startup error:', err);
  process.exit(1);
});
