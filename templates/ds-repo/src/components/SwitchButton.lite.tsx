import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, getChoiceState, bindControllerProps } from './utils';

export interface SwitchButtonProps {
  id?: string;
  name?: string;
  value?: string;
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
    id: 'switch-button', name: 'switch', value: 'on', checked: false, disabled: false,
    size: 'medium', label: 'Label', leftLabel: false, rightLabel: false, className: '',
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      class={cn('inline-flex items-center gap-2', props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', props.className)}
      onClick={() => !props.disabled && props.onCheckedChange && props.onCheckedChange(!props.checked)}
    >
      <Show when={getChoiceState(props).showLeft}>
        <span class="text-sm text-foreground-default">{props.label}</span>
      </Show>
      <button
        id={props.id} type="button" role="switch" aria-checked={props.checked}
        aria-label={getChoiceState(props).hasLabel ? props.label : 'Toggle setting'}
        disabled={props.disabled}
        class={cn(
          'relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none',
          cva(props.size, { small: 'h-5 w-9 p-0.5', medium: 'h-6 w-11 p-0.5', large: 'h-8 w-[52px] p-1' }, 'medium'),
          props.checked ? 'bg-primary-default' : 'bg-background-interactive'
        )}
      >
        <span
          aria-hidden="true"
          class={cn(
            'inline-block rounded-full bg-background-default shadow-sm transition-transform',
            cva(props.size, { small: 'h-4 w-4', medium: 'h-5 w-5', large: 'h-6 w-6' }, 'medium'),
            props.checked ? cva(props.size, { small: 'translate-x-4', medium: 'translate-x-5', large: 'translate-x-5' }, 'medium') : 'translate-x-0'
          )}
        />
      </button>
      <Show when={getChoiceState(props).showRight}>
        <span class="text-sm text-foreground-default">{props.label}</span>
      </Show>
    </span>
  );
}
