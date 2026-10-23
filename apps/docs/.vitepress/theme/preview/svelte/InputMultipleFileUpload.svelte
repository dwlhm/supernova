<script context="module" lang="ts">
  export interface UploadedFile {
    id: string;
    name: string;
    status: string;
  }

  export interface InputMultipleFileUploadProps {
    id?: string;
    label?: string;
    instruction?: string;
    files?: UploadedFile[];
    fileCount?: string;
    hint?: string;
    errorMessage?: string;
    accept?: string;
    disabled?: boolean;
    required?: boolean;
    showLabel?: boolean;
    showHint?: boolean;
    className?: string;
    onRemove?: (id: string) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let errorMessage: InputMultipleFileUploadProps["errorMessage"] = "";
  export let hint: InputMultipleFileUploadProps["hint"] =
    "Up to 5 files, 10 MB each.";
  export let onRemove: InputMultipleFileUploadProps["onRemove"];
  export let className: InputMultipleFileUploadProps["className"] = "";
  export let showLabel: InputMultipleFileUploadProps["showLabel"] = true;
  export let label: InputMultipleFileUploadProps["label"] = "Attachments";
  export let required: InputMultipleFileUploadProps["required"] = true;
  export let fileCount: InputMultipleFileUploadProps["fileCount"] = "0 of 5";
  export let disabled: InputMultipleFileUploadProps["disabled"] = false;
  export let instruction: InputMultipleFileUploadProps["instruction"] =
    "Choose one or more files";
  export let id: InputMultipleFileUploadProps["id"] = "multiple-file-upload";
  export let accept: InputMultipleFileUploadProps["accept"] =
    "image/png,image/jpeg,application/pdf,application/zip";
  export let files: InputMultipleFileUploadProps["files"] = [];
  export let showHint: InputMultipleFileUploadProps["showHint"] = true;

  function remove(id: string) {
    if (onRemove) {
      onRemove(id);
    }
  }
  $: hasError = () => {
    return errorMessage !== "";
  };
  $: containerClasses = () => {
    if (hasError()) {
      return "border-components-input-multiple-file-upload-color-container-border-error";
    }
    return "border-components-input-multiple-file-upload-color-container-border-default focus-within:border-components-input-multiple-file-upload-color-container-border-focus";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-multiple-file-upload-color-helper-text-error"
      : "text-components-input-multiple-file-upload-color-helper-text-default";
  };
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span class="flex items-center justify-between gap-3"
      ><span
        class="flex items-center gap-1 text-sm font-medium text-components-input-multiple-file-upload-color-label-foreground-default"
        >{label}
        {#if required}
          <span
            aria-hidden="true"
            class="text-components-input-multiple-file-upload-color-required-indicator-fill-default"
          >
            *
          </span>
        {/if}</span
      ><span
        class="text-xs text-components-input-multiple-file-upload-color-file-count-text-default"
        >{fileCount}</span
      ></span
    >
  {/if}
  <div
    class={cn(
      "flex flex-col gap-3 rounded-rounded-lg border bg-components-input-multiple-file-upload-color-container-background-default px-3 py-3 transition-colors",
      containerClasses(),
      disabled && "opacity-50"
    )}
  >
    <label
      class="inline-flex cursor-pointer items-center gap-2 self-start rounded-rounded-sm border border-components-input-multiple-file-upload-color-container-border-default bg-components-input-multiple-file-upload-color-container-background-default px-3 py-1 text-sm text-components-input-multiple-file-upload-color-instruction-text-default focus-within:ring-2 focus-within:ring-focus-ring-primary"
      ><svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg
      ><span>{instruction}</span><input
        type="file"
        class="sr-only"
        {id}
        multiple={true}
        {accept}
        {disabled}
        aria-invalid={hasError()}
      /></label
    >
    {#if files.length > 0}
      <ul class="flex flex-col gap-2">
        {#each files as file (file.id)}
          <li
            class="flex items-center justify-between gap-2 rounded-rounded-md border border-components-input-multiple-file-upload-color-file-row-border-filled bg-components-input-multiple-file-upload-color-file-row-background-filled p-3"
          >
            <span class="flex min-w-0 items-center gap-2"
              ><svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0 text-components-input-multiple-file-upload-color-file-icon-fill-filled"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                ><path
                  d="M14 3v5h5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /><path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              ><span class="flex min-w-0 flex-col"
                ><span
                  class="truncate text-sm font-medium text-components-input-multiple-file-upload-color-file-name-text-filled"
                  >{file.name}</span
                ><span
                  class="truncate text-xs text-components-input-multiple-file-upload-color-status-text-filled"
                  >{file.status}</span
                ></span
              ></span
            ><button
              type="button"
              class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-input-multiple-file-upload-color-status-icon-fill-filled hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              aria-label={"Remove " + file.name}
              on:click={(event) => {
                remove(file.id);
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
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  {#if showHint}
    <span class={cn("text-xs", supportingClasses())}>{supportingText()}</span>
  {/if}
</div>