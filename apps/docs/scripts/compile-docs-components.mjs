#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths
const docsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(docsRoot, '../..');

// Source paths: resolve from DS_REPO_DIR if set, otherwise from templates/ds-repo
const dsRepoRoot = process.env.DS_REPO_DIR
  ? path.resolve(process.env.DS_REPO_DIR)
  : path.resolve(repoRoot, 'templates/ds-repo');

const componentsSrcDir = path.resolve(dsRepoRoot, 'src/components');
const iconsSrcDir = path.resolve(dsRepoRoot, 'src/icons');
const utilsSrcFile = path.resolve(dsRepoRoot, 'src/components/utils.ts');
const tokensSrcDir = path.resolve(dsRepoRoot, 'src/tokens');

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

async function getLiteComponentFiles() {
  const componentFiles = (await fs.readdir(componentsSrcDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => ({
      name: f.replace(/\.lite\.tsx$/, ''),
      filePath: path.join(componentsSrcDir, f),
    }));

  const iconFiles = (await fs.readdir(iconsSrcDir))
    .filter((f) => f.endsWith('.lite.tsx'))
    .map((f) => ({
      name: f.replace(/\.lite\.tsx$/, ''),
      filePath: path.join(iconsSrcDir, f),
    }));

  return [...componentFiles, ...iconFiles];
}

async function main() {
  console.log('[compile-docs-components] Starting compilation for docs components...');

  const compileMitosis = await loadCompiler();

  // Ensure target directories exist
  await fs.mkdir(targetVue3Dir, { recursive: true });
  await fs.mkdir(targetReactDir, { recursive: true });
  await fs.mkdir(targetSvelteDir, { recursive: true });
  await fs.mkdir(path.dirname(targetUtilsFile), { recursive: true });
  await fs.mkdir(targetTokensDir, { recursive: true });

  // Read all .lite.tsx components
  const componentEntries = await getLiteComponentFiles();
  console.log(`[compile-docs-components] Found ${componentEntries.length} component files.`);

  // Sort component names alphabetically
  componentEntries.sort((a, b) => a.name.localeCompare(b.name));

  const targets = ['vue3', 'react', 'svelte'];

  for (const { name, filePath } of componentEntries) {
    const source = await fs.readFile(filePath, 'utf-8');

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

  // Read all metadata files
  const metaMap = {};
  for (const { name } of componentEntries) {
    const metaPath = path.join(componentsSrcDir, `${name}.meta.json`);
    try {
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      metaMap[name] = JSON.parse(metaContent);
    } catch {
      // No meta file found, keep entry empty or basic
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
