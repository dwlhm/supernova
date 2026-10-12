<script context="module" lang="ts">
  export interface InputFileDropZoneProps {
    id?: string;
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
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let errorMessage: InputFileDropZoneProps["errorMessage"] = "";
  export let fileName: InputFileDropZoneProps["fileName"] = "";
  export let hint: InputFileDropZoneProps["hint"] = "You can upload one file.";
  export let onFileNameChange: InputFileDropZoneProps["onFileNameChange"];
  export let className: InputFileDropZoneProps["className"] = "";
  export let showLabel: InputFileDropZoneProps["showLabel"] = true;
  export let label: InputFileDropZoneProps["label"] = "Documents";
  export let required: InputFileDropZoneProps["required"] = false;
  export let disabled: InputFileDropZoneProps["disabled"] = false;
  export let primaryText: InputFileDropZoneProps["primaryText"] =
    "Drag and drop files here, or";
  export let browseText: InputFileDropZoneProps["browseText"] = "browse";
  export let supportingText: InputFileDropZoneProps["supportingText"] =
    "PNG, JPG, or PDF up to 10 MB";
  export let fileMetadata: InputFileDropZoneProps["fileMetadata"] = "";
  export let id: InputFileDropZoneProps["id"] = "file-drop-zone";
  export let accept: InputFileDropZoneProps["accept"] =
    "image/png,image/jpeg,application/pdf";
  export let showHint: InputFileDropZoneProps["showHint"] = true;

  function setDragging(value: boolean) {
    isDragging = value;
  }
  function setName(fileName: string) {
    if (onFileNameChange) {
      onFileNameChange(fileName);
    }
  }
  $: hasError = () => {
    return errorMessage !== "";
  };
  $: hasFile = () => {
    return fileName !== "";
  };
  $: containerClasses = () => {
    if (hasError()) {
      return "border-components-input-file-drop-zone-color-container-border-error";
    }
    if (isDragging) {
      return "border-components-input-file-drop-zone-color-container-border-focus bg-background-subtle";
    }
    return "border-components-input-file-drop-zone-color-container-border-default border-dashed";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-file-drop-zone-color-supporting-text-foreground-error"
      : "text-components-input-file-drop-zone-color-supporting-text-foreground-default";
  };

  let isDragging = false;
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-components-input-file-drop-zone-color-label-foreground-default"
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-input-file-drop-zone-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</span
    >
  {/if}<label
    class={cn(
      "flex flex-col items-center justify-center gap-4 rounded-rounded-lg border bg-components-input-file-drop-zone-color-container-background-default px-6 py-6 text-center transition-colors",
      containerClasses(),
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    )}
    on:dragenter={(event) => {
      setDragging(true);
    }}
    on:dragover={(event) => {
      event.preventDefault();
    }}
    on:dragleave={(event) => {
      setDragging(false);
    }}
    on:drop={(event) => {
      event.preventDefault();
      setDragging(false);
      setName(
        event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files.length > 0
          ? event.dataTransfer.files[0].name
          : ""
      );
    }}
    ><svg
      aria-hidden="true"
      class="h-6 w-6 shrink-0 text-components-input-file-drop-zone-color-vector-stroke-default"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        d="M12 16V4m0 0L8 8m4-4 4 4"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke-linecap="round"
      /></svg
    >
    {#if !hasFile()}
      <span class="flex flex-col items-center gap-1"
        ><span
          class="text-sm text-components-input-file-drop-zone-color-primary-text-foreground-default"
          >{primaryText}<span class="font-medium underline underline-offset-2"
            >{browseText}</span
          ></span
        ><span
          class="text-xs text-components-input-file-drop-zone-color-supporting-text-foreground-default"
          >{supportingText}</span
        ></span
      >
    {/if}
    {#if hasFile()}
      <span class="flex flex-col items-center gap-1"
        ><span
          class="text-sm font-medium text-components-input-file-drop-zone-color-file-name-foreground-filled"
          >{fileName}</span
        >
        {#if fileMetadata !== ""}
          <span
            class="text-xs text-components-input-file-drop-zone-color-file-metadata-foreground-filled"
            >{fileMetadata}</span
          >
        {/if}</span
      >
    {/if}<input
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
    /></label
  >
  {#if showHint}
    <span class={cn("text-xs", supportingClasses())}>{supportingText()}</span>
  {/if}
</div>