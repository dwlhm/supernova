import { extractDefaultPropsFromSource } from './adapter-vue3.js';
import { extractPropsInterfaceInfo } from './adapter-svelte.js';

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

function backfillDefaultPropsObject(code: string, sourceDefaults: Map<string, string>): string {
  const range = findObjectLiteralRange(code, /const\s+defaultProps\s*:\s*any\s*=\s*\{/);
  if (!range) return code;

  const body = code.slice(range.bodyStart, range.bodyEnd);
  const existingKeys = new Set<string>();
  for (const m of body.matchAll(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/gm)) {
    existingKeys.add(m[1]!);
  }

  const additions: string[] = [];
  for (const [key, val] of sourceDefaults.entries()) {
    if (!existingKeys.has(key) && key !== 'children') {
      additions.push(`  ${key}: ${val},`);
    }
  }

  if (additions.length === 0) return code;
  const trimmed = body.trimEnd();
  const trailingComma = trimmed.length > 0 && !trimmed.endsWith(',') ? ',' : '';
  const augmented = `${trimmed}${trailingComma}\n${additions.join('\n')}\n`;
  return code.slice(0, range.bodyStart) + augmented + code.slice(range.bodyEnd);
}

function buildBackfilledInputs(
  candidateKeys: Set<string>,
  existingInputs: Set<string>,
  existingOutputs: Set<string>,
  interfaceName: string,
  hasDefaultProps: boolean,
  sourceDefaults: Map<string, string>
): string {
  const lines: string[] = [];
  for (const key of candidateKeys) {
    if (key === 'children' || existingInputs.has(key) || existingOutputs.has(key)) {
      continue;
    }
    const hasDefault = hasDefaultProps && sourceDefaults.has(key);
    const init = hasDefault ? `defaultProps["${key}"]` : 'undefined';
    lines.push(`  @Input() ${key}: ${interfaceName}["${key}"] = ${init};`);
  }
  return lines.length > 0 ? lines.join('\n') + '\n' : '';
}

function normalizeAngularSelector(code: string): string {
  return code.replace(
    /@Component\(\s*\{([\s\S]*?)selector\s*:\s*["']([^"']+)["']/m,
    (_full, prefix: string, selector: string) => {
      if (selector.startsWith('spn-')) return _full;
      return `@Component({${prefix}selector: "spn-${selector}, ${selector}"`;
    }
  );
}

/**
 * Angular Target Framework Adapter (`adapter-angular.ts`)
 * 1. Backfills missing `@Input()` declarations from `<Name>Props` and `useDefaultProps`
 *    for components where props are passed as whole objects to headless helpers (e.g. `getTableState(props)`).
 * 2. Backfills any missing values into `const defaultProps = { ... }`.
 * 3. Normalizes component selector to include the `spn-` prefix (e.g. `spn-button, button`).
 * 4. Synthesizes `get props(): any { return this; }` when templates reference `props`.
 */
export function adaptAngularOutput(rawCode: string, source?: string): string {
  if (!rawCode) return rawCode;

  let code = normalizeAngularSelector(rawCode)
    .replace(
      /(export\s+interface\s+\w+Props\s*\{)([\s\S]*?)(\})/m,
      (full, open: string, body: string, close: string) => {
        const stripped = body.replace(/^\s*children\s*\?\s*:\s*any\s*;?\s*$/gm, '');
        return stripped.trim().length > 0 ? `${open}${stripped}${close}` : full;
      }
    )
    .replace(/^\s*@Input\(\)\s+children\b[^\n]*\n?/gm, '')
    .replace(/<ng-container\s+\*ngIf=["']children["']\s*>([\s\S]*?<ng-content[\s\S]*?<\/ng-container>)/g, '<ng-container>$1');
  const ifaceInfo = source ? extractPropsInterfaceInfo(source) : null;
  const sourceDefaults = extractDefaultPropsFromSource(source);

  if (sourceDefaults.size > 0) {
    code = backfillDefaultPropsObject(code, sourceDefaults);
  }

  const candidateKeys = new Set<string>([
    ...(ifaceInfo?.keys || []),
    ...sourceDefaults.keys(),
  ]);

  const interfaceName = ifaceInfo?.interfaceName || 'any';
  const existingInputs = new Set<string>();
  const existingOutputs = new Set<string>();

  for (const m of code.matchAll(/@Input\(\)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g)) {
    existingInputs.add(m[1]!);
  }
  for (const m of code.matchAll(/@Output\(\)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g)) {
    existingOutputs.add(m[1]!);
  }

  const hasDefaultProps = /const\s+defaultProps\b/.test(code);
  const inputAdditions = buildBackfilledInputs(
    candidateKeys,
    existingInputs,
    existingOutputs,
    interfaceName,
    hasDefaultProps,
    sourceDefaults
  );

  const classMatch = code.match(/export\s+default\s+class\s+[A-Za-z0-9_$]+\s*\{/);
  if (classMatch && classMatch.index !== undefined) {
    const insertIdx = classMatch.index + classMatch[0].length;
    let extraMembers = '';
    if (/\bprops\b/.test(code) && !/\bget\s+props\s*\(/.test(code)) {
      extraMembers += `\n  get props(): any {\n    return this;\n  }\n`;
    }
    if (inputAdditions) {
      extraMembers += `\n${inputAdditions}`;
    }
    if (extraMembers) {
      code = code.slice(0, insertIdx) + extraMembers + code.slice(insertIdx);
    }
  }

  return code;
}
