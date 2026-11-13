import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getChartGaugeState, bindControllerProps, type ChartTooltipContext } from './utils';
import Tooltip from './Tooltip.lite';

export interface ChartGaugeProps {
  value?: number; min?: number; max?: number; label?: string; tooltip?: string | ((ctx: ChartTooltipContext) => string);
  showDataLabels?: boolean; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  strokeClass?: string; ariaLabel?: string; className?: string;
}

export default function ChartGauge(props: ChartGaugeProps) {
  useDefaultProps({
    value: 75, min: 0, max: 100, label: '', tooltip: '',
    showDataLabels: true, showTooltip: true, tooltipPosition: 'top', tooltipClassName: '',
    strokeClass: 'stroke-chart-series-1', ariaLabel: 'Gauge chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-center justify-start', props.className)}>
      <div class="relative flex flex-col items-center justify-center">
        <Tooltip text={getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName}>
          <div class="relative flex items-end justify-center">
            <svg class="h-28 w-48 shrink-0 overflow-visible" viewBox="0 0 120 68" role="img" aria-label={props.ariaLabel}>
              <path d={getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).arcPath} fill="none" class="stroke-background-muted" stroke-width="12" stroke-linecap="butt" />
              <path
                d={getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).arcPath}
                fill="none"
                class={props.strokeClass}
                stroke-width="12"
                stroke-linecap="butt"
                stroke-dasharray={getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).dashArray}
              />
            </svg>
            <Show when={props.showDataLabels}>
              <span class="absolute bottom-1 text-center text-2xl font-semibold text-foreground-default">
                {props.label || getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).displayValue}
              </span>
            </Show>
          </div>
        </Tooltip>
        <div class="flex w-44 flex-row items-center justify-between px-1">
          <span class="text-xs font-normal text-foreground-muted">{getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).minLabel}</span>
          <span class="text-xs font-normal text-foreground-muted">{getChartGaugeState(props.value, props.min, props.max, props.tooltip, props.formatTooltip, props.formatValue).maxLabel}</span>
        </div>
      </div>
    </div>
  );
}
