<script context="module" lang="ts">
  export interface TabItemProps {
    label?: string;
    active?: boolean;
    showIcon?: boolean;
    showNum?: boolean;
    num?: string;
    className?: string;
    children?: any;
    onClick?: () => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let active: TabItemProps["active"] = false;
  export let onClick: TabItemProps["onClick"];
  export let className: TabItemProps["className"] = "";
  export let showIcon: TabItemProps["showIcon"] = false;

  export let label: TabItemProps["label"] = "Label";
  export let showNum: TabItemProps["showNum"] = false;
  export let num: TabItemProps["num"] = "1";

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
  $: tabClasses = () => {
    return active
      ? "bg-components-tabs-active-color-tab-background-default border border-components-tabs-active-color-tab-border-default shadow-sm text-components-tabs-active-color-label-foreground-default"
      : "border border-transparent text-components-tabs-inactive-color-label-foreground-default hover:bg-background-default";
  };
</script>

<button
  type="button"
  role="tab"
  aria-selected={active}
  class={cn(
    "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
    tabClasses(),
    className
  )}
  on:click={(event) => {
    handleClick();
  }}
>
  {#if showIcon}
    <span
      class="flex shrink-0 items-center text-components-tabs-all-color-icon-foreground-default"
    >
      {#if $$slots.default}
        <slot />
      {/if}
      {#if !$$slots.default}
        <svg
          aria-hidden="true"
          class="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" /></svg
        >
      {/if}</span
    >
  {/if}<span class="truncate">{label}</span>
  {#if showNum}
    <span
      class="inline-flex shrink-0 items-center rounded-rounded-full bg-components-tabs-all-color-num-background-default px-1 py-0.5 text-xs font-medium leading-none text-components-tabs-all-color-num-foreground-default"
      >{num}</span
    >
  {/if}</button
>