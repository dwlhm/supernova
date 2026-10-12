import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SwitchButtonProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function SwitchButton(props: SwitchButtonProps) {
  useDefaultProps({
    checked: false,
    disabled: false,
    size: 'medium',
    label: 'Label',
    leftLabel: false,
    rightLabel: true,
    className: '',
  });

  const state = useStore({
    get trackClasses() {
      switch (props.size) {
        case 'small':
          return 'h-5 w-9 p-0.5';
        case 'large':
          return 'h-7 w-12 p-0.5';
        case 'medium':
        default:
          return 'h-6 w-11 p-0.5';
      }
    },
    get thumbClasses() {
      switch (props.size) {
        case 'small':
          return 'h-4 w-4';
        case 'large':
          return 'h-6 w-6';
        case 'medium':
        default:
          return 'h-5 w-5';
      }
    },
    get thumbTransform() {
      if (!props.checked) {
        return 'translate-x-0';
      }
      switch (props.size) {
        case 'small':
          return 'translate-x-4';
        case 'large':
          return 'translate-x-5';
        case 'medium':
        default:
          return 'translate-x-5';
      }
    },
    get trackColor() {
      return props.checked
        ? 'bg-components-switch-on-color-track-background-default'
        : 'bg-components-switch-off-color-track-background-default';
    },
    get hasLabel() {
      return props.label !== '';
    },
    toggle() {
      if (props.disabled) {
        return;
      }
      if (props.onCheckedChange) {
        props.onCheckedChange(!props.checked);
      }
    },
  });

  return (
    <span class={cn('inline-flex items-center gap-2', props.disabled && 'opacity-50', props.className)}>
      <Show when={props.leftLabel && state.hasLabel}>
        <span class="text-sm text-foreground-default">{props.label}</span>
      </Show>
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        aria-label={state.hasLabel ? props.label : 'Toggle setting'}
        disabled={props.disabled}
        class={cn(
          'relative inline-flex shrink-0 items-center rounded-rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none',
          state.trackClasses,
          state.trackColor
        )}
        onClick={() => state.toggle()}
      >
        <span
          class={cn(
            'inline-block rounded-rounded-full bg-components-switch-on-color-thumb-background-default shadow-sm transition-transform',
            state.thumbClasses,
            state.thumbTransform
          )}
          aria-hidden="true"
        />
      </button>
      <Show when={props.rightLabel && state.hasLabel}>
        <span class="text-sm text-foreground-default">{props.label}</span>
      </Show>
    </span>
  );
}
