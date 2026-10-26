import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BadgeProps {
  /** Short, sentence-case label displayed inside the badge. */
  label?: string;
  /** Semantic meaning of the badge. */
  variant?: 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline';
  /** Additional CSS classes applied to the badge container. */
  className?: string;
  /** Optional custom content rendered instead of `label` (e.g. a leading dot or icon). */
  children?: any;
}

export default function Badge(props: BadgeProps) {
  useDefaultProps({
    label: 'Badge',
    variant: 'primary',
    className: '',
  });

  const state = useStore({
    get hasCustomContent() {
      return props.children !== undefined && props.children !== null && props.children !== false;
    },
    get variantClasses() {
      switch (props.variant) {
        case 'secondary':
          return 'bg-secondary-default text-secondary-foreground border-transparent';
        case 'destructive':
          return 'bg-destructive-subtle text-destructive-foreground border-transparent';
        case 'success':
          return 'bg-success-subtle text-success-foreground border-transparent';
        case 'warning':
          return 'bg-warning-subtle text-warning-foreground border-transparent';
        case 'info':
          return 'bg-info-subtle text-info-foreground border-transparent';
        case 'outline':
          return 'bg-background-default text-foreground-default border-border-default';
        case 'primary':
        default:
          return 'bg-primary-subtle text-primary-subtle-foreground border-transparent';
      }
    },
  });

  return (
    <span
      class={cn(
        'inline-flex flex-row items-center justify-center gap-1 px-2 py-0.5 border rounded-full text-xs font-medium leading-none whitespace-nowrap shrink-0',
        state.variantClasses,
        props.className,
      )}
    >
      <Show when={state.hasCustomContent} else={<span>{props.label}</span>}>
        {props.children}
      </Show>
    </span>
  );
}
