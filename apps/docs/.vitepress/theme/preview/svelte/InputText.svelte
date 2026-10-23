<script context="module" lang="ts">
  export interface InputTextProps {
    value?: string;
    name?: string;
    id?: string;
    type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number";
    label?: string;
    placeholder?: string;
    hint?: string;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
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

  export let errorMessage: InputTextProps["errorMessage"] = "";
  export let hint: InputTextProps["hint"] =
    "Choose a unique username for your account.";
  export let value: InputTextProps["value"] = "";
  export let maxLength: InputTextProps["maxLength"] = 200;
  export let disabled: InputTextProps["disabled"] = false;
  export let onValueChange: InputTextProps["onValueChange"];
  export let className: InputTextProps["className"] = "";
  export let showLabel: InputTextProps["showLabel"] = true;
  export let label: InputTextProps["label"] = "Username";
  export let id: InputTextProps["id"] = "input-text";
  export let required: InputTextProps["required"] = false;
  export let showLeftIcon: InputTextProps["showLeftIcon"] = false;
  export let name: InputTextProps["name"] = "input-text";
  export let type: InputTextProps["type"] = "text";
  export let placeholder: InputTextProps["placeholder"] = "Max Leiter";
  export let showHint: InputTextProps["showHint"] = true;
  export let showRightIcon: InputTextProps["showRightIcon"] = false;
  export let showCharacterCount: InputTextProps["showCharacterCount"] = false;

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
      return "border-components-input-text-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error";
    }
    return "border-components-input-text-color-container-border-default focus-within:border-components-input-text-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary";
  };
  $: iconClasses = () => {
    if (hasError()) {
      return "text-components-input-text-color-left-icon-foreground-error";
    }
    return "text-components-input-text-color-left-icon-foreground-default";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-text-color-supporting-text-foreground-error"
      : "text-components-input-text-color-supporting-text-foreground-default";
  };
  $: countClasses = () => {
    return hasError()
      ? "text-components-input-text-color-character-count-foreground-error"
      : "text-components-input-text-color-character-count-foreground-default";
  };
  $: countText = () => {
    return value.length + " / " + maxLength;
  };
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <label
      class="flex items-center gap-1 text-sm font-medium text-components-input-text-color-label-foreground-default"
      for={id}
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-input-text-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</label
    >
  {/if}
  <div
    class={cn(
      "flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-text-color-container-background-default px-3 transition-colors",
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
        class={cn("h-4 w-4 shrink-0", iconClasses())}
        ><circle cx="11" cy="11" r="7" /><path
          d="m20 20-3.5-3.5"
          stroke-linecap="round"
        /></svg
      >
    {/if}<input
      class="h-9 w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-input-text-color-placeholder-foreground-default disabled:cursor-not-allowed"
      {id}
      {name}
      {type}
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
        class={cn("h-4 w-4 shrink-0", iconClasses())}
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