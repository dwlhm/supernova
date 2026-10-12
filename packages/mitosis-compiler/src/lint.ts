import type { CompileError } from './types.js';

const LINT_TARGET = 'lint';

export const LINT_RULES = {
  noAny: 'no-any',
  noColorLiteral: 'no-color-literal',
  noArbitraryColorClass: 'no-arbitrary-color-class',
  noJsxPropValue: 'no-jsx-prop-value',
  noPropShadow: 'no-prop-shadow',
  noOnChangeTextInput: 'no-onchange-text-input',
} as const;

/** Utility prefixes whose arbitrary `-[...]` form can carry a raw color value. */
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

/** CSS color / gradient functions that bypass design tokens. */
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

const HEX_COLOR_RE =
  /(?<![\w&.#/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const COLOR_FUNCTION_RE = new RegExp(`\\b(?:${COLOR_FUNCTIONS.join('|')})\\s*\\(`, 'g');
const ARBITRARY_COLOR_CLASS_RE = new RegExp(
  `(?<![\\w-])(?:${ARBITRARY_COLOR_PREFIXES.join('|')})-\\[`,
  'g'
);
const ANY_WORD_RE = /\bany\b/g;

const JSX_PROP_VALUE_RE = /\b([a-zA-Z0-9_-]+)=\{\s*<([a-zA-Z][a-zA-Z0-9_.-]*)/g;
const PROP_SHADOW_ASSIGN_RE =
  /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*props\.(\1)\b/g;
const PROP_SHADOW_DESTRUCTURE_RE =
  /\b(?:const|let|var)\s*\{([^}]+)\}\s*(?::\s*[^=]+)?=\s*props(?!\s*\.)\b/g;

const TEXT_INPUT_EXEMPT_TYPES = new Set(['checkbox', 'radio', 'file']);
const TEXT_INPUT_FLAGGED_TYPES = new Set([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
]);
const INPUT_TAG_START_RE = /<(input|textarea)(?=[\s/>])/g;

/** Context window (chars) inspected around an `any` token. */
const CONTEXT_WINDOW = 200;

interface SourceViews {
  /** Source with comments blanked (string contents preserved). */
  code: string;
  /** Source with comments and string-literal contents blanked. */
  bare: string;
}

function blank(ch: string): string {
  return ch === '\n' ? '\n' : ' ';
}

/**
 * Builds index-preserving views of the source: every output char maps 1:1 to
 * an input char so match indices translate directly to source lines.
 */
function buildViews(source: string): SourceViews {
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
        // Quote/apostrophe strings cannot span lines; an unterminated one
        // (e.g. an apostrophe in JSX text) ends at the newline.
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

function buildLineLocator(source: string): (index: number) => number {
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

/** Nearest unclosed `{`, `(` or `[` before `index`. */
function enclosingOpener(text: string, index: number): string | undefined {
  let depth = 0;
  for (let i = index - 1; i >= 0; i--) {
    const c = text[i];
    if (c === ')' || c === ']' || c === '}') {
      depth++;
    } else if (c === '(' || c === '[' || c === '{') {
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

/** `children?: any` / `children: any` as an interface or type-literal member. */
function isChildrenMember(bare: string, index: number, before: string, after: string): boolean {
  if (!/(?:^|[{;,\n])\s*(?:readonly\s+)?children\s*\??\s*:\s*$/.test(before)) return false;
  if (!/^\s*(?:[;,}\n]|$)/.test(after)) return false;
  return enclosingOpener(bare, index) === '{';
}

function lintNoAny(views: SourceViews, lineOf: (index: number) => number): CompileError[] {
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

function lintPattern(
  text: string,
  pattern: RegExp,
  rule: string,
  describe: (matched: string) => string,
  lineOf: (index: number) => number
): CompileError[] {
  const errors: CompileError[] = [];
  for (const match of text.matchAll(pattern)) {
    errors.push({
      target: LINT_TARGET,
      rule,
      line: lineOf(match.index ?? 0),
      message: describe(match[0]),
    });
  }
  return errors;
}

function lintNoJsxPropValue(
  views: SourceViews,
  lineOf: (index: number) => number
): CompileError[] {
  const errors: CompileError[] = [];
  for (const match of views.code.matchAll(JSX_PROP_VALUE_RE)) {
    const attrName = match[1] as string;
    if (attrName === 'else' || attrName === 'children') {
      continue;
    }
    errors.push({
      target: LINT_TARGET,
      rule: LINT_RULES.noJsxPropValue,
      line: lineOf(match.index ?? 0),
      message: `Passing JSX element as prop value "${attrName}" is not supported across target frameworks; pass data or use children.`,
    });
  }
  return errors;
}

function lintNoPropShadow(
  views: SourceViews,
  lineOf: (index: number) => number
): CompileError[] {
  const errors: CompileError[] = [];
  const text = views.code;

  for (const match of text.matchAll(PROP_SHADOW_ASSIGN_RE)) {
    const varName = match[1] as string;
    errors.push({
      target: LINT_TARGET,
      rule: LINT_RULES.noPropShadow,
      line: lineOf(match.index ?? 0),
      message: `Variable declaration "${varName}" shadows "props.${varName}"; rename the variable to avoid Svelte temporal dead zone / reference errors.`,
    });
  }

  for (const match of text.matchAll(PROP_SHADOW_DESTRUCTURE_RE)) {
    const rawProps = match[1] as string;
    for (const item of rawProps.split(',')) {
      const trimmed = item.trim();
      const propMatch = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*[^,]+)?$/);
      if (propMatch) {
        const varName = propMatch[1] as string;
        errors.push({
          target: LINT_TARGET,
          rule: LINT_RULES.noPropShadow,
          line: lineOf(match.index ?? 0),
          message: `Variable declaration "${varName}" shadows "props.${varName}"; rename the variable to avoid Svelte temporal dead zone / reference errors.`,
        });
      }
    }
  }

  return errors;
}

function lintNoOnChangeTextInput(
  views: SourceViews,
  lineOf: (index: number) => number
): CompileError[] {
  const errors: CompileError[] = [];
  const text = views.code;
  const n = text.length;

  for (const match of text.matchAll(INPUT_TAG_START_RE)) {
    const tagStartIndex = match.index ?? 0;
    const tagName = match[1] as string;
    let i = tagStartIndex + match[0].length;
    let braceDepth = 0;
    let quote: string | null = null;
    let tagEndIndex = n;

    while (i < n) {
      const ch = text[i] as string;

      if (quote !== null) {
        if (ch === '\\' && i + 1 < n) {
          i += 2;
          continue;
        }
        if (ch === quote) {
          quote = null;
        }
        i++;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch;
        i++;
        continue;
      }

      if (ch === '{') {
        braceDepth++;
        i++;
        continue;
      }

      if (ch === '}') {
        if (braceDepth > 0) braceDepth--;
        i++;
        continue;
      }

      if (ch === '>' && braceDepth === 0) {
        tagEndIndex = i + 1;
        break;
      }

      i++;
    }

    const tagContent = text.slice(tagStartIndex, tagEndIndex);
    const onChangeMatch = tagContent.match(/\bonChange\s*=/);
    if (!onChangeMatch) {
      continue;
    }

    const errorLine = lineOf(tagStartIndex + (onChangeMatch.index ?? 0));

    if (tagName === 'textarea') {
      errors.push({
        target: LINT_TARGET,
        rule: LINT_RULES.noOnChangeTextInput,
        line: errorLine,
        message:
          'Use "onInput" instead of "onChange" on text inputs and textareas to ensure immediate cross-framework reactivity.',
      });
      continue;
    }

    if (tagName === 'input') {
      const typeMatch = tagContent.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
      if (!typeMatch) {
        // Missing type defaults to text
        errors.push({
          target: LINT_TARGET,
          rule: LINT_RULES.noOnChangeTextInput,
          line: errorLine,
          message:
            'Use "onInput" instead of "onChange" on text inputs and textareas to ensure immediate cross-framework reactivity.',
        });
      } else if (typeMatch[3] !== undefined) {
        // Dynamic type={...}
        errors.push({
          target: LINT_TARGET,
          rule: LINT_RULES.noOnChangeTextInput,
          line: errorLine,
          message:
            'Use "onInput" instead of "onChange" on text inputs and textareas to ensure immediate cross-framework reactivity.',
        });
      } else {
        const typeVal = (typeMatch[1] ?? typeMatch[2])?.toLowerCase().trim();
        if (typeVal && TEXT_INPUT_EXEMPT_TYPES.has(typeVal)) {
          // Exempt (checkbox, radio, file)
          continue;
        }
        if (!typeVal || TEXT_INPUT_FLAGGED_TYPES.has(typeVal)) {
          errors.push({
            target: LINT_TARGET,
            rule: LINT_RULES.noOnChangeTextInput,
            line: errorLine,
            message:
              'Use "onInput" instead of "onChange" on text inputs and textareas to ensure immediate cross-framework reactivity.',
          });
        }
      }
    }
  }

  return errors;
}

/**
 * Static lint gate for Mitosis component source. Comments are ignored.
 * Returns one error per offending occurrence, ordered by line.
 */
export function lintSource(source: string): CompileError[] {
  const views = buildViews(source);
  const lineOf = buildLineLocator(source);

  const errors: CompileError[] = [
    ...lintNoAny(views, lineOf),
    ...lintPattern(
      views.code,
      HEX_COLOR_RE,
      LINT_RULES.noColorLiteral,
      (m) => `Hardcoded color literal "${m}" is not allowed; use a design token class.`,
      lineOf
    ),
    ...lintPattern(
      views.code,
      COLOR_FUNCTION_RE,
      LINT_RULES.noColorLiteral,
      (m) => `Hardcoded color function "${m.replace(/\s*\($/, '')}()" is not allowed; use a design token class.`,
      lineOf
    ),
    ...lintPattern(
      views.code,
      ARBITRARY_COLOR_CLASS_RE,
      LINT_RULES.noArbitraryColorClass,
      (m) => `Arbitrary value class "${m}...]" is not allowed; use a design token class.`,
      lineOf
    ),
    ...lintNoJsxPropValue(views, lineOf),
    ...lintNoPropShadow(views, lineOf),
    ...lintNoOnChangeTextInput(views, lineOf),
  ];

  return errors.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
}
