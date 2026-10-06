<script context="module" lang="ts">
  export interface TableBodyCellProps {
    cellValue?: any;
    value?: string;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: TableBodyCellProps["id"];
  export let ariaDescribedby: TableBodyCellProps["ariaDescribedby"];
  export let className: TableBodyCellProps["className"];
  export let value: TableBodyCellProps["value"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row px-4 py-3 w-full" + (className ? " " + className : "")}
>
  <div class="flex flex-row items-center w-full flex-1">
    <p class="text-sm font-normal text-[#0a0a0a]">{value ?? "Cell Value"}</p>
  </div>
  <slot />
</div>