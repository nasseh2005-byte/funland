import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseHTML} from 'linkedom';
import {buildTripSummary} from '../src/lib/trips.mjs';
const input={groupType:'School',organization:'Example school',organizer:'Organizer',date:'2026-10-01',participants:'30',adults:'3',ageRange:'6–9',notes:'Ask about meals'};
test('Trip summary includes group details and an explicit enquiry-only statement in both languages',()=>{
 const en=buildTripSummary(input,'en','2026-09-09');assert.match(en,/Participants: 30/);assert.match(en,/Accompanying adults: 3/);assert.match(en,/Enquiry only/);
 const ar=buildTripSummary(input,'ar','2026-09-09');assert.match(ar,/عدد المشاركين: 30/);assert.match(ar,/طلب استفسار فقط/);
});
test('Trip form rejects missing fields, invalid counts, impossible or past dates',()=>{
 for(const override of [{organization:''},{participants:'0'},{participants:'1.5'},{adults:'-1'},{date:'2026-09-08'},{date:'2026-02-30'},{date:'garbage'}])assert.throws(()=>buildTripSummary({...input,...override},'en','2026-09-09'));
 assert.doesNotThrow(()=>buildTripSummary({...input,date:'2026-09-09',adults:'0'},'en','2026-09-09'));
});
test('Institution details live on business; old about routes redirect there',()=>{
 for(const lang of ['ar','en']){
  const {document}=parseHTML(fs.readFileSync(`dist/${lang}/business/index.html`,'utf8'));
  assert.ok(document.getElementById('registration'));assert.match(document.getElementById('registration').textContent,/4030425656/);
  assert.equal(document.querySelectorAll('#registration').length,1);
  const redirect=parseHTML(fs.readFileSync(`dist/${lang}/about/index.html`,'utf8')).document;
  assert.match(redirect.querySelector('meta[http-equiv=refresh]').getAttribute('content'),/business\/#registration/);
  assert.ok(!document.querySelector('.desktop-nav').textContent.includes(lang==='ar'?'عن المؤسسة':'About us'));
 }
});
test('Group visit form has labeled required fields and no collection of children’s identities',()=>{
 const {document}=parseHTML(fs.readFileSync('dist/ar/trips/index.html','utf8'));
 const form=document.getElementById('trip-form');assert.ok(form);
 for(const field of ['groupType','organization','organizer','date','participants','adults','ageRange']){const el=form.querySelector(`[name=${field}]`);assert.ok(el?.hasAttribute('required'));assert.ok(el?.closest('label'));}
 assert.equal(form.querySelectorAll('input[name*=child]').length,0);
 assert.ok(document.getElementById('trip-result').hidden);
});
