'use strict';
const ArthurMoves=(()=>{
 const m=CombatData.createMove,opt={special:true,newcomerHit:true,soundFamily:'sword',tether:true};
 const a=NewcomerCore.moves(['盾突き','槍柄打ち','槍突き','ロングランス突き','ハンマーアッパー','盾払い','盾タックル','ハンマー地面叩き','クロスボウ3連射','聖水・前後炎柱','シールドターン','槍の横突き','逆手の短剣','クロスボウ上射','ハンマー急降下'],{
  dragon:m('槍投げ・短剣連射',9,[],80,0,{...opt,arthurVolley:true,projectile:true,pose:31,damage:8,gravityMultiplier:.8}),
  dash:m('鉄球',12,[],70,0,{...opt,arthurBall:true,projectile:true,pose:34,damage:12,gravityMultiplier:.8}),
  rise:m('二段ジャンプ・サンダーストーム',6,[],95,14,{...opt,tether:false,arthurJump:true,pose:37,damage:5,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:9}),
  gale:m('アーマーメンド',12,[],180,0,{...opt,arthurMend:true,pose:40,damage:0,gravityMultiplier:.9}),
  airDrop:m('空中アーマーメンド',12,[],180,12,{...opt,arthurMend:true,pose:40,damage:0,aerial:true,gravityMultiplier:.9})
 },'sword',125),p={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const w of a[k].activeFrames)w.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=25;a.air.activeFrames[0].shape='front';
 for(const k of['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair','rise'])a[k].authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:0,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function arthurArmor(f){return f.arthurArmor??1;}
function arthurDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function arthurGate(f,type){if(['gale','airDrop'].includes(type))return arthurArmor(f)<2;if(type==='dash')return !ArthurRules.objects.some(q=>q.owner===f.id&&q.kind==='ball'&&!q.dead);return !(['dragon'].includes(type)&&ArthurRules.objects.filter(q=>q.owner===f.id&&!q.dead).length>=6);}
function arthurLand(){return false;}
function arthurLeap(f,a,t,i,second=false){a.phase=second?'second':'first';a.jumpAt=t;a.pose=second?39:37;a.direction=Math.abs(i.x)>.2?Math.sign(i.x):a.originFace;f.grounded=false;f.recovered=true;f.vx=a.direction*(second?8:5);f.vy=second?-16:-14;a.activeFrames.push(CombatData.window(t,t+5,'up',{pose:a.pose,index:second?1:0,damage:second?7:5,angle:-1.22,meleeCoverage:true}));a.activeStart=a.activeFrames[0].start;a.activeEnd=t+5;a.motionLastEvent=a.motionCommitEnd=t+23;arthurDuration(f,a,t+36);}
const ArthurRules=NewcomerCore.create('arthur',ArthurMoves,{
 reset(){for(const f of fighters)if(f.characterId==='arthur'){f.arthurArmor=1;f.arthurWear=0;f.arthurLastDamage=f.damage;f.arthurArmorFlash=0;}},
 status(f){if(f.respawn){f.arthurArmor=1;f.arthurWear=0;f.arthurLastDamage=f.damage;}const delta=Math.max(0,f.damage-(f.arthurLastDamage??f.damage));f.arthurLastDamage=f.damage;
  if(delta>0&&arthurArmor(f)>0){f.arthurWear=(f.arthurWear||0)+delta;if(f.arthurWear>=(arthurArmor(f)===2?20:14)){f.arthurArmor--;f.arthurWear=0;f.arthurArmorFlash=18;}}
  if(f.arthurArmorFlash>0)f.arthurArmorFlash--;const weight=[80,94,108][arthurArmor(f)];if(f.character.weight!==weight)f.character={...f.character,weight};
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.gold=arthurArmor(f)===2;if(a.gold&&!a.special){a.damage*=1.15;for(const w of a.activeFrames)if(w.damage)w.damage*=1.15;}
  if(a.special){a.motionLastEvent=a.motionCommitEnd=a.totalFrames-10;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];}if(a.arthurJump)a.phase='start';if(a.arthurMend){a.fromArmor=arthurArmor(f);a.repairAt=a.fromArmor===0?60:100;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld),pressed=held&&!a.specialWas;a.specialWas=held;
  if(a.arthurVolley&&!a.released){if(t>=9&&(!held||t>=40)){a.released=t;a.daggers=t>=23;a.pose=33;const dirs=a.daggers?[-.25,0,.25]:[0];for(const angle of dirs)r.spawn(f,{kind:a.daggers?'dagger':'lance',fx:a.daggers?3:a.gold?10:2,x:f.x+a.originFace*40,y:f.y-44,vx:a.originFace*Math.cos(angle)*(a.gold?15:12),vy:Math.sin(angle)*12,life:65,radius:a.daggers?10:13,damage:(a.daggers?5:9)*(a.gold?1.35:1),base:3.8,growth:.07,gold:a.gold});a.motionLastEvent=a.motionCommitEnd=t;arthurDuration(f,a,t+23);}else if(t>=18)a.pose=32;}
  if(a.arthurBall&&!a.released&&t>=12&&(!held||t>=28)){a.released=t;a.pose=35;r.spawn(f,{kind:'ball',fx:4,x:f.x+a.originFace*42,y:f.y-38,vx:a.originFace*(t>=24?10:7),vy:-3,life:140,radius:19,damage:a.gold?16:12,base:4.6,growth:.085,bounces:0,gold:a.gold});a.motionLastEvent=a.motionCommitEnd=t;arthurDuration(f,a,t+27);}
  if(a.arthurMend&&!a.released){f.vx*=.65;a.pose=40;if(t>=a.repairAt){f.arthurArmor=Math.min(2,a.fromArmor+1);f.arthurWear=0;a.released=t;a.pose=41;a.motionLastEvent=a.motionCommitEnd=t;arthurDuration(f,a,t+22);}else if(t>=18&&!held){a.released=t;a.motionLastEvent=a.motionCommitEnd=t;arthurDuration(f,a,t+17);}}
  if(a.arthurJump){f.fastFall=false;if(a.phase==='start'){f.vx*=.4;f.vy=0;if(t>=6){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.phase='escape';arthurDuration(f,a,t+140);}else arthurLeap(f,a,t,i);}}
   if(a.phase==='escape'){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)arthurLeap(f,a,t,i);return;}
   if(['first','second'].includes(a.phase)){const d=t-a.jumpAt;a.gravityMultiplier=1;a.airControlMultiplier=.7;f.vx+=(i.x||0)*.25;f.vx=clamp(f.vx,-8,8);
    if(pressed&&d>=1&&d<=21){if(f.buffer?.key==='special')f.buffer=null;if(a.phase==='first')a.next=true;else if(a.gold)a.thunder=true;}
    if(a.phase==='first'&&a.next&&d>=7)arthurLeap(f,a,t,i,true);
    else if(a.phase==='second'&&a.thunder&&d>=7){a.phase='thunder';a.jumpAt=t;a.pose=39;r.spawn(f,{kind:'thunder',fx:9,x:f.x,y:f.y-80,vx:0,vy:0,life:12,radius:54,damage:16,base:5,growth:.09});f.vy=-9;a.motionLastEvent=a.motionCommitEnd=t;arthurDuration(f,a,t+16);}
    else if(d>=22){a.phase='exit';a.pose=60;a.motionLastEvent=a.motionCommitEnd=t;arthurDuration(f,a,t+6);}
   }if(a.phase==='thunder')a.pose=t-a.jumpAt<7?39:60;
  }
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 projectile(q,f){if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1400){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;
  if(q.kind==='ball'){q.vy+=.45;q.x+=q.vx;q.y+=q.vy;const floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY+q.radius<=p.y+3&&q.y+q.radius>=p.y);if(floor){q.y=floor.y-q.radius;q.vy=q.bounces===0?-5:0;q.bounces++;}const wall=platforms.find(p=>p.main&&StageGeometry.overlaps(p,q.x,q.y,q.radius,q.radius*2)&&q.previousY>p.y);if(wall){if(q.reflected){q.dead=true;return true;}q.reflected=true;q.vx*=-1;q.x=q.previousX;q.hits.clear();}}
  else{q.x+=q.vx;q.y+=q.vy;const p=platforms.find(p=>p.main);if(q.kind!=='thunder'&&StageGeometry.overlaps(p,q.x,q.y,q.radius,q.radius*2)){q.dead=true;return true;}}
  const box=q.kind==='thunder'?{x1:q.x,y1:q.y+60,x2:q.x,y2:q.y-100,radius:q.radius}:{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(box,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,box);if(touch||shield){q.hits.add(target.id);CombatSystem.hit(f,target,{...ArthurMoves.dragon,type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:Math.sign(q.vx)||q.face,angle:q.kind==='thunder'?-1.4:-.8,baseKnockback:q.base,knockbackGrowth:q.growth},box,touch);if(['lance','dagger'].includes(q.kind))q.dead=true;}}return true;
 },
 boxes(f,a,w){if(a.arthurVolley||a.arthurBall||a.arthurMend)return[];const reach=({jab:90,jab2:113,jab3:147,heavy:174,low:104,dashAttack:123,smash:127,fair:165,bair:124})[a.type]||126;let p=w.shape==='up'?[0,-35,0,-142]:w.shape==='back'?[0,-44,-reach,-44]:w.shape==='low'?[0,-16,reach,-16]:w.shape==='down'?[7,-20,39,66]:[0,-44,reach,-44];
  if(a.type==='air')p=CombatData.sample(a,f.timer).pose===62?[0,-45,85,-65]:[0,-45,96,-36];if(a.type==='downsmash')p=w.index===1?[0,-12,-116,-12]:[0,-12,116,-12];if(a.arthurJump)p=[0,-34,22,-119];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:['up','down'].includes(w.shape)?27:22,window:w,modifiers:w}];
 },
 hurtboxes(f){const n=arthurBasePose(f),low=[11,13,21,22,25,40,43,44,45,51,53,56,57].includes(n);return[{part:'head',x:f.x,y:f.y-(low?38:75),r:18},{part:'torso',x:f.x,y:f.y-(low?26:45),r:22},{part:'legs',x:f.x,y:f.y-12,r:17}];},
 cpu(f,o,i){const a=f.attack;if(a?.arthurVolley)i.specialHeld=Math.abs(o.x-f.x)>200&&f.timer<27;if(a?.arthurBall)i.specialHeld=f.timer<15;if(a?.arthurMend)i.specialHeld=Math.abs(o.x-f.x)>170;if(a?.arthurJump){i.x=Math.sign(720-f.x);i.specialHeld=i.special=f.timer>=17&&f.timer<=19;}}
});
function arthurBasePose(f){if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;}
function arthurPose(f){const n=arthurBasePose(f);return arthurArmor(f)===0?(n===62?124:n+63):n;}
MoveMotion.define('arthur',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:['air','fair','bair','uair','dair'].includes(k)?14:0,strike:k==='air'?[26,62]:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));
