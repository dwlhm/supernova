<script context="module" lang="ts">
  export interface TableNoHeaderCellProps {
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    noHeaderText?: string;
  }
</script>

<script lang="ts">
  export let id: TableNoHeaderCellProps["id"];
  export let ariaDescribedby: TableNoHeaderCellProps["ariaDescribedby"];
  export let className: TableNoHeaderCellProps["className"];
  export let noHeaderText: TableNoHeaderCellProps["noHeaderText"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row px-4 py-3 justify-center items-center" +
    (className ? " " + className : "")}
>
  <span class="text-sm font-medium text-[#0a0a0a]">{noHeaderText ?? "No"}</span
  ><slot />
</div>