const SPACING_SCALE: Array<[number, string]> = [
  [0, '0'], [2, '0.5'], [4, '1'], [6, '1.5'], [8, '2'], [10, '2.5'],
  [12, '3'], [14, '3.5'], [16, '4'], [20, '5'], [24, '6'], [28, '7'],
  [32, '8'], [36, '9'], [40, '10'], [44, '11'], [48, '12'], [56, '14'], [64, '16'],
];

const EXACT_DIMENSION_SCALE = new Map<number, string>([
  [1, 'px'], [2, '0.5'], [4, '1'], [6, '1.5'], [8, '2'], [10, '2.5'],
  [12, '3'], [14, '3.5'], [16, '4'], [20, '5'], [24, '6'], [28, '7'],
  [32, '8'], [36, '9'], [40, '10'], [44, '11'], [48, '12'], [56, '14'], [64, '16'],
]);

const SEMANTIC_SYNONYM_MAP: Record<string, string> = {
  'primary-on-primary': 'primary-foreground',
  'destructive-on-destructive': 'destructive-foreground',
  'foreground-static-white': 'foreground-on-accent',
  'foreground-static-black': 'foreground-default',
  'foreground-base': 'foreground-default',
  'background-accent': 'primary-default',
  'border-on-accent': 'primary-border-emphasis',
  'utility-spacer': 'border-default',
  'brand-monochrome-default': 'brand-monochrome',
};

export function pxToSpacingToken(px: number): string {
  let best = '0', minDiff = Infinity;
  for (const [val, token] of SPACING_SCALE) {
    const diff = Math.abs(px - val);
    if (diff < minDiff) { minDiff = diff; best = token; }
  }
  return best;
}

export function radiusToTailwind(r: number): string | null {
  if (!r || r <= 0) return null;
  if (r <= 2) return 'rounded-sm';
  if (r <= 4) return 'rounded';
  if (r <= 6) return 'rounded-md';
  if (r <= 8) return 'rounded-lg';
  if (r <= 12) return 'rounded-xl';
  if (r <= 16) return 'rounded-2xl';
  return r >= 999 ? 'rounded-full' : 'rounded-lg';
}

export function toCanonicalTokenSlug(rawName: string): string {
  const rawSlug = rawName.replace(/^[^\w]+/, '')
    .replace(/^(?:(?:semantic|primitive|primitives)\/)?(?:colors?|radius|radii|spacing|typography|shadows?|effects?)\//i, '')
    .replace(/^rounded-/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return SEMANTIC_SYNONYM_MAP[rawSlug] || rawSlug;
}

function extractMappedSemanticSlug(item: any): string | undefined {
  if (typeof item?.aliasTo === 'string' && /^(?:🌱\s*)?semantic\//i.test(item.aliasTo)) {
    return toCanonicalTokenSlug(item.aliasTo);
  }
  const desc = String(item?.description || '');
  const match = /Mapping:\s*[^→]+→\s*🌱\s*Semantic\s*`([^`]+)`/i.exec(desc);
  if (match?.[1] && /^(?:colors?|radius|radii)\//i.test(match[1])) {
    return toCanonicalTokenSlug(match[1]);
  }
  return undefined;
}

function pickBestSemanticCandidate(candidates: string[], rawName: string): string {
  const lower = rawName.toLowerCase();
  if (/\/(border|divider|connector|stroke|outline)\b/.test(lower)) {
    const match = candidates.find((c) => c.startsWith('border-'));
    if (match) return match;
  }
  if (/\/(text|label|title|body|metadata|content|placeholder|caption|heading)\b/.test(lower)) {
    const match = candidates.find((c) => c.startsWith('foreground-') || c.endsWith('-foreground') || c.endsWith('-on-accent'));
    if (match) return match;
  }
  if (/\/(background|container|surface|track|thumb|indicator|caret)\b/.test(lower)) {
    const match = candidates.find((c) => c.startsWith('background-') || c.startsWith('primary-') || c.startsWith('success-') || c.startsWith('destructive-'));
    if (match) return match;
  }
  return candidates.find((c) => lower.includes(c.split('-')[0]!)) || candidates[0]!;
}

export function buildTokenIdIndex(rawTokens?: any): Map<string, string> {
  const map = new Map<string, string>();
  if (!rawTokens) return map;
  const list = Array.isArray(rawTokens)
    ? rawTokens
    : typeof rawTokens === 'object'
      ? Object.entries(rawTokens).map(([k, v]: [string, any]) => ({ ...v, id: v?.id || k, name: v?.name || k, value: v?.value }))
      : [];
  const semByValue = new Map<string, string[]>();
  for (const item of list) {
    const rawName = String(item?.name || '');
    const val = item?.value !== undefined ? String(item.value).trim() : '';
    if (/^(?:🌱\s*)?semantic\/colors?\//i.test(rawName) && val) {
      const slug = toCanonicalTokenSlug(rawName);
      const arr = semByValue.get(val) || [];
      if (!arr.includes(slug)) arr.push(slug);
      semByValue.set(val, arr);
    }
  }
  for (const item of list) {
    const id = String(item?.id || '');
    const rawName = String(item?.name || item?.id || '');
    const val = item?.value !== undefined ? String(item.value).trim() : '';
    let slug = extractMappedSemanticSlug(item) || toCanonicalTokenSlug(rawName);
    if (!extractMappedSemanticSlug(item) && val && /^(?:🧩\s*components|🌍\s*primitive)/i.test(rawName)) {
      const candidates = semByValue.get(val);
      if (candidates && candidates.length > 0) {
        slug = pickBestSemanticCandidate(candidates, rawName);
      }
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

function applyDimensionTailwindClasses(node: any, l: any, classes: string[]): void {
  const w = typeof l.width === 'number' ? Math.round(l.width) : 0;
  const h = typeof l.height === 'number' ? Math.round(l.height) : 0;
  const r = typeof l.cornerRadius === 'number' ? l.cornerRadius : typeof node.cornerRadius === 'number' ? node.cornerRadius : 0;

  if (node.type === 'VECTOR' && w === 10 && h === 5 && r >= 6) {
    classes.push('w-1.5', 'h-1.5', 'rounded-full');
    return;
  }

  const isSmallFixedOrAtomic =
    node.type === 'VECTOR' ||
    node.type === 'INSTANCE' ||
    node.type === 'ELLIPSE' ||
    (node.type === 'FRAME' && (!node.children || node.children.length <= 1) && w <= 64 && h <= 64);

  if (!isSmallFixedOrAtomic) return;
  const wTok = EXACT_DIMENSION_SCALE.get(w);
  const hTok = EXACT_DIMENSION_SCALE.get(h);
  if (wTok && w <= 64) classes.push(`w-${wTok}`);
  if (hTok && h <= 64) classes.push(`h-${hTok}`);
}

function applyTypographyTailwindClasses(node: any, classes: string[]): void {
  if (node.type !== 'TEXT' || !node.typography) return;
  const t = node.typography;
  if (typeof t.fontSize === 'number') {
    if (t.fontSize <= 12) classes.push('text-xs');
    else if (t.fontSize <= 14) classes.push('text-sm');
    else if (t.fontSize <= 16) classes.push('text-base');
    else if (t.fontSize <= 18) classes.push('text-lg');
    else if (t.fontSize <= 20) classes.push('text-xl');
    else classes.push('text-2xl');
  }
  const weight = String(t.fontWeight || t.fontStyle || '').toLowerCase();
  if (weight.includes('700') || weight.includes('bold')) classes.push('font-bold');
  else if (weight.includes('600') || weight.includes('semibold')) classes.push('font-semibold');
  else if (weight.includes('500') || weight.includes('medium')) classes.push('font-medium');
  else if (weight.includes('400') || weight.includes('regular')) classes.push('font-normal');

  if (t.textAlignHorizontal === 'CENTER') classes.push('text-center');
  else if (t.textAlignHorizontal === 'RIGHT') classes.push('text-right');
}

export function applyVisualTailwindClasses(node: any, l: any, classes: string[], tokenIndex?: Map<string, string>): void {
  applyDimensionTailwindClasses(node, l, classes);
  applyTypographyTailwindClasses(node, classes);

  const rad = radiusToTailwind(typeof l.cornerRadius === 'number' ? l.cornerRadius : typeof node.cornerRadius === 'number' ? node.cornerRadius : 0);
  if (rad && !classes.includes('rounded-full')) classes.push(rad);
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
