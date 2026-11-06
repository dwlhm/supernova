import type { CompileError } from './types.js';
import {
  ARBITRARY_COLOR_CLASS_RE,
  COLOR_FUNCTION_RE,
  HEX_COLOR_RE,
  INPUT_TAG_START_RE,
  JSX_PROP_VALUE_RE,
  LINT_RULES,
  LINT_TARGET,
  PROP_SHADOW_ASSIGN_RE,
  PROP_SHADOW_DESTRUCTURE_RE,
  TEXT_INPUT_EXEMPT_TYPES,
  TEXT_INPUT_FLAGGED_TYPES,
  buildLineLocator,
  buildViews,
  lintNoAny,
  type SourceViews,
} from './lint-views.js';
import { lintTier3 } from './lint-tier3.js';
import { lintPortability } from './lint-portability.js';

export { LINT_RULES };

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
    if (attrName === 'else' || attrName === 'children') continue;
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

function lintStorePropCollision(
  views: SourceViews,
  lineOf: (index: number) => number
): CompileError[] {
  const errors: CompileError[] = [];
  const text = views.code;
  const ifaceMatch = text.match(/export\s+interface\s+\w+Props\s*\{([\s\S]*?)\}/);
  if (!ifaceMatch) return errors;
  const propNames = new Set<string>();
  for (const m of ifaceMatch[1]!.matchAll(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\??\s*:/gm)) {
    propNames.add(m[1]!);
  }
  const storeMatch = text.match(/\buseStore\s*\(\s*\{([\s\S]*?)\}\s*\)/);
  if (!storeMatch) return errors;
  const storeStart = (storeMatch.index ?? 0) + storeMatch[0].indexOf('{');
  for (const gm of storeMatch[1]!.matchAll(/\bget\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g)) {
    const getterName = gm[1]!;
    if (propNames.has(getterName)) {
      errors.push({
        target: LINT_TARGET,
        rule: LINT_RULES.noPropShadow,
        line: lineOf(storeStart + (gm.index ?? 0)),
        message: `Store getter "${getterName}" collides with "props.${getterName}" in Vue 3 / Svelte; rename the getter.`,
      });
    }
  }
  return errors;
}

export function findOpeningTagEnd(text: string, startAfterTagName: number): number {
  const n = text.length;
  let i = startAfterTagName;
  let braceDepth = 0;
  let quote: string | null = null;

  while (i < n) {
    const ch = text[i] as string;
    if (quote !== null) {
      if (ch === '\\' && i + 1 < n) {
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
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
    if (ch === '>' && braceDepth === 0) return i + 1;
    i++;
  }
  return n;
}

export function isFlaggedTextInputTag(tagName: string, tagContent: string): boolean {
  if (tagName === 'textarea') return true;
  if (tagName !== 'input') return false;
  const typeMatch = tagContent.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
  if (!typeMatch) return true;
  if (typeMatch[3] !== undefined) return true;
  const typeVal = (typeMatch[1] ?? typeMatch[2])?.toLowerCase().trim();
  if (typeVal && TEXT_INPUT_EXEMPT_TYPES.has(typeVal)) return false;
  return !typeVal || TEXT_INPUT_FLAGGED_TYPES.has(typeVal);
}

function lintNoOnChangeTextInput(
  views: SourceViews,
  lineOf: (index: number) => number
): CompileError[] {
  const errors: CompileError[] = [];
  const text = views.code;

  for (const match of text.matchAll(INPUT_TAG_START_RE)) {
    const tagStartIndex = match.index ?? 0;
    const tagName = match[1] as string;
    const tagEndIndex = findOpeningTagEnd(text, tagStartIndex + match[0].length);
    const tagContent = text.slice(tagStartIndex, tagEndIndex);
    const onChangeMatch = tagContent.match(/\bonChange\s*=/);
    if (!onChangeMatch) continue;

    if (isFlaggedTextInputTag(tagName, tagContent)) {
      errors.push({
        target: LINT_TARGET,
        rule: LINT_RULES.noOnChangeTextInput,
        line: lineOf(tagStartIndex + (onChangeMatch.index ?? 0)),
        message:
          'Use "onInput" instead of "onChange" on text inputs and textareas to ensure immediate cross-framework reactivity.',
      });
    }
  }

  return errors;
}

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
    ...lintStorePropCollision(views, lineOf),
    ...lintNoOnChangeTextInput(views, lineOf),
    ...lintTier3(source, lineOf),
    ...lintPortability(source, lineOf),
  ];

  return errors.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
}
