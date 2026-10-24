'use strict';
// A stock belongs to a team member. Replacing a member never resets the opponent.
const SquadBattle=(()=>{
 const teams={player:['random','random','random','random','random'],cpu:['random','random','random','random','random']},slots={player:0,cpu:0};let previousSize=1,moving=null;
 const editable=()=>state==='menu'&&!(document.querySelector('#battle-mode').value==='online'&&Net.lineupLocked);
 function cancelReorder(){moving=null;refresh();}
 function swap(side,from,to){if(!editable()||![from,to].every(n=>Number.isInteger(n)&&n>=0&&n<size()))return false;[teams[side][from],teams[side][to]]=[teams[side][to],teams[side][from]];slots[side]=to;moving=null;Roster.chooseForSlot(teams[side][to]);refresh();document.querySelector('#squad-lineup').dispatchEvent(new Event('change',{bubbles:true}));return true;}
 function reorder(n){if(!editable())return false;const side=document.querySelector('#battle-mode').value==='online'?'player':Roster.target;if(moving?.side===side){if(moving.slot===n)cancelReorder();else swap(side,moving.slot,n);}else{moving={side,slot:n};refresh();}return true;}
 const size=()=>{const mode=document.querySelector('#battle-mode').value;if(document.querySelector('#match-kind').value==='bingo'&&mode==='online')return 1;return mode==='squad3'?3:mode==='squad5'?5:mode==='online'?+document.querySelector('#squad-size').value:1;};
 function available(id){if(document.querySelector('#match-kind').value==='bingo'&&document.querySelector('#battle-mode').value==='online')return false;const side=document.querySelector('#battle-mode').value==='online'?'player':Roster.target;return size()<2||id==='random'||!teams[side].slice(0,size()).some((used,n)=>n!==slots[side]&&used===id);}
 function valid(){return size()<2||(document.querySelector('#battle-mode').value==='online'?['player']:['player','cpu']).every(side=>!SquadRules.duplicate(teams[side].slice(0,size())));}
 function choose(id){if(!available(id)){document.querySelector('#roster-selection-hint').textContent='そのキャラは別の出場枠で選択済みです';return false;}if(size()>1)teams[Roster.target][slots[Roster.target]]=id;return true;}
 function refresh(){
  const bingo=document.querySelector('#match-kind').value==='bingo'&&document.querySelector('#battle-mode').value==='online',count=size(),online=document.querySelector('#battle-mode').value==='online',joined=online&&!!Net.code;document.querySelector('#online-lineup-size').value=String(count);document.querySelector('#online-lineup-help').textContent=joined&&Net.slot!==0?'編成数はルーム作成者が設定':count>1?'出場枠 → ファイターを選択':'3・5キャラの団体戦も選べます';const row=document.querySelector('#squad-lineup');if(!row)return;
  if(count>1&&previousSize===1){teams.player[0]=Roster.selected;teams.cpu[0]=document.querySelector('#cpu-character').value;slots.player=slots.cpu=0;}if(count>previousSize)for(const side of ['player','cpu']){const seen=new Set();for(let n=0;n<count;n++){const id=teams[side][n];if(id==='random')continue;if(seen.has(id))teams[side][n]='random';else seen.add(id);}}previousSize=count;for(const side of ['player','cpu'])slots[side]=Math.min(slots[side],Math.max(0,count-1));
  for(const card of document.querySelectorAll('.fighter-card')){card.disabled=!available(card.dataset.id);card.classList.toggle('squad-taken',card.disabled&&count>1);card.setAttribute('aria-label',card.querySelector('b').textContent+(card.disabled?bingo?'（ビンゴカードから選択）':'（別の出場枠で選択済み）':''));}
  row.classList.toggle('hidden',count<2);row.replaceChildren();if(bingo)document.querySelector('#roster-selection-hint').textContent='使用キャラはビンゴカードから選択してください';if(count<2)return;
  const side=online?'player':Roster.target,owner=online?(Net.slot+1)+'P':side==='cpu'?'CPU':'1P';if(moving&&(moving.side!==side||moving.slot>=count||!editable()))moving=null;row.setAttribute('aria-label',owner+'の出場順');
  for(let n=0;n<count;n++){
   const id=teams[side][n],d=Roster.definitions.find(d=>d.id===id),button=document.createElement('button');button.className='squad-slot';button.classList.toggle('active',slots[side]===n);button.classList.toggle('reordering',moving?.side===side&&moving.slot===n);button.setAttribute('aria-pressed',String(slots[side]===n));button.dataset.slot=n;button.disabled=!editable();button.draggable=editable();
   const image=document.createElement('img');image.alt='';if(id!=='random'){const url=ArtLoader.portrait(id,side==='cpu'?+document.querySelector('#color2').value:selected,d?.pose??0,true);if(url)image.src=url;}else image.hidden=true;
   const label=document.createElement('span');label.textContent=(n+1)+'人目 · '+(d?.name||'おまかせ');button.setAttribute('aria-label',owner+' '+(n+1)+'人目を変更：'+(d?.name||'おまかせ'));button.append(image,label);let hold=null,held=false,start=null;
   button.onclick=()=>{if(held){held=false;return;}if(moving){reorder(n);return;}slots[side]=n;Roster.chooseForSlot(id);refresh();};
   const clearHold=()=>{clearTimeout(hold);hold=null;};button.onpointerdown=e=>{if(e.button!==0||!editable())return;start={x:e.clientX,y:e.clientY};held=false;hold=setTimeout(()=>{held=true;reorder(n);},500);};button.onpointermove=e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>9)clearHold();};button.onpointerup=button.onpointercancel=button.onpointerleave=clearHold;
   button.ondragstart=e=>{clearHold();moving={side,slot:n};e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('application/x-squad-slot',JSON.stringify(moving));};button.ondragover=e=>{if(editable()&&moving?.side===side){e.preventDefault();e.dataTransfer.dropEffect='move';button.classList.add('drop-target');}};button.ondragleave=()=>button.classList.remove('drop-target');button.ondrop=e=>{e.preventDefault();if(moving?.side===side)swap(side,moving.slot,n);};button.ondragend=()=>{if(moving)cancelReorder();};row.append(button);
  }
  document.querySelector('#roster-selection-hint').textContent=moving?.side===side?'入れ替える出場枠を押してください（同じ枠でキャンセル）':owner+' '+count+'キャラ団体戦 · ドラッグ / 長押しで順番入れ替え';
 }
 function config(){const count=size();return{size:count,teams:['player','cpu'].map(side=>SquadRules.resolve(teams[side].slice(0,count),Roster.selectable.map(d=>d.id)))};}
 function start(config){if(!config||config.size<2)return;for(let n=0;n<fighters.length;n++){const team=config.teams[n],previous=fighters[n];fighters[n]=Object.assign(makeFighter(n,previous.color,team[0]),{control:previous.control,team:previous.team,x:previous.x,y:previous.y,face:previous.face,squad:team.slice(),squadIndex:0,stocks:team.length});}}
 function onKO(f){if(!f.squad||f.stocks<=0)return;for(const rules of Object.values(NewcomerCore.registry))for(const q of rules.objects)if(q.owner===f.id)q.dead=true;f.nextSquadIndex=f.squadIndex+1;}
 function respawn(f){
  if(!f.squad)return false;
  const squad=f.squad,index=f.nextSquadIndex??f.squadIndex,stocks=f.stocks,stats=f.stats,id=f.id,color=f.color,team=f.team,control=f.control;
  const fresh=makeFighter(id,color,squad[index]);for(const key of Object.keys(f))delete f[key];Object.assign(f,fresh,{squad,squadIndex:index,stocks,stats,team,control});return true;
 }
 function hud(f,x,y){if(!f.squad)return;for(let n=0;n<f.squad.length;n++){const px=x+50+n*36,img=ArtLoader.hudPortrait(f.squad[n],f.color);ctx.save();ctx.globalAlpha=n<f.squadIndex?.22:1;ctx.fillStyle=n===f.squadIndex?'#e8f4ff':'#37445b';ctx.fillRect(px-1,y-28,34,24);if(img)ctx.drawImage(img,px,y-27,32,22);ctx.restore();}}
 function init(){
  const select=document.querySelector('#squad-size');select.onchange=()=>{refresh();BattlePlayers.refresh();Roster.summary();Roster.fit();};
  document.querySelector('#online-lineup-size').onchange=event=>{select.value=event.target.value;select.dispatchEvent(new Event('change',{bubbles:true}));};
  refresh();
 }
 return{init,size,available,valid,choose,refresh,config,start,onKO,respawn,hud,teams,reorder,cancelReorder,get reordering(){return!!moving;}};
})();
