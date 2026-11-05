<script context="module" lang="ts">
  export interface MetricCardProps {
    label?: string;
    value?: string;
    showValue?: boolean;
    trendText?: string;
    showTrend?: boolean;
    trendDirection?: "up" | "down" | "neutral";
    descriptionText?: string;
    showDescription?: boolean;
    showIcon?: boolean;
    showStatus?: boolean;
    statusLabel?: string;
    statusVariant?: "default" | "success" | "warning" | "error" | "info";
    showProgress?: boolean;
    progress?: number;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, getProgressState, bindControllerProps } from "./utils";

  export let className: MetricCardProps["className"] = "";
  export let label: MetricCardProps["label"] = "Total Revenue";
  export let showStatus: MetricCardProps["showStatus"] = true;
  export let statusVariant: MetricCardProps["statusVariant"] = "default";
  export let statusLabel: MetricCardProps["statusLabel"] = "On track";
  export let showIcon: MetricCardProps["showIcon"] = true;
  export let showValue: MetricCardProps["showValue"] = true;
  export let value: MetricCardProps["value"] = "$45,231.89";
  export let showTrend: MetricCardProps["showTrend"] = true;
  export let showDescription: MetricCardProps["showDescription"] = true;
  export let trendDirection: MetricCardProps["trendDirection"] = "up";
  export let trendText: MetricCardProps["trendText"] = "+20.1%";
  export let descriptionText: MetricCardProps["descriptionText"] =
    "from last month";
  export let showProgress: MetricCardProps["showProgress"] = false;
  export let progress: MetricCardProps["progress"] = 0;

  function stringifyStyles(stylesObj) {
    let styles = "";
    for (let key in stylesObj) {
      const dashedKey = key.replace(/[A-Z]/g, function (match) {
        return "-" + match.toLowerCase();
      });
      styles += dashedKey + ":" + stylesObj[key] + ";";
    }
    return styles;
  }
</script>

<article
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm",
    className
  )}
>
  <div class="flex items-center justify-between gap-2">
    <span class="flex-1 truncate text-xs font-medium text-foreground-muted"
      >{label}</span
    >
    {#if showStatus}
      <span
        class={cn(
          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium leading-4",
          cva(
            statusVariant,
            {
              success: "bg-success-subtle text-success-foreground",
              warning: "bg-warning-subtle text-warning-foreground",
              error: "bg-destructive-subtle text-destructive-foreground",
              info: "bg-info-subtle text-info-foreground",
              default: "bg-background-muted text-foreground-muted",
            },
            "default"
          )
        )}>{statusLabel}</span
      >
    {/if}
    {#if showIcon}
      <span
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default"
        aria-hidden="true"
        ><svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path
            d="M4 20V10M10 20V4M16 20v-7M22 20H2"
            stroke-linecap="round"
          /></svg
        ></span
      >
    {/if}
  </div>
  {#if showValue}
    <p class="truncate text-xl leading-6 font-semibold text-foreground-default">
      {value}
    </p>
  {/if}
  {#if showTrend || showDescription}
    <div class="flex flex-wrap items-center gap-1">
      {#if showTrend}
        <span
          class={cn(
            "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold leading-4",
            cva(
              trendDirection,
              {
                down: "bg-destructive-subtle text-destructive-foreground",
                neutral: "bg-background-muted text-foreground-muted",
                up: "bg-success-subtle text-success-foreground",
              },
              "up"
            )
          )}>{trendText}</span
        >
      {/if}
      {#if showDescription}
        <span class="truncate text-xs text-foreground-muted"
          >{descriptionText}</span
        >
      {/if}
    </div>
  {/if}
  {#if showProgress}
    <div
      class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
      role="progressbar"
      aria-valuenow={getProgressState(progress).percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        style={stringifyStyles(getProgressState(progress).barStyle)}
        class="h-2 rounded-full bg-chart-series-1"
      />
    </div>
  {/if}
  {#if $$slots.default}
    <div class="w-full"><slot /></div>
  {/if}
</article>