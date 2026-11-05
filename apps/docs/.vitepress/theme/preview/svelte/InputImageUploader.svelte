<script context="module" lang="ts">
  export interface InputImageUploaderProps {
    id?: string;
    name?: string;
    label?: string;
    primaryText?: string;
    supportingText?: string;
    fileName?: string;
    fileMetadata?: string;
    imageSrc?: string;
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
    onPreviewChange?: (url: string) => void;
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

  export let className: InputImageUploaderProps["className"] = "";
  export let showLabel: InputImageUploaderProps["showLabel"] = true;
  export let label: InputImageUploaderProps["label"] = "Profile image";
  export let id: InputImageUploaderProps["id"] = "image-uploader";
  export let required: InputImageUploaderProps["required"] = true;
  export let disabled: InputImageUploaderProps["disabled"] = false;
  export let imageSrc: InputImageUploaderProps["imageSrc"] = "";
  export let primaryText: InputImageUploaderProps["primaryText"] =
    "Upload an image";
  export let fileName: InputImageUploaderProps["fileName"] = "";
  export let fileMetadata: InputImageUploaderProps["fileMetadata"] = "";
  export let supportingText: InputImageUploaderProps["supportingText"] =
    "Square JPG or PNG, up to 5 MB";
  export let name: InputImageUploaderProps["name"] = "image-file";
  export let accept: InputImageUploaderProps["accept"] = "image/png,image/jpeg";
  export let onFileNameChange: InputImageUploaderProps["onFileNameChange"];
  export let onFilesChange: InputImageUploaderProps["onFilesChange"];
  export let onPreviewChange: InputImageUploaderProps["onPreviewChange"];
  export let showHint: InputImageUploaderProps["showHint"] = true;
  export let hint: InputImageUploaderProps["hint"] = 'For best results, use a 1:1 image.';
  export let errorMessage: InputImageUploaderProps["errorMessage"] = '';
  $: props = { className, showLabel, label, id, required, disabled, imageSrc, primaryText, fileName, fileMetadata, supportingText, name, accept, onFileNameChange, onFilesChange, onPreviewChange, showHint, hint, errorMessage };
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
      "flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-xs transition-colors",
      getFileState(props).hasError
        ? "border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error"
        : "border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
      disabled && "cursor-not-allowed opacity-50"
    )}
  >
    <span
      aria-hidden="true"
      class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-muted"
    >
      {#if imageSrc !== ""}
        <img alt="" class="h-full w-full object-cover" src={imageSrc} />
      {/if}
      {#if imageSrc === ""}
        <svg
          class="h-8 w-8 text-foreground-subtle"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d={ICON_PATHS.image}
          /></svg
        >
      {/if}</span
    ><span class="flex min-w-0 flex-1 flex-col gap-2"
      ><span class="truncate text-sm font-medium text-foreground-default">
        {#if getFileState(props).hasFile}
          {fileName}
        {:else}
          {primaryText}
        {/if}</span
      ><span class="truncate text-sm text-foreground-muted">
        {#if getFileState(props).hasFile && fileMetadata !== ""}
          {fileMetadata}
        {:else}
          {supportingText}
        {/if}</span
      ><span class="flex items-center gap-2"
        ><label
          for={id}
          class={cn(
            "inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary",
            disabled
              ? "pointer-events-none cursor-not-allowed"
              : "cursor-pointer"
          )}
        >
          {#if getFileState(props).hasFile}
            Replace
          {:else}
            Choose image
          {/if}<input
            type="file"
            class="sr-only"
            {id}
            {name}
            {accept}
            {disabled}
            {required}
            aria-invalid={getFileState(props).hasError}
            on:change={(event) => {
              !disabled &&
                handleFileSelectEvent(
                  event,
                  onFileNameChange,
                  onFilesChange,
                  onPreviewChange
                );
            }}
          /></label
        >
        {#if getFileState(props).hasFile}
          <button
            type="button"
            class="inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-medium text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            {disabled}
            on:click={(event) => {
              !disabled &&
                clearFileInputEvent(event, onFileNameChange, onFilesChange);
            }}>Remove</button
          >
        {/if}</span
      ></span
    >
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