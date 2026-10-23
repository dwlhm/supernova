import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface MetricCardProps {
  label?: string;
  value?: string;
  showValue?: boolean;
  trendText?: string;
  showTrend?: boolean;
  trendDirection?: 'up' | 'down' | 'neutral';
  descriptionText?: string;
  showDescription?: boolean;
  showIcon?: boolean;
  showStatus?: boolean;
  statusLabel?: string;
  statusVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showProgress?: boolean;
  progress?: number;
  className?: string;
  children?: any;
}

export default function MetricCard(props: MetricCardProps) {
  useDefaultProps({
    label: 'Total Revenue',
    value: '$45,231.89',
    showValue: true,
    trendText: '+20.1%',
    showTrend: true,
    trendDirection: 'up',
    descriptionText: 'from last month',
    showDescription: true,
    showIcon: true,
    showStatus: true,
    statusLabel: 'On track',
    statusVariant: 'default',
    showProgress: false,
    progress: 0,
    className: '',
  });

  const state = useStore({
    get trendClasses() {
      if (props.trendDirection === 'down') {
        return 'bg-destructive-subtle text-destructive-foreground';
      }
      if (props.trendDirection === 'neutral') {
        return 'bg-background-muted text-foreground-muted';
      }
      return 'bg-components-metric-card-all-color-trend-background-default text-components-metric-card-all-color-trend-foreground-default';
    },
    get statusClasses() {
      switch (props.statusVariant) {
        case 'success':
          return 'bg-success-subtle text-success-foreground';
        case 'warning':
          return 'bg-warning-subtle text-warning-foreground';
        case 'error':
          return 'bg-destructive-subtle text-destructive-foreground';
        case 'info':
          return 'bg-info-subtle text-info-foreground';
        case 'default':
        default:
          return 'bg-background-muted text-foreground-muted';
      }
    },
    get progressPercentage() {
      const raw = props.progress;
      if (raw < 0) {
        return 0;
      }
      if (raw > 100) {
        return 100;
      }
      return raw;
    },
    get progressStyle() {
      return { width: state.progressPercentage + '%' };
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
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md bg-components-metric-card-all-color-icon-background-default"
            aria-hidden="true"
          >
            <svg
              class="h-4 w-4 text-components-metric-card-all-color-label-foreground-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke-linecap="round" />
            </svg>
          </span>
        </Show>
        <span class="truncate text-xs font-medium text-components-metric-card-all-color-label-foreground-default">
          {props.label}
        </span>
        <Show when={props.showStatus}>
          <span
            class={cn(
              'ml-auto inline-flex shrink-0 items-center rounded-rounded-full px-2 py-0.5 text-xs font-medium leading-none',
              state.statusClasses
            )}
          >
            {props.statusLabel}
          </span>
        </Show>
      </div>
      <Show when={props.showValue}>
        <p class="truncate text-2xl font-semibold text-components-metric-card-all-color-value-foreground-default">
          {props.value}
        </p>
      </Show>
      <Show when={props.showTrend || props.showDescription}>
        <div class="flex flex-wrap items-center gap-2">
          <Show when={props.showTrend}>
            <span
              class={cn(
                'inline-flex shrink-0 items-center gap-0.5 rounded-rounded-full px-2 py-0.5 text-xs font-medium leading-none',
                state.trendClasses
              )}
            >
              {props.trendText}
            </span>
          </Show>
          <Show when={props.showDescription}>
            <span class="truncate text-xs text-components-metric-card-all-color-description-foreground-default">
              {props.descriptionText}
            </span>
          </Show>
        </div>
      </Show>
      <Show when={props.showProgress}>
        <div
          class="h-2 w-full overflow-hidden rounded-rounded-full bg-background-muted"
          role="progressbar"
          aria-valuenow={state.progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={props.label}
        >
          <div class="h-2 rounded-rounded-full bg-chart-series-1" style={state.progressStyle} />
        </div>
      </Show>
      <Show when={props.children}>
        <div class="w-full">{props.children}</div>
      </Show>
    </article>
  );
}
