// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical site URL — used for RSS, sitemap, and absolute links.
export default defineConfig({
  site: 'https://fixmy.codes',
  integrations: [sitemap()],
});
