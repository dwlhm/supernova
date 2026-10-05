<script context="module" lang="ts">
  // This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

  export interface StatusBadgeProps {
    children?: any;
    icon?: any;
    text?: string;
    variant?: "success" | "warning" | "danger" | "info";
    testId?: string;
    onClick?: (event: any) => void;
  }
</script>

<script lang="ts">
  import {
    resolveVariantClass,
    dispatchEvent,
  } from "./runtime/component-runtime";

  export let variant: StatusBadgeProps["variant"] = "success";
  export let onClick: StatusBadgeProps["onClick"];
  export let testId: StatusBadgeProps["testId"];
  export let icon: StatusBadgeProps["icon"] = "";
  export let text: StatusBadgeProps["text"] = "";

  $: variantClass = () => {
    return resolveVariantClass(
      {
        warning: "bg-amber-100 text-amber-800 border-amber-300",
        danger: "bg-red-100 text-red-800 border-red-300",
        info: "bg-blue-100 text-blue-800 border-blue-300",
        success: "bg-green-100 text-green-800 border-green-300",
      },
      variant,
      "success"
    );
  };
</script>

<div
  on:click={(event) => {
    dispatchEvent(onClick, event, false);
  }}
  data-testid={testId}
  class={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium" +
    " " +
    variantClass() +
    " " +
    (onClick ? "cursor-pointer hover:opacity-90" : "")}
>
  {#if icon}
    <p class="m-0 leading-none">{icon}</p>
  {/if}
  {#if text}
    <p class="m-0 leading-none">{text}</p>
  {/if}<slot />
</div>