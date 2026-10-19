'use strict';
// Shared tournament state. Only view() may leave the online server before reveal.
const BingoRules=(()=>{
 const center=12,lines=[];
 for(let n=0;n<5;n++){lines.push(Array.from({length:5},(_,k)=>n*5+k));lines.push(Array.from({length:5},(_,k)=>k*5+n));}
 lines.push([0,6,12,18,24],[4,8,12,16,20]);
 const random=n=>Math.floor(Math.random()*n);
 const key=(s,seat)=>s.format==='teams'?'team:'+s.teams[seat]:'player:'+seat;
 const board=(s,seat)=>s.boards.find(b=>b.key===key(s,seat));
 const complete=b=>lines.filter(line=>line.every(i=>b.open[i]));
 function create(players,pool,{format='free',generation=1,choose=random}={}){
  const unique=[...new Set(pool.filter(id=>id&&id!=='random'))];if(unique.length<24)throw Error('Bingo requires 24 selectable characters');
  const s={generation,round:1,format,teams:players.map((p,n)=>p.battleTeam??p.team??n%2),boards:[],picks:players.map(()=>null),revealed:false,result:null,champion:null};
  players.forEach((_,seat)=>{const id=key(s,seat);if(s.boards.some(b=>b.key===id))return;const shuffled=unique.slice();for(let n=shuffled.length-1;n>0;n--){const k=choose(n+1);[shuffled[n],shuffled[k]]=[shuffled[k],shuffled[n]];}
   const cells=shuffled.slice(0,24);cells.splice(center,0,null);s.boards.push({key:id,cells,open:cells.map((_,n)=>n===center),previous:[],lines:0});
  });return s;
 }
 function available(s,seat){const b=board(s,seat);if(!b||s.champion||s.result||s.revealed)return[];return b.cells.flatMap((id,n)=>id&&!b.open[n]&&!b.previous.includes(id)?[n]:[]);}
 function pick(s,seat,cell){
  if(!Number.isInteger(seat)||seat<0||seat>=s.picks.length)return{ok:false,message:'参加者が見つかりません。'};
  if(s.revealed)return{ok:false,message:'全員の選択が確定したため、変更できません。'};
  if(!Number.isInteger(cell)||!available(s,seat).includes(cell))return{ok:false,message:'そのマスは選べません。開いたマスと前の試合の使用キャラは選択できません。'};
  s.picks[seat]={cell,character:board(s,seat).cells[cell]};s.revealed=s.picks.every(Boolean);return{ok:true};
 }
 function settle(s,winner){
  if(!s.revealed||s.result)return false;
  const valid=Number.isInteger(winner)&&(winner===-1||(s.format==='teams'?[0,1].includes(winner):winner>=0&&winner<s.picks.length));
  if(!valid)return false;
  const winKey=winner<0?null:s.format==='teams'?'team:'+winner:'player:'+winner,opened=[];
  for(const b of s.boards){
   const members=s.picks.flatMap((p,n)=>key(s,n)===b.key?[p]:[]);b.previous=[...new Set(members.map(p=>p.character))];
   const added=[];if(b.key===winKey)for(const p of members)if(!b.open[p.cell]){b.open[p.cell]=true;added.push(p.cell);}
   b.lines=complete(b).length;if(added.length)opened.push({key:b.key,cells:added});if(b.lines>=2)s.champion=b.key;
  }
  s.result={round:s.round,winner,opened,champion:s.champion};return true;
 }
 function next(s){if(!s.result||s.champion)return false;s.round++;s.result=null;s.picks=s.picks.map(()=>null);s.revealed=false;return true;}
 function cancel(s){s.picks=s.picks.map(()=>null);s.revealed=false;s.result=null;}
 function view(s,seat){
  if(!s)return null;
  return{generation:s.generation,round:s.round,format:s.format,teams:s.teams.slice(),boards:s.boards.map(b=>({...b,cells:b.cells.slice(),open:b.open.slice(),previous:b.previous.slice()})),picks:s.picks.map((p,n)=>p?s.revealed||n===seat?{...p,selected:true,locked:s.revealed}:{selected:true,locked:false}:null),revealed:s.revealed,result:s.result?JSON.parse(JSON.stringify(s.result)):null,champion:s.champion};
 }
 return{center,lines,key,board,complete,create,available,pick,settle,next,cancel,view};
})();
if(typeof module!=='undefined')module.exports=BingoRules;
