import type { PreviewFramework } from '../preview/registry';

/** Usage snippets cover the same frameworks as the live preview (single source: the generated registry). */
export type UsageFramework = PreviewFramework;

const TYPE_IMPORTS_BY_PROP: Record<string, Record<string, string>> = {
  Table: { columns: 'TableColumn', rows: 'TableRowData' },
  TableHeaderRow: { columns: 'TableColumn' },
  Chart: { data: 'ChartDataPoint', legend: 'ChartLegendEntry' },
  ChartBar: { data: 'ChartDataPoint' },
  ChartLine: { data: 'ChartDataPoint' },
  ChartPie: { data: 'ChartDataPoint' },
};

const IGNORED_PREVIEW_KEYS = new Set(['previewState', 'inline', 'maxSizeBytes']);

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

const ICON_PROP_KEYS = new Set(['icon', 'leftIcon', 'rightIcon', 'leadingIcon', 'trailingIcon']);

function toPascalIconName(val: unknown, fallback: string): string {
  if (typeof val === 'string' && val.trim() && val.trim() !== 'default') {
    return val
      .trim()
      .split(/[-_\s]+|(?=[A-Z])/)
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join('');
  }
  return fallback;
}

function partitionProps(compName: string, rawProps: Record<string, unknown>, fw: UsageFramework): PartitionedProps {
  const tsTypes: string[] = [];
  const varDecls: Array<{ key: string; typeAnnotation: string; valueCode: string }> = [];
  const entries: Array<{ key: string; val: unknown; isComplex: boolean }> = [];
  const propTypeMap = TYPE_IMPORTS_BY_PROP[compName] || {};

  for (const [key, val] of Object.entries(rawProps)) {
    if (IGNORED_PREVIEW_KEYS.has(key) || key === 'children' || key.startsWith('on')) continue;
    if (val === undefined || val === '') continue;
    if (ICON_PROP_KEYS.has(key)) continue;
    if (compName === 'Button' && (key === 'showLeftIcon' || key === 'showRightIcon')) continue;
    if (typeof val === 'function') {
      const fnCode = typeof (val as { __source?: string }).__source === 'string'
        ? (val as { __source: string }).__source
        : val.toString();
      const needsVarDecl = fw === 'angular';
      if (needsVarDecl) {
        varDecls.push({ key, typeAnnotation: '', valueCode: fnCode });
      }
      entries.push({ key, val, isComplex: needsVarDecl });
      continue;
    }
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
  if (typeof val === 'function') {
    const fnCode = typeof (val as { __source?: string }).__source === 'string'
      ? (val as { __source: string }).__source
      : val.toString();
    if (fw === 'react' || fw === 'svelte') return `${key}={${fnCode}}`;
    return `:${key}="${fnCode.replace(/"/g, "'")}"`;
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

/** Renders the element; text `content` (the `children` fixture) becomes the element body in every framework. */
function buildElementCall(compName: string, fw: UsageFramework, attrs: string[], indent: string, content?: string): string {
  const isAngular = fw === 'angular';
  const tag = isAngular ? `kd-${compName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}` : compName;
  const hasBody = isAngular || content !== undefined;
  const body = hasBody ? `>${content ?? ''}</${tag}>` : ' />';
  if (attrs.length === 0) return `${indent}<${tag}${hasBody ? body : ' />'}`;
  if (attrs.length <= 2 && attrs.join(' ').length <= 52) return `${indent}<${tag} ${attrs.join(' ')}${body}`;
  const attrLines = attrs.map((a) => `${indent}  ${a}`).join('\n');
  return `${indent}<${tag}\n${attrLines}\n${indent}${hasBody ? body : '/>'}`;
}

function buildImportStatement(compName: string, pkgSubpath: string, tsTypes: string[]): string {
  const specs = [compName, ...tsTypes.map((t) => `type ${t}`)].join(', ');
  return `import { ${specs} } from '@komerce-design/${pkgSubpath}';`;
}

export function generateLiveUsageCode(
  compName: string,
  framework: UsageFramework,
  rawProps: Record<string, unknown>
): string {
  const { tsTypes, varDecls, entries } = partitionProps(compName, rawProps, framework);
  const content = typeof rawProps.children === 'string' ? rawProps.children : undefined;
  const attrs = entries.map((e) => formatAttr(framework, e.key, e.val, e.isComplex));
  const iconEntries: Array<{ propKey: string; compSymbol: string }> = [];
  for (const propKey of ICON_PROP_KEYS) {
    const rawVal = rawProps[propKey];
    const hasShowFallback =
      compName === 'Button' &&
      ((propKey === 'leftIcon' && Boolean(rawProps.showLeftIcon)) ||
        (propKey === 'rightIcon' && Boolean(rawProps.showRightIcon)));
    const isCustomIcon = typeof rawVal === 'string' && rawVal.trim() !== '' && rawVal.trim() !== 'default';
    if (isCustomIcon || hasShowFallback) {
      const defaultSymbol = propKey === 'rightIcon' || propKey === 'trailingIcon' ? 'ArrowRight' : 'Plus';
      iconEntries.push({ propKey, compSymbol: toPascalIconName(rawVal, defaultSymbol) });
    }
  }
  for (const { propKey, compSymbol } of iconEntries) {
    attrs.push(
      framework === 'react'
        ? `${propKey}={<${compSymbol} className="h-4 w-4" />}`
        : framework === 'svelte'
          ? `${propKey}={${compSymbol}}`
          : framework === 'angular'
            ? `[${propKey}]="${compSymbol}IconComponent"`
            : `:${propKey}="${compSymbol}"`
    );
  }
  const iconSpecs = [...new Set(iconEntries.map((e) => e.compSymbol))].join(', ');
  const declBlock = varDecls.map((d) => `const ${d.key}${d.typeAnnotation} = ${d.valueCode};`).join('\n\n');

  if (framework === 'react') {
    const imp = buildImportStatement(compName, 'react', tsTypes);
    const iconImp = iconSpecs ? `import { ${iconSpecs} } from 'lucide-react';` : '';
    const call = buildElementCall(compName, 'react', attrs, '    ', content);
    const body = call.includes('\n') ? `  return (\n${call}\n  );` : `  return ${call.trim()};`;
    return [[imp, iconImp].filter(Boolean).join('\n'), declBlock, `export default function App() {\n${body}\n}`].filter(Boolean).join('\n\n');
  }
  if (framework === 'vue3') {
    const imp = buildImportStatement(compName, 'vue3', tsTypes);
    const iconImp = iconSpecs ? `import { ${iconSpecs} } from 'lucide-vue-next';` : '';
    const scriptBody = [[imp, iconImp].filter(Boolean).join('\n'), declBlock].filter(Boolean).join('\n\n');
    const call = buildElementCall(compName, 'vue3', attrs, '  ', content);
    return `<script setup lang="ts">\n${scriptBody}\n</script>\n\n<template>\n${call}\n</template>`;
  }
  if (framework === 'svelte') {
    const imp = `  ${buildImportStatement(compName, 'svelte', tsTypes)}`;
    const iconImp = iconSpecs ? `  import { ${iconSpecs} } from 'lucide-svelte';` : '';
    const indentedDecls = declBlock
      ? declBlock.split('\n').map((l) => (l.trim() ? `  ${l}` : l)).join('\n')
      : '';
    const scriptBody = [[imp, iconImp].filter(Boolean).join('\n'), indentedDecls].filter(Boolean).join('\n\n');
    const call = buildElementCall(compName, 'svelte', attrs, '', content);
    return `<script lang="ts">\n${scriptBody}\n</script>\n\n${call}`;
  }
  if (framework === 'vue2') {
    const imp = buildImportStatement(compName, 'vue2', []);
    const call = buildElementCall(compName, 'vue2', attrs, '  ', content);
    const dataReturn = varDecls.length
      ? `\n  data() {\n    return {\n${varDecls.map((d) => `      ${d.key},`).join('\n')}\n    };\n  },`
      : '';
    const rawDecls = varDecls.map((d) => `const ${d.key} = ${d.valueCode};`).join('\n\n');
    const scriptBody = [imp, rawDecls, `export default {\n  components: { ${compName} },${dataReturn}\n};`]
      .filter(Boolean)
      .join('\n\n');
    return `<template>\n${call}\n</template>\n\n<script>\n${scriptBody}\n</script>`;
  }
  const call = buildElementCall(compName, 'angular', attrs, '    ', content);
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
    `import { ${compName}Module${typeImport} } from '@komerce-design/angular';`,
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
