import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const compileScript = path.resolve(rootDir, 'scripts/compile.mjs');
const distDir = path.resolve(rootDir, 'dist');

test('ds-repo compile.mjs compiles .lite.tsx into all 5 target frameworks and copies tokens', async () => {
  const { stdout } = await execFileAsync(process.execPath, [compileScript], {
    cwd: rootDir,
  });
  assert.match(stdout, /Compiled \d+ components across 5 frameworks/);

  for (const target of ['react', 'vue3', 'svelte', 'vue2', 'angular']) {
    const stat = await fs.stat(path.join(distDir, target));
    assert.ok(stat.isDirectory(), `expected dist/${target} directory to exist`);
  }

  // Verify specific compiled component outputs
  const reactBtn = await fs.readFile(path.join(distDir, 'react/Button.tsx'), 'utf-8');
  assert.ok(reactBtn.length > 0, 'expected non-empty dist/react/Button.tsx');

  const vueBtn = await fs.readFile(path.join(distDir, 'vue3/Button.vue'), 'utf-8');
  assert.ok(vueBtn.length > 0, 'expected non-empty dist/vue3/Button.vue');

  const svelteBtn = await fs.readFile(path.join(distDir, 'svelte/Button.svelte'), 'utf-8');
  assert.ok(svelteBtn.length > 0, 'expected non-empty dist/svelte/Button.svelte');

  const vue2Btn = await fs.readFile(path.join(distDir, 'vue2/Button.vue'), 'utf-8');
  assert.ok(vue2Btn.length > 0, 'expected non-empty dist/vue2/Button.vue');

  const angularBtn = await fs.readFile(path.join(distDir, 'angular/Button.ts'), 'utf-8');
  assert.ok(angularBtn.length > 0, 'expected non-empty dist/angular/Button.ts');

  // Verify all 5 framework barrel indexes
  for (const target of ['react', 'vue3', 'svelte', 'vue2', 'angular']) {
    const indexContent = await fs.readFile(path.join(distDir, target, 'index.ts'), 'utf-8');
    assert.ok(indexContent.includes('Button'), `expected dist/${target}/index.ts to export Button`);
    assert.ok(indexContent.includes("export * from './utils.ts'"), `expected dist/${target}/index.ts to re-export utils.ts`);
  }

  // Verify tokens copied
  for (const tokenFile of ['tokens.json', 'theme.css', 'tokens.css', 'tokens.ts']) {
    const stat = await fs.stat(path.join(distDir, 'tokens', tokenFile));
    assert.ok(stat.isFile(), `expected dist/tokens/${tokenFile} to exist`);
  }
});
