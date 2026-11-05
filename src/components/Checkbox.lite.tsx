import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, getChoiceState, ICON_PATHS, bindControllerProps } from './utils';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  useDefaultProps({
    id: 'checkbox', checked: false, indeterminate: false, disabled: false, required: false,
    size: 'medium', label: 'Label', leftLabel: false, rightLabel: false, name: 'checkbox', value: '', className: '',
  });

  return (
    <label
      data-ctrl={typeof bindControllerProps}
      class={cn('inline-flex items-center', cva(props.size, { small: 'gap-1.5', medium: 'gap-2', large: 'gap-2.5' }, 'medium'), props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', props.className)}
    >
      <Show when={getChoiceState(props).showLeft}>
        <span class="text-sm text-foreground-default">{props.label}</span>
      </Show>
      <span class="relative inline-flex shrink-0 items-center justify-center">
        <input
          id={props.id} type="checkbox" name={props.name} value={props.value} checked={props.checked}
          disabled={props.disabled} required={props.required}
          aria-checked={props.indeterminate ? 'mixed' : props.checked}
          aria-label={!getChoiceState(props).showLeft && !getChoiceState(props).showRight ? (props.label || 'Checkbox') : undefined}
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
          onChange={() => !props.disabled && props.onCheckedChange && props.onCheckedChange(!props.checked)}
        />
        <span
          aria-hidden="true"
          class={cn(
            'inline-flex items-center justify-center rounded-sm border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary',
            cva(props.size, { small: 'h-3.5 w-3.5', medium: 'h-4 w-4', large: 'h-5 w-5' }, 'medium'),
            props.checked || props.indeterminate
              ? 'border-primary-default bg-primary-default text-primary-foreground'
              : 'border-border-default bg-background-default'
          )}
        >
          <Show when={props.checked || props.indeterminate}>
            <svg class={cn('shrink-0', cva(props.size, { small: 'h-2.5 w-2.5', medium: 'h-3 w-3', large: 'h-3.5 w-3.5' }, 'medium'))} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d={props.indeterminate ? ICON_PATHS.minus : ICON_PATHS.check} stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Show>
        </span>
      </span>
      <Show when={getChoiceState(props).showRight}>
        <span class="text-sm text-foreground-default">{props.label}</span>
      </Show>
    </label>
  );
}
