'use strict';
const RayMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch'};
 const a=NewcomerCore.moves(['ガンバット','左腕横打ち','ニーキック','アームスイング','ランチャーアッパー','ローキック','レイアタック','3連射バースト','ツインポッド開放','レッグサイクロン','スピン','ガンストライク','ブーストキック','ポッドフレア','斜め3連射'],{
  dragon:m('ベーシックガン',12,[],26,0,{...opt,rayGun:true,pose:40,damage:3,chargeFrame:6,chargeMaxFrames:45}),
  dash:m('スタンダードボム',15,[],15,0,{...opt,rayBomb:true,pose:41,damage:10,baseKnockback:3.6,knockbackGrowth:.055}),
  rise:m('スタンダードレッグ',8,[w(8,31,'spin',{pose:42,damage:6})],13,12,{...opt,rayArc:true,pose:42,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
  gale:m('スタンダードポッド',18,[],17,0,{...opt,rayPods:true,pose:45,damage:9}),
  airDrop:m('空中スタンダードポッド',18,[],17,12,{...opt,rayPods:true,aerial:true,pose:45,damage:9})
 },'punch',108),poses={jab:6,jab2:7,jab3:18,heavy:9,up:8,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:6,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:15,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}
 a.grab.newcomerHit=false;a.dragon.projectile=true;a.dash.projectile=true;a.gale.projectile=true;a.airDrop.projectile=true;
 for(const v of Object.values(a)){v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};}
 return a;
})();
function rayExplode(q,r,cross=false){if(q.exploded)return;q.exploded=true;q.dead=true;const f=fighters[q.owner];if(!f||f.respawn)return;r.spawn(f,{kind:'blast',x:q.x,y:q.y,vx:0,vy:0,damage:cross?11:q.damage,radius:cross?52:43,life:12,face:q.face,sourceType:q.sourceType,cross,hits:q.hits});}
const RayRules=NewcomerCore.create('ray',RayMoves,{
 status(f){for(const key of ['rayGunCooldown','rayBombCooldown','rayPodCooldown'])f[key]=f.respawn?0:Math.max(0,(f[key]||0)-1);},
 prepare(f,a){if(a.rayGun)a.volleyEnd=(a.charge||0)>.25?12:24;if(a.rayArc){a.pose=42;a.arcStarted=false;}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.rayGun){a.volleyEnd=a.charge>.25?12:24;if([12,18,24].includes(t)&&t<=a.volleyEnd&&!a.eventsDone.has('gun'+t)){a.eventsDone.add('gun'+t);const big=a.charge>.25;r.spawn(f,{kind:'gun',bodyOrigin:true,x:f.x+f.face*42,y:f.y-45,vx:f.face*(big?15:13),vy:clamp(i.y,-1,1)*1.5,damage:big?8+a.charge*4:3,radius:big?15:8,life:44});f.rayGunCooldown=big?32:26;}a.pose=40;}
  if(a.rayBomb&&t===15&&!a.eventsDone.has('bomb')){a.eventsDone.add('bomb');r.spawn(f,{kind:'bomb',bodyOrigin:true,x:f.x+f.face*28,y:f.y-54,vx:f.face*(6+clamp(i.x*f.face,-1,1)*2),vy:-7,damage:10,radius:12,life:100,bounces:0});f.rayBombCooldown=50;}
  if(a.rayPods&&t===18&&!a.eventsDone.has('pods')){a.eventsDone.add('pods');const target=BattlePlayers.target(f),tx=f.x+f.face*clamp((target.x-f.x)*f.face,100,280),ty=clamp(target.y-40,f.y-120,f.y+100),hits=new Set();for(const side of[-1,1])r.spawn(f,{kind:'pod',x:f.x,y:f.y-55,vx:0,vy:0,side,tx,ty,ox:f.x,oy:f.y-55,damage:5,radius:10,life:72,hits});f.rayPodCooldown=85;}
  if(a.rayArc){if(t<8){f.vx=f.vy=0;return;}if(!a.arcStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(t===8&&f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){a.totalFrames=a.motionEndFrames=t+40;return;}}
   if(!a.arcStarted){a.arcStarted=true;a.arcAt=t;a.ax=f.x;a.ay=f.y;a.direction=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.direction;f.recovered=true;f.grounded=false;f.fastFall=false;a.totalFrames=a.motionEndFrames=t+36;a.activeFrames=[CombatData.window(t,t+23,'spin',{pose:42,damage:6})];}
   const u=clamp((t-a.arcAt+1)/24,0,1);a.pose=u<.3?42:u<.8?43:44;if(t-a.arcAt<24){const x=a.ax+a.direction*110*(1-Math.cos(Math.PI*u)),y=a.ay-115*Math.sin(Math.PI*u)-100*u;f.vx=x-f.x;f.vy=y-f.y;a.gravityMultiplier=0;}else{f.vx=moveToward(f.vx,i.x*4,.4);a.gravityMultiplier=.8;}
  }
 },
 boxes(f,a,w){if(a.rayArc)return[{x1:f.x-18,y1:f.y-35,x2:f.x+18,y2:f.y-35,radius:24,window:w,modifiers:w}];return rayMeleeBox(f,a,w,65);},
 projectile(q,f,o,r){if(!['gun','bomb','pod','blast'].includes(q.kind))return false;if(f.respawn||q.age>=q.life){q.dead=true;return true;}
  if(q.kind==='gun'){q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main),floor=platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<p.y&&q.y>=p.y);if(floor||q.x<-900||q.x>2340||q.y>1400||q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90){q.dead=true;return true;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))if(rayObjectHit(q,f,target,b)){q.dead=true;break;}return true;}
  if(q.kind==='blast'){if(q.age>4)return true;const b={x1:q.x,y1:q.y,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))rayObjectHit(q,f,target,b);return true;}
  q.previousX=q.x;q.previousY=q.y;
  if(q.kind==='bomb'){q.vy+=.36;q.x+=q.vx;q.y+=q.vy;const floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y&&q.vy>0);if(floor){q.y=floor.y-1;if(q.bounces++===0){q.vy=-5;q.vx*=.75;}else rayExplode(q,r);}if(q.age>=78)rayExplode(q,r);}
  else{const u=clamp(q.age/32,0,1);q.x=q.ox+(q.tx-q.ox)*u;q.y=q.oy+(q.ty-q.oy)*u+q.side*100*Math.sin(Math.PI*u);q.vx=q.x-q.previousX;q.vy=q.y-q.previousY;if(u===1){rayExplode(q,r,true);for(const other of r.objects)if(other.kind==='pod'&&other.owner===q.owner&&other.ox===q.ox&&other.tx===q.tx&&Math.abs(other.age-q.age)<=1)other.dead=true;}}
  if(!q.dead){const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))if(rayObjectHit(q,f,target,b)){rayExplode(q,r,q.kind==='pod');break;}}
  return true;
 },
 hurtboxes(f){const low=[3,11,22,32,36].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?37:68),r:15},{part:'torso',x:f.x,y:f.y-(low?23:43),r:19},{part:'legs',x:f.x,y:f.y-13,r:14}];},
 cpu(f,o,i,clear){if(f.attack?.rayArc){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>140){clear();const far=Math.abs(o.x-f.x)>270;i.x=far?0:Math.sign(o.x-f.x);i.special=true;i.y=far?0:(f.rayBombCooldown||0)===0?0:1;if(i.y===1)i.x=0;}}
});
function rayObjectHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn||CombatSystem.protection(o).intangible)return false;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;return true;}const bomb=q.kind==='bomb'||q.kind==='blast'&&!q.cross,gun=q.kind==='gun';CombatSystem.hit(f,o,{...RayMoves.dragon,type:'ray'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:gun?-.55:-.85,baseKnockback:bomb?RayMoves.dash.baseKnockback:gun?2.6:3.8,knockbackGrowth:bomb?RayMoves.dash.knockbackGrowth:gun?.045:.06},b,touch);return true;}
function rayMeleeBox(f,a,w,reach){const shape=w.shape,h=45,r=a.type.includes('smash')?17:13;let p=shape==='up'?[0,-32,0,-105]:shape==='down'?[0,-30,10,45]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-12,reach,-12]:shape==='spin'?[-32,-h,32,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?25:r,window:w,modifiers:w}];}
function rayPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('ray',{"fair":{"strike":[12],"windup":3},"downsmash":{"strike":[11,14],"windup":3},"smash":{"strike":[13,9],"windup":3}});
