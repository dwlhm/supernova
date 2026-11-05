import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, ICON_PATHS } from './utils';

export interface ButtonProps {
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'large' | 'regular' | 'small' | 'mini';
  roundness?: 'default' | 'round';
  disabled?: boolean;
  showLabel?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  useDefaultProps({
    label: 'Label', type: 'button', variant: 'primary', size: 'regular', roundness: 'default',
    disabled: false, showLabel: true, showLeftIcon: false, showRightIcon: false, ariaLabel: '', className: '',
  });

  return (
    <button
      type={props.type || 'button'}
      disabled={props.disabled}
      aria-disabled={props.disabled}
      aria-label={props.ariaLabel !== '' ? props.ariaLabel : !props.showLabel ? props.label : undefined}
      class={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none',
        cva(props.variant, {
          primary: 'bg-primary-default text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed',
          secondary: 'bg-secondary-default text-secondary-foreground shadow-xs hover:bg-secondary-hover active:bg-background-interactive focus-visible:bg-secondary-hover',
          outline: 'border border-border-default bg-background-default text-foreground-default shadow-xs hover:bg-background-muted active:bg-background-interactive focus-visible:border-primary-border-emphasis',
          ghost: 'bg-ghost-default text-foreground-default hover:bg-ghost-hover',
          destructive: 'bg-destructive-background text-primary-foreground shadow-xs hover:bg-destructive-hover active:bg-destructive-pressed focus-visible:ring-focus-ring-error',
          link: 'bg-ghost-default text-primary-muted underline-offset-4 hover:underline hover:text-primary-on-surface',
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
      <Show when={props.showLeftIcon}>
        <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.plus} stroke-linecap="round" />
        </svg>
      </Show>
      <Show when={props.showLabel && (!props.children || props.label !== 'Label')}>
        <span class="truncate">{props.label}</span>
      </Show>
      {props.children}
      <Show when={props.showRightIcon}>
        <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.arrowRight} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Show>
    </button>
  );
}
