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
      'index.ts'
    ];

    for (const file of expectedFiles) {
      const fullPath = path.join(tempDir, file);
      assert(fs.existsSync(fullPath), `Expected file missing: ${file}`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert(content.length > 20, `File is empty or truncated: ${file}`);
    }

    // Verify custom attribute injection on Card
    const cardContent = fs.readFileSync(path.join(tempDir, 'components/Card.lite.tsx'), 'utf-8');
    assert(cardContent.includes('testId?: string'), 'CardProps should include injected testId prop');
    assert(cardContent.includes('data-testid={props.testId}'), 'Card JSX should include data-testid attribute');

    // Verify multi-element structure on StatusBadge
    const sbContent = fs.readFileSync(path.join(tempDir, 'components/StatusBadge.lite.tsx'), 'utf-8');
    assert(sbContent.includes('{props.icon}'), 'StatusBadge should render icon child');
    assert(sbContent.includes('{props.text}'), 'StatusBadge should render text child');
    assert(sbContent.includes('data-testid={props.testId}'), 'StatusBadge should include custom attribute');

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
  assert.strictEqual(files.length, 11, 'Sandbox export must include components, tokens, runtime and barrel');
  for (const name of ['Button', 'Card', 'StatusBadge', 'Badge', 'Input', 'Typography']) {
    assert(files.some(file => file.name === `${name}.lite.tsx` && file.content.includes('export default function')), `Missing generated sandbox component ${name}`);
  }
  for (const name of ['tokens.ts', 'tokens.css', 'theme.css', 'component-runtime.ts', 'index.ts']) assert(files.some(file => file.name === name), `Missing sandbox artifact ${name}`);
  const themedFiles = await handler(new MockSupernova(), createMockContext({ themeId: 'theme-dark' }));
  assert.strictEqual(themedFiles.length, 11, 'Dark-theme sandbox must retain all artifacts');
  assert(themedFiles.find(file => file.name === 'tokens.ts').content.includes('#0f172a'), 'Dark-theme token override must be emitted inside VM');
  assert.strictEqual(process.browser, originalBrowser, 'Themed export must leave host process unchanged');
  console.log('  ✓ VM loaded and exported all 11 artifacts without filename globals or host process mutation\n');

  console.log('🎉 All Mock Exporter tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('\n❌ Tests failed:', err);
  process.exit(1);
});
