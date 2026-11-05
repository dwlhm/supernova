<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'w-full overflow-x-auto rounded-lg bg-background-default',
        getTableState(props).isEmpty && !$slots.default
          ? ''
          : 'border border-border-default',
        className
      )
    "
  >
    <template v-if="getTableState(props).isEmpty && !$slots.default">
      <div
        class="flex flex-col items-center justify-center gap-4 px-8 py-10 text-center"
      >
        <template v-if="showEmptyIcon">
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full bg-background-muted"
            aria-hidden="true"
            ><svg
              class="h-7 w-7 text-foreground-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="ICON_PATHS.search"
              ></path></svg
          ></span>
        </template>

        <div class="flex flex-col items-center gap-2">
          <template v-if="showEmptyTitle">
            <span class="text-base font-semibold text-foreground-default">{{
              emptyTitle
            }}</span>
          </template>

          <template v-if="showEmptyDescription">
            <span class="max-w-sm text-sm text-foreground-muted">{{
              emptyBody
            }}</span>
          </template>
        </div>
        <template v-if="showEmptyCta">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            @click="async (event) => onEmptyCtaClick && onEmptyCtaClick()"
          >
            {{ emptyCtaLabel }}
          </button>
        </template>
      </div>
    </template>

    <template v-if="!getTableState(props).isEmpty || Boolean($slots.default)">
      <table class="w-full border-collapse">
        <caption class="sr-only">
          {{
            caption
          }}
        </caption>
        <template v-if="$slots.default">
          <slot />
        </template>

        <template v-if="!$slots.default">
          <thead>
            <TableHeaderRow
              :columns="getTableState(props).columns"
              :showCheckbox="showCheckbox"
              :showNo="showNo"
              :allSelected="getTableState(props).allSelected"
              :onSelectAll="(checked) => onSelectAll && onSelectAll(checked)"
            ></TableHeaderRow>
          </thead>
          <tbody>
            <template
              :key="row.id"
              v-for="(row, index) in getTableState(props).rows"
            >
              <TableBodyRow
                :rowId="row.id"
                :cells="row.cells"
                :columns="getTableState(props).columns"
                :no="index + 1"
                :showNo="showNo"
                :showCheckbox="showCheckbox"
                :checked="row.selected"
                :checkboxAriaLabel="'Select row ' + (index + 1)"
                :onSelect="
                  (rowId, checked) => onRowSelect && onRowSelect(rowId, checked)
                "
              ></TableBodyRow>
            </template>
          </tbody>
        </template>
      </table>

      <template v-if="showPagination">
        <div
          class="flex flex-wrap items-center justify-between gap-4 px-6 py-3"
        >
          <div class="flex items-center gap-2">
            <span class="pr-2 text-sm text-foreground-default">{{
              rowsPerPageLabel
            }}</span
            ><select
              class="h-9 rounded-lg border border-border-default bg-background-default px-3 text-sm font-medium text-foreground-default shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              :aria-label="rowsPerPageLabel"
              :value="String(pageSize)"
              @change="
                async (event) =>
                  onPageSizeChange &&
                  onPageSizeChange(Number(event.target.value))
              "
            >
              <template
                :key="opt"
                v-for="(opt, index) in getTableState(props).pageSizeOptions"
              >
                <option :value="String(opt)">{{ opt }}</option>
              </template>
            </select>
          </div>
          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            :onPageChange="(page) => onPageChange && onPageChange(page)"
          ></Pagination>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  cn,
  getTableState,
  ICON_PATHS,
  bindControllerProps,
  TableCellInput,
} from "./utils";
import TableHeaderRow from "./TableHeaderRow.vue";
import TableBodyRow from "./TableBodyRow.vue";
import Pagination from "./Pagination.vue";

export interface TableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}
export interface TableRowData {
  id: string;
  cells: TableCellInput[];
  selected?: boolean;
}
export interface TableProps {
  state?: "default" | "empty";
  columns?: TableColumn[];
  rows?: TableRowData[];
  caption?: string;
  showCheckbox?: boolean;
  showNo?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  rowsPerPageLabel?: string;
  emptyTitle?: string;
  emptyBody?: string;
  emptyCtaLabel?: string;
  showEmptyCta?: boolean;
  showEmptyIcon?: boolean;
  showEmptyTitle?: boolean;
  showEmptyDescription?: boolean;
  className?: string;

  onRowSelect?: (rowId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onEmptyCtaClick?: () => void;
}

const props = withDefaults(defineProps<TableProps>(), {
  className: "",
  showEmptyIcon: true,
  showEmptyTitle: true,
  emptyTitle: "No Data Available",
  showEmptyDescription: true,
  emptyBody:
    "There's nothing here yet. Try adding some data or adjusting your filters.",
  showEmptyCta: true,
  onEmptyCtaClick: undefined,
  emptyCtaLabel: "Add Data",
  caption: "Data table",
  showCheckbox: false,
  showNo: false,
  onSelectAll: undefined,
  onRowSelect: undefined,
  showPagination: true,
  rowsPerPageLabel: "Rows per page",
  pageSize: 10,
  onPageSizeChange: undefined,
  currentPage: 2,
  totalPages: 10,
  onPageChange: undefined,
  state: 'default',
  columns: () => [],
  rows: () => [],
});
defineSlots<{ default?: () => any }>();
</script>