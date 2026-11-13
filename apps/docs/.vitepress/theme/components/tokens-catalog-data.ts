import rawTokens from '../../../../../src/tokens/tokens.json';

export interface ColorTokenCard {
  slug: string;
  label: string;
  group: string;
  cssVar: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  lightValue: string;
  darkValue: string;
  lightHex: string;
  darkHex: string;
}

export interface TypographySpecimen {
  id: string;
  label: string;
  sample: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
  cssVars: string[];
}

export interface RadiusTokenCard {
  slug: string;
  twClass: string;
  cssVar: string;
  value: string;
}

export interface ShadowTokenCard {
  slug: string;
  label: string;
  twClass: string;
  cssVar: string;
  value: string;
  note: string;
}

export interface SizingTokenItem {
  slug: string;
  label: string;
  cssVar: string;
  value: string;
  pxNumber: number;
  category: 'control-height' | 'spacing';
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/i);
  if (!m) return rgb;
  const r = Number(m[1]).toString(16).padStart(2, '0');
  const g = Number(m[2]).toString(16).padStart(2, '0');
  const b = Number(m[3]).toString(16).padStart(2, '0');
  const a = m[4] !== undefined ? Number(m[4]) : 1;
  if (a < 1) return `${rgb}`;
  return `#${r}${g}${b}`.toUpperCase();
}

function resolveColorGroup(slug: string): string {
  if (slug.startsWith('primary-') || slug.startsWith('secondary-') || slug.startsWith('accent-') || slug.startsWith('ghost-')) {
    return 'Primary, Secondary & Interactive';
  }
  if (slug.startsWith('background-') || slug.startsWith('overlay-')) {
    return 'Background & Surface';
  }
  if (slug.startsWith('foreground-')) {
    return 'Foreground & Typography';
  }
  if (slug.startsWith('border-') || slug.startsWith('focus-ring-')) {
    return 'Border & Focus Ring';
  }
  if (slug.startsWith('success-') || slug.startsWith('warning-') || slug.startsWith('destructive-') || slug.startsWith('info-')) {
    return 'Status & Feedback (Success, Warning, Destructive, Info)';
  }
  if (slug.startsWith('chart-')) {
    return 'Chart Visualization Series';
  }
  if (slug.startsWith('brand-')) {
    return 'Komerce Sub-Brand Palette';
  }
  return 'Other Semantic Colors';
}

function cleanColorSlug(name: string): string {
  return name
    .replace(/^🌱\s*Semantic\/colors\//i, '')
    .replace(/^colors\//i, '')
    .replace(/\//g, '-')
    .replace(/^focus-ring-/, 'focus-ring-')
    .replace(/^brand-monochrome-default$/, 'brand-monochrome')
    .toLowerCase();
}

export const COLOR_GROUP_ORDER = [
  'Primary, Secondary & Interactive',
  'Background & Surface',
  'Foreground & Typography',
  'Border & Focus Ring',
  'Status & Feedback (Success, Warning, Destructive, Info)',
  'Chart Visualization Series',
  'Komerce Sub-Brand Palette',
];

export const colorTokens: ColorTokenCard[] = (rawTokens as any[])
  .filter((t) => t.type === 'color')
  .map((t) => {
    const slug = cleanColorSlug(String(t.name || ''));
    const modes = t.modes || {};
    const valuesByMode = t.valuesByMode || {};
    let lightVal = String(t.value || '');
    let darkVal = lightVal;
    for (const [mId, mName] of Object.entries(modes)) {
      if (String(mName).toLowerCase().includes('light') && valuesByMode[mId]) {
        lightVal = String(valuesByMode[mId]);
      }
      if (String(mName).toLowerCase().includes('dark') && valuesByMode[mId]) {
        darkVal = String(valuesByMode[mId]);
      }
    }
    return {
      slug,
      label: slug.replace(/-/g, ' '),
      group: resolveColorGroup(slug),
      cssVar: `--color-${slug}`,
      bgClass: `bg-${slug}`,
      textClass: `text-${slug}`,
      borderClass: `border-${slug}`,
      lightValue: lightVal,
      darkValue: darkVal,
      lightHex: rgbToHex(lightVal),
      darkHex: rgbToHex(darkVal),
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const typographySpecimens: TypographySpecimen[] = [
  { id: 'h1', label: 'Heading 1', sample: 'Design System Typography', fontSize: '48px', lineHeight: '48px', fontWeight: '600', letterSpacing: '-1.5px', cssVars: ['--font-heading-1-font-size', '--font-heading-1-line-height', '--font-heading-1-weight'] },
  { id: 'h2', label: 'Heading 2', sample: 'Scalable Multi-Framework UI', fontSize: '30px', lineHeight: '30px', fontWeight: '600', letterSpacing: '-1px', cssVars: ['--font-heading-2-font-size', '--font-heading-2-line-height', '--font-heading-2-weight'] },
  { id: 'h3', label: 'Heading 3', sample: 'Consistent Semantic Tokens', fontSize: '24px', lineHeight: '28.8px', fontWeight: '600', letterSpacing: '-1px', cssVars: ['--font-heading-3-font-size', '--font-heading-3-line-height', '--font-heading-3-weight'] },
  { id: 'h4', label: 'Heading 4', sample: 'Component Architecture & Patterns', fontSize: '20px', lineHeight: '24px', fontWeight: '600', letterSpacing: '0px', cssVars: ['--font-heading-4-font-size', '--font-heading-4-line-height', '--font-heading-4-weight'] },
  { id: 'title', label: 'Paragraph Title', sample: 'Revenue Overview & Weekly Breakdown', fontSize: '16px', lineHeight: '24px', fontWeight: '500', letterSpacing: '0px', cssVars: ['--font-paragraph-title-font-size', '--font-paragraph-title-line-height'] },
  { id: 'body', label: 'Paragraph Body', sample: 'All components consume canonical semantic tokens so light mode, dark mode, and brand overrides work out of the box.', fontSize: '14px', lineHeight: '21px', fontWeight: '400', letterSpacing: '0px', cssVars: ['--font-paragraph-body-font-size', '--font-paragraph-body-line-height'] },
  { id: 'caption', label: 'Paragraph Caption', sample: 'Updated 5 minutes ago • Synced from Figma', fontSize: '12px', lineHeight: '16px', fontWeight: '400', letterSpacing: '0px', cssVars: ['--font-paragraph-caption-font-size', '--font-paragraph-caption-line-height'] },
  { id: 'label', label: 'Paragraph Label', sample: 'UPPERCASE TAG OR MICRO BADGE', fontSize: '11px', lineHeight: '14px', fontWeight: '600', letterSpacing: '0px', cssVars: ['--font-paragraph-label-font-size', '--font-paragraph-label-line-height'] },
];

export const radiusTokens: RadiusTokenCard[] = [
  { slug: 'none', twClass: 'rounded-none', cssVar: '--radius-none', value: '0px' },
  { slug: 'xs', twClass: 'rounded-xs', cssVar: '--radius-xs', value: '2px' },
  { slug: 'sm', twClass: 'rounded-sm', cssVar: '--radius-sm', value: '4px' },
  { slug: 'md', twClass: 'rounded-md', cssVar: '--radius-md', value: '6px' },
  { slug: 'lg', twClass: 'rounded-lg', cssVar: '--radius-lg', value: '8px' },
  { slug: 'xl', twClass: 'rounded-xl', cssVar: '--radius-xl', value: '12px' },
  { slug: '2xl', twClass: 'rounded-2xl', cssVar: '--radius-2xl', value: '16px' },
  { slug: 'full', twClass: 'rounded-full', cssVar: '--radius-full', value: '9999px' },
];

export const shadowTokens: ShadowTokenCard[] = (rawTokens as any[])
  .filter((t) => t.type === 'effect')
  .map((t) => {
    const rawName = String(t.name || '');
    const isFocus = rawName.toLowerCase().includes('focus');
    const clean = rawName.replace(/^effect\/(Shadow|Focus Ring)\//i, '').toLowerCase().replace(/\s+/g, '-');
    const slug = isFocus ? `focus-ring-${clean}` : clean;
    return {
      slug,
      label: isFocus ? `Focus Ring: ${clean}` : `Shadow ${clean.toUpperCase()}`,
      twClass: isFocus ? `ring-focus-ring-${clean}` : `shadow-${clean}`,
      cssVar: `--shadow-${slug}`,
      value: String(t.value || ''),
      note: String(t.description || '').split('—')[1]?.trim() || String(t.description || ''),
    };
  });

export const sizingTokens: SizingTokenItem[] = [
  { slug: 'mini', label: 'Control Height Mini', cssVar: '--sizing-control-height-mini', value: '24px', pxNumber: 24, category: 'control-height' },
  { slug: 'small', label: 'Control Height Small', cssVar: '--sizing-control-height-small', value: '32px', pxNumber: 32, category: 'control-height' },
  { slug: 'regular', label: 'Control Height Regular', cssVar: '--sizing-control-height-regular', value: '36px', pxNumber: 36, category: 'control-height' },
  { slug: 'large', label: 'Control Height Large', cssVar: '--sizing-control-height-large', value: '40px', pxNumber: 40, category: 'control-height' },
  { slug: 'x-large', label: 'Control Height X-Large', cssVar: '--sizing-control-height-x-large', value: '56px', pxNumber: 56, category: 'control-height' },
  { slug: '2x-large', label: 'Control Height 2X-Large', cssVar: '--sizing-control-height-2x-large', value: '96px', pxNumber: 96, category: 'control-height' },
  { slug: '3xs', label: 'Spacing 3XS', cssVar: '--spacing-3xs', value: '2px', pxNumber: 2, category: 'spacing' },
  { slug: '2xs', label: 'Spacing 2XS', cssVar: '--spacing-2xs', value: '4px', pxNumber: 4, category: 'spacing' },
  { slug: 'xs', label: 'Spacing XS', cssVar: '--spacing-xs', value: '6px', pxNumber: 6, category: 'spacing' },
  { slug: 'sm', label: 'Spacing SM', cssVar: '--spacing-sm', value: '8px', pxNumber: 8, category: 'spacing' },
  { slug: 'md', label: 'Spacing MD', cssVar: '--spacing-md', value: '12px', pxNumber: 12, category: 'spacing' },
  { slug: 'lg', label: 'Spacing LG', cssVar: '--spacing-lg', value: '16px', pxNumber: 16, category: 'spacing' },
  { slug: 'xl', label: 'Spacing XL', cssVar: '--spacing-xl', value: '24px', pxNumber: 24, category: 'spacing' },
  { slug: '2xl', label: 'Spacing 2XL', cssVar: '--spacing-2xl', value: '32px', pxNumber: 32, category: 'spacing' },
  { slug: '3xl', label: 'Spacing 3XL', cssVar: '--spacing-3xl', value: '40px', pxNumber: 40, category: 'spacing' },
  { slug: '4xl', label: 'Spacing 4XL', cssVar: '--spacing-4xl', value: '48px', pxNumber: 48, category: 'spacing' },
];
