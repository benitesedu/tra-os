export const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
export const score=(h,e,won)=>won?Math.max(0,100-h*15-e*5):0;
export const locales=['pt','en','es'];
export function dailyIndex(day,locale,count){return ((Math.floor(Date.parse(day+'T00:00:00Z')/86400000)*3+locales.indexOf(locale))%count+count)%count;}
