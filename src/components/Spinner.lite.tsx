import { useDefaultProps } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';

export interface SpinnerProps {
  size?: '12' | '16' | '24' | '32';
  label?: string;
  className?: string;
}

export default function Spinner(props: SpinnerProps) {
  useDefaultProps({
    size: '12', label: 'Loading', className: '',
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      role="status"
      aria-live="polite"
      class={cn('inline-flex items-center justify-center', props.className)}
    >
      <svg
        aria-hidden="true"
        class={cn(
          'animate-spin text-primary-default',
          cva(props.size, { '12': 'h-3 w-3', '16': 'h-4 w-4', '24': 'h-6 w-6', '32': 'h-8 w-8' }, '12')
        )}
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
