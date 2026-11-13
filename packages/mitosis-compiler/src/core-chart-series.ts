export function muteSeriesValues<T extends { values?: number[]; value?: number }>(
  data: ReadonlyArray<T>,
  mutedIndices: ReadonlyArray<number>
): T[] {
  const list = data || [];
  const muted = mutedIndices || [];
  if (muted.length === 0) {
    return list.map((d) => ({ ...d, ...(Array.isArray(d.values) ? { values: [...d.values] } : {}) }));
  }
  const mutedSet = new Set(muted);
  return list.map((item, itemIdx) => {
    if (Array.isArray(item.values)) {
      return { ...item, values: item.values.map((v, sIdx) => (mutedSet.has(sIdx) ? 0 : v)) };
    }
    if (typeof item.value === 'number') {
      return { ...item, value: mutedSet.has(itemIdx) ? 0 : item.value };
    }
    return { ...item };
  });
}

export function filterActiveSeries<T extends { series?: number }>(
  items: ReadonlyArray<T>,
  mutedIndices: ReadonlyArray<number>
): T[] {
  const list = items || [];
  const muted = mutedIndices || [];
  if (muted.length === 0) return [...list];
  const mutedSet = new Set(muted);
  return list.filter((item, idx) => !mutedSet.has(typeof item.series === 'number' ? item.series : idx));
}

export function computeNiceTicks(maxValue: number, count = 5): { max: number; ticks: number[] } {
  const safeCount = Math.max(2, Math.floor(count || 5));
  if (!Number.isFinite(maxValue) || maxValue <= 0) {
    const step = 100 / (safeCount - 1);
    return {
      max: 100,
      ticks: Array.from({ length: safeCount }, (_, i) => Number((100 - i * step).toFixed(4))),
    };
  }
  const rawStep = maxValue / (safeCount - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / mag;
  const niceMult = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 2.5 ? 2.5 : residual <= 5 ? 5 : 10;
  const step = niceMult * mag;
  const niceMax = Number((step * (safeCount - 1)).toPrecision(12));
  const ticks = Array.from({ length: safeCount }, (_, i) =>
    i === safeCount - 1 ? 0 : Number((niceMax - i * step).toPrecision(12))
  );
  return { max: niceMax, ticks };
}

export type ChartZoomRange = [number, number];

export function clampZoomRange(
  range: readonly [number, number] | undefined,
  totalCount: number,
  minSpan = 2
): ChartZoomRange {
  const total = Math.max(0, Math.floor(totalCount || 0));
  if (total === 0) return [0, 0];
  const safeMin = Math.min(total, Math.max(1, Math.floor(minSpan || 1)));
  if (!range || range.length < 2) return [0, total];
  const rawStart = Number.isFinite(range[0]) ? Math.floor(range[0]) : 0;
  const rawEnd = Number.isFinite(range[1]) ? Math.floor(range[1]) : total;
  let start = Math.max(0, Math.min(rawStart, rawEnd));
  let end = Math.min(total, Math.max(rawStart, rawEnd));
  if (end - start < safeMin) {
    const center = Math.round((start + end) / 2);
    start = Math.max(0, Math.min(total - safeMin, center - Math.floor(safeMin / 2)));
    end = Math.min(total, start + safeMin);
  }
  return [start, end];
}

export function zoomRangeAt(
  range: readonly [number, number] | undefined,
  factor: number,
  anchorRatio = 0.5,
  totalCount = 0,
  minSpan = 2
): ChartZoomRange {
  const total = Math.max(0, Math.floor(totalCount || 0));
  if (total === 0) return [0, 0];
  const safeMin = Math.min(total, Math.max(1, Math.floor(minSpan || 1)));
  const [curStart, curEnd] = clampZoomRange(range, total, safeMin);
  const curSpan = curEnd - curStart;
  const safeFactor = Number.isFinite(factor) && factor > 0 ? factor : 1;
  let nextSpan = Math.round(curSpan * safeFactor);
  if (safeFactor < 1 && nextSpan >= curSpan && curSpan > safeMin) nextSpan = curSpan - 1;
  if (safeFactor > 1 && nextSpan <= curSpan && curSpan < total) nextSpan = curSpan + 1;
  nextSpan = Math.max(safeMin, Math.min(total, nextSpan));
  const ratio = Number.isFinite(anchorRatio) ? Math.max(0, Math.min(1, anchorRatio)) : 0.5;
  const anchor = curStart + curSpan * ratio;
  let nextStart = Math.round(anchor - nextSpan * ratio);
  nextStart = Math.max(0, Math.min(total - nextSpan, nextStart));
  return [nextStart, nextStart + nextSpan];
}

export function panZoomRange(
  range: readonly [number, number] | undefined,
  deltaItems: number,
  totalCount: number,
  minSpan = 2
): ChartZoomRange {
  const total = Math.max(0, Math.floor(totalCount || 0));
  if (total === 0) return [0, 0];
  const [curStart, curEnd] = clampZoomRange(range, total, minSpan);
  const span = curEnd - curStart;
  const shift = Number.isFinite(deltaItems) ? Math.round(deltaItems) : 0;
  const nextStart = Math.max(0, Math.min(total - span, curStart + shift));
  return [nextStart, nextStart + span];
}

export function sliceChartWindow<T>(
  data?: ReadonlyArray<T>,
  range?: readonly [number, number]
): T[] {
  const list = data || [];
  if (!range || range.length < 2 || list.length === 0) return [...list];
  const [start, end] = clampZoomRange(range, list.length, 1);
  return list.slice(start, end);
}

export function getNearestPointIndex(ratio: number, count: number): number {
  const total = Math.floor(count || 0);
  if (total <= 0) return -1;
  if (total === 1) return 0;
  const safeRatio = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
  return Math.round(safeRatio * (total - 1));
}

export interface ChartTooltipAnchor {
  open: boolean;
  text: string;
  x: number;
  y: number;
  left: string;
  top: string;
}

export function getChartTooltipAnchor(
  text: string,
  target?: { getBoundingClientRect?: () => { left: number; top: number; width: number; height: number } } | null,
  container?: { getBoundingClientRect?: () => { left: number; top: number; width: number; height: number } } | null,
  offset = 8
): ChartTooltipAnchor {
  if (!target?.getBoundingClientRect || !container?.getBoundingClientRect) {
    return { open: false, text: '', x: 0, y: 0, left: '0px', top: '0px' };
  }
  const tRect = target.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const x = Math.round(tRect.left - cRect.left + tRect.width / 2);
  const y = Math.round(tRect.top - cRect.top - offset);
  return { open: true, text, x, y, left: `${x}px`, top: `${y}px` };
}

export function getSvgTooltipAnchor(
  text: string,
  cx: number,
  cy: number,
  viewWidth: number,
  viewHeight: number,
  offsetPx = 10
): ChartTooltipAnchor {
  const safeW = viewWidth > 0 ? viewWidth : 100;
  const safeH = viewHeight > 0 ? viewHeight : 100;
  const xPct = Number(((cx / safeW) * 100).toFixed(2));
  const yPct = Number(((cy / safeH) * 100).toFixed(2));
  return {
    open: true,
    text,
    x: cx,
    y: cy,
    left: `${xPct}%`,
    top: offsetPx ? `calc(${yPct}% - ${offsetPx}px)` : `${yPct}%`,
  };
}
