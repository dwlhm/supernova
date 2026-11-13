import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileLibrary, TARGETS } from './compile-library.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const libraryDir = path.resolve(rootDir, 'library');

test('compile-library.mjs compiles root src/*.lite.tsx into standalone library/* packages and copies tokens', async () => {
  const res = await compileLibrary({ rootDir, quiet: true });
  assert.ok(res.count > 40, `expected >40 components compiled, got ${res.count}`);

  for (const target of TARGETS) {
    const pkgJson = JSON.parse(await fs.readFile(path.join(libraryDir, target, 'package.json'), 'utf-8'));
    assert.equal(pkgJson.name, `@komerce-design/${target}`);
    const stat = await fs.stat(path.join(libraryDir, target, 'dist'));
    assert.ok(stat.isDirectory(), `expected library/${target}/dist directory to exist`);
  }

  const reactBtn = await fs.readFile(path.join(libraryDir, 'react/dist/Button.tsx'), 'utf-8');
  assert.ok(reactBtn.length > 0, 'expected non-empty library/react/dist/Button.tsx');

  const vueBtn = await fs.readFile(path.join(libraryDir, 'vue3/dist/Button.vue'), 'utf-8');
  assert.ok(vueBtn.length > 0, 'expected non-empty library/vue3/dist/Button.vue');

  const svelteBtn = await fs.readFile(path.join(libraryDir, 'svelte/dist/Button.svelte'), 'utf-8');
  assert.ok(svelteBtn.length > 0, 'expected non-empty library/svelte/dist/Button.svelte');

  const vue2Btn = await fs.readFile(path.join(libraryDir, 'vue2/dist/Button.vue'), 'utf-8');
  assert.ok(vue2Btn.length > 0, 'expected non-empty library/vue2/dist/Button.vue');

  const angularBtn = await fs.readFile(path.join(libraryDir, 'angular/dist/Button.ts'), 'utf-8');
  assert.ok(angularBtn.length > 0, 'expected non-empty library/angular/dist/Button.ts');

  for (const target of TARGETS) {
    const indexContent = await fs.readFile(path.join(libraryDir, target, 'dist/index.ts'), 'utf-8');
    assert.ok(indexContent.includes('Button'), `expected library/${target}/dist/index.ts to export Button`);
    assert.ok(indexContent.includes("export * from './utils.ts'"), `expected library/${target}/dist/index.ts to re-export utils.ts`);
    if (target === 'react' || target === 'vue3') {
      assert.ok(indexContent.includes("export * from './runtime.ts'"), `expected library/${target}/dist/index.ts to re-export runtime.ts`);
      const runtimeContent = await fs.readFile(path.join(libraryDir, target, 'dist/runtime.ts'), 'utf-8');
      assert.ok(runtimeContent.includes('useFormField'), `expected library/${target}/dist/runtime.ts to define useFormField`);
    }
  }

  for (const tokenFile of ['tokens.json', 'theme.css', 'tokens.css', 'tokens.ts']) {
    const stat = await fs.stat(path.join(libraryDir, 'tokens/dist', tokenFile));
    assert.ok(stat.isFile(), `expected library/tokens/dist/${tokenFile} to exist`);
  }
});
