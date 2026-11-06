import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { Service, MemStore, DownloadPublisher } from '../dist/index.js';

const DOC = { name: 'SelectionDS', tokens: [], components: [{ id: '1', name: 'Stepper' }, { id: '2', name: 'Badge' }] };

const source = (name) => `export default function ${name}() { return <div>${name}</div>; }\n`;

/** Records every author request; Stepper sessions also produce a derived StepperItem sibling. */
function recordingAuthor() {
  const calls = [];
  return {
    calls,
    async authorDesignSystem(req) {
      calls.push(req);
      const names = req.componentName === 'Stepper' && !req.compileOnly ? ['Stepper', 'StepperItem', 'StepperExample'] : [req.componentName];
      const components = Object.fromEntries(names.map((n) => [n, req.compileOnly ? req.existingSource : source(n)]));
      return {
        components,
        componentGroups: Object.fromEntries(names.map((n) => [n, n.endsWith('Example') ? 'examples' : 'components'])),
        artifacts: names.map((n) => ({ target: 'mitosis', fileName: `${n}.lite.tsx`, code: components[n] })),
        newTokens: [],
      };
    },
  };
}

function makeService(author) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-selection-'));
  const store = new MemStore();
  const svc = new Service(store, author, [new DownloadPublisher(store)], { extractionsDir: path.join(tmpDir, 'extractions') });
  return { svc, store, cleanup: () => fs.rmSync(tmpDir, { recursive: true, force: true }) };
}

async function waitTerminal(svc, jobId) {
  for (let i = 0; i < 100; i++) {
    const job = await svc.getJob(jobId);
    if (['succeeded', 'partially_succeeded', 'failed'].includes(job.status)) return job;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error('job never reached a terminal state');
}

describe('selectedComponents & derived siblings (@supernova/api)', () => {
  it('rejects selected names that are not components of the document', async () => {
    const { svc, cleanup } = makeService(recordingAuthor());
    await assert.rejects(
      svc.submitExtraction({ document: DOC, selectedComponents: ['Stepper', 'Ghost'] }),
      (err) => err.code === 'INVALID_PAYLOAD' && /Ghost/.test(err.message)
    );
    cleanup();
  });

  it('records derived siblings, keeps them out of "removed", and resolves them in later runs', async () => {
    const author = recordingAuthor();
    const { svc, store, cleanup } = makeService(author);
    const first = await waitTerminal(svc, await svc.submitExtraction({ document: DOC }));
    assert.equal(first.status, 'succeeded');

    const snaps = await store.getComponentSnapshots('SelectionDS');
    assert.equal(snaps.StepperItem.derivedFrom, 'Stepper');
    assert.equal(snaps.StepperItem.sourceCode, source('StepperItem'));
    assert.ok(first.artifacts.some((a) => a.target === 'mitosis' && a.fileName === 'StepperItem.lite.tsx' && a.group === 'components'));

    const plan = await svc.submitSync({ document: DOC });
    assert.equal(plan.summary.removed, 0, 'a derived sibling is not a removed component');

    assert.equal(snaps.StepperExample.group, 'examples');
    const stepperDoc = first.artifacts.find((a) => a.target === 'docs' && a.fileName === 'stepper.md');
    assert.match(stepperDoc.code, /### `StepperItem`/);
    assert.doesNotMatch(stepperDoc.code, /StepperExample/);

    author.calls.length = 0;
    const second = await waitTerminal(svc, await svc.submitExtraction({ document: DOC }));
    const stepperCall = author.calls.find((c) => c.componentName === 'Stepper');
    assert.equal(stepperCall.compileOnly, true, 'unchanged components stay compile-only');
    assert.equal(stepperCall.siblingSources.StepperItem, source('StepperItem'));
    const lite = (job, file) => job.artifacts.find((a) => a.target === 'mitosis' && a.fileName === file);
    assert.equal(lite(second, 'StepperItem.lite.tsx')?.group, 'components', 'compile-only parent re-emits its siblings');
    assert.equal(lite(second, 'StepperExample.lite.tsx')?.group, 'examples');
    cleanup();
  });

  it('forces LLM authoring for selected components even when unchanged', async () => {
    const author = recordingAuthor();
    const { svc, cleanup } = makeService(author);
    await waitTerminal(svc, await svc.submitExtraction({ document: DOC }));

    author.calls.length = 0;
    const plan = await svc.submitSync({ document: DOC });
    await waitTerminal(svc, await svc.applySync(plan.syncId, { selectedComponents: ['stepper'] }));
    const byName = Object.fromEntries(author.calls.map((c) => [c.componentName, c]));
    assert.equal(byName.Stepper.compileOnly, false);
    assert.equal(byName.Badge.compileOnly, true);
    cleanup();
  });
});

describe('repair loop (@supernova/api)', () => {
  it('passes failed sibling drafts to the next attempt', async () => {
    const calls = [];
    const author = {
      async authorDesignSystem(req) {
        calls.push(req);
        if (calls.length === 1) {
          const err = new Error('[StepperItem][lint] too long');
          err.partialComponents = { Stepper: 'stepper draft', StepperItem: 'item draft' };
          throw err;
        }
        return { components: { Stepper: 'ok' }, componentGroups: { Stepper: 'components' }, artifacts: [], newTokens: [] };
      },
    };
    const { svc, cleanup } = makeService(author);
    await waitTerminal(svc, await svc.submitExtraction({ document: { name: 'RepairDS', tokens: [], components: [{ id: '1', name: 'Stepper' }] } }));
    assert.equal(calls.length, 2);
    assert.equal(calls[0].siblingDrafts, undefined);
    assert.equal(calls[1].existingSource, 'stepper draft');
    assert.deepEqual(calls[1].siblingDrafts, { StepperItem: 'item draft' });
    assert.deepEqual(calls[1].repairErrors, ['[StepperItem][lint] too long']);
    cleanup();
  });
});
