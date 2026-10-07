<script context="module" lang="ts">
  /* @composition {"root":"TableBodyRow","part":"TableCell","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
  export interface TableCellProps {
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let className: TableCellProps["className"];
</script>

<td class={"" + (className ? " " + className : "")}><slot /></td>