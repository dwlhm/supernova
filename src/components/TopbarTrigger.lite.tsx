import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TopbarTriggerProps {
  ariaLabel?: string;
  disabled?: boolean;
  icon?: any;
  className?: string;
  onClick?: () => void;
}

export default function TopbarTrigger(props: TopbarTriggerProps) {
  useDefaultProps({
    ariaLabel: 'Toggle sidebar',
    disabled: false,
    className: '',
  });

  return (
    <button
      type="button"
      disabled={props.disabled}
      aria-disabled={props.disabled}
      aria-label={props.ariaLabel}
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md px-2 text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]',
        props.className
      )}
      onClick={() => !props.disabled && props.onClick && props.onClick()}
    >
      {props.icon}
      <Show when={!props.icon}>
        <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" stroke-linecap="round" />
        </svg>
      </Show>
    </button>
  );
}
