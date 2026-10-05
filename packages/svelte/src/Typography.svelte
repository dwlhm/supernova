<script context="module" lang="ts">
  // This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

  export interface TypographyProps {
    children?: any;
    variant?:
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "body"
      | "body-sm"
      | "caption";
    color?: string;
    align?: "left" | "center" | "right";
    weight?: "normal" | "medium" | "semibold" | "bold";
  }
</script>

<script lang="ts">
  import { resolveVariantClass } from "./runtime/component-runtime";

  export let variant: TypographyProps["variant"] = "body";
  export let align: TypographyProps["align"] = "left";
  export let weight: TypographyProps["weight"];
  export let color: TypographyProps["color"];

  $: variantClass = () => {
    return resolveVariantClass(
      {
        h1: "text-4xl font-bold tracking-tight",
        h2: "text-3xl font-semibold tracking-tight",
        h3: "text-2xl font-semibold",
        h4: "text-xl font-semibold",
        h5: "text-lg font-semibold",
        h6: "text-base font-semibold",
        "body-sm": "text-xs leading-normal",
        caption: "text-[11px] leading-tight text-slate-500",
        body: "text-sm leading-relaxed",
      },
      variant,
      "body"
    );
  };
  $: alignClass = () => {
    return resolveVariantClass(
      {
        center: "text-center",
        right: "text-right",
        left: "text-left",
      },
      align,
      "left"
    );
  };
  $: weightClass = () => {
    return resolveVariantClass(
      {
        bold: "font-bold",
        semibold: "font-semibold",
        medium: "font-medium",
        normal: "font-normal",
      },
      weight,
      undefined
    );
  };
</script>

<div
  class={"m-0 text-slate-900" +
    " " +
    variantClass() +
    " " +
    alignClass() +
    " " +
    weightClass() +
    " " +
    (color || "")}
>
  <slot />
</div>