import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TableEmptyProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  showIcon?: boolean;
  className?: string;
  onCtaClick?: () => void;
}

export default function TableEmpty(props: TableEmptyProps) {
  useDefaultProps({
    title: '',
    description: '',
    ctaLabel: '',
    showIcon: true,
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      class={cn('flex flex-col items-center justify-center gap-4 rounded-lg bg-background-default px-8 py-10 text-center', props.className)}
    >
      <Show when={props.showIcon}>
        <span class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background-muted" aria-hidden="true">
          <svg class="h-6 w-6 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={ICON_PATHS.search} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Show>
      <div class="flex flex-col items-center justify-center gap-2">
        <Show when={props.title}>
          <span class="text-center text-base font-semibold text-foreground-default">{props.title}</span>
        </Show>
        <Show when={props.description}>
          <span class="max-w-sm text-center text-sm font-normal text-foreground-muted">{props.description}</span>
        </Show>
      </div>
      <Show when={props.ctaLabel}>
        <button
          type="button"
          class="flex flex-row items-center justify-center gap-2 rounded-lg bg-secondary-default px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={() => props.onCtaClick && props.onCtaClick()}
        >
          {props.ctaLabel}
        </button>
      </Show>
    </div>
  );
}