import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, ICON_PATHS } from './utils';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'large' | 'regular' | 'small' | 'mini';
  roundness?: 'default' | 'round';
  disabled?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  useDefaultProps({
    type: 'button', variant: 'primary', size: 'regular', roundness: 'default',
    disabled: false, showLeftIcon: false, showRightIcon: false,
    ariaLabel: '', className: '',
  });

  return (
    <button
      type={props.type || 'button'}
      disabled={props.disabled}
      aria-disabled={props.disabled}
      aria-label={props.ariaLabel || undefined}
      class={cn(
        'inline-flex items-center justify-center font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]',
        cva(props.variant, {
          primary: cn('bg-primary-default text-primary-foreground shadow-xs', !props.disabled && 'hover:bg-primary-hover active:bg-primary-pressed'),
          secondary: cn('bg-secondary-default text-secondary-foreground shadow-xs focus-visible:bg-secondary-hover', !props.disabled && 'hover:bg-secondary-hover active:bg-background-interactive'),
          outline: cn('border border-border-default bg-background-default text-foreground-default shadow-xs focus-visible:border-primary-border-emphasis', !props.disabled && 'hover:bg-background-muted active:bg-background-interactive'),
          ghost: cn('bg-ghost-default text-foreground-default', !props.disabled && 'hover:bg-ghost-hover active:bg-background-interactive'),
          destructive: cn('bg-destructive-background text-primary-foreground shadow-xs focus-visible:ring-focus-ring-error', !props.disabled && 'hover:bg-destructive-hover active:bg-destructive-pressed'),
          link: cn('bg-ghost-default text-primary-muted underline-offset-4', !props.disabled && 'hover:underline hover:text-primary-on-surface active:text-primary-pressed'),
        }, 'primary'),
        cva(props.size, {
          large: 'h-10 px-6 text-base gap-2',
          regular: 'h-9 px-4 text-sm gap-2',
          small: 'h-8 px-3 text-sm gap-1.5',
          mini: 'h-6 px-2 text-xs gap-1.5',
        }, 'regular'),
        props.roundness === 'round' ? 'rounded-full' : 'rounded-lg',
        props.className
      )}
      onClick={() => !props.disabled && props.onClick && props.onClick()}
    >
      {props.leftIcon}
      <Show when={props.showLeftIcon && !props.leftIcon}>
        <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.plus} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Show>
      {props.children}
      {props.rightIcon}
      <Show when={props.showRightIcon && !props.rightIcon}>
        <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.arrowRight} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Show>
    </button>
  );
}
