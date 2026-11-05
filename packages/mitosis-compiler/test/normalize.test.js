import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  compileMitosis,
  getUtilsSource,
  normalizeMitosisSource,
} from '../dist/index.js';

describe('normalizeMitosisSource & getUtilsSource', () => {
  it('enforces canonical component function and Props interface name', () => {
    const raw = `
import { useDefaultProps } from '@builder.io/mitosis';

export interface FileInputProps {
  label?: string;
}

export default function FileInput(props: FileInputProps) {
  useDefaultProps({ label: 'Upload' });
  return <div>{props.label}</div>;
}
`;
    const normalized = normalizeMitosisSource(raw, 'InputFileInput');
    assert.ok(normalized.includes('export interface InputFileInputProps'));
    assert.ok(normalized.includes('export default function InputFileInput(props: InputFileInputProps)'));
  });

  it('auto-rewrites onChange to onInput on text inputs and textareas while preserving checkbox onChange', async () => {
    const raw = `
import { useStore, useDefaultProps } from '@builder.io/mitosis';

export interface InputTextProps {
  value?: string;
  checked?: boolean;
  onValueChange?: (val: string) => void;
}

export default function InputText(props: InputTextProps) {
  useDefaultProps({ value: '', checked: false });
  const state = useStore({
    handleInput(e: any) {
      if (props.onValueChange) props.onValueChange(e?.target?.value ?? '');
    },
  });
  return (
    <div>
      <input type="text" value={props.value} onChange={(e) => state.handleInput(e)} />
      <textarea value={props.value} onChange={(e) => state.handleInput(e)} />
      <input type="checkbox" checked={props.checked} onChange={(e) => state.handleInput(e)} />
    </div>
  );
}
`;
    const res = await compileMitosis({
      componentName: 'InputText',
      source: raw,
      targets: ['react', 'svelte', 'vue3'],
      checks: { lint: true, render: true },
      normalize: true,
    });
    assert.strictEqual(res.success, true, `Expected success but got errors: ${JSON.stringify(res.errors)}`);
  });

  it('auto-rewrites prop shadowing inside useStore getters so Svelte compiles cleanly', async () => {
    const raw = `
import { useStore, useDefaultProps, For } from '@builder.io/mitosis';

export interface ListProps {
  items?: string[];
}

export default function List(props: ListProps) {
  useDefaultProps({ items: [] });
  const state = useStore({
    get normalizedItems(): string[] {
      const items = props.items || [];
      return items.map((x) => x.trim());
    },
  });
  return (
    <ul>
      <For each={state.normalizedItems}>
        {(item) => <li key={item}>{item}</li>}
      </For>
    </ul>
  );
}
`;
    const res = await compileMitosis({
      componentName: 'List',
      source: raw,
      targets: ['react', 'svelte', 'vue3'],
      checks: { lint: true, render: true },
      normalize: true,
    });
    assert.strictEqual(res.success, true, `Expected success but got errors: ${JSON.stringify(res.errors)}`);
  });

  it('returns non-empty canonical utils.ts source via getUtilsSource', () => {
    const src = getUtilsSource();
    assert.ok(src.includes('export function cn('));
    assert.ok(src.includes('export function createDialogState('));
    assert.ok(src.includes('export function getPieSlices('));
  });

  it('auto-renames useStore getters that collide with Props and unwraps chained Vue 3 computed refs', async () => {
    const raw = `
import { useStore, useDefaultProps } from '@builder.io/mitosis';

export interface UploaderProps {
  supportingText?: string;
  hint?: string;
  errorMessage?: string;
}

export default function Uploader(props: UploaderProps) {
  useDefaultProps({ supportingText: 'Max 5MB', hint: '1:1 image', errorMessage: '' });
  const state = useStore({
    get hasError() {
      return props.errorMessage !== '';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
  });
  return (
    <div>
      <span>{props.supportingText}</span>
      <span>{state.supportingText}</span>
    </div>
  );
}
`;
    const res = await compileMitosis({
      componentName: 'Uploader',
      source: raw,
      targets: ['react', 'svelte', 'vue3'],
      checks: { lint: true, render: true, targets: true },
      normalize: true,
    });
    assert.strictEqual(res.success, true, `Expected success but got errors: ${JSON.stringify(res.errors)}`);
    const vue3Code = res.artifacts.find((a) => a.target === 'vue3')?.code || '';
    const svelteCode = res.artifacts.find((a) => a.target === 'svelte')?.code || '';
    assert.ok(vue3Code.includes('hasError.value'), 'Vue 3 chained computed must use .value');
    assert.ok(!svelteCode.includes('$: supportingText ='), 'Svelte getter must not shadow export let supportingText');
  });
});
