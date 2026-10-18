'use strict';
// Rean: inclusive one-based 60 Hz windows; movement phases share this data.
const ReanMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,start,end,damage,reach,pose=9,shape='front',opts={})=>m(name,start,[w(start,end,shape)],9,0,{damage,reach,pose,...opts});
 const weak={damage:3,baseKnockback:1.35,knockbackGrowth:.014};
 const moves={
  jab:cut('抜刀・横薙ぎ',5,6,3,132,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('逆袈裟の返し斬り',4,5,4,141,7,'front',{cancel:{start:6,end:14,input:'jab',next:'jab3'}}),
  jab3:cut('踏み込み居合',7,9,7,166,9,'front',{impulse:3,baseKnockback:4.2,knockbackGrowth:.067}),
  heavy:cut('一文字斬り',8,10,10,178,9),
  up:cut('斬り上げ',6,10,8,153,8,'up',{angle:-1.42}),
  low:cut('足払い追撃',7,8,7,163,17,'low',{angle:-.23}),
  dashAttack:cut('滑走抜刀',12,15,11,173,15,'front',{impulse:5.5,recoveryFrames:12,totalFrames:27,FAF:28}),
  smash:m('無月一刀',13,[w(13,16,'front')],19,0,{damage:20,reach:205,pose:9,baseKnockback:6.3,knockbackGrowth:.102,chargeFrame:4,chargeMaxFrames:60,impulse:2.5}),
  upsmash:m('螺旋撃',12,[w(12,14,'spin',{...weak,pose:10}),w(19,22,'up',{damage:15,pose:8})],19,0,{damage:15,reach:176,pose:8,angle:-1.48,baseKnockback:5.8,knockbackGrowth:.094,chargeFrame:4,chargeMaxFrames:60}),
  downsmash:m('弧月一閃',10,[w(10,12,'low'),w(19,21,'back',{pose:17})],18,0,{damage:16,reach:185,pose:17,angle:-.3,baseKnockback:5.5,knockbackGrowth:.09,chargeFrame:3,chargeMaxFrames:60}),
  air:m('回転斬り',6,[w(6,9,'spin')],10,7,{damage:8,reach:153,pose:10,aerial:true}),
  fair:m('二段斬り',6,[w(6,8,'front',{...weak,damage:4,pose:7}),w(15,17,'front',{damage:8,pose:9})],10,10,{damage:8,reach:177,pose:9,aerial:true}),
  bair:m('逆手の薙ぎ',7,[w(7,10,'back')],10,10,{damage:12,reach:174,pose:10,aerial:true}),
  uair:m('頭上の斬り上げ',5,[w(5,8,'up')],10,8,{damage:9,reach:157,pose:8,aerial:true,angle:-1.5}),
  dair:m('羯羅斬・斜め下',9,[w(9,13,'down')],12,14,{damage:13,reach:158,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.2}),
  dragon:m('緋空斬',14,[],18,12,{pose:13,spellShots:[14],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,crimson:{speed:10,life:72,damage:7,tierDamage:4,radius:15}}),
  dash:m('裏疾風',10,[w(10,12,'front',{...weak,damage:4,pose:15}),w(23,25,'front',{damage:11,pose:9})],17,14,{damage:11,reach:174,pose:15,baseKnockback:5.1,knockbackGrowth:.082,airControlMultiplier:0,phaseStart:9,phaseEnd:16,phaseSpeed:15,pivotFrame:17,returnStepFrames:[18,22],returnStepSpeed:4,bodyPassFrames:[[9,25]],intangibleFrames:[[9,11]],ledgeGrabStart:26,canClank:false}),
  rise:m('真・螺旋撃',6,[w(6,8,'spin',{...weak,damage:2,pose:16}),w(12,13,'front',{...weak,damage:2,pose:16}),w(18,19,'back',{...weak,damage:2,pose:16}),w(24,25,'front',{...weak,damage:2,pose:16}),w(33,36,'up',{damage:9,pose:8})],12,20,{damage:9,reach:154,pose:16,angle:-1.45,baseKnockback:4.9,knockbackGrowth:.077,aerial:true,airControlMultiplier:0,spiralStart:6,spiralEnd:32,spiralSpeed:6.4,spiralDrift:4,spiralRadius:7,spiralRate:.48,spiralExitFrame:33,exitVelocity:-3,actionCancelFrame:37,ledgeGrabStart:6,autoCancelWindow:[],landingFlag:[1,Infinity],canClank:false}),
  gale:m('鬼気解放',18,[],18,14,{pose:14,demonDuration:360,demonCooldown:600,demonDamageMultiplier:1.15,demonSpeedMultiplier:1.1,demonIncomingMultiplier:1.12,activationFrame:18,preserveVelocity:false,animation:{anticipationEnd:7,anticipationPose:14,accelerationPose:14,followThroughFrames:5,recoveryPose:0,lean:0,lunge:0,impactScale:1.06}}),
  demonFinish:m('鬼気解放・鬼炎一閃',16,[w(16,19,'spin')],21,16,{damage:19,reach:230,pose:9,baseKnockback:6.2,knockbackGrowth:.095,demonSpendFrame:16,canClank:false,special:true})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){
  const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};
 }
 const names={grab:'片手つかみ',pummel:'柄打ち',forwardThrow:'押し出し斬撃',backThrow:'返し投げ',upThrow:'太刀の打ち上げ',downThrow:'叩きつけ'};
 for(const[id,name]of Object.entries(names))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(!a.activationFrame)a.animation={...a.animation,anticipationPose:14};}
 // The ascending spin keeps its airborne silhouette between the short hit windows.
 moves.rise.animation={...moves.rise.animation,anticipationEnd:2,anticipationPose:3,accelerationPose:16,followThroughFrames:4,recoveryPose:5,lunge:4};
 return moves;
})();

const ReanRules=(()=>{
 let objects=[];
 const speedKeys=['walkSpeed','initialDashSpeed','runSpeed','airSpeed'];
 function restore(f){for(const key of speedKeys)f.character[key]=CharacterData.rean[key];}
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='rean'){f.reanDemonTime=0;f.reanDemonCooldown=0;f.reanSideUsed=false;restore(f);}}
 function prepare(f){const a=f.attack,boost=f.reanDemonTime>0&&!['gale','demonFinish','grab'].includes(a.type)&&!a.type.endsWith('Throw');
  if(boost){a.damage*=ReanMoves.gale.demonDamageMultiplier;a.activeFrames=a.activeFrames.map(w=>({...w,...(w.damage!==undefined?{damage:w.damage*ReanMoves.gale.demonDamageMultiplier}:{})}));a.demonBoost=true;}
 }
 function phase(f,a,i){const t=f.timer;
  if(t===a.phaseStart){a.phaseFace=f.face;a.phaseOrigin=f.x;f.reanSideUsed=!f.grounded;}
  if(t>=a.phaseStart&&t<=a.phaseEnd){a.gravityMultiplier=0;f.fastFall=false;f.vx=a.phaseFace*a.phaseSpeed;f.vy=0;}
  else if(t>=a.pivotFrame&&t<=a.activeEnd){a.gravityMultiplier=0;f.vy=0;f.vx=0;
   if(t===a.pivotFrame){const o=BattlePlayers.target(f);f.face=Math.abs(o.x-f.x)<240?(Math.sign(o.x-f.x)||-a.phaseFace):a.phaseFace;a.returnStep=(i.x||0)*a.phaseFace<-.35;}
   if(a.returnStep&&t>=a.returnStepFrames[0]&&t<=a.returnStepFrames[1])f.vx=-a.phaseFace*a.returnStepSpeed;
  }else if(t>a.activeEnd)a.gravityMultiplier=1;
 }
 function spiral(f,a,i){const t=f.timer;
  if(t<a.spiralStart)return;
  if(t===a.spiralStart){f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.fastFall=false;ring(f.x,f.y,'#ff7487',80);}
  if(t<=a.spiralEnd){a.gravityMultiplier=0;f.fastFall=false;const p=(t-a.spiralStart)*a.spiralRate;
   // Oscillation plus controllable centre drift, passed through swept stage collision.
   f.vx=(i.x||0)*a.spiralDrift+(Math.sin(p+a.spiralRate)-Math.sin(p))*a.spiralRadius;
   f.vy=-a.spiralSpeed;if(Math.abs(i.x)>.2)f.face=Math.sign(i.x);
   if(t>=a.spiralStart+10&&(i.special||i.guardPressed)){f.timer=a.spiralExitFrame;f.buffer=null;}
  }
  if(f.timer>=a.spiralExitFrame){a.gravityMultiplier=1;if(!a.spiralExited){a.spiralExited=true;f.vx*=.5;f.vy=a.exitVelocity;}}
 }
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;
  if(a.type==='dash')phase(f,a,i);if(a.type==='rise')spiral(f,a,i);
  const t=f.timer;
  if(a.type==='gale'&&t===a.activationFrame&&!a.objectSpawned){a.objectSpawned=true;
   if((f.reanDemonCooldown||0)>0){label(f.x,f.y-100,'鬼気解放・再使用待ち','#b3c6e4');return;}
   f.reanDemonTime=a.demonDuration;f.reanDemonCooldown=a.demonCooldown;ring(f.x,f.y-35,'#ff4d6a',110);label(f.x,f.y-105,'鬼気解放','#ff778b');
  }
  if(a.type==='demonFinish'&&t===a.demonSpendFrame&&!a.demonSpent){a.demonSpent=true;f.reanDemonTime=0;restore(f);}
  if(a.type==='dragon'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id);const tier=a.charge>=1?2:a.charge>=.5?1:0;
   objects.push({kind:'crimson',owner:f.id,face:f.face,x:f.x+f.face*40,y:f.y-38,vx:f.face*(a.crimson.speed+tier*1.5),age:0,tier,life:a.crimson.life,damage:(a.crimson.damage+a.crimson.tierDamage*tier)*(a.demonBoost?ReanMoves.gale.demonDamageMultiplier:1),radius:a.crimson.radius+tier*6,stale:a.staleMultiplier});
  }
 }
 function box(o){return{x1:o.previousX??o.x-o.vx,y1:o.y,x2:o.x,y2:o.y,radius:o.radius};}
 function tick(){
  for(const f of fighters)if(f.characterId==='rean'){
   if(f.respawn)f.reanDemonTime=0;if(f.grounded||f.ledge)f.reanSideUsed=false;
   f.reanDemonCooldown=Math.max(0,(f.reanDemonCooldown||0)-1);f.reanDemonTime=Math.max(0,(f.reanDemonTime||0)-1);
   for(const key of speedKeys)f.character[key]=CharacterData.rean[key]*(f.reanDemonTime?ReanMoves.gale.demonSpeedMultiplier:1);
  }
  for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;o.previousX=o.x;o.x+=o.vx;
   const p=platforms.find(p=>p.main);if(o.y>p.y&&o.y<p.y+90&&Math.max(o.previousX,o.x)>p.x&&Math.min(o.previousX,o.x)<p.x+p.w)o.dead=true;
   for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);
   if(!o.dead&&!enemy.respawn&&(touch||shield)&&!CombatSystem.protection(enemy).intangible){o.dead=true;const counter=enemy.attack;
    if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}
    else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:'dragon',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,angle:-.4,baseKnockback:3.2+o.tier*.8,knockbackGrowth:.063+o.tier*.009,launchDirection:o.face},b,touch);
   }
   }if(o.age>o.life||o.x<-900||o.x>2300)o.dead=true;
  }
  objects=objects.filter(o=>!o.dead);
 }
 function cpu(f,o,i){
  const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.type==='rise'){i.x=under?(f.x<p.x+p.w/2?-1:1):Math.sign(p.x+p.w/2-f.x);i.y=-1;i.special=false;i.guard=i.jab=i.heavy=i.smash=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=!f.reanSideUsed;}
  else if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>210&&!f.reanDemonTime&&!f.reanDemonCooldown&&frame%180===0){i.x=0;i.y=1;i.special=true;}
  return i;
 }
 return{reset,prepare,action,tick,box,cpu,get objects(){return objects}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('rean',{"uair":{"strike":[16],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[6,7],"windup":14},"bair":{"strike":[7,10],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});
