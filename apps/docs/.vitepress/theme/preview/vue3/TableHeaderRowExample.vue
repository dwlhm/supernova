<template>
  <table class="w-full border-collapse">
    <thead>
      <TableHeaderRow
        ><TableHeaderCell>Column 1</TableHeaderCell
        ><TableHeaderCell>Column 2</TableHeaderCell
        ><TableHeaderCell>Column 3</TableHeaderCell
        ><TableHeaderCell>Column 4</TableHeaderCell
        ><TableHeaderCell align="right"
          >Column 5</TableHeaderCell
        ></TableHeaderRow
      >
    </thead>
  </table>
</template>

<script setup lang="ts">
import TableHeaderRow from "./TableHeaderRow.vue";
import TableHeaderCell from "./TableHeaderCell.vue";
</script>