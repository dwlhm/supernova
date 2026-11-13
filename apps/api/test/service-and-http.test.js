import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  Service,
  MemStore,
  DevMockAuthor,
  DownloadPublisher,
  createRouter,
  readZipEntryPaths,
} from '../dist/index.js';
import { invokeRouter, waitForJobCompletion } from './helpers.js';

describe('Service & HTTP Router End-to-End (@komerce-design/api)', () => {
  it('handles health check, auth guard, extraction job, ZIP download, and incremental sync', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'komerce-api-test-'));
    const store = new MemStore();
    const author = new DevMockAuthor();
    const publishers = [new DownloadPublisher(store)];
    const svc = new Service(store, author, publishers, {
      extractionsDir: path.join(tmpDir, 'extractions'),
      docsDir: path.join(tmpDir, 'docs'),
    });

    const apiToken = 'secret-test-token';
    const router = createRouter(svc, { apiToken });

    try {
      // 1. Health endpoint (no auth required)
      const healthRes = await invokeRouter(router, { method: 'GET', url: '/v1/health' });
      assert.equal(healthRes.status, 200);
      assert.equal(healthRes.json().status, 'ok');

      // 2. Unauthorized request rejected
      const unauthRes = await invokeRouter(router, { method: 'POST', url: '/v1/extractions' });
      assert.equal(unauthRes.status, 401);

      // 3. Submit extraction
      const docPayload = {
        document: {
          name: 'Komerce DS',
          tokens: [
            { id: '1', name: 'color/primary/default', type: 'color', value: '#2563eb' },
          ],
          components: [
            {
              id: 'c1',
              name: 'Button',
              description: 'Primary button',
              properties: {
                variant: {
                  type: 'VARIANT',
                  defaultValue: 'primary',
                  variantOptions: ['primary', 'secondary'],
                },
              },
            },
          ],
        },
        targets: ['mitosis', 'react', 'vue3', 'svelte'],
        publishers: ['download'],
      };

      const extRes = await invokeRouter(router, {
        method: 'POST',
        url: '/v1/extractions',
        headers: { Authorization: `Bearer ${apiToken}` },
        body: docPayload,
      });
      assert.equal(extRes.status, 202);
      const { jobId } = extRes.json();
      assert.ok(jobId);

      // 4. Wait for completion
      const jobData = await waitForJobCompletion(router, jobId, apiToken);
      assert.equal(jobData.status, 'succeeded');
      assert.equal(jobData.publishResults.downloadUrl, `/v1/jobs/${jobId}/download`);

      // 5. Download ZIP and verify entries
      const zipRes = await invokeRouter(router, {
        method: 'GET',
        url: `/v1/jobs/${jobId}/download`,
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      assert.equal(zipRes.status, 200);
      const zipPaths = readZipEntryPaths(new Uint8Array(zipRes.buffer));
      assert.ok(zipPaths.includes('src/components/Button.lite.tsx'));
      assert.ok(zipPaths.includes('src/components/utils.ts'));
      assert.ok(zipPaths.includes('src/tokens/theme.css'));
      assert.ok(zipPaths.includes('docs/components/button.md'));
      assert.ok(zipPaths.includes('docs/tokens.md'));

      // 6. Verify AST-driven registry.ts and dark-mode tokens.css in docsDir
      const docsRegistry = fs.readFileSync(
        path.join(tmpDir, 'docs', '.vitepress', 'theme', 'preview', 'registry.ts'),
        'utf8'
      );
      assert.match(docsRegistry, /"variant":\s*\[\s*"primary",\s*"secondary"\s*\]/);
      assert.match(docsRegistry, /"booleans":\s*\[\s*"disabled"\s*\]/);
      assert.ok(!fs.existsSync(path.join(tmpDir, 'docs', 'src', 'components')));

      const docsTokensCss = fs.readFileSync(
        path.join(tmpDir, 'docs', '.vitepress', 'theme', 'tokens', 'tokens.css'),
        'utf8'
      );
      assert.match(docsTokensCss, /:root \{/);
      assert.match(docsTokensCss, /\.dark \{/);

      // 7. Submit incremental sync with identical document -> 1 unchanged component
      const syncRes = await invokeRouter(router, {
        method: 'POST',
        url: '/v1/syncs',
        headers: { Authorization: `Bearer ${apiToken}` },
        body: docPayload,
      });
      assert.equal(syncRes.status, 200);
      const syncPlan = syncRes.json();
      assert.equal(syncPlan.summary.unchanged, 1);
      assert.equal(syncPlan.summary.new, 0);
      assert.equal(syncPlan.summary.changed, 0);

      // 7. Apply sync plan
      const applyRes = await invokeRouter(router, {
        method: 'POST',
        url: `/v1/syncs/${syncPlan.syncId}/apply`,
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      assert.equal(applyRes.status, 202);
      const applyData = applyRes.json();
      const applyJob = await waitForJobCompletion(router, applyData.jobId, apiToken);
      assert.equal(applyJob.status, 'succeeded');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('passes repairErrors and partialComponents across retry attempts and handles GitHub PR webhooks', async () => {
    const store = new MemStore();
    const attempts = [];
    const flakyAuthor = {
      async authorDesignSystem(req) {
        attempts.push({
          existingSource: req.existingSource,
          repairErrors: req.repairErrors,
          feedbackNotes: req.feedbackNotes,
        });
        if (attempts.length === 1) {
          const err = new Error('[svelte] Did not expect a type annotation');
          err.partialComponents = { Badge: 'export default function Badge() { return <span />; }' };
          throw err;
        }
        const compName = req.componentName || 'Badge';
        const grp = compName.toLowerCase().includes('icon') ? 'icons' : 'components';
        return {
          components: { [compName]: `export default function ${compName}() { return <span />; }` },
          componentGroups: { [compName]: grp },
          artifacts: [
            {
              target: 'mitosis',
              fileName: `${compName}.lite.tsx`,
              code: `export default function ${compName}() { return <span />; }`,
              group: grp,
            },
          ],
          newTokens: [],
        };
      },
    };

    const comments = [];
    const requestedPaths = [];
    const committedArtifacts = [];
    const mockPrManager = {
      repoFullName() {
        return 'komerce/ds';
      },
      async getPullRequestBranch() {
        return 'komerce-design/ds';
      },
      async getFileContent(_owner, _repo, filePath) {
        requestedPaths.push(filePath);
        return 'export default function Badge() { return <div />; }';
      },
      async commitArtifacts(_owner, _repo, _branch, arts) {
        committedArtifacts.push(...arts);
        return 'deadbeef1234';
      },
      async createComment(_owner, _repo, _pr, comment) {
        comments.push(comment);
      },
    };

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-retry-test-'));
    const svc = new Service(
      store,
      flakyAuthor,
      [new DownloadPublisher(store)],
      { extractionsDir: tmpDir },
      mockPrManager
    );
    svc.setMaxRetries(2);

    const jobId = await svc.submitExtraction({
      document: {
        name: 'RetryDS',
        tokens: [],
        components: [{ id: '1', name: 'Badge' }],
      },
    });

    for (let i = 0; i < 40; i++) {
      const j = await svc.getJob(jobId);
      if (j.status === 'succeeded' || j.status === 'failed') break;
      await new Promise((r) => setTimeout(r, 20));
    }

    const finalJob = await svc.getJob(jobId);
    assert.equal(finalJob.status, 'succeeded');
    assert.equal(attempts.length, 2);
    assert.equal(attempts[1].existingSource, 'export default function Badge() { return <span />; }');
    assert.deepEqual(attempts[1].repairErrors, ['[svelte] Did not expect a type annotation']);

    const webhookEvent = (overrides = {}) =>
      JSON.stringify({
        action: 'created',
        issue: { number: 42, pull_request: {} },
        comment: { body: '/supernova regenerate Badge: make text bold', author_association: 'MEMBER' },
        repository: { owner: { login: 'komerce' }, name: 'ds' },
        sender: { login: 'developer', type: 'User' },
        ...overrides,
      });

    // Untrusted commenters and foreign repositories are ignored without side effects.
    const untrusted = svc.handleGitHubWebhook('issue_comment', webhookEvent({
      comment: { body: '/supernova regenerate Badge', author_association: 'NONE' },
    }));
    const foreign = svc.handleGitHubWebhook('issue_comment', webhookEvent({
      repository: { owner: { login: 'evil' }, name: 'ds' },
    }));
    assert.equal(untrusted.accepted, false);
    assert.equal(foreign.accepted, false);

    const accepted = svc.handleGitHubWebhook('issue_comment', webhookEvent());
    assert.equal(accepted.accepted, true);
    await accepted.completion;
    assert.equal(comments.length, 1);
    assert.match(comments[0], /Komerce Design successfully regenerated component \*\*Badge\*\*/);
    assert.ok(requestedPaths.includes('src/components/Badge.lite.tsx'));

    const iconAccepted = svc.handleGitHubWebhook(
      'issue_comment',
      webhookEvent({
        comment: { body: '/komerce regenerate IconTruckDelivery: adjust stroke', author_association: 'OWNER' },
      })
    );
    assert.equal(iconAccepted.accepted, true);
    await iconAccepted.completion;
    assert.ok(requestedPaths.includes('src/icons/IconTruckDelivery.lite.tsx'));
    assert.ok(
      committedArtifacts.some(
        (a) => a.fileName === 'IconTruckDelivery.lite.tsx' && a.group === 'icons'
      )
    );
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
