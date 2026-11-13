import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, ICON_PATHS, bindControllerProps } from './utils';

export interface ToggleProps {
  pressed?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showIcon?: boolean;
  icon?: any;
  className?: string;
  children?: any;
  ariaLabel?: string;
  onPressedChange?: (pressed: boolean) => void;
  onClick?: () => void;
}

export default function Toggle(props: ToggleProps) {
  useDefaultProps({
    pressed: false,
    disabled: false,
    size: 'medium',
    showText: false,
    showIcon: false,
    className: '',
    ariaLabel: '',
  });

  return (
    <button
      type="button"
      data-ctrl={typeof bindControllerProps}
      aria-pressed={props.pressed}
      aria-disabled={props.disabled}
      aria-label={props.ariaLabel || undefined}
      disabled={props.disabled}
      class={cn(
        'inline-flex flex-row items-center justify-center rounded-lg font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]',
        props.pressed
          ? 'bg-background-muted text-foreground-default shadow-sm'
          : cn('bg-transparent text-foreground-default', !props.disabled && 'hover:bg-background-muted active:bg-background-interactive'),
        props.showText
          ? cva(props.size, { small: 'min-w-5 h-5 px-2 py-1 gap-1.5 text-xs', medium: 'min-w-6 h-6 px-3 py-1.5 gap-2 text-sm', large: 'min-w-9 h-9 px-4 py-2 gap-2.5 text-base' }, 'medium')
          : cva(props.size, { small: 'min-w-5 h-5 px-1.5 py-0.5 gap-1 text-xs', medium: 'min-w-6 h-6 px-2 py-1 gap-1 text-sm', large: 'min-w-9 h-9 px-3 py-1.5 gap-1 text-base' }, 'medium'),
        props.className
      )}
      onClick={() => !props.disabled && (props.onPressedChange ? props.onPressedChange(!props.pressed) : props.onClick && props.onClick())}
    >
      {props.icon}
      <Show when={props.showIcon && !props.icon}>
        <svg aria-hidden="true" class={cn('shrink-0', cva(props.size, { small: 'h-3 w-3', medium: 'h-4 w-4', large: 'h-5 w-5' }, 'medium'))} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.plus} stroke-linecap="round" />
        </svg>
      </Show>
      <Show when={props.children}>
        <span class="truncate font-medium">{props.children}</span>
      </Show>
    </button>
  );
}
