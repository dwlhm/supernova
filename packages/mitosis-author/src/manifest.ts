import { CANVAS_MOCKUP_PROP_RE } from './blueprint.js';

export interface CompactPropertyDef {
  type: string;
  defaultValue?: any;
  variantOptions?: string[];
}

export interface CompactComponentSpec {
  name: string;
  description?: string;
  properties: Record<string, CompactPropertyDef>;
  variantCount: number;
}

function cleanFigmaDescription(raw?: string): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined;
  const withoutPropsDump = raw.split(/\r?\n\s*Properties:?\s*\r?\n/i)[0]?.trim();
  return withoutPropsDump || undefined;
}

export function compactComponentSpec(spec: any): CompactComponentSpec {
  if (!spec || typeof spec !== 'object') {
    return { name: 'Unknown', properties: {}, variantCount: 1 };
  }

  const name = spec.name || spec.componentName || spec.id || 'Component';
  const description = cleanFigmaDescription(spec.description);

  const rawProps =
    spec.properties ||
    spec.componentPropertyDefinitions ||
    spec.node?.componentPropertyDefinitions ||
    spec.document?.componentPropertyDefinitions ||
    {};

  const properties: Record<string, CompactPropertyDef> = {};
  for (const [rawKey, val] of Object.entries(rawProps)) {
    const cleanKey = rawKey.includes('#')
      ? rawKey.split('#')[0]?.trim() || rawKey
      : rawKey;
    const propKey = cleanKey || rawKey;
    const camelKey = propKey
      .replace(/^[^\p{L}\p{N}]+/gu, '')
      .trim()
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((w, i) => (i === 0 ? w.charAt(0).toLowerCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1)))
      .join('');
    if (camelKey && CANVAS_MOCKUP_PROP_RE.test(camelKey)) continue;

    if (val && typeof val === 'object') {
      const p = val as any;
      properties[propKey] = {
        type: p.type || typeof p.defaultValue || 'string',
        defaultValue: p.defaultValue,
        variantOptions: Array.isArray(p.variantOptions) ? p.variantOptions : undefined,
      };
    } else {
      properties[propKey] = {
        type: typeof val,
        defaultValue: val,
      };
    }
  }

  let variantCount = 1;
  const rootNode = spec.node || spec.document || spec;
  if (Array.isArray(rootNode?.variants) && rootNode.variants.length > 0) {
    variantCount = rootNode.variants.length;
  } else if (typeof rootNode?.variantCount === 'number' && rootNode.variantCount > 0) {
    variantCount = rootNode.variantCount;
  } else if (Array.isArray(rootNode?.children)) {
    if (
      rootNode.type === 'COMPONENT_SET' ||
      rootNode.children.some((c: any) => c.type === 'COMPONENT')
    ) {
      variantCount = rootNode.children.length;
    }
  } else if (Array.isArray(spec.variants)) {
    variantCount = spec.variants.length;
  } else if (typeof spec.variantCount === 'number') {
    variantCount = spec.variantCount;
  }

  return {
    name,
    ...(description ? { description } : {}),
    properties,
    variantCount,
  };
}

export interface CompactToken {
  name: string;
  type: string;
  value: any;
}

export function compactTokens(tokens: any): CompactToken[] {
  if (!tokens) return [];

  if (Array.isArray(tokens)) {
    return tokens.map((t: any) => ({
      name: t.name || t.id || 'token',
      type: t.type || t.$type || 'unknown',
      value: t.value ?? t.$value ?? t.val,
    }));
  }

  if (typeof tokens === 'object') {
    const list: CompactToken[] = [];
    for (const [key, val] of Object.entries(tokens)) {
      if (val && typeof val === 'object') {
        const t = val as any;
        if ('value' in t || '$value' in t || 'type' in t || '$type' in t) {
          list.push({
            name: t.name || key,
            type: t.type || t.$type || 'unknown',
            value: t.value ?? t.$value ?? t,
          });
          continue;
        }
      }
      list.push({
        name: key,
        type: typeof val,
        value: val,
      });
    }
    return list;
  }

  return [];
}

export function formatTokenClassesCatalog(tokenClasses: string[]): string {
  const backgrounds: string[] = [];
  const foregrounds: string[] = [];
  const borders: string[] = [];
  const focusRings: string[] = [];
  const radii: string[] = [];
  const shadows: string[] = [];
  const spacing: string[] = [];
  const other: string[] = [];

  for (const cls of tokenClasses) {
    const base = cls.replace(/^[a-z0-9-]+:/i, '');
    if (base.startsWith('bg-')) backgrounds.push(cls);
    else if (base.startsWith('text-')) foregrounds.push(cls);
    else if (base.startsWith('border-')) borders.push(cls);
    else if (base.startsWith('ring-') || base === 'ring') focusRings.push(cls);
    else if (base.startsWith('rounded-') || base === 'rounded') radii.push(cls);
    else if (base.startsWith('shadow-') || base === 'shadow') shadows.push(cls);
    else if (/^(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y)(?:-|$)/.test(base)) {
      spacing.push(cls);
    } else {
      other.push(cls);
    }
  }

  const lines: string[] = ['Available Token Classes:'];
  if (backgrounds.length > 0) lines.push(`- Backgrounds: ${backgrounds.join(', ')}`);
  if (foregrounds.length > 0) lines.push(`- Foregrounds/Text: ${foregrounds.join(', ')}`);
  if (borders.length > 0) lines.push(`- Borders: ${borders.join(', ')}`);
  if (focusRings.length > 0) lines.push(`- Focus Rings: ${focusRings.join(', ')}`);
  if (radii.length > 0) lines.push(`- Radii: ${radii.join(', ')}`);
  if (shadows.length > 0) lines.push(`- Shadows: ${shadows.join(', ')}`);
  if (spacing.length > 0) lines.push(`- Spacing: ${spacing.join(', ')}`);
  if (other.length > 0) lines.push(`- Other: ${other.join(', ')}`);

  lines.push(
    '\nComponents must use classes from the Available Token Classes catalog (zero arbitrary color classes or unmapped classes).'
  );
  return lines.join('\n');
}
