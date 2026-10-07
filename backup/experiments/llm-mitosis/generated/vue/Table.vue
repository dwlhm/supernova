<template>
  <div
    class="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white font-sans"
  >
    <template v-if="Boolean(invalid)">
      <p
        class="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
        role="alert"
      >
        {{ invalid }}
      </p>
    </template>

    <template v-else>
      <div>
        <div
          class="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          tabindex="0"
          role="region"
          :aria-label="caption"
        >
          <table class="w-full border-collapse text-left text-sm text-gray-700">
            <caption
              class="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200 text-base"
            >
              {{
                caption
              }}
            </caption>
            <thead
              class="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase font-medium"
            >
              <tr>
                <template v-if="selectable">
                  <th scope="col" class="px-6 py-3 w-12">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                      :checked="allSelected"
                      :disabled="disabled || rows.length === 0"
                      :aria-label="
                        partiallySelected
                          ? 'Select all rows (some rows selected)'
                          : 'Select all rows'
                      "
                      @change="async (event) => toggleAll(event.target.checked)"
                    />
                  </th>
                </template>

                <template v-if="showRowNumbers">
                  <th scope="col" class="px-6 py-3 w-16 text-right">No.</th>
                </template>

                <template :key="column.key" v-for="(column, index) in columns">
                  <th scope="col" class="px-6 py-3">{{ column.label }}</th>
                </template>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template :key="row.id" v-for="(row, index) in rows">
                <tr
                  :data-row-id="row.id"
                  :data-selected="isRowSelected(row.id) ? 'true' : 'false'"
                  :class="
                    isRowSelected(row.id)
                      ? 'bg-blue-50/70 hover:bg-blue-50'
                      : 'hover:bg-gray-50 transition-colors'
                  "
                >
                  <template v-if="selectable">
                    <td class="px-6 py-4">
                      <input
                        type="checkbox"
                        class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                        :checked="isRowSelected(row.id)"
                        :disabled="disabled"
                        :aria-label="'Select row ' + row.id"
                        @change="
                          async (event) =>
                            toggleRow(row.id, event.target.checked)
                        "
                      />
                    </td>
                  </template>

                  <template v-if="showRowNumbers">
                    <td
                      class="px-6 py-4 text-right tabular-nums text-gray-500 font-medium"
                    >
                      {{ index + 1 }}
                    </td>
                  </template>

                  <template
                    :key="column.key"
                    v-for="(column, index) in columns"
                  >
                    <td
                      :class="
                        typeof row.cells[column.key] === 'number'
                          ? 'px-6 py-4 text-right tabular-nums'
                          : 'px-6 py-4'
                      "
                    >
                      {{ row.cells[column.key] }}
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <template v-if="rows.length === 0">
          <div class="py-12 px-6 text-center">
            <h3 class="text-base font-semibold text-gray-900 mb-1">
              {{ emptyTitle }}
            </h3>
            <p class="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
              {{ emptyDescription }}
            </p>
            <template v-if="Boolean(emptyActionLabel)">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                :disabled="disabled"
                @click="async (event) => handleEmptyAction()"
              >
                {{ emptyActionLabel }}
              </button>
            </template>
          </div>
        </template>

        <template v-if="selectable">
          <div
            class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 font-medium"
          >
            <p role="status">
              {{ selectedCount }} of {{ rows.length }} rows selected

              <template v-if="partiallySelected">
                — partial selection
              </template>

              <template v-else>
                <div _text=""></div>
              </template>
            </p>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

const props = withDefaults(defineProps<TableProps>(), {
  caption: undefined,
  columns: undefined,
  rows: undefined,
  selectedIds: [],
  selectable: false,
  onSelectionChange: undefined,
  emptyActionLabel: undefined,
  onEmptyAction: undefined,
  disabled: false,
  showRowNumbers: false,
  emptyTitle: "No Data Available",
  emptyDescription:
    "There's nothing here yet. Try adding some data or adjusting your filters.",
});

const invalid = computed(() => {
  if (typeof props.caption !== "string" || !props.caption.trim()) {
    return "Provide a descriptive table caption.";
  }
  if (!Array.isArray(props.columns) || props.columns.length === 0) {
    return "Provide at least one column.";
  }
  if (
    props.columns.some(
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
  if (
    new Set(props.columns.map((column) => column.key)).size !==
    props.columns.length
  ) {
    return "Column keys must be unique.";
  }
  if (!Array.isArray(props.rows)) {
    return "Rows must be an array.";
  }
  if (
    props.rows.some(
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
  if (new Set(props.rows.map((row) => row.id)).size !== props.rows.length) {
    return "Row ids must be unique.";
  }
  if (
    Array.isArray(props.selectedIds) &&
    props.selectedIds.some((id) => typeof id !== "string")
  ) {
    return "Selected ids must be an array of strings.";
  }
  if (props.selectable && typeof props.onSelectionChange !== "function") {
    return "Selectable tables require a selection callback.";
  }
  if (props.emptyActionLabel && typeof props.onEmptyAction !== "function") {
    return "The empty action requires a callback.";
  }
  return "";
});
const selectedCount = computed(() => {
  if (
    invalid ||
    !Array.isArray(props.selectedIds) ||
    !Array.isArray(props.rows)
  ) {
    return 0;
  }
  return props.rows.filter((row) => props.selectedIds.includes(row.id)).length;
});
const allSelected = computed(() => {
  return (
    !invalid &&
    Array.isArray(props.rows) &&
    props.rows.length > 0 &&
    selectedCount === props.rows.length
  );
});
const partiallySelected = computed(() => {
  return selectedCount > 0 && !allSelected;
});

function isRowSelected(id) {
  return Array.isArray(props.selectedIds) && props.selectedIds.includes(id);
}
function toggleRow(id, checked) {
  if (props.disabled || invalid || !props.onSelectionChange) return;
  const current = Array.isArray(props.selectedIds) ? props.selectedIds : [];
  props.onSelectionChange(
    checked
      ? Array.from(new Set([...current, id]))
      : current.filter((selectedId) => selectedId !== id)
  );
}
function toggleAll(checked) {
  if (
    props.disabled ||
    invalid ||
    !props.onSelectionChange ||
    !Array.isArray(props.rows)
  )
    return;
  const current = Array.isArray(props.selectedIds) ? props.selectedIds : [];
  const currentIds = new Set(props.rows.map((row) => row.id));
  const otherIds = current.filter((id) => !currentIds.has(id));
  props.onSelectionChange(
    checked ? [...otherIds, ...props.rows.map((row) => row.id)] : otherIds
  );
}
function handleEmptyAction() {
  if (props.onEmptyAction && !props.disabled) {
    props.onEmptyAction();
  }
}
</script>