import data from '../data/site.json';
export type Lang = 'ar' | 'en';
export const site = data;
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (lang: Lang, page = '') => `${base}/${lang}/${page ? `${page}/` : ''}`;
export const asset = (path: string) => `${base}/${path.replace(/^\//, '')}`;
export const tr = (lang: Lang, ar: string, en: string) => lang === 'ar' ? ar : en;
export const pages = ['', 'experiences', 'about', 'business', 'visit', 'offers', 'privacy'];
export const titles: Record<string, {ar: string; en: string}> = {
  '': {ar:'جزيرة المرح | ترفيه عائلي بروح مختلفة', en:'Fun Island | Family entertainment with a different spirit'},
  experiences: {ar:'استكشف الألعاب', en:'Explore the experiences'},
  about: {ar:'عن المؤسسة', en:'About the establishment'},
  business: {ar:'الأعمال والشراكات', en:'Business & partnerships'},
  visit: {ar:'خطط لزيارتك', en:'Plan your visit'},
  offers: {ar:'الأسعار والعروض', en:'Prices & offers'},
  privacy: {ar:'سياسة الخصوصية', en:'Privacy policy'}
};
