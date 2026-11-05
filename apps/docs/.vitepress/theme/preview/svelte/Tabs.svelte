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
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, handleRovingFocus, bindControllerProps } from "./utils";
  import TabItem from "./TabItem.svelte";

  export let ariaLabel: TabsProps["ariaLabel"] = "Tabs";
  export let tabs: TabsProps["tabs"] = [];
  export let activeTab: TabsProps["activeTab"] = "overview";
  export let onTabChange: TabsProps["onTabChange"];
  export let className: TabsProps["className"] = "";
</script>

<div
  role="tablist"
  data-ctrl={typeof bindControllerProps}
  aria-label={ariaLabel}
  on:keydown={(event) => {
    handleRovingFocus(
      event,
      Math.max(
        0,
        (tabs || []).findIndex((t) => t.id === activeTab)
      ),
      (tabs || []).length,
      (idx) =>
        onTabChange && (tabs || [])[idx] && onTabChange((tabs || [])[idx].id)
    );
  }}
  class={cn(
    "inline-flex h-9 items-center rounded-lg bg-background-muted p-0.5",
    className
  )}
>
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default}
    {#each tabs as tab (tab.id)}
      <TabItem
        label={tab.label}
        num={tab.num}
        active={activeTab === tab.id}
        showNum={tab.num !== undefined && tab.num !== ""}
        onClick={(event) => onTabChange && onTabChange(tab.id)}
      />
    {/each}
  {/if}
</div>