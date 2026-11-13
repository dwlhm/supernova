import ts from 'typescript';
import { extractDefaultPropsFromSource } from './adapter-vue3.js';

function extractTypeOnlyImportNames(source?: string): Set<string> {
  const names = new Set<string>();
  if (!source) return names;
  const sf = ts.createSourceFile('comp.tsx', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !stmt.importClause) continue;
    const named = stmt.importClause.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;
    for (const el of named.elements) {
      if (stmt.importClause.isTypeOnly || el.isTypeOnly) {
        names.add(el.name.text);
      }
    }
  }
  return names;
}

function restoreTypeOnlyImports(code: string, typeOnlyNames: Set<string>): string {
  if (typeOnlyNames.size === 0) return code;
  return code.replace(
    /import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"])/g,
    (_full, specList: string, mod: string) => {
      const updated = specList.replace(/(?<!\btype\s+)\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (tok) =>
        typeOnlyNames.has(tok) ? `type ${tok}` : tok
      );
      return `import {${updated}} from ${mod}`;
    }
  );
}

export function extractPropsInterfaceInfo(codeOrSource: string): { interfaceName: string; keys: string[] } | null {
  const sf = ts.createSourceFile('comp.tsx', codeOrSource, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
  let targetInterface: ts.InterfaceDeclaration | null = null;
  for (const stmt of sf.statements) {
    if (ts.isInterfaceDeclaration(stmt) && stmt.name.text.endsWith('Props')) {
      targetInterface = stmt;
    }
  }
  if (!targetInterface) return null;
  const keys: string[] = [];
  for (const member of targetInterface.members) {
    if (ts.isPropertySignature(member) && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))) {
      if (member.name.text !== 'children') {
        keys.push(member.name.text);
      }
    }
  }
  return { interfaceName: targetInterface.name.text, keys };
}

/**
 * Svelte Target Framework Adapter (`adapter-svelte.ts`)
 * 1. Restores missing `export let <prop>` declarations (with `useDefaultProps` defaults) when props
 *    are passed as a whole `props` object to headless helpers (`get*State(props)`).
 * 2. Synthesizes a reactive `$: props = { ... };` binding whenever `props` is referenced in the component.
 * 3. Ensures reactive getter closures `$: foo = () => { ... }` reference local state variables at the top level.
 */
export function adaptSvelteOutput(rawCode: string, source?: string): string {
  let code = restoreTypeOnlyImports(rawCode, extractTypeOnlyImportNames(source))
    .replace(
      /(?<!=)\{(icon|[a-zA-Z0-9_]+Icon)\}/g,
      '{#if $1}<svelte:component this={$1} class="h-4 w-4 shrink-0" />{:else}<slot name="$1" />{/if}'
    )
    .replace(
      /(export\s+interface\s+\w+Props\s*\{)([\s\S]*?)(\})/m,
      (full, open: string, body: string, close: string) => {
        const stripped = body.replace(/^\s*children\s*\?\s*:\s*any\s*;?\s*$/gm, '');
        return stripped.trim().length > 0 ? `${open}${stripped}${close}` : full;
      }
    );
  const instanceScriptRegex = /(<script(?![^>]*context=["']module["'])[^>]*>)([\s\S]*?)(<\/script>)/;
  const scriptMatch = code.match(instanceScriptRegex);
  if (!scriptMatch) return code;

  const moduleMatch = code.match(/<script[^>]*context=["']module["'][^>]*>([\s\S]*?)<\/script>/);
  const ifaceInfo = extractPropsInterfaceInfo(source || moduleMatch?.[1] || '');
  const defaults = extractDefaultPropsFromSource(source);

  let scriptBody = scriptMatch[2]!;
  if (/<slot\b/.test(code) && !/\binterface\s+\$\$Slots\b/.test(scriptBody)) {
    const slotNames = new Set<string>(['default']);
    for (const m of code.matchAll(/<slot\s+[^>]*name=["']([a-zA-Z0-9_-]+)["']/g)) {
      slotNames.add(m[1]!);
    }
    const slotLines = [...slotNames].map((s) => `    ${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s) ? s : `'${s}'`}: Record<string, never>;`).join('\n');
    scriptBody = `\n  interface $$Slots {\n${slotLines}\n  }${scriptBody}`;
    code = code.replace(instanceScriptRegex, (_m, open: string, _b: string, close: string) => `${open}${scriptBody}${close}`);
  }
  const exportedVars = new Set<string>();
  for (const m of scriptBody.matchAll(/^\s*export\s+let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/gm)) {
    exportedVars.add(m[1]!);
  }

  const candidateKeys = new Set<string>([
    ...(ifaceInfo?.keys || []),
    ...defaults.keys(),
  ]);
  const addedExports: string[] = [];
  for (const key of candidateKeys) {
    if (key === 'children' || exportedVars.has(key)) continue;
    const typeAnnot = ifaceInfo ? `: ${ifaceInfo.interfaceName}["${key}"]` : '';
    const defVal = defaults.get(key);
    addedExports.push(
      defVal !== undefined
        ? `  export let ${key}${typeAnnot} = ${defVal};`
        : `  export let ${key}${typeAnnot};`
    );
    exportedVars.add(key);
  }

  const nonModuleCode = code.replace(/<script[^>]*context=["']module["'][^>]*>[\s\S]*?<\/script>/, '');
  const needsPropsObject =
    /\bprops\b/.test(nonModuleCode) && !/\blet\s+props\b|\$:\s*props\s*=/.test(scriptBody);

  if (addedExports.length > 0 || needsPropsObject) {
    const extraLines = [...addedExports];
    if (needsPropsObject) {
      extraLines.push(`  $: props = { ${[...exportedVars].join(', ')} };`);
    }
    scriptBody = `${scriptBody.trimEnd()}\n${extraLines.join('\n')}\n`;
    code = code.replace(instanceScriptRegex, (_m, open: string, _b: string, close: string) => `${open}${scriptBody}${close}`);
  }

  const localVars = new Set<string>();
  for (const m of scriptBody.matchAll(/^\s*let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/gm)) {
    const varName = m[1]!;
    if (!scriptBody.includes(`export let ${varName}`)) {
      localVars.add(varName);
    }
  }

  if (localVars.size === 0) return code;

  return code.replace(
    /^(\s*\$:\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*)(\(\)\s*=>\s*\{[\s\S]*?\n\s*\});/gm,
    (full, lhs: string, fnBody: string) => {
      const used: string[] = [];
      for (const v of localVars) {
        if (new RegExp(`\\b${v}\\b`).test(fnBody)) {
          used.push(v);
        }
      }
      if (used.length === 0) return full;
      return `${lhs}(${used.join(', ')}, ${fnBody});`;
    }
  );
}
