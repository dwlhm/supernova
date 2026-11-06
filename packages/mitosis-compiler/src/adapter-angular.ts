import ts from 'typescript';
import { angularSelector } from './angular-selectors.js';
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

/** Property names of an object literal body; Mitosis may print every key on one line. */
function objectLiteralKeys(body: string): Set<string> {
  const sf = ts.createSourceFile('defaults.ts', `({${body}})`, ts.ScriptTarget.Latest, true);
  const keys = new Set<string>();
  const visit = (node: ts.Node): void => {
    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) if (prop.name) keys.add(prop.name.getText(sf).replace(/^["']|["']$/g, ''));
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return keys;
}

function backfillDefaultPropsObject(code: string, sourceDefaults: Map<string, string>): string {
  const range = findObjectLiteralRange(code, /const\s+defaultProps\s*:\s*any\s*=\s*\{/);
  if (!range) return code;

  const body = code.slice(range.bodyStart, range.bodyEnd);
  const existingKeys = objectLiteralKeys(body);

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

/**
 * Prefixes the selector (`spn-badge, badge`; native names like `button` stay `spn-button` only) and declares
 * `standalone: false`: the classic generator
 * declares components in an NgModule, which Angular 19+ rejects for (default) standalone components.
 */
function normalizeAngularComponentMeta(code: string): string {
  return code.replace(
    /@Component\(\s*\{([\s\S]*?)selector\s*:\s*["']([^"']+)["']/m,
    (_full, prefix: string, selector: string) => {
      const sel = selector.startsWith('spn-') ? selector : angularSelector(selector);
      const standalone = /\bstandalone\s*:/.test(prefix) ? '' : 'standalone: false, ';
      return `@Component({${prefix}${standalone}selector: "${sel}"`;
    }
  );
}

/**
 * `importMapper` for Mitosis' classic (NgModule) Angular generator. Its NgModule lists `<Name>Module`
 * for every composed sibling, but by default it drops `.lite` component imports entirely, leaving
 * those symbols undefined. Import exactly the module the NgModule references instead.
 */
export function mapAngularSiblingImport(
  _component: unknown,
  theImport: { path: string },
  values: { defaultImport?: string }
): string | undefined {
  const path = theImport.path.match(/^(\.{1,2}\/.+?)\.lite(?:\.[jt]sx?)?$/)?.[1];
  if (!path || !values.defaultImport) return undefined;
  return `import { ${values.defaultImport}Module } from "${path}";`;
}

const TEMPLATE_GLOBALS = ['Boolean', 'Number', 'String', 'Math', 'JSON', 'Array', 'Object'];

/**
 * Mitosis prints the DOM event as `event` inside `(output)="..."` bindings; Angular exposes it as `$event`,
 * typed as `Event` (so `$event.target.value` fails type-check without `$any`).
 */
function normalizeTemplateEvents(code: string): string {
  return code.replace(/template:\s*`([\s\S]*?)`/, (full, tpl: string) =>
    full.replace(tpl, tpl.replace(/(\([\w.-]+\)=")([^"]*)(")/g, (_m, open: string, body: string, close: string) =>
      `${open}${body.replace(/(?<![$\w.])event\b/g, '$event').replace(/\$event\.target\./g, '$any($event.target).')}${close}`
    ))
  );
}

/** HTML boolean attributes: present means true, so `false` must remove the attribute instead of printing "false". */
const BOOLEAN_ATTRIBUTES = ['disabled', 'checked', 'required', 'readonly', 'multiple', 'selected', 'hidden', 'open', 'autofocus', 'novalidate'];

/** Angular keeps `[attr.disabled]="false"` as `disabled="false"` (still disabled); only `null` removes it. */
function normalizeBooleanAttributes(code: string): string {
  const re = new RegExp(`\\[attr\\.(${BOOLEAN_ATTRIBUTES.join('|')})\\]="([^"]*)"`, 'g');
  return code.replace(/template:\s*`([\s\S]*?)`/, (full, tpl: string) =>
    full.replace(tpl, tpl.replace(re, (_m, name: string, expr: string) => `[attr.${name}]="(${expr}) ? '' : null"`))
  );
}

/** Templates only see component members, so JS globals used there are exposed as readonly members. */
function templateGlobalMembers(code: string): string {
  const tpl = code.match(/template:\s*`([\s\S]*?)`/)?.[1] || '';
  return TEMPLATE_GLOBALS.filter((g) => new RegExp(`(?<![\\w.$])${g}\\s*[.(]`).test(tpl))
    .map((g) => `\n  protected readonly ${g} = ${g};\n`)
    .join('');
}

/**
 * Angular Target Framework Adapter (`adapter-angular.ts`)
 * 1. Backfills missing `@Input()` declarations from `<Name>Props` and `useDefaultProps`
 *    for components where props are passed as whole objects to headless helpers (e.g. `getTableState(props)`).
 * 2. Backfills any missing values into `const defaultProps = { ... }`.
 * 3. Normalizes component selector to include the `spn-` prefix (e.g. `spn-button, button`) and
 *    declares `standalone: false` so NgModule declarations compile on Angular 19+.
 * 4. Synthesizes `get props(): this { return this; }` (typed, so generic helpers keep input types) when templates reference `props`.
 * 5. Rewrites `event` to `$event` in output bindings and exposes JS globals used by the template.
 * 6. Binds HTML boolean attributes as `'' | null` so `false` removes them.
 */
export function adaptAngularOutput(rawCode: string, source?: string): string {
  if (!rawCode) return rawCode;

  let code = normalizeBooleanAttributes(normalizeTemplateEvents(normalizeAngularComponentMeta(rawCode)))
    .replace(
      /(export\s+interface\s+\w+Props\s*\{)([\s\S]*?)(\})/m,
      (full, open: string, body: string, close: string) => {
        const stripped = body.replace(/^\s*children\s*\?\s*:\s*any\s*;?\s*$/gm, '');
        return stripped.trim().length > 0 ? `${open}${stripped}${close}` : full;
      }
    )
    .replace(/^\s*@Input\(\)\s+children\b[^\n]*\n?/gm, '')
    // `<Show when={props.children}>` guards projection; Prettier may split the closing tag (`</ng-container\n>`).
    .replace(/<ng-container\s+\*ngIf=["']children["']\s*>([\s\S]*?<ng-content[\s\S]*?<\/ng-container\s*>)/g, '<ng-container>$1');
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
      extraMembers += `\n  get props(): this {\n    return this;\n  }\n`;
    }
    extraMembers += templateGlobalMembers(code);
    if (inputAdditions) {
      extraMembers += `\n${inputAdditions}`;
    }
    if (extraMembers) {
      code = code.slice(0, insertIdx) + extraMembers + code.slice(insertIdx);
    }
  }

  return code;
}
