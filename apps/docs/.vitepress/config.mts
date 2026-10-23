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
              const res = await esbuild.transform(content, {
                loader: 'ts',
                tsconfigRaw: { compilerOptions: { verbatimModuleSyntax: true } },
              });
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
        if (
          importer &&
          (importer.includes('/preview/') ||
            importer.includes('\\preview\\') ||
            importer.includes('/src/components/') ||
            importer.includes('\\src\\components\\'))
        ) {
          return path.resolve(__dirname, 'theme/preview/utils.ts');
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
    css: {
      postcss: {},
    },
    plugins: [
      tailwindcss(),
      react(),
      sveltePlugin(),
      utilsResolverPlugin(),
    ],
    resolve: {
      alias: [
        { find: /^@ui\/(.*)$/, replacement: path.resolve(__dirname, 'theme/preview/$1') },
      ],
    },
  },
  themeConfig: {
    nav: [
      { text: 'Showcase', link: '/showcase' },
      { text: 'Component Catalog', link: '/components/' },
      { text: 'Design Tokens', link: '/tokens' },
      {
        text: 'Pipeline Guide',
        items: [
          { text: 'Overview', link: '/guide/overview' },
          { text: 'Architecture (Hexagonal)', link: '/guide/architecture' },
          { text: 'Figma Plugin', link: '/guide/figma-plugin' },
          { text: 'Backend API Reference', link: '/guide/api-reference' },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Overview & Showcase',
        items: [
          { text: 'Multi-Framework Showcase', link: '/showcase' },
          { text: 'Component Catalog (Grid)', link: '/components/' },
          { text: 'Design Tokens', link: '/tokens' },
        ],
      },
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Pipeline Overview', link: '/guide/overview' },
          { text: 'Architecture (Hexagonal)', link: '/guide/architecture' },
          { text: 'Figma Plugin Extractor', link: '/guide/figma-plugin' },
          { text: 'Backend API Reference', link: '/guide/api-reference' },
        ],
      },
      {
        text: 'General & Actions',
        collapsed: false,
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'FAB (Floating Action)', link: '/components/fab' },
          { text: 'Icon Placeholder', link: '/components/icon-placeholder' },
          { text: 'Truck Delivery Icon', link: '/components/tabler-truck-delivery' },
        ],
      },
      {
        text: 'Forms & Inputs',
        collapsed: false,
        items: [
          { text: 'Input Text', link: '/components/input-text' },
          { text: 'Input Text Area', link: '/components/input-text-area' },
          { text: 'Input Dropdown', link: '/components/input-dropdown' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Radio Button', link: '/components/radio-button' },
          { text: 'Switch Button', link: '/components/switch-button' },
          { text: 'Toggle', link: '/components/toggle' },
          { text: 'Toggle Group', link: '/components/toggle-group' },
          { text: 'Slider', link: '/components/slider' },
          { text: 'Date Picker', link: '/components/date-picker' },
          { text: 'Input OTP', link: '/components/input-otp' },
          { text: 'Input File Input', link: '/components/input-file-input' },
          { text: 'Input File Drop Zone', link: '/components/input-file-drop-zone' },
          { text: 'Input Image Uploader', link: '/components/input-image-uploader' },
          { text: 'Input Multiple File Upload', link: '/components/input-multiple-file-upload' },
        ],
      },
      {
        text: 'Data Display',
        collapsed: false,
        items: [
          { text: 'Table', link: '/components/table' },
          { text: 'Table Header Row', link: '/components/table-header-row' },
          { text: 'Table Body Row', link: '/components/table-body-row' },
          { text: 'Table Body Cell', link: '/components/table-body-cell' },
          { text: 'Table Cell Value', link: '/components/table-cell-value' },
          { text: 'Table Checkbox Header', link: '/components/table-checkbox-header-cell' },
          { text: 'Table Checkbox Body', link: '/components/table-checkbox-body-cell' },
          { text: 'Table No Header Cell', link: '/components/table-no-header-cell' },
          { text: 'Table No Body Cell', link: '/components/table-no-body-cell' },
          { text: 'Metric Card', link: '/components/metric-card' },
          { text: 'Chart', link: '/components/chart' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Progressbar', link: '/components/progressbar' },
        ],
      },
      {
        text: 'Navigation',
        collapsed: false,
        items: [
          { text: 'Topbar', link: '/components/topbar' },
          { text: 'Sidebar', link: '/components/sidebar' },
          { text: 'Main Menu', link: '/components/main-menu' },
          { text: 'Menu Item', link: '/components/menu-item' },
          { text: 'Breadcrumb', link: '/components/breadcrumb' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Tab Item', link: '/components/tab-item' },
          { text: 'Pagination', link: '/components/pagination' },
          { text: 'Stepper', link: '/components/stepper' },
        ],
      },
      {
        text: 'Feedback & Overlays',
        collapsed: false,
        items: [
          { text: 'Alert Dialog', link: '/components/alert-dialog' },
          { text: 'Toast', link: '/components/toast' },
          { text: 'Tooltip', link: '/components/tooltip' },
          { text: 'Spinner', link: '/components/spinner' },
          { text: 'Bubble Chat', link: '/components/bubble-chat' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dwlhm/supernova' },
    ],
  },
});
