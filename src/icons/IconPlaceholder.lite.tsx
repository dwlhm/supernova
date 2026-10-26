import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface IconPlaceholderProps {
  /** Icon size token: 12px, 16px, or 20px */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function IconPlaceholder(props: IconPlaceholderProps) {
  useDefaultProps({
    size: 'md',
    className: '',
  });

  const state = useStore({
    get sizeClasses() {
      switch (props.size) {
        case 'sm':
          return 'h-3 w-3';
        case 'lg':
          return 'h-5 w-5';
        case 'md':
        default:
          return 'h-4 w-4';
      }
    },
    get strokeWidth() {
      switch (props.size) {
        case 'sm':
          return '1.25';
        case 'lg':
          return '1.75';
        case 'md':
        default:
          return '1.5';
      }
    },
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width={state.strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
      aria-hidden="true"
      class={cn(
        'inline-block shrink-0 align-middle text-foreground-default',
        state.sizeClasses,
        props.className
      )}
    >
      <circle cx="8" cy="8" r="6.75" />
    </svg>
  );
}
