<script context="module" lang="ts">
  export interface ProgressbarProps {
    value?: number;
    label?: string;
    showLabel?: boolean;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let value: ProgressbarProps["value"] = 0;
  export let className: ProgressbarProps["className"] = "";
  export let showLabel: ProgressbarProps["showLabel"] = false;
  export let label: ProgressbarProps["label"] = "Progress";
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

  $: percentage = () => {
    const raw = value;
    if (raw < 0) {
      return 0;
    }
    if (raw > 100) {
      return 100;
    }
    return raw;
  };
  $: barStyle = () => {
    return {
      width: percentage() + "%",
    };
  };
</script>

<div class={cn("flex w-full flex-col gap-2", className)}>
  {#if showLabel}
    <div
      class="flex items-center justify-between text-xs text-foreground-muted"
    >
      <span>{label}</span><span>{percentage()}%</span>
    </div>
  {/if}
  <div
    role="progressbar"
    class="h-2 w-full overflow-hidden rounded-rounded-full bg-components-progressbar-all-color-track-background-default"
    aria-valuenow={percentage()}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
  >
    <div
      style={stringifyStyles(barStyle())}
      class="h-2 rounded-rounded-full bg-components-progressbar-all-color-indicator-background-default transition-all"
    />
  </div>
</div>