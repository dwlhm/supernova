import { useStore, useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  muted?: boolean;
}

export interface TableRow {
  id: string;
  cells: Record<string, string | number>;
}

export interface TableProps {
  columns?: TableColumn[];
  rows?: TableRow[];
  caption?: string;
  noLabel?: string;
  selectAllLabel?: string;
  showColumn1?: boolean;
  showColumn2?: boolean;
  showColumn3?: boolean;
  showColumn4?: boolean;
  showColumn5?: boolean;
  showColumn6?: boolean;
  showColumn7?: boolean;
  showColumn8?: boolean;
  showColumn9?: boolean;
  showColumn10?: boolean;
  showRow1?: boolean;
  showRow2?: boolean;
  showRow3?: boolean;
  showRow4?: boolean;
  showRow5?: boolean;
  showRow6?: boolean;
  showRow7?: boolean;
  showRow8?: boolean;
  showRow9?: boolean;
  showRow10?: boolean;
  showCheckbox?: boolean;
  showNo?: boolean;
  title?: string;
  body?: string;
  cTALabel?: string;
  showIcon?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
  icon?: string;
  state?: 'Default' | 'Empty';
  className?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
  onCtaClick?: () => void;
}

const ICON_PATHS: Record<string, string> = {
  inbox:
    'M3 12l2.4-6.4A2 2 0 0 1 7.3 4h9.4a2 2 0 0 1 1.9 1.6L21 12v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0h4l1.5 2.5h7L17 12h4',
  search: 'M4 11a7 7 0 1 0 14 0 7 7 0 1 0-14 0M16.5 16.5 21 21',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
  database:
    'M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2Zm0 0v6c0 1.1 3.6 2 8 2s8-.9 8-2V6M4 12v6c0 1.1 3.6 2 8 2s8-.9 8-2v-6',
};

export default function Table(props: TableProps) {
  useDefaultProps({
    columns: [],
    rows: [],
    caption: 'Data table',
    noLabel: 'No',
    selectAllLabel: 'Select all rows',
    showColumn1: true,
    showColumn2: true,
    showColumn3: true,
    showColumn4: true,
    showColumn5: true,
    showColumn6: false,
    showColumn7: false,
    showColumn8: false,
    showColumn9: false,
    showColumn10: false,
    showRow1: true,
    showRow2: true,
    showRow3: true,
    showRow4: true,
    showRow5: true,
    showRow6: false,
    showRow7: true,
    showRow8: true,
    showRow9: true,
    showRow10: true,
    showCheckbox: false,
    showNo: false,
    title: 'No Data Available',
    body: "There's nothing here yet. Try adding some data or adjusting your filters.",
    cTALabel: 'Add Data',
    showIcon: true,
    showTitle: true,
    showDescription: true,
    showCTA: true,
    icon: 'inbox',
    state: 'Default',
    className: '',
  });

  const state = useStore({
    selectedIds: [] as string[],

    get visibleColumns() {
      const flags = [
        props.showColumn1,
        props.showColumn2,
        props.showColumn3,
        props.showColumn4,
        props.showColumn5,
        props.showColumn6,
        props.showColumn7,
        props.showColumn8,
        props.showColumn9,
        props.showColumn10,
      ];
      const source = props.columns || [];
      const visible: TableColumn[] = [];
      for (let i = 0; i < source.length && i < flags.length; i++) {
        if (flags[i] && source[i]) {
          visible.push(source[i]);
        }
      }
      return visible;
    },

    get visibleRows() {
      const flags = [
        props.showRow1,
        props.showRow2,
        props.showRow3,
        props.showRow4,
        props.showRow5,
        props.showRow6,
        props.showRow7,
        props.showRow8,
        props.showRow9,
        props.showRow10,
      ];
      const source = props.rows || [];
      const visible: TableRow[] = [];
      for (let i = 0; i < source.length && i < flags.length; i++) {
        if (flags[i] && source[i]) {
          visible.push(source[i]);
        }
      }
      return visible;
    },

    get hasRows() {
      return state.visibleRows.length > 0;
    },

    get isEmpty() {
      return props.state === 'Empty' || !state.hasRows;
    },

    get iconPath() {
      const key = props.icon || 'inbox';
      const path = ICON_PATHS[key];
      return path ? path : ICON_PATHS.inbox;
    },

    get allSelected() {
      const rows = state.visibleRows;
      if (rows.length === 0) {
        return false;
      }
      for (let i = 0; i < rows.length; i++) {
        if (state.selectedIds.indexOf(rows[i].id) < 0) {
          return false;
        }
      }
      return true;
    },

    get someSelected() {
      return state.selectedIds.length > 0 && !state.allSelected;
    },

    get selectAllAriaChecked() {
      if (state.allSelected) {
        return 'true';
      }
      if (state.someSelected) {
        return 'mixed';
      }
      return 'false';
    },

    isSelected(rowId) {
      return state.selectedIds.indexOf(rowId) >= 0;
    },

    rowSelectLabel(index) {
      return 'Select row ' + (index + 1);
    },

    cellValue(row, columnId) {
      if (!row || !row.cells) {
        return '';
      }
      const value = row.cells[columnId];
      if (value === undefined || value === null) {
        return '';
      }
      return String(value);
    },

    toggleRow(rowId) {
      const next: string[] = state.isSelected(rowId)
        ? state.selectedIds.filter((id) => id !== rowId)
        : [...state.selectedIds, rowId];
      state.selectedIds = next;
      if (props.onSelectionChange) {
        props.onSelectionChange(next);
      }
    },

    toggleAll() {
      const next: string[] = state.allSelected ? [] : state.visibleRows.map((row) => row.id);
      state.selectedIds = next;
      if (props.onSelectionChange) {
        props.onSelectionChange(next);
      }
    },

    alignClass(column) {
      if (column.align === 'center') {
        return 'text-center';
      }
      if (column.align === 'right') {
        return 'text-right';
      }
      return 'text-left';
    },

    rowClass(rowId) {
      return state.isSelected(rowId) ? 'bg-background-subtle' : 'bg-background-default';
    },

    handleCtaClick() {
      if (props.onCtaClick) {
        props.onCtaClick();
      }
    },
  });

  return (
    <div class={cn('w-full', props.className)}>
      <Show when={state.isEmpty}>
        <div class="flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-border-default bg-background-default px-8 py-10 text-center">
          <Show when={props.showIcon}>
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-background-muted text-foreground-muted">
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d={state.iconPath} />
              </svg>
            </div>
          </Show>

          <div class="flex flex-col items-center gap-2">
            <Show when={props.showTitle}>
              <p class="text-base font-semibold text-foreground-default">{props.title}</p>
            </Show>
            <Show when={props.showDescription}>
              <p class="max-w-md text-sm text-foreground-subtle">{props.body}</p>
            </Show>
          </div>

          <Show when={props.showCTA}>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-default px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2 active:bg-primary-pressed"
              onClick={() => state.handleCtaClick()}
            >
              {props.cTALabel}
            </button>
          </Show>
        </div>
      </Show>

      <Show when={!state.isEmpty}>
        <div class="w-full overflow-x-auto rounded-lg border border-border-default bg-background-default">
          <table class="w-full border-collapse text-left">
            <caption class="sr-only">{props.caption}</caption>
            <thead class="bg-background-muted">
              <tr>
                <Show when={props.showCheckbox}>
                  <th scope="col" class="w-10 border-b border-border-default px-4 py-3 text-left">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={state.selectAllAriaChecked}
                      aria-label={props.selectAllLabel}
                      onClick={() => state.toggleAll()}
                      class={cn(
                        'inline-flex h-4 w-4 items-center justify-center rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2',
                        state.allSelected || state.someSelected
                          ? 'border-primary-default bg-primary-default text-primary-foreground'
                          : 'border-border-default bg-background-default text-transparent'
                      )}
                    >
                      <Show when={state.allSelected}>
                        <svg
                          class="h-3 w-3"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m2.5 6 2.5 2.5L9.5 4" />
                        </svg>
                      </Show>
                      <Show when={state.someSelected}>
                        <svg
                          class="h-3 w-3"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          aria-hidden="true"
                        >
                          <path d="M2.5 6h7" />
                        </svg>
                      </Show>
                    </button>
                  </th>
                </Show>

                <Show when={props.showNo}>
                  <th
                    scope="col"
                    class="w-12 border-b border-border-default px-4 py-3 text-sm font-semibold text-foreground-default"
                  >
                    {props.noLabel}
                  </th>
                </Show>

                <For each={state.visibleColumns}>
                  {(column) => (
                    <th
                      key={column.id}
                      scope="col"
                      class={cn(
                        'border-b border-border-default px-4 py-3 text-sm font-semibold text-foreground-default',
                        state.alignClass(column)
                      )}
                    >
                      {column.label}
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={state.visibleRows}>
                {(row, rowIndex) => (
                  <tr
                    key={row.id}
                    class={cn('transition-colors hover:bg-background-subtle', state.rowClass(row.id))}
                  >
                    <Show when={props.showCheckbox}>
                      <td class="border-b border-border-default px-4 py-3 align-middle">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={state.isSelected(row.id) ? 'true' : 'false'}
                          aria-label={state.rowSelectLabel(rowIndex)}
                          onClick={() => state.toggleRow(row.id)}
                          class={cn(
                            'inline-flex h-4 w-4 items-center justify-center rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2',
                            state.isSelected(row.id)
                              ? 'border-primary-default bg-primary-default text-primary-foreground'
                              : 'border-border-default bg-background-default text-transparent'
                          )}
                        >
                          <Show when={state.isSelected(row.id)}>
                            <svg
                              class="h-3 w-3"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m2.5 6 2.5 2.5L9.5 4" />
                            </svg>
                          </Show>
                        </button>
                      </td>
                    </Show>

                    <Show when={props.showNo}>
                      <td class="border-b border-border-default px-4 py-3 text-sm text-foreground-muted">
                        {rowIndex + 1}
                      </td>
                    </Show>

                    <For each={state.visibleColumns}>
                      {(column) => (
                        <td
                          key={column.id}
                          class={cn(
                            'border-b border-border-default px-4 py-3 text-sm',
                            column.muted ? 'text-foreground-muted' : 'text-foreground-default',
                            state.alignClass(column)
                          )}
                        >
                          {state.cellValue(row, column.id)}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
