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
