import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';

export interface SwitchButtonProps {
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  size?: 'small' | 'medium' | 'large';
  labelPosition?: 'left' | 'right';
  leftLabel?: boolean;
  rightLabel?: boolean;
  ariaLabel?: string;
  children?: any;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
  onValueChange?: (checked: boolean) => void;
  onBlur?: (event: unknown) => void;
}

export default function SwitchButton(props: SwitchButtonProps) {
  useDefaultProps({
    id: 'switch-button', name: 'switch', value: 'on', checked: false, disabled: false, required: false, error: false, errorMessage: '', validating: false,
    size: 'medium', labelPosition: 'right', leftLabel: false, rightLabel: false, ariaLabel: '', className: '',
  });

  return (
    <label
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'inline-flex items-center gap-2',
        props.labelPosition === 'left' || (props.leftLabel && !props.rightLabel) ? 'flex-row-reverse' : 'flex-row',
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        props.className
      )}
    >
      <button
        id={props.id}
        type="button"
        role="switch"
        aria-checked={props.checked}
        aria-invalid={props.error || Boolean(props.errorMessage) || undefined}
        aria-label={props.ariaLabel || undefined}
        disabled={props.disabled}
        class={cn(
          'relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none',
          cva(props.size, { small: 'h-5 w-9 p-0.5', medium: 'h-6 w-11 p-0.5', large: 'h-8 w-14 p-0.5' }, 'medium'),
          props.checked ? 'bg-primary-default' : 'bg-background-interactive'
        )}
        onClick={() => !props.disabled && (props.onCheckedChange ? props.onCheckedChange(!props.checked) : props.onValueChange && props.onValueChange(!props.checked))}
        onBlur={(event) => !props.disabled && props.onBlur && props.onBlur(event)}
      >
        <span
          aria-hidden="true"
          class={cn(
            'inline-block rounded-full bg-background-default shadow-sm transition-transform',
            cva(props.size, { small: 'h-4 w-4', medium: 'h-5 w-5', large: 'h-7 w-7' }, 'medium'),
            props.checked ? cva(props.size, { small: 'translate-x-4', medium: 'translate-x-5', large: 'translate-x-6' }, 'medium') : 'translate-x-0'
          )}
        />
      </button>
      <Show when={props.children}>
        <span class="text-sm text-foreground-default">{props.children}</span>
      </Show>
    </label>
  );
}
