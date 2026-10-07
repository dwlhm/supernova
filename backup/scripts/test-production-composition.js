const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { createRequire } = require('module');
const ts = require('typescript');
const { processPrComponents } = require('./process-pr-components');
const root = path.resolve(__dirname, '..');
const reactRequire = createRequire(path.join(root, 'packages/react/package.json'));
const React = reactRequire('react');
const { renderToStaticMarkup } = reactRequire('react-dom/server');
const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'production-composition-')));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'components.composition.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'components.catalog.json'), 'utf8')).filter(component => Object.hasOwn(registry, component.name));
const fixtureByName = { Breadcrumb: 'breadcrumb', Table: 'table', TableHeaderRow: 'table-header-row', TableBodyRow: 'table-body-row' };
const scenes = catalog.map(component => JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', `production-${fixtureByName[component.name]}.figma.json`), 'utf8')));
const fileKey = catalog[0].fileId;
const file = { document: { id: 'fixture-document', type: 'DOCUMENT', children: [{ id: 'fixture-canvas', type: 'CANVAS', name: 'Reviewed production sources', children: scenes }] }, version: 'reviewed-source-fixture', lastModified: '2026-10-06T08:26:57Z', components: {}, componentSets: {} };
function compile(name) {
  const source = fs.readFileSync(path.join(temp, 'packages/react/src', name + '.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require: reactRequire, console });
  return module.exports.default;
}
(async () => {
  const previousCwd = process.cwd();
  const previousFetch = global.fetch;
  try {
    global.fetch = () => { throw new Error('Production fixture iteration must remain offline'); };
    assert.strictEqual(catalog.length, 4);
    fs.cpSync(path.join(root, 'scripts'), path.join(temp, 'scripts'), { recursive: true });
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
    fs.copyFileSync(path.join(root, 'components.composition.json'), path.join(temp, 'components.composition.json'));
    fs.writeFileSync(path.join(temp, 'components.catalog.json'), JSON.stringify(catalog));
    fs.writeFileSync(path.join(temp, 'snapshot.json'), JSON.stringify({ snapshotVersion: 1, fileKey, fetchedAt: file.lastModified, geometry: 'paths', file }));
    process.chdir(temp);
    // No composition options passed: repository registry is selected naturally.
    let result = await processPrComponents({ figmaSnapshot: 'snapshot.json', silent: true });
    assert.strictEqual(result.summary.failed, 0);
    assert.strictEqual(result.summary.new, 4);
    assert.strictEqual(fs.readdirSync('components').filter(name => name.endsWith('.lite.tsx')).length, 14);
    const breadcrumbSource = fs.readFileSync('components/Breadcrumb.lite.tsx', 'utf8');
    for (const prop of ['type', 'showEllipsis', 'home', 'breadcrumb']) assert(!breadcrumbSource.includes(`props.${prop}`));
    for (const name of ['TableHeaderRow', 'TableBodyRow']) {
      const source = fs.readFileSync(`components/${name}.lite.tsx`, 'utf8');
      assert(source.includes('<tr') && !source.includes('Column 1') && !source.includes('flex'));
    }
    result = await processPrComponents({ figmaSnapshot: 'snapshot.json', silent: true });
    assert.strictEqual(result.summary.preserved, 4);
    fs.mkdirSync('tokens');
    fs.writeFileSync('tokens/tokens.ts', 'export const tokens = { colors: {}, typography: {}, shadows: {} };\n');
    for (const script of ['generate-components', 'generate-docs']) execFileSync(process.execPath, [path.join(temp, 'scripts', script + '.js'), '--source=' + temp], { cwd: temp, stdio: 'pipe' });
    const names = Object.values(registry).flatMap(spec => spec.parts.map(part => part.name));
    for (const framework of ['react', 'vue', 'vue2', 'svelte']) {
      const barrel = fs.readFileSync(`packages/${framework}/src/index.ts`, 'utf8');
      for (const name of names) assert(barrel.includes(name), `${framework} exports ${name}`);
    }
    // Verify the reviewed real-source artifacts through actual package/docs builds.
    for (const framework of ['react', 'vue', 'vue2', 'svelte']) {
      const packageRoot = path.join(root, 'packages', framework);
      const destination = path.join(temp, 'packages', framework);
      for (const name of fs.readdirSync(packageRoot)) if (/^(package\.json|tsconfig.*\.json|vite\.config\..*)$/.test(name)) fs.copyFileSync(path.join(packageRoot, name), path.join(destination, name));
      if (fs.existsSync(path.join(packageRoot, 'node_modules'))) fs.symlinkSync(path.join(packageRoot, 'node_modules'), path.join(destination, 'node_modules'), 'dir');
      if (framework !== 'svelte') execFileSync('npm', ['run', 'build'], { cwd: destination, stdio: 'pipe' });
    }
    fs.copyFileSync(path.join(root, 'docs/.vitepress/config.mts'), path.join(temp, 'docs/.vitepress/config.mts'));
    fs.cpSync(path.join(root, 'docs/.vitepress/theme'), path.join(temp, 'docs/.vitepress/theme'), { recursive: true });
    fs.cpSync(path.join(root, 'docs/public'), path.join(temp, 'docs/public'), { recursive: true });
    fs.cpSync(path.join(root, 'packages/tokens/css'), path.join(temp, 'packages/tokens/css'), { recursive: true });
    for (const name of ['component-contract.md', 'ui-ux-guidelines.md']) fs.copyFileSync(path.join(root, 'docs', name), path.join(temp, 'docs', name));
    execFileSync(process.execPath, [path.join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', path.join(temp, 'docs')], { cwd: temp, stdio: 'pipe' });
    const svelteCompiler = require('svelte/compiler');
    for (const name of names) {
      const source = fs.readFileSync(`packages/svelte/src/${name}.svelte`, 'utf8');
      const jsSource = source.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (_, attributes, code) => `<script${attributes.replace(/\s*lang=["']ts["']/g, '')}>${ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext } }).outputText}</script>`);
      svelteCompiler.compile(jsSource, { filename: name + '.svelte', generate: 'ssr' });
    }
    const components = Object.fromEntries(names.map(name => [name, compile(name)]));
    for (const length of [0, 1, 4]) {
      const children = Array.from({ length }, (_, index) => React.createElement(components.BreadcrumbItem, { key: index }, index ? React.createElement(components.BreadcrumbSeparator) : null, index === length - 1 ? React.createElement(components.BreadcrumbPage, null, `Crumb ${index}`) : React.createElement(components.BreadcrumbLink, { href: `/crumb/${index}` }, `Crumb ${index}`)));
      const html = renderToStaticMarkup(React.createElement(components.Breadcrumb, null, React.createElement(components.BreadcrumbList, null, children)));
      assert.strictEqual((html.match(/<li\b/g) || []).length, length);
      assert.strictEqual((html.match(/aria-current="page"/g) || []).length, length ? 1 : 0);
      assert(html.includes('<nav aria-label="Breadcrumb"'));
      assert(!html.includes('Home') && !html.includes('Components'));
    }
    assert(renderToStaticMarkup(React.createElement(components.BreadcrumbEllipsis)).includes('…'));
    for (const rows of [0, 1, 3]) {
      const columns = ['Name', 'Value', 'Status'];
      const header = React.createElement(components.TableHeader, null, React.createElement(components.TableHeaderRow, null, columns.map(column => React.createElement(components.TableHeaderCell, { key: column }, column))));
      const body = React.createElement(components.TableBody, null, Array.from({ length: rows }, (_, row) => React.createElement(components.TableBodyRow, { key: row }, columns.map(column => React.createElement(components.TableCell, { key: column }, `${column} ${row}`)))));
      const html = renderToStaticMarkup(React.createElement(components.Table, null, header, body));
      assert.strictEqual((html.match(/<th\b/g) || []).length, columns.length);
      assert.strictEqual((html.match(/<td\b/g) || []).length, rows * columns.length);
      assert.strictEqual((html.match(/<tr\b/g) || []).length, rows + 1);
      assert.strictEqual((html.match(/scope="col"/g) || []).length, columns.length);
      assert(!html.includes('flex') && !html.includes('Column 10'));
    }
    const doc = fs.readFileSync('docs/components/breadcrumb.md', 'utf8');
    assert(doc.includes('paths.map') && !doc.includes('ComponentSandbox'));
    assert(fs.readFileSync('docs/components/table.md', 'utf8').includes('columns.map'));
    console.log('Reviewed production registry: 4 actual roots generate 14 parts offline; isolated React/Vue/Vue2/VitePress builds, Svelte compiler, all framework exports/docs and React Breadcrumb/Table loop DOM verified.');
  } finally {
    global.fetch = previousFetch;
    process.chdir(previousCwd);
    fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
