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
      return obj.fontSize ? `${obj.fontSize}px "${obj.fontFamily}"` : `"${obj.fontFamily}"`;
    }
    return JSON.stringify(obj);
  }
  return String(val);
}

function isDarkMatch(val: string, candidates: string[]): boolean {
  const norm = val.toLowerCase().replace(/\s+/g, '');
  return candidates.some((c) => norm === c.toLowerCase().replace(/\s+/g, ''));
}

const SEMANTIC_DARK_OVERRIDES: Record<string, string> = {
  '--color-background-default': '#202127',
  '--color-background-subtle': '#25262c',
  '--color-background-muted': '#2b2b30',
  '--color-background-interactive': '#34363c',
  '--color-secondary-default': '#2b2b30',
  '--color-secondary-hover': '#34363c',
  '--color-secondary-foreground': '#f3f4f6',
  '--color-accent-default': '#2b2b30',
  '--color-foreground-default': '#f3f4f6',
  '--color-foreground-muted': '#9ca3af',
  '--color-foreground-subtle': '#9ca3af',
  '--color-border-default': '#3c3f44',
  '--color-border-subtle': '#2e3035',
};

export function buildDarkTokensBlock(css: string): string {
  const lines = ['.dark {'];
  for (const [varName, darkVal] of Object.entries(SEMANTIC_DARK_OVERRIDES)) {
    if (css.includes(`${varName}:`)) lines.push(`  ${varName}: ${darkVal};`);
  }
  const re = /(--color-components-[a-z0-9-]+):\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const name = m[1]!;
    const val = m[2]!.trim();
    const isInk = /(foreground|text|fill|stroke|label|title|heading|value|icon|wordmark|nav|current-page)/.test(name);
    const isColoredBadge = /badge-(primary|success|warning|info|destructive)/.test(name);
    const isSurface = /(background|surface)/.test(name) && !/(thumb|status|indicator|primary|destructive|accent)/.test(name);
    const isBorder = /(border|divider|grid-line)/.test(name) && !/(error|focus|selected|active)/.test(name);

    if (isInk && !isColoredBadge && isDarkMatch(val, ['rgb(10, 10, 10)', 'rgb(15, 14, 15)', 'rgb(23, 23, 23)', '#0a0a0a', '#0f0e0f', '#171717'])) {
      lines.push(`  ${name}: #f3f4f6;`);
    } else if (isInk && !isColoredBadge && isDarkMatch(val, ['rgb(115, 115, 115)', 'rgb(82, 82, 82)', '#737373', '#525252'])) {
      lines.push(`  ${name}: #9ca3af;`);
    } else if (isSurface && isDarkMatch(val, ['rgb(255, 255, 255)', '#ffffff'])) {
      lines.push(`  ${name}: #202127;`);
    } else if (isSurface && isDarkMatch(val, ['rgb(245, 245, 245)', 'rgb(250, 250, 250)', 'rgb(229, 229, 229)', '#f5f5f5', '#fafafa', '#e5e5e5'])) {
      lines.push(`  ${name}: #2b2b30;`);
    } else if (isBorder && isDarkMatch(val, ['rgb(229, 229, 229)', 'rgb(245, 245, 245)', '#e5e5f5', '#e5e5e5', '#f5f5f5'])) {
      lines.push(`  ${name}: #3c3f44;`);
    }
  }
  lines.push('}');
  return lines.join('\n');
}
