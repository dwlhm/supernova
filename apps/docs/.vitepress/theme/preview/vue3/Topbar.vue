<template>
  <header
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex h-16 w-full items-center gap-2 border-b border-border-default bg-background-default px-6',
        className
      )
    "
  >
    <template v-if="showSidebarToggle">
      <button
        type="button"
        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md p-2 text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        :aria-label="sidebarToggleLabel"
        @click="async (event) => onToggleSidebar && onToggleSidebar()"
      >
        <svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <path d="M9 4v16" stroke-linecap="round"></path>
        </svg>
      </button>
    </template>

    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
      <span class="text-foreground-muted">{{ breadcrumbRoot }}</span
      ><span aria-hidden="true" class="text-foreground-muted">/</span
      ><span aria-current="page" class="font-normal text-foreground-default">{{
        breadcrumbCurrent
      }}</span>
    </nav>
    <template v-if="showSearch">
      <div
        class="ml-4 flex h-8 w-full max-w-xs items-center gap-2 rounded-lg border border-border-default bg-background-default px-3 focus-within:ring-2 focus-within:ring-focus-ring-primary"
      >
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-foreground-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" :d="ICON_PATHS.search"></path></svg
        ><input
          type="search"
          class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-muted"
          :value="searchValue"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          @input="
            async (event) =>
              onSearchChange && onSearchChange(event.target.value)
          "
        />
      </div>
    </template>

    <div class="ml-auto flex flex-1 items-center justify-end gap-2">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

export interface TopbarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  showSidebarToggle?: boolean;
  sidebarToggleLabel?: string;
  breadcrumbRoot?: string;
  breadcrumbCurrent?: string;
  className?: string;

  onSearchChange?: (value: string) => void;
  onToggleSidebar?: () => void;
}

const props = withDefaults(defineProps<TopbarProps>(), {
  className: "",
  showSidebarToggle: true,
  sidebarToggleLabel: "Toggle sidebar",
  onToggleSidebar: undefined,
  breadcrumbRoot: "Home",
  breadcrumbCurrent: "Breadcrumb",
  showSearch: false,
  searchValue: "",
  searchPlaceholder: "Search",
  onSearchChange: undefined,
});
defineSlots<{ default?: () => any }>();
</script>