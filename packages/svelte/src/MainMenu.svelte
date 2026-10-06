<script context="module" lang="ts">
  export interface MainMenuProps {
    badgeLabel?: string;
    showTrailingIcon?: boolean;
    leadingIcon?: any;
    showLeadingIcon?: boolean;
    label?: string;
    showLabel?: boolean;
    showBadge?: boolean;
    state?: "Default" | "Hover" | "Pressed" | "Active" | "Active-Hover";
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: MainMenuProps["id"];
  export let ariaDescribedby: MainMenuProps["ariaDescribedby"];
  export let className: MainMenuProps["className"];
  export let onClick: MainMenuProps["onClick"];
  export let showLeadingIcon: MainMenuProps["showLeadingIcon"];
  export let showLabel: MainMenuProps["showLabel"];
  export let label: MainMenuProps["label"];
  export let showBadge: MainMenuProps["showBadge"];
  export let badgeLabel: MainMenuProps["badgeLabel"];
  export let showTrailingIcon: MainMenuProps["showTrailingIcon"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-2 justify-center rounded-md" +
    (className ? " " + className : "")}
>
  <button
    type="button"
    class="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors"
    on:click={(event) => {
      onClick?.();
    }}
  >
    {#if showLeadingIcon !== false}
      <div><div class="border border-[#0a0a0a]" /></div>
    {/if}
    {#if showLabel !== false}
      <p class="text-sm font-normal text-[#0a0a0a]">{label ?? "Menu"}</p>
    {/if}
    {#if showBadge}
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]"
      >
        <div class="flex flex-row gap-3 justify-center items-center">
          <p class="text-sm font-normal text-center text-[#fafafa]">
            {badgeLabel ?? "New"}
          </p>
        </div>
      </div>
    {/if}
    {#if showTrailingIcon !== false}
      <div><div class="border border-[#0a0a0a]" /></div>
    {/if}</button
  ><slot />
</div>