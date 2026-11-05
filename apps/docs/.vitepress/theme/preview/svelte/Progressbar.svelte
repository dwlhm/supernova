<script context="module" lang="ts">
  export interface ProgressbarProps {
    value?: number;
    label?: string;
    showLabel?: boolean;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn, getProgressState, bindControllerProps } from "./utils";

  export let className: ProgressbarProps["className"] = "";
  export let showLabel: ProgressbarProps["showLabel"] = false;
  export let label: ProgressbarProps["label"] = "Progress";
  export let value: ProgressbarProps["value"] = 0;
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

<div
  data-ctrl={typeof bindControllerProps}
  class={cn("flex w-full flex-col gap-2", className)}
>
  {#if showLabel}
    <div
      class="flex items-center justify-between text-xs text-foreground-muted"
    >
      <span>{label}</span><span>{getProgressState(value).percentage}%</span>
    </div>
  {/if}
  <div
    role="progressbar"
    class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
    aria-valuenow={getProgressState(value).percentage}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
  >
    <div
      style={stringifyStyles(getProgressState(value).barStyle)}
      class="h-2 rounded-full bg-primary-default transition-all"
    />
  </div>
</div>