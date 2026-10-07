<script context="module" lang="ts">
  export interface TableColumn {
    key: string;
    label: string;
  }

  export interface TableRow {
    id: string;
    cells: Record<string, string | number>;
  }

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
</script>

<script lang="ts">
  export let caption: DataTableProps["caption"];
  export let columns: DataTableProps["columns"];
  export let rows: DataTableProps["rows"];
  export let selectedIds: DataTableProps["selectedIds"] = [];
  export let selectable: DataTableProps["selectable"] = false;
  export let onSelectionChange: DataTableProps["onSelectionChange"];
  export let emptyActionLabel: DataTableProps["emptyActionLabel"];
  export let onEmptyAction: DataTableProps["onEmptyAction"];
  export let disabled: DataTableProps["disabled"] = false;
  export let showRowNumbers: DataTableProps["showRowNumbers"] = false;
  export let emptyTitle: DataTableProps["emptyTitle"] = "No Data Available";
  export let emptyDescription: DataTableProps["emptyDescription"] =
    "There's nothing here yet. Try adding some data or adjusting your filters.";

  function toggleRow(id: string, checked: boolean) {
    if (disabled || invalid() || !onSelectionChange) return;
    onSelectionChange(
      checked
        ? Array.from(new Set([...selectedIds, id]))
        : selectedIds.filter((selectedId) => selectedId !== id)
    );
  }
  function toggleAll(checked: boolean) {
    if (disabled || invalid() || !onSelectionChange) return;
    const currentIds = new Set(rows.map((row) => row.id));
    const otherIds = selectedIds.filter((id) => !currentIds.has(id));
    onSelectionChange(
      checked ? [...otherIds, ...rows.map((row) => row.id)] : otherIds
    );
  }
  $: invalid = () => {
    if (typeof caption !== "string" || !caption.trim())
      return "Provide a descriptive table caption.";
    if (!Array.isArray(columns) || columns.length === 0)
      return "Provide at least one column.";
    if (
      columns.some(
        (column) =>
          !column ||
          typeof column.key !== "string" ||
          !column.key.trim() ||
          typeof column.label !== "string" ||
          !column.label.trim()
      )
    )
      return "Every column needs a key and a label.";
    if (new Set(columns.map((column) => column.key)).size !== columns.length)
      return "Column keys must be unique.";
    if (!Array.isArray(rows)) return "Rows must be an array.";
    if (
      rows.some(
        (row) =>
          !row ||
          typeof row.id !== "string" ||
          !row.id.trim() ||
          !row.cells ||
          typeof row.cells !== "object"
      )
    )
      return "Every row needs a stable id and cells.";
    if (new Set(rows.map((row) => row.id)).size !== rows.length)
      return "Row ids must be unique.";
    if (
      rows.some((row) =>
        columns.some(
          (column) =>
            !Object.prototype.hasOwnProperty.call(row.cells, column.key) ||
            (typeof row.cells[column.key] !== "string" &&
              typeof row.cells[column.key] !== "number") ||
            (typeof row.cells[column.key] === "number" &&
              !Number.isFinite(row.cells[column.key]))
        )
      )
    )
      return "Every displayed cell must contain text or a finite number.";
    if (
      !Array.isArray(selectedIds) ||
      selectedIds.some((id) => typeof id !== "string") ||
      new Set(selectedIds).size !== selectedIds.length
    )
      return "Selected ids must be an array of unique strings.";
    if (selectable && typeof onSelectionChange !== "function")
      return "Selectable tables require a selection callback.";
    if (emptyActionLabel && typeof onEmptyAction !== "function")
      return "The empty action requires a callback.";
    return "";
  };
  $: selectedCount = () => {
    return invalid()
      ? 0
      : rows.filter((row) => selectedIds.includes(row.id)).length;
  };
  $: allSelected = () => {
    return !invalid() && rows.length > 0 && selectedCount() === rows.length;
  };
  $: partiallySelected = () => {
    return selectedCount() > 0 && !allSelected();
  };
</script>

<div class="lm-table">
  {#if invalid()}
    <p class="lm-table-alert" role="alert">{invalid()}</p>
  {:else}
    <div>
      <div
        class="lm-table-scroll"
        tabindex="0"
        role="region"
        aria-label={caption}
      >
        <table>
          <caption>{caption}</caption><thead
            ><tr>
              {#if selectable}
                <th scope="col"
                  ><input
                    type="checkbox"
                    checked={allSelected()}
                    disabled={disabled || rows.length === 0}
                    aria-label={partiallySelected()
                      ? "Select all rows (some rows selected)"
                      : "Select all rows"}
                    on:change={(event) => {
                      toggleAll(event.target.checked);
                    }}
                  /></th
                >
              {/if}
              {#if showRowNumbers}
                <th scope="col">No.</th>
              {/if}
              {#each columns as column (column.key)}
                <th scope="col">{column.label}</th>
              {/each}
            </tr></thead
          ><tbody>
            {#each rows as row, index (row.id)}
              <tr
                data-row-id={row.id}
                data-selected={selectedIds.includes(row.id) ? "true" : "false"}
              >
                {#if selectable}
                  <td
                    ><input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      {disabled}
                      aria-label={"Select row " + row.id}
                      on:change={(event) => {
                        toggleRow(row.id, event.target.checked);
                      }}
                    /></td
                  >
                {/if}
                {#if showRowNumbers}
                  <td class="lm-table-number">{index + 1}</td>
                {/if}
                {#each columns as column (column.key)}
                  <td
                    class={typeof row.cells[column.key] === "number"
                      ? "lm-table-number"
                      : ""}>{row.cells[column.key]}</td
                  >
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if rows.length === 0}
        <div class="lm-table-empty">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          {#if emptyActionLabel}
            <button
              type="button"
              {disabled}
              on:click={(event) => {
                onEmptyAction();
              }}>{emptyActionLabel}</button
            >
          {/if}
        </div>
      {/if}
      {#if selectable}
        <p class="lm-table-selection" role="status">
          {selectedCount()} of {rows.length} rows selected
          {#if partiallySelected()}
            — partial selection
          {:else}
            <div _text="" />
          {/if}
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .lm-table {
    font: var(--typography-body-regular);
    color: var(--color-foreground-neutral);
    border: 1px solid var(--color-border-neutral);
    border-radius: 8px;
    background: var(--color-background-page);
    overflow: hidden;
  }
  .lm-table-scroll {
    overflow-x: auto;
  }
  .lm-table table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
  }
  .lm-table caption {
    text-align: left;
    padding: 12px 16px;
    font: var(--typography-title-bold);
  }
  .lm-table th,
  .lm-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border-neutral);
    vertical-align: middle;
  }
  .lm-table th {
    font: var(--typography-body-medium);
    background: var(--color-background-neutral);
    white-space: nowrap;
  }
  .lm-table tbody tr:last-child td {
    border-bottom: 0;
  }
  .lm-table tr[data-selected="true"] {
    background: var(--color-background-primary-faded);
  }
  .lm-table .lm-table-number {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .lm-table input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--color-background-primary);
  }
  .lm-table input:focus-visible,
  .lm-table button:focus-visible,
  .lm-table-scroll:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  .lm-table-selection {
    margin: 0;
    padding: 8px 16px;
    color: var(--color-foreground-neutral-faded);
    font: var(--typography-caption-regular);
    border-top: 1px solid var(--color-border-neutral);
  }
  .lm-table-empty {
    padding: 40px 32px;
    text-align: center;
  }
  .lm-table-empty h3 {
    font: var(--typography-title-bold);
    margin: 0 0 8px;
  }
  .lm-table-empty p {
    color: var(--color-foreground-neutral-faded);
    margin: 0 0 16px;
  }
  .lm-table-empty button {
    font: inherit;
    padding: 8px 16px;
    border: 1px solid var(--color-border-neutral);
    border-radius: 8px;
    color: var(--color-foreground-neutral);
    background: var(--color-background-neutral);
    cursor: pointer;
  }
  .lm-table-alert {
    padding: 16px;
  }
</style>