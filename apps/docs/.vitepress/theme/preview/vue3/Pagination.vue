<template>
  <nav
    aria-label="Pagination"
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex items-center gap-1', className)"
  >
    <button
      type="button"
      class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!getPaginationState(currentPage, totalPages).canPrev"
      :aria-label="previousLabel"
      @click="
        async (event) =>
          getPaginationState(currentPage, totalPages).canPrev &&
          onPageChange &&
          onPageChange(getPaginationState(currentPage, totalPages).current - 1)
      "
    >
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.chevronLeft"
        ></path></svg
      ><span class="hidden sm:inline">{{ previousLabel }}</span>
    </button>
    <ol class="flex items-center gap-1">
      <template
        :key="entry.key"
        v-for="(entry, index) in getPaginationState(currentPage, totalPages)
          .entries"
      >
        <li>
          <template v-if="entry.isEllipsis">
            <span
              class="inline-flex h-9 w-9 items-center justify-center text-sm text-foreground-default"
              aria-hidden="true"
              >{{ entry.label }}</span
            >
          </template>

          <template v-if="!entry.isEllipsis">
            <button
              type="button"
              :aria-current="entry.isCurrent ? 'page' : undefined"
              :aria-label="'Page ' + entry.label"
              :class="
                cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                  entry.isCurrent
                    ? 'border-border-default bg-background-default text-foreground-default shadow-xs'
                    : 'border-transparent bg-transparent text-foreground-default hover:bg-background-muted'
                )
              "
              @click="
                async (event) =>
                  !entry.isCurrent && onPageChange && onPageChange(entry.page)
              "
            >
              {{ entry.label }}
            </button>
          </template>
        </li>
      </template>
    </ol>
    <button
      type="button"
      class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!getPaginationState(currentPage, totalPages).canNext"
      :aria-label="nextLabel"
      @click="
        async (event) =>
          getPaginationState(currentPage, totalPages).canNext &&
          onPageChange &&
          onPageChange(getPaginationState(currentPage, totalPages).current + 1)
      "
    >
      <span class="hidden sm:inline">{{ nextLabel }}</span
      ><svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.chevronRight"
        ></path>
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
import {
  cn,
  getPaginationState,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

export interface PaginationEntry {
  key: string;
  label: string;
  page: number;
  isCurrent: boolean;
  isEllipsis: boolean;
}
export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  className: "",
  currentPage: 1,
  totalPages: 1,
  previousLabel: "Previous",
  onPageChange: undefined,
  nextLabel: "Next",
});
</script>