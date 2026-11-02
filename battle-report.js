'use strict';
// Match analysis observes confirmed contacts and simulation frames; it cannot affect combat.
const BattleReport=(()=>{
 let records=new Map();
 const row=id=>{if(!records.has(id))records.set(id,{moves:new Map(),kos:[],falls:0,episode:false,last:null,lastLaunch:null});return records.get(id);};
 function begin(){records=new Map();for(const f of fighters)row(f.id);}
 function move(f,a){const type=a.sourceType||a.type||f.attack?.type||'other',data=movesFor(f);return{key:f.characterId+':'+type,name:(a.sourceType?data[type]?.name:null)||a.name||data[type]?.name||({jab:'弱攻撃',heavy:'横強攻撃',up:'上強攻撃',low:'下強攻撃',air:'通常空中攻撃',fair:'前空中攻撃',bair:'後空中攻撃',uair:'上空中攻撃',dair:'下空中攻撃',smash:'横スマッシュ',upsmash:'上スマッシュ',downsmash:'下スマッシュ',pummel:'つかみ攻撃'}[type]||'攻撃'),character:f.characterId,type};}
 function hit(f,o,a,damage,launch=true){
  const r=row(f.id),m=move(f,a),entry=r.moves.get(m.key)||{...m,hits:0,damage:0};entry.hits++;entry.damage+=damage;r.moves.set(m.key,entry);
  const contact={...m,attacker:f.id,frame};row(o.id).last=contact;if(launch)row(o.id).lastLaunch=contact;
 }
 function observeFighter(f){const r=row(f.id),main=platforms.find(p=>p.main);if(!main)return;
  if(f.respawn){r.episode=false;r.last=r.lastLaunch=null;return;}
  if(f.grounded||f.ledge){r.episode=false;if(!f.pendingLaunch&&!f.hitstun&&(frame-(r.lastLaunch?.frame??-999)>60))r.lastLaunch=null;}
  else if(f.x<main.x||f.x>main.x+main.w||f.y>main.y+40)r.episode=true;
 }
 function ko(f){
  observeFighter(f);const r=row(f.id),main=platforms.find(p=>p.main),last=r.lastLaunch||r.last;
  const falling=!!main&&r.episode&&f.y>main.y+120&&!f.pendingLaunch&&!f.hitstun&&(!r.lastLaunch||frame-r.lastLaunch.frame>45);
  if(falling)r.falls++;
  if(f.lastHit!==undefined){const source=last?.attacker===f.lastHit?last:r.last?.attacker===f.lastHit?r.last:null;row(f.lastHit).kos.push(source?{...source,victim:f.id,recoveryFall:falling}:{name:'技を特定できません',victim:f.id,recoveryFall:falling});}
  r.episode=false;r.last=r.lastLaunch=null;
 }
 function summary(id){const r=row(id);return{kos:r.kos.map(k=>({...k})),falls:r.falls,frequent:[...r.moves.values()].sort((a,b)=>b.hits-a.hits||b.damage-a.damage||a.key.localeCompare(b.key)).slice(0,3).map(m=>({...m}))};}
 function render(){
  const target=document.getElementById('stats');target.replaceChildren();
  for(const f of fighters){const r=summary(f.id),section=document.createElement('section');section.className='result-player-stat';const heading=document.createElement('h3');heading.textContent=playerLabel(f.id);section.append(heading);
   const basic=document.createElement('p');basic.textContent='撃墜 '+f.stats.kos+' ／ 与ダメージ '+Math.round(f.stats.damage)+'% ／ 命中 '+f.stats.hits;section.append(basic);
   const list=document.createElement('dl');for(const[label,value]of[['撃墜につながった技',r.kos.length?r.kos.map(k=>k.name+(k.recoveryFall?'（復帰中の落下）':'')).join('、'):'なし'],['復帰失敗',r.falls+'回'],['よく当たった技',r.frequent.length?r.frequent.map(m=>m.name+' '+m.hits+'回').join(' ／ '):'命中なし']]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;list.append(dt,dd);}section.append(list);target.append(section);
  }
  const note=document.createElement('p');note.className='result-stat-note';note.textContent='命中は多段技の各ヒットを含みます。復帰失敗は場外で操作可能になった後、着地・崖つかまりできず落下した回数（直近45Fの吹っ飛び・被弾硬直中を除く）。撃墜技は最後に記録した攻撃による集計です。';target.append(note);
 }
 return{begin,hit,ko,observe:()=>fighters.forEach(observeFighter),summary,render};
})();
