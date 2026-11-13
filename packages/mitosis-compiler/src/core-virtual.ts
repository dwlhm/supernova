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
  const virtualItems = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => {
    const index = startIndex + i;
    return { index, start: index * itemHeight, size: itemHeight };
  });
  return {
    startIndex,
    endIndex,
    virtualItems,
    paddingTop: startIndex * itemHeight,
    paddingBottom: Math.max(0, (totalItems - endIndex) * itemHeight),
    totalHeight,
  };
}
