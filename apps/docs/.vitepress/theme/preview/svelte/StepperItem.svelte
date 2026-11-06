<script context="module" lang="ts">
  export interface StepperItemProps {
    step?: number;
    status?: "completed" | "active" | "upcoming";
    orientation?: "horizontal" | "vertical";
    isLast?: boolean;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, ICON_PATHS } from "./utils";

  export let orientation: StepperItemProps["orientation"] = "horizontal";
  export let isLast: StepperItemProps["isLast"] = false;
  export let className: StepperItemProps["className"] = "";
  export let status: StepperItemProps["status"] = "upcoming";
  export let step: StepperItemProps["step"] = 1;
</script>

<li
  class={cn(
    "flex items-start justify-start",
    orientation === "vertical"
      ? "flex-col"
      : !isLast
      ? "flex-1 flex-row"
      : "flex-row",
    className
  )}
>
  <div
    class={cn(
      "flex items-center justify-start gap-2",
      orientation === "vertical" ? "flex-row" : "flex-col"
    )}
  >
    <span
      class={cn(
        "flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full text-center text-xs font-semibold",
        cva(
          status,
          {
            completed: "bg-success-subtle text-success-foreground",
            active: "bg-primary-default text-primary-foreground",
            upcoming: "bg-background-muted text-foreground-muted",
          },
          "upcoming"
        )
      )}
      aria-current={status === "active" ? "step" : undefined}
    >
      {#if status === "completed"}
        <svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d={ICON_PATHS.check}
          /></svg
        >
      {/if}
      {#if status !== "completed"}
        {step}
      {/if}</span
    ><span
      class={cn(
        "text-sm",
        orientation === "horizontal" && "text-center",
        cva(
          status,
          {
            completed: "font-medium text-foreground-default",
            active: "font-semibold text-foreground-default",
            upcoming: "font-medium text-foreground-muted",
          },
          "upcoming"
        )
      )}><slot /></span
    >
  </div>
  {#if !isLast}
    <div
      aria-hidden="true"
      class={cn(
        "flex items-center justify-center",
        orientation === "vertical" ? "h-8 w-8 flex-row" : "h-8 flex-1 flex-col"
      )}
    >
      <span
        class={cn(
          orientation === "vertical" ? "h-8 w-0.5" : "h-0.5 w-full",
          status === "completed" ? "bg-success-foreground" : "bg-border-default"
        )}
      />
    </div>
  {/if}
</li>