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
