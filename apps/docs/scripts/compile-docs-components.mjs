#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths
const docsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(docsRoot, '../..');

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
  return path.resolve(repoRoot, 'templates/ds-repo');
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
    const compiler = await import('@supernova/mitosis-compiler');
    return compiler.compileMitosis;
  } catch {
    const fallbackPath = path.resolve(repoRoot, 'packages/mitosis-compiler/dist/index.js');
    const compiler = await import(fallbackPath);
    return compiler.compileMitosis;
  }
}

async function readDirSafe(dirPath) {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

async function getLiteComponentFiles(componentsSrcDir, iconsSrcDir) {
  const componentFiles = (await readDirSafe(componentsSrcDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => ({
      name: f.replace(/\.lite\.tsx$/, ''),
      group: 'components',
      filePath: path.join(componentsSrcDir, f),
    }));

  const iconFiles = (await readDirSafe(iconsSrcDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => ({
      name: f.replace(/\.lite\.tsx$/, ''),
      group: 'icons',
      filePath: path.join(iconsSrcDir, f),
    }));

  return [...componentFiles, ...iconFiles];
}

function extractMetadataFromSource(name, group, source) {
  const variants = {};
  const interfaceMatch = source.match(/export\s+interface\s+\w+Props\s*\{([\s\S]*?)\}/);
  if (interfaceMatch) {
    const body = interfaceMatch[1];
    const propRegex = /^\s*([a-zA-Z0-9_]+)\??\s*:\s*([^;\n]+);/gm;
    let match;
    while ((match = propRegex.exec(body)) !== null) {
      const propName = match[1];
      const propType = match[2].trim();
      if (propName === 'target' || propName === 'role' || propName === 'ariaHidden') continue;
      if (propType.includes("'") || propType.includes('"')) {
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
  const counts = Object.values(variants).map((v) => v.length);
  const totalVariants = counts.length > 0 ? counts.reduce((acc, c) => acc * c, 1) : 0;
  return {
    name,
    group,
    variants,
    totalVariants,
  };
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
      await fs.writeFile(path.join(destCompDocsDir, file), content, 'utf-8');
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
  const iconsSrcDir = path.resolve(dsRepoRoot, 'src/icons');
  const utilsSrcFile = path.resolve(dsRepoRoot, 'src/components/utils.ts');
  const tokensSrcDir = path.resolve(dsRepoRoot, 'src/tokens');

  const compileMitosis = await loadCompiler();

  // Ensure clean target directories exist
  for (const dir of [targetVue3Dir, targetReactDir, targetSvelteDir]) {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  }
  await fs.mkdir(path.dirname(targetUtilsFile), { recursive: true });
  await fs.mkdir(targetTokensDir, { recursive: true });

  // Read all .lite.tsx components
  const componentEntries = await getLiteComponentFiles(componentsSrcDir, iconsSrcDir);
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

  // Copy utils.ts
  await fs.copyFile(utilsSrcFile, targetUtilsFile);
  console.log('[compile-docs-components] Copied utils.ts into .vitepress/theme/preview/utils.ts.');

  // Copy tokens
  await fs.copyFile(path.join(tokensSrcDir, 'theme.css'), path.join(targetTokensDir, 'theme.css'));
  await fs.copyFile(path.join(tokensSrcDir, 'tokens.css'), path.join(targetTokensDir, 'tokens.css'));
  console.log('[compile-docs-components] Copied theme.css and tokens.css into .vitepress/theme/tokens/.');

  // Sync generated markdown docs if present in dsRepoRoot/docs
  await syncGeneratedDocs(dsRepoRoot);

  // Read metadata files or fallback to source interface extraction
  const metaMap = {};
  for (const { name, group } of componentEntries) {
    const metaPath = path.join(componentsSrcDir, `${name}.meta.json`);
    const sourceMeta = extractMetadataFromSource(name, group, sourceByName[name] || '');
    try {
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      const parsed = JSON.parse(metaContent);
      // Merge with source-extracted variants so exact literal casing from Props is preserved when available
      if (Object.keys(sourceMeta.variants).length > 0) {
        parsed.variants = { ...(parsed.variants || {}), ...sourceMeta.variants };
      }
      metaMap[name] = parsed;
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
