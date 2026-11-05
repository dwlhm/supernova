import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getProgressState, bindControllerProps } from './utils';

export interface ProgressbarProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export default function Progressbar(props: ProgressbarProps) {
  useDefaultProps({
    value: 0, label: 'Progress', showLabel: false, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-2', props.className)}>
      <Show when={props.showLabel}>
        <div class="flex items-center justify-between text-xs text-foreground-muted">
          <span>{props.label}</span>
          <span>{getProgressState(props.value).percentage}%</span>
        </div>
      </Show>
      <div
        role="progressbar"
        aria-valuenow={getProgressState(props.value).percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={props.label}
        class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
      >
        <div
          class="h-2 rounded-full bg-primary-default transition-all"
          style={getProgressState(props.value).barStyle}
        />
      </div>
    </div>
  );
}
