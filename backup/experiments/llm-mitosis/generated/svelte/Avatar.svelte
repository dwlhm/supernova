<script context="module" lang="ts">
  export interface AvatarProps {
    color?: "primary" | "secondary" | "positive";
    shape?: "round" | "square";
    size?: "small" | "medium";
    name?: string;
    initials?: string;
    src?: string;
    alt?: string;
  }
</script>

<script lang="ts">
  export let initials: AvatarProps["initials"] = "";
  export let name: AvatarProps["name"] = "";
  export let shape: AvatarProps["shape"] = "round";
  export let size: AvatarProps["size"] = "medium";
  export let color: AvatarProps["color"] = "primary";
  export let alt: AvatarProps["alt"] = "";
  export let src: AvatarProps["src"];

  $: initialsText = () => {
    if (initials && initials.trim()) {
      return initials.trim().slice(0, 2).toUpperCase();
    }
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return "?";
  };
  $: classes = () => {
    const base =
      "inline-flex items-center justify-center font-medium text-white overflow-hidden select-none shrink-0";
    const shapeCls = shape === "square" ? "rounded-lg" : "rounded-full";
    const sizeCls = size === "small" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
    let colorCls = "bg-blue-600";
    if (color === "secondary") {
      colorCls = "bg-purple-600";
    } else if (color === "positive") {
      colorCls = "bg-green-600";
    }
    return [base, shapeCls, sizeCls, colorCls].join(" ");
  };
  $: accessibleLabel = () => {
    return alt || name || "User avatar";
  };
</script>

<div role="img" class={classes()} aria-label={accessibleLabel()}>
  {#if Boolean(src)}
    <img class="w-full h-full object-cover" {src} alt={accessibleLabel()} />
  {:else}
    <span>{initialsText()}</span>
  {/if}
</div>