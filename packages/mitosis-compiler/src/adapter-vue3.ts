import ts from 'typescript';
import { fixVue3ComputedRefs } from './vue3-computed.js';

export function extractDefaultPropsFromSource(source?: string): Map<string, string> {
  const defaults = new Map<string, string>();
  if (!source) return defaults;
  const sf = ts.createSourceFile('comp.lite.tsx', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'useDefaultProps' &&
      node.arguments.length > 0
    ) {
      const arg = node.arguments[0]!;
      if (ts.isObjectLiteralExpression(arg)) {
        for (const prop of arg.properties) {
          if (ts.isPropertyAssignment(prop) && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
            defaults.set(prop.name.text, prop.initializer.getText(sf));
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return defaults;
}

/**
 * Vue 3 Target Framework Adapter (`adapter-vue3.ts`)
 * 1. Fixes chained computed ref unwrapping and useSlots() via `fixVue3ComputedRefs`.
 * 2. Backfills any `useDefaultProps` entries dropped by Mitosis when props are passed as a whole object.
 * 3. Wraps array and object literal defaults inside `withDefaults(defineProps<...>(), { ... })`
 *    into factory functions `() => [...]` / `() => ({...})` as required by Vue 3 + TypeScript.
 */
export function adaptVue3Output(rawCode: string, source?: string): string {
  const fixedComputed = fixVue3ComputedRefs(rawCode);
  const sourceDefaults = extractDefaultPropsFromSource(source);

  let code = fixedComputed.replace(
    /(export\s+interface\s+\w+Props\s*\{)([\s\S]*?)(\})/m,
    (full, open: string, body: string, close: string) => {
      const stripped = body.replace(/^\s*children\s*\?\s*:\s*any\s*;?\s*$/gm, '');
      return stripped.trim().length > 0 ? `${open}${stripped}${close}` : full;
    }
  );

  code = code.replace(
    /(withDefaults\(\s*defineProps<[\s\S]*?>\(\)\s*,\s*\{)([\s\S]*?)(\}\s*\))/m,
    (_full, prefix: string, body: string, suffix: string) => {
      const cleanedBody = body.replace(/^\s*children\s*:\s*undefined\s*,?\s*$/gm, '');
      const existingKeys = new Set<string>();
      for (const m of cleanedBody.matchAll(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/gm)) {
        existingKeys.add(m[1]!);
      }
      let augmentedBody = cleanedBody;
      for (const [key, valText] of sourceDefaults.entries()) {
        if (!existingKeys.has(key) && key !== 'children') {
          const trimmedBody = augmentedBody.trimEnd();
          const needsComma = trimmedBody.length > 0 && !trimmedBody.endsWith(',');
          augmentedBody = `${trimmedBody}${needsComma ? ',' : ''}\n  ${key}: ${valText},\n`;
        }
      }
      const normalizedBody = augmentedBody.replace(
        /^(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*)(\[[\s\S]*?\]|\{[\s\S]*?\})(\s*,?\s*)$/gm,
        (_m, keyPart: string, literalPart: string, tail: string) => {
          const trimmed = literalPart.trim();
          if (trimmed.startsWith('[')) {
            return `${keyPart}() => ${trimmed}${tail}`;
          }
          if (trimmed.startsWith('{')) {
            return `${keyPart}() => (${trimmed})${tail}`;
          }
          return `${keyPart}${literalPart}${tail}`;
        }
      );
      return `${prefix}${normalizedBody}${suffix}`;
    }
  );

  if (/<slot\b/.test(code) && !/\bdefineSlots\b/.test(code)) {
    code = code.replace(/<\/script>\s*$/, 'defineSlots<{ default?: () => any }>();\n</script>');
  }

  return code;
}
