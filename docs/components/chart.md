# Chart

Chart is a flexible data-visualization component with 12 variants for comparing values, revealing trends, showing composition, and communicating progress.

## When to Use

- Use charts when a visual pattern, relationship, distribution, or change is easier to understand than a table of raw values. Choose the Type variant that best matches the analytical question and data structure.

## Usage Guidelines

- Use a clear, outcome-focused title and a short description that explains scope, timeframe, or unit.
- Choose the simplest chart type that communicates the insight accurately.
- Keep category count, series count, labels, and legends concise.
- Use consistent colors for the same metric across related views.
- Enable grid lines and data labels only when they improve interpretation.
- Do not use charts for a single value when a KPI or statistic component is clearer.
- Provide an accessible text summary or data table when the chart contains critical information.

## Interactive Preview

<ComponentPreview name="Chart" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `ChartType` | `'Bar'` | - |
| `showTitle` | `boolean` | `true` | - |
| `showDescription` | `boolean` | `true` | - |
| `showLegend` | `boolean` | `true` | - |
| `showGridLines` | `boolean` | `true` | - |
| `showDataLabels` | `boolean` | `true` | - |
| `titleText` | `string` | `'Revenue Overview'` | - |
| `descriptionText` | `string` | `'Weekly revenue breakdown by day'` | - |
| `data` | `ChartDataPoint[]` | `[]` | - |
| `seriesNames` | `string[]` | `[]` | - |
| `maxValue` | `number` | `-` | - |
| `customContent` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Chart } from '@supernova/design-system/react';

export default function App() {
  return <Chart type="Bar" showTitle showDescription />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Chart } from '@supernova/design-system/vue3';
</script>

<template>
  <Chart type="Bar" showTitle showDescription />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Chart } from '@supernova/design-system/svelte';
</script>

<Chart type="Bar" showTitle showDescription />
```

:::
