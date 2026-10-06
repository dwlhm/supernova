<script context="module" lang="ts">
  export interface MenuItemProps {
    label?: string;
    badgeLabel?: string;
    submenuContent?: any;
    showBadge?: boolean;
    showLabel?: boolean;
    showTrailingIcon?: boolean;
    showLeadingIcon?: boolean;
    leadingIcon?: any;
    state?: "Default" | "Hover" | "Active";
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: MenuItemProps["id"];
  export let ariaDescribedby: MenuItemProps["ariaDescribedby"];
  export let className: MenuItemProps["className"];
  export let onClick: MenuItemProps["onClick"];
  export let showLeadingIcon: MenuItemProps["showLeadingIcon"];
  export let showLabel: MenuItemProps["showLabel"];
  export let label: MenuItemProps["label"];
  export let showBadge: MenuItemProps["showBadge"];
  export let badgeLabel: MenuItemProps["badgeLabel"];
  export let showTrailingIcon: MenuItemProps["showTrailingIcon"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col" + (className ? " " + className : "")}
>
  <div class="flex flex-col gap-3 rounded-xl">
    <button
      type="button"
      class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
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
          class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
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
    >
  </div>
  <slot />
</div>