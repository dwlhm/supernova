<script context="module" lang="ts">
  export interface InputFileInputProps {
    id?: string;
    name?: string;
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
    onFilesChange?: (files: unknown[]) => void;
  }
</script>

<script lang="ts">
  import {
    cn,
    getFileState,
    handleFileSelectEvent,
    clearFileInputEvent,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let className: InputFileInputProps["className"] = "";
  export let showLabel: InputFileInputProps["showLabel"] = true;
  export let label: InputFileInputProps["label"] = "Picture";
  export let id: InputFileInputProps["id"] = "input-file";
  export let required: InputFileInputProps["required"] = false;
  export let disabled: InputFileInputProps["disabled"] = false;
  export let buttonText: InputFileInputProps["buttonText"] = "Choose File";
  export let name: InputFileInputProps["name"] = "file";
  export let accept: InputFileInputProps["accept"] =
    "image/png,image/jpeg,application/pdf";
  export let showHint: InputFileInputProps["showHint"] = true;
  export let onFileNameChange: InputFileInputProps["onFileNameChange"];
  export let onFilesChange: InputFileInputProps["onFilesChange"];
  export let fileName: InputFileInputProps["fileName"] = '';
  export let hint: InputFileInputProps["hint"] = 'Supported formats: PNG, JPG, or PDF.';
  export let errorMessage: InputFileInputProps["errorMessage"] = '';
  $: props = { className, showLabel, label, id, required, disabled, buttonText, name, accept, showHint, onFileNameChange, onFilesChange, fileName, hint, errorMessage };
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
      "flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors",
      getFileState(props).hasError
        ? "border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error"
        : "border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
      disabled && "cursor-not-allowed opacity-50"
    )}
  >
    <label
      for={id}
      class={cn(
        "flex min-w-0 flex-1 items-center gap-3",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      ><span
        class="inline-flex h-7 shrink-0 items-center rounded-sm bg-secondary-default px-3 text-sm font-medium text-secondary-foreground"
        >{buttonText}</span
      ><span
        class={cn(
          "truncate py-1 text-sm",
          getFileState(props).hasFile
            ? "text-foreground-default"
            : "text-foreground-subtle"
        )}>{getFileState(props).displayName}</span
      ><input
        type="file"
        class="sr-only"
        {id}
        {name}
        {accept}
        {disabled}
        {required}
        aria-invalid={getFileState(props).hasError}
        aria-describedby={showHint ? id + "-hint" : undefined}
        on:change={(event) => {
          !disabled &&
            handleFileSelectEvent(event, onFileNameChange, onFilesChange);
        }}
      /></label
    >
    {#if getFileState(props).hasFile}
      <button
        type="button"
        aria-label="Remove file"
        class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none"
        {disabled}
        on:click={(event) => {
          !disabled &&
            clearFileInputEvent(event, onFileNameChange, onFilesChange);
        }}
        ><svg
          aria-hidden="true"
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path stroke-linecap="round" d={ICON_PATHS.close} /></svg
        ></button
      >
    {/if}
  </div>
  {#if showHint}
    <span
      id={id + "-hint"}
      class={cn(
        "text-sm",
        getFileState(props).hasError
          ? "text-destructive-foreground"
          : "text-foreground-muted"
      )}>{getFileState(props).helpText}</span
    >
  {/if}
</div>