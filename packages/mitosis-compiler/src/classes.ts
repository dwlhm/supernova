import type { CompileError } from './types.js';

export function normalizeClass(cls: string): string {
  let c = cls.trim();
  const lastColon = c.lastIndexOf(':');
  if (lastColon !== -1) {
    c = c.slice(lastColon + 1);
  }
  // Strip leading '!' and '-'
  c = c.replace(/^[!-]+/, '');
  // Strip trailing opacity modifier (/NN, /50, /[0.5], etc.)
  c = c.replace(/\/(?:\[[^\]]+\]|[\d.]+%?)$/, '');
  return c;
}

const COLOR_PREFIXES = [
  // Compound prefixes first to prevent prefix shadowing
  'border-x',
  'border-y',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-s',
  'border-e',
  'ring-offset',
  // Single prefixes
  'bg',
  'text',
  'border',
  'ring',
  'outline',
  'fill',
  'stroke',
  'divide',
  'placeholder',
  'from',
  'via',
  'to',
  'decoration',
  'accent',
  'caret',
  'shadow',
] as const;

const UNIVERSAL_NON_COLOR = new Set(['transparent', 'current', 'inherit', 'none']);

const TEXT_NON_COLOR = new Set([
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  'left',
  'center',
  'right',
  'justify',
  'start',
  'end',
  'wrap',
  'nowrap',
  'balance',
  'pretty',
  'ellipsis',
  'clip',
]);

const BORDER_STYLE_OR_OTHER = new Set([
  'solid',
  'dashed',
  'dotted',
  'double',
  'hidden',
  'none',
  'collapse',
  'separate',
]);

const SHADOW_NON_COLOR = new Set([
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'inner',
  'none',
]);

const DECORATION_NON_COLOR = new Set([
  'solid',
  'double',
  'dotted',
  'dashed',
  'wavy',
  'auto',
  'from-font',
]);

const BG_NON_COLOR =
  /^(?:fixed|local|scroll|cover|contain|auto|center|repeat|no-repeat|repeat-.*|clip-.*|origin-.*|(?:bottom|top|left|right)(?:-.*)?|gradient-to-.*|linear-.*|radial(?:-.*)?|conic(?:-.*)?|none)$/;

export function isColorUtility(cls: string): boolean {
  const norm = normalizeClass(cls);

  for (const prefix of COLOR_PREFIXES) {
    if (norm === prefix) {
      // All bare prefixes are non-color
      return false;
    }

    if (norm.startsWith(`${prefix}-`)) {
      const suffix = norm.slice(prefix.length + 1);
      if (!suffix) return false;

      // Universal non-color values
      if (UNIVERSAL_NON_COLOR.has(suffix)) {
        return false;
      }

      switch (prefix) {
        case 'text':
          if (TEXT_NON_COLOR.has(suffix)) return false;
          return true;

        case 'border':
          // bare sides: border-t, border-x, etc.
          if (/^[xytrblse]$/.test(suffix)) return false;
          // side widths: border-t-2, border-x-4
          if (/^[xytrblse]-(?:\d+|px)$/.test(suffix)) return false;
          // numeric widths: 0, 2, 4, 8, px
          if (/^\d+(?:px)?$/.test(suffix) || suffix === 'px') return false;
          if (BORDER_STYLE_OR_OTHER.has(suffix)) return false;
          if (suffix.startsWith('spacing-')) return false;
          return true;

        case 'border-x':
        case 'border-y':
        case 'border-t':
        case 'border-r':
        case 'border-b':
        case 'border-l':
        case 'border-s':
        case 'border-e':
          // bare sides handled by norm === prefix
          // side numeric widths: border-t-2, border-t-0, etc.
          if (/^\d+(?:px)?$/.test(suffix) || suffix === 'px') return false;
          return true;

        case 'ring':
          // 0, 1, 2, 4, 8, inset, offset-<number>
          if (/^\d+$/.test(suffix) || suffix === 'inset' || /^offset-\d+$/.test(suffix)) return false;
          return true;

        case 'ring-offset':
          // ring-offset-<number>
          if (/^\d+$/.test(suffix)) return false;
          return true;

        case 'outline':
          // hidden, dashed, dotted, double, <number>, offset-<number>
          if (/^(?:hidden|dashed|dotted|double|\d+|offset-\d+)$/.test(suffix)) return false;
          return true;

        case 'shadow':
          if (SHADOW_NON_COLOR.has(suffix)) return false;
          return true;

        case 'bg':
          if (BG_NON_COLOR.test(suffix)) return false;
          return true;

        case 'fill':
          return true;

        case 'stroke':
          // none (universal), stroke-<number>, <number>
          if (/^(?:\d+|stroke-\d+)$/.test(suffix)) return false;
          return true;

        case 'divide':
          // x, y, x-<n>, y-<n>, x-reverse, y-reverse, solid, dashed, dotted, double, none
          if (/^(?:[xy](?:-\d+)?|[xy]-reverse|solid|dashed|dotted|double|\d+)$/.test(suffix)) return false;
          return true;

        case 'decoration':
          // solid, double, dotted, dashed, wavy, auto, from-font, <number>
          if (DECORATION_NON_COLOR.has(suffix) || /^\d+$/.test(suffix)) return false;
          return true;

        case 'from':
        case 'via':
        case 'to':
          // <n>%
          if (/^\d+%$/.test(suffix)) return false;
          return true;

        case 'accent':
        case 'caret':
          if (suffix === 'auto') return false;
          return true;

        case 'placeholder':
          return true;

        default:
          return true;
      }
    }
  }

  return false;
}

export function checkClasses(classes: string[], allowed: string[]): CompileError[] {
  const allowedNorm = new Set(allowed.map((a) => normalizeClass(a)));
  const seen = new Set<string>();
  const errors: CompileError[] = [];

  for (const entry of classes) {
    const tokens = entry.trim().split(/\s+/);
    for (const cls of tokens) {
      if (!cls || seen.has(cls)) continue;
      seen.add(cls);

      const norm = normalizeClass(cls);
      if (isColorUtility(norm) && !allowedNorm.has(norm)) {
        errors.push({
          target: 'render',
          rule: 'unknown-class',
          message: `Unknown class "${cls}".`,
        });
      }
    }
  }

  return errors;
}
