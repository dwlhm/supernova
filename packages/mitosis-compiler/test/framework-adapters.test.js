import { describe, it } from 'node:test';
import assert from 'node:assert';
import { compileMitosis, bindControllerProps } from '../dist/index.js';

describe('Tier 2 — Native Framework Adapters (React, Vue 3, Svelte)', () => {
  it('adaptReactOutput normalizes onInput -> onChange, colspan -> colSpan, and injects React.useState controller', async () => {
    const source = `import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface DemoInputProps {
  value?: string;
  onValueChange?: (val: string) => void;
}

export default function DemoInput(props: DemoInputProps) {
  useDefaultProps<DemoInputProps>({ value: '' });
  return (
    <table>
      <tbody>
        <tr>
          <td colspan={2}>
            <input type="text" class={cn('px-2')} value={props.value} onInput={(e) => props.onValueChange && props.onValueChange(e.target.value)} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}`;
    const res = await compileMitosis({ componentName: 'DemoInput', source, targets: ['react', 'vue3', 'svelte'], normalize: true });
    assert.strictEqual(res.success, true);
    const reactArt = res.artifacts.find((a) => a.target === 'react');
    assert.ok(reactArt);
    assert.ok(reactArt.code.includes('colSpan={2}'));
    assert.ok(reactArt.code.includes('onChange={'));
    assert.ok(reactArt.code.includes('React.useState'));
    assert.ok(reactArt.code.includes('bindControllerProps'));
  });

  it('adaptVue3Output wraps array defaults in withDefaults with factory functions () => []', async () => {
    const source = `import { useDefaultProps, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface DemoListProps {
  items?: string[];
}

export default function DemoList(props: DemoListProps) {
  useDefaultProps<DemoListProps>({ items: [] });
  return (
    <ul class={cn('list-none')}>
      <For each={props.items}>{(item) => <li key={item}>{item}</li>}</For>
    </ul>
  );
}`;
    const res = await compileMitosis({ componentName: 'DemoList', source, targets: ['vue3'], normalize: true });
    assert.strictEqual(res.success, true);
    assert.ok(res.artifacts[0].code.includes('items: () => []'));
  });

  it('bindControllerProps supports both uncontrolled internal state and controlled prop updates', () => {
    let state = {};
    const setState = (fn) => { state = fn(state); };
    const p1 = bindControllerProps({ checked: false }, state, setState);
    assert.strictEqual(p1.checked, false);
    p1.onCheckedChange(true);
    const p2 = bindControllerProps({ checked: false }, state, setState);
    assert.strictEqual(p2.checked, true);

    // Multi-argument onCheckedChange(rowId, checked) and onSelect(rowId, checked)
    let forwardedArgs = null;
    const p3 = bindControllerProps(
      {
        checked: false,
        rows: [{ id: '1', selected: false }, { id: '2', selected: false }],
        items: [{ id: 'a', checked: false }],
        onCheckedChange: (id, chk) => { forwardedArgs = [id, chk]; },
      },
      state,
      setState
    );
    p3.onCheckedChange('row-1', true);
    assert.deepStrictEqual(forwardedArgs, ['row-1', true]);
    p3.onRowSelect('1', true);
    const p4 = bindControllerProps(
      {
        checked: false,
        rows: [{ id: '1', selected: false }, { id: '2', selected: false }],
        items: [{ id: 'a', checked: false }],
      },
      state,
      setState
    );
    assert.strictEqual(p4.rows[0].selected, true);
    p4.onSelectAll(true);
    const p5 = bindControllerProps(
      {
        checked: false,
        rows: [{ id: '1', selected: false }, { id: '2', selected: false }],
        items: [{ id: 'a', checked: false }],
      },
      state,
      setState
    );
    assert.strictEqual(p5.rows[1].selected, true);
    p5.onToggle('a', true);
    const p6 = bindControllerProps(
      {
        checked: false,
        rows: [{ id: '1', selected: false }, { id: '2', selected: false }],
        items: [{ id: 'a', checked: false }],
      },
      state,
      setState
    );
    assert.strictEqual(p6.items[0].checked, true);
  });

  it('adaptSvelteOutput and adaptVue3Output preserve whole-object props and useDefaultProps for get*State(props)', async () => {
    const source = `import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getDatePickerState } from './utils';

export interface MiniDatePickerProps {
  open?: boolean;
  value?: number;
  month?: number;
  year?: number;
  placeholder?: string;
  className?: string;
}

export default function MiniDatePicker(props: MiniDatePickerProps) {
  useDefaultProps({
    open: false,
    value: 15,
    month: 10,
    year: 2026,
    placeholder: 'Pick date',
    className: '',
  });
  return (
    <div class={cn('relative', props.className)}>
      <span>{getDatePickerState(props).displayText}</span>
      <Show when={props.open}>
        <div role="dialog">{getDatePickerState(props).monthLabel}</div>
      </Show>
    </div>
  );
}`;
    const res = await compileMitosis({
      componentName: 'MiniDatePicker',
      source,
      targets: ['vue3', 'svelte'],
      normalize: true,
    });
    assert.strictEqual(res.success, true);
    const svelteArt = res.artifacts.find((a) => a.target === 'svelte');
    const vue3Art = res.artifacts.find((a) => a.target === 'vue3');
    assert.ok(svelteArt);
    assert.ok(vue3Art);
    assert.ok(svelteArt.code.includes('export let month'));
    assert.ok(svelteArt.code.includes('export let year'));
    assert.ok(svelteArt.code.includes('$: props = {'));
    assert.ok(vue3Art.code.includes('month: 10'));
    assert.ok(vue3Art.code.includes('year: 2026'));
  });

  it('adaptVue2Output and adaptAngularOutput preserve whole-object props, useDefaultProps, and synthesize props binding', async () => {
    const source = `import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getDatePickerState } from './utils';

export interface MiniDatePickerProps {
  open?: boolean;
  value?: number;
  month?: number;
  year?: number;
  placeholder?: string;
  className?: string;
}

export default function MiniDatePicker(props: MiniDatePickerProps) {
  useDefaultProps({
    open: false,
    value: 15,
    month: 10,
    year: 2026,
    placeholder: 'Pick date',
    className: '',
  });
  return (
    <div class={cn('relative', props.className)}>
      <span>{getDatePickerState(props).displayText}</span>
      <Show when={props.open}>
        <div role="dialog">{getDatePickerState(props).monthLabel}</div>
      </Show>
    </div>
  );
}`;
    const res = await compileMitosis({
      componentName: 'MiniDatePicker',
      source,
      targets: ['vue2', 'angular'],
      normalize: true,
    });
    assert.strictEqual(res.success, true);
    const vue2Art = res.artifacts.find((a) => a.target === 'vue2');
    const angularArt = res.artifacts.find((a) => a.target === 'angular');
    assert.ok(vue2Art);
    assert.ok(angularArt);

    // Vue 2 assertions: props backfilled, computed.props() present
    assert.ok(vue2Art.code.includes('month: { default: 10 }'));
    assert.ok(vue2Art.code.includes('year: { default: 2026 }'));
    assert.ok(vue2Art.code.includes('computed: {'));
    assert.ok(vue2Art.code.includes('props() {'));

    // Angular assertions: selector prefixed, @Input() backfilled, get props() present
    assert.ok(angularArt.code.includes('selector: "spn-mini-date-picker, mini-date-picker"'));
    assert.ok(angularArt.code.includes('@Input() month: MiniDatePickerProps["month"] = defaultProps["month"];'));
    assert.ok(angularArt.code.includes('@Input() year: MiniDatePickerProps["year"] = defaultProps["year"];'));
    assert.ok(angularArt.code.includes('get props(): any {'));
  });

  it('enforces framework-specific children & compound component idioms across React, Vue 3, Svelte, Vue 2, and Angular', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const compDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../templates/ds-repo/src/components');
    const siblingSources = {};
    for (const file of fs.readdirSync(compDir)) {
      if (file.endsWith('.lite.tsx')) {
        siblingSources[file.replace('.lite.tsx', '')] = fs.readFileSync(path.join(compDir, file), 'utf8');
      }
    }
    const tableSource = siblingSources['Table'];
    const res = await compileMitosis({
      componentName: 'Table',
      source: tableSource,
      siblingSources,
      targets: ['react', 'vue3', 'svelte', 'vue2', 'angular'],
      checks: { lint: true, targets: true, render: true },
    });
    assert.strictEqual(res.success, true, JSON.stringify(res.errors));

    const reactArt = res.artifacts.find((a) => a.target === 'react');
    const vue3Art = res.artifacts.find((a) => a.target === 'vue3');
    const svelteArt = res.artifacts.find((a) => a.target === 'svelte');
    const vue2Art = res.artifacts.find((a) => a.target === 'vue2');
    const angularArt = res.artifacts.find((a) => a.target === 'angular');

    // React: children?: React.ReactNode + compound Object.assign
    assert.ok(reactArt.code.includes('children?: React.ReactNode'));
    assert.ok(!reactArt.code.includes('children?: any'));
    assert.ok(reactArt.code.includes('Object.assign(Table, { HeaderRow: TableHeaderRow, TableHeaderRow, BodyRow: TableBodyRow, TableBodyRow, Pagination })'));

    // Vue 3: defineSlots + no children prop in TableProps / withDefaults
    assert.ok(vue3Art.code.includes('defineSlots<{ default?: () => any }>()'));
    assert.ok(!vue3Art.code.includes('children?: any'));
    assert.ok(!vue3Art.code.includes('children: undefined'));

    // Svelte: interface $$Slots + no children in TableProps / export let
    assert.ok(svelteArt.code.includes('interface $$Slots'));
    assert.ok(!svelteArt.code.includes('children?: any'));
    assert.ok(!svelteArt.code.includes('export let children'));

    // Vue 2: no children in TableProps
    assert.ok(!vue2Art.code.includes('children?: any'));

    // Angular: no @Input() children and <ng-content> unwrapped from *ngIf="children"
    assert.ok(!angularArt.code.includes('children?: any'));
    assert.ok(!angularArt.code.includes('@Input() children'));
    assert.ok(!angularArt.code.includes('*ngIf="children"'));
    assert.match(angularArt.code, /<ng-content><\/ng-content\s*>/);
  });
});
