<script context="module" lang="ts">
  export interface TableColumn {
    key: string;
    label: string;
  }

  export interface TableRow {
    id: string;
    cells: Record<string, any>;
  }

  export interface TableProps {
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
  export let caption: TableProps["caption"];
  export let columns: TableProps["columns"];
  export let rows: TableProps["rows"];
  export let selectedIds: TableProps["selectedIds"] = [];
  export let selectable: TableProps["selectable"] = false;
  export let onSelectionChange: TableProps["onSelectionChange"];
  export let emptyActionLabel: TableProps["emptyActionLabel"];
  export let onEmptyAction: TableProps["onEmptyAction"];
  export let disabled: TableProps["disabled"] = false;
  export let showRowNumbers: TableProps["showRowNumbers"] = false;
  export let emptyTitle: TableProps["emptyTitle"] = "No Data Available";
  export let emptyDescription: TableProps["emptyDescription"] =
    "There's nothing here yet. Try adding some data or adjusting your filters.";

  function isRowSelected(id) {
    return Array.isArray(selectedIds) && selectedIds.includes(id);
  }
  function toggleRow(id, checked) {
    if (disabled || invalid() || !onSelectionChange) return;
    const current = Array.isArray(selectedIds) ? selectedIds : [];
    onSelectionChange(
      checked
        ? Array.from(new Set([...current, id]))
        : current.filter((selectedId) => selectedId !== id)
    );
  }
  function toggleAll(checked) {
    if (disabled || invalid() || !onSelectionChange || !Array.isArray(rows))
      return;
    const current = Array.isArray(selectedIds) ? selectedIds : [];
    const currentIds = new Set(rows.map((row) => row.id));
    const otherIds = current.filter((id) => !currentIds.has(id));
    onSelectionChange(
      checked ? [...otherIds, ...rows.map((row) => row.id)] : otherIds
    );
  }
  function handleEmptyAction() {
    if (onEmptyAction && !disabled) {
      onEmptyAction();
    }
  }
  $: invalid = () => {
    if (typeof caption !== "string" || !caption.trim()) {
      return "Provide a descriptive table caption.";
    }
    if (!Array.isArray(columns) || columns.length === 0) {
      return "Provide at least one column.";
    }
    if (
      columns.some(
        (column) =>
          !column ||
          typeof column.key !== "string" ||
          !column.key.trim() ||
          typeof column.label !== "string" ||
          !column.label.trim()
      )
    ) {
      return "Every column needs a key and a label.";
    }
    if (new Set(columns.map((column) => column.key)).size !== columns.length) {
      return "Column keys must be unique.";
    }
    if (!Array.isArray(rows)) {
      return "Rows must be an array.";
    }
    if (
      rows.some(
        (row) =>
          !row ||
          typeof row.id !== "string" ||
          !row.id.trim() ||
          !row.cells ||
          typeof row.cells !== "object"
      )
    ) {
      return "Every row needs a stable id and cells.";
    }
    if (new Set(rows.map((row) => row.id)).size !== rows.length) {
      return "Row ids must be unique.";
    }
    if (
      Array.isArray(selectedIds) &&
      selectedIds.some((id) => typeof id !== "string")
    ) {
      return "Selected ids must be an array of strings.";
    }
    if (selectable && typeof onSelectionChange !== "function") {
      return "Selectable tables require a selection callback.";
    }
    if (emptyActionLabel && typeof onEmptyAction !== "function") {
      return "The empty action requires a callback.";
    }
    return "";
  };
  $: selectedCount = () => {
    if (invalid() || !Array.isArray(selectedIds) || !Array.isArray(rows)) {
      return 0;
    }
    return rows.filter((row) => selectedIds.includes(row.id)).length;
  };
  $: allSelected = () => {
    return (
      !invalid() &&
      Array.isArray(rows) &&
      rows.length > 0 &&
      selectedCount() === rows.length
    );
  };
  $: partiallySelected = () => {
    return selectedCount() > 0 && !allSelected();
  };
</script>

<div
  class="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white font-sans"
>
  {#if Boolean(invalid())}
    <p
      class="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
      role="alert"
    >
      {invalid()}
    </p>
  {:else}
    <div>
      <div
        class="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        tabindex="0"
        role="region"
        aria-label={caption}
      >
        <table class="w-full border-collapse text-left text-sm text-gray-700">
          <caption
            class="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200 text-base"
            >{caption}</caption
          ><thead
            class="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase font-medium"
            ><tr>
              {#if selectable}
                <th scope="col" class="px-6 py-3 w-12"
                  ><input
                    type="checkbox"
                    class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
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
                <th scope="col" class="px-6 py-3 w-16 text-right"> No. </th>
              {/if}
              {#each columns as column (column.key)}
                <th scope="col" class="px-6 py-3">{column.label}</th>
              {/each}
            </tr></thead
          ><tbody class="divide-y divide-gray-100">
            {#each rows as row, index (row.id)}
              <tr
                data-row-id={row.id}
                data-selected={isRowSelected(row.id) ? "true" : "false"}
                class={isRowSelected(row.id)
                  ? "bg-blue-50/70 hover:bg-blue-50"
                  : "hover:bg-gray-50 transition-colors"}
              >
                {#if selectable}
                  <td class="px-6 py-4"
                    ><input
                      type="checkbox"
                      class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                      checked={isRowSelected(row.id)}
                      {disabled}
                      aria-label={"Select row " + row.id}
                      on:change={(event) => {
                        toggleRow(row.id, event.target.checked);
                      }}
                    /></td
                  >
                {/if}
                {#if showRowNumbers}
                  <td
                    class="px-6 py-4 text-right tabular-nums text-gray-500 font-medium"
                    >{index + 1}</td
                  >
                {/if}
                {#each columns as column (column.key)}
                  <td
                    class={typeof row.cells[column.key] === "number"
                      ? "px-6 py-4 text-right tabular-nums"
                      : "px-6 py-4"}>{row.cells[column.key]}</td
                  >
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if rows.length === 0}
        <div class="py-12 px-6 text-center">
          <h3 class="text-base font-semibold text-gray-900 mb-1">
            {emptyTitle}
          </h3>
          <p class="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            {emptyDescription}
          </p>
          {#if Boolean(emptyActionLabel)}
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              {disabled}
              on:click={(event) => {
                handleEmptyAction();
              }}>{emptyActionLabel}</button
            >
          {/if}
        </div>
      {/if}
      {#if selectable}
        <div
          class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 font-medium"
        >
          <p role="status">
            {selectedCount()} of {rows.length} rows selected

            {#if partiallySelected()}
              — partial selection
            {:else}
              <div _text="" />
            {/if}
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>