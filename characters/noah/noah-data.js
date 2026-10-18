'use strict';
// Inclusive, one-based 60 Hz attack windows also drive animation and VFX.
const NoahMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'sword',noahBlade:true,...extra});
 const moves={
  jab:cut('素早い横斬り',5,6,3,145,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('逆袈裟の連続斬り',4,5,4,153,7,'front',{cancel:{start:6,end:14,input:'jab',next:'jab3'}}),
  jab3:cut('ソードストライク',7,9,7,180,9),
  heavy:cut('エッジスラスト',8,11,10,192,9),
  up:cut('下からの切り上げ',6,12,8,190,8,'up',{angle:-1.4}),
  low:cut('低い薙ぎ払い',7,8,7,170,15,'low',{angle:-.2}),
  dashAttack:cut('低い滑り込み',12,15,11,184,15,'low',{impulse:4,recoveryFrames:13,totalFrames:28,FAF:29}),
  smash:cut('オーバークロックバスター',12,15,21,238,9,'front',{chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.1,recoveryFrames:25,totalFrames:40,FAF:41}),
  upsmash:cut('ライジングブレイク',13,17,19,228,8,'up',{chargeFrame:4,chargeMaxFrames:60,angle:-1.5,recoveryFrames:26,totalFrames:43,FAF:44}),
  downsmash:m('グラウンドビート',11,[w(11,14,'shockwave')],25,0,{damage:18,reach:215,pose:17,beat:true,chargeFrame:4,chargeMaxFrames:60,soundFamily:'earth'}),
  air:m('周囲を薙ぐ二回転',6,[w(6,7,'spin',{damage:3,baseKnockback:1.4,knockbackGrowth:.02}),w(15,21,'spin',{damage:7})],12,7,{damage:7,reach:165,pose:10,aerial:true,noahBlade:true,soundFamily:'sword'}),
  fair:cut('エアスラッシュ',6,8,10,184,9,'front',{aerial:true,landingLagFrames:10,recoveryFrames:12,totalFrames:20,FAF:21}),
  bair:cut('背後への薙ぎ',7,11,11,178,7,'back',{aerial:true,landingLagFrames:10,recoveryFrames:12,totalFrames:23,FAF:24}),
  uair:cut('頭上の二段斬り',5,9,9,195,8,'up',{aerial:true,landingLagFrames:8,recoveryFrames:13,totalFrames:22,FAF:23,angle:-1.5}),
  dair:cut('斜め下への斬撃',9,13,12,180,11,'down',{aerial:true,landingLagFrames:14,recoveryFrames:15,totalFrames:28,FAF:29,angle:1.35,meteorFrame:11,meteorAngle:1.48,meteorMultiplier:1.1,noahBounce:true,bounceSpeed:5}),
  dragon:cut('オーバークロックバスター・溜め',14,17,12,213,9,'front',{overclock:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,recoveryFrames:22,totalFrames:39,FAF:40,landingLagFrames:16}),
  dash:m('エッジスラスト・フランクシフト',22,[w(22,24)],19,16,{damage:13,reach:186,pose:9,noahBlade:true,flank:true,lockRange:300,lockHeight:100,travelStart:7,travelEnd:18,flankOffset:64,emptyDistance:240,arcHeight:28,feintEnd:6,jumpCancelFrame:25,intangibleFrames:[[9,14]],airControlMultiplier:0,animationWindows:[{start:7,end:18,pose:15}],animation:{anticipationEnd:2,anticipationPose:14,accelerationPose:15,followThroughFrames:5,recoveryPose:0,lean:0,lunge:0,impactScale:1},soundFamily:'sword'}),
  flankCancel:m('回り込み・中止',1,[],8,8,{pose:18,special:true,soundFamily:'sword'}),
  rise:cut('エアスラッシュ・リバウンド',5,11,8,185,16,'up',{reboundSlash:true,launchFrame:5,reboundEnd:16,launchX:7,launchY:10,airControlMultiplier:.35,gravityMultiplier:.7,recoveryFrames:25,totalFrames:36,FAF:37,landingLagFrames:24,helpless:true,ledgeGrabStart:5,animationWindows:[{start:12,end:24,pose:16}],angle:-1.2}),
  rebound:cut('接触・跳ね上げ斬り',1,4,7,197,8,'up',{special:true,verticalImpulse:-17,impulse:3,gravityMultiplier:.8,airControlMultiplier:.8,helpless:true,ledgeGrabStart:5,landingLagFrames:24,recoveryFrames:14,totalFrames:18,FAF:19,angle:-1.45}),
  gale:m('グラウンドビート・地上',12,[w(12,14,'shockwave')],21,0,{damage:15,reach:210,pose:17,beat:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:50,soundFamily:'earth'}),
  airBeat:m('グラウンドビート・落下',12,[w(12,72,'down')],12,24,{damage:11,reach:145,pose:17,noahBlade:true,beatDive:true,special:true,diveSpeed:16,velocityYOverride:0,landingMove:'beatLanding',airControlMultiplier:.25,autoCancelWindow:[],landingFlag:[1,Infinity],soundFamily:'sword'}),
  beatLanding:m('グラウンドビート・着地衝撃',1,[w(1,5,'shockwave')],24,0,{damage:14,reach:225,pose:17,beat:true,special:true,preserveVelocity:false,soundFamily:'earth'}),
  airRebound:m('空下・ヒット反動',1,[],7,14,{pose:4,aerial:true,verticalImpulse:-5,special:true,soundFamily:'wind'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'sword'};}
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;if(!a.flank)a.animation={...a.animation,anticipationPose:14,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless&&!a.beatDive){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}}
 return moves;
})();
const NoahRules=(()=>{
 function reset(){for(const f of fighters)if(f.characterId==='noah'){f.noahSideUsed=false;f.noahBeatUsed=false;f.noahRebounds=0;}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;
  if(a.flank){const o=BattlePlayers.target(f);a.origin={x:f.x,y:f.y};a.locked=Math.abs(o.x-f.x)<=a.lockRange&&Math.abs(o.y-f.y)<=a.lockHeight&&!o.respawn;a.lock={x:o.x,y:o.y};a.side=Math.sign(f.input?.x)||f.face;a.target={x:a.locked?o.x+a.side*a.flankOffset:f.x+f.face*a.emptyDistance,y:a.locked?Math.min(f.y,o.y):f.y};f.vx=f.vy=0;if(!f.grounded)f.noahSideUsed=true;a.gravityMultiplier=0;}
  if(a.reboundSlash){f.vx=f.vy=0;a.gravityMultiplier=0;}
  if(a.beatDive)f.noahBeatUsed=true;
 }
 function launchRebound(f){if(!f.attack?.reboundSlash||f.attack.bounced)return false;f.noahRebounds=(f.noahRebounds||0)+1;attack(f,'rebound');f.grounded=false;f.recovered=true;f.specialLandingLag=24;f.vy=-17;f.vx=f.face*3;GameAudio.cue('double-jump',.8,f);return true;}
 function terrainContact(f,a){const c=f.character.ecb,p=platforms.find(p=>p.main),q=NaegiRules.safeStep(f,{x:f.x+f.vx,y:f.y+f.vy});if(q.blocked)return true;return f.y>p.y&&f.y-c.height<p.y+90&&Math.min(Math.abs(f.x-(p.x-c.radius)),Math.abs(f.x-(p.x+p.w+c.radius)))<7;}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.flank&&!a.originGrounded&&t>=a.jumpCancelFrame&&i.jump&&f.airJumps>0){f.buffer=null;PlayerController.launchJump(f,false);return;}
  if(a.overclock&&t===a.startupFrames&&!a.eventsDone.has('overclock')){a.eventsDone.add('overclock');a.tier=a.charge>=.75?2:a.charge>=.25?1:0;a.damage=[12,18,25][a.tier];a.reach=[213,250,290][a.tier];a.baseKnockback=[4.2,5.5,6.8][a.tier];}
  if(a.flank){if(t<=a.feintEnd&&i.guardPressed){f.buffer=null;attack(f,'flankCancel');return;}if(t>=a.travelStart&&t<=a.travelEnd){const u=(t-a.travelStart+1)/(a.travelEnd-a.travelStart+1),target={x:lerp(a.origin.x,a.target.x,u),y:lerp(a.origin.y,a.target.y,u)-Math.sin(u*Math.PI)*a.arcHeight},q=NaegiRules.safeStep(f,target);a.blocked||=q.blocked;f.vx=q.x-f.x;f.vy=q.y-f.y;f.grounded=a.originGrounded&&t===a.travelEnd&&platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&Math.abs(q.y-p.y)<3);f.fastFall=false;}if(t===a.travelEnd+1){f.vx=f.vy=0;a.gravityMultiplier=1;f.face=a.locked?(Math.sign(a.lock.x-f.x)||-a.side):f.face;}if(t>a.travelEnd&&a.originGrounded){const floor=platforms.find(p=>f.x>=p.x&&f.x<=p.x+p.w&&Math.abs(f.y-p.y)<3);if(floor){f.y=floor.y;f.grounded=true;f.vy=0;}}}
  if(a.reboundSlash){f.fastFall=false;if(t===a.launchFrame){if(Math.abs(i.x)>.2)f.face=Math.sign(i.x);f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.vx=f.face*a.launchX;f.vy=-a.launchY;a.gravityMultiplier=.7;GameAudio.cue('double-jump',.65,f);}if(t>=a.launchFrame&&t<=a.reboundEnd&&terrainContact(f,a)){launchRebound(f);return;}if(t>a.reboundEnd)a.gravityMultiplier=1;}
  if(a.beat&&t===a.startupFrames&&!a.eventsDone.has('beat')){a.eventsDone.add('beat');a.reach*=1+a.charge*.55;a.damage*=1+a.charge*.3;}
 }
 function onHit(f,o,a){if(a.reboundSlash)launchRebound(f);else if(a.noahBounce&&f.attack?.noahBounce){const recovered=f.recovered;attack(f,'airRebound');f.grounded=false;f.vy=-a.bounceSpeed;f.recovered=recovered;}}
 const geometry={front:{origin:[0,-62],angles:[-.05,.03],radius:11},up:{origin:[0,-48],angles:[-1.1,-1.5],radius:12},back:{origin:[-8,-65],angles:[-3,-3.3],radius:12},low:{origin:[0,-32],angles:[.05,.18],radius:10},down:{origin:[0,-46],angles:[.5,.8],radius:12},spin:{origin:[0,-57],angles:[-1.1,-.55],radius:12}};
 function bladeBoxes(f,a,w,t){const g=geometry[w.shape],u=(t-w.start)/Math.max(1,w.end-w.start),angle=lerp(...g.angles,u),reach=(w.reach??a.reach)*FIGHTER_SCALE*.72,x=f.x+g.origin[0]*f.face,y=f.y+g.origin[1];return[{x1:x,y1:y,x2:x+Math.cos(angle)*reach*f.face,y2:y+Math.sin(angle)*reach,radius:g.radius,window:w}];}
 function tick(){for(const f of fighters)if(f.characterId==='noah'&&(f.grounded||f.ledge||f.respawn)){f.noahSideUsed=false;f.noahBeatUsed=false;if(f.respawn)f.noahRebounds=0;}}
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=!f.noahSideUsed;i.jump=false;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-100&&(f.x<p.x||f.x>p.x+p.w)){i.x=Math.sign(720-f.x);i.jab=i.heavy=i.smash=i.guard=false;if(f.airJumps>0&&f.vy>=0){i.y=0;i.jump=true;i.special=false;}else{i.jump=false;i.special=f.vy>=-1;i.y=i.special?-1:0;}}
  if(f.attack?.flank){i.x=f.attack.side;i.y=0;i.special=i.jab=i.heavy=i.smash=i.guard=false;i.jump=!f.attack.originGrounded&&f.timer>=f.attack.jumpCancelFrame-1&&f.airJumps>0;}if(f.attack?.overclock)i.specialHeld=Math.abs(o.x-f.x)>160&&f.attack.chargeFrames<45;return i;
 }
 return{reset,prepare,action,onHit,launchRebound,terrainContact,geometry,bladeBoxes,tick,cpu};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('noah',{"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[7,9],"windup":14},"dashAttack":{"strike":[2,9],"windup":14}});
