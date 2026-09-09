import type { APIRoute } from 'astro';
import {base} from '../lib/site';
export const GET: APIRoute = ({site}) => new Response(`User-agent: *\nAllow: /\nDisallow: ${base}/admin/\nSitemap: ${new URL(`${base}/sitemap.xml`,site).href}\n`);
