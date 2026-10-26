'use strict';
// Observational feedback only. No fighter/input/attack state is written here.
const BattleReadability=(()=>{
 let observations=new WeakMap(),lastFrame=-1;
 const freeAir=new Set(['Tumble','LedgeJump','LedgeDrop']);
 function reset(){observations=new WeakMap();lastFrame=-1;}
 function snapshot(f){
  const live=!!f&&!f.respawn&&!BattlePlayers.out(f),pending=!!f?.pendingLaunch;
  const hurt=pending||(f?.hitstun||0)>0,stopped=(f?.hitlag||0)>0||hitstop>0;
  const actionable=live&&!hurt&&!stopped&&!f.attack&&!f.ledge&&!f.grabOwner&&!f.grabbed&&!f.helpless&&!f.laytonThink&&!f.shadowTimeSlowed&&!!(PlayerStates.defs[f.mode]?.attack||freeAir.has(f.mode));
  const speed=Math.hypot(f?.vx||0,f?.vy||0),launch=live&&!pending&&!stopped&&hurt&&f.lastKnockback>=50&&speed>=1?{angle:Math.atan2(f.vy,f.vx),speed}:null;
  const recovering=f?.attack?.type==='rise',configured=f?.character?.airMobility,profile=f?AirMobility.profile(f):null,hoverTotal=Math.max(0,configured?.frames||0);
  return{live,pending,hurt,stopped,actionable,launch,airborne:live&&!f.grounded,jumps:Math.max(0,Math.floor(f?.airJumps||0)),maxJumps:Math.max(0,Math.floor(f?.character?.airJumpCount||0)),dodge:!f?.airDodged,recovery:!f?.recovered&&!f?.helpless&&f?.mode!=='Helpless'&&!recovering,recovering,hover: hoverTotal?{active:!!profile,remaining:profile?AirMobility.remaining(f):0,total:hoverTotal}:null,ledgeGrabs:f?.ledgeGrabs||0,ledgeLimit:f?.character?.ledgeRegrabLimit||6};
 }
 function update(){
  if(frame===lastFrame)return;lastFrame=frame;
  if(!['battle','pause'].includes(state)||countdown>0)return;
  for(const f of fighters){const s=snapshot(f),o=observations.get(f)||{hurt:false,readyUntil:0};
   if(!s.live||f.attack||f.ledge||f.grabOwner||f.grabbed||f.helpless){o.hurt=false;o.readyUntil=0;}
   else if(s.hurt){o.hurt=true;o.readyUntil=0;}
   else if(s.actionable&&o.hurt){o.hurt=false;o.readyUntil=frame+18;}
   if(!s.actionable)o.readyUntil=0;
   observations.set(f,o);
  }
 }
 function phase(f){const s=snapshot(f);return !s.live?'復活待ち':s.pending||s.stopped?'HIT STOP':f.hitstun>0?'被弾硬直：残り '+f.hitstun+'F':f.landingLag>0?'着地隙：残り '+f.landingLag+'F':f.helpless||f.mode==='Helpless'?'復帰後の落下':f.mode==='Knockdown'?'ダウン中':f.ledge?'崖つかまり中':s.actionable?'行動可能':'動作中';}
 function recoveryText(f){const s=snapshot(f),parts=['空中ジャンプ '+s.jumps+'/'+s.maxJumps,'回避'+(s.dodge?'○':'×'),'上B'+(s.recovering?'中':s.recovery?'○':'×')];if(s.hover)parts.push('浮遊'+(s.hover.active?(s.hover.remaining/60).toFixed(1)+'s':'条件外'));return parts.join('  ');}
 function trainingLaunch(f){
  if(!f)return '敵の吹っ飛び：—';
  if(f.pendingLaunch)return '敵の吹っ飛び：HIT STOP / DI受付中';
  if(!Number.isFinite(f.lastLaunchAngle)||!f.lastKnockback)return '敵の吹っ飛び：—（右0°・上90°）';
  const angle=Math.atan2(-Math.sin(f.lastLaunchAngle),Math.cos(f.lastLaunchAngle))*180/Math.PI;
  return '敵の発射角 '+angle.toFixed(1)+'° / 現在速度 '+Math.hypot(f.vx,f.vy).toFixed(1)+' / 硬直 '+f.hitstun+'F';
 }
 function trainingRecovery(f){const s=snapshot(f);return '自分：'+recoveryText(f)+' / 崖 '+s.ledgeGrabs+'/'+s.ledgeLimit;}
 function drawFighter(f,headY){
  const s=snapshot(f),ready=s.actionable&&(observations.get(f)?.readyUntil||0)>frame;if(!s.live||(!s.launch&&!ready))return;
  const z=Math.max(.1,camera.z);ctx.save();ctx.translate(f.x,headY-29/z);ctx.scale(1/z,1/z);
  ctx.fillStyle='#08121eea';ctx.strokeStyle=ready?'#8cf1c7':'#ffd38c';ctx.lineWidth=1;
  ctx.beginPath();ctx.roundRect(ready?-28:-18,-10,ready?56:36,20,4);ctx.fill();ctx.stroke();
  if(ready){ctx.globalAlpha*=Math.min(1,((observations.get(f)?.readyUntil||0)-frame)/6);text('操作可',0,4,11,'#adffda');}
  else{ctx.rotate(s.launch.angle);ctx.strokeStyle='#ffe2a4';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.moveTo(3,-5);ctx.lineTo(9,0);ctx.lineTo(3,5);ctx.stroke();}
  ctx.restore();
 }
 function drawHud(f,x,y){
  const s=snapshot(f);if(!s.airborne)return;
  ctx.save();ctx.fillStyle='#0a1525ed';ctx.fillRect(x-45,y+96,293,17);ctx.fillStyle=s.hurt||s.stopped||f.helpless?'#bdc7d6':'#b9e5ff';ctx.font="700 12px 'Noto Sans JP'";ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(recoveryText(f),x-39,y+108,281);ctx.restore();
 }
 return{reset,update,snapshot,phase,recoveryText,trainingLaunch,trainingRecovery,drawFighter,drawHud,get diagnostics(){return fighters.map(f=>({id:f.id,...snapshot(f),readyUntil:observations.get(f)?.readyUntil||0}));}};
})();
