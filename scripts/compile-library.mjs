#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultRootDir = path.resolve(__dirname, '..');

export const TARGETS = ['react', 'vue3', 'svelte', 'vue2', 'angular'];

async function loadCompiler(rootDir) {
  try {
    return await import('@komerce-design/mitosis-compiler');
  } catch {
    const fallback = path.resolve(rootDir, 'packages/mitosis-compiler/dist/index.js');
    return await import(fallback);
  }
}

async function readDirSafe(dir) {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

async function collectLiteFiles(componentsDir, iconsDir) {
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

export async function compileLibrary({ rootDir = defaultRootDir, quiet = false } = {}) {
  const componentsDir = path.resolve(rootDir, 'src/components');
  const iconsDir = path.resolve(rootDir, 'src/icons');
  const tokensDir = path.resolve(rootDir, 'src/tokens');
  const utilsSrcFile = path.resolve(componentsDir, 'utils.ts');
  const libraryDir = path.resolve(rootDir, 'library');

  if (!quiet) {
    console.log('[compile-library] Compiling root src/ into library/{tokens,react,vue3,svelte,vue2,angular}...');
  }

  const {
    compileMitosis,
    getUtilsSource,
    getReactRuntimeSource,
    getVue3RuntimeSource,
  } = await loadCompiler(rootDir);
  const entries = await collectLiteFiles(componentsDir, iconsDir);

  for (const target of TARGETS) {
    await fs.mkdir(path.join(libraryDir, target, 'dist'), { recursive: true });
  }
  await fs.mkdir(path.join(libraryDir, 'tokens', 'dist'), { recursive: true });

  for (const { name, filePath } of entries) {
    const source = await fs.readFile(filePath, 'utf-8');
    const result = await compileMitosis({
      componentName: name,
      source,
      targets: TARGETS,
      normalize: true,
    });

    if (!result.success) {
      const msg = (result.errors || []).map((e) => `[${e.target}] ${e.message}`).join('; ');
      throw new Error(`Failed to compile ${name}: ${msg}`);
    }

    for (const art of result.artifacts) {
      const targetDistDir = path.join(libraryDir, art.target, 'dist');
      await fs.writeFile(path.join(targetDistDir, art.fileName), art.code, 'utf-8');
    }
  }

  const utilsContent = getUtilsSource ? getUtilsSource() : await fs.readFile(utilsSrcFile, 'utf-8');
  for (const target of TARGETS) {
    await fs.writeFile(path.join(libraryDir, target, 'dist', 'utils.ts'), utilsContent, 'utf-8');
  }

  for (const tokenFile of ['tokens.json', 'theme.css', 'tokens.css', 'tokens.ts']) {
    await copyFileSafe(
      path.join(tokensDir, tokenFile),
      path.join(libraryDir, 'tokens', 'dist', tokenFile)
    );
  }

  await fs.writeFile(path.join(libraryDir, 'react/dist/runtime.ts'), getReactRuntimeSource(), 'utf-8');
  await fs.writeFile(path.join(libraryDir, 'vue3/dist/runtime.ts'), getVue3RuntimeSource(), 'utf-8');

  const reactExports = entries.map(({ name }) => `export { default as ${name} } from './${name}.tsx';`).join('\n');
  await fs.writeFile(path.join(libraryDir, 'react/dist/index.ts'), `${reactExports}\nexport * from './utils.ts';\nexport * from './runtime.ts';\n`, 'utf-8');

  const vue3Exports = entries.map(({ name }) => `export { default as ${name} } from './${name}.vue';`).join('\n');
  await fs.writeFile(path.join(libraryDir, 'vue3/dist/index.ts'), `${vue3Exports}\nexport * from './utils.ts';\nexport * from './runtime.ts';\n`, 'utf-8');

  const svelteExports = entries.map(({ name }) => `export { default as ${name} } from './${name}.svelte';`).join('\n');
  await fs.writeFile(path.join(libraryDir, 'svelte/dist/index.ts'), `${svelteExports}\nexport * from './utils.ts';\n`, 'utf-8');

  const vue2Exports = entries.map(({ name }) => `export { default as ${name} } from './${name}.vue';`).join('\n');
  await fs.writeFile(path.join(libraryDir, 'vue2/dist/index.ts'), `${vue2Exports}\nexport * from './utils.ts';\n`, 'utf-8');

  const angularExports = entries.map(({ name }) => `export { default as ${name}, ${name}Module } from './${name}.ts';`).join('\n');
  await fs.writeFile(path.join(libraryDir, 'angular/dist/index.ts'), `${angularExports}\nexport * from './utils.ts';\n`, 'utf-8');

  const srcIndex = `export * from './components/utils.js';\nexport * from './tokens/tokens.js';\n`;
  await fs.writeFile(path.resolve(rootDir, 'src/index.ts'), srcIndex, 'utf-8');

  if (!quiet) {
    console.log(`[compile-library] Compiled ${entries.length} components across ${TARGETS.length} framework packages in library/*.`);
  }
  return { count: entries.length, targets: TARGETS };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  compileLibrary().catch((err) => {
    console.error('[compile-library] Error:', err);
    process.exit(1);
  });
}
