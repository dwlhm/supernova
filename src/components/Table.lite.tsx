import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableRowData {
  id: string;
  cells: string[];
  selected?: boolean;
}

export interface TableProps {
  columns?: TableColumn[];
  rows?: TableRowData[];
  caption?: string;
  showCheckbox?: boolean;
  showNo?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  emptyCtaLabel?: string;
  showEmptyCta?: boolean;
  showEmptyIcon?: boolean;
  showEmptyTitle?: boolean;
  className?: string;
  onRowSelect?: (rowId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onEmptyCtaClick?: () => void;
}

export default function Table(props: TableProps) {
  useDefaultProps({
    columns: [],
    rows: [],
    caption: 'Data table',
    showCheckbox: false,
    showNo: false,
    emptyTitle: 'No data available',
    emptyBody: "There's nothing here yet. Try adding some data or adjusting your filters.",
    emptyCtaLabel: 'Add data',
    showEmptyCta: true,
    showEmptyIcon: true,
    showEmptyTitle: true,
    className: '',
  });

  const state = useStore({
    get columnSpan() {
      let span = props.columns.length;
      if (props.showNo) {
        span = span + 1;
      }
      if (props.showCheckbox) {
        span = span + 1;
      }
      return span > 0 ? span : 1;
    },
    get isEmpty() {
      return props.rows.length === 0;
    },
    alignmentClasses(align: string) {
      if (align === 'center') {
        return 'text-center';
      }
      if (align === 'right') {
        return 'text-right';
      }
      return 'text-left';
    },
    handleRowSelect(rowId: string, checked: boolean) {
      if (props.onRowSelect) {
        props.onRowSelect(rowId, checked);
      }
    },
    handleSelectAll(checked: boolean) {
      if (props.onSelectAll) {
        props.onSelectAll(checked);
      }
    },
    handleEmptyCta() {
      if (props.onEmptyCtaClick) {
        props.onEmptyCtaClick();
      }
    },
  });

  return (
    <div
      class={cn(
        'w-full overflow-x-auto rounded-rounded-lg border border-components-table-default-color-container-border-default bg-components-table-default-color-container-background-default',
        props.className
      )}
    >
      <table class="w-full border-collapse">
        <caption class="sr-only">{props.caption}</caption>
        <thead>
          <tr class="border-b border-components-table-default-color-divider-border-default">
            <Show when={props.showNo}>
              <th
                scope="col"
                class="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default"
              >
                No.
              </th>
            </Show>
            <Show when={props.showCheckbox}>
              <th
                scope="col"
                class="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center"
              >
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  class="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  onChange={() => state.handleSelectAll(true)}
                />
              </th>
            </Show>
            <For each={props.columns}>
              {(column) => (
                <th
                  key={column.id}
                  scope="col"
                  class={cn(
                    'whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default',
                    state.alignmentClasses(column.align)
                  )}
                >
                  {column.label}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <Show when={state.isEmpty}>
            <tr>
              <td colspan={state.columnSpan} class="px-8 py-10">
                <div class="flex flex-col items-center gap-4 text-center">
                  <Show when={props.showEmptyIcon}>
                    <span
                      class="flex h-16 w-16 items-center justify-center rounded-rounded-full bg-components-table-empty-color-icon-container-background-default"
                      aria-hidden="true"
                    >
                      <svg
                        class="h-7 w-7 text-components-table-empty-color-icon-stroke-default"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                      >
                        <path d="M4 7h16M4 12h16M4 17h10" stroke-linecap="round" />
                      </svg>
                    </span>
                  </Show>
                  <div class="flex flex-col items-center gap-2">
                    <Show when={props.showEmptyTitle}>
                      <span class="text-base font-semibold text-components-table-empty-color-title-foreground-default">
                        {props.emptyTitle}
                      </span>
                    </Show>
                    <span class="max-w-sm text-sm text-components-table-empty-color-body-foreground-default">
                      {props.emptyBody}
                    </span>
                  </div>
                  <Show when={props.showEmptyCta}>
                    <button
                      type="button"
                      class="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-primary-color-container-background-default px-4 text-sm font-medium text-components-button-primary-color-label-foreground-default transition-colors hover:bg-components-button-primary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                      onClick={() => state.handleEmptyCta()}
                    >
                      {props.emptyCtaLabel}
                    </button>
                  </Show>
                </div>
              </td>
            </tr>
          </Show>
          <For each={props.rows}>
            {(row, index) => (
              <tr
                key={row.id}
                class="bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle"
              >
                <Show when={props.showNo}>
                  <td class="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted">
                    {index + 1}
                  </td>
                </Show>
                <Show when={props.showCheckbox}>
                  <td class="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      aria-label={'Select row ' + (index + 1)}
                      class="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                      onChange={() => state.handleRowSelect(row.id, !row.selected)}
                    />
                  </td>
                </Show>
                <For each={row.cells}>
                  {(cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      class="border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle text-sm text-components-table-default-color-cell-foreground-default"
                    >
                      {cell}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
