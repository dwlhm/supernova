import { extractDefaultPropsFromSource } from './adapter-vue3.js';
import { extractPropsInterfaceInfo } from './adapter-svelte.js';

function formatDefaultValue(valText: string): string {
  const trimmed = valText.trim();
  if (trimmed.startsWith('[')) {
    return `() => ${trimmed}`;
  }
  if (trimmed.startsWith('{')) {
    return `() => (${trimmed})`;
  }
  return trimmed;
}

function normalizeFactoryDefaults(propsBody: string): string {
  return propsBody.replace(
    /(\bdefault\s*:\s*)(\[[\s\S]*?\]|\{[\s\S]*?\})(\s*,?\s*)/gm,
    (_full, defPrefix: string, literalPart: string, tail: string) => {
      const trimmed = literalPart.trim();
      if (trimmed.startsWith('[')) {
        return `${defPrefix}() => ${trimmed}${tail}`;
      }
      if (trimmed.startsWith('{')) {
        return `${defPrefix}() => (${trimmed})${tail}`;
      }
      return `${defPrefix}${literalPart}${tail}`;
    }
  );
}

function findObjectLiteralRange(
  code: string,
  prefixRegex: RegExp
): { start: number; bodyStart: number; bodyEnd: number } | null {
  const match = code.match(prefixRegex);
  if (!match || match.index === undefined) return null;
  const bodyStart = match.index + match[0].length;
  let depth = 1;
  let i = bodyStart;
  while (i < code.length && depth > 0) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  return { start: match.index, bodyStart, bodyEnd: i };
}

function buildBackfilledProps(
  candidateKeys: Set<string>,
  existingKeys: Set<string>,
  sourceDefaults: Map<string, string>
): string {
  const lines: string[] = [];
  for (const key of candidateKeys) {
    if (key === 'children' || existingKeys.has(key)) continue;
    const defaultVal = sourceDefaults.get(key);
    if (defaultVal !== undefined) {
      lines.push(`    ${key}: { default: ${formatDefaultValue(defaultVal)} },`);
    } else {
      lines.push(`    ${key}: { default: undefined },`);
    }
  }
  return lines.length > 0 ? lines.join('\n') + '\n' : '';
}

/**
 * Vue 2 Target Framework Adapter (`adapter-vue2.ts`)
 * 1. Backfills missing props from source `<Name>Props` and `useDefaultProps` into `props: { ... }`
 *    for components where props are passed as whole objects to headless helpers (e.g. `getTableState(props)`).
 * 2. Normalizes array and object literal defaults into factory functions `default: () => [...]`
 *    as required by Vue 2 Options API.
 * 3. Provides a reactive `props` getter in `computed: { props() { return this; } }`
 *    when `props` is referenced in templates or methods.
 */
export function adaptVue2Output(rawCode: string, source?: string): string {
  if (!rawCode) return rawCode;

  let code = rawCode.replace(
    /(export\s+interface\s+\w+Props\s*\{)([\s\S]*?)(\})/m,
    (full, open: string, body: string, close: string) => {
      const stripped = body.replace(/^\s*children\s*\?\s*:\s*any\s*;?\s*$/gm, '');
      return stripped.trim().length > 0 ? `${open}${stripped}${close}` : full;
    }
  );
  const ifaceInfo = source ? extractPropsInterfaceInfo(source) : null;
  const sourceDefaults = extractDefaultPropsFromSource(source);

  const candidateKeys = new Set<string>([
    ...(ifaceInfo?.keys || []),
    ...sourceDefaults.keys(),
  ]);

  const propsRange = findObjectLiteralRange(code, /\bprops\s*:\s*\{/);
  if (propsRange) {
    const existingBody = code.slice(propsRange.bodyStart, propsRange.bodyEnd);
    const existingKeys = new Set<string>();
    for (const m of existingBody.matchAll(/(?:^|[,{\s])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*\{/g)) {
      existingKeys.add(m[1]!);
    }

    const additions = buildBackfilledProps(candidateKeys, existingKeys, sourceDefaults);
    const trimmedBody = existingBody.trimEnd();
    const needsComma = trimmedBody.length > 0 && !trimmedBody.endsWith(',');
    const joinedBody = additions
      ? `${trimmedBody}${needsComma ? ',' : ''}\n${additions}`
      : existingBody;
    const normalizedBody = normalizeFactoryDefaults(joinedBody);
    code = code.slice(0, propsRange.bodyStart) + normalizedBody + code.slice(propsRange.bodyEnd);
  } else if (candidateKeys.size > 0) {
    const additions = buildBackfilledProps(candidateKeys, new Set(), sourceDefaults);
    if (additions) {
      const propsBlock = `\n  props: {\n${additions}  },\n`;
      if (code.includes('data() {')) {
        code = code.replace('data() {', `${propsBlock}  data() {`);
      } else {
        code = code.replace(/(export\s+default\s*\{[\s\S]*?name\s*:\s*["'][^"']+["']\s*,)/, `$1${propsBlock}`);
      }
    }
  }

  // Ensure computed: { props() { return this; } } exists if props is referenced
  if (/\bprops\b/.test(code) && !/props\s*\(\s*\)/.test(code)) {
    const computedBlock = `\n  computed: {\n    props() {\n      return this;\n    },\n  },\n`;
    if (code.includes('data() {')) {
      code = code.replace('data() {', `${computedBlock}  data() {`);
    }
  }

  return code;
}
