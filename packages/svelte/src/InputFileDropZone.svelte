<script context="module" lang="ts">
  export interface InputFileDropZoneProps {
    labelText?: string;
    hintErrorText?: string;
    showRequired?: boolean;
    showHint?: boolean;
    primaryText?: string;
    supportingText?: string;
    fileName?: string;
    fileMetadata?: string;
    showLabel?: boolean;
    state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
    onClick?: (event?: any) => void;
    showLeftIcon?: boolean;
    label?: string;
    showRightIcon?: boolean;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    requiredIndicator?: string;
  }
</script>

<script lang="ts">
  export let id: InputFileDropZoneProps["id"];
  export let ariaDescribedby: InputFileDropZoneProps["ariaDescribedby"];
  export let className: InputFileDropZoneProps["className"];
  export let showLabel: InputFileDropZoneProps["showLabel"];
  export let labelText: InputFileDropZoneProps["labelText"];
  export let showRequired: InputFileDropZoneProps["showRequired"];
  export let requiredIndicator: InputFileDropZoneProps["requiredIndicator"];
  export let primaryText: InputFileDropZoneProps["primaryText"];
  export let onClick: InputFileDropZoneProps["onClick"];
  export let showLeftIcon: InputFileDropZoneProps["showLeftIcon"];
  export let label: InputFileDropZoneProps["label"];
  export let showRightIcon: InputFileDropZoneProps["showRightIcon"];
  export let supportingText: InputFileDropZoneProps["supportingText"];
  export let showHint: InputFileDropZoneProps["showHint"];
  export let hintErrorText: InputFileDropZoneProps["hintErrorText"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-3" + (className ? " " + className : "")}
>
  {#if showLabel !== false}
    <div class="flex flex-row gap-2 w-full">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {labelText ?? "Documents"}
      </p>
      {#if showRequired}
        <span class="text-sm font-medium text-[#be123c]"
          >{requiredIndicator ?? "*"}</span
        >
      {/if}
    </div>
  {/if}
  <div
    class="flex flex-col gap-3 p-6 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
  >
    <div><div class="border border-[#0f0e0f]" /></div>
    <div class="flex flex-row gap-1 items-center">
      <p class="text-sm font-medium text-[#0f0e0f]">
        {primaryText ?? "Drag and drop files here, or"}
      </p>
      <button
        type="button"
        class="flex flex-row gap-2 px-2 py-1 justify-center items-center rounded-lg bg-[#f5f5f5] cursor-pointer transition-colors"
        on:click={(event) => {
          onClick?.();
        }}
      >
        {#if showLeftIcon !== false}
          <div class="flex flex-row justify-center items-center">
            <div><div class="border-[#171717]" /></div>
          </div>
        {/if}
        {#if showLabel !== false}
          <p class="text-sm font-medium text-center text-[#171717]">
            {label ?? "Browse"}
          </p>
        {/if}
        {#if showRightIcon !== false}
          <div class="flex flex-row justify-center items-center">
            <div><div class="border-[#171717]" /></div>
          </div>
        {/if}</button
      >
    </div>
    <p class="text-sm font-normal text-[#737373]">
      {supportingText ?? "PNG, JPG, or PDF up to 10 MB"}
    </p>
  </div>
  {#if showHint !== false}
    <div class="flex flex-col w-full">
      <p class="text-sm font-normal text-[#737373]">
        {hintErrorText ?? "You can upload one file."}
      </p>
    </div>
  {/if}<slot />
</div>