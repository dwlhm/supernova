// Turns compiled `<Name>Example` components into preview-ready sources and consumer usage snippets.

export const EXAMPLE_SUFFIX = 'Example';

const PACKAGE = '@supernova/design-system';
const RELATIVE_IMPORT_RE = /^\s*import\s+(?:(\w+)|\{([^}]*)\})\s+from\s+["']\.{1,2}\/[^"']*["'];?\s*$/gm;

/** Parent component of an example file name, e.g. `StepperExample` -> `Stepper`. */
export function exampleParent(name) {
  return name.endsWith(EXAMPLE_SUFFIX) && name.length > EXAMPLE_SUFFIX.length
    ? name.slice(0, -EXAMPLE_SUFFIX.length)
    : undefined;
}

/** Examples import `../components/X.lite`; the preview output directories are flat. */
export function flattenExampleImports(source) {
  return source.replace(/(["'])\.\.\/(?:components|icons)\//g, '$1./');
}

function collectRelativeImports(code) {
  const names = [];
  const stripped = code.replace(RELATIVE_IMPORT_RE, (_line, def, named) => {
    if (def) names.push(def);
    if (named) names.push(...named.split(',').map((n) => n.trim()).filter(Boolean));
    return '';
  });
  return { names, stripped };
}

function packageImport(names, framework, indent = '') {
  return `${indent}import { ${names.join(', ')} } from '${PACKAGE}/${framework}';`;
}

function reactUsage(code, names) {
  const body = code
    .replace(/^\s*Object\.assign\([^;]*\);\s*$/m, '')
    .replace(/\bfunction (\w+)\(props: any\)/, 'function $1()')
    .replace(/^import \* as React from "react";\n?/m, '');
  return `${packageImport(names, 'react')}\n${body.trim()}\n`;
}

function scriptUsage(code, names, framework, indent) {
  return code.replace(/<script([^>]*)>\n?/, (open) => `${open}${packageImport(names, framework, indent)}\n`);
}

/** Consumer-facing snippet: relative sibling imports become one package import. */
export function toUsageSnippet(framework, code) {
  const { names, stripped } = collectRelativeImports(code);
  const cleaned = stripped.replace(/\n{3,}/g, '\n\n').replace(/\n\s*\n(\s*<\/script>)/g, '\n$1');
  if (names.length === 0) return cleaned.trim() + '\n';
  if (framework === 'react') return reactUsage(cleaned, names);
  if (framework === 'angular') return `${packageImport(names, 'angular')}\n${cleaned.trim()}\n`;
  return scriptUsage(cleaned, names, framework, framework === 'svelte' ? '  ' : '').trim() + '\n';
}

export const FRAMEWORKS = ['vue3', 'react', 'svelte', 'vue2', 'angular'];

/**
 * Compiles every example whose parent component exists and hands each framework artifact to
 * `writeArtifact`; returns `{ parents, usage }` for the registry and the usage panel.
 */
export async function compileExamples({ compileMitosis, entries, componentNames, readSource, writeArtifact }) {
  const parents = [];
  const usage = {};
  for (const { name, filePath } of entries) {
    const parent = exampleParent(name);
    if (!parent || !componentNames.has(parent)) continue;
    const result = await compileMitosis({
      componentName: name,
      source: flattenExampleImports(await readSource(filePath)),
      targets: FRAMEWORKS,
      normalize: true,
      checks: { lint: false },
    });
    if (!result.success) {
      const errMsgs = (result.errors || []).map((e) => `[${e.target}] ${e.message}`).join(', ');
      throw new Error(`Failed to compile example ${name}: ${errMsgs}`);
    }
    usage[parent] = {};
    for (const artifact of result.artifacts) {
      if (!FRAMEWORKS.includes(artifact.target)) continue;
      usage[parent][artifact.target] = toUsageSnippet(artifact.target, artifact.code);
      await writeArtifact(artifact);
    }
    parents.push(parent);
  }
  return { parents, usage };
}
