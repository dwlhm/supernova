<script context="module" lang="ts">
  /* @composition {"root":"TableHeaderRow","part":"TableHeaderRow","parts":["TableHeaderRow","TableHeaderCell"],"slot":"replace"} */
  export interface TableHeaderRowProps {
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let className: TableHeaderRowProps["className"];
</script>

<tr class={"" + (className ? " " + className : "")}><slot /></tr>