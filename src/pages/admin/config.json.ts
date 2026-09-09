import type { APIRoute } from 'astro';
const bilingual=(name:string,label:string,widget='string')=>({name,label,widget:'object',fields:[{name:'ar',label:'العربية',widget},{name:'en',label:'English',widget}]});
const string=(name:string,label:string,required=true)=>({name,label,widget:'string',required});
const list=(name:string,label:string,fields:unknown[])=>({name,label,widget:'list',fields});
const packageFields=[string('id','المعرف'),bilingual('title','العنوان'),bilingual('description','التفاصيل','text'),{name:'amount',label:'السعر بالريال',widget:'number',value_type:'float',min:0,required:false},{name:'published',label:'منشور',widget:'boolean',default:false},string('start','البداية YYYY-MM-DD',false),string('end','النهاية YYYY-MM-DD',false)];
export const GET: APIRoute=()=>new Response(JSON.stringify({
  backend:{name:'github',repo:'nasseh2005-byte/funland',branch:'main'},
  load_config_file:false,
  media_folder:'public/images',public_folder:'images',
  publish_mode:'editorial_workflow',
  collections:[{name:'website',label:'محتوى الموقع',files:[{name:'site',label:'بيانات جزيرة المرح',file:'src/data/site.json',fields:[
    {name:'organization',label:'المؤسسة',widget:'object',fields:[bilingual('name','اسم المؤسسة'),bilingual('brand','اسم العلامة'),string('registration','السجل التجاري'),string('unifiedNumber','الرقم الوطني الموحد'),string('issueDate','تاريخ الإصدار'),string('phone','هاتف المصدر',false),{name:'publicPhone',label:'الهاتف مؤكد للنشر',widget:'boolean',default:false},string('email','البريد الرسمي',false),string('whatsapp','واتساب بصيغة دولية',false),{name:'activities',label:'معرفات الأنشطة',widget:'list'},{name:'sourceNote',label:'ملاحظات المصدر',widget:'text'}]},
    list('games','الألعاب والتجارب',[string('id','المعرف'),string('branchId','معرف الفرع'),{name:'category',label:'التصنيف',widget:'select',options:['family','adventure','electronic']},bilingual('title','اسم التجربة'),bilingual('description','الوصف','text'),{name:'icon',label:'الأيقونة',widget:'select',options:['car','wheel','gamepad','train','spark']},string('age','العمر',false),string('minHeight','الطول',false),string('price','السعر',false),{name:'status',label:'الحالة',widget:'select',options:['unconfirmed','available','unavailable']},{name:'image',label:'صورة حقيقية',widget:'image',required:false},{name:'featured',label:'تظهر بالرئيسية',widget:'boolean',default:false}]),
    list('branches','الفروع',[string('id','المعرف'),bilingual('name','اسم الفرع'),bilingual('city','المدينة'),bilingual('address','العنوان'),string('mapsUrl','رابط الاتجاهات',false),string('timezone','المنطقة الزمنية'),{name:'hours',label:'الأوقات حسب أيام الأسبوع 0–6',widget:'object',fields:Array.from({length:7},(_,day)=>({name:String(day),label:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][day],widget:'list',required:false,field:{name:'interval',label:'فترة [بداية، نهاية] بصيغة HH:mm',widget:'list'}}))},{name:'exceptions',label:'استثناءات الأوقات حسب التاريخ',widget:'hidden'},list('pricing','الباقات',packageFields),list('offers','العروض',packageFields),{name:'gallery',label:'الصور',widget:'list',field:{name:'image',label:'صورة',widget:'image'}},{name:'amenities',label:'المرافق',widget:'list'}]),
    {name:'announcements',label:'الإعلانات',widget:'hidden'},
    list('faqs','الأسئلة الشائعة',[bilingual('question','السؤال'),bilingual('answer','الإجابة','text')])
  ]}]}]
}),{headers:{'Content-Type':'application/json'}});
