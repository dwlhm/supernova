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
