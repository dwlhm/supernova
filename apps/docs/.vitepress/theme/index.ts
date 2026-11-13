import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './custom.css';
import './tokens-explorer.css';

import FrameworkPreview from './components/FrameworkPreview.vue';
import ReactHost from './components/ReactHost.vue';
import SvelteHost from './components/SvelteHost.vue';
import ShowcaseDashboard from './components/ShowcaseDashboard.vue';
import ComponentCatalog from './components/ComponentCatalog.vue';
import DesignTokensExplorer from './components/DesignTokensExplorer.vue';
import HeadlessFormPlayground from './components/HeadlessFormPlayground.vue';
import HeadlessTablePlayground from './components/HeadlessTablePlayground.vue';
import HeadlessChartPlayground from './components/HeadlessChartPlayground.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FrameworkPreview', FrameworkPreview);
    app.component('ComponentPreview', FrameworkPreview);
    app.component('ReactHost', ReactHost);
    app.component('SvelteHost', SvelteHost);
    app.component('ShowcaseDashboard', ShowcaseDashboard);
    app.component('ComponentCatalog', ComponentCatalog);
    app.component('DesignTokensExplorer', DesignTokensExplorer);
    app.component('HeadlessFormPlayground', HeadlessFormPlayground);
    app.component('HeadlessTablePlayground', HeadlessTablePlayground);
    app.component('HeadlessChartPlayground', HeadlessChartPlayground);
  },
} satisfies Theme;
