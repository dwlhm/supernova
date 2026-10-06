<script context="module" lang="ts">
  export interface TableNoBodyCellProps {
    no?: string;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: TableNoBodyCellProps["id"];
  export let ariaDescribedby: TableNoBodyCellProps["ariaDescribedby"];
  export let className: TableNoBodyCellProps["className"];
  export let no: TableNoBodyCellProps["no"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row px-4 py-3 justify-center items-center" +
    (className ? " " + className : "")}
>
  <span class="text-sm font-normal text-[#737373]">{no ?? "1"}</span><slot />
</div>