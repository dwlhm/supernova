import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface PaginationEntry {
  key: string;
  label: string;
  page: number;
  isCurrent: boolean;
  isEllipsis: boolean;
}

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  previousLabel?: string;
  nextLabel?: string;
  ariaLabel?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {
  useDefaultProps({
    currentPage: 1,
    totalPages: 1,
    previousLabel: 'Previous',
    nextLabel: 'Next',
    ariaLabel: 'Pagination',
    className: '',
  });

  const state = useStore({
    get totalPagesSafe() {
      const total = props.totalPages;
      if (!total || total < 1) {
        return 1;
      }
      return Math.floor(total);
    },
    get currentPageSafe() {
      const total = state.totalPagesSafe;
      const current = props.currentPage;
      if (!current || current < 1) {
        return 1;
      }
      if (current > total) {
        return total;
      }
      return Math.floor(current);
    },
    get canGoPrevious() {
      return state.currentPageSafe > 1;
    },
    get canGoNext() {
      return state.currentPageSafe < state.totalPagesSafe;
    },
    get entries() {
      const total = state.totalPagesSafe;
      const current = state.currentPageSafe;
      const rows: PaginationEntry[] = [];

      rows.push({
        key: 'page-1',
        label: '1',
        page: 1,
        isCurrent: current === 1,
        isEllipsis: false,
      });

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      if (start > 2) {
        rows.push({
          key: 'ellipsis-start',
          label: '',
          page: 0,
          isCurrent: false,
          isEllipsis: true,
        });
      }

      for (let index = start; index <= end; index++) {
        rows.push({
          key: 'page-' + index,
          label: String(index),
          page: index,
          isCurrent: index === current,
          isEllipsis: false,
        });
      }

      if (end < total - 1) {
        rows.push({
          key: 'ellipsis-end',
          label: '',
          page: 0,
          isCurrent: false,
          isEllipsis: true,
        });
      }

      if (total > 1) {
        rows.push({
          key: 'page-' + total,
          label: String(total),
          page: total,
          isCurrent: current === total,
          isEllipsis: false,
        });
      }

      return rows;
    },
    get baseItemClasses() {
      return 'inline-flex h-9 items-center justify-center rounded-components-pagination-default-size-navigation-button-radius-default text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    },
    get navigationButtonClasses() {
      return cn(
        state.baseItemClasses,
        'gap-1 px-3 text-components-pagination-default-color-label-foreground-default hover:bg-background-muted active:bg-background-interactive'
      );
    },
    entryClasses(entry) {
      if (entry.isCurrent) {
        return cn(
          state.baseItemClasses,
          'w-9 border border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default text-components-pagination-default-color-label-foreground-default shadow-xs'
        );
      }
      return cn(
        state.baseItemClasses,
        'w-9 border border-transparent text-components-pagination-default-color-label-foreground-default hover:bg-background-muted active:bg-background-interactive'
      );
    },
    goTo(page) {
      if (page < 1 || page > state.totalPagesSafe || page === state.currentPageSafe) {
        return;
      }
      if (props.onPageChange) {
        props.onPageChange(page);
      }
    },
  });

  return (
    <nav aria-label={props.ariaLabel} class={cn('flex flex-row items-center gap-1', props.className)}>
      <button
        type="button"
        disabled={!state.canGoPrevious}
        aria-label={props.previousLabel}
        class={state.navigationButtonClasses}
        onClick={() => state.goTo(state.currentPageSafe - 1)}
      >
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-components-pagination-default-color-icon-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <path d="m14 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{props.previousLabel}</span>
      </button>

      <ol class="flex list-none flex-row items-center gap-1">
        <For each={state.entries}>
          {(entry) => (
            <li key={entry.key} class="flex items-center">
              <Show when={entry.isEllipsis}>
                <span class="inline-flex h-9 w-9 items-center justify-center" aria-hidden="true">
                  <svg
                    class="h-4 w-4 shrink-0 text-components-pagination-default-color-icon-stroke-default"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <circle cx="5" cy="12" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                  </svg>
                </span>
              </Show>
              <Show when={!entry.isEllipsis}>
                <button
                  type="button"
                  aria-current={entry.isCurrent ? 'page' : undefined}
                  aria-label={'Page ' + entry.label}
                  class={state.entryClasses(entry)}
                  onClick={() => state.goTo(entry.page)}
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
        disabled={!state.canGoNext}
        aria-label={props.nextLabel}
        class={state.navigationButtonClasses}
        onClick={() => state.goTo(state.currentPageSafe + 1)}
      >
        <span>{props.nextLabel}</span>
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-components-pagination-default-color-icon-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <path d="m10 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
