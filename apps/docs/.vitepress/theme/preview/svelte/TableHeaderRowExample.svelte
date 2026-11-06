<script lang="ts">
  import TableHeaderRow from "./TableHeaderRow.svelte";
  import TableHeaderCell from "./TableHeaderCell.svelte";
</script>

<table class="w-full border-collapse">
  <thead
    ><TableHeaderRow
      ><TableHeaderCell>Column 1</TableHeaderCell><TableHeaderCell
        >Column 2</TableHeaderCell
      ><TableHeaderCell>Column 3</TableHeaderCell><TableHeaderCell
        >Column 4</TableHeaderCell
      ><TableHeaderCell align="right">Column 5</TableHeaderCell></TableHeaderRow
    ></thead
  >
</table>