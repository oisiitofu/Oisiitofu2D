'use strict';
// Fighter IDs are seats (0..3), independent of teams, colors and character IDs.
const BattlePlayers=(()=>{
 const seats=[{character:'random',color:0,control:'primary',team:0},{character:'random',color:2,control:'cpu',team:1},{character:'random',color:1,control:'cpu',team:0},{character:'random',color:4,control:'cpu',team:1}];
 const seatColors=['#68baff','#ff718d','#ffd269','#8ce6ad'];let selection=0,teams=false,initialized=false,initialStocks=3,friendlyFire=true;
 const count=()=>SquadBattle.size()>1&&document.querySelector('#battle-mode').value!=='online'?2:['battle','online'].includes(document.querySelector('#battle-mode')?.value)?Number(document.querySelector('#player-count')?.value||2):2;
 const sameTeam=(a,b)=>teams&&a.team!==undefined&&a.team===b.team;
 const out=f=>!training&&f.stocks<=0;
 const canHit=(f,o)=>!!f&&!!o&&o!==f&&(!sameTeam(f,o)||friendlyFire);
 const targets=f=>fighters.filter(o=>canHit(f,o)&&!out(o)&&!o.respawn);
 function target(f){const live=targets(f),enemies=live.filter(o=>!sameTeam(f,o));return (enemies.length?enemies:live).sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y)||a.id-b.id)[0]||fighters.find(o=>o!==f)||f;}
 function projectileTarget(q){const f=fighters[q.owner],live=targets(f),eligible=live.filter(o=>!q.hits?.has?.(o.id)&&!q.kickHits?.has?.(o.id));return (eligible.length?eligible:live).sort((a,b)=>Math.hypot(a.x-(q.x+(q.vx||0)),a.y-35-(q.y+(q.vy||0)))-Math.hypot(b.x-(q.x+(q.vx||0)),b.y-35-(q.y+(q.vy||0)))||a.id-b.id)[0]||target(f);}
 function color(f){return teams?(f.team===0?'#ff718d':'#68baff'):seatColors[f.id];}
 function refresh(){
  if(!initialized)return;
  const relay=SquadBattle.size()>1,onlineMode=document.querySelector('#battle-mode').value==='online',joined=onlineMode&&!!Net.code;document.querySelector('#stock-count').disabled=relay||joined&&Net.slot!==0;document.querySelector('#player-count').disabled=relay&&!onlineMode||joined;document.querySelector('#battle-format').disabled=relay&&!onlineMode||joined;
  document.querySelector('#time-limit').disabled=joined&&Net.slot!==0;document.querySelector('#time-limit-setting').classList.toggle('hidden',document.querySelector('#battle-mode').value==='training');document.querySelector('#squad-size').disabled=joined&&Net.slot!==0;document.querySelector('#online-lineup-size').disabled=document.querySelector('#squad-size').disabled;
  const n=relay&&!onlineMode?2:count(),online=document.querySelector('#battle-mode').value==='online',allowed=['battle','online'].includes(document.querySelector('#battle-mode').value);
  document.querySelector('#multiplayer-settings').classList.toggle('hidden',!allowed);
  document.querySelector('#local-seat-settings').classList.toggle('hidden',online||!allowed);
  document.querySelector('#online-team-setting').classList.toggle('hidden',!online||document.querySelector('#battle-format').value!=='teams');
  document.querySelector('#team-attack-setting').classList.toggle('hidden',!allowed||document.querySelector('#battle-format').value!=='teams');
  document.querySelector('#team-attack').disabled=joined&&Net.slot!==0;
  document.querySelector('#character-screen').classList.toggle('four-player-roster',!online&&n>2);
  for(let slot=0;slot<4;slot++){
   const button=document.querySelector(slot===0?'#select-player':slot===1?'#select-cpu':'#select-seat-'+slot);
   if(slot>=2)button.classList.toggle('hidden',online||slot>=n);
   if(slot>=2){const d=Roster.definitions.find(d=>d.id===seats[slot].character);button.querySelector('b').textContent=d?.name||'おまかせ';const img=button.querySelector('img'),url=seats[slot].character==='random'?null:ArtLoader.portrait(seats[slot].character,seats[slot].color,d?.pose??0,true);img.hidden=!url;if(url)img.src=url;}
   button.classList.toggle('active',!online&&slot===selection||online&&slot===0);button.setAttribute('aria-pressed',String(slot===selection));
   button.style.borderColor=document.querySelector('#battle-format').value==='teams'?(seats[slot].team===0?'#ff718d':'#68baff'):'';
   button.querySelector('span').textContent=online&&slot===0?`${Net.slot+1}P`:n>2||seats[slot].control!=='cpu'?`${slot+1}P`:slot?'CPU':'1P';
   document.querySelector('#seat-settings-'+slot).classList.toggle('hidden',slot>=n);
  }
  if(selection>=n||online)selection=0;
 }
 function setSelection(slot){selection=slot;Roster.setTarget(slot===1?'cpu':'player',true);refresh();Roster.refreshSelection();}
 function setCharacter(id){if(selection<2)return false;seats[selection].character=id;refresh();Roster.refreshSelection();return true;}
 function setColor(value){if(selection<2)return false;seats[selection].color=value;refresh();Roster.artReady();return true;}
 const stockCount=()=>clamp(Number(document.querySelector('#stock-count').value)||3,1,10);
 const timeLimit=()=>MatchRules.time(document.querySelector('#time-limit').value);
 const teamAttack=()=>MatchRules.teamAttack(document.querySelector('#team-attack').value);
 function config(){return{timeLimit:timeLimit(),teamAttack:teamAttack(),stocks:stockCount(),playerCount:SquadBattle.size()>1?2:count(),format:document.querySelector('#battle-format').value,players:seats.slice(0,SquadBattle.size()>1?2:count()).map((s,n)=>({...s,character:Roster.resolve(n===0?Roster.selected:n===1?document.querySelector('#cpu-character').value:s.character),color:n===0?selected:n===1?+document.querySelector('#color2').value:s.color}))};}
 function start(config){
  teams=config.format==='teams'&&config.players.length>2;friendlyFire=MatchRules.teamAttack(config.teamAttack);initialStocks=clamp(config.stocks||3,1,10);
  if(teams&&new Set(config.players.map(s=>s.battleTeam??s.team)).size<2)return false;
  const main=platforms.find(p=>p.main),n=config.players.length;
  fighters=config.players.map((s,id)=>Object.assign(makeFighter(id,s.color,s.character),{stocks:initialStocks,team:teams?(s.battleTeam??s.team):id,control:Net.active?'online':s.control,x:n===2?(id?940:500):main.x+main.w*(id+1)/(n+1),y:main.y,face:id<n/2?1:-1}));
  return true;
 }
 function spawnX(f){const main=platforms.find(p=>p.main);return fighters.length===2?(f.id?850:590):main.x+main.w*(f.id+1)/(fighters.length+1);}
 function localInput(f){
  if(f.control==='cpu'||f.control===undefined&&f.id>0){if(out(f))return{...emptyInput(),shareStock:canShare(f)};return training?emptyInput():cpu(f,target(f));}
  const device=f.control||'primary',claimed=fighters.some(o=>o!==f&&o.control==='pad1');return Controls.read(device==='primary'&&claimed?'keyboard':device);
 }
 function donor(f){return teams&&out(f)&&!f.squad?fighters.filter(o=>o!==f&&sameTeam(f,o)&&o.stocks>=2&&!o.squad).sort((a,b)=>b.stocks-a.stocks||a.id-b.id)[0]:null;}
 const canShare=f=>!!donor(f);
 function share(f){const from=donor(f);if(!from)return false;from.stocks--;f.stocks=1;f.respawn=1;f.attack=null;f.lastHit=undefined;label(spawnX(f),220,`${f.id+1}P ストック復帰`,color(f));return true;}
 function eliminatedInput(f,i){if(!out(f))return false;if(i.shareStock||i.special&&(i.attackHeld||i.jab||i.heavy)||i.specialHeld&&(i.jab||i.heavy))share(f);return true;}
 function winner(){
  const groups=new Map();for(const f of fighters){const id=teams?f.team:f.id;let group=groups.get(id);if(!group)groups.set(id,group={id,stocks:0,damage:0});group.stocks+=f.stocks;if(f.stocks>0)group.damage+=f.damage;}
  const ranked=[...groups.values()].sort((a,b)=>b.stocks-a.stocks||a.damage-b.damage||a.id-b.id);return ranked.length<2||ranked[0].stocks===ranked[1].stocks&&ranked[0].damage===ranked[1].damage?-1:ranked[0].id;
 }
 function ended(){return !training&&new Set(fighters.filter(f=>f.stocks>0).map(f=>teams?f.team:f.id)).size<=1;}
 function winnerLabel(id){return teams?(id===0?'RED TEAM':'BLUE TEAM'):playerLabel(id);}
 function init(){
  initialized=true;try{const saved=+localStorage.getItem('tofu-stock-count');if(saved>=1&&saved<=10)document.querySelector('#stock-count').value=String(saved);}catch{}
  document.querySelector('#stock-count').onchange=()=>{try{localStorage.setItem('tofu-stock-count',String(stockCount()));}catch{}Roster.summary();};
  try{document.querySelector('#time-limit').value=String(MatchRules.time(localStorage.getItem('tofu-time-limit')??0));}catch{}
  document.querySelector('#time-limit').onchange=()=>{try{localStorage.setItem('tofu-time-limit',String(timeLimit()));}catch{}Roster.summary();};
  try{document.querySelector('#team-attack').value=localStorage.getItem('tofu-team-attack')==='off'?'off':'on';}catch{}
  document.querySelector('#team-attack').onchange=()=>{try{localStorage.setItem('tofu-team-attack',teamAttack()?'on':'off');}catch{}Roster.summary();};
  const targets=document.querySelector('.roster-targets'),swatches=targets.querySelector('.costume-row');
  for(let slot=2;slot<4;slot++){const b=document.createElement('button');b.id='select-seat-'+slot;b.className='roster-target hidden';b.innerHTML=`<span>${slot+1}P</span><img alt=""><b>おまかせ</b>`;b.onclick=()=>setSelection(slot);targets.insertBefore(b,swatches);}
  const container=document.querySelector('#local-seat-settings');
  for(let slot=0;slot<4;slot++){const row=document.createElement('div');row.id='seat-settings-'+slot;row.className='seat-settings';row.innerHTML=`<b>${slot+1}P</b><label>操作<select id="seat-control-${slot}"><option value="primary">キーボード1 / パッド1</option><option value="keyboard">キーボード1</option><option value="keyboard2">キーボード2</option>${[1,2,3,4].map(n=>`<option value="pad${n}">パッド${n}</option>`).join('')}<option value="cpu">CPU</option></select></label><label>チーム<select id="seat-team-${slot}"><option value="0">赤</option><option value="1">青</option></select></label>`;container.append(row);const control=row.querySelector('#seat-control-'+slot),team=row.querySelector('#seat-team-'+slot);control.value=seats[slot].control;team.value=String(seats[slot].team);control.onchange=()=>{seats[slot].control=control.value;refresh();};team.onchange=()=>{seats[slot].team=+team.value;refresh();};}
  document.querySelector('#player-count').onchange=()=>{refresh();Roster.refreshSelection();Roster.fit();};
  document.querySelector('#battle-format').onchange=()=>{if(document.querySelector('#battle-format').value==='teams')document.querySelector('#player-count').value='4';refresh();Roster.refreshSelection();Roster.fit();};
  refresh();
 }
 return{seats,count,stockCount,timeLimit,teamAttack,refresh,init,start,config,target,targets,projectileTarget,sameTeam,canHit,out,color,spawnX,localInput,eliminatedInput,canShare,share,ended,winner,winnerLabel,setSelection,setCharacter,setColor,get initialStocks(){return initialStocks},get selection(){return selection},get teamBattle(){return teams},get teamAttackEnabled(){return friendlyFire}};
})();
