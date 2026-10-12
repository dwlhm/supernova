<script context="module" lang="ts">
  export interface InputFileInputProps {
    id?: string;
    label?: string;
    buttonText?: string;
    fileName?: string;
    hint?: string;
    errorMessage?: string;
    accept?: string;
    disabled?: boolean;
    required?: boolean;
    showLabel?: boolean;
    showHint?: boolean;
    className?: string;
    onFileNameChange?: (fileName: string) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let errorMessage: InputFileInputProps["errorMessage"] = "";
  export let fileName: InputFileInputProps["fileName"] = "";
  export let hint: InputFileInputProps["hint"] =
    "Supported formats: PNG, JPG, or PDF.";
  export let onFileNameChange: InputFileInputProps["onFileNameChange"];
  export let className: InputFileInputProps["className"] = "";
  export let showLabel: InputFileInputProps["showLabel"] = true;
  export let label: InputFileInputProps["label"] = "Picture";
  export let required: InputFileInputProps["required"] = false;
  export let disabled: InputFileInputProps["disabled"] = false;
  export let buttonText: InputFileInputProps["buttonText"] = "Choose File";
  export let id: InputFileInputProps["id"] = "input-file";
  export let accept: InputFileInputProps["accept"] =
    "image/png,image/jpeg,application/pdf";
  export let showHint: InputFileInputProps["showHint"] = true;

  function setName(fileName: string) {
    if (onFileNameChange) {
      onFileNameChange(fileName);
    }
  }
  function clear() {
    setName("");
  }
  $: hasError = () => {
    return errorMessage !== "";
  };
  $: hasFile = () => {
    return fileName !== "";
  };
  $: containerClasses = () => {
    if (hasError()) {
      return "border-components-input-file-input-color-container-border-error";
    }
    return "border-components-input-file-input-color-container-border-default focus-within:border-components-input-file-input-color-container-border-focus";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-file-input-color-supporting-text-foreground-error"
      : "text-components-input-file-input-color-supporting-text-foreground-default";
  };
  $: displayName = () => {
    return hasFile() ? fileName : "No file chosen";
  };
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-components-input-file-input-color-label-foreground-default"
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-input-file-input-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</span
    >
  {/if}<label
    class={cn(
      "flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-file-input-color-container-background-default px-3 py-1 transition-colors",
      containerClasses(),
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    )}
    ><span
      class="inline-flex h-7 shrink-0 items-center rounded-rounded-sm bg-components-button-secondary-color-container-background-default px-3 text-xs font-medium text-components-input-file-input-color-button-label-foreground-default"
      >{buttonText}</span
    ><span
      class={cn(
        "truncate py-1 text-sm",
        hasFile()
          ? "text-components-input-file-input-color-file-name-foreground-filled"
          : "text-components-input-file-input-color-file-name-foreground-default"
      )}>{displayName()}</span
    ><input
      type="file"
      class="sr-only"
      {id}
      {accept}
      {disabled}
      {required}
      aria-invalid={hasError()}
      on:change={(event) => {
        setName(
          event.target.files && event.target.files.length > 0
            ? event.target.files[0].name
            : ""
        );
      }}
    />
    {#if hasFile()}
      <button
        type="button"
        aria-label="Remove file"
        class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-input-file-input-color-file-name-foreground-filled hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        on:click={(event) => {
          clear();
        }}
        ><svg
          aria-hidden="true"
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" /></svg
        ></button
      >
    {/if}</label
  >
  {#if showHint}
    <span class={cn("text-xs", supportingClasses())}>{supportingText()}</span>
  {/if}
</div>