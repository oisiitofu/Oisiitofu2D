'use strict';
const SakuraMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword',tether:true};
 const a=NewcomerCore.moves(['横斬り','逆袈裟斬り','突き','大上段斬り','柄打ち','しゃがみ払い','踏み込み斬り','桜花一文字','桜花天昇','回転抜刀斬り','円舞斬り','二段刺突','後ろ薙ぎ・鞘打ち','昇り斬り','急降下突き'],{
  dragon:m('破邪剣征・桜華放神',10,[],100,0,{...opt,sakuraWave:true,pose:31,projectile:true,damage:9,gravityMultiplier:.85}),
  dash:m('破邪剣征・百花繚乱',12,[],90,0,{...opt,sakuraFan:true,pose:35,projectile:true,damage:5,gravityMultiplier:.8}),
  rise:m('桜花天昇',7,[],85,14,{...opt,tether:false,sakuraAscent:true,pose:37,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
  gale:m('破邪の決意',12,[],200,0,{...opt,sakuraResolve:true,pose:40,damage:0,gravityMultiplier:.9}),
  airDrop:m('空中・破邪の決意',12,[],200,12,{...opt,sakuraResolve:true,pose:40,damage:0,aerial:true,gravityMultiplier:.9})
 },'sword',130),p={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=25;
 a.air.activeFrames[0].shape='front';a.air.angle=-1.1;for(const k of['air','up','fair','bair','dair','smash'])a[k].authoredEffectCoverage=true;a.dash.authoredEffectCoverage=a.rise.authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:0,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function sakuraMorale(f){return clamp(f.sakuraMorale||0,0,100);}
function sakuraDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function sakuraGate(f,type){if(type==='dash'&&!f.grounded&&f.newSideUsed)return false;if(['gale','airDrop'].includes(type)&&sakuraMorale(f)>=100)return false;return !(['dragon','dash'].includes(type)&&SakuraRules.objects.filter(q=>q.owner===f.id&&!q.dead).length>=9);}
function sakuraLand(){return false;}
function sakuraProjectile(f,r,v){if(r.objects.filter(q=>q.owner===f.id&&!q.dead).length>=9)return null;return r.spawn(f,{kind:'wave',fx:4,vx:0,vy:0,life:45,damage:9,base:3.8,growth:.07,...v});}
function sakuraLift(f,a,t,i){a.phase='rise';a.launchAt=t;a.side=Math.abs(i.x)>.2?Math.sign(i.x):a.originFace;a.pose=37;f.grounded=false;f.recovered=true;a.activeFrames=[CombatData.window(t,t+8,'up',{pose:37,index:0,damage:a.boost?9:5,angle:-1.3,meleeCoverage:true}),CombatData.window(t+18,t+27,'front',{pose:38,index:1,damage:a.boost?12:7,angle:-1.05,meleeCoverage:true})];a.activeStart=t;a.activeEnd=t+27;a.motionLastEvent=a.motionCommitEnd=t+31;sakuraDuration(f,a,t+44);}
const SakuraRules=NewcomerCore.create('sakura',SakuraMoves,{
 reset(){for(const f of fighters)if(f.characterId==='sakura')f.sakuraMorale=0;},
 status(f){f.sakuraMorale=f.respawn?0:clamp(sakuraMorale(f)+.025,0,100);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));if(a.special){a.boost=!a.sakuraResolve&&sakuraMorale(f)>=100;if(a.boost)f.sakuraMorale=0;a.motionLastEvent=a.motionCommitEnd=a.totalFrames-10;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];}if(a.sakuraAscent)a.phase='start';},
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);
  if(a.type==='downsmash')f.face=t>=a.activeFrames[1].start&&t<=a.activeEnd?-a.originFace:a.originFace;
  if(a.sakuraWave&&!a.released){if(t>=30)a.pose=32;if(t>=10&&(!held||t>=65)){a.released=t;a.charged=t>=35;a.pose=33;const scale=a.boost?1.35:1;sakuraProjectile(f,r,{x:f.x+a.originFace*45,y:f.y-43,vx:a.originFace*(a.charged?14:11),life:a.charged?60:43,radius:a.boost?29:a.charged?24:17,damage:(a.charged?16:9)*scale,base:a.charged?4.7:3.8,growth:a.charged?.085:.07,charged:a.charged,boost:a.boost});a.motionLastEvent=a.motionCommitEnd=t;sakuraDuration(f,a,t+25);}}
  if(a.sakuraFan&&!a.released){a.aim=(i.y||0)<-.3?-.55:(i.y||0)>.3?.35:0;a.pose=a.aim<0?34:a.aim>0?36:35;if(t>=12&&(!held||t>=42)){a.released=t;a.stepEnd=t+6;const angle=a.aim;for(const delta of[-.22,0,.22])sakuraProjectile(f,r,{kind:'fan',fx:2,x:f.x+a.originFace*40,y:f.y-46,vx:a.originFace*Math.cos(angle+delta)*(a.boost?11:8.5),vy:Math.sin(angle+delta)*(a.boost?11:8.5),life:32,radius:a.boost?17:12,damage:a.boost?7:4.5,base:3.6,growth:.06,boost:a.boost,angle});a.activeFrames=[CombatData.window(t,t+4,'front',{pose:a.pose,index:0,damage:a.boost?8:5,meleeCoverage:true})];a.activeStart=t;a.activeEnd=t+4;a.motionLastEvent=a.motionCommitEnd=t+4;sakuraDuration(f,a,t+27);}}
  if(a.sakuraFan&&a.released&&t<=a.stepEnd)f.vx=a.originFace*3;
  if(a.sakuraAscent){f.fastFall=false;if(a.phase==='start'){f.vx*=.35;f.vy=0;if(t>=7){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.phase='escape';sakuraDuration(f,a,t+140);}else sakuraLift(f,a,t,i);}}
   if(a.phase==='escape'){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)sakuraLift(f,a,t,i);return;}
   if(a.phase==='rise'){const d=t-a.launchAt;if(d<18){a.pose=37;f.vx=(i.x||0)*3+a.side*Math.sin(d*.16)*2;f.vy=-16+d*.28;}else{a.pose=38;f.vx=(i.x||0)*5+a.side*Math.cos((d-18)*.2)*3;f.vy=-10+(d-18)*.35;}
    if(d>=31){a.phase='exit';a.exitAt=t;a.pose=39;f.vx=(Math.abs(i.x)>.15?i.x:a.side)*6;f.vy=-6;a.gravityMultiplier=1;a.airControlMultiplier=1;a.motionLastEvent=a.motionCommitEnd=t;sakuraDuration(f,a,t+10);}}
   if(a.phase==='exit')a.pose=t-a.exitAt<5?39:60;
  }
  if(a.sakuraResolve&&!a.released){f.vx*=.75;if(t>=12){a.pose=40;f.sakuraMorale=clamp(sakuraMorale(f)+.6,0,100);}if(t>=18&&(!held||t>=180||sakuraMorale(f)>=100)){a.released=t;a.pose=41;a.motionLastEvent=a.motionCommitEnd=t;sakuraDuration(f,a,t+17);}}
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 onHit(f){f.sakuraMorale=clamp(sakuraMorale(f)+5,0,100);},
 projectile(q,f,o){if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1400){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,q.radius,q.radius*2)){q.dead=true;return true;}const box={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(box,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,box);if(touch||shield){q.hits.add(target.id);CombatSystem.hit(f,target,{...SakuraMoves.dragon,type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:-.85,baseKnockback:q.base,knockbackGrowth:q.growth},box,touch);if(q.kind==='fan')q.dead=true;}}return true;},
 boxes(f,a,w){if(a.sakuraWave||a.sakuraResolve)return[];const reach=({jab:103,jab2:111,jab3:128,heavy:146,low:132,dashAttack:137,smash:161,fair:149,bair:127})[a.type]||133;let p=w.shape==='up'?[0,-35,0,-148]:w.shape==='back'?[0,-43,-reach,-44]:w.shape==='low'?[0,-14,reach,-14]:w.shape==='down'?[8,-20,44,64]:[0,-44,reach,-48];
  if(a.type==='air')p=[10,-30,95,-135];if(a.type==='downsmash')p=[5,-18,139,-18];if(a.sakuraFan)p=[0,-44,Math.cos(a.aim)*115,-44+Math.sin(a.aim)*115];if(a.sakuraAscent&&w.index===1)p=[-23,-55,110,-95];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:w.shape==='up'?28:a.type==='air'?24:22,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[11,13,21,22,25,32,40,43,44,45,51,53,56,57].includes(sakuraPose(f));return[{part:'head',x:f.x,y:f.y-(low?40:81),r:13},{part:'torso',x:f.x,y:f.y-(low?27:47),r:17},{part:'legs',x:f.x,y:f.y-12,r:15}];},
 cpu(f,o,i){if(f.attack?.sakuraWave)i.specialHeld=Math.abs(o.x-f.x)>230&&f.timer<40;if(f.attack?.sakuraFan){i.y=o.y<f.y-40?-1:o.y>f.y+20?1:0;i.specialHeld=f.timer<14;}if(f.attack?.sakuraResolve)i.specialHeld=sakuraMorale(f)<100&&Math.abs(o.x-f.x)>180;if(f.attack?.sakuraAscent)i.x=Math.sign(720-f.x);}
});
function sakuraPose(f){if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;}
MoveMotion.define('sakura',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:['low','smash','downsmash'].includes(k)?11:['air','fair','bair','uair','dair'].includes(k)?14:0,strike:k==='air'?[26,62]:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));
