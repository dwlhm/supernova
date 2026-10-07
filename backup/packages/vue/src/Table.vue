<template>
  <table :class="'' + (className ? ' ' + className : '')">
    <slot />
  </table>
</template>

<script setup lang="ts">
/* @composition {"root":"Table","part":"Table","parts":["Table","TableHeader","TableBody"],"slot":"replace","examples":{"static":"import { Table, TableHeader, TableBody, TableHeaderRow, TableHeaderCell, TableBodyRow, TableCell } from '@dwlhm/ui-react';
<Table><TableHeader><TableHeaderRow><TableHeaderCell>Name</TableHeaderCell></TableHeaderRow></TableHeader><TableBody><TableBodyRow><TableCell>Product</TableCell></TableBodyRow></TableBody></Table>","loop":"import { Table, TableHeader, TableBody, TableHeaderRow, TableHeaderCell, TableBodyRow, TableCell } from '@dwlhm/ui-react';
<Table>
  <TableHeader><TableHeaderRow>{columns.map(column => <TableHeaderCell key={column.id}>{column.label}</TableHeaderCell>)}</TableHeaderRow></TableHeader>
  <TableBody>{rows.map(row => <TableBodyRow key={row.id}>{columns.map(column => <TableCell key={column.id}>{row[column.id]}</TableCell>)}</TableBodyRow>)}</TableBody>
</Table>"}} */
export interface TableProps {
  children?: any;
  className?: string;
}

const props = defineProps<TableProps>();
</script>