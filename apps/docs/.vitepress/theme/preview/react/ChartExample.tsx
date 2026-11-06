import * as React from "react";
import Chart from "./Chart";
import ChartBar from "./ChartBar";
import ChartLegend from "./ChartLegend";

function ChartExample(props: any) {
  return (
    <Chart
      title="Revenue Overview"
      description="Weekly revenue breakdown by day"
    >
      <ChartBar
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
      />
      <ChartLegend
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
      />
    </Chart>
  );
}

Object.assign(ChartExample, { Chart, ChartBar, ChartLegend });

export default ChartExample;
