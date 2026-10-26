#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const componentsDir = path.resolve(rootDir, 'src/components');
const iconsDir = path.resolve(rootDir, 'src/icons');
const tokensDir = path.resolve(rootDir, 'src/tokens');
const utilsSrcFile = path.resolve(componentsDir, 'utils.ts');
const distDir = path.resolve(rootDir, 'dist');

const TARGETS = ['react', 'vue3', 'svelte', 'vue2', 'angular'];

async function loadCompiler() {
  try {
    const mod = await import('@supernova/mitosis-compiler');
    return mod.compileMitosis;
  } catch {
    const fallback = path.resolve(rootDir, '../../packages/mitosis-compiler/dist/index.js');
    const mod = await import(fallback);
    return mod.compileMitosis;
  }
}

async function readDirSafe(dir) {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

async function collectLiteFiles() {
  const compFiles = (await readDirSafe(componentsDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => ({ name: f.replace(/\.lite\.tsx$/, ''), filePath: path.join(componentsDir, f) }));

  const iconFiles = (await readDirSafe(iconsDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => ({ name: f.replace(/\.lite\.tsx$/, ''), filePath: path.join(iconsDir, f) }));

  return [...compFiles, ...iconFiles].sort((a, b) => a.name.localeCompare(b.name));
}

async function copyFileSafe(src, dest) {
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
  } catch {
    // Ignore missing optional file
  }
}

async function main() {
  console.log('[compile] Multi-framework compilation for Supernova Design System...');
  await fs.mkdir(distDir, { recursive: true });

  const compileMitosis = await loadCompiler();
  const entries = await collectLiteFiles();

  for (const target of TARGETS) {
    await fs.mkdir(path.join(distDir, target), { recursive: true });
  }

  for (const { name, filePath } of entries) {
    const source = await fs.readFile(filePath, 'utf-8');
    const result = await compileMitosis({
      componentName: name,
      source,
      targets: TARGETS,
    });

    if (!result.success) {
      const msg = (result.errors || []).map((e) => `[${e.target}] ${e.message}`).join('; ');
      throw new Error(`Failed to compile ${name}: ${msg}`);
    }

    for (const art of result.artifacts) {
      const targetDir = path.join(distDir, art.target);
      await fs.writeFile(path.join(targetDir, art.fileName), art.code, 'utf-8');
    }
  }

  // Copy shared utils.ts into each target directory and dist/components
  for (const target of TARGETS) {
    await copyFileSafe(utilsSrcFile, path.join(distDir, target, 'utils.ts'));
  }
  await copyFileSafe(utilsSrcFile, path.join(distDir, 'components/utils.ts'));

  // Copy tokens into dist/tokens
  for (const tokenFile of ['tokens.json', 'theme.css', 'tokens.css', 'tokens.ts']) {
    await copyFileSafe(path.join(tokensDir, tokenFile), path.join(distDir, 'tokens', tokenFile));
  }

  // Generate framework barrel index files
  const reactExports = entries.map(({ name }) => `export { default as ${name} } from './${name}.tsx';`).join('\n');
  await fs.writeFile(path.join(distDir, 'react/index.ts'), `${reactExports}\nexport * from './utils.ts';\n`, 'utf-8');

  const vue3Exports = entries.map(({ name }) => `export { default as ${name} } from './${name}.vue';`).join('\n');
  await fs.writeFile(path.join(distDir, 'vue3/index.ts'), `${vue3Exports}\nexport * from './utils.ts';\n`, 'utf-8');

  const svelteExports = entries.map(({ name }) => `export { default as ${name} } from './${name}.svelte';`).join('\n');
  await fs.writeFile(path.join(distDir, 'svelte/index.ts'), `${svelteExports}\nexport * from './utils.ts';\n`, 'utf-8');

  // Ensure src/index.ts barrel exists for tsc root compilation
  const srcIndex = `export * from './components/utils.js';\nexport * from './tokens/tokens.js';\n`;
  await fs.writeFile(path.resolve(rootDir, 'src/index.ts'), srcIndex, 'utf-8');

  console.log(`[compile] Compiled ${entries.length} components across ${TARGETS.length} frameworks.`);
}

main().catch((err) => {
  console.error('[compile] Error:', err);
  process.exit(1);
});
