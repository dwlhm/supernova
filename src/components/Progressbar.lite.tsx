import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ProgressbarProps {
  /** Current progress value. Interpreted against `min` and `max`. */
  value?: number;
  /** Lower bound of the measurable range. Defaults to 0. */
  min?: number;
  /** Upper bound of the measurable range. Defaults to 100. */
  max?: number;
  /** Visible label describing the process being measured. */
  label?: string;
  /** Renders the percentage value next to the label. */
  showValue?: boolean;
  /** Semantic colour of the filled indicator. */
  tone?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  /** Height of the bar. `medium` matches the 8px design spec. */
  size?: 'small' | 'medium' | 'large';
  /** Accessible name when no visible label is provided. */
  ariaLabel?: string;
  /** Accessible description of the current status for assistive tech. */
  description?: string;
  className?: string;
}

export default function Progressbar(props: ProgressbarProps) {
  useDefaultProps({
    value: 0,
    min: 0,
    max: 100,
    label: '',
    showValue: false,
    tone: 'primary',
    size: 'medium',
    ariaLabel: '',
    description: '',
    className: '',
  });

  const state = useStore({
    get resolvedMin() {
      return typeof props.min === 'number' ? props.min : 0;
    },
    get resolvedMax() {
      const min = typeof props.min === 'number' ? props.min : 0;
      const max = typeof props.max === 'number' ? props.max : 100;
      return max > min ? max : min + 100;
    },
    get clampedValue() {
      const raw = typeof props.value === 'number' ? props.value : 0;
      if (raw < state.resolvedMin) {
        return state.resolvedMin;
      }
      if (raw > state.resolvedMax) {
        return state.resolvedMax;
      }
      return raw;
    },
    get percent() {
      const span = state.resolvedMax - state.resolvedMin;
      if (span <= 0) {
        return 0;
      }
      const ratio = ((state.clampedValue - state.resolvedMin) / span) * 100;
      if (ratio < 0) {
        return 0;
      }
      if (ratio > 100) {
        return 100;
      }
      return Math.round(ratio * 10) / 10;
    },
    get percentLabel() {
      return Math.round(state.percent) + '%';
    },
    get indicatorWidth() {
      return state.percent + '%';
    },
    get isComplete() {
      return state.percent >= 100;
    },
    get hasHeader() {
      return Boolean(props.label) || props.showValue;
    },
    get hasLabel() {
      return Boolean(props.label);
    },
    get accessibleName() {
      if (props.ariaLabel) {
        return props.ariaLabel;
      }
      if (props.label) {
        return props.label;
      }
      return '';
    },
    get valueText() {
      if (props.description) {
        return props.description;
      }
      return state.percentLabel;
    },
    get sizeClasses() {
      switch (props.size) {
        case 'small':
          return 'h-1';
        case 'large':
          return 'h-3';
        case 'medium':
        default:
          return 'h-2';
      }
    },
    get trackClasses() {
      return 'w-full overflow-hidden rounded-full bg-primary-subtle';
    },
    get toneClasses() {
      switch (props.tone) {
        case 'success':
          return 'bg-success-default';
        case 'warning':
          return 'bg-warning-default';
        case 'info':
          return 'bg-info-default';
        case 'danger':
          return 'bg-destructive-default';
        case 'primary':
        default:
          return 'bg-components-progressbar-all-color-indicator-background-default';
      }
    },
    get indicatorClasses() {
      return cn(
        'h-full transition-all duration-300 ease-out',
        state.isComplete ? 'rounded-full' : 'rounded-l-full rounded-r-none',
        state.toneClasses
      );
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-1', props.className)}>
      <Show when={state.hasHeader}>
        <div class="flex w-full items-center justify-between gap-2">
          <Show when={state.hasLabel}>
            <span class="text-xs font-medium leading-4 text-foreground-default">{props.label}</span>
          </Show>
          <Show when={props.showValue}>
            <span class="text-xs leading-4 text-foreground-muted">{state.percentLabel}</span>
          </Show>
        </div>
      </Show>
      <div
        role="progressbar"
        aria-valuemin={state.resolvedMin}
        aria-valuemax={state.resolvedMax}
        aria-valuenow={state.clampedValue}
        aria-valuetext={state.valueText}
        aria-label={state.accessibleName}
        class={cn('relative', state.sizeClasses, state.trackClasses)}
      >
        <div class={state.indicatorClasses} style={{ width: state.indicatorWidth }} />
      </div>
    </div>
  );
}
