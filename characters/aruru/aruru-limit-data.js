"use strict";

const AruruLimitProfile=(()=>{
 const contactHold=15,cutInHold=22;
 const duration=330+contactHold+cutInHold;
 const shotTime=time=>{
  const elapsed=time-contactHold;
  return elapsed-Math.min(cutInHold,Math.max(0,elapsed-15));
 };
 const opener=CombatData.createMove('リミットブレイク',9,[CombatData.window(9,23)],30,22,{
  damage:5,reach:225,hitboxSize:1.65,pose:7,aerial:true,canClank:false,intangibleFrames:[[1,23]],soundFamily:'magic'
 });
 // Column strings are ordered bottom to top. The pieces keep their IDs as they fall.
 const initial=['GBG','RR','BBRBY','GGB','YYGYR','BBYYR'].map((column,x)=>
  Array.from(column,(color,y)=>({id:x*10+y,color})));
 const drops=[
  {time:78,column:3,colors:['G','G']},
  {time:136,column:0,colors:['B','R']}
 ];
 const clearTimes=[187,207,227,247];
 let columns=initial.map(column=>column.slice());
 for(const drop of drops)drop.colors.forEach((color,index)=>{
  const x=drop.column+index,y=columns[x].length;
  const piece={id:x*10+y,color};
  columns[x].push(piece);
  (drop.pieces??=[]).push({...piece,x,y});
 });
 function groups(board){
  const seen=new Set(),clear=new Set();
  board.forEach((column,x)=>column.forEach((piece,y)=>{
   if(seen.has(piece.id))return;
   const queue=[[x,y]];
   seen.add(piece.id);
   for(const [a,b] of queue){
    for(const [c,d] of [[a-1,b],[a+1,b],[a,b-1],[a,b+1]]){
     const next=board[c]?.[d];
     if(next?.color!==piece.color||seen.has(next.id))continue;
     queue.push([c,d]);
     seen.add(next.id);
    }
   }
   if(queue.length>=4)for(const [a,b] of queue)clear.add(board[a][b].id);
  }));
  return clear;
 }
 const clears=clearTimes.map(time=>{
  const ids=groups(columns);
  const before=columns;
  columns=before.map(column=>column.filter(piece=>!ids.has(piece.id)));
  return {time,ids,before,after:columns};
 });
 const combo=new Map([[187,3],[207,4],[227,4],[247,5]]);
 const cues=new Map([[1,['impact-heavy',.91]],[78,['aruru-limit-pop',.76]],[136,['aruru-limit-pop',.91]],
  ...clearTimes.map((time,index)=>[time,['aruru-limit-pop',1+index*.14]]),
  [287,['aruru-limit-bayoen',1]]]);
 const finalStrike={name:'ばよえ〜ん！',type:'limitFinisher',damage:27,launchDamage:36,angle:-.56,
  baseKnockback:4.5,knockbackGrowth:.075,launchPercentOffset:15,soundFamily:'magic',element:'light'};
 return {contactHold,duration,shotTime,opener,initial,drops,clears,combo,cues,contactCue:cues.get(1),finalStrike};
})();
LimitBreak.define('aruru',AruruLimitProfile,()=>AruruLimitVFX);
