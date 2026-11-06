import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, ICON_PATHS, bindControllerProps } from './utils';

export interface ToggleProps {
  pressed?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showIcon?: boolean;
  className?: string;
  children?: any;
  ariaLabel?: string;
  onPressedChange?: (pressed: boolean) => void;
}

export default function Toggle(props: ToggleProps) {
  useDefaultProps({
    pressed: false,
    disabled: false,
    size: 'medium',
    showText: false,
    showIcon: true,
    className: '',
    ariaLabel: 'Toggle',
  });

  return (
    <button
      type="button"
      data-ctrl={typeof bindControllerProps}
      aria-pressed={props.pressed}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      class={cn(
        'inline-flex flex-row items-center justify-center rounded-lg text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        props.showText
          ? cva(props.size, { small: 'px-2 py-1 gap-1.5 text-xs', medium: 'px-3 py-1.5 gap-2 text-sm', large: 'px-4 py-2 gap-2.5 text-base' }, 'medium')
          : cva(props.size, { small: 'h-4 w-4 gap-0.5 px-0.5 py-0.5', medium: 'h-6 w-6 gap-1 px-1 py-1', large: 'h-9 w-9 gap-1 px-2 py-2' }, 'medium'),
        props.pressed ? 'bg-background-muted shadow-sm' : 'bg-transparent',
        props.className
      )}
      onClick={() => !props.disabled && props.onPressedChange && props.onPressedChange(!props.pressed)}
    >
      <Show when={props.showIcon}>
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
