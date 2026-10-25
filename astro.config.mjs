// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://eonix11.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Dark is the default. The light colors are applied in global.css
      // when the system prefers light.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: 'dark',
      langAlias: { conf: 'nginx' },
      wrap: false,
    },
  },
});
