<template>
  <Table caption="Recent invoices"
    ><thead>
      <TableHeaderRow
        ><TableHeaderCell>Name</TableHeaderCell
        ><TableHeaderCell>Status</TableHeaderCell
        ><TableHeaderCell align="right">Amount</TableHeaderCell
        ><TableHeaderCell>Date</TableHeaderCell></TableHeaderRow
      >
    </thead>
    <tbody>
      <TableBodyRow
        ><TableBodyCell>John Doe</TableBodyCell
        ><TableBodyCell>Active</TableBodyCell
        ><TableBodyCell align="right">$1,200</TableBodyCell
        ><TableBodyCell>2024-01-15</TableBodyCell></TableBodyRow
      ><TableBodyRow
        ><TableBodyCell>Jane Smith</TableBodyCell
        ><TableBodyCell>Pending</TableBodyCell
        ><TableBodyCell align="right">$850</TableBodyCell
        ><TableBodyCell>2024-02-20</TableBodyCell></TableBodyRow
      >
    </tbody></Table
  >
</template>

<script setup lang="ts">
import Table from "./Table.vue";
import TableHeaderRow from "./TableHeaderRow.vue";
import TableHeaderCell from "./TableHeaderCell.vue";
import TableBodyRow from "./TableBodyRow.vue";
import TableBodyCell from "./TableBodyCell.vue";
</script>