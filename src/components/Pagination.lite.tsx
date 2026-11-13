import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getPaginationState, ICON_PATHS, bindControllerProps } from './utils';

export interface PaginationEntry { key: string; label: string; ariaLabel?: string; page: number; isCurrent: boolean; isEllipsis: boolean; }

export interface PaginationProps {
  currentPage?: number; totalPages?: number; previousLabel?: string; nextLabel?: string;
  ariaLabel?: string; prevIcon?: any; nextIcon?: any; getPageAriaLabel?: (page: number) => string;
  className?: string; onPageChange?: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {
  useDefaultProps({
    currentPage: 1, totalPages: 1, previousLabel: 'Previous', nextLabel: 'Next', ariaLabel: 'Pagination', className: '',
  });

  return (
    <nav data-ctrl={typeof bindControllerProps} aria-label={props.ariaLabel} class={cn('flex items-center gap-1', props.className)}>
      <button
        type="button" disabled={!getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).canPrev} aria-label={props.previousLabel}
        class={cn(
          'inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).canPrev ? 'cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]' : 'cursor-not-allowed opacity-50'
        )}
        onClick={() => getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).canPrev && props.onPageChange && props.onPageChange(getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).current - 1)}
      >
        {props.prevIcon}
        <Show when={!props.prevIcon}>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronLeft} stroke-linecap="round" stroke-linejoin="round" /></svg>
        </Show>
        <span class="hidden sm:inline">{props.previousLabel}</span>
      </button>
      <ol class="flex items-center gap-1">
        <For each={getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).entries}>
          {(entry) => (
            <li key={entry.key}>
              <Show when={entry.isEllipsis}>
                <span class="inline-flex h-9 w-9 items-center justify-center text-sm text-foreground-default" aria-hidden="true">{entry.label}</span>
              </Show>
              <Show when={!entry.isEllipsis}>
                <button
                  type="button" aria-current={entry.isCurrent ? 'page' : undefined} aria-label={entry.ariaLabel || ('Page ' + entry.label)}
                  class={cn(
                    'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium select-none transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                    entry.isCurrent ? 'border-border-default bg-background-default text-foreground-default shadow-xs' : 'border-transparent bg-transparent text-foreground-default hover:bg-background-muted active:bg-background-interactive'
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
        type="button" disabled={!getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).canNext} aria-label={props.nextLabel}
        class={cn(
          'inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).canNext ? 'cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]' : 'cursor-not-allowed opacity-50'
        )}
        onClick={() => getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).canNext && props.onPageChange && props.onPageChange(getPaginationState(props.currentPage, props.totalPages, props.getPageAriaLabel).current + 1)}
      >
        <span class="hidden sm:inline">{props.nextLabel}</span>
        {props.nextIcon}
        <Show when={!props.nextIcon}>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" /></svg>
        </Show>
      </button>
    </nav>
  );
}
