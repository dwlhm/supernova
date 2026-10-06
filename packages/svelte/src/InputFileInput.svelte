<script context="module" lang="ts">
  export interface InputFileInputProps {
    labelText?: string;
    buttonText?: string;
    fileName?: string;
    hintErrorText?: string;
    showRequired?: boolean;
    showHint?: boolean;
    showLabel?: boolean;
    state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    requiredIndicator?: string;
  }
</script>

<script lang="ts">
  export let id: InputFileInputProps["id"];
  export let ariaDescribedby: InputFileInputProps["ariaDescribedby"];
  export let className: InputFileInputProps["className"];
  export let showLabel: InputFileInputProps["showLabel"];
  export let labelText: InputFileInputProps["labelText"];
  export let showRequired: InputFileInputProps["showRequired"];
  export let requiredIndicator: InputFileInputProps["requiredIndicator"];
  export let buttonText: InputFileInputProps["buttonText"];
  export let fileName: InputFileInputProps["fileName"];
  export let showHint: InputFileInputProps["showHint"];
  export let hintErrorText: InputFileInputProps["hintErrorText"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-3" + (className ? " " + className : "")}
>
  {#if showLabel !== false}
    <div class="flex flex-row gap-2 items-center w-full">
      <p class="text-sm font-medium text-[#0a0a0a]">{labelText ?? "Picture"}</p>
      {#if showRequired}
        <span class="text-sm font-medium text-[#be123c]"
          >{requiredIndicator ?? "*"}</span
        >
      {/if}
    </div>
  {/if}
  <div
    class="flex flex-row gap-3 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
  >
    <div class="flex flex-col gap-3 pr-1 items-center">
      <div class="flex flex-row gap-3 px-2 py-1 items-center w-full">
        <p class="text-sm font-medium text-[#0a0a0a]">
          {buttonText ?? "Choose File"}
        </p>
      </div>
    </div>
    <div class="flex flex-row gap-3 items-center w-full flex-1">
      <p class="text-base font-normal text-[#737373]">
        {fileName ?? "No file chosen"}
      </p>
    </div>
  </div>
  {#if showHint !== false}
    <div class="flex flex-row w-full">
      <p class="text-sm font-normal text-[#737373]">
        {hintErrorText ?? "Supported formats: PNG, JPG, or PDF."}
      </p>
    </div>
  {/if}<slot />
</div>