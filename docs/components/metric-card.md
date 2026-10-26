# MetricCard

Overview
Metric Card presents a key performance indicator with optional context, status, actions, and compact data visualization. Use it in dashboards, reports, and overview surfaces where users need to scan important values quickly.

## When to Use

- Highlight one primary KPI or a tightly related group of metrics.
- Summarize performance, progress, comparisons, distributions, targets, or rankings.
- Use a chart component instead when detailed analysis, axes, interaction, or a longer time range is required.

## Usage Guidelines

- Choose the simplest Type that communicates the insight clearly.
- Keep the label concise and format values consistently across a dashboard.
- Use Trend only when a comparison period or baseline is explicit.
- Use Description for timeframe or context; do not repeat the label.
- Use Status sparingly for meaningful state, risk, or health information.
- Keep optional actions secondary to the metric and limit custom slot content to compact, scannable information.
- Keep cards in the same group visually and semantically consistent.

## Interactive Preview

<ComponentPreview name="MetricCard" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `\| 'Default' \| 'Progress' \| 'Sparkline' \| 'Comparison' \| 'Radial' \| 'Mini Bar' \| 'Target' \| 'List' \| 'Multi-Metric' \| 'Leaderboard'` | `'Default'` | , Default, Progress, Sparkline, Comparison, Radial, Mini Bar, Target, List, Multi-Metric, Leaderboard |
| `labelText` | `string` | `'Total Revenue'` | - |
| `valueText` | `string` | `'$45,231.89'` | - |
| `showValue` | `boolean` | `true` | - |
| `showIcon` | `boolean` | `true` | - |
| `iconName` | `'revenue' \| 'orders' \| 'customers' \| 'growth' \| 'chart' \| 'target'` | `'growth'` | revenue, orders, customers, growth, chart, target |
| `showTrend` | `boolean` | `true` | - |
| `trendText` | `string` | `'+20.1%'` | - |
| `trendDirection` | `'up' \| 'down' \| 'neutral'` | `'up'` | up, down, neutral |
| `showDescription` | `boolean` | `true` | - |
| `descriptionText` | `string` | `'from last month'` | - |
| `showStatus` | `boolean` | `false` | - |
| `statusLabel` | `string` | `''` | - |
| `showActionable` | `boolean` | `false` | - |
| `primaryActionLabel` | `string` | `''` | - |
| `secondaryActionLabel` | `string` | `''` | - |
| `onPrimaryAction` | `() => void` | `-` | - |
| `onSecondaryAction` | `() => void` | `-` | - |
| `progress` | `number` | `0` | - |
| `targetText` | `string` | `''` | - |
| `comparisonValueText` | `string` | `''` | - |
| `comparisonLabelText` | `string` | `''` | - |
| `comparisonShare` | `number` | `0` | - |
| `sparklineData` | `number[]` | `[]` | - |
| `barData` | `number[]` | `[]` | - |
| `listItems` | `{ id: string; label: string; value: string }[]` | `[]` | - |
| `metrics` | `{ id: string; label: string; value: string }[]` | `[]` | - |
| `leaderboardEntries` | `{ id: string; label: string; value: string }[]` | `[]` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { MetricCard } from '@supernova/design-system/react';

export default function App() {
  return <MetricCard type="Default" labelText="Total Revenue" valueText="$45,231.89" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { MetricCard } from '@supernova/design-system/vue3';
</script>

<template>
  <MetricCard type="Default" labelText="Total Revenue" valueText="$45,231.89" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { MetricCard } from '@supernova/design-system/svelte';
</script>

<MetricCard type="Default" labelText="Total Revenue" valueText="$45,231.89" />
```

:::
