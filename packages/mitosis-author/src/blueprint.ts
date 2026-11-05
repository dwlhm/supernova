export interface CanonicalPropDef { name: string; tsType: string; defaultValue?: any; options?: string[]; }
export interface BlueprintNodeSummary { name: string; type: string; tailwindClasses: string[]; textContent?: string; children?: BlueprintNodeSummary[]; }
export interface ComponentBlueprint {
  componentName: string;
  baseTailwindClasses: string[];
  canonicalProps: CanonicalPropDef[];
  composedComponents?: string[];
  variantTailwindMap: Record<string, string[]>;
  hierarchy: BlueprintNodeSummary[];
  variantHierarchies?: Record<string, BlueprintNodeSummary[]>;
}

const SPACING_SCALE: Array<[number, string]> = [
  [0, '0'], [2, '0.5'], [4, '1'], [6, '1.5'], [8, '2'], [10, '2.5'],
  [12, '3'], [14, '3.5'], [16, '4'], [20, '5'], [24, '6'], [28, '7'],
  [32, '8'], [36, '9'], [40, '10'], [48, '12'], [56, '14'], [64, '16'],
];

function pxToSpacingToken(px: number): string {
  let best = '0', minDiff = Infinity;
  for (const [val, token] of SPACING_SCALE) {
    const diff = Math.abs(px - val);
    if (diff < minDiff) { minDiff = diff; best = token; }
  }
  return best;
}

function radiusToTailwind(r: number): string | null {
  if (!r || r <= 0) return null;
  if (r <= 2) return 'rounded-sm';
  if (r <= 4) return 'rounded';
  if (r <= 6) return 'rounded-md';
  if (r <= 8) return 'rounded-lg';
  if (r <= 12) return 'rounded-xl';
  if (r <= 16) return 'rounded-2xl';
  return r >= 999 ? 'rounded-full' : 'rounded-lg';
}

function toCanonicalTokenSlug(rawName: string): string {
  return rawName.replace(/^[^\w]+/, '')
    .replace(/^(?:semantic|primitive|primitives)\/(?:colors?|radius|radii|spacing|typography|shadows?|effects?)\//i, '')
    .replace(/^rounded-/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function buildTokenIdIndex(rawTokens?: any): Map<string, string> {
  const map = new Map<string, string>();
  if (!rawTokens) return map;
  const list = Array.isArray(rawTokens)
    ? rawTokens
    : typeof rawTokens === 'object'
      ? Object.entries(rawTokens).map(([k, v]: [string, any]) => ({ id: v?.id || k, name: v?.name || k, value: v?.value }))
      : [];
  const semByValue = new Map<string, string[]>();
  for (const item of list) {
    const rawName = String(item?.name || '');
    const val = item?.value !== undefined ? String(item.value).trim() : '';
    if (/^(?:🌱\s*)?semantic\/colors?\//i.test(rawName) && val) {
      const slug = toCanonicalTokenSlug(rawName);
      if (!/^(primary-on-primary|destructive-on-destructive|foreground-static-|foreground-base|background-accent|border-on-accent|utility-spacer)$/.test(slug)) {
        const arr = semByValue.get(val) || [];
        arr.push(slug);
        semByValue.set(val, arr);
      }
    }
  }
  for (const item of list) {
    const id = String(item?.id || '');
    const rawName = String(item?.name || item?.id || '');
    const val = item?.value !== undefined ? String(item.value).trim() : '';
    let slug = toCanonicalTokenSlug(rawName);
    const candidates = val && /^(?:🧩\s*components|🌍\s*primitive)/i.test(rawName) ? semByValue.get(val) : undefined;
    if (candidates && candidates.length > 0) {
      const lower = rawName.toLowerCase();
      slug = candidates.find((c) => lower.includes(c.split('-')[0]!)) || candidates[0]!;
    }
    if (id && slug) {
      map.set(id, slug);
      map.set(id.startsWith('VariableID:') ? id.slice('VariableID:'.length) : `VariableID:${id}`, slug);
    }
    if (rawName && slug) map.set(rawName, slug);
  }
  return map;
}

function resolveBoundVariableSlug(bvEntry: any, fallbackEntry: any, tokenIndex?: Map<string, string>): string | undefined {
  if (!tokenIndex) return undefined;
  const firstId = (Array.isArray(bvEntry) ? bvEntry[0]?.id : bvEntry?.id) || fallbackEntry?.id;
  return firstId ? tokenIndex.get(firstId) : undefined;
}

function applyVisualTailwindClasses(node: any, l: any, classes: string[], tokenIndex?: Map<string, string>): void {
  const rad = radiusToTailwind(typeof l.cornerRadius === 'number' ? l.cornerRadius : typeof node.cornerRadius === 'number' ? node.cornerRadius : 0);
  if (rad) classes.push(rad);
  const hasStroke = (node.strokeWeight && node.strokeWeight > 0) ||
    (Array.isArray(node.strokes) && node.strokes.some((s: any) => s?.visible !== false && (s?.weight ?? 1) > 0));
  if (hasStroke && node.type !== 'VECTOR') classes.push('border');

  const fillSlug = resolveBoundVariableSlug(node.boundVariables?.fills, node.fills?.[0]?.boundVariables?.color, tokenIndex);
  if (fillSlug) classes.push(node.type === 'TEXT' ? `text-${fillSlug}` : `bg-${fillSlug}`);

  const strokeSlug = resolveBoundVariableSlug(node.boundVariables?.strokes, node.strokes?.[0]?.boundVariables?.color, tokenIndex);
  if (strokeSlug) classes.push(node.type === 'VECTOR' ? `stroke-${strokeSlug}` : `border-${strokeSlug}`);

  if (Array.isArray(node.effects)) {
    const shadow = node.effects.find((e: any) => e && e.visible !== false && e.type === 'DROP_SHADOW');
    if (shadow) classes.push((shadow.radius ?? 0) >= 15 ? 'shadow-lg' : (shadow.radius ?? 0) >= 6 ? 'shadow-md' : 'shadow-sm');
  }
}

export function computeNodeTailwindClasses(node: any, tokenIndex?: Map<string, string>): string[] {
  if (!node || typeof node !== 'object') return [];
  const classes: string[] = [];
  const l = node.layout || node;

  if (l.layoutMode === 'HORIZONTAL') classes.push('flex', 'flex-row');
  else if (l.layoutMode === 'VERTICAL') classes.push('flex', 'flex-col');

  const mainMap: Record<string, string> = {
    MIN: 'justify-start', CENTER: 'justify-center', MAX: 'justify-end', SPACE_BETWEEN: 'justify-between',
  };
  if (l.primaryAxisAlignItems && mainMap[l.primaryAxisAlignItems]) classes.push(mainMap[l.primaryAxisAlignItems]!);

  const crossMap: Record<string, string> = {
    MIN: 'items-start', CENTER: 'items-center', MAX: 'items-end', BASELINE: 'items-baseline',
  };
  if (l.counterAxisAlignItems && crossMap[l.counterAxisAlignItems]) classes.push(crossMap[l.counterAxisAlignItems]!);

  if (typeof l.itemSpacing === 'number' && l.itemSpacing > 0 && l.itemSpacing < 200) {
    classes.push(`gap-${pxToSpacingToken(l.itemSpacing)}`);
  }

  const pl = l.paddingLeft ?? 0, pr = l.paddingRight ?? 0, pt = l.paddingTop ?? 0, pb = l.paddingBottom ?? 0;
  if (pl > 0 || pr > 0) classes.push(pl === pr ? `px-${pxToSpacingToken(pl)}` : `pl-${pxToSpacingToken(pl)} pr-${pxToSpacingToken(pr)}`);
  if (pt > 0 || pb > 0) classes.push(pt === pb ? `py-${pxToSpacingToken(pt)}` : `pt-${pxToSpacingToken(pt)} pb-${pxToSpacingToken(pb)}`);

  if (l.layoutSizingHorizontal === 'FILL') classes.push('w-full');
  else if (l.layoutSizingHorizontal === 'HUG') classes.push('w-fit');
  if (l.layoutSizingVertical === 'HUG') classes.push('h-fit');

  applyVisualTailwindClasses(node, l, classes, tokenIndex);
  return Array.from(new Set(classes));
}

function toCamelPropName(rawKey: string): string {
  const withoutHash = rawKey.includes('#') ? rawKey.split('#')[0]! : rawKey;
  const words = withoutHash.replace(/^[^\p{L}\p{N}]+/gu, '').trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return '';
  const camel = words.map((w, i) => (i === 0 ? w.charAt(0).toLowerCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1))).join('');
  return camel === 'class' ? 'className' : camel;
}

const VISUAL_STATE_NAMES = new Set(['state', 'interaction', 'hover', 'focused', 'pressed']);
const VISUAL_STATE_VALUES = new Set(['hover', 'hovered', 'focus', 'focused', 'pressed', 'active']);
export const CANVAS_MOCKUP_PROP_RE =
  /^(?:show(?:Column|Row|Toggle|Step|File|Item)\d+|(?:column|row|step|file|item)\d+(?:Label|Name|Status|Text|Value)?|content\d+|show(?:Affiliate|Komlabs|RajaOngkir|Komads|Komcards|Komchat|Komclass|Kompack|Komplace|Komship|Komtim|Komed|Komstore|Komerce))$/i;

export function extractCanonicalProps(rawProps: Record<string, any>): CanonicalPropDef[] {
  const result: CanonicalPropDef[] = [];
  const seen = new Set<string>();

  for (const [rawKey, def] of Object.entries(rawProps || {})) {
    const propType = String(def?.type || typeof def?.defaultValue || 'string').toUpperCase();
    if (propType === 'SLOT') {
      if (!seen.has('children')) { seen.add('children'); result.push({ name: 'children', tsType: 'any' }); }
      continue;
    }
    const name = toCamelPropName(rawKey);
    if (!name || seen.has(name) || CANVAS_MOCKUP_PROP_RE.test(name)) continue;

    if (propType === 'VARIANT' && Array.isArray(def?.variantOptions)) {
      const nonVisualOptions = def.variantOptions.map((o: any) => String(o).trim()).filter((o: string) => !VISUAL_STATE_VALUES.has(o.toLowerCase()));
      if (VISUAL_STATE_NAMES.has(name.toLowerCase()) && nonVisualOptions.length <= 1) continue;
      if (nonVisualOptions.length > 10 && nonVisualOptions.some((o: string) => o.toLowerCase() === 'slot')) {
        if (!seen.has('children')) { seen.add('children'); result.push({ name: 'children', tsType: 'any' }); }
        continue;
      }
      if (nonVisualOptions.length === 2 && nonVisualOptions.every((o: string) => ['true', 'false', 'yes', 'no', 'on', 'off'].includes(o.toLowerCase()))) {
        seen.add(name); result.push({ name, tsType: 'boolean', defaultValue: false });
      } else if (nonVisualOptions.length > 0) {
        seen.add(name);
        result.push({ name, tsType: nonVisualOptions.map((o: string) => `'${o}'`).join(' | '), defaultValue: nonVisualOptions[0], options: nonVisualOptions });
      }
    } else if (propType === 'BOOLEAN') {
      seen.add(name); result.push({ name, tsType: 'boolean', defaultValue: Boolean(def?.defaultValue) });
    } else if (propType === 'TEXT') {
      seen.add(name); result.push({ name, tsType: 'string', defaultValue: typeof def?.defaultValue === 'string' ? def.defaultValue : '' });
    }
  }
  return result;
}

function buildHierarchy(children: any[], tokenIndex: Map<string, string>, maxDepth = 5, depth = 0): BlueprintNodeSummary[] {
  if (!Array.isArray(children) || depth >= maxDepth) return [];
  return children.filter((c: any) => c && c.visible !== false).slice(0, 25).map((c: any) => {
    const nodeSummary: BlueprintNodeSummary = { name: c.name || 'Node', type: c.type || 'FRAME', tailwindClasses: computeNodeTailwindClasses(c, tokenIndex) };
    const rawText = typeof c.characters === 'string' ? c.characters : c.typography?.characters;
    if (typeof rawText === 'string' && rawText.trim()) nodeSummary.textContent = rawText.trim();
    if (Array.isArray(c.children) && c.children.length > 0) nodeSummary.children = buildHierarchy(c.children, tokenIndex, maxDepth, depth + 1);
    return nodeSummary;
  });
}

function collectComposedInstances(node: any, out = new Set<string>()): string[] {
  if (!node || typeof node !== 'object') return [...out];
  if (node.type === 'INSTANCE' && typeof node.name === 'string' && !/^(?:column|row|lucide|hugeicons|phosphor|tabler)\b/i.test(node.name)) {
    out.add(node.name.trim());
  }
  for (const ch of node.children || node.variants || []) collectComposedInstances(ch?.node || ch, out);
  return [...out];
}

export function extractVariantNodes(spec: any, rootNode: any): any[] {
  const rawVariants = Array.isArray(rootNode?.variants) && rootNode.variants.length > 0 ? rootNode.variants : Array.isArray(spec?.variants) && spec.variants.length > 0 ? spec.variants : null;
  if (rawVariants) return rawVariants.map((v: any) => (v?.node ? { ...v.node, name: v.name || v.node.name, properties: v.properties } : v));
  const isSet = rootNode?.type === 'COMPONENT_SET' || (Array.isArray(rootNode?.children) && rootNode.children.some((c: any) => c?.type === 'COMPONENT'));
  return isSet && Array.isArray(rootNode?.children) ? rootNode.children : [];
}

export function buildComponentBlueprint(componentName: string, spec: any, rawTokens?: any): ComponentBlueprint {
  const tokenIndex = buildTokenIdIndex(rawTokens);
  const rootNode = spec?.node || spec?.document || spec || {};
  const rawProps = spec?.properties || spec?.componentPropertyDefinitions || rootNode?.componentPropertyDefinitions || {};
  const variants = extractVariantNodes(spec, rootNode);
  const defaultTarget = variants.length > 0 ? variants[0] : rootNode;

  const variantTailwindMap: Record<string, string[]> = {};
  const variantHierarchies: Record<string, BlueprintNodeSummary[]> = {};
  for (const v of variants.slice(0, 12)) {
    if (!v?.name) continue;
    variantTailwindMap[v.name] = computeNodeTailwindClasses(v, tokenIndex);
    if (v !== defaultTarget && Array.isArray(v.children) && v.children.length > 0) {
      variantHierarchies[v.name] = buildHierarchy(v.children, tokenIndex, 4);
    }
  }
  const composedComponents = collectComposedInstances(rootNode);

  return {
    componentName,
    baseTailwindClasses: computeNodeTailwindClasses(defaultTarget, tokenIndex),
    canonicalProps: extractCanonicalProps(rawProps),
    ...(composedComponents.length > 0 ? { composedComponents } : {}),
    variantTailwindMap,
    hierarchy: buildHierarchy(defaultTarget?.children || [], tokenIndex),
    ...(Object.keys(variantHierarchies).length > 0 ? { variantHierarchies } : {}),
  };
}
