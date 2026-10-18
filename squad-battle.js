'use strict';
// A stock belongs to a team member. Replacing a member never resets the opponent.
const SquadBattle=(()=>{
 const teams={player:['random','random','random','random','random'],cpu:['random','random','random','random','random']},slots={player:0,cpu:0};let previousSize=1;
 const size=()=>{const mode=document.querySelector('#battle-mode').value;if(document.querySelector('#match-kind').value==='bingo'&&['battle','online'].includes(mode))return 1;return mode==='squad3'?3:mode==='squad5'?5:mode==='online'?+document.querySelector('#squad-size').value:1;};
 function available(id){if(document.querySelector('#match-kind').value==='bingo'&&['battle','online'].includes(document.querySelector('#battle-mode').value))return false;const side=document.querySelector('#battle-mode').value==='online'?'player':Roster.target;return size()<2||id==='random'||!teams[side].slice(0,size()).some((used,n)=>n!==slots[side]&&used===id);}
 function valid(){return size()<2||(document.querySelector('#battle-mode').value==='online'?['player']:['player','cpu']).every(side=>!SquadRules.duplicate(teams[side].slice(0,size())));}
 function choose(id){if(!available(id)){document.querySelector('#roster-selection-hint').textContent='そのキャラは別の出場枠で選択済みです';return false;}if(size()>1)teams[Roster.target][slots[Roster.target]]=id;return true;}
 function refresh(){
  const bingo=document.querySelector('#match-kind').value==='bingo'&&['battle','online'].includes(document.querySelector('#battle-mode').value),count=size(),online=document.querySelector('#battle-mode').value==='online',joined=online&&!!Net.code;document.querySelector('#online-lineup-size').value=String(count);document.querySelector('#online-lineup-help').textContent=joined&&Net.slot!==0?'編成数はルーム作成者が設定':count>1?'出場枠 → ファイターを選択':'3・5キャラの団体戦も選べます';const row=document.querySelector('#squad-lineup');if(!row)return;
  if(count>1&&previousSize===1){teams.player[0]=Roster.selected;teams.cpu[0]=document.querySelector('#cpu-character').value;slots.player=slots.cpu=0;}if(count>previousSize)for(const side of ['player','cpu']){const seen=new Set();for(let n=0;n<count;n++){const id=teams[side][n];if(id==='random')continue;if(seen.has(id))teams[side][n]='random';else seen.add(id);}}previousSize=count;for(const side of ['player','cpu'])slots[side]=Math.min(slots[side],Math.max(0,count-1));
  for(const card of document.querySelectorAll('.fighter-card')){card.disabled=!available(card.dataset.id);card.classList.toggle('squad-taken',card.disabled&&count>1);card.setAttribute('aria-label',card.querySelector('b').textContent+(card.disabled?bingo?'（ビンゴカードから選択）':'（別の出場枠で選択済み）':''));}
  row.classList.toggle('hidden',count<2);row.replaceChildren();if(bingo)document.querySelector('#roster-selection-hint').textContent='使用キャラはビンゴカードから選択してください';if(count<2)return;
  const side=online?'player':Roster.target,owner=online?(Net.slot+1)+'P':side==='cpu'?'CPU':'1P';row.setAttribute('aria-label',owner+'の出場順');
  for(let n=0;n<count;n++){
   const id=teams[side][n],d=Roster.definitions.find(d=>d.id===id),button=document.createElement('button');button.className='squad-slot';button.classList.toggle('active',slots[side]===n);button.setAttribute('aria-pressed',String(slots[side]===n));button.dataset.slot=n;
   const image=document.createElement('img');image.alt='';if(id!=='random'){const url=ArtLoader.portrait(id,side==='cpu'?+document.querySelector('#color2').value:selected,d?.pose??0,true);if(url)image.src=url;}else image.hidden=true;
   const label=document.createElement('span');label.textContent=(n+1)+'人目 · '+(d?.name||'おまかせ');button.setAttribute('aria-label',owner+' '+(n+1)+'人目を変更：'+(d?.name||'おまかせ'));button.append(image,label);button.onclick=()=>{slots[side]=n;Roster.chooseForSlot(id);refresh();};row.append(button);
  }
  document.querySelector('#roster-selection-hint').textContent=owner+' '+count+'キャラ団体戦 · '+(slots[side]+1)+'人目を選択';
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
 // Show every locked lineup during the existing countdown, without extra delay.
 function drawReveal(){
  if(!Net.active||countdown<=0||!fighters[0]?.squad)return false;
  const height=100+fighters.length*76,top=(H-height)/2;
  ctx.save();path([[130,top],[1310,top],[1310,top+height],[130,top+height]],'#0b1424f2','#76bded88',1);
  text('出場順決定',720,top+32,24,'#e8f6ff');text(Math.ceil(countdown/60)+' / GET READY',720,top+56,11,'#91cfff');
  fighters.forEach((f,i)=>{
   const y=top+72+i*76,step=1040/f.squad.length,col=BattlePlayers.color(f);
   text(playerLabel(f.id),180,y+37,12,col);
   f.squad.forEach((id,n)=>{const x=250+n*step,img=ArtLoader.hudPortrait(id,f.color),name=Roster.definitions.find(d=>d.id===id)?.name||id;
    ctx.fillStyle='#1a2b43';ctx.fillRect(x,y,step-10,68);if(img)ctx.drawImage(img,x+(step-10)/2-26,y+5,52,34);
    ctx.fillStyle='#e3edf8';ctx.font='900 11px "Noto Sans JP",sans-serif';ctx.textAlign='center';ctx.fillText((n+1)+'. '+name,x+(step-10)/2,y+56,step-22);
   });
  });ctx.restore();return true;
 }
 function init(){
  const select=document.querySelector('#squad-size');select.onchange=()=>{refresh();BattlePlayers.refresh();Roster.summary();Roster.fit();};
  document.querySelector('#online-lineup-size').onchange=event=>{select.value=event.target.value;select.dispatchEvent(new Event('change',{bubbles:true}));};
  refresh();
 }
 return{init,size,available,valid,choose,refresh,config,start,onKO,respawn,hud,drawReveal,teams};
})();
