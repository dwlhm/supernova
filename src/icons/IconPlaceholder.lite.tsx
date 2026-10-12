import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface IconPlaceholderProps {
  size?: number;
  ariaLabel?: string;
  className?: string;
}

export default function IconPlaceholder(props: IconPlaceholderProps) {
  useDefaultProps({
    size: 16,
    ariaLabel: 'Placeholder icon',
    className: '',
  });

  const state = useStore({
    get dimensionStyle() {
      return { width: props.size + 'px', height: props.size + 'px' };
    },
  });

  return (
    <span
      role="img"
      aria-label={props.ariaLabel}
      class={cn('inline-flex shrink-0 items-center justify-center', props.className)}
      style={state.dimensionStyle}
    >
      <svg
        class="h-full w-full text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 17 17 7" stroke-linecap="round" />
      </svg>
    </span>
  );
}
