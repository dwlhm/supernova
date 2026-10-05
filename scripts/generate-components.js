const fs = require('fs');
const path = require('path');
const mitosis = require('@builder.io/mitosis');

const rootDir = path.resolve(__dirname, '..');
const paths = require('./export-source').resolveExportPaths();
const componentsDir = paths.componentsDir;
const manifestPath = path.join(rootDir, 'docs', '.vitepress', 'components.generated.json');

const EMPTY_BARREL = '// Auto-generated barrel file. Do not edit directly.\nexport {}\n';

const targets = {
  react: {
    dir: path.join(rootDir, 'packages', 'react', 'src'),
    ext: '.tsx',
    generate: (json) => mitosis.componentToReact({ typescript: true })({ component: json }),
    barrel: (names) =>
      names.length === 0
        ? EMPTY_BARREL
        : `// Auto-generated barrel file. Do not edit directly.\n` +
          names.map((n) => `export { default as ${n} } from './${n}';\nexport * from './${n}';`).join('\n\n') +
          '\n',
    ambient: null,
  },
  svelte: {
    dir: path.join(rootDir, 'packages', 'svelte', 'src'),
    ext: '.svelte',
    generate: (json) => mitosis.componentToSvelte({ typescript: true })({ component: json }),
    barrel: (names) =>
      names.length === 0
        ? EMPTY_BARREL
        : `// Auto-generated barrel file. Do not edit directly.\n` +
          names.map((n) => `export { default as ${n} } from './${n}.svelte';`).join('\n') +
          '\n',
    ambient: `declare module '*.svelte' {\n  import type { ComponentType, SvelteComponent } from 'svelte';\n  const component: ComponentType<SvelteComponent>;\n  export default component;\n}\n`,
  },
  vue: {
    dir: path.join(rootDir, 'packages', 'vue', 'src'),
    ext: '.vue',
    generate: (json) => mitosis.componentToVue({ api: 'composition', typescript: true })({ component: json }),
    barrel: (names) =>
      names.length === 0
        ? EMPTY_BARREL
        : `// Auto-generated barrel file. Do not edit directly.\n` +
          names.map((n) => `export { default as ${n} } from './${n}.vue';`).join('\n') +
          '\n',
    ambient: `declare module '*.vue' {\n  import type { DefineComponent } from 'vue';\n  const component: DefineComponent<{}, {}, any>;\n  export default component;\n}\n`,
  },
  vue2: {
    dir: path.join(rootDir, 'packages', 'vue2', 'src'),
    ext: '.vue',
    generate: (json) => mitosis.componentToVue({ api: 'options', defineComponent: false })({ component: json }),
    barrel: (names) =>
      names.length === 0
        ? EMPTY_BARREL
        : `// Auto-generated barrel file. Do not edit directly.\n` +
          names.map((n) => `export { default as ${n} } from './${n}.vue';`).join('\n') +
          '\n',
    ambient: `declare module '*.vue' {\n  import Vue from 'vue';\n  export default Vue;\n}\n`,
  },
};

// Read the previously generated manifest so owned artifacts can be pruned.
// Any missing/invalid manifest is treated as an empty component set.
function readPreviousManifest() {
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    if (parsed && Array.isArray(parsed.components)) {
      return parsed;
    }
  } catch (e) {
    // Fall through to the empty component set.
  }
  return { components: [] };
}

function sortByName(list) {
  return list
    .slice()
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

console.log('--- Generating Multi-Framework Components via Mitosis ---');

const previous = readPreviousManifest();

const componentFiles = paths.hasComponents
  ? fs.readdirSync(componentsDir).filter((file) => file.endsWith('.lite.tsx')).sort()
  : [];
const componentNames = componentFiles.map((file) => file.replace('.lite.tsx', ''));
const current = sortByName(componentNames.map((name) => ({ name, slug: name.toLowerCase() })));

// Prune owned artifacts: component files from the previous manifest that are no
// longer present, plus the runtime copy when the component set is empty. Never
// touch anything else (index.ts, ambient.d.ts, or unrelated files).
const currentNames = new Set(current.map((c) => c.name));
const previousNames = previous.components.map((c) => c.name);
for (const config of Object.values(targets)) {
  for (const name of previousNames) {
    if (currentNames.has(name)) continue;
    const filePath = path.join(config.dir, `${name}${config.ext}`);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
  }

  if (current.length === 0) {
    const runtimeDir = path.join(config.dir, 'runtime');
    if (fs.existsSync(runtimeDir)) {
      fs.rmSync(runtimeDir, { recursive: true, force: true });
    }
  }
}

if (current.length === 0) {
  console.warn(`\n[generate-components] WARNING: components artifact not found at ${componentsDir}`);
  console.warn('  Previously generated component files were pruned.');
  console.warn('  This is expected until Supernova syncs a components/ directory.');
  console.warn('  Run `npm run generate:mock` to restore the mock set for local development.\n');
}

// Always write barrels and ambient declarations so every package keeps a valid
// build entry, whether or not any components were found.
for (const config of Object.values(targets)) {
  if (!fs.existsSync(config.dir)) {
    fs.mkdirSync(config.dir, { recursive: true });
  }

  fs.writeFileSync(path.join(config.dir, 'index.ts'), config.barrel(componentNames), 'utf-8');

  if (config.ambient) {
    fs.writeFileSync(path.join(config.dir, 'ambient.d.ts'), config.ambient, 'utf-8');
  }
}

if (current.length > 0) {
  for (const [targetName, config] of Object.entries(targets)) {
    let needsRuntime = false;
    for (const file of componentFiles) {
      const componentName = file.replace('.lite.tsx', '');
      const filePath = path.join(componentsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = mitosis.parseJsx(content, { typescript: true });
      for (const imported of json.imports) {
        if (imported.path === '../runtime/component-runtime') {
          imported.path = './runtime/component-runtime';
          needsRuntime = true;
        }
      }
      const outputCode = config.generate(json);
      const destPath = path.join(config.dir, `${componentName}${config.ext}`);
      fs.writeFileSync(destPath, outputCode, 'utf-8');
    }

    if (needsRuntime) {
      if (!paths.hasRuntime) {
        console.error(`[generate-components] FATAL: components import ../runtime/component-runtime but ${paths.runtimeDir} is missing`);
        process.exit(1);
      }
      const runtimeDir = path.join(config.dir, 'runtime');
      fs.mkdirSync(runtimeDir, { recursive: true });
      fs.copyFileSync(path.join(paths.runtimeDir, 'component-runtime.ts'), path.join(runtimeDir, 'component-runtime.ts'));
    }

    console.log(`Generated ${componentFiles.length} components for target [${targetName}] in ${path.relative(rootDir, config.dir)}`);
  }
}

// Always write the manifest last, free of timestamps and absolute paths.
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify({ components: current }, null, 2) + '\n', 'utf-8');

console.log('Component generation complete.\n');
