import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateNamespaceIndex } from '../dist/index.js';

describe('generateNamespaceIndex', () => {
  it('Test 1: creates namespace for prefix group and named export for standalone component', () => {
    const artifact = generateNamespaceIndex(
      ['ChartBar', 'ChartPie', 'Button'],
      'react'
    );
    assert.ok(artifact);
    assert.strictEqual(artifact.target, 'react');
    assert.strictEqual(artifact.fileName, 'index.ts');

    assert.ok(
      artifact.code.includes(
        'export const Chart = { Bar: ChartBar, Pie: ChartPie } as const;'
      ),
      'Should contain namespace object for Chart'
    );
    assert.ok(
      artifact.code.includes("export { default as Button } from './Button';"),
      'Should contain named export for Button'
    );
    assert.strictEqual(
      artifact.code.includes('export const Button'),
      false,
      'Should NOT contain namespace object for Button'
    );
  });

  it('Test 2: handles identifier collision when component name equals group key', () => {
    const artifact = generateNamespaceIndex(
      ['Table', 'TableRow', 'TableCell'],
      'react'
    );
    assert.ok(artifact);

    assert.ok(
      artifact.code.includes(
        'export const Table = { Cell: TableCell, Root: TableComponent, Row: TableRow } as const;'
      ),
      'Namespace Table should have sorted properties: Cell, Root, Row'
    );
    assert.ok(
      artifact.code.includes("import TableComponent from './Table';"),
      'Table component should be imported as TableComponent'
    );
    assert.ok(
      artifact.code.includes('export { TableComponent as TableRoot };'),
      'Table component should be exported as TableRoot'
    );
    assert.strictEqual(
      artifact.code.includes("export { default as Table } from './Table';"),
      false,
      'Should NOT export bare Table default export to avoid collision'
    );
    assert.ok(
      artifact.code.includes(
        "export { default as TableCell } from './TableCell';"
      ),
      'TableCell should be re-exported'
    );
    assert.ok(
      artifact.code.includes(
        "export { default as TableRow } from './TableRow';"
      ),
      'TableRow should be re-exported'
    );
  });

  it('Test 3: acronym-aware grouping splits InputOTP and InputText into Input namespace', () => {
    const artifact = generateNamespaceIndex(['InputOTP', 'InputText'], 'react');
    assert.ok(artifact);

    assert.ok(
      artifact.code.includes(
        'export const Input = { OTP: InputOTP, Text: InputText } as const;'
      ),
      'Namespace Input should have OTP: InputOTP, Text: InputText'
    );
  });

  it('Test 4: single component returns named export only, no namespace object', () => {
    const artifact = generateNamespaceIndex(['Badge'], 'react');
    assert.ok(artifact);

    assert.ok(
      artifact.code.includes("export { default as Badge } from './Badge';"),
      'Should contain named export for Badge'
    );
    assert.strictEqual(
      artifact.code.includes('export const'),
      false,
      'Should NOT contain any namespace object'
    );
    assert.strictEqual(
      artifact.code.includes('import '),
      false,
      'Should NOT contain any imports when no namespace is created'
    );
  });

  it('Test 5: Vue3 target uses .vue file paths', () => {
    const artifact = generateNamespaceIndex(['ChartBar', 'ChartPie'], 'vue3');
    assert.ok(artifact);
    assert.strictEqual(artifact.target, 'vue3');

    assert.ok(artifact.code.includes("import ChartBar from './ChartBar.vue';"));
    assert.ok(artifact.code.includes("import ChartPie from './ChartPie.vue';"));
    assert.ok(
      artifact.code.includes(
        "export { default as ChartBar } from './ChartBar.vue';"
      )
    );
    assert.ok(
      artifact.code.includes(
        "export { default as ChartPie } from './ChartPie.vue';"
      )
    );
    assert.ok(
      artifact.code.includes(
        'export const Chart = { Bar: ChartBar, Pie: ChartPie } as const;'
      )
    );
  });

  it('Test 6: Svelte target uses .svelte file paths', () => {
    const artifact = generateNamespaceIndex(['ChartBar', 'ChartPie'], 'svelte');
    assert.ok(artifact);
    assert.strictEqual(artifact.target, 'svelte');

    assert.ok(
      artifact.code.includes("import ChartBar from './ChartBar.svelte';")
    );
    assert.ok(
      artifact.code.includes("import ChartPie from './ChartPie.svelte';")
    );
    assert.ok(
      artifact.code.includes(
        "export { default as ChartBar } from './ChartBar.svelte';"
      )
    );
    assert.ok(
      artifact.code.includes(
        "export { default as ChartPie } from './ChartPie.svelte';"
      )
    );
    assert.ok(
      artifact.code.includes(
        'export const Chart = { Bar: ChartBar, Pie: ChartPie } as const;'
      )
    );
  });

  it('Test 7: Angular target has named exports and NO export const namespace objects', () => {
    const artifact = generateNamespaceIndex(
      ['ChartBar', 'ChartPie', 'Button'],
      'angular'
    );
    assert.ok(artifact);
    assert.strictEqual(artifact.target, 'angular');

    assert.ok(
      artifact.code.includes("export { default as Button } from './Button';"),
      'Should contain default-to-named export for Button'
    );
    assert.ok(
      artifact.code.includes(
        "export { default as ChartBar } from './ChartBar';"
      ),
      'Should contain default-to-named export for ChartBar'
    );
    assert.ok(
      artifact.code.includes(
        "export { default as ChartPie } from './ChartPie';"
      ),
      'Should contain default-to-named export for ChartPie'
    );
    assert.strictEqual(
      artifact.code.includes('export const'),
      false,
      'Should NOT contain any export const namespace'
    );
    assert.strictEqual(
      artifact.code.includes('import '),
      false,
      'Angular should not have local imports'
    );
  });

  it('Test 8: Target mitosis returns null, and empty array returns null', () => {
    assert.strictEqual(generateNamespaceIndex(['Button'], 'mitosis'), null);
    assert.strictEqual(generateNamespaceIndex([], 'react'), null);
    assert.strictEqual(generateNamespaceIndex([], 'mitosis'), null);
  });

  it('Test 9: deterministic output regardless of input order', () => {
    const res1 = generateNamespaceIndex(['ChartPie', 'ChartBar'], 'react');
    const res2 = generateNamespaceIndex(['ChartBar', 'ChartPie'], 'react');
    assert.deepStrictEqual(res1, res2);

    const complex1 = generateNamespaceIndex(
      ['TableRow', 'Button', 'Table', 'InputText', 'TableCell', 'InputOTP'],
      'react'
    );
    const complex2 = generateNamespaceIndex(
      ['InputOTP', 'Table', 'TableCell', 'Button', 'TableRow', 'InputText'],
      'react'
    );
    assert.deepStrictEqual(complex1, complex2);
  });
});
