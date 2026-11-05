<template>
  <div
    role="tablist"
    :data-ctrl="typeof bindControllerProps"
    :aria-label="ariaLabel"
    @keydown="
      async (event) =>
        handleRovingFocus(
          event,
          Math.max(
            0,
            (tabs || []).findIndex((t) => t.id === activeTab)
          ),
          (tabs || []).length,
          (idx) =>
            onTabChange &&
            (tabs || [])[idx] &&
            onTabChange((tabs || [])[idx].id)
        )
    "
    :class="
      cn(
        'inline-flex h-9 items-center rounded-lg bg-background-muted p-0.5',
        className
      )
    "
  >
    <template v-if="$slots.default">
      <slot />
    </template>

    <template v-if="!$slots.default">
      <template :key="tab.id" v-for="(tab, index) in tabs">
        <TabItem
          :label="tab.label"
          :num="tab.num"
          :active="activeTab === tab.id"
          :showNum="tab.num !== undefined && tab.num !== ''"
          :onClick="(event) => onTabChange && onTabChange(tab.id)"
        ></TabItem>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { cn, handleRovingFocus, bindControllerProps } from "./utils";
import TabItem from "./TabItem.vue";

export interface TabData {
  id: string;
  label: string;
  num?: string;
}
export interface TabsProps {
  tabs?: TabData[];
  activeTab?: string;
  ariaLabel?: string;
  className?: string;

  onTabChange?: (id: string) => void;
}

const props = withDefaults(defineProps<TabsProps>(), {
  ariaLabel: "Tabs",
  tabs: () => [],
  activeTab: "overview",
  onTabChange: undefined,
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>