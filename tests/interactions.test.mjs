import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {parseHTML} from 'linkedom';
import {getOpeningStatus} from '../src/lib/hours.mjs';

function setup(storageBlocked=false){
  const {window,document}=parseHTML(fs.readFileSync('dist/ar/experiences/index.html','utf8'));
  document.documentElement.dataset.theme='light';
  const stored=new Map();
  for(const dialog of document.querySelectorAll('dialog')){
    dialog.showModal=()=>dialog.setAttribute('open','');
    dialog.close=()=>dialog.removeAttribute('open');
  }
  const source=fs.readFileSync('src/scripts/client.ts','utf8').replace("import {getOpeningStatus} from '../lib/hours.mjs';",'');
  const code=ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS});
  const context=vm.createContext({window,document,CustomEvent:window.CustomEvent,matchMedia:()=>({addEventListener(){}}),localStorage:{setItem(k,v){if(storageBlocked)throw new Error('Blocked');stored.set(k,v);}},setInterval(){},getOpeningStatus});
  vm.runInContext(code,context);
  return {window,document,stored};
}

test('Day/night toggle changes state and persists preference, including blocked storage',()=>{
  for(const blocked of [false,true]){
    const {document,stored}=setup(blocked);
    const button=document.querySelector('.theme-toggle');
    button.click();assert.equal(document.documentElement.dataset.theme,'dark');
    assert.equal(button.getAttribute('aria-pressed'),'true');
    if(!blocked)assert.equal(stored.get('fi-theme'),'dark');
    button.click();assert.equal(document.documentElement.dataset.theme,'light');
  }
});
test('Game filters change visible results and map pins open the matching detail',()=>{
  const {document}=setup();
  document.querySelector('[data-filter=family]').click();
  const visible=[...document.querySelectorAll('[data-game-category]')].filter(n=>!n.hidden);
  assert.equal(visible.length,2);
  assert.ok(visible.every(n=>n.dataset.gameCategory==='family'));
  document.querySelector('[data-filter=all]').click();
  assert.equal([...document.querySelectorAll('[data-game-category]')].filter(n=>!n.hidden).length,5);
  document.querySelector('.map-pin[data-open-game=cars]').click();
  const dialog=document.getElementById('detail-cars');assert.ok(dialog.hasAttribute('open'));
  dialog.querySelector('[data-close-dialog]').click();assert.ok(!dialog.hasAttribute('open'));
});
test('Mobile navigation toggles and closes on Escape',()=>{
  const {document,window}=setup();
  const button=document.querySelector('.menu-toggle');const menu=document.getElementById('mobile-nav');
  assert.equal(menu.hidden,true);button.click();assert.equal(menu.hidden,false);
  assert.equal(button.getAttribute('aria-expanded'),'true');
  const event=new window.Event('keydown');event.key='Escape';document.dispatchEvent(event);
  assert.equal(menu.hidden,true);assert.equal(button.getAttribute('aria-expanded'),'false');
});
