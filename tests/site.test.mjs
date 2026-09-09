import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parseHTML} from 'linkedom';
import {getOpeningStatus} from '../src/lib/hours.mjs';

const root=path.resolve('dist');
const base=(process.env.BASE_PATH||'/funland').replace(/\/$/,'');
const routes=['','trips','experiences','business','visit','offers','privacy'];
for(const lang of ['ar','en'])for(const route of routes){
  test(`${lang}/${route}: metadata, language, all local links and assets resolve`,()=>{
    const html=fs.readFileSync(path.join(root,lang,route,'index.html'),'utf8');
    const {document}=parseHTML(html);
    assert.equal(document.documentElement.lang,lang);
    assert.equal(document.documentElement.dir,lang==='ar'?'rtl':'ltr');
    assert.equal(document.querySelectorAll('h1').length,1);
    assert.ok(document.querySelector('meta[name=description]')?.getAttribute('content'));
    assert.ok(document.querySelector(`link[hreflang=${lang==='ar'?'en':'ar'}]`));
    const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);
    assert.equal(ids.length,new Set(ids).size,'IDs must be unique');
    for(const node of document.querySelectorAll('[href],[src]')){
      const url=node.getAttribute('href')||node.getAttribute('src');
      if(!url||/^(https?:|mailto:|tel:|data:)/.test(url))continue;
      const [pathname,fragment]=url.split('#');
      if(!pathname){if(fragment)assert.ok(document.getElementById(fragment),`Missing #${fragment}`);continue;}
      assert.ok(pathname.startsWith(base+'/'),`Wrong GitHub Pages base: ${url}`);
      let target=path.join(root,decodeURIComponent(pathname.slice(base.length)));
      if(pathname.endsWith('/'))target=path.join(target,'index.html');
      assert.ok(fs.existsSync(target),`Missing target: ${url}`);
      if(fragment&&target.endsWith('.html')){
        const destination=parseHTML(fs.readFileSync(target,'utf8')).document;
        assert.ok(destination.getElementById(fragment),`Missing destination #${fragment}`);
      }
    }
    for(const image of document.querySelectorAll('img'))assert.ok(image.hasAttribute('alt'));
    assert.ok(document.querySelector('.language-toggle').getAttribute('href').includes(`/${lang==='ar'?'en':'ar'}/${route}`));
  });
}

test('Every game opens an inline island detail, with no modal remaining',()=>{
  const {document}=parseHTML(fs.readFileSync(path.join(root,'ar/experiences/index.html'),'utf8'));
  for(const button of document.querySelectorAll('[data-open-game]')){
    const panel=document.querySelector(`[data-scene-game="${button.dataset.openGame}"]`);
    assert.equal(panel?.tagName,'ARTICLE');
    assert.ok(document.getElementById(panel.getAttribute('aria-labelledby')));
  }
  assert.equal(document.querySelectorAll('[data-game-category]').length,5);
  assert.equal(document.querySelectorAll('dialog').length,0);
  assert.equal(document.querySelectorAll('[data-enter-area]').length,3);
  assert.equal(document.querySelectorAll('[data-filter][aria-pressed=true]').length,1);
});
test('Unknown operating data never claims open or a real price',()=>{
  const html=fs.readFileSync(path.join(root,'ar/visit/index.html'),'utf8');
  const {document}=parseHTML(html);
  assert.equal(document.querySelector('[data-opening-status]').textContent,'تحقق من أوقات الزيارة');
  assert.equal(getOpeningStatus({hours:{}}),'unconfirmed');
});
test('Opening status respects Riyadh time and exact closing boundaries',()=>{
  const branch={timezone:'Asia/Riyadh',hours:{3:[['16:00','23:00']]}};
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T12:59:00Z')),'closed');
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T13:00:00Z')),'open');
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T20:00:00Z')),'closed');
});
test('Overnight hours carry into the next day; exceptions take precedence',()=>{
  const branch={timezone:'Asia/Riyadh',hours:{3:[['16:00','02:00']]},exceptions:{}};
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T22:00:00Z')),'open');
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T23:00:00Z')),'closed');
  branch.exceptions['2026-09-10']=[];
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T22:00:00Z')),'closed');
  branch.exceptions['2026-09-10']=[['01:00','03:00']];
  assert.equal(getOpeningStatus(branch,new Date('2026-09-09T23:30:00Z')),'open');
});
test('CMS schema targets the actual repository and preserves core content fields',()=>{
  const config=JSON.parse(fs.readFileSync(path.join(root,'admin/config.json'),'utf8'));
  assert.equal(config.backend.repo,'nasseh2005-byte/funland');
  const fields=config.collections[0].files[0].fields.map(f=>f.name);
  const content=JSON.parse(fs.readFileSync('src/data/site.json','utf8'));
  for(const key of Object.keys(content))assert.ok(fields.includes(key),`CMS must preserve ${key}`);
});
