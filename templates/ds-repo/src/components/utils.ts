import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// 1. A11y & Headless UI Primitives (Radix / Zag / Headless UI patterns)
// ---------------------------------------------------------------------------

export interface DialogStateOptions {
  id?: string;
  open?: boolean;
  onClose?: () => void;
}

export function createDialogState(options: DialogStateOptions = {}) {
  const baseId = options.id || 'dialog';
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  return {
    isOpen: options.open ?? false,
    titleId,
    descriptionId,
    getBackdropProps() {
      return {
        'aria-hidden': 'true' as const,
        onClick: () => {
          if (options.onClose) options.onClose();
        },
      };
    },
    getContentProps(role: 'dialog' | 'alertdialog' = 'alertdialog') {
      return {
        role,
        'aria-modal': 'true' as const,
        'aria-labelledby': titleId,
        'aria-describedby': descriptionId,
        tabIndex: -1,
        onKeyDown: (event: any) => {
          if (event && event.key === 'Escape') {
            if (options.onClose) options.onClose();
          }
        },
      };
    },
    getTitleProps() {
      return { id: titleId };
    },
    getDescriptionProps() {
      return { id: descriptionId };
    },
  };
}

export function handleRovingFocus(
  event: { key: string; preventDefault?: () => void },
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void {
  if (totalItems <= 0) return;
  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % totalItems;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + totalItems) % totalItems;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = totalItems - 1;
      break;
    default:
      return;
  }

  if (event.preventDefault) event.preventDefault();
  onSelect(nextIndex);
}

export interface TabsStateOptions<T extends { id: string }> {
  tabs: T[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function createTabsState<T extends { id: string }>(options: TabsStateOptions<T>) {
  const activeId = options.activeId || (options.tabs[0]?.id ?? '');

  return {
    activeId,
    getTabListProps() {
      return {
        role: 'tablist' as const,
        onKeyDown: (event: any) => {
          const currentIndex = options.tabs.findIndex((t) => t.id === activeId);
          handleRovingFocus(event, currentIndex >= 0 ? currentIndex : 0, options.tabs.length, (nextIdx) => {
            const nextTab = options.tabs[nextIdx];
            if (nextTab && options.onSelect) options.onSelect(nextTab.id);
          });
        },
      };
    },
    getTabTriggerProps(tabId: string, index: number) {
      const isSelected = tabId === activeId;
      return {
        role: 'tab' as const,
        id: `tab-${tabId}`,
        'aria-selected': isSelected,
        'aria-controls': `panel-${tabId}`,
        tabIndex: isSelected ? 0 : -1,
        onClick: () => {
          if (options.onSelect) options.onSelect(tabId);
        },
      };
    },
    getTabPanelProps(tabId: string) {
      return {
        role: 'tabpanel' as const,
        id: `panel-${tabId}`,
        'aria-labelledby': `tab-${tabId}`,
        tabIndex: 0,
        hidden: tabId !== activeId,
      };
    },
  };
}

export function createTooltipState(options: { id?: string } = {}) {
  const tooltipId = options.id || 'tooltip';
  return {
    id: tooltipId,
    getTriggerProps() {
      return { 'aria-describedby': tooltipId };
    },
    getContentProps() {
      return { role: 'tooltip' as const, id: tooltipId };
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Table Headless Model (TanStack Table patterns)
// ---------------------------------------------------------------------------

export function sortTableRows<T>(
  rows: T[],
  sortKey: keyof T | string,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortKey || !Array.isArray(rows)) return rows ? [...rows] : [];
  const key = sortKey as keyof T;
  const modifier = direction === 'desc' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier;
    }
    return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * modifier;
  });
}

export function paginateTableRows<T>(
  rows: T[],
  page: number = 1,
  pageSize: number = 10
): {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalItems = rows ? rows.length : 0;
  const safePageSize = pageSize > 0 ? pageSize : 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;
  const data = rows ? rows.slice(start, start + safePageSize) : [];

  return {
    data,
    totalPages,
    totalItems,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function filterTableRows<T>(
  rows: T[],
  query: string,
  searchKeys?: Array<keyof T>
): T[] {
  if (!query || !query.trim() || !Array.isArray(rows)) return rows ? [...rows] : [];
  const q = query.toLowerCase().trim();

  return rows.filter((row) => {
    const keys = searchKeys || (Object.keys(row as any) as Array<keyof T>);
    return keys.some((k) => {
      const val = row[k];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });
}

// ---------------------------------------------------------------------------
// 3. Virtual Scroll Windowing (TanStack Virtual patterns)
// ---------------------------------------------------------------------------

export interface VirtualWindowOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function getVirtualWindow(options: VirtualWindowOptions) {
  const { totalItems, itemHeight, containerHeight, scrollTop, overscan = 3 } = options;
  if (totalItems <= 0 || itemHeight <= 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      virtualItems: [] as Array<{ index: number; start: number; size: number }>,
      paddingTop: 0,
      paddingBottom: 0,
      totalHeight: 0,
    };
  }

  const totalHeight = totalItems * itemHeight;
  const rawStart = Math.floor(Math.max(0, scrollTop) / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalItems, rawStart + visibleCount + overscan);

  const virtualItems: Array<{ index: number; start: number; size: number }> = [];
  for (let i = startIndex; i < endIndex; i++) {
    virtualItems.push({ index: i, start: i * itemHeight, size: itemHeight });
  }

  const paddingTop = startIndex * itemHeight;
  const paddingBottom = Math.max(0, (totalItems - endIndex) * itemHeight);

  return {
    startIndex,
    endIndex,
    virtualItems,
    paddingTop,
    paddingBottom,
    totalHeight,
  };
}

// ---------------------------------------------------------------------------
// 4. Chart Geometry & SVG Math (D3 Scale & Shape patterns)
// ---------------------------------------------------------------------------

export function scaleLinear(options: { domain: [number, number]; range: [number, number] }) {
  const [d0, d1] = options.domain;
  const [r0, r1] = options.range;
  const spanD = d1 - d0 === 0 ? 1 : d1 - d0;
  const spanR = r1 - r0;

  const fn = (value: number): number => {
    return r0 + ((value - d0) / spanD) * spanR;
  };

  fn.ticks = (count: number = 5): number[] => {
    const step = (d1 - d0) / Math.max(1, count - 1);
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      result.push(d0 + i * step);
    }
    return result;
  };

  return fn;
}

export function scaleBand(options: { domain: string[]; range: [number, number]; padding?: number }) {
  const { domain, range, padding = 0.1 } = options;
  const n = domain.length;
  const span = range[1] - range[0];
  const step = n > 0 ? span / (n - padding) : 0;
  const bandwidth = step * (1 - padding);

  const fn = (key: string): number => {
    const idx = domain.indexOf(key);
    return idx >= 0 ? range[0] + idx * step : range[0];
  };

  fn.bandwidth = bandwidth;
  fn.step = step;
  return fn;
}

export function getSmoothBezierPath(points: Array<{ x: number; y: number }>): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  if (points.length === 2) {
    return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;
  }

  let path = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return path;
}

export function getAreaPath(points: Array<{ x: number; y: number }>, baselineY: number = 100): string {
  if (!points || points.length === 0) return '';
  const curve = getSmoothBezierPath(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${curve} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function getPieSlices(values: number[], radius: number = 50, innerRadius: number = 0) {
  const total = values.reduce((acc, v) => acc + (v > 0 ? v : 0), 0);
  if (total <= 0) return [];

  let currentAngle = 0;
  return values.map((val, index) => {
    const fraction = val > 0 ? val / total : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + fraction * 2 * Math.PI;
    currentAngle = endAngle;

    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    let path = '';
    if (innerRadius > 0) {
      const ix1 = radius + innerRadius * Math.sin(endAngle);
      const iy1 = radius - innerRadius * Math.cos(endAngle);
      const ix2 = radius + innerRadius * Math.sin(startAngle);
      const iy2 = radius - innerRadius * Math.cos(startAngle);
      path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)} Z`;
    } else {
      path = `M ${radius} ${radius} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    }

    return {
      index,
      value: val,
      fraction,
      startAngle,
      endAngle,
      path,
      isDonut: innerRadius > 0,
    };
  });
}
