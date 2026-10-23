# Chart

Chart is a flexible data-visualization component with 12 variants for comparing values, revealing trends, showing composition, and communicating progress.

WHEN TO USE
Use charts when a visual pattern, relationship, distribution, or change is easier to understand than a table of raw values. Choose the Type variant that best matches the analytical question and data structure.

USAGE GUIDELINES
• Use a clear, outcome-focused title and a short description that explains scope, timeframe, or unit.
• Choose the simplest chart type that communicates the insight accurately.
• Keep category count, series count, labels, and legends concise.
• Use consistent colors for the same metric across related views.
• Enable grid lines and data labels only when they improve interpretation.
• Do not use charts for a single value when a KPI or statistic component is clearer.
• Provide an accessible text summary or data table when the chart contains critical information.

PROPERTIES
• Type: Bar, Line, Area, Donut, Pie, Stacked Bar, Horizontal Bar, Scatter, Radar, Gauge, Funnel, or Waterfall.
• Show Title: Shows or hides the chart title.
• Show Description: Shows or hides supporting context beneath the title.
• Show Legend: Shows or hides the series or category legend.
• Show Grid Lines: Shows or hides chart reference lines.
• Show Data Labels: Shows or hides values attached to data marks.
• Title Text: Overrides the default chart title.
• Description Text: Overrides the default supporting description.
• Content: Accepts optional custom content for the selected chart variant.

## Live Preview

<FrameworkPreview name="Chart" />

## Usage

::: code-group

```tsx [React]
import { Chart } from './Chart';

export default function Example() {
  return (
    <Chart content="default" content10="default">
      Chart
    </Chart>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Chart } from './Chart';
</script>

<template>
  <Chart content="default" content10="default">
    Chart
  </Chart>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Chart from './Chart.svelte';
</script>

<Chart content="default" content10="default">
  Chart
</Chart>
```

```ts [Angular]
import { Component } from '@angular/core';
import { ChartComponent } from './chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <app-chart content="default" content10="default">
      Chart
    </app-chart>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Content` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content10` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content11` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content2` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content3` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content4` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content5` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content6` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content7` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content8` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Content9` | `slot` | - | Optional custom content slot for the chart variant. Use only when the default chart content does not meet the data-visualization need; preserve the component padding and hierarchy. |
| `Description Text` | `text` | `Weekly revenue breakdown by day` | - |
| `Show Data Labels` | `boolean` | `true` | - |
| `Show Description` | `boolean` | `true` | - |
| `Show Grid Lines` | `boolean` | `true` | - |
| `Show Legend` | `boolean` | `true` | - |
| `Show Title` | `boolean` | `true` | - |
| `Title Text` | `text` | `Revenue Overview` | - |
| `Type` | ``Bar` \| `Line` \| `Area` \| `Donut` \| `Pie` \| `Stacked Bar` \| `Horizontal Bar` \| `Scatter` \| `Radar` \| `Gauge` \| `Funnel` \| `Waterfall`` | `Bar` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
