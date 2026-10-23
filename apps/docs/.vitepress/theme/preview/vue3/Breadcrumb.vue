<template>
  <nav aria-label="Breadcrumb" :class="cn('w-full', className)">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <template :key="item.key" v-for="(item, index) in visibleItems">
        <li class="flex items-center gap-1.5">
          <template v-if="item.isEllipsis">
            <span
              class="px-1 text-components-breadcrumb-all-color-item-foreground-default"
              aria-hidden="true"
              >{{ item.label }}</span
            >
          </template>

          <template v-if="!item.isEllipsis && item.isCurrent">
            <span
              aria-current="page"
              class="font-medium text-components-breadcrumb-all-color-current-page-foreground-default"
              >{{ item.label }}</span
            >
          </template>

          <template v-if="!item.isEllipsis && !item.isCurrent">
            <a
              class="rounded-rounded-sm text-components-breadcrumb-all-color-item-foreground-default transition-colors hover:text-components-breadcrumb-all-color-current-page-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              :href="item.href"
              @click="async (event) => handleNavigate(item.href, index)"
              >{{ item.label }}</a
            >
          </template>

          <template v-if="!item.isCurrent">
            <span
              class="text-components-breadcrumb-all-color-separator-stroke-default"
              aria-hidden="true"
            >
              /
            </span>
          </template>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export interface BreadcrumbEntry {
  key: string;
  label: string;
  href: string;
  isEllipsis: boolean;
  isCurrent: boolean;
}
export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  type?: "1" | "2" | "deep";
  showEllipsis?: boolean;
  maxItems?: number;
  className?: string;
  onNavigate?: (href: string, index: number) => void;
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  items: [],
  type: "deep",
  maxItems: 4,
  showEllipsis: true,
  onNavigate: undefined,
  className: "",
});

const visibleItems = computed(() => {
  const all: BreadcrumbItem[] = props.items || [];
  const total = all.length;
  const rows: BreadcrumbEntry[] = [];
  if (total === 0) {
    return rows;
  }
  let startIndex = 0;
  const endIndex = total - 1;
  let collapsed = false;
  if (props.type === "1") {
    startIndex = total - 1;
  } else if (props.type === "2") {
    startIndex = total > 1 ? total - 2 : total - 1;
  } else {
    const limit = props.maxItems || 4;
    if (props.showEllipsis && total > limit) {
      collapsed = true;
    }
  }
  if (!collapsed) {
    for (let i = startIndex; i <= endIndex; i++) {
      rows.push({
        key: "crumb-" + i,
        label: all[i].label,
        href: all[i].href || "#",
        isEllipsis: false,
        isCurrent: i === endIndex,
      });
    }
    return rows;
  }
  rows.push({
    key: "crumb-first",
    label: all[0].label,
    href: all[0].href || "#",
    isEllipsis: false,
    isCurrent: false,
  });
  rows.push({
    key: "crumb-ellipsis",
    label: "...",
    href: "#",
    isEllipsis: true,
    isCurrent: false,
  });
  for (let i = endIndex - 1; i <= endIndex; i++) {
    rows.push({
      key: "crumb-" + i,
      label: all[i].label,
      href: all[i].href || "#",
      isEllipsis: false,
      isCurrent: i === endIndex,
    });
  }
  return rows;
});

function handleNavigate(href: string, index: number) {
  if (props.onNavigate && href !== "#") {
    props.onNavigate(href, index);
  }
}
</script>