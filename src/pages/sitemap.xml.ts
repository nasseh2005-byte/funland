import type { APIRoute } from 'astro';
import {href, pages} from '../lib/site';
export const GET: APIRoute = ({site}) => {
  const urls=['ar','en'].flatMap(lang=>pages.map(page=>new URL(href(lang as 'ar'|'en',page),site).href));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
