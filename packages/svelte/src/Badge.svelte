<script context="module" lang="ts">
  // This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

  export interface BadgeProps {
    children?: any;
    variant?:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "outline";
    size?: "sm" | "md";
    rounded?: boolean;
  }
</script>

<script lang="ts">
  import { resolveVariantClass } from "./runtime/component-runtime";

  export let size: BadgeProps["size"] = "md";
  export let variant: BadgeProps["variant"] = "primary";
  export let rounded: BadgeProps["rounded"] = false;

  $: sizeClass = () => {
    return resolveVariantClass(
      {
        sm: "px-1.5 py-0.5 text-[11px]",
        md: "px-2 py-0.5 text-xs",
      },
      size,
      "md"
    );
  };
  $: variantClass = () => {
    return resolveVariantClass(
      {
        secondary: "bg-slate-100 text-slate-700 border-transparent",
        success: "bg-green-100 text-green-700 border-transparent",
        warning: "bg-amber-100 text-amber-800 border-transparent",
        danger: "bg-red-100 text-red-700 border-transparent",
        outline: "bg-transparent text-slate-700 border-slate-300",
        primary: "bg-blue-100 text-blue-700 border-transparent",
      },
      variant,
      "primary"
    );
  };
</script>

<span
  class={"inline-flex items-center justify-center font-semibold leading-none border" +
    " " +
    (rounded ? "rounded-full" : "rounded") +
    " " +
    sizeClass() +
    " " +
    variantClass()}><slot /></span
>