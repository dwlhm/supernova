import { For, Show, useDefaultProps, useStore } from '@builder.io/mitosis';

export interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
}

export interface ChartProps {
  title: string;
  description?: string;
  seriesLabel?: string;
  variant?: 'bar' | 'line';
  data: ChartDataPoint[];
  showLegend?: boolean;
  showGridLines?: boolean;
  showDataLabels?: boolean;
}

export default function Chart(props: ChartProps) {
  useDefaultProps({
    variant: 'bar',
    showLegend: true,
    showGridLines: true,
    showDataLabels: true,
  });

  const state = useStore({
    get isInvalidVariant() {
      return props.variant !== 'bar' && props.variant !== 'line';
    },
    get isEmpty() {
      return !Array.isArray(props.data) || props.data.length === 0;
    },
    get hasInvalidData() {
      if (!Array.isArray(props.data) || props.data.length === 0) {
        return false;
      }
      return props.data.some(
        (d) =>
          !d ||
          typeof d.value !== 'number' ||
          !Number.isFinite(d.value) ||
          typeof d.label !== 'string'
      );
    },
    get errorMessage() {
      if (state.isInvalidVariant) {
        return 'Unsupported chart variant: ' + String(props.variant) + '. Please select bar or line.';
      }
      if (state.isEmpty) {
        return 'No chart data available to display.';
      }
      if (state.hasInvalidData) {
        return 'Chart data contains invalid or non-finite values.';
      }
      return '';
    },
    get canRenderChart() {
      return !state.isInvalidVariant && !state.isEmpty && !state.hasInvalidData;
    },
    get bounds() {
      if (!state.canRenderChart) {
        return { min: 0, max: 100, zeroY: 120 };
      }
      const values = props.data.map((d) => d.value);
      let minVal = Math.min(...values);
      let maxVal = Math.max(...values);

      if (minVal === maxVal) {
        if (maxVal === 0) {
          minVal = -10;
          maxVal = 10;
        } else if (maxVal > 0) {
          minVal = 0;
          maxVal = maxVal * 1.25;
        } else {
          minVal = minVal * 1.25;
          maxVal = 0;
        }
      } else {
        if (minVal >= 0) {
          minVal = 0;
          maxVal = maxVal * 1.15;
        } else if (maxVal <= 0) {
          minVal = minVal * 1.15;
          maxVal = 0;
        } else {
          const padding = (maxVal - minVal) * 0.1;
          minVal = minVal - padding;
          maxVal = maxVal + padding;
        }
      }

      const range = maxVal - minVal || 1;
      const zeroY = 24 + 180 * ((maxVal - 0) / range);
      const clampedZeroY = Math.max(24, Math.min(204, zeroY));

      return { min: minVal, max: maxVal, range, zeroY: clampedZeroY };
    },
    get computedPoints() {
      if (!state.canRenderChart) return [];
      const { max, range, zeroY } = state.bounds;
      const count = props.data.length;
      const plotWidth = 436;
      const slotWidth = plotWidth / count;
      const barWidth = Math.max(8, Math.min(48, slotWidth * 0.6));

      return props.data.map((d, index) => {
        const cx = 40 + slotWidth * index + slotWidth / 2;
        const yVal = 24 + 180 * ((max - d.value) / range);

        const x = cx - barWidth / 2;
        let y = yVal;
        let height = Math.abs(zeroY - yVal);
        if (d.value < 0) {
          y = zeroY;
        }
        if (height < 2) {
          height = 2;
        }

        const isPositive = d.value >= 0;
        const labelY = props.variant === 'bar' ? (isPositive ? y - 6 : y + height + 12) : yVal - 8;

        return {
          id: d.id,
          label: d.label,
          value: d.value,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          width: Number(barWidth.toFixed(2)),
          height: Number(height.toFixed(2)),
          cx: Number(cx.toFixed(2)),
          cy: Number(yVal.toFixed(2)),
          labelY: Number(labelY.toFixed(2)),
          fillColor: isPositive ? '#3b82f6' : '#ef4444',
        };
      });
    },
    get linePath() {
      const pts = state.computedPoints;
      if (pts.length === 0) return '';
      let pathStr = 'M ' + pts[0].cx + ' ' + pts[0].cy;
      for (let i = 1; i < pts.length; i++) {
        pathStr = pathStr + ' L ' + pts[i].cx + ' ' + pts[i].cy;
      }
      return pathStr;
    },
    get gridLines() {
      if (!state.canRenderChart) return [];
      const lines = [];
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const y = 24 + (180 / steps) * i;
        lines.push(Number(y.toFixed(2)));
      }
      return lines;
    },
    get zeroLineY() {
      return Number(state.bounds.zeroY.toFixed(2));
    },
  });

  return (
    <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4 font-sans">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-gray-100">
        <div>
          <h3 class="text-base font-semibold text-gray-900">{props.title}</h3>
          <Show when={Boolean(props.description)}>
            <p class="text-xs text-gray-500 mt-0.5">{props.description}</p>
          </Show>
        </div>
        <Show when={props.showLegend}>
          <div class="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <span class="inline-block w-3 h-3 rounded-sm bg-blue-500"></span>
            <span>{props.seriesLabel || 'Series'}</span>
          </div>
        </Show>
      </div>

      <Show
        when={state.canRenderChart}
        else={
          <div
            role="alert"
            class="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium text-center"
          >
            {state.errorMessage}
          </div>
        }
      >
        <div class="w-full">
          <svg viewBox="0 0 500 240" class="w-full h-auto overflow-visible select-none">
            <Show when={props.showGridLines}>
              <For each={state.gridLines}>
                {(y) => (
                  <line
                    key={String(y)}
                    x1={40}
                    y1={y}
                    x2={476}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                )}
              </For>
            </Show>

            <line
              x1={40}
              y1={state.zeroLineY}
              x2={476}
              y2={state.zeroLineY}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />

            <Show when={props.variant === 'bar'}>
              <For each={state.computedPoints}>
                {(pt) => (
                  <rect
                    key={pt.id}
                    x={pt.x}
                    y={pt.y}
                    width={pt.width}
                    height={pt.height}
                    rx="4"
                    fill={pt.fillColor}
                  />
                )}
              </For>
            </Show>

            <Show when={props.variant === 'line'}>
              <path
                d={state.linePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <For each={state.computedPoints}>
                {(pt) => (
                  <circle
                    key={pt.id}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                )}
              </For>
            </Show>

            <Show when={props.showDataLabels}>
              <For each={state.computedPoints}>
                {(pt) => (
                  <text
                    key={pt.id + '-label'}
                    x={pt.cx}
                    y={pt.labelY}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    fontWeight="500"
                  >
                    {pt.value}
                  </text>
                )}
              </For>
            </Show>

            <For each={state.computedPoints}>
              {(pt) => (
                <text
                  key={pt.id + '-cat'}
                  x={pt.cx}
                  y={225}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#475569"
                  fontWeight="500"
                >
                  {pt.label}
                </text>
              )}
            </For>
          </svg>

          <table class="sr-only">
            <caption>{props.title} - Data Values</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">{props.seriesLabel || 'Value'}</th>
              </tr>
            </thead>
            <tbody>
              <For each={props.data}>
                {(point) => (
                  <tr key={point.id}>
                    <td>{point.label}</td>
                    <td>{point.value}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
