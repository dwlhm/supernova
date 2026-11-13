import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(appDir, '../..');

async function collectTsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTsFiles(fullPath)));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function readAllReactExampleSources() {
  const srcDir = path.join(appDir, 'src');
  const files = await collectTsFiles(srcDir);
  const contents = await Promise.all(files.map((f) => fs.readFile(f, 'utf-8')));
  return contents.join('\n');
}

test('example-react imports and demonstrates every single component from @komerce-design/react (including ToastViewport)', async () => {
  const indexPath = path.join(rootDir, 'library/react/dist/index.ts');
  const indexContent = await fs.readFile(indexPath, 'utf-8');
  const exportedNames = [...indexContent.matchAll(/export \{ default as (\w+) \}/g)].map((m) => m[1]);
  assert.ok(exportedNames.length >= 79, `expected >= 79 exported components, got ${exportedNames.length}`);
  assert.ok(exportedNames.includes('ToastViewport'), 'expected ToastViewport to be exported from @komerce-design/react');

  const combinedSource = await readAllReactExampleSources();
  const missing = exportedNames.filter((name) => !new RegExp(`\\b${name}\\b`).test(combinedSource));
  assert.deepEqual(missing, [], `example-react is missing components: ${missing.join(', ')}`);
});

test('example-react demonstrates 5 focused pages with full composable code snippets and generalized SRP helpers', async () => {
  const { buildOverlayCodeSnippet } = await import('../src/snippets/overlayCodeSnippet.ts');
  const { buildFormCodeSnippet } = await import('../src/snippets/formCodeSnippet.ts');
  const { buildTableCodeSnippet } = await import('../src/snippets/tableCodeSnippet.ts');
  const { buildChartCodeSnippet } = await import('../src/snippets/chartCodeSnippet.ts');
  const { buildFlowsCodeSnippet } = await import('../src/snippets/flowsCodeSnippet.ts');

  const overlayCode = buildOverlayCodeSnippet({
    placement: 'bottom-center',
    toastType: 'success',
    expanded: true,
    duration: 4500,
    showDescription: true,
    showAction: true,
    showClose: true,
  });
  assert.match(overlayCode, /ToastViewport/);
  assert.match(overlayCode, /parseFloatingPlacement/);
  assert.match(overlayCode, /bottom-center/);

  assert.match(buildFormCodeSnippet('merchant'), /bindCheckboxField/);
  assert.match(buildTableCodeSnippet({ viewMode: 'orders', activeStatus: 'Delivered', minHighValue: true, pageSize: 4 }), /createTableController/);
  assert.match(buildChartCodeSnippet({ chartMode: 'grouped-bar', tooltipPosition: 'top', formatPreset: 'paket', showDataLabels: true, showGridLines: true, mutedSeries: [1] }), /muteSeriesValues/);
  assert.match(buildFlowsCodeSnippet({ fabPlacement: 'top-left', stepperOrientation: 'vertical', currentStep: 2 }), /parseFloatingPlacement/);
});

test('example-react headless controllers handle dirty state, rapid abort, placement moves, and worst-case bounds', async () => {
  const { createShipmentForm } = await import('../src/sections/shipmentFormModel.ts');
  const {
    createTableController,
    createOverlayController,
    getVirtualWindow,
    parseDateInput,
    parseFloatingPlacement,
    computeDeckOffset,
    groupByKey,
    toggleListItem,
    bindControllerProps,
    handleTextInput,
  } = await import('@komerce-design/react/utils.ts');

  const logs = [];
  const form = createShipmentForm((entry) => logs.push(entry));

  // 1) Rapid typing within debounce window coalesces into a single request + AbortSignal mid-flight cancellation
  form.setValue('username', 'adm', { shouldValidate: true });
  form.setValue('username', 'admin', { shouldValidate: true });
  await new Promise((r) => setTimeout(r, 330));
  form.setValue('username', 'valid_merchant_name', { shouldValidate: true });
  await new Promise((r) => setTimeout(r, 700));
  const abortedCount = logs.filter((l) => l.status === 'ABORTED').length;
  assert.ok(abortedCount >= 1, `expected mid-flight typing to abort prior request, logs=${JSON.stringify(logs)}`);
  assert.equal(form.getFieldState('username').error, false);

  // Sync validation punish-late / reward-early + boolean checkbox & server error helpers
  form.setValue('email', 'bukan-email');
  form.handleBlur('email');
  assert.equal(form.getFieldState('email').error, true);
  form.setValue('email', 'valid@komerce.id');
  assert.equal(form.getFieldState('email').error, false);
  form.bindCheckboxField('agreeTerms').onCheckedChange(false);
  assert.equal(form.getFieldState('agreeTerms').error, true);
  form.setFieldError('coupon', 'Server 422');
  assert.equal(form.getFieldState('coupon').errorMessage, 'Server 422');
  form.clearFieldErrors();
  assert.equal(form.getFieldState('coupon').error, false);
  form.dispose();

  // Table controller worst-case bounds, criteria filters, and selection pruning on row deletion
  const table = createTableController({
    rows: [
      { id: '1', name: 'Alpha', status: 'Delivered' },
      { id: '2', name: 'Beta', status: 'Pending' },
    ],
    initialPageSize: 1,
    initialSelectedIds: ['1', '2'],
  });
  table.setPage(999);
  assert.equal(table.getState().currentPage, 2);
  table.setFilter('status', 'Delivered');
  assert.equal(table.getState().totalItems, 1);
  table.setRows([{ id: '1', name: 'Alpha', status: 'Delivered' }]);
  assert.deepEqual(table.getState().selectedIds, ['1']);
  table.setQuery('zzz-not-found');
  assert.equal(table.getState().isEmpty, true);
  table.reset();
  assert.equal(table.getState().isEmpty, false);

  // Virtual window extreme scroll offsets
  const negWin = getVirtualWindow({ totalItems: 10000, itemHeight: 36, containerHeight: 180, scrollTop: -500 });
  assert.equal(negWin.startIndex, 0);
  const emptyWin = getVirtualWindow({ totalItems: 0, itemHeight: 36, containerHeight: 180, scrollTop: 100 });
  assert.equal(emptyWin.virtualItems.length, 0);

  // Generalized floating & collection SRP helpers
  assert.equal(parseFloatingPlacement('corrupt-input', 'bottom-left').placement, 'bottom-left');
  assert.equal(computeDeckOffset(1, 'bottom', 10).offsetY, -10);
  assert.deepEqual(toggleListItem(['a', 'b'], 'a'), ['b']);

  // Date parser malformed & natural language input
  assert.equal(parseDateInput('   ', 2026, 11), null);
  assert.deepEqual(parseDateInput('3 hari lagi', 2026, 11), { year: 2026, month: 11, day: 4 });

  // Regression: handleTextInput + bindControllerProps must never overwrite string value with DOM/SyntheticEvent
  let ctrlState = {};
  const setCtrlState = (updater) => { ctrlState = updater(ctrlState); };
  const receivedValues = [];
  const bound = bindControllerProps(
    { value: 'komerce', onValueChange: (v) => receivedValues.push(v) },
    ctrlState,
    setCtrlState,
  );
  const circularEvent = { target: { value: 'komerce_edited' }, nativeEvent: {} };
  circularEvent.nativeEvent.self = circularEvent;
  handleTextInput(circularEvent, false, bound.onValueChange, bound.onChange);
  assert.deepEqual(receivedValues, ['komerce_edited']);
  assert.equal(ctrlState.value, 'komerce_edited');
  assert.doesNotThrow(() => JSON.stringify(ctrlState.value));

  // Overlay controller isolated pub/sub + multi-placement grouping
  const overlay = createOverlayController({ defaultDuration: 0, defaultPlacement: 'top-right' });
  let toastCommits = 0;
  let dialogCommits = 0;
  overlay.subscribeToast(() => { toastCommits++; });
  overlay.subscribeDialog(() => { dialogCommits++; });
  overlay.info('Top Right Dispatch');
  overlay.success('Bottom Center Alert', { placement: 'bottom-center', meta: { progress: 80 } });
  const byPos = groupByKey(overlay.getToastQueue(), (t) => t.placement);
  assert.equal(byPos['top-right']?.length, 1);
  assert.equal(byPos['bottom-center']?.length, 1);
  assert.equal(toastCommits, 2);
  assert.equal(dialogCommits, 0);
  overlay.setToastPlacement('top-left', true);
  assert.ok(overlay.getToastQueue().every((t) => t.placement === 'top-left'));

  // Concurrent per-toast auto-dismiss + pause/resume without persistent toast canceling timed toast
  overlay.info('Timed Item', { id: 'timed-1', duration: 40 });
  overlay.warning('Persistent Item', { id: 'persist-1', duration: 0 });
  await new Promise((r) => setTimeout(r, 70));
  assert.equal(overlay.getToastQueueSnapshot().some((t) => t.id === 'timed-1'), false);
  assert.equal(overlay.getToastQueueSnapshot().some((t) => t.id === 'persist-1'), true);
  overlay.dispose();
});
