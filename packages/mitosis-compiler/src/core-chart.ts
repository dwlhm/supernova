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

export interface ChartTooltipContext {
  label: string;
  value: number;
  seriesIndex?: number;
  total?: number;
  percentage?: number;
  x?: number;
  y?: number;
  kind?: string;
}

export interface ChartPt {
  label: string;
  value?: number;
  values?: number[];
  tooltip?: string | ((ctx: ChartTooltipContext) => string);
}

export interface ChartScatterPt {
  label?: string;
  x: number;
  y: number;
  series?: number;
  tooltip?: string | ((ctx: ChartTooltipContext) => string);
}

export interface ChartWaterfallPt {
  label: string;
  value: number;
  isTotal?: boolean;
  tooltip?: string | ((ctx: ChartTooltipContext) => string);
}

function resolveChartTooltip(
  itemTooltip: string | ((ctx: ChartTooltipContext) => string) | undefined,
  formatTooltip: ((ctx: ChartTooltipContext) => string) | undefined,
  ctx: ChartTooltipContext,
  fallback: string
): string {
  if (typeof itemTooltip === 'function') return itemTooltip(ctx);
  if (itemTooltip) return itemTooltip;
  if (typeof formatTooltip === 'function') return formatTooltip(ctx);
  return fallback;
}

const SERIES_BG = ['bg-chart-series-1', 'bg-chart-series-2', 'bg-chart-series-3', 'bg-chart-series-4', 'bg-chart-series-5'];
const SERIES_STROKE = ['stroke-chart-series-1', 'stroke-chart-series-2', 'stroke-chart-series-3', 'stroke-chart-series-4', 'stroke-chart-series-5'];
const SERIES_FILL = ['fill-chart-series-1', 'fill-chart-series-2', 'fill-chart-series-3', 'fill-chart-series-4', 'fill-chart-series-5'];

export function getChartBarState(
  data?: ChartPt[],
  defaultColorClass = 'bg-chart-series-1',
  stacked = false,
  maxScale?: number,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rawRows = data || [];
  let max = 0;
  let total = 0;

  for (const r of rawRows) {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    let rowSum = 0;
    for (const v of vals) {
      if (v > max) max = v;
      if (v > 0) rowSum += v;
      total += v;
    }
    if (stacked && rowSum > max) max = rowSum;
  }

  const scaleMax = maxScale && maxScale > 0 ? maxScale : max;
  const toPct = (val: number) => (scaleMax <= 0 || val < 0 ? '0%' : `${Math.min(100, (val / scaleMax) * 100)}%`);
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));

  const rows = rawRows.map((r, rIdx) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const rowSum = vals.reduce((acc, v) => acc + (v > 0 ? v : 0), 0);
    const primaryVal = stacked ? rowSum : (vals[0] ?? 0);
    const bars = vals.map((v, sIdx) => ({
      key: `${r.label || rIdx}-bar-${sIdx}`,
      value: v,
      displayValue: fmtVal(v),
      height: toPct(v),
      seriesIndex: sIdx,
      colorClass: sIdx === 0 && defaultColorClass ? defaultColorClass : SERIES_BG[sIdx % SERIES_BG.length]!,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: v, seriesIndex: sIdx, total: rowSum },
        vals.length > 1 ? `${r.label} • Series ${sIdx + 1}: ${fmtVal(v)} (Total: ${fmtVal(rowSum)})` : `${r.label}: ${fmtVal(v)}`
      ),
    }));
    return {
      key: `bar-row-${rIdx}`,
      label: r.label,
      value: primaryVal,
      displayValue: fmtVal(primaryVal),
      height: toPct(primaryVal),
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: primaryVal, total: rowSum },
        vals.length > 1
          ? `${r.label}: ${vals.map((v, i) => `S${i + 1} ${fmtVal(v)}`).join(' • ')} (Total: ${fmtVal(rowSum)})`
          : `${r.label}: ${fmtVal(vals[0] ?? 0)}`
      ),
      bars,
    };
  });

  return {
    rows,
    max,
    total,
    barHeight: (val: number) => toPct(val),
  };
}

export function getChartLineState(
  data?: ChartPt[],
  defaultStroke = 'stroke-chart-series-1',
  defaultFill = 'fill-chart-series-1',
  maxScale?: number,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
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
  const scaleMax = maxScale && maxScale > 0 ? maxScale : (max > 0 ? max : 1);
  if (max <= 0) max = 1;
  const count = rawRows.length;
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));

  const lines = Array.from({ length: maxSeriesCount }, (_, sIdx) => {
    const pts = rawRows.map((r, i) => {
      const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
      const val = vals[sIdx] ?? (sIdx === 0 ? vals[0] ?? 0 : 0);
      const x = count > 1 ? (i / (count - 1)) * 100 : 50;
      const y = 100 - Math.min(100, Math.max(0, (val / scaleMax) * 100));
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
    const y = 100 - Math.min(100, Math.max(0, (primaryVal / scaleMax) * 100));
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
      displayValue: fmtVal(primaryVal),
      x,
      y,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: primaryVal, total },
        vals.length > 1
          ? `${r.label}: ${vals.map((v, idx) => `S${idx + 1} ${fmtVal(v)}`).join(' • ')}`
          : `${r.label}: ${fmtVal(primaryVal)}`
      ),
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

export function getChartPieState(
  data?: ChartPt[],
  innerRadius = 0,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rows = data || [];
  const ringRadius = innerRadius > 0 && innerRadius < 50 ? (50 + innerRadius) / 2 : 25;
  const ringWidth = innerRadius > 0 && innerRadius < 50 ? 50 - innerRadius : 50;
  const circumference = 2 * Math.PI * ringRadius;
  const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0);
  const hotspotRadius = innerRadius > 0 && innerRadius < 50 ? ringRadius : 28;
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));
  let running = 0;
  const slices = rows.map((r, i) => {
    const val = r.value ?? 0;
    const fraction = total > 0 ? val / total : 0;
    const len = fraction * circumference;
    const offset = -running * circumference;
    const midFraction = running + fraction / 2;
    running += fraction;
    const angle = midFraction * 2 * Math.PI - Math.PI / 2;
    const pct = total > 0 ? Math.round(fraction * 100) : 0;
    const hx = 50 + hotspotRadius * Math.cos(angle);
    const hy = 50 + hotspotRadius * Math.sin(angle);
    return {
      key: `slice-${i}`,
      label: r.label,
      value: val,
      displayValue: fmtVal(val),
      fraction,
      percentage: pct,
      dashArray: `${len} ${circumference - len}`,
      dashOffset: String(offset),
      seriesIndex: i % 5,
      left: `${hx.toFixed(1)}%`,
      top: `${hy.toFixed(1)}%`,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: val, total, percentage: pct, seriesIndex: i },
        `${r.label}: ${fmtVal(val)} (${pct}%)`
      ),
    };
  });
  return { ringRadius, ringWidth, slices, total, displayTotal: fmtVal(total) };
}

export function getChartHorizontalBarState(
  data?: ChartPt[],
  defaultColorClass = 'bg-chart-series-1',
  maxScale = 100,
  valueSuffix = '%',
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rawRows = data || [];
  let max = 0;
  let total = 0;
  for (const r of rawRows) {
    const v = r.value ?? (r.values && r.values[0]) ?? 0;
    if (v > max) max = v;
    total += v;
  }
  const scaleMax = maxScale > 0 ? Math.max(max, maxScale) : (max > 0 ? max : 100);
  const rows = rawRows.map((r, idx) => {
    const val = r.value ?? (r.values && r.values[0]) ?? 0;
    const pct = scaleMax <= 0 || val <= 0 ? 0 : Math.min(100, Math.round((val / scaleMax) * 100));
    const sharePct = total <= 0 || val <= 0 ? 0 : Math.max(2, Math.round((val / total) * 100));
    const displayValue = typeof formatValue === 'function' ? formatValue(val) : `${val}${valueSuffix}`;
    return {
      key: `hbar-${idx}`,
      label: r.label,
      value: val,
      displayValue,
      width: `${pct}%`,
      shareWidth: `${sharePct}%`,
      colorClass: defaultColorClass || SERIES_BG[idx % SERIES_BG.length]!,
      seriesColorClass: SERIES_BG[idx % SERIES_BG.length]!,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: val, total, percentage: pct, seriesIndex: idx },
        `${r.label}: ${displayValue}`
      ),
    };
  });
  return { rows, max, total };
}

export function getChartScatterState(
  data?: ChartScatterPt[],
  maxX = 100,
  maxY = 100,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const raw = data || [];
  const safeMaxX = maxX > 0 ? maxX : 100;
  const safeMaxY = maxY > 0 ? maxY : 100;
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));
  const points = raw.map((p, idx) => {
    const sIdx = (p.series ?? 0) % SERIES_BG.length;
    const xPct = Math.min(100, Math.max(0, (p.x / safeMaxX) * 100));
    const yPct = 100 - Math.min(100, Math.max(0, (p.y / safeMaxY) * 100));
    const lbl = p.label || `(${fmtVal(p.x)}, ${fmtVal(p.y)})`;
    return {
      key: `scatter-${idx}`,
      label: lbl,
      x: p.x,
      y: p.y,
      left: `${xPct.toFixed(1)}%`,
      top: `${yPct.toFixed(1)}%`,
      seriesIndex: sIdx,
      colorClass: SERIES_BG[sIdx]!,
      tooltipText: resolveChartTooltip(
        p.tooltip,
        formatTooltip,
        { label: lbl, value: p.y, x: p.x, y: p.y, seriesIndex: sIdx },
        `${p.label ? `${p.label}: ` : `Series ${sIdx + 1}: `}(${fmtVal(p.x)}, ${fmtVal(p.y)})`
      ),
    };
  });
  return { points, maxX: safeMaxX, maxY: safeMaxY };
}

export function getChartRadarState(
  data?: ChartPt[],
  rings = 3,
  maxScale = 100,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rows = data || [];
  const n = rows.length;
  if (n < 3) {
    return {
      ringPolygons: [] as Array<{ key: string; points: string }>,
      spokes: [] as Array<{ key: string; x1: number; y1: number; x2: number; y2: number }>,
      axes: [] as Array<{ key: string; label: string; x: number; y: number }>,
      hotspots: [] as Array<{ key: string; left: string; top: string; tooltipText: string }>,
      series: [] as Array<{
        key: string;
        points: string;
        strokeClass: string;
        fillClass: string;
        dots: Array<{ key: string; cx: number; cy: number; fillClass: string }>;
      }>,
    };
  }
  const cx = 100;
  const cy = 100;
  const rMax = 62;
  const rLabel = 82;
  const safeRings = Math.max(1, rings || 3);
  const safeMax = maxScale > 0 ? maxScale : 100;

  let maxSeriesCount = 1;
  for (const r of rows) {
    if (r.values && r.values.length > maxSeriesCount) maxSeriesCount = r.values.length;
  }

  const angleAt = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;

  const ringPolygons = Array.from({ length: safeRings }, (_, rIdx) => {
    const radius = (rMax * (rIdx + 1)) / safeRings;
    const pts = rows
      .map((_, i) => {
        const a = angleAt(i);
        return `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`;
      })
      .join(' ');
    return { key: `ring-${rIdx}`, points: pts };
  });

  const spokes = rows.map((_, i) => {
    const a = angleAt(i);
    return {
      key: `spoke-${i}`,
      x1: cx,
      y1: cy,
      x2: Number((cx + rMax * Math.cos(a)).toFixed(1)),
      y2: Number((cy + rMax * Math.sin(a)).toFixed(1)),
    };
  });

  const axes = rows.map((r, i) => {
    const a = angleAt(i);
    return {
      key: `axis-${i}`,
      label: r.label,
      x: Number((cx + rLabel * Math.cos(a)).toFixed(1)),
      y: Number((cy + rLabel * Math.sin(a)).toFixed(1)),
    };
  });

  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));
  const hotspots = rows.map((r, i) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const primaryVal = vals[0] ?? 0;
    const ratio = Math.min(1, Math.max(0, primaryVal / safeMax));
    const a = angleAt(i);
    const hx = cx + rMax * ratio * Math.cos(a);
    const hy = cy + rMax * ratio * Math.sin(a);
    return {
      key: `radar-hotspot-${i}`,
      left: `${(hx / 2).toFixed(1)}%`,
      top: `${(hy / 2).toFixed(1)}%`,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: primaryVal, percentage: Math.round(ratio * 100) },
        vals.length > 1
          ? `${r.label}: ${vals.map((v, idx) => `S${idx + 1} ${fmtVal(v)}`).join(' • ')}`
          : `${r.label}: ${fmtVal(primaryVal)}`
      ),
    };
  });

  const series = Array.from({ length: maxSeriesCount }, (_, sIdx) => {
    const strokeClass = SERIES_STROKE[sIdx % SERIES_STROKE.length]!;
    const fillClass = SERIES_FILL[sIdx % SERIES_FILL.length]!;
    const dots = rows.map((r, i) => {
      const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
      const val = vals[sIdx] ?? 0;
      const ratio = Math.min(1, Math.max(0, val / safeMax));
      const a = angleAt(i);
      return {
        key: `radar-dot-${sIdx}-${i}`,
        cx: Number((cx + rMax * ratio * Math.cos(a)).toFixed(1)),
        cy: Number((cy + rMax * ratio * Math.sin(a)).toFixed(1)),
        fillClass,
      };
    });
    const points = dots.map((d) => `${d.cx},${d.cy}`).join(' ');
    return { key: `radar-series-${sIdx}`, points, strokeClass, fillClass, dots };
  });

  return { ringPolygons, spokes, axes, hotspots, series };
}

export function getChartGaugeState(
  value = 0,
  min = 0,
  max = 100,
  customTooltip?: string | ((ctx: ChartTooltipContext) => string),
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const num = Number(value);
  const safeVal = Number.isFinite(num) ? num : 0;
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : 100;
  const span = safeMax - safeMin;
  const rawPct = span > 0 ? ((safeVal - safeMin) / span) * 100 : 0;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPct)));
  const radius = 44;
  const arcLen = Math.PI * radius;
  const filledLen = (percentage / 100) * arcLen;
  const displayValue = typeof formatValue === 'function' ? formatValue(percentage) : `${percentage}%`;
  const tooltipText = resolveChartTooltip(
    customTooltip,
    formatTooltip,
    { label: 'Gauge', value: safeVal, total: safeMax, percentage },
    `${safeVal} / ${safeMax} (${percentage}%)`
  );
  return {
    percentage,
    arcPath: 'M 16 58 A 44 44 0 0 1 104 58',
    dashArray: `${filledLen.toFixed(2)} ${arcLen.toFixed(2)}`,
    displayValue,
    minLabel: String(safeMin),
    maxLabel: String(safeMax),
    tooltipText,
  };
}

export function getChartFunnelState(
  data?: ChartPt[],
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const raw = data || [];
  let max = 0;
  let total = 0;
  for (const r of raw) {
    const v = r.value ?? (r.values && r.values[0]) ?? 0;
    if (v > max) max = v;
    total += v;
  }
  const steps = raw.map((r, idx) => {
    const val = r.value ?? (r.values && r.values[0]) ?? 0;
    const pct = max <= 0 || val <= 0 ? 0 : Math.max(6, Math.min(100, Math.round((val / max) * 100)));
    const displayValue = typeof formatValue === 'function' ? formatValue(val) : val.toLocaleString('en-US');
    return {
      key: `funnel-${idx}`,
      label: r.label,
      value: val,
      displayValue,
      width: `${pct}%`,
      colorClass: SERIES_BG[idx % SERIES_BG.length]!,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: val, total, percentage: pct, seriesIndex: idx },
        `${r.label}: ${displayValue} (${pct}%)`
      ),
    };
  });
  return { steps, max, total };
}

export function getChartWaterfallState(
  data?: ChartWaterfallPt[],
  maxScale?: number,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const raw = data || [];
  let running = 0;
  let maxPeak = 0;

  const computed = raw.map((item, idx) => {
    const val = item.value ?? 0;
    let start = 0;
    let end = val;
    if (idx === 0) {
      start = 0;
      end = val;
      running = val;
    } else if (item.isTotal) {
      start = 0;
      end = val !== 0 ? val : running;
      running = end;
    } else {
      start = running;
      end = running + val;
      running = end;
    }
    const peak = Math.max(Math.abs(start), Math.abs(end));
    if (peak > maxPeak) maxPeak = peak;
    const kind = idx === 0 || item.isTotal ? 'total' : val >= 0 ? 'positive' : 'negative';
    const colorClass =
      kind === 'total'
        ? 'bg-chart-series-1'
        : kind === 'positive'
          ? 'bg-chart-series-2'
          : 'bg-chart-series-4';
    return { item, idx, val, start, end, kind, colorClass };
  });

  const scaleMax = maxScale && maxScale > 0 ? maxScale : Math.max(1, maxPeak);

  const bars = computed.map(({ item, idx, val, start, end, kind, colorClass }) => {
    const low = Math.max(0, Math.min(start, end));
    const span = Math.abs(end - start);
    const bottomPct = Math.min(100, Math.max(0, (low / scaleMax) * 100));
    const heightPct = scaleMax <= 0 || span <= 0 ? 0 : Math.min(100 - bottomPct, Math.max(3, (span / scaleMax) * 100));
    const rawDisp = kind === 'total' ? end : val;
    const displayValue =
      typeof formatValue === 'function'
        ? formatValue(rawDisp)
        : kind === 'total'
          ? String(end)
          : val >= 0
            ? `+${val}`
            : String(val);
    return {
      key: `wf-${idx}`,
      label: item.label,
      value: val,
      displayValue,
      bottom: `${bottomPct.toFixed(1)}%`,
      height: `${heightPct.toFixed(1)}%`,
      kind,
      colorClass,
      tooltipText: resolveChartTooltip(
        item.tooltip,
        formatTooltip,
        { label: item.label, value: rawDisp, total: end, kind },
        kind === 'total' ? `${item.label}: ${displayValue}` : `${item.label}: ${displayValue} (Total: ${end})`
      ),
    };
  });

  return { bars, max: scaleMax, netTotal: running };
}
