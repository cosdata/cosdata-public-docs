import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Cosdata Documentation',
      description: 'Documentation for Cosdata - The future ready AI data platform',
      social: {
        github: 'https://github.com/cosdata/cosdata',
        discord: 'https://discord.gg/XMdtTBrtKT',
      },
      customCss: [
        // Path to our custom CSS file
        './src/styles/custom.css',
      ],
      head: [
        // Simple favicon link
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon/favicon.ico',
            type: 'image/x-icon'
          }
        }
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/getting-started/introduction/' },
            { label: 'Installation & Quick Start', link: '/getting-started/installation-and-quickstart/' },
          ],
        },
        {
          label: 'Features',
          items: [
            { label: 'Search Relevance', link: '/features/search-relevance/' },
            { label: 'Performance', link: '/features/performance/' },
            { label: 'Benchmarks', link: '/features/benchmarks/' },
            { label: 'Customization', link: '/features/customization/' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Overview', link: '/api/overview/' },
            { label: 'Cos Graph Query Language', link: '/api/cosquery/' },
            { label: 'REST API', link: '/api/documentation/' },
            { label: 'Python SDK', link: '/api/python-sdk/' },
          ],
        },
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
    }),
  ],
  site: 'https://docs.cosdata.io',
}); 