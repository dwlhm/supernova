<template>
  <div class="lm-table">
    <template v-if="invalid">
      <p class="lm-table-alert" role="alert">{{ invalid }}</p>
    </template>

    <template v-else>
      <div>
        <div
          class="lm-table-scroll"
          tabindex="0"
          role="region"
          :aria-label="caption"
        >
          <table>
            <caption>
              {{
                caption
              }}
            </caption>
            <thead>
              <tr>
                <template v-if="selectable">
                  <th scope="col">
                    <input
                      type="checkbox"
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
                  <th scope="col">No.</th>
                </template>

                <template :key="column.key" v-for="(column, index) in columns">
                  <th scope="col">{{ column.label }}</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <template :key="row.id" v-for="(row, index) in rows">
                <tr
                  :data-row-id="row.id"
                  :data-selected="
                    selectedIds.includes(row.id) ? 'true' : 'false'
                  "
                >
                  <template v-if="selectable">
                    <td>
                      <input
                        type="checkbox"
                        :checked="selectedIds.includes(row.id)"
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
                    <td class="lm-table-number">{{ index + 1 }}</td>
                  </template>

                  <template
                    :key="column.key"
                    v-for="(column, index) in columns"
                  >
                    <td
                      :class="
                        typeof row.cells[column.key] === 'number'
                          ? 'lm-table-number'
                          : ''
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
          <div class="lm-table-empty">
            <h3>{{ emptyTitle }}</h3>
            <p>{{ emptyDescription }}</p>
            <template v-if="emptyActionLabel">
              <button
                type="button"
                :disabled="disabled"
                @click="async (event) => onEmptyAction()"
              >
                {{ emptyActionLabel }}
              </button>
            </template>
          </div>
        </template>

        <template v-if="selectable">
          <p class="lm-table-selection" role="status">
            {{ selectedCount }} of {{ rows.length }} rows selected
            <template v-if="partiallySelected"> — partial selection </template>

            <template v-else>
              <div _text=""></div>
            </template>
          </p>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "data-table",

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
      if (typeof this.caption !== "string" || !this.caption.trim())
        return "Provide a descriptive table caption.";
      if (!Array.isArray(this.columns) || this.columns.length === 0)
        return "Provide at least one column.";
      if (
        this.columns.some(
          (column) =>
            !column ||
            typeof column.key !== "string" ||
            !column.key.trim() ||
            typeof column.label !== "string" ||
            !column.label.trim()
        )
      )
        return "Every column needs a key and a label.";
      if (
        new Set(this.columns.map((column) => column.key)).size !==
        this.columns.length
      )
        return "Column keys must be unique.";
      if (!Array.isArray(this.rows)) return "Rows must be an array.";
      if (
        this.rows.some(
          (row) =>
            !row ||
            typeof row.id !== "string" ||
            !row.id.trim() ||
            !row.cells ||
            typeof row.cells !== "object"
        )
      )
        return "Every row needs a stable id and cells.";
      if (new Set(this.rows.map((row) => row.id)).size !== this.rows.length)
        return "Row ids must be unique.";
      if (
        this.rows.some((row) =>
          this.columns.some(
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
        !Array.isArray(this.selectedIds) ||
        this.selectedIds.some((id) => typeof id !== "string") ||
        new Set(this.selectedIds).size !== this.selectedIds.length
      )
        return "Selected ids must be an array of unique strings.";
      if (this.selectable && typeof this.onSelectionChange !== "function")
        return "Selectable tables require a selection callback.";
      if (this.emptyActionLabel && typeof this.onEmptyAction !== "function")
        return "The empty action requires a callback.";
      return "";
    },
    selectedCount() {
      return this.invalid
        ? 0
        : this.rows.filter((row) => this.selectedIds.includes(row.id)).length;
    },
    allSelected() {
      return (
        !this.invalid &&
        this.rows.length > 0 &&
        this.selectedCount === this.rows.length
      );
    },
    partiallySelected() {
      return this.selectedCount > 0 && !this.allSelected;
    },
  },

  methods: {
    toggleRow(id: string, checked: boolean) {
      if (this.disabled || this.invalid || !this.onSelectionChange) return;
      this.onSelectionChange(
        checked
          ? Array.from(new Set([...this.selectedIds, id]))
          : this.selectedIds.filter((selectedId) => selectedId !== id)
      );
    },
    toggleAll(checked: boolean) {
      if (this.disabled || this.invalid || !this.onSelectionChange) return;
      const currentIds = new Set(this.rows.map((row) => row.id));
      const otherIds = this.selectedIds.filter((id) => !currentIds.has(id));
      this.onSelectionChange(
        checked ? [...otherIds, ...this.rows.map((row) => row.id)] : otherIds
      );
    },
  },
};
</script>

<style scoped>
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