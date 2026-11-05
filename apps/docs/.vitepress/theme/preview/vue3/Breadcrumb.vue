<template>
  <nav
    aria-label="Breadcrumb"
    :data-ctrl="typeof bindControllerProps"
    :class="cn('w-full', className)"
  >
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <template v-if="$slots.default">
        <slot />
      </template>

      <template v-if="!$slots.default">
        <template
          :key="item.key"
          v-for="(item, index) in getBreadcrumbState(props)"
        >
          <li class="flex items-center gap-1.5">
            <template v-if="item.isEllipsis">
              <span class="px-1 text-foreground-muted" aria-hidden="true">{{
                item.label
              }}</span>
            </template>

            <template v-if="!item.isEllipsis && item.isCurrent">
              <span
                aria-current="page"
                class="font-normal text-foreground-default"
                >{{ item.label }}</span
              >
            </template>

            <template v-if="!item.isEllipsis && !item.isCurrent">
              <a
                class="rounded-sm text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                :href="item.href"
                @click="
                  async (event) =>
                    onNavigate && onNavigate(item.href, item.originalIndex)
                "
                >{{ item.label }}</a
              >
            </template>

            <template v-if="!item.isCurrent">
              <span class="text-foreground-muted" aria-hidden="true">/</span>
            </template>
          </li>
        </template>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { cn, getBreadcrumbState, bindControllerProps } from "./utils";

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
  originalIndex: number;
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
  className: "",

  onNavigate: undefined,
  items: () => [],
  type: '2',
  showEllipsis: true,
  maxItems: 4,
});
defineSlots<{ default?: () => any }>();
</script>