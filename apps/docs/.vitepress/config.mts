import { defineConfig } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as svelteCompiler from 'svelte/compiler';
import * as esbuild from 'esbuild';
import { transformAsync } from '@babel/core';
import angularLinker from '@angular/compiler-cli/linker/babel';

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

const ANGULAR_PACKAGES = ['@angular/core', '@angular/common', '@angular/platform-browser'];

/**
 * Angular publishes partially compiled packages (`ɵɵngDeclare*`). Link them at build time, as the Angular CLI
 * does; runtime JIT linking breaks once the bundle is minified.
 */
function angularLinkerPlugin() {
  return {
    name: 'vitepress-angular-linker',
    enforce: 'pre' as const,
    async transform(code: string, id: string) {
      if (!/[\\/]@angular[\\/]/.test(id) || !code.includes('ɵɵngDeclare')) return null;
      const result = await transformAsync(code, {
        filename: id,
        plugins: [angularLinker],
        babelrc: false,
        configFile: false,
        compact: false,
        sourceMaps: false,
      });
      return result?.code ?? null;
    },
  };
}

function utilsResolverPlugin() {
  return {
    name: 'vitepress-utils-resolver',
    resolveId(id: string, importer?: string) {
      if (id === './utils' || id === './utils.js' || id === './utils.ts') {
        if (importer && (importer.includes('/preview/') || importer.includes('\\preview\\'))) {
          return path.resolve(__dirname, 'theme/preview/utils.ts');
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  title: 'Komerce Design',
  description: 'Figma to Mitosis Multi-Framework Design System Pipeline',
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap' }],
  ],
  vite: {
    css: {
      postcss: {},
    },
    plugins: [
      tailwindcss(),
      react(),
      sveltePlugin(),
      utilsResolverPlugin(),
      angularLinkerPlugin(),
    ],
    // Pre-bundling would bypass the linker in dev; Angular is only loaded by the Angular preview tab.
    optimizeDeps: { exclude: ANGULAR_PACKAGES },
    resolve: {
      alias: [
        { find: /^@ui\/(.*)$/, replacement: path.resolve(__dirname, 'theme/preview/$1') },
      ],
    },
  },
  themeConfig: {
    nav: [
      { text: 'Quick Start', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/' },
      { text: 'Showcase', link: '/showcase' },
      { text: 'Design Tokens', link: '/tokens' },
      {
        text: 'Pipeline Guide',
        items: [
          { text: 'Overview', link: '/guide/overview' },
          { text: 'Architecture (Full-TS)', link: '/guide/architecture' },
          { text: 'Figma Plugin', link: '/guide/figma-plugin' },
          { text: 'CLI & HTTP API Reference', link: '/guide/api-reference' },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Quick Start (Instalasi & Setup)', link: '/guide/getting-started' },
          { text: 'Design Tokens', link: '/tokens' },
          { text: 'Multi-Framework Showcase', link: '/showcase' },
          { text: 'Component Catalog (Grid)', link: '/components/' },
        ],
      },
      {
        text: 'Buttons & Selection',
        collapsed: false,
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'FAB (Floating Action)', link: '/components/fab' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Radio Button', link: '/components/radio-button' },
          { text: 'Switch Button', link: '/components/switch-button' },
          { text: 'Toggle', link: '/components/toggle' },
          { text: 'Toggle Group', link: '/components/toggle-group' },
        ],
      },
      {
        text: 'Forms & Inputs',
        collapsed: false,
        items: [
          { text: 'Form Validation (Headless)', link: '/core/headless-form' },
          { text: 'Input Text', link: '/components/input-text' },
          { text: 'Input Text Area', link: '/components/input-text-area' },
          { text: 'Input Dropdown', link: '/components/input-dropdown' },
          { text: 'Input OTP', link: '/components/input-otp' },
          { text: 'Input File Input', link: '/components/input-file-input' },
          { text: 'Input File Drop Zone', link: '/components/input-file-drop-zone' },
          { text: 'Input Image Uploader', link: '/components/input-image-uploader' },
          { text: 'Input Multiple File Upload', link: '/components/input-multiple-file-upload' },
          { text: 'Date Picker', link: '/components/date-picker' },
          { text: 'Time Picker', link: '/components/time-picker' },
          { text: 'Slider', link: '/components/slider' },
        ],
      },
      {
        text: 'Data Display & Charts',
        collapsed: false,
        items: [
          { text: 'Table', link: '/components/table' },
          { text: 'Data Table (Headless)', link: '/core/headless-table' },
          { text: 'Chart', link: '/components/chart' },
          { text: 'Chart Engine (Headless & SVG)', link: '/core/headless-chart' },
          { text: 'Card', link: '/components/card' },
          { text: 'Stat', link: '/components/stat' },
          { text: 'Divider', link: '/components/divider' },
          { text: 'List Item', link: '/components/list-item' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Progressbar', link: '/components/progressbar' },
        ],
      },
      {
        text: 'Navigation & Flows',
        collapsed: false,
        items: [
          { text: 'Topbar', link: '/components/topbar' },
          { text: 'Sidebar', link: '/components/sidebar' },
          { text: 'Main Menu', link: '/components/main-menu' },
          { text: 'Menu Item', link: '/components/menu-item' },
          { text: 'Breadcrumb', link: '/components/breadcrumb' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Pagination', link: '/components/pagination' },
          { text: 'Stepper', link: '/components/stepper' },
        ],
      },
      {
        text: 'Feedback, Overlays & Primitives',
        collapsed: false,
        items: [
          { text: 'Overlay, Date & A11y (Headless)', link: '/core/headless-primitives' },
          { text: 'Alert Dialog', link: '/components/alert-dialog' },
          { text: 'Toast', link: '/components/toast' },
          { text: 'Tooltip', link: '/components/tooltip' },
          { text: 'Spinner', link: '/components/spinner' },
          { text: 'Bubble Chat', link: '/components/bubble-chat' },
        ],
      },
      {
        text: 'Pipeline & Contributor Guide',
        collapsed: true,
        items: [
          { text: 'Pipeline Overview', link: '/guide/overview' },
          { text: 'Architecture (Full-TS)', link: '/guide/architecture' },
          { text: 'Figma Plugin Extractor', link: '/guide/figma-plugin' },
          { text: 'CLI & HTTP API Reference', link: '/guide/api-reference' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dwlhm/komerce-design' },
    ],
  },
});
