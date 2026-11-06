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
    assert.ok(angularArt.code.includes('get props(): this {'));
  });

  it('imports every sibling NgModule that the Angular NgModule references', async () => {
    const res = await compileMitosis({
      componentName: 'BadgeExample',
      source: `import Badge from '../components/Badge.lite';
import BadgeItem from './BadgeItem.lite';

export default function BadgeExample() {
  return <Badge><BadgeItem /></Badge>;
}`,
      targets: ['angular'],
      checks: { lint: false },
    });
    assert.strictEqual(res.success, true, JSON.stringify(res.errors));
    const code = res.artifacts.find((a) => a.target === 'angular').code;
    const referenced = (code.match(/imports:\s*\[([^\]]*)\]/)?.[1] || '')
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m && m !== 'CommonModule');
    assert.deepStrictEqual(referenced.sort(), ['BadgeItemModule', 'BadgeModule']);
    assert.ok(code.includes('import { BadgeModule } from "../components/Badge";'));
    assert.ok(code.includes('import { BadgeItemModule } from "./BadgeItem";'));
    assert.ok(!/import Badge(Item)? from/.test(code), 'no unused default component imports');
  });

  it('keeps Angular selectors and sibling tags distinct from native elements', async () => {
    const angularOf = async (componentName, source) =>
      (await compileMitosis({ componentName, source, targets: ['angular'], checks: { lint: false } })).artifacts.find((a) => a.target === 'angular').code;

    const button = await angularOf('Button', `export default function Button(props: { children?: any }) { return <button type="button">{props.children}</button>; }`);
    assert.match(button, /selector: "spn-button"/, 'no bare `button` alias that would capture its own native <button>');
    assert.match(button, /<button\b/);

    const composite = await angularOf(
      'Toolbar',
      `import Button from './Button.lite';
import Badge from './Badge.lite';
export default function Toolbar() { return <div><button type="button">native</button><Button>Save</Button><Badge>New</Badge></div>; }`
    );
    assert.match(composite, /selector: "spn-toolbar, toolbar"/, 'non-native names keep the bare alias');
    assert.match(composite, /<spn-button\b/);
    assert.match(composite, /<spn-badge\b/);
    assert.strictEqual((composite.match(/<button\b/g) || []).length, 1, 'only the native button stays <button>');
  });

  it('emits Vue 2 templates that the Vue 2 compiler accepts and whose handlers actually run', async () => {
    const res = await compileMitosis({
      componentName: 'Demo',
      source: `import { useDefaultProps, Show, For } from '@builder.io/mitosis';

export interface DemoProps { open?: boolean; items?: string[]; onPick?: (item: string) => void; }

export default function Demo(props: DemoProps) {
  useDefaultProps({ open: false, items: [] });
  return (
    <Show when={props.open}>
      <ul>
        <For each={props.items}>
          {(item) => <li key={item} onClick={(event) => props.onPick && props.onPick(item)}>{item}</li>}
        </For>
      </ul>
    </Show>
  );
}`,
      targets: ['vue2'],
    });
    assert.strictEqual(res.success, true, JSON.stringify(res.errors));
    const code = res.artifacts.find((a) => a.target === 'vue2').code;
    assert.doesNotMatch(code, /<template[^>]*:key=/, 'no key on <template v-for>');
    assert.match(code, /<li\s+:key="item"/);
    assert.match(code, /<div style="display: contents" v-if="open">/, 'root <Show> becomes a real element');
    assert.doesNotMatch(code, /@click="async /);

    const { compileTemplate } = await import('vue2/compiler-sfc');
    const template = code.slice('<template>'.length, code.lastIndexOf('</template>'));
    const compiled = compileTemplate({ source: template, filename: 'Demo.vue', isProduction: true });
    assert.deepStrictEqual(compiled.errors, []);
    assert.match(compiled.code, /on:\{"click":\(event\) =>/, 'handler is bound directly, not wrapped as a statement');
  });

  it('emits Angular 19+ compatible metadata, unique defaults, $event bindings and template globals', async () => {
    const res = await compileMitosis({
      componentName: 'Demo',
      source: `import { useDefaultProps, Show } from '@builder.io/mitosis';

export interface DemoProps { label?: string; src?: string; onPick?: (files: any) => void; className?: string; }

export default function Demo(props: DemoProps) {
  useDefaultProps({ label: 'Demo', src: '', className: '' });
  return (
    <div>
      <Show when={Boolean(props.src)}><span>{Math.max(1, 2)}</span></Show>
      <input type="file" disabled={!props.src} onChange={(event) => props.onPick && props.onPick(event)} />
    </div>
  );
}`,
      targets: ['angular'],
      checks: { lint: false },
    });
    assert.strictEqual(res.success, true, JSON.stringify(res.errors));
    const code = res.artifacts.find((a) => a.target === 'angular').code;
    assert.match(code, /@Component\(\{\s*standalone: false, selector: "spn-demo, demo"/);
    const defaults = code.match(/const defaultProps: any = \{([\s\S]*?)\};/)[1];
    for (const key of ['label', 'src', 'className']) {
      assert.strictEqual(defaults.match(new RegExp(`\\b${key}:`, 'g')).length, 1, `${key} declared once`);
    }
    assert.match(code, /\(change\)="[^"]*\$event[^"]*"/);
    assert.doesNotMatch(code.match(/template:\s*`([\s\S]*?)`/)[1], /(?<![$\w.])event\b/);
    assert.ok(code.includes('protected readonly Boolean = Boolean;'));
    assert.ok(code.includes('protected readonly Math = Math;'));
    assert.ok(!code.includes('protected readonly Number'), 'only globals used by the template');
    assert.match(code, /\[attr\.disabled\]="\(!src\) \? '' : null"/, 'false removes the boolean attribute');
  });

  it('enforces framework-specific children & compound component idioms across React, Vue 3, Svelte, Vue 2, and Angular', async () => {
    // Self-contained compound fixture: adapter idioms must not depend on the (regenerated) template baseline.
    const siblingSources = {
      CardItem: `import { useDefaultProps } from '@builder.io/mitosis';
export interface CardItemProps { className?: string; children?: any; }
export default function CardItem(props: CardItemProps) {
  useDefaultProps({ className: '' });
  return <li class={props.className}>{props.children}</li>;
}`,
    };
    const res = await compileMitosis({
      componentName: 'Card',
      source: `import { useDefaultProps, Show } from '@builder.io/mitosis';
import CardItem from './CardItem.lite';
export interface CardProps { className?: string; children?: any; }
export default function Card(props: CardProps) {
  useDefaultProps({ className: '' });
  return (
    <ul class={props.className}>
      <Show when={props.children}>{props.children}</Show>
      <CardItem>Static item</CardItem>
    </ul>
  );
}`,
      siblingSources,
      targets: ['react', 'vue3', 'svelte', 'vue2', 'angular'],
      checks: { lint: true, types: true, targets: true, render: true },
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
    assert.ok(reactArt.code.includes('Object.assign(Card, { Item: CardItem, CardItem })'), reactArt.code.match(/Object\.assign\([^)]*\)/)?.[0]);

    // Vue 3: defineSlots + no children prop in CardProps / withDefaults
    assert.ok(vue3Art.code.includes('defineSlots<{ default?: () => any }>()'));
    assert.ok(!vue3Art.code.includes('children?: any'));
    assert.ok(!vue3Art.code.includes('children: undefined'));

    // Svelte: interface $$Slots + no children in CardProps / export let
    assert.ok(svelteArt.code.includes('interface $$Slots'));
    assert.ok(!svelteArt.code.includes('children?: any'));
    assert.ok(!svelteArt.code.includes('export let children'));

    // Vue 2: no children in CardProps
    assert.ok(!vue2Art.code.includes('children?: any'));

    // Angular: no @Input() children and <ng-content> unwrapped from *ngIf="children"
    assert.ok(!angularArt.code.includes('children?: any'));
    assert.ok(!angularArt.code.includes('@Input() children'));
    assert.ok(!angularArt.code.includes('*ngIf="children"'));
    assert.match(angularArt.code, /<ng-content><\/ng-content\s*>/);
    assert.match(angularArt.code, /<spn-card-item\b/);
  });
});
