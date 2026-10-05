import { defineConfig } from 'vitepress'
import manifest from './components.generated.json'

const base = process.env.BASE_URL || '/'

const components = manifest.components as { name: string; slug: string }[]
const hasComponents = components.length > 0

export default defineConfig({
  title: 'Supernova Design System',
  description: hasComponents
    ? 'Multi-framework UI components and tokens compiled from Supernova and Mitosis'
    : 'Design tokens compiled from Supernova.',
  base,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }]
  ],
  themeConfig: {
    siteTitle: 'Supernova UI',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'UI/UX Guidelines', link: '/ui-ux-guidelines' },
      { text: 'Design Tokens', link: '/tokens' },
      ...(hasComponents ? [{ text: 'Components', link: '/components/' }] : []),
      { text: 'Packages', items: [
        { text: '@dwlhm/design-tokens', link: '/tokens' },
        ...(hasComponents ? [
          { text: '@dwlhm/ui-react', link: '/components/' },
          { text: '@dwlhm/ui-svelte', link: '/components/' }
        ] : [])
      ]}
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'UI/UX Guidelines', link: '/ui-ux-guidelines' },
          { text: 'Design Tokens', link: '/tokens' },
          ...(hasComponents ? [{ text: 'Components Catalog', link: '/components/' }] : [])
        ]
      },
      ...(hasComponents ? [{
        text: 'Components',
        items: components.map((c) => ({ text: c.name, link: `/components/${c.slug}` }))
      }] : [])
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dwlhm/supernova' }
    ],
    footer: {
      message: 'Compiled with Supernova Exporter & Mitosis',
      copyright: 'Copyright © 2026 dwlhm'
    }
  }
})
