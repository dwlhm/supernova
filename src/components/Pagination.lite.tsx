import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getPaginationState, ICON_PATHS, bindControllerProps } from './utils';

export interface PaginationEntry { key: string; label: string; page: number; isCurrent: boolean; isEllipsis: boolean; }

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {
  useDefaultProps({
    currentPage: 1, totalPages: 1, previousLabel: 'Previous', nextLabel: 'Next', className: '',
  });

  return (
    <nav data-ctrl={typeof bindControllerProps} aria-label="Pagination" class={cn('flex items-center gap-1', props.className)}>
      <button
        type="button"
        disabled={!getPaginationState(props.currentPage, props.totalPages).canPrev}
        aria-label={props.previousLabel}
        class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => getPaginationState(props.currentPage, props.totalPages).canPrev && props.onPageChange && props.onPageChange(getPaginationState(props.currentPage, props.totalPages).current - 1)}
      >
        <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.chevronLeft} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="hidden sm:inline">{props.previousLabel}</span>
      </button>
      <ol class="flex items-center gap-1">
        <For each={getPaginationState(props.currentPage, props.totalPages).entries}>
          {(entry) => (
            <li key={entry.key}>
              <Show when={entry.isEllipsis}>
                <span class="inline-flex h-9 w-9 items-center justify-center text-sm text-foreground-default" aria-hidden="true">{entry.label}</span>
              </Show>
              <Show when={!entry.isEllipsis}>
                <button
                  type="button"
                  aria-current={entry.isCurrent ? 'page' : undefined}
                  aria-label={'Page ' + entry.label}
                  class={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                    entry.isCurrent
                      ? 'border-border-default bg-background-default text-foreground-default shadow-xs'
                      : 'border-transparent bg-transparent text-foreground-default hover:bg-background-muted'
                  )}
                  onClick={() => !entry.isCurrent && props.onPageChange && props.onPageChange(entry.page)}
                >
                  {entry.label}
                </button>
              </Show>
            </li>
          )}
        </For>
      </ol>
      <button
        type="button"
        disabled={!getPaginationState(props.currentPage, props.totalPages).canNext}
        aria-label={props.nextLabel}
        class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => getPaginationState(props.currentPage, props.totalPages).canNext && props.onPageChange && props.onPageChange(getPaginationState(props.currentPage, props.totalPages).current + 1)}
      >
        <span class="hidden sm:inline">{props.nextLabel}</span>
        <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
