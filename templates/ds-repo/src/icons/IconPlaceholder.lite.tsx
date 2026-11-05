import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface IconPlaceholderProps {
  size?: number;
  ariaLabel?: string;
  className?: string;
}

export default function IconPlaceholder(props: IconPlaceholderProps) {
  useDefaultProps({
    size: 12,
    ariaLabel: 'Placeholder icon',
    className: '',
  });

  return (
    <svg
      data-ctrl={typeof bindControllerProps}
      role="img"
      aria-label={props.ariaLabel}
      width={props.size}
      height={props.size}
      class={cn('inline-block shrink-0 text-foreground-muted', props.className)}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
    >
      <circle cx="6" cy="6" r="5" />
    </svg>
  );
}
