<script context="module" lang="ts">
  export interface InputImageUploaderProps {
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
  export let id: InputImageUploaderProps["id"];
  export let ariaDescribedby: InputImageUploaderProps["ariaDescribedby"];
  export let className: InputImageUploaderProps["className"];
  export let showLabel: InputImageUploaderProps["showLabel"];
  export let labelText: InputImageUploaderProps["labelText"];
  export let showRequired: InputImageUploaderProps["showRequired"];
  export let requiredIndicator: InputImageUploaderProps["requiredIndicator"];
  export let primaryText: InputImageUploaderProps["primaryText"];
  export let supportingText: InputImageUploaderProps["supportingText"];
  export let onClick: InputImageUploaderProps["onClick"];
  export let showLeftIcon: InputImageUploaderProps["showLeftIcon"];
  export let label: InputImageUploaderProps["label"];
  export let showRightIcon: InputImageUploaderProps["showRightIcon"];
  export let showHint: InputImageUploaderProps["showHint"];
  export let hintErrorText: InputImageUploaderProps["hintErrorText"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-3" + (className ? " " + className : "")}
>
  {#if showLabel !== false}
    <div class="flex flex-row gap-2">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {labelText ?? "Profile image"}
      </p>
      {#if showRequired !== false}
        <span class="text-sm font-medium text-[#be123c]"
          >{requiredIndicator ?? "*"}</span
        >
      {/if}
    </div>
  {/if}
  <div
    class="flex flex-row gap-4 p-3 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
  >
    <div
      class="flex flex-col justify-center items-center rounded-lg bg-[#f5f5f5]"
    >
      <div>
        <div>
          <div>
            <div class="border border-[#0a0a0a]" />
            <div class="border border-[#0a0a0a]" />
            <div class="border border-[#0a0a0a]" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full flex-1">
      <p class="text-base font-normal text-[#0f0e0f]">
        {primaryText ?? "Upload an image"}
      </p>
      <p class="text-sm font-normal text-[#737373]">
        {supportingText ?? "Square JPG or PNG, up to 5 MB"}
      </p>
      <div class="flex flex-row gap-2">
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
              {label ?? "Choose image"}
            </p>
          {/if}
          {#if showRightIcon !== false}
            <div class="flex flex-row justify-center items-center">
              <div><div class="border-[#171717]" /></div>
            </div>
          {/if}</button
        >
      </div>
    </div>
  </div>
  {#if showHint !== false}
    <div class="flex flex-col w-full">
      <p class="text-sm font-normal text-[#737373]">
        {hintErrorText ?? "For best results, use a 1:1 image."}
      </p>
    </div>
  {/if}<slot />
</div>