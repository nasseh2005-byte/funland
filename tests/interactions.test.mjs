import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {parseHTML} from 'linkedom';
import {getOpeningStatus} from '../src/lib/hours.mjs';
import {initializeExplorer,islandAreas,cameraTransform} from '../src/lib/explorer.mjs';

function setup(storageBlocked=false,lang='ar',hash=''){
  const {window,document}=parseHTML(fs.readFileSync('dist/'+lang+'/experiences/index.html','utf8'));
  document.documentElement.dataset.theme='light';
  const stored=new Map();
  let focused=null,scrolled=0,resize;
  document.querySelectorAll('*').forEach(node=>node.focus=()=>{focused=node;});
  document.querySelector('[data-explorer]').scrollIntoView=()=>scrolled++;
  const viewport=document.querySelector('.explorer-viewport');
  Object.defineProperties(viewport,{clientWidth:{value:1000,writable:true},clientHeight:{value:550,writable:true}});
  const context=vm.createContext({window,document,CustomEvent:window.CustomEvent,matchMedia:()=>({matches:false,addEventListener(){}}),localStorage:{setItem(k,v){if(storageBlocked)throw new Error('Blocked');stored.set(k,v);}},setInterval(){},getOpeningStatus,initializeExplorer,islandAreas,location:{hash},requestAnimationFrame:callback=>callback(),ResizeObserver:class{constructor(callback){resize=callback;}observe(){}disconnect(){}}});
  for(const file of ['client','explorer']){
    const source=fs.readFileSync('src/scripts/'+file+'.ts','utf8').replace(/^import .*;$/gm,'');
    vm.runInContext(ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}),context);
  }
  return {window,document,stored,viewport,resize,getFocused:()=>focused,getScrolled:()=>scrolled};
}
test('Day/night buttons stay synchronized, persist preference and work with blocked storage',()=>{
  for(const blocked of [false,true]){
    const {document,stored}=setup(blocked);
    const header=document.querySelector('.theme-toggle'),scene=document.querySelector('[data-scene-theme]');
    scene.click();assert.equal(document.documentElement.dataset.theme,'dark');
    assert.equal(header.getAttribute('aria-pressed'),'true');
    assert.equal(scene.getAttribute('aria-pressed'),'true');
    if(!blocked)assert.equal(stored.get('fi-theme'),'dark');
    header.click();assert.equal(document.documentElement.dataset.theme,'light');
    assert.equal(scene.getAttribute('aria-pressed'),'false');
  }
});
test('Game filters change visible results',()=>{
  const {document}=setup();
  document.querySelector('[data-filter=family]').click();
  const visible=[...document.querySelectorAll('[data-game-category]')].filter(n=>!n.hidden);
  assert.equal(visible.length,2);
  assert.ok(visible.every(n=>n.dataset.gameCategory==='family'));
  document.querySelector('[data-filter=all]').click();
  assert.equal([...document.querySelectorAll('[data-game-category]')].filter(n=>!n.hidden).length,5);
});
for(const lang of ['ar','en'])test(lang+': enter, switch games/areas, change lighting and exit without a modal',()=>{
  const {document,window,getFocused}=setup(false,lang);
  const root=document.querySelector('[data-explorer]');
  const pin=root.querySelector('[data-enter-area=adventure]');
  pin.click();
  assert.equal(root.dataset.view,'inside');
  assert.equal(root.dataset.game,'cars');
  assert.equal(root.querySelector('[data-game-deck]').hidden,false);
  assert.equal(root.querySelector('[data-overview-pins]').hidden,true);
  assert.equal(root.querySelector('[data-scene-game=cars]').hidden,false);
  assert.equal(getFocused().id,'scene-title-cars');
  root.querySelector('[data-select-game=jump]').click();
  assert.equal(root.dataset.game,'jump');
  const before=root.querySelector('[data-camera]').style.transform;
  document.querySelector('[data-scene-theme]').click();
  assert.equal(root.dataset.game,'jump');
  assert.equal(root.querySelector('[data-camera]').style.transform,before);
  root.querySelector('[data-next-area]').click();
  assert.equal(root.dataset.game,'arcade');
  assert.equal(root.querySelectorAll('[data-scene-game]:not([hidden])').length,1);
  assert.equal(root.querySelectorAll('[data-select-game]:not([hidden])').length,1);
  root.querySelector('[data-next-area]').click();
  assert.equal(root.dataset.game,'carousel');
  root.querySelector('[data-previous-area]').click();
  assert.equal(root.dataset.game,'arcade');
  const event=new window.Event('keydown',{bubbles:true});event.key='Escape';root.dispatchEvent(event);
  assert.equal(root.dataset.view,'overview');
  assert.equal(root.querySelector('[data-game-deck]').hidden,true);
  assert.equal(root.querySelector('[data-camera]').style.transform,'translate(0px, 0px) scale(1)');
  assert.equal(getFocused(),pin);
  pin.click();root.querySelector('[data-leave-island]').click();
  assert.equal(root.dataset.view,'overview');
});
test('External cards and game deep links enter the right area; malformed hashes are ignored',()=>{
  const {document,getScrolled}=setup();
  document.querySelector('[data-open-game=cars]').click();
  assert.equal(document.querySelector('[data-explorer]').dataset.game,'cars');
  assert.equal(getScrolled(),1);
  const deep=setup(false,'en','#train');
  assert.equal(deep.document.querySelector('[data-explorer]').dataset.game,'train');
  assert.equal(deep.getScrolled(),1);
  const malformed=setup(false,'ar','#%E0%A4%A');
  assert.equal(malformed.document.querySelector('[data-explorer]').dataset.view,'overview');
});
test('Rapid navigation settles on the selected area and resizing keeps its ride centered',()=>{
  const {document,viewport,resize}=setup();
  const root=document.querySelector('[data-explorer]');
  root.querySelector('[data-enter-area=family]').click();
  for(let i=0;i<7;i++)root.querySelector('[data-next-area]').click();
  assert.equal(root.dataset.area,'adventure');
  viewport.clientWidth=335;viewport.clientHeight=350;resize();
  const transform=root.querySelector('[data-camera]').style.transform;
  assert.equal(transform,cameraTransform(islandAreas[1],335,350));
  for(const width of [280,335,768,1240])for(const area of islandAreas){
    const height=width<760?350:550;
    const values=cameraTransform(area,width,height).match(/-?\d+(?:\.\d+)?/g).map(Number);
    const [x,y,scale]=values;
    const imageWidth=Math.min(width,height*1600/914),imageHeight=imageWidth*914/1600;
    const focalX=(area.x*imageWidth+(width-imageWidth)/2)*scale+x;
    const focalY=(area.y*imageHeight+(height-imageHeight)/2)*scale+y;
    assert.ok(Math.abs(focalX-width*.5)<.001);
    assert.ok(Math.abs(focalY-height*.46)<.001);
  }
});
test('Mobile navigation toggles and closes on Escape',()=>{
  const {document,window}=setup();
  const button=document.querySelector('.menu-toggle');const menu=document.getElementById('mobile-nav');
  assert.equal(menu.hidden,true);button.click();assert.equal(menu.hidden,false);
  assert.equal(button.getAttribute('aria-expanded'),'true');
  const event=new window.Event('keydown');event.key='Escape';document.dispatchEvent(event);
  assert.equal(menu.hidden,true);assert.equal(button.getAttribute('aria-expanded'),'false');
});
