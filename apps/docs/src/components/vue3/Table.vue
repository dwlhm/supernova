<template>
  <div
    :class="
      cn(
        'w-full overflow-x-auto rounded-rounded-lg border border-components-table-default-color-container-border-default bg-components-table-default-color-container-background-default',
        className
      )
    "
  >
    <table class="w-full border-collapse">
      <caption class="sr-only">
        {{
          caption
        }}
      </caption>
      <thead>
        <tr
          class="border-b border-components-table-default-color-divider-border-default"
        >
          <template v-if="showNo">
            <th
              scope="col"
              class="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default"
            >
              No.
            </th>
          </template>

          <template v-if="showCheckbox">
            <th
              scope="col"
              class="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center"
            >
              <input
                type="checkbox"
                aria-label="Select all rows"
                class="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                @change="async (event) => handleSelectAll(true)"
              />
            </th>
          </template>

          <template :key="column.id" v-for="(column, index) in columns">
            <th
              scope="col"
              :class="
                cn(
                  'whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default',
                  alignmentClasses(column.align)
                )
              "
            >
              {{ column.label }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-if="isEmpty">
          <tr>
            <td class="px-8 py-10" :colspan="columnSpan">
              <div class="flex flex-col items-center gap-4 text-center">
                <template v-if="showEmptyIcon">
                  <span
                    class="flex h-16 w-16 items-center justify-center rounded-rounded-full bg-components-table-empty-color-icon-container-background-default"
                    aria-hidden="true"
                    ><svg
                      class="h-7 w-7 text-components-table-empty-color-icon-stroke-default"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        d="M4 7h16M4 12h16M4 17h10"
                        stroke-linecap="round"
                      ></path></svg
                  ></span>
                </template>

                <div class="flex flex-col items-center gap-2">
                  <template v-if="showEmptyTitle">
                    <span
                      class="text-base font-semibold text-components-table-empty-color-title-foreground-default"
                      >{{ emptyTitle }}</span
                    >
                  </template>

                  <span
                    class="max-w-sm text-sm text-components-table-empty-color-body-foreground-default"
                    >{{ emptyBody }}</span
                  >
                </div>
                <template v-if="showEmptyCta">
                  <button
                    type="button"
                    class="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-primary-color-container-background-default px-4 text-sm font-medium text-components-button-primary-color-label-foreground-default transition-colors hover:bg-components-button-primary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                    @click="async (event) => handleEmptyCta()"
                  >
                    {{ emptyCtaLabel }}
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </template>

        <template :key="row.id" v-for="(row, index) in rows">
          <tr
            class="bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle"
          >
            <template v-if="showNo">
              <td
                class="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted"
              >
                {{ index + 1 }}
              </td>
            </template>

            <template v-if="showCheckbox">
              <td
                class="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  :checked="row.selected"
                  :aria-label="'Select row ' + (index + 1)"
                  @change="
                    async (event) => handleRowSelect(row.id, !row.selected)
                  "
                />
              </td>
            </template>

            <template :key="cellIndex" v-for="(cell, cellIndex) in row.cells">
              <td
                class="border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle text-sm text-components-table-default-color-cell-foreground-default"
              >
                {{ cell }}
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface TableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
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

const props = withDefaults(defineProps<TableProps>(), {
  columns: [],
  showNo: false,
  showCheckbox: false,
  rows: [],
  onRowSelect: undefined,
  onSelectAll: undefined,
  onEmptyCtaClick: undefined,
  className: "",
  caption: "Data table",
  showEmptyIcon: true,
  showEmptyTitle: true,
  emptyTitle: "No data available",
  emptyBody:
    "There's nothing here yet. Try adding some data or adjusting your filters.",
  showEmptyCta: true,
  emptyCtaLabel: "Add data",
});

const columnSpan = computed(() => {
  let span = props.columns.length;
  if (props.showNo) {
    span = span + 1;
  }
  if (props.showCheckbox) {
    span = span + 1;
  }
  return span > 0 ? span : 1;
});
const isEmpty = computed(() => {
  return props.rows.length === 0;
});

function alignmentClasses(align: string) {
  if (align === "center") {
    return "text-center";
  }
  if (align === "right") {
    return "text-right";
  }
  return "text-left";
}
function handleRowSelect(rowId: string, checked: boolean) {
  if (props.onRowSelect) {
    props.onRowSelect(rowId, checked);
  }
}
function handleSelectAll(checked: boolean) {
  if (props.onSelectAll) {
    props.onSelectAll(checked);
  }
}
function handleEmptyCta() {
  if (props.onEmptyCtaClick) {
    props.onEmptyCtaClick();
  }
}
</script>