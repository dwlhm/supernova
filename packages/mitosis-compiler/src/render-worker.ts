import { parentPort, workerData } from 'node:worker_threads';
import { renderCheckCore } from './render-core.js';
import type { RenderCheckOptions } from './render-core.js';

if (!parentPort) {
  throw new Error('render-worker must be run as a worker_thread');
}

const opts = workerData as RenderCheckOptions;

renderCheckCore(opts)
  .then((errors) => {
    parentPort!.postMessage({ success: true, errors });
  })
  .catch((err) => {
    parentPort!.postMessage({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  });
