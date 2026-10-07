<script context="module" lang="ts">
  /* @composition {"root":"TableBodyRow","part":"TableBodyRow","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
  export interface TableBodyRowProps {
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let className: TableBodyRowProps["className"];
</script>

<tr class={"" + (className ? " " + className : "")}><slot /></tr>