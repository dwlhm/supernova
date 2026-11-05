<script context="module" lang="ts">
  export interface InputFileDropZoneProps {
    id?: string;
    name?: string;
    label?: string;
    primaryText?: string;
    supportingText?: string;
    browseText?: string;
    fileName?: string;
    fileMetadata?: string;
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
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let className: InputFileDropZoneProps["className"] = "";
  export let showLabel: InputFileDropZoneProps["showLabel"] = true;
  export let label: InputFileDropZoneProps["label"] = "Documents";
  export let id: InputFileDropZoneProps["id"] = "file-drop-zone";
  export let required: InputFileDropZoneProps["required"] = false;
  export let disabled: InputFileDropZoneProps["disabled"] = false;
  export let onFileNameChange: InputFileDropZoneProps["onFileNameChange"];
  export let onFilesChange: InputFileDropZoneProps["onFilesChange"];
  export let browseText: InputFileDropZoneProps["browseText"] = "Browse";
  export let primaryText: InputFileDropZoneProps["primaryText"] =
    "or drag and drop files here";
  export let supportingText: InputFileDropZoneProps["supportingText"] =
    "PNG, JPG, or PDF up to 10 MB";
  export let fileName: InputFileDropZoneProps["fileName"] = "";
  export let fileMetadata: InputFileDropZoneProps["fileMetadata"] = "";
  export let name: InputFileDropZoneProps["name"] = "drop-file";
  export let accept: InputFileDropZoneProps["accept"] =
    "image/png,image/jpeg,application/pdf";
  export let showHint: InputFileDropZoneProps["showHint"] = true;
  export let hint: InputFileDropZoneProps["hint"] = 'You can upload one file.';
  export let errorMessage: InputFileDropZoneProps["errorMessage"] = '';
  $: props = { className, showLabel, label, id, required, disabled, onFileNameChange, onFilesChange, browseText, primaryText, supportingText, fileName, fileMetadata, name, accept, showHint, hint, errorMessage };
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
  {/if}<label
    for={id}
    class={cn(
      "flex flex-col items-center justify-center gap-3 rounded-lg border bg-background-default px-6 py-6 text-center shadow-sm transition-colors",
      getFileState(props).hasError
        ? "border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error"
        : "border-border-default border-dashed focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    )}
    on:dragover={(event) => {
      event.preventDefault();
    }}
    on:drop={(event) => {
      !disabled &&
        handleFileSelectEvent(event, onFileNameChange, onFilesChange);
    }}
    ><svg
      aria-hidden="true"
      class="h-6 w-6 shrink-0 text-foreground-default"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.upload}
      /></svg
    >
    {#if !getFileState(props).hasFile}
      <span class="flex flex-col items-center gap-1"
        ><span
          class="inline-flex flex-wrap items-center justify-center gap-1.5 text-base text-foreground-default"
          ><span
            class="inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground"
            >{browseText}</span
          ><span>{primaryText}</span></span
        ><span class="text-sm text-foreground-muted">{supportingText}</span
        ></span
      >
    {/if}
    {#if getFileState(props).hasFile}
      <span class="flex flex-col items-center gap-1"
        ><span class="text-sm font-medium text-foreground-default"
          >{fileName}</span
        >
        {#if fileMetadata !== ""}
          <span class="text-xs text-foreground-muted">{fileMetadata}</span>
        {/if}</span
      >
    {/if}<input
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
  {#if showHint}
    <span
      id={id + "-hint"}
      class={cn(
        "text-sm",
        getFileState(props).hasError
          ? "text-destructive-default"
          : "text-foreground-muted"
      )}>{getFileState(props).helpText}</span
    >
  {/if}
</div>