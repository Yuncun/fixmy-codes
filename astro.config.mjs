// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical site URL — used for RSS, sitemap, and absolute links.
export default defineConfig({
  site: 'https://fixmy.codes',
  // Unlisted pages (noindex) stay out of the sitemap too.
  integrations: [sitemap({ filter: (page) => !page.includes('/eric-lora') })],
});
