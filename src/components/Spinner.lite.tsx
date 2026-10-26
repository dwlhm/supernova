import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SpinnerProps {
  /**
   * Icon dimension in pixels. Maps to the Spinner size variants (12 | 16 | 24 | 32).
   * Default recommendation from the design system is 24.
   */
  size?: '12' | '16' | '24' | '32';
  /**
   * Stroke color of the indicator.
   * - `primary` uses the Spinner icon stroke token (semantic primary/default).
   * - `inherit` inherits `currentColor` from the parent (e.g. inside a primary button).
   * - `inverse` uses the inverse/on-primary foreground token.
   */
  tone?: 'primary' | 'inherit' | 'inverse';
  /** Accessible, screen-reader-only status text. Defaults to "Loading". */
  label?: string;
  className?: string;
}

export default function Spinner(props: SpinnerProps) {
  useDefaultProps({
    size: '24',
    tone: 'primary',
    label: 'Loading',
    className: '',
  });

  const state = useStore({
    get sizeClasses() {
      switch (props.size) {
        case '12':
          return 'w-3 h-3';
        case '16':
          return 'w-4 h-4';
        case '32':
          return 'w-8 h-8';
        case '24':
        default:
          return 'w-6 h-6';
      }
    },
    get toneClasses() {
      switch (props.tone) {
        case 'inherit':
          return '';
        case 'inverse':
          return 'text-primary-foreground';
        case 'primary':
        default:
          return 'text-primary-default';
      }
    },
    get strokeWidth() {
      switch (props.size) {
        case '12':
          return 1.5;
        case '32':
          return 2.5;
        case '16':
        case '24':
        default:
          return 2;
      }
    },
    get labelText() {
      return props.label && props.label.length > 0 ? props.label : 'Loading';
    },
  });

  return (
    <span
      role="status"
      aria-live="polite"
      class={cn('inline-flex shrink-0 items-center justify-center', props.className)}
    >
      <svg
        class={cn('animate-spin', state.sizeClasses, state.toneClasses)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width={state.strokeWidth} class="opacity-25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          stroke-width={state.strokeWidth}
          stroke-linecap="round"
        />
      </svg>
      <span class="sr-only">{state.labelText}</span>
    </span>
  );
}
