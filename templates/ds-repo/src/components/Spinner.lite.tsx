import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SpinnerProps {
  size?: '12' | '16' | '24' | '32';
  label?: string;
  className?: string;
}

export default function Spinner(props: SpinnerProps) {
  useDefaultProps({
    size: '24',
    label: 'Loading',
    className: '',
  });

  const state = useStore({
    get sizeClasses() {
      switch (props.size) {
        case '12':
          return 'h-3 w-3';
        case '16':
          return 'h-4 w-4';
        case '32':
          return 'h-8 w-8';
        case '24':
        default:
          return 'h-6 w-6';
      }
    },
  });

  return (
    <span
      role="status"
      aria-live="polite"
      class={cn('inline-flex items-center justify-center', props.className)}
    >
      <svg
        aria-hidden="true"
        class={cn('animate-spin text-components-spinner-all-color-icon-stroke-default', state.sizeClasses)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" class="opacity-25" />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span class="sr-only">{props.label}</span>
    </span>
  );
}
