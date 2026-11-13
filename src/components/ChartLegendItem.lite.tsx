import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface ChartLegendItemProps {
  colorClass?: string;
  interactive?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function ChartLegendItem(props: ChartLegendItemProps) {
  useDefaultProps({
    colorClass: 'bg-chart-series-1',
    interactive: false,
    active: true,
    disabled: false,
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      role={props.interactive ? 'button' : undefined}
      tabIndex={props.interactive && !props.disabled ? 0 : undefined}
      aria-pressed={props.interactive ? props.active : undefined}
      aria-disabled={props.interactive && props.disabled ? true : undefined}
      onClick={() => props.interactive && !props.disabled && props.onClick && props.onClick()}
      onKeyDown={(event) => props.interactive && !props.disabled && (event.key === 'Enter' || event.key === ' ') && props.onClick && props.onClick()}
      class={cn(
        'flex flex-row items-center justify-start gap-2',
        props.interactive && 'rounded-md px-1.5 py-0.5 select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        props.interactive && (props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-background-muted active:scale-[0.98]'),
        !props.active && 'opacity-50',
        props.className
      )}
    >
      <span class={cn('h-2 w-2 shrink-0 rounded-full transition-opacity', props.colorClass, !props.active && 'opacity-40')} />
      <span class={cn('text-xs font-normal text-foreground-muted', !props.active && 'line-through')}>{props.children}</span>
    </div>
  );
}
