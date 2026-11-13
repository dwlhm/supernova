const FONT_WEIGHT_MAP: Record<string, string> = {
  thin: '100',
  hairline: '100',
  extralight: '200',
  ultralight: '200',
  light: '300',
  regular: '400',
  normal: '400',
  medium: '500',
  semibold: '600',
  demibold: '600',
  bold: '700',
  extrabold: '800',
  ultrabold: '800',
  black: '900',
  heavy: '900',
};

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v <= 1 ? v * 255 : v)));
}

function formatColorObject(v: Record<string, any>): string | null {
  if (typeof v.r !== 'number' || typeof v.g !== 'number' || typeof v.b !== 'number') return null;
  const r = clampByte(v.r);
  const g = clampByte(v.g);
  const b = clampByte(v.b);
  const a = typeof v.a === 'number' ? v.a : 1;
  if (a < 0.999) return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function formatSingleShadow(s: Record<string, any>): string | null {
  if (!s || typeof s !== 'object' || s.visible === false) return null;
  const isShadow = s.type === 'DROP_SHADOW' || s.type === 'INNER_SHADOW' || ('offset' in s && 'radius' in s);
  if (!isShadow) return null;

  const inset = s.type === 'INNER_SHADOW' ? 'inset ' : '';
  const x = typeof s.offset?.x === 'number' ? s.offset.x : typeof s.x === 'number' ? s.x : 0;
  const y = typeof s.offset?.y === 'number' ? s.offset.y : typeof s.y === 'number' ? s.y : 0;
  const radius = typeof s.radius === 'number' ? s.radius : 0;
  const spread = typeof s.spread === 'number' ? s.spread : 0;
  let color = 'rgba(0, 0, 0, 0.1)';
  if (typeof s.color === 'string' && s.color) color = s.color;
  else if (s.color && typeof s.color === 'object') color = formatColorObject(s.color) ?? color;
  return `${inset}${x}px ${y}px ${radius}px ${spread}px ${color}`;
}

export function detectTokenCategory(token: { name: string; type: string; value?: unknown }): string {
  const typ = (token.type || '').toLowerCase().trim();
  const name = (token.name || '').toLowerCase();

  if (typ.includes('radius') || name.includes('radius') || name.includes('radii')) return 'radius';
  if (
    (typ === 'shadow' || typ === 'box-shadow' || typ === 'boxshadow' || typ === 'effect') &&
    !name.endsWith('/color') && !name.endsWith('/x') && !name.endsWith('/y') && !name.endsWith('/blur') && !name.endsWith('/spread')
  ) {
    return 'shadow';
  }
  if (typ === 'color' || name.includes('color')) return 'color';
  if (typ === 'typography' || typ.includes('font') || name.includes('typography') || name.includes('font') || name.includes('letter-spacing')) {
    return 'font';
  }
  if (typ === 'spacing' || typ === 'dimension' || name.includes('spacing') || name.startsWith('space/')) return 'spacing';
  if (typeof token.value === 'string' && /^(#|rgb\(|rgba\(|hsl\()/.test(token.value.trim())) return 'color';
  return 'custom';
}

function isOpacityTokenName(name?: string, category?: string): boolean {
  if (!name || category === 'color') return false;
  return /(^|[-/\s])opacity([-/\s]|$)/i.test(name);
}

function isPxDimensionToken(name?: string, category?: string): boolean {
  if (category === 'spacing' || category === 'radius') return true;
  if (!name) return false;
  return /(font-size|line-height|letter-spacing)/i.test(name);
}

const FALLBACK_FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function normalizeOpacityNumeric(n: number): string {
  if (n > 1 && n <= 100) return String(Number((n / 100).toFixed(4)));
  return String(Number(n.toFixed(4)));
}

function formatRoundedPx(n: number): string {
  return `${Number(n.toFixed(2))}px`;
}

export function formatTokenValue(val: unknown, category?: string, tokenName?: string): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') {
    const s = val.trim();
    const weightKey = s.toLowerCase().replace(/[\s_-]+/g, '');
    if ((category === 'font' || /weight/i.test(tokenName || '')) && FONT_WEIGHT_MAP[weightKey]) {
      return FONT_WEIGHT_MAP[weightKey]!;
    }
    if (/^-?\d+(\.\d+)?$/.test(s)) {
      const n = Number(s);
      if (isOpacityTokenName(tokenName, category)) return normalizeOpacityNumeric(n);
      if (isPxDimensionToken(tokenName, category) && n !== 0) return formatRoundedPx(n);
    }
    if (category === 'font' && (/(font-family|family|headings?$|body$)/i.test(tokenName || '') || s.includes('Sans') || s.includes('Serif') || s.includes('Mono'))) {
      const quoteWrapped = s.includes(' ') && !s.startsWith('"') && !s.startsWith("'") ? `"${s}"` : s;
      if (!s.includes(',')) {
        return `${quoteWrapped}, ${FALLBACK_FONT_STACK}`;
      }
      return s;
    }
    return s;
  }
  if (typeof val === 'number') {
    if (isOpacityTokenName(tokenName, category)) return normalizeOpacityNumeric(val);
    if (val !== 0 && isPxDimensionToken(tokenName, category)) return formatRoundedPx(val);
    return String(Number(val.toFixed(4)));
  }
  if (typeof val === 'boolean') return String(val);

  if (Array.isArray(val)) {
    const shadows = val.map((item) => formatSingleShadow(item)).filter(Boolean);
    if (shadows.length > 0) return shadows.join(', ');
    return val.map((item) => formatTokenValue(item, category, tokenName)).join(', ');
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, any>;
    const colorStr = formatColorObject(obj);
    if (colorStr) return colorStr;
    const shadowStr = formatSingleShadow(obj);
    if (shadowStr) return shadowStr;
    if (typeof obj.fontFamily === 'string') {
      const fam = obj.fontFamily.trim();
      const quoteWrapped = fam.includes(' ') && !fam.startsWith('"') && !fam.startsWith("'") ? `"${fam}"` : fam;
      const fullFamily = fam.includes(',') ? fam : `${quoteWrapped}, ${FALLBACK_FONT_STACK}`;
      return obj.fontSize ? `${obj.fontSize}px ${fullFamily}` : fullFamily;
    }
    return JSON.stringify(obj);
  }
  return String(val);
}
