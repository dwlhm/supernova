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

<script>
export default {
  name: "table",

  props: {
    caption: { default: undefined },
    columns: { default: undefined },
    rows: { default: undefined },
    selectedIds: { default: [] },
    selectable: { default: false },
    onSelectionChange: { default: undefined },
    emptyActionLabel: { default: undefined },
    onEmptyAction: { default: undefined },
    disabled: { default: false },
    showRowNumbers: { default: false },
    emptyTitle: { default: "No Data Available" },
    emptyDescription: {
      default:
        "There's nothing here yet. Try adding some data or adjusting your filters.",
    },
  },

  computed: {
    invalid() {
      if (typeof this.caption !== "string" || !this.caption.trim()) {
        return "Provide a descriptive table caption.";
      }
      if (!Array.isArray(this.columns) || this.columns.length === 0) {
        return "Provide at least one column.";
      }
      if (
        this.columns.some(
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
        new Set(this.columns.map((column) => column.key)).size !==
        this.columns.length
      ) {
        return "Column keys must be unique.";
      }
      if (!Array.isArray(this.rows)) {
        return "Rows must be an array.";
      }
      if (
        this.rows.some(
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
      if (new Set(this.rows.map((row) => row.id)).size !== this.rows.length) {
        return "Row ids must be unique.";
      }
      if (
        Array.isArray(this.selectedIds) &&
        this.selectedIds.some((id) => typeof id !== "string")
      ) {
        return "Selected ids must be an array of strings.";
      }
      if (this.selectable && typeof this.onSelectionChange !== "function") {
        return "Selectable tables require a selection callback.";
      }
      if (this.emptyActionLabel && typeof this.onEmptyAction !== "function") {
        return "The empty action requires a callback.";
      }
      return "";
    },
    selectedCount() {
      if (
        this.invalid ||
        !Array.isArray(this.selectedIds) ||
        !Array.isArray(this.rows)
      ) {
        return 0;
      }
      return this.rows.filter((row) => this.selectedIds.includes(row.id))
        .length;
    },
    allSelected() {
      return (
        !this.invalid &&
        Array.isArray(this.rows) &&
        this.rows.length > 0 &&
        this.selectedCount === this.rows.length
      );
    },
    partiallySelected() {
      return this.selectedCount > 0 && !this.allSelected;
    },
  },

  methods: {
    isRowSelected(id) {
      return Array.isArray(this.selectedIds) && this.selectedIds.includes(id);
    },
    toggleRow(id, checked) {
      if (this.disabled || this.invalid || !this.onSelectionChange) return;
      const current = Array.isArray(this.selectedIds) ? this.selectedIds : [];
      this.onSelectionChange(
        checked
          ? Array.from(new Set([...current, id]))
          : current.filter((selectedId) => selectedId !== id)
      );
    },
    toggleAll(checked) {
      if (
        this.disabled ||
        this.invalid ||
        !this.onSelectionChange ||
        !Array.isArray(this.rows)
      )
        return;
      const current = Array.isArray(this.selectedIds) ? this.selectedIds : [];
      const currentIds = new Set(this.rows.map((row) => row.id));
      const otherIds = current.filter((id) => !currentIds.has(id));
      this.onSelectionChange(
        checked ? [...otherIds, ...this.rows.map((row) => row.id)] : otherIds
      );
    },
    handleEmptyAction() {
      if (this.onEmptyAction && !this.disabled) {
        this.onEmptyAction();
      }
    },
  },
};
</script>