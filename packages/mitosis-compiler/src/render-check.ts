import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { CompileError } from './types.js';
import type { RenderCheckOptions } from './render-core.js';

export * from './render-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In compiled dist, worker is at ./render-worker.js
const workerPath = resolve(__dirname, './render-worker.js');

const DEFAULT_TIMEOUT_MS = 5000;

export async function renderCheck(
  opts: RenderCheckOptions,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<CompileError[]> {
  return new Promise((resolvePromise) => {
    let settled = false;

    const worker = new Worker(workerPath, {
      workerData: opts,
      env: {}, // Isolated clean environment, no tokens/secrets passed
      resourceLimits: {
        maxOldGenerationSizeMb: 128,
        maxYoungGenerationSizeMb: 32,
      },
    });

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        worker.terminate().catch(() => {});
        resolvePromise([
          {
            target: 'render',
            rule: 'render-timeout',
            message: `Render check timed out after ${timeoutMs}ms (infinite loop or stalled render execution detected).`,
          },
        ]);
      }
    }, timeoutMs);

    worker.on('message', (res: { success: boolean; errors?: CompileError[]; error?: string }) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        worker.terminate().catch(() => {});
        if (res.success && res.errors) {
          resolvePromise(res.errors);
        } else {
          resolvePromise([
            {
              target: 'render',
              rule: 'render-crash',
              message: res.error || 'Worker execution error during render check.',
            },
          ]);
        }
      }
    });

    worker.on('error', (err: Error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        worker.terminate().catch(() => {});
        resolvePromise([
          {
            target: 'render',
            rule: 'render-harness',
            message: `Worker thread error: ${err.message}`,
          },
        ]);
      }
    });

    worker.on('exit', (code: number) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        if (code !== 0) {
          resolvePromise([
            {
              target: 'render',
              rule: 'render-crash',
              message: `Worker thread exited prematurely with code ${code}.`,
            },
          ]);
        }
      }
    });
  });
}
