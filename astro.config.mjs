import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Cosdata Documentation',
      description: 'Documentation for Cosdata - The future ready AI data platform',
      social: {
        github: 'https://github.com/cosdata/cosdata',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'Installation', link: '/getting-started/installation/' },
            { label: 'Quick Start', link: '/getting-started/quick-start/' },
          ],
        },
        {
          label: 'Features',
          items: [
            { label: 'Search Relevance', link: '/features/search-relevance/' },
            { label: 'Performance', link: '/features/performance/' },
            { label: 'Customization', link: '/features/customization/' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Overview', link: '/api/overview/' },
            { label: 'cosQuery Language', link: '/api/cosquery/' },
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