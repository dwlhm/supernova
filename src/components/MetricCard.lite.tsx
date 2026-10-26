import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface MetricCardProps {
  type?:
    | 'Default'
    | 'Progress'
    | 'Sparkline'
    | 'Comparison'
    | 'Radial'
    | 'Mini Bar'
    | 'Target'
    | 'List'
    | 'Multi-Metric'
    | 'Leaderboard';
  labelText?: string;
  valueText?: string;
  showValue?: boolean;
  showIcon?: boolean;
  iconName?: 'revenue' | 'orders' | 'customers' | 'growth' | 'chart' | 'target';
  showTrend?: boolean;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  showDescription?: boolean;
  descriptionText?: string;
  showStatus?: boolean;
  statusLabel?: string;
  showActionable?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  progress?: number;
  targetText?: string;
  comparisonValueText?: string;
  comparisonLabelText?: string;
  comparisonShare?: number;
  sparklineData?: number[];
  barData?: number[];
  listItems?: { id: string; label: string; value: string }[];
  metrics?: { id: string; label: string; value: string }[];
  leaderboardEntries?: { id: string; label: string; value: string }[];
  className?: string;
  children?: any;
}

export default function MetricCard(props: MetricCardProps) {
  useDefaultProps({
    type: 'Default',
    labelText: 'Total Revenue',
    valueText: '$45,231.89',
    showValue: true,
    showIcon: true,
    iconName: 'growth',
    showTrend: true,
    trendText: '+20.1%',
    trendDirection: 'up',
    showDescription: true,
    descriptionText: 'from last month',
    showStatus: false,
    statusLabel: '',
    showActionable: false,
    primaryActionLabel: '',
    secondaryActionLabel: '',
    progress: 0,
    targetText: '',
    comparisonValueText: '',
    comparisonLabelText: '',
    comparisonShare: 0,
    sparklineData: [],
    barData: [],
    listItems: [],
    metrics: [],
    leaderboardEntries: [],
    className: '',
  });

  const state = useStore({
    get iconPath() {
      switch (props.iconName) {
        case 'revenue':
          return 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6';
        case 'orders':
          return 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0';
        case 'customers':
          return 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87';
        case 'chart':
          return 'M4 20V10M10 20V4M16 20v-7M22 20H2';
        case 'target':
          return 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3';
        case 'growth':
        default:
          return 'M3 17l6-6 4 4 8-8M17 7h4v4';
      }
    },
    get trendIconPath() {
      if (props.trendDirection === 'down') {
        return 'M12 5v14M5 12l7 7 7-7';
      }
      if (props.trendDirection === 'neutral') {
        return 'M5 12h14';
      }
      return 'M12 19V5M5 12l7-7 7 7';
    },
    get trendClasses() {
      if (props.trendDirection === 'down') {
        return 'bg-destructive-subtle text-destructive-foreground';
      }
      if (props.trendDirection === 'neutral') {
        return 'bg-background-muted text-foreground-muted';
      }
      return 'bg-components-metric-card-all-color-trend-background-default text-components-metric-card-all-color-trend-foreground-default';
    },
    get hasStatus() {
      return Boolean(props.showStatus && props.statusLabel);
    },
    get hasActions() {
      return Boolean(
        props.showActionable && (props.primaryActionLabel || props.secondaryActionLabel)
      );
    },
    get percent() {
      const raw = typeof props.progress === 'number' ? props.progress : 0;
      if (raw < 0) {
        return 0;
      }
      if (raw > 100) {
        return 100;
      }
      return Math.round(raw);
    },
    get percentLabel() {
      return state.percent + '%';
    },
    get progressStyle() {
      return { width: state.percent + '%' };
    },
    get radialStyle() {
      const filled = state.percent;
      const remainder = 100 - filled;
      return { strokeDasharray: filled + ' ' + remainder };
    },
    get radialLabel() {
      return props.labelText + ' ' + state.percentLabel;
    },
    get sharePercent() {
      const raw = typeof props.comparisonShare === 'number' ? props.comparisonShare : 0;
      if (raw < 0) {
        return 0;
      }
      if (raw > 100) {
        return 100;
      }
      return Math.round(raw);
    },
    get shareStyle() {
      return { width: state.sharePercent + '%' };
    },
    get sparklineMin() {
      const data = props.sparklineData || [];
      if (data.length === 0) {
        return 0;
      }
      let min = data[0];
      let i = 1;
      while (i < data.length) {
        if (data[i] < min) {
          min = data[i];
        }
        i = i + 1;
      }
      return min;
    },
    get sparklineMax() {
      const data = props.sparklineData || [];
      if (data.length === 0) {
        return 1;
      }
      let max = data[0];
      let i = 1;
      while (i < data.length) {
        if (data[i] > max) {
          max = data[i];
        }
        i = i + 1;
      }
      return max;
    },
    get sparklinePoints() {
      const data = props.sparklineData || [];
      const min = state.sparklineMin;
      const max = state.sparklineMax;
      const spread = max - min;
      const range = spread === 0 ? 1 : spread;
      return data.map((entry, index) => {
        const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 0;
        const y = 30 - ((entry - min) / range) * 26;
        return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
      });
    },
    get sparklinePath() {
      let path = '';
      state.sparklinePoints.forEach((point, index) => {
        path = path + (index === 0 ? 'M' : 'L') + point.x + ' ' + point.y + ' ';
      });
      return path.trim();
    },
    get sparklineLastPoint() {
      const points = state.sparklinePoints;
      if (points.length === 0) {
        return { x: 0, y: 16 };
      }
      return points[points.length - 1];
    },
    get hasSparkline() {
      return state.sparklinePoints.length > 1;
    },
    get barMax() {
      const data = props.barData || [];
      let max = 0;
      data.forEach((entry) => {
        if (entry > max) {
          max = entry;
        }
      });
      return max === 0 ? 1 : max;
    },
    get miniBars() {
      const data = props.barData || [];
      const max = state.barMax;
      return data.map((entry, index) => {
        const ratio = (entry / max) * 100;
        const height = ratio < 10 ? 10 : Math.round(ratio);
        return { id: 'bar-' + index, style: { height: height + '%' } };
      });
    },
    get listRows() {
      return props.listItems || [];
    },
    get metricRows() {
      return props.metrics || [];
    },
    get leaderboardRows() {
      return props.leaderboardEntries || [];
    },
    get textSummary() {
      const parts: string[] = [];

      const spark = props.sparklineData || [];
      if (spark.length > 0) {
        parts.push('Trend values ' + spark.join(', '));
      }

      const bars = props.barData || [];
      if (bars.length > 0) {
        parts.push('Distribution values ' + bars.join(', '));
      }

      const rows = props.listItems || [];
      if (rows.length > 0 && props.type !== 'List') {
        const described = rows.map((row) => row.label + ' ' + row.value);
        parts.push('Items ' + described.join(', '));
      }

      const metricList = props.metrics || [];
      if (metricList.length > 0 && props.type !== 'Multi-Metric') {
        const described = metricList.map((item) => item.label + ' ' + item.value);
        parts.push('Metrics ' + described.join(', '));
      }

      const board = props.leaderboardEntries || [];
      if (board.length > 0 && props.type !== 'Leaderboard') {
        const described = board.map((item) => item.label + ' ' + item.value);
        parts.push('Ranking ' + described.join(', '));
      }

      return parts.join('. ');
    },
    get trendSeriesLabel() {
      return props.labelText + ' trend, ' + state.sparklinePoints.length + ' data points';
    },
    handlePrimaryAction() {
      if (props.onPrimaryAction) {
        props.onPrimaryAction();
      }
    },
    handleSecondaryAction() {
      if (props.onSecondaryAction) {
        props.onSecondaryAction();
      }
    },
  });

  return (
    <article
      class={cn(
        'flex w-full flex-col gap-2 rounded-rounded-lg border border-components-metric-card-all-color-container-border-default bg-components-metric-card-all-color-container-background-default p-4',
        props.className
      )}
    >
      <div class="flex items-center gap-2">
        <Show when={props.showIcon}>
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md bg-components-metric-card-all-color-icon-background-default p-1"
            aria-hidden="true"
          >
            <svg
              class="h-full w-full text-components-metric-card-all-color-label-foreground-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d={state.iconPath} />
            </svg>
          </span>
        </Show>
        <p class="min-w-0 flex-1 truncate text-xs font-medium text-components-metric-card-all-color-label-foreground-default">
          {props.labelText}
        </p>
        <Show when={state.hasStatus}>
          <span class="inline-flex shrink-0 items-center rounded-rounded-full bg-background-muted px-2 py-0-5 text-xs font-medium leading-none text-foreground-muted">
            {props.statusLabel}
          </span>
        </Show>
      </div>

      <Show when={props.showValue}>
        <p class="truncate text-2xl font-semibold tabular-nums text-components-metric-card-all-color-value-foreground-default">
          {props.valueText}
        </p>
      </Show>

      <Show when={props.showTrend || props.showDescription}>
        <div class="flex flex-wrap items-center gap-1">
          <Show when={props.showTrend}>
            <span
              class={cn(
                'inline-flex shrink-0 items-center gap-0-5 rounded-rounded-full px-2 py-0-5 text-xs font-medium leading-none',
                state.trendClasses
              )}
            >
              <svg
                class="h-3 w-3 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d={state.trendIconPath} />
              </svg>
              {props.trendText}
            </span>
          </Show>
          <Show when={props.showDescription}>
            <span class="min-w-0 truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              {props.descriptionText}
            </span>
          </Show>
        </div>
      </Show>

      <Show when={state.textSummary}>
        <p class="sr-only">{state.textSummary}</p>
      </Show>

      <Show when={props.type === 'Progress'}>
        <div class="flex w-full flex-col gap-1">
          <div
            class="h-2 w-full overflow-hidden rounded-rounded-full bg-background-muted"
            role="progressbar"
            aria-valuenow={state.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={props.labelText}
          >
            <div class="h-full rounded-rounded-full bg-primary-default" style={state.progressStyle} />
          </div>
          <span class="text-xs font-medium tabular-nums text-components-metric-card-all-color-description-foreground-default">
            {state.percentLabel}
          </span>
        </div>
      </Show>

      <Show when={props.type === 'Target'}>
        <div class="flex w-full flex-col gap-1">
          <div class="flex items-baseline justify-between gap-2">
            <span class="min-w-0 truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              {props.targetText}
            </span>
            <span class="shrink-0 text-xs font-medium tabular-nums text-components-metric-card-all-color-description-foreground-default">
              {state.percentLabel}
            </span>
          </div>
          <div
            class="h-2 w-full overflow-hidden rounded-rounded-full bg-background-muted"
            role="progressbar"
            aria-valuenow={state.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={props.labelText}
          >
            <div class="h-full rounded-rounded-full bg-chart-series-1" style={state.progressStyle} />
          </div>
        </div>
      </Show>

      <Show when={props.type === 'Radial'}>
        <div class="flex w-full items-center gap-3">
          <svg
            class="h-16 w-16 shrink-0 -rotate-90"
            viewBox="0 0 36 36"
            role="img"
            aria-label={state.radialLabel}
          >
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="none"
              stroke-width="3"
              class="stroke-background-muted"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
              class="stroke-chart-series-1"
              style={state.radialStyle}
            />
          </svg>
          <span class="text-sm font-semibold tabular-nums text-components-metric-card-all-color-value-foreground-default">
            {state.percentLabel}
          </span>
        </div>
      </Show>

      <Show when={props.type === 'Comparison'}>
        <div class="flex w-full flex-col gap-2">
          <div class="flex items-baseline justify-between gap-2">
            <span class="min-w-0 truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              {props.comparisonLabelText}
            </span>
            <span class="shrink-0 text-sm font-semibold tabular-nums text-components-metric-card-all-color-value-foreground-default">
              {props.comparisonValueText}
            </span>
          </div>
          <div
            class="flex h-2 w-full overflow-hidden rounded-rounded-full bg-background-interactive"
            role="img"
            aria-label={props.labelText}
          >
            <div class="h-full rounded-rounded-full bg-chart-series-1" style={state.shareStyle} />
          </div>
        </div>
      </Show>

      <Show when={props.type === 'Sparkline'}>
        <Show
          when={state.hasSparkline}
          else={
            <p class="truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              No trend data available
            </p>
          }
        >
          <svg
            class="h-10 w-full"
            viewBox="0 0 100 32"
            role="img"
            aria-label={state.trendSeriesLabel}
          >
            <path
              d={state.sparklinePath}
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-chart-series-1"
            />
            <circle
              cx={state.sparklineLastPoint.x}
              cy={state.sparklineLastPoint.y}
              r="2"
              class="fill-chart-series-1"
            />
          </svg>
        </Show>
      </Show>

      <Show when={props.type === 'Mini Bar'}>
        <Show
          when={state.miniBars.length > 0}
          else={
            <p class="truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              No distribution data available
            </p>
          }
        >
          <div class="flex h-10 w-full items-end gap-1" aria-hidden="true">
            <For each={state.miniBars}>
              {(bar) => (
                <div
                  key={bar.id}
                  class="flex-1 rounded-rounded-xs bg-chart-series-1"
                  style={bar.style}
                />
              )}
            </For>
          </div>
        </Show>
      </Show>

      <Show when={props.type === 'List'}>
        <Show
          when={state.listRows.length > 0}
          else={
            <p class="truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              No items to display
            </p>
          }
        >
          <ul class="flex w-full flex-col gap-1">
            <For each={state.listRows}>
              {(item) => (
                <li key={item.id} class="flex items-center justify-between gap-2">
                  <span class="min-w-0 flex-1 truncate text-xs text-components-metric-card-all-color-description-foreground-default">
                    {item.label}
                  </span>
                  <span class="shrink-0 text-xs font-medium tabular-nums text-components-metric-card-all-color-value-foreground-default">
                    {item.value}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </Show>

      <Show when={props.type === 'Multi-Metric'}>
        <Show
          when={state.metricRows.length > 0}
          else={
            <p class="truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              No metrics to display
            </p>
          }
        >
          <dl class="grid w-full grid-cols-2 gap-2">
            <For each={state.metricRows}>
              {(item) => (
                <div key={item.id} class="flex min-w-0 flex-col gap-0-5">
                  <dt class="truncate text-xs text-components-metric-card-all-color-label-foreground-default">
                    {item.label}
                  </dt>
                  <dd class="truncate text-sm font-semibold tabular-nums text-components-metric-card-all-color-value-foreground-default">
                    {item.value}
                  </dd>
                </div>
              )}
            </For>
          </dl>
        </Show>
      </Show>

      <Show when={props.type === 'Leaderboard'}>
        <Show
          when={state.leaderboardRows.length > 0}
          else={
            <p class="truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              No ranking data available
            </p>
          }
        >
          <ol class="flex w-full flex-col gap-1">
            <For each={state.leaderboardRows}>
              {(item, index) => (
                <li key={item.id} class="flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-rounded-full bg-background-muted text-xs font-medium tabular-nums text-foreground-muted"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span class="min-w-0 flex-1 truncate text-xs text-components-metric-card-all-color-description-foreground-default">
                    {item.label}
                  </span>
                  <span class="shrink-0 text-xs font-medium tabular-nums text-components-metric-card-all-color-value-foreground-default">
                    {item.value}
                  </span>
                </li>
              )}
            </For>
          </ol>
        </Show>
      </Show>

      <Show when={props.children}>
        <div class="w-full">{props.children}</div>
      </Show>

      <Show when={state.hasActions}>
        <div class="flex w-full flex-wrap items-center gap-2">
          <Show when={props.primaryActionLabel}>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-rounded-md bg-primary-default px-2-5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-pressed focus:outline-none focus:ring-2 focus:ring-focus-ring-primary"
              onClick={() => state.handlePrimaryAction()}
            >
              {props.primaryActionLabel}
            </button>
          </Show>
          <Show when={props.secondaryActionLabel}>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-rounded-md bg-secondary-default px-2-5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-focus-ring-default"
              onClick={() => state.handleSecondaryAction()}
            >
              {props.secondaryActionLabel}
            </button>
          </Show>
        </div>
      </Show>
    </article>
  );
}
