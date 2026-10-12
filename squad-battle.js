'use strict';
// A stock belongs to a team member. Replacing a member never resets the opponent.
const SquadBattle=(()=>{
 const teams={player:['dragoon','random','random','random','random'],cpu:['dragoon','random','random','random','random']},slots={player:0,cpu:0};let previousSize=1;
 const size=()=>{const mode=document.querySelector('#battle-mode').value;return mode==='squad3'?3:mode==='squad5'?5:mode==='online'?+document.querySelector('#squad-size').value:1;};
 function choose(id){if(size()<2)return;teams[Roster.target][slots[Roster.target]]=id;}
 function refresh(){
  const count=size(),row=document.querySelector('#squad-lineup');if(!row)return;
  if(count>1&&previousSize===1){teams.player[0]=Roster.selected;teams.cpu[0]=document.querySelector('#cpu-character').value;slots.player=slots.cpu=0;}previousSize=count;
  row.classList.toggle('hidden',count<2);row.replaceChildren();if(count<2)return;
  const side=Roster.target;row.setAttribute('aria-label',(side==='cpu'?'CPU':'1P')+'の出場順');
  for(let n=0;n<count;n++){
   const id=teams[side][n],d=Roster.definitions.find(d=>d.id===id),button=document.createElement('button');button.className='squad-slot';button.classList.toggle('active',slots[side]===n);button.setAttribute('aria-pressed',String(slots[side]===n));button.dataset.slot=n;
   const image=document.createElement('img');image.alt='';if(id!=='random'){const url=ArtLoader.portrait(id,side==='cpu'?+document.querySelector('#color2').value:selected,d?.pose??0,true);if(url)image.src=url;}else image.hidden=true;
   const label=document.createElement('span');label.textContent=(n+1)+' · '+(d?.name||'おまかせ');button.append(image,label);button.onclick=()=>{slots[side]=n;Roster.chooseForSlot(id);refresh();};row.append(button);
  }
  document.querySelector('#roster-selection-hint').textContent=(side==='cpu'?'CPU':'1P')+' '+count+'人団体戦 · '+(slots[side]+1)+'人目を選択';
 }
 function config(){const count=size();return{size:count,teams:['player','cpu'].map(side=>teams[side].slice(0,count).map(id=>Roster.resolve(id)))};}
 function start(config){if(!config||config.size<2)return;for(let n=0;n<2;n++){const team=config.teams[n];fighters[n]=makeFighter(n,fighters[n].color,team[0]);Object.assign(fighters[n],{squad:team.slice(),squadIndex:0,stocks:team.length});}}
 function onKO(f){if(!f.squad||f.stocks<=0)return;for(const rules of Object.values(NewcomerCore.registry))for(const q of rules.objects)if(q.owner===f.id)q.dead=true;f.nextSquadIndex=f.squadIndex+1;}
 function respawn(f){
  if(!f.squad)return false;
  const squad=f.squad,index=f.nextSquadIndex??f.squadIndex,stocks=f.stocks,stats=f.stats,id=f.id,color=f.color;
  const fresh=makeFighter(id,color,squad[index]);for(const key of Object.keys(f))delete f[key];Object.assign(f,fresh,{squad,squadIndex:index,stocks,stats});return true;
 }
 function hud(f,x,y){if(!f.squad)return;for(let n=0;n<f.squad.length;n++){const px=x+50+n*36,img=ArtLoader.hudPortrait(f.squad[n],f.color);ctx.save();ctx.globalAlpha=n<f.squadIndex?.22:1;ctx.fillStyle=n===f.squadIndex?'#e8f4ff':'#37445b';ctx.fillRect(px-1,y-28,34,24);if(img)ctx.drawImage(img,px,y-27,32,22);ctx.restore();}}
 function init(){
  const select=document.querySelector('#squad-size');select.onchange=()=>{refresh();BattlePlayers.refresh();Roster.summary();Roster.fit();};
  document.querySelector('#enter-squad').onclick=()=>Roster.open('squad3');refresh();
 }
 return{init,size,choose,refresh,config,start,onKO,respawn,hud,teams};
})();
