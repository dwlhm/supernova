# MetricCard

Overview
Metric Card presents a key performance indicator with optional context, status, actions, and compact data visualization. Use it in dashboards, reports, and overview surfaces where users need to scan important values quickly.

When to use
• Highlight one primary KPI or a tightly related group of metrics.
• Summarize performance, progress, comparisons, distributions, targets, or rankings.
• Use a chart component instead when detailed analysis, axes, interaction, or a longer time range is required.

Usage guidelines
• Choose the simplest Type that communicates the insight clearly.
• Keep the label concise and format values consistently across a dashboard.
• Use Trend only when a comparison period or baseline is explicit.
• Use Description for timeframe or context; do not repeat the label.
• Use Status sparingly for meaningful state, risk, or health information.
• Keep optional actions secondary to the metric and limit custom slot content to compact, scannable information.
• Keep cards in the same group visually and semantically consistent.

Properties
• Type: Default, Progress, Sparkline, Comparison, Radial, Mini Bar, Target, List, Multi-Metric, or Leaderboard.
• Label Text: Short metric name.
• Value Text: Primary formatted value.
• Show Value: Shows or hides the primary value.
• Show Icon / Icon: Toggles and swaps the supporting icon.
• Show Trend / Trend Text: Toggles and edits the change indicator.
• Show Description / Description Text: Toggles and edits supporting context.
• Show Status / Status Badge: Toggles and swaps a status badge.
• Show Actionable / Actionable: Toggles and customizes the action area.
• Primary Button / Secondary Button: Swaps optional actions where supported.
• Content Slot: Inserts compact custom content where supported.
• List: Supplies list content for the List variant.
• Leaderboard: Supplies ranked content for the Leaderboard variant.

## Usage

::: code-group

```tsx [React]
import { MetricCard } from './MetricCard';

export default function Example() {
  return (
    <MetricCard actionable="default" content Slot="default">
      MetricCard
    </MetricCard>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { MetricCard } from './MetricCard';
</script>

<template>
  <MetricCard actionable="default" content Slot="default">
    MetricCard
  </MetricCard>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import MetricCard from './MetricCard.svelte';
</script>

<MetricCard actionable="default" content Slot="default">
  MetricCard
</MetricCard>
```

```ts [Angular]
import { Component } from '@angular/core';
import { MetricCardComponent } from './metric-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MetricCardComponent],
  template: `
    <app-metric-card actionable="default" content Slot="default">
      MetricCard
    </app-metric-card>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Actionable` | `slot` | - | Insert optional actions related to the metric. Keep actions secondary and use no more than the space comfortably supports. |
| `Content Slot` | `slot` | - | Insert compact supporting content appropriate to the selected variant. Keep the content concise, non-interactive unless explicitly required, and aligned with the primary metric. |
| `Description Text` | `text` | `from last month` | - |
| `Icon` | `instance_swap` | `2367:21099` | - |
| `Label Text` | `text` | `Total Revenue` | - |
| `Leaderboard` | `slot` | - | Insert a short ranked list for the Leaderboard variant. Keep row structure consistent and limit the number of entries. |
| `List` | `slot` | - | Insert a compact itemized list for the List variant. Use concise labels and consistently formatted values. |
| `Primary Button` | `instance_swap` | `2266:1143` | - |
| `Secondary Button` | `instance_swap` | `2266:1183` | - |
| `Show Actionable` | `boolean` | `false` | - |
| `Show Description` | `boolean` | `true` | - |
| `Show Icon` | `boolean` | `true` | - |
| `Show Status` | `boolean` | `false` | - |
| `Show Trend` | `boolean` | `true` | - |
| `Show Value` | `boolean` | `true` | - |
| `Status Badge` | `instance_swap` | `2841:130` | - |
| `Trend Text` | `text` | `+20.1%` | - |
| `Type` | ``Default` \| `Progress` \| `Sparkline` \| `Comparison` \| `Radial` \| `Mini Bar` \| `Target` \| `List` \| `Multi-Metric` \| `Leaderboard`` | `Default` | - |
| `Value Text` | `text` | `$45,231.89` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
