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

## Live Preview & Usage

<ComponentPreview name="Chart" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `'bar' \| 'line' \| 'area' \| 'pie' \| 'donut'` | `'bar'` | bar, line, area, pie, donut |
| `title` | `string` | `'Revenue Overview'` | - |
| `description` | `string` | `'Weekly revenue breakdown by day'` | - |
| `showTitle` | `boolean` | `true` | - |
| `showDescription` | `boolean` | `true` | - |
| `showTooltip` | `boolean` | `true` | - |
| `legend` | `ChartLegendEntry[]` | `[]` | - |
| `data` | `ChartDataPoint[]` | `[]` | - |
| `showLegend` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
