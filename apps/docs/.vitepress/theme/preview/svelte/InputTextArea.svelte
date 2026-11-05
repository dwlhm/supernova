<script context="module" lang="ts">
  export interface InputTextAreaProps {
    value?: string;
    name?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    hint?: string;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
    showLabel?: boolean;
    showHint?: boolean;
    showCharacterCount?: boolean;
    maxLength?: number;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    className?: string;
    onValueChange?: (value: string) => void;
  }
</script>

<script lang="ts">
  import { cn, getInputState, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: InputTextAreaProps["className"] = "";
  export let showLabel: InputTextAreaProps["showLabel"] = true;
  export let label: InputTextAreaProps["label"] = "Your message";
  export let id: InputTextAreaProps["id"] = "input-textarea";
  export let required: InputTextAreaProps["required"] = false;
  export let disabled: InputTextAreaProps["disabled"] = false;
  export let showLeftIcon: InputTextAreaProps["showLeftIcon"] = false;
  export let name: InputTextAreaProps["name"] = "input-textarea";
  export let rows: InputTextAreaProps["rows"] = 4;
  export let value: InputTextAreaProps["value"] = "";
  export let placeholder: InputTextAreaProps["placeholder"] =
    "Type your message here.";
  export let maxLength: InputTextAreaProps["maxLength"] = 200;
  export let showHint: InputTextAreaProps["showHint"] = true;
  export let onValueChange: InputTextAreaProps["onValueChange"];
  export let showRightIcon: InputTextAreaProps["showRightIcon"] = false;
  export let showCharacterCount: InputTextAreaProps["showCharacterCount"] =
    true;
  export let hint: InputTextAreaProps["hint"] = 'Your message will be copied to the support team.';
  export let errorMessage: InputTextAreaProps["errorMessage"] = '';
  $: props = { className, showLabel, label, id, required, disabled, showLeftIcon, name, rows, value, placeholder, maxLength, showHint, onValueChange, showRightIcon, showCharacterCount, hint, errorMessage };
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn("flex w-full flex-col gap-3", className)}
>
  {#if showLabel && label !== ""}
    <label
      class="flex items-center gap-1 text-sm font-medium text-foreground-default"
      for={id}
      >{label}
      {#if required}
        <span aria-hidden="true" class="text-destructive-default">*</span>
      {/if}</label
    >
  {/if}
  <div
    class={cn(
      "flex items-start gap-3 rounded-lg border px-3 py-1 shadow-xs transition-colors",
      disabled
        ? "border-border-default bg-background-muted cursor-not-allowed opacity-50"
        : getInputState(props).hasError
        ? "border-destructive-border bg-background-default focus-within:ring-2 focus-within:ring-focus-ring-error"
        : "border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary"
    )}
  >
    {#if showLeftIcon}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class={cn(
          "mt-2 h-4 w-4 shrink-0",
          getInputState(props).hasError
            ? "text-destructive-foreground"
            : "text-foreground-muted"
        )}
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={ICON_PATHS.file}
        /></svg
      >
    {/if}<textarea
      class="w-full resize-y bg-transparent py-2 text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
      {id}
      {name}
      {rows}
      {value}
      {placeholder}
      {maxLength}
      {disabled}
      {required}
      aria-invalid={getInputState(props).hasError}
      aria-describedby={showHint ? id + "-hint" : undefined}
      on:input={(event) => {
        !disabled && onValueChange && onValueChange(event.target.value);
      }}
    />
    {#if showRightIcon}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class={cn(
          "mt-2 h-4 w-4 shrink-0",
          getInputState(props).hasError
            ? "text-destructive-foreground"
            : "text-foreground-muted"
        )}
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={ICON_PATHS.checkCircle}
        /></svg
      >
    {/if}
  </div>
  {#if showHint || showCharacterCount}
    <div class="flex items-start justify-between gap-2.5">
      {#if showHint}
        <span
          id={id + "-hint"}
          class={cn(
            "text-sm",
            getInputState(props).hasError
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}>{getInputState(props).helpText}</span
        >
      {/if}
      {#if showCharacterCount}
        <span
          class={cn(
            "ml-auto shrink-0 text-sm",
            getInputState(props).hasError
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}>{getInputState(props).countText}</span
        >
      {/if}
    </div>
  {/if}
</div>