<script context="module" lang="ts">
  export interface InputTextAreaProps {
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
  export let id: InputTextAreaProps["id"];
  export let ariaDescribedby: InputTextAreaProps["ariaDescribedby"];
  export let className: InputTextAreaProps["className"];
  export let showLabel: InputTextAreaProps["showLabel"];
  export let labelText: InputTextAreaProps["labelText"];
  export let showRequired: InputTextAreaProps["showRequired"];
  export let requiredIndicator: InputTextAreaProps["requiredIndicator"];
  export let showLeftIcon: InputTextAreaProps["showLeftIcon"];
  export let placeholderText: InputTextAreaProps["placeholderText"];
  export let showRightIcon: InputTextAreaProps["showRightIcon"];
  export let showHint: InputTextAreaProps["showHint"];
  export let hintErrorText: InputTextAreaProps["hintErrorText"];
  export let showCharacterCount: InputTextAreaProps["showCharacterCount"];
  export let characterCount: InputTextAreaProps["characterCount"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-3 w-full" + (className ? " " + className : "")}
>
  {#if showLabel !== false}
    <div class="flex flex-row gap-2 items-center w-full">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {labelText ?? "Your message"}
      </p>
      {#if showRequired}
        <span class="text-sm font-medium text-[#be123c]"
          >{requiredIndicator ?? "*"}</span
        >
      {/if}
    </div>
  {/if}
  <div
    class="flex flex-row gap-3 px-3 py-1 rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
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
    <div class="flex flex-row gap-3">
      <p class="text-base font-normal text-[#525252]">
        {placeholderText ?? "Type your message here."}
      </p>
    </div>
    {#if showRightIcon}
      <div>
        <div>
          <div>
            <div class="border-1.5 border-[#737373]" />
            <div class="border-1.5 border-[#737373]" />
          </div>
        </div>
      </div>
    {/if}
    <div>
      <div class="border border-[#737373]" />
      <div class="border border-[#737373]" />
    </div>
  </div>
  {#if showHint !== false}
    <div class="flex flex-row gap-3 items-center w-full">
      <p class="text-sm font-normal text-[#737373]">
        {hintErrorText ?? "Your message will be copied to the support team."}
      </p>
      {#if showCharacterCount !== false}
        <p class="text-sm font-normal text-right text-[#737373]">
          {characterCount ?? "0 / 200"}
        </p>
      {/if}
    </div>
  {/if}<slot />
</div>