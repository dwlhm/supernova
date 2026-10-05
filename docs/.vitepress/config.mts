import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Supernova Design System',
  description: 'Multi-framework UI components and tokens compiled from Supernova and Mitosis',
  base: process.env.BASE_URL || '/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
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
      { text: 'Components', link: '/components/' },
      { text: 'Packages', items: [
        { text: '@dwlhm/design-tokens', link: '/tokens' },
        { text: '@dwlhm/ui-react', link: '/components/' },
        { text: '@dwlhm/ui-svelte', link: '/components/' }
      ]}
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'UI/UX Guidelines', link: '/ui-ux-guidelines' },
          { text: 'Design Tokens', link: '/tokens' },
          { text: 'Components Catalog', link: '/components/' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Badge', link: '/components/badge' },
          { text: 'Button', link: '/components/button' },
          { text: 'Card', link: '/components/card' },
          { text: 'Input', link: '/components/input' },
          { text: 'StatusBadge', link: '/components/statusbadge' },
          { text: 'Typography', link: '/components/typography' }
        ]
      }
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
