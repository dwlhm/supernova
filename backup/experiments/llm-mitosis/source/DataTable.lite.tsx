import { For, Show, useDefaultProps, useStore, useStyle } from '@builder.io/mitosis';

export interface TableColumn { key: string; label: string; }
export interface TableRow { id: string; cells: Record<string, string | number>; }
export interface DataTableProps {
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  selectable?: boolean;
  showRowNumbers?: boolean;
  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export default function DataTable(props: DataTableProps) {
  useDefaultProps({ selectedIds: [], selectable: false, showRowNumbers: false, disabled: false, emptyTitle: 'No Data Available', emptyDescription: "There's nothing here yet. Try adding some data or adjusting your filters." });
  const state = useStore({
    get invalid() {
      if (typeof props.caption !== 'string' || !props.caption.trim()) return 'Provide a descriptive table caption.';
      if (!Array.isArray(props.columns) || props.columns.length === 0) return 'Provide at least one column.';
      if (props.columns.some(column => !column || typeof column.key !== 'string' || !column.key.trim() || typeof column.label !== 'string' || !column.label.trim())) return 'Every column needs a key and a label.';
      if (new Set(props.columns.map(column => column.key)).size !== props.columns.length) return 'Column keys must be unique.';
      if (!Array.isArray(props.rows)) return 'Rows must be an array.';
      if (props.rows.some(row => !row || typeof row.id !== 'string' || !row.id.trim() || !row.cells || typeof row.cells !== 'object')) return 'Every row needs a stable id and cells.';
      if (new Set(props.rows.map(row => row.id)).size !== props.rows.length) return 'Row ids must be unique.';
      if (props.rows.some(row => props.columns.some(column => !Object.prototype.hasOwnProperty.call(row.cells, column.key) || (typeof row.cells[column.key] !== 'string' && typeof row.cells[column.key] !== 'number') || (typeof row.cells[column.key] === 'number' && !Number.isFinite(row.cells[column.key]))))) return 'Every displayed cell must contain text or a finite number.';
      if (!Array.isArray(props.selectedIds) || props.selectedIds.some(id => typeof id !== 'string') || new Set(props.selectedIds).size !== props.selectedIds.length) return 'Selected ids must be an array of unique strings.';
      if (props.selectable && typeof props.onSelectionChange !== 'function') return 'Selectable tables require a selection callback.';
      if (props.emptyActionLabel && typeof props.onEmptyAction !== 'function') return 'The empty action requires a callback.';
      return '';
    },
    get selectedCount() {
      return state.invalid ? 0 : props.rows.filter(row => props.selectedIds.includes(row.id)).length;
    },
    get allSelected() {
      return !state.invalid && props.rows.length > 0 && state.selectedCount === props.rows.length;
    },
    get partiallySelected() {
      return state.selectedCount > 0 && !state.allSelected;
    },
    toggleRow(id: string, checked: boolean) {
      if (props.disabled || state.invalid || !props.onSelectionChange) return;
      props.onSelectionChange(checked ? Array.from(new Set([...props.selectedIds, id])) : props.selectedIds.filter(selectedId => selectedId !== id));
    },
    toggleAll(checked: boolean) {
      if (props.disabled || state.invalid || !props.onSelectionChange) return;
      const currentIds = new Set(props.rows.map(row => row.id));
      const otherIds = props.selectedIds.filter(id => !currentIds.has(id));
      props.onSelectionChange(checked ? [...otherIds, ...props.rows.map(row => row.id)] : otherIds);
    },
  });
  useStyle(`
    .lm-table { font: var(--typography-body-regular); color: var(--color-foreground-neutral); border: 1px solid var(--color-border-neutral); border-radius: 8px; background: var(--color-background-page); overflow: hidden; }
    .lm-table-scroll { overflow-x: auto; }
    .lm-table table { border-collapse: collapse; width: 100%; text-align: left; }
    .lm-table caption { text-align: left; padding: 12px 16px; font: var(--typography-title-bold); }
    .lm-table th, .lm-table td { padding: 12px 16px; border-bottom: 1px solid var(--color-border-neutral); vertical-align: middle; }
    .lm-table th { font: var(--typography-body-medium); background: var(--color-background-neutral); white-space: nowrap; }
    .lm-table tbody tr:last-child td { border-bottom: 0; }
    .lm-table tr[data-selected="true"] { background: var(--color-background-primary-faded); }
    .lm-table .lm-table-number { text-align: right; font-variant-numeric: tabular-nums; }
    .lm-table input { width: 16px; height: 16px; margin: 0; accent-color: var(--color-background-primary); }
    .lm-table input:focus-visible, .lm-table button:focus-visible, .lm-table-scroll:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
    .lm-table-selection { margin: 0; padding: 8px 16px; color: var(--color-foreground-neutral-faded); font: var(--typography-caption-regular); border-top: 1px solid var(--color-border-neutral); }
    .lm-table-empty { padding: 40px 32px; text-align: center; }
    .lm-table-empty h3 { font: var(--typography-title-bold); margin: 0 0 8px; }
    .lm-table-empty p { color: var(--color-foreground-neutral-faded); margin: 0 0 16px; }
    .lm-table-empty button { font: inherit; padding: 8px 16px; border: 1px solid var(--color-border-neutral); border-radius: 8px; color: var(--color-foreground-neutral); background: var(--color-background-neutral); cursor: pointer; }
    .lm-table-alert { padding: 16px; }
  `);
  return (
    <div class="lm-table">
      <Show when={state.invalid} else={
        <div>
          <div class="lm-table-scroll" tabindex="0" role="region" aria-label={props.caption}>
            <table>
              <caption>{props.caption}</caption>
              <thead><tr>
                <Show when={props.selectable}><th scope="col"><input type="checkbox" checked={state.allSelected} disabled={props.disabled || props.rows.length === 0} aria-label={state.partiallySelected ? 'Select all rows (some rows selected)' : 'Select all rows'} onChange={(event) => state.toggleAll(event.target.checked)} /></th></Show>
                <Show when={props.showRowNumbers}><th scope="col">No.</th></Show>
                <For each={props.columns}>{column => <th key={column.key} scope="col">{column.label}</th>}</For>
              </tr></thead>
              <tbody>
                <For each={props.rows}>{(row, index) => <tr key={row.id} data-row-id={row.id} data-selected={props.selectedIds.includes(row.id) ? 'true' : 'false'}>
                  <Show when={props.selectable}><td><input type="checkbox" checked={props.selectedIds.includes(row.id)} disabled={props.disabled} aria-label={'Select row ' + row.id} onChange={(event) => state.toggleRow(row.id, event.target.checked)} /></td></Show>
                  <Show when={props.showRowNumbers}><td class="lm-table-number">{index + 1}</td></Show>
                  <For each={props.columns}>{column => <td key={column.key} class={typeof row.cells[column.key] === 'number' ? 'lm-table-number' : ''}>{row.cells[column.key]}</td>}</For>
                </tr>}</For>
              </tbody>
            </table>
          </div>
          <Show when={props.rows.length === 0}>
            <div class="lm-table-empty"><h3>{props.emptyTitle}</h3><p>{props.emptyDescription}</p><Show when={props.emptyActionLabel}><button type="button" disabled={props.disabled} onClick={() => props.onEmptyAction()}>{props.emptyActionLabel}</button></Show></div>
          </Show>
          <Show when={props.selectable}><p class="lm-table-selection" role="status">{state.selectedCount} of {props.rows.length} rows selected{state.partiallySelected ? ' — partial selection' : ''}</p></Show>
        </div>
      }>
        <p class="lm-table-alert" role="alert">{state.invalid}</p>
      </Show>
    </div>
  );
}
