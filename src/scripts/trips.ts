import {buildTripSummary} from '../lib/trips.mjs';
const form=document.querySelector<HTMLFormElement>('#trip-form');
const result=document.querySelector<HTMLElement>('#trip-result');
const summary=document.querySelector<HTMLTextAreaElement>('#trip-summary');
const error=document.querySelector<HTMLElement>('#trip-error');
const feedback=document.querySelector<HTMLElement>('#copy-feedback');
const ar=document.documentElement.lang==='ar';
const date=form?.querySelector<HTMLInputElement>('[name=date]');
const submitButton=form?.querySelector<HTMLButtonElement>('[data-trip-submit]');
if(submitButton)submitButton.disabled=false;
if(date)date.min=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'});
form?.addEventListener('submit',event=>{
  event.preventDefault();if(!summary||!result||!error)return;
  try {
    summary.value=buildTripSummary(Object.fromEntries(new FormData(form)),ar?'ar':'en');
    result.hidden=false;error.textContent='';if(feedback)feedback.textContent='';
    document.getElementById('trip-result-title')?.focus();
  }catch(e){error.textContent=e instanceof Error?e.message:(ar?'راجعوا البيانات.':'Check the details.');result.hidden=true;}
});
form?.addEventListener('input',()=>{if(result)result.hidden=true;if(error)error.textContent='';if(feedback)feedback.textContent='';});
document.querySelector('#copy-trip')?.addEventListener('click',async()=>{
  if(!summary||!feedback)return;
  try{await navigator.clipboard.writeText(summary.value);feedback.textContent=ar?'تم النسخ. لم يُرسل الطلب.':'Copied. The enquiry has not been sent.';}
  catch{summary.focus();summary.select();feedback.textContent=ar?'حدّدنا النص؛ انسخوه يدويًا من الحقل.':'The text is selected. Please copy it manually.';}
});
