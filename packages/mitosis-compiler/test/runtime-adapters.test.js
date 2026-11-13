import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  createFormController,
  createOverlayController,
  createTableController,
  createVue3Runtime,
  getReactRuntimeSource,
  getVue3RuntimeSource,
  useForm,
  useFormField,
  useOverlay,
  useTable,
} from '../dist/index.js';

function createVue3TestScope() {
  const cleanups = [];
  const bindings = {
    shallowRef(initialValue) {
      return { value: initialValue };
    },
    onScopeDispose(fn) {
      cleanups.push(fn);
    },
  };
  return {
    runtime: createVue3Runtime(bindings),
    stop() {
      while (cleanups.length > 0) {
        const fn = cleanups.pop();
        fn();
      }
    },
    cleanupCount() {
      return cleanups.length;
    },
  };
}

describe('Tier 2 Runtime Framework Adapters (React & Vue 3)', () => {
  describe('runtime-react.ts', () => {
    it('useForm and useFormField render initial and updated controller state via React.useSyncExternalStore', () => {
      const form = createFormController({
        initialValues: { username: 'komerce', agree: false },
        rules: { username: { required: 'Username required' } },
      });

      function FieldView() {
        const field = useFormField(form, 'username');
        const whole = useForm(form);
        return React.createElement(
          'div',
          { 'data-name': field.name, 'data-value': field.value, 'data-all': whole.values.username },
          field.bind.value
        );
      }

      const html1 = renderToStaticMarkup(React.createElement(FieldView));
      assert.ok(html1.includes('data-value="komerce"'));
      assert.ok(html1.includes('data-all="komerce"'));

      form.setValue('username', 'supernova');
      const html2 = renderToStaticMarkup(React.createElement(FieldView));
      assert.ok(html2.includes('data-value="supernova"'));
      assert.ok(html2.includes('data-all="supernova"'));
      form.dispose();
    });

    it('useForm creates owned controller from options and useFormField exposes checkbox/radio/error helpers', () => {
      function FormView() {
        const form = useForm({ initialValues: { email: 'a@b.com', role: 'admin', ok: true } });
        const email = useFormField(form.controller, 'email');
        const role = useFormField(form.controller, 'role');
        const ok = useFormField(form.controller, 'ok');
        return React.createElement('div', {
          'data-email': email.bind.value,
          'data-role-checked': String(role.bindRadio('admin').checked),
          'data-ok': String(ok.bindCheckbox().checked),
        });
      }

      const html = renderToStaticMarkup(React.createElement(FormView));
      assert.ok(html.includes('data-email="a@b.com"'));
      assert.ok(html.includes('data-role-checked="true"'));
      assert.ok(html.includes('data-ok="true"'));
    });

    it('useTable renders paginated, sorted, and selected rows from TableController', () => {
      const tableCtrl = createTableController({
        rows: [
          { id: '1', name: 'Budi' },
          { id: '2', name: 'Andi' },
          { id: '3', name: 'Citra' },
        ],
        initialSortKey: 'name',
        initialSortDirection: 'asc',
        initialPageSize: 2,
      });

      function TableView() {
        const table = useTable(tableCtrl);
        return React.createElement(
          'div',
          {
            'data-first': table.rows[0]?.name,
            'data-pages': String(table.totalPages),
            'data-sort': table.bindHeaderSort('name').sortDirection,
          },
          table.rows.map((r) => r.name).join(',')
        );
      }

      const html1 = renderToStaticMarkup(React.createElement(TableView));
      assert.ok(html1.includes('data-first="Andi"'));
      assert.ok(html1.includes('data-pages="2"'));
      assert.ok(html1.includes('data-sort="asc"'));
      assert.ok(html1.includes('Andi,Budi'));

      tableCtrl.setPage(2);
      const html2 = renderToStaticMarkup(React.createElement(TableView));
      assert.ok(html2.includes('data-first="Citra"'));
    });

    it('useOverlay subscribes to toast, queue, and dialog stores', () => {
      const overlayCtrl = createOverlayController();
      overlayCtrl.success('Saved', { description: 'Manifest updated' });
      overlayCtrl.openDialog({ heading: 'Confirm Delete', destructive: true });

      function OverlayView() {
        const overlay = useOverlay(overlayCtrl);
        return React.createElement('div', {
          'data-toast-title': overlay.toast.title,
          'data-queue-len': String(overlay.queue.length),
          'data-dialog-open': String(overlay.dialog.open),
          'data-dialog-heading': overlay.dialog.heading,
        });
      }

      const html = renderToStaticMarkup(React.createElement(OverlayView));
      assert.ok(html.includes('data-toast-title="Saved"'));
      assert.ok(html.includes('data-queue-len="1"'));
      assert.ok(html.includes('data-dialog-open="true"'));
      assert.ok(html.includes('data-dialog-heading="Confirm Delete"'));
      overlayCtrl.dispose();
    });
  });

  describe('runtime-vue3.ts', () => {
    it('useForm and useFormField reactively sync shallowRef state and dispose owned controllers', () => {
      const scope = createVue3TestScope();
      const form = scope.runtime.useForm({
        initialValues: { username: 'merchant', agree: false },
        rules: { username: { required: 'Required' } },
      });
      const usernameField = scope.runtime.useFormField(form.controller, 'username');
      const agreeField = scope.runtime.useFormField(form.controller, 'agree');

      assert.strictEqual(form.values.value.username, 'merchant');
      assert.strictEqual(usernameField.state.value.value, 'merchant');
      assert.strictEqual(agreeField.bindCheckbox().checked, false);

      usernameField.setValue('komerce_pro');
      assert.strictEqual(form.values.value.username, 'komerce_pro');
      assert.strictEqual(usernameField.state.value.value, 'komerce_pro');
      assert.strictEqual(usernameField.bind().value, 'komerce_pro');

      usernameField.setError('Taken');
      assert.strictEqual(usernameField.state.value.error, true);
      assert.strictEqual(usernameField.state.value.errorMessage, 'Taken');

      agreeField.bindCheckbox().onCheckedChange(true);
      assert.strictEqual(agreeField.state.value.value, true);

      assert.strictEqual(scope.cleanupCount(), 3);
      scope.stop();
      assert.strictEqual(scope.cleanupCount(), 0);

      // After scope dispose, form listeners were cleared so further mutations do not update disposed refs
      form.controller.setValue('username', 'after_dispose');
      assert.strictEqual(form.values.value.username, 'komerce_pro');
    });

    it('useTable reactively updates shallowRef state on query, sort, page, and selection changes', () => {
      const scope = createVue3TestScope();
      const table = scope.runtime.useTable({
        rows: [
          { id: '1', name: 'Zebra' },
          { id: '2', name: 'Alpha' },
          { id: '3', name: 'Mango' },
        ],
        searchKeys: ['name'],
        initialPageSize: 2,
      });

      assert.strictEqual(table.state.value.rows.length, 2);
      assert.strictEqual(table.state.value.totalPages, 2);

      table.toggleSort('name');
      assert.strictEqual(table.state.value.sortDirection, 'asc');
      assert.strictEqual(table.state.value.rows[0].name, 'Alpha');

      table.toggleRow('2', true);
      assert.deepStrictEqual(table.state.value.selectedIds, ['2']);

      table.setQuery('Man');
      assert.strictEqual(table.state.value.rows.length, 1);
      assert.strictEqual(table.state.value.rows[0].name, 'Mango');

      scope.stop();
      table.setQuery('');
      // Unsubscribed on scope dispose
      assert.strictEqual(table.state.value.rows.length, 1);
    });

    it('useOverlay reactively updates toast, queue, and dialog shallowRefs and cleans up onScopeDispose', async () => {
      const scope = createVue3TestScope();
      const overlay = scope.runtime.useOverlay();

      assert.strictEqual(overlay.toast.value.open, false);
      assert.strictEqual(overlay.queue.value.length, 0);
      assert.strictEqual(overlay.dialog.value.open, false);

      overlay.info('Syncing', { duration: 0 });
      assert.strictEqual(overlay.toast.value.open, true);
      assert.strictEqual(overlay.toast.value.title, 'Syncing');
      assert.strictEqual(overlay.queue.value.length, 1);

      let confirmed = false;
      overlay.openDialog({
        heading: 'Publish?',
        onConfirm: () => {
          confirmed = true;
        },
      });
      assert.strictEqual(overlay.dialog.value.open, true);
      assert.strictEqual(overlay.dialog.value.heading, 'Publish?');

      const ok = await overlay.confirmDialog();
      assert.strictEqual(ok, true);
      assert.strictEqual(confirmed, true);
      assert.strictEqual(overlay.dialog.value.open, false);

      scope.stop();
    });
  });

  describe('runtime source emission', () => {
    it('getReactRuntimeSource and getVue3RuntimeSource rewrite core imports to ./utils.ts', () => {
      const reactSrc = getReactRuntimeSource();
      assert.ok(reactSrc.includes("from './utils.ts'"));
      assert.ok(!reactSrc.includes("from './core-"));
      assert.ok(reactSrc.includes('useSyncExternalStore'));

      const vue3Src = getVue3RuntimeSource();
      assert.ok(vue3Src.includes("import { shallowRef, onScopeDispose } from 'vue'"));
      assert.ok(vue3Src.includes("from './utils.ts'"));
      assert.ok(!vue3Src.includes("from './core-"));
      assert.ok(vue3Src.includes('export const { useForm, useFormField, useTable, useOverlay }'));
    });
  });
});
