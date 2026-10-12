<script context="module" lang="ts">
  export interface SliderProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: string;
    showValue?: boolean;
    className?: string;
    onValueChange?: (value: number) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let max: SliderProps["max"] = 100;
  export let min: SliderProps["min"] = 0;
  export let value: SliderProps["value"] = 0;
  export let disabled: SliderProps["disabled"] = false;
  export let onValueChange: SliderProps["onValueChange"];
  export let className: SliderProps["className"] = "";
  export let showValue: SliderProps["showValue"] = false;
  export let label: SliderProps["label"] = "Slider";
  export let step: SliderProps["step"] = 1;
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

  function handleInput(rawValue: string) {
    if (disabled) {
      return;
    }
    const next = Number(rawValue);
    if (onValueChange && !isNaN(next)) {
      onValueChange(next);
    }
  }
  $: percentage = () => {
    const range = max - min;
    if (range <= 0) {
      return 0;
    }
    const raw = ((value - min) / range) * 100;
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
  $: thumbStyle = () => {
    return {
      left: percentage() + "%",
    };
  };
</script>

<div class={cn("flex w-full flex-col gap-2", className)}>
  {#if showValue}
    <div
      class="flex items-center justify-between text-xs text-foreground-muted"
    >
      <span>{label}</span><span>{value}</span>
    </div>
  {/if}
  <div
    class={cn(
      "relative flex h-5 w-full items-center",
      disabled && "opacity-50"
    )}
  >
    <div
      class="absolute inset-x-0 h-1.5 rounded-rounded-full bg-components-slider-default-color-track-background-default"
    />
    <div
      style={stringifyStyles(barStyle())}
      class="absolute left-0 h-1.5 rounded-rounded-full bg-components-slider-default-color-bar-background-default"
    />
    <div
      style={stringifyStyles(thumbStyle())}
      class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-rounded-full border border-components-slider-default-color-thumb-border-default bg-components-slider-default-color-thumb-background-default shadow-sm"
      aria-hidden="true"
    />
    <input
      type="range"
      class="absolute inset-0 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      {min}
      {max}
      {step}
      {value}
      {disabled}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      on:input={(event) => {
        handleInput(event.target.value);
      }}
    />
  </div>
</div>