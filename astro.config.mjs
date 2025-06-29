import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Cosdata Documentation",
      description:
        "Documentation for Cosdata - The future ready AI data platform",
      social: {
        github: "https://github.com/cosdata/cosdata",
        discord: "https://discord.gg/XMdtTBrtKT",
      },
      customCss: [
        // Path to our custom CSS file
        "./src/styles/custom.css",
      ],
      head: [
        // Simple favicon link
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon/favicon.ico",
            type: "image/x-icon",
          },
        },
        // Global default og:image for link previews
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "/cosdata-og.png",
          },
        },
      ],
      // components: {
      //   Header: './src/components/CustomHeader.astro',
      // },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", link: "/getting-started/introduction/" },
            {
              label: "Installation & Quick Start",
              link: "/getting-started/installation-and-quickstart/",
            },
            {
              label: "Building with AI?",
              link: "/getting-started/building-with-ai/",
            },
          ],
        },

        {
          label: "API Reference",
          items: [
            { label: "Overview", link: "/api/rest-api/overview/" },
            { label: "Authentication", link: "/api/rest-api/authentication/" },
            { label: "Collections", link: "/api/rest-api/collections/" },
            { label: "Transactions", link: "/api/rest-api/transactions/" },
            { label: "Streaming", link: "/api/rest-api/streaming/" },
            { label: "Search", link: "/api/rest-api/search/" },
            { label: "Indexes", link: "/api/rest-api/indexes/" },
            { label: "Vectors", link: "/api/rest-api/vectors/" },
            { label: "Versions", link: "/api/rest-api/versions/" },
          ],
        },
        {
          label: "SDK Reference",
          items: [
            { label: "Python SDK", link: "/api/python-sdk/" },
            { label: "Node.js SDK", link: "/api/node-sdk/" },
          ],
        },
        {
          label: "Features",
          items: [
            { label: "Search Relevance", link: "/features/search-relevance/" },
            { label: "Performance", link: "/features/performance/" },
            {
              label: "Benchmarks",
              link: "https://cosdata.io/resources/benchmarks",
              attrs: { target: "_blank", rel: "noopener noreferrer" },
            },
          ],
        },
        {
          label: "Guides",
          items: [
            {
              label: "Vector Databases 101",
              link: "/guides/vector-databases-101/",
            },
            {
              label: "Generating Embeddings",
              link: "/guides/generating-embeddings/",
            },
          ],
        },
      ],
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
    }),
  ],
  site: "https://docs.cosdata.io",
  output: "static",
  build: {
    format: "directory",
  },
});
