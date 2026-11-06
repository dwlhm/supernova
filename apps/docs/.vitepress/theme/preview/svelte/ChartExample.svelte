<script lang="ts">
  import Chart from "./Chart.svelte";
  import ChartBar from "./ChartBar.svelte";
  import ChartLegend from "./ChartLegend.svelte";
</script>

<Chart title="Revenue Overview" description="Weekly revenue breakdown by day"
  ><ChartBar
    ariaLabel="Revenue Overview"
    data={[
      {
        label: "Mon",
        value: 120,
      },
      {
        label: "Tue",
        value: 160,
      },
      {
        label: "Wed",
        value: 140,
      },
      {
        label: "Thu",
        value: 190,
      },
      {
        label: "Fri",
        value: 175,
      },
      {
        label: "Sat",
        value: 110,
      },
      {
        label: "Sun",
        value: 95,
      },
    ]}
  /><ChartLegend
    items={[
      {
        label: "Online Sales",
        colorClass: "bg-chart-series-1",
      },
      {
        label: "Retail Store",
        colorClass: "bg-chart-series-2",
      },
    ]}
  /></Chart
>