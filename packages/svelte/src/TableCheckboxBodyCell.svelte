<script context="module" lang="ts">
  export interface TableCheckboxBodyCellProps {
    leftLabel?: boolean;
    rightLabel?: boolean;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    leftLabelContent?: string;
    rightLabelContent?: string;
  }
</script>

<script lang="ts">
  export let id: TableCheckboxBodyCellProps["id"];
  export let ariaDescribedby: TableCheckboxBodyCellProps["ariaDescribedby"];
  export let className: TableCheckboxBodyCellProps["className"];
  export let leftLabel: TableCheckboxBodyCellProps["leftLabel"];
  export let leftLabelContent: TableCheckboxBodyCellProps["leftLabelContent"];
  export let rightLabel: TableCheckboxBodyCellProps["rightLabel"];
  export let rightLabelContent: TableCheckboxBodyCellProps["rightLabelContent"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row px-4 py-3 justify-center items-center" +
    (className ? " " + className : "")}
>
  <div class="flex flex-row gap-2 items-center">
    {#if leftLabel !== false}
      <p class="text-xs font-normal text-[#0a0a0a]">
        {leftLabelContent ?? "Label"}
      </p>
    {/if}
    <div class="rounded bg-background-page border border-[#e5e5e5]" />
    {#if rightLabel !== false}
      <p class="text-xs font-normal text-[#0a0a0a]">
        {rightLabelContent ?? "Label"}
      </p>
    {/if}
  </div>
  <slot />
</div>