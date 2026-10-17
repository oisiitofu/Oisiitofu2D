'use strict';
const MaleniaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['横斬り','逆袈裟斬り','連続斬り','横薙ぎ斬り','払い上げ斬り','回し蹴り','駆け抜け斬り','渾身の突き','跳び上げ斬り','両側薙ぎ斬り','回転斬り','突進斬り','回し蹴り','薙ぎ上げ斬り','水鳥の斬撃'],{
  dragon:m('連続斬り',7,[w(7,9,'front',{pose:40,damage:3}),w(12,14,'front',{pose:41,damage:3}),w(17,19,'front',{pose:40,damage:3}),w(27,30,'front',{pose:42,damage:7})],8,0,{...opt,maleniaCombo:true,pose:40,damage:3,reach:145}),
  dash:m('ブレードステップ',12,[w(16,20,'front',{pose:44,damage:11})],16,0,{...opt,maleniaStep:true,pose:43,damage:11,reach:145}),
  rise:m('水鳥の舞',12,[w(14,17,'spin',{pose:46,damage:4}),w(24,27,'spin',{pose:46,damage:4}),w(34,38,'up',{pose:46,damage:7})],14,14,{...opt,maleniaWaterfowl:true,pose:45,damage:4,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:14}),
  gale:m('腐敗の女神',24,[w(24,27,'spin',{pose:47,damage:6})],10,0,{...opt,maleniaTransform:true,pose:47,damage:6}),
  airDrop:m('空中・腐敗の女神',24,[w(24,27,'spin',{pose:47,damage:6})],10,12,{...opt,maleniaTransform:true,aerial:true,pose:47,damage:6}),
  aeoniaImpact:m('エオニア・開花',1,[],24,0,{...opt,maleniaBloom:true,maleniaAeoniaImpact:true,pose:68,damage:11})
 },'sword',155),poses={jab:6,jab2:7,jab3:9,heavy:9,up:8,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=v.shape==='back'&&['downsmash','getupAttack'].includes(k)?14:n;}
 a.grab.newcomerHit=false;for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;
})();
const MaleniaRotMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword',maleniaRot:true};const variants={
 dragon:m('緋のエオニア',12,[],88,18,{...opt,maleniaAeonia:true,landingMove:'aeoniaImpact',pose:66,damage:11,gravityMultiplier:0,airControlMultiplier:.2}),
 dash:m('緋の分身',12,[w(32,36,'front',{pose:42,damage:10})],12,0,{...opt,maleniaPhantoms:true,pose:43,damage:10}),
 rise:m('翼の水鳥の舞',10,[w(12,16,'spin',{pose:46,damage:4}),w(22,26,'spin',{pose:46,damage:4}),w(32,37,'up',{pose:46,damage:7})],16,14,{...opt,maleniaWaterfowl:true,pose:45,damage:4,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12}),
 gale:m('腐敗の花園',20,[],14,0,{...opt,maleniaBloom:true,pose:47,damage:8}),
 airDrop:m('空中・腐敗の花園',20,[],14,12,{...opt,maleniaBloom:true,aerial:true,pose:47,damage:8})
 };for(const a of Object.values(variants))a.animation={...a.animation,anticipationPose:a.pose,accelerationPose:a.pose,recoveryPose:a.pose,lean:0,lunge:0,impactScale:1};for(const k of Object.keys(MaleniaMoves))if(!(k in variants))Object.defineProperty(variants,k,{enumerable:true,get:()=>MaleniaMoves[k]});return variants;})();
function maleniaRot(f){return(f.maleniaRotTime||0)>0;}
const MaleniaRotMeleeMoves={...MaleniaRotMoves,dash:MaleniaMoves.dash};
function maleniaMovesFor(f){return maleniaRot(f)?f.maleniaSideCooldown>0?MaleniaRotMeleeMoves:MaleniaRotMoves:MaleniaMoves;}
function maleniaFlip(f,n){return n===14;}
function maleniaImagePose(f,n){if(n>=48||!(maleniaRot(f)||f.attack?.maleniaRot))return n;return n>=18&&n<=23?96+n-18:n+48;}
function maleniaGate(f,type){return !(type==='dragon'&&f.maleniaAeoniaCooldown>0&&maleniaRot(f)||type==='dash'&&!f.grounded&&f.maleniaSideAirUsed||['gale','airDrop'].includes(type)&&(maleniaRot(f)?f.maleniaBloomCooldown>0:f.maleniaRotCooldown>0));}
function maleniaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;}
function maleniaCliffStop(f){if(!f.grounded)return;const p=platforms.find(p=>f.x>=p.x-3&&f.x<=p.x+p.w+3&&Math.abs(f.y-p.y)<3);if(p)f.vx=clamp(f.vx,p.x+2-f.x,p.x+p.w-2-f.x);}
function maleniaBloom(f,a,r,damage,field=true){if(a.bloomed)return;a.bloomed=true;r.spawn(f,{kind:'bloom',x:f.x,y:f.y-22,vx:0,vy:0,radius:a.maleniaAeoniaImpact?76:65,damage,life:15});if(field)r.spawn(f,{kind:'rotField',x:f.x,y:f.y-15,vx:0,vy:0,radius:70,damage:2,life:90});}
function maleniaWaterfowlBegin(f,a,i,t){a.waterAt=t;a.waterFace=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.waterFace;f.grounded=false;f.recovered=true;f.fastFall=false;a.activeFrames=[2,12,22].map((n,k)=>CombatData.window(t+n,t+n+(k===2?4:3),k===2?'up':'spin',{pose:46,damage:k===2?7:4}));maleniaDuration(f,a,t+42);}
const MaleniaRules=NewcomerCore.create('malenia',MaleniaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='malenia')Object.assign(f,{maleniaRotTime:0,maleniaRotCooldown:0,maleniaBloomCooldown:0,maleniaSideCooldown:0,maleniaAeoniaCooldown:0,maleniaSideAirUsed:false,maleniaHealFlash:0});},
 status(f){for(const k of['maleniaRotTime','maleniaRotCooldown','maleniaBloomCooldown','maleniaSideCooldown','maleniaAeoniaCooldown','maleniaHealFlash'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);if(f.grounded||f.ledge||f.respawn)f.maleniaSideAirUsed=false;},
 prepare(f,a,r){a.activeFrames=a.activeFrames.map(w=>({...w}));a.maleniaRot=!!(a.maleniaRot||maleniaRot(f)||a.maleniaAeoniaImpact);a.maleniaHealed=0;
  if(a.maleniaCombo)a.motionLastEvent=30;
  if(a.maleniaStep||a.maleniaPhantoms){if(a.maleniaPhantoms)f.maleniaSideCooldown=110;if(!f.grounded)f.maleniaSideAirUsed=true;a.motionLastEvent=a.maleniaPhantoms?36:20;}
  if(a.maleniaBloom){f.maleniaBloomCooldown=135;a.motionLastEvent=a.maleniaAeoniaImpact?18:20;if(a.maleniaAeoniaImpact)maleniaBloom(f,a,r,11);}
  if(a.maleniaAeonia){f.maleniaAeoniaCooldown=150;a.motionLastEvent=90;}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.maleniaCombo){a.pose=t<12?40:t<17?41:t<27?40:42;f.vx=CombatData.activeWindow(a,t)?f.face*1.8:moveToward(f.vx,0,.7);maleniaCliffStop(f);}
  if(a.maleniaStep){
   if(t===9){const o=BattlePlayers.target(f),d=(o.x-f.x)*f.face;a.fromX=f.x;a.toX=f.x+f.face*(d>15&&d<170?Math.min(145,d+32):85);a.targetX=o.x;a.stepFace=f.face;}
   if(t>=9&&t<16){const u=(t-8)/7;f.vx=a.fromX+(a.toX-a.fromX)*u-f.x;maleniaCliffStop(f);a.pose=43;}
   else{f.vx=moveToward(f.vx,0,1.2);a.pose=t<16?43:44;if(t===16)f.face=(a.targetX-f.x)*(a.stepFace||f.face)<0?-(a.stepFace||f.face):(a.stepFace||f.face);}
  }
  if(a.maleniaPhantoms){a.pose=t<29?43:42;f.vx=t>=29&&t<32?f.face*4:moveToward(f.vx,0,.8);maleniaCliffStop(f);if([12,18,24].includes(t)&&!a.eventsDone.has('phantom'+t)){a.eventsDone.add('phantom'+t);r.spawn(f,{kind:'phantom',x:f.x,y:f.y,vx:f.face*6,vy:0,damage:4,radius:18,life:24,phase:1});}}
  if(a.maleniaWaterfowl){
   const start=a.maleniaRot?10:12;
   if(t<start){a.pose=45;f.vx*=.65;f.vy=0;return;}
   if(a.waterAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);maleniaDuration(f,a,t+100);}else maleniaWaterfowlBegin(f,a,i,t);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)maleniaWaterfowlBegin(f,a,i,t);return;}
   const dt=t-a.waterAt;a.pose=dt<2?45:dt<28?46:35;
   if(dt<28){const burst=dt%10<6;a.gravityMultiplier=0;f.vy=burst?-(a.maleniaRot?10.6:9.3):-1.6;f.vx=burst?a.waterFace*(a.maleniaRot?6.7:5.5):moveToward(f.vx,0,1);}
   else{a.gravityMultiplier=.8;f.vx=moveToward(f.vx,i.x*4,.4);}
  }
  if(a.maleniaTransform){a.pose=47;f.vx*=.7;if(t===24&&!a.transformed){a.transformed=true;a.maleniaRot=true;f.maleniaRotTime=720;f.maleniaRotCooldown=1440;r.spawn(f,{kind:'petals',x:f.x,y:f.y-50,vx:0,vy:0,damage:0,life:22});}}
  if(a.maleniaAeonia){a.pose=t<19?66:67;if(t>=8&&t<19){f.grounded=false;f.vx=clamp(i.x,-1,1)*2;f.vy=-5;a.gravityMultiplier=0;}else if(t>=19){f.vx=f.face*3;f.vy=Math.max(9,f.vy);a.gravityMultiplier=.5;}if(t>=90){a.landingMove=null;f.vx*=.5;a.gravityMultiplier=1;}}
  if(a.maleniaBloom){a.pose=a.maleniaAeoniaImpact?68:47;f.vx=moveToward(f.vx,0,1);if(t===(a.maleniaAeoniaImpact?1:20))maleniaBloom(f,a,r,a.maleniaAeoniaImpact?11:8);}
 },
 onHit(f,o,a){if(a.projectile||a.maleniaNoHeal||a.damage<=0)return;const actual=f.attack;if(!actual)return;const amount=Math.min(.4,Math.max(0,1-(actual.maleniaHealed||0)));actual.maleniaHealed=(actual.maleniaHealed||0)+amount;f.damage=Math.max(0,f.damage-amount);f.maleniaHealFlash=14;},
 boxes(f,a,w){
  const shape=w.shape,reach=({jab:155,jab2:112,jab3:130,heavy:145,low:112,dashAttack:135,smash:195,fair:145,bair:132})[a.type]??(a.maleniaCombo?140:a.maleniaStep?140:a.maleniaPhantoms?155:120);
  const p=shape==='up'?[-8,-44,20,-145]:shape==='down'?[0,-48,35,38]:shape==='back'?[0,-50,-reach,-50]:shape==='low'?[0,-17,reach,-17]:shape==='spin'?[-57,-50,57,-50]:[0,-50,reach,-50];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?27:a.type.includes('smash')?22:19,window:w,modifiers:w}];
 },
 projectile(q,f,o){if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.kind==='petals')return true;
  if(q.kind==='phantom'){q.previousX=q.x;q.x+=q.vx;if(q.age<9||q.age>12)return true;const b={x1:q.x-q.face*20,y1:q.y-50,x2:q.x+q.face*100,y2:q.y-50,radius:18};for(const target of BattlePlayers.targets(f))maleniaObjectHit(q,f,target,b);return true;}
  if(q.kind==='bloom'||q.kind==='rotField'){if(q.kind==='bloom'&&q.age>3)return true;if(q.kind==='rotField'){if(![18,42,66].includes(q.age))return true;q.hits.clear();}const b={x1:q.x,y1:q.y,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))maleniaObjectHit(q,f,target,b);return true;}
  return false;
 },
 hurtboxes(f){const low=[3,11,22,32,36,47,68,95,100].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?46:95),r:16},{part:'torso',x:f.x,y:f.y-(low?27:54),r:20},{part:'legs',x:f.x,y:f.y-13,r:15}];},
 cpu(f,o,i,clear){if(f.attack?.maleniaWaterfowl){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded&&frame%77===f.id){clear();i.x=0;if(!maleniaRot(f)&&!f.maleniaRotCooldown){i.y=1;i.special=true;}else if(maleniaRot(f)&&!f.maleniaBloomCooldown&&Math.abs(o.x-f.x)<150){i.y=1;i.special=true;}}}
});
function maleniaObjectHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn||CombatSystem.protection(o).intangible)return false;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);CombatSystem.hit(f,o,{...MaleniaMoves.dragon,type:'malenia'+q.kind,sourceType:q.sourceType,projectile:true,maleniaNoHeal:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,baseKnockback:q.kind==='rotField'?3:18,knockbackGrowth:.04},b,touch);return true;}
function maleniaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
