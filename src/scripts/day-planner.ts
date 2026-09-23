document.querySelectorAll<HTMLElement>('[data-day-planner]').forEach(planner=>{
  const tabs=[...planner.querySelectorAll<HTMLButtonElement>('[data-route-tab]')];
  const panels=[...planner.querySelectorAll<HTMLElement>('[data-route-panel]')];
  function select(index:number,focus=false){
    tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
    panels.forEach((panel,i)=>panel.hidden=i!==index);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      const rightStep=document.documentElement.dir==='rtl'?-1:1;
      const delta=event.key==='ArrowRight'?rightStep:event.key==='ArrowLeft'?-rightStep:0;
      const target=event.key==='Home'?0:event.key==='End'?tabs.length-1:delta?(index+delta+tabs.length)%tabs.length:null;
      if(target!==null){event.preventDefault();select(target,true);}
    });
  });
});
