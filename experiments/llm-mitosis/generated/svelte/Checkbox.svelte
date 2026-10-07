<script context="module" lang="ts">
  export interface CheckboxProps {
    id: string;
    name?: string;
    value?: string;
    checked: boolean;
    label: string;
    disabled?: boolean;
    required?: boolean;
    size?: "small" | "medium" | "large";
    labelPosition?: "left" | "right";
    onCheckedChange: (checked: boolean) => void;
  }
</script>

<script lang="ts">
  export let id: CheckboxProps["id"];
  export let label: CheckboxProps["label"];
  export let checked: CheckboxProps["checked"];
  export let onCheckedChange: CheckboxProps["onCheckedChange"];
  export let labelPosition: CheckboxProps["labelPosition"] = "right";
  export let size: CheckboxProps["size"] = "medium";
  export let disabled: CheckboxProps["disabled"] = false;
  export let name: CheckboxProps["name"];
  export let value: CheckboxProps["value"] = "on";
  export let required: CheckboxProps["required"] = false;

  $: invalid = () => {
    return (
      !id ||
      !id.trim() ||
      !label ||
      !label.trim() ||
      typeof checked !== "boolean" ||
      typeof onCheckedChange !== "function"
    );
  };
</script>

<div class="lm-checkbox">
  {#if invalid()}
    <p role="alert">
      Checkbox requires an id, a label, boolean checked state, and a change
      callback.
    </p>
  {:else}
    <label
      class="lm-checkbox-label"
      for={id}
      data-position={labelPosition}
      data-size={size}
      data-disabled={disabled ? "true" : "false"}
      ><input
        class="lm-checkbox-input"
        type="checkbox"
        {id}
        {name}
        {value}
        {checked}
        {disabled}
        {required}
        on:change={(event) => {
          onCheckedChange(event.target.checked);
        }}
      /><span>{label}</span></label
    >
  {/if}
</div>

<style>
  .lm-checkbox {
    color: var(--color-foreground-neutral);
    font: var(--typography-body-regular);
  }
  .lm-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .lm-checkbox-label[data-position="left"] {
    flex-direction: row-reverse;
  }
  .lm-checkbox-label[data-size="small"] {
    gap: 6px;
  }
  .lm-checkbox-label[data-size="large"] {
    gap: 10px;
  }
  .lm-checkbox-label[data-disabled="true"] {
    color: var(--color-foreground-neutral-faded);
    cursor: not-allowed;
  }
  .lm-checkbox-input {
    margin: 0;
    width: 16px;
    height: 16px;
    border-radius: 6px;
    accent-color: var(--color-background-primary);
    cursor: inherit;
    flex-shrink: 0;
  }
  .lm-checkbox-label[data-size="small"] .lm-checkbox-input {
    width: 14px;
    height: 14px;
    border-radius: 4px;
  }
  .lm-checkbox-label[data-size="large"] .lm-checkbox-input {
    width: 20px;
    height: 20px;
    border-radius: 8px;
  }
  .lm-checkbox-input:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 3px;
  }
</style>