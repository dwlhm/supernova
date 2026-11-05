import { formatDateDisplay, shiftYearMonth } from './core-date.js';

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
