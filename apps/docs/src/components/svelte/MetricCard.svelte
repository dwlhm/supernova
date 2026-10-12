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
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let trendDirection: MetricCardProps["trendDirection"] = "up";
  export let statusVariant: MetricCardProps["statusVariant"] = "default";
  export let progress: MetricCardProps["progress"] = 0;
  export let className: MetricCardProps["className"] = "";
  export let showIcon: MetricCardProps["showIcon"] = true;
  export let label: MetricCardProps["label"] = "Total Revenue";
  export let showStatus: MetricCardProps["showStatus"] = true;
  export let statusLabel: MetricCardProps["statusLabel"] = "On track";
  export let showValue: MetricCardProps["showValue"] = true;
  export let value: MetricCardProps["value"] = "$45,231.89";
  export let showTrend: MetricCardProps["showTrend"] = true;
  export let showDescription: MetricCardProps["showDescription"] = true;
  export let trendText: MetricCardProps["trendText"] = "+20.1%";
  export let descriptionText: MetricCardProps["descriptionText"] =
    "from last month";
  export let showProgress: MetricCardProps["showProgress"] = false;

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

  $: trendClasses = () => {
    if (trendDirection === "down") {
      return "bg-destructive-subtle text-destructive-foreground";
    }
    if (trendDirection === "neutral") {
      return "bg-background-muted text-foreground-muted";
    }
    return "bg-components-metric-card-all-color-trend-background-default text-components-metric-card-all-color-trend-foreground-default";
  };
  $: statusClasses = () => {
    switch (statusVariant) {
      case "success":
        return "bg-success-subtle text-success-foreground";
      case "warning":
        return "bg-warning-subtle text-warning-foreground";
      case "error":
        return "bg-destructive-subtle text-destructive-foreground";
      case "info":
        return "bg-info-subtle text-info-foreground";
      case "default":
      default:
        return "bg-background-muted text-foreground-muted";
    }
  };
  $: progressPercentage = () => {
    const raw = progress;
    if (raw < 0) {
      return 0;
    }
    if (raw > 100) {
      return 100;
    }
    return raw;
  };
  $: progressStyle = () => {
    return {
      width: progressPercentage() + "%",
    };
  };
</script>

<article
  class={cn(
    "flex w-full flex-col gap-2 rounded-rounded-lg border border-components-metric-card-all-color-container-border-default bg-components-metric-card-all-color-container-background-default p-4",
    className
  )}
>
  <div class="flex items-center gap-2">
    {#if showIcon}
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md bg-components-metric-card-all-color-icon-background-default"
        aria-hidden="true"
        ><svg
          class="h-4 w-4 text-components-metric-card-all-color-label-foreground-default"
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
    {/if}<span
      class="truncate text-xs font-medium text-components-metric-card-all-color-label-foreground-default"
      >{label}</span
    >
    {#if showStatus}
      <span
        class={cn(
          "ml-auto inline-flex shrink-0 items-center rounded-rounded-full px-2 py-0.5 text-xs font-medium leading-none",
          statusClasses()
        )}>{statusLabel}</span
      >
    {/if}
  </div>
  {#if showValue}
    <p
      class="truncate text-2xl font-semibold text-components-metric-card-all-color-value-foreground-default"
    >
      {value}
    </p>
  {/if}
  {#if showTrend || showDescription}
    <div class="flex flex-wrap items-center gap-2">
      {#if showTrend}
        <span
          class={cn(
            "inline-flex shrink-0 items-center gap-0.5 rounded-rounded-full px-2 py-0.5 text-xs font-medium leading-none",
            trendClasses()
          )}>{trendText}</span
        >
      {/if}
      {#if showDescription}
        <span
          class="truncate text-xs text-components-metric-card-all-color-description-foreground-default"
          >{descriptionText}</span
        >
      {/if}
    </div>
  {/if}
  {#if showProgress}
    <div
      class="h-2 w-full overflow-hidden rounded-rounded-full bg-background-muted"
      role="progressbar"
      aria-valuenow={progressPercentage()}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        style={stringifyStyles(progressStyle())}
        class="h-2 rounded-rounded-full bg-chart-series-1"
      />
    </div>
  {/if}
  {#if $$slots.default}
    <div class="w-full"><slot /></div>
  {/if}
</article>