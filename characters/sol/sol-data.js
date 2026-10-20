'use strict';
const SolMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'fire',tether:true};
 const a=NewcomerCore.moves(['ジャブ','肘打ち','ボディブロー','強パンチ','対空パンチ','下段キック','ナイトレイド','ファフニール','大剣打ち上げ','前後薙ぎ','空中膝蹴り','空中大剣斬り','空中返し刃','アッパーキック','ヒールスタンプ'],{
  dragon:m('ガンフレイム',18,[],20,0,{...opt,solFlame:true,pose:40,damage:10,projectile:true,rangedInterval:34}),
  dash:m('バンディットリヴォルヴァー',10,[w(10,14,'front',{pose:34,damage:7,index:0}),w(23,28,'front',{pose:47,damage:10,index:1,angle:-.7})],19,10,{...opt,solBandit:true,pose:34,damage:7,gravityMultiplier:0,airControlMultiplier:0}),
  rise:m('ヴォルカニックヴァイパー',7,[w(7,17,'up',{pose:42,damage:11,index:0})],39,16,{...opt,tether:false,solViper:true,pose:42,damage:11,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:17}),
  gale:m('ロマンキャンセル',1,[],7,0,{...opt,solCancel:true,pose:43,damage:0,gravityMultiplier:.2}),
  airDrop:m('空中ロマンキャンセル',1,[],7,0,{...opt,solCancel:true,pose:43,damage:0,aerial:true,gravityMultiplier:.2})
 },'punch',125),poses={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:37,getupAttack:37,forwardThrow:19,backThrow:14,upThrow:8,downThrow:11};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;
 a.downsmash.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function solTension(f){return clamp(f.solTension||0,0,100);}
function solGate(f,type){if(['gale','airDrop'].includes(type))return solTension(f)>=50;return !(type==='dragon'&&SolRules.objects.some(q=>q.owner===f.id&&q.kind==='flame'&&!q.dead));}
function solDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
// This is a paid offensive cancel, never an escape from incoming hitstun or a
// pending launch. Own attack hitlag can be cancelled; enemy knockback cannot.
function solCancelInput(f,i){if(!i.special||i.y<.5||solTension(f)<50||f.attack?.solCancel||f.respawn||f.hitstun||f.pendingLaunch||f.tumbling||f.grabbed||f.grabOwner||f.ledge||f.zidaneSilenced>0)return;
 const busy=f.attack||f.helpless||f.recovered||['AerialLanding','SpecialLanding'].includes(f.mode);if(!busy)return;
 f.hitlag=0;f.frozen=null;f.attack=null;f.buffer=null;f.recovered=f.helpless=false;attack(f,'gale');i.special=false;
}
const SolRules=NewcomerCore.create('sol',SolMoves,{
 reset(){for(const f of fighters){f.solSlowUntil=0;if(f.characterId==='sol')Object.assign(f,{solTension:0,solSeenDamage:f.damage,solLastX:f.x});}},
 status(f){if(f.respawn){Object.assign(f,{solTension:0,solSeenDamage:f.damage,solLastX:f.x});return;}const damage=Math.max(0,f.damage-(f.solSeenDamage??f.damage));f.solSeenDamage=f.damage;let gain=damage*.7;
  const o=BattlePlayers.target(f),dx=f.x-(f.solLastX??f.x);if(o&&!f.hitlag&&!f.hitstun&&!f.tumbling&&f.grounded&&Math.sign(dx)===Math.sign(o.x-f.x))gain+=Math.min(Math.abs(dx),8)*.025;
  f.solLastX=f.x;f.solTension=clamp(solTension(f)+gain,0,100);
 },
 prepare(f,a,r){a.activeFrames=a.activeFrames.map(v=>({...v}));
  if(a.solCancel){f.solTension=solTension(f)-50;f.vx*=.25;f.vy*=.25;f.fastFall=false;f.recovered=f.helpless=false;r.spawn(f,{kind:'roman',x:f.x,y:f.y-45,vx:0,vy:0,life:18,radius:145,damage:0});for(const o of BattlePlayers.targets(f))if(!o.respawn&&Math.hypot(o.x-f.x,o.y-f.y)<190)o.solSlowUntil=Math.max(o.solSlowUntil||0,frame+40);}
  if(a.solFlame)a.motionLastEvent=18;
  if(a.solBandit){a.motionLastEvent=28;a.decideAt=8;}
  if(a.solViper){a.followUntil=31;a.motionLastEvent=31;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld),pressed=held&&!a.specialWas;a.specialWas=held;
  if(a.solFlame){if(!a.fired&&t>=18){a.fired=true;a.feint=held;if(!held)r.spawn(f,{kind:'flame',x:f.x+f.face*50,y:f.y-34,vx:f.face*6,vy:0,radius:28,damage:10,life:42,airborne:!f.grounded});else r.spawn(f,{kind:'feint',x:f.x+f.face*45,y:f.y-15,vx:f.face,vy:0,life:16,damage:0});solDuration(f,a,t+(held?8:18));}f.vx=moveToward(f.vx,0,.7);}
  if(a.solBandit){f.fastFall=false;if(t===a.decideAt&&held){a.bringer=true;a.activeFrames=[CombatData.window(24,31,'front',{pose:48,damage:16,index:0,angle:-.9,baseKnockback:5,knockbackGrowth:.08})];a.activeEnd=31;a.motionLastEvent=31;solDuration(f,a,52);}
   if(t<8){f.vx*=.3;f.vy=0;return;}f.grounded=false;
   if(a.bringer){a.pose=t<21?4:48;a.gravityMultiplier=t<32?0:1;if(t<21){f.vx=a.originFace*3.8;f.vy=-9+(t-8)*.25;}else if(t<32){f.vx=a.originFace*6;f.vy=8;}else f.vx*=.94;}
   else{a.pose=t<21?34:t<32?47:5;a.gravityMultiplier=t<32?0:1;f.vx=t<30?a.originFace*(t<18?6:4):f.vx*.94;if(t<30)f.vy=t<18?-3.2:1.8;}
  }
  if(a.solViper){f.fastFall=false;if(t<7){f.vx*=.4;f.vy=0;return;}if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];solDuration(f,a,t+110);}else{a.launchAt=t;a.launchX=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.grounded=false;f.recovered=true;a.activeFrames=[CombatData.window(t,t+10,'up',{pose:42,damage:11,index:0})];solDuration(f,a,t+48);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);return;}const dt=t-a.launchAt;
   if(!a.sideAt&&dt>=13&&dt<=25&&pressed){a.sideAt=t;a.sideFace=Math.abs(i.x)>.2?Math.sign(i.x):a.launchX;f.face=a.sideFace;a.activeFrames.push(CombatData.window(t+3,t+8,'front',{pose:49,damage:14,index:1,baseKnockback:5.6,knockbackGrowth:.085,angle:-.65}));a.activeEnd=t+8;a.motionLastEvent=a.activeEnd;solDuration(f,a,t+32);}
   if(a.sideAt){const d=t-a.sideAt;a.pose=d<11?49:35;a.gravityMultiplier=d<11?0:1;if(d<11){f.vx=a.sideFace*9;f.vy=-1;}else f.vx*=.97;}
   else if(dt<19){a.pose=42;a.gravityMultiplier=0;f.vx=a.launchX*3.7;f.vy=-16+dt*.43;}
   else{a.pose=35;a.gravityMultiplier=1;f.vx*=.98;}
  }
 },
 onHit(f,o,a){f.solTension=clamp(solTension(f)+Math.min(14,(a.damage||5)*.85),0,100);},
 projectile(q,f,o,r){if(q.kind!=='flame'){q.x+=q.vx||0;q.y+=q.vy||0;if(q.age>=q.life)q.dead=true;return true;}
  const main=platforms.find(p=>p.main);q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;
  if(!q.airborne&&q.x>=main.x&&q.x<=main.x+main.w)q.y=main.y-34;else{q.airborne=true;q.vy+=.3;q.y+=q.vy;}
  if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1200){q.dead=true;return true;}
  const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))if(!q.hits.has(target.id)&&!CombatSystem.protection(target).intangible){const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(touch||shield){q.hits.add(target.id);CombatSystem.hit(f,target,{...SolMoves.dragon,type:'dragon',projectile:true,sourceType:'dragon',charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:-.9},b,touch);q.dead=true;break;}}return true;
 },
 boxes(f,a,w){if(a.solFlame||a.solCancel)return[];const s=w.shape,reach=({jab:76,jab2:80,jab3:78,heavy:106,low:98,dashAttack:110,smash:158,fair:136,bair:141,dash:a.bringer?132:128,rise:a.sideAt?142:115})[a.type]||116;
  const p=s==='up'?[0,-35,0,-142]:s==='down'?[0,-35,12,44]:s==='back'?[0,-53,-reach,-53]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-52,-47,65,-47]:[0,-50,reach,-50];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?32:s==='spin'?27:22,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[3,11,22,32,36,46].includes(solPose(f));return[{part:'head',x:f.x,y:f.y-(low?45:94),r:17},{part:'torso',x:f.x,y:f.y-(low?27:57),r:23},{part:'legs',x:f.x,y:f.y-14,r:17}];},
 cpu(f,o,i,clear){if(f.attack?.solViper&&f.timer-f.attack.launchAt>=16){i.special=true;i.specialHeld=true;i.x=Math.sign(720-f.x);return;}if(f.attack?.solBandit){i.specialHeld=false;return;}if(solTension(f)>=50&&f.attack&&!f.attack.solCancel&&f.timer>20&&Math.abs(o.x-f.x)<170&&frame%7===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
SolRules.slowSkip=function(f,i){return frame<(f.solSlowUntil||0)&&frame%2===0&&!f.respawn&&!f.hitlag&&!f.hitstun&&!f.pendingLaunch&&!f.tumbling&&!f.ledge&&!f.grabbed&&!f.grabOwner&&!i.guard&&!CombatSystem.protection(f).intangible&&!CombatSystem.protection(f).invincible;};
function solPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:4,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('sol',{jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},heavy:{windup:3,strike:[41],recovery:0},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46,14],recovery:3},air:{windup:4,strike:[10],recovery:5},fair:{windup:4,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:4,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}});
