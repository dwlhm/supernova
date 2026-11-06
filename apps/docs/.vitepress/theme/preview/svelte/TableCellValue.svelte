<script context="module" lang="ts">
  export interface TableCellValueProps {
    layout?: "row" | "stacked";
    align?: "left" | "center" | "right";
    status?: "none" | "success" | "warning" | "destructive" | "info";
    imageSrc?: string;
    imageAlt?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";

  export let layout: TableCellValueProps["layout"] = "row";
  export let align: TableCellValueProps["align"] = "left";
  export let className: TableCellValueProps["className"] = "";
  export let imageSrc: TableCellValueProps["imageSrc"] = "";
  export let imageAlt: TableCellValueProps["imageAlt"] = "";
  export let status: TableCellValueProps["status"] = "none";
</script>

<span
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex min-w-0 text-sm text-foreground-default",
    cva(
      layout,
      {
        row: "flex-row items-center gap-2 font-normal",
        stacked: "flex-col items-start gap-0.5 font-medium",
      },
      "row"
    ),
    cva(
      align,
      {
        left: "justify-start text-left",
        center: "justify-center text-center",
        right: "justify-end text-right tabular-nums",
      },
      "left"
    ),
    className
  )}
>
  {#if imageSrc !== ""}
    <img
      class="h-7 w-7 shrink-0 rounded-sm object-cover"
      src={imageSrc}
      alt={imageAlt}
    />
  {/if}
  {#if status !== "none"}
    <span
      aria-hidden="true"
      class={cn(
        "h-2 w-2 shrink-0 rounded-full",
        cva(
          status,
          {
            none: "hidden",
            success: "bg-success-default",
            warning: "bg-warning-default",
            destructive: "bg-destructive-default",
            info: "bg-info-default",
          },
          "none"
        )
      )}
    />
  {/if}
  {#if $$slots.default}
    <slot />
  {/if}</span
>