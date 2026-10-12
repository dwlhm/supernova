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
  import { cn } from "./utils";

  export let errorMessage: InputTextAreaProps["errorMessage"] = "";
  export let hint: InputTextAreaProps["hint"] =
    "Your message will be copied to the support team.";
  export let value: InputTextAreaProps["value"] = "";
  export let maxLength: InputTextAreaProps["maxLength"] = 200;
  export let disabled: InputTextAreaProps["disabled"] = false;
  export let onValueChange: InputTextAreaProps["onValueChange"];
  export let className: InputTextAreaProps["className"] = "";
  export let showLabel: InputTextAreaProps["showLabel"] = true;
  export let label: InputTextAreaProps["label"] = "Your message";
  export let id: InputTextAreaProps["id"] = "input-textarea";
  export let required: InputTextAreaProps["required"] = false;
  export let showLeftIcon: InputTextAreaProps["showLeftIcon"] = false;
  export let name: InputTextAreaProps["name"] = "input-textarea";
  export let rows: InputTextAreaProps["rows"] = 4;
  export let placeholder: InputTextAreaProps["placeholder"] =
    "Type your message here.";
  export let showHint: InputTextAreaProps["showHint"] = true;
  export let showRightIcon: InputTextAreaProps["showRightIcon"] = false;
  export let showCharacterCount: InputTextAreaProps["showCharacterCount"] =
    true;

  function handleInput(rawValue: string) {
    if (disabled) {
      return;
    }
    if (onValueChange) {
      onValueChange(rawValue);
    }
  }
  $: hasError = () => {
    return errorMessage !== "";
  };
  $: containerClasses = () => {
    if (hasError()) {
      return "border-components-input-text-area-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error";
    }
    return "border-components-input-text-area-color-container-border-default focus-within:border-components-input-text-area-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary";
  };
  $: iconClasses = () => {
    if (hasError()) {
      return "text-components-input-text-area-all-color-icon-foreground-error";
    }
    return "text-components-input-text-area-all-color-icon-foreground-default";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-text-area-color-supporting-text-foreground-error"
      : "text-components-input-text-area-color-supporting-text-foreground-default";
  };
  $: countClasses = () => {
    return hasError()
      ? "text-components-input-text-area-color-character-count-foreground-error"
      : "text-components-input-text-area-color-character-count-foreground-default";
  };
  $: countText = () => {
    return value.length + " / " + maxLength;
  };
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <label
      class="flex items-center gap-1 text-sm font-medium text-components-input-text-area-color-label-foreground-default"
      for={id}
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-input-text-area-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</label
    >
  {/if}
  <div
    class={cn(
      "flex items-start gap-2.5 rounded-rounded-lg border bg-components-input-text-area-color-container-background-default px-3 py-1 transition-colors",
      containerClasses(),
      disabled && "opacity-50"
    )}
  >
    {#if showLeftIcon}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class={cn("mt-2 h-4 w-4 shrink-0", iconClasses())}
        ><path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg
      >
    {/if}<textarea
      class="w-full resize-y bg-transparent py-2 text-sm text-foreground-default outline-none placeholder:text-components-input-text-area-color-placeholder-foreground-default disabled:cursor-not-allowed"
      {id}
      {name}
      {rows}
      {value}
      {placeholder}
      {maxLength}
      {disabled}
      {required}
      aria-invalid={hasError()}
      aria-describedby={showHint ? id + "-hint" : undefined}
      on:input={(event) => {
        handleInput(event.target.value);
      }}
    />
    {#if showRightIcon}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class={cn("mt-2 h-4 w-4 shrink-0", iconClasses())}
        ><circle cx="12" cy="12" r="9" /><path
          d="m8.5 12 2.5 2.5 4.5-5"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg
      >
    {/if}
  </div>
  {#if showHint || showCharacterCount}
    <div class="flex items-start justify-between gap-2.5">
      {#if showHint}
        <span id={id + "-hint"} class={cn("text-xs", supportingClasses())}
          >{supportingText()}</span
        >
      {/if}
      {#if showCharacterCount}
        <span class={cn("ml-auto shrink-0 text-xs", countClasses())}
          >{countText()}</span
        >
      {/if}
    </div>
  {/if}
</div>