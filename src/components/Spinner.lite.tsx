import { useDefaultProps } from '@builder.io/mitosis';
import { cn, cva } from './utils';

export interface SpinnerProps {
  size?: '12' | '16' | '24' | '32';
  ariaLabel?: string;
  className?: string;
}

export default function Spinner(props: SpinnerProps) {
  useDefaultProps({
    size: '24',
    ariaLabel: 'Loading',
    className: '',
  });

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={props.ariaLabel}
      class={cn('inline-flex flex-row items-center justify-center gap-2', props.className)}
    >
      <svg
        aria-hidden="true"
        class={cn(
          'animate-spin text-primary-default',
          cva(props.size, { '12': 'h-3 w-3', '16': 'h-4 w-4', '24': 'h-6 w-6', '32': 'h-8 w-8' }, '24')
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span class="sr-only">{props.ariaLabel}</span>
    </span>
  );
}
