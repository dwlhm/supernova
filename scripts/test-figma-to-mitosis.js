#!/usr/bin/env node

/**
 * Test & Smoke Check Suite for scripts/figma-to-mitosis.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mitosis = require('@builder.io/mitosis');

const {
  fetchFigmaNode,
  fetchFigmaNodesBatch,
  transpileFigmaNodeToMitosis,
  extractComponentProperties,
  selectBaselineVariant,
  generateVariantClassExpressions,
  mapAutoLayoutToTailwind,
  resolveColor,
  parseColorString,
  normalizeFigmaColor,
  loadTokens,
} = require('./figma-to-mitosis');

const rootDir = path.resolve(__dirname, '..');
const fixturePath = path.join(__dirname, 'fixtures', 'alert-dialog.figma.json');
const buttonFixturePath = path.join(__dirname, 'fixtures', 'button-set.figma.json');

console.log('🧪 Running Figma to Mitosis Transpiler Tests...\n');

// ---------------------------------------------------------------------------
// Test 1: Load sample fixture and transpile
// ---------------------------------------------------------------------------
console.log('Test 1: Verify transpileFigmaNodeToMitosis with Alert Dialog fixture');
const fixtureRaw = fs.readFileSync(fixturePath, 'utf8');
const fixtureJson = JSON.parse(fixtureRaw);

const emittedCode = transpileFigmaNodeToMitosis(fixtureJson, {
  componentName: 'AlertDialog',
});

// Check structure
assert(!emittedCode.includes('useStore'), 'Stateless generated components must not emit an unused store');
assert(emittedCode.includes('export interface AlertDialogProps {'), 'Must export Props interface');
assert(emittedCode.includes('title?: string;'), 'Must have title?: string');
assert(emittedCode.includes('description?: string;'), 'Must have description?: string');
assert(emittedCode.includes('showIcon?: boolean;'), 'Must have showIcon?: boolean');
assert(emittedCode.includes('variant?: "default" | "danger" | "warning";'), 'Must have variant union type');
assert(emittedCode.includes('confirmText?: string;'), 'Must have confirmText?: string');
assert(emittedCode.includes('cancelText?: string;'), 'Must have cancelText?: string');
assert(emittedCode.includes('onConfirm?: () => void;'), 'Must have onConfirm?: () => void');
assert(emittedCode.includes('onCancel?: () => void;'), 'Must have onCancel?: () => void');
assert(emittedCode.includes('export default function AlertDialog(props: AlertDialogProps) {'), 'Must export function component');

// Check Auto-Layout classes
assert(emittedCode.includes('flex flex-col gap-4 p-6 rounded-xl'), 'Must include root Auto-Layout classes');
assert(emittedCode.includes('border border-border-neutral'), 'Must resolve border token');
assert(emittedCode.includes('bg-background-primary'), 'Must resolve background primary token');
assert(emittedCode.includes('text-foreground-neutral-faded'), 'Must resolve foreground neutral faded token');

// Check Button interactions
assert(emittedCode.includes('onClick={() => props.onCancel?.()}'), 'Cancel button must have onCancel handler');
assert(emittedCode.includes('onClick={() => props.onConfirm?.()}'), 'Confirm button must have onConfirm handler');

// Check Boolean toggle
assert(emittedCode.includes('{props.showIcon !== false && ('), 'Must conditionally render showIcon');

console.log('  ✓ Generated .lite.tsx matches all required AST properties and token mappings\n');

// ---------------------------------------------------------------------------
// Test 2: Parse emitted .lite.tsx with @builder.io/mitosis
// ---------------------------------------------------------------------------
console.log('Test 2: Parse emitted .lite.tsx using mitosis.parseJsx()');
let parsedAst;
assert.doesNotThrow(() => {
  parsedAst = mitosis.parseJsx(emittedCode, { typescript: true });
}, 'mitosis.parseJsx must parse emitted code without error');

assert.strictEqual(parsedAst.name, 'AlertDialog', 'AST component name must be AlertDialog');
assert(parsedAst.children && parsedAst.children.length > 0, 'AST must contain root element');

// Test compilation into framework targets
const reactCode = mitosis.componentToReact({ typescript: true })({ component: parsedAst });
assert(reactCode && reactCode.includes('function AlertDialog'), 'Must compile to React');

const svelteCode = mitosis.componentToSvelte({ typescript: true })({ component: parsedAst });
assert(svelteCode && svelteCode.length > 0, 'Must compile to Svelte');

const vueCode = mitosis.componentToVue({ api: 'composition', typescript: true })({ component: parsedAst });
assert(vueCode && vueCode.includes('<template>'), 'Must compile to Vue composition API');
for (const generated of [reactCode, svelteCode, vueCode]) {
  assert(generated.includes('bg-background-primary'), 'Named background utility must survive framework generation');
  assert(generated.includes('border-border-neutral'), 'Named border utility must survive framework generation');
  assert(generated.includes('text-foreground-neutral-faded'), 'Named foreground utility must survive framework generation');
}

console.log('  ✓ mitosis.parseJsx successfully parsed AST and compiled to React, Svelte, Vue\n');

// ---------------------------------------------------------------------------
// Test 3: CLI execution with --fixture and --out
// ---------------------------------------------------------------------------
console.log('Test 3: Verify CLI execution (--fixture and --out)');
const tempOutDir = path.join(rootDir, 'output', 'test-figma-out');
const tempOutFile = path.join(tempOutDir, 'AlertDialog.lite.tsx');

try {
  fs.mkdirSync(tempOutDir, { recursive: true });
  execSync(
    `node "${path.join(__dirname, 'figma-to-mitosis.js')}" --fixture="${fixturePath}" --out="${tempOutFile}"`,
    { stdio: 'pipe' }
  );

  assert(fs.existsSync(tempOutFile), 'Output file must exist after CLI run');
  const writtenContent = fs.readFileSync(tempOutFile, 'utf8');
  assert(writtenContent.includes('export default function AlertDialog'), 'Written file must contain component');

  // Verify written file is also parseable
  const cliAst = mitosis.parseJsx(writtenContent, { typescript: true });
  assert.strictEqual(cliAst.name, 'AlertDialog');
  console.log('  ✓ CLI generated valid file from fixture\n');
} finally {
  if (fs.existsSync(tempOutDir)) {
    fs.rmSync(tempOutDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 4: Token loading and color resolution
// ---------------------------------------------------------------------------
console.log('Test 4: Verify token loading and context-aware color resolution');
const tokens = loadTokens();
assert(Array.isArray(tokens) && tokens.length > 0, 'Tokens must load from tokens.css/tokens.ts');

const bgPrimary = resolveColor({ type: 'SOLID', color: { r: 0.0039, g: 0.3058, b: 0.8823 } }, 'background', tokens);
assert.strictEqual(bgPrimary, 'bg-background-primary', 'Must resolve to background primary');

const borderNeutral = resolveColor({ type: 'SOLID', color: { r: 0.902, g: 0.91, b: 0.937 } }, 'border', tokens);
assert.strictEqual(borderNeutral, 'border-border-neutral', 'Must resolve to border neutral');

const textWhite = resolveColor({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'foreground', tokens);
assert.strictEqual(textWhite, 'text-white', 'Must resolve pure white to text-white');

console.log('  ✓ Token resolution and context tie-breaking pass\n');

// Color contract regression coverage
console.log('Color regressions: canonical RGBA, token identities, and exact fallbacks');
const colorToken = (varName, value) => ({ varName, cssVar: `var(${varName})`, ...parseColorString(value) });
const solidPaint = (value, opacity = 1) => {
  const color = parseColorString(value);
  return { type: 'SOLID', color: { r: color.r / 255, g: color.g / 255, b: color.b / 255, a: color.a }, opacity };
};
assert.deepStrictEqual(parseColorString('#abc'), parseColorString('#aabbcc'));
assert.deepStrictEqual(parseColorString('#abcd'), parseColorString('#aabbccdd'));
assert.deepStrictEqual(parseColorString('rgb(17 34 51 / 50%)'), parseColorString('rgba(17,34,51,0.5)'));
assert.deepStrictEqual(parseColorString('rgb(100% 0% 0%)'), parseColorString('#ff0000'));
assert.deepStrictEqual(parseColorString('rgb(50% 0% 0%)'), parseColorString('rgb(127.5,0,0)'));
assert.strictEqual(resolveColor(solidPaint('#800000'), 'border', [colorToken('--color-half-red', 'rgb(50% 0% 0%)')]), 'border-half-red');
for (const invalid of ['#12345', '#1234567', 'junk rgb(1,2,3)', 'rgb(256,0,0)', 'rgba(0,0,0,1.1)',
  'rgb(1..2,0,0)', 'rgb(0 0 0 /)', 'rgb(1,2,3) trailing', 'rgb(-1 0 0)', 'rgb(1,2,3,4,5)']) {
  assert.strictEqual(parseColorString(invalid), null, `Reject malformed color ${invalid}`);
}
assert.strictEqual(normalizeFigmaColor({ r: NaN, g: 0, b: 0 }), null);
assert.strictEqual(resolveColor({ type: 'GRADIENT_LINEAR' }), null);
assert.strictEqual(resolveColor({ ...solidPaint('#fff'), visible: false }), null);
assert.strictEqual(normalizeFigmaColor(solidPaint('rgba(17,34,51,0.5)', 0.4).color, 0.4).a, 0.2);
const regressionTokens = [
  colorToken('--color-white', '#fff'), colorToken('--color-black', '#000'),
  colorToken('--color-background-paper', '#fff'), colorToken('--color-foreground-ink', '#000'),
  colorToken('--color-border-paper', '#fff'), colorToken('--color-border-muted', '#11223380'),
];
for (const [context, prefix] of [['background', 'bg'], ['foreground', 'text'], ['border', 'border']]) {
  assert.strictEqual(resolveColor(solidPaint('#fff'), context, [regressionTokens[0]]), `${prefix}-white`);
  assert.strictEqual(resolveColor(solidPaint('#000'), context, [regressionTokens[1]]), `${prefix}-black`);
  assert.strictEqual(resolveColor(solidPaint('rgba(17,34,51,0.5)'), context, [regressionTokens[5]]), `${prefix}-border-muted`);
  assert.strictEqual(resolveColor(solidPaint('#abcdef'), context, regressionTokens), `${prefix}-[#abcdef]`);
  assert.strictEqual(resolveColor(solidPaint('rgba(17,34,51,0.5)', 0.4), context, regressionTokens), `${prefix}-[rgba(17,34,51,0.2)]`);
  assert.strictEqual(resolveColor(solidPaint('#fff', 0.99), context, regressionTokens), `${prefix}-[rgba(255,255,255,0.99)]`);
}
assert.strictEqual(resolveColor(solidPaint('#fff'), 'background', regressionTokens), 'bg-background-paper');
const boundPaper = { ...solidPaint('#fff'), boundVariables: { color: { name: 'Color/Background/Paper' } } };
assert.strictEqual(resolveColor(boundPaper, 'foreground', regressionTokens), 'text-background-paper');
assert.strictEqual(resolveColor({ ...boundPaper, opacity: 0.8 }, 'border', regressionTokens), 'border-[rgba(255,255,255,0.8)]');
assert.strictEqual(resolveColor({ ...solidPaint('#abcdef'), boundVariables: { color: { name: 'Missing/Color' } } }, 'border', regressionTokens), 'border-[#abcdef]');
assert.strictEqual(resolveColor({ ...solidPaint('#fff'), boundVariables: { color: { id: 'VariableID:42' } } }, 'border', regressionTokens), 'border-border-paper');
assert.strictEqual(resolveColor(solidPaint('#123456'), 'background', [colorToken('--custom-color', '#123456')]), 'bg-[var(--custom-color)]');

const cssTokens = loadTokens(path.join(rootDir, 'tokens', 'tokens.css'));
const tsTokens = loadTokens(path.join(rootDir, 'tokens', 'tokens.ts'));
assert.deepStrictEqual(loadTokens(), cssTokens, 'Default loading must retain authoritative CSS without TS duplicates');
assert(tsTokens.some((token) => token.varName === '--color-white'));
assert(!tsTokens.some((token) => token.tokenName === 'blue200'), 'Duplicate-value grouped blue identities must remain unresolved');
assert(tsTokens.some((token) => token.tokenName === 'blur' && cssTokens.some((cssToken) => cssToken.varName === token.varName)));
assert(tsTokens.some((token) => token.varName === '--color-foreground-neutral-2'), 'TS collision key must resolve to exported CSS suffix');
assert(!tsTokens.some((token) => token.varName.startsWith('--color-color-')));
assert(tsTokens.every((token) => cssTokens.some((cssToken) => cssToken.varName === token.varName)), 'Real TS names must correspond to exported CSS');
const os = require('os');
const tokenTestDir = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-color-tokens-'));
try {
  const tokenTestPath = path.join(tokenTestDir, 'tokens.json');
  fs.writeFileSync(tokenTestPath, JSON.stringify({ colors: { colorAccent: '#123456' }, typography: { colorFont: '#abcdef' } }));
  assert.deepStrictEqual(loadTokens(tokenTestPath).map((token) => token.varName), ['--color-accent'], 'Explicit JSON path must load only color records');
  fs.writeFileSync(path.join(tokenTestDir, 'tokens.css'), ':root { --color-accent: #ffffff; --color-blue-blue-200: #112233; --color-other-blue-200: #112233; --color-blue-blue-300: #223344; }');
  fs.writeFileSync(path.join(tokenTestDir, 'theme.css'), '@theme { --color-accent: #ffffff; --color-blue-blue-200: #112233; }');
  fs.writeFileSync(tokenTestPath, JSON.stringify({ colors: { colorAccent: '#123456', blue200: '#112233', blue300: '#223344' } }));
  const originalWarn = console.warn;
  const warnings = [];
  let explicitTokens;
  try {
    console.warn = (message) => warnings.push(message);
    explicitTokens = loadTokens(tokenTestPath);
  } finally {
    console.warn = originalWarn;
  }
  assert.deepStrictEqual(explicitTokens.map((token) => token.varName), ['--color-accent', '--color-blue-blue-300'], 'Unique grouped names resolve while ambiguous names must not invent utilities');
  assert.strictEqual(explicitTokens[0].r, 18, 'Explicit source must retain its value rather than sibling CSS value');
  assert(warnings.some((warning) => warning.includes('blue200') && warning.includes(tokenTestPath)), 'Ambiguous source identity must be reported');
} finally {
  fs.rmSync(tokenTestDir, { recursive: true, force: true });
}
const emptyPaletteSet = {
  type: 'COMPONENT_SET', componentPropertyDefinitions: {
    Theme: { type: 'VARIANT', defaultValue: 'Primary', variantOptions: ['Primary', 'Secondary', 'Danger', 'Warning', 'Success'] },
  }, children: [],
};
assert.deepStrictEqual(generateVariantClassExpressions(emptyPaletteSet, {}, { tokens: [] }).variantExpressions, [],
  'Variant option names alone must not invent semantic or hue palettes');
console.log('  ✓ Color syntax, opacity, identity, loader fidelity, and absent variant palettes verified\n');

// ---------------------------------------------------------------------------
// Test 5: fetchFigmaNode error handling
// ---------------------------------------------------------------------------
console.log('Test 5: Verify fetchFigmaNode parameter validation and error handling');

(async () => {
  // Missing fileId
  await assert.rejects(
    async () => fetchFigmaNode('', '1:2', 'token'),
    /Figma fileId is required/
  );

  // Missing nodeId
  await assert.rejects(
    async () => fetchFigmaNode('file123', '', 'token'),
    /Figma nodeId is required/
  );

  // Missing token
  const oldEnv = process.env.FIGMA_ACCESS_TOKEN;
  delete process.env.FIGMA_ACCESS_TOKEN;
  await assert.rejects(
    async () => fetchFigmaNode('file123', '1:2', ''),
    /Figma access token is required/
  );
  if (oldEnv) process.env.FIGMA_ACCESS_TOKEN = oldEnv;

  // Mock fetch responses for HTTP error handling
  const originalFetch = global.fetch;

  // 403 Forbidden
  global.fetch = async () => ({ status: 403, ok: false, statusText: 'Forbidden' });
  await assert.rejects(
    async () => fetchFigmaNode('file123', '1:2', 'bad-token'),
    /Invalid or unauthorized Figma access token \(HTTP 403\)/
  );

  // 404 Not Found
  global.fetch = async () => ({ status: 404, ok: false, statusText: 'Not Found' });
  await assert.rejects(
    async () => fetchFigmaNode('missing-file', '1:2', 'token'),
    /Figma file "missing-file" not found \(HTTP 404\)/
  );

  // 429 Rate Limit
  global.fetch = async () => ({ status: 429, ok: false, statusText: 'Too Many Requests' });
  await assert.rejects(
    async () => fetchFigmaNode('file123', '1:2', 'token'),
    /Figma API rate limit exceeded \(HTTP 429\)/
  );

  // Missing node in valid response
  global.fetch = async () => ({
    status: 200,
    ok: true,
    json: async () => ({ nodes: {} }),
  });
  await assert.rejects(
    async () => fetchFigmaNode('file123', 'node999', 'token'),
    /Figma node "node999" not found/
  );

  // Successful fetch
  global.fetch = async (url, opts) => {
    assert(opts.headers['X-Figma-Token'] === 'valid-token', 'X-Figma-Token header must be passed');
    assert(url.includes('files/file123/nodes?ids=1%3A2'), 'URL must encode fileId and nodeId');
    return {
      status: 200,
      ok: true,
      json: async () => ({
        nodes: {
          '1:2': {
            document: { id: '1:2', name: 'MockNode', type: 'COMPONENT' },
          },
        },
      }),
    };
  };
  const fetchedNode = await fetchFigmaNode('file123', '1:2', 'valid-token');
  assert.strictEqual(fetchedNode.name, 'MockNode');

  // Batch Fetch Tests: parameter validation & chunking
  await assert.rejects(
    async () => fetchFigmaNodesBatch('', ['1:2'], 'token'),
    /Figma fileId is required/
  );

  const emptyBatch = await fetchFigmaNodesBatch('file123', [], 'token');
  assert.deepStrictEqual(emptyBatch, {});

  delete process.env.FIGMA_ACCESS_TOKEN;
  await assert.rejects(
    async () => fetchFigmaNodesBatch('file123', ['1:2'], ''),
    /Figma access token is required/
  );
  if (oldEnv) process.env.FIGMA_ACCESS_TOKEN = oldEnv;

  // Batch chunking and merging (3 ids with chunkSize = 2 => 2 requests)
  const requestedUrls = [];
  global.fetch = async (url, opts) => {
    assert(opts.headers['X-Figma-Token'] === 'valid-token', 'X-Figma-Token header must be passed');
    requestedUrls.push(url);
    if (url.includes('1%3A1%2C1%3A2')) {
      return {
        status: 200,
        ok: true,
        json: async () => ({
          nodes: {
            '1:1': { document: { id: '1:1', name: 'Node1' } },
            '1:2': { document: { id: '1:2', name: 'Node2' } },
          },
        }),
      };
    }
    if (url.includes('1%3A3')) {
      return {
        status: 200,
        ok: true,
        json: async () => ({
          nodes: {
            '1:3': { document: { id: '1:3', name: 'Node3' } },
          },
        }),
      };
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const batchResults = await fetchFigmaNodesBatch('file123', ['1:1', '1:2', '1:3'], 'valid-token', 2);
  assert.strictEqual(requestedUrls.length, 2, 'Must split 3 nodes into 2 requests with chunkSize=2');
  assert.strictEqual(Object.keys(batchResults).length, 3, 'Must merge all 3 nodes');
  assert.strictEqual(batchResults['1:1'].document.name, 'Node1');
  assert.strictEqual(batchResults['1:2'].document.name, 'Node2');
  assert.strictEqual(batchResults['1:3'].document.name, 'Node3');

  // Rate limit 429 retry
  let attemptCount = 0;
  global.fetch = async () => {
    attemptCount++;
    if (attemptCount === 1) {
      return { status: 429, ok: false, statusText: 'Too Many Requests', headers: { get: () => '0' } };
    }
    return {
      status: 200,
      ok: true,
      json: async () => ({
        nodes: {
          '1:1': { document: { id: '1:1', name: 'NodeAfterRetry' } },
        },
      }),
    };
  };
  const retryResult = await fetchFigmaNodesBatch('file123', ['1:1'], 'valid-token', 50);
  assert.strictEqual(attemptCount, 2, 'Must retry on 429');
  assert.strictEqual(retryResult['1:1'].document.name, 'NodeAfterRetry');

  global.fetch = originalFetch;

  console.log('  ✓ Parameter validation, batch chunking, and HTTP error handling (403, 404, 429, 200) verified\n');

  // -------------------------------------------------------------------------
  // Test 6: COMPONENT_SET resolution (Button with variants)
  // -------------------------------------------------------------------------
  console.log('Test 6: Verify COMPONENT_SET node transpilation into Mitosis component');

  const buttonFixtureRaw = fs.readFileSync(buttonFixturePath, 'utf8');
  const buttonFixtureJson = JSON.parse(buttonFixtureRaw);

  // 6a: Test selectBaselineVariant unit helper
  const rawChildren = buttonFixtureJson.nodes['10:100'].document.children;
  const baseline = selectBaselineVariant(rawChildren);
  assert(baseline, 'selectBaselineVariant must return a child');
  assert.strictEqual(
    baseline.name,
    'Style=Primary, Size=Regular, State=Default',
    'selectBaselineVariant must select Primary Default Regular non-disabled child'
  );

  // 6b: Transpile Button COMPONENT_SET
  const buttonCode = transpileFigmaNodeToMitosis(buttonFixtureJson, {
    componentName: 'Button',
  });

  // Verify full TypeScript interface
  assert(buttonCode.includes('export interface ButtonProps {'), 'Must export ButtonProps interface');
  assert(
    buttonCode.includes('variant?: "Primary" | "Secondary" | "Outline" | "Ghost";'),
    'Must include canonical sanitized variant options in interface'
  );
  assert(
    buttonCode.includes('size?: "Small" | "Regular" | "Large";'),
    'Must include Size variant options in interface'
  );
  assert(buttonCode.includes('disabled?: boolean;'), 'Must include disabled?: boolean in interface');
  assert(buttonCode.includes('label?: string;'), 'Must include label?: string in interface');
  assert(buttonCode.includes('onClick?: (event?: any) => void;'), 'Must include onClick handler in interface');

  // Verify Root element is semantic <button> with button bindings
  assert(
    buttonCode.includes("<button type=\"button\" onClick={(e) => props.onClick?.(e)} disabled={props.disabled || props.state === 'Disabled'"),
    'Must render root as <button> tag with onClick and disabled bindings'
  );
  assert(
    buttonCode.includes('{props.label ?? props.children ?? "Button"}'),
    'Must bind label and children with nullish fallback'
  );

  // Verify baseline Auto-Layout classes adopted
  assert(
    buttonCode.includes('flex flex-row') && buttonCode.includes('rounded-lg') && buttonCode.includes('cursor-pointer'),
    'Must adopt baseline child Auto-Layout classes'
  );

  // Verify dynamic variant class expressions
  assert(
    buttonCode.includes("props.variant === 'Secondary'") || buttonCode.includes("props.style === 'Secondary'"),
    "Must include dynamic ternary condition for variant/style === 'Secondary'"
  );
  assert(
    buttonCode.includes("props.size === 'Large'"),
    "Must include dynamic ternary condition for props.size === 'Large'"
  );

  // 6c: Parse with @builder.io/mitosis parseJsx
  const buttonAst = mitosis.parseJsx(buttonCode, { typescript: true });
  assert.strictEqual(buttonAst.name, 'Button', 'AST component name must be Button');
  assert.strictEqual(buttonAst.children[0].name, 'button', 'Root AST tag must be button');
  assert(buttonAst.children[0].bindings.onClick, 'Root AST button must have onClick binding');
  assert(buttonAst.children[0].bindings.disabled, 'Root AST button must have disabled binding');

  // 6d: Framework compilation checks
  const reactButtonCode = mitosis.componentToReact({ typescript: true })({ component: buttonAst });
  assert(reactButtonCode.includes('function Button'), 'Must compile Button to React component');

  // 6e: CLI generation check
  const cliButtonDir = path.join(rootDir, 'output', 'test-button-out');
  const cliButtonFile = path.join(cliButtonDir, 'Button.lite.tsx');
  try {
    fs.mkdirSync(cliButtonDir, { recursive: true });
    execSync(
      `node "${path.join(__dirname, 'figma-to-mitosis.js')}" --fixture="${buttonFixturePath}" --out="${cliButtonFile}"`,
      { stdio: 'pipe' }
    );
    assert(fs.existsSync(cliButtonFile), 'CLI must output Button.lite.tsx file');
    const cliButtonContent = fs.readFileSync(cliButtonFile, 'utf8');
    assert(cliButtonContent.includes('export default function Button'), 'CLI file must contain Button component');
    const parsedCliAst = mitosis.parseJsx(cliButtonContent, { typescript: true });
    assert.strictEqual(parsedCliAst.name, 'Button');
  } finally {
    if (fs.existsSync(cliButtonDir)) {
      fs.rmSync(cliButtonDir, { recursive: true, force: true });
    }
  }

  console.log('  ✓ COMPONENT_SET transpiles to semantic Mitosis component with variant bindings and clean AST\n');

  // -------------------------------------------------------------------------
  // Test 7: Canonical prop names for Figma definitions and scene references
  // -------------------------------------------------------------------------
  console.log('Test 7: Verify canonical props without PascalCase aliases');

  const canonicalDefinitions = {
    'Caption Text#21:1': { type: 'TEXT', defaultValue: 'Upload a document' },
    'Show Caption#21:2': { type: 'BOOLEAN', defaultValue: false },
    'Show Details#21:3': { type: 'BOOLEAN', defaultValue: true },
    'Visual Size#21:4': { type: 'VARIANT', defaultValue: 'Regular', variantOptions: ['Regular', 'Large'] },
    'Style#21:5': { type: 'VARIANT', defaultValue: 'Primary', variantOptions: ['Primary', 'Secondary'] },
    'State#21:6': { type: 'VARIANT', defaultValue: 'Default', variantOptions: ['Default', 'Focus'] },
    'Is Active#21:7': { type: 'VARIANT', defaultValue: 'False', variantOptions: ['False', 'True'] },
  };
  const canonicalNames = ['captionText', 'showCaption', 'showDetails', 'visualSize', 'variant', 'state', 'isActive'];
  const captionNode = {
    type: 'TEXT', name: 'Caption', characters: 'Upload a document',
    componentPropertyReferences: {
      characters: 'Caption Text#21:1', visible: 'Show Caption#21:2',
    },
  };
  const detailsNode = {
    type: 'TEXT', name: 'Details', characters: 'File details',
    componentPropertyReferences: { visible: 'Show Details#21:3' },
  };

  for (const definitionShape of ['object', 'array']) {
    const componentPropertyDefinitions = definitionShape === 'object'
      ? canonicalDefinitions
      : Object.entries(canonicalDefinitions).map(([name, def]) => ({ name, ...def }));
    const canonicalNode = {
      type: 'COMPONENT_SET', name: 'Upload Panel', componentPropertyDefinitions,
      children: [{
        type: 'COMPONENT', name: 'Visual Size=Regular, Style=Primary, State=Default',
        fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.2, b: 0.3 } }],
        children: [captionNode, detailsNode],
      }, {
        type: 'COMPONENT', name: 'Visual Size=Large, Style=Secondary, State=Focus',
        fills: [{ type: 'SOLID', color: { r: 0.4, g: 0.5, b: 0.6 } }],
        children: [captionNode, detailsNode],
      }],
    };
    const props = extractComponentProperties(canonicalNode);
    assert.deepStrictEqual([...props.keys()], [...canonicalNames, 'children', 'className'],
      `${definitionShape} definitions must register exactly one canonical name per definition`);
    for (const [index, [rawKey, definition]] of Object.entries(canonicalDefinitions).entries()) {
      assert.strictEqual(props.get(canonicalNames[index]).defaultValue, definition.defaultValue,
        `${rawKey} must retain its default value`);
    }
    assert.strictEqual(props.get('captionText').tsType, 'string');
    assert.strictEqual(props.get('showCaption').tsType, 'boolean');
    assert.strictEqual(props.get('isActive').tsType, 'boolean');

    const canonicalCode = transpileFigmaNodeToMitosis(canonicalNode);
    const declarations = [...canonicalCode.matchAll(/^  (\w+)\?:/gm)].map((match) => match[1]);
    assert.deepStrictEqual(declarations, [...canonicalNames, 'children', 'className', 'id', 'ariaDescribedby', 'details'],
      `${definitionShape} output must emit only canonical interface declarations`);
    assert(canonicalCode.includes('visualSize?: "Regular" | "Large";'));
    assert(canonicalCode.includes('variant?: "Primary" | "Secondary";'));
    assert(canonicalCode.includes('state?: "Default" | "Focus";'));
    assert(canonicalCode.includes('{props.showCaption && ('), 'False visibility default must remain opt-in');
    assert(canonicalCode.includes('{props.showDetails !== false && ('), 'True visibility default must remain opt-out');
    assert(canonicalCode.includes('{props.captionText ?? "Upload a document"}'), 'Text binding must retain its fallback');
    assert(canonicalCode.includes("props.visualSize === 'Large'"), 'Spaced variant reference must use camelCase');
    assert(canonicalCode.includes("props.variant === 'Secondary'"), 'Reserved style reference must use sanitized name');
    assert(!/props\.[A-Z]/.test(canonicalCode), 'Rendered bindings must not reference PascalCase aliases');
    const canonicalAst = mitosis.parseJsx(canonicalCode, { typescript: true });
    const canonicalReact = mitosis.componentToReact({ typescript: true })({ component: canonicalAst });
    assert(canonicalReact.includes('props.captionText'), 'Canonical text binding must survive React generation');
    assert(canonicalReact.includes('props.showCaption'), 'Canonical visibility binding must survive React generation');
    const canonicalButtonCode = transpileFigmaNodeToMitosis({ ...canonicalNode, name: 'Upload Button' });
    assert(canonicalButtonCode.includes('state?: "Default" | "Focus" | "Disabled";'),
      'Button state must add Disabled to the canonical union when absent');
    assert(!/^  [A-Z]\w*\?:/m.test(canonicalButtonCode), 'Button interface must not emit PascalCase aliases');
  }
  assert(buttonCode.includes('state?: "Default" | "Hover" | "Focused" | "Disabled";'),
    'Button state must retain the Disabled union member');
  assert(!/^  [A-Z]\w*\?:/m.test(buttonCode), 'Button interface must not emit PascalCase aliases');
  console.log('  ✓ Object and array definitions preserve canonical declarations, types, defaults, bindings, and React output\n');

  // Text registry regressions: inferred APIs preserve scene defaults and independent labels.
  console.log('Test 8: Verify inferred text props, collisions, and button paths');
  const textNode = (name, characters, references) => ({ type: 'TEXT', name, characters,
    ...(references ? { componentPropertyReferences: references } : {}) });
  const textScene = {
    type: 'FRAME', name: 'Message Panel', componentPropertyDefinitions: {
      'Show Hint#31:1': { type: 'BOOLEAN', defaultValue: true },
      'Custom Caption#31:2': { type: 'TEXT', defaultValue: 'Defined caption' },
    }, children: [
      textNode('Show Hint', 'Visible hint', { visible: 'Show Hint#31:1' }),
      textNode('Label', 'First label'), textNode('Label', 'Second label'),
      textNode('Unrelated Name', 'Explicit caption', { characters: 'Custom Caption#31:2' }),
      textNode('Another Name', 'Repeated explicit caption', { characters: 'Custom Caption#31:2' }),
      textNode('Class', 'Reserved name'), textNode('123 heading', 'Leading digit'),
      textNode(undefined, 'Missing layer name'), textNode('!!!', 'Unusable name'),
      textNode('Verbatim Content', '  "quoted" {content}\nline  '),
    ],
  };
  const textCode = transpileFigmaNodeToMitosis(textScene);
  assert(textCode.includes('showHint?: boolean;') && textCode.includes('showHintContent?: string;'));
  assert(textCode.includes('{props.showHint !== false && ('), 'Visibility boolean must remain independent');
  for (const [name, fallback] of [
    ['showHintContent', 'Visible hint'], ['label', 'First label'], ['label2', 'Second label'],
    ['customCaption', 'Explicit caption'], ['customCaption', 'Repeated explicit caption'],
    ['classNameContent', 'Reserved name'], ['text', 'Leading digit'], ['text2', 'Missing layer name'],
    ['text3', 'Unusable name'], ['verbatimContent', '  "quoted" {content}\nline  '],
  ]) {
    assert(textCode.includes(`{props.${name} ?? ${JSON.stringify(fallback)}}`), `${name} must preserve its exact default`);
  }
  assert(!textCode.includes('unrelatedName?:') && !textCode.includes('anotherName?:'), 'Explicit references must win over inferred names');
  assert.throws(() => transpileFigmaNodeToMitosis({ ...textScene, children: [
    textNode('Caption', 'Invalid binding', { characters: 'Show Hint#31:1' }),
  ] }), /Text character binding "showHint" must resolve to a TEXT\/string definition/);
  assert.strictEqual(transpileFigmaNodeToMitosis({ ...textScene, children: textScene.children.map((child, index) => ({ ...child, id: `changed:${index}` })) }), textCode,
    'Inferred names must be independent of Figma IDs');
  const textAst = mitosis.parseJsx(textCode, { typescript: true });
  for (const compile of [
    mitosis.componentToReact({ typescript: true }), mitosis.componentToSvelte({ typescript: true }),
    mitosis.componentToVue({ api: 'composition', typescript: true }), mitosis.componentToVue({ version: 2, typescript: true }),
  ]) {
    const output = compile({ component: textAst });
    assert(output.includes('label2') && output.includes('verbatimContent') && output.includes('showHintContent'),
      'Independent override props must survive framework compilation');
  }
  const buttonScene = (children, extras = {}) => ({ type: 'COMPONENT', name: 'Action Button', children, ...extras });
  const soleLabelCode = transpileFigmaNodeToMitosis(buttonScene([textNode('Caption', '  Save now  ')]));
  assert(soleLabelCode.includes('{props.label ?? props.children ?? "  Save now  "}'));
  assert(!soleLabelCode.includes('caption?:'), 'Flattened button must not strand an inferred caption prop');
  const soleLabelBinding = mitosis.parseJsx(soleLabelCode, { typescript: true }).children[0].children
    .find((child) => child.bindings?._text)?.bindings._text.code;
  assert(soleLabelBinding, 'Flattened label must compile to a content binding');
  const evaluateLabel = new Function('props', `return (${soleLabelBinding});`);
  assert.strictEqual(evaluateLabel({ label: '', children: 'Child content' }), '', 'Empty string override must remain empty');
  assert.strictEqual(evaluateLabel({ children: '' }), '', 'Empty children override must remain empty');
  assert.strictEqual(evaluateLabel({}), '  Save now  ', 'Unset override must retain exact Figma whitespace');
  const booleanLabelCode = transpileFigmaNodeToMitosis(buttonScene([textNode('Caption', 'Separate label')], {
    componentPropertyDefinitions: { Label: { type: 'BOOLEAN', defaultValue: true } },
  }));
  assert(booleanLabelCode.includes('label?: boolean;') && booleanLabelCode.includes('labelContent?: string;'));
  assert(booleanLabelCode.includes('{props.labelContent ?? props.children ?? "Separate label"}'));
  const explicitButtonCode = transpileFigmaNodeToMitosis(buttonScene([textNode('Caption', 'Save', { characters: 'Action Caption#31:3' })]));
  assert(explicitButtonCode.includes('{props.actionCaption ?? "Save"}'));
  assert(!explicitButtonCode.includes('label?:'), 'Explicit sole button text must not allocate unused label convenience');
  const multiButtonCode = transpileFigmaNodeToMitosis(buttonScene([textNode('Label', 'Main'), textNode('Label', 'Subtitle')]));
  assert(multiButtonCode.includes('{props.label ?? "Main"}') && multiButtonCode.includes('{props.label2 ?? "Subtitle"}'));
  const hiddenButtonCode = transpileFigmaNodeToMitosis(buttonScene([textNode('Caption', 'Visible', { visible: 'Show Caption#31:4' })]));
  assert(hiddenButtonCode.includes('{props.showCaption !== false && (') && hiddenButtonCode.includes('{props.label ?? "Visible"}'));
  const nestedButtonCode = transpileFigmaNodeToMitosis({ type: 'FRAME', name: 'Actions', children: [
    buttonScene([textNode('Caption', 'Proceed')], { name: 'Confirm Button' }),
    buttonScene([textNode('Caption', 'Abort')], { name: 'Cancel Button' }),
    buttonScene([textNode('Caption', 'Explicit action', { characters: 'Explicit Action#31:5' })], { name: 'Confirm Button' }),
    buttonScene([textNode('Label', 'Primary action'), textNode('Label', 'Extra action')], { name: 'Confirm Button' }),
  ] });
  assert(nestedButtonCode.includes('{props.confirmText ?? "Proceed"}') && nestedButtonCode.includes('{props.cancelText ?? "Abort"}'));
  assert(nestedButtonCode.includes('{props.explicitAction ?? "Explicit action"}'));
  assert(nestedButtonCode.includes('{props.label ?? "Primary action"}') && nestedButtonCode.includes('{props.label2 ?? "Extra action"}'));
  assert(!nestedButtonCode.includes('confirmText2?:'), 'Multi-text/explicit action buttons must not allocate unused convenience props');
  assert.doesNotThrow(() => mitosis.parseJsx(nestedButtonCode, { typescript: true }));
  const noLabelCode = transpileFigmaNodeToMitosis(buttonScene([]));
  assert(noLabelCode.includes("{props.label ?? props.children ?? 'Button'}"));
  console.log('  ✓ Text defaults, canonical names, independent overrides, buttons, and framework compilation covered\n');

  console.log('Test 9: Verify safe root accessibility hooks and native buttons');
  const accessibilityFrame = transpileFigmaNodeToMitosis({ type: 'FRAME', name: 'Container', children: [
    textNode('Id', 'Layer identity'), textNode('Aria Describedby', 'Layer description'),
    buttonScene([textNode('Caption', 'Nested action')]),
  ] });
  assert(accessibilityFrame.includes('id?: string;') && accessibilityFrame.includes('ariaDescribedby?: string;'));
  assert(accessibilityFrame.includes('idContent?: string;') && accessibilityFrame.includes('ariaDescribedbyContent?: string;'),
    'Text names must not hijack root accessibility hooks');
  assert(!accessibilityFrame.includes('ariaLabel?:') && !accessibilityFrame.includes('aria-label='));
  assert.strictEqual((accessibilityFrame.match(/id=\{props.id\}/g) || []).length, 1, 'ID belongs only on the root');
  assert.strictEqual((accessibilityFrame.match(/aria-describedby=\{props.ariaDescribedby\}/g) || []).length, 1);
  assert(accessibilityFrame.includes('<div id={props.id} aria-describedby={props.ariaDescribedby}'));
  for (const source of [soleLabelCode, explicitButtonCode, multiButtonCode, hiddenButtonCode, nestedButtonCode, noLabelCode, accessibilityFrame]) {
    assert(!source.includes('focus:outline-none'), 'Retain browser focus outline');
    assert(!/<button(?! type="button")/.test(source), 'Every generated native button needs explicit non-submit type');
    assert(!source.includes('tabIndex=') && !source.includes('role='), 'Do not invent focusability or widget roles');
  }
  assert(soleLabelCode.includes('aria-label={props.ariaLabel} aria-labelledby={props.ariaLabelledby}'));
  assert(!nestedButtonCode.includes('aria-label='), 'Nested buttons must not inherit root hooks');
  const rootTextCode = transpileFigmaNodeToMitosis(textNode('Statement', 'Root content'));
  assert(rootTextCode.includes('<p id={props.id} aria-describedby={props.ariaDescribedby}'));
  assert(!rootTextCode.includes('aria-label=') && !rootTextCode.includes('aria-labelledby='));
  const explicitGenericName = transpileFigmaNodeToMitosis({ type: 'FRAME', name: 'Container', children: [],
    componentPropertyDefinitions: { 'Aria Label': { type: 'TEXT', defaultValue: 'Design content' } },
  });
  assert(explicitGenericName.includes('ariaLabel?: string;') && !explicitGenericName.includes('aria-label='),
    'Explicit design naming prop must not give generic root unsupported naming attributes');
  for (const [name, definition] of [
    ['Id', { type: 'BOOLEAN', defaultValue: true }],
    ['Aria Describedby', { type: 'VARIANT', variantOptions: ['First', 'Second'] }],
    ['Aria Label', { type: 'BOOLEAN', defaultValue: true }],
    ['Aria Labelledby', { type: 'VARIANT', variantOptions: ['First', 'Second'] }],
  ]) {
    assert.throws(() => transpileFigmaNodeToMitosis(buttonScene([], { componentPropertyDefinitions: { [name]: definition } })),
      /Root accessibility prop .* must be a TEXT\/string definition/, 'Incompatible root hook contracts must fail explicitly');
  }
  assert.doesNotThrow(() => transpileFigmaNodeToMitosis(buttonScene([], { componentPropertyDefinitions: {
    Id: { type: 'TEXT', defaultValue: 'Root identity' }, 'Aria Label': { type: 'TEXT', defaultValue: 'Accessible action' },
  } })));
  for (const compile of [
    mitosis.componentToReact({ typescript: true }), mitosis.componentToSvelte({ typescript: true }),
    mitosis.componentToVue({ api: 'composition', typescript: true }), mitosis.componentToVue({ version: 2, typescript: true }),
  ]) {
    const output = compile({ component: mitosis.parseJsx(soleLabelCode, { typescript: true }) });
    assert(output.includes('aria-describedby') && output.includes('aria-label') && output.includes('aria-labelledby'));
    assert(output.includes('type="button"'), 'Native button type must survive framework generation');
  }
  console.log('  ✓ Root hook destinations, prop contracts, native button semantics, and framework outputs covered\n');

  console.log('🎉 All Figma to Mitosis tests passed successfully!\n');
})().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
