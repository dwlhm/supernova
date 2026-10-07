/**
 * Automated test suite verifying the mock exporter functionality.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const { runMockExport } = require('./runner');
const { MockSupernova, createMockContext, loadMockData } = require('./mock-sdk');

async function runTests() {
  console.log('🧪 Running Supernova Mock Exporter Tests...\n');

  // Test 1: Mock data loads properly
  console.log('Test 1: Verify mock data fixtures load correctly');
  const { tokens, groups, themes } = loadMockData();
  assert(tokens.length > 0, 'Tokens array should not be empty');
  assert(groups.length > 0, 'Groups array should not be empty');
  assert(themes.length > 0, 'Themes array should not be empty');
  console.log(`  ✓ Loaded ${tokens.length} tokens, ${groups.length} groups, ${themes.length} themes\n`);

  // Test 2: Mock Supernova SDK methods
  console.log('Test 2: Verify MockSupernova SDK tokens API');
  const sdk = new MockSupernova();
  const rvi = { designSystemId: 'test-ds', versionId: 'test-v' };
  const fetchedTokens = await sdk.tokens.getTokens(rvi);
  const fetchedGroups = await sdk.tokens.getTokenGroups(rvi);
  const fetchedThemes = await sdk.tokens.getTokenThemes(rvi);
  assert.strictEqual(fetchedTokens.length, tokens.length);
  assert.strictEqual(fetchedGroups.length, groups.length);
  assert.strictEqual(fetchedThemes.length, themes.length);

  // Test theme application
  const darkTheme = fetchedThemes.find(t => t.id === 'theme-dark');
  assert(darkTheme, 'Dark theme should exist');
  const themedTokens = await sdk.tokens.computeTokensByApplyingThemes(fetchedTokens, [darkTheme]);
  const darkBgPage = themedTokens.find(t => t.id === 'token-color-bg-page');
  assert.strictEqual(darkBgPage.value.hex, '#0f172a', 'Dark theme background page should be overridden to #0f172a');
  console.log('  ✓ Mock SDK methods and theme computation pass\n');

  // Test 3: End-to-end export to temporary directory
  console.log('Test 3: Verify end-to-end export generation in isolated temp directory');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-mock-test-'));

  try {
    await runMockExport({
      outDir: tempDir,
      skipBuild: false,
      theme: null,
      clean: true
    });

    const expectedFiles = [
      'tokens/tokens.ts',
      'tokens/tokens.css',
      'tokens/theme.css',
      'components/Button.lite.tsx',
      'components/Card.lite.tsx',
      'components/StatusBadge.lite.tsx',
      'components/Badge.lite.tsx',
      'components/Input.lite.tsx',
      'components/Typography.lite.tsx',
      'index.ts',
      'components.catalog.json'
    ];

    for (const file of expectedFiles) {
      const fullPath = path.join(tempDir, file);
      assert(fs.existsSync(fullPath), `Expected file missing: ${file}`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert(content.length > 20, `File is empty or truncated: ${file}`);
    }

    // Verify every supported token type resolves into tokens.ts / tokens.css
    const tokensTs = fs.readFileSync(path.join(tempDir, 'tokens/tokens.ts'), 'utf-8');
    const tokensCss = fs.readFileSync(path.join(tempDir, 'tokens/tokens.css'), 'utf-8');
    assert(tokensTs.includes('"gradients"'), 'Gradient tokens must be categorized under gradients');
    assert(tokensCss.includes('--gradient-brand: linear-gradient('), 'Gradient token must emit a linear-gradient CSS value');
    assert(tokensCss.includes('--blur-sm: blur(4px)'), 'Blur token must emit blur(radius)');
    assert(tokensCss.includes('--typography-upper: uppercase'), 'Text case token must emit uppercase');
    assert(tokensCss.includes('--typography-underline: underline'), 'Text decoration token must emit underline');
    assert(tokensCss.includes('--typography-hidden: hidden'), 'Visibility token must emit hidden');
    console.log('  ✓ Gradient, blur, text case, text decoration and visibility tokens resolve\n');

    // Verify custom attribute injection on Card
    const cardContent = fs.readFileSync(path.join(tempDir, 'components/Card.lite.tsx'), 'utf-8');
    assert(cardContent.includes('testId?: string'), 'CardProps should include injected testId prop');
    assert(cardContent.includes('data-testid={props.testId}'), 'Card JSX should include data-testid attribute');

    // Verify multi-element structure on StatusBadge
    const sbContent = fs.readFileSync(path.join(tempDir, 'components/StatusBadge.lite.tsx'), 'utf-8');
    assert(sbContent.includes('{props.icon}'), 'StatusBadge should render icon child');
    assert(sbContent.includes('{props.text}'), 'StatusBadge should render text child');
    assert(sbContent.includes('data-testid={props.testId}'), 'StatusBadge should include custom attribute');

    // Verify components.catalog.json structure
    const catalogFile = path.join(tempDir, 'components.catalog.json');
    assert(fs.existsSync(catalogFile), 'Expected components.catalog.json to exist');
    const catalogData = JSON.parse(fs.readFileSync(catalogFile, 'utf-8'));
    assert(Array.isArray(catalogData), 'components.catalog.json must be an array');
    assert.strictEqual(catalogData.length, 6, 'All 6 mock components must be cataloged');
    for (const name of ['Button', 'Card', 'StatusBadge', 'Badge', 'Input', 'Typography']) {
      assert(catalogData.some(c => c.name === name), `Component ${name} must be cataloged`);
    }

    console.log(`  ✓ All ${expectedFiles.length} expected output files generated, including multi-element StatusBadge\n`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  // Reproduce cloud startup failure with Node host APIs but no filename globals.
  console.log('Test 4: Export inside Pulsar-like VM without filename globals');
  const packageRoot = path.resolve(__dirname, '../..');
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'exporter.json'), 'utf8'));
  const settings = JSON.parse(fs.readFileSync(path.join(packageRoot, 'config.json'), 'utf8'));
  const config = Object.fromEntries(settings.map(setting => [setting.key, setting.default]));
  const originalBrowser = process.browser;
  let handler;
  const moduleBridge = { exports: {} };
  const sandbox = { process, require, module: moduleBridge, exports: moduleBridge.exports, console,
    Pulsar: { exportConfig: () => config, export: callback => { handler = callback; } } };
  assert(!('__filename' in sandbox) && !('__dirname' in sandbox));
  vm.runInNewContext(fs.readFileSync(path.join(packageRoot, manifest.executable), 'utf8'), sandbox, { filename: 'pulsar-exporter-bundle.js' });
  assert.strictEqual(sandbox.process, process, 'Compiler isolation must not replace host process');
  assert.strictEqual(process.browser, originalBrowser, 'Compiler isolation must not mutate process.browser');
  assert.strictEqual(typeof handler, 'function', 'Bundle must register Pulsar export');
  const files = await handler(new MockSupernova(), createMockContext());
  assert.strictEqual(files.length, 12, 'Sandbox export must include components, tokens, runtime, catalog and barrel');
  for (const name of ['Button', 'Card', 'StatusBadge', 'Badge', 'Input', 'Typography']) {
    assert(files.some(file => file.name === `${name}.lite.tsx` && file.content.includes('export default function')), `Missing generated sandbox component ${name}`);
  }
  for (const name of ['tokens.ts', 'tokens.css', 'theme.css', 'component-runtime.ts', 'index.ts', 'components.catalog.json']) assert(files.some(file => file.name === name), `Missing sandbox artifact ${name}`);
  const themedFiles = await handler(new MockSupernova(), createMockContext({ themeId: 'theme-dark' }));
  assert.strictEqual(themedFiles.length, 12, 'Dark-theme sandbox must retain all artifacts');
  assert(themedFiles.find(file => file.name === 'tokens.ts').content.includes('#0f172a'), 'Dark-theme token override must be emitted inside VM');
  assert.strictEqual(process.browser, originalBrowser, 'Themed export must leave host process unchanged');
  console.log('  ✓ VM loaded and exported all 12 artifacts without filename globals or host process mutation\n');

  // Second defense layer: tripwire any read of CommonJS filename globals so a future
  // TypeScript regression fails loudly instead of crashing at bundle load time.
  console.log('Test 5: Exporter bundle never reads filename globals at runtime');
  {
    const packageRoot = path.resolve(__dirname, '../..');
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'exporter.json'), 'utf8'));
    const settings = JSON.parse(fs.readFileSync(path.join(packageRoot, 'config.json'), 'utf8'));
    const config = Object.fromEntries(settings.map(setting => [setting.key, setting.default]));
    let handler;
    const moduleBridge = { exports: {} };
    const sandbox = { process, require, module: moduleBridge, exports: moduleBridge.exports, console,
      Pulsar: { exportConfig: () => config, export: callback => { handler = callback; } } };
    Object.defineProperty(sandbox, '__filename', { configurable: true, get() { throw new Error('Exporter bundle read __filename at runtime'); } });
    Object.defineProperty(sandbox, '__dirname', { configurable: true, get() { throw new Error('Exporter bundle read __dirname at runtime'); } });
    vm.runInNewContext(fs.readFileSync(path.join(packageRoot, manifest.executable), 'utf8'), sandbox, { filename: 'pulsar-exporter-bundle.js' });
    const files = await handler(new MockSupernova(), createMockContext());
    assert.strictEqual(files.length, 12, 'Sandbox export must include components, tokens, runtime, catalog and barrel');
    console.log('  ✓ Bundle loaded and exported 12 artifacts without reading filename globals\n');
  }

  // Test 6: duplicate token names are disambiguated, not fatal
  console.log('Test 6: Duplicate token names are disambiguated and reported');
  const duplicatePackageRoot = path.resolve(__dirname, '../..');
  const duplicateOutDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-mock-dup-out-'));
  const duplicateDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-mock-dup-data-'));
  try {
    const sourceDataDir = path.join(duplicatePackageRoot, 'exporter/mock/data');
    for (const name of ['tokens.json', 'token-groups.json', 'themes.json', 'components.json']) {
      fs.copyFileSync(path.join(sourceDataDir, name), path.join(duplicateDataDir, name));
    }
    const duplicateTokens = JSON.parse(fs.readFileSync(path.join(duplicateDataDir, 'tokens.json'), 'utf-8'));
    const baseShadow = duplicateTokens.find(token => token.id === 'token-shadow-raised');
    assert(baseShadow, 'Duplicate-name fixture requires the base token token-shadow-raised');
    duplicateTokens.push({ ...JSON.parse(JSON.stringify(baseShadow)), id: 'token-shadow-raised-duplicate', name: 'Raised' });
    fs.writeFileSync(path.join(duplicateDataDir, 'tokens.json'), JSON.stringify(duplicateTokens, null, 2));

    await runMockExport({ outDir: duplicateOutDir, dataDir: duplicateDataDir, skipBuild: true, theme: null, clean: true });

    const duplicateCss = fs.readFileSync(path.join(duplicateOutDir, 'tokens/tokens.css'), 'utf-8');
    const duplicateTs = fs.readFileSync(path.join(duplicateOutDir, 'tokens/tokens.ts'), 'utf-8');
    assert(duplicateCss.includes('--shadows-raised:'), 'First occurrence must keep the unsuffixed CSS name');
    assert(duplicateCss.includes('--shadows-raised-2:'), 'Duplicate CSS name must receive a deterministic numeric suffix');
    assert(duplicateTs.includes('"shadowsRaised2"'), 'Duplicate TypeScript key must receive a deterministic numeric suffix');
    assert(duplicateCss.includes('Duplicate token names disambiguated'), 'Disambiguation must be reported in tokens.css');
    assert(duplicateTs.includes('Duplicate token names disambiguated'), 'Disambiguation must be reported in tokens.ts');
    console.log('  ✓ Duplicate token names disambiguated deterministically and reported in generated output\n');
  } finally {
    fs.rmSync(duplicateOutDir, { recursive: true, force: true });
    fs.rmSync(duplicateDataDir, { recursive: true, force: true });
  }

  // Test 7: the duplicate-name report must survive a host console without warn
  console.log('Test 7: Duplicate-name report survives a host console without warn');
  {
    const packageRoot = path.resolve(__dirname, '../..');
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'exporter.json'), 'utf8'));
    const settings = JSON.parse(fs.readFileSync(path.join(packageRoot, 'config.json'), 'utf8'));
    const config = Object.fromEntries(settings.map(setting => [setting.key, setting.default]));
    const { tokens: baseTokens, groups: baseGroups, themes: baseThemes } = loadMockData();
    const baseShadow = baseTokens.find(token => token.id === 'token-shadow-raised');
    assert(baseShadow, 'Duplicate-name fixture requires the base token token-shadow-raised');
    const collidingTokens = [
      ...JSON.parse(JSON.stringify(baseTokens)),
      { ...JSON.parse(JSON.stringify(baseShadow)), id: 'token-shadow-raised-duplicate', name: 'Raised' }
    ];

    let handler;
    const moduleBridge = { exports: {} };
    const captured = [];
    const sandbox = {
      process, require, module: moduleBridge, exports: moduleBridge.exports,
      console: { log: (...args) => captured.push(args.join(' ')) },
      Pulsar: { exportConfig: () => config, export: callback => { handler = callback; } }
    };
    vm.runInNewContext(fs.readFileSync(path.join(packageRoot, manifest.executable), 'utf8'), sandbox, { filename: 'pulsar-exporter-bundle.js' });
    const files = await handler(new MockSupernova({ tokens: collidingTokens, groups: baseGroups, themes: baseThemes }), createMockContext());
    const cssFile = files.find(file => file.name === 'tokens.css');
    assert(cssFile, 'Warn-less export must still emit tokens.css');
    assert(cssFile.content.includes('--shadows-raised-2:'), 'Disambiguation must still run with a warn-less console');
    assert(cssFile.content.includes('Duplicate token names disambiguated'), 'Report must still be written into tokens.css');
    assert(captured.some(line => line.includes('duplicate token name')), 'Report must fall back to console.log when warn is unavailable');
    console.log('  ✓ Export completed without console.warn and reported through console.log\n');
  }

  // Test 8: components without a mitosisDefinition property are skipped and reported
  console.log('Test 8: Components without a definition are skipped, not fatal');
  {
    const packageRoot = path.resolve(__dirname, '../..');
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'exporter.json'), 'utf8'));
    const settings = JSON.parse(fs.readFileSync(path.join(packageRoot, 'config.json'), 'utf8'));
    const config = Object.fromEntries(settings.map(setting => [setting.key, setting.default]));
    const mock = new MockSupernova();
    const version = { designSystemId: 'mock-design-system-id', versionId: 'mock-version-id' };
    const catalog = [
      ...await mock.components.getComponents(version),
      { id: 'component-alert', name: 'Alert', description: '', brandId: 'mock-brand', properties: [], propertyValues: {} }
    ];
    const sdk = {
      tokens: mock.tokens,
      components: { getComponents: async () => catalog, getDesignComponents: async () => [] }
    };

    let handler;
    const moduleBridge = { exports: {} };
    const captured = [];
    const sandbox = {
      process, require, module: moduleBridge, exports: moduleBridge.exports,
      console: { log: (...args) => captured.push(args.join(' ')) },
      Pulsar: { exportConfig: () => config, export: callback => { handler = callback; } }
    };
    vm.runInNewContext(fs.readFileSync(path.join(packageRoot, manifest.executable), 'utf8'), sandbox, { filename: 'pulsar-exporter-bundle.js' });
    const files = await handler(sdk, createMockContext());
    const componentFiles = files.filter(file => file.name.endsWith('.lite.tsx'));
    assert(!componentFiles.some(file => file.name === 'Alert.lite.tsx'), 'Alert must not be generated without a definition');
    assert.strictEqual(componentFiles.length, 6, 'Every component that carries a definition must still be exported');
    assert(captured.some(line => line.includes('skipped')), 'Skipped component count must be reported');
    assert(captured.some(line => line.includes('Alert')), 'Each skipped component must be named in the export log');

    const alertCatalogFile = files.find(file => file.name === 'components.catalog.json');
    assert(alertCatalogFile, 'components.catalog.json must be emitted');
    const catalogEntries = JSON.parse(alertCatalogFile.content);
    assert(catalogEntries.some(c => c.name === 'Alert'), 'Alert must be recorded in components.catalog.json even without mitosisDefinition');
    console.log('  ✓ Definition-less components skipped and reported without failing the export, but recorded in catalog\n');
  }

  console.log('🎉 All Mock Exporter tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('\n❌ Tests failed:', err);
  process.exit(1);
});
