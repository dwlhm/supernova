# ChartBar

## Live Preview & Usage

<ComponentPreview name="ChartBar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `data` | `ChartPoint[]` | `[]` | - |
| `colorClass` | `string` | `'bg-chart-series-1'` | - |
| `showGridLines` | `boolean` | `true` | - |
| `showDataLabels` | `boolean` | `true` | - |
| `showAxisLabels` | `boolean` | `true` | - |
| `showTooltip` | `boolean` | `true` | - |
| `ariaLabel` | `string` | `'Bar chart'` | - |
| `className` | `string` | `''` | - |

> [!NOTE]
> `ChartPoint` mendukung data tunggal (`value: number`) dan multidata (`values: number[]`).
> Jika `values` diberikan (misal: `values: [45, 60]`), chart otomatis me-render grouped bar berdampingan untuk setiap kategori. Saat di-hover/focus, card popup detail menampilkan seluruh seri data.

