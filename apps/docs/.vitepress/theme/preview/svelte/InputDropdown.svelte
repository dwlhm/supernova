<script context="module" lang="ts">
  export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  export interface InputDropdownProps {
    value?: string;
    options?: SelectOption[];
    searchQuery?: string;
    id?: string;
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
    className?: string;
    onSelect?: (value: string) => void;
    onSearchChange?: (value: string) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let errorMessage: InputDropdownProps["errorMessage"] = "";
  export let searchQuery: InputDropdownProps["searchQuery"] = "";
  export let options: InputDropdownProps["options"] = [];
  export let value: InputDropdownProps["value"] = "";
  export let hint: InputDropdownProps["hint"] =
    "Select your department or area of work.";
  export let disabled: InputDropdownProps["disabled"] = false;
  export let onSearchChange: InputDropdownProps["onSearchChange"];
  export let onSelect: InputDropdownProps["onSelect"];
  export let className: InputDropdownProps["className"] = "";
  export let showLabel: InputDropdownProps["showLabel"] = true;
  export let label: InputDropdownProps["label"] = "Department";
  export let required: InputDropdownProps["required"] = false;
  export let showLeftIcon: InputDropdownProps["showLeftIcon"] = false;
  export let placeholder: InputDropdownProps["placeholder"] =
    "Choose department";
  export let showSearch: InputDropdownProps["showSearch"] = true;
  export let showHint: InputDropdownProps["showHint"] = false;

  function toggle() {
    if (disabled) {
      return;
    }
    isOpen = !isOpen;
  }
  function handleSearch(rawValue: string) {
    if (onSearchChange) {
      onSearchChange(rawValue);
    }
  }
  function handleSelect(selected: string) {
    isOpen = false;
    if (onSelect) {
      onSelect(selected);
    }
  }
  $: hasError = () => {
    return errorMessage !== "";
  };
  $: normalizedQuery = () => {
    return searchQuery.trim().toLowerCase();
  };
  $: selectedLabel = () => {
    const matched = (options || []).filter((option) => option.value === value);
    return matched.length > 0 ? matched[0].label : "";
  };
  $: panelClasses = () => {
    return isOpen ? "block" : "hidden";
  };
  $: triggerClasses = () => {
    if (hasError()) {
      return "border-components-select-all-color-trigger-border-error";
    }
    if (isOpen) {
      return "border-components-select-all-color-trigger-border-focus";
    }
    return "border-components-select-all-color-trigger-border-default";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-select-all-color-supporting-text-foreground-error"
      : "text-components-select-all-color-supporting-text-foreground-default";
  };

  let isOpen = false;
</script>

<div class={cn("relative flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-components-select-all-color-label-foreground-default"
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-select-all-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</span
    >
  {/if}<button
    type="button"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    {disabled}
    class={cn(
      "flex h-9 w-full items-center justify-between gap-2.5 rounded-rounded-lg border bg-components-select-all-color-trigger-background-default px-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      triggerClasses()
    )}
    on:click={(event) => {
      toggle();
    }}
    ><span class="flex items-center gap-2.5 truncate">
      {#if showLeftIcon}
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-components-select-all-color-trigger-icon-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" /></svg
        >
      {/if}
      {#if selectedLabel() !== ""}
        <span
          class="truncate text-sm text-components-select-all-color-trigger-foreground-default"
          >{selectedLabel()}</span
        >
      {/if}
      {#if selectedLabel() === ""}
        <span
          class="truncate text-sm text-components-select-all-color-placeholder-foreground-default"
          >{placeholder}</span
        >
      {/if}</span
    ><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        d="m6 9 6 6 6-6"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    ></button
  >
  <div
    role="listbox"
    class={cn(
      "absolute top-full z-50 mt-2 w-full overflow-hidden rounded-rounded-md border border-components-select-all-color-dropdown-menu-border-focus bg-components-select-all-color-dropdown-menu-background-focus shadow-lg",
      panelClasses()
    )}
  >
    {#if showSearch}
      <div
        class="flex items-center gap-2 border-b border-components-select-all-color-search-input-border-focus px-3 py-2"
      >
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><circle cx="11" cy="11" r="7" /><path
            d="m20 20-3.5-3.5"
            stroke-linecap="round"
          /></svg
        ><input
          type="search"
          placeholder="Search"
          aria-label="Search options"
          class="w-full bg-transparent text-sm text-components-select-all-color-trigger-foreground-default outline-none placeholder:text-components-select-all-color-placeholder-foreground-default"
          value={searchQuery}
          on:input={(event) => {
            handleSearch(event.target.value);
          }}
        />
      </div>
    {/if}
    <ul class="flex max-h-60 flex-col overflow-y-auto p-1">
      {#each options as option (option.value)}
        <li
          class={normalizedQuery() !== "" &&
          option.label.toLowerCase().indexOf(normalizedQuery()) === -1
            ? "hidden"
            : "block"}
        >
          <button
            type="button"
            role="option"
            aria-selected={option.value === value}
            disabled={option.disabled}
            class={cn(
              "flex w-full items-center justify-between rounded-rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              option.value === value
                ? "bg-components-select-all-color-wrapper-background-focus text-components-select-all-color-trigger-foreground-default"
                : "text-components-select-all-color-trigger-foreground-default hover:bg-background-muted"
            )}
            on:click={(event) => {
              handleSelect(option.value);
            }}
            ><span class="truncate">{option.label}</span>
            {#if option.value === value}
              <svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path
                  d="m5 13 4 4L19 7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
            {/if}</button
          >
        </li>
      {/each}
    </ul>
  </div>
  {#if showHint}
    <span class={cn("text-xs", supportingClasses())}>{supportingText()}</span>
  {/if}
</div>