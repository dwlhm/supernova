#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths
const docsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(docsRoot, '../..');
const templateRoot = path.resolve(repoRoot, 'templates/ds-repo');

const LEGACY_COMPONENT_NAME_MAP = {
  FileInput: 'InputFileInput',
  MultipleFileUpload: 'InputMultipleFileUpload',
  Placeholder: 'IconPlaceholder',
  TruckDelivery: 'IconTruckDelivery',
  TablerTruckDelivery: 'IconTruckDelivery',
};

function canonicalComponentName(rawName) {
  return LEGACY_COMPONENT_NAME_MAP[rawName] || rawName;
}

async function hasLiteComponents(dir) {
  try {
    const entries = await fs.readdir(path.resolve(dir, 'src/components'));
    return entries.some((f) => f.endsWith('.lite.tsx'));
  } catch {
    return false;
  }
}

async function resolveDsRepoRoot() {
  if (process.env.DS_REPO_DIR) {
    return path.resolve(process.env.DS_REPO_DIR);
  }
  if (await hasLiteComponents(repoRoot)) {
    return repoRoot;
  }
  return templateRoot;
}

// Target paths
const targetPreviewDir = path.resolve(docsRoot, '.vitepress/theme/preview');
const targetVue3Dir = path.resolve(targetPreviewDir, 'vue3');
const targetReactDir = path.resolve(targetPreviewDir, 'react');
const targetSvelteDir = path.resolve(targetPreviewDir, 'svelte');
const targetUtilsFile = path.resolve(targetPreviewDir, 'utils.ts');
const targetRegistryFile = path.resolve(targetPreviewDir, 'registry.ts');
const targetTokensDir = path.resolve(docsRoot, '.vitepress/theme/tokens');

async function loadCompiler() {
  try {
    return await import('@supernova/mitosis-compiler');
  } catch {
    const fallbackPath = path.resolve(repoRoot, 'packages/mitosis-compiler/dist/index.js');
    return await import(fallbackPath);
  }
}

async function readDirSafe(dirPath) {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

async function collectFromRoot(rootDir) {
  const componentsSrcDir = path.resolve(rootDir, 'src/components');
  const iconsSrcDir = path.resolve(rootDir, 'src/icons');
  const componentFiles = (await readDirSafe(componentsSrcDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => {
      const rawName = f.replace(/\.lite\.tsx$/, '');
      return {
        name: canonicalComponentName(rawName),
        group: 'components',
        filePath: path.join(componentsSrcDir, f),
      };
    });

  const iconFiles = (await readDirSafe(iconsSrcDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => {
      const rawName = f.replace(/\.lite\.tsx$/, '');
      return {
        name: canonicalComponentName(rawName),
        group: 'icons',
        filePath: path.join(iconsSrcDir, f),
      };
    });

  return [...componentFiles, ...iconFiles];
}

async function getLiteComponentFiles(dsRepoRoot) {
  const byName = new Map();
  // Always seed from templates/ds-repo baseline so partial PR branches never miss core components
  for (const entry of await collectFromRoot(templateRoot)) {
    byName.set(entry.name, entry);
  }
  if (path.resolve(dsRepoRoot) !== path.resolve(templateRoot)) {
    for (const entry of await collectFromRoot(dsRepoRoot)) {
      byName.set(entry.name, entry);
    }
  }
  return [...byName.values()];
}

function extractMetadataFromSource(name, group, source) {
  const variants = {};
  const booleans = [];
  let hasErrorMessageProp = false;
  const interfaceMatch = source.match(/export\s+interface\s+\w+Props\s*\{([\s\S]*?)\}/);
  if (interfaceMatch) {
    const body = interfaceMatch[1];
    const propRegex = /^\s*([a-zA-Z0-9_]+)\??\s*:\s*([^;\n]+);/gm;
    let match;
    while ((match = propRegex.exec(body)) !== null) {
      const propName = match[1];
      const propType = match[2].trim();
      if (propName === 'target' || propName === 'role' || propName === 'ariaHidden') continue;
      if (propName === 'errorMessage') {
        hasErrorMessageProp = true;
      }
      if (propType === 'boolean') {
        if (/^(show[A-Z]|disabled$|active$|checked$|expanded$|open$|pressed$|destructive$|indeterminate$|area$|required$)/.test(propName)) {
          booleans.push(propName);
        }
      } else if (propType.includes("'") || propType.includes('"')) {
        const unionParts = propType
          .split('|')
          .map((p) => p.trim())
          .filter((p) => /^['"][^'"]+['"]$/.test(p))
          .map((p) => p.slice(1, -1));
        if (unionParts.length >= 2) {
          variants[propName] = unionParts;
        }
      }
    }
  }
  if (hasErrorMessageProp) {
    variants.previewState = ['default', 'filled', 'focus', 'error', 'disabled'];
  }
  const counts = Object.values(variants).map((v) => v.length);
  const totalVariants = counts.length > 0 ? counts.reduce((acc, c) => acc * c, 1) : 0;
  return {
    name,
    group,
    variants,
    booleans,
    totalVariants,
  };
}

const FONT_WEIGHT_MAP = {
  thin: '100',
  extralight: '200',
  light: '300',
  regular: '400',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

function normalizeTokenCssValues(css) {
  return css.replace(/^(\s*--([a-z0-9-]+)):\s*([^;]+);/gm, (full, prefix, key, rawVal) => {
    const v = rawVal.trim();
    if (/weight/i.test(key) && FONT_WEIGHT_MAP[v.toLowerCase()]) {
      return `${prefix}: ${FONT_WEIGHT_MAP[v.toLowerCase()]};`;
    }
    if (!key.startsWith('color-') && /(^|-)opacity(-|$)/i.test(key) && /^-?\d+(\.\d+)?$/.test(v)) {
      const n = Number(v);
      if (n > 1 && n <= 100) {
        return `${prefix}: ${Number((n / 100).toFixed(4))};`;
      }
    }
    if (/(font-size|line-height)/i.test(key) && /^-?\d+(\.\d+)?$/.test(v) && Number(v) !== 0) {
      return `${prefix}: ${v}px;`;
    }
    return full;
  });
}

function buildDarkTokensBlock(css) {
  const lines = ['.dark {'];
  const re = /(--color-components-[a-z0-9-]+):\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const [, name, rawVal] = m;
    const val = rawVal.trim();
    const isInk = /(foreground|text|fill|stroke|label|title|heading|value|icon|wordmark|nav|current-page)/.test(name);
    const isColoredBadge = /badge-(primary|success|warning|info|destructive)/.test(name);
    const isSurface = /(background|surface)/.test(name) && !/(thumb|status|indicator|primary|destructive|accent)/.test(name);
    const isBorder = /(border|divider|grid-line)/.test(name) && !/(error|focus|selected|active)/.test(name);

    if (isInk && !isColoredBadge && (val === 'rgb(10, 10, 10)' || val === 'rgb(15, 14, 15)' || val === 'rgb(23, 23, 23)')) {
      lines.push(`  ${name}: #f3f4f6;`);
    } else if (isInk && !isColoredBadge && (val === 'rgb(115, 115, 115)' || val === 'rgb(82, 82, 82)')) {
      lines.push(`  ${name}: #9ca3af;`);
    } else if (isSurface && val === 'rgb(255, 255, 255)') {
      lines.push(`  ${name}: #202127;`);
    } else if (isSurface && (val === 'rgb(245, 245, 245)' || val === 'rgb(250, 250, 250)' || val === 'rgb(229, 229, 229)')) {
      lines.push(`  ${name}: #2b2b30;`);
    } else if (isBorder && (val === 'rgb(229, 229, 229)' || val === 'rgb(245, 245, 245)')) {
      lines.push(`  ${name}: #3c3f44;`);
    }
  }
  lines.push('}');
  return lines.join('\n');
}

function sanitizeSyncedMarkdown(md) {
  return md
    .replace(/^(# [^\n]+\n+)\s*Description:?\s*\n+/i, '$1')
    .replace(/\nVariant(s)?:?\s*\n+/gi, '\n### Variants\n\n')
    .replace(/^## (?:Live|Interactive) Preview(?: & Usage)?\s*\n+(?=<(?:Framework|Component)Preview)/gm, '## Live Preview & Usage\n\n')
    .replace(/\n## Usage\n+::: code-group[\s\S]*?:::\n*/g, '\n');
}

async function syncGeneratedDocs(dsRepoRoot) {
  const srcDocsDir = path.resolve(dsRepoRoot, 'docs');
  const srcTokensDoc = path.join(srcDocsDir, 'tokens.md');
  const srcCompDocsDir = path.join(srcDocsDir, 'components');

  try {
    const tokensMd = await fs.readFile(srcTokensDoc, 'utf-8');
    if (tokensMd.trim().length > 0) {
      await fs.writeFile(path.resolve(docsRoot, 'tokens.md'), tokensMd, 'utf-8');
      console.log('[compile-docs-components] Synced docs/tokens.md into apps/docs/tokens.md.');
    }
  } catch {
    // No generated tokens.md in dsRepoRoot
  }

  const mdFiles = (await readDirSafe(srcCompDocsDir)).filter(
    (f) => f.endsWith('.md') && f !== 'index.md'
  );
  if (mdFiles.length > 0) {
    const destCompDocsDir = path.resolve(docsRoot, 'components');
    await fs.mkdir(destCompDocsDir, { recursive: true });
    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(srcCompDocsDir, file), 'utf-8');
      // Only sync AST-generated docs (prevent legacy Go-generated PR docs with raw #nodeId from overwriting)
      if (
        (content.includes('<ComponentPreview') || content.includes('<FrameworkPreview') || content.includes('@supernova/design-system')) &&
        !content.includes('No configurable properties defined.') &&
        !/#\d+:\d+/.test(content)
      ) {
        await fs.writeFile(path.join(destCompDocsDir, file), sanitizeSyncedMarkdown(content), 'utf-8');
      }
    }
    console.log(
      `[compile-docs-components] Synced ${mdFiles.length} component docs from ${srcCompDocsDir}.`
    );
  }
}

async function main() {
  const dsRepoRoot = await resolveDsRepoRoot();
  console.log(`[compile-docs-components] Using design system source root: ${dsRepoRoot}`);

  const componentsSrcDir = path.resolve(dsRepoRoot, 'src/components');
  const utilsSrcFile = path.resolve(templateRoot, 'src/components/utils.ts');
  const tokensSrcDir = (await readDirSafe(path.resolve(dsRepoRoot, 'src/tokens'))).includes('tokens.css')
    ? path.resolve(dsRepoRoot, 'src/tokens')
    : path.resolve(templateRoot, 'src/tokens');

  const { compileMitosis, getUtilsSource } = await loadCompiler();

  // Ensure clean target directories exist
  for (const dir of [targetVue3Dir, targetReactDir, targetSvelteDir]) {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  }
  await fs.mkdir(path.dirname(targetUtilsFile), { recursive: true });
  await fs.mkdir(targetTokensDir, { recursive: true });

  // Read all .lite.tsx components (baseline + overlay)
  const componentEntries = await getLiteComponentFiles(dsRepoRoot);
  console.log(`[compile-docs-components] Found ${componentEntries.length} component files.`);

  // Sort component names alphabetically
  componentEntries.sort((a, b) => a.name.localeCompare(b.name));

  const targets = ['vue3', 'react', 'svelte'];
  const sourceByName = {};

  for (const { name, filePath } of componentEntries) {
    const source = await fs.readFile(filePath, 'utf-8');
    sourceByName[name] = source;

    const result = await compileMitosis({
      componentName: name,
      source,
      targets,
      normalize: true,
    });

    if (!result.success) {
      const errMsgs = (result.errors || []).map((e) => `[${e.target}] ${e.message}`).join(', ');
      throw new Error(`Failed to compile ${name}: ${errMsgs}`);
    }

    for (const artifact of result.artifacts) {
      let destDir;
      if (artifact.target === 'vue3') {
        destDir = targetVue3Dir;
      } else if (artifact.target === 'react') {
        destDir = targetReactDir;
      } else if (artifact.target === 'svelte') {
        destDir = targetSvelteDir;
      } else {
        continue;
      }

      await fs.writeFile(path.join(destDir, artifact.fileName), artifact.code, 'utf-8');
    }
  }

  console.log(`[compile-docs-components] Compiled ${componentEntries.length} components into vue3, react, svelte.`);

  // Write canonical utils.ts
  const utilsContent = getUtilsSource ? getUtilsSource() : await fs.readFile(utilsSrcFile, 'utf-8');
  await fs.writeFile(targetUtilsFile, utilsContent, 'utf-8');
  console.log('[compile-docs-components] Wrote canonical utils.ts into .vitepress/theme/preview/utils.ts.');

  // Copy tokens (with normalized opacity/font-weight/px values) and append deterministic dark-mode overrides
  const rawThemeCss = await fs.readFile(path.join(tokensSrcDir, 'theme.css'), 'utf-8');
  await fs.writeFile(path.join(targetTokensDir, 'theme.css'), normalizeTokenCssValues(rawThemeCss), 'utf-8');
  const rawTokensCss = normalizeTokenCssValues(await fs.readFile(path.join(tokensSrcDir, 'tokens.css'), 'utf-8'));
  const darkOverrides = buildDarkTokensBlock(rawTokensCss);
  await fs.writeFile(path.join(targetTokensDir, 'tokens.css'), `${rawTokensCss}\n${darkOverrides}\n`, 'utf-8');
  console.log('[compile-docs-components] Copied theme.css and tokens.css (with dark overrides) into .vitepress/theme/tokens/.');

  // Sync generated markdown docs if present in dsRepoRoot/docs
  await syncGeneratedDocs(dsRepoRoot);

  // Read metadata files for totalVariants while keeping AST-extracted variants/booleans authoritative
  const metaMap = {};
  for (const { name, group } of componentEntries) {
    const metaPath = path.join(componentsSrcDir, `${name}.meta.json`);
    const sourceMeta = extractMetadataFromSource(name, group, sourceByName[name] || '');
    try {
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      const parsed = JSON.parse(metaContent);
      metaMap[name] = {
        ...parsed,
        name,
        group: parsed.group || group,
        variants: sourceMeta.variants,
        booleans: sourceMeta.booleans,
        totalVariants: parsed.totalVariants || sourceMeta.totalVariants,
      };
    } catch {
      metaMap[name] = sourceMeta;
    }
  }

  // Generate registry.ts
  const registryLines = componentEntries.map(
    ({ name }) =>
      `  '${name}': { vue3: () => import('./vue3/${name}.vue'), react: () => import('./react/${name}.tsx'), svelte: () => import('./svelte/${name}.svelte') },`
  );

  const registryContent = `// Auto-generated component registry for VitePress Multi-Framework Preview
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
${registryLines.join('\n')}
};

export const componentMetadata: Record<string, ComponentMeta> = ${JSON.stringify(metaMap, null, 2)};
`;

  await fs.writeFile(targetRegistryFile, registryContent, 'utf-8');
  console.log('[compile-docs-components] Generated .vitepress/theme/preview/registry.ts with metadata.');
  console.log('[compile-docs-components] Compilation completed successfully.');
}

main().catch((err) => {
  console.error('[compile-docs-components] Error:', err);
  process.exit(1);
});
