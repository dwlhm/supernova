import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, getProgressState, bindControllerProps } from './utils';

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
    label: 'Total Revenue', value: '$45,231.89', showValue: true, trendText: '+20.1%',
    showTrend: true, trendDirection: 'up', descriptionText: 'from last month', showDescription: true,
    showIcon: true, showStatus: true, statusLabel: 'On track', statusVariant: 'default',
    showProgress: false, progress: 0, className: '',
  });

  return (
    <article
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm',
        props.className
      )}
    >
      <div class="flex items-center justify-between gap-2">
        <span class="flex-1 truncate text-xs font-medium text-foreground-muted">{props.label}</span>
        <Show when={props.showStatus}>
          <span class={cn('inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium leading-4', cva(props.statusVariant, { success: 'bg-success-subtle text-success-foreground', warning: 'bg-warning-subtle text-warning-foreground', error: 'bg-destructive-subtle text-destructive-foreground', info: 'bg-info-subtle text-info-foreground', default: 'bg-background-muted text-foreground-muted' }, 'default'))}>
            {props.statusLabel}
          </span>
        </Show>
        <Show when={props.showIcon}>
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default" aria-hidden="true">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke-linecap="round" />
            </svg>
          </span>
        </Show>
      </div>
      <Show when={props.showValue}><p class="truncate text-xl leading-6 font-semibold text-foreground-default">{props.value}</p></Show>
      <Show when={props.showTrend || props.showDescription}>
        <div class="flex flex-wrap items-center gap-1">
          <Show when={props.showTrend}>
            <span class={cn('inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold leading-4', cva(props.trendDirection, { down: 'bg-destructive-subtle text-destructive-foreground', neutral: 'bg-background-muted text-foreground-muted', up: 'bg-success-subtle text-success-foreground' }, 'up'))}>{props.trendText}</span>
          </Show>
          <Show when={props.showDescription}><span class="truncate text-xs text-foreground-muted">{props.descriptionText}</span></Show>
        </div>
      </Show>
      <Show when={props.showProgress}>
        <div class="h-2 w-full overflow-hidden rounded-full bg-background-muted" role="progressbar" aria-valuenow={getProgressState(props.progress).percentage} aria-valuemin={0} aria-valuemax={100} aria-label={props.label}>
          <div class="h-2 rounded-full bg-chart-series-1" style={getProgressState(props.progress).barStyle} />
        </div>
      </Show>
      <Show when={props.children}><div class="w-full">{props.children}</div></Show>
    </article>
  );
}
