<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    :class="
      cn(
        'inline-flex h-9 items-center rounded-rounded-xl bg-components-tabs-all-color-container-background-default p-1',
        className
      )
    "
  >
    <template :key="tab.id" v-for="(tab, index) in tabs">
      <TabItem
        :label="tab.label"
        :num="tab.num"
        :active="activeTab === tab.id"
        :showNum="tab.num !== undefined && tab.num !== ''"
        :onClick="(event) => handleTabChange(tab.id)"
      ></TabItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { cn } from "./utils";
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
  onTabChange: undefined,
  ariaLabel: "Tabs",
  className: "",
  tabs: [],
  activeTab: "",
});

function handleTabChange(id: string) {
  if (props.onTabChange) {
    props.onTabChange(id);
  }
}
</script>