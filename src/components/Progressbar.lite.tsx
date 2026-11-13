import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getProgressState } from './utils';

export interface ProgressbarProps {
  value?: number;
  label?: string | ((percentage: number) => string);
  showLabel?: boolean;
  showPercentage?: boolean;
  trackClassName?: string;
  indicatorClassName?: string;
  className?: string;
}

export default function Progressbar(props: ProgressbarProps) {
  useDefaultProps({
    value: 0, label: 'Progress', showLabel: false, showPercentage: true, trackClassName: '', indicatorClassName: '', className: '',
  });

  return (
    <div class={cn('flex w-full flex-col gap-2', props.className)}>
      <Show when={props.showLabel}>
        <div class="flex items-center justify-between text-xs text-foreground-muted">
          <span>{getProgressState(props.value, props.label).resolvedLabel}</span>
          <Show when={props.showPercentage}>
            <span>{getProgressState(props.value, props.label).percentage}%</span>
          </Show>
        </div>
      </Show>
      <div
        role="progressbar"
        aria-valuenow={getProgressState(props.value, props.label).percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={getProgressState(props.value, props.label).resolvedLabel}
        class={cn('h-2 w-full overflow-hidden rounded-full bg-background-muted', props.trackClassName)}
      >
        <div
          class={cn('h-2 rounded-full bg-primary-default transition-all', props.indicatorClassName)}
          style={getProgressState(props.value, props.label).barStyle}
        />
      </div>
    </div>
  );
}
