import {initializeExplorer,islandAreas} from '../lib/explorer.mjs';
const scene=document.querySelector<HTMLElement>('[data-explorer]');
if(scene){
 const controller=initializeExplorer(scene,{
  observe:(element:Element,callback:()=>void)=>{const observer=new ResizeObserver(callback);observer.observe(element);return observer;},
  emit:(name:string,properties:Record<string,string>)=>window.dispatchEvent(new CustomEvent('funisland:analytics',{detail:{name,properties}}))
 });
 const scrollToScene=()=>scene.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 document.querySelectorAll<HTMLButtonElement>('[data-open-game]').forEach(button=>button.addEventListener('click',()=>{if(controller.enter(button.dataset.openGame,button))scrollToScene();}));
 const followHash=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(islandAreas.some(area=>area.games.includes(id))){controller.enter(id);scrollToScene();}};
 if(location.hash)requestAnimationFrame(followHash);
 window.addEventListener('hashchange',followHash);
}
