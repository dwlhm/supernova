<script context="module" lang="ts">
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
</script>

<script lang="ts">
  import { cn } from "./utils";
  import TabItem from "./TabItem.svelte";

  export let onTabChange: TabsProps["onTabChange"];
  export let ariaLabel: TabsProps["ariaLabel"] = "Tabs";
  export let className: TabsProps["className"] = "";
  export let tabs: TabsProps["tabs"] = [];
  export let activeTab: TabsProps["activeTab"] = "";

  function handleTabChange(id: string) {
    if (onTabChange) {
      onTabChange(id);
    }
  }
</script>

<div
  role="tablist"
  aria-label={ariaLabel}
  class={cn(
    "inline-flex h-9 items-center rounded-rounded-xl bg-components-tabs-all-color-container-background-default p-1",
    className
  )}
>
  {#each tabs as tab (tab.id)}
    <TabItem
      label={tab.label}
      num={tab.num}
      active={activeTab === tab.id}
      showNum={tab.num !== undefined && tab.num !== ""}
      onClick={(event) => handleTabChange(tab.id)}
    />
  {/each}
</div>