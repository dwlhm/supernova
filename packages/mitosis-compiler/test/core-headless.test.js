import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  resolveId,
  resolveControllable,
  clampPercent,
  shiftYearMonth,
  getCalendarDays,
  formatDateDisplay,
  getPaginationEntries,
  getBreadcrumbItems,
  computeOtpDigits,
  applyOtpChar,
  applyOtpPasteString,
  filterDropdownOptions,
  getIconPath,
  getToastIconPath,
  getChartBarState,
  getChartLineState,
  getChartPieState,
  getTableBodyRowCells,
  getTableState,
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
});
