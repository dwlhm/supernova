<script context="module" lang="ts">
  export interface ToggleGroupItem {
    id: string;
    label: string;
    checked?: boolean;
    disabled?: boolean;
  }

  export interface ToggleGroupProps {
    items?: ToggleGroupItem[];
    size?: "small" | "medium" | "large";
    showLabel?: boolean;
    label?: string;
    className?: string;
    onToggle?: (id: string, checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";
  import SwitchButton from "./SwitchButton.svelte";

  export let onToggle: ToggleGroupProps["onToggle"];
  export let className: ToggleGroupProps["className"] = "";
  export let showLabel: ToggleGroupProps["showLabel"] = true;
  export let label: ToggleGroupProps["label"] = "Settings";
  export let items: ToggleGroupProps["items"] = [];
  export let size: ToggleGroupProps["size"] = "medium";

  function handleToggle(id: string, checked: boolean) {
    if (onToggle) {
      onToggle(id, checked);
    }
  }
</script>

<fieldset
  class={cn(
    "flex w-full flex-col rounded-rounded-lg border border-components-toggle-group-all-color-container-border-stroke-default",
    className
  )}
>
  {#if showLabel}
    <legend
      class="px-4 py-2 text-xs font-medium uppercase tracking-wide text-foreground-muted"
      >{label}</legend
    >
  {/if}
  {#each items as item (item.id)}
    <div
      class="flex items-center justify-between gap-4 border-t border-components-toggle-group-all-color-container-border-stroke-default px-4 py-3 first:border-t-0"
    >
      <span class="text-sm text-foreground-default">{item.label}</span
      ><SwitchButton
        checked={item.checked}
        disabled={item.disabled}
        {size}
        label={item.label}
        leftLabel={false}
        rightLabel={false}
        onCheckedChange={(checked) => handleToggle(item.id, checked)}
      />
    </div>
  {/each}
</fieldset>