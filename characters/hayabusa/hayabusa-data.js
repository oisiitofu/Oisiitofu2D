'use strict';
const HayabusaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['龍剣横斬り','逆袈裟斬り','回し蹴り','大振り斬り','突き上げ','低段払い','駆け上がり斬り','飯綱の構え・突斬り','連続斬り上げ','前斬り・後ろ回し','旋回斬り','二連斬り','後ろ蹴り斬り','突き上げ斬り','急降下斬り'],{
  dragon:m('手裏剣',10,[],18,0,{...opt,hayabusaShuriken:true,projectile:true,pose:40,damage:4}),
  dash:m('飛燕',9,[w(10,14,'front',{pose:42,damage:9})],20,0,{...opt,hayabusaSwallow:true,pose:42,damage:9,gravityMultiplier:0,airControlMultiplier:0}),
  rise:m('風の道',8,[w(9,15,'up',{pose:46,damage:7})],48,14,{...opt,hayabusaWind:true,pose:46,damage:7,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
  gale:m('闇・Gleam State',18,[],12,0,{...opt,hayabusaGleam:true,pose:47,damage:0}),
  airDrop:m('空中・闇',18,[],12,10,{...opt,hayabusaGleam:true,aerial:true,pose:47,damage:0})
 },'sword',118),poses={jab:6,jab2:7,jab3:8,heavy:9,up:8,low:11,dashAttack:9,smash:12,upsmash:13,downsmash:11,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:13,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}
 a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function hayabusaGleam(f){return(f.hayaGleamTime||0)>0;}
function hayabusaLand(f){if(!f.attack?.hayabusaSwallow)return false;f.grounded=true;f.vy=0;f.attack.gravityMultiplier=1;f.fastFall=f.shortHop=f.airDodged=f.helpless=f.recovered=false;f.specialLandingLag=0;f.airJumps=f.character.airJumpCount;f.jumps=f.ledgeGrabs=0;return true;}
function hayabusaGate(f,type){return !(type==='dragon'&&((f.hayaShurikenCooldown||0)>0||HayabusaRules.objects.filter(q=>q.owner===f.id&&!q.dead).length>=3)||['gale','airDrop'].includes(type)&&(hayabusaGleam(f)||(f.hayaGleamCooldown||0)>0));}
function hayabusaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function hayabusaStartWind(f,a,i,t){
 const p=platforms.find(p=>p.main),left=Math.abs(f.x-p.x),right=Math.abs(f.x-p.x-p.w),near=!a.originGrounded&&(f.x<p.x||f.x>p.x+p.w)&&Math.min(left,right)<85&&f.y>p.y+30&&f.y<p.y+260;
 a.windAt=t;a.wall=near;a.wallSide=left<right?-1:1;a.wallX=a.wallSide<0?p.x-f.character.ecb.radius-2:p.x+p.w+f.character.ecb.radius+2;a.windFace=near?-a.wallSide:Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.windFace;f.recovered=true;f.grounded=false;f.fastFall=false;
 a.activeFrames=[CombatData.window(t,t+6,'up',{pose:near?44:46,damage:a.empowered?9:7})];hayabusaDuration(f,a,t+50);
}
const HayabusaRules=NewcomerCore.create('hayabusa',HayabusaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='hayabusa')Object.assign(f,{hayaGleamTime:0,hayaGleamCooldown:0,hayaShurikenCooldown:0,hayaSwallowCooldown:0});},
 status(f){for(const k of['hayaGleamTime','hayaGleamCooldown','hayaShurikenCooldown','hayaSwallowCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);},
 prepare(f,a){
  a.activeFrames=a.activeFrames.map(w=>({...w}));a.empowered=hayabusaGleam(f);
  if(a.empowered&&!a.hayabusaGleam){a.damage*=1.12;for(const w of a.activeFrames)if(w.damage!=null)w.damage*=1.12;}
  if(a.hayabusaShuriken){a.volleyEnd=10;f.hayaShurikenCooldown=40;}
  if(a.hayabusaSwallow){const o=BattlePlayers.target(f),d=(o.x-f.x)*f.face;a.travel=d>0&&d<240?clamp(d+55,95,240):145;a.followUntil=28;a.motionLastEvent=28;f.hayaSwallowCooldown=0;}
  if(a.hayabusaGleam)f.hayaGleamCooldown=1080;
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.hayabusaShuriken){
   a.pose=t<10?40:41;f.vx=moveToward(f.vx,0,.65);
   if(t===10&&i.specialHeld)a.volleyEnd=22;
   if([10,16,22].includes(t)&&t<=a.volleyEnd&&!a.eventsDone.has('star'+t)){a.eventsDone.add('star'+t);r.spawn(f,{kind:'shuriken',bodyOrigin:true,x:f.x+f.face*12,y:f.y-49,vx:f.face*(a.empowered?14:12),vy:0,damage:a.empowered?4.5:4,radius:9,life:36});f.hayaShurikenCooldown=Math.max(f.hayaShurikenCooldown,34);}
  }
  if(a.hayabusaGleam){f.fastFall=false;f.vx=moveToward(f.vx,0,.6);if(t===18&&!a.activated){a.activated=true;f.hayaGleamTime=600;}}
  if(a.hayabusaSwallow){
   if(t>=8&&t<=20){const phase=(t-8)/12,next=Math.min(1,(t-7)/12),desired=a.origin.x+a.originFace*a.travel*next;a.pose=42;f.grounded=false;f.vx=desired-f.x;f.vy=a.origin.y-Math.sin(next*Math.PI)*46-f.y;}
   else{f.vx=moveToward(f.vx,0,1.3);a.gravityMultiplier=1;if(t>=21){f.face=-a.originFace;a.pose=43;}}
   if(t>=18&&t<=a.followUntil&&i.special&&!a.specialWas&&!a.followAt){a.followAt=t+4;a.activeFrames.push(CombatData.window(a.followAt,a.followAt+3,'front',{pose:43,damage:a.empowered?11.2:10}));a.motionLastEvent=a.followAt+3;}
   a.specialWas=!!i.special;
  }
  if(a.hayabusaWind){
   f.fastFall=false;if(t<8){f.vx*=.6;f.vy=0;return;}
   if(a.windAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);hayabusaDuration(f,a,t+100);}else hayabusaStartWind(f,a,i,t);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)hayabusaStartWind(f,a,i,t);return;}
   const dt=t-a.windAt,power=a.empowered?1.12:1;
   a.pose=a.wall&&dt<15?44:a.wall&&dt<25?45:dt<22?46:35;
   if(dt<15){f.vx=a.wall?clamp((a.wallX-f.x)*.35,-6,6):a.windFace*3.2;f.vy=(a.wall?-11.8:-10.6)*power;a.gravityMultiplier=0;}
   else if(dt<27){f.vx=a.wall?a.windFace*6.8:clamp(i.x,-1,1)*4.2;f.vy=-6.8*power;a.gravityMultiplier=0;}
   else{a.gravityMultiplier=.8;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.3);}
  }
 },
 onHit(f,o,a){if(f.attack?.type==='dair'&&!f.attack.bounced){f.attack.bounced=true;f.vy=-7.5;f.grounded=false;}},
 boxes(f,a,w){const s=w.shape,reach=a.hayabusaSwallow?110:({jab:86,jab2:90,jab3:95,heavy:117,low:100,dashAttack:113,smash:145,fair:119,bair:110})[a.type]??110;
  const p=s==='up'?[0,-35,8,-129]:s==='down'?[0,-36,17,33]:s==='back'?[0,-48,-reach,-48]:s==='low'?[0,-17,reach,-17]:s==='spin'?[-53,-49,53,-49]:[0,-48,reach,-48];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='spin'?24:a.type.includes('smash')?20:17,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[3,11,22,32,36,43].includes(hayabusaPose(f));return[{part:'head',x:f.x,y:f.y-(low?44:94),r:15},{part:'torso',x:f.x,y:f.y-(low?26:53),r:21},{part:'legs',x:f.x,y:f.y-13,r:15}];},
 cpu(f,o,i,clear){if(f.attack?.hayabusaWind){i.x=Math.sign(720-f.x);return;}if(f.attack?.hayabusaSwallow){i.special=f.timer===23;return;}if(!f.attack&&f.grounded&&frame%83===f.id&&!f.hayaGleamCooldown){clear();i.x=0;i.y=1;i.special=true;}}
});
function hayabusaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:hayabusaGleam(f)?47:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

function hayabusaFlip(f,n){return n===44||n===6||n===7;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('hayabusa',{"jab3":{"strike":[7,6],"windup":3},"heavy":{"strike":[9],"windup":3},"dashAttack":{"strike":[2,9],"windup":3},"fair":{"strike":[12,13],"windup":3}});
