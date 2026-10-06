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
assert(emittedCode.includes("import { useStore } from '@builder.io/mitosis';"), 'Must import useStore');
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
assert(emittedCode.includes('border border-[var(--color-border-neutral)]'), 'Must resolve border token');
assert(emittedCode.includes('bg-[var(--color-background-primary)]'), 'Must resolve background primary token');
assert(emittedCode.includes('text-[var(--color-foreground-neutral-faded)]'), 'Must resolve foreground neutral faded token');

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
assert.strictEqual(bgPrimary, 'bg-[var(--color-background-primary)]', 'Must resolve to background primary');

const borderNeutral = resolveColor({ type: 'SOLID', color: { r: 0.902, g: 0.91, b: 0.937 } }, 'border', tokens);
assert.strictEqual(borderNeutral, 'border-[var(--color-border-neutral)]', 'Must resolve to border neutral');

const textWhite = resolveColor({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'foreground', tokens);
assert.strictEqual(textWhite, 'text-white', 'Must resolve pure white to text-white');

console.log('  ✓ Token resolution and context tie-breaking pass\n');

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
    buttonCode.includes('Style?: "Primary" | "Secondary" | "Outline" | "Ghost";') ||
      buttonCode.includes('style?: "Primary" | "Secondary" | "Outline" | "Ghost";'),
    'Must include Style variant options in interface'
  );
  assert(
    buttonCode.includes('Size?: "Small" | "Regular" | "Large";') ||
      buttonCode.includes('size?: "Small" | "Regular" | "Large";'),
    'Must include Size variant options in interface'
  );
  assert(buttonCode.includes('disabled?: boolean;'), 'Must include disabled?: boolean in interface');
  assert(buttonCode.includes('label?: string;'), 'Must include label?: string in interface');
  assert(buttonCode.includes('onClick?: (event?: any) => void;'), 'Must include onClick handler in interface');

  // Verify Root element is semantic <button> with button bindings
  assert(
    buttonCode.includes("<button onClick={(e) => props.onClick?.(e)} disabled={props.disabled || props.state === 'Disabled'"),
    'Must render root as <button> tag with onClick and disabled bindings'
  );
  assert(
    buttonCode.includes("{props.label || props.children || 'Button'}"),
    "Must bind {props.label || props.children || 'Button'}"
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

  console.log('🎉 All Figma to Mitosis tests passed successfully!\n');
})().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
