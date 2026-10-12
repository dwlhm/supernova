import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './custom.css';

import FrameworkPreview from './components/FrameworkPreview.vue';
import ReactHost from './components/ReactHost.vue';
import SvelteHost from './components/SvelteHost.vue';
import ShowcaseDashboard from './components/ShowcaseDashboard.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FrameworkPreview', FrameworkPreview);
    app.component('ReactHost', ReactHost);
    app.component('SvelteHost', SvelteHost);
    app.component('ShowcaseDashboard', ShowcaseDashboard);
  },
} satisfies Theme;
