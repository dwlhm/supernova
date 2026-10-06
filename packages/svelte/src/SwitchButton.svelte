<script context="module" lang="ts">
  export interface SwitchButtonProps {
    leftLabel?: boolean;
    rightLabel?: boolean;
    state?: "Off" | "On" | "Disabled";
    disabled?: boolean;
    size?: "Medium" | "Small" | "Large";
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    label?: string;
    id?: string;
    ariaDescribedby?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    airplaneMode?: string;
    airplaneMode2?: string;
  }
</script>

<script lang="ts">
  export let onClick: SwitchButtonProps["onClick"];
  export let disabled: SwitchButtonProps["disabled"];
  export let state: SwitchButtonProps["state"];
  export let id: SwitchButtonProps["id"];
  export let ariaDescribedby: SwitchButtonProps["ariaDescribedby"];
  export let ariaLabel: SwitchButtonProps["ariaLabel"];
  export let ariaLabelledby: SwitchButtonProps["ariaLabelledby"];
  export let size: SwitchButtonProps["size"];
  export let className: SwitchButtonProps["className"];
  export let leftLabel: SwitchButtonProps["leftLabel"];
  export let airplaneMode: SwitchButtonProps["airplaneMode"];
  export let rightLabel: SwitchButtonProps["rightLabel"];
  export let airplaneMode2: SwitchButtonProps["airplaneMode2"];
  export let label: SwitchButtonProps["label"];
</script>

<button
  type="button"
  on:click={(e) => {
    onClick?.(e);
  }}
  disabled={disabled || state === "Disabled"}
  {id}
  aria-describedby={ariaDescribedby}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  class={"flex flex-row justify-center items-center cursor-pointer transition-colors " +
    (size === "Medium"
      ? "px-4 py-2 text-sm"
      : size === "Large"
      ? "px-6 py-3 text-lg"
      : "px-3 py-1.5 text-xs") +
    (className ? " " + className : "")}
>
  {#if leftLabel}
    <div class="flex flex-row gap-3 px-2 justify-center items-center">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {airplaneMode ?? "Airplane mode"}
      </p>
    </div>
  {/if}
  <div class="flex flex-col gap-3">
    <div class="rounded-full bg-[#e5e5e5]">
      <div class="rounded-full bg-background-page" />
    </div>
  </div>
  {#if rightLabel}
    <div class="flex flex-row gap-3 px-2 justify-center items-center">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {airplaneMode2 ?? "Airplane mode"}
      </p>
    </div>
  {/if}{label ?? $$slots.default ?? "Button"}</button
>