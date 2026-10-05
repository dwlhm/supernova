const fs = require('fs');
const path = require('path');
const mitosis = require('@builder.io/mitosis');

const rootDir = path.resolve(__dirname, '..');
const paths = require('./export-source').resolveExportPaths();
const componentsDir = paths.componentsDir;

const targets = {
  react: {
    dir: path.join(rootDir, 'packages', 'react', 'src'),
    ext: '.tsx',
    generate: (json) => mitosis.componentToReact({ typescript: true })({ component: json }),
    barrel: (names) =>
      `// Auto-generated barrel file. Do not edit directly.\n` +
      names.map((n) => `export { default as ${n} } from './${n}';\nexport * from './${n}';`).join('\n\n') +
      '\n',
    ambient: null,
  },
  svelte: {
    dir: path.join(rootDir, 'packages', 'svelte', 'src'),
    ext: '.svelte',
    generate: (json) => mitosis.componentToSvelte({ typescript: true })({ component: json }),
    barrel: (names) =>
      `// Auto-generated barrel file. Do not edit directly.\n` +
      names.map((n) => `export { default as ${n} } from './${n}.svelte';`).join('\n') +
      '\n',
    ambient: `declare module '*.svelte' {\n  import type { ComponentType, SvelteComponent } from 'svelte';\n  const component: ComponentType<SvelteComponent>;\n  export default component;\n}\n`,
  },
  vue: {
    dir: path.join(rootDir, 'packages', 'vue', 'src'),
    ext: '.vue',
    generate: (json) => mitosis.componentToVue({ api: 'composition', typescript: true })({ component: json }),
    barrel: (names) =>
      `// Auto-generated barrel file. Do not edit directly.\n` +
      names.map((n) => `export { default as ${n} } from './${n}.vue';`).join('\n') +
      '\n',
    ambient: `declare module '*.vue' {\n  import type { DefineComponent } from 'vue';\n  const component: DefineComponent<{}, {}, any>;\n  export default component;\n}\n`,
  },
  vue2: {
    dir: path.join(rootDir, 'packages', 'vue2', 'src'),
    ext: '.vue',
    generate: (json) => mitosis.componentToVue({ api: 'options', defineComponent: false })({ component: json }),
    barrel: (names) =>
      `// Auto-generated barrel file. Do not edit directly.\n` +
      names.map((n) => `export { default as ${n} } from './${n}.vue';`).join('\n') +
      '\n',
    ambient: `declare module '*.vue' {\n  import Vue from 'vue';\n  export default Vue;\n}\n`,
  },
};

console.log('--- Generating Multi-Framework Components via Mitosis ---');

if (!paths.hasComponents) {
  console.warn(`\n[generate-components] WARNING: components artifact not found at ${paths.componentsDir}`);
  console.warn('  Skipping multi-framework generation. Existing packages/*/src files are left untouched.');
  console.warn('  This is expected until Supernova syncs the components directory into the export root.\n');
  process.exit(0);
}

const componentFiles = fs.readdirSync(componentsDir).filter((file) => file.endsWith('.lite.tsx'));
const componentNames = componentFiles.map((file) => file.replace('.lite.tsx', ''));

for (const [targetName, config] of Object.entries(targets)) {
  if (!fs.existsSync(config.dir)) {
    fs.mkdirSync(config.dir, { recursive: true });
  }

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

  // Write barrel file
  const barrelContent = config.barrel(componentNames);
  fs.writeFileSync(path.join(config.dir, 'index.ts'), barrelContent, 'utf-8');

  // Write ambient declarations if needed
  if (config.ambient) {
    fs.writeFileSync(path.join(config.dir, 'ambient.d.ts'), config.ambient, 'utf-8');
  }

  console.log(`Generated ${componentFiles.length} components for target [${targetName}] in ${path.relative(rootDir, config.dir)}`);
}

console.log('Component generation complete.\n');
