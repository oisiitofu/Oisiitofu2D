'use strict';
const KyMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword',tether:true};
 const a=NewcomerCore.moves(['5P・パンチ','5K・キック','近S・斬り','遠S','6P・肘','2K・ローキック','スタンディッパー','ディルエクラ','ヴェイパースラスト','2D・前後斬り','空中回転斬り','j.S・前方斬り','j.H・後方斬り','雷の斬り上げ','フードルアーク'],{
  dragon:m('スタンエッジ',8,[],65,0,{...opt,kyEdge:true,pose:51,damage:9,projectile:true,rangedInterval:30}),
  dash:m('ライトニングストライク',9,[],28,8,{...opt,kyStrike:true,pose:48,damage:11,gravityMultiplier:.35,airControlMultiplier:0}),
  rise:m('ライド・ザ・ライトニング',7,[w(7,15,'up',{pose:33,damage:7,index:0})],53,15,{...opt,tether:false,kyRide:true,pose:33,damage:7,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:16}),
  gale:m('ドラゴンインストール',14,[],27,0,{...opt,kyInstall:true,pose:43,damage:0,gravityMultiplier:.65}),
  airDrop:m('空中ドラゴンインストール',14,[],27,8,{...opt,kyInstall:true,pose:43,damage:0,aerial:true,gravityMultiplier:.65})
 },'sword',135),p={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:37,getupAttack:37,forwardThrow:19,backThrow:14,upThrow:8,downThrow:11};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=46;a.downsmash.activeFrames[1].shape='front';
 for(const key of['jab','jab2','up','low','dashAttack'])a[key].soundFamily='punch';
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function kyTension(f){return clamp(f.kyTension||0,0,100);}
function kyGate(f,type){if(['gale','airDrop'].includes(type))return kyTension(f)>=50&&!(f.kyInstallTime>0);return !(type==='dragon'&&KyRules.objects.some(q=>q.owner===f.id&&q.kind==='edge'&&!q.dead));}
function kyDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function kyLand(f){const a=f.attack;if(!(a?.kyEdge&&!a.fired||a?.kyStrike&&f.timer<=17))return false;Object.assign(f,{mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial,airJumps:f.character.airJumpCount,jumps:0,airDodged:false,ledgeGrabs:0,recovered:false,helpless:false,fastFall:false,gravityOff:false,specialLandingLag:0,landingLag:0});return true;}
function kyLaunch(f,a,t,i){a.launchAt=t;a.rideFace=Math.abs(i.x)>.2?Math.sign(i.x):a.originFace;f.face=a.rideFace;f.grounded=false;f.recovered=true;const boost=a.kyBoost?1.2:1;a.activeFrames=[CombatData.window(t,t+8,'up',{pose:33,damage:7*boost,index:0}),CombatData.window(t+14,t+23,'front',{pose:42,damage:9*boost,index:1,angle:-1.05,baseKnockback:4.8,knockbackGrowth:.075})];a.activeStart=t;a.activeEnd=t+23;a.motionLastEvent=a.activeEnd;kyDuration(f,a,t+62);}
const KyRules=NewcomerCore.create('ky',KyMoves,{
 reset(){for(const f of fighters){Object.assign(f,{kyShockTime:0,kyShockOwner:-1,kyShockTick:-1});if(f.characterId==='ky')Object.assign(f,{kyTension:0,kySeenDamage:f.damage,kyLastX:f.x,kyInstallTime:0});}},
 status(f){for(const o of fighters)if(o.kyShockTick!==frame){o.kyShockTick=frame;if(o.respawn)o.kyShockTime=0;else if(o.kyShockTime>0)o.kyShockTime--;}
  if(f.respawn){Object.assign(f,{kyTension:0,kySeenDamage:f.damage,kyLastX:f.x,kyInstallTime:0});}
  else{if(f.kyInstallTime>0)f.kyInstallTime--;let gain=Math.max(0,f.damage-(f.kySeenDamage??f.damage))*.6;const o=BattlePlayers.target(f),dx=f.x-(f.kyLastX??f.x);if(o&&!f.hitlag&&!f.hitstun&&f.grounded&&Math.sign(dx)===Math.sign(o.x-f.x))gain+=Math.min(8,Math.abs(dx))*.03;f.kyTension=clamp(kyTension(f)+gain,0,100);f.kySeenDamage=f.damage;f.kyLastX=f.x;}
  const base=CharacterData.ky,m=f.kyInstallTime>0?1.12:1;for(const key of['walkSpeed','runSpeed','initialDashSpeed','airSpeed','airAcceleration'])f.character[key]=base[key]*m;
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));a.kyBoost=f.kyInstallTime>0;a.kyElectric=a.kyBoost||['smash','upsmash','rise','dash'].includes(a.type);a.kyApplyShock=!!a.kyStrike;
  if(a.kyBoost&&!a.kyInstall){a.damage*=1.2;for(const w of a.activeFrames)if(w.damage!==undefined)w.damage*=1.2;}
  if(a.kyEdge)a.motionLastEvent=a.motionCommitEnd=53;
  if(a.kyStrike){a.anchorId=KyRules.objects.find(q=>q.owner===f.id&&q.kind==='edge'&&!q.dead&&Math.hypot(q.x-f.x,q.y-(f.y-44))<=480)?.id;a.motionLastEvent=a.motionCommitEnd=17;}
  if(a.kyRide)a.motionLastEvent=42;
  if(a.kyInstall){f.kyTension=kyTension(f)-50;a.motionLastEvent=a.motionCommitEnd=14;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);if(a.type==='downsmash')f.face=t>=a.activeFrames[1].start&&t<=a.activeEnd?-a.originFace:a.originFace;
  if(a.kyEdge){f.vx*=.6;if(!a.releaseAt&&t>=8&&(!held||t>=48)){a.releaseAt=t;a.charged=t>=24;a.pose=a.charged?52:40;a.fireAt=t+5;a.motionLastEvent=a.motionCommitEnd=a.fireAt;kyDuration(f,a,a.fireAt+20);}if(a.releaseAt)a.pose=a.charged?52:40;if(!a.fired&&a.fireAt&&t>=a.fireAt){a.fired=true;const boost=a.kyBoost?1.2:1;r.spawn(f,{kind:'edge',x:f.x+f.face*48,y:f.y-44,vx:f.face*(a.charged?6.5:8),vy:f.grounded?0:1.1,life:a.charged?90:70,radius:a.charged?30:20,damage:(a.charged?15:9)*boost,charged:a.charged,sourceType:'dragon'});}}
  if(a.kyStrike){f.vx*=.4;f.fastFall=false;if(t<9)f.vy*=.4;if(!a.decided&&t>=9){a.decided=true;const q=r.objects.find(q=>q.id===a.anchorId&&q.owner===f.id&&!q.dead),p=platforms.find(p=>p.main);let x=q?.x,y=q?q.y+44:0;const solid=q&&x>p.x&&x<p.x+p.w&&y>p.y&&y-f.character.ecb.height<p.y+90;
    if(q&&!solid&&Math.hypot(q.x-f.x,q.y-(f.y-44))<=480){a.warped=true;const ox=f.x,oy=f.y;f.x=x;f.y=y;f.grounded=false;f.vx=f.vy=0;q.dead=true;a.pose=48;a.activeFrames=[CombatData.window(12,17,'front',{pose:48,damage:11*(a.kyBoost?1.2:1),index:0})];a.activeStart=12;a.activeEnd=17;r.spawn(f,{kind:'trace',x:ox,y:oy-44,toX:x,toY:y-44,vx:0,vy:0,life:12,damage:0});}
    else{a.motionLastEvent=a.motionCommitEnd=12;}}
   if(!a.warped&&!a.bolted&&t>=12){a.bolted=true;r.spawn(f,{kind:'bolt',x:f.x+a.originFace*125,y:f.y-45,vx:0,vy:0,life:13,radius:a.kyBoost?53:43,damage:12*(a.kyBoost?1.2:1),sourceType:'dash'});}
  }
  if(a.kyRide){f.fastFall=false;if(t<7){f.vx*=.4;f.vy=0;return;}if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];kyDuration(f,a,t+110);}else kyLaunch(f,a,t,i);}if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)kyLaunch(f,a,t,i);return;}const dt=t-a.launchAt;
   if(dt<14){a.pose=33;f.vx=a.rideFace*(4+dt*.35);f.vy=-15+dt*.45;}else if(dt<26){a.pose=42;f.vx=a.rideFace*(8-(dt-14)*.28);f.vy=-8+(dt-14)*.45;}else if(dt<33){a.pose=49;f.vx=a.rideFace*(4-(dt-26)*.35);f.vy=-3+(dt-26)*.7;}else{a.pose=35;a.gravityMultiplier=1;f.vx*=.97;}}
  if(a.kyInstall){f.vx*=.6;if(t>=14&&!a.installed){a.installed=true;f.kyInstallTime=600;a.pose=50;r.spawn(f,{kind:'install',x:f.x,y:f.y-44,vx:0,vy:0,life:25,damage:0});}}
 },
 onHit(f,o,hit,r){f.kyTension=clamp(kyTension(f)+Math.min(14,(hit.damage||5)*.9),0,100);if(!hit.kyElectric&&!hit.kyApplyShock)return;
  if(o.kyShockTime>0&&o.kyShockOwner===f.id){o.kyShockTime=0;o.kyShockOwner=-1;o.damage=Math.min(999,o.damage+2);f.stats.damage+=2;const estimate=CombatSystem.calculateKnockback(hit,o.damage,o.character.weight,f.damage,(hit.damage||0)*1.2);hit.throwHitstun=Math.max(hit.throwHitstun||0,Math.floor(estimate*.4)+8);r.spawn(f,{kind:'shock',x:o.x,y:o.y-45,vx:0,vy:0,life:18,damage:0});}
  else if(hit.kyApplyShock){o.kyShockTime=210;o.kyShockOwner=f.id;}
 },
 projectile(q,f){if(f.respawn||q.age>=q.life||q.y>1300||q.x<-900||q.x>2340){q.dead=true;return true;}if(!['edge','bolt'].includes(q.kind))return true;q.previousX=q.x;q.previousY=q.y;if(q.kind==='edge'){q.x+=q.vx;q.y+=q.vy;}const b={x1:q.kind==='edge'?q.previousX:q.x,y1:q.kind==='edge'?q.previousY:q.y-35,x2:q.x,y2:q.kind==='edge'?q.y:q.y+20,radius:q.radius};
  for(const o of BattlePlayers.targets(f)){if(q.hits.has(o.id)||CombatSystem.protection(o).intangible)continue;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);CombatSystem.hit(f,o,{...KyMoves.dragon,type:q.sourceType,sourceType:q.sourceType,projectile:true,kyElectric:true,kyApplyShock:true,charge:0,damage:q.damage,launchDirection:q.face,angle:-.85,staleMultiplier:q.stale},b,touch);if(q.kind==='edge')q.dead=true;}}
  return true;
 },
 boxes(f,a,w){if(a.kyEdge||a.kyInstall)return[];const s=w.shape,reach=({jab:79,jab2:101,jab3:135,heavy:150,low:104,dashAttack:128,smash:165,fair:145,bair:140,dash:144})[a.type]||126;if(a.kyRide&&w.index===1)return[{x1:f.x,y1:f.y-44,x2:f.x+a.rideFace*145,y2:f.y-104,radius:27,window:w,modifiers:w}];const p=s==='up'?[0,-34,0,a.type==='up'?-113:-130]:s==='down'?[0,-34,14,42]:s==='back'?[0,-45,-reach,-45]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-65,-45,65,-45]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?30:s==='spin'?27:19,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,15,22,32,36,46].includes(kyPose(f));return[{part:'head',x:f.x,y:f.y-(low?40:82),r:14},{part:'torso',x:f.x,y:f.y-(low?22:49),r:18},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 cpu(f,o,i,clear){if(f.attack?.kyEdge){i.specialHeld=f.timer<30;return;}if(!f.attack&&f.grounded&&kyTension(f)>=50&&!f.kyInstallTime&&Math.abs(o.x-f.x)>190){clear();i.x=0;i.y=1;i.special=true;}}
});
function kyPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:34,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('ky',{jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},heavy:{windup:3,strike:[41],recovery:0},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46],recovery:3},air:{windup:34,strike:[10],recovery:5},fair:{windup:34,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:34,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}});
