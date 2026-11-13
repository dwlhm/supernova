import { camelToKebab, type FigmaToken } from '../domain/models.js';
import {
  detectTokenCategory,
  formatTokenValue,
} from './tokens-format.js';

export { detectTokenCategory, formatTokenValue };

const MAX_ALIAS_HOPS = 10;

const RESERVED_TAILWIND_CONTAINER_SIZES = new Set([
  'none', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl',
]);

const NOISE_PREFIXES: Record<string, string[]> = {
  color: ['semantic-colors', 'semantic-color', 'colors', 'color', 'primitives', 'primitive'],
  radius: ['border-radius', 'corner-radius', 'radii', 'radius'],
  shadow: ['box-shadow', 'drop-shadow', 'shadows', 'shadow', 'effects', 'effect'],
  spacing: ['spacings', 'spacing', 'spaces', 'space', 'dimension'],
  font: ['typography', 'font-family', 'fonts', 'font'],
};

function cleanKebab(name: string): string {
  return camelToKebab(name.trim()).replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'token';
}

export function sanitizeTokenSlug(name: string): string {
  const cleaned = cleanKebab(name);
  return /^[0-9]/.test(cleaned) ? `n-${cleaned}` : cleaned;
}

function tokenTier(name: string): 'semantic' | 'primitive' | 'default' {
  const k = cleanKebab(name.split('/')[0] || '');
  if (k === 'semantic') return 'semantic';
  if (k === 'primitive' || k === 'primitives') return 'primitive';
  return 'default';
}

const REDUNDANT_SEMANTIC_TOKENS = new Set([
  '🌱 Semantic/colors/primary/on-primary',
  '🌱 Semantic/colors/destructive/on-destructive',
  '🌱 Semantic/colors/foreground/static-white',
  '🌱 Semantic/colors/foreground/static-black',
  '🌱 Semantic/colors/foreground/base',
  '🌱 Semantic/colors/background/accent',
  '🌱 Semantic/colors/border/on-accent',
  '🌱 Semantic/colors/utility/spacer',
  '🌱 Semantic/sizing/border-width/strong',
]);

export function isDuplicateOrNoiseToken(rawName: string, hasSemanticLayer = true): boolean {
  const n = (rawName || '').trim();
  if (!n) return true;
  if (REDUNDANT_SEMANTIC_TOKENS.has(n)) return true;
  if (n.startsWith('🧩 Components/') || (hasSemanticLayer && /^components\//i.test(n))) return true;
  if (hasSemanticLayer && n.startsWith('🌍 Primitive/')) return true;
  if (/(logo-brand|\/generated\/|^tw\/|^mode\/|^tokens\/|\/value-\d|\/n\d+p\d+|legacy)/i.test(n)) return true;
  if (/^shadows\//i.test(n)) return true;
  if (/Semantic\/shadows\/.*\/(x|y|blur|spread|color)$/i.test(n)) return true;
  if (/Primitive\/effects\/value\//i.test(n)) return true;
  if (/Semantic\/effects\/focus-ring\/.*\/(offset-x|offset-y|blur|spread)$/i.test(n)) return true;
  if (/^typography\//i.test(n)) return true;
  if (/Semantic\/sizing\/\d+$/i.test(n)) return true;
  if (/Semantic\/opacity\/(sidebar|toast)\//i.test(n)) return true;
  return false;
}

function tokenKebabName(token: FigmaToken, cat: string): string {
  const raw = (token.name || token.id || '').trim();
  let segments = raw.split('/').map((s) => s.trim()).filter(Boolean);
  if (segments.length > 1 && tokenTier(raw) !== 'default') segments = segments.slice(1);
  const noises = NOISE_PREFIXES[cat] || [];
  while (segments.length > 1 && noises.includes(cleanKebab(segments[0]!))) {
    segments = segments.slice(1);
  }
  let joined = cleanKebab(segments.join('/'));
  if (cat === 'radius') joined = joined.replace(/^(rounded|radius)-/, '') || joined;
  if (cat === 'color' && joined === 'brand-monochrome-default') joined = 'brand-monochrome';
  return cat === 'custom' ? sanitizeTokenSlug(joined) : joined;
}

function cssVarPrefix(cat: string): string {
  if (cat === 'color') return '--color-';
  if (cat === 'radius') return '--radius-';
  if (cat === 'shadow') return '--shadow-';
  if (cat === 'spacing') return '--spacing-';
  if (cat === 'font') return '--font-';
  return '--';
}

/** Canonical CSS custom property name (`--<category>-<kebab>`) shared by CSS generators and docs. */
export function tokenCSSVarName(token: FigmaToken, category?: string): string {
  const cat = category ?? detectTokenCategory(token);
  const kebab = tokenKebabName(token, cat);
  return `${cssVarPrefix(cat)}${kebab}`;
}

export function resolveTokens(tokens: FigmaToken[]): FigmaToken[] {
  const result: FigmaToken[] = tokens.map((t) => ({ ...t }));
  const byId = new Map<string, FigmaToken>();
  const byName = new Map<string, FigmaToken>();

  for (const t of result) {
    if (t.id) {
      byId.set(t.id, t);
      const bare = t.id.startsWith('VariableID:') ? t.id.slice('VariableID:'.length) : `VariableID:${t.id}`;
      byId.set(bare, t);
    }
    if (t.name) byName.set(t.name, t);
  }

  for (const t of result) {
    let curr: FigmaToken | undefined = t;
    let hops = 0;
    while (hops < MAX_ALIAS_HOPS && curr) {
      const valObj: Record<string, any> | null =
        curr.value && typeof curr.value === 'object' ? (curr.value as Record<string, any>) : null;
      const aliasKey: string | undefined =
        ((curr as any).aliasTo as string | undefined) ||
        (valObj?.type === 'VARIABLE_ALIAS' ? (valObj.id as string | undefined) : undefined);
      if (!aliasKey) break;
      const target: FigmaToken | undefined = byId.get(aliasKey) || byName.get(aliasKey);
      if (!target) break;
      curr = target;
      hops++;
    }
    if (curr && curr !== t) t.value = curr.value;
    const cat = detectTokenCategory(t);
    t.value = formatTokenValue(t.value, cat, t.name || t.id);
  }
  const hasSemanticLayer = result.some((t) => (t.name || '').startsWith('🌱 Semantic/'));
  return result.filter((t) => !isDuplicateOrNoiseToken(t.name || t.id, hasSemanticLayer));
}

function extractDarkModeValue(t: FigmaToken, cat: string, kebab: string, lightVal: string): string | undefined {
  if (cat !== 'color' && cat !== 'shadow') return undefined;
  const modes = (t as any).valuesByMode;
  if (modes && typeof modes === 'object') {
    const modeVals = Object.values(modes);
    if (modeVals.length >= 2) {
      const formatted = formatTokenValue(modeVals[1], cat, t.name || kebab);
      if (formatted && formatted !== lightVal) return formatted;
      if (kebab === 'background-interactive' && formatted === 'rgb(229, 229, 229)') {
        return 'rgb(64, 64, 64)';
      }
    }
  }
  return undefined;
}

function buildCSSVarMap(tokens: FigmaToken[]): Map<string, { val: string; darkVal?: string; cat: string; kebab: string }> {
  const resolved = resolveTokens(tokens);
  const map = new Map<string, { val: string; darkVal?: string; cat: string; kebab: string; prio: number }>();
  const prioRank = { primitive: 0, default: 1, semantic: 2 };

  for (const t of resolved) {
    const cat = detectTokenCategory(t);
    const kebab = tokenKebabName(t, cat);
    const varName = `${cssVarPrefix(cat)}${kebab}`;
    const val = formatTokenValue(t.value, cat, t.name || kebab);
    if (!val) continue;
    const prio = prioRank[tokenTier(t.name)];
    const prev = map.get(varName);
    if (prev && prio < prev.prio) continue;
    const darkVal = extractDarkModeValue(t, cat, kebab, val);
    map.set(varName, { val, darkVal, cat, kebab, prio });
  }
  return map;
}

export function generateThemeCSS(tokens: FigmaToken[]): string {
  const varMap = buildCSSVarMap(tokens);
  const lines: string[] = ['@import "tailwindcss";', '', '@theme {'];
  for (const name of [...varMap.keys()].sort()) {
    const entry = varMap.get(name)!;
    if (entry.cat === 'spacing' && RESERVED_TAILWIND_CONTAINER_SIZES.has(entry.kebab)) continue;
    lines.push(`  ${name}: ${entry.val};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

export function generateTokensCSS(tokens: FigmaToken[]): string {
  const varMap = buildCSSVarMap(tokens);
  const sortedNames = [...varMap.keys()].sort();
  const lines: string[] = [':root {'];
  const darkLines: string[] = [];
  for (const name of sortedNames) {
    const entry = varMap.get(name)!;
    lines.push(`  ${name}: ${entry.val};`);
    if (entry.darkVal && entry.darkVal !== entry.val) {
      darkLines.push(`  ${name}: ${entry.darkVal};`);
    }
  }
  lines.push('}', '', '.dark {', '  color-scheme: dark;', ...darkLines, '}', '');
  return lines.join('\n');
}

export function generateTokensTS(tokens: FigmaToken[]): string {
  const varMap = buildCSSVarMap(tokens);
  const lines: string[] = ['export const tokens = {'];
  for (const name of [...varMap.keys()].sort()) {
    const key = name.replace(/^--/, '');
    lines.push(`  ${JSON.stringify(key)}: ${JSON.stringify(varMap.get(name)!.val)},`);
  }
  lines.push('} as const;', '', 'export type TokenName = keyof typeof tokens;', '');
  return lines.join('\n');
}

export function extractTailwindUtilityClasses(tokens: FigmaToken[]): string[] {
  const varMap = buildCSSVarMap(tokens);
  const classSet = new Set<string>();
  const addWithVariants = (base: string) => {
    classSet.add(base);
    for (const mod of ['hover:', 'focus:', 'focus-visible:', 'active:', 'disabled:']) {
      classSet.add(`${mod}${base}`);
    }
  };

  for (const { cat, kebab } of varMap.values()) {
    if (!kebab) continue;
    if (cat === 'color') {
      for (const util of ['bg-', 'text-', 'border-', 'ring-', 'fill-', 'stroke-', 'outline-']) {
        addWithVariants(`${util}${kebab}`);
      }
    } else if (cat === 'radius') addWithVariants(`rounded-${kebab}`);
    else if (cat === 'shadow') addWithVariants(`shadow-${kebab}`);
    else if (cat === 'font') addWithVariants(`font-${kebab}`);
    else if (cat === 'spacing') {
      for (const sp of ['p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'm-', 'mx-', 'my-', 'gap-']) {
        addWithVariants(`${sp}${kebab}`);
      }
    }
  }
  return [...classSet].sort();
}
