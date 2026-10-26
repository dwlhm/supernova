import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SliderProps {
  /**
   * Controlled value. When provided, the parent is responsible for updating it
   * in response to `onInput` / `onChange`.
   */
  value?: number;
  /** Initial value used when the slider is uncontrolled. */
  defaultValue?: number;
  /** Lower bound of the range. */
  min?: number;
  /** Upper bound of the range. */
  max?: number;
  /** Increment between selectable values. */
  step?: number;
  /** Prevents interaction and dims the control. */
  disabled?: boolean;
  /** Id applied to the native range input so a visible label can reference it. */
  id?: string;
  /** Form field name for the native range input. */
  name?: string;
  /** Visible label describing the setting. */
  label?: string;
  /** Accessible name used when no visible label is rendered. */
  ariaLabel?: string;
  /** Renders the current value alongside the label. */
  showValue?: boolean;
  /** Renders the minimum and maximum bounds beneath the track. */
  showRange?: boolean;
  /** Formats displayed values, e.g. `(v) => `${v}%``. */
  formatValue?: (value: number) => string;
  /** Fired when the committed value changes. */
  onChange?: (value: number) => void;
  /** Fired while the value is still changing (continuous feedback). */
  onInput?: (value: number) => void;
  /** Additional classes for the root element. */
  className?: string;
}

export default function Slider(props: SliderProps) {
  useDefaultProps({
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    label: '',
    ariaLabel: '',
    showValue: false,
    showRange: false,
    className: '',
  });

  const state = useStore({
    internalValue: props.defaultValue ?? 0,
    hovered: false,
    focused: false,
    get currentValue() {
      if (typeof props.value === 'number') {
        return props.value;
      }
      return state.internalValue;
    },
    get percent() {
      const lower = props.min ?? 0;
      const upper = props.max ?? 100;
      const span = upper - lower;
      if (span <= 0) {
        return 0;
      }
      const raw = ((state.currentValue - lower) / span) * 100;
      const bounded = Math.min(100, Math.max(0, raw));
      return Math.round(bounded * 100) / 100;
    },
    get displayValue() {
      if (props.formatValue) {
        return props.formatValue(state.currentValue);
      }
      return state.currentValue.toString();
    },
    get minLabel() {
      const lower = props.min ?? 0;
      if (props.formatValue) {
        return props.formatValue(lower);
      }
      return lower.toString();
    },
    get maxLabel() {
      const upper = props.max ?? 100;
      if (props.formatValue) {
        return props.formatValue(upper);
      }
      return upper.toString();
    },
    get accessibleName() {
      if (props.ariaLabel) {
        return props.ariaLabel;
      }
      if (props.label) {
        return props.label;
      }
      return 'Slider';
    },
    get hasHeader() {
      return Boolean(props.label) || Boolean(props.showValue);
    },
    get thumbClasses() {
      const base =
        'pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-white shadow-xs transition-shadow';
      if (props.disabled) {
        return cn(base, 'ring-0');
      }
      if (state.focused) {
        return cn(base, 'ring-2 ring-focus-ring-primary');
      }
      if (state.hovered) {
        return cn(base, 'ring-2 ring-focus-ring-default');
      }
      return cn(base, 'ring-0');
    },
    get rootClasses() {
      return cn(
        'flex w-full flex-col gap-2',
        props.disabled && 'pointer-events-none opacity-50',
        props.className
      );
    },
    get filledWidth() {
      return state.percent + '%';
    },
    get thumbOffset() {
      return state.percent + '%';
    },
    commitValue(nextValue) {
      if (props.disabled || Number.isNaN(nextValue)) {
        return;
      }
      const lower = props.min ?? 0;
      const upper = props.max ?? 100;
      const configuredIncrement = props.step ?? 1;
      const increment = configuredIncrement > 0 ? configuredIncrement : 1;
      const bounded = Math.min(Math.max(nextValue, lower), upper);
      const snapped = lower + Math.round((bounded - lower) / increment) * increment;
      const clamped = Math.min(Math.max(snapped, lower), upper);
      const rounded = Math.round(clamped * 1000000) / 1000000;
      state.internalValue = rounded;
      if (props.onInput) {
        props.onInput(rounded);
      }
      if (props.onChange) {
        props.onChange(rounded);
      }
    },
    handleInput(event) {
      const target = event.target as HTMLInputElement;
      if (!target) {
        return;
      }
      state.commitValue(Number(target.value));
    },
    handleChange(event) {
      state.handleInput(event);
    },
    handleFocus() {
      state.focused = true;
    },
    handleBlur() {
      state.focused = false;
    },
    handleMouseEnter() {
      if (!props.disabled) {
        state.hovered = true;
      }
    },
    handleMouseLeave() {
      state.hovered = false;
    },
  });

  return (
    <div
      class={state.rootClasses}
      onMouseEnter={() => state.handleMouseEnter()}
      onMouseLeave={() => state.handleMouseLeave()}
    >
      <Show when={state.hasHeader}>
        <div class="flex items-center justify-between gap-2">
          <Show when={props.label}>
            <label
              htmlFor={props.id}
              class="text-sm font-medium text-foreground-default"
            >
              {props.label}
            </label>
          </Show>
          <Show when={props.showValue}>
            <span class="text-sm font-medium text-foreground-muted">
              {state.displayValue}
            </span>
          </Show>
        </div>
      </Show>

      <div class="relative flex h-5 w-full items-center">
        <div class="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-background-muted" />

        <div
          class="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary-default"
          style={{ width: state.filledWidth }}
        />

        <input
          type="range"
          id={props.id}
          name={props.name}
          min={props.min}
          max={props.max}
          step={props.step}
          value={state.currentValue}
          disabled={props.disabled}
          aria-label={state.accessibleName}
          aria-valuetext={state.displayValue}
          class="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer bg-transparent opacity-0 disabled:cursor-not-allowed"
          onInput={(event) => state.handleInput(event)}
          onChange={(event) => state.handleChange(event)}
          onFocus={() => state.handleFocus()}
          onBlur={() => state.handleBlur()}
        />

        <div class={state.thumbClasses} style={{ left: state.thumbOffset }} />
      </div>

      <Show when={props.showRange}>
        <div class="flex items-center justify-between text-xs text-foreground-muted">
          <span>{state.minLabel}</span>
          <span>{state.maxLabel}</span>
        </div>
      </Show>
    </div>
  );
}
