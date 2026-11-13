import {
  camelToKebab,
  normalizeComponentName,
  type FigmaComponentSpec,
  type FigmaToken,
} from '../domain/models.js';
import { extractPropsFromLiteSource, formatDescriptionSections } from './docgen-ast.js';
import {
  CHART_USAGE_AND_UTILS_DOC,
  DATE_PICKER_HEADLESS_DOC,
  TABLE_HEADLESS_DOC,
} from './docgen-chart.js';
import { generateComponentTokensSection, generateVisualTokensPage } from './docgen-tokens.js';
import { formatTokenValue, resolveTokens, tokenCSSVarName } from './tokens.js';

interface DocPropRow {
  name: string;
  type: string;
  defaultVal: string;
  options: string;
}

function sanitizePropKey(rawKey: string): string {
  const withoutHash = rawKey.includes('#') ? rawKey.split('#')[0]! : rawKey;
  const cleaned = withoutHash.replace(/^[^\p{L}\p{N}]+/gu, '').trim();
  if (!cleaned) return '';
  const words = cleaned.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return '';
  return words
    .map((w, i) => (i === 0 ? w.charAt(0).toLowerCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');
}

function extractFallbackSpecProps(comp: FigmaComponentSpec): DocPropRow[] {
  const rows: DocPropRow[] = [];
  const rawProps = comp.properties || {};
  const seen = new Set<string>();

  for (const [rawKey, rawVal] of Object.entries(rawProps)) {
    const name = sanitizePropKey(rawKey);
    if (!name || seen.has(name)) continue;

    if (rawVal && typeof rawVal === 'object' && !Array.isArray(rawVal)) {
      const m = rawVal as Record<string, any>;
      const rawType = String(m.type || 'string').toLowerCase();
      if (rawType === 'instance_swap') continue;
      const opts = Array.isArray(m.variantOptions)
        ? m.variantOptions.map((o: any) => String(o).trim()).filter(Boolean)
        : [];
      if (
        name.toLowerCase() === 'state' &&
        opts.every((o) => ['default', 'hover', 'focus', 'pressed', 'active', 'disabled'].includes(o.toLowerCase()))
      ) {
        continue;
      }
      seen.add(name);
      rows.push({
        name,
        type: rawType === 'variant' && opts.length > 0 ? opts.map((o) => `'${o}'`).join(' | ') : rawType,
        defaultVal: m.defaultValue !== undefined ? String(m.defaultValue) : '-',
        options: opts.length > 0 ? opts.join(', ') : '-',
      });
    } else {
      seen.add(name);
      rows.push({
        name,
        type: typeof rawVal,
        defaultVal: rawVal !== undefined && rawVal !== null ? String(rawVal) : '-',
        options: '-',
      });
    }
  }
  return rows;
}

function astPropRows(sourceCode?: string): DocPropRow[] {
  return extractPropsFromLiteSource(sourceCode).map((p) => ({
    name: p.name,
    type: p.type.replace(/\|/g, '\\|'),
    defaultVal: p.defaultValue ?? '-',
    options: p.type.includes("'")
      ? p.type
          .split('|')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .join(', ')
      : '-',
  }));
}

function propsTable(rows: DocPropRow[]): string[] {
  if (rows.length === 0) return ['No configurable properties defined.', ''];
  return [
    '| Prop | Type | Default | Options |',
    '| :--- | :--- | :--- | :--- |',
    ...rows.map((r) => `| \`${r.name}\` | \`${r.type}\` | \`${r.defaultVal}\` | ${r.options} |`),
    '',
  ];
}

/**
 * Renders a component page. `siblings` are derived compound parts (e.g. StepperItem for Stepper),
 * documented on the parent page because consumers compose them together.
 */
export function generateComponentDoc(comp: FigmaComponentSpec, sourceCode?: string, siblings: Record<string, string> = {}): string {
  const compName = normalizeComponentName(comp.name);
  const astRows = astPropRows(sourceCode);
  const rows = astRows.length > 0 ? astRows : extractFallbackSpecProps(comp);

  const lines: string[] = [`# ${compName}`, ''];
  const descSection = formatDescriptionSections(comp.description);
  if (descSection) {
    lines.push(descSection.trimEnd(), '');
  }

  lines.push('## Live Preview & Usage', '', `<ComponentPreview name="${compName}" />`, '');
  if (compName === 'Chart') {
    lines.push(CHART_USAGE_AND_UTILS_DOC.trimEnd(), '');
  } else if (compName === 'Table') {
    lines.push(TABLE_HEADLESS_DOC.trimEnd(), '');
  } else if (compName === 'DatePicker') {
    lines.push(DATE_PICKER_HEADLESS_DOC.trimEnd(), '');
  }
  lines.push('## Props & Variants', '', ...propsTable(rows));
  for (const [name, source] of Object.entries(siblings).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`### \`${name}\``, '', ...propsTable(astPropRows(source)));
  }

  const tokensSection = generateComponentTokensSection(compName, sourceCode, siblings);
  if (tokensSection) {
    lines.push(tokensSection.trimEnd(), '');
  }

  return lines.join('\n');
}

export function generateComponentsIndexDoc(components: FigmaComponentSpec[]): string {
  const sorted = [...components].sort((a, b) =>
    normalizeComponentName(a.name).localeCompare(normalizeComponentName(b.name))
  );
  const lines: string[] = [
    '# Components Overview',
    '',
    'Browse the multi-framework components generated from Figma.',
    '',
    '## Component Catalog',
    '',
  ];

  for (const comp of sorted) {
    const compName = normalizeComponentName(comp.name);
    const kebabName = camelToKebab(compName);
    const summary = (comp.description || '').split(/WHEN TO USE:|USAGE GUIDELINES:|\r?\n/i)[0]?.trim();
    lines.push(summary ? `- [${compName}](./${kebabName}.md) — ${summary}` : `- [${compName}](./${kebabName}.md)`);
  }
  lines.push('');
  return lines.join('\n');
}

export function generateTokensDoc(tokens: FigmaToken[]): string {
  const resolved = resolveTokens(tokens);
  if (resolved.length === 0) {
    return ['# Design Tokens Reference', '', 'No design tokens defined.', ''].join('\n');
  }

  const lines: string[] = [generateVisualTokensPage(resolved).trimEnd(), ''];
  lines.push('<details>', '<summary>Lihat Tabel Referensi Lengkap CSS Variables</summary>', '');

  const byType = new Map<string, FigmaToken[]>();
  for (const t of resolved) {
    const typeKey = t.type || 'other';
    const list = byType.get(typeKey) || [];
    list.push(t);
    byType.set(typeKey, list);
  }

  for (const typeKey of [...byType.keys()].sort()) {
    const group = (byType.get(typeKey) || []).sort((a, b) => a.name.localeCompare(b.name));
    lines.push(
      `### ${typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}`,
      '',
      '| Token Name | CSS Variable | Value |',
      '| :--- | :--- | :--- |'
    );
    for (const t of group) {
      const cssVar = tokenCSSVarName(t);
      const valStr = formatTokenValue(t.value, t.type, t.name);
      lines.push(`| \`${t.name}\` | \`${cssVar}\` | \`${valStr}\` |`);
    }
    lines.push('');
  }
  lines.push('</details>', '');
  return lines.join('\n');
}
