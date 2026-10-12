import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  cn,
  createDialogState,
  handleRovingFocus,
  createTabsState,
  createTooltipState,
  sortTableRows,
  paginateTableRows,
  filterTableRows,
  getVirtualWindow,
  scaleLinear,
  scaleBand,
  getSmoothBezierPath,
  getAreaPath,
  getPieSlices,
  utilsModule,
  compileMitosis,
} from '../dist/index.js';

describe('1. cn (class names merging)', () => {
  it('merges class names together', () => {
    assert.strictEqual(cn('px-2', 'py-1', 'text-sm'), 'px-2 py-1 text-sm');
  });

  it('resolves Tailwind conflicts by keeping the last conflicting rule', () => {
    assert.strictEqual(cn('p-2', 'p-4'), 'p-4');
    assert.strictEqual(cn('text-red-500', 'text-blue-500'), 'text-blue-500');
    assert.strictEqual(cn('bg-red-500', 'bg-emerald-600'), 'bg-emerald-600');
  });

  it('ignores falsy, null, and undefined values', () => {
    assert.strictEqual(cn('base', false, null, undefined, '', 'extra'), 'base extra');
  });
});

describe('2. createDialogState', () => {
  it('returns isOpen: false by default, and true when passed open: true', () => {
    const defaultState = createDialogState();
    assert.strictEqual(defaultState.isOpen, false);
    assert.strictEqual(defaultState.titleId, 'dialog-title');
    assert.strictEqual(defaultState.descriptionId, 'dialog-description');

    const openState = createDialogState({ open: true, id: 'confirm' });
    assert.strictEqual(openState.isOpen, true);
    assert.strictEqual(openState.titleId, 'confirm-title');
    assert.strictEqual(openState.descriptionId, 'confirm-description');
  });

  it('getBackdropProps has aria-hidden="true" and calls onClose on click', () => {
    let closed = false;
    const state = createDialogState({
      onClose: () => {
        closed = true;
      },
    });

    const backdropProps = state.getBackdropProps();
    assert.strictEqual(backdropProps['aria-hidden'], 'true');
    backdropProps.onClick();
    assert.strictEqual(closed, true);
  });

  it('getContentProps has aria-modal="true", role="alertdialog" by default, aria-labelledby, aria-describedby', () => {
    const state = createDialogState({ id: 'warning' });
    const contentProps = state.getContentProps();

    assert.strictEqual(contentProps['aria-modal'], 'true');
    assert.strictEqual(contentProps.role, 'alertdialog');
    assert.strictEqual(contentProps['aria-labelledby'], 'warning-title');
    assert.strictEqual(contentProps['aria-describedby'], 'warning-description');
    assert.strictEqual(contentProps.tabIndex, -1);

    const dialogProps = state.getContentProps('dialog');
    assert.strictEqual(dialogProps.role, 'dialog');
  });

  it('Escape key on getContentProps().onKeyDown triggers onClose', () => {
    let closed = false;
    const state = createDialogState({
      onClose: () => {
        closed = true;
      },
    });

    const contentProps = state.getContentProps();
    contentProps.onKeyDown({ key: 'Escape' });
    assert.strictEqual(closed, true);

    let otherCalled = false;
    const state2 = createDialogState({
      onClose: () => {
        otherCalled = true;
      },
    });
    state2.getContentProps().onKeyDown({ key: 'Enter' });
    assert.strictEqual(otherCalled, false);
  });

  it('getTitleProps and getDescriptionProps return matching ids', () => {
    const state = createDialogState({ id: 'prompt' });
    assert.deepStrictEqual(state.getTitleProps(), { id: 'prompt-title' });
    assert.deepStrictEqual(state.getDescriptionProps(), { id: 'prompt-description' });
  });
});

describe('3. handleRovingFocus', () => {
  it('ArrowRight / ArrowDown increments index with wraparound', () => {
    let selected = -1;
    let prevented = false;

    // ArrowRight step
    handleRovingFocus({ key: 'ArrowRight', preventDefault: () => { prevented = true; } }, 0, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 1);
    assert.strictEqual(prevented, true);

    // ArrowRight wraparound at end
    handleRovingFocus({ key: 'ArrowRight' }, 2, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 0);

    // ArrowDown step
    handleRovingFocus({ key: 'ArrowDown' }, 1, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 2);

    // ArrowDown wraparound at end
    handleRovingFocus({ key: 'ArrowDown' }, 2, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 0);
  });

  it('ArrowLeft / ArrowUp decrements index with wraparound', () => {
    let selected = -1;

    // ArrowLeft step
    handleRovingFocus({ key: 'ArrowLeft' }, 2, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 1);

    // ArrowLeft wraparound at 0
    handleRovingFocus({ key: 'ArrowLeft' }, 0, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 2);

    // ArrowUp step
    handleRovingFocus({ key: 'ArrowUp' }, 1, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 0);

    // ArrowUp wraparound at 0
    handleRovingFocus({ key: 'ArrowUp' }, 0, 3, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 2);
  });

  it('Home jumps to index 0, End jumps to last index', () => {
    let selected = -1;

    handleRovingFocus({ key: 'Home' }, 2, 4, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 0);

    handleRovingFocus({ key: 'End' }, 0, 4, (idx) => {
      selected = idx;
    });
    assert.strictEqual(selected, 3);
  });

  it('ignores other keys and returns without selecting', () => {
    let called = false;
    handleRovingFocus({ key: 'Tab' }, 1, 3, () => {
      called = true;
    });
    assert.strictEqual(called, false);

    handleRovingFocus({ key: 'Enter' }, 1, 3, () => {
      called = true;
    });
    assert.strictEqual(called, false);
  });

  it('does nothing when totalItems is 0 or negative', () => {
    let called = false;
    handleRovingFocus({ key: 'ArrowRight' }, 0, 0, () => {
      called = true;
    });
    assert.strictEqual(called, false);
  });
});

describe('4. createTabsState', () => {
  const tabs = [{ id: 'overview' }, { id: 'analytics' }, { id: 'settings' }];

  it('defaults activeId to first tab', () => {
    const state = createTabsState({ tabs });
    assert.strictEqual(state.activeId, 'overview');

    const explicitState = createTabsState({ tabs, activeId: 'analytics' });
    assert.strictEqual(explicitState.activeId, 'analytics');

    const emptyTabsState = createTabsState({ tabs: [] });
    assert.strictEqual(emptyTabsState.activeId, '');
  });

  it('getTabTriggerProps sets aria-selected=true and tabIndex=0 only for active tab, others have tabIndex=-1 and aria-selected=false', () => {
    const state = createTabsState({ tabs, activeId: 'overview' });

    const activeTrigger = state.getTabTriggerProps('overview');
    assert.strictEqual(activeTrigger.role, 'tab');
    assert.strictEqual(activeTrigger.id, 'tab-overview');
    assert.strictEqual(activeTrigger['aria-controls'], 'panel-overview');
    assert.strictEqual(activeTrigger['aria-selected'], true);
    assert.strictEqual(activeTrigger.tabIndex, 0);

    const inactiveTrigger = state.getTabTriggerProps('analytics');
    assert.strictEqual(inactiveTrigger['aria-selected'], false);
    assert.strictEqual(inactiveTrigger.tabIndex, -1);
  });

  it('getTabTriggerProps triggers onSelect when clicked', () => {
    let selectedId = '';
    const state = createTabsState({
      tabs,
      onSelect: (id) => {
        selectedId = id;
      },
    });

    state.getTabTriggerProps('settings').onClick();
    assert.strictEqual(selectedId, 'settings');
  });

  it('getTabPanelProps sets hidden=false for active, true for inactive', () => {
    const state = createTabsState({ tabs, activeId: 'analytics' });

    const activePanel = state.getTabPanelProps('analytics');
    assert.strictEqual(activePanel.role, 'tabpanel');
    assert.strictEqual(activePanel.id, 'panel-analytics');
    assert.strictEqual(activePanel['aria-labelledby'], 'tab-analytics');
    assert.strictEqual(activePanel.tabIndex, 0);
    assert.strictEqual(activePanel.hidden, false);

    const inactivePanel = state.getTabPanelProps('overview');
    assert.strictEqual(inactivePanel.hidden, true);
  });

  it('getTabListProps().onKeyDown delegates to handleRovingFocus', () => {
    let rovingId = '';
    const state = createTabsState({
      tabs,
      activeId: 'overview',
      onSelect: (id) => {
        rovingId = id;
      },
    });

    const listProps = state.getTabListProps();
    assert.strictEqual(listProps.role, 'tablist');

    listProps.onKeyDown({ key: 'ArrowRight' });
    assert.strictEqual(rovingId, 'analytics');
  });
});

describe('5. createTooltipState', () => {
  it('getTriggerProps sets aria-describedby', () => {
    const state = createTooltipState();
    assert.strictEqual(state.id, 'tooltip');
    assert.deepStrictEqual(state.getTriggerProps(), { 'aria-describedby': 'tooltip' });
  });

  it('getContentProps sets role="tooltip"', () => {
    const state = createTooltipState({ id: 'info-tip' });
    assert.strictEqual(state.id, 'info-tip');
    assert.deepStrictEqual(state.getContentProps(), { role: 'tooltip', id: 'info-tip' });
  });
});

describe('6. sortTableRows', () => {
  it('sorts numbers ascending & descending', () => {
    const rows = [{ id: 1, score: 78 }, { id: 2, score: 95 }, { id: 3, score: 42 }];

    const asc = sortTableRows(rows, 'score', 'asc');
    assert.deepStrictEqual(asc.map((r) => r.score), [42, 78, 95]);

    const desc = sortTableRows(rows, 'score', 'desc');
    assert.deepStrictEqual(desc.map((r) => r.score), [95, 78, 42]);
  });

  it('sorts strings with natural numeric collation (e.g. "Item 2", "Item 10")', () => {
    const rows = [
      { name: 'Item 10' },
      { name: 'Item 2' },
      { name: 'Item 1' },
      { name: 'Item 20' },
    ];

    const asc = sortTableRows(rows, 'name', 'asc');
    assert.deepStrictEqual(asc.map((r) => r.name), ['Item 1', 'Item 2', 'Item 10', 'Item 20']);

    const desc = sortTableRows(rows, 'name', 'desc');
    assert.deepStrictEqual(desc.map((r) => r.name), ['Item 20', 'Item 10', 'Item 2', 'Item 1']);
  });

  it('handles null/undefined values without crashing and places them at the end', () => {
    const rows = [
      { val: 10 },
      { val: null },
      { val: 5 },
      { val: undefined },
      { val: 20 },
    ];

    const sorted = sortTableRows(rows, 'val', 'asc');
    assert.strictEqual(sorted[0].val, 5);
    assert.strictEqual(sorted[1].val, 10);
    assert.strictEqual(sorted[2].val, 20);
    assert.ok(sorted[3].val == null);
    assert.ok(sorted[4].val == null);
  });

  it('does not mutate original array', () => {
    const original = [{ n: 3 }, { n: 1 }, { n: 2 }];
    const originalSnapshot = JSON.stringify(original);

    const sorted = sortTableRows(original, 'n', 'asc');
    assert.notStrictEqual(sorted, original);
    assert.strictEqual(JSON.stringify(original), originalSnapshot);
  });

  it('handles invalid inputs gracefully', () => {
    assert.deepStrictEqual(sortTableRows(null, 'name'), []);
    assert.deepStrictEqual(sortTableRows([], 'name'), []);
    const items = [{ x: 1 }];
    assert.deepStrictEqual(sortTableRows(items, ''), items);
  });
});

describe('7. paginateTableRows', () => {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  it('slices correct page and page size', () => {
    const page1 = paginateTableRows(rows, 1, 5);
    assert.deepStrictEqual(page1.data, [1, 2, 3, 4, 5]);
    assert.strictEqual(page1.totalItems, 12);
    assert.strictEqual(page1.totalPages, 3);
    assert.strictEqual(page1.currentPage, 1);
    assert.strictEqual(page1.hasNext, true);
    assert.strictEqual(page1.hasPrev, false);

    const page2 = paginateTableRows(rows, 2, 5);
    assert.deepStrictEqual(page2.data, [6, 7, 8, 9, 10]);
    assert.strictEqual(page2.currentPage, 2);
    assert.strictEqual(page2.hasNext, true);
    assert.strictEqual(page2.hasPrev, true);

    const page3 = paginateTableRows(rows, 3, 5);
    assert.deepStrictEqual(page3.data, [11, 12]);
    assert.strictEqual(page3.currentPage, 3);
    assert.strictEqual(page3.hasNext, false);
    assert.strictEqual(page3.hasPrev, true);
  });

  it('handles out-of-bounds page numbers gracefully', () => {
    const underflow = paginateTableRows(rows, 0, 5);
    assert.strictEqual(underflow.currentPage, 1);
    assert.deepStrictEqual(underflow.data, [1, 2, 3, 4, 5]);

    const negative = paginateTableRows(rows, -5, 5);
    assert.strictEqual(negative.currentPage, 1);

    const overflow = paginateTableRows(rows, 999, 5);
    assert.strictEqual(overflow.currentPage, 3);
    assert.deepStrictEqual(overflow.data, [11, 12]);
  });

  it('handles empty rows and custom pageSize gracefully', () => {
    const empty = paginateTableRows([], 1, 10);
    assert.deepStrictEqual(empty.data, []);
    assert.strictEqual(empty.totalPages, 1);
    assert.strictEqual(empty.totalItems, 0);
    assert.strictEqual(empty.hasNext, false);
    assert.strictEqual(empty.hasPrev, false);

    const zeroPageSize = paginateTableRows([1, 2], 1, 0);
    assert.strictEqual(zeroPageSize.data.length, 2);
  });
});

describe('8. filterTableRows', () => {
  const users = [
    { name: 'John Doe', role: 'Developer', city: 'Jakarta' },
    { name: 'Jane Smith', role: 'Designer', city: 'Bandung' },
    { name: 'Bob Johnson', role: 'Product Manager', city: 'Surabaya' },
  ];

  it('filters case-insensitively across all fields by default', () => {
    const result1 = filterTableRows(users, 'john');
    assert.strictEqual(result1.length, 2); // John Doe, Bob Johnson

    const result2 = filterTableRows(users, 'DESIGNER');
    assert.strictEqual(result2.length, 1);
    assert.strictEqual(result2[0].name, 'Jane Smith');
  });

  it('filters case-insensitively with specified searchKeys', () => {
    // Only search in role
    const inRole = filterTableRows(users, 'John', ['role']);
    assert.strictEqual(inRole.length, 0);

    // Only search in name
    const inName = filterTableRows(users, 'John', ['name']);
    assert.strictEqual(inName.length, 2);
  });

  it('returns all rows when query is empty or whitespace', () => {
    assert.deepStrictEqual(filterTableRows(users, ''), users);
    assert.deepStrictEqual(filterTableRows(users, '   '), users);
    assert.deepStrictEqual(filterTableRows(null, 'test'), []);
  });
});

describe('9. getVirtualWindow', () => {
  it('calculates startIndex, endIndex, and virtualItems with overscan', () => {
    const window = getVirtualWindow({
      totalItems: 100,
      itemHeight: 50,
      containerHeight: 200,
      scrollTop: 500, // rawStart = 10, visibleCount = 4
      overscan: 2,
    });

    // rawStart (10) - overscan (2) = 8
    assert.strictEqual(window.startIndex, 8);
    // rawStart (10) + visibleCount (4) + overscan (2) = 16
    assert.strictEqual(window.endIndex, 16);
    assert.strictEqual(window.virtualItems.length, 8);
    assert.strictEqual(window.virtualItems[0].index, 8);
    assert.strictEqual(window.virtualItems[0].start, 400);
    assert.strictEqual(window.virtualItems[0].size, 50);
  });

  it('calculates paddingTop and paddingBottom matching total height', () => {
    const window = getVirtualWindow({
      totalItems: 100,
      itemHeight: 50,
      containerHeight: 200,
      scrollTop: 500,
      overscan: 2,
    });

    assert.strictEqual(window.totalHeight, 5000);
    assert.strictEqual(window.paddingTop, 400); // 8 * 50
    assert.strictEqual(window.paddingBottom, 4200); // (100 - 16) * 50
    const renderedHeight = window.virtualItems.length * 50;
    assert.strictEqual(window.paddingTop + renderedHeight + window.paddingBottom, window.totalHeight);
  });

  it('handles 0 items and scrollTop=0 correctly', () => {
    const empty = getVirtualWindow({
      totalItems: 0,
      itemHeight: 50,
      containerHeight: 200,
      scrollTop: 0,
    });

    assert.strictEqual(empty.startIndex, 0);
    assert.strictEqual(empty.endIndex, 0);
    assert.deepStrictEqual(empty.virtualItems, []);
    assert.strictEqual(empty.totalHeight, 0);
    assert.strictEqual(empty.paddingTop, 0);
    assert.strictEqual(empty.paddingBottom, 0);

    const zeroScroll = getVirtualWindow({
      totalItems: 50,
      itemHeight: 25,
      containerHeight: 100,
      scrollTop: 0,
      overscan: 2,
    });

    assert.strictEqual(zeroScroll.startIndex, 0);
    assert.strictEqual(zeroScroll.paddingTop, 0);
  });
});

describe('10. scaleLinear', () => {
  it('maps domain [0, 100] to range [0, 500]', () => {
    const scale = scaleLinear({ domain: [0, 100], range: [0, 500] });

    assert.strictEqual(scale(0), 0);
    assert.strictEqual(scale(25), 125);
    assert.strictEqual(scale(50), 250);
    assert.strictEqual(scale(100), 500);
  });

  it('generates ticks across the domain', () => {
    const scale = scaleLinear({ domain: [0, 100], range: [0, 500] });
    const ticks = scale.ticks(5);

    assert.deepStrictEqual(ticks, [0, 25, 50, 75, 100]);
  });

  it('handles degenerate domain where min equals max', () => {
    const scale = scaleLinear({ domain: [50, 50], range: [0, 200] });
    assert.strictEqual(scale(50), 0);
  });
});

describe('11. scaleBand', () => {
  it('allocates bandwidth and steps across category domain', () => {
    const domain = ['Q1', 'Q2', 'Q3', 'Q4'];
    const scale = scaleBand({ domain, range: [0, 400], padding: 0.2 });

    assert.ok(scale.step > 0);
    assert.ok(scale.bandwidth > 0);
    assert.ok(scale.bandwidth < scale.step);

    assert.strictEqual(scale('Q1'), 0);
    assert.strictEqual(scale('Q2'), scale.step);
    assert.strictEqual(scale('Q3'), 2 * scale.step);
    assert.strictEqual(scale('Q4'), 3 * scale.step);

    // Unknown category fallback to range[0]
    assert.strictEqual(scale('Unknown'), 0);
  });
});

describe('12. getSmoothBezierPath', () => {
  it('returns empty string for empty points', () => {
    assert.strictEqual(getSmoothBezierPath([]), '');
    assert.strictEqual(getSmoothBezierPath(null), '');
  });

  it('returns single move command for 1 point', () => {
    assert.strictEqual(getSmoothBezierPath([{ x: 10, y: 20 }]), 'M 10 20');
  });

  it('returns straight line for 2 points', () => {
    assert.strictEqual(
      getSmoothBezierPath([{ x: 0, y: 0 }, { x: 100, y: 50 }]),
      'M 0 0 L 100 50'
    );
  });

  it('returns smooth cubic Bézier C ... for 3+ points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 50, y: 100 },
      { x: 100, y: 50 },
      { x: 150, y: 80 },
    ];
    const path = getSmoothBezierPath(points);

    assert.ok(path.startsWith('M 0 0'));
    assert.ok(path.includes(' C '));
    const bezierSegments = path.split(' C ');
    assert.strictEqual(bezierSegments.length, 4); // initial segment + 3 cubic beziers
  });
});

describe('13. getAreaPath', () => {
  it('generates closed SVG path ending with L ... baseline Z', () => {
    const points = [
      { x: 0, y: 10 },
      { x: 50, y: 60 },
      { x: 100, y: 20 },
    ];
    const area = getAreaPath(points, 120);

    assert.ok(area.startsWith('M 0 10'));
    assert.ok(area.includes(' C '));
    assert.ok(area.endsWith('L 100 120 L 0 120 Z'));
  });

  it('returns empty string for empty points', () => {
    assert.strictEqual(getAreaPath([]), '');
    assert.strictEqual(getAreaPath(null), '');
  });
});

describe('14. getPieSlices', () => {
  it('calculates fractions, angles totaling 2π, and SVG arc paths for standard pie chart', () => {
    const slices = getPieSlices([10, 20, 30], 50, 0);

    assert.strictEqual(slices.length, 3);
    assert.strictEqual(slices[0].fraction, 10 / 60);
    assert.strictEqual(slices[1].fraction, 20 / 60);
    assert.strictEqual(slices[2].fraction, 30 / 60);

    assert.strictEqual(slices[0].startAngle, 0);
    assert.ok(Math.abs(slices[2].endAngle - 2 * Math.PI) < 1e-9);

    assert.strictEqual(slices[0].isDonut, false);
    assert.ok(slices[0].path.startsWith('M 50 50 L '));
    assert.ok(slices[0].path.includes(' A 50 50 0 '));
    assert.ok(slices[0].path.endsWith(' Z'));
  });

  it('generates donut slices with innerRadius > 0', () => {
    const slices = getPieSlices([15, 25], 60, 30);

    assert.strictEqual(slices.length, 2);
    assert.strictEqual(slices[0].isDonut, true);
    assert.ok(slices[0].path.includes(' A 60 60 0 '));
    assert.ok(slices[0].path.includes(' A 30 30 0 '));
    assert.ok(slices[0].path.endsWith(' Z'));
  });

  it('handles empty and 0-sum arrays gracefully', () => {
    assert.deepStrictEqual(getPieSlices([]), []);
    assert.deepStrictEqual(getPieSlices([0, 0, 0]), []);
    assert.deepStrictEqual(getPieSlices([-5, -10]), []);
  });
});

describe('15. utilsModule synchronization and exports', () => {
  it('utilsModule supplies all 14 headless helpers and default export', () => {
    const expectedHelpers = [
      'cn',
      'createDialogState',
      'handleRovingFocus',
      'createTabsState',
      'createTooltipState',
      'sortTableRows',
      'paginateTableRows',
      'filterTableRows',
      'getVirtualWindow',
      'scaleLinear',
      'scaleBand',
      'getSmoothBezierPath',
      'getAreaPath',
      'getPieSlices',
    ];

    assert.strictEqual(utilsModule.__esModule, true);
    for (const helper of expectedHelpers) {
      assert.strictEqual(
        typeof utilsModule[helper],
        'function',
        `Expected utilsModule.${helper} to be a function`
      );
      assert.strictEqual(
        typeof utilsModule.default[helper],
        'function',
        `Expected utilsModule.default.${helper} to be a function`
      );
    }

    // Default export can also be invoked as cn
    assert.strictEqual(utilsModule.default('font-bold', 'text-red-500'), 'font-bold text-red-500');
  });

  it('runs smoothly during renderCheck when component imports helpers from ./utils', async () => {
    const source = `
      import { useStore } from '@builder.io/mitosis';
      import { createTooltipState, cn } from './utils';

      export interface TestComponentProps {
        label?: string;
      }

      export default function TestComponent(props: TestComponentProps) {
        const state = useStore({
          get tooltip() {
            return createTooltipState({ id: 'my-tooltip' });
          },
        });

        return (
          <div class={cn('p-4', 'bg-white')}>
            <button aria-describedby={state.tooltip.getTriggerProps()['aria-describedby']}>
              {props.label || 'Hover me'}
            </button>
            <div role="tooltip" id={state.tooltip.id}>Tooltip content</div>
          </div>
        );
      }
    `;

    const result = await compileMitosis({
      componentName: 'TestComponent',
      source,
      checks: { render: true },
    });

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.errors, []);
  });
});
