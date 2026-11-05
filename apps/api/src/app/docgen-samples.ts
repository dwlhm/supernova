export interface ComponentSampleConfig {
  tsTypes?: string[];
  declarations: string;
  reactProps: string;
  vueProps: string;
  svelteProps: string;
}

export const COMPONENT_SAMPLES: Record<string, ComponentSampleConfig> = {
  Table: {
    tsTypes: ['TableColumn', 'TableRowData'],
    declarations: `const columns: TableColumn[] = [
  { id: 'id', label: 'Order ID', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'right' },
];

const rows: TableRowData[] = [
  { id: '1', cells: ['ORD-9021', 'Budi Santoso', 'Delivered', 'Rp 245.000'] },
  { id: '2', cells: ['ORD-9022', 'Siti Rahma', 'Shipped', 'Rp 510.000'], selected: true },
  { id: '3', cells: ['ORD-9023', 'Ahmad Dani', 'Processing', 'Rp 120.000'] },
];`,
    reactProps: `caption="Recent Orders"
      columns={columns}
      rows={rows}
      showCheckbox={true}
      showNo={true}`,
    vueProps: `caption="Recent Orders"
    :columns="columns"
    :rows="rows"
    :showCheckbox="true"
    :showNo="true"`,
    svelteProps: `caption="Recent Orders"
  {columns}
  {rows}
  showCheckbox={true}
  showNo={true}`,
  },
  Chart: {
    tsTypes: ['ChartDataPoint', 'ChartLegendEntry'],
    declarations: `const data: ChartDataPoint[] = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 65 },
  { label: 'Fri', value: 89 },
];

const legend: ChartLegendEntry[] = [
  { label: 'Current Period', colorClass: 'bg-chart-series-1' },
];`,
    reactProps: `type="bar"
      title="Revenue Overview"
      description="Weekly revenue breakdown by day"
      data={data}
      legend={legend}
      showLegend={true}`,
    vueProps: `type="bar"
    title="Revenue Overview"
    description="Weekly revenue breakdown by day"
    :data="data"
    :legend="legend"
    :showLegend="true"`,
    svelteProps: `type="bar"
  title="Revenue Overview"
  description="Weekly revenue breakdown by day"
  {data}
  {legend}
  showLegend={true}`,
  },
  ChartBar: {
    tsTypes: ['ChartDataPoint'],
    declarations: `const data: ChartDataPoint[] = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 65 },
  { label: 'Fri', value: 89 },
];`,
    reactProps: `data={data} showGridLines={true} showDataLabels={true}`,
    vueProps: `:data="data" :showGridLines="true" :showDataLabels="true"`,
    svelteProps: `{data} showGridLines={true} showDataLabels={true}`,
  },
  ChartLine: {
    tsTypes: ['ChartDataPoint'],
    declarations: `const data: ChartDataPoint[] = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 65 },
  { label: 'Fri', value: 89 },
];`,
    reactProps: `data={data} area={true} showGridLines={true}`,
    vueProps: `:data="data" :area="true" :showGridLines="true"`,
    svelteProps: `{data} area={true} showGridLines={true}`,
  },
  ChartPie: {
    tsTypes: ['ChartDataPoint'],
    declarations: `const data: ChartDataPoint[] = [
  { label: 'Express', value: 45 },
  { label: 'Regular', value: 30 },
  { label: 'Cargo', value: 15 },
  { label: 'Instant', value: 10 },
];`,
    reactProps: `data={data} innerRadius={50} ariaLabel="Shipping Distribution"`,
    vueProps: `:data="data" :innerRadius="50" ariaLabel="Shipping Distribution"`,
    svelteProps: `{data} innerRadius={50} ariaLabel="Shipping Distribution"`,
  },
  Tabs: {
    declarations: `const tabs = [
  { id: 'overview', label: 'Overview', num: '12' },
  { id: 'orders', label: 'Orders', num: '4' },
  { id: 'settings', label: 'Settings' },
];`,
    reactProps: `activeTab="overview" tabs={tabs} ariaLabel="Order tabs"`,
    vueProps: `activeTab="overview" :tabs="tabs" ariaLabel="Order tabs"`,
    svelteProps: `activeTab="overview" {tabs} ariaLabel="Order tabs"`,
  },
  Stepper: {
    declarations: `const steps = ['Cart', 'Shipping', 'Payment', 'Review'];`,
    reactProps: `orientation="horizontal" current={2} steps={steps}`,
    vueProps: `orientation="horizontal" :current="2" :steps="steps"`,
    svelteProps: `orientation="horizontal" current={2} {steps}`,
  },
  Breadcrumb: {
    declarations: `const items = [
  { label: 'Home', href: '#home' },
  { label: 'Orders', href: '#orders' },
  { label: 'Shipments', href: '#shipments' },
];`,
    reactProps: `items={items}`,
    vueProps: `:items="items"`,
    svelteProps: `{items}`,
  },
};

export function renderSampleUsageCodeGroup(compName: string, sample: ComponentSampleConfig): string[] {
  const typeImportReact = sample.tsTypes?.length
    ? `import { ${compName}, type ${sample.tsTypes.join(', type ')} } from '@supernova/design-system/react';`
    : `import { ${compName} } from '@supernova/design-system/react';`;

  const typeImportVue = sample.tsTypes?.length
    ? `import { ${compName}, type ${sample.tsTypes.join(', type ')} } from '@supernova/design-system/vue3';`
    : `import { ${compName} } from '@supernova/design-system/vue3';`;

  const typeImportSvelte = sample.tsTypes?.length
    ? `import { ${compName}, type ${sample.tsTypes.join(', type ')} } from '@supernova/design-system/svelte';`
    : `import { ${compName} } from '@supernova/design-system/svelte';`;

  const isMultilineReact = sample.reactProps.includes('\n');
  const isMultilineVue = sample.vueProps.includes('\n');
  const isMultilineSvelte = sample.svelteProps.includes('\n');

  const reactCall = isMultilineReact
    ? `<${compName}\n      ${sample.reactProps}\n    />`
    : `<${compName} ${sample.reactProps} />`;

  const vueCall = isMultilineVue
    ? `<${compName}\n    ${sample.vueProps}\n  />`
    : `<${compName} ${sample.vueProps} />`;

  const svelteCall = isMultilineSvelte
    ? `<${compName}\n  ${sample.svelteProps}\n/>`
    : `<${compName} ${sample.svelteProps} />`;

  const typeImportVue2 = sample.tsTypes?.length
    ? `import { ${compName}, type ${sample.tsTypes.join(', type ')} } from '@supernova/design-system/vue2';`
    : `import { ${compName} } from '@supernova/design-system/vue2';`;

  const vue2DataLines = sample.declarations
    ? sample.declarations
        .match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)/g)
        ?.map((m) => `      ${m.replace(/(?:const|let|var)\s+/, '')},`)
        .join('\n') || ''
    : '';

  const vue2Script = sample.declarations
    ? [
        '<script>',
        typeImportVue2,
        '',
        sample.declarations,
        '',
        'export default {',
        `  components: { ${compName} },`,
        '  data() {',
        '    return {',
        vue2DataLines,
        '    };',
        '  },',
        '};',
        '</script>',
      ].join('\n')
    : [
        '<script>',
        typeImportVue2,
        '',
        'export default {',
        `  components: { ${compName} },`,
        '};',
        '</script>',
      ].join('\n');

  const kebabName = compName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const angularProps = sample.vueProps.replace(/:([a-zA-Z0-9_$]+)=/g, '[$1]=');
  const isMultilineAngular = angularProps.includes('\n');
  const angularCall = isMultilineAngular
    ? `<spn-${kebabName}\n      ${angularProps}\n    ></spn-${kebabName}>`
    : `<spn-${kebabName} ${angularProps}></spn-${kebabName}>`;

  const angularClassMembers = sample.declarations
    ? '\n  ' +
      sample.declarations
        .replace(/(?:const|let|var)\s+/g, '')
        .split('\n')
        .map((l) => (l.trim() ? `  ${l}` : l))
        .join('\n') +
      '\n'
    : '';

  const angularBlock = [
    '```ts [Angular]',
    "import { Component } from '@angular/core';",
    `import { ${compName}Module } from '@supernova/design-system/angular';`,
    '',
    '@Component({',
    "  selector: 'app-root',",
    '  standalone: true,',
    `  imports: [${compName}Module],`,
    '  template: `',
    `    ${angularCall}`,
    '  `,',
    '})',
    `export class AppComponent {${angularClassMembers}}`,
    '```',
  ];

  return [
    '## Usage',
    '',
    '::: code-group',
    '',
    '```tsx [React]',
    typeImportReact,
    '',
    sample.declarations,
    '',
    'export default function App() {',
    `  return (`,
    `    ${reactCall}`,
    `  );`,
    '}',
    '```',
    '',
    '```vue [Vue 3]',
    '<script setup lang="ts">',
    typeImportVue,
    '',
    sample.declarations,
    '</script>',
    '',
    '<template>',
    `  ${vueCall}`,
    '</template>',
    '```',
    '',
    '```svelte [Svelte]',
    '<script lang="ts">',
    `  ${typeImportSvelte}`,
    '',
    sample.declarations
      .split('\n')
      .map((l) => (l.trim() ? `  ${l}` : l))
      .join('\n'),
    '</script>',
    '',
    svelteCall,
    '```',
    '',
    '```vue [Vue 2]',
    '<template>',
    `  ${vueCall}`,
    '</template>',
    '',
    vue2Script,
    '```',
    '',
    ...angularBlock,
    '',
    ':::',
    '',
  ];
}
