import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  buildAndSyncWorkspaceLocal,
  DevMockAuthor,
  inspectComponentLocal,
  loadProjectKnowledge,
  LocalWorkspacePublisher,
  MemStore,
  parseSyncArgs,
  recordComponentKnowledgeRule,
  regenerateComponentLocal,
  Service,
} from '../dist/index.js';

describe('Local-First Workflow (LocalWorkspacePublisher & regenerateComponentLocal)', () => {
  it('parseSyncArgs parses file path, --replay, and --components flags', () => {
    assert.deepEqual(parseSyncArgs(['./figma.json', '--components', 'Button,Badge']), {
      filePath: './figma.json',
      selectedComponents: ['Button', 'Badge'],
    });
    assert.deepEqual(parseSyncArgs(['--replay']), {
      replayFixture: 'latest',
    });
    assert.deepEqual(parseSyncArgs(['--replay=abc-123', '--components=Tabs']), {
      replayFixture: 'abc-123',
      selectedComponents: ['Tabs'],
    });
  });

  it('publishes universal sources, tokens, and docs directly to local workspace without GitHub', async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-local-pub-'));
    const docsDir = path.join(tmpRoot, 'apps', 'docs');
    fs.mkdirSync(path.join(docsDir, 'components'), { recursive: true });
    // Protected catalog index.md should not be overwritten
    fs.writeFileSync(path.join(docsDir, 'components', 'index.md'), '# Catalog\n<ComponentCatalog />\n', 'utf8');

    const store = new MemStore();
    const localPub = new LocalWorkspacePublisher(tmpRoot, { store, docsDir, compileLibrary: false });
    const svc = new Service(store, new DevMockAuthor(), [localPub], {
      extractionsDir: path.join(tmpRoot, 'var', 'extractions'),
      docsDir,
    });

    const plan = await svc.submitSync({
      document: {
        name: 'LocalDS',
        tokens: [{ name: '🌱 Semantic/color/primary', type: 'color', value: '#2563eb' }],
        components: [{ id: '1', name: 'Button', node: { id: '1', name: 'Button', type: 'COMPONENT' } }],
      },
      targets: ['mitosis'],
      publishers: ['local'],
    });

    const jobId = await svc.applySync(plan.syncId, {
      targets: ['mitosis'],
      publishers: ['local'],
    });

    await new Promise((resolve, reject) => {
      svc.subscribeJobEvents(jobId, (ev) => {
        if (ev.eventType === 'job_completed') resolve();
        if (ev.eventType === 'job_failed') reject(new Error(ev.error));
      }).then(({ job }) => {
        if (job.status === 'succeeded') resolve();
      });
    });

    const job = await svc.getJob(jobId);
    assert.equal(job.status, 'succeeded');
    assert.equal(job.publishResults?.workspaceDir, tmpRoot);
    assert.ok((job.publishResults?.filesWritten ?? 0) >= 6);

    assert.ok(fs.existsSync(path.join(tmpRoot, 'src', 'components', 'Button.lite.tsx')));
    assert.ok(fs.existsSync(path.join(tmpRoot, 'src', 'components', 'utils.ts')));
    assert.ok(fs.existsSync(path.join(tmpRoot, 'src', 'tokens', 'tokens.css')));
    assert.ok(fs.existsSync(path.join(docsDir, 'components', 'button.md')));
    assert.ok(
      fs.readFileSync(path.join(docsDir, 'components', 'index.md'), 'utf8').includes('<ComponentCatalog />'),
      'catalog index.md must be preserved'
    );

    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('regenerateComponentLocal re-authors component with feedback notes and updates local disk + snapshot', async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-local-regen-'));
    const compDir = path.join(tmpRoot, 'src', 'components');
    const docsDir = path.join(tmpRoot, 'apps', 'docs');
    fs.mkdirSync(compDir, { recursive: true });
    fs.mkdirSync(path.join(docsDir, 'components'), { recursive: true });
    fs.writeFileSync(
      path.join(compDir, 'Button.lite.tsx'),
      'export default function Button() { return <button class="old">Click</button>; }',
      'utf8'
    );

    const store = new MemStore();
    let capturedReq = null;
    const customAuthor = {
      async authorDesignSystem(req) {
        capturedReq = req;
        const updatedCode = 'export default function Button() { return <button class="bg-destructive">Click</button>; }';
        return {
          components: {
            Button: updatedCode,
            ButtonIcon: 'export default function ButtonIcon() { return <span />; }',
          },
          componentGroups: { Button: 'components', ButtonIcon: 'components' },
          artifacts: [],
          newTokens: [],
        };
      },
    };

    const res = await regenerateComponentLocal({
      store,
      author: customAuthor,
      workspaceDir: tmpRoot,
      docsDir,
      componentName: 'Button',
      notes: 'use semantic bg-destructive on hover',
      compileLibrary: false,
    });

    assert.equal(res.componentName, 'Button');
    assert.deepEqual(res.updatedComponents.sort(), ['Button', 'ButtonIcon']);
    assert.equal(capturedReq.feedbackNotes, 'use semantic bg-destructive on hover');
    assert.match(capturedReq.existingSource, /class="old"/);

    const diskCode = fs.readFileSync(path.join(compDir, 'Button.lite.tsx'), 'utf8');
    assert.match(diskCode, /bg-destructive/);
    assert.ok(fs.existsSync(path.join(compDir, 'ButtonIcon.lite.tsx')));
    assert.ok(fs.existsSync(path.join(docsDir, 'components', 'button.md')));

    const snap = await store.getComponentSnapshot('Design System', 'Button');
    assert.match(snap?.sourceCode || '', /bg-destructive/);

    await assert.rejects(
      () =>
        regenerateComponentLocal({
          store,
          author: customAuthor,
          workspaceDir: tmpRoot,
          componentName: '../evil',
        }),
      /Invalid component name/
    );

    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('regenerateComponentLocal on compound parent (Table) passes all descendant Table* and TableExample sources in siblingDrafts and updates modified descendants on disk', async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-compound-regen-'));
    const compDir = path.join(tmpRoot, 'src', 'components');
    const exDir = path.join(tmpRoot, 'src', 'examples');
    const docsDir = path.join(tmpRoot, 'apps', 'docs');
    fs.mkdirSync(compDir, { recursive: true });
    fs.mkdirSync(exDir, { recursive: true });
    fs.mkdirSync(path.join(docsDir, 'components'), { recursive: true });

    fs.writeFileSync(path.join(compDir, 'Table.lite.tsx'), 'export default function Table(props: any) { return <table>{props.children}</table>; }', 'utf8');
    fs.writeFileSync(path.join(compDir, 'TableBodyRow.lite.tsx'), 'export default function TableBodyRow(props: any) { return <tr>{props.children}</tr>; }', 'utf8');
    fs.writeFileSync(path.join(compDir, 'TableBodyCell.lite.tsx'), 'export default function TableBodyCell(props: any) { return <td class="p-2">{props.children}</td>; }', 'utf8');
    fs.writeFileSync(path.join(compDir, 'Button.lite.tsx'), 'export default function Button() { return <button />; }', 'utf8');
    fs.writeFileSync(path.join(exDir, 'TableExample.lite.tsx'), "import Table from '../components/Table.lite';\nimport TableBodyRow from '../components/TableBodyRow.lite';\nimport TableBodyCell from '../components/TableBodyCell.lite';\nexport default function TableExample() { return <Table><TableBodyRow><TableBodyCell>A</TableBodyCell></TableBodyRow></Table>; }", 'utf8');

    const store = new MemStore();
    let capturedReq = null;
    const compoundAuthor = {
      async authorDesignSystem(req) {
        capturedReq = req;
        return {
          components: {
            Table: 'export default function Table(props: any) { return <table class="w-full">{props.children}</table>; }',
            TableBodyCell: 'export default function TableBodyCell(props: any) { return <td class="px-4 py-3">{props.children}</td>; }',
            TableExample: 'export default function TableExample() { return <div />; }',
          },
          componentGroups: {
            Table: 'components',
            TableBodyCell: 'components',
            TableExample: 'examples',
          },
          artifacts: [],
          newTokens: [],
        };
      },
    };

    const res = await regenerateComponentLocal({
      store,
      author: compoundAuthor,
      workspaceDir: tmpRoot,
      docsDir,
      componentName: 'Table',
      notes: 'increase cell padding across all table body cells to px-4 py-3',
      compileLibrary: false,
    });

    assert.deepEqual(Object.keys(capturedReq.siblingDrafts).sort(), [
      'TableBodyCell',
      'TableBodyRow',
      'TableExample',
    ]);
    assert.ok(!('Button' in capturedReq.siblingDrafts), 'unrelated leaf primitives must not pollute siblingDrafts');
    assert.deepEqual(res.updatedComponents.sort(), ['Table', 'TableBodyCell', 'TableExample']);
    assert.match(fs.readFileSync(path.join(compDir, 'TableBodyCell.lite.tsx'), 'utf8'), /px-4 py-3/);
    assert.ok(fs.existsSync(path.join(exDir, 'TableExample.lite.tsx')));

    // Verify knowledge base persisted the rule
    const kb = loadProjectKnowledge(tmpRoot);
    assert.deepEqual(kb.components.Table?.rules, [
      'increase cell padding across all table body cells to px-4 py-3',
    ]);

    // Now simulate a subsequent Figma sync where Table spec changed:
    // job-runner must pass live disk existingSource, siblingDrafts (attempt 1), AND persisted knowledge rules!
    let syncCapturedReq = null;
    const syncAuthor = {
      async authorDesignSystem(req) {
        syncCapturedReq = req;
        return {
          components: {
            Table: req.existingSource,
            TableBodyCell: req.siblingDrafts?.TableBodyCell || '',
            TableExample: req.siblingDrafts?.TableExample || '',
          },
          componentGroups: {
            Table: 'components',
            TableBodyCell: 'components',
            TableExample: 'examples',
          },
          artifacts: [],
          newTokens: [],
        };
      },
    };

    const localPub = new LocalWorkspacePublisher(tmpRoot, { store, docsDir, compileLibrary: false });
    const svc = new Service(store, syncAuthor, [localPub], {
      extractionsDir: path.join(tmpRoot, 'var', 'extractions'),
      docsDir,
      workspaceDir: tmpRoot,
    });

    const plan = await svc.submitSync({
      document: {
        name: 'Design System',
        tokens: [],
        components: [
          {
            id: 'table-v2',
            name: 'Table',
            description: 'Updated table in Figma',
            node: { id: 'table-v2', name: 'Table', type: 'COMPONENT' },
          },
        ],
      },
      targets: ['mitosis'],
      publishers: ['local'],
    });

    const jobId = await svc.applySync(plan.syncId, {
      targets: ['mitosis'],
      publishers: ['local'],
    });

    await new Promise((resolve, reject) => {
      svc.subscribeJobEvents(jobId, (ev) => {
        if (ev.eventType === 'job_completed') resolve();
        if (ev.eventType === 'job_failed') reject(new Error(ev.error));
      }).then(({ job }) => {
        if (job.status === 'succeeded') resolve();
      });
    });

    assert.ok(syncCapturedReq, 'sync invoked author with live workspace context');
    assert.match(syncCapturedReq.existingSource, /class="w-full"/, 'uses live disk Table.lite.tsx');
    assert.match(
      syncCapturedReq.siblingDrafts?.TableBodyCell || '',
      /px-4 py-3/,
      'passes live disk TableBodyCell in siblingDrafts on attempt 1 of sync'
    );
    assert.match(
      syncCapturedReq.feedbackNotes || '',
      /increase cell padding across all table body cells to px-4 py-3/,
      'injects persisted src/knowledge.json rules during sync so past fixes never regress'
    );

    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('inspectComponentLocal and buildAndSyncWorkspaceLocal synchronize manual agent edits with docs and snapshots', async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-manual-sync-'));
    const compDir = path.join(tmpRoot, 'src', 'components');
    const docsDir = path.join(tmpRoot, 'apps', 'docs');
    const extractionsDir = path.join(tmpRoot, 'var', 'extractions');
    fs.mkdirSync(compDir, { recursive: true });
    fs.mkdirSync(path.join(docsDir, 'components'), { recursive: true });
    fs.mkdirSync(extractionsDir, { recursive: true });

    fs.writeFileSync(
      path.join(extractionsDir, 'latest.json'),
      JSON.stringify({
        name: 'Design System',
        tokens: [],
        components: [
          {
            id: 'tooltip-1',
            name: 'Tooltip',
            properties: {
              'Text content#3499:0': { type: 'TEXT', defaultValue: 'Label' },
              Position: { type: 'VARIANT', defaultValue: 'Top', variantOptions: ['Top', 'Bottom', 'Left', 'Right'] },
            },
            node: { id: 'tooltip-1', name: 'Tooltip', type: 'COMPONENT_SET' },
          },
        ],
      }),
      'utf8'
    );

    fs.writeFileSync(
      path.join(compDir, 'Tooltip.lite.tsx'),
      `import { useDefaultProps } from '@builder.io/mitosis';
export interface TooltipProps {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  open?: boolean;
  children?: any;
}
export default function Tooltip(props: TooltipProps) {
  useDefaultProps({ text: 'Label', position: 'top', trigger: 'hover' });
  return <span>{props.children}<span>{props.text}</span></span>;
}`,
      'utf8'
    );

    recordComponentKnowledgeRule(tmpRoot, 'Tooltip', 'Tooltip wraps children as trigger and renders text inside bubble');
    const store = new MemStore();

    const inspected = await inspectComponentLocal({
      store,
      workspaceDir: tmpRoot,
      extractionsDir,
      componentName: 'Tooltip',
    });

    assert.equal(inspected.componentName, 'Tooltip');
    assert.ok(inspected.knowledgeRules.some((r) => r.includes('Tooltip wraps children as trigger')));
    assert.ok(
      inspected.blueprint?.canonicalProps.some((p) => p.name === 'text' && p.defaultValue === 'Label'),
      'normalizes Figma Text content property to text'
    );

    const synced = await buildAndSyncWorkspaceLocal({
      store,
      workspaceDir: tmpRoot,
      extractionsDir,
      docsDir,
      componentNames: ['Tooltip'],
      compileLibrary: false,
    });

    assert.deepEqual(synced.syncedComponents, ['Tooltip']);
    assert.equal(synced.docsUpdated, 1);

    const tooltipDoc = fs.readFileSync(path.join(docsDir, 'components', 'tooltip.md'), 'utf8');
    assert.match(tooltipDoc, /\| `text` \| `string` \| `'Label'` \|/);
    assert.match(tooltipDoc, /\| `trigger` \| `'hover' \\\| 'click'` \| `'hover'` \|/);
    assert.match(tooltipDoc, /\| `open` \| `boolean` \|/);

    const snap = await store.getComponentSnapshot('Design System', 'Tooltip');
    assert.match(snap?.sourceCode || '', /trigger\?: 'hover' \| 'click'/);

    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });
});
