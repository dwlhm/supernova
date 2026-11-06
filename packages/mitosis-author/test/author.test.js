import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import {
  getAuthorConfig,
  createAuthorTools,
  buildAuthorUserPrompt,
  buildAuthorSystemPrompt,
  SYSTEM_PROMPT,
  compactComponentSpec,
  compactTokens,
  buildComponentBlueprint,
} from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = resolve(__dirname, '../dist/cli.js');

function runCliSubprocess(payload, env = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [cliPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString('utf-8');
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString('utf-8');
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('close', (code) => {
      resolvePromise({ code, stdout, stderr });
    });

    if (payload !== undefined && payload !== null) {
      child.stdin.write(
        typeof payload === 'string' ? payload : JSON.stringify(payload)
      );
    }
    child.stdin.end();
  });
}

describe('Mitosis Author - Config & Environment Guards', () => {
  // These cases exercise the openai provider; a developer shell may export LLM_PROVIDER/AGY_MODEL from .env.
  const isolated = ['LLM_PROVIDER', 'AGY_MODEL'];
  let saved = {};
  beforeEach(() => {
    saved = Object.fromEntries(isolated.map((k) => [k, process.env[k]]));
    for (const k of isolated) delete process.env[k];
  });
  afterEach(() => {
    for (const k of isolated) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it('throws an explicit error when LLM_BASE_URL is missing', () => {
    const oldBase = process.env.LLM_BASE_URL;
    const oldKey = process.env.LLM_API_KEY;
    const oldModel = process.env.LLM_MODEL;

    delete process.env.LLM_BASE_URL;
    process.env.LLM_API_KEY = 'test-key';
    process.env.LLM_MODEL = 'gpt-4o-mini';

    try {
      assert.throws(
        () => getAuthorConfig(),
        /Missing required environment variable: LLM_BASE_URL/
      );
    } finally {
      if (oldBase) process.env.LLM_BASE_URL = oldBase;
      if (oldKey) process.env.LLM_API_KEY = oldKey;
      if (oldModel) process.env.LLM_MODEL = oldModel;
    }
  });

  it('throws an explicit error when LLM_API_KEY is missing', () => {
    const oldBase = process.env.LLM_BASE_URL;
    const oldKey = process.env.LLM_API_KEY;
    const oldModel = process.env.LLM_MODEL;

    process.env.LLM_BASE_URL = 'http://localhost:11434/v1';
    delete process.env.LLM_API_KEY;
    process.env.LLM_MODEL = 'gpt-4o-mini';

    try {
      assert.throws(
        () => getAuthorConfig(),
        /Missing required environment variable: LLM_API_KEY/
      );
    } finally {
      if (oldBase) process.env.LLM_BASE_URL = oldBase;
      if (oldKey) process.env.LLM_API_KEY = oldKey;
      if (oldModel) process.env.LLM_MODEL = oldModel;
    }
  });

  it('throws an explicit error when LLM_MODEL is missing', () => {
    const oldBase = process.env.LLM_BASE_URL;
    const oldKey = process.env.LLM_API_KEY;
    const oldModel = process.env.LLM_MODEL;

    process.env.LLM_BASE_URL = 'http://localhost:11434/v1';
    process.env.LLM_API_KEY = 'test-key';
    delete process.env.LLM_MODEL;

    try {
      assert.throws(
        () => getAuthorConfig(),
        /Missing required environment variable: LLM_MODEL/
      );
    } finally {
      if (oldBase) process.env.LLM_BASE_URL = oldBase;
      if (oldKey) process.env.LLM_API_KEY = oldKey;
      if (oldModel) process.env.LLM_MODEL = oldModel;
    }
  });

  it('returns valid AuthorConfig when all variables are present', () => {
    const oldBase = process.env.LLM_BASE_URL;
    const oldKey = process.env.LLM_API_KEY;
    const oldModel = process.env.LLM_MODEL;
    const oldSession = process.env.OPENCODE_SESSION;

    process.env.LLM_BASE_URL = 'http://localhost:11434/v1';
    process.env.LLM_API_KEY = 'test-key';
    process.env.LLM_MODEL = 'gpt-4o-mini';
    delete process.env.OPENCODE_SESSION;

    try {
      const cfg = getAuthorConfig();
      assert.equal(cfg.baseUrl, 'http://localhost:11434/v1');
      assert.equal(cfg.apiKey, 'test-key');
      assert.equal(cfg.model, 'gpt-4o-mini');
      assert.equal(cfg.session, 'supernova');
    } finally {
      if (oldBase) process.env.LLM_BASE_URL = oldBase;
      if (oldKey) process.env.LLM_API_KEY = oldKey;
      if (oldModel) process.env.LLM_MODEL = oldModel;
      if (oldSession) process.env.OPENCODE_SESSION = oldSession;
    }
  });
});

describe('Mitosis Author - Manifest Compaction', () => {
  it('compactComponentSpec extracts clean properties and variant count while omitting bulky AST', () => {
    const mockSpec = {
      name: 'ButtonPrimary',
      description: 'Primary action button',
      componentPropertyDefinitions: {
        'Size#100': {
          type: 'VARIANT',
          defaultValue: 'medium',
          variantOptions: ['small', 'medium', 'large'],
        },
        'Disabled#101': {
          type: 'BOOLEAN',
          defaultValue: false,
        },
        'Label#102': {
          type: 'TEXT',
          defaultValue: 'Click me',
        },
      },
      document: {
        children: new Array(18).fill({ type: 'COMPONENT', name: 'Variant' }),
      },
    };

    const compact = compactComponentSpec(mockSpec);
    assert.equal(compact.name, 'ButtonPrimary');
    assert.equal(compact.description, 'Primary action button');
    assert.equal(compact.variantCount, 18);

    // Cleans up Figma hash suffix
    assert.ok(compact.properties['Size']);
    assert.equal(compact.properties['Size'].type, 'VARIANT');
    assert.equal(compact.properties['Size'].defaultValue, 'medium');
    assert.deepEqual(compact.properties['Size'].variantOptions, [
      'small',
      'medium',
      'large',
    ]);

    assert.ok(compact.properties['Disabled']);
    assert.equal(compact.properties['Disabled'].defaultValue, false);

    assert.ok(compact.properties['Label']);
    assert.equal(compact.properties['Label'].defaultValue, 'Click me');

    // Asserts compact serialized JSON is small (< 500 bytes)
    const jsonStr = JSON.stringify(compact);
    assert.ok(jsonStr.length < 500, `Expected < 500 chars, got ${jsonStr.length}`);
  });

  it('compactTokens normalizes array and object tokens into clean { name, type, value }', () => {
    const arrayTokens = [
      {
        id: 'tok-1',
        name: 'color/primary',
        type: 'color',
        value: '#2563eb',
        description: 'Primary brand color',
        metadata: { extra: 'bulk' },
      },
      {
        id: 'tok-2',
        name: 'spacing/md',
        type: 'spacing',
        value: '16px',
      },
    ];

    const compactArr = compactTokens(arrayTokens);
    assert.equal(compactArr.length, 2);
    assert.deepEqual(compactArr[0], {
      name: 'color/primary',
      type: 'color',
      value: '#2563eb',
    });
    assert.deepEqual(compactArr[1], {
      name: 'spacing/md',
      type: 'spacing',
      value: '16px',
    });

    const dictTokens = {
      'color/secondary': {
        type: 'color',
        value: '#64748b',
      },
      'borderRadius/lg': '8px',
    };

    const compactDict = compactTokens(dictTokens);
    assert.equal(compactDict.length, 2);
    assert.deepEqual(compactDict[0], {
      name: 'color/secondary',
      type: 'color',
      value: '#64748b',
    });
    assert.deepEqual(compactDict[1], {
      name: 'borderRadius/lg',
      type: 'string',
      value: '8px',
    });
  });

  it('buildAuthorUserPrompt yields >95% prompt size reduction compared to raw AST dump', () => {
    const fixturePath = resolve(__dirname, 'fixtures/ButtonPrimary.figma.json');
    const rawFixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
    const rawAstString = JSON.stringify(rawFixture, null, 2);

    const prompt = buildAuthorUserPrompt({
      componentName: 'ButtonPrimary',
      componentSpec: rawFixture,
      tokens: [
        { name: 'color/primary', type: 'color', value: '#2563eb' },
        { name: 'color/secondary', type: 'color', value: '#64748b' },
      ],
    });

    // The raw AST string is > 100 KB (over 100,000 characters)
    assert.ok(rawAstString.length > 100000, `Raw AST was ${rawAstString.length} chars`);

    // The compact prompt should be < 5 KB (under 5,000 characters)
    assert.ok(prompt.length < 5000, `Expected < 5000 chars, got ${prompt.length}`);

    // Reduction is > 95%
    const reductionPercent =
      ((rawAstString.length - prompt.length) / rawAstString.length) * 100;
    assert.ok(
      reductionPercent > 95,
      `Expected reduction > 95%, got ${reductionPercent.toFixed(2)}%`
    );
  });

  it('buildAuthorUserPrompt formats tokenClasses into categorized role sections', () => {
    const tokenClasses = [
      'bg-primary-default',
      'hover:bg-primary-hover',
      'text-foreground-default',
      'border-border-default',
      'ring-focus-ring-primary',
      'rounded-md',
      'shadow-sm',
      'p-4',
      'gap-2',
      'cursor-pointer',
    ];

    const prompt = buildAuthorUserPrompt({
      componentName: 'CustomButton',
      tokenClasses,
    });

    assert.match(prompt, /Available Token Classes:/);
    assert.match(prompt, /- Backgrounds: bg-primary-default, hover:bg-primary-hover/);
    assert.match(prompt, /- Foregrounds\/Text: text-foreground-default/);
    assert.match(prompt, /- Borders: border-border-default/);
    assert.match(prompt, /- Focus Rings: ring-focus-ring-primary/);
    assert.match(prompt, /- Radii: rounded-md/);
    assert.match(prompt, /- Shadows: shadow-sm/);
    assert.match(prompt, /- Spacing: p-4, gap-2/);
    assert.match(prompt, /- Other: cursor-pointer/);
    assert.match(
      prompt,
      /Components must use classes from the Available Token Classes catalog \(zero arbitrary color classes or unmapped classes\)\./
    );
  });
});

describe('Mitosis Author - readComponentDetails Tool', () => {
  it('returns layout, visual styles, properties, and child slots for a component', async () => {
    const mockSpec = {
      name: 'ButtonPrimary',
      description: 'Primary button',
      properties: {
        variant: { type: 'VARIANT', defaultValue: 'solid', variantOptions: ['solid', 'outline'] },
      },
      node: {
        type: 'COMPONENT_SET',
        layoutMode: 'HORIZONTAL',
        itemSpacing: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        cornerRadius: 6,
        children: [
          {
            name: 'variant=solid',
            type: 'COMPONENT',
            layoutMode: 'HORIZONTAL',
            primaryAxisAlignItems: 'CENTER',
            counterAxisAlignItems: 'CENTER',
            itemSpacing: 8,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
            cornerRadius: 6,
            fills: [{ type: 'SOLID', color: { r: 0.14, g: 0.38, b: 0.92 }, visible: true }],
            children: [
              {
                name: 'Label',
                type: 'TEXT',
                characters: 'Button',
              },
            ],
          },
          {
            name: 'variant=outline',
            type: 'COMPONENT',
            layoutMode: 'HORIZONTAL',
            cornerRadius: 6,
            strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 }, visible: true }],
            children: [
              {
                name: 'Label',
                type: 'TEXT',
                characters: 'Button',
              },
            ],
          },
        ],
      },
    };

    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      rawSpecs: {
        ButtonPrimary: mockSpec,
      },
    };

    const tools = createAuthorTools(context);

    // Call readComponentDetails
    const res = await tools.readComponentDetails.execute({
      componentName: 'ButtonPrimary',
    });

    assert.equal(res.found, true);
    assert.equal(res.componentName, 'ButtonPrimary');
    assert.equal(res.totalVariants, 2);
    assert.ok(res.layout);
    assert.equal(res.layout.layoutMode, 'HORIZONTAL');
    assert.equal(res.layout.itemSpacing, 8);
    assert.deepEqual(res.layout.padding, { left: 16, right: 16, top: 8, bottom: 8 });
    assert.equal(res.visual.cornerRadius, 6);
    assert.ok(Array.isArray(res.childSlots));
    assert.equal(res.childSlots[0].textContent, 'Button');
    assert.ok(Array.isArray(res.variantMatrix));
    assert.equal(res.variantMatrix.length, 2);
    assert.equal(res.variantMatrix[1].name, 'variant=outline');
    assert.ok(res.variantMatrix[1].visual.strokes);
  });

  it('returns clear error when component does not exist in rawSpecs', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      rawSpecs: {
        ExistingComp: { name: 'ExistingComp' },
      },
    };

    const tools = createAuthorTools(context);

    const res = await tools.readComponentDetails.execute({
      componentName: 'MissingComp',
    });

    assert.equal(res.found, false);
    assert.match(res.error, /Component specification for "MissingComp" not found/);
    assert.match(res.error, /ExistingComp/);
  });

  it('returns clear error when rawSpecs is undefined in context', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
    };

    const tools = createAuthorTools(context);

    const res = await tools.readComponentDetails.execute({
      componentName: 'AnyComp',
    });

    assert.equal(res.found, false);
    assert.match(res.error, /No raw specifications available in context/);
  });
});

describe('Mitosis Author - SYSTEM_PROMPT Engineering Standards', () => {
  it('encodes canonical Mitosis authoring best practices', () => {
    assert.match(SYSTEM_PROMPT, /Single-Source Mitosis JSX/);
    assert.match(SYSTEM_PROMPT, /useStore/);
    assert.match(SYSTEM_PROMPT, /useDefaultProps/);
    assert.match(SYSTEM_PROMPT, /state\.propName/);
    assert.match(SYSTEM_PROMPT, /NEVER use React hooks \(useState, useEffect/);
    assert.match(SYSTEM_PROMPT, /<Show when=\{/);
    assert.match(SYSTEM_PROMPT, /<For each=\{/);
    assert.match(SYSTEM_PROMPT, /type="button"/);
    assert.match(SYSTEM_PROMPT, /focus:outline-none focus:ring-2 focus:ring-offset-2/);
    assert.match(SYSTEM_PROMPT, /HORIZONTAL -> flex flex-row/);
    assert.match(SYSTEM_PROMPT, /ZERO ARBITRARY BRACKET CLASSES/);
    assert.match(SYSTEM_PROMPT, /testCompile/);
  });

  it('mandates cn utility invariant and disallows manual string concatenation', () => {
    assert.match(SYSTEM_PROMPT, /import \{ cn \} from '\.\/utils';/);
    assert.match(
      SYSTEM_PROMPT,
      /class=\{cn\('base-classes', state\.variantClasses, state\.sizeClasses, props\.className\)\}/
    );
    assert.match(SYSTEM_PROMPT, /Never use manual string concatenation/i);
  });

  it('mandates headless architecture directives (Zag.js, TanStack Table, declarative charts)', () => {
    assert.match(SYSTEM_PROMPT, /Zag\.js/);
    assert.match(SYSTEM_PROMPT, /@tanstack\/table-core/);
    assert.match(SYSTEM_PROMPT, /declarative visualization engine models/i);
  });

  it('documents production-tested headless helpers in ./utils in buildAuthorSystemPrompt()', () => {
    const prompt = buildAuthorSystemPrompt();
    assert.match(prompt, /Headless Architecture Directives & Available Helpers in "\.\/utils"/);
    assert.match(prompt, /createDialogState/);
    assert.match(prompt, /createTabsState/);
    assert.match(prompt, /sortTableRows/);
    assert.match(prompt, /getVirtualWindow/);
    assert.match(prompt, /getSmoothBezierPath/);
    assert.match(prompt, /getPieSlices/);
    assert.match(prompt, /import headless helpers alongside cn from '\.\/utils'/);
  });

  it('mandates SSR and React Server Components (RSC) invariants and keyword safety', () => {
    assert.match(SYSTEM_PROMPT, /browser globals \(window, document, localStorage/i);
    assert.match(SYSTEM_PROMPT, /hydration mismatch/i);
    assert.match(SYSTEM_PROMPT, /Client Components \("use client";\)/i);
    assert.match(SYSTEM_PROMPT, /True Server Components \(RSC\)/i);
    assert.match(SYSTEM_PROMPT, /NEVER declare props named "class", "style", or "key"/);
  });

  it('contains canonical component template illustrating cn and headless patterns', () => {
    assert.match(SYSTEM_PROMPT, /CANONICAL COMPONENT TEMPLATE/);
    assert.match(SYSTEM_PROMPT, /export default function Button\(props: ButtonProps\)/);
  });

  it('mandates composition-only compounds, zero mock data, and no visual state props in section 6', () => {
    assert.match(SYSTEM_PROMPT, /ARCHITECTURE OVER FIGMA FIDELITY/);
    assert.match(SYSTEM_PROMPT, /Composition-Only Compound Components/);
    assert.match(SYSTEM_PROMPT, /Item Components Own Per-Item State/);
    assert.match(SYSTEM_PROMPT, /Size Budget: Every \.lite\.tsx stays within 80 non-blank lines/);
    assert.doesNotMatch(SYSTEM_PROMPT, /declarative data-array props as a fallback/);
    assert.match(SYSTEM_PROMPT, /Sibling Composition/);
    assert.match(SYSTEM_PROMPT, /State vs Prop Rule/);
    assert.match(SYSTEM_PROMPT, /Zero Mock\/Demo Data/);
    assert.match(SYSTEM_PROMPT, /Data-Driven Rendering/);
    assert.match(SYSTEM_PROMPT, /Zero Color Literals/);
    assert.match(SYSTEM_PROMPT, /Strict No-Any Rule/);
  });

  it('mandates cross-framework prompt guards in buildAuthorSystemPrompt()', () => {
    const prompt = buildAuthorSystemPrompt();
    assert.equal(prompt, SYSTEM_PROMPT);

    // Mentions avoiding JSX prop values
    assert.match(prompt, /NEVER pass JSX elements as prop values/);
    assert.match(prompt, /nested JSX prop values/);

    // Mentions avoiding shadowing prop names (Svelte ReferenceError)
    assert.match(prompt, /NEVER shadow prop names with local variable declarations/);
    assert.match(prompt, /ReferenceError: Cannot access 'values' before initialization/);

    // Mentions using onInput for text inputs and textareas
    assert.match(prompt, /NEVER use onChange on text inputs or textareas/);
    assert.match(prompt, /ALWAYS use onInput for <input type="text/);
    assert.match(prompt, /onInput.*<textarea>/s);
  });
});

describe('Mitosis Author - Tools', () => {
  it('testCompile verifies valid Mitosis JSX in-memory', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      lastCompiledSource: {},
    };
    const tools = createAuthorTools(context);

    const validSource = `
      import { useStore } from '@builder.io/mitosis';
      export default function TestComp(props: { label?: string }) {
        const state = useStore({ count: 0 });
        return <button>{props.label || 'Hello'} - {state.count}</button>;
      }
    `;

    const res = await tools.testCompile.execute({
      componentName: 'TestComp',
      source: validSource,
    });

    assert.equal(res.success, true);
    assert.deepEqual(res.errors, []);
    assert.equal(context.lastCompiledSource['TestComp'], validSource);
  });

  it('testCompile verifies Mitosis component importing cn from ./utils across 6 targets', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      lastCompiledSource: {},
    };
    const tools = createAuthorTools(context);

    const sourceWithCn = `
      import { useStore, useDefaultProps } from '@builder.io/mitosis';
      import { cn } from './utils';

      export interface BadgeProps {
        variant?: 'success' | 'warning';
        className?: string;
        children?: any;
      }

      export default function Badge(props: BadgeProps) {
        useDefaultProps({
          variant: 'success',
          className: '',
        });

        const state = useStore({
          get badgeClasses() {
            return props.variant === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
          },
        });

        return (
          <span class={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', state.badgeClasses, props.className)}>
            {props.children}
          </span>
        );
      }
    `;

    const res = await tools.testCompile.execute({
      componentName: 'Badge',
      source: sourceWithCn,
    });

    assert.equal(res.success, true);
    assert.deepEqual(res.errors, []);
    assert.equal(context.lastCompiledSource['Badge'], sourceWithCn);
  });

  it('testCompile returns error on invalid Mitosis JSX', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      lastCompiledSource: {},
    };
    const tools = createAuthorTools(context);

    const res = await tools.testCompile.execute({
      componentName: 'BrokenComp',
      source: 'export default function Broken() { return <div><invalid syntax',
    });

    assert.equal(res.success, false);
    assert.ok(res.errors && res.errors.length > 0);
  });

  it('testCompile rejects source with unauthorized any via lint check', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      lastCompiledSource: {},
    };
    const tools = createAuthorTools(context);

    const sourceWithIllegalAny = `
      export default function Comp(props: { data: any }) {
        return <div>{props.data}</div>;
      }
    `;

    const res = await tools.testCompile.execute({
      componentName: 'Comp',
      source: sourceWithIllegalAny,
    });

    assert.equal(res.success, false);
    assert.ok(
      res.errors.some(
        (e) => e.rule === 'no-any' || /any/i.test(e.message)
      )
    );
  });

  it('testCompile rejects unmapped classes when tokenClasses are provided', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      lastCompiledSource: {},
      tokenClasses: ['bg-primary-default', 'text-foreground-default'],
    };
    const tools = createAuthorTools(context);

    const sourceWithUnmappedClass = `
      export default function Comp() {
        return <div class="bg-red-500">Alert</div>;
      }
    `;

    const res = await tools.testCompile.execute({
      componentName: 'Comp',
      source: sourceWithUnmappedClass,
    });

    assert.equal(res.success, false);
    assert.ok(
      res.errors.some(
        (e) => e.rule === 'unknown-class' || /bg-red-500/.test(e.message)
      )
    );
  });

  it('registerNewToken records new token in context', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
    };
    const tools = createAuthorTools(context);

    const res = await tools.registerNewToken.execute({
      name: 'color/button-primary',
      type: 'color',
      value: '#2563eb',
      description: 'Primary button color',
    });

    assert.equal(res.success, true);
    assert.equal(context.newTokens.length, 1);
    assert.equal(context.newTokens[0].name, 'color/button-primary');
  });

  it('saveComponent and finishAuthoring update context', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
    };
    const tools = createAuthorTools(context);

    const saveRes = await tools.saveComponent.execute({
      componentName: 'MyButton',
      source: 'export default function MyButton() { return <button />; }',
      group: 'components',
    });

    assert.equal(saveRes.success, true);
    assert.equal(context.components['MyButton'], 'export default function MyButton() { return <button />; }');
    assert.equal(context.componentGroups['MyButton'], 'components');

    const finishRes = await tools.finishAuthoring.execute({
      summary: 'Authored MyButton component',
    });

    assert.equal(finishRes.success, true);
    assert.equal(context.finished.value, true);
  });

  it('readExistingComponent reads existing source from context or workspace', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      existingSources: {
        PreloadedComp: 'export default function PreloadedComp() { return <div />; }',
      },
    };
    const tools = createAuthorTools(context);

    const res = await tools.readExistingComponent.execute({
      componentName: 'PreloadedComp',
    });

    assert.equal(res.found, true);
    assert.equal(res.source, 'export default function PreloadedComp() { return <div />; }');
  });

  it('readComponentTokens filters tokens matching component name from rawTokens', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      rawTokens: [
        { name: '🧩 Components/button/primary/color/container/background/default', value: '#2563eb' },
        { name: '🧩 Components/button/primary/color/label/foreground/default', value: '#ffffff' },
        { name: '🧩 Components/checkbox/on/color/container/background/default', value: '#16a34a' },
      ],
    };
    const tools = createAuthorTools(context);

    const res = await tools.readComponentTokens.execute({
      componentName: 'Button',
    });

    assert.equal(res.found, true);
    assert.equal(res.componentName, 'Button');
    assert.equal(res.totalTokens, 2);
    assert.equal(res.tokens.length, 2);
    assert.equal(
      res.tokens[0].name,
      '🧩 Components/button/primary/color/container/background/default'
    );
  });

  it('readComponentTokens returns clear error when rawTokens is missing', async () => {
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
    };
    const tools = createAuthorTools(context);

    const res = await tools.readComponentTokens.execute({
      componentName: 'Button',
    });

    assert.equal(res.found, false);
    assert.equal(res.tokens.length, 0);
    assert.match(res.error, /No raw tokens available in context/);
  });
});

describe('Mitosis Author - CLI Subprocess', () => {
  it('exits with code 1 and outputs error JSON when required env vars are missing', async () => {
    const result = await runCliSubprocess({}, {
      LLM_PROVIDER: 'openai',
      LLM_BASE_URL: '',
      LLM_API_KEY: '',
      LLM_MODEL: '',
    });

    assert.equal(result.code, 1);
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.success, false);
    assert.match(parsed.error, /Missing required environment variable/);
  });
});

describe('Mitosis Author - Component name trust boundary', () => {
  const tools = createAuthorTools({
    components: {},
    componentGroups: {},
    newTokens: [],
    finished: { value: false },
    lastCompiledSource: {},
  });

  for (const toolName of ['saveComponent', 'readExistingComponent']) {
    it(`${toolName} schema rejects names that could escape paths or inject code`, () => {
      const base = toolName === 'saveComponent' ? { source: 'x', group: 'components' } : {};
      for (const bad of ['../../etc/passwd', 'button', 'Card;import("x")', 'A/B', '']) {
        const res = tools[toolName].parameters.safeParse({ ...base, componentName: bad });
        assert.equal(res.success, false, `expected ${JSON.stringify(bad)} to be rejected`);
      }
      assert.equal(
        tools[toolName].parameters.safeParse({ ...base, componentName: 'IconSearch2' }).success,
        true
      );
    });
  }
});

describe('Mitosis Author - Deterministic Blueprint Pre-Compiler', () => {
  it('computes Tailwind Auto Layout classes, boundVariables, and canonicalProps', () => {
    const spec = {
      name: 'Button',
      properties: {
        'Variant#101': {
          type: 'VARIANT',
          defaultValue: 'primary',
          variantOptions: ['primary', 'secondary'],
        },
        'State#102': {
          type: 'VARIANT',
          defaultValue: 'Default',
          variantOptions: ['Default', 'Hover', 'Pressed'],
        },
        '⮑ Show Icon#103': {
          type: 'BOOLEAN',
          defaultValue: true,
        },
      },
      node: {
        type: 'COMPONENT_SET',
        children: [
          {
            name: 'Variant=primary, State=Default',
            type: 'COMPONENT',
            layoutMode: 'HORIZONTAL',
            primaryAxisAlignItems: 'CENTER',
            counterAxisAlignItems: 'CENTER',
            itemSpacing: 8,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
            cornerRadius: 6,
            boundVariables: {
              fills: [{ id: 'VariableID:1:10' }],
            },
            children: [
              {
                name: 'Label',
                type: 'TEXT',
                characters: 'Submit',
              },
            ],
          },
        ],
      },
    };

    const rawTokens = [
      { id: 'VariableID:1:10', name: 'primary/default', value: '#2563eb' },
    ];

    const bp = buildComponentBlueprint('Button', spec, rawTokens);
    assert.equal(bp.componentName, 'Button');
    assert.ok(bp.baseTailwindClasses.includes('flex'));
    assert.ok(bp.baseTailwindClasses.includes('flex-row'));
    assert.ok(bp.baseTailwindClasses.includes('justify-center'));
    assert.ok(bp.baseTailwindClasses.includes('items-center'));
    assert.ok(bp.baseTailwindClasses.includes('gap-2'));
    assert.ok(bp.baseTailwindClasses.includes('px-4'));
    assert.ok(bp.baseTailwindClasses.includes('py-2'));
    assert.ok(bp.baseTailwindClasses.includes('rounded-md'));
    assert.ok(bp.baseTailwindClasses.includes('bg-primary-default'));

    // Filters out visual State prop and cleans up ⮑ prefix and #id suffix
    const propNames = bp.canonicalProps.map((p) => p.name);
    assert.deepEqual(propNames, ['variant', 'showIcon']);
  });

  it('unwraps COMPONENT_SET variants array, extracts typography.characters, filters visible:false, and maps stroke/shadow tokens', async () => {
    const spec = {
      name: 'AlertDialog',
      node: {
        type: 'COMPONENT_SET',
        variantCount: 1,
        variants: [
          {
            id: 'v1',
            name: 'Default',
            properties: {},
            node: {
              type: 'COMPONENT',
              layout: { layoutMode: 'VERTICAL', itemSpacing: 16, paddingLeft: 24, paddingRight: 24, paddingTop: 24, paddingBottom: 24, cornerRadius: 10 },
              strokes: [{ type: 'SOLID', visible: true, weight: 1, boundVariables: { color: { id: '3458:10' } } }],
              effects: [{ type: 'DROP_SHADOW', visible: true, radius: 15 }],
              children: [
                {
                  name: 'Heading',
                  type: 'TEXT',
                  visible: true,
                  typography: { characters: 'Are you absolutely sure?' },
                  fills: [{ type: 'SOLID', visible: true, boundVariables: { color: { id: '3458:11' } } }],
                },
                {
                  name: 'HiddenSlot',
                  type: 'FRAME',
                  visible: false,
                  children: [{ name: 'Secret', type: 'TEXT', typography: { characters: 'Hidden' } }],
                },
              ],
            },
          },
        ],
      },
    };
    const rawTokens = [
      { id: 'VariableID:3458:10', name: '🧩 Components/alert-dialog/border', value: '#e5e5e5' },
      { id: 'VariableID:3458:11', name: '🧩 Components/alert-dialog/heading', value: '#0a0a0a' },
    ];

    const bp = buildComponentBlueprint('AlertDialog', spec, rawTokens);
    assert.ok(bp.baseTailwindClasses.includes('border'));
    assert.ok(bp.baseTailwindClasses.includes('border-components-alert-dialog-border'));
    assert.ok(bp.baseTailwindClasses.includes('shadow-lg'));
    assert.equal(bp.hierarchy.length, 1);
    assert.equal(bp.hierarchy[0].textContent, 'Are you absolutely sure?');
    assert.ok(bp.hierarchy[0].tailwindClasses.includes('text-components-alert-dialog-heading'));
  });

  it('editComponent applies targeted replacements to base component source and compiles across all 6 targets', async () => {
    const baseSource = `import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BadgeProps {
  label?: string;
  className?: string;
}

export default function Badge(props: BadgeProps) {
  useDefaultProps({ label: 'Old', className: '' });
  return <span class={cn('inline-flex items-center px-2 py-1', props.className)}>{props.label}</span>;
}
`;
    const context = {
      components: {},
      componentGroups: {},
      newTokens: [],
      finished: { value: false },
      existingSources: { Badge: baseSource },
      lastCompiledSource: {},
      lastAttemptedSource: {},
    };
    const tools = createAuthorTools(context);

    const missRes = await tools.editComponent.execute({
      componentName: 'Badge',
      edits: [{ oldText: 'NON_EXISTENT_TEXT', newText: 'New' }],
      group: 'components',
    });
    assert.equal(missRes.success, false);
    assert.match(missRes.error, /oldText not found/);

    const okRes = await tools.editComponent.execute({
      componentName: 'Badge',
      edits: [{ oldText: "label: 'Old'", newText: "label: 'Updated From Figma'" }],
      group: 'components',
      curatedDescription: 'Clean developer description.',
    });
    assert.equal(okRes.success, true);
    assert.match(context.components['Badge'], /Updated From Figma/);
  });

  it('curates noisy Figma canvas mockup properties, collapses >10 Slot variant swaps to children, and extracts composedComponents & variantHierarchies', () => {
    const spec = {
      name: 'Table',
      description: 'Description\nData table.\n\nProperties\nShow Column 1–10 — Hides columns.',
      properties: {
        'Show Column 1#2571:0': { type: 'BOOLEAN', defaultValue: true },
        'Show Row 6#2571:15': { type: 'BOOLEAN', defaultValue: false },
        'Show Komlabs#2927:16': { type: 'BOOLEAN', defaultValue: true },
        'Slot#2945:18': { type: 'SLOT' },
        'Type': {
          type: 'VARIANT',
          defaultValue: 'Text',
          variantOptions: [
            'Text', 'Image Text', 'Image', 'Action', 'Badge', 'Stacked Text',
            'Link', 'Checkbox', 'Toggle', 'Avatar Text', 'Status', 'Number',
            'Action (Icon)', 'Product', 'Slot',
          ],
        },
        'State': {
          type: 'VARIANT',
          defaultValue: 'Default',
          variantOptions: ['Default', 'Empty'],
        },
      },
      node: {
        type: 'COMPONENT_SET',
        variants: [
          {
            name: 'State=Default',
            node: {
              type: 'COMPONENT',
              children: [
                { name: 'Pagination', type: 'INSTANCE', visible: true },
                { name: 'Input/Dropdown', type: 'INSTANCE', visible: true },
              ],
            },
          },
          {
            name: 'State=Empty',
            node: {
              type: 'COMPONENT',
              children: [
                { name: 'Icon Container', type: 'FRAME', visible: true },
                { name: 'CTA', type: 'INSTANCE', visible: true },
              ],
            },
          },
        ],
      },
    };

    const bp = buildComponentBlueprint('Table', spec, []);
    const propNames = bp.canonicalProps.map((p) => p.name);
    assert.ok(!propNames.includes('showColumn1'));
    assert.ok(!propNames.includes('showRow6'));
    assert.ok(!propNames.includes('showKomlabs'));
    assert.ok(!propNames.includes('type'));
    assert.ok(propNames.includes('children'));
    assert.ok(propNames.includes('state'));
    assert.ok(bp.composedComponents?.includes('Pagination'));
    assert.ok(bp.composedComponents?.includes('Input/Dropdown'));
    assert.ok(bp.variantHierarchies?.['State=Empty']);
    assert.equal(bp.variantHierarchies['State=Empty'][0].name, 'Icon Container');

    const compact = compactComponentSpec(spec);
    assert.ok(!('Show Column 1' in compact.properties));
    assert.ok(!compact.description?.includes('Show Column 1–10'));
  });

  it('synthesizes multi-variant stateStyles, variantDiffs, dimensions, typography, and semantic Mapping descriptions without RGB collisions', () => {
    const rawTokens = [
      { id: 'VariableID:sem-focus', name: '🌱 Semantic/colors/focus/ring-default', value: 'rgb(212, 212, 212)' },
      { id: 'VariableID:sem-border', name: '🌱 Semantic/colors/border/default', value: 'rgb(212, 212, 212)' },
      {
        id: 'VariableID:comp-conn',
        name: '🧩 Components/stepper/default/color/connector/background/upcoming',
        value: 'rgb(212, 212, 212)',
        description: 'Mapping: Default → 🌱 Semantic `colors/utility/spacer`.',
      },
      {
        id: 'VariableID:comp-done-bg',
        name: '🧩 Components/stepper/default/color/indicator/background/completed',
        value: 'rgb(240, 253, 244)',
        description: 'Mapping: Default → 🌱 Semantic `colors/success/subtle`.',
      },
      {
        id: 'VariableID:comp-active-bg',
        name: '🧩 Components/stepper/default/color/indicator/background/active',
        value: 'rgb(229, 85, 20)',
        description: 'Mapping: Default → 🌱 Semantic `colors/primary/default`.',
      },
    ];
    const spec = {
      name: 'Stepper',
      properties: {
        Position: { type: 'VARIANT', defaultValue: 'Top', variantOptions: ['Top', 'Bottom'] },
      },
      node: {
        type: 'COMPONENT_SET',
        variants: [
          {
            name: 'Type=Horizontal, Current=1',
            node: {
              type: 'COMPONENT',
              children: [
                {
                  name: 'Step 1 / active',
                  type: 'FRAME',
                  layout: { layoutMode: 'VERTICAL', width: 64, height: 61 },
                  children: [
                    {
                      name: 'Indicator',
                      type: 'FRAME',
                      layout: { layoutMode: 'HORIZONTAL', width: 32, height: 32, cornerRadius: 9999 },
                      boundVariables: { fills: [{ id: 'VariableID:comp-active-bg' }] },
                    },
                    {
                      name: 'Step 1 Label',
                      type: 'TEXT',
                      typography: { characters: 'Cart', fontSize: 14, fontWeight: '600', textAlignHorizontal: 'CENTER' },
                      componentPropertyReferences: { characters: 'Label#3574:0' },
                    },
                  ],
                },
                {
                  name: 'Connector 1',
                  type: 'FRAME',
                  children: [
                    {
                      name: 'Line',
                      type: 'FRAME',
                      layout: { width: 60, height: 2 },
                      boundVariables: { fills: [{ id: 'VariableID:comp-conn' }] },
                    },
                  ],
                },
              ],
            },
          },
          {
            name: 'Type=Horizontal, Current=2',
            node: {
              type: 'COMPONENT',
              children: [
                {
                  name: 'Step 1 / completed',
                  type: 'FRAME',
                  layout: { layoutMode: 'VERTICAL', width: 64, height: 61 },
                  children: [
                    {
                      name: 'Indicator',
                      type: 'FRAME',
                      layout: { layoutMode: 'HORIZONTAL', width: 32, height: 32, cornerRadius: 9999 },
                      boundVariables: { fills: [{ id: 'VariableID:comp-done-bg' }] },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    };

    const bp = buildComponentBlueprint('Stepper', spec, rawTokens);
    assert.deepEqual(bp.canonicalProps[0].options, ['top', 'bottom']);
    assert.ok(bp.stateStyles?.['Step / active > Indicator']?.includes('w-8'));
    assert.ok(bp.stateStyles?.['Step / active > Indicator']?.includes('h-8'));
    assert.ok(bp.stateStyles?.['Step / active > Indicator']?.includes('bg-primary-default'));
    assert.ok(bp.stateStyles?.['Step / completed > Indicator']?.includes('bg-success-subtle'));
    assert.ok(bp.stateStyles?.['Connector > Line']?.includes('bg-border-default'));
    assert.ok(bp.stateStyles?.['Connector > Line']?.includes('h-0.5'));
    const labelNode = bp.hierarchy[0]?.children?.[1];
    assert.ok(labelNode?.tailwindClasses.includes('text-sm'));
    assert.ok(labelNode?.tailwindClasses.includes('font-semibold'));
    assert.ok(labelNode?.tailwindClasses.includes('text-center'));
    assert.equal(labelNode?.propBind?.characters, 'label');
  });
});

