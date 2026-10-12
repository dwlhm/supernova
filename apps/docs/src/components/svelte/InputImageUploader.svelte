<script context="module" lang="ts">
  export interface InputImageUploaderProps {
    id?: string;
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
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let errorMessage: InputImageUploaderProps["errorMessage"] = "";
  export let fileName: InputImageUploaderProps["fileName"] = "";
  export let hint: InputImageUploaderProps["hint"] =
    "For best results, use a 1:1 image.";
  export let onFileNameChange: InputImageUploaderProps["onFileNameChange"];
  export let className: InputImageUploaderProps["className"] = "";
  export let showLabel: InputImageUploaderProps["showLabel"] = true;
  export let label: InputImageUploaderProps["label"] = "Profile image";
  export let required: InputImageUploaderProps["required"] = true;
  export let disabled: InputImageUploaderProps["disabled"] = false;
  export let imageSrc: InputImageUploaderProps["imageSrc"] = "";
  export let primaryText: InputImageUploaderProps["primaryText"] =
    "Upload an image";
  export let fileMetadata: InputImageUploaderProps["fileMetadata"] = "";
  export let supportingText: InputImageUploaderProps["supportingText"] =
    "Square JPG or PNG, up to 5 MB";
  export let id: InputImageUploaderProps["id"] = "image-uploader";
  export let accept: InputImageUploaderProps["accept"] = "image/png,image/jpeg";
  export let showHint: InputImageUploaderProps["showHint"] = true;

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
      return "border-components-input-image-uploader-color-container-border-error";
    }
    return "border-components-input-image-uploader-color-container-border-default focus-within:border-components-input-image-uploader-color-container-border-focus";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-image-uploader-color-helper-text-foreground-error"
      : "text-components-input-image-uploader-color-helper-text-foreground-default";
  };
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-components-input-image-uploader-color-label-foreground-default"
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-input-image-uploader-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</span
    >
  {/if}
  <div
    class={cn(
      "flex items-center gap-4 rounded-rounded-lg border bg-components-input-image-uploader-color-container-background-default p-3 transition-colors",
      containerClasses(),
      disabled && "opacity-50"
    )}
  >
    <span
      class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-rounded-lg bg-components-input-image-uploader-color-preview-background-default"
      aria-hidden="true"
    >
      {#if imageSrc !== ""}
        <img alt="" class="h-full w-full object-cover" src={imageSrc} />
      {/if}
      {#if imageSrc === ""}
        <svg
          class="h-8 w-8 text-components-input-image-uploader-color-icon-fill-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><rect x="3" y="3" width="18" height="18" rx="2" /><path
            d="m21 15-5-5L5 21"
            stroke-linecap="round"
            stroke-linejoin="round"
          /><circle cx="8.5" cy="8.5" r="1.5" /></svg
        >
      {/if}</span
    ><span class="flex min-w-0 flex-1 flex-col gap-2"
      ><span
        class="truncate text-sm font-medium text-components-input-image-uploader-color-primary-text-foreground-default"
      >
        {#if hasFile()}
          {fileName}
        {:else}
          {primaryText}
        {/if}</span
      ><span
        class="truncate text-xs text-components-input-image-uploader-color-supporting-text-foreground-default"
      >
        {#if hasFile() && fileMetadata !== ""}
          {fileMetadata}
        {:else}
          {supportingText}
        {/if}</span
      ><span class="flex items-center gap-2"
        ><label
          class="inline-flex cursor-pointer items-center rounded-rounded-sm border border-components-input-image-uploader-color-container-border-default bg-components-input-image-uploader-color-container-background-default px-3 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default focus-within:ring-2 focus-within:ring-focus-ring-primary"
        >
          {#if hasFile()}
            Replace
          {:else}
            Browse
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
        {#if hasFile()}
          <button
            type="button"
            class="inline-flex items-center rounded-rounded-sm px-2 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            on:click={(event) => {
              clear();
            }}
          >
            Remove
          </button>
        {/if}</span
      ></span
    >
  </div>
  {#if showHint}
    <span class={cn("text-xs", supportingClasses())}>{supportingText()}</span>
  {/if}
</div>