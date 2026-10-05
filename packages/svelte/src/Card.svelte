<script context="module" lang="ts">
  // This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

  export interface CardProps {
    children?: any;
    title?: string;
    subtitle?: string;
    padding?: "none" | "sm" | "md" | "lg";
    shadow?: "none" | "sm" | "md" | "lg";
    bordered?: boolean;
    testId?: string;
    onClick?: (event: any) => void;
  }
</script>

<script lang="ts">
  import {
    resolveVariantClass,
    dispatchEvent,
  } from "./runtime/component-runtime";

  export let padding: CardProps["padding"] = "md";
  export let shadow: CardProps["shadow"] = "md";
  export let onClick: CardProps["onClick"];
  export let testId: CardProps["testId"];
  export let bordered: CardProps["bordered"] = false;
  export let title: CardProps["title"] = "";
  export let subtitle: CardProps["subtitle"] = "";

  $: paddingClass = () => {
    return resolveVariantClass(
      {
        none: "p-0",
        sm: "p-3",
        lg: "p-6",
        md: "p-4",
      },
      padding,
      "md"
    );
  };
  $: shadowClass = () => {
    return resolveVariantClass(
      {
        none: "shadow-none",
        sm: "shadow-sm",
        lg: "shadow-lg",
        md: "shadow-md",
      },
      shadow,
      "md"
    );
  };
</script>

<div
  on:click={(event) => {
    dispatchEvent(onClick, event, false);
  }}
  data-testid={testId}
  class={"bg-white rounded-lg overflow-hidden transition-shadow duration-150" +
    " " +
    (bordered ? "border border-slate-200" : "border-0") +
    " " +
    shadowClass() +
    " " +
    paddingClass() +
    " " +
    (onClick ? "cursor-pointer hover:shadow-lg" : "")}
>
  {#if title}
    <div class={subtitle ? "mb-1" : "mb-3"}>
      <h3 class="m-0 text-lg font-semibold text-slate-900 leading-snug">
        {title}
      </h3>
    </div>
  {/if}
  {#if subtitle}
    <div class="mb-3">
      <p class="m-0 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
    </div>
  {/if}<slot />
</div>