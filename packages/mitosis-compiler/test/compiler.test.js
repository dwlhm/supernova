import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { compileMitosis, validateArtifact } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = resolve(__dirname, '../dist/cli.js');

const VALID_COMPONENT_SOURCE = `
import { useStore } from '@builder.io/mitosis';

export interface ButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  const state = useStore({
    count: 0,
    increment() {
      state.count += 1;
    },
  });

  return (
    <button
      disabled={props.disabled}
      onClick={() => {
        state.increment();
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {props.label || 'Default Button'} - {state.count}
    </button>
  );
}
`;

function runCliSubprocess(payload) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [cliPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', reject);

    child.on('close', (exitCode) => {
      try {
        const response = JSON.parse(stdout);
        resolvePromise({ exitCode, response, stderr });
      } catch (err) {
        reject(
          new Error(
            `Failed to parse CLI stdout as JSON: ${stdout}\nStderr: ${stderr}\nError: ${err.message}`
          )
        );
      }
    });

    child.stdin.write(typeof payload === 'string' ? payload : JSON.stringify(payload));
    child.stdin.end();
  });
}

describe('Mitosis Compiler', () => {
  it('compiles a valid Mitosis component to all 5 target frameworks with correct file extensions when explicitly requested', async () => {
    const response = await compileMitosis({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
      targets: ['react', 'svelte', 'vue3', 'vue2', 'angular'],
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.errors.length, 0);
    assert.strictEqual(response.artifacts.length, 5);

    const expectedTargets = [
      { target: 'react', ext: '.tsx' },
      { target: 'svelte', ext: '.svelte' },
      { target: 'vue3', ext: '.vue' },
      { target: 'vue2', ext: '.vue' },
      { target: 'angular', ext: '.ts' },
    ];

    for (const expected of expectedTargets) {
      const artifact = response.artifacts.find((a) => a.target === expected.target);
      assert.ok(artifact, `Artifact for target ${expected.target} should exist`);
      assert.strictEqual(artifact.fileName, `Button${expected.ext}`);
      assert.strictEqual(typeof artifact.code, 'string');
      assert.ok(
        artifact.code.trim().length > 0,
        `Artifact for target ${expected.target} code should not be empty`
      );
    }
  });

  it('defaults to mitosis target returning .lite.tsx artifact when targets is omitted or empty', async () => {
    // When targets is omitted
    const responseOmitted = await compileMitosis({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
    });

    assert.strictEqual(responseOmitted.success, true);
    assert.strictEqual(responseOmitted.errors.length, 0);
    assert.strictEqual(responseOmitted.artifacts.length, 1);
    assert.strictEqual(responseOmitted.artifacts[0].target, 'mitosis');
    assert.strictEqual(responseOmitted.artifacts[0].fileName, 'Button.lite.tsx');
    assert.strictEqual(responseOmitted.artifacts[0].code, VALID_COMPONENT_SOURCE);

    // When targets is empty array
    const responseEmpty = await compileMitosis({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
      targets: [],
    });

    assert.strictEqual(responseEmpty.success, true);
    assert.strictEqual(responseEmpty.errors.length, 0);
    assert.strictEqual(responseEmpty.artifacts.length, 1);
    assert.strictEqual(responseEmpty.artifacts[0].target, 'mitosis');
    assert.strictEqual(responseEmpty.artifacts[0].fileName, 'Button.lite.tsx');
    assert.strictEqual(responseEmpty.artifacts[0].code, VALID_COMPONENT_SOURCE);
  });

  it('compiles with explicit mitosis target framework', async () => {
    const response = await compileMitosis({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
      targets: ['mitosis'],
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.errors.length, 0);
    assert.strictEqual(response.artifacts.length, 1);
    assert.strictEqual(response.artifacts[0].target, 'mitosis');
    assert.strictEqual(response.artifacts[0].fileName, 'Button.lite.tsx');
    assert.strictEqual(response.artifacts[0].code, VALID_COMPONENT_SOURCE);
  });

  it('respects target filtering when a subset of targets is requested', async () => {
    const response = await compileMitosis({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
      targets: ['react', 'svelte'],
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.errors.length, 0);
    assert.strictEqual(response.artifacts.length, 2);

    const targets = response.artifacts.map((a) => a.target);
    assert.deepStrictEqual(targets, ['react', 'svelte']);
    assert.strictEqual(response.artifacts[0].fileName, 'Button.tsx');
    assert.strictEqual(response.artifacts[1].fileName, 'Button.svelte');
  });

  it('handles invalid/malformed JSX input gracefully without throwing', async () => {
    const response = await compileMitosis({
      componentName: 'BrokenButton',
      source: 'export default function Broken() { return <button>>>unclosed; }',
    });

    assert.strictEqual(response.success, false);
    assert.strictEqual(response.artifacts.length, 0);
    assert.ok(Array.isArray(response.errors));
    assert.ok(response.errors.length > 0);
    assert.strictEqual(response.errors[0].target, 'mitosis');
    assert.ok(
      typeof response.errors[0].message === 'string' && response.errors[0].message.length > 0
    );
  });

  it('executes CLI via subprocess stdin/stdout round-trip for success and failure', async () => {
    // 4a. Success round-trip with default mitosis target
    const defaultResult = await runCliSubprocess({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
    });

    assert.strictEqual(defaultResult.exitCode, 0);
    assert.strictEqual(defaultResult.response.success, true);
    assert.strictEqual(defaultResult.response.artifacts.length, 1);
    assert.strictEqual(defaultResult.response.artifacts[0].target, 'mitosis');
    assert.strictEqual(defaultResult.response.artifacts[0].fileName, 'Button.lite.tsx');
    assert.strictEqual(defaultResult.response.artifacts[0].code, VALID_COMPONENT_SOURCE);

    // 4b. Success round-trip with explicit targets
    const successResult = await runCliSubprocess({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
      targets: ['react', 'vue3'],
    });

    assert.strictEqual(successResult.exitCode, 0);
    assert.strictEqual(successResult.response.success, true);
    assert.strictEqual(successResult.response.artifacts.length, 2);
    assert.strictEqual(successResult.response.artifacts[0].target, 'react');
    assert.strictEqual(successResult.response.artifacts[0].fileName, 'Button.tsx');
    assert.strictEqual(successResult.response.artifacts[1].target, 'vue3');
    assert.strictEqual(successResult.response.artifacts[1].fileName, 'Button.vue');

    // 4c. Failure round-trip with invalid JSX
    const failureResult = await runCliSubprocess({
      componentName: 'Broken',
      source: '<<<malformed jsx>>>',
    });

    assert.strictEqual(failureResult.exitCode, 1);
    assert.strictEqual(failureResult.response.success, false);
    assert.strictEqual(failureResult.response.artifacts.length, 0);
    assert.ok(failureResult.response.errors.length > 0);
    assert.strictEqual(failureResult.response.errors[0].target, 'mitosis');

    // 4d. Failure round-trip with malformed JSON stdin
    const malformedJsonResult = await runCliSubprocess('{ invalid json');

    assert.strictEqual(malformedJsonResult.exitCode, 1);
    assert.strictEqual(malformedJsonResult.response.success, false);
    assert.strictEqual(malformedJsonResult.response.artifacts.length, 0);
    assert.ok(malformedJsonResult.response.errors.length > 0);
    assert.strictEqual(malformedJsonResult.response.errors[0].target, 'cli');
  });

  it('Vue 2 output contains lang="ts" and passes validation', async () => {
    const response = await compileMitosis({
      componentName: 'Button',
      source: VALID_COMPONENT_SOURCE,
      targets: ['vue2'],
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.errors.length, 0);
    assert.strictEqual(response.artifacts.length, 1);
    const vue2Artifact = response.artifacts[0];
    assert.ok(vue2Artifact.code.includes('<script lang="ts">'));
  });

  it('converts SVG attributes to kebab-case for Svelte, Vue 3, Vue 2, and Angular, while keeping camelCase for React', async () => {
    const SVG_COMPONENT_SOURCE = `
export default function SvgIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path strokeWidth="1.5" strokeLinecap="round" d="M0 0" />
    </svg>
  );
}
`;
    const response = await compileMitosis({
      componentName: 'SvgIcon',
      source: SVG_COMPONENT_SOURCE,
      targets: ['react', 'svelte', 'vue3', 'vue2', 'angular'],
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.errors.length, 0);
    assert.strictEqual(response.artifacts.length, 5);

    const reactArt = response.artifacts.find((a) => a.target === 'react');
    const svelteArt = response.artifacts.find((a) => a.target === 'svelte');
    const vue3Art = response.artifacts.find((a) => a.target === 'vue3');
    const vue2Art = response.artifacts.find((a) => a.target === 'vue2');
    const angularArt = response.artifacts.find((a) => a.target === 'angular');

    assert.ok(reactArt.code.includes('strokeWidth="1.5"'));
    assert.ok(!reactArt.code.includes('stroke-width="1.5"'));

    assert.ok(svelteArt.code.includes('stroke-width="1.5"'));
    assert.ok(vue3Art.code.includes('stroke-width="1.5"'));
    assert.ok(vue2Art.code.includes('stroke-width="1.5"'));
    assert.ok(angularArt.code.includes('stroke-width="1.5"'));
  });

  it('validates invalid target syntax and triggers errors with rule: "target-invalid"', async () => {
    // Svelte
    const svelteErrors = await validateArtifact({
      target: 'svelte',
      fileName: 'Bad.svelte',
      code: '<script>let a: = ;</script><div>bad</div>',
    });
    assert.ok(svelteErrors.length > 0);
    assert.strictEqual(svelteErrors[0].target, 'svelte');
    assert.strictEqual(svelteErrors[0].rule, 'target-invalid');

    // Vue 3
    const vue3Errors = await validateArtifact({
      target: 'vue3',
      fileName: 'Bad.vue',
      code: '<template><div>{{ unclosed</template>',
    });
    assert.ok(vue3Errors.length > 0);
    assert.strictEqual(vue3Errors[0].target, 'vue3');
    assert.strictEqual(vue3Errors[0].rule, 'target-invalid');

    // Vue 2
    const vue2Errors = await validateArtifact({
      target: 'vue2',
      fileName: 'Bad.vue',
      code: '<template><div>{{ unclosed</template>',
    });
    assert.ok(vue2Errors.length > 0);
    assert.strictEqual(vue2Errors[0].target, 'vue2');
    assert.strictEqual(vue2Errors[0].rule, 'target-invalid');

    // React
    const reactErrors = await validateArtifact({
      target: 'react',
      fileName: 'Bad.tsx',
      code: 'export default function Bad() { return <div><span></div>; }',
    });
    assert.ok(reactErrors.length > 0);
    assert.strictEqual(reactErrors[0].target, 'react');
    assert.strictEqual(reactErrors[0].rule, 'target-invalid');

    // Angular
    const angularErrors = await validateArtifact({
      target: 'angular',
      fileName: 'Bad.ts',
      code: 'export class Bad { x: number = ; }',
    });
    assert.ok(angularErrors.length > 0);
    assert.strictEqual(angularErrors[0].target, 'angular');
    assert.strictEqual(angularErrors[0].rule, 'target-invalid');
  });
});

describe('compileMitosis component name validation', () => {
  for (const bad of ['../../x', 'button', 'Bad-Name', 'A'.repeat(65)]) {
    it(`rejects componentName ${JSON.stringify(bad.slice(0, 12))}`, async () => {
      const res = await compileMitosis({ componentName: bad, source: VALID_COMPONENT_SOURCE, targets: ['react'] });
      assert.equal(res.success, false);
      assert.deepEqual(res.artifacts, []);
      assert.match(res.errors[0].message, /Invalid component name/);
    });
  }
});
