import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  compileMitosis,
  createFocusTrap,
  registerClickOutside,
  handleDropdownKeyDown,
} from '../dist/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function readComp(name) {
  return fs.readFileSync(path.join(ROOT, 'src/components', `${name}.lite.tsx`), 'utf8');
}

function createMockElement(attrs = {}) {
  const listeners = new Map();
  let focused = false;
  const el = {
    attrs,
    children: [],
    parent: null,
    focus() {
      focused = true;
      if (globalThis.document) globalThis.document.activeElement = el;
    },
    isFocused() {
      return focused;
    },
    contains(target) {
      if (!target) return false;
      if (target === el) return true;
      return el.children.some((c) => c.contains(target));
    },
    hasAttribute(name) {
      return name in el.attrs && el.attrs[name] !== false;
    },
    getAttribute(name) {
      return el.attrs[name] ?? null;
    },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(type, event) {
      for (const fn of listeners.get(type) ?? []) fn(event);
    },
    querySelectorAll(selector) {
      if (selector.includes('[role="option"]')) {
        return el.children.filter((c) => c.attrs.role === 'option' && c.attrs['aria-disabled'] !== 'true');
      }
      return el.children.filter((c) => !c.attrs.disabled && c.attrs['aria-hidden'] !== 'true');
    },
    querySelector(selector) {
      if (selector === '[role="listbox"]') return el.children.find((c) => c.attrs.role === 'listbox') ?? null;
      if (selector === '[aria-haspopup="listbox"]') return el.children.find((c) => c.attrs['aria-haspopup'] === 'listbox') ?? null;
      return null;
    },
  };
  return el;
}

describe('Phase 2: Compile-Time Adapters (useId, forwardRef, ...rest, Overlay A11y)', () => {
  it('injects React.useId() and Vue 3 useId() fallback for omitted/empty props.id', async () => {
    for (const name of ['InputText', 'InputDropdown', 'AlertDialog']) {
      const res = await compileMitosis({
        componentName: name,
        source: readComp(name),
        targets: ['react', 'vue3'],
        normalize: true,
      });
      assert.strictEqual(res.success, true);
      const reactCode = res.artifacts.find((a) => a.target === 'react').code;
      const vue3Code = res.artifacts.find((a) => a.target === 'vue3').code;

      assert.ok(reactCode.includes('const __autoId = React.useId();'), `${name} React missing React.useId()`);
      assert.ok(reactCode.includes('id: __autoId'), `${name} React still has static default id`);
      assert.ok(reactCode.includes("if (!props.id || String(props.id).trim() === '')"), `${name} React missing empty id fallback`);

      assert.ok(vue3Code.includes('useId'), `${name} Vue 3 missing useId import`);
      assert.ok(vue3Code.includes('const __autoId = useId();'), `${name} Vue 3 missing __autoId`);
      assert.ok(vue3Code.includes('__resolvedId'), `${name} Vue 3 missing __resolvedId`);
    }
  });

  it('wraps Button, InputText, InputTextArea in React.forwardRef with ...rest HTML attribute forwarding', async () => {
    const expected = [
      ['Button', 'HTMLButtonElement', 'ButtonHTMLAttributes<HTMLButtonElement>', '<button'],
      ['InputText', 'HTMLInputElement', 'InputHTMLAttributes<HTMLInputElement>', '<input'],
      ['InputTextArea', 'HTMLTextAreaElement', 'TextareaHTMLAttributes<HTMLTextAreaElement>', '<textarea'],
    ];
    for (const [name, elType, attrType, tag] of expected) {
      const res = await compileMitosis({
        componentName: name,
        source: readComp(name),
        targets: ['react'],
        normalize: true,
      });
      assert.strictEqual(res.success, true);
      const code = res.artifacts[0].code;
      assert.ok(code.includes(`extends Omit<React.${attrType},`), `${name} missing Omit<${attrType}>`);
      assert.ok(code.includes(`React.forwardRef<${elType}, ${name}Props>`), `${name} missing React.forwardRef`);
      assert.ok(code.includes(', ...rest } = props;'), `${name} missing ...rest destructuring`);
      assert.ok(code.includes(`${tag} ref={ref} {...rest}`), `${name} missing ref={ref} {...rest} on ${tag}`);
    }
  });

  it('wires AlertDialog with Portal/Teleport and createFocusTrap in React & Vue 3', async () => {
    const res = await compileMitosis({
      componentName: 'AlertDialog',
      source: readComp('AlertDialog'),
      targets: ['react', 'vue3'],
      normalize: true,
    });
    const reactCode = res.artifacts.find((a) => a.target === 'react').code;
    const vue3Code = res.artifacts.find((a) => a.target === 'vue3').code;

    assert.ok(reactCode.includes('import { createPortal } from "react-dom";'));
    assert.ok(reactCode.includes('createFocusTrap(__dialogRef.current)'));
    assert.ok(reactCode.includes('ref={__dialogRef} role="alertdialog"'));

    assert.ok(vue3Code.includes('<Teleport to="body" :disabled="inline">'));
    assert.ok(vue3Code.includes('createFocusTrap(el)'));
    assert.ok(vue3Code.includes('ref="__dialogRef" role="alertdialog"'));
  });

  it('wires InputDropdown with registerClickOutside and handleDropdownKeyDown in React & Vue 3', async () => {
    const res = await compileMitosis({
      componentName: 'InputDropdown',
      source: readComp('InputDropdown'),
      targets: ['react', 'vue3'],
      normalize: true,
    });
    const reactCode = res.artifacts.find((a) => a.target === 'react').code;
    const vue3Code = res.artifacts.find((a) => a.target === 'vue3').code;

    assert.ok(reactCode.includes('registerClickOutside(__rootRef.current'));
    assert.ok(reactCode.includes('handleDropdownKeyDown(event as any, __rootRef.current'));
    assert.ok(reactCode.includes('ref={__rootRef}'));

    assert.ok(vue3Code.includes('registerClickOutside(el'));
    assert.ok(vue3Code.includes('handleDropdownKeyDown(event, __rootRef.value'));
    assert.ok(vue3Code.includes('ref="__rootRef" @keydown="__onDropdownKeyDown"'));
  });
});

describe('core-a11y DOM helpers (createFocusTrap, registerClickOutside, handleDropdownKeyDown)', () => {
  it('createFocusTrap traps Tab/Shift+Tab and restores focus on cleanup', () => {
    const prevDoc = globalThis.document;
    const trigger = createMockElement();
    const container = createMockElement();
    const btn1 = createMockElement();
    const btn2 = createMockElement();
    container.children.push(btn1, btn2);

    globalThis.document = { activeElement: trigger, addEventListener() {}, removeEventListener() {} };
    try {
      const cleanup = createFocusTrap(container);
      assert.strictEqual(globalThis.document.activeElement, btn1);

      // Tab at last element wraps to first
      btn2.focus();
      let prevented = false;
      container.dispatchEvent('keydown', { key: 'Tab', shiftKey: false, preventDefault: () => { prevented = true; } });
      assert.strictEqual(prevented, true);
      assert.strictEqual(globalThis.document.activeElement, btn1);

      // Shift+Tab at first element wraps to last
      prevented = false;
      container.dispatchEvent('keydown', { key: 'Tab', shiftKey: true, preventDefault: () => { prevented = true; } });
      assert.strictEqual(prevented, true);
      assert.strictEqual(globalThis.document.activeElement, btn2);

      // Cleanup restores previously focused trigger
      cleanup();
      assert.strictEqual(globalThis.document.activeElement, trigger);
    } finally {
      globalThis.document = prevDoc;
    }
  });

  it('registerClickOutside fires only on outside mousedown and unsubscribes on cleanup', () => {
    const prevDoc = globalThis.document;
    const docListeners = new Map();
    const root = createMockElement();
    const insideChild = createMockElement();
    const outsideNode = createMockElement();
    root.children.push(insideChild);

    globalThis.document = {
      addEventListener(type, fn) {
        if (!docListeners.has(type)) docListeners.set(type, new Set());
        docListeners.get(type).add(fn);
      },
      removeEventListener(type, fn) {
        docListeners.get(type)?.delete(fn);
      },
    };
    try {
      let count = 0;
      const cleanup = registerClickOutside(root, () => { count++; });
      const fireMouseDown = (target) => {
        for (const fn of docListeners.get('mousedown') ?? []) fn({ target });
      };

      fireMouseDown(insideChild);
      assert.strictEqual(count, 0);

      fireMouseDown(outsideNode);
      assert.strictEqual(count, 1);

      cleanup();
      fireMouseDown(outsideNode);
      assert.strictEqual(count, 1);
    } finally {
      globalThis.document = prevDoc;
    }
  });

  it('handleDropdownKeyDown opens on ArrowDown, roves options, and closes on Escape', () => {
    const prevDoc = globalThis.document;
    const root = createMockElement();
    const trigger = createMockElement({ 'aria-haspopup': 'listbox' });
    const listbox = createMockElement({ role: 'listbox' });
    const opt1 = createMockElement({ role: 'option' });
    const opt2 = createMockElement({ role: 'option' });
    listbox.children.push(opt1, opt2);
    root.children.push(trigger, listbox);

    globalThis.document = { activeElement: trigger };
    try {
      let openState = null;
      handleDropdownKeyDown({ key: 'ArrowDown', preventDefault() {} }, root, false, (o) => { openState = o; });
      assert.strictEqual(openState, true);

      handleDropdownKeyDown({ key: 'ArrowDown', preventDefault() {} }, root, true, (o) => { openState = o; });
      assert.strictEqual(globalThis.document.activeElement, opt1);

      handleDropdownKeyDown({ key: 'ArrowDown', preventDefault() {} }, root, true, (o) => { openState = o; });
      assert.strictEqual(globalThis.document.activeElement, opt2);

      handleDropdownKeyDown({ key: 'Escape', preventDefault() {} }, root, true, (o) => { openState = o; });
      assert.strictEqual(openState, false);
      assert.strictEqual(globalThis.document.activeElement, trigger);
    } finally {
      globalThis.document = prevDoc;
    }
  });
});
