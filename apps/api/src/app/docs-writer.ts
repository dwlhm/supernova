import * as fs from 'node:fs';
import * as path from 'node:path';
import { getUtilsSource } from '@komerce-design/mitosis-compiler';
import { artifactPath, GROUP_COMPONENTS, GROUP_EXAMPLES, GROUP_ICONS, normalizeGroup, validFileName } from '../domain/artifact-path.js';
import { camelToKebab, DomainError, normalizeComponentName, type CompiledArtifact, type FigmaComponentSpec, type Job } from '../domain/models.js';
import { extractRegistryMetaFromLiteSource, type RegistryComponentMeta } from './docgen-ast.js';
import { generateComponentDoc, generateComponentsIndexDoc, generateTokensDoc } from './docgen.js';

const COMPOUND_PARENTS = [
  'InputMultipleFileUpload', 'InputDropdown', 'ToggleGroup', 'Breadcrumb', 'BubbleChat',
  'Card', 'Chart', 'Topbar', 'Sidebar', 'Stepper', 'Table', 'Toast',
] as const;

export function inferCompoundParent(compName: string): string | undefined {
  if (compName === 'TabItem') return 'Tabs';
  for (const parent of COMPOUND_PARENTS) {
    if (compName !== parent && compName.startsWith(parent)) return parent;
  }
  return undefined;
}

export function resolveComponentGroup(
  rawGroup: string | undefined,
  compName: string,
  compSpec?: FigmaComponentSpec
): string {
  const norm = normalizeGroup(rawGroup);
  if (norm) return norm;
  if (compSpec?.pageName && compSpec.pageName.toLowerCase() === GROUP_ICONS) return GROUP_ICONS;
  if (compName.toLowerCase().includes('icon')) return GROUP_ICONS;
  return GROUP_COMPONENTS;
}

/** Derived compound parts of `parent` (excluding examples), by name. */
function siblingSourcesOf(
  parent: string,
  authoredComponents: Record<string, string>,
  derivedFrom: Record<string, string>,
  groups: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(authoredComponents)
      .filter(
        ([name, code]) =>
          Boolean(code) &&
          name !== parent &&
          groups[name] !== GROUP_EXAMPLES &&
          !name.endsWith('Example') &&
          (derivedFrom[name] === parent ||
            inferCompoundParent(name) === parent ||
            (parent === 'ToggleGroup' && name === 'Toggle'))
      )
      .map(([name, code]) => [name, code])
  );
}

export function buildDocArtifacts(
  job: Job,
  authoredComponents: Record<string, string>,
  derivedFrom: Record<string, string> = {},
  groups: Record<string, string> = {}
): CompiledArtifact[] {
  const tokensDoc = generateTokensDoc(job.document.tokens || []);
  const primaryComponents = (job.document.components || []).filter((comp) => {
    const compName = normalizeComponentName(comp.name);
    const grp = groups[compName] || resolveComponentGroup(undefined, compName, comp);
    return grp === GROUP_COMPONENTS && !derivedFrom[compName] && !inferCompoundParent(compName);
  });
  const indexDoc = generateComponentsIndexDoc(primaryComponents);
  const docArtifacts: CompiledArtifact[] = [
    { target: 'docs', fileName: 'tokens.md', group: 'docs', code: tokensDoc },
    { target: 'docs', fileName: 'index.md', group: 'docs', code: indexDoc },
  ];

  for (const comp of primaryComponents) {
    const compName = normalizeComponentName(comp.name);
    const kebabName = camelToKebab(compName);
    const sourceCode = authoredComponents[compName];
    docArtifacts.push({
      target: 'docs',
      fileName: `${kebabName}.md`,
      group: 'docs',
      code: generateComponentDoc(comp, sourceCode, siblingSourcesOf(compName, authoredComponents, derivedFrom, groups)),
    });
  }
  return docArtifacts;
}

function loadExistingRegistryMetadata(registryPath: string): Record<string, RegistryComponentMeta> {
  if (!fs.existsSync(registryPath)) return {};
  try {
    const content = fs.readFileSync(registryPath, 'utf8');
    const match = content.match(/export const componentMetadata:\s*Record<string,\s*ComponentMeta>\s*=\s*(\{[\s\S]*\});/);
    if (match?.[1]) return JSON.parse(match[1]) as Record<string, RegistryComponentMeta>;
  } catch {
    // Ignore malformed existing registry
  }
  return {};
}

function buildComponentMetadataMap(
  components: FigmaComponentSpec[],
  groups: Record<string, string>,
  authoredComponents: Record<string, string>,
  existingMeta: Record<string, RegistryComponentMeta>
): Record<string, RegistryComponentMeta> {
  const res: Record<string, RegistryComponentMeta> = { ...existingMeta };
  for (const comp of components) {
    const compName = normalizeComponentName(comp.name);
    const group = groups[compName] || resolveComponentGroup(undefined, compName, comp);
    const sourceCode = authoredComponents[compName];
    if (sourceCode) {
      res[compName] = extractRegistryMetaFromLiteSource(compName, group, sourceCode);
      continue;
    }
    const variants: Record<string, string[]> = {};
    if (comp.properties) {
      for (const [rawKey, val] of Object.entries(comp.properties)) {
        const cleanKey = rawKey.split('#')[0]?.trim() || '';
        if (!cleanKey || !val || typeof val !== 'object') continue;
        const rawOpts = (val as any).variantOptions;
        if (Array.isArray(rawOpts)) {
          const opts = rawOpts.map((o) => String(o).trim()).filter(Boolean);
          if (opts.length > 0) variants[cleanKey] = opts;
        }
      }
    }
    const varValues = Object.values(variants);
    const totalVariants = varValues.length > 0 ? varValues.reduce((acc, opts) => acc * opts.length, 1) : 0;
    res[compName] = { name: compName, group, variants, booleans: [], totalVariants };
  }
  return res;
}

export function syncDocsDirectory(
  docsDir: string,
  job: Job,
  docArtifacts: CompiledArtifact[],
  componentGroups: Record<string, string>,
  authoredComponents: Record<string, string> = {}
): void {
  if (!docsDir) return;
  fs.mkdirSync(docsDir, { recursive: true });
  const compDir = path.join(docsDir, 'components');
  fs.mkdirSync(compDir, { recursive: true });

  for (const art of docArtifacts) {
    const targetPath = art.fileName === 'tokens.md' ? path.join(docsDir, 'tokens.md') : path.join(compDir, art.fileName);
    if (art.fileName === 'index.md' && fs.existsSync(targetPath) && fs.readFileSync(targetPath, 'utf8').includes('<ComponentCatalog')) {
      continue;
    }
    fs.writeFileSync(targetPath, art.code, 'utf8');
  }

  const previewCompDir = path.join(docsDir, '.vitepress', 'theme', 'preview');
  const registryPath = path.join(previewCompDir, 'registry.ts');
  const existingMeta = loadExistingRegistryMetadata(registryPath);

  for (const sub of ['vue3', 'react', 'svelte']) {
    fs.mkdirSync(path.join(previewCompDir, sub), { recursive: true });
  }
  fs.writeFileSync(path.join(previewCompDir, 'utils.ts'), getUtilsSource(), 'utf8');

  const componentNames = new Set<string>(Object.keys(existingMeta));
  for (const existingFile of fs.readdirSync(path.join(previewCompDir, 'vue3'))) {
    if (existingFile.endsWith('.vue')) componentNames.add(existingFile.slice(0, -'.vue'.length));
  }

  for (const art of job.artifacts) {
    if (!['vue3', 'react', 'svelte'].includes(art.target)) continue;
    if (!validFileName(art.fileName) || art.fileName.startsWith('index.')) continue;
    const baseName = art.fileName.replace(/\.(vue|tsx|svelte)$/, '');
    componentNames.add(baseName);
    fs.writeFileSync(path.join(previewCompDir, art.target, art.fileName), art.code, 'utf8');
  }

  const sortedNames = [...componentNames].sort();
  const metaMap = buildComponentMetadataMap(job.document.components || [], componentGroups, authoredComponents, existingMeta);
  const loaderEntries = sortedNames
    .map((name) => `  '${name}': { vue3: () => import('./vue3/${name}.vue'), react: () => import('./react/${name}.tsx'), svelte: () => import('./svelte/${name}.svelte') },`)
    .join('\n');

  const regContent = `// Auto-generated component registry for VitePress Multi-Framework Preview
export interface ComponentLoader {
  vue3?: () => Promise<any>;
  react?: () => Promise<any>;
  svelte?: () => Promise<any>;
}

export interface ComponentMeta {
  name: string;
  group?: string;
  variants?: Record<string, string[]>;
  booleans?: string[];
  totalVariants?: number;
}

export const componentRegistry: Record<string, ComponentLoader> = {
${loaderEntries}
};

export const componentMetadata: Record<string, ComponentMeta> = ${JSON.stringify(metaMap, null, 2)};
`;

  fs.writeFileSync(registryPath, regContent, 'utf8');
}

export function syncGeneratedDirectory(generatedDir: string, artifacts: CompiledArtifact[]): void {
  if (!generatedDir) return;
  for (const art of artifacts) {
    let relPath: string;
    try {
      relPath = artifactPath(art);
    } catch (err) {
      if (err instanceof DomainError && err.code === 'UNPUBLISHED_TARGET') continue;
      throw err;
    }
    const destPath = path.join(generatedDir, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, art.code, 'utf8');
  }
}
