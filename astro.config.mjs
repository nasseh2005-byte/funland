import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://nasseh2005-byte.github.io',
  base: process.env.BASE_PATH || '/funland',
  output: 'static',
  trailingSlash: 'always',
});
