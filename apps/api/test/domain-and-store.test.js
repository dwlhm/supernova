import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  artifactPath,
  validComponentName,
  validFileName,
  normalizeComponentName,
  camelToKebab,
  hashComponentSpec,
  hashTokens,
  buildPullRequestBody,
  MemStore,
  SqliteStore,
} from '../dist/index.js';

describe('Domain Contracts & ArtifactPath (@supernova/api)', () => {
  it('maps published targets to canonical repository paths and rejects unsafe traversal or preview targets', () => {
    assert.equal(
      artifactPath({ target: 'mitosis', fileName: 'Button.lite.tsx', code: '', group: 'components' }),
      'src/components/Button.lite.tsx'
    );
    assert.equal(
      artifactPath({ target: 'mitosis', fileName: 'IconSearch.lite.tsx', code: '', group: 'icons' }),
      'src/icons/IconSearch.lite.tsx'
    );
    assert.equal(
      artifactPath({ target: 'mitosis', fileName: 'StepperExample.lite.tsx', code: '', group: 'examples' }),
      'src/examples/StepperExample.lite.tsx'
    );
    assert.equal(
      artifactPath({ target: 'tokens', fileName: 'theme.css', code: '' }),
      'src/tokens/theme.css'
    );
    assert.equal(
      artifactPath({ target: 'docs', fileName: 'button.md', code: '' }),
      'docs/components/button.md'
    );
    assert.equal(
      artifactPath({ target: 'docs', fileName: 'tokens.md', code: '' }),
      'docs/tokens.md'
    );

    assert.throws(
      () => artifactPath({ target: 'react', fileName: 'Button.tsx', code: '' }),
      /not published/
    );
    assert.throws(
      () => artifactPath({ target: 'figma', fileName: 'figma-document.json', code: '{}' }),
      /not published/
    );
    assert.throws(
      () => artifactPath({ target: 'mitosis', fileName: '../etc/passwd', code: '' }),
      /unsafe artifact path/
    );
  });

  it('normalizes component names and computes order-independent token hashes', () => {
    assert.equal(normalizeComponentName('button / primary#123'), 'ButtonPrimary');
    assert.equal(camelToKebab('ButtonPrimary'), 'button-primary');
    assert.equal(validComponentName('ButtonPrimary'), true);
    assert.equal(validComponentName('../evil'), false);
    assert.equal(validFileName('Button.lite.tsx'), true);
    assert.equal(validFileName('../Button.lite.tsx'), false);

    const h1 = hashTokens([
      { id: '1', name: 'b', type: 'color', value: '#000' },
      { id: '2', name: 'a', type: 'color', value: '#fff' },
    ]);
    const h2 = hashTokens([
      { id: '2', name: 'a', type: 'color', value: '#fff' },
      { id: '1', name: 'b', type: 'color', value: '#000' },
    ]);
    assert.equal(h1, h2);
    assert.ok(hashComponentSpec({ id: '1', name: 'Button' }).length === 64);

    const prBody = buildPullRequestBody({
      owner: 'dwlhm',
      repo: 'supernova',
      branchName: 'supernova/ds',
      prNumber: 13,
      commitSha: '4f329036a92313e4e7d6d54b2976c260ffd9ec6e',
      job: {
        id: 'job-13',
        documentName: 'Komerce DS',
        document: { name: 'Komerce DS', tokens: [{ id: 't1', name: 'color/primary', type: 'color', value: '#000' }], components: [] },
        targets: ['mitosis'],
        publishers: ['pull_request'],
        status: 'succeeded',
        tasks: [],
        components: [],
        artifacts: [
          { target: 'mitosis', fileName: 'AlertDialog.lite.tsx', code: '', group: 'components' },
          { target: 'mitosis', fileName: 'AlertDialogExample.lite.tsx', code: '', group: 'examples' },
        ],
        createdAt: '',
        updatedAt: '',
      },
    });
    assert.match(prBody, /https:\/\/dwlhm\.github\.io\/supernova\/pr-preview\/pr-13\/showcase/);
    assert.match(prBody, /https:\/\/dwlhm\.github\.io\/supernova\/pr-preview\/pr-13\/components\/alert-dialog/);
    assert.doesNotMatch(prBody, /AlertDialogExample/, 'examples are not listed as components');
    assert.match(prBody, /src\/components\/AlertDialog\.lite\.tsx/);
  });
});

describe('MemStore & SqliteStore (node:sqlite) (@supernova/api)', () => {
  for (const [label, createStore] of [
    ['MemStore', () => new MemStore()],
    ['SqliteStore (:memory:)', () => new SqliteStore(':memory:')],
  ]) {
    it(`${label} lists jobs by status and resolves the latest job publishing a branch`, async () => {
      const store = createStore();
      const base = {
        documentName: 'DS', document: { components: [] }, targets: [], publishers: [],
        tasks: [], components: [], artifacts: [], publishResults: {},
      };
      await store.save({ ...base, id: 'a', status: 'authoring', createdAt: '1', updatedAt: '2026-01-01' });
      await store.save({ ...base, id: 'b', status: 'succeeded', createdAt: '1', updatedAt: '2026-01-02',
        publishResults: { branchName: 'supernova/ds' } });
      await store.save({ ...base, id: 'c', status: 'succeeded', createdAt: '1', updatedAt: '2026-01-03',
        documentName: 'Newer', publishResults: { branchName: 'supernova/ds' } });
      assert.deepEqual(await store.listJobIdsByStatus(['authoring', 'publishing']), ['a']);
      assert.equal((await store.getLatestJobByBranch('supernova/ds')).documentName, 'Newer');
      assert.equal(await store.getLatestJobByBranch('missing'), null);
    });

    it(`${label} keeps every concurrent partial update of the same job (no lost updates)`, async () => {
      const store = createStore();
      const names = Array.from({ length: 24 }, (_, i) => `C${i}`);
      await store.save({
        id: 'job', documentName: 'DS', document: { components: [] }, targets: [], publishers: [], status: 'authoring',
        tasks: names.map((n) => ({ id: n, runId: 'r', componentName: n, status: 'queued', attemptCount: 0 })),
        components: names.map((name) => ({ name, status: 'pending' })), artifacts: [], createdAt: '1', updatedAt: '1',
      });
      await Promise.all(
        names.flatMap((n) => [
          store.updateComponent('job', { name: n, status: 'done' }),
          store.updateTask('job', { id: n, runId: 'r', componentName: n, status: 'ready', attemptCount: 1 }),
          store.saveArtifacts('job', [{ target: 'mitosis', fileName: `${n}.lite.tsx`, code: n }]),
        ])
      );
      const job = await store.get('job');
      assert.ok(job.components.every((c) => c.status === 'done'), 'component progress');
      assert.ok(job.tasks.every((t) => t.status === 'ready'), 'task state');
      assert.equal(job.artifacts.length, names.length, 'artifacts');
    });

    it(`${label} persists jobs, artifacts, zips, snapshots, and sync plans`, async () => {
      const store = createStore();
      const now = new Date().toISOString();
      const job = {
        id: 'job-1',
        documentName: 'DS',
        document: { name: 'DS', tokens: [], components: [] },
        targets: ['mitosis'],
        publishers: ['download'],
        status: 'queued',
        tasks: [],
        components: [{ name: 'Button', status: 'pending', group: 'components' }],
        artifacts: [],
        createdAt: now,
        updatedAt: now,
      };

      await store.save(job);
      await store.updateStatus('job-1', 'authoring');
      await store.saveArtifacts('job-1', [
        { target: 'mitosis', fileName: 'Button.lite.tsx', code: '<button />', group: 'components' },
      ]);
      await store.saveZip('job-1', new Uint8Array([1, 2, 3, 4]));

      const loaded = await store.get('job-1');
      assert.equal(loaded.status, 'authoring');
      assert.equal(loaded.artifacts.length, 1);

      const zip = await store.getZip('job-1');
      assert.deepEqual([...zip], [1, 2, 3, 4]);

      await store.saveComponentSnapshot({
        documentName: 'DS',
        componentName: 'Button',
        contentHash: 'abc',
        sourceCode: '<button />',
        updatedAt: now,
      });
      const snaps = await store.getComponentSnapshots('DS');
      assert.equal(snaps.Button.contentHash, 'abc');
    });
  }
});
