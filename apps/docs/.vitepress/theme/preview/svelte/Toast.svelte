<script context="module" lang="ts">
  export interface ToastProps {
    type?: "default" | "success" | "error" | "warning" | "info";
    title?: string;
    description?: string;
    showDescription?: boolean;
    actionText?: string;
    showAction?: boolean;
    showClose?: boolean;
    timestamp?: string;
    showTimestamp?: boolean;
    className?: string;
    onAction?: () => void;
    onClose?: () => void;
  }
</script>

<script lang="ts">
  import {
    cn,
    cva,
    getToastIconPath,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let type: ToastProps["type"] = "default";
  export let showDescription: ToastProps["showDescription"] = false;
  export let className: ToastProps["className"] = "";
  export let title: ToastProps["title"] = "Toast Text";
  export let description: ToastProps["description"] =
    "Toast description text here";
  export let showTimestamp: ToastProps["showTimestamp"] = true;
  export let timestamp: ToastProps["timestamp"] = "11.29.45 AM";
  export let showAction: ToastProps["showAction"] = false;
  export let onAction: ToastProps["onAction"];
  export let actionText: ToastProps["actionText"] = "Undo";
  export let showClose: ToastProps["showClose"] = false;
  export let onClose: ToastProps["onClose"];
</script>

<div
  data-ctrl={typeof bindControllerProps}
  role={type === "error" ? "alert" : "status"}
  class={cn(
    "flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg",
    showDescription ? "rounded-xl" : "rounded-full",
    className
  )}
>
  <span
    aria-hidden="true"
    class={cn(
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5",
      cva(
        type,
        {
          success: "bg-success-subtle text-success-foreground",
          error: "bg-destructive-subtle text-destructive-foreground",
          warning: "bg-warning-subtle text-warning-foreground",
          info: "bg-info-subtle text-info-foreground",
          default: "bg-background-muted text-foreground-default",
        },
        "default"
      )
    )}
    ><svg
      class="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={getToastIconPath(type)}
      /></svg
    ></span
  ><span class="flex min-w-0 flex-1 flex-col"
    ><span
      class={cn(
        "truncate text-sm font-semibold",
        cva(
          type,
          {
            success: "text-success-foreground",
            error: "text-destructive-foreground",
            warning: "text-warning-foreground",
            info: "text-info-foreground",
            default: "text-foreground-default",
          },
          "default"
        )
      )}>{title}</span
    >
    {#if showDescription}
      <span class="text-xs text-foreground-muted">{description}</span>
    {/if}</span
  >
  {#if showTimestamp && timestamp !== ""}
    <span class="shrink-0 text-xs text-foreground-muted">{timestamp}</span>
  {/if}
  {#if showAction}
    <button
      type="button"
      class="shrink-0 rounded-md bg-secondary-default px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      on:click={(event) => {
        onAction && onAction();
      }}>{actionText}</button
    >
  {/if}
  {#if showClose}
    <button
      type="button"
      aria-label="Dismiss notification"
      class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      on:click={(event) => {
        onClose && onClose();
      }}
      ><svg
        aria-hidden="true"
        class="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        ><path stroke-linecap="round" d={ICON_PATHS.close} /></svg
      ></button
    >
  {/if}
</div>