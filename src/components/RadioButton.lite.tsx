import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';

export interface RadioButtonProps {
  id?: string;
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
  name?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onBlur?: (event: unknown) => void;
}

export default function RadioButton(props: RadioButtonProps) {
  useDefaultProps({
    id: 'radio-button', checked: false, disabled: false, required: false, error: false, errorMessage: '', validating: false, size: 'medium',
    labelPosition: 'right', leftLabel: false, rightLabel: false, name: '', value: '', ariaLabel: '', className: '',
  });

  return (
    <label
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'inline-flex items-center gap-2',
        props.labelPosition === 'left' || (props.leftLabel && !props.rightLabel) ? 'flex-row-reverse justify-end' : 'flex-row justify-start',
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        props.className
      )}
    >
      <span class="relative inline-flex shrink-0 items-center justify-center">
        <input
          id={props.id}
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={props.error || Boolean(props.errorMessage) || undefined}
          aria-label={props.ariaLabel || undefined}
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed"
          onChange={() => !props.disabled && (props.onChange ? props.onChange(props.value || '') : props.onValueChange && props.onValueChange(props.value || ''))}
          onBlur={(event) => !props.disabled && props.onBlur && props.onBlur(event)}
        />
        <span
          aria-hidden="true"
          class={cn(
            'inline-flex items-center justify-center rounded-full border bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary',
            cva(props.size, { small: 'h-3 w-3', medium: 'h-3.5 w-3.5', large: 'h-4 w-4' }, 'medium'),
            props.checked ? 'border-primary-default' : 'border-border-default'
          )}
        >
          <Show when={props.checked}>
            <span
              class={cn(
                'rounded-full bg-primary-default',
                cva(props.size, { small: 'h-1.5 w-1.5', medium: 'h-2 w-2', large: 'h-2.5 w-2.5' }, 'medium')
              )}
            />
          </Show>
        </span>
      </span>
      <Show when={props.children}>
        <span class="text-sm text-foreground-default">{props.children}</span>
      </Show>
    </label>
  );
}
