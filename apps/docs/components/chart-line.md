# ChartLine

## Live Preview & Usage

<ComponentPreview name="ChartLine" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `data` | `ChartPoint[]` | `[]` | - |
| `area` | `boolean` | `false` | - |
| `showGridLines` | `boolean` | `true` | - |
| `showDataLabels` | `boolean` | `false` | - |
| `showAxisLabels` | `boolean` | `true` | - |
| `showTooltip` | `boolean` | `true` | - |
| `strokeClass` | `string` | `'stroke-chart-series-1'` | - |
| `fillClass` | `string` | `'fill-chart-series-1'` | - |
| `ariaLabel` | `string` | `'Line chart'` | - |
| `className` | `string` | `''` | - |

> [!NOTE]
> `ChartPoint` mendukung data tunggal (`value: number`) dan multidata (`values: number[]`).
> Jika `values` diberikan (misal: `values: [45, 60]`), chart otomatis me-render multi-line (dan multi-area jika `area={true}`) dengan seri warna `stroke-chart-series-1..5`. Card popup detail menampilkan semua seri nilai saat titik garis di-hover/focus.

