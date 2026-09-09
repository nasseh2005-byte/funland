export const islandAreas=[
 {id:'family',x:.28,y:.29,games:['carousel','train'],ar:'واحة العائلة',en:'Family oasis'},
 {id:'adventure',x:.68,y:.32,games:['cars','jump'],ar:'شاطئ المغامرة',en:'Adventure shore'},
 {id:'electronic',x:.49,y:.62,games:['arcade'],ar:'جزيرة التحدّي',en:'Challenge island'}
];
export function cameraTransform(area,width,height){
 if(!area||width<=0||height<=0)return 'translate(0px, 0px) scale(1)';
 // Image and pin coordinates share a fixed 1600 × 914 canvas; contain never crops the overview.
 const scale=2.45;
 const imageWidth=Math.min(width,height*1600/914);
 const imageHeight=imageWidth*914/1600;
 const targetX=width*.5,targetY=height*.46;
 const x=targetX-(area.x*imageWidth+(width-imageWidth)/2)*scale;
 const y=targetY-(area.y*imageHeight+(height-imageHeight)/2)*scale;
 return `translate(${x}px, ${y}px) scale(${scale})`;
}
export function initializeExplorer(root,options={}){
 const doc=root.ownerDocument;
 const lang=doc.documentElement.lang==='ar'?'ar':'en';
 const viewport=root.querySelector('.explorer-viewport');
 const camera=root.querySelector('[data-camera]');
 const deck=root.querySelector('[data-game-deck]');
 let area=null,game=null,returnFocus=null;
 const all=selector=>Array.from(root.querySelectorAll(selector));
 const emit=options.emit||(()=>{});
 function updateCamera(){const width=viewport.clientWidth,height=viewport.clientHeight;camera.style.setProperty('--island-canvas-width',Math.min(width,height*1600/914)+'px');camera.style.transform=cameraTransform(area,width,height);}
 function showGame(id,focus=true){
  const matched=islandAreas.find(item=>item.games.includes(id));
  if(!matched)return false;
  area=matched;game=id;root.dataset.view='inside';root.dataset.area=area.id;root.dataset.game=id;
  deck.hidden=false;
  root.querySelector('[data-overview-pins]').hidden=true;
  root.querySelector('[data-overview-caption]').hidden=true;
  root.querySelector('[data-scene-toolbar]').hidden=false;
  root.querySelector('[data-scene-navigation]').hidden=false;
  root.querySelector('[data-current-area]').textContent=area[lang];
  all('[data-enter-area]').forEach(button=>button.setAttribute('aria-expanded',String(button.dataset.enterArea===area.id)));
  all('[data-switch-area]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.switchArea===area.id)));
  all('[data-select-game]').forEach(button=>{button.hidden=!area.games.includes(button.dataset.selectGame);button.setAttribute('aria-pressed',String(button.dataset.selectGame===id));});
  all('[data-scene-game]').forEach(panel=>panel.hidden=panel.dataset.sceneGame!==id);
  const title=root.querySelector(`[data-scene-game="${id}"] h3`);
  root.querySelector('[data-scene-status]').textContent=area[lang]+': '+title.textContent;
  updateCamera();
  if(focus)title.focus({preventScroll:true});
  emit('game_view',{game:id,area:area.id});
  return true;
 }
 function enter(id,trigger){if(root.dataset.view==='overview')returnFocus=trigger||doc.activeElement;return showGame(id);}
 function leave(){
  if(!area)return;
  area=null;game=null;root.dataset.view='overview';delete root.dataset.area;delete root.dataset.game;
  deck.hidden=true;
  root.querySelector('[data-overview-pins]').hidden=false;
  root.querySelector('[data-overview-caption]').hidden=false;
  root.querySelector('[data-scene-toolbar]').hidden=true;
  root.querySelector('[data-scene-navigation]').hidden=true;
  all('[data-enter-area]').forEach(button=>button.setAttribute('aria-expanded','false'));
  all('[data-switch-area]').forEach(button=>button.setAttribute('aria-pressed','false'));
  root.querySelector('[data-scene-status]').textContent=lang==='ar'?'عدتم إلى خريطة الجزيرة':'Back to the island overview';
  updateCamera();returnFocus?.focus({preventScroll:true});
 }
 function switchArea(id){const next=islandAreas.find(item=>item.id===id);if(next)showGame(next.games[0]);}
 all('[data-enter-area]').forEach(button=>button.addEventListener('click',()=>{const next=islandAreas.find(item=>item.id===button.dataset.enterArea);if(next)enter(next.games[0],button);}));
 all('[data-switch-area]').forEach(button=>button.addEventListener('click',()=>switchArea(button.dataset.switchArea)));
 all('[data-select-game]').forEach(button=>button.addEventListener('click',()=>showGame(button.dataset.selectGame)));
 root.querySelector('[data-leave-island]').addEventListener('click',leave);
 function next(delta){if(area)switchArea(islandAreas[(islandAreas.indexOf(area)+delta+islandAreas.length)%islandAreas.length].id);}
 root.querySelector('[data-previous-area]').addEventListener('click',()=>next(-1));
 root.querySelector('[data-next-area]').addEventListener('click',()=>next(1));
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&area){event.preventDefault();leave();}});
 updateCamera();
 const observer=options.observe?.(viewport,updateCamera);
 return {enter,leave,resize:updateCamera,getState:()=>({area:area?.id||null,game}),destroy:()=>observer?.disconnect()};
}
