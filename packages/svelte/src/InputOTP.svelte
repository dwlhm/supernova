<script context="module" lang="ts">
  export interface InputOTPProps {
    labelText?: string;
    hintErrorText?: string;
    showRequired?: boolean;
    showHint?: boolean;
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
  export let id: InputOTPProps["id"];
  export let ariaDescribedby: InputOTPProps["ariaDescribedby"];
  export let className: InputOTPProps["className"];
  export let showLabel: InputOTPProps["showLabel"];
  export let labelText: InputOTPProps["labelText"];
  export let showRequired: InputOTPProps["showRequired"];
  export let requiredIndicator: InputOTPProps["requiredIndicator"];
  export let showHint: InputOTPProps["showHint"];
  export let hintErrorText: InputOTPProps["hintErrorText"];
  export let onClick: InputOTPProps["onClick"];
  export let showLeftIcon: InputOTPProps["showLeftIcon"];
  export let label: InputOTPProps["label"];
  export let showRightIcon: InputOTPProps["showRightIcon"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col" + (className ? " " + className : "")}
>
  <div class="flex flex-col gap-3 w-full">
    {#if showLabel !== false}
      <div class="flex flex-row gap-2 items-center w-full">
        <p class="text-sm font-medium text-[#0a0a0a]">{labelText ?? "Label"}</p>
        {#if showRequired}
          <span class="text-sm font-medium text-[#be123c]"
            >{requiredIndicator ?? "*"}</span
          >
        {/if}
      </div>
    {/if}
    <div class="flex flex-row">
      <div
        class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
      />
      <div
        class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
      />
      <div
        class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
      />
      <div
        class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
      />
      <div
        class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
      />
      <div
        class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
      />
    </div>
    {#if showHint !== false}
      <div class="flex flex-row gap-3 items-center w-full">
        <p class="text-sm font-normal text-[#737373]">
          {hintErrorText ??
            "Please enter the one-time password sent to your phone."}
        </p>
      </div>
    {/if}
  </div>
  <button
    type="button"
    class="flex flex-row gap-2 px-4 py-2 justify-center items-center rounded-xl bg-[#e55514] cursor-pointer transition-colors"
    on:click={(event) => {
      onClick?.();
    }}
  >
    {#if showLeftIcon !== false}
      <div class="flex flex-row justify-center items-center">
        <div><div class="border-white" /></div>
      </div>
    {/if}
    {#if showLabel !== false}
      <p class="text-sm font-medium text-center text-white">
        {label ?? "Label"}
      </p>
    {/if}
    {#if showRightIcon !== false}
      <div class="flex flex-row justify-center items-center">
        <div><div class="border-white" /></div>
      </div>
    {/if}</button
  ><slot />
</div>