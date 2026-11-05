import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function cva<T>(key: string | undefined, map: Record<string, T>, fallback: string): T {
  return (key && key in map ? map[key] : map[fallback])!;
}

export function resolveId(id: string | undefined, fallback: string): string {
  return id && id.trim() !== '' ? id.trim() : fallback;
}

export function resolveControllable<T>(
  controlled: T | undefined,
  internal: T | undefined,
  fallback: T
): T {
  if (controlled !== undefined) return controlled;
  if (internal !== undefined) return internal;
  return fallback;
}

export function clampPercent(val: number | undefined, min = 0, max = 100): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  const span = max - min;
  if (span <= 0) return 0;
  const pct = ((num - min) / span) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

export function getNextRovingIndex(
  key: string,
  currentIndex: number,
  totalItems: number
): number {
  if (totalItems <= 0) return -1;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (currentIndex + 1) % totalItems;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (currentIndex - 1 + totalItems) % totalItems;
    case 'Home':
      return 0;
    case 'End':
      return totalItems - 1;
    default:
      return -1;
  }
}

export function focusElementSafely(el: unknown): void {
  if (el && typeof (el as { focus?: () => void }).focus === 'function') {
    (el as { focus: () => void }).focus();
  }
}

export function focusSiblingInput(event: unknown, offset: number): void {
  const target = (event as { currentTarget?: unknown; target?: unknown })?.currentTarget ??
    (event as { target?: unknown })?.target;
  const parent = (target as { parentElement?: { querySelectorAll?: (s: string) => unknown[] } })
    ?.parentElement;
  if (!parent || typeof parent.querySelectorAll !== 'function') return;
  const inputs = Array.from(parent.querySelectorAll('input'));
  const idx = inputs.indexOf(target);
  if (idx >= 0 && inputs[idx + offset]) {
    focusElementSafely(inputs[idx + offset]);
  }
}

export interface DialogStateOptions {
  id?: string;
  open?: boolean;
  showDescription?: boolean;
  onClose?: () => void;
}

export function createDialogState(options: DialogStateOptions = {}) {
  const baseId = resolveId(options.id, 'dialog');
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const hasDesc = options.showDescription !== false;
  return {
    isOpen: options.open ?? false, titleId, descriptionId,
    getBackdropProps: () => ({ 'aria-hidden': 'true' as const, onClick: () => options.onClose?.() }),
    getContentProps: (role: 'dialog' | 'alertdialog' = 'alertdialog') => ({
      role, 'aria-modal': 'true' as const, 'aria-labelledby': titleId, 'aria-describedby': hasDesc ? descriptionId : undefined,
      tabIndex: -1, onKeyDown: (event: { key?: string }) => { if (event?.key === 'Escape') options.onClose?.(); },
    }),
    getTitleProps: () => ({ id: titleId }), getDescriptionProps: () => ({ id: descriptionId }),
  };
}

export function handleRovingFocus(
  event: { key: string; preventDefault?: () => void; currentTarget?: unknown },
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void {
  const nextIndex = getNextRovingIndex(event?.key, currentIndex, totalItems);
  if (nextIndex < 0) return;
  event.preventDefault?.();
  onSelect(nextIndex);
  const container = event?.currentTarget as { querySelectorAll?: (s: string) => unknown[] } | undefined;
  if (container && typeof container.querySelectorAll === 'function') {
    focusElementSafely(container.querySelectorAll('[role="tab"], button')[nextIndex]);
  }
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
    getTabListProps: () => ({
      role: 'tablist' as const,
      onKeyDown: (event: { key: string; preventDefault?: () => void; currentTarget?: unknown }) => {
        const idx = Math.max(0, options.tabs.findIndex((t) => t.id === activeId));
        handleRovingFocus(event, idx, options.tabs.length, (next) => {
          if (options.tabs[next]) options.onSelect?.(options.tabs[next]!.id);
        });
      },
    }),
    getTabTriggerProps: (id: string) => ({
      role: 'tab' as const, id: `tab-${id}`, 'aria-selected': id === activeId, 'aria-controls': `panel-${id}`, tabIndex: id === activeId ? 0 : -1, onClick: () => options.onSelect?.(id),
    }),
    getTabPanelProps: (id: string) => ({
      role: 'tabpanel' as const, id: `panel-${id}`, 'aria-labelledby': `tab-${id}`, tabIndex: 0, hidden: id !== activeId,
    }),
  };
}

export function createTooltipState(options: { id?: string } = {}) {
  const id = resolveId(options.id, 'tooltip');
  return { id, getTriggerProps: () => ({ 'aria-describedby': id }), getContentProps: () => ({ role: 'tooltip' as const, id }) };
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function shiftYearMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const d = new Date(Date.UTC(year || 2025, (month || 1) - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function getCalendarDays(year = 2025, month = 1) {
  const safeYear = year > 1900 ? year : 2025;
  const safeMonth = Math.min(12, Math.max(1, month || 1));
  const daysInMonth = new Date(Date.UTC(safeYear, safeMonth, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(safeYear, safeMonth - 1, 1)).getUTCDay();
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = `${MONTH_NAMES[safeMonth - 1]} ${safeYear}`;
  return { year: safeYear, month: safeMonth, daysInMonth, leadingBlanks, days, monthLabel };
}

export function formatDateDisplay(
  year = 2025,
  month = 1,
  day = 0,
  displayValue = ''
): string {
  if (displayValue && displayValue.trim() !== '') return displayValue;
  if (!day || day <= 0) return '';
  const m = String(Math.min(12, Math.max(1, month || 1))).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year || 2025}-${m}-${d}`;
}

export interface PaginationEntry {
  key: string;
  label: string;
  page: number;
  isEllipsis: boolean;
  isCurrent: boolean;
}

export function getPaginationEntries(current = 1, total = 1): PaginationEntry[] {
  const safeTotal = Math.max(1, total || 1);
  const safeCurrent = Math.min(Math.max(1, current || 1), safeTotal);
  const raw: number[] = [];
  for (let p = 1; p <= safeTotal; p++) {
    if (p === 1 || p === safeTotal || Math.abs(p - safeCurrent) <= 1) raw.push(p);
  }
  const entries: PaginationEntry[] = [];
  let prev = 0;
  for (const page of raw) {
    if (prev > 0 && page - prev > 1) {
      entries.push({ key: `e-${prev}`, label: '...', page: -1, isEllipsis: true, isCurrent: false });
    }
    entries.push({ key: `p-${page}`, label: String(page), page, isEllipsis: false, isCurrent: page === safeCurrent });
    prev = page;
  }
  return entries;
}

export function getBreadcrumbItems<T extends { label: string; href?: string; current?: boolean }>(
  items: T[] = [],
  collapsed = false
): Array<T & { originalIndex: number; isEllipsis?: boolean }> {
  const indexed = (items || []).map((item, idx) => ({ ...item, originalIndex: idx }));
  if (!collapsed || indexed.length <= 4) return indexed;
  return [
    indexed[0]!,
    { label: '...', href: '#', current: false, originalIndex: -1, isEllipsis: true } as unknown as T & { originalIndex: number; isEllipsis?: boolean },
    indexed[indexed.length - 2]!,
    indexed[indexed.length - 1]!,
  ];
}

export function computeOtpDigits(value = '', length = 6): string[] {
  const safeLen = Math.max(1, length || 6);
  const raw = String(value ?? '');
  return Array.from({ length: safeLen }, (_, idx) => {
    const ch = raw[idx];
    return ch && ch !== ' ' ? ch : '';
  });
}

export function applyOtpChar(value = '', index = 0, rawChar = '', length = 6): string {
  const safeLen = Math.max(1, length || 6);
  const slots = Array.from({ length: safeLen }, (_, idx) => value[idx] ?? ' ');
  const clean = String(rawChar ?? '').replace(/\s/g, '');
  slots[index] = clean ? clean[clean.length - 1]! : ' ';
  return slots.join('').replace(/\s+$/, '');
}

export function applyOtpPasteString(pasted = '', length = 6): string {
  return String(pasted ?? '').replace(/\s/g, '').slice(0, Math.max(1, length || 6));
}

export function handleOtpInputEvent(
  event: unknown,
  index: number,
  currentValue: string | undefined,
  length: number,
  onChange?: (val: string) => void
): void {
  const raw = (event as { target?: { value?: string } })?.target?.value ?? '';
  onChange?.(applyOtpChar(currentValue ?? '', index, raw, length));
  if (raw && index < length - 1) focusSiblingInput(event, 1);
}

export function handleOtpKeyDownEvent(
  event: { key?: string; preventDefault?: () => void; currentTarget?: unknown },
  index: number,
  currentValue: string | undefined,
  length: number,
  onChange?: (val: string) => void
): void {
  const digits = computeOtpDigits(currentValue, length);
  if (event?.key === 'Backspace' && !digits[index] && index > 0) {
    event.preventDefault?.();
    onChange?.(applyOtpChar(currentValue ?? '', index - 1, '', length));
    focusSiblingInput(event, -1);
  } else if (event?.key === 'ArrowLeft' && index > 0) {
    event.preventDefault?.();
    focusSiblingInput(event, -1);
  } else if (event?.key === 'ArrowRight' && index < length - 1) {
    event.preventDefault?.();
    focusSiblingInput(event, 1);
  }
}

export function handleOtpPasteEvent(
  event: { preventDefault?: () => void; clipboardData?: { getData?: (t: string) => string } },
  length: number,
  onChange?: (val: string) => void
): void {
  const text = event?.clipboardData?.getData?.('text') ?? '';
  if (!text) return;
  event.preventDefault?.();
  onChange?.(applyOtpPasteString(text, length));
}

export function filterDropdownOptions<T extends { label: string; value: string }>(
  options: T[] = [],
  query = ''
): T[] {
  const q = String(query ?? '').trim().toLowerCase();
  return !q ? options || [] : (options || []).filter((opt) => opt.label.toLowerCase().includes(q));
}

export interface ExtractedFileResult {
  files: unknown[];
  firstFileName: string;
  previewUrl: string;
}

export function extractFilesFromEvent(event: unknown): ExtractedFileResult {
  const ev = event as {
    target?: { files?: ArrayLike<{ name?: string; type?: string }> };
    dataTransfer?: { files?: ArrayLike<{ name?: string; type?: string }> };
  };
  const rawList = ev?.target?.files ?? ev?.dataTransfer?.files;
  const files = rawList ? Array.from(rawList) : [];
  const first = files[0] as { name?: string; type?: string } | undefined;
  const firstFileName = first?.name ?? '';
  let previewUrl = '';
  if (
    first &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function' &&
    typeof Blob !== 'undefined' &&
    first instanceof Blob
  ) {
    previewUrl = URL.createObjectURL(first);
  }
  return { files, firstFileName, previewUrl };
}

export function handleFileSelectEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onPreviewChange?: (url: string) => void
): ExtractedFileResult {
  const ev = event as { preventDefault?: () => void };
  ev?.preventDefault?.();
  const res = extractFilesFromEvent(event);
  if (res.firstFileName) {
    onFileNameChange?.(res.firstFileName);
  }
  if (res.files.length > 0) {
    onFilesChange?.(res.files);
  }
  if (res.previewUrl) {
    onPreviewChange?.(res.previewUrl);
  }
  return res;
}

export function clearFileInputEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onClear?: () => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    stopPropagation?: () => void;
    currentTarget?: {
      parentElement?: { querySelector?: (s: string) => { value?: string } | null };
    };
  };
  ev?.preventDefault?.();
  ev?.stopPropagation?.();
  const input = ev?.currentTarget?.parentElement?.querySelector?.('input[type="file"]');
  if (input) {
    input.value = '';
  }
  onFileNameChange?.('');
  onFilesChange?.([]);
  onClear?.();
}

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

export function paginateTableRows<T>(rows: T[], page = 1, pageSize = 10) {
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

export function filterTableRows<T>(rows: T[], query: string, searchKeys?: Array<keyof T>): T[] {
  if (!query || !query.trim() || !Array.isArray(rows)) return rows ? [...rows] : [];
  const q = query.toLowerCase().trim();
  return rows.filter((row) => {
    const keys = searchKeys || (Object.keys(row as Record<string, unknown>) as Array<keyof T>);
    return keys.some((k) => {
      const val = row[k];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });
}

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
    return { startIndex: 0, endIndex: 0, virtualItems: [] as Array<{ index: number; start: number; size: number }>, paddingTop: 0, paddingBottom: 0, totalHeight: 0 };
  }
  const totalHeight = totalItems * itemHeight;
  const rawStart = Math.floor(Math.max(0, scrollTop) / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalItems, rawStart + visibleCount + overscan);
  const virtualItems = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => {
    const index = startIndex + i;
    return { index, start: index * itemHeight, size: itemHeight };
  });
  return { startIndex, endIndex, virtualItems, paddingTop: startIndex * itemHeight, paddingBottom: Math.max(0, (totalItems - endIndex) * itemHeight), totalHeight };
}

export function scaleLinear(options: { domain: [number, number]; range: [number, number] }) {
  const [d0, d1] = options.domain;
  const [r0, r1] = options.range;
  const spanD = d1 - d0 === 0 ? 1 : d1 - d0;
  const spanR = r1 - r0;
  const fn = (value: number): number => r0 + ((value - d0) / spanD) * spanR;
  fn.ticks = (count = 5): number[] => {
    const step = (d1 - d0) / Math.max(1, count - 1);
    return Array.from({ length: count }, (_, i) => d0 + i * step);
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
  if (points.length === 2) return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;
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

export function getAreaPath(points: Array<{ x: number; y: number }>, baselineY = 100): string {
  if (!points || points.length === 0) return '';
  const curve = getSmoothBezierPath(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${curve} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function getPieSlices(values: number[], radius = 50, innerRadius = 0) {
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
    const ix1 = radius + innerRadius * Math.sin(endAngle);
    const iy1 = radius - innerRadius * Math.cos(endAngle);
    const ix2 = radius + innerRadius * Math.sin(startAngle);
    const iy2 = radius - innerRadius * Math.cos(startAngle);
    const path = innerRadius > 0
      ? `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)} Z`
      : `M ${radius} ${radius} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    return { index, value: val, fraction, startAngle, endAngle, path, isDonut: innerRadius > 0 };
  });
}

export interface ChartPt {
  label: string;
  value?: number;
  values?: number[];
}

const SERIES_BG = ['bg-chart-series-1', 'bg-chart-series-2', 'bg-chart-series-3', 'bg-chart-series-4', 'bg-chart-series-5'];
const SERIES_STROKE = ['stroke-chart-series-1', 'stroke-chart-series-2', 'stroke-chart-series-3', 'stroke-chart-series-4', 'stroke-chart-series-5'];
const SERIES_FILL = ['fill-chart-series-1', 'fill-chart-series-2', 'fill-chart-series-3', 'fill-chart-series-4', 'fill-chart-series-5'];

export function getChartBarState(data?: ChartPt[], defaultColorClass = 'bg-chart-series-1') {
  const rawRows = data || [];
  let max = 0;
  let total = 0;

  for (const r of rawRows) {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    for (const v of vals) {
      if (v > max) max = v;
      total += v;
    }
  }

  const rows = rawRows.map((r, rIdx) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const bars = vals.map((v, sIdx) => ({
      key: `${r.label || rIdx}-bar-${sIdx}`,
      value: v,
      height: max <= 0 || v < 0 ? '0%' : `${(v / max) * 100}%`,
      seriesIndex: sIdx,
      colorClass: sIdx === 0 && defaultColorClass ? defaultColorClass : SERIES_BG[sIdx % SERIES_BG.length]!,
    }));
    return {
      label: r.label,
      value: vals[0] ?? 0,
      bars,
    };
  });

  return {
    rows,
    max,
    total,
    barHeight: (val: number) => (max <= 0 || val < 0 ? '0%' : `${(val / max) * 100}%`),
  };
}

export function getChartLineState(
  data?: ChartPt[],
  defaultStroke = 'stroke-chart-series-1',
  defaultFill = 'fill-chart-series-1'
) {
  const rawRows = data || [];
  let max = 0;
  let total = 0;
  let maxSeriesCount = 1;

  for (const r of rawRows) {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    if (vals.length > maxSeriesCount) maxSeriesCount = vals.length;
    for (const v of vals) {
      if (v > max) max = v;
      total += v;
    }
  }
  if (max <= 0) max = 1;
  const count = rawRows.length;

  const lines = Array.from({ length: maxSeriesCount }, (_, sIdx) => {
    const pts = rawRows.map((r, i) => {
      const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
      const val = vals[sIdx] ?? (sIdx === 0 ? vals[0] ?? 0 : 0);
      const x = count > 1 ? (i / (count - 1)) * 100 : 50;
      const y = 100 - (val / max) * 100;
      return { x, y, val };
    });
    const linePoints = pts.map((p) => `${p.x},${p.y}`).join(' ');
    const firstX = pts[0]?.x ?? 0;
    const lastX = pts[pts.length - 1]?.x ?? 100;
    const areaPoints = pts.length === 0 ? '' : `${firstX},100 ${linePoints} ${lastX},100`;
    return {
      key: `series-line-${sIdx}`,
      seriesIndex: sIdx,
      linePoints,
      areaPoints,
      strokeClass: sIdx === 0 && defaultStroke ? defaultStroke : SERIES_STROKE[sIdx % SERIES_STROKE.length]!,
      fillClass: sIdx === 0 && defaultFill ? defaultFill : SERIES_FILL[sIdx % SERIES_FILL.length]!,
    };
  });

  const points = rawRows.map((r, i) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const x = count > 1 ? (i / (count - 1)) * 100 : 50;
    const primaryVal = vals[0] ?? 0;
    const y = 100 - (primaryVal / max) * 100;
    const valuesList = vals.map((v, sIdx) => ({
      key: `${r.label || i}-val-${sIdx}`,
      value: v,
      seriesIndex: sIdx,
      colorClass: sIdx === 0 && defaultFill ? defaultFill.replace('fill-', 'bg-') : SERIES_BG[sIdx % SERIES_BG.length]!,
    }));
    return {
      key: `pt-${i}`,
      label: r.label,
      value: primaryVal,
      x,
      y,
      valuesList,
    };
  });

  return {
    lines,
    points,
    linePoints: lines[0]?.linePoints ?? '',
    areaPoints: lines[0]?.areaPoints ?? '',
    max,
    total,
  };
}

export function getChartPieState(data?: ChartPt[], innerRadius = 0) {
  const rows = data || [];
  const ringRadius = innerRadius > 0 && innerRadius < 50 ? (50 + innerRadius) / 2 : 25;
  const ringWidth = innerRadius > 0 && innerRadius < 50 ? 50 - innerRadius : 50;
  const circumference = 2 * Math.PI * ringRadius;
  const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0);
  let running = 0;
  const slices = rows.map((r, i) => {
    const val = r.value ?? 0;
    const fraction = total > 0 ? val / total : 0;
    const len = fraction * circumference;
    const offset = -running * circumference;
    running += fraction;
    return {
      key: `slice-${i}`,
      label: r.label,
      value: val,
      fraction,
      percentage: total > 0 ? Math.round(fraction * 100) : 0,
      dashArray: `${len} ${circumference - len}`,
      dashOffset: String(offset),
      seriesIndex: i % 5,
    };
  });
  return { ringRadius, ringWidth, slices, total };
}

export const ICON_PATHS: Record<string, string> = {
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M20 6 9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  chevronDown: 'm6 9 6 6 6-6',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  close: 'M18 6 6 18M6 6l12 12',
  search: 'm21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  image: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 15l-5-5L5 21',
  video: 'm22 8-6 4 6 4V8ZM14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  info: 'M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  warning: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  error: 'm15 9-6 6M9 9l6 6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  external: 'M7 17 17 7M7 7h10v10',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  circle: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  star: 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  truck: 'M10 17h4V5H2v12h3m15 0h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1',
};

export function getIconPath(name: string): string {
  return ICON_PATHS[name] || ICON_PATHS.circle!;
}

export function getToastIconPath(type?: string): string {
  if (type === 'success') return ICON_PATHS.checkCircle!;
  if (type === 'error') return ICON_PATHS.error!;
  if (type === 'warning') return ICON_PATHS.warning!;
  return ICON_PATHS.info!;
}

export function getChoiceState(props: { label?: string; leftLabel?: boolean; rightLabel?: boolean }) {
  const hasLabel = Boolean(props.label && props.label !== '');
  return {
    hasLabel,
    showLeft: Boolean(props.leftLabel && hasLabel),
    showRight: Boolean(!props.leftLabel && props.rightLabel !== false && hasLabel),
  };
}

export function getSliderState(props: { value?: number; min?: number; max?: number }) {
  const pct = clampPercent(props.value, props.min ?? 0, props.max ?? 100);
  return { pct, barStyle: { width: `${pct}%` }, thumbStyle: { left: `${pct}%` } };
}

export function getInputState(props: { value?: string; errorMessage?: string; hint?: string; maxLength?: number }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const valStr = String(props.value ?? '');
  return {
    hasError,
    helpText: hasError ? props.errorMessage : props.hint,
    countText: `${valStr.length} / ${props.maxLength ?? 200}`,
  };
}

export function getOtpState(props: { value?: string; length?: number; errorMessage?: string; hint?: string }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const digits = computeOtpDigits(props.value, props.length ?? 6).map((char, index) => ({ index, char }));
  return { hasError, digits, helpText: hasError ? props.errorMessage : props.hint };
}

export function getDropdownState<T extends { label: string; value: string }>(props: { options?: T[]; value?: string; searchQuery?: string; open?: boolean; errorMessage?: string; hint?: string }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const options = Array.isArray(props.options) ? props.options : [];
  const filtered = filterDropdownOptions(options, props.searchQuery);
  const matched = options.find((o) => o.value === props.value);
  return {
    hasError, isOpen: Boolean(props.open), filtered,
    selectedLabel: matched ? matched.label : '',
    helpText: hasError ? props.errorMessage : props.hint,
  };
}

export function getDatePickerState(props: { year?: number; month?: number; value?: number; displayValue?: string; placeholder?: string }) {
  const cal = getCalendarDays(props.year || 2025, props.month || 1);
  const cells = [
    ...cal.leadingBlanks.map((i) => ({ key: `b-${i}`, day: 0, isBlank: true, isSelected: false })),
    ...cal.days.map((day) => ({ key: `d-${day}`, day, isBlank: false, isSelected: day === props.value })),
  ];
  const formatted = formatDateDisplay(cal.year, cal.month, props.value, props.displayValue);
  return {
    weekdays: WEEKDAY_LABELS, monthLabel: cal.monthLabel, cells,
    hasValue: formatted !== '',
    displayText: formatted !== '' ? formatted : (props.placeholder || 'Select a date'),
  };
}

export function getFileState<T extends { id: string; name: string; status: string } = { id: string; name: string; status: string }>(props: { fileName?: string; errorMessage?: string; hint?: string; files?: T[] }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasFile = Boolean(props.fileName && props.fileName !== '');
  return {
    hasError, hasFile,
    helpText: hasError ? props.errorMessage : props.hint,
    displayName: hasFile ? props.fileName : 'No file chosen',
    files: Array.isArray(props.files) ? props.files : [],
  };
}

export interface CrumbItem { label: string; href?: string; }
export interface CrumbEntry { key: string; label: string; href: string; isEllipsis: boolean; isCurrent: boolean; originalIndex: number; }

export function getBreadcrumbState(props: { items?: CrumbItem[]; type?: string; showEllipsis?: boolean; maxItems?: number }): CrumbEntry[] {
  const all = props.items || [];
  const total = all.length;
  const rows: CrumbEntry[] = [];
  if (total === 0) return rows;
  let start = 0;
  const end = total - 1;
  let collapsed = false;
  if (props.type === '1') start = total - 1;
  else if (props.type === '2') start = total > 1 ? total - 2 : total - 1;
  else if (props.showEllipsis && total > (props.maxItems || 4)) collapsed = true;
  if (!collapsed) {
    for (let i = start; i <= end; i++) {
      rows.push({ key: `crumb-${i}`, label: all[i]!.label, href: all[i]!.href || '#', isEllipsis: false, isCurrent: i === end, originalIndex: i });
    }
    return rows;
  }
  rows.push({ key: 'crumb-first', label: all[0]!.label, href: all[0]!.href || '#', isEllipsis: false, isCurrent: false, originalIndex: 0 });
  rows.push({ key: 'crumb-ellipsis', label: '...', href: '#', isEllipsis: true, isCurrent: false, originalIndex: -1 });
  for (let i = end - 1; i <= end; i++) {
    rows.push({ key: `crumb-${i}`, label: all[i]!.label, href: all[i]!.href || '#', isEllipsis: false, isCurrent: i === end, originalIndex: i });
  }
  return rows;
}

export function getPaginationState(currentPage = 1, totalPages = 1) {
  const total = totalPages > 0 ? totalPages : 1;
  const current = Math.min(Math.max(1, currentPage || 1), total);
  const entries = getPaginationEntries(current, total);
  return { current, total, canPrev: current > 1, canNext: current < total, entries };
}

export function getStepperStepState(index: number, current = 1, total = 0) {
  const pos = index + 1;
  return {
    isCompleted: pos < current,
    isCurrent: pos === current,
    isLast: index === total - 1,
    stepKey: pos < current ? 'completed' : pos === current ? 'active' : 'upcoming',
    prevCompleted: index < current,
  };
}

export function getProgressState(value = 0) {
  const percentage = Math.min(100, Math.max(0, value || 0));
  return { percentage, barStyle: { width: `${percentage}%` } };
}

export function getAvatarState(props: { showStatus?: boolean; status?: string; alt?: string; initialsText?: string }) {
  const baseName = props.alt || props.initialsText || 'Avatar';
  const accessibleName = props.showStatus && props.status ? `${baseName} (${props.status})` : baseName;
  return { accessibleName };
}

export interface TableColItem { id: string; label: string; align?: 'left' | 'center' | 'right'; }
export interface TableCellConfig {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  statusLabel?: string;
  href?: string;
  align?: 'left' | 'center' | 'right';
}
export type TableCellInput = string | TableCellConfig;
export interface TableRowItem { id: string; cells: TableCellInput[]; selected?: boolean; }
export interface TableRowCellItem {
  value: string;
  secondaryValue: string;
  badgeLabel: string;
  buttonLabel: string;
  imageSrc: string;
  avatarInitials: string;
  statusLabel: string;
  href: string;
  align: 'left' | 'center' | 'right';
}

export function getTableBodyRowCells(cells: TableCellInput[] = [], columns?: TableColItem[]): TableRowCellItem[] {
  return (cells || []).map((cell, index) => {
    const colAlign = columns?.[index]?.align || 'left';
    if (typeof cell === 'string') {
      return { value: cell, secondaryValue: '', badgeLabel: '', buttonLabel: '', imageSrc: '', avatarInitials: '', statusLabel: '', href: '', align: colAlign };
    }
    return {
      value: cell?.value || '',
      secondaryValue: cell?.secondaryValue || '',
      badgeLabel: cell?.badgeLabel || '',
      buttonLabel: cell?.buttonLabel || '',
      imageSrc: cell?.imageSrc || '',
      avatarInitials: cell?.avatarInitials || '',
      statusLabel: cell?.statusLabel || '',
      href: cell?.href || '',
      align: cell?.align || colAlign,
    };
  });
}

export function getTableState(props: {
  state?: string;
  columns?: TableColItem[];
  rows?: TableRowItem[];
  showNo?: boolean;
  showCheckbox?: boolean;
  pageSizeOptions?: number[];
}) {
  const columns = props.columns || [];
  const rows = props.state === 'empty' ? [] : (props.rows || []);
  const isEmpty = props.state === 'empty' || rows.length === 0;
  const colSpan = Math.max(1, columns.length + (props.showNo ? 1 : 0) + (props.showCheckbox ? 1 : 0));
  const selectedCount = rows.filter((r) => r.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const indeterminate = selectedCount > 0 && selectedCount < rows.length;
  const pageSizeOptions = props.pageSizeOptions && props.pageSizeOptions.length > 0 ? props.pageSizeOptions : [10, 20, 50];
  return { columns, rows, isEmpty, colSpan, allSelected, indeterminate, pageSizeOptions };
}

const TRACKED_KEYS = [
  'value', 'checked', 'pressed', 'activeTab', 'currentPage', 'pageSize',
  'open', 'searchQuery', 'searchValue', 'fileName', 'imageSrc',
  'files', 'month', 'year', 'displayValue', 'rows', 'items',
] as const;

function isSamePropValue(a: any, b: any): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

export function bindControllerProps<P extends Record<string, any>>(
  rawProps: P,
  state: Record<string, any>,
  setState: (updater: (prev: Record<string, any>) => Record<string, any>) => void
): P {
  const prevProps = (state.__prevProps || {}) as Record<string, any>;
  const synced: Record<string, any> = { ...state };
  let propChanged = false;
  for (const key of TRACKED_KEYS) {
    if (key in rawProps && !isSamePropValue(rawProps[key], prevProps[key])) {
      synced[key] = rawProps[key];
      propChanged = true;
    }
  }
  if (propChanged) {
    state.__prevProps = { ...rawProps };
    for (const key of TRACKED_KEYS) {
      if (key in synced) state[key] = synced[key];
    }
  }
  const update = (patch: Record<string, any>) => {
    setState((prev) => ({ ...prev, __prevProps: { ...rawProps }, ...patch }));
  };
  const resolved: Record<string, any> = { ...rawProps };
  for (const key of TRACKED_KEYS) {
    if (state[key] !== undefined && isSamePropValue(rawProps[key], prevProps[key])) {
      resolved[key] = state[key];
    }
  }
  return {
    ...resolved,
    onValueChange: (val: any) => { update({ value: val }); rawProps.onValueChange?.(val); },
    onChange: (val: any) => { update({ value: val, checked: typeof val === 'boolean' ? val : resolved.checked }); rawProps.onChange?.(val); },
    onCheckedChange: (val: any, second?: boolean) => {
      const next = typeof second === 'boolean' ? second : Boolean(val);
      update({ checked: next });
      rawProps.onCheckedChange?.(val, second);
    },
    onPressedChange: (val: boolean) => { update({ pressed: val }); rawProps.onPressedChange?.(val); },
    onTabChange: (id: string) => { update({ activeTab: id }); rawProps.onTabChange?.(id); },
    onPageChange: (p: number) => { update({ currentPage: p }); rawProps.onPageChange?.(p); },
    onPageSizeChange: (size: number) => { update({ pageSize: size, currentPage: 1 }); rawProps.onPageSizeChange?.(size); },
    onOpenChange: (o: boolean) => { update({ open: o }); rawProps.onOpenChange?.(o); },
    onSearchChange: (q: string) => { update({ searchQuery: q, searchValue: q }); rawProps.onSearchChange?.(q); },
    onFileNameChange: (name: string) => { update({ fileName: name, ...(name === '' ? { imageSrc: '' } : {}) }); rawProps.onFileNameChange?.(name); },
    onFilesChange: (files: any[]) => { update({ files }); rawProps.onFilesChange?.(files); },
    onPreviewChange: (url: string) => { update({ imageSrc: url }); rawProps.onPreviewChange?.(url); },
    onRowSelect: (rowId: string, checked: boolean) => {
      if (Array.isArray(resolved.rows)) {
        update({ rows: resolved.rows.map((r: any) => (r.id === rowId ? { ...r, selected: checked } : r)) });
      }
      rawProps.onRowSelect?.(rowId, checked);
    },
    onSelectAll: (checked: boolean) => {
      if (Array.isArray(resolved.rows)) {
        update({ rows: resolved.rows.map((r: any) => ({ ...r, selected: checked })) });
      }
      rawProps.onSelectAll?.(checked);
    },
    onToggle: (id: string, checked: boolean) => {
      if (Array.isArray(resolved.items)) {
        update({ items: resolved.items.map((item: any) => (item.id === id ? { ...item, checked } : item)) });
      }
      rawProps.onToggle?.(id, checked);
    },
    onSelect: (val: any, second?: boolean) => {
      if (typeof second === 'boolean') {
        update({ checked: second });
      } else if (typeof val === 'number') {
        const disp = formatDateDisplay(resolved.year, resolved.month, val, '');
        update({ value: val, displayValue: disp, open: false });
      } else {
        update({ value: val, open: false });
      }
      rawProps.onSelect?.(val, second);
    },
    onMonthStep: (delta: number) => {
      const next = shiftYearMonth(resolved.year || 2025, resolved.month || 1, delta);
      update({ year: next.year, month: next.month });
      rawProps.onMonthStep?.(delta);
    },
  } as unknown as P;
}
