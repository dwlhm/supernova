<script context="module" lang="ts">
  /* @composition {"root":"TableHeaderRow","part":"TableHeaderCell","parts":["TableHeaderRow","TableHeaderCell"],"slot":"replace"} */
  export interface TableHeaderCellProps {
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let className: TableHeaderCellProps["className"];
</script>

<th scope="col" class={"" + (className ? " " + className : "")}><slot /></th>