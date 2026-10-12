<script context="module" lang="ts">
  export interface IconPlaceholderProps {
    size?: number;
    ariaLabel?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let size: IconPlaceholderProps["size"] = 16;
  export let ariaLabel: IconPlaceholderProps["ariaLabel"] = "Placeholder icon";
  export let className: IconPlaceholderProps["className"] = "";
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

  $: dimensionStyle = () => {
    return {
      width: size + "px",
      height: size + "px",
    };
  };
</script>

<span
  style={stringifyStyles(dimensionStyle())}
  role="img"
  aria-label={ariaLabel}
  class={cn("inline-flex shrink-0 items-center justify-center", className)}
  ><svg
    class="h-full w-full text-foreground-muted"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
    ><rect x="3" y="3" width="18" height="18" rx="2" /><path
      d="M7 17 17 7"
      stroke-linecap="round"
    /></svg
  ></span
>