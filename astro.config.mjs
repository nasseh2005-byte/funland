import { defineConfig } from 'astro/config';

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export default defineConfig({
  site: process.env.SITE_URL || (vercelHost ? `https://${vercelHost}` : 'https://nasseh2005-byte.github.io'),
  // Vercel serves dist at the domain root; GitHub Pages sets /funland in its workflow.
  base: process.env.VERCEL === '1' ? '/' : (process.env.BASE_PATH || '/'),
  output: 'static',
  trailingSlash: 'always',
});
