import { defineConfig } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as svelteCompiler from 'svelte/compiler';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sveltePlugin() {
  return {
    name: 'vitepress-svelte-transform',
    async transform(code: string, id: string) {
      const [cleanId] = id.split('?');
      if (!cleanId.endsWith('.svelte')) return null;
      const pre = await svelteCompiler.preprocess(
        code,
        {
          script: async ({ content, attributes }) => {
            if (attributes.lang === 'ts') {
              const res = await esbuild.transform(content, { loader: 'ts' });
              return { code: res.code };
            }
            return { code: content };
          },
        },
        { filename: cleanId }
      );
      const compiled = svelteCompiler.compile(pre.code, { filename: cleanId, generate: 'dom' });
      return { code: compiled.js.code, map: compiled.js.map };
    },
  };
}

function utilsResolverPlugin() {
  return {
    name: 'vitepress-utils-resolver',
    resolveId(id: string, importer?: string) {
      if (id === './utils' || id === './utils.js' || id === './utils.ts') {
        if (importer && (importer.includes('/src/components/') || importer.includes('\\src\\components\\'))) {
          return path.resolve(__dirname, '../src/components/utils.ts');
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  title: 'Supernova',
  description: 'Figma to Mitosis Multi-Framework Design System Pipeline',
  cleanUrls: true,
  vite: {
    plugins: [
      tailwindcss(),
      react(),
      sveltePlugin(),
      utilsResolverPlugin(),
    ],
    resolve: {
      alias: [
        { find: /^@ui\/(.*)$/, replacement: path.resolve(__dirname, '../src/components/$1') },
      ],
    },
  },
  themeConfig: {
    nav: [
      { text: 'Showcase', link: '/showcase' },
      { text: 'Guide', link: '/guide/overview' },
      { text: 'Components', link: '/components/' },
      { text: 'Design Tokens', link: '/tokens' },
      { text: 'Architecture', link: '/guide/architecture' },
      { text: 'Figma Plugin', link: '/guide/figma-plugin' },
      { text: 'API Reference', link: '/guide/api-reference' },
    ],
    sidebar: [
      {
        text: 'Live Showcase',
        items: [
          { text: 'Multi-Framework Showcase', link: '/showcase' },
        ],
      },
      {
        text: 'Getting Started',
        items: [
          { text: 'Pipeline Overview', link: '/guide/overview' },
          { text: 'Architecture (Hexagonal)', link: '/guide/architecture' },
          { text: 'Figma Plugin Extractor', link: '/guide/figma-plugin' },
          { text: 'Backend API Reference', link: '/guide/api-reference' },
        ],
      },
      {
        text: 'Design Tokens',
        items: [
          { text: 'Token Overview', link: '/tokens' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Component Catalog', link: '/components/' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dwlhm/supernova' },
    ],
  },
});
