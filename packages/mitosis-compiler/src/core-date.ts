export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export type DatePickerMode = 'single' | 'range' | 'month' | 'year';

export type DatePickerViewMode = 'days' | 'months' | 'years';

export interface DatePickerValueContext {
  year: number;
  month: number;
  day: number;
  iso: string;
  formatted: string;
  time: string;
  startDate: Date | null;
  endDate: Date | null;
  range: string;
  mode: DatePickerMode;
  hasValue: boolean;
}

export type DatePickerFormatArg = Date & DatePickerValueContext;

export function createDatePickerFormatArg(ctx: DatePickerValueContext): DatePickerFormatArg {
  const d = new Date(Date.UTC(ctx.year || 2025, Math.min(11, Math.max(0, (ctx.month || 6) - 1)), Math.max(1, ctx.day || 1)));
  return Object.assign(d, ctx, {
    toString() {
      return ctx.mode === 'range' ? ctx.range : ctx.formatted;
    },
  });
}

export interface TimePickerValueContext {
  hour: number;
  minute: number;
  second: number;
  hour12: number;
  period: 'AM' | 'PM';
  formatted: string;
  iso: string;
  hasValue: boolean;
}

export type TimePickerFormatArg = TimePickerValueContext & {
  toString(): string;
};

export function createTimePickerFormatArg(ctx: TimePickerValueContext): TimePickerFormatArg {
  return Object.assign({}, ctx, {
    toString() {
      return ctx.formatted;
    },
  });
}

export function parseTimeInput(text?: string | null): { hour: number; minute: number; second: number; period?: 'AM' | 'PM' } | null {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))(?::(\d{2}))?(?:\s*(am|pm))?$/i);
  if (!match) return null;
  let hour = parseInt(match[1]!, 10);
  const minute = parseInt(match[2]!, 10);
  const second = match[3] ? parseInt(match[3]!, 10) : 0;
  const ampm = match[4] ? (match[4].toUpperCase() as 'AM' | 'PM') : undefined;

  if (minute < 0 || minute > 59 || second < 0 || second > 59) return null;

  if (ampm) {
    if (hour < 1 || hour > 12) return null;
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
  } else {
    if (hour < 0 || hour > 23) return null;
  }

  return { hour, minute, second, period: ampm };
}

export function formatTimeDisplay(hour: number, minute: number, second = 0, format: 'HH:mm' | 'HH:mm:ss' = 'HH:mm', use12Hours = false): string {
  const safeH = Math.max(0, Math.min(23, hour));
  const safeM = Math.max(0, Math.min(59, minute));
  const safeS = Math.max(0, Math.min(59, second));
  const mStr = String(safeM).padStart(2, '0');
  const sStr = String(safeS).padStart(2, '0');

  if (use12Hours) {
    const h12 = safeH % 12 === 0 ? 12 : safeH % 12;
    const period = safeH >= 12 ? 'PM' : 'AM';
    const hStr = String(h12).padStart(2, '0');
    return format === 'HH:mm:ss' ? `${hStr}:${mStr}:${sStr} ${period}` : `${hStr}:${mStr} ${period}`;
  }

  const hStr = String(safeH).padStart(2, '0');
  return format === 'HH:mm:ss' ? `${hStr}:${mStr}:${sStr}` : `${hStr}:${mStr}`;
}

export interface CalendarCell {
  key: string;
  day: number;
  month: number;
  year: number;
  isBlank: boolean;
  isOutside: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

export interface CalendarPanel {
  key: string;
  year: number;
  month: number;
  monthLabel: string;
  monthShortLabel: string;
  yearLabel: string;
  showPrev: boolean;
  showNext: boolean;
  cells: CalendarCell[];
}

export interface MonthGridEntry {
  key: string;
  month: number;
  label: string;
  fullLabel: string;
  isSelected: boolean;
}

export interface YearGridEntry {
  key: string;
  year: number;
  label: string;
  isSelected: boolean;
}

export function toDateKey(year: number, month: number, day: number): number {
  if (!year || !month || !day || day <= 0) return 0;
  return year * 10000 + month * 100 + day;
}

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
  const prevMonthDays = new Date(Date.UTC(safeYear, safeMonth - 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(safeYear, safeMonth - 1, 1)).getUTCDay();
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const leadingDays = Array.from({ length: firstWeekday }, (_, i) => prevMonthDays - firstWeekday + 1 + i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalOccupied = firstWeekday + daysInMonth;
  const totalCells = totalOccupied > 35 ? 42 : 35;
  const trailingDays = Array.from({ length: Math.max(0, totalCells - totalOccupied) }, (_, i) => i + 1);
  const monthLabel = `${MONTH_NAMES[safeMonth - 1]} ${safeYear}`;
  const monthShortLabel = MONTH_ABBR[safeMonth - 1] || 'Jan';
  return {
    year: safeYear,
    month: safeMonth,
    daysInMonth,
    leadingBlanks,
    leadingDays,
    days,
    trailingDays,
    monthLabel,
    monthShortLabel,
  };
}

export function buildCalendarPanel(
  year: number,
  month: number,
  opts: {
    selectedKey?: number;
    rangeStartKey?: number;
    rangeEndKey?: number;
    todayDay?: number;
    showPrev?: boolean;
    showNext?: boolean;
  } = {}
): CalendarPanel {
  const cal = getCalendarDays(year, month);
  const prevYM = shiftYearMonth(cal.year, cal.month, -1);
  const nextYM = shiftYearMonth(cal.year, cal.month, 1);
  const rStart = opts.rangeStartKey && opts.rangeEndKey ? Math.min(opts.rangeStartKey, opts.rangeEndKey) : (opts.rangeStartKey || 0);
  const rEnd = opts.rangeStartKey && opts.rangeEndKey ? Math.max(opts.rangeStartKey, opts.rangeEndKey) : 0;

  const makeCell = (prefix: string, y: number, m: number, d: number, isOutside: boolean): CalendarCell => {
    const k = toDateKey(y, m, d);
    const isRangeStart = rStart > 0 && k === rStart;
    const isRangeEnd = rEnd > 0 && k === rEnd;
    const isInRange = rStart > 0 && rEnd > 0 && k >= rStart && k <= rEnd;
    const isSelected = (!isOutside && opts.selectedKey === k) || isRangeStart || isRangeEnd;
    const isToday = !isOutside && !isSelected && d === (opts.todayDay ?? 25);
    return {
      key: `${prefix}-${y}-${m}-${d}`,
      day: d,
      month: m,
      year: y,
      isBlank: false,
      isOutside,
      isToday,
      isSelected,
      isRangeStart,
      isRangeEnd,
      isInRange,
    };
  };

  const cells: CalendarCell[] = [
    ...cal.leadingDays.map((d) => makeCell('p', prevYM.year, prevYM.month, d, true)),
    ...cal.days.map((d) => makeCell('c', cal.year, cal.month, d, false)),
    ...cal.trailingDays.map((d) => makeCell('n', nextYM.year, nextYM.month, d, true)),
  ];

  return {
    key: `panel-${cal.year}-${cal.month}`,
    year: cal.year,
    month: cal.month,
    monthLabel: cal.monthLabel,
    monthShortLabel: cal.monthShortLabel,
    yearLabel: String(cal.year),
    showPrev: opts.showPrev ?? true,
    showNext: opts.showNext ?? true,
    cells,
  };
}

export function getMonthGridEntries(selectedMonth = 1): MonthGridEntry[] {
  const safe = Math.min(12, Math.max(1, selectedMonth || 1));
  return MONTH_ABBR.map((label, idx) => {
    const month = idx + 1;
    return {
      key: `m-${month}`,
      month,
      label,
      fullLabel: MONTH_NAMES[idx] || label,
      isSelected: month === safe,
    };
  });
}

export function getYearGridEntries(selectedYear = 2026, baseYear?: number): YearGridEntry[] {
  const target = (baseYear && baseYear > 1900) ? baseYear : (selectedYear > 1900 ? selectedYear : 2026);
  const startYear = Math.floor((target - 2021) / 9) * 9 + 2021;
  return Array.from({ length: 9 }, (_, i) => {
    const year = startYear + i;
    return {
      key: `y-${year}`,
      year,
      label: String(year),
      isSelected: year === selectedYear,
    };
  });
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

export function formatHumanDate(year = 2025, month = 6, day = 1): string {
  if (!day || day <= 0) return '';
  const mName = MONTH_NAMES[Math.min(12, Math.max(1, month || 1)) - 1] || 'June';
  const dStr = String(day).padStart(2, '0');
  return `${mName} ${dStr}, ${year || 2025}`;
}

const ID_MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5, jun: 6,
  jul: 7, aug: 8, agu: 8, sep: 9, oct: 10, okt: 10, nov: 11, dec: 12, des: 12,
};

const WEEKDAY_NAME_MAP: Record<string, number> = {
  sunday: 0, sun: 0, minggu: 0,
  monday: 1, mon: 1, senin: 1,
  tuesday: 2, tue: 2, selasa: 2,
  wednesday: 3, wed: 3, rabu: 3,
  thursday: 4, thu: 4, kamis: 4,
  friday: 5, fri: 5, jumat: 5,
  saturday: 6, sat: 6, sabtu: 6,
};

export function parseDateInput(
  raw: string,
  fallbackYear = 2025,
  fallbackMonth = 6
): { year: number; month: number; day: number } | null {
  const text = (raw || '').trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  const baseDate = new Date(Date.UTC(fallbackYear || 2025, (fallbackMonth || 6) - 1, 1));
  const addDays = (days: number) => {
    const d = new Date(baseDate.getTime() + days * 86400000);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
  };
  if (lower === 'today' || lower === 'hari ini' || lower === 'now') return addDays(0);
  if (lower === 'tomorrow' || lower === 'besok') return addDays(1);
  if (lower === 'yesterday' || lower === 'kemarin') return addDays(-1);
  if (lower === 'next week' || lower === 'minggu depan') return addDays(7);
  if (lower === 'next month' || lower === 'bulan depan') {
    const next = shiftYearMonth(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 1);
    return { year: next.year, month: next.month, day: 1 };
  }
  const inDaysMatch = lower.match(/^(?:in\s+(\d+)\s+days?|(\d+)\s+days?\s+from\s+now|(\d+)\s+hari\s+lagi)$/);
  if (inDaysMatch) return addDays(parseInt((inDaysMatch[1] || inDaysMatch[2] || inDaysMatch[3])!, 10));
  const agoDaysMatch = lower.match(/^(?:(\d+)\s+days?\s+ago|(\d+)\s+hari\s+(?:yang\s+)?lalu)$/);
  if (agoDaysMatch) return addDays(-parseInt((agoDaysMatch[1] || agoDaysMatch[2])!, 10));
  const inWeeksMatch = lower.match(/^(?:in\s+(\d+)\s+weeks?|(\d+)\s+minggu\s+lagi)$/);
  if (inWeeksMatch) return addDays(parseInt((inWeeksMatch[1] || inWeeksMatch[2])!, 10) * 7);
  const inMonthsMatch = lower.match(/^(?:in\s+(\d+)\s+months?|(\d+)\s+bulan\s+lagi)$/);
  if (inMonthsMatch) {
    const next = shiftYearMonth(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, parseInt((inMonthsMatch[1] || inMonthsMatch[2])!, 10));
    return { year: next.year, month: next.month, day: 1 };
  }
  const nextWeekdayMatch = lower.match(/^(?:next|hari)\s+([a-z]+)$/);
  if (nextWeekdayMatch && WEEKDAY_NAME_MAP[nextWeekdayMatch[1]!] !== undefined) {
    const targetDow = WEEKDAY_NAME_MAP[nextWeekdayMatch[1]!]!;
    const currentDow = baseDate.getUTCDay();
    const diff = ((targetDow - currentDow + 7) % 7) || 7;
    return addDays(diff);
  }
  const isoMatch = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1]!, 10);
    const m = Math.min(12, Math.max(1, parseInt(isoMatch[2]!, 10)));
    const maxD = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const d = Math.min(maxD, Math.max(1, parseInt(isoMatch[3]!, 10)));
    return { year: y, month: m, day: d };
  }
  const dmySlashMatch = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmySlashMatch) {
    const y = parseInt(dmySlashMatch[3]!, 10);
    const p1 = parseInt(dmySlashMatch[1]!, 10);
    const p2 = parseInt(dmySlashMatch[2]!, 10);
    const m = p2 <= 12 ? Math.max(1, p2) : Math.min(12, Math.max(1, p1));
    const rawD = p2 <= 12 ? p1 : p2;
    const maxD = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return { year: y, month: m, day: Math.min(maxD, Math.max(1, rawD)) };
  }
  const namedMatch = text.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (namedMatch) {
    const mNum = ID_MONTH_MAP[namedMatch[1]!.slice(0, 3).toLowerCase()];
    if (mNum) {
      const y = parseInt(namedMatch[3]!, 10);
      const maxD = new Date(Date.UTC(y, mNum, 0)).getUTCDate();
      const d = Math.min(maxD, Math.max(1, parseInt(namedMatch[2]!, 10)));
      return { year: y, month: mNum, day: d };
    }
  }
  const dmyNamedMatch = text.match(/^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/);
  if (dmyNamedMatch) {
    const mNum = ID_MONTH_MAP[dmyNamedMatch[2]!.slice(0, 3).toLowerCase()];
    if (mNum) {
      const y = parseInt(dmyNamedMatch[3]!, 10);
      const maxD = new Date(Date.UTC(y, mNum, 0)).getUTCDate();
      const d = Math.min(maxD, Math.max(1, parseInt(dmyNamedMatch[1]!, 10)));
      return { year: y, month: mNum, day: d };
    }
  }
  return null;
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
