document.querySelectorAll<HTMLElement>('[data-chooser]').forEach(chooser=>{
  const tabs=[...chooser.querySelectorAll<HTMLButtonElement>('[data-choose]')];
  const panels=[...chooser.querySelectorAll<HTMLElement>('[data-choice-panel]')];
  function select(index:number,focus=false){
    tabs.forEach((tab,i)=>{const selected=i===index;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus();});
    panels.forEach((panel,i)=>panel.hidden=i!==index);
    const counter=chooser.querySelector<HTMLElement>('.picker-index');if(counter)counter.textContent=`0${index+1} / 03`;
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
