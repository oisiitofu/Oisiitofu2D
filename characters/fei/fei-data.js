'use strict';
const FeiMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,a=NewcomerCore.moves(['掌打','回し蹴り','稲剣','強力な回し蹴り','昇り掌打','足払い','踏み込み連撃','滅煌','天武','地恵','回転蹴り','飛脚','後ろ回し蹴り','宙返り蹴り','火計'],{
 dragon:m('ガイドショット',15,[],24,15,{special:true,guidedShot:true,projectile:true,pose:13,chargeFrame:5,chargeButton:'special',chargeMaxFrames:45,soundFamily:'light'}),
 dash:m('連烈',10,[w(10,13,'front',{pose:6}),w(26,30,'front',{pose:7}),w(43,47,'front',{pose:9,damage:9,baseKnockback:3.4,knockbackGrowth:.065})],25,19,{special:true,senretsu:true,newcomerHit:true,pose:6,damage:5,reach:118,baseKnockback:1.4,knockbackGrowth:.024,canClank:false,airControlMultiplier:0,gravityMultiplier:.65,soundFamily:'punch',animationWindows:[{start:1,end:9,pose:15},{start:10,end:18,pose:6},{start:19,end:25,pose:3},{start:26,end:33,pose:7},{start:34,end:42,pose:3},{start:43,end:52,pose:9},{start:53,end:72,pose:0}]}),
 rise:m('風勁',12,[],93,25,{special:true,fukei:true,projectile:true,pose:14,helpless:true,airControlMultiplier:0,gravityMultiplier:.55,soundFamily:'light',animationWindows:[{start:1,end:11,pose:12},{start:12,end:60,pose:14},{start:61,end:105,pose:5}]}),
 gale:m('地恵',20,[],26,16,{special:true,feiQuake:true,pose:3,projectile:true,soundFamily:'earth'}),
 airDrop:m('地恵・空中',10,[w(10,76,'down',{pose:11})],24,26,{special:true,feiQuake:true,aerial:true,feiDrop:true,newcomerHit:true,pose:11,damage:12,angle:1.45,meteorFrame:14,meteorAngle:1.55,airControlMultiplier:.15,soundFamily:'earth'}),
 earthImpact:m('地恵・着地',1,[],26,26,{special:true,feiQuake:true,projectile:true,pose:3,soundFamily:'earth'})
 },'punch',120);
 a.jab2.pose=7;a.jab2.animation.accelerationPose=7;a.heavy.pose=7;a.heavy.animation.accelerationPose=7;a.fair.pose=7;a.fair.animation.accelerationPose=7;a.air.pose=10;a.air.animation.accelerationPose=10;
 a.upsmash.pose=8;a.upsmash.animation.accelerationPose=8;a.downsmash.activeFrames=a.downsmash.activeFrames.map(v=>({...v,shape:'shockwave',pose:3}));a.downsmash.pose=3;
 for(const v of Object.values(a)){v.animation.anticipationPose=3;v.animation.lean=0;v.animation.lunge=0;v.animation.impactScale=1;}
 return a;
})();
const FeiRules=NewcomerCore.create('fei',FeiMoves,{
 prepare(f,a){if(a.senretsu){a.comboStage=1;a.nextQueued=false;}if(a.fukei){a.aim=0;a.redirected=false;a.launched=false;a.clearing=false;}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.guidedShot&&t===15&&!a.eventsDone.has('shot')){a.eventsDone.add('shot');r.spawn(f,{bodyOrigin:true,kind:'ki',x:f.x+f.face*42,y:f.y-67,vx:f.face*(12-a.charge*3),vy:clamp(i.y,-1,1)*2.5,radius:12+a.charge*13,damage:7+a.charge*9,life:75,charge:a.charge});}
  if(a.senretsu){f.buffer=null;f.fastFall=false;const open=a.comboStage===1&&t>=16&&t<=22||a.comboStage===2&&t>=33&&t<=39;
   if(open&&i.special&&!a.specialWas)a.nextQueued=true;
   if(open&&i.guard){f.attack=null;PlayerStates.enter(f,f.grounded?'Idle':'Fall');return;}
   if(t===1||t===24&&a.comboStage>=2||t===41&&a.comboStage>=3)f.vx=a.originFace*(a.originGrounded?5.5:3.5);
   if(t===23||t===40){if(a.nextQueued){a.comboStage++;a.nextQueued=false;a.hits.clear();}else{a.totalFrames=t+7;a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;a.activeFrames=a.activeFrames.filter(w=>w.end<t);a.activeEnd=a.activeFrames.at(-1)?.end;a.animationWindows=[...a.animationWindows.filter(w=>w.end<t),{start:t,end:a.totalFrames,pose:0}];}}
   f.face=a.originFace;f.vx*=.93;
  }
  if(a.fukei){f.buffer=null;f.fastFall=false;const p=platforms.find(p=>p.main);
   if(!a.launched){f.vx=f.vy=0;a.aim=clamp(i.x,-1,1);}
   if(t===12&&!a.launched){a.launched=true;f.recovered=true;f.grounded=false;f.specialLandingLag=25;f.vx=a.aim*8;f.vy=-20;if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89){a.clearing=a.ceilingUsed=true;NewcomerCore.escape(f,a);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,.55);if(!a.escapeSide){f.vx=0;f.vy=-22;}a.specialWas=!!i.special;return;}
   if(a.launched&&[12,21,30].includes(t))r.spawn(f,{bodyOrigin:true,kind:'wind',x:f.x-f.face*10,y:f.y-55,vx:f.face*6,vy:2,radius:14,damage:3,life:25});
   if(a.launched&&t>=24&&t<=45&&i.special&&!a.specialWas&&!a.redirected){a.redirected=true;a.redirectFrame=t;f.vx=clamp(i.x,-1,1)*13;f.vy=-12;r.spawn(f,{bodyOrigin:true,kind:'wind',x:f.x,y:f.y-58,vx:f.vx*.55,vy:1,radius:18,damage:4,life:25});}
   if(a.launched){if(f.y<=p.y-5)a.clearing=false;const aim=a.clearing?0:clamp(i.x,-1,1)*7;f.vx=moveToward(f.vx,aim,.15);}
  }
  if(a.feiDrop&&t>=10){f.fastFall=false;f.vy=Math.min(19,Math.max(f.vy,15));}
  if(a.feiQuake&&!a.feiDrop&&t===a.startupFrames&&!a.eventsDone.has('earth')){a.eventsDone.add('earth');for(const side of [-1,1])r.spawn(f,{kind:'earth',x:f.x+side*65,y:f.y-30,vx:0,vy:0,face:side,radius:25,damage:a.impactFromAir?14:12,life:12,groundY:f.y});}
  a.specialWas=!!i.special;
 },
 collision(f,i,v){const a=f.attack;if(a?.fukei&&a.launched&&!a.ceilingUsed&&v.oldVy<0&&f.vy===0&&!f.grounded){a.clearing=a.ceilingUsed=true;NewcomerCore.escape(f,a);}},
 boxes(f,a,w,t){if(a.senretsu&&(t>=26&&a.comboStage<2||t>=43&&a.comboStage<3))return[];
  if(a.feiDrop)return[{x1:f.x,y1:f.y-35,x2:f.x+f.face*14,y2:f.y+7,radius:16,window:w,modifiers:w}];
  const g=w.shape==='back'?[-18,-62,Math.PI]:w.shape==='up'?[35,-72,-Math.PI/2]:w.shape==='down'?[22,-48,Math.PI/2]:w.shape==='low'?[20,-16,0]:[20,-64,0],reach=(w.reach??a.reach)*FIGHTER_SCALE*.65;
  if(w.shape==='spin')return[{x1:f.x-48,y1:f.y-60,x2:f.x+48,y2:f.y-60,radius:19,window:w,modifiers:w}];
  if(w.shape==='shockwave')return[{x1:f.x-65,y1:f.y-15,x2:f.x+65,y2:f.y-15,radius:17,window:w,modifiers:w}];
  return[{x1:f.x+g[0]*f.face,y1:f.y+g[1],x2:f.x+(g[0]+Math.cos(g[2])*reach)*f.face,y2:f.y+g[1]+Math.sin(g[2])*reach,radius:13,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[3,17,21,23,32,36].includes(pose(f));return[{part:'head',x:f.x+f.face*8,y:f.y-(low?44:103),r:17},{part:'torso',x:f.x,y:f.y-(low?27:62),r:22},{part:'legs',x:f.x,y:f.y-18,r:17}];},
 projectile(q,f,o){if(q.kind!=='earth')return false;if(f.respawn||q.age>=q.life){q.dead=true;return true;}const b={x1:q.x,y1:q.groundY-7,x2:q.x,y2:q.groundY-78,radius:q.radius};if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...FeiMoves.gale,type:'gale',charge:0,damage:q.damage,angle:-1,projectile:true,staleMultiplier:q.stale,launchDirection:q.face};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,a,b,touch);}}return true;},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.guidedShot)i.specialHeld=Math.abs(o.x-f.x)>250&&a.chargeFrames<30;
  if(a?.senretsu){clear();i.x=a.originFace;i.special=([18,35].includes(f.timer)&&Math.abs(o.x-f.x)<190);}
  if(a?.fukei){clear();i.y=-1;i.x=a.clearing&&f.y>p.y?0:f.y>p.y+80&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):Math.sign(720-f.x);i.special=!a.redirected&&f.timer===36;}
 }
});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('fei',{"bair":{"strike":[7,10],"windup":14},"fair":{"strike":[13],"windup":14},"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"jab3":{"strike":[7,9],"windup":14}});
