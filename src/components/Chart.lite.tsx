import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export type ChartType =
  | 'Bar'
  | 'Line'
  | 'Area'
  | 'Donut'
  | 'Pie'
  | 'Stacked Bar'
  | 'Horizontal Bar'
  | 'Scatter'
  | 'Radar'
  | 'Gauge'
  | 'Funnel'
  | 'Waterfall';

export interface ChartDataPoint {
  label: string;
  value: number;
  values?: number[];
}

export interface ChartDataRow {
  id: string;
  label: string;
  valueLabel: string;
}

export interface ChartLegendItem {
  id: string;
  label: string;
  dotClass: string;
}

export interface ChartTick {
  id: string;
  y: number;
  label: string;
}

export interface ChartTextMark {
  id: string;
  x: number;
  y: number;
  label: string;
  anchor: string;
}

export interface ChartBarMark {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillClass: string;
  labelX: number;
  labelY: number;
  valueLabel: string;
}

export interface ChartDotMark {
  id: string;
  cx: number;
  cy: number;
  labelX: number;
  labelY: number;
  valueLabel: string;
}

export interface ChartLineMarks {
  linePath: string;
  areaPath: string;
  dots: ChartDotMark[];
}

export interface ChartSliceMark {
  id: string;
  path: string;
  fillClass: string;
  labelX: number;
  labelY: number;
  valueLabel: string;
}

export interface ChartShapeMark {
  id: string;
  points: string;
}

export interface ChartPolygonMark {
  id: string;
  points: string;
  fillClass: string;
  strokeClass: string;
}

export interface ChartAxisLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ChartGaugeMark {
  trackPath: string;
  valuePath: string;
  labelX: number;
  labelY: number;
  valueLabel: string;
  percentLabel: string;
}

export interface ChartProps {
  type?: ChartType;
  showTitle?: boolean;
  showDescription?: boolean;
  showLegend?: boolean;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  titleText?: string;
  descriptionText?: string;
  data?: ChartDataPoint[];
  seriesNames?: string[];
  maxValue?: number;
  customContent?: boolean;
  className?: string;
  children?: any;
}

export default function Chart(props: ChartProps) {
  useDefaultProps({
    type: 'Bar',
    showTitle: true,
    showDescription: true,
    showLegend: true,
    showGridLines: true,
    showDataLabels: true,
    titleText: 'Revenue Overview',
    descriptionText: 'Weekly revenue breakdown by day',
    data: [],
    seriesNames: [],
    customContent: false,
    className: '',
  });

  const state = useStore({
    get chartType() {
      return props.type || 'Bar';
    },
    get hasData() {
      return (props.data || []).length > 0;
    },
    get isVerticalCartesian() {
      const current = props.type || 'Bar';
      return (
        current === 'Bar' ||
        current === 'Line' ||
        current === 'Area' ||
        current === 'Stacked Bar' ||
        current === 'Scatter' ||
        current === 'Waterfall'
      );
    },
    get isPointBased() {
      const current = props.type || 'Bar';
      return current === 'Line' || current === 'Area' || current === 'Scatter';
    },
    get isBandBased() {
      const current = props.type || 'Bar';
      return current === 'Bar' || current === 'Stacked Bar' || current === 'Waterfall';
    },
    get dataRows() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      return (props.data || []).map((row, index) => ({
        id: 'data-row-' + index,
        label: row.label,
        valueLabel: format(Number.isFinite(row.value) ? row.value : 0),
      }));
    },
    get legendItems() {
      const seriesDot = [
        'bg-components-chart-all-color-series-1-fill-default',
        'bg-components-chart-all-color-series-2-fill-default',
        'bg-components-chart-all-color-series-3-fill-default',
        'bg-components-chart-all-color-series-4-fill-default',
        'bg-components-chart-all-color-series-5-fill-default',
      ];
      const current = props.type || 'Bar';
      const rows = props.data || [];
      const names = props.seriesNames || [];
      if (current === 'Pie' || current === 'Donut' || current === 'Funnel') {
        return rows.map((row, index) => ({
          id: 'legend-' + index,
          label: row.label,
          dotClass: seriesDot[index % seriesDot.length],
        }));
      }
      if (names.length > 0) {
        return names.map((name, index) => ({
          id: 'legend-' + index,
          label: name,
          dotClass: seriesDot[index % seriesDot.length],
        }));
      }
      return [];
    },
    get axisTicks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const numbers: number[] = [];
      rows.forEach((row) => {
        numbers.push(Number.isFinite(row.value) ? row.value : 0);
        (row.values || []).forEach((inner) => numbers.push(Number.isFinite(inner) ? inner : 0));
      });
      let min = 0;
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      numbers.forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      if (max === min) {
        max = min + 1;
      }
      const ticks: ChartTick[] = [];
      for (let index = 0; index <= 4; index = index + 1) {
        const value = min + ((max - min) * index) / 4;
        ticks.push({
          id: 'tick-' + index,
          y: Math.round((172 - ((value - min) / (max - min)) * 160) * 100) / 100,
          label: format(value),
        });
      }
      return ticks;
    },
    get horizontalTickLabels() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const numbers: number[] = [];
      rows.forEach((row) => numbers.push(Number.isFinite(row.value) ? row.value : 0));
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      numbers.forEach((number) => {
        if (number > max) {
          max = number;
        }
      });
      if (max <= 0) {
        max = 1;
      }
      const labels: ChartTextMark[] = [];
      for (let index = 0; index <= 4; index = index + 1) {
        labels.push({
          id: 'h-tick-' + index,
          x: Math.round((44 + (264 * index) / 4) * 100) / 100,
          y: 186,
          label: format((max * index) / 4),
          anchor: 'middle',
        });
      }
      return labels;
    },
    get horizontalGridLines() {
      const rows = props.data || [];
      const lines: ChartAxisLine[] = [];
      if (rows.length === 0) {
        return lines;
      }
      for (let index = 0; index <= 4; index = index + 1) {
        const x = Math.round((44 + (264 * index) / 4) * 100) / 100;
        lines.push({ id: 'h-grid-' + index, x1: x, y1: 12, x2: x, y2: 172 });
      }
      return lines;
    },
    get columnLabels() {
      const rows = props.data || [];
      const bandWidth = rows.length > 0 ? 264 / rows.length : 264;
      return rows.map((row, index) => ({
        id: 'column-' + index,
        x: Math.round((44 + bandWidth * index + bandWidth / 2) * 100) / 100,
        y: 186,
        label: row.label,
        anchor: 'middle',
      }));
    },
    get pointLabels() {
      const rows = props.data || [];
      const step = rows.length > 1 ? 264 / (rows.length - 1) : 0;
      return rows.map((row, index) => ({
        id: 'point-' + index,
        x: Math.round((rows.length > 1 ? 44 + step * index : 176) * 100) / 100,
        y: 186,
        label: row.label,
        anchor: 'middle',
      }));
    },
    get rowLabels() {
      const rows = props.data || [];
      const bandHeight = rows.length > 0 ? 160 / rows.length : 160;
      return rows.map((row, index) => ({
        id: 'row-label-' + index,
        x: 38,
        y: Math.round((12 + bandHeight * index + bandHeight / 2 + 3.5) * 100) / 100,
        label: row.label,
        anchor: 'end',
      }));
    },
    get barMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const numbers: number[] = [];
      rows.forEach((row) => numbers.push(Number.isFinite(row.value) ? row.value : 0));
      let min = 0;
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      numbers.forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      if (max === min) {
        max = min + 1;
      }
      const scaleY = (value: number) => 172 - ((value - min) / (max - min)) * 160;
      const zeroY = scaleY(0);
      const bandWidth = rows.length > 0 ? 264 / rows.length : 264;
      const barWidth = Math.max(2, bandWidth * 0.56);
      return rows.map((row, index) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        const valueY = scaleY(value);
        const top = Math.min(zeroY, valueY);
        const height = Math.max(1, Math.abs(valueY - zeroY));
        return {
          id: 'bar-' + index,
          x: Math.round((44 + bandWidth * index + (bandWidth - barWidth) / 2) * 100) / 100,
          y: Math.round(top * 100) / 100,
          width: Math.round(barWidth * 100) / 100,
          height: Math.round(height * 100) / 100,
          fillClass: 'fill-components-chart-all-color-series-1-fill-default',
          labelX: Math.round((44 + bandWidth * index + bandWidth / 2) * 100) / 100,
          labelY: Math.round((value >= 0 ? top - 6 : top + height + 12) * 100) / 100,
          valueLabel: format(value),
        };
      });
    },
    get stackedMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const seriesFill = [
        'fill-components-chart-all-color-series-1-fill-default',
        'fill-components-chart-all-color-series-2-fill-default',
        'fill-components-chart-all-color-series-3-fill-default',
        'fill-components-chart-all-color-series-4-fill-default',
        'fill-components-chart-all-color-series-5-fill-default',
      ];
      const rows = props.data || [];
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      rows.forEach((row) => {
        let total = Number.isFinite(row.value) ? row.value : 0;
        (row.values || []).forEach((inner) => {
          total = total + (Number.isFinite(inner) ? inner : 0);
        });
        if (total > max) {
          max = total;
        }
      });
      if (max <= 0) {
        max = 1;
      }
      const scaleY = (value: number) => 172 - (value / max) * 160;
      const bandWidth = rows.length > 0 ? 264 / rows.length : 264;
      const barWidth = Math.max(2, bandWidth * 0.56);
      const marks: ChartBarMark[] = [];
      rows.forEach((row, rowIndex) => {
        const segments: number[] = [Number.isFinite(row.value) ? row.value : 0];
        (row.values || []).forEach((inner) => segments.push(Number.isFinite(inner) ? inner : 0));
        let cursor = 0;
        segments.forEach((segment, segmentIndex) => {
          if (segment <= 0) {
            return;
          }
          const top = scaleY(cursor + segment);
          const height = Math.max(1, scaleY(cursor) - top);
          marks.push({
            id: 'stack-' + rowIndex + '-' + segmentIndex,
            x: Math.round((44 + bandWidth * rowIndex + (bandWidth - barWidth) / 2) * 100) / 100,
            y: Math.round(top * 100) / 100,
            width: Math.round(barWidth * 100) / 100,
            height: Math.round(height * 100) / 100,
            fillClass: seriesFill[segmentIndex % seriesFill.length],
            labelX: Math.round((44 + bandWidth * rowIndex + bandWidth / 2) * 100) / 100,
            labelY: Math.round((top - 5) * 100) / 100,
            valueLabel: format(segment),
          });
          cursor = cursor + segment;
        });
      });
      return marks;
    },
    get waterfallMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const starts: number[] = [];
      const ends: number[] = [];
      let cursor = 0;
      rows.forEach((row) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        starts.push(cursor);
        cursor = cursor + value;
        ends.push(cursor);
      });
      let min = 0;
      let max = 0;
      starts.concat(ends).forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      if (max === min) {
        max = min + 1;
      }
      const scaleY = (value: number) => 172 - ((value - min) / (max - min)) * 160;
      const bandWidth = rows.length > 0 ? 264 / rows.length : 264;
      const barWidth = Math.max(2, bandWidth * 0.56);
      return rows.map((row, index) => {
        const startY = scaleY(starts[index]);
        const endY = scaleY(ends[index]);
        const top = Math.min(startY, endY);
        const height = Math.max(1, Math.abs(endY - startY));
        const value = ends[index] - starts[index];
        return {
          id: 'waterfall-' + index,
          x: Math.round((44 + bandWidth * index + (bandWidth - barWidth) / 2) * 100) / 100,
          y: Math.round(top * 100) / 100,
          width: Math.round(barWidth * 100) / 100,
          height: Math.round(height * 100) / 100,
          fillClass:
            value >= 0
              ? 'fill-components-chart-all-color-series-2-fill-default'
              : 'fill-components-chart-all-color-series-5-fill-default',
          labelX: Math.round((44 + bandWidth * index + bandWidth / 2) * 100) / 100,
          labelY: Math.round((top - 6) * 100) / 100,
          valueLabel: format(value),
        };
      });
    },
    get waterfallConnectors() {
      const rows = props.data || [];
      const starts: number[] = [];
      const ends: number[] = [];
      let cursor = 0;
      rows.forEach((row) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        starts.push(cursor);
        cursor = cursor + value;
        ends.push(cursor);
      });
      let min = 0;
      let max = 0;
      starts.concat(ends).forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      if (max === min) {
        max = min + 1;
      }
      const scaleY = (value: number) => 172 - ((value - min) / (max - min)) * 160;
      const bandWidth = rows.length > 0 ? 264 / rows.length : 264;
      const lines: ChartAxisLine[] = [];
      for (let index = 0; index < rows.length - 1; index = index + 1) {
        const y = Math.round(scaleY(ends[index]) * 100) / 100;
        lines.push({
          id: 'waterfall-link-' + index,
          x1: Math.round((44 + bandWidth * index + bandWidth * 0.78) * 100) / 100,
          y1: y,
          x2: Math.round((44 + bandWidth * (index + 1) + bandWidth * 0.22) * 100) / 100,
          y2: y,
        });
      }
      return lines;
    },
    get lineMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const numbers: number[] = [];
      rows.forEach((row) => numbers.push(Number.isFinite(row.value) ? row.value : 0));
      let min = 0;
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      numbers.forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      if (max === min) {
        max = min + 1;
      }
      const scaleY = (value: number) => 172 - ((value - min) / (max - min)) * 160;
      const step = rows.length > 1 ? 264 / (rows.length - 1) : 0;
      const dots: ChartDotMark[] = rows.map((row, index) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        const cx = Math.round((rows.length > 1 ? 44 + step * index : 176) * 100) / 100;
        const cy = Math.round(scaleY(value) * 100) / 100;
        return {
          id: 'line-dot-' + index,
          cx,
          cy,
          labelX: cx,
          labelY: Math.round((cy - 8) * 100) / 100,
          valueLabel: format(value),
        };
      });
      let linePath = '';
      let areaPath = '';
      if (dots.length > 0) {
        linePath = dots.map((dot, index) => (index === 0 ? 'M ' : 'L ') + dot.cx + ' ' + dot.cy).join(' ');
        const zeroY = Math.round(scaleY(0) * 100) / 100;
        areaPath =
          'M ' +
          dots[0].cx +
          ' ' +
          zeroY +
          ' ' +
          dots.map((dot) => 'L ' + dot.cx + ' ' + dot.cy).join(' ') +
          ' L ' +
          dots[dots.length - 1].cx +
          ' ' +
          zeroY +
          ' Z';
      }
      return { linePath, areaPath, dots };
    },
    get scatterMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const numbers: number[] = [];
      rows.forEach((row) => numbers.push(Number.isFinite(row.value) ? row.value : 0));
      let min = 0;
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      numbers.forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      if (max === min) {
        max = min + 1;
      }
      const scaleY = (value: number) => 172 - ((value - min) / (max - min)) * 160;
      const bandWidth = rows.length > 0 ? 264 / rows.length : 264;
      return rows.map((row, index) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        const cx = Math.round((44 + bandWidth * index + bandWidth / 2) * 100) / 100;
        const cy = Math.round(scaleY(value) * 100) / 100;
        return {
          id: 'scatter-' + index,
          cx,
          cy,
          labelX: cx,
          labelY: Math.round((cy - 8) * 100) / 100,
          valueLabel: format(value),
        };
      });
    },
    get sliceMarks() {
      const round = (value: number) => Math.round(value * 100) / 100;
      const seriesFill = [
        'fill-components-chart-all-color-series-1-fill-default',
        'fill-components-chart-all-color-series-2-fill-default',
        'fill-components-chart-all-color-series-3-fill-default',
        'fill-components-chart-all-color-series-4-fill-default',
        'fill-components-chart-all-color-series-5-fill-default',
      ];
      const rows = props.data || [];
      const isDonut = (props.type || 'Bar') === 'Donut';
      const radius = 72;
      const innerRadius = isDonut ? 44 : 0;
      const centerX = 176;
      const centerY = 92;
      const values: number[] = rows.map((row) => (Number.isFinite(row.value) ? Math.max(0, row.value) : 0));
      const total = values.reduce((sum, value) => sum + value, 0);
      const marks: ChartSliceMark[] = [];
      if (total <= 0) {
        return marks;
      }
      let angle = -Math.PI / 2;
      values.forEach((value, index) => {
        const sweep = (value / total) * Math.PI * 2;
        const startAngle = angle;
        const endAngle = angle + sweep;
        angle = endAngle;
        const x1 = round(centerX + radius * Math.cos(startAngle));
        const y1 = round(centerY + radius * Math.sin(startAngle));
        const x2 = round(centerX + radius * Math.cos(endAngle));
        const y2 = round(centerY + radius * Math.sin(endAngle));
        const largeArc = sweep > Math.PI ? 1 : 0;
        let path = '';
        if (innerRadius > 0) {
          const innerX1 = round(centerX + innerRadius * Math.cos(endAngle));
          const innerY1 = round(centerY + innerRadius * Math.sin(endAngle));
          const innerX2 = round(centerX + innerRadius * Math.cos(startAngle));
          const innerY2 = round(centerY + innerRadius * Math.sin(startAngle));
          path =
            'M ' + x1 + ' ' + y1 + ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2 +
            ' L ' + innerX1 + ' ' + innerY1 + ' A ' + innerRadius + ' ' + innerRadius + ' 0 ' + largeArc + ' 0 ' + innerX2 + ' ' + innerY2 + ' Z';
        } else {
          path =
            'M ' + centerX + ' ' + centerY + ' L ' + x1 + ' ' + y1 + ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2 + ' Z';
        }
        const midAngle = startAngle + sweep / 2;
        const labelRadius = innerRadius > 0 ? (radius + innerRadius) / 2 : radius * 0.62;
        marks.push({
          id: 'slice-' + index,
          path,
          fillClass: seriesFill[index % seriesFill.length],
          labelX: round(centerX + labelRadius * Math.cos(midAngle)),
          labelY: round(centerY + labelRadius * Math.sin(midAngle) + 3.5),
          valueLabel: Math.round((value / total) * 100) + '%',
        });
      });
      return marks;
    },
    get donutTotalLabel() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const total = (props.data || []).reduce((sum, row) => sum + (Number.isFinite(row.value) ? Math.max(0, row.value) : 0), 0);
      return format(total);
    },
    get radarRings() {
      const rows = props.data || [];
      const axisCount = rows.length;
      const rings: ChartShapeMark[] = [];
      if (axisCount < 3) {
        return rings;
      }
      const centerX = 176;
      const centerY = 92;
      const radius = 70;
      for (let level = 1; level <= 4; level = level + 1) {
        const levelRadius = (radius * level) / 4;
        const points = rows
          .map((row, index) => {
            const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axisCount;
            return (
              Math.round((centerX + levelRadius * Math.cos(angle)) * 100) / 100 +
              ',' +
              Math.round((centerY + levelRadius * Math.sin(angle)) * 100) / 100
            );
          })
          .join(' ');
        rings.push({ id: 'radar-ring-' + level, points });
      }
      return rings;
    },
    get radarSpokes() {
      const rows = props.data || [];
      const axisCount = rows.length;
      const spokes: ChartAxisLine[] = [];
      if (axisCount < 3) {
        return spokes;
      }
      const centerX = 176;
      const centerY = 92;
      const radius = 70;
      rows.forEach((row, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axisCount;
        spokes.push({
          id: 'radar-spoke-' + index,
          x1: centerX,
          y1: centerY,
          x2: Math.round((centerX + radius * Math.cos(angle)) * 100) / 100,
          y2: Math.round((centerY + radius * Math.sin(angle)) * 100) / 100,
        });
      });
      return spokes;
    },
    get radarPolygons() {
      const fillClasses = [
        'fill-components-chart-all-color-series-1-fill-default',
        'fill-components-chart-all-color-series-2-fill-default',
        'fill-components-chart-all-color-series-3-fill-default',
        'fill-components-chart-all-color-series-4-fill-default',
        'fill-components-chart-all-color-series-5-fill-default',
      ];
      const strokeClasses = [
        'stroke-components-chart-all-color-series-1-fill-default',
        'stroke-components-chart-all-color-series-2-fill-default',
        'stroke-components-chart-all-color-series-3-fill-default',
        'stroke-components-chart-all-color-series-4-fill-default',
        'stroke-components-chart-all-color-series-5-fill-default',
      ];
      const rows = props.data || [];
      const axisCount = rows.length;
      const polygons: ChartPolygonMark[] = [];
      if (axisCount < 3) {
        return polygons;
      }
      const centerX = 176;
      const centerY = 92;
      const radius = 70;
      let seriesCount = 0;
      rows.forEach((row) => {
        const count = 1 + (row.values || []).length;
        if (count > seriesCount) {
          seriesCount = count;
        }
      });
      const seriesValues: number[][] = [];
      for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex = seriesIndex + 1) {
        const current: number[] = [];
        rows.forEach((row) => {
          if (seriesIndex === 0) {
            current.push(Number.isFinite(row.value) ? row.value : 0);
          } else {
            const extra = row.values || [];
            const raw = seriesIndex - 1 < extra.length ? extra[seriesIndex - 1] : 0;
            current.push(Number.isFinite(raw) ? raw : 0);
          }
        });
        seriesValues.push(current);
      }
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      seriesValues.forEach((series) =>
        series.forEach((value) => {
          if (value > max) {
            max = value;
          }
        })
      );
      if (max <= 0) {
        max = 1;
      }
      seriesValues.forEach((series, seriesIndex) => {
        const points = series
          .map((value, index) => {
            const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axisCount;
            const distance = (Math.max(0, value) / max) * radius;
            return (
              Math.round((centerX + distance * Math.cos(angle)) * 100) / 100 +
              ',' +
              Math.round((centerY + distance * Math.sin(angle)) * 100) / 100
            );
          })
          .join(' ');
        polygons.push({
          id: 'radar-series-' + seriesIndex,
          points,
          fillClass: fillClasses[seriesIndex % fillClasses.length],
          strokeClass: strokeClasses[seriesIndex % strokeClasses.length],
        });
      });
      return polygons;
    },
    get gaugeMark() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      const numbers: number[] = [];
      rows.forEach((row) => {
        numbers.push(Number.isFinite(row.value) ? row.value : 0);
        (row.values || []).forEach((inner) => numbers.push(Number.isFinite(inner) ? inner : 0));
      });
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      numbers.forEach((number) => {
        if (number > max) {
          max = number;
        }
      });
      if (max <= 0) {
        max = 1;
      }
      const value = rows.length > 0 && Number.isFinite(rows[0].value) ? rows[0].value : 0;
      const ratio = Math.min(1, Math.max(0, value / max));
      const centerX = 176;
      const centerY = 150;
      const radius = 86;
      const trackPath =
        'M ' + (centerX - radius) + ' ' + centerY + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (centerX + radius) + ' ' + centerY;
      const sweep = Math.PI * ratio;
      const valueEndX = Math.round((centerX + radius * Math.cos(Math.PI + sweep)) * 100) / 100;
      const valueEndY = Math.round((centerY + radius * Math.sin(Math.PI + sweep)) * 100) / 100;
      const valuePath =
        ratio <= 0
          ? ''
          : 'M ' + (centerX - radius) + ' ' + centerY + ' A ' + radius + ' ' + radius + ' 0 ' + (ratio > 0.5 ? 1 : 0) + ' 1 ' + valueEndX + ' ' + valueEndY;
      return {
        trackPath,
        valuePath,
        labelX: centerX,
        labelY: centerY - 14,
        valueLabel: format(value),
        percentLabel: Math.round(ratio * 100) + '%',
      };
    },
    get funnelMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const seriesFill = [
        'fill-components-chart-all-color-series-1-fill-default',
        'fill-components-chart-all-color-series-2-fill-default',
        'fill-components-chart-all-color-series-3-fill-default',
        'fill-components-chart-all-color-series-4-fill-default',
        'fill-components-chart-all-color-series-5-fill-default',
      ];
      const rows = props.data || [];
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      rows.forEach((row) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        if (value > max) {
          max = value;
        }
      });
      if (max <= 0) {
        max = 1;
      }
      const bandHeight = rows.length > 0 ? 160 / rows.length : 160;
      const height = Math.max(4, bandHeight * 0.68);
      return rows.map((row, index) => {
        const value = Number.isFinite(row.value) ? Math.max(0, row.value) : 0;
        const width = Math.max(6, (value / max) * 264);
        const y = Math.round((12 + bandHeight * index + (bandHeight - height) / 2) * 100) / 100;
        return {
          id: 'funnel-' + index,
          x: Math.round((44 + (264 - width) / 2) * 100) / 100,
          y,
          width: Math.round(width * 100) / 100,
          height: Math.round(height * 100) / 100,
          fillClass: seriesFill[index % seriesFill.length],
          labelX: 176,
          labelY: Math.round((y + height / 2 + 3.5) * 100) / 100,
          valueLabel: format(value),
        };
      });
    },
    get horizontalMarks() {
      const format = (value: number) =>
        Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(Math.round(value * 100) / 100);
      const rows = props.data || [];
      let max = typeof props.maxValue === 'number' && Number.isFinite(props.maxValue) ? props.maxValue : 0;
      rows.forEach((row) => {
        const value = Number.isFinite(row.value) ? row.value : 0;
        if (value > max) {
          max = value;
        }
      });
      if (max <= 0) {
        max = 1;
      }
      const bandHeight = rows.length > 0 ? 160 / rows.length : 160;
      const height = Math.max(4, bandHeight * 0.6);
      return rows.map((row, index) => {
        const value = Number.isFinite(row.value) ? Math.max(0, row.value) : 0;
        const width = Math.max(2, (value / max) * 264);
        const y = Math.round((12 + bandHeight * index + (bandHeight - height) / 2) * 100) / 100;
        return {
          id: 'horizontal-' + index,
          x: 44,
          y,
          width: Math.round(width * 100) / 100,
          height: Math.round(height * 100) / 100,
          fillClass: 'fill-components-chart-all-color-series-1-fill-default',
          labelX: Math.round((44 + width + 8) * 100) / 100,
          labelY: Math.round((y + height / 2 + 3.5) * 100) / 100,
          valueLabel: format(value),
        };
      });
    },
  });

  return (
    <figure
      class={cn(
        'flex w-full flex-col gap-4 rounded-lg border border-components-chart-all-color-container-border-default bg-components-chart-all-color-container-background-default px-5 py-5',
        props.className
      )}
    >
      <Show when={(props.showTitle && !!props.titleText) || (props.showDescription && !!props.descriptionText)}>
        <figcaption class="flex flex-col gap-1">
          <Show when={props.showTitle && !!props.titleText}>
            <h3 class="text-base font-semibold leading-6 tracking-tight text-components-chart-all-color-title-text-default">
              {props.titleText}
            </h3>
          </Show>
          <Show when={props.showDescription && !!props.descriptionText}>
            <p class="text-sm leading-5 text-components-chart-all-color-description-text-default">{props.descriptionText}</p>
          </Show>
        </figcaption>
      </Show>

      <div class="flex w-full flex-col gap-3">
        <Show when={!props.customContent}>
          <Show
            when={state.hasData}
            else={
              <div class="flex h-48 w-full items-center justify-center rounded-md border border-dashed border-components-chart-all-color-container-border-default">
                <span class="text-sm text-components-chart-all-color-description-text-default">No data available</span>
              </div>
            }
          >
            <svg class="h-48 w-full" viewBox="0 0 320 200" role="img" aria-label={props.titleText || state.chartType + ' chart'}>
              <Show when={state.isVerticalCartesian}>
                <g>
                  <Show when={props.showGridLines}>
                    <For each={state.axisTicks}>
                      {(tick) => (
                        <line
                          key={tick.id}
                          x1="44"
                          y1={tick.y}
                          x2="308"
                          y2={tick.y}
                          stroke-width="1"
                          class="stroke-components-chart-all-color-grid-line-stroke-default"
                        />
                      )}
                    </For>
                  </Show>
                  <For each={state.axisTicks}>
                    {(tick) => (
                      <text
                        key={'axis-' + tick.id}
                        x="38"
                        y={tick.y + 3}
                        text-anchor="end"
                        font-size="9"
                        class="fill-components-chart-all-color-axis-label-text-default"
                      >
                        {tick.label}
                      </text>
                    )}
                  </For>
                  <line
                    x1="44"
                    y1="172"
                    x2="308"
                    y2="172"
                    stroke-width="1"
                    class="stroke-components-chart-all-color-container-border-default"
                  />
                </g>
              </Show>

              <Show when={state.chartType === 'Bar'}>
                <g>
                  <For each={state.barMarks}>
                    {(mark) => (
                      <rect key={mark.id} x={mark.x} y={mark.y} width={mark.width} height={mark.height} rx="2" class={cn(mark.fillClass)} />
                    )}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Stacked Bar'}>
                <g>
                  <For each={state.stackedMarks}>
                    {(mark) => (
                      <rect key={mark.id} x={mark.x} y={mark.y} width={mark.width} height={mark.height} class={cn(mark.fillClass)} />
                    )}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Waterfall'}>
                <g>
                  <For each={state.waterfallConnectors}>
                    {(line) => (
                      <line
                        key={line.id}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke-width="1"
                        class="stroke-components-chart-all-color-grid-line-stroke-default"
                      />
                    )}
                  </For>
                  <For each={state.waterfallMarks}>
                    {(mark) => (
                      <rect key={mark.id} x={mark.x} y={mark.y} width={mark.width} height={mark.height} rx="2" class={cn(mark.fillClass)} />
                    )}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Line' || state.chartType === 'Area'}>
                <g>
                  <Show when={state.chartType === 'Area'}>
                    <path d={state.lineMarks.areaPath} opacity="0.5" class="fill-components-chart-all-color-series-1-fill-default" />
                  </Show>
                  <path
                    d={state.lineMarks.linePath}
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="stroke-components-chart-all-color-series-1-fill-default"
                  />
                  <For each={state.lineMarks.dots}>
                    {(dot) => <circle key={dot.id} cx={dot.cx} cy={dot.cy} r="3" class="fill-components-chart-all-color-series-1-fill-default" />}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Scatter'}>
                <g>
                  <For each={state.scatterMarks}>
                    {(dot) => <circle key={dot.id} cx={dot.cx} cy={dot.cy} r="4" class="fill-components-chart-all-color-series-1-fill-default" />}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Horizontal Bar'}>
                <g>
                  <Show when={props.showGridLines}>
                    <For each={state.horizontalGridLines}>
                      {(line) => (
                        <line
                          key={line.id}
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke-width="1"
                          class="stroke-components-chart-all-color-grid-line-stroke-default"
                        />
                      )}
                    </For>
                  </Show>
                  <line x1="44" y1="12" x2="44" y2="172" stroke-width="1" class="stroke-components-chart-all-color-container-border-default" />
                  <For each={state.horizontalMarks}>
                    {(mark) => (
                      <rect key={mark.id} x={mark.x} y={mark.y} width={mark.width} height={mark.height} rx="2" class={cn(mark.fillClass)} />
                    )}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Funnel'}>
                <g>
                  <For each={state.funnelMarks}>
                    {(mark) => (
                      <rect key={mark.id} x={mark.x} y={mark.y} width={mark.width} height={mark.height} rx="2" class={cn(mark.fillClass)} />
                    )}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Pie' || state.chartType === 'Donut'}>
                <g>
                  <For each={state.sliceMarks}>
                    {(slice) => <path key={slice.id} d={slice.path} fill-rule="evenodd" class={cn(slice.fillClass)} />}
                  </For>
                  <Show when={state.chartType === 'Donut'}>
                    <text
                      x="176"
                      y="88"
                      text-anchor="middle"
                      font-size="16"
                      font-weight="600"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {state.donutTotalLabel}
                    </text>
                    <text x="176" y="104" text-anchor="middle" font-size="9" class="fill-components-chart-all-color-legend-label-text-default">
                      Total
                    </text>
                  </Show>
                </g>
              </Show>

              <Show when={state.chartType === 'Radar'}>
                <g>
                  <For each={state.radarRings}>
                    {(ring) => (
                      <polygon
                        key={ring.id}
                        points={ring.points}
                        fill="none"
                        stroke-width="1"
                        class="stroke-components-chart-all-color-grid-line-stroke-default"
                      />
                    )}
                  </For>
                  <Show when={props.showGridLines}>
                    <For each={state.radarSpokes}>
                      {(spoke) => (
                        <line
                          key={spoke.id}
                          x1={spoke.x1}
                          y1={spoke.y1}
                          x2={spoke.x2}
                          y2={spoke.y2}
                          stroke-width="1"
                          class="stroke-components-chart-all-color-grid-line-stroke-default"
                        />
                      )}
                    </For>
                  </Show>
                  <For each={state.radarPolygons}>
                    {(polygon) => (
                      <polygon
                        key={polygon.id}
                        points={polygon.points}
                        opacity="0.35"
                        stroke-width="2"
                        class={cn(polygon.fillClass, polygon.strokeClass)}
                      />
                    )}
                  </For>
                </g>
              </Show>

              <Show when={state.chartType === 'Gauge'}>
                <g>
                  <path d={state.gaugeMark.trackPath} fill="none" stroke-width="16" stroke-linecap="round" class="stroke-border-default" />
                  <Show when={state.gaugeMark.valuePath !== ''}>
                    <path
                      d={state.gaugeMark.valuePath}
                      fill="none"
                      stroke-width="16"
                      stroke-linecap="round"
                      class="stroke-components-chart-all-color-series-1-fill-default"
                    />
                  </Show>
                  <text
                    x={state.gaugeMark.labelX}
                    y={state.gaugeMark.labelY}
                    text-anchor="middle"
                    font-size="20"
                    font-weight="600"
                    class="fill-components-chart-all-color-data-label-text-default"
                  >
                    {state.gaugeMark.valueLabel}
                  </text>
                  <text
                    x={state.gaugeMark.labelX}
                    y={state.gaugeMark.labelY + 18}
                    text-anchor="middle"
                    font-size="9"
                    class="fill-components-chart-all-color-axis-label-text-default"
                  >
                    {state.gaugeMark.percentLabel}
                  </text>
                </g>
              </Show>

              <Show when={state.isPointBased}>
                <For each={state.pointLabels}>
                  {(label) => (
                    <text
                      key={label.id}
                      x={label.x}
                      y={label.y}
                      text-anchor={label.anchor}
                      font-size="9"
                      class="fill-components-chart-all-color-axis-label-text-default"
                    >
                      {label.label}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={state.isBandBased}>
                <For each={state.columnLabels}>
                  {(label) => (
                    <text
                      key={label.id}
                      x={label.x}
                      y={label.y}
                      text-anchor={label.anchor}
                      font-size="9"
                      class="fill-components-chart-all-color-axis-label-text-default"
                    >
                      {label.label}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={state.chartType === 'Horizontal Bar'}>
                <For each={state.rowLabels}>
                  {(label) => (
                    <text
                      key={label.id}
                      x={label.x}
                      y={label.y}
                      text-anchor={label.anchor}
                      font-size="9"
                      class="fill-components-chart-all-color-axis-label-text-default"
                    >
                      {label.label}
                    </text>
                  )}
                </For>
                <For each={state.horizontalTickLabels}>
                  {(label) => (
                    <text
                      key={label.id}
                      x={label.x}
                      y={label.y}
                      text-anchor={label.anchor}
                      font-size="9"
                      class="fill-components-chart-all-color-axis-label-text-default"
                    >
                      {label.label}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && state.chartType === 'Bar'}>
                <For each={state.barMarks}>
                  {(mark) => (
                    <text
                      key={'bar-label-' + mark.id}
                      x={mark.labelX}
                      y={mark.labelY}
                      text-anchor="middle"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {mark.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && state.chartType === 'Stacked Bar'}>
                <For each={state.stackedMarks}>
                  {(mark) => (
                    <text
                      key={'stack-label-' + mark.id}
                      x={mark.labelX}
                      y={mark.labelY}
                      text-anchor="middle"
                      font-size="8"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {mark.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && state.chartType === 'Waterfall'}>
                <For each={state.waterfallMarks}>
                  {(mark) => (
                    <text
                      key={'waterfall-label-' + mark.id}
                      x={mark.labelX}
                      y={mark.labelY}
                      text-anchor="middle"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {mark.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && (state.chartType === 'Line' || state.chartType === 'Area')}>
                <For each={state.lineMarks.dots}>
                  {(dot) => (
                    <text
                      key={'line-label-' + dot.id}
                      x={dot.labelX}
                      y={dot.labelY}
                      text-anchor="middle"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {dot.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && state.chartType === 'Scatter'}>
                <For each={state.scatterMarks}>
                  {(dot) => (
                    <text
                      key={'scatter-label-' + dot.id}
                      x={dot.labelX}
                      y={dot.labelY}
                      text-anchor="middle"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {dot.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && state.chartType === 'Horizontal Bar'}>
                <For each={state.horizontalMarks}>
                  {(mark) => (
                    <text
                      key={'horizontal-label-' + mark.id}
                      x={mark.labelX}
                      y={mark.labelY}
                      text-anchor="start"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {mark.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && state.chartType === 'Funnel'}>
                <For each={state.funnelMarks}>
                  {(mark) => (
                    <text
                      key={'funnel-label-' + mark.id}
                      x={mark.labelX}
                      y={mark.labelY}
                      text-anchor="middle"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {mark.label + ' · ' + mark.valueLabel}
                    </text>
                  )}
                </For>
              </Show>

              <Show when={props.showDataLabels && (state.chartType === 'Pie' || state.chartType === 'Donut')}>
                <For each={state.sliceMarks}>
                  {(slice) => (
                    <text
                      key={'slice-label-' + slice.id}
                      x={slice.labelX}
                      y={slice.labelY}
                      text-anchor="middle"
                      font-size="9"
                      class="fill-components-chart-all-color-data-label-text-default"
                    >
                      {slice.valueLabel}
                    </text>
                  )}
                </For>
              </Show>
            </svg>
          </Show>
        </Show>
        {props.children}
      </div>

      <Show when={props.showLegend && state.legendItems.length > 0}>
        <ul class="flex flex-wrap items-center gap-4">
          <For each={state.legendItems}>
            {(item) => (
              <li key={item.id} class="flex items-center gap-2">
                <span aria-hidden="true" class={cn('h-2 w-2 shrink-0 rounded-full', item.dotClass)}></span>
                <span class="text-xs text-components-chart-all-color-legend-label-text-default">{item.label}</span>
              </li>
            )}
          </For>
        </ul>
      </Show>

      <table class="sr-only">
        <caption>{props.titleText || state.chartType + ' chart data'}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <For each={state.dataRows}>
            {(row) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                <td>{row.valueLabel}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </figure>
  );
}
