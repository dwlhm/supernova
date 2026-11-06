<script lang="ts">
  import TableBodyRow from "./TableBodyRow.svelte";
  import TableBodyCell from "./TableBodyCell.svelte";
</script>

<table class="w-full border-collapse">
  <tbody
    ><TableBodyRow
      ><TableBodyCell>INV-2025-001</TableBodyCell><TableBodyCell
        >Komship Express</TableBodyCell
      ><TableBodyCell>Paid</TableBodyCell><TableBodyCell align="right"
        >Rp 450.000</TableBodyCell
      ></TableBodyRow
    ><TableBodyRow selected={true}
      ><TableBodyCell>INV-2025-002</TableBodyCell><TableBodyCell
        >Kompack Fulfillment</TableBodyCell
      ><TableBodyCell>Pending</TableBodyCell><TableBodyCell align="right"
        >Rp 1.200.000</TableBodyCell
      ></TableBodyRow
    ></tbody
  >
</table>