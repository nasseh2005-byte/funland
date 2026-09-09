/** Branch-local opening status, including overnight periods and dated exceptions.
 * hours uses keys 0 (Sunday) through 6; intervals are ["16:00", "23:00"].
 * A date exception of [] means closed, overriding regular and carryover hours.
 */
export function getOpeningStatus(branch, now = new Date()) {
  if (!branch?.hours || !Object.keys(branch.hours).length) return 'unconfirmed';
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: branch.timezone || 'Asia/Riyadh', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
  const p = Object.fromEntries(parts.map(part=>[part.type,part.value]));
  const date = `${p.year}-${p.month}-${p.day}`;
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  const previous = new Date(`${date}T12:00:00Z`); previous.setUTCDate(previous.getUTCDate()-1);
  const previousDate = previous.toISOString().slice(0,10);
  const exceptions = branch.exceptions || {};
  const explicitToday = Object.hasOwn(exceptions,date);
  const periods = explicitToday ? exceptions[date] : branch.hours[day] || [];
  const minute = Number(p.hour)*60+Number(p.minute);
  const toMinute = time => { if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return NaN; const [h,m]=time.split(':').map(Number); return h*60+m; };
  const within = (period, carryover=false) => {
    const [start,end]=period.map(toMinute);
    if(!Number.isFinite(start)||!Number.isFinite(end)||start===end)return false;
    if(carryover)return end<start&&minute<end;
    return end<start?minute>=start:minute>=start&&minute<end;
  };
  if(periods.some(period=>within(period)))return 'open';
  if(!explicitToday){
    const before = Object.hasOwn(exceptions,previousDate)?exceptions[previousDate]:branch.hours[(day+6)%7]||[];
    if(before.some(period=>within(period,true)))return 'open';
  }
  return 'closed';
}
