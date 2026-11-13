import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, getChartFunnelState, bindControllerProps, type ChartTooltipContext } from './utils';
import Tooltip from './Tooltip.lite';
import type { ChartDataPoint } from './Chart.lite';

export interface ChartFunnelProps {
  data?: ChartDataPoint[];
  showDataLabels?: boolean;
  showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  className?: string;
}

export default function ChartFunnel(props: ChartFunnelProps) {
  useDefaultProps({
    data: [],
    showDataLabels: true,
    showTooltip: true,
    tooltipPosition: 'top',
    tooltipClassName: '',
    ariaLabel: 'Funnel chart',
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      role="img"
      aria-label={props.ariaLabel}
      class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}
    >
      <For each={getChartFunnelState(props.data, props.formatTooltip, props.formatValue).steps}>
        {(step) => (
          <div key={step.key} class="flex w-full flex-row items-center justify-start gap-3">
            <span class="w-16 shrink-0 truncate text-right text-xs font-medium text-foreground-muted">
              {step.label}
            </span>
            <div class="flex flex-1 flex-row items-center justify-start gap-2.5">
              <div style={{ width: step.width }}>
                <Tooltip text={step.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName} className="w-full">
                  <div class={cn('h-7 w-full rounded-sm transition-all duration-150', step.colorClass)} />
                </Tooltip>
              </div>
              <Show when={props.showDataLabels}>
                <span class="shrink-0 text-xs font-semibold text-foreground-default">
                  {step.displayValue}
                </span>
              </Show>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
