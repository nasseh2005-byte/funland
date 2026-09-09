import {getOpeningStatus} from '../lib/hours.mjs';
function storageSet(key: string, value: string) {try {localStorage.setItem(key,value);} catch { /* The UI works when storage is unavailable. */ }}
const root = document.documentElement;
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
function updateThemeButton() {themeButton?.setAttribute('aria-pressed',String(root.dataset.theme==='dark'));}
updateThemeButton();
themeButton?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';storageSet('fi-theme',root.dataset.theme);updateThemeButton();});
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const menu = document.querySelector<HTMLElement>('#mobile-nav');
function closeMenu() {if(menu)menu.hidden=true;menuButton?.setAttribute('aria-expanded','false');}
menuButton?.addEventListener('click',()=>{if(!menu)return;menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeMenu();});
matchMedia('(min-width: 1051px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let count=0;
  document.querySelectorAll<HTMLElement>('[data-game-category]').forEach(card=>{card.hidden=category!=='all'&&card.dataset.gameCategory!==category;if(!card.hidden)count++;});
  const output=document.querySelector('#filter-count');if(output)output.textContent=`${count} ${root.lang==='ar'?'تجارب':'experiences'}`;
  track('games_filter',{category});
}));
document.querySelectorAll<HTMLButtonElement>('[data-open-game]').forEach(button=>button.addEventListener('click',()=>{
  const dialog=document.getElementById(`detail-${button.dataset.openGame}`) as HTMLDialogElement|null;
  dialog?.showModal();track('game_view',{game:button.dataset.openGame});
}));
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog=>{
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
});
function track(name: string, properties: Record<string,unknown>={}) {
  // No analytics vendor, cookies, personal data or network request by default.
  window.dispatchEvent(new CustomEvent('funisland:analytics',{detail:{name,properties}}));
}
document.querySelectorAll<HTMLElement>('[data-event]').forEach(item=>item.addEventListener('click',()=>track(item.dataset.event!)));
document.querySelector('#print-profile')?.addEventListener('click',()=>window.print());
function refreshHours() {
  document.querySelectorAll<HTMLElement>('[data-opening-status]').forEach(element=>{
    try {const status=getOpeningStatus(JSON.parse(element.dataset.branch!));
      const labels:Record<string,string[]>= {open:['مفتوح الآن','Open now'],closed:['مغلق الآن','Closed now'],unconfirmed:['تحقق من أوقات الزيارة','Check visiting hours']};
      element.textContent=labels[status][root.lang==='ar'?0:1];
      element.classList.toggle('available',status==='open');
    } catch { /* Keep the unconfirmed fallback when content is incomplete. */ }
  });
}
refreshHours();
setInterval(refreshHours,60000);
