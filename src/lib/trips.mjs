export function buildTripSummary(input,lang='ar',today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'})){
  const t=(ar,en)=>lang==='ar'?ar:en;
  const fields=['groupType','organization','organizer','date','participants','adults','ageRange'];
  if(fields.some(field=>!String(input[field]??'').trim()))throw Error(t('أكملوا الحقول المطلوبة أولًا.','Complete all required fields first.'));
  const date=String(input.date);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<today)throw Error(t('اختاروا تاريخًا صحيحًا اليوم أو بعده.','Choose a valid date today or later.'));
  const participants=Number(input.participants),adults=Number(input.adults);
  if(!Number.isInteger(participants)||participants<1||participants>5000||!Number.isInteger(adults)||adults<0||adults>1000)throw Error(t('راجعوا أعداد المشاركين والمرافقين.','Check the participant and adult counts.'));
  const clean=(value,max)=>String(value??'').trim().replace(/[\r\n]+/g,' ').slice(0,max);
  return [t('طلب تنسيق رحلة — جزيرة المرح','Group visit enquiry — Fun Island'),
    `${t('نوع المجموعة','Group type')}: ${clean(input.groupType,80)}`,
    `${t('الجهة / المجموعة','Organization / group')}: ${clean(input.organization,100)}`,
    `${t('المنسق','Organizer')}: ${clean(input.organizer,80)}`,
    `${t('التاريخ المقترح','Preferred date')}: ${date}`,
    `${t('عدد المشاركين','Participants')}: ${participants}`,
    `${t('عدد المرافقين','Accompanying adults')}: ${adults}`,
    `${t('الفئة العمرية','Age range')}: ${clean(input.ageRange,80)}`,
    ...(String(input.notes??'').trim()?[`${t('ملاحظات','Notes')}: ${clean(input.notes,1000)}`]:[]),
    '',t('طلب استفسار فقط؛ الموعد والخدمات والتكلفة بحاجة إلى اتفاق مباشر.','Enquiry only; date, services and cost require a direct agreement.')].join('\n');
}
