export type UsageFramework = 'react' | 'vue3' | 'svelte' | 'vue2' | 'angular';

const TYPE_IMPORTS_BY_PROP: Record<string, Record<string, string>> = {
  Table: { columns: 'TableColumn', rows: 'TableRowData' },
  TableHeaderRow: { columns: 'TableColumn' },
  Chart: { data: 'ChartDataPoint', legend: 'ChartLegendEntry' },
  ChartBar: { data: 'ChartDataPoint' },
  ChartLine: { data: 'ChartDataPoint' },
  ChartPie: { data: 'ChartDataPoint' },
};

const IGNORED_PREVIEW_KEYS = new Set(['previewState', 'inline']);

function formatTsLiteral(val: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);
  if (val === null || val === undefined) return 'undefined';
  if (typeof val === 'boolean' || typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    if (val.startsWith('data:image/')) return "'/avatar-sample.svg'";
    return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.slice(0, 5).map((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const pairs = Object.entries(item)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`}: ${formatTsLiteral(v, 0)}`);
        return `${innerPad}{ ${pairs.join(', ')} }`;
      }
      return `${innerPad}${formatTsLiteral(item, indent + 1)}`;
    });
    return `[\n${items.join(',\n')},\n${pad}]`;
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return '{}';
    const pairs = entries.map(
      ([k, v]) => `${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`}: ${formatTsLiteral(v, indent + 1)}`
    );
    return `{ ${pairs.join(', ')} }`;
  }
  return String(val);
}

interface PartitionedProps {
  tsTypes: string[];
  varDecls: Array<{ key: string; typeAnnotation: string; valueCode: string }>;
  entries: Array<{ key: string; val: unknown; isComplex: boolean }>;
}

function partitionProps(compName: string, rawProps: Record<string, unknown>): PartitionedProps {
  const tsTypes: string[] = [];
  const varDecls: Array<{ key: string; typeAnnotation: string; valueCode: string }> = [];
  const entries: Array<{ key: string; val: unknown; isComplex: boolean }> = [];
  const propTypeMap = TYPE_IMPORTS_BY_PROP[compName] || {};

  for (const [key, val] of Object.entries(rawProps)) {
    if (IGNORED_PREVIEW_KEYS.has(key) || key.startsWith('on') || typeof val === 'function') continue;
    if (val === undefined || val === '') continue;
    const isComplex = Array.isArray(val) || (typeof val === 'object' && val !== null);
    if (isComplex) {
      const itemType = propTypeMap[key];
      if (itemType && !tsTypes.includes(itemType)) tsTypes.push(itemType);
      const typeAnnotation = itemType ? `: ${itemType}[]` : '';
      varDecls.push({ key, typeAnnotation, valueCode: formatTsLiteral(val, 0) });
    }
    entries.push({ key, val, isComplex });
  }
  return { tsTypes, varDecls, entries };
}

function formatAttr(fw: UsageFramework, key: string, val: unknown, isComplex: boolean): string {
  if (isComplex) {
    if (fw === 'react') return `${key}={${key}}`;
    if (fw === 'svelte') return `{${key}}`;
    if (fw === 'angular') return `[${key}]="${key}"`;
    return `:${key}="${key}"`;
  }
  if (typeof val === 'string') {
    const clean = val.startsWith('data:image/') ? '/avatar-sample.svg' : val.replace(/"/g, '&quot;');
    return `${key}="${clean}"`;
  }
  if (typeof val === 'boolean') {
    if (fw === 'react' || fw === 'svelte') return `${key}={${val}}`;
    if (fw === 'angular') return `[${key}]="${val}"`;
    return `:${key}="${val}"`;
  }
  if (fw === 'react' || fw === 'svelte') return `${key}={${val}}`;
  if (fw === 'angular') return `[${key}]="${val}"`;
  return `:${key}="${val}"`;
}

function buildElementCall(compName: string, fw: UsageFramework, attrs: string[], indent: string): string {
  const isAngular = fw === 'angular';
  const tag = isAngular ? `spn-${compName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}` : compName;
  if (attrs.length === 0) return isAngular ? `${indent}<${tag}></${tag}>` : `${indent}<${tag} />`;
  if (attrs.length <= 2 && attrs.join(' ').length <= 52) {
    const inline = attrs.join(' ');
    return isAngular ? `${indent}<${tag} ${inline}></${tag}>` : `${indent}<${tag} ${inline} />`;
  }
  const attrLines = attrs.map((a) => `${indent}  ${a}`).join('\n');
  return isAngular
    ? `${indent}<${tag}\n${attrLines}\n${indent}></${tag}>`
    : `${indent}<${tag}\n${attrLines}\n${indent}/>`;
}

function buildImportStatement(compName: string, pkgSubpath: string, tsTypes: string[]): string {
  const specs = [compName, ...tsTypes.map((t) => `type ${t}`)].join(', ');
  return `import { ${specs} } from '@supernova/design-system/${pkgSubpath}';`;
}

export function generateLiveUsageCode(
  compName: string,
  framework: UsageFramework,
  rawProps: Record<string, unknown>
): string {
  const { tsTypes, varDecls, entries } = partitionProps(compName, rawProps);
  const attrs = entries.map((e) => formatAttr(framework, e.key, e.val, e.isComplex));
  const declBlock = varDecls.map((d) => `const ${d.key}${d.typeAnnotation} = ${d.valueCode};`).join('\n\n');

  if (framework === 'react') {
    const imp = buildImportStatement(compName, 'react', tsTypes);
    const call = buildElementCall(compName, 'react', attrs, '    ');
    const body = call.includes('\n') ? `  return (\n${call}\n  );` : `  return ${call.trim()};`;
    return [imp, declBlock, `export default function App() {\n${body}\n}`].filter(Boolean).join('\n\n');
  }
  if (framework === 'vue3') {
    const imp = buildImportStatement(compName, 'vue3', tsTypes);
    const scriptBody = [imp, declBlock].filter(Boolean).join('\n\n');
    const call = buildElementCall(compName, 'vue3', attrs, '  ');
    return `<script setup lang="ts">\n${scriptBody}\n</script>\n\n<template>\n${call}\n</template>`;
  }
  if (framework === 'svelte') {
    const imp = `  ${buildImportStatement(compName, 'svelte', tsTypes)}`;
    const indentedDecls = declBlock
      ? declBlock.split('\n').map((l) => (l.trim() ? `  ${l}` : l)).join('\n')
      : '';
    const scriptBody = [imp, indentedDecls].filter(Boolean).join('\n\n');
    const call = buildElementCall(compName, 'svelte', attrs, '');
    return `<script lang="ts">\n${scriptBody}\n</script>\n\n${call}`;
  }
  if (framework === 'vue2') {
    const imp = buildImportStatement(compName, 'vue2', []);
    const call = buildElementCall(compName, 'vue2', attrs, '  ');
    const dataReturn = varDecls.length
      ? `\n  data() {\n    return {\n${varDecls.map((d) => `      ${d.key},`).join('\n')}\n    };\n  },`
      : '';
    const rawDecls = varDecls.map((d) => `const ${d.key} = ${d.valueCode};`).join('\n\n');
    const scriptBody = [imp, rawDecls, `export default {\n  components: { ${compName} },${dataReturn}\n};`]
      .filter(Boolean)
      .join('\n\n');
    return `<template>\n${call}\n</template>\n\n<script>\n${scriptBody}\n</script>`;
  }
  const call = buildElementCall(compName, 'angular', attrs, '    ');
  const classProps = varDecls.length
    ? '\n' +
      varDecls
        .map((d) => `  ${d.key}${d.typeAnnotation} = ${d.valueCode};`)
        .join('\n\n')
        .split('\n')
        .map((l, idx) => (idx === 0 || l.startsWith('  ') ? l : `  ${l}`))
        .join('\n') +
      '\n'
    : '';
  const typeImport = tsTypes.length ? `, type ${tsTypes.join(', type ')}` : '';
  return [
    "import { Component } from '@angular/core';",
    `import { ${compName}Module${typeImport} } from '@supernova/design-system/angular';`,
    '',
    '@Component({',
    "  selector: 'app-root',",
    '  standalone: true,',
    `  imports: [${compName}Module],`,
    '  template: `',
    call,
    '  `,',
    '})',
    `export class AppComponent {${classProps}}`,
  ].join('\n');
}
