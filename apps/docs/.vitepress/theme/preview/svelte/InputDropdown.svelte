<script context="module" lang="ts">
  export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  export interface InputDropdownProps {
    open?: boolean;
    value?: string;
    options?: SelectOption[];
    searchQuery?: string;
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    hint?: string;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
    showLabel?: boolean;
    showHint?: boolean;
    showSearch?: boolean;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    className?: string;
    onSelect?: (value: string) => void;
    onSearchChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
  }
</script>

<script lang="ts">
  import {
    cn,
    getDropdownState,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let id: InputDropdownProps["id"] = "input-dropdown";
  export let className: InputDropdownProps["className"] = "";
  export let showLabel: InputDropdownProps["showLabel"] = true;
  export let label: InputDropdownProps["label"] = "Department";
  export let required: InputDropdownProps["required"] = false;
  export let disabled: InputDropdownProps["disabled"] = false;
  export let onOpenChange: InputDropdownProps["onOpenChange"];
  export let open: InputDropdownProps["open"] = false;
  export let showLeftIcon: InputDropdownProps["showLeftIcon"] = false;
  export let placeholder: InputDropdownProps["placeholder"] =
    "Choose department";
  export let showRightIcon: InputDropdownProps["showRightIcon"] = true;
  export let showSearch: InputDropdownProps["showSearch"] = true;
  export let searchQuery: InputDropdownProps["searchQuery"] = "";
  export let onSearchChange: InputDropdownProps["onSearchChange"];
  export let value: InputDropdownProps["value"] = "";
  export let onSelect: InputDropdownProps["onSelect"];
  export let showHint: InputDropdownProps["showHint"] = false;
  export let options: InputDropdownProps["options"] = [];
  export let name: InputDropdownProps["name"] = 'dropdown';
  export let hint: InputDropdownProps["hint"] = 'Select your department or area of work.';
  export let errorMessage: InputDropdownProps["errorMessage"] = '';
  $: props = { id, className, showLabel, label, required, disabled, onOpenChange, open, showLeftIcon, placeholder, showRightIcon, showSearch, searchQuery, onSearchChange, value, onSelect, showHint, options, name, hint, errorMessage };
</script>

<div
  {id}
  data-ctrl={typeof bindControllerProps}
  class={cn("relative flex w-full flex-col gap-3", className)}
>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-foreground-default"
      >{label}
      {#if required}
        <span aria-hidden="true" class="text-destructive-default">*</span>
      {/if}</span
    >
  {/if}<button
    type="button"
    aria-haspopup="listbox"
    aria-expanded={getDropdownState(props).isOpen}
    aria-invalid={getDropdownState(props).hasError}
    {disabled}
    class={cn(
      "flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border bg-background-default px-3 text-left shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      getDropdownState(props).hasError
        ? "border-destructive-border focus:ring-2 focus:ring-focus-ring-error"
        : getDropdownState(props).isOpen
        ? "border-primary-border-emphasis ring-2 ring-focus-ring-primary"
        : "border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary"
    )}
    on:click={(event) => {
      !disabled && onOpenChange && onOpenChange(!open);
    }}
    ><span class="flex items-center gap-1.5 truncate">
      {#if showLeftIcon}
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-foreground-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path stroke-linecap="round" d={ICON_PATHS.menu} /></svg
        >
      {/if}<span
        class={cn(
          "truncate text-sm",
          getDropdownState(props).selectedLabel !== ""
            ? "text-foreground-default"
            : "text-foreground-subtle"
        )}
      >
        {#if getDropdownState(props).selectedLabel !== ""}
          {getDropdownState(props).selectedLabel}
        {:else}
          {placeholder}
        {/if}</span
      ></span
    >
    {#if showRightIcon}
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={ICON_PATHS.chevronDown}
        /></svg
      >
    {/if}</button
  >
  <div
    class={cn(
      "absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-border-default bg-background-default shadow-lg",
      getDropdownState(props).isOpen ? "block" : "hidden"
    )}
  >
    {#if showSearch}
      <div
        class="flex items-center gap-2 border-b border-border-default px-3 py-2"
      >
        <input
          type="search"
          placeholder="Search"
          aria-label="Search options"
          class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-subtle"
          value={searchQuery}
          on:input={(event) => {
            onSearchChange && onSearchChange(event.target.value);
          }}
        />
      </div>
    {/if}
    <div
      role="listbox"
      class="flex max-h-60 flex-col overflow-y-auto p-1"
      aria-label={label}
    >
      {#each getDropdownState(props).filtered as option (option.value)}
        <button
          type="button"
          role="option"
          aria-selected={option.value === value}
          disabled={option.disabled}
          class={cn(
            "flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            option.value === value
              ? "bg-background-muted text-foreground-default"
              : "text-foreground-default hover:bg-background-muted"
          )}
          on:click={(event) => {
            onSelect && onSelect(option.value);
          }}><span class="truncate">{option.label}</span></button
        >
      {/each}
    </div>
  </div>
  {#if showHint}
    <span
      class={cn(
        "text-sm",
        getDropdownState(props).hasError
          ? "text-destructive-foreground"
          : "text-foreground-muted"
      )}>{getDropdownState(props).helpText}</span
    >
  {/if}
</div>