<script context="module" lang="ts">
  export interface StepperProps {
    orientation?: "horizontal" | "vertical";
    current?: number;
    steps?: string[];
    ariaLabel?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import {
    cn,
    cva,
    getStepperStepState,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let ariaLabel: StepperProps["ariaLabel"] = "Progress";
  export let className: StepperProps["className"] = "";

  export let orientation: StepperProps["orientation"] = "horizontal";
  export let steps: StepperProps["steps"] = [
    "Cart",
    "Shipping",
    "Payment",
    "Review",
  ];
  export let current: StepperProps["current"] = 1;
</script>

<nav
  data-ctrl={typeof bindControllerProps}
  aria-label={ariaLabel}
  class={cn("w-full bg-background-default", className)}
>
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default && orientation === "vertical"}
    <ol class="flex flex-col">
      {#each steps as step, index (index)}
        <li class="flex gap-2">
          <div class="flex flex-col items-center gap-1">
            <span
              class={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                cva(
                  getStepperStepState(index, current, (steps || []).length)
                    .stepKey,
                  {
                    completed: "bg-primary-default text-primary-foreground",
                    active:
                      "border-2 border-primary-default bg-background-default text-primary-default",
                    upcoming: "bg-background-muted text-foreground-muted",
                  },
                  "upcoming"
                )
              )}
              aria-current={getStepperStepState(
                index,
                current,
                (steps || []).length
              ).isCurrent
                ? "step"
                : undefined}
            >
              {#if getStepperStepState(index, current, (steps || []).length).isCompleted}
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
              {#if !getStepperStepState(index, current, (steps || []).length).isCompleted}
                {index + 1}
              {/if}</span
            >
            {#if !getStepperStepState(index, current, (steps || []).length).isLast}
              <span
                aria-hidden="true"
                class={cn(
                  "w-0.5 flex-1",
                  getStepperStepState(index, current, (steps || []).length)
                    .isCompleted
                    ? "bg-primary-default"
                    : "bg-border-default"
                )}
              />
            {/if}
          </div>
          <span
            class={cn(
              "pb-6 pt-1.5 text-sm",
              cva(
                getStepperStepState(index, current, (steps || []).length)
                  .stepKey,
                {
                  completed: "text-foreground-default font-medium",
                  active: "text-foreground-default font-semibold",
                  upcoming: "text-foreground-muted",
                },
                "upcoming"
              )
            )}>{step}</span
          >
        </li>
      {/each}
    </ol>
  {/if}
  {#if !$$slots.default && orientation === "horizontal"}
    <ol class="flex w-full items-start">
      {#each steps as step, index (index)}
        <li class="flex flex-1 flex-col items-center gap-2">
          <div class="flex w-full items-center">
            <span
              aria-hidden="true"
              class={cn(
                "h-0.5 flex-1",
                index === 0
                  ? "bg-transparent"
                  : getStepperStepState(index, current, (steps || []).length)
                      .prevCompleted
                  ? "bg-primary-default"
                  : "bg-border-default"
              )}
            /><span
              class={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                cva(
                  getStepperStepState(index, current, (steps || []).length)
                    .stepKey,
                  {
                    completed: "bg-primary-default text-primary-foreground",
                    active:
                      "border-2 border-primary-default bg-background-default text-primary-default",
                    upcoming: "bg-background-muted text-foreground-muted",
                  },
                  "upcoming"
                )
              )}
              aria-current={getStepperStepState(
                index,
                current,
                (steps || []).length
              ).isCurrent
                ? "step"
                : undefined}
            >
              {#if getStepperStepState(index, current, (steps || []).length).isCompleted}
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
              {#if !getStepperStepState(index, current, (steps || []).length).isCompleted}
                {index + 1}
              {/if}</span
            ><span
              aria-hidden="true"
              class={cn(
                "h-0.5 flex-1",
                getStepperStepState(index, current, (steps || []).length).isLast
                  ? "bg-transparent"
                  : getStepperStepState(index, current, (steps || []).length)
                      .isCompleted
                  ? "bg-primary-default"
                  : "bg-border-default"
              )}
            />
          </div>
          <span
            class={cn(
              "text-center text-sm",
              cva(
                getStepperStepState(index, current, (steps || []).length)
                  .stepKey,
                {
                  completed: "text-foreground-default font-medium",
                  active: "text-foreground-default font-semibold",
                  upcoming: "text-foreground-muted",
                },
                "upcoming"
              )
            )}>{step}</span
          >
        </li>
      {/each}
    </ol>
  {/if}
</nav>