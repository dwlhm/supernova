import * as mitosisModule from '@builder.io/mitosis';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { utilsModule } from './utils-chart.js';
import type { CompileError } from './types.js';

const mitosis = (mitosisModule as any).default ?? mitosisModule;
const parseJsx = mitosis.parseJsx ?? mitosisModule.parseJsx;
const componentToReact = mitosis.componentToReact ?? mitosisModule.componentToReact;

const require_ = createRequire(import.meta.url);
export const React = require_('react');
const ReactJsxRuntime = require_('react/jsx-runtime');
export const ReactDomServer = require_('react-dom/server');

let ReactJsxDevRuntime: any;
try {
  ReactJsxDevRuntime = require_('react/jsx-dev-runtime');
} catch {
  ReactJsxDevRuntime = ReactJsxRuntime;
}

export class KnownRenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KnownRenderError';
  }
}

const KEBAB_TO_REACT_ATTR: Record<string, string> = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'vector-effect': 'vectorEffect',
  maxlength: 'maxLength',
  minlength: 'minLength',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  autocomplete: 'autoComplete',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
};

function normalizeReactAstAttrs(node: any): void {
  if (!node || typeof node !== 'object') return;
  if (node['@type'] === '@builder.io/mitosis/node') {
    for (const [kebab, camel] of Object.entries(KEBAB_TO_REACT_ATTR)) {
      if (node.properties && kebab in node.properties) {
        node.properties[camel] = node.properties[kebab];
        delete node.properties[kebab];
      }
      if (node.bindings && kebab in node.bindings) {
        node.bindings[camel] = node.bindings[kebab];
        delete node.bindings[kebab];
      }
    }
  }
  for (const val of Object.values(node)) {
    if (Array.isArray(val)) val.forEach(normalizeReactAstAttrs);
    else if (val && typeof val === 'object') normalizeReactAstAttrs(val);
  }
}

export async function compileSourceToJs(source: string): Promise<string> {
  const parsed = parseJsx(source, { typescript: true });
  normalizeReactAstAttrs(parsed);
  const generator = componentToReact({ typescript: true, prettier: false });
  const res = generator({ component: parsed });
  const reactSource = typeof res === 'string' ? res : await res;
  const stripped = reactSource.replace(/['"]use client['"];?/g, '');
  const transpiled = ts.transpileModule(stripped, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  return transpiled.outputText;
}

export function findSiblingEntry(
  id: string,
  siblingSources?: Record<string, string>
): { key: string; source: string } | null {
  if (!siblingSources) return null;
  if (Object.prototype.hasOwnProperty.call(siblingSources, id)) {
    return { key: id, source: siblingSources[id]! };
  }
  const normalizedId = id.replace(/^\.\//, '');
  if (Object.prototype.hasOwnProperty.call(siblingSources, normalizedId)) {
    return { key: normalizedId, source: siblingSources[normalizedId]! };
  }
  // Siblings are keyed by component name, so `../components/Stepper.lite` resolves like `./Stepper.lite`.
  const fileName = normalizedId.split('/').pop() || normalizedId;
  const baseName = fileName.replace(/\.lite(\.[jt]sx?)?$/, '').replace(/\.[jt]sx?$/, '');
  const candidates = [
    baseName,
    `${baseName}.lite`,
    `./${baseName}`,
    `./${baseName}.lite`,
    `${baseName}.lite.tsx`,
    `${baseName}.lite.jsx`,
    `${baseName}.tsx`,
    `${baseName}.jsx`,
  ];
  for (const candidate of candidates) {
    if (Object.prototype.hasOwnProperty.call(siblingSources, candidate)) {
      return { key: candidate, source: siblingSources[candidate]! };
    }
  }
  return null;
}

function buildAliases(nameOrId: string): string[] {
  const normalized = nameOrId.replace(/^\.\//, '');
  const base = normalized.replace(/\.lite(\.[jt]sx?)?$/, '').replace(/\.[jt]sx?$/, '');
  return [nameOrId, normalized, base, `./${base}`, `${base}.lite`, `./${base}.lite`];
}

function isUtilsImport(id: string): boolean {
  return (
    id === './utils' ||
    id === './utils.js' ||
    id === 'utils' ||
    id === '../utils' ||
    id === '../utils.js' ||
    id.endsWith('/utils') ||
    id.endsWith('/utils.js')
  );
}

export async function loadRenderedComponent(
  componentName: string,
  source: string,
  siblingSources: Record<string, string> | undefined,
  errors: CompileError[]
): Promise<any> {
  const transpiledMap = new Map<string, string>();
  const siblingCompileErrors = new Map<string, unknown>();

  const rootJs = await compileSourceToJs(source);
  transpiledMap.set('__root__', rootJs);

  if (siblingSources) {
    const queue = [source];
    const visited = new Set<string>();
    while (queue.length > 0) {
      const current = queue.pop()!;
      const importRe = /(?:from|require\()\s*['"](\.[^'"]+)['"]/g;
      let match: RegExpExecArray | null;
      while ((match = importRe.exec(current)) !== null) {
        const id = match[1]!;
        if (isUtilsImport(id)) continue;
        const entry = findSiblingEntry(id, siblingSources);
        if (entry && !visited.has(entry.key)) {
          visited.add(entry.key);
          try {
            transpiledMap.set(entry.key, await compileSourceToJs(entry.source));
            queue.push(entry.source);
          } catch (err: unknown) {
            siblingCompileErrors.set(entry.key, err);
          }
        }
      }
    }
  }

  const moduleCache = new Map<string, any>();
  const loadingStack = new Set<string>(buildAliases(componentName));

  function createCustomRequire(): (id: string) => any {
    return function customRequire(id: string): any {
      if (id === 'react') return React;
      if (id === 'react/jsx-runtime') return ReactJsxRuntime;
      if (id === 'react/jsx-dev-runtime') return ReactJsxDevRuntime;
      if (id === 'react-dom/server') return ReactDomServer;
      if (isUtilsImport(id)) return utilsModule;

      if (buildAliases(id).some((a) => loadingStack.has(a))) {
        errors.push({ target: 'render', rule: 'cyclic-import', message: `Cyclic import detected: ${id}` });
        throw new KnownRenderError(`Cyclic import detected: ${id}`);
      }

      const sibling = findSiblingEntry(id, siblingSources);
      if (!sibling) {
        errors.push({ target: 'render', rule: 'unresolved-import', message: `Unresolved import: ${id}` });
        throw new KnownRenderError(`Unresolved import: ${id}`);
      }

      const siblingKey = sibling.key;
      const aliases = buildAliases(siblingKey);
      if (aliases.some((a) => loadingStack.has(a))) {
        errors.push({ target: 'render', rule: 'cyclic-import', message: `Cyclic import detected: ${id}` });
        throw new KnownRenderError(`Cyclic import detected: ${id}`);
      }
      if (moduleCache.has(siblingKey)) return moduleCache.get(siblingKey);
      if (siblingCompileErrors.has(siblingKey)) throw siblingCompileErrors.get(siblingKey);

      const code = transpiledMap.get(siblingKey);
      if (!code) {
        errors.push({ target: 'render', rule: 'unresolved-import', message: `Unresolved import: ${id}` });
        throw new KnownRenderError(`Unresolved import: ${id}`);
      }

      for (const a of aliases) loadingStack.add(a);
      try {
        const mod = { exports: {} };
        const fn = new Function('require', 'module', 'exports', code);
        fn(createCustomRequire(), mod, mod.exports);
        moduleCache.set(siblingKey, mod.exports);
        return mod.exports;
      } finally {
        for (const a of aliases) loadingStack.delete(a);
      }
    };
  }

  const rootMod = { exports: {} };
  const rootFn = new Function('require', 'module', 'exports', rootJs);
  rootFn(createCustomRequire(), rootMod, rootMod.exports);
  for (const a of buildAliases(componentName)) loadingStack.delete(a);
  return (rootMod.exports as any).default || rootMod.exports;
}
