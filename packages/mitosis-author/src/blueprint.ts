import {
  applyVisualTailwindClasses,
  buildTokenIdIndex,
  pxToSpacingToken,
} from './blueprint-tokens.js';

export { buildTokenIdIndex };

export interface CanonicalPropDef {
  name: string;
  tsType: string;
  defaultValue?: any;
  options?: string[];
}

export interface BlueprintNodeSummary {
  name: string;
  type: string;
  tailwindClasses: string[];
  textContent?: string;
  propBind?: Record<string, string>;
  children?: BlueprintNodeSummary[];
}

export interface VariantDiffSummary {
  rootClasses?: string[];
  childOrder?: string[];
  changedNodes?: Record<string, string[]>;
}

export interface ComponentBlueprint {
  componentName: string;
  baseTailwindClasses: string[];
  canonicalProps: CanonicalPropDef[];
  composedComponents?: string[];
  variantTailwindMap: Record<string, string[]>;
  hierarchy: BlueprintNodeSummary[];
  variantHierarchies?: Record<string, BlueprintNodeSummary[]>;
  variantDiffs?: Record<string, VariantDiffSummary>;
  stateStyles?: Record<string, string[]>;
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
  if (camel === 'class') return 'className';
  if (camel === 'textContent') return 'text';
  return camel;
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
      const nonVisualOptions: string[] = Array.from(
        new Set<string>(
          def.variantOptions
            .map((o: any) => String(o).trim().toLowerCase().replace(/\s+/g, '-'))
            .filter((o: string) => Boolean(o) && !VISUAL_STATE_VALUES.has(o))
        )
      );
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

function extractPropBind(refs: any): Record<string, string> | undefined {
  if (!refs || typeof refs !== 'object') return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(refs)) {
    if (typeof v === 'string') {
      const propName = toCamelPropName(v);
      if (propName && !CANVAS_MOCKUP_PROP_RE.test(propName)) out[k] = propName;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function buildHierarchy(children: any[], tokenIndex: Map<string, string>, maxDepth = 5, depth = 0): BlueprintNodeSummary[] {
  if (!Array.isArray(children) || depth >= maxDepth) return [];
  return children.filter((c: any) => c && c.visible !== false).slice(0, 25).map((c: any) => {
    const nodeSummary: BlueprintNodeSummary = { name: c.name || 'Node', type: c.type || 'FRAME', tailwindClasses: computeNodeTailwindClasses(c, tokenIndex) };
    const rawText = typeof c.characters === 'string' ? c.characters : c.typography?.characters;
    if (typeof rawText === 'string' && rawText.trim()) nodeSummary.textContent = rawText.trim();
    const propBind = extractPropBind(c.componentPropertyReferences);
    if (propBind) nodeSummary.propBind = propBind;
    if (Array.isArray(c.children) && c.children.length > 0) nodeSummary.children = buildHierarchy(c.children, tokenIndex, maxDepth, depth + 1);
    return nodeSummary;
  });
}

function flattenHierarchyMap(nodes: BlueprintNodeSummary[], prefix = '', out: Record<string, string[]> = {}, orders: string[] = []): { map: Record<string, string[]>; orders: string[] } {
  if (nodes.length > 1) {
    orders.push(`${prefix || 'root'}: [${nodes.map((n) => n.name).join(', ')}]`);
  }
  for (const n of nodes) {
    const path = prefix ? `${prefix} > ${n.name}` : n.name;
    if (n.tailwindClasses.length > 0) out[path] = n.tailwindClasses;
    if (n.children && n.children.length > 0) flattenHierarchyMap(n.children, path, out, orders);
  }
  return { map: out, orders };
}

function normalizeStatePath(path: string): string {
  return path.replace(/\b(Step|Connector|Column|Row|Item|Tab|Cell|Dot|Slide)\s+\d+\b/gi, '$1');
}

function buildMultiVariantSynthesis(
  variants: any[],
  defaultTarget: any,
  baseTailwindClasses: string[],
  baseHierarchy: BlueprintNodeSummary[],
  tokenIndex: Map<string, string>
): { variantDiffs: Record<string, VariantDiffSummary>; stateStyles: Record<string, string[]> } {
  const baseFlat = flattenHierarchyMap(baseHierarchy);
  const variantDiffs: Record<string, VariantDiffSummary> = {};
  const stateStyles: Record<string, string[]> = {};

  for (const [rawPath, cls] of Object.entries(baseFlat.map)) {
    const path = normalizeStatePath(rawPath);
    if (/\b(completed|active|upcoming|selected|disabled|error|destructive|checked|unchecked|indeterminate|vector|indicator|connector|line)\b/i.test(path)) {
      stateStyles[path] = cls;
    }
  }

  for (const v of variants) {
    if (!v?.name || v === defaultTarget || !Array.isArray(v.children)) continue;
    if (/\b(?:state|interaction)\s*=\s*(?:hover|hovered|focus|focused|pressed|active)\b/i.test(v.name)) continue;
    const vRoot = computeNodeTailwindClasses(v, tokenIndex);
    const rootChanged = vRoot.length > 0 && vRoot.join(' ') !== baseTailwindClasses.join(' ');
    const h = buildHierarchy(v.children, tokenIndex, 4);
    const flat = flattenHierarchyMap(h);
    const changedNodes: Record<string, string[]> = {};
    for (const [rawPath, cls] of Object.entries(flat.map)) {
      const path = normalizeStatePath(rawPath);
      const prev = baseFlat.map[rawPath] || stateStyles[path];
      if (!prev || prev.join(' ') !== cls.join(' ')) {
        changedNodes[path] = cls;
      }
      if (/\b(completed|active|upcoming|selected|disabled|error|destructive|checked|unchecked|indeterminate|vector|indicator|connector|line)\b/i.test(path)) {
        const key = stateStyles[path] && stateStyles[path]!.join(' ') !== cls.join(' ') ? `${path} (${v.name})` : path;
        if (!Object.values(stateStyles).some((existing) => existing.join(' ') === cls.join(' ')) || !stateStyles[path]) {
          stateStyles[key] = cls;
        }
      }
    }
    const orderDiffs = flat.orders.filter((o) => !baseFlat.orders.includes(o));
    if (rootChanged || Object.keys(changedNodes).length > 0 || orderDiffs.length > 0) {
      variantDiffs[v.name] = {
        ...(rootChanged ? { rootClasses: vRoot } : {}),
        ...(orderDiffs.length > 0 ? { childOrder: orderDiffs } : {}),
        ...(Object.keys(changedNodes).length > 0 ? { changedNodes } : {}),
      };
    }
  }
  return { variantDiffs, stateStyles };
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

  const baseTailwindClasses = computeNodeTailwindClasses(defaultTarget, tokenIndex);
  const variantTailwindMap: Record<string, string[]> = {};
  const variantHierarchies: Record<string, BlueprintNodeSummary[]> = {};
  for (const v of variants) {
    if (!v?.name) continue;
    if (/\b(?:state|interaction)\s*=\s*(?:hover|hovered|focus|focused|pressed|active)\b/i.test(v.name)) continue;
    variantTailwindMap[v.name] = computeNodeTailwindClasses(v, tokenIndex);
    if (v !== defaultTarget && Array.isArray(v.children) && v.children.length > 0 && Object.keys(variantHierarchies).length < 24) {
      variantHierarchies[v.name] = buildHierarchy(v.children, tokenIndex, 4);
    }
  }
  const composedComponents = collectComposedInstances(rootNode);
  const hierarchy = buildHierarchy(defaultTarget?.children || [], tokenIndex);
  const { variantDiffs, stateStyles } = buildMultiVariantSynthesis(variants, defaultTarget, baseTailwindClasses, hierarchy, tokenIndex);

  return {
    componentName,
    baseTailwindClasses,
    canonicalProps: extractCanonicalProps(rawProps),
    ...(composedComponents.length > 0 ? { composedComponents } : {}),
    variantTailwindMap,
    hierarchy,
    ...(Object.keys(variantHierarchies).length > 0 ? { variantHierarchies } : {}),
    ...(Object.keys(variantDiffs).length > 0 ? { variantDiffs } : {}),
    ...(Object.keys(stateStyles).length > 0 ? { stateStyles } : {}),
  };
}
