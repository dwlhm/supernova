import type { CompileError } from './types.js';

export const LINT_TARGET = 'lint';

export const LINT_RULES = {
  noAny: 'no-any',
  noColorLiteral: 'no-color-literal',
  noArbitraryColorClass: 'no-arbitrary-color-class',
  noJsxPropValue: 'no-jsx-prop-value',
  noPropShadow: 'no-prop-shadow',
  noOnChangeTextInput: 'no-onchange-text-input',
} as const;

const ARBITRARY_COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'fill',
  'stroke',
  'outline',
  'from',
  'via',
  'to',
  'divide',
  'shadow',
  'decoration',
  'accent',
  'caret',
  'placeholder',
];

const COLOR_FUNCTIONS = [
  'rgba?',
  'hsla?',
  'oklch',
  'oklab',
  'color-mix',
  'linear-gradient',
  'radial-gradient',
  'conic-gradient',
];

export const HEX_COLOR_RE =
  /(?<![\w&.#/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
export const COLOR_FUNCTION_RE = new RegExp(`\\b(?:${COLOR_FUNCTIONS.join('|')})\\s*\\(`, 'g');
export const ARBITRARY_COLOR_CLASS_RE = new RegExp(
  `(?<![\\w-])(?:${ARBITRARY_COLOR_PREFIXES.join('|')})-\\[`,
  'g'
);
const ANY_WORD_RE = /\bany\b/g;

export const JSX_PROP_VALUE_RE = /\b([a-zA-Z0-9_-]+)=\{\s*<([a-zA-Z][a-zA-Z0-9_.-]*)/g;
export const PROP_SHADOW_ASSIGN_RE =
  /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*props\.(\1)\b/g;
export const PROP_SHADOW_DESTRUCTURE_RE =
  /\b(?:const|let|var)\s*\{([^}]+)\}\s*(?::\s*[^=]+)?=\s*props(?!\s*\.)\b/g;

export const TEXT_INPUT_EXEMPT_TYPES = new Set(['checkbox', 'radio', 'file']);
export const TEXT_INPUT_FLAGGED_TYPES = new Set([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
]);
export const INPUT_TAG_START_RE = /<(input|textarea)(?=[\s/>])/g;

const CONTEXT_WINDOW = 200;

export interface SourceViews {
  code: string;
  bare: string;
}

function blank(ch: string): string {
  return ch === '\n' ? '\n' : ' ';
}

export function buildViews(source: string): SourceViews {
  const code: string[] = [];
  const bare: string[] = [];
  const push = (codeCh: string, bareCh: string = codeCh): void => {
    code.push(codeCh);
    bare.push(bareCh);
  };
  const n = source.length;
  let i = 0;

  while (i < n) {
    const ch = source[i] as string;
    const next = source[i + 1];

    if (ch === '/' && next === '/') {
      while (i < n && source[i] !== '\n') {
        push(' ');
        i++;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      push(' ');
      push(' ');
      i += 2;
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) {
        push(blank(source[i] as string));
        i++;
      }
      if (i < n) {
        push(' ');
        push(' ');
        i += 2;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      push(ch);
      i++;
      while (i < n) {
        const c = source[i] as string;
        if (c === '\\' && i + 1 < n) {
          const escaped = source[i + 1] as string;
          push(c, ' ');
          push(escaped, blank(escaped));
          i += 2;
          continue;
        }
        if (c === ch) {
          push(c);
          i++;
          break;
        }
        if (c === '\n' && ch !== '`') {
          break;
        }
        push(c, blank(c));
        i++;
      }
      continue;
    }

    push(ch);
    i++;
  }

  return { code: code.join(''), bare: bare.join('') };
}

export function buildLineLocator(source: string): (index: number) => number {
  const lineStarts: number[] = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') lineStarts.push(i + 1);
  }
  return (index: number): number => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if ((lineStarts[mid] as number) <= index) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

function enclosingOpener(text: string, index: number): string | undefined {
  let depth = 0;
  for (let i = index - 1; i >= 0; i--) {
    const c = text[i];
    if (c === ')' || c === ']' || c === '}') depth++;
    else if (c === '(' || c === '[' || c === '{') {
      if (depth === 0) return c;
      depth--;
    }
  }
  return undefined;
}

function isTypeAny(before: string, after: string): boolean {
  if (/:\s*$/.test(before) && /^\s*(?:[;,)\]}|&=>[]|$)/.test(after)) return true;
  if (/\bas\s+$/.test(before)) return true;
  if (/<\s*$/.test(before)) return true;
  if (/,\s*$/.test(before) && /^\s*[,>\]]/.test(after)) return true;
  if (/[|&]\s*$/.test(before) && /^\s*(?:[;,)\]}|&=>[]|$)/.test(after)) return true;
  if (/^\s*\[\s*\]/.test(after)) return true;
  if (/^\s*>/.test(after)) return true;
  return false;
}

function isChildrenMember(bare: string, index: number, before: string, after: string): boolean {
  if (!/(?:^|[{;,\n])\s*(?:readonly\s+)?children\s*\??\s*:\s*$/.test(before)) return false;
  if (!/^\s*(?:[;,}\n]|$)/.test(after)) return false;
  return enclosingOpener(bare, index) === '{';
}

export function lintNoAny(views: SourceViews, lineOf: (index: number) => number): CompileError[] {
  const errors: CompileError[] = [];
  const { bare } = views;
  for (const match of bare.matchAll(ANY_WORD_RE)) {
    const index = match.index ?? 0;
    const before = bare.slice(Math.max(0, index - CONTEXT_WINDOW), index);
    const after = bare.slice(index + match[0].length, index + match[0].length + CONTEXT_WINDOW);
    if (!isTypeAny(before, after)) continue;
    if (isChildrenMember(bare, index, before, after)) continue;
    errors.push({
      target: LINT_TARGET,
      rule: LINT_RULES.noAny,
      line: lineOf(index),
      message: 'Type `any` is not allowed; use a concrete type (only `children?: any` props member is exempt).',
    });
  }
  return errors;
}
