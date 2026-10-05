<script context="module" lang="ts">
  // This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

  export interface ButtonProps {
    children?: any;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (event: any) => void;
  }
</script>

<script lang="ts">
  import {
    resolveVariantClass,
    dispatchEvent,
  } from "./runtime/component-runtime";

  export let size: ButtonProps["size"] = "md";
  export let variant: ButtonProps["variant"] = "primary";
  export let onClick: ButtonProps["onClick"];
  export let disabled: ButtonProps["disabled"] = false;
  export let type: ButtonProps["type"] = "button";
  export let fullWidth: ButtonProps["fullWidth"] = false;

  $: sizeClass = () => {
    return resolveVariantClass(
      {
        sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5",
        lg: "px-6 py-3 text-base rounded-lg gap-2.5",
        md: "px-4 py-2 text-sm rounded-md gap-2",
      },
      size,
      "md"
    );
  };
  $: variantClass = () => {
    return resolveVariantClass(
      {
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 dark:bg-slate-800 dark:text-slate-100",
        outline:
          "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
        ghost:
          "bg-transparent text-blue-600 border-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30",
        danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
        primary: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
      },
      variant,
      "primary"
    );
  };
</script>

<button
  on:click={(event) => {
    dispatchEvent(onClick, event, disabled);
  }}
  type={type || "button"}
  {disabled}
  class={"inline-flex items-center justify-center font-medium transition-colors duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed" +
    " " +
    (fullWidth ? "w-full" : "w-auto") +
    " " +
    sizeClass() +
    " " +
    variantClass()}><slot /></button
>