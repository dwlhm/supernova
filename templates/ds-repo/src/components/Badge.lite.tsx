import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BadgeProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline';
  className?: string;
  children?: any;
}

export default function Badge(props: BadgeProps) {
  useDefaultProps({
    label: 'Badge',
    variant: 'primary',
    className: '',
  });

  const state = useStore({
    get variantClasses() {
      switch (props.variant) {
        case 'secondary':
          return 'bg-components-badge-secondary-color-container-background-default text-components-badge-secondary-color-label-foreground-default';
        case 'destructive':
          return 'bg-components-badge-destructive-color-container-background-default text-components-badge-destructive-color-label-foreground-default';
        case 'success':
          return 'bg-components-badge-success-color-container-background-default text-components-badge-success-color-label-foreground-default';
        case 'warning':
          return 'bg-components-badge-warning-color-container-background-default text-components-badge-warning-color-label-foreground-default';
        case 'info':
          return 'bg-components-badge-info-color-container-background-default text-components-badge-info-color-label-foreground-default';
        case 'outline':
          return 'bg-components-badge-outline-color-container-background-default text-components-badge-outline-color-label-foreground-default border border-components-badge-outline-color-container-border-default';
        case 'primary':
        default:
          return 'bg-components-badge-primary-color-container-background-default text-components-badge-primary-color-label-foreground-default';
      }
    },
  });

  return (
    <span
      class={cn(
        'inline-flex max-w-full items-center gap-1 rounded-rounded-full px-2 py-0.5 text-xs font-medium leading-none',
        state.variantClasses,
        props.className
      )}
    >
      <Show when={props.children} else={<span class="truncate">{props.label}</span>}>
        {props.children}
      </Show>
    </span>
  );
}
