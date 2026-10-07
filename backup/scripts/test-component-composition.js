const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const mitosis = require('@builder.io/mitosis');
const ts = require('typescript');
const { createRequire } = require('module');
const reactRequire = createRequire(path.resolve(__dirname, '../packages/react/package.json'));
const React = reactRequire('react');
const { renderToStaticMarkup } = reactRequire('react-dom/server');
const { transpileFigmaNodeToMitosisArtifacts } = require('./figma-to-mitosis');
const { processPrComponents, computeFingerprint } = require('./process-pr-components');
const { validateComposition, writeCompositionSources } = require('./component-composition');
const root = path.resolve(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const breadcrumb = load('breadcrumb.figma.json');
const breadcrumbSpec = load('breadcrumb.composition.json');
const table = load('table.figma.json');
const tableSpec = load('table.composition.json');
const artifacts = transpileFigmaNodeToMitosisArtifacts(breadcrumb, { componentName: 'Breadcrumb', composition: breadcrumbSpec, tokens: [] });
const tableArtifacts = transpileFigmaNodeToMitosisArtifacts(table, { componentName: 'Table', composition: tableSpec, tokens: [] });
const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-composition-')));
function reactComponent(name) {
  const source = fs.readFileSync(path.join(temp, 'packages/react/src', name + '.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require: reactRequire, console });
  return module.exports.default;
}
(async () => {
  const oldCwd = process.cwd();
  try {
    assert.strictEqual(Object.keys(artifacts).length, breadcrumbSpec.parts.length);
    assert(!artifacts.Breadcrumb.includes('props.type'));
    assert(!artifacts.Breadcrumb.includes('props.home'));
    assert(!artifacts.Breadcrumb.includes('props.showEllipsis'));
    const parsed = mitosis.parseJsx(artifacts.Breadcrumb, { typescript: true });
    assert.strictEqual(parsed.children[0].name, 'nav');
    assert.strictEqual(parsed.children[0].children.length, 1, 'Only caller children remain');
    assert(!Object.values(artifacts).some(source => source.includes('Example path')));
    assert(!Object.values(tableArtifacts).some(source => source.includes('Example cell content')));
    for (const source of Object.values(tableArtifacts)) assert(!source.includes('flex'), 'Native table layout remains native');

    for (const mutate of [
      spec => { spec.parts.push(clone(spec.parts[0])); },
      spec => { spec.root = undefined; },
      spec => { spec.parts[0].name = '../Escape'; },
      spec => { spec.parts[0].tag = 'script'; },
      spec => { spec.parts[0].attributes = { onClick: 'execute()' }; },
      spec => { spec.parts[0].attributes = { id: { prop: 'absent' } }; },
      spec => { spec.parts[0].props = { unused: 'string' }; },
      spec => { spec.parts[0].attributes = { id: { prop: ['href'] } }; },
      spec => { spec.parts[0].defaultContent = 'invalid'; },
      spec => { spec.parts[0].unexpected = true; },
      spec => { spec.parts[1].name = 'BreadcrumbProps'; },
    ]) {
      const spec = clone(breadcrumbSpec); mutate(spec);
      assert.throws(() => validateComposition(spec));
    }
    for (const composition of [false, 0, '', 'invalid']) assert.throws(() => transpileFigmaNodeToMitosisArtifacts(breadcrumb, { componentName: 'Breadcrumb', composition }), /expected object/);
    const missing = clone(breadcrumbSpec); missing.parts[0].sourceNodeId = 'missing';
    assert.throws(() => transpileFigmaNodeToMitosisArtifacts(breadcrumb, { componentName: 'Breadcrumb', composition: missing }), /not found/);
    const duplicates = clone(breadcrumb); duplicates.children.push(clone(duplicates.children[0]));
    assert.throws(() => transpileFigmaNodeToMitosisArtifacts(duplicates, { componentName: 'Breadcrumb', composition: breadcrumbSpec }), /duplicate source node/);
    // Captured from the pre-composition converter: unchanged legacy files retain ownership/custom code.
    assert.strictEqual(computeFingerprint({ name: 'Legacy' }), 'f79428cb872668a1f31c9ec177d23fbe9d00597a89eac159d9a17270246d2b4f');
    assert.notStrictEqual(computeFingerprint({ name: 'Breadcrumb', composition: breadcrumbSpec }), computeFingerprint({ name: 'Breadcrumb', composition: tableSpec }));

    // Isolated source -> authoritative manifest -> all package barrels -> docs.
    fs.cpSync(path.join(root, 'scripts'), path.join(temp, 'scripts'), { recursive: true });
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
    fs.mkdirSync(path.join(temp, 'tokens'), { recursive: true });
    fs.writeFileSync(path.join(temp, 'tokens/tokens.ts'), 'export const tokens = { colors: {}, typography: {}, shadows: {} };\n');
    const catalog = [{ name: 'Breadcrumb', node: breadcrumb }, { name: 'Table', node: table }];
    fs.writeFileSync(path.join(temp, 'components.catalog.json'), JSON.stringify(catalog));
    fs.writeFileSync(path.join(temp, 'components.composition.json'), JSON.stringify({ Breadcrumb: breadcrumbSpec, Table: tableSpec }));
    process.chdir(temp);
    let result = await processPrComponents({ mock: true, silent: true });
    assert.strictEqual(result.summary.failed, 0);
    const initialManifestText = fs.readFileSync('.components-manifest.json', 'utf8');
    fs.writeFileSync('components.catalog.json', '{broken');
    await assert.rejects(processPrComponents({ mock: true, silent: true }), /Catalog unavailable or invalid/);
    assert.strictEqual(fs.readFileSync('.components-manifest.json', 'utf8'), initialManifestText);
    fs.writeFileSync('components.catalog.json', JSON.stringify(catalog));
    const firstManifest = JSON.parse(fs.readFileSync('.components-manifest.json'));
    assert.strictEqual(firstManifest.components.Breadcrumb.outputs.length, 7);
    fs.unlinkSync('components/BreadcrumbLink.lite.tsx');
    result = await processPrComponents({ mock: true, silent: true });
    assert(fs.existsSync('components/BreadcrumbLink.lite.tsx'), 'Missing owned part restored');
    result = await processPrComponents({ mock: true, silent: true });
    assert.strictEqual(result.summary.preserved, 2);
    const output = execFileSync(process.execPath, [path.join(temp, 'scripts/generate-components.js'), '--source=' + temp], { cwd: temp, encoding: 'utf8' });
    assert(output.includes('Generated 11 components'));
    const generatedManifest = JSON.parse(fs.readFileSync('docs/.vitepress/components.generated.json'));
    assert.strictEqual(generatedManifest.components.length, 11);
    assert.strictEqual(generatedManifest.components.find(part => part.name === 'Breadcrumb').composition.root, 'Breadcrumb');
    execFileSync(process.execPath, [path.join(temp, 'scripts/generate-docs.js'), '--source=' + temp], { cwd: temp, encoding: 'utf8' });
    const doc = fs.readFileSync('docs/components/breadcrumb.md', 'utf8');
    assert(doc.includes('Consumer loop') && doc.includes('paths.map') && doc.includes('BreadcrumbList'));
    assert(!doc.includes('ComponentSandbox') && !doc.includes('Interactive Preview'));

    const vueCompiler = require('@vue/compiler-sfc');
    const vue2Compiler = require(path.join(root, 'packages/vue2/node_modules/vue/compiler-sfc'));
    const svelteCompiler = require('svelte/compiler');
    for (const name of [...Object.keys(artifacts), ...Object.keys(tableArtifacts)]) {
      for (const framework of ['react', 'vue', 'vue2', 'svelte']) {
        const barrel = fs.readFileSync(`packages/${framework}/src/index.ts`, 'utf8');
        assert(barrel.includes(name), `${framework} exports ${name}`);
        const ext = framework === 'react' ? '.tsx' : framework === 'svelte' ? '.svelte' : '.vue';
        const source = fs.readFileSync(`packages/${framework}/src/${name}${ext}`, 'utf8');
        assert(!source.includes('Example path') && !source.includes('Example cell content'));
        if (framework === 'react') reactComponent(name);
        if (framework === 'vue') {
          const parsed = vueCompiler.parse(source, { filename: name + ext });
          assert.deepStrictEqual(parsed.errors, []);
          const compiled = vueCompiler.compileTemplate({ source: parsed.descriptor.template.content, filename: name + ext, id: name });
          assert.deepStrictEqual(compiled.errors, []);
          vueCompiler.compileScript(parsed.descriptor, { id: name });
        }
        if (framework === 'vue2') {
          const parsed = vue2Compiler.parse({ source, filename: name + ext });
          assert.deepStrictEqual(parsed.errors, []);
          const compiled = vue2Compiler.compileTemplate({ source: parsed.template.content, filename: name + ext });
          assert.deepStrictEqual(compiled.errors, []);
        }
        if (framework === 'svelte') {
          // Strip only generated TS annotations before the JS Svelte compiler.
          const jsSource = source.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (_, attributes, code) => {
            const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext } }).outputText;
            return `<script${attributes.replace(/\s*lang=["']ts["']/g, '')}>${js}</script>`;
          });
          svelteCompiler.compile(jsSource, { filename: name + ext, generate: 'ssr' });
        }
        if (['vue', 'vue2', 'svelte'].includes(framework) && ['BreadcrumbSeparator', 'BreadcrumbEllipsis'].includes(name)) assert(/<slot>/.test(source) && !source.includes('children ??'), 'Native slot fallback survives compilation');
      }
    }
    for (const framework of ['react', 'vue', 'vue2', 'svelte']) {
      const packageRoot = path.join(root, 'packages', framework);
      const destination = path.join(temp, 'packages', framework);
      for (const file of fs.readdirSync(packageRoot)) {
        if (/^(package\.json|tsconfig.*\.json|vite\.config\..*)$/.test(file)) fs.copyFileSync(path.join(packageRoot, file), path.join(destination, file));
      }
      if (fs.existsSync(path.join(packageRoot, 'node_modules'))) fs.symlinkSync(path.join(packageRoot, 'node_modules'), path.join(destination, 'node_modules'), 'dir');
      if (framework !== 'svelte') {
        const buildOutput = execFileSync('npm', ['run', 'build'], { cwd: destination, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        assert(/Build success|built in/.test(buildOutput), `${framework} package build passed`);
      }
    }
    // Build the actual fixture documentation with the repository theme/config.
    fs.copyFileSync(path.join(root, 'docs/.vitepress/config.mts'), path.join(temp, 'docs/.vitepress/config.mts'));
    fs.cpSync(path.join(root, 'docs/.vitepress/theme'), path.join(temp, 'docs/.vitepress/theme'), { recursive: true });
    fs.cpSync(path.join(root, 'docs/public'), path.join(temp, 'docs/public'), { recursive: true });
    fs.cpSync(path.join(root, 'packages/tokens/css'), path.join(temp, 'packages/tokens/css'), { recursive: true });
    for (const name of ['component-contract.md', 'ui-ux-guidelines.md']) fs.copyFileSync(path.join(root, 'docs', name), path.join(temp, 'docs', name));
    const docsBuild = execFileSync(process.execPath, [path.join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', path.join(temp, 'docs')], { cwd: temp, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert(docsBuild.includes('build complete'), 'Fixture VitePress docs build passed');

    const c = Object.fromEntries(Object.keys(artifacts).map(name => [name, reactComponent(name)]));
    for (const count of [0, 1, 5]) {
      const paths = Array.from({ length: count }, (_, index) => ({ id: index, label: `Path ${index}`, href: `/path/${index}` }));
      const tree = React.createElement(c.Breadcrumb, null, React.createElement(c.BreadcrumbList, null, paths.map((item, index) => React.createElement(c.BreadcrumbItem, { key: item.id }, index > 0 ? React.createElement(c.BreadcrumbSeparator) : null, index === count - 1 ? React.createElement(c.BreadcrumbPage, null, item.label) : React.createElement(c.BreadcrumbLink, { href: item.href }, item.label)))));
      const html = renderToStaticMarkup(tree);
      assert.strictEqual((html.match(/<li\b/g) || []).length, count);
      assert.strictEqual((html.match(/aria-current="page"/g) || []).length, count ? 1 : 0);
      assert.strictEqual((html.match(/<a\b/g) || []).length, Math.max(0, count - 1));
      assert(!html.includes('Home') && !html.includes('Example path'));
      assert(html.includes('<nav aria-label="Breadcrumb"'));
      if (count > 1) assert(html.includes('href="/path/0"'));
    }
    assert(renderToStaticMarkup(React.createElement(c.BreadcrumbSeparator)).includes('/'));
    assert(!renderToStaticMarkup(React.createElement(c.BreadcrumbSeparator, null, '')).includes('>/'));
    assert(renderToStaticMarkup(React.createElement(c.BreadcrumbSeparator, null, '|')).includes('|'));
    assert(renderToStaticMarkup(React.createElement(c.BreadcrumbSeparator, null, 0)).includes('>0<'));
    assert(!renderToStaticMarkup(React.createElement(c.BreadcrumbSeparator, null, false)).includes('>/'));
    const tc = Object.fromEntries(Object.keys(tableArtifacts).map(name => [name, reactComponent(name)]));
    const tableHtml = renderToStaticMarkup(React.createElement(tc.Table, null, React.createElement(tc.TableBody, null, [1, 2].map(value => React.createElement(tc.TableRow, { key: value }, React.createElement(tc.TableCell, null, `Cell ${value}`))))));
    assert.strictEqual((tableHtml.match(/<tr\b/g) || []).length, 2);
    assert(tableHtml.includes('Cell 2') && !tableHtml.includes('flex'));

    // Registry conflicts, namespace collisions and traversal fail before writes.
    fs.writeFileSync('components.catalog.json', JSON.stringify([{ ...catalog[0], composition: breadcrumbSpec }, catalog[1]]));
    await assert.rejects(processPrComponents({ mock: true, silent: true }), /conflicting inline/);
    fs.writeFileSync('components.composition.json', '{}');
    for (const composition of [false, 0, '', 'invalid']) {
      fs.writeFileSync('components.catalog.json', JSON.stringify([{ ...catalog[0], composition }, catalog[1]]));
      await assert.rejects(processPrComponents({ mock: true, silent: true }), /expected object/);
    }
    fs.writeFileSync('components.catalog.json', JSON.stringify(catalog));
    const clash = clone(tableSpec); clash.parts[1].name = 'BreadcrumbItem';
    fs.writeFileSync('components.composition.json', JSON.stringify({ Breadcrumb: breadcrumbSpec, Table: clash }));
    await assert.rejects(processPrComponents({ mock: true, silent: true }), /collision/);
    fs.writeFileSync('components.composition.json', JSON.stringify({ Breadcrumb: breadcrumbSpec, Unknown: tableSpec }));
    await assert.rejects(processPrComponents({ mock: true, silent: true }), /unknown component/);

    const reduced = clone(breadcrumbSpec); reduced.parts = reduced.parts.filter(part => part.name !== 'BreadcrumbEllipsis');
    fs.writeFileSync('components.composition.json', JSON.stringify({ Breadcrumb: reduced, Table: tableSpec }));
    fs.writeFileSync('components/Custom.lite.tsx', '// custom unrelated file\n');
    const originalEllipsis = fs.readFileSync('components/BreadcrumbEllipsis.lite.tsx', 'utf8');
    const edited = originalEllipsis + '// custom edit\n';
    fs.writeFileSync('components/BreadcrumbEllipsis.lite.tsx', edited);
    const before = fs.readFileSync('components/Breadcrumb.lite.tsx', 'utf8');
    result = await processPrComponents({ mock: true, silent: true });
    assert.strictEqual(result.summary.failed, 1);
    assert.strictEqual(fs.readFileSync('components/Breadcrumb.lite.tsx', 'utf8'), before, 'Removal conflict causes no replacement writes');
    assert.strictEqual(fs.readFileSync('components/BreadcrumbEllipsis.lite.tsx', 'utf8'), edited);
    fs.writeFileSync('components/BreadcrumbEllipsis.lite.tsx', originalEllipsis);
    result = await processPrComponents({ mock: true, silent: true });
    assert.strictEqual(result.summary.failed, 0);
    assert(!fs.existsSync('components/BreadcrumbEllipsis.lite.tsx'));
    assert(fs.existsSync('components/Custom.lite.tsx'));
    // Remove the unrelated invalid source before package/docs generation.
    fs.unlinkSync('components/Custom.lite.tsx');
    execFileSync(process.execPath, [path.join(temp, 'scripts/generate-components.js'), '--source=' + temp], { cwd: temp, encoding: 'utf8' });
    execFileSync(process.execPath, [path.join(temp, 'scripts/generate-docs.js'), '--source=' + temp], { cwd: temp, encoding: 'utf8' });
    assert(!fs.existsSync('packages/react/src/BreadcrumbEllipsis.tsx'));
    assert(!fs.existsSync('docs/components/breadcrumbellipsis.md'));
    fs.unlinkSync('components/BreadcrumbItem.lite.tsx');
    assert.throws(() => execFileSync(process.execPath, [path.join(temp, 'scripts/generate-components.js'), '--source=' + temp], { cwd: temp, stdio: 'pipe' }), /Command failed/);

    const cliDir = path.join(temp, 'cli');
    execFileSync(process.execPath, [path.join(root, 'scripts/figma-to-mitosis.js'), '--fixture=' + path.join(root, 'scripts/fixtures/breadcrumb.figma.json'), '--name=Breadcrumb', '--composition=' + path.join(root, 'scripts/fixtures/breadcrumb.composition.json'), '--out=' + cliDir], { cwd: temp, stdio: 'pipe' });
    assert(fs.existsSync(path.join(cliDir, 'BreadcrumbList.lite.tsx')), 'CLI writes all parts');
    const removed = clone(breadcrumbSpec); removed.parts = removed.parts.filter(part => part.name !== 'BreadcrumbEllipsis');
    const removedSources = { ...artifacts }; delete removedSources.BreadcrumbEllipsis;
    writeCompositionSources(cliDir, removedSources, removed);
    assert(!fs.existsSync(path.join(cliDir, 'BreadcrumbEllipsis.lite.tsx')));
    fs.writeFileSync(path.join(cliDir, 'BreadcrumbEllipsis.lite.tsx'), '// unowned custom file');
    assert.throws(() => writeCompositionSources(cliDir, artifacts, breadcrumbSpec), /unowned output collision/);
    console.log('Composition: isolated React/Vue/Vue2 package builds and VitePress docs build passed; 11 parts compiled in React, Vue 3, Vue 2, Svelte; React SSR 0/1/5 paths and Table loops; lifecycle, metadata, exports and docs verified.');
  } finally {
    process.chdir(oldCwd);
    fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
