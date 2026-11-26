import {library} from '../../../../../packages/database/content';
import {dailyIndex,normalize,score} from '../../../../../packages/game-engine/index.mjs';

type Feedback='correct'|'present'|'absent';

function evaluate(guess:string,answer:string):Feedback[]{
  const feedback:Feedback[]=Array.from({length:guess.length},()=> 'absent');
  const remaining:Record<string,number>={};
  for(let i=0;i<answer.length;i++)if(i>=guess.length||guess[i]!==answer[i])remaining[answer[i]]=(remaining[answer[i]]||0)+1;
  for(let i=0;i<guess.length;i++)if(i<answer.length&&guess[i]===answer[i])feedback[i]='correct';
  for(let i=0;i<guess.length;i++)if(feedback[i]==='absent'&&remaining[guess[i]]){feedback[i]='present';remaining[guess[i]]--;}
  return feedback;
}

export async function POST(req:Request){const b=await req.json();const locale=['pt','en','es'].includes(b.locale)?b.locale:'pt';const day=new Date().toISOString().slice(0,10);const c=library[dailyIndex(day,locale,library.length)];const answer=normalize(c.translations[locale]);const guess=typeof b.guess==='string'?normalize(b.guess):'';const level=Math.max(1,Math.min(5,Number(b.level)||1));const errors=Math.max(0,Math.min(5,Number(b.errors)||0));const won=guess.length>0&&guess===answer;const failed=!won&&guess.length>0&&errors>=5;return Response.json({day,locale,wordLength:answer.length,feedback:guess?evaluate(guess,answer):[],drawing:{...c.drawing,layers:c.drawing.layers.slice(0,level)},won,failed,points:score(level-1,Math.max(0,errors-(won?1:0)),won),answer:won||failed?c.translations[locale]:null},{headers:{'Cache-Control':'no-store'}})}
