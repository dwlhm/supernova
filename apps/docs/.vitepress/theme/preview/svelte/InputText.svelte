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
  import { cn, getInputState, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: InputTextProps["className"] = "";
  export let showLabel: InputTextProps["showLabel"] = true;
  export let label: InputTextProps["label"] = "Username";
  export let id: InputTextProps["id"] = "input-text";
  export let required: InputTextProps["required"] = true;
  export let disabled: InputTextProps["disabled"] = false;
  export let showLeftIcon: InputTextProps["showLeftIcon"] = false;
  export let name: InputTextProps["name"] = "input-text";
  export let type: InputTextProps["type"] = "text";
  export let value: InputTextProps["value"] = "";
  export let placeholder: InputTextProps["placeholder"] = "Max Leiter";
  export let maxLength: InputTextProps["maxLength"] = 200;
  export let showHint: InputTextProps["showHint"] = true;
  export let onValueChange: InputTextProps["onValueChange"];
  export let showRightIcon: InputTextProps["showRightIcon"] = true;
  export let showCharacterCount: InputTextProps["showCharacterCount"] = false;
  export let hint: InputTextProps["hint"] = 'Choose a unique username for your account.';
  export let errorMessage: InputTextProps["errorMessage"] = '';
  $: props = { className, showLabel, label, id, required, disabled, showLeftIcon, name, type, value, placeholder, maxLength, showHint, onValueChange, showRightIcon, showCharacterCount, hint, errorMessage };
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
      "flex items-center gap-3 rounded-lg border px-3 shadow-xs transition-colors",
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
          "h-4 w-4 shrink-0",
          getInputState(props).hasError
            ? "text-destructive-foreground"
            : "text-foreground-muted"
        )}><path stroke-linecap="round" d={ICON_PATHS.search} /></svg
      >
    {/if}<input
      class="h-9 w-full bg-transparent text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
      {id}
      {name}
      {type}
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
          "h-4 w-4 shrink-0",
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