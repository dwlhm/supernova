<script context="module" lang="ts">
  export interface InputTextProps {
    labelText?: string;
    placeholderText?: string;
    hintErrorText?: string;
    characterCount?: string;
    showRequired?: boolean;
    icon?: any;
    showCharacterCount?: boolean;
    showHint?: boolean;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
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
  export let id: InputTextProps["id"];
  export let ariaDescribedby: InputTextProps["ariaDescribedby"];
  export let className: InputTextProps["className"];
  export let showLabel: InputTextProps["showLabel"];
  export let labelText: InputTextProps["labelText"];
  export let showRequired: InputTextProps["showRequired"];
  export let requiredIndicator: InputTextProps["requiredIndicator"];
  export let showLeftIcon: InputTextProps["showLeftIcon"];
  export let placeholderText: InputTextProps["placeholderText"];
  export let showRightIcon: InputTextProps["showRightIcon"];
  export let showHint: InputTextProps["showHint"];
  export let hintErrorText: InputTextProps["hintErrorText"];
  export let showCharacterCount: InputTextProps["showCharacterCount"];
  export let characterCount: InputTextProps["characterCount"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-3" + (className ? " " + className : "")}
>
  {#if showLabel !== false}
    <div class="flex flex-row gap-2 items-center w-full">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {labelText ?? "Username"}
      </p>
      {#if showRequired !== false}
        <span class="text-sm font-medium text-[#be123c]"
          >{requiredIndicator ?? "*"}</span
        >
      {/if}
    </div>
  {/if}
  <div
    class="flex flex-row gap-3 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
  >
    {#if showLeftIcon}
      <div>
        <div>
          <div>
            <div class="border-1.5 border-[#737373]" />
            <div class="border-1.5 border-[#737373]" />
          </div>
        </div>
      </div>
    {/if}
    <div class="flex flex-row gap-3 w-full flex-1">
      <p class="text-base font-normal text-[#525252]">
        {placeholderText ?? "Max Leiter"}
      </p>
    </div>
    {#if showRightIcon !== false}
      <div>
        <div>
          <div>
            <div class="border-1.5 border-[#737373]" />
            <div class="border-1.5 border-[#737373]" />
          </div>
        </div>
      </div>
    {/if}
  </div>
  {#if showHint !== false}
    <div class="flex flex-row gap-3 items-center w-full">
      <p class="text-sm font-normal text-[#737373]">
        {hintErrorText ?? "Choose a unique username for your account."}
      </p>
      {#if showCharacterCount}
        <p class="text-sm font-normal text-right text-[#737373]">
          {characterCount ?? "0 / 200"}
        </p>
      {/if}
    </div>
  {/if}<slot />
</div>