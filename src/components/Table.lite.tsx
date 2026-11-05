import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getTableState, ICON_PATHS, bindControllerProps, TableCellInput } from './utils';
import TableHeaderRow from './TableHeaderRow.lite';
import TableBodyRow from './TableBodyRow.lite';
import Pagination from './Pagination.lite';

export interface TableColumn { id: string; label: string; align?: 'left' | 'center' | 'right'; }
export interface TableRowData { id: string; cells: TableCellInput[]; selected?: boolean; }

export interface TableProps {
  state?: 'default' | 'empty';
  columns?: TableColumn[];
  rows?: TableRowData[];
  caption?: string;
  showCheckbox?: boolean;
  showNo?: boolean;
  showPagination?: boolean; currentPage?: number; totalPages?: number; pageSize?: number;
  rowsPerPageLabel?: string;
  emptyTitle?: string; emptyBody?: string; emptyCtaLabel?: string;
  showEmptyCta?: boolean; showEmptyIcon?: boolean; showEmptyTitle?: boolean; showEmptyDescription?: boolean;
  className?: string;
  children?: any;
  onRowSelect?: (rowId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onEmptyCtaClick?: () => void;
}

export default function Table(props: TableProps) {
  useDefaultProps({
    state: 'default', columns: [], rows: [], caption: 'Data table', showCheckbox: false, showNo: false,
    showPagination: true, currentPage: 2, totalPages: 10, pageSize: 10, rowsPerPageLabel: 'Rows per page',
    emptyTitle: 'No Data Available', emptyBody: "There's nothing here yet. Try adding some data or adjusting your filters.",
    emptyCtaLabel: 'Add Data', showEmptyCta: true, showEmptyIcon: true, showEmptyTitle: true, showEmptyDescription: true, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('w-full overflow-x-auto rounded-lg bg-background-default', getTableState(props).isEmpty && !props.children ? '' : 'border border-border-default', props.className)}>
      <Show when={getTableState(props).isEmpty && !props.children}>
        <div class="flex flex-col items-center justify-center gap-4 px-8 py-10 text-center">
          <Show when={props.showEmptyIcon}>
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-background-muted" aria-hidden="true">
              <svg class="h-7 w-7 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={ICON_PATHS.search} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </Show>
          <div class="flex flex-col items-center gap-2">
            <Show when={props.showEmptyTitle}><span class="text-base font-semibold text-foreground-default">{props.emptyTitle}</span></Show>
            <Show when={props.showEmptyDescription}><span class="max-w-sm text-sm text-foreground-muted">{props.emptyBody}</span></Show>
          </div>
          <Show when={props.showEmptyCta}>
            <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onEmptyCtaClick && props.onEmptyCtaClick()}>{props.emptyCtaLabel}</button>
          </Show>
        </div>
      </Show>
      <Show when={!getTableState(props).isEmpty || Boolean(props.children)}>
        <table class="w-full border-collapse">
          <caption class="sr-only">{props.caption}</caption>
          <Show when={props.children}>{props.children}</Show>
          <Show when={!props.children}>
            <thead><TableHeaderRow columns={getTableState(props).columns} showCheckbox={props.showCheckbox} showNo={props.showNo} allSelected={getTableState(props).allSelected} onSelectAll={(checked) => props.onSelectAll && props.onSelectAll(checked)} /></thead>
            <tbody><For each={getTableState(props).rows}>{(row, index) => <TableBodyRow key={row.id} rowId={row.id} cells={row.cells} columns={getTableState(props).columns} no={index + 1} showNo={props.showNo} showCheckbox={props.showCheckbox} checked={row.selected} checkboxAriaLabel={'Select row ' + (index + 1)} onSelect={(rowId, checked) => props.onRowSelect && props.onRowSelect(rowId, checked)} />}</For></tbody>
          </Show>
        </table>
        <Show when={props.showPagination}>
          <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
            <div class="flex items-center gap-2">
              <span class="pr-2 text-sm text-foreground-default">{props.rowsPerPageLabel}</span>
              <select aria-label={props.rowsPerPageLabel} value={String(props.pageSize)} class="h-9 rounded-lg border border-border-default bg-background-default px-3 text-sm font-medium text-foreground-default shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onChange={(event) => props.onPageSizeChange && props.onPageSizeChange(Number(event.target.value))}><For each={getTableState(props).pageSizeOptions}>{(opt) => <option key={opt} value={String(opt)}>{opt}</option>}</For></select>
            </div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} onPageChange={(page) => props.onPageChange && props.onPageChange(page)} />
          </div>
        </Show>
      </Show>
    </div>
  );
}
