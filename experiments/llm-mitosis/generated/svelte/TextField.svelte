<script context="module" lang="ts">
  export interface TextFieldProps {
    id: string;
    name?: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    helperText?: string;
    error?: string;
    maxLength?: number;
    showCount?: boolean;
  }
</script>

<script lang="ts">
  export let id: TextFieldProps["id"];
  export let label: TextFieldProps["label"];
  export let value: TextFieldProps["value"];
  export let onValueChange: TextFieldProps["onValueChange"];
  export let maxLength: TextFieldProps["maxLength"];
  export let error: TextFieldProps["error"];
  export let helperText: TextFieldProps["helperText"];
  export let showCount: TextFieldProps["showCount"] = false;
  export let required: TextFieldProps["required"] = false;
  export let name: TextFieldProps["name"];
  export let placeholder: TextFieldProps["placeholder"];
  export let disabled: TextFieldProps["disabled"] = false;

  $: invalid = () => {
    return (
      !id ||
      !id.trim() ||
      !label ||
      !label.trim() ||
      typeof value !== "string" ||
      typeof onValueChange !== "function" ||
      (maxLength !== undefined &&
        (!Number.isInteger(maxLength) || maxLength < 0))
    );
  };
  $: descriptionIds = () => {
    return (
      [
        error || helperText ? id + "-message" : "",
        showCount ? id + "-count" : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };
</script>

<div class="lm-field">
  {#if invalid()}
    <p role="alert">
      Text field requires an id, a label, string value, a change callback, and a
      non-negative integer maximum length when supplied.
    </p>
  {:else}
    <div class="lm-field">
      <label class="lm-field-label" for={id}
        >{label}
        {#if required}
          <span aria-hidden="true"> *</span>
        {/if}</label
      ><input
        class="lm-field-input"
        type="text"
        {id}
        {name}
        {value}
        {placeholder}
        {disabled}
        {required}
        {maxLength}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={descriptionIds()}
        on:input={(event) => {
          onValueChange(event.target.value);
        }}
      />
      {#if error || helperText || showCount}
        <div class="lm-field-footer">
          {#if error || helperText}
            <p
              aria-live="polite"
              id={id + "-message"}
              class={error ? "lm-field-error" : ""}
            >
              {#if error}
                {"Error: " + error}
              {:else}
                {helperText}
              {/if}
            </p>
          {/if}
          {#if showCount}
            <span class="lm-field-count" id={id + "-count"}
              >{value.length}
              {#if maxLength !== undefined}
                {" / " + maxLength}
              {:else}
                <div _text="" />
              {/if}</span
            >
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .lm-field {
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--color-foreground-neutral);
    font: var(--typography-body-regular);
    width: 100%;
  }
  .lm-field-label {
    font: var(--typography-body-medium);
  }
  .lm-field-input {
    box-sizing: border-box;
    width: 100%;
    min-height: 36px;
    padding: 4px 12px;
    border: 1px solid var(--color-border-neutral);
    border-radius: 8px;
    background: var(--color-background-page);
    color: var(--color-foreground-neutral);
    font: inherit;
  }
  .lm-field-input::placeholder {
    color: var(--color-foreground-neutral-faded);
  }
  .lm-field-input:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  .lm-field-input[aria-invalid="true"] {
    border-style: dashed;
    border-color: var(--color-foreground-neutral);
  }
  .lm-field-input:disabled {
    background: var(--color-background-neutral);
    color: var(--color-foreground-neutral-faded);
    cursor: not-allowed;
  }
  .lm-field-footer {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    color: var(--color-foreground-neutral-faded);
  }
  .lm-field-footer p {
    margin: 0;
  }
  .lm-field-error {
    color: var(--color-foreground-neutral);
    font: var(--typography-body-bold);
  }
  .lm-field-count {
    white-space: nowrap;
    margin-left: auto;
    font: var(--typography-caption-regular);
  }
</style>