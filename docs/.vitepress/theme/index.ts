import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ColorGrid from './components/ColorGrid.vue'
import ComponentSandbox from './components/ComponentSandbox.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ColorGrid', ColorGrid)
    app.component('ComponentSandbox', ComponentSandbox)
  }
} satisfies Theme
