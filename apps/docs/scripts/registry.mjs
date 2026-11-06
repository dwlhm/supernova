// Renders `.vitepress/theme/preview/registry.ts`: per-framework loaders, examples, metadata and build diagnostics.

/** Directory and file extension of each framework's preview module. */
const LOADER_PATHS = {
  vue3: (file) => `./vue3/${file}.vue`,
  react: (file) => `./react/${file}.tsx`,
  svelte: (file) => `./svelte/${file}.svelte`,
  vue2: (file) => `./vue2/${file}.js`,
  angular: (file) => `./angular/${file}.js`,
};

/** `built[framework]` lists files that exist; frameworks without a set (vue3/react/svelte) always build. */
function loaderLine(key, file, built) {
  const loaders = Object.entries(LOADER_PATHS)
    .filter(([fw]) => !built[fw] || built[fw].has(file))
    .map(([fw, toPath]) => `${fw}: () => import('${toPath(file)}')`);
  return `  '${key}': { ${loaders.join(', ')} },`;
}

export function renderRegistry({ componentNames, exampleParents, metaMap, built, errors }) {
  return `// Auto-generated component registry for VitePress Multi-Framework Preview
export type PreviewFramework = ${Object.keys(LOADER_PATHS).map((fw) => `'${fw}'`).join(' | ')};

export type ComponentLoader = Partial<Record<PreviewFramework, () => Promise<any>>>;

export interface ComponentMeta {
  name: string;
  group?: string;
  variants?: Record<string, string[]>;
  booleans?: string[];
  totalVariants?: number;
}

export const componentRegistry: Record<string, ComponentLoader> = {
${componentNames.map((name) => loaderLine(name, name, built)).join('\n')}
};

/** Composition examples keyed by their parent component; previews prefer these over prop-driven mounts. */
export const componentExamples: Record<string, ComponentLoader> = {
${exampleParents.map((parent) => loaderLine(parent, `${parent}Example`, built)).join('\n')}
};

/** Why a component (or example, keyed by file name) has no preview module for a framework. */
export const previewBuildErrors: Record<string, Partial<Record<PreviewFramework, string>>> = ${JSON.stringify(errors, null, 2)};

export const componentMetadata: Record<string, ComponentMeta> = ${JSON.stringify(metaMap, null, 2)};
`;
}
