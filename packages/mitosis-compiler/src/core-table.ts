import { filterByCriteria, retainValidIds } from './core-collection.js';

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

export interface SelectionState {
  checked: boolean;
  indeterminate: boolean;
  count: number;
}

export function getSelectionState(ids: string[], selected: string[]): SelectionState {
  const picked = new Set(selected || []);
  const visible = Array.from(new Set(ids || []));
  const count = visible.filter((id) => picked.has(id)).length;
  const checked = visible.length > 0 && count === visible.length;
  return { checked, indeterminate: count > 0 && !checked, count };
}

export function toggleSelection(selected: string[], ids: string[], checked: boolean): string[] {
  const next = new Set(selected || []);
  for (const id of ids || []) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  return Array.from(next);
}

export type TableSortDirection = 'asc' | 'desc' | 'none';

export interface TableControllerOptions<T extends Record<string, any>> {
  rows?: T[];
  data?: T[];
  getRowId?: (row: T, index: number) => string;
  searchKeys?: Array<keyof T>;
  initialQuery?: string;
  initialFilters?: Record<string, string>;
  filterFn?: (row: T) => boolean;
  initialSortKey?: keyof T | string;
  initialSortDirection?: TableSortDirection;
  initialPage?: number;
  initialPageSize?: number;
  initialSelectedIds?: string[];
}

export function createTableController<T extends Record<string, any>>(options: TableControllerOptions<T>) {
  const initialList = options.rows ?? options.data;
  let sourceRows = Array.isArray(initialList) ? [...initialList] : [];
  let query = options.initialQuery ?? '';
  let filters: Record<string, string> = { ...(options.initialFilters || {}) };
  let sortKey = options.initialSortKey ? String(options.initialSortKey) : '';
  let sortDirection: TableSortDirection = options.initialSortDirection ?? 'none';
  let page = options.initialPage ?? 1;
  let pageSize = options.initialPageSize ?? 10;
  let selectedIds = Array.isArray(options.initialSelectedIds) ? [...options.initialSelectedIds] : [];
  const resolveRowId = options.getRowId ?? ((row: T, idx: number) => (row.id !== undefined ? String(row.id) : String(idx)));
  const listeners = new Set<() => void>();
  const notify = () => { for (const fn of listeners) fn(); };

  const computeSnapshot = () => {
    const step1 = filterByCriteria(sourceRows, filters);
    const step2 = options.filterFn ? step1.filter(options.filterFn) : step1;
    const filteredRows = filterTableRows(step2, query, options.searchKeys);
    const sortedRows =
      sortKey && (sortDirection === 'asc' || sortDirection === 'desc')
        ? sortTableRows(filteredRows, sortKey, sortDirection)
        : filteredRows;
    const paged = paginateTableRows(sortedRows, page, pageSize);
    const visibleIds = paged.data.map((r, i) => resolveRowId(r, (paged.currentPage - 1) * pageSize + i));
    const selectionState = getSelectionState(visibleIds, selectedIds);
    return {
      rows: paged.data, allRows: sourceRows, filteredRows, sortedRows, visibleRows: paged.data, visibleIds,
      query, filters: { ...filters }, sortKey, sortDirection,
      page: paged.currentPage, currentPage: paged.currentPage, pageSize,
      totalPages: paged.totalPages, totalItems: paged.totalItems, hasNext: paged.hasNext, hasPrev: paged.hasPrev,
      selectedIds: [...selectedIds], selectionState, isEmpty: paged.data.length === 0,
    };
  };

  const setQuery = (nextQuery: string) => { query = nextQuery ?? ''; page = 1; notify(); };
  const setFilter = (key: keyof T | string, value: string) => {
    const k = String(key);
    if (!value || value === 'all') delete filters[k];
    else filters[k] = value;
    page = 1; notify();
  };
  const clearFilters = () => { filters = {}; page = 1; notify(); };

  const toggleSort = (key: keyof T | string) => {
    const k = String(key);
    if (sortKey !== k) { sortKey = k; sortDirection = 'asc'; }
    else if (sortDirection === 'asc') sortDirection = 'desc';
    else if (sortDirection === 'desc') { sortDirection = 'none'; sortKey = ''; }
    else sortDirection = 'asc';
    page = 1; notify();
  };

  const setSort = (key: keyof T | string, direction: TableSortDirection) => {
    sortKey = direction === 'none' ? '' : String(key);
    sortDirection = direction; page = 1; notify();
  };

  const setPage = (nextPage: number) => { page = Math.max(1, nextPage || 1); notify(); };
  const setPageSize = (nextSize: number) => { pageSize = Math.max(1, nextSize || 10); page = 1; notify(); };
  const toggleRow = (id: string, checked?: boolean) => {
    const nextChecked = checked !== undefined ? checked : !selectedIds.includes(id);
    selectedIds = toggleSelection(selectedIds, [id], nextChecked); notify();
  };
  const toggleAllVisible = (checked: boolean) => {
    selectedIds = toggleSelection(selectedIds, computeSnapshot().visibleIds, checked); notify();
  };
  const clearSelection = () => { selectedIds = []; notify(); };
  const setRows = (nextRows: T[]) => {
    sourceRows = Array.isArray(nextRows) ? [...nextRows] : [];
    const allValidIds = sourceRows.map((r, i) => resolveRowId(r, i));
    selectedIds = retainValidIds(allValidIds, selectedIds);
    notify();
  };

  const reset = () => {
    query = options.initialQuery ?? '';
    filters = { ...(options.initialFilters || {}) };
    sortKey = options.initialSortKey ? String(options.initialSortKey) : '';
    sortDirection = options.initialSortDirection ?? 'none';
    page = options.initialPage ?? 1;
    pageSize = options.initialPageSize ?? 10;
    selectedIds = Array.isArray(options.initialSelectedIds) ? [...options.initialSelectedIds] : [];
    notify();
  };

  return {
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getState: computeSnapshot, setRows, setQuery, setFilter, clearFilters, toggleSort, setSort,
    setPage, setPageSize, toggleRow, toggleAllVisible, clearSelection, reset,
    bindSearch: () => ({ value: query, onValueChange: (q: string) => setQuery(q) }),
    bindHeaderSort: (key: keyof T | string) => {
      const k = String(key);
      const dir: TableSortDirection = sortKey === k ? sortDirection : 'none';
      return { sortable: true, sortDirection: dir, onSort: () => toggleSort(k) };
    },
    bindHeaderCheckbox: () => {
      const snap = computeSnapshot();
      return { checked: snap.selectionState.checked, indeterminate: snap.selectionState.indeterminate, onCheckedChange: (checked: boolean) => toggleAllVisible(checked) };
    },
    bindRow: (id: string) => ({ selected: selectedIds.includes(id) }),
    bindRowCheckbox: (id: string) => ({ checked: selectedIds.includes(id), onCheckedChange: (checked: boolean) => toggleRow(id, checked) }),
    bindPagination: () => {
      const snap = computeSnapshot();
      return { currentPage: snap.page, totalPages: snap.totalPages, onPageChange: (nextPage: number) => setPage(nextPage) };
    },
  };
}
