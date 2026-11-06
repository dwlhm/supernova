<template>
  <Chart title="Revenue Overview" description="Weekly revenue breakdown by day"
    ><ChartBar
      ariaLabel="Revenue Overview"
      :data="[
        {
          label: 'Mon',
          value: 120,
        },
        {
          label: 'Tue',
          value: 160,
        },
        {
          label: 'Wed',
          value: 140,
        },
        {
          label: 'Thu',
          value: 190,
        },
        {
          label: 'Fri',
          value: 175,
        },
        {
          label: 'Sat',
          value: 110,
        },
        {
          label: 'Sun',
          value: 95,
        },
      ]"
    ></ChartBar
    ><ChartLegend
      :items="[
        {
          label: 'Online Sales',
          colorClass: 'bg-chart-series-1',
        },
        {
          label: 'Retail Store',
          colorClass: 'bg-chart-series-2',
        },
      ]"
    ></ChartLegend
  ></Chart>
</template>

<script setup lang="ts">
import Chart from "./Chart.vue";
import ChartBar from "./ChartBar.vue";
import ChartLegend from "./ChartLegend.vue";
</script>