'use strict';
const KlonoaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'wind'};
 const a=NewcomerCore.moves(['手のひらはたき','逆手はたき','耳ふり','耳ではたく','両耳すくい上げ','スライドキック','ころがりタックル','大きな風のムゥ','ボムヘイ打ち上げ','両耳なぎ払い','耳プロペラ','ダブルキック','後ろ耳はたき','耳クロスアッパー','踏みつけ'],{
  dragon:m('風の弾・ウィンドバレット',11,[],18,0,{...opt,kloWind:true,projectile:true,pose:40,damage:2}),
  windHold:m('風の捕獲',1,[],60,0,{...opt,kloHolding:true,raimentGrab:true,tether:true,pose:42,damage:0}),
  dash:m('ムゥキャッチ＆スロー',16,[],18,0,{...opt,kloMoo:true,projectile:true,pose:42,damage:10}),
  rise:m('ジェッティモライド・耳ホバリング',9,[w(9,16,'up',{pose:44,damage:5})],51,14,{...opt,kloRide:true,pose:44,damage:5,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
  gale:m('ボムヘイ・カウントダウン',12,[],24,0,{...opt,kloBomb:true,projectile:true,pose:46,damage:12}),
  airDrop:m('空中ボムヘイ',12,[],24,10,{...opt,kloBomb:true,projectile:true,aerial:true,pose:46,damage:12})
 },'punch',100),poses={jab:6,jab2:7,jab3:8,heavy:9,up:10,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:13,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function klonoaGate(f,type){return !(type==='dragon'&&(f.kloWindCooldown>0||KlonoaRules.objects.some(q=>q.owner===f.id&&q.kind==='wind'&&!q.dead))||type==='dash'&&(f.kloMooCooldown>0||KlonoaRules.objects.some(q=>q.owner===f.id&&q.kind==='moo'&&!q.dead))||['gale','airDrop'].includes(type)&&(f.kloBombCooldown>0||KlonoaRules.objects.some(q=>q.owner===f.id&&['bomb','blast'].includes(q.kind)&&!q.dead)));}
function klonoaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function klonoaLand(f){if(!f.attack?.kloHolding)return false;f.grounded=true;f.vy=0;f.fastFall=f.shortHop=f.airDodged=f.helpless=f.recovered=false;f.specialLandingLag=0;f.airJumps=f.character.airJumpCount;f.jumps=f.ledgeGrabs=0;return true;}
function klonoaRelease(f,boost=false,dy=0){const a=f.attack,o=f.grabbed;if(!a?.kloHolding||!o)return;
 f.grabbed=null;o.grabOwner=null;o.grabImmunity=90;o.hitlag=0;o.frozen=null;PlayerStates.enter(o,'Fall');o.grounded=false;
 a.released=true;a.raimentGrab=a.tether=false;a.gravityMultiplier=1;a.pose=43;klonoaDuration(f,a,f.timer+10);f.buffer=null;
 CombatSystem.hit(f,o,{...KlonoaMoves.forwardThrow,type:'windRelease',sourceType:'dragon',charge:0,damage:boost?5:9,projectile:false,staleMultiplier:a.staleMultiplier,launchDirection:f.face,angle:boost?1.4:dy<-.5?-1.4:dy>.5?1.2:-.45});
 if(boost){f.grounded=false;f.fastFall=false;f.vy=-15;f.vx=f.face*2;f.helpless=false;}
}
function klonoaStartRide(f,a,i,t){a.rideAt=t;a.rideFace=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.rideFace;f.recovered=true;f.grounded=false;f.fastFall=false;klonoaDuration(f,a,t+53);a.activeFrames=[CombatData.window(t,t+7,'up',{pose:44,damage:5})];}
const KlonoaRules=NewcomerCore.create('klonoa',KlonoaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='klonoa')f.kloWindCooldown=f.kloMooCooldown=f.kloBombCooldown=0;},
 status(f){for(const k of['kloWindCooldown','kloMooCooldown','kloBombCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);const o=f.grabbed;if(f.attack?.kloHolding&&o&&(o.pendingLaunch||o.hitstun>0||o.respawn||BattlePlayers.out(o)||o.grabOwner!==f)){f.grabbed=null;if(o.grabOwner===f)o.grabOwner=null;o.grabImmunity=90;f.attack=null;PlayerStates.enter(f,f.grounded?'Idle':'Fall');}},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));if(a.kloWind)f.kloWindCooldown=55;if(a.kloMoo)f.kloMooCooldown=80;if(a.kloBomb){f.kloBombCooldown=150;a.releaseAt=a.aerial?12:28;a.motionLastEvent=a.releaseAt;}if(a.kloHolding){a.victimId=null;a.captureFrame=f.timer;klonoaDuration(f,a,65);}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.kloWind){a.pose=t<11?40:41;f.vx=moveToward(f.vx,0,.55);if(t===11&&!a.fired){a.fired=true;r.spawn(f,{kind:'wind',bodyOrigin:true,x:f.x+f.face*9,y:f.y-39,vx:f.face*9,vy:clamp(i.y,-1,1)*1.4,damage:2,radius:14,life:24});}}
  if(a.kloHolding){
   f.buffer=null;f.fastFall=false;if(a.released)return;
   const o=f.grabbed;if(!o){f.attack=null;PlayerStates.enter(f,f.grounded?'Idle':'Fall');return;}
   a.pose=42;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*2,.3);a.gravityMultiplier=.65;o.x=f.x;o.y=f.y-94+o.character.ecb.height*.5;o.vx=o.vy=0;o.grounded=false;
   const dt=t-a.captureFrame;if(dt>=4&&(i.jump||i.special&&!a.specialWas||i.jab||i.heavy)){if(Math.abs(i.x)>.3)f.face=Math.sign(i.x);klonoaRelease(f,!!i.jump,i.y);}
   else if(dt>=46)klonoaRelease(f,false,0);a.specialWas=!!i.special;
  }
  if(a.kloMoo){a.pose=t<16?42:43;f.vx=moveToward(f.vx,0,.6);if(t===16&&!a.fired){a.fired=true;r.spawn(f,{kind:'moo',bodyOrigin:true,x:f.x+f.face*12,y:f.y-42,vx:f.face*8,vy:a.originGrounded?-5.2:-2.8,damage:10,radius:19,life:65});}}
  if(a.kloBomb){f.fastFall=false;f.vx=moveToward(f.vx,0,.45);const release=t>=15&&i.special&&!a.specialWas||t>=a.releaseAt;a.pose=a.fired?47:46;if(release&&!a.fired){a.fired=true;a.pose=47;a.motionLastEvent=t;r.spawn(f,{kind:'bomb',bodyOrigin:true,x:f.x+f.face*15,y:f.y-39,vx:f.face*(a.aerial?3:6),vy:a.aerial?3.5:-5,damage:12,radius:15,life:48});}a.specialWas=!!i.special;}
  if(a.kloRide){
   f.fastFall=false;if(t<9){f.vx*=.7;f.vy=0;return;}
   if(a.rideAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);klonoaDuration(f,a,t+110);}else klonoaStartRide(f,a,i,t);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)klonoaStartRide(f,a,i,t);return;}
   const dt=t-a.rideAt;if(dt>=10&&i.special&&!a.specialWas&&!a.detachAt)a.detachAt=dt;
   const detach=a.detachAt??19;a.pose=dt<detach?44:dt<detach+18?45:35;
   if(dt<detach){f.vy=-11.8;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5.8,.5);a.gravityMultiplier=0;}
   else if(dt<detach+18){f.vy=dt<detach+7?-2:.9;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*6.3,.4);a.gravityMultiplier=0;}
   else{a.gravityMultiplier=1;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.25);}a.specialWas=!!i.special;
  }
 },
 onHit(f,o,a){if(f.attack?.type==='dair'&&!f.attack.bounced){f.attack.bounced=true;f.vy=-8.5;f.grounded=false;}},
 boxes(f,a,w){const s=w.shape,reach=({jab:63,jab2:67,jab3:82,heavy:90,low:84,dashAttack:84,smash:118,fair:91,bair:91})[a.type]??88;
  const p=s==='up'?[0,-25,0,-106]:s==='down'?[0,-25,8,34]:s==='back'?[0,-38,-reach,-38]:s==='low'?[0,-12,reach,-12]:s==='spin'?[-42,-38,42,-38]:[0,-38,reach,-38];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='spin'?22:16,window:w,modifiers:w}];
 },
 projectile(q,f,o,r){
  if(f.respawn){q.dead=true;return true;}
  if(q.kind==='blast'){if(q.age>=q.life){q.dead=true;return true;}if(q.age<=3)for(const target of BattlePlayers.targets(f))klonoaObjectHit(q,f,target,{x1:q.x,y1:q.y,x2:q.x,y2:q.y,radius:q.radius});return true;}
  q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;if(q.kind!=='wind')q.vy+=q.kind==='moo'?.28:.24;
  const main=platforms.find(p=>p.main),floor=platforms.some(p=>q.x>=p.x&&q.x<=p.x+p.w&&q.previousY<=p.y&&q.y>=p.y&&q.vy>=0),body=q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90;
  const box={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  if(q.kind==='bomb'){
   if(q.age>=q.life||floor||body||BattlePlayers.targets(f).some(v=>CombatSystem.contact(box,v)||['ShieldStart','ShieldHold','ShieldDrop'].includes(v.mode==='Hitlag'?v.frozen?.mode:v.mode)&&CombatSystem.shieldCovers(v,box))){q.dead=true;r.spawn(f,{kind:'blast',x:q.x,y:q.y,vx:0,vy:0,damage:12,radius:55,life:14,sourceType:q.sourceType,stale:q.stale});}return true;
  }
  if(q.age>=q.life||floor||body||q.y>1400||q.x<-900||q.x>2340){q.dead=true;return true;}
  for(const target of BattlePlayers.targets(f)){if(q.dead)break;klonoaObjectHit(q,f,target,box);}return true;
 },
 hurtboxes(f){const low=[3,11,22,32,36].includes(klonoaPose(f));return[{part:'head',x:f.x,y:f.y-(low?34:64),r:21},{part:'torso',x:f.x,y:f.y-(low?20:32),r:18},{part:'legs',x:f.x,y:f.y-10,r:13}];},
 cpu(f,o,i,clear){if(f.attack?.kloHolding){clear();i.x=Math.sign(o.x-f.x)||f.face;i.y=0;i.special=f.timer-f.attack.captureFrame>=8;return;}if(f.attack?.kloRide){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>130&&Math.abs(o.x-f.x)<260&&frame%41===f.id&&klonoaGate(f,'dragon')){clear();i.x=i.y=0;i.special=true;}}
});
function klonoaObjectHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn)return false;const protect=CombatSystem.protection(o);if(protect.intangible||protect.invincible)return false;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode==='Hitlag'?o.frozen?.mode:o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);
 const counter=o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1];if(counter){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;q.dead=true;return true;}
 if(q.kind==='wind'&&!shield&&!protect.armor&&!o.grabOwner&&!o.grabImmunity&&!f.grabbed&&!f.hitlag&&!f.hitstun&&!f.helpless&&(!f.attack||f.attack.kloWind)){
  attack(f,'windHold');if(NewcomerCore.capture(f,o,{raimentGrab:true},false)){f.attack.captureFrame=f.timer;f.attack.specialWas=true;o.grabEscape=Math.min(o.grabEscape,48);f.stats.hits++;o.lastHit=f.id;q.dead=true;return true;}
 }
 CombatSystem.hit(f,o,{...KlonoaMoves.dragon,type:'klonoa'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,baseKnockback:q.kind==='wind'?1.5:3.6,knockbackGrowth:q.kind==='wind'?.025:.065},b,touch);if(q.kind!=='blast')q.dead=true;return true;
}
function klonoaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('klonoa',{"fair":{"strike":[12,13],"windup":3},"air":{"strike":[10,7],"windup":3}});
