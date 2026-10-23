import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ProgressbarProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export default function Progressbar(props: ProgressbarProps) {
  useDefaultProps({
    value: 0,
    label: 'Progress',
    showLabel: false,
    className: '',
  });

  const state = useStore({
    get percentage() {
      const raw = props.value;
      if (raw < 0) {
        return 0;
      }
      if (raw > 100) {
        return 100;
      }
      return raw;
    },
    get barStyle() {
      return { width: state.percentage + '%' };
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-2', props.className)}>
      <Show when={props.showLabel}>
        <div class="flex items-center justify-between text-xs text-foreground-muted">
          <span>{props.label}</span>
          <span>{state.percentage}%</span>
        </div>
      </Show>
      <div
        role="progressbar"
        aria-valuenow={state.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={props.label}
        class="h-2 w-full overflow-hidden rounded-rounded-full bg-components-progressbar-all-color-track-background-default"
      >
        <div
          class="h-2 rounded-rounded-full bg-components-progressbar-all-color-indicator-background-default transition-all"
          style={state.barStyle}
        />
      </div>
    </div>
  );
}
