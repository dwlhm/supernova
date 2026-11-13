import { useDefaultProps, For } from '@builder.io/mitosis';
import { cn, getChartRadarState, bindControllerProps, type ChartTooltipContext } from './utils';
import Tooltip from './Tooltip.lite';
import type { ChartDataPoint } from './Chart.lite';

export interface ChartRadarProps {
  data?: ChartDataPoint[]; rings?: number; maxValue?: number; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  ariaLabel?: string; className?: string;
}

export default function ChartRadar(props: ChartRadarProps) {
  useDefaultProps({
    data: [], rings: 3, maxValue: 100, showTooltip: true, tooltipPosition: 'top', tooltipClassName: '', ariaLabel: 'Radar chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-center justify-start', props.className)}>
      <div class="relative flex h-44 w-44 items-center justify-center">
        <svg class="h-44 w-44 shrink-0 overflow-visible" viewBox="0 0 200 200" role="img" aria-label={props.ariaLabel}>
          <For each={getChartRadarState(props.data, props.rings, props.maxValue, props.formatTooltip, props.formatValue).ringPolygons}>
            {(ring) => <polygon key={ring.key} points={ring.points} fill="none" class="stroke-border-default" stroke-width="1" />}
          </For>
          <For each={getChartRadarState(props.data, props.rings, props.maxValue, props.formatTooltip, props.formatValue).spokes}>
            {(spoke) => <line key={spoke.key} x1={spoke.x1} y1={spoke.y1} x2={spoke.x2} y2={spoke.y2} class="stroke-border-default" stroke-width="1" />}
          </For>
          <For each={getChartRadarState(props.data, props.rings, props.maxValue, props.formatTooltip, props.formatValue).series}>
            {(serie) => (
              <g key={serie.key}>
                <polygon points={serie.points} class={cn(serie.fillClass, serie.strokeClass, 'fill-opacity-20')} stroke-width="1.5" />
                <For each={serie.dots}>
                  {(dot) => <circle key={dot.key} cx={dot.cx} cy={dot.cy} r="2.5" class={dot.fillClass} />}
                </For>
              </g>
            )}
          </For>
          <For each={getChartRadarState(props.data, props.rings, props.maxValue, props.formatTooltip, props.formatValue).axes}>
            {(axis) => (
              <text key={axis.key} x={axis.x} y={axis.y} text-anchor="middle" dominant-baseline="middle" class="fill-foreground-muted text-xs font-normal">
                {axis.label}
              </text>
            )}
          </For>
        </svg>
        <For each={getChartRadarState(props.data, props.rings, props.maxValue, props.formatTooltip, props.formatValue).hotspots}>
          {(spot) => (
            <div key={spot.key} class="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: spot.left, top: spot.top }}>
              <Tooltip text={spot.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName}>
                <span class="block h-5 w-5 rounded-full" />
              </Tooltip>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
