'use strict';
const RionMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword',tether:true};
 const a=NewcomerCore.moves(['シャルティエ横斬り','逆手ダガー斬り','二刀クロス','虎牙斬風','跳ね上げ斬り','しゃがみ下段斬り','滑り斬り','魔神剣・マリアン','月閃光','臥竜斬月','飛燕連刃の旋回','空襲剣','逆手突き','虎牙破斬の昇刃','臥龍閃'],{
  dragon:m('魔神剣',11,[],18,0,{...opt,rionMajin:true,pose:40,damage:8,projectile:true,rangedInterval:28,airControlMultiplier:.2}),
  dash:m('幻影刃 → 月閃光',8,[w(8,13,'front',{pose:48,damage:6,index:0})],29,8,{...opt,rionIllusion:true,pose:48,damage:6,gravityMultiplier:.4,airControlMultiplier:0}),
  rise:m('空襲剣 → 飛燕連刃',7,[w(7,15,'up',{pose:33,damage:6,index:0})],48,16,{...opt,tether:false,rionFlight:true,pose:33,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:16}),
  gale:m('獣哮雷',6,[],25,0,{...opt,rionGuard:true,pose:43,damage:0,gravityMultiplier:.6}),
  airDrop:m('空中獣哮雷',6,[],25,8,{...opt,rionGuard:true,pose:43,damage:0,aerial:true,gravityMultiplier:.6})
 },'sword',135),p={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:37,getupAttack:37,forwardThrow:19,backThrow:14,upThrow:8,downThrow:11};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function rionCC(f){return clamp(f.rionCC??4,0,4);}
function rionGate(f,type){if(type==='rise')return true;if(['dragon','dash','gale','airDrop'].includes(type)&&rionCC(f)<1)return false;return !(type==='dragon'&&RionRules.objects.some(q=>q.owner===f.id&&q.kind==='wave'&&!q.dead));}
function rionDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function rionLaunch(f,a,t,i){a.launchAt=t;a.launchX=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.grounded=false;f.recovered=true;const stages=a.funded?[CombatData.window(t,t+7,'up',{pose:33,damage:6,index:0}),CombatData.window(t+12,t+19,'up',{pose:42,damage:7,index:1})]:[CombatData.window(t,t+7,'up',{pose:33,damage:5,index:0})];a.activeFrames=stages;a.activeStart=t;a.activeEnd=stages.at(-1).end;a.motionLastEvent=a.funded?t+36:a.activeEnd;rionDuration(f,a,t+(a.funded?58:39));}
const RionRules=NewcomerCore.create('rion',RionMoves,{
 reset(){for(const f of fighters)if(f.characterId==='rion')Object.assign(f,{rionCC:4,rionCCClock:0,rionCast:0,rionRewarded:0,rionGuardTime:0});},
 status(f){if(f.respawn){Object.assign(f,{rionCC:4,rionCCClock:0,rionCast:0,rionRewarded:0,rionGuardTime:0});return;}if(f.rionGuardTime>0)f.rionGuardTime--;if(!f.hitlag&&rionCC(f)<4){f.rionCCClock=(f.rionCCClock||0)+1;if(f.rionCCClock>=90){f.rionCCClock=0;f.rionCC=rionCC(f)+1;}}else if(rionCC(f)>=4)f.rionCCClock=0;},
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));if(a.special){a.funded=rionCC(f)>=1;if(a.funded)f.rionCC=rionCC(f)-1;}
  if(f.rionGuardTime>0&&!a.rionGuard)a.armorFrames=[{start:1,end:Math.max(12,a.activeEnd),damageThreshold:8,hitCount:1}];
  if(a.rionMajin){a.cast=(f.rionCast||0)+1;f.rionCast=a.cast;a.motionLastEvent=a.motionCommitEnd=18;}
  if(a.rionIllusion){a.followUntil=35;a.motionLastEvent=a.motionCommitEnd=35;const o=BattlePlayers.targets(f).sort((x,y)=>Math.abs(x.x-f.x)-Math.abs(y.x-f.x))[0];a.targetId=o?.id;}
  if(a.rionFlight)a.motionLastEvent=36;
  if(a.rionGuard){a.armorFrames=[{start:6,end:26,damageThreshold:14,hitCount:1}];a.motionLastEvent=a.motionCommitEnd=18;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld),pressed=held&&!a.specialWas;a.specialWas=held;
  if(a.rionMajin){if(!a.first&&t>=11){a.first=true;r.spawn(f,{kind:'wave',cast:a.cast,part:0,sourceType:'dragon',x:f.x+f.face*45,y:f.y-26,vx:f.face*8.3,vy:0,radius:22,damage:8,life:42,airborne:!f.grounded});}
   if(!a.decided&&t>=18){a.decided=true;a.double=held;a.motionLastEvent=a.motionCommitEnd=held?25:11;rionDuration(f,a,held?40:28);}
   if(a.double&&!a.second&&t>=25){a.second=true;a.pose=52;r.spawn(f,{kind:'wave',cast:a.cast,part:1,sourceType:'dragon',x:f.x+f.face*45,y:f.y-26,vx:f.face*9,vy:0,radius:25,damage:10,life:42,airborne:!f.grounded});}f.vx=moveToward(f.vx,0,.7);
  }
  if(a.rionIllusion){f.fastFall=false;if(t<8){f.vx*=.45;f.vy*=.4;}else if(t<=13){f.vx=a.originFace*6;f.vy=Math.min(f.vy,0);}else f.vx*=.65;
   if(t===16){const o=BattlePlayers.targets(f).find(o=>o.id===a.targetId);if(o&&!o.respawn&&Math.abs(o.x-f.x)<185&&Math.abs(o.y-f.y)<75){a.crossed=true;f.x=o.x+a.originFace*58;f.face=-a.originFace;r.spawn(f,{kind:'illusion',x:f.x,y:f.y-42,face:a.originFace,life:12,damage:0,vx:0,vy:0});}a.pose=a.crossed?49:48;a.activeFrames.push(CombatData.window(18,22,'front',{pose:a.pose,damage:8,index:1}));a.activeEnd=22;}
   if(!a.moonAt&&t>=23&&t<=a.followUntil&&pressed){a.moonAt=t;f.grounded=false;a.pose=50;a.activeFrames.push(CombatData.window(t+3,t+9,'up',{pose:50,damage:12,index:2,angle:-1.15,baseKnockback:4.7,knockbackGrowth:.075}));a.activeEnd=t+9;a.motionLastEvent=a.motionCommitEnd=a.activeEnd;rionDuration(f,a,t+25);}
   if(a.moonAt){const dt=t-a.moonAt;a.pose=dt<12?50:5;a.gravityMultiplier=dt<12?0:1;if(dt<12){f.vy=-7.5+dt*.45;f.vx=f.face*2.2;}}
  }
  if(a.rionFlight){f.fastFall=false;if(t<7){f.vx*=.45;f.vy=0;return;}if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];rionDuration(f,a,t+110);}else rionLaunch(f,a,t,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)rionLaunch(f,a,t,i);return;}const dt=t-a.launchAt;
   if(a.funded&&!a.slashAt&&dt>=22&&dt<=36&&pressed){a.slashAt=t;let x=Math.abs(i.x)>.15?i.x:a.launchX*.75,y=Math.abs(i.y)>.15?i.y:-.5,len=Math.max(.1,Math.hypot(x,y));a.slashX=x/len;a.slashY=y/len;f.face=Math.sign(x)||f.face;a.pose=51;a.activeFrames.push(CombatData.window(t,t+7,'front',{pose:51,damage:10,index:2,angle:-.75,baseKnockback:4.5,knockbackGrowth:.07}));a.activeEnd=t+7;a.motionLastEvent=a.activeEnd;rionDuration(f,a,t+29);}
   if(a.slashAt){const d=t-a.slashAt;a.pose=d<11?51:35;a.gravityMultiplier=d<11?0:1;if(d<11){f.vx=a.slashX*8;f.vy=a.slashY*8;}else f.vx*=.98;}
   else if(dt<(a.funded?22:14)){a.pose=dt<12?33:42;a.gravityMultiplier=0;f.vx=a.launchX*(a.funded?3.8:3.2);f.vy=a.funded?(dt<12?-12.7+dt*.2:-11.5+(dt-12)*.3):-13+dt*.3;}
   else{a.pose=35;a.gravityMultiplier=1;f.vx*=.97;}
  }
  if(a.rionGuard){f.vx*=.7;if(t===18&&!a.buffApplied){a.buffApplied=true;f.rionGuardTime=180;r.spawn(f,{kind:'sigil',x:f.x,y:f.y-45,vx:0,vy:0,life:30,damage:0});}}
 },
 onHit(f,o,hit){if(!hit.projectile||hit.sourceType!=='dragon'||!hit.rionCast||f.rionRewarded===hit.rionCast)return;f.rionRewarded=hit.rionCast;f.rionCC=Math.min(4,rionCC(f)+1);},
 projectile(q,f,o,r){if(q.kind!=='wave'){if(q.age>=q.life)q.dead=true;return true;}const main=platforms.find(p=>p.main);q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;if(!q.airborne&&q.x>main.x&&q.x<main.x+main.w)q.y=main.y-26;else{q.airborne=true;q.vy+=.25;q.y+=q.vy;}
  if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1200){q.dead=true;return true;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))if(!q.hits.has(target.id)&&!CombatSystem.protection(target).intangible){const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(touch||shield){q.hits.add(target.id);CombatSystem.hit(f,target,{...RionMoves.dragon,type:'dragon',sourceType:'dragon',projectile:true,rionCast:q.cast,charge:0,damage:q.damage,launchDirection:q.face,angle:-.85,staleMultiplier:q.stale},b,touch);q.dead=true;break;}}return true;
 },
 boxes(f,a,w){if(a.rionMajin||a.rionGuard)return[];const s=w.shape,reach=({jab:108,jab2:88,jab3:110,heavy:142,low:125,dashAttack:139,smash:164,fair:145,bair:130,dash:145,rise:126})[a.type]||124;if(a.rionFlight&&a.slashAt&&w.index===2)return[{x1:f.x,y1:f.y-44,x2:f.x+a.slashX*reach,y2:f.y-44+a.slashY*reach,radius:23,window:w,modifiers:w}];const p=s==='up'?[0,-34,0,-126]:s==='down'?[0,-34,14,42]:s==='back'?[0,-45,-reach,-45]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-62,-45,62,-45]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?30:s==='spin'?27:19,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36,40,46,52].includes(rionPose(f));return[{part:'head',x:f.x,y:f.y-(low?39:78),r:14},{part:'torso',x:f.x,y:f.y-(low?22:47),r:18},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 cpu(f,o,i,clear){if(f.attack?.rionFlight&&f.timer-f.attack.launchAt>=25){i.special=true;i.specialHeld=true;i.x=Math.sign(720-f.x);i.y=-.4;return;}if(f.attack?.rionIllusion&&f.timer>=25){i.special=true;i.specialHeld=true;return;}if(f.attack?.rionMajin){i.specialHeld=Math.abs(o.x-f.x)>200;return;}if(!f.attack&&f.grounded&&rionCC(f)>=1&&f.rionGuardTime<=0&&Math.abs(o.x-f.x)>230&&frame%97===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
function rionPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:34,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('rion',{jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},heavy:{windup:3,strike:[41],recovery:0},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46,14],recovery:3},air:{windup:34,strike:[10],recovery:5},fair:{windup:34,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:34,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}});
