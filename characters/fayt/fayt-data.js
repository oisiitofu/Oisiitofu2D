'use strict';
// One-based inclusive attack windows at 60 Hz. Gameplay and animation use these data.
const FaytMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=6,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'sword',...opts});
 const moves={
  jab:cut('クイックスラッシュ',5,6,3,126,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('リバーススラッシュ',4,5,4,134,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('ブレイズ・フィニッシュ',7,9,7,151,9,'front',{soundFamily:'fire',blazing:true}),
  heavy:cut('ソード・スイープ',8,11,10,176),up:cut('ライジングブレード',6,12,8,151,8,'up',{angle:-1.4}),low:cut('ロー・スラッシュ',7,8,7,146,15,'low',{angle:-.2}),
  dashAttack:m('ステップ・ストライク',12,[w(12,15)],13,0,{damage:11,reach:158,pose:15,impulse:4,soundFamily:'sword'}),
  smash:m('ディヴァイン・ブレード',12,[w(12,15)],25,0,{damage:21,reach:221,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.102,divine:true,soundFamily:'light'}),
  upsmash:m('ライトニング・ブレード',13,[w(13,17,'up')],24,0,{damage:19,reach:196,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,lightning:true,soundFamily:'thunder'}),
  downsmash:m('ストーン・レイン',12,[w(12,16,'shockwave')],25,0,{damage:17,reach:184,pose:17,chargeFrame:4,chargeMaxFrames:60,stoneRain:true,stoneOffsets:[-68,0,68],stoneHeight:95,stoneRadius:19,soundFamily:'earth'}),
  air:m('エア・スピン',6,[w(6,7,'spin',{damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(15,20,'spin',{damage:7})],12,7,{damage:7,reach:155,pose:10,aerial:true,soundFamily:'sword'}),
  fair:m('ブレイジングソード',6,[w(6,8)],12,10,{damage:10,reach:178,pose:6,aerial:true,blazing:true,soundFamily:'fire'}),
  bair:m('リバース・エッジ',7,[w(7,11,'back')],12,10,{damage:11,reach:171,pose:7,aerial:true,soundFamily:'sword'}),
  uair:m('エリアル・アッパー',5,[w(5,9,'up')],13,8,{damage:9,reach:155,pose:8,aerial:true,angle:-1.5,soundFamily:'sword'}),
  dair:m('ブルー・フォール',9,[w(9,13,'down')],16,14,{damage:13,reach:148,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.15,soundFamily:'sword'}),
  dragon:m('ショットガン・ブラスト',10,[],18,14,{pose:13,shotgun:true,spellShots:[10],chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,shotTiers:[{threshold:0,shots:[10],damage:5,radius:8,speed:12},{threshold:.33,shots:[10,18],damage:5.5,radius:9,speed:13},{threshold:.75,shots:[10,18,26],damage:6,radius:10,speed:14}],shotAngles:[-.17,0,.17],shotLife:29,finisherStart:34,finisherEnd:36,finisherDamage:15,finisherReach:177,soundFamily:'fire'}),
  dash:m('ディメンション・ドア',17,[w(17,20)],18,16,{damage:14,reach:181,pose:7,dimensionDoor:true,aimFrames:[5,8],vanishFrames:[9,13],warpFrame:14,rangeX:260,rangeY:145,feintEnd:12,feintRecovery:10,intangibleFrames:[[9,13]],gravityMultiplier:0,airControlMultiplier:0,soundFamily:'sword',animationWindows:[{start:5,end:16,pose:13}],animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:13,followThroughFrames:5,recoveryPose:0,lean:0,lunge:0,impactScale:1.12}}),
  rise:m('エア・レイド',6,[w(6,9,'up',{damage:4,baseKnockback:1.8,knockbackGrowth:.02}),w(37,40,'up',{damage:11})],15,24,{damage:11,reach:163,pose:16,airRaid:true,flightFrames:[6,36],flightPhases:[{start:6,end:20,vy:-12},{start:21,end:30,vy:-6},{start:31,end:36,vy:-2}],finishFrame:37,finishImpulse:-7,steerSpeed:9,steerAcceleration:.85,neutralDrift:.28,raidShots:[9,17,25,33],rainDamage:4,rainSpeed:7.5,rainGravity:.18,rainRadius:10,rainLife:42,gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:6,soundFamily:'wind',animationWindows:[{start:10,end:36,pose:16}],animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:4,followThroughFrames:5,recoveryPose:5,lean:0,lunge:0,impactScale:1.1}}),
  gale:m('サイドキック',10,[w(10,13,'low')],16,12,{damage:10,reach:170,pose:17,sideKick:true,kickHeight:70,kickRadius:10,kickSpeed:5.8,driveFrames:[5,10],recoilSpeed:4.8,recoilFrames:7,angle:-.25,fixedKnockback:31,airControlMultiplier:.2,soundFamily:'punch'}),
  airKick:m('サイドキック・空中',10,[w(10,13,'front')],16,14,{damage:10,reach:156,pose:17,special:true,sideKick:true,kickHeight:70,kickRadius:10,airKick:true,kickSpeed:7.2,kickFallSpeed:2.8,driveFrames:[5,10],recoilSpeed:4.8,recoilFrames:7,recoilBounce:-5,angle:-.35,airControlMultiplier:.2,gravityMultiplier:0,soundFamily:'punch'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:id==='pummel'?'punch':'sword'};}
 moves.grab.name='アーム・キャッチ';moves.pummel.name='柄の打撃';moves.forwardThrow.name='ソード・プッシュ';moves.backThrow.name='リバース・スロー';moves.upThrow.name='打ち上げ斬り';moves.downThrow.name='ダウン・スマッシュ';
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(!a.airRaid&&!a.dimensionDoor)a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const FaytRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='fayt')f.faytSideUsed=f.faytKickUsed=false;}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y+1&&y<p.y+90+r;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.dimensionDoor){if(!f.grounded)f.faytSideUsed=true;a.portalOrigin={x:f.x,y:f.y};a.portalDirection={x:f.face,y:0};a.portalFace=f.face;a.portalTarget={x:f.x+f.face*a.rangeX,y:f.y};f.vx=f.vy=0;}
  if(a.airRaid){a.raidFace=f.face;a.raidVelocity=f.face*a.neutralDrift*a.steerSpeed;f.vx=f.vy=0;}
  if(a.airKick)f.faytKickUsed=true;
  if(a.shotgun)a.animation={...a.animation,anticipationPose:13,accelerationPose:13};
 }
 function portal(f){const a=f.attack,d=a.portalDirection,len=Math.hypot(d.x,d.y)||1,to=a.portalFeint?a.portalOrigin:{x:a.portalOrigin.x+d.x/len*a.rangeX,y:a.portalOrigin.y+d.y/len*a.rangeY};return NaegiRules.safeStep(f,to);}
 function configureShot(f,a){const tier=a.shotTiers.filter(q=>a.charge>=q.threshold).at(-1);a.shotTier=tier;a.spellShots=tier.shots;a.activeFrames=a.charge>=.75?[CombatData.window(a.finisherStart,a.finisherEnd,'front',{damage:a.finisherDamage,reach:a.finisherReach,pose:9})]:[];a.activeStart=a.activeFrames[0]?.start??null;a.activeEnd=a.activeFrames.at(-1)?.end??null;a.totalFrames=(a.activeEnd??a.spellShots.at(-1))+a.recoveryFrames;a.FAF=a.totalFrames+1;a.motionEndFrames=a.totalFrames;a.autoCancelWindow=[[1,a.autoCancelEnd],[(a.activeEnd??a.spellShots.at(-1))+Math.ceil(a.recoveryFrames*.7),Infinity]];a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.shotConfigured=true;f.stateDuration=a.totalFrames;f.stateEnd=frame+a.totalFrames-f.timer;f.faf=a.FAF;}
 function spawnShot(f,a,angle){const tier=a.shotTier;objects.push({kind:'pellet',owner:f.id,face:f.face,x:f.x+f.face*36,y:f.y-41,vx:Math.cos(angle)*tier.speed*f.face,vy:Math.sin(angle)*tier.speed,gravity:0,radius:tier.radius,damage:tier.damage,age:0,life:a.shotLife,stale:a.staleMultiplier,hits:new Set()});}
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;const t=f.timer;
  if(a.shotgun){if(t>=a.startupFrames&&!a.shotConfigured)configureShot(f,a);if(a.shotConfigured&&a.spellShots.includes(t)&&!a.eventsDone.has('shot:'+t)){a.eventsDone.add('shot:'+t);for(const angle of a.shotAngles)spawnShot(f,a,angle);f.vx-=f.face*(.7+a.charge);}if(a.charge>=.75&&t>=a.finisherStart)a.pose=9;}
  if(a.dimensionDoor){if(t>=a.aimFrames[0]&&t<=a.aimFrames[1]){if(Math.hypot(i.x,i.y)>.3)a.portalDirection={x:i.x,y:i.y};a.portalTarget=portal(f);}
   if(t<=a.feintEnd&&i.guardPressed){a.portalFeint=true;a.portalTarget={...a.portalOrigin};f.buffer=null;}
   if(t<=a.warpFrame){f.vx=0;f.vy=0;}
   if(t===a.vanishFrames[0]){objects.push({kind:'portal',owner:f.id,x:f.x,y:f.y-42,age:0,life:18});GameAudio.cue('dark-cast',.8,f);}
   if(t===a.warpFrame){const q=portal(f);f.x=q.x;f.y=q.y;a.portalTarget=q;a.portalBlocked=q.blocked;f.face=-(Math.sign(a.portalDirection.x)||a.portalFace);f.grounded=a.originGrounded&&Math.abs(q.y-a.portalOrigin.y)<1;objects.push({kind:'portal',owner:f.id,x:q.x,y:q.y-42,age:0,life:14});if(a.portalFeint){a.activeFrames=[];a.activeStart=a.activeEnd=null;a.totalFrames=a.warpFrame+a.feintRecovery;a.FAF=a.totalFrames+1;a.motionEndFrames=a.totalFrames;a.pose=0;a.animationWindows=[];a.animation={...a.animation,recoveryPose:0};}a.gravityMultiplier=1;}
  }
  if(a.airRaid){if(t===a.flightFrames[0]){f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.grounded=false;GameAudio.cue('double-jump',.65,f);}
   if(t>=a.flightFrames[0]&&t<=a.flightFrames[1]){const phase=a.flightPhases.find(p=>t>=p.start&&t<=p.end),target=(Math.abs(i.x)>.1?i.x:a.raidFace*a.neutralDrift)*a.steerSpeed;a.raidVelocity=moveToward(a.raidVelocity,target,a.steerAcceleration);const q=WillRules.slideStep(f,{x:f.x+a.raidVelocity,y:f.y+phase.vy});f.vx=q.x-f.x;f.vy=q.y-f.y;a.raidBlocked ||= q.blocked;f.grounded=false;f.fastFall=false;a.gravityMultiplier=0;if(Math.abs(f.vx)>.1)f.face=Math.sign(f.vx);}
   if(a.raidShots.includes(t)&&!a.eventsDone.has('rain:'+t)){a.eventsDone.add('rain:'+t);objects.push({kind:'rain',owner:f.id,face:f.face,x:f.x,y:f.y-12,vx:f.vx*.25,vy:a.rainSpeed,gravity:a.rainGravity,radius:a.rainRadius,damage:a.rainDamage,age:0,life:a.rainLife,stale:a.staleMultiplier,hits:new Set()});GameAudio.cue('light-cast',.5,f);}
   if(t===a.finishFrame){f.vy=a.finishImpulse;a.gravityMultiplier=1;a.soundFamily='sword';}if(t>a.flightFrames[1])a.gravityMultiplier=1;
  }
  if(a.sideKick){if(!a.kickRecoil&&t>=a.driveFrames[0]&&t<=a.driveFrames[1]){f.vx=f.face*a.kickSpeed;if(a.airKick)f.vy=a.kickFallSpeed;}if(a.kickRecoil){f.vx=t<=a.recoilEnd?-f.face*a.recoilSpeed:f.vx*.7;a.gravityMultiplier=1;}else if(t>a.activeEnd){f.vx*=.75;a.gravityMultiplier=1;}}
 }
 function onHit(f,o,a){if(a.sideKick&&f.attack?.sideKick&&!f.attack.kickRecoil){f.attack.kickRecoil=true;f.attack.recoilEnd=f.timer+a.recoilFrames;f.vx=-f.face*a.recoilSpeed;if(a.airKick){f.vy=a.recoilBounce;f.fastFall=false;}}}
 function stoneBoxes(f,a,w){return a.stoneOffsets.map(dx=>({x1:f.x+dx,y1:f.y-8,x2:f.x+dx,y2:f.y-a.stoneHeight,radius:a.stoneRadius,window:w}));}
 function kickBox(f,a,w){return[{x1:f.x+f.face*10,y1:f.y-a.kickHeight,x2:f.x+f.face*a.reach*FIGHTER_SCALE,y2:f.y-a.kickHeight,radius:a.kickRadius,window:w}];}
 function collide(q){for(const o of BattlePlayers.targets(fighters[q.owner])){if(q.dead)break;collideOne(q,o);}}
 function collideOne(q,o){const f=fighters[q.owner];if(o.respawn||o.hitlag||q.hits.has(o.id))return;const b={x1:q.previousX??q.x,y1:q.previousY??q.y,x2:q.x,y2:q.y,radius:q.radius},contact=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b),protect=CombatSystem.protection(o);if(!(contact||shield)||protect.intangible)return;q.hits.add(o.id);const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...FaytMoves.dragon,type:q.kind==='rain'?'rise':'dragon',damage:q.damage,charge:0,staleMultiplier:q.stale,projectile:true,soundFamily:q.kind==='rain'?'light':'fire',angle:q.kind==='rain'?-1.1:-.35,baseKnockback:2.4,knockbackGrowth:.032,launchDirection:q.face},b,contact);q.dead=true;objects.push({kind:'spark',owner:q.owner,x:q.x,y:q.y,age:0,life:10});}
 function tick(){for(const f of fighters)if(f.characterId==='fayt'&&(f.grounded||f.ledge||f.respawn))f.faytSideUsed=f.faytKickUsed=false;
  const born=[];for(const q of objects){const f=fighters[q.owner];if(!f||f.respawn){q.dead=true;continue;}q.age++;if(q.kind==='pellet'||q.kind==='rain'){q.previousX=q.x;q.previousY=q.y;q.vy+=q.gravity;const n=Math.max(1,Math.ceil(Math.hypot(q.vx,q.vy)/5));for(let j=0;j<n;j++){const oldY=q.y;q.x+=q.vx/n;q.y+=q.vy/n;const floor=q.kind==='rain'&&platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&oldY<=p.y&&q.y>=p.y);if(floor||terrain(q.x,q.y,q.radius)){q.dead=true;born.push({kind:'spark',owner:q.owner,x:q.x,y:q.y,age:0,life:10});break;}}if(!q.dead)collide(q);}if(q.age>=q.life)q.dead=true;}objects=objects.filter(q=>!q.dead).concat(born);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.airRaid){const inward=Math.sign(p.x+p.w/2-f.x);i.x=f.y>p.y+90+f.character.ecb.height+8?-inward*.3:f.x<p.x+15||f.x>p.x+p.w-15?inward:.1*inward;i.y=-1;i.jump=i.jab=i.heavy=i.smash=i.special=i.guard=false;}
  else if(f.attack?.dimensionDoor){i.x=Math.sign(o.x-f.x);i.y=o.y<f.y-80?-.5:0;i.guard=false;i.special=i.jump=i.jab=i.heavy=i.smash=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-100&&(f.x<p.x||f.x>p.x+p.w)){const inward=Math.sign(p.x+p.w/2-f.x);i.x=f.y>p.y+90+f.character.ecb.height+8?-inward*.2:inward;i.special=f.airJumps<=0&&f.vy>=-2;i.y=i.special?-1:0;i.jump=f.airJumps>0&&f.vy>=0;i.jab=i.heavy=i.smash=i.guard=false;}
  if(f.attack?.shotgun)i.specialHeld=Math.abs(o.x-f.x)>260&&f.attack.chargeFrames<48;return i;
 }
 return{reset,prepare,portal,configureShot,action,onHit,stoneBoxes,kickBox,terrain,collide,tick,cpu,get objects(){return objects;}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(FaytMoves.dragon,{rangedInterval:48,rangedRearm:24});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('fayt',{"heavy":{"strike":[7,9],"windup":14},"fair":{"strike":[13],"windup":14},"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"jab3":{"strike":[6,9],"windup":14},"dashAttack":{"strike":[2,9],"windup":14}});
