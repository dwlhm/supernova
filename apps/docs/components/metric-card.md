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

## Live Preview & Usage

<ComponentPreview name="MetricCard" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Total Revenue'` | - |
| `value` | `string` | `'$45,231.89'` | - |
| `showValue` | `boolean` | `true` | - |
| `trendText` | `string` | `'+20.1%'` | - |
| `showTrend` | `boolean` | `true` | - |
| `trendDirection` | `'up' \| 'down' \| 'neutral'` | `'up'` | up, down, neutral |
| `descriptionText` | `string` | `'from last month'` | - |
| `showDescription` | `boolean` | `true` | - |
| `showIcon` | `boolean` | `true` | - |
| `showStatus` | `boolean` | `true` | - |
| `statusLabel` | `string` | `'On track'` | - |
| `statusVariant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | default, success, warning, error, info |
| `showProgress` | `boolean` | `false` | - |
| `progress` | `number` | `0` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
