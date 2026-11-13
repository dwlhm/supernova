import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  resolveId,
  resolveControllable,
  clampPercent,
  shiftYearMonth,
  getCalendarDays,
  formatDateDisplay,
  parseDateInput,
  getMonthGridEntries,
  getYearGridEntries,
  getDatePickerState,
  bindControllerProps,
  getPaginationEntries,
  getBreadcrumbItems,
  computeOtpDigits,
  applyOtpChar,
  applyOtpPasteString,
  filterDropdownOptions,
  getDropdownOptions,
  getIconPath,
  getToastIconPath,
  getChartBarState,
  getChartLineState,
  getChartPieState,
  getChartHorizontalBarState,
  getChartScatterState,
  getChartRadarState,
  getChartGaugeState,
  getChartFunnelState,
  getChartWaterfallState,
  getTableBodyRowCells,
  getTableState,
  getInputState,
  getOtpState,
  getDropdownState,
  getFileState,
  getProgressState,
  getSliderState,
  createFormController,
  createTableController,
  createOverlayController,
  FLOATING_PLACEMENTS,
  parseFloatingPlacement,
  computeDeckOffset,
  computeStackOffset,
  computeStackTrackHeight,
  computeSwipeDisplacement,
  isInteractiveDragTarget,
  mergeDragStyle,
  groupByKey,
  toggleListItem,
  filterByCriteria,
  retainValidIds,
  muteSeriesValues,
  filterActiveSeries,
  computeNiceTicks,
} from '../dist/index.js';

describe('Tier 1 — Pure Headless Core (core-*.ts)', () => {
  it('resolveId and resolveControllable resolve values deterministically (SSR-safe)', () => {
    assert.strictEqual(resolveId('', 'input-text'), 'input-text');
    assert.strictEqual(resolveId('custom-id', 'input-text'), 'custom-id');
    assert.strictEqual(resolveControllable('controlled', 'internal', 'fallback'), 'controlled');
    assert.strictEqual(resolveControllable(undefined, 'internal', 'fallback'), 'internal');
    assert.strictEqual(resolveControllable(undefined, undefined, 'fallback'), 'fallback');
    assert.strictEqual(clampPercent(50, 0, 100), 50);
    assert.strictEqual(clampPercent(NaN, 0, 100), 0);
  });

  it('core-date computes calendar days, month shift, pagination, and breadcrumb original indices', () => {
    assert.deepStrictEqual(shiftYearMonth(2025, 1, -1), { year: 2024, month: 12 });
    assert.deepStrictEqual(shiftYearMonth(2025, 12, 1), { year: 2026, month: 1 });
    const cal = getCalendarDays(2025, 2);
    assert.strictEqual(cal.daysInMonth, 28);
    assert.strictEqual(cal.monthLabel, 'February 2025');
    assert.strictEqual(formatDateDisplay(2025, 2, 7, ''), '2025-02-07');
    const pages = getPaginationEntries(5, 10);
    assert.ok(pages.some((p) => p.isEllipsis));
    const crumbs = getBreadcrumbItems(
      [{ label: 'A' }, { label: 'B' }, { label: 'C' }, { label: 'D' }, { label: 'E' }],
      true
    );
    assert.strictEqual(crumbs.length, 4);
    assert.strictEqual(crumbs[3].originalIndex, 4);
  });

  it('DatePicker handles composable modes (single/range/month/year), editable, hover preview, and dirty inputs', () => {
    const rangeState = getDatePickerState({
      mode: 'range',
      open: true,
      year: 2025,
      month: 6,
      value: 25,
      endYear: 2025,
      endMonth: 7,
      endValue: 9,
    });
    assert.strictEqual(rangeState.isRangeMode, true);
    assert.strictEqual(rangeState.resolvedLabel, 'Date range');
    assert.strictEqual(rangeState.panels.length, 2);
    assert.strictEqual(rangeState.panels[0].monthLabel, 'June 2025');
    assert.strictEqual(rangeState.panels[1].monthLabel, 'July 2025');
    assert.ok(rangeState.panels[0].cells.some((c) => c.day === 25 && !c.isOutside && c.isRangeStart && c.isSelected));
    assert.ok(rangeState.panels[0].cells.some((c) => c.day === 28 && !c.isOutside && c.isInRange && !c.isSelected));
    assert.ok(rangeState.panels[1].cells.some((c) => c.day === 29 && c.isOutside && c.isInRange));
    assert.ok(rangeState.panels[1].cells.some((c) => c.day === 9 && !c.isOutside && c.isRangeEnd && c.isSelected));

    const yearState = getDatePickerState({ mode: 'year', open: true, year: 2026 });
    assert.strictEqual(yearState.viewMode, 'years');
    assert.strictEqual(yearState.isGridMode, true);
    assert.strictEqual(yearState.resolvedLabel, 'Year');
    assert.strictEqual(yearState.gridEntries.length, 9);
    assert.strictEqual(yearState.gridEntries[0].value, 2021);
    assert.strictEqual(yearState.gridEntries[8].value, 2029);
    assert.ok(yearState.gridEntries.some((y) => y.value === 2026 && y.isSelected));

    const monthState = getDatePickerState({ mode: 'month', open: true, month: 6, year: 2025 });
    assert.strictEqual(monthState.viewMode, 'months');
    assert.strictEqual(monthState.resolvedLabel, 'Month');
    assert.strictEqual(monthState.gridEntries.length, 12);
    assert.ok(monthState.gridEntries.some((m) => m.value === 6 && m.label === 'Jun' && m.isSelected));

    assert.deepStrictEqual(parseDateInput('In 2 days', 2025, 6), { year: 2025, month: 6, day: 3 });
    assert.deepStrictEqual(parseDateInput('June 15, 2025', 2025, 6), { year: 2025, month: 6, day: 15 });
    assert.deepStrictEqual(parseDateInput('15 June 2025', 2025, 6), { year: 2025, month: 6, day: 15 });
    assert.deepStrictEqual(parseDateInput('15/06/2025', 2025, 6), { year: 2025, month: 6, day: 15 });
    assert.deepStrictEqual(parseDateInput('next week', 2025, 6), { year: 2025, month: 6, day: 8 });
    assert.deepStrictEqual(parseDateInput('3 hari lagi', 2025, 6), { year: 2025, month: 6, day: 4 });
    assert.deepStrictEqual(parseDateInput('2025-12-31', 2025, 6), { year: 2025, month: 12, day: 31 });
    assert.strictEqual(parseDateInput('invalid partial text', 2025, 6), null);
    assert.strictEqual(parseDateInput('', 2025, 6), null);

    // Viewport navigation (< / >) does NOT shift selected date or range
    let navCtrl = {};
    const setNavCtrl = (fn) => { navCtrl = fn(navCtrl); };
    let navBound = bindControllerProps({ mode: 'single', open: true, year: 2025, month: 6, value: 15 }, navCtrl, setNavCtrl);
    navBound.onMonthStep(1);
    navBound = bindControllerProps({ mode: 'single', open: true, year: 2025, month: 6, value: 15 }, navCtrl, setNavCtrl);
    const navState = getDatePickerState(navBound);
    assert.strictEqual(navState.monthLabel, 'July 2025');
    assert.ok(!navState.panels[0].cells.some((c) => !c.isOutside && c.isSelected));
    assert.strictEqual(navState.displayText, '2025-06-15');

    // Empty state (value: 0) highlights todayDay with isToday, NOT isSelected, and hasValue is false
    const emptySingle = getDatePickerState({ mode: 'single', open: true, year: 2025, month: 6, value: 0 });
    assert.strictEqual(emptySingle.hasValue, false);
    assert.strictEqual(emptySingle.resolvedLabel, 'Date');
    assert.strictEqual(emptySingle.displayText, 'Select a date');
    assert.ok(!emptySingle.panels[0].cells.some((c) => c.isSelected));
    assert.ok(emptySingle.panels[0].cells.some((c) => c.day === 25 && !c.isOutside && c.isToday));

    let ctrlState = {};
    const setCtrlState = (fn) => { ctrlState = fn(ctrlState); };
    let bound = bindControllerProps({ mode: 'range', open: true, year: 2025, month: 6 }, ctrlState, setCtrlState);
    bound.onSelect({ year: 2025, month: 7, day: 10 });
    bound = bindControllerProps({ mode: 'range', open: true, year: 2025, month: 6 }, ctrlState, setCtrlState);
    bound.onSelect({ year: 2025, month: 6, day: 20 });
    bound = bindControllerProps({ mode: 'range', open: true, year: 2025, month: 6 }, ctrlState, setCtrlState);
    assert.strictEqual(bound.month, 6);
    assert.strictEqual(bound.value, 20);
    assert.strictEqual(bound.endMonth, 7);
    assert.strictEqual(bound.endValue, 10);

    // Same-month range selection & adaptive/customizable hint
    const sameMonthRange = getDatePickerState({
      mode: 'range',
      open: true,
      year: 2025,
      month: 6,
      value: 10,
      endYear: 2025,
      endMonth: 6,
      endValue: 20,
      showHint: true,
    });
    assert.strictEqual(sameMonthRange.resolvedHint, 'Selected range: June 10, 2025 – June 20, 2025.');
    assert.strictEqual(sameMonthRange.showHintText, true);
    assert.ok(sameMonthRange.panels[0].cells.some((c) => c.day === 15 && !c.isOutside && c.isInRange));
    assert.ok(!sameMonthRange.panels[1].cells.some((c) => !c.isOutside && c.isInRange));

    const partialRange = getDatePickerState({
      mode: 'range',
      year: 2025,
      month: 6,
      value: 10,
      endValue: 0,
      showHint: true,
    });
    assert.strictEqual(partialRange.resolvedHint, 'Start date: June 10, 2025 — select an end date.');

    // Hover preview during range selection highlights cells up to cursor with range styles
    const hoverRange = getDatePickerState({
      mode: 'range',
      open: true,
      year: 2025,
      month: 6,
      value: 10,
      endValue: 0,
      hoverYear: 2025,
      hoverMonth: 6,
      hoverValue: 18,
    });
    assert.ok(hoverRange.panels[0].cells.some((c) => c.day === 10 && !c.isOutside && c.isRangeStart && c.isSelected));
    assert.ok(hoverRange.panels[0].cells.some((c) => c.day === 14 && !c.isOutside && c.isInRange));
    assert.ok(hoverRange.panels[0].cells.some((c) => c.day === 18 && !c.isOutside && c.isRangeEnd && c.isSelected));

    assert.strictEqual(
      getDatePickerState({ mode: 'single', year: 2025, month: 6, value: 15, showHint: true }).resolvedHint,
      'Selected date: June 15, 2025.'
    );
    assert.strictEqual(
      getDatePickerState({ mode: 'year', year: 2027, showHint: true }).resolvedHint,
      'Selected year: 2027.'
    );
    assert.strictEqual(
      getDatePickerState({ mode: 'month', year: 2025, month: 9, showHint: true }).resolvedHint,
      'Selected month: September 2025.'
    );

    // Static string hint auto-shows hint
    const customHintState = getDatePickerState({
      mode: 'single',
      year: 2025,
      month: 6,
      value: 15,
      hint: 'Pilih jadwal pengiriman aktif',
    });
    assert.strictEqual(customHintState.showHintText, true);
    assert.strictEqual(customHintState.resolvedHint, 'Pilih jadwal pengiriman aktif');

    // Callback hint & displayValue receive DatePickerFormatArg (Date instance + metadata)
    const cbDateState = getDatePickerState({
      mode: 'single',
      year: 2025,
      month: 6,
      value: 15,
      hint: (date) => `date ${date.formatted} (${date.iso})`,
      displayValue: (date) => `Tgl: ${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
    });
    assert.strictEqual(cbDateState.showHintText, true);
    assert.strictEqual(cbDateState.resolvedHint, 'date June 15, 2025 (2025-06-15)');
    assert.strictEqual(cbDateState.displayText, 'Tgl: 15/6/2025');

    assert.strictEqual(getInputState({ value: 'komerce', hint: (val) => `input: ${val}` }).helpText, 'input: komerce');
    assert.strictEqual(getOtpState({ value: '1234', hint: (val) => `otp: ${val}` }).helpText, 'otp: 1234');
    assert.strictEqual(getDropdownState({ value: 'id', hint: (val) => `selected: ${val}`, displayValue: (val) => `Country: ${val.toUpperCase()}` }).displayText, 'Country: ID');
    assert.strictEqual(getFileState({ fileName: 'invoice.pdf', hint: (name) => `file: ${name}`, fileCount: (n) => `${n} berkas` }).resolvedFileCount, '0 berkas');
    assert.strictEqual(getProgressState(75, (pct) => `Uploading (${pct}%)`).resolvedLabel, 'Uploading (75%)');
    assert.strictEqual(getSliderState({ value: 40, label: (v) => `Volume ${v}%`, hint: (v) => `Current: ${v}`, formatValue: (v) => `${v} dB` }).displayValue, '40 dB');

    // Clearing inputText via controller stays empty instead of snapping back
    let inputCtrlState = {};
    const setInputCtrl = (fn) => { inputCtrlState = fn(inputCtrlState); };
    let inputBound = bindControllerProps({ mode: 'single', editable: true, year: 2025, month: 6 }, inputCtrlState, setInputCtrl);
    inputBound.onInputChange('');
    inputBound = bindControllerProps({ mode: 'single', editable: true, year: 2025, month: 6 }, inputCtrlState, setInputCtrl);
    assert.strictEqual(getDatePickerState(inputBound).inputText, '');

    // Customizable label + Headless Form (createFormController) integration
    const customLabelState = getDatePickerState({
      mode: 'single',
      label: 'Tanggal Pengiriman',
    });
    assert.strictEqual(customLabelState.resolvedLabel, 'Tanggal Pengiriman');

    const form = createFormController({
      initialValues: { deliveryDate: '' },
      rules: { deliveryDate: { required: 'Tanggal pengiriman wajib dipilih.' } },
    });
    const emptyField = form.bindField('deliveryDate');
    const emptyFormState = getDatePickerState({ mode: 'single', ...emptyField });
    assert.strictEqual(emptyFormState.hasValue, false);
    assert.strictEqual(emptyFormState.hasError, false);

    // Trigger blur without selection -> Punish Late shows errorMessage even when showHint is false
    emptyField.onBlur();
    const errField = form.bindField('deliveryDate');
    const errFormState = getDatePickerState({ mode: 'single', showHint: false, ...errField });
    assert.strictEqual(errFormState.hasError, true);
    assert.strictEqual(errFormState.showHintText, true);
    assert.strictEqual(errFormState.resolvedHint, 'Tanggal pengiriman wajib dipilih.');

    // Selecting a date via bindControllerProps updates form value & clears error (Reward Early)
    let dpCtrl = {};
    const setDpCtrl = (fn) => { dpCtrl = fn(dpCtrl); };
    const dpBound = bindControllerProps({ mode: 'single', year: 2025, month: 6, ...form.bindField('deliveryDate') }, dpCtrl, setDpCtrl);
    dpBound.onSelect({ year: 2025, month: 6, day: 18 });
    const filledField = form.bindField('deliveryDate');
    assert.strictEqual(filledField.value, '2025-06-18');
    assert.strictEqual(filledField.error, false);
    const filledFormState = getDatePickerState({ mode: 'single', ...filledField });
    assert.strictEqual(filledFormState.hasValue, true);
    assert.strictEqual(filledFormState.displayText, '2025-06-18');
    assert.ok(filledFormState.panels[0].cells.some((c) => c.day === 18 && !c.isOutside && c.isSelected));
  });

  it('core-form preserves OTP slot positions on middle edits and paste', () => {
    const val = applyOtpChar('', 2, '9', 4);
    const digits = computeOtpDigits(val, 4);
    assert.deepStrictEqual(digits, ['', '', '9', '']);
    assert.strictEqual(applyOtpPasteString('12 34 56 78', 6), '123456');
    const filtered = filterDropdownOptions(
      [{ label: 'Engineering', value: 'eng' }, { label: 'Marketing', value: 'mkt' }],
      'mark'
    );
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].value, 'mkt');
    const entries = getDropdownOptions(['Engineering', 'Product', { label: 'Operations', value: 'ops', disabled: true }], '  o  ', 'Product');
    assert.deepStrictEqual(entries, [
      { label: 'Product', value: 'Product', selected: true, disabled: false },
      { label: 'Operations', value: 'ops', selected: false, disabled: true },
    ]);
    assert.deepStrictEqual(getDropdownOptions(undefined, 'xyz', ''), []);
    assert.ok(getIconPath('check').length > 0);
    assert.ok(getToastIconPath('error').length > 0);
  });

  it('core-chart computes SSR-safe metrics, coordinates, and slices for detail cards', () => {
    const data = [
      { label: 'Mon', value: 20 },
      { label: 'Tue', value: 80 },
    ];
    const barState = getChartBarState(data);
    assert.strictEqual(barState.max, 80);
    assert.strictEqual(barState.total, 100);
    assert.strictEqual(barState.barHeight(80), '100%');
    assert.strictEqual(barState.barHeight(20), '25%');

    const lineState = getChartLineState(data);
    assert.strictEqual(lineState.points.length, 2);
    assert.strictEqual(lineState.points[0].x, 0);
    assert.strictEqual(lineState.points[0].y, 75); // 100 - (20/80)*100
    assert.strictEqual(lineState.points[1].x, 100);
    assert.strictEqual(lineState.points[1].y, 0); // 100 - (80/80)*100
    assert.ok(lineState.areaPoints.includes('0,100'));

    const pieState = getChartPieState(data, 20);
    assert.strictEqual(pieState.total, 100);
    assert.strictEqual(pieState.slices.length, 2);
    assert.strictEqual(pieState.slices[0].percentage, 20);
    assert.strictEqual(pieState.slices[1].percentage, 80);
    assert.ok(pieState.ringRadius > 0);
  });

  it('core-chart handles multi-data (multi-series values) for grouped bars and multi-lines', () => {
    const multiData = [
      { label: 'Mon', values: [30, 60] },
      { label: 'Tue', values: [90, 45] },
    ];
    const barState = getChartBarState(multiData);
    assert.strictEqual(barState.max, 90);
    assert.strictEqual(barState.total, 225);
    assert.strictEqual(barState.rows[0].bars.length, 2);
    assert.strictEqual(barState.rows[0].bars[0].colorClass, 'bg-chart-series-1');
    assert.strictEqual(barState.rows[0].bars[1].colorClass, 'bg-chart-series-2');
    assert.strictEqual(barState.rows[1].bars[0].height, '100%');

    const lineState = getChartLineState(multiData);
    assert.strictEqual(lineState.lines.length, 2);
    assert.strictEqual(lineState.lines[0].strokeClass, 'stroke-chart-series-1');
    assert.strictEqual(lineState.lines[1].strokeClass, 'stroke-chart-series-2');
    assert.strictEqual(lineState.points[0].valuesList.length, 2);
    assert.strictEqual(lineState.points[0].valuesList[0].value, 30);
    assert.strictEqual(lineState.points[0].valuesList[1].value, 60);
  });

  it('core-chart computes stacked bar, horizontal bar, scatter, radar, gauge, funnel, and waterfall states', () => {
    const stackedBar = getChartBarState(
      [
        { label: 'Mon', values: [40, 30, 50] },
        { label: 'Tue', values: [25, 25, 30] },
      ],
      'bg-chart-series-1',
      true,
      200
    );
    assert.strictEqual(stackedBar.rows[0].value, 120);
    assert.strictEqual(stackedBar.rows[0].height, '60%');
    assert.strictEqual(stackedBar.rows[0].bars[0].height, '20%');

    const hbar = getChartHorizontalBarState([
      { label: 'Product A', value: 85 },
      { label: 'Product B', value: 40 },
    ]);
    assert.strictEqual(hbar.rows.length, 2);
    assert.strictEqual(hbar.rows[0].width, '85%');
    assert.strictEqual(hbar.rows[0].displayValue, '85%');
    assert.strictEqual(getChartHorizontalBarState([]).rows.length, 0);

    const scatter = getChartScatterState([
      { label: 'P1', x: 25, y: 75, series: 0 },
      { label: 'P2', x: 80, y: 20, series: 2 },
    ]);
    assert.strictEqual(scatter.points.length, 2);
    assert.strictEqual(scatter.points[0].left, '25.0%');
    assert.strictEqual(scatter.points[0].top, '25.0%');
    assert.strictEqual(scatter.points[1].colorClass, 'bg-chart-series-3');
    assert.strictEqual(getChartScatterState([]).points.length, 0);

    const radar = getChartRadarState([
      { label: 'Speed', values: [85, 65] },
      { label: 'Power', values: [70, 80] },
      { label: 'Range', values: [60, 75] },
      { label: 'Defense', values: [75, 85] },
      { label: 'Health', values: [80, 70] },
      { label: 'Magic', values: [65, 90] },
    ]);
    assert.strictEqual(radar.ringPolygons.length, 3);
    assert.strictEqual(radar.spokes.length, 6);
    assert.strictEqual(radar.axes.length, 6);
    assert.strictEqual(radar.series.length, 2);
    assert.strictEqual(radar.series[0].dots.length, 6);
    assert.strictEqual(getChartRadarState([{ label: 'OnlyOne', value: 50 }]).ringPolygons.length, 0);

    const gauge = getChartGaugeState(75, 0, 100);
    assert.strictEqual(gauge.percentage, 75);
    assert.strictEqual(gauge.displayValue, '75%');
    assert.strictEqual(getChartGaugeState(-20, 0, 100).percentage, 0);
    assert.strictEqual(getChartGaugeState(150, 0, 100).percentage, 100);
    assert.strictEqual(getChartGaugeState(NaN, 0, 100).percentage, 0);

    const funnel = getChartFunnelState([
      { label: 'Visitors', value: 12500 },
      { label: 'Leads', value: 8200 },
      { label: 'Closed', value: 620 },
    ]);
    assert.strictEqual(funnel.steps.length, 3);
    assert.strictEqual(funnel.steps[0].width, '100%');
    assert.strictEqual(funnel.steps[0].displayValue, '12,500');
    assert.strictEqual(funnel.steps[1].colorClass, 'bg-chart-series-2');
    assert.strictEqual(getChartFunnelState([]).steps.length, 0);

    const waterfall = getChartWaterfallState(
      [
        { label: 'Start', value: 120 },
        { label: '+Rev', value: 40 },
        { label: '-Cost', value: -30 },
        { label: 'Total', value: 130, isTotal: true },
      ],
      200
    );
    assert.strictEqual(waterfall.bars.length, 4);
    assert.strictEqual(waterfall.bars[0].kind, 'total');
    assert.strictEqual(waterfall.bars[0].bottom, '0.0%');
    assert.strictEqual(waterfall.bars[0].height, '60.0%');
    assert.strictEqual(waterfall.bars[1].kind, 'positive');
    assert.strictEqual(waterfall.bars[1].bottom, '60.0%');
    assert.strictEqual(waterfall.bars[1].height, '20.0%');
    assert.strictEqual(waterfall.bars[2].kind, 'negative');
    assert.strictEqual(waterfall.bars[2].bottom, '65.0%');
    assert.strictEqual(waterfall.bars[2].height, '15.0%');
    assert.strictEqual(waterfall.bars[3].kind, 'total');
    assert.strictEqual(waterfall.netTotal, 130);
    assert.strictEqual(waterfall.bars[1].tooltipText, '+Rev: +40 (Total: 160)');
    assert.strictEqual(getChartWaterfallState([{ label: 'Start', value: 120, tooltip: 'Custom Start' }]).bars[0].tooltipText, 'Custom Start');
    assert.strictEqual(getChartBarState([{ label: 'Mon', value: 120 }]).rows[0].bars[0].tooltipText, 'Mon: 120');
    assert.strictEqual(getChartBarState([{ label: 'Mon', value: 120, tooltip: 'Custom Mon' }]).rows[0].bars[0].tooltipText, 'Custom Mon');
    assert.strictEqual(getChartGaugeState(75, 0, 100).tooltipText, '75 / 100 (75%)');
    assert.strictEqual(getChartGaugeState(75, 0, 100, 'SLA: 75%').tooltipText, 'SLA: 75%');
    assert.strictEqual(radar.hotspots.length, 6);
    assert.strictEqual(radar.hotspots[0].tooltipText, 'Speed: S1 85 • S2 65');
    assert.strictEqual(getChartWaterfallState([]).bars.length, 0);

    // Chart callback formatters (formatTooltip, formatValue, and per-point tooltip callback)
    const formattedBar = getChartBarState(
      [
        { label: 'Q1', value: 1500 },
        { label: 'Q2', value: 2400, tooltip: (ctx) => `Quarter ${ctx.label}: Rp ${ctx.value}` },
      ],
      'bg-chart-series-1',
      false,
      0,
      (ctx) => `${ctx.label} = $${ctx.value}`,
      (val) => `$${val}`
    );
    assert.strictEqual(formattedBar.rows[0].displayValue, '$1500');
    assert.strictEqual(formattedBar.rows[0].bars[0].tooltipText, 'Q1 = $1500');
    assert.strictEqual(formattedBar.rows[1].bars[0].tooltipText, 'Quarter Q2: Rp 2400');

    const formattedPie = getChartPieState(
      [{ label: 'Organic', value: 60 }, { label: 'Paid', value: 40 }],
      30,
      (ctx) => `${ctx.label}: ${ctx.percentage}%`,
      (v) => `${v}k`
    );
    assert.strictEqual(formattedPie.displayTotal, '100k');
    assert.strictEqual(formattedPie.slices[0].tooltipText, 'Organic: 60%');
  });

  it('createTableController manages search, sorting, pagination, and selection with plug-and-play bind helpers', () => {
    const rows = [
      { id: '1', customer: 'Charlie', amount: 300 },
      { id: '2', customer: 'Alice', amount: 100 },
      { id: '3', customer: 'Bob', amount: 200 },
    ];
    const table = createTableController({ data: rows, initialPageSize: 2 });
    let notifyCount = 0;
    const unsub = table.subscribe(() => { notifyCount++; });

    assert.strictEqual(table.getState().totalItems, 3);
    assert.strictEqual(table.getState().totalPages, 2);
    assert.strictEqual(table.getState().rows.length, 2);

    // Sort via bindHeaderSort
    const customerSort = table.bindHeaderSort('customer');
    assert.strictEqual(customerSort.sortable, true);
    assert.strictEqual(customerSort.sortDirection, 'none');
    customerSort.onSort();
    assert.strictEqual(table.bindHeaderSort('customer').sortDirection, 'asc');
    assert.strictEqual(table.getState().rows[0].customer, 'Alice');
    assert.strictEqual(table.getState().rows[1].customer, 'Bob');

    // Pagination via bindPagination
    const pageProps = table.bindPagination();
    assert.strictEqual(pageProps.currentPage, 1);
    assert.strictEqual(pageProps.totalPages, 2);
    pageProps.onPageChange(2);
    assert.strictEqual(table.getState().currentPage, 2);
    assert.strictEqual(table.getState().rows.length, 1);
    assert.strictEqual(table.getState().rows[0].customer, 'Charlie');

    // Selection via bindRowCheckbox & bindHeaderCheckbox
    table.setPage(1);
    const row2Check = table.bindRowCheckbox('2');
    assert.strictEqual(row2Check.checked, false);
    row2Check.onCheckedChange(true);
    assert.strictEqual(table.bindRow('2').selected, true);
    assert.strictEqual(table.bindHeaderCheckbox().indeterminate, true);

    table.bindHeaderCheckbox().onCheckedChange(true);
    assert.strictEqual(table.bindHeaderCheckbox().checked, true);
    assert.strictEqual(table.bindHeaderCheckbox().indeterminate, false);

    // Search via bindSearch resets page to 1 and filters rows
    table.bindSearch().onValueChange('charlie');
    assert.strictEqual(table.getState().totalItems, 1);
    assert.strictEqual(table.getState().rows[0].id, '1');
    assert.ok(notifyCount > 0);
    unsub();
  });

  it('core-views-data normalizes mixed string and TableCellConfig cells and pageSizeOptions', () => {
    const cells = getTableBodyRowCells(
      [
        { value: 'John Doe', imageSrc: 'placeholder' },
        { badgeLabel: 'Badge' },
        '$1,200',
        { buttonLabel: 'Label' },
      ],
      [
        { id: 'name', label: 'Name' },
        { id: 'status', label: 'Status' },
        { id: 'amount', label: 'Amount', align: 'right' },
        { id: 'actions', label: 'Actions' },
      ]
    );
    assert.strictEqual(cells.length, 4);
    assert.strictEqual(cells[0].value, 'John Doe');
    assert.strictEqual(cells[0].imageSrc, 'placeholder');
    assert.strictEqual(cells[1].badgeLabel, 'Badge');
    assert.strictEqual(cells[2].value, '$1,200');
    assert.strictEqual(cells[2].align, 'right');
    assert.strictEqual(cells[3].buttonLabel, 'Label');

    // Dirty/fallback state (zero hardcoded dummy data in Tier 1)
    const fallbackCells = getTableBodyRowCells(undefined);
    assert.strictEqual(fallbackCells.length, 0);

    const tbl = getTableState({ state: 'default', pageSizeOptions: [10, 25, 50, 100] });
    assert.strictEqual(tbl.isEmpty, true);
    assert.deepStrictEqual(tbl.pageSizeOptions, [10, 25, 50, 100]);

    const defaultTbl = getTableState({});
    assert.deepStrictEqual(defaultTbl.pageSizeOptions, [10, 20, 50]);
  });

  it('Input* state helpers and createFormController handle per-field isolation, punish-late/reward-early, and async abort', async () => {
    assert.strictEqual(getInputState({ errorMessage: 'Invalid' }).hasError, true);
    assert.strictEqual(getInputState({ error: true, hint: 'Hint' }).hasError, true);
    assert.strictEqual(getInputState({ validating: true }).isValidating, true);
    assert.strictEqual(getInputState({ defaultValue: 'hello', maxLength: 100 }).countText, '5 / 100');
    assert.strictEqual(getOtpState({ state: 'error', hint: 'Code' }).hasError, true);
    assert.strictEqual(getDropdownState({ state: 'error', errorMessage: 'Required' }).helpText, 'Required');
    assert.strictEqual(getFileState({ state: 'error', errorMessage: 'Too large' }).hasError, true);

    const abortedValues = [];
    const form = createFormController({
      initialValues: { username: '', email: '' },
      rules: {
        username: {
          required: 'Username required',
          minLength: { value: 3, message: 'Min 3 chars' },
          debounceMs: 15,
          asyncValidate: async (val, signal) => {
            await new Promise((r) => setTimeout(r, 25));
            if (signal.aborted) {
              abortedValues.push(val);
              return null;
            }
            return val === 'taken' ? 'Username already taken' : null;
          },
        },
        email: {
          required: 'Email required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        },
      },
    });

    let usernameUpdates = 0;
    let emailUpdates = 0;
    form.subscribeField('username', () => { usernameUpdates++; });
    form.subscribeField('email', () => { emailUpdates++; });

    // Typing in email must NOT trigger username subscriber (zero cross-field re-render)
    form.setValue('email', 'bad');
    assert.strictEqual(emailUpdates, 1);
    assert.strictEqual(usernameUpdates, 0);
    // Punish late: error is not shown before blur
    assert.strictEqual(form.getFieldState('email').error, false);

    // On blur, sync validation triggers immediately
    form.handleBlur('email');
    assert.strictEqual(form.getFieldState('email').error, true);
    assert.strictEqual(form.getFieldState('email').errorMessage, 'Invalid email');

    // Reward early: fixing the value while in error state clears the error immediately on change
    form.setValue('email', 'user@komerce.id');
    assert.strictEqual(form.getFieldState('email').error, false);
    assert.strictEqual(form.getFieldState('email').errorMessage, '');

    // Async validation: rapid typing aborts stale in-flight request
    form.handleBlur('username');
    assert.strictEqual(form.getFieldState('username').errorMessage, 'Username required');
    form.setValue('username', 'taken');
    assert.strictEqual(form.getFieldState('username').validating, true);
    await new Promise((r) => setTimeout(r, 20));
    // Type new valid value while 'taken' request is still in-flight
    form.setValue('username', 'available');
    await new Promise((r) => setTimeout(r, 60));
    assert.ok(abortedValues.includes('taken'));
    assert.strictEqual(form.getFieldState('username').validating, false);
    assert.strictEqual(form.getFieldState('username').error, false);
    assert.strictEqual(form.getFieldState('username').errorMessage, '');

    let submitted = null;
    const ok = await form.handleSubmit((vals) => { submitted = vals; });
    assert.strictEqual(ok, true);
    assert.deepStrictEqual(submitted, { username: 'available', email: 'user@komerce.id' });
    form.dispose();
  });

  it('createOverlayController isolates toast & dialog channels, satisfies 5-framework store contracts, and handles dirty-state bounds', async () => {
    const overlay = createOverlayController({
      maxToasts: 3,
      defaultDuration: 0,
      initialToast: { open: true, type: 'info', title: 'Boot Ready', description: 'Initial banner' },
      initialDialog: { id: 'sync-dialog', heading: 'Confirm Sync', description: 'Deploy now?' },
    });

    // 1. Referential snapshot stability (===) for React 19 useSyncExternalStore
    const snap1 = overlay.getToastSnapshot();
    const snap2 = overlay.getToastSnapshot();
    assert.strictEqual(snap1, snap2);
    assert.strictEqual(snap1.open, true);
    assert.strictEqual(snap1.title, 'Boot Ready');

    // 2. Channel isolation: notify() never fires dialog subscribers; openDialog() never fires toast subscribers
    let toastEvents = 0;
    let dialogEvents = 0;
    const unsubToast = overlay.subscribeToast(() => { toastEvents++; });
    const unsubDialog = overlay.subscribeDialog(() => { dialogEvents++; });

    overlay.success('Order Created', { id: 'ord-1', description: 'AWB #1001' });
    assert.strictEqual(toastEvents, 1);
    assert.strictEqual(dialogEvents, 0);
    assert.notStrictEqual(overlay.getToastSnapshot(), snap1);
    assert.strictEqual(overlay.getToastSnapshot().type, 'success');

    overlay.openDialog({ heading: 'Publish Config' });
    assert.strictEqual(toastEvents, 1);
    assert.strictEqual(dialogEvents, 1);
    assert.strictEqual(overlay.getDialogSnapshot().open, true);

    // 3. Svelte Readable<T> ($store) + Angular RxJS Subscribable<T> ({ next }, .unsubscribe()) contract
    const svelteValues = [];
    const svelteUnsub = overlay.toastStore.subscribe((val) => svelteValues.push(val.title));
    assert.deepStrictEqual(svelteValues, ['Order Created']); // synchronous initial emission

    const rxValues = [];
    const rxSub = overlay.dialogStore.subscribe({ next: (val) => rxValues.push(val.heading) });
    assert.deepStrictEqual(rxValues, ['Publish Config']);
    assert.strictEqual(typeof rxSub.unsubscribe, 'function');
    assert.strictEqual(overlay.toastStore['@@observable'](), overlay.toastStore);
    svelteUnsub();
    rxSub.unsubscribe();

    // 4. Deduplication by id & maxToasts bounded queue (flood 10 toasts -> capped at maxToasts=3)
    for (let i = 1; i <= 10; i++) {
      overlay.info(`Toast #${i}`, { id: `t-${i}` });
    }
    assert.strictEqual(overlay.getToastQueue().length, 3);
    assert.strictEqual(overlay.getToastSnapshot().id, 't-10');
    overlay.warning('Toast #9 Updated In-Place', { id: 't-9' });
    assert.strictEqual(overlay.getToastQueue().length, 3);
    assert.strictEqual(overlay.getToastSnapshot().id, 't-9');
    assert.strictEqual(overlay.getToastSnapshot().title, 'Toast #9 Updated In-Place');

    // 5. Async overlay.promise() transitions in-place from loading -> success & error
    const res = await overlay.promise(Promise.resolve({ count: 42 }), {
      id: 'job-1',
      loading: 'Syncing orders...',
      success: (d) => `Synced ${d.count} orders`,
    });
    assert.strictEqual(res.count, 42);
    assert.strictEqual(overlay.getToastSnapshot().id, 'job-1');
    assert.strictEqual(overlay.getToastSnapshot().type, 'success');
    assert.strictEqual(overlay.getToastSnapshot().title, 'Synced 42 orders');

    // 6. Concurrent overlay.confirm() race-condition guard & async onConfirm error recovery
    const firstConfirm = overlay.confirm({ heading: 'First Confirm' });
    const secondConfirm = overlay.confirm({ heading: 'Second Confirm' });
    assert.strictEqual(await firstConfirm, false); // superseded confirm resolves cleanly to false
    void overlay.confirmDialog();
    assert.strictEqual(await secondConfirm, true);
    assert.strictEqual(overlay.getDialogSnapshot().open, false);

    // 7. Self-subscribing bindControllerProps integration with bindToast()
    let ctrlState = {};
    const setCtrlState = (updater) => { ctrlState = updater(ctrlState); };
    let boundToast = bindControllerProps(overlay.bindToast(), ctrlState, setCtrlState);
    assert.strictEqual(boundToast.title, 'Synced 42 orders');
    overlay.error('Payment Declined', { description: 'Insufficient balance' });
    boundToast = bindControllerProps(overlay.bindToast(), ctrlState, setCtrlState);
    assert.strictEqual(boundToast.type, 'error');
    assert.strictEqual(boundToast.title, 'Payment Declined');

    unsubToast();
    unsubDialog();
    overlay.dispose();
  });

  it('Generalized SRP primitives (core-floating, core-collection, core-chart-series) handle dirty state, extremes, and controller composition', () => {
    // 1. core-floating: valid + dirty placement parsing, deck/stack directionality (top vs bottom), NaN/negative bounds
    assert.strictEqual(FLOATING_PLACEMENTS.length, 6);
    assert.deepStrictEqual(parseFloatingPlacement('bottom-center'), {
      placement: 'bottom-center',
      vertical: 'bottom',
      horizontal: 'center',
    });
    assert.deepStrictEqual(parseFloatingPlacement('invalid-corner', 'top-left'), {
      placement: 'top-left',
      vertical: 'top',
      horizontal: 'left',
    });
    assert.deepStrictEqual(parseFloatingPlacement(undefined), {
      placement: 'top-right',
      vertical: 'top',
      horizontal: 'right',
    });

    const topDeck = computeDeckOffset(2, 'top', 10);
    const bottomDeck = computeDeckOffset(2, 'bottom', 10);
    const hiddenDeck = computeDeckOffset(5, 'bottom', 10);
    assert.strictEqual(topDeck.offsetY, 20);
    assert.strictEqual(bottomDeck.offsetY, -20);
    assert.strictEqual(hiddenDeck.hidden, true);
    assert.strictEqual(hiddenDeck.opacity, 0);

    const topStack = computeStackOffset(2, [60, 80, 50], 'top', 10);
    const bottomStack = computeStackOffset(2, [60, NaN, 50], 'bottom', 10);
    assert.strictEqual(topStack.offsetY, 160);
    assert.strictEqual(bottomStack.offsetY, -132);
    assert.strictEqual(computeStackTrackHeight([], true), 0);
    assert.strictEqual(computeStackTrackHeight([60, 80], false, 10, 10), 78);
    assert.strictEqual(computeStackTrackHeight([60, 80], true, 10, 10), 158);

    // 2. core-collection: groupByKey, toggleListItem, filterByCriteria, retainValidIds
    const grouped = groupByKey(
      [
        { id: '1', pos: 'top-left' },
        { id: '2', pos: 'bottom-right' },
        { id: '3', pos: 'top-left' },
      ],
      (x) => x.pos
    );
    assert.strictEqual(grouped['top-left']?.length, 2);
    assert.strictEqual(grouped['bottom-right']?.length, 1);

    assert.deepStrictEqual(toggleListItem([0, 2], 1), [0, 2, 1]);
    assert.deepStrictEqual(toggleListItem([0, 1, 2], 1), [0, 2]);
    assert.deepStrictEqual(
      filterByCriteria(
        [
          { id: 'a', status: 'Delivered', courier: 'JNE' },
          { id: 'b', status: 'In Transit', courier: 'JNE' },
        ],
        { status: 'Delivered', courier: 'all', empty: '' }
      ).map((r) => r.id),
      ['a']
    );
    assert.deepStrictEqual(retainValidIds(['r1', 'r3'], ['r1', 'r2', 'r1', 'r3']), ['r1', 'r3']);

    // 3. core-chart-series: muteSeriesValues, filterActiveSeries, computeNiceTicks
    const mutedMulti = muteSeriesValues([{ label: 'Mon', values: [40, 60, 80] }], [1]);
    assert.deepStrictEqual(mutedMulti[0].values, [40, 0, 80]);
    const mutedSlices = muteSeriesValues([{ label: 'A', value: 30 }, { label: 'B', value: 70 }], [0]);
    assert.strictEqual(mutedSlices[0].value, 0);
    assert.strictEqual(mutedSlices[1].value, 70);
    assert.strictEqual(filterActiveSeries([{ x: 1, y: 2, series: 0 }, { x: 3, y: 4, series: 1 }], [0]).length, 1);
    const ticks = computeNiceTicks(118, 5);
    assert.strictEqual(ticks.max, 200);
    assert.deepStrictEqual(ticks.ticks, [200, 150, 100, 50, 0]);
    assert.deepStrictEqual(computeNiceTicks(-5, 5).ticks, [100, 75, 50, 25, 0]);

    // 4. Controller extensions: overlay placement, form boolean/radio/server-error helpers, table filter + selection pruning
    const ov = createOverlayController({ defaultPlacement: 'bottom-left', defaultDuration: 0 });
    assert.strictEqual(ov.getToastPlacement(), 'bottom-left');
    ov.info('Left Toast');
    assert.strictEqual(ov.getToastSnapshot().placement, 'bottom-left');
    ov.info('Custom Right Toast', { placement: 'top-right', meta: { progress: 65 } });
    assert.strictEqual(ov.getToastSnapshot().placement, 'top-right');
    assert.deepStrictEqual(ov.getToastSnapshot().meta, { progress: 65 });
    ov.setToastPlacement('top-center', true);
    assert.ok(ov.getToastQueue().every((t) => t.placement === 'top-center'));
    ov.dismissAllToasts();
    assert.strictEqual(ov.getToastQueue().length, 0);
    assert.strictEqual(ov.getToastSnapshot().open, false);
    ov.dispose();

    const fm = createFormController({
      initialValues: { agree: false, pay: 'cod', coupon: 'PROMO' },
      rules: { agree: { required: 'Wajib setuju' } },
    });
    const cb = fm.bindCheckboxField('agree');
    assert.strictEqual(cb.checked, false);
    void fm.validateField('agree', 'submit');
    assert.strictEqual(fm.getFieldState('agree').errorMessage, 'Wajib setuju');
    cb.onCheckedChange(true);
    assert.strictEqual(fm.getFieldState('agree').error, false);
    fm.bindRadioField('pay', 'transfer').onValueChange();
    assert.strictEqual(fm.getValues().pay, 'transfer');
    fm.setFieldError('coupon', 'Server 422: Kuota habis');
    assert.strictEqual(fm.getFieldState('coupon').error, true);
    fm.clearFieldErrors();
    assert.strictEqual(fm.getFieldState('coupon').error, false);
    fm.dispose();

    const tb = createTableController({
      rows: [
        { id: '1', status: 'Delivered', amount: 500 },
        { id: '2', status: 'Delivered', amount: 1500 },
        { id: '3', status: 'Pending', amount: 2000 },
      ],
      initialSelectedIds: ['1', '2', '3'],
      filterFn: (r) => r.amount >= 1000,
    });
    tb.setFilter('status', 'Delivered');
    assert.deepStrictEqual(tb.getState().visibleRows.map((r) => r.id), ['2']);
    tb.setRows([{ id: '2', status: 'Delivered', amount: 1500 }]);
    assert.deepStrictEqual(tb.getState().selectedIds, ['2']);
  });

  it('Per-toast independent auto-dismiss timers, pause/resume (global + single id), and swipe/drag displacement physics handle chaos & edge cases', async () => {
    // 1. Swipe physics across placements, rubber-band damping, NaN safety, and interactive target exclusion
    assert.deepStrictEqual(computeSwipeDisplacement(0, 0, 'top-right', 80), {
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      progress: 0,
      shouldDismiss: false,
    });
    assert.strictEqual(computeSwipeDisplacement(NaN, Infinity, 'top-right', -10).shouldDismiss, false);

    // Right corner: positive deltaX dismisses, negative deltaX is damped (rubber-band)
    const rightDismiss = computeSwipeDisplacement(100, 5, 'top-right', 80);
    assert.strictEqual(rightDismiss.shouldDismiss, true);
    assert.strictEqual(rightDismiss.offsetX, 100);
    assert.ok(rightDismiss.opacity < 0.25);

    const rightResist = computeSwipeDisplacement(-100, 0, 'bottom-right', 80);
    assert.strictEqual(rightResist.shouldDismiss, false);
    assert.strictEqual(rightResist.offsetX, -20);
    assert.strictEqual(rightResist.opacity, 1);

    // Left corner: negative deltaX dismisses, positive deltaX is damped
    const leftDismiss = computeSwipeDisplacement(-95, 0, 'top-left', 80);
    assert.strictEqual(leftDismiss.shouldDismiss, true);
    assert.strictEqual(computeSwipeDisplacement(95, 0, 'top-left', 80).shouldDismiss, false);

    // Center corner: vertical flick away from screen edge OR horizontal drag dismisses
    assert.strictEqual(computeSwipeDisplacement(0, -75, 'top-center', 80).shouldDismiss, true);
    assert.strictEqual(computeSwipeDisplacement(0, 75, 'top-center', 80).shouldDismiss, false);
    assert.strictEqual(computeSwipeDisplacement(0, 75, 'bottom-center', 80).shouldDismiss, true);
    assert.strictEqual(computeSwipeDisplacement(90, 0, 'bottom-center', 80).shouldDismiss, true);

    // Inline fallback: horizontal swipe in either direction dismisses
    assert.strictEqual(computeSwipeDisplacement(-90, 0, 'inline', 80).shouldDismiss, true);
    assert.strictEqual(computeSwipeDisplacement(90, 0, 'inline', 80).shouldDismiss, true);

    // Interactive target detection skips buttons/links so clicking Action or Close never starts a drag
    assert.strictEqual(isInteractiveDragTarget({ tagName: 'button' }), true);
    assert.strictEqual(isInteractiveDragTarget({ tagName: 'svg', parentElement: { tagName: 'BUTTON' } }), true);
    assert.strictEqual(isInteractiveDragTarget({ tagName: 'span', parentElement: { tagName: 'div' } }), false);
    assert.strictEqual(isInteractiveDragTarget(null), false);

    // mergeDragStyle composes existing 3D stack transforms without clobbering them
    const baseStyle = { transform: 'translate3d(0, 62px, 0) scale(1)', opacity: '0.8' };
    assert.strictEqual(mergeDragStyle(baseStyle, false, 0, 0, 'top-right'), baseStyle);
    const draggedStyle = mergeDragStyle(baseStyle, true, 40, 0, 'top-right', 80);
    assert.match(draggedStyle.transform, /translate3d\(0, 62px, 0\) scale\(1\) translate3d\(40px, 0px, 0\)/);
    assert.strictEqual(draggedStyle.transition, 'none');

    // 2. Concurrent multi-toast timers: a persistent toast (duration: 0) MUST NOT cancel an earlier timed toast
    const ov = createOverlayController({ defaultPlacement: 'top-right', defaultDuration: 0 });
    const queueSnapshots = [];
    const unsubQueue = ov.subscribeToastQueue((q) => queueSnapshots.push(q.map((t) => t.id)));

    ov.info('Short Toast A', { id: 'a', duration: 45 });
    ov.warning('Medium Toast B', { id: 'b', duration: 110 });
    ov.error('Persistent Toast C', { id: 'c', duration: 0 });
    assert.deepStrictEqual(ov.getToastQueue().map((t) => t.id), ['c', 'b', 'a']);

    // Pause single toast 'b' (simulating mouse drag on 'b'), let 'a' auto-dismiss on schedule
    ov.pauseToast('b');
    await new Promise((r) => setTimeout(r, 70));
    assert.deepStrictEqual(ov.getToastQueue().map((t) => t.id), ['c', 'b']);

    // 'b' is still paused even after 120ms total; once resumed, it finishes its remaining time
    await new Promise((r) => setTimeout(r, 60));
    assert.deepStrictEqual(ov.getToastQueue().map((t) => t.id), ['c', 'b']);
    ov.resumeToast('b');
    await new Promise((r) => setTimeout(r, 130));
    assert.deepStrictEqual(ov.getToastQueue().map((t) => t.id), ['c']);

    // Global pause/resume (simulating hover over ToastViewport) freezes newly added timed toasts too
    ov.pauseToast();
    ov.success('Hovered Toast D', { id: 'd', duration: 40 });
    await new Promise((r) => setTimeout(r, 70));
    assert.deepStrictEqual(ov.getToastQueue().map((t) => t.id), ['d', 'c']);
    ov.resumeToast();
    await new Promise((r) => setTimeout(r, 70));
    assert.deepStrictEqual(ov.getToastQueue().map((t) => t.id), ['c']);
    assert.ok(queueSnapshots.length >= 5);

    unsubQueue();
    ov.dispose();
  });
});
