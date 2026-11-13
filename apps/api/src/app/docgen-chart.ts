export const CHART_USAGE_AND_UTILS_DOC = `## 12 Chart Types & Composition Usage

\`Chart\` wraps visualization sub-components and \`ChartLegend\` using declarative composition:

\`\`\`tsx
import {
  Chart,
  ChartBar,
  ChartLine,
  ChartPie,
  ChartHorizontalBar,
  ChartScatter,
  ChartRadar,
  ChartGauge,
  ChartFunnel,
  ChartWaterfall,
  ChartLegend,
  ChartLegendItem,
} from '@komerce-design/react';

// 1. Bar & 2. Stacked Bar (pass stacked={true} and multi-value rows)
<Chart title="Revenue Overview" description="Weekly revenue breakdown by day">
  <ChartBar
    yTicks={[200, 150, 100, 50, 0]}
    maxValue={200}
    stacked={false}
    showDataLabels={true}
    data={[
      { label: 'Mon', value: 120, values: [50, 35, 35] },
      { label: 'Tue', value: 80, values: [30, 25, 25] },
      { label: 'Wed', value: 165, values: [60, 45, 60] },
    ]}
  />
  <ChartLegend>
    <ChartLegendItem colorClass="bg-chart-series-1">Direct Sales</ChartLegendItem>
    <ChartLegendItem colorClass="bg-chart-series-2">Marketplace</ChartLegendItem>
  </ChartLegend>
</Chart>

// 3. Line & 4. Area (pass area={true} for Area chart)
<Chart title="Revenue Trend" description="Daily revenue trajectory">
  <ChartLine
    yTicks={[200, 150, 100, 50, 0]}
    maxValue={200}
    area={true}
    showDataLabels={true}
    data={[
      { label: 'Mon', value: 120 },
      { label: 'Tue', value: 80 },
      { label: 'Wed', value: 160 },
    ]}
  />
</Chart>

// 5. Donut & 6. Pie (pass innerRadius > 0 for Donut, 0 for Pie)
<Chart title="Channel Share" description="Order share by channel">
  <ChartPie
    innerRadius={30}
    centerLabel="45.2K"
    data={[
      { label: 'Series 1', value: 30 },
      { label: 'Series 2', value: 24 },
      { label: 'Series 3', value: 18 },
    ]}
  />
</Chart>

// 7. Horizontal Bar
<Chart title="Product Share" description="Top performing products">
  <ChartHorizontalBar
    maxValue={100}
    valueSuffix="%"
    showDataLabels={true}
    data={[
      { label: 'Product A', value: 85 },
      { label: 'Product B', value: 65 },
      { label: 'Product C', value: 50 },
    ]}
  />
</Chart>

// 8. Scatter
<Chart title="Correlation" description="Order value vs conversion rate">
  <ChartScatter
    yTicks={[100, 75, 50, 25, 0]}
    xTicks={[0, 20, 40, 60, 80, 100]}
    data={[
      { label: 'S1', x: 25, y: 48, series: 0 },
      { label: 'S2', x: 68, y: 72, series: 1 },
      { label: 'S3', x: 84, y: 30, series: 2 },
    ]}
  />
</Chart>

// 9. Radar
<Chart title="Performance Profile" description="Multi-axis capability comparison">
  <ChartRadar
    rings={3}
    maxValue={100}
    data={[
      { label: 'Speed', values: [85, 65] },
      { label: 'Power', values: [75, 80] },
      { label: 'Range', values: [65, 85] },
      { label: 'Defense', values: [80, 60] },
      { label: 'Health', values: [70, 75] },
      { label: 'Magic', values: [75, 85] },
    ]}
  />
</Chart>

// 10. Gauge
<Chart title="SLA Attainment" description="Current fulfillment target">
  <ChartGauge value={75} min={0} max={100} showDataLabels={true} />
</Chart>

// 11. Funnel
<Chart title="Conversion Funnel" description="Visitor to closed deal progression">
  <ChartFunnel
    showDataLabels={true}
    data={[
      { label: 'Visitors', value: 12500 },
      { label: 'Leads', value: 8200 },
      { label: 'Qualified', value: 4100 },
      { label: 'Proposals', value: 1800 },
      { label: 'Closed', value: 620 },
    ]}
  />
</Chart>

// 12. Waterfall
<Chart title="Net Profit Bridge" description="Revenue to net profit breakdown">
  <ChartWaterfall
    yTicks={[200, 150, 100, 50, 0]}
    maxValue={200}
    showDataLabels={true}
    data={[
      { label: 'Start', value: 120 },
      { label: '+Rev', value: 35 },
      { label: '+Svc', value: 20 },
      { label: '-Cost', value: -30 },
      { label: '-Tax', value: -20 },
      { label: 'Total', value: 125, isTotal: true },
    ]}
  />
</Chart>
\`\`\`

## Built-in Interactive \`<Tooltip />\` & Customizing Detail Labels

Every visualization sub-component (\`ChartBar\`, \`ChartLine\`, \`ChartPie\`, \`ChartHorizontalBar\`, \`ChartScatter\`, \`ChartRadar\`, \`ChartGauge\`, \`ChartFunnel\`, and \`ChartWaterfall\`) internally composes \`<Tooltip />\` **by default** (\`showTooltip={true}\`) to display full data details on hover or focus without altering the trigger's visual appearance.

You can customize or disable the tooltip and value formatting at both the chart level and per data point:
- **Chart-level formatters (\`formatTooltip\` & \`formatValue\`)**: Pass \`formatTooltip={(ctx: ChartTooltipContext) => ...}\` and \`formatValue={(val: number) => ...}\` to format numbers and tooltips dynamically with standard JavaScript/\`Intl.NumberFormat\`.
- **Per-point custom detail (\`tooltip?: string | ((ctx: ChartTooltipContext) => string)\`)**: Pass \`tooltip\` on any item in \`data\` (or on \`<ChartGauge tooltip="..." />\`) to override the default formatted detail string.
- **Position (\`tooltipPosition\`)**: Pass \`tooltipPosition="top" | "bottom" | "left" | "right"\` (default \`"top"\`).
- **Disable (\`showTooltip={false}\`)**: Pass \`showTooltip={false}\` to hide tooltips on a chart.

\`\`\`tsx
<ChartBar
  showTooltip={true}
  tooltipPosition="top"
  formatValue={(val) => \`IDR \${val}M\`}
  formatTooltip={(ctx) => \`\${ctx.label}: IDR \${ctx.value}M (\${ctx.percentage}%)\`}
  data={[
    { label: 'Mon', value: 120, tooltip: (ctx) => \`Monday Peak: IDR \${ctx.value}M (+14% YoY)\` },
    { label: 'Tue', value: 80 },
    { label: 'Wed', value: 165 },
  ]}
/>
\`\`\`

## Headless Chart Utilities (\`utils\` / \`core-chart\`)

All chart geometry, scaling, and coordinate calculations are exported as pure, SSR-safe TypeScript functions from \`@komerce-design/{react,vue3,svelte,vue2,angular}\` (see the full [Headless Chart Engine Guide](/core/headless-chart)):

| Helper Function | Signature | Description |
| :--- | :--- | :--- |
| \`getChartBarState\` | \`(data?, defaultColorClass?, stacked?, maxScale?, formatTooltip?, formatValue?)\` | Computes normalized bar heights (\`%\`), series color classes, and stacked totals for vertical/grouped/stacked bar charts. |
| \`getChartLineState\` | \`(data?, defaultStroke?, defaultFill?, maxScale?, formatTooltip?, formatValue?)\` | Computes \`0..100\` SVG \`polyline\`/\`polygon\` coordinate strings and interactive point metadata for single/multi-series Line & Area charts. |
| \`getChartPieState\` | \`(data?, innerRadius?, formatTooltip?, formatValue?)\` | Computes SVG circle \`stroke-dasharray\`, \`stroke-dashoffset\`, percentages, and ring geometry for Pie (\`innerRadius = 0\`) & Donut (\`innerRadius > 0\`) charts. |
| \`getChartHorizontalBarState\` | \`(data?, defaultColorClass?, maxScale?, valueSuffix?, formatTooltip?, formatValue?)\` | Computes horizontal track fill widths (\`%\`) and formatted display values. |
| \`getChartScatterState\` | \`(data?, maxX?, maxY?, formatTooltip?, formatValue?)\` | Normalizes 2D \`(x, y)\` points into percentage \`left\`/\`top\` positions and series color tokens. |
| \`getChartRadarState\` | \`(data?, rings?, maxScale?, formatTooltip?, formatValue?)\` | Computes concentric polygon rings, axis spokes, perimeter label coordinates, and multi-series radar polygons/dots in a \`200x200\` SVG viewBox. |
| \`getChartGaugeState\` | \`(value?, min?, max?, customTooltip?, formatTooltip?, formatValue?)\` | Computes semi-circular SVG arc paths, \`dashArray\` fill lengths, and clamped percentages (\`0%..100%\`). |
| \`getChartFunnelState\` | \`(data?, formatTooltip?, formatValue?)\` | Normalizes funnel stage widths (\`%\`) against the top stage and formats locale numeric labels. |
| \`getChartWaterfallState\` | \`(data?, maxScale?, formatTooltip?, formatValue?)\` | Computes running cumulative totals, floating bar \`bottom\`/\`height\` percentages, and \`total\`/\`positive\`/\`negative\` semantic color classes. |
| \`scaleLinear\` / \`scaleBand\` | \`({ domain, range, padding? })\` | Pure linear and categorical band scales with \`.ticks(count)\` and \`.bandwidth\` helpers. |
| \`getSmoothBezierPath\` / \`getAreaPath\` | \`(points, baselineY?)\` | Generates smooth cubic Bézier SVG path commands (\`M ... C ...\`) and closed area paths. |
| \`getPieSlices\` | \`(values, radius?, innerRadius?)\` | Generates exact SVG arc sector paths (\`M ... A ... Z\`) for pie and donut slices. |

\`\`\`ts
import {
  getChartBarState,
  getChartRadarState,
  getChartWaterfallState,
  scaleLinear,
} from '@komerce-design/react'; // or './utils'

const barState = getChartBarState([{ label: 'Mon', values: [50, 35, 35] }], 'bg-chart-series-1', true, 200);
// barState.rows[0].height -> '60%'

const waterfallState = getChartWaterfallState([
  { label: 'Start', value: 120 },
  { label: '+Rev', value: 40 },
  { label: '-Cost', value: -30 },
  { label: 'Total', value: 130, isTotal: true },
], 200);
// waterfallState.bars -> [{ bottom: '0.0%', height: '60.0%', kind: 'total', ... }, ...]
\`\`\`
`;

export const TABLE_HEADLESS_DOC = `## Headless Table Controller (\`createTableController\`)

\`Table\`, \`TableHeaderCell\`, \`TableCheckboxHeaderCell\`, \`TableBodyRow\`, \`TableCheckboxBodyCell\`, and \`Pagination\` integrate plug-and-play with \`createTableController\` for reactive search, tri-state sorting (\`'asc' | 'desc' | 'none'\`), page-scoped checkbox selection with \`indeterminate\` state, and pagination across all 5 frameworks. See the full [Headless Table Controller Guide & Live Playground](/core/headless-table).

\`\`\`tsx
import { createTableController, Table, TableHeaderRow, TableHeaderCell, TableCheckboxHeaderCell, TableBodyRow, TableCheckboxBodyCell, Pagination } from '@komerce-design/react';

const table = createTableController({ rows: orders, getRowId: (r) => r.id, searchKeys: ['customer', 'email'] });
// Bind directly:
// <InputText {...table.bindSearch()} />
// <TableCheckboxHeaderCell {...table.bindHeaderCheckbox()} />
// <TableHeaderCell {...table.bindHeaderSort('customer')}>Customer</TableHeaderCell>
// <TableBodyRow {...table.bindRow(row.id)}><TableCheckboxBodyCell {...table.bindRowCheckbox(row.id)} /></TableBodyRow>
// <Pagination {...table.bindPagination()} />
\`\`\`
`;

export const DATE_PICKER_HEADLESS_DOC = `## Headless Form & Dynamic Callback Formatting (\`DatePickerFormatArg\`)

\`DatePicker\` integrates plug-and-play with [\`createFormController\` (\`form.bindField\`)](/core/headless-form) and [Date & Calendar Primitives (\`parseDateInput\`, \`buildCalendarPanel\`)](/core/headless-primitives). Both \`hint\` and \`displayValue\` accept a standard callback function \`(date: DatePickerFormatArg) => string\` where \`date\` is a native \`Date\` instance enriched with \`{ year, month, day, iso, formatted, time, startDate, endDate, range, mode, hasValue }\`:

\`\`\`tsx
<DatePicker
  mode="single"
  editable={true}
  showTime={true}
  showHint={true}
  hint={(date) =>
    date.hasValue
      ? \`Jadwal pengiriman: \${date.toLocaleDateString('id-ID', { dateStyle: 'long' })} pukul \${date.time}\`
      : 'Ketik ekspresi seperti "besok", "3 hari lagi", atau pilih tanggal'
  }
  {...form.bindField('deliveryDate')}
/>
\`\`\`
`;
