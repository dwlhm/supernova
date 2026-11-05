import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  getAuthorConfig,
  buildAgyAuthorPrompt,
  parseAgyAuthorOutput,
  runAuthorAgent,
} from '../dist/index.js';

function withEnv(overrides, fn) {
  const prev = {};
  for (const k of Object.keys(overrides)) {
    prev[k] = process.env[k];
    if (overrides[k] === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = overrides[k];
    }
  }
  const restore = () => {
    for (const [k, v] of Object.entries(prev)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  };
  try {
    const res = fn();
    if (res && typeof res.then === 'function') {
      return res.finally(restore);
    }
    restore();
    return res;
  } catch (err) {
    restore();
    throw err;
  }
}

function createMockAgyScript(dir, bodyJs) {
  const scriptPath = path.join(dir, `mock-agy-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`);
  fs.writeFileSync(scriptPath, `#!/usr/bin/env node\n${bodyJs}\n`, { mode: 0o755 });
  return scriptPath;
}

describe('Mitosis Author - Agy CLI Provider', () => {
  it('configures agy provider without requiring LLM_BASE_URL or LLM_API_KEY', () => {
    withEnv(
      {
        LLM_PROVIDER: 'agy',
        LLM_BASE_URL: undefined,
        LLM_API_KEY: undefined,
        LLM_MODEL: undefined,
        AGY_MODEL: undefined,
        AGY_BIN: undefined,
      },
      () => {
        const cfg = getAuthorConfig();
        assert.equal(cfg.provider, 'agy');
        assert.equal(cfg.model, 'gemini-4-argon-medium');
        assert.equal(cfg.agyBin, 'agy');
      }
    );

    withEnv(
      {
        LLM_PROVIDER: 'agy',
        LLM_MODEL: 'deepseek-v4.1-flash',
        AGY_MODEL: undefined,
      },
      () => {
        const cfg = getAuthorConfig();
        assert.equal(cfg.model, 'gemini-4-argon-medium');
      }
    );
  });

  it('rejects unsupported LLM_PROVIDER values', () => {
    withEnv({ LLM_PROVIDER: 'invalid-provider' }, () => {
      assert.throws(() => getAuthorConfig(), /Invalid LLM_PROVIDER "invalid-provider"/);
    });
  });

  it('embeds pre-compiled Figma blueprint and component tokens in buildAgyAuthorPrompt', () => {
    const spec = {
      name: 'Badge',
      description: 'Status indicator badge',
      properties: {
        Variant: { type: 'VARIANT', defaultValue: 'neutral', variantOptions: ['neutral', 'success'] },
      },
      node: {
        type: 'COMPONENT',
        layoutMode: 'HORIZONTAL',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        cornerRadius: 9999,
      },
    };
    const tokens = [{ name: '🌱 Semantic/color/badge/bg', type: 'color', value: '#f1f5f9' }];
    const prompt = buildAgyAuthorPrompt(
      { componentName: 'Badge', componentSpec: spec, tokens },
      ['Badge'],
      { Badge: spec }
    );
    assert.match(prompt, /PRE-COMPILED FIGMA BLUEPRINTS & COMPONENT DETAILS/);
    assert.match(prompt, /Pre-Compiled Details for Badge/);
    assert.match(prompt, /Component Tokens for Badge/);
    assert.match(prompt, /rounded-full/);
  });

  it('parses direct JSON, fenced JSON blocks, and agy result envelopes', () => {
    const direct = parseAgyAuthorOutput(
      JSON.stringify({ components: [{ componentName: 'Badge', group: 'components', source: 'code' }] })
    );
    assert.equal(direct.components.length, 1);
    assert.equal(direct.components[0].componentName, 'Badge');

    const fenced = parseAgyAuthorOutput(
      'Here is the output:\n```json\n{"result":{"components":[{"componentName":"Button","source":"btn"}]}}\n```'
    );
    assert.equal(fenced.components[0].componentName, 'Button');

    assert.throws(() => parseAgyAuthorOutput('not-json'), /Failed to parse agy JSON output/);
    assert.throws(() => parseAgyAuthorOutput('{"hello":"world"}'), /missing "components" array/);
  });

  it('authors a component end-to-end via agy edits and compiles across all 6 targets', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-author-'));
    try {
      const mockBin = createMockAgyScript(
        tmpDir,
        `
        const payload = {
          result: JSON.stringify({
            components: [
              {
                componentName: 'Badge',
                group: 'components',
                edits: [
                  { oldText: "label: 'Badge'", newText: "label: 'AgyBadge'" }
                ]
              }
            ],
            newTokens: [{ name: 'color/badge-accent', type: 'color', value: 'var(--color-primary)' }]
          })
        };
        process.stdout.write(JSON.stringify(payload));
        `
      );

      await withEnv({ LLM_PROVIDER: 'agy', AGY_BIN: mockBin, LLM_TIMEOUT: '30s' }, async () => {
        const res = await runAuthorAgent({
          componentName: 'Badge',
          existingSource: `import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BadgeProps {
  label?: string;
  className?: string;
}

export default function Badge(props: BadgeProps) {
  useDefaultProps({
    label: 'Badge',
    className: '',
  });

  return <span class={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', props.className)}>{props.label}</span>;
}
`,
        });

        assert.equal(res.success, true, res.error);
        assert.match(res.components['Badge'], /AgyBadge/);
        assert.equal(res.newTokens.length, 1);
        assert.ok(res.artifacts.some((a) => a.target === 'react'));
        assert.ok(res.artifacts.some((a) => a.target === 'vue3'));
        assert.ok(res.artifacts.some((a) => a.target === 'svelte'));
        assert.ok(res.artifacts.some((a) => a.target === 'angular'));
      });
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('handles dirty states: timeout, jetski errors, and preserves partialComponents on lint failure', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-dirty-'));
    try {
      const timeoutBin = createMockAgyScript(
        tmpDir,
        `setTimeout(() => process.exit(0), 5000);`
      );
      await withEnv({ LLM_PROVIDER: 'agy', AGY_BIN: timeoutBin, LLM_TIMEOUT: '80ms' }, async () => {
        const res = await runAuthorAgent({ componentName: 'Badge' });
        assert.equal(res.success, false);
        assert.match(res.error, /LLM authoring timed out after 80ms/);
      });

      const jetskiBin = createMockAgyScript(
        tmpDir,
        `process.stdout.write("jetski: permission denied\\n"); process.exit(0);`
      );
      await withEnv({ LLM_PROVIDER: 'agy', AGY_BIN: jetskiBin, LLM_TIMEOUT: '5s' }, async () => {
        const res = await runAuthorAgent({ componentName: 'Badge' });
        assert.equal(res.success, false);
        assert.match(res.error, /agy exited with code 0: jetski: permission denied/);
      });

      const invalidSourceBin = createMockAgyScript(
        tmpDir,
        `
        process.stdout.write(JSON.stringify({
          components: [{
            componentName: 'Badge',
            group: 'components',
            source: "import { useDefaultProps } from '@builder.io/mitosis';\\nimport { cn } from './utils';\\nexport interface BadgeProps { className?: string; }\\nexport default function Badge(props: BadgeProps) { useDefaultProps({ className: '' }); return <div class={cn('bg-[#ff0000]', props.className)}>Bad</div>; }"
          }]
        }));
        `
      );
      await withEnv({ LLM_PROVIDER: 'agy', AGY_BIN: invalidSourceBin, LLM_TIMEOUT: '10s' }, async () => {
        const res = await runAuthorAgent({ componentName: 'Badge' });
        assert.equal(res.success, false);
        assert.match(res.error, /Compilation failed/);
        assert.ok(res.components['Badge'], 'Preserves partialComponents for stateful repair');
      });
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
