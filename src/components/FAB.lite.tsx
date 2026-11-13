import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, ICON_PATHS } from './utils';

export interface FABProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'regular' | 'large' | 'extended';
  placement?: 'inline' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  disabled?: boolean;
  showIcon?: boolean;
  icon?: any;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function FAB(props: FABProps) {
  useDefaultProps({
    type: 'button', variant: 'primary', size: 'small', placement: 'inline',
    disabled: false, showIcon: true, ariaLabel: 'Action', className: '',
  });

  return (
    <button
      type={props.type || 'button'}
      aria-label={props.ariaLabel || 'Action'}
      disabled={props.disabled}
      aria-disabled={props.disabled}
      class={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-md active:scale-[0.97]',
        cva(props.variant, {
          primary: cn('bg-primary-default text-primary-foreground', !props.disabled && 'hover:bg-primary-hover active:bg-primary-pressed'),
          secondary: cn('bg-secondary-default text-secondary-foreground', !props.disabled && 'hover:bg-secondary-hover active:bg-background-interactive'),
          outline: cn('border border-border-default bg-background-default text-foreground-default', !props.disabled && 'hover:bg-background-muted active:bg-background-interactive'),
        }, 'primary'),
        cva(props.size, { small: 'h-10 w-10', regular: 'h-14 w-14', large: 'h-24 w-24', extended: 'h-10 w-auto gap-3 px-4 py-2' }, 'small'),
        cva(props.placement, { inline: '', 'top-left': 'fixed top-4 left-4 z-40', 'top-center': 'fixed top-4 left-1/2 z-40 -translate-x-1/2', 'top-right': 'fixed top-4 right-4 z-40', 'bottom-left': 'fixed bottom-4 left-4 z-40', 'bottom-center': 'fixed bottom-4 left-1/2 z-40 -translate-x-1/2', 'bottom-right': 'fixed bottom-4 right-4 z-40' }, 'inline'),
        props.className
      )}
      onClick={() => !props.disabled && props.onClick && props.onClick()}
    >
      <Show when={props.showIcon !== false}>
        {props.icon}
        <Show when={!props.icon}>
          <svg aria-hidden="true" class={cn('shrink-0', cva(props.size, { small: 'h-4 w-4', regular: 'h-5 w-5', large: 'h-7 w-7', extended: 'h-5 w-5' }, 'small'))} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.plus} stroke-linecap="round" />
          </svg>
        </Show>
      </Show>
      <Show when={props.size === 'extended'}>
        <span class="truncate text-sm font-medium">{props.children}</span>
      </Show>
    </button>
  );
}
