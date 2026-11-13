import type { FigmaToken } from '../domain/models.js';

interface ExtractedComponentToken {
  twClass: string;
  cssVar: string;
  role: string;
}

const TOKEN_CLASS_RE =
  /\b((?:bg|text|border|stroke|fill|ring)-(?:primary|secondary|accent|background|foreground|border|destructive|success|warning|info|ghost|overlay|focus-ring|chart-series|brand)-[a-z0-9-]+)\b/g;

function describeTokenRole(twClass: string): { cssVar: string; role: string } {
  const m = twClass.match(/^(bg|text|border|stroke|fill|ring)-(.+)$/);
  const prefix = m?.[1] || 'bg';
  const tokenSlug = m?.[2] || twClass;
  const cssVar = `--color-${tokenSlug}`;
  const roleMap: Record<string, string> = {
    bg: 'Background / Surface fill',
    text: 'Text / Foreground color',
    border: 'Border / Divider stroke',
    stroke: 'SVG / Vector stroke color',
    fill: 'SVG / Vector fill color',
    ring: 'Focus ring highlight',
  };
  return { cssVar, role: roleMap[prefix] || 'Color token' };
}

export function extractComponentColorTokens(
  sourceCode?: string,
  siblings: Record<string, string> = {}
): ExtractedComponentToken[] {
  const combined = [sourceCode || '', ...Object.values(siblings)].join('\n');
  const seen = new Set<string>();
  const out: ExtractedComponentToken[] = [];

  for (const match of combined.matchAll(TOKEN_CLASS_RE)) {
    const twClass = match[1]!;
    if (seen.has(twClass)) continue;
    seen.add(twClass);
    const { cssVar, role } = describeTokenRole(twClass);
    out.push({ twClass, cssVar, role });
  }

  return out.sort((a, b) => a.twClass.localeCompare(b.twClass));
}

export function generateComponentTokensSection(
  compName: string,
  sourceCode?: string,
  siblings: Record<string, string> = {}
): string {
  const tokens = extractComponentColorTokens(sourceCode, siblings);
  if (tokens.length === 0) return '';

  const customTargetProp =
    compName === 'Tooltip'
      ? 'contentClassName'
      : compName === 'Progressbar' || compName === 'Slider'
        ? 'indicatorClassName'
        : 'className';

  const lines: string[] = [
    '## Design Tokens & Color Customization',
    '',
    `\`${compName}\` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via \`${customTargetProp}\` or by rebinding the underlying CSS custom properties (\`--color-*\`) on the component or a parent wrapper:`,
    '',
    '| Tailwind Token Class | CSS Variable | UI Role |',
    '| :--- | :--- | :--- |',
    ...tokens.map((t) => `| \`${t.twClass}\` | \`${t.cssVar}\` | ${t.role} |`),
    '',
    '```tsx',
    `// 1. Direct token override via ${customTargetProp}`,
    `<${compName} ${customTargetProp}="bg-brand-kompack-primary text-primary-foreground" />`,
    '',
    '// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)',
    `<${compName} ${customTargetProp}="[--color-primary-default:var(--color-brand-komship-primary)]" />`,
    '```',
    '',
  ];

  return lines.join('\n');
}

export function generateVisualTokensPage(_tokens: FigmaToken[]): string {
  return [
    '# Design Tokens Explorer',
    '',
    'Jelajahi seluruh token desain hasil ekstraksi Figma secara visual — mulai dari palet warna semantik & sub-brand Komerce (Light & Dark Mode), skala tipografi, border radius, dimensi kontrol, hingga *elevation shadow*. Klik chip class Tailwind atau variabel CSS untuk menyalin langsung.',
    '',
    '<DesignTokensExplorer />',
    '',
    '## Cara Custom Warna Komponen dengan Design Tokens',
    '',
    'Seluruh komponen di Design System ini dibangun di atas variabel CSS semantik (`var(--color-*)`) dari Figma. Anda dapat mengubah warna **background**, **text/foreground**, **border**, maupun **indikator** pada komponen apa pun melalui 2 cara:',
    '',
    '### 1. Menggunakan Class Token Semantik / Sub-Brand (`className` / `contentClassName` / `indicatorClassName`)',
    '',
    'Setiap komponen menggabungkan prop class menggunakan `cn()` (`tailwind-merge`), sehingga class warna yang Anda kirim akan otomatis menggantikan token default:',
    '',
    '```tsx',
    '// Button & Badge dengan token warna sub-brand Komerce',
    '<Button className="bg-brand-kompack-primary hover:bg-brand-kompack-secondary text-primary-foreground">',
    '  Kirim Paket',
    '</Button>',
    '',
    '// Tooltip dengan warna bubble & dot kustom (tanpa mempengaruhi elemen trigger)',
    '<Tooltip text="Tersimpan otomatis" contentClassName="bg-brand-komtim-primary text-primary-foreground">',
    '  <span>Status</span>',
    '</Tooltip>',
    '',
    '// Progressbar, Slider & Chart Tooltip dengan warna kustom',
    '<Progressbar value={80} indicatorClassName="bg-success-default" trackClassName="bg-success-subtle" />',
    '<ChartBar data={rows} barColorClass="bg-brand-komplace-primary" tooltipClassName="bg-foreground-default text-foreground-inverse" />',
    '```',
    '',
    '### 2. Rebinding Variabel CSS Token (`--color-*`) per Komponen atau Tema',
    '',
    'Untuk mengubah seluruh bagian internal komponen yang terikat ke suatu token Figma sekaligus (misalnya mengubah `--color-primary-default` pada `SwitchButton`, `Slider`, `Tabs`, atau `Stepper`):',
    '',
    '```tsx',
    '<div className="[--color-primary-default:var(--color-brand-komclass-primary)] [--color-primary-hover:var(--color-brand-komclass-secondary)]">',
    '  <SwitchButton checked={true} label="Aktifkan Kelas" />',
    '  <Slider value={65} />',
    '</div>',
    '```',
    '',
  ].join('\n');
}
