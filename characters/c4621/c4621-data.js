'use strict';
const C4621Moves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['ライフル殴り','肘打ち','ブーストキック','パルス横薙ぎ','ブーストアッパー','下段斬り','ショルダー突き','パルス貫き','ブースト叩き上げ','ミサイル叩きつけ','旋回斬り','空中ブレード','後ろ蹴り','上方薙ぎ','急降下斬り'],{
  dragon:m('RF-024 TURNER',10,[],18,0,{...opt,c621Rifle:true,projectile:true,pose:40,damage:2.8}),
  dash:m('HI-32 パルスブレード',10,[w(12,16,'front',{pose:41,damage:9})],19,0,{...opt,c621Blade:true,pose:41,damage:9,reach:135}),
  rise:m('アサルトブースト・ベクタークライム',8,[w(30,34,'up',{pose:45,damage:9})],16,14,{...opt,c621Boost:true,pose:43,damage:9,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
  gale:m('BML-G1 4連ミサイル',16,[],22,0,{...opt,c621Missiles:true,projectile:true,pose:46,damage:4}),
  airDrop:m('空中4連ミサイル',16,[],22,12,{...opt,c621Missiles:true,projectile:true,aerial:true,pose:47,damage:4})
 },'sword',130),poses={jab:6,jab2:7,jab3:13,heavy:9,up:8,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:47,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:13,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}
 a.grab.newcomerHit=false;
 for(const key of['jab','jab2','jab3','dashAttack','pummel'])a[key].soundFamily='punch';
 for(const v of Object.values(a)){v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};}
 return a;
})();
function c4621Gate(f,type){return !(type==='dragon'&&f.c621RifleCooldown>0||type==='dash'&&f.c621BladeCooldown>0||['gale','airDrop'].includes(type)&&(f.c621MissileCooldown>0||C4621Rules.objects.some(q=>q.owner===f.id&&q.kind==='missile'&&!q.dead)));}
function c4621Muzzle(f){const n=f.attack?.c621Rifle&&f.attack.pose===47?47:40,r=C4621ArtRects.frames[n],s=BattleSize.native('c4621',n)*FIGHTER_SCALE*BattleSize.art('c4621');return{x:f.x+r[2]*.48*s*f.face,y:f.y+(-r[3]*(n===47?.57:.71)+BattleSize.baseline(f,n))*s};}
function c4621CliffStop(f){if(!f.grounded)return;const p=platforms.find(p=>f.x>=p.x-3&&f.x<=p.x+p.w+3&&Math.abs(f.y-p.y)<3);if(p)f.vx=clamp(f.vx,p.x+2-f.x,p.x+p.w-2-f.x);}
function c4621Duration(f,a,end){const delta=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=delta;f.stateEnd+=delta;}
function c4621BeginBoost(f,a,i,t){a.boostAt=t;a.rollAt=null;a.boostFace=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.boostFace;f.recovered=true;f.grounded=false;f.fastFall=false;c4621Duration(f,a,t+42);a.activeFrames=[CombatData.window(t+22,t+26,'up',{pose:45,damage:9})];}
const C4621Rules=NewcomerCore.create('c4621',C4621Moves,{
 reset(){for(const f of fighters)if(f.characterId==='c4621')Object.assign(f,{c621ACS:0,c621ACSQuiet:0,c621Stagger:0,c621SeenDamage:f.damage,c621RifleCooldown:0,c621BladeCooldown:0,c621MissileCooldown:0});},
 status(f){
  if(f.respawn){Object.assign(f,{c621ACS:0,c621ACSQuiet:0,c621Stagger:0,c621SeenDamage:f.damage,c621RifleCooldown:0,c621BladeCooldown:0,c621MissileCooldown:0});return;}
  for(const k of['c621RifleCooldown','c621BladeCooldown','c621MissileCooldown','c621Stagger'])f[k]=Math.max(0,(f[k]||0)-1);
  const received=Math.max(0,f.damage-(f.c621SeenDamage??f.damage));f.c621SeenDamage=f.damage;
  if(received>0){f.c621ACS=Math.min(100,(f.c621ACS||0)+received*2);f.c621ACSQuiet=90;}
  else if(f.c621ACSQuiet>0)f.c621ACSQuiet--;else f.c621ACS=Math.max(0,(f.c621ACS||0)-.6);
  // Extend the existing launch stun once. Chip damage alone never forces a stun.
  if(f.c621ACS>=100&&!f.c621Stagger&&f.pendingLaunch){f.pendingLaunch.hitstun+=12;f.c621ACS=0;f.c621Stagger=45;}
 },
 prepare(f,a){
  a.activeFrames=a.activeFrames.map(w=>({...w}));a.phase='startup';
  if(a.c621Rifle){a.volleyEnd=22;a.motionLastEvent=22;f.c621RifleCooldown=60;}
  if(a.c621Blade){a.followUntil=28;a.motionLastEvent=28;f.c621BladeCooldown=52;}
  if(a.c621Missiles){a.motionLastEvent=25;f.c621MissileCooldown=145;}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.c621Rifle){
   const target=BattlePlayers.target(f);a.pose=f.grounded&&target.grounded&&target.character.ecb.height<85&&Math.abs(target.x-f.x)<400?47:40;f.vx=moveToward(f.vx,0,.65);
   if(t===18&&i.specialHeld){a.volleyEnd=34;a.motionLastEvent=34;}
   if([10,16,22,28,34].includes(t)&&t<=a.volleyEnd&&!a.eventsDone.has('rifle'+t)){
    a.eventsDone.add('rifle'+t);const muzzle=c4621Muzzle(f);r.spawn(f,{kind:'rifle',bodyOrigin:true,x:f.x+f.face*12,y:muzzle.y,muzzleX:muzzle.x,vx:f.face*14,vy:clamp(i.y,-1,1)*.8,damage:2.8,radius:7,life:32});f.c621RifleCooldown=Math.max(f.c621RifleCooldown,40);
   }
  }
  if(a.c621Blade){
   if(!a.following&&t>=18&&t<=28&&i.special&&!a.specialWas){a.following=true;a.secondAt=t+5;a.motionLastEvent=a.secondAt+4;a.activeFrames.push(CombatData.window(a.secondAt,a.secondAt+4,'front',{pose:42,damage:12}));}
   a.pose=a.following&&t>=a.secondAt-3?42:41;
   f.vx=t>=6&&t<12?f.face*6:a.following&&t>=a.secondAt-3&&t<a.secondAt?f.face*4:moveToward(f.vx,0,1.2);
   c4621CliffStop(f);a.specialWas=!!i.special;
  }
  if(a.c621Missiles){
   a.pose=a.aerial?47:46;f.vx=moveToward(f.vx,0,.45);
   if([16,19,22,25].includes(t)&&!a.eventsDone.has('missile'+t)){
    a.eventsDone.add('missile'+t);const n=(t-16)/3,target=BattlePlayers.target(f);
    r.spawn(f,{kind:'missile',bodyOrigin:true,x:f.x+f.face*16,y:f.y-98,vx:f.face*(3+n*.15),vy:-4+n*.65,damage:4,radius:9,life:105,targetId:target.id,lockAt:20+n*2});
   }
  }
  if(a.c621Boost){
   if(t<8){f.vx*=.6;f.vy=0;return;}
   if(a.boostAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);c4621Duration(f,a,t+100);}else c4621BeginBoost(f,a,i,t);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)c4621BeginBoost(f,a,i,t);return;}
   const dt=t-a.boostAt;
   if(a.rollAt==null&&dt>=7&&dt<=17&&(Math.abs(i.x)>.45||i.special&&!a.specialWas)){a.rollAt=dt;a.rollFace=Math.abs(i.x)>.2?Math.sign(i.x):a.boostFace;}
   a.pose=dt<7?43:dt<22?44:dt<27?45:35;
   if(dt<22){a.gravityMultiplier=0;f.vy=dt<7?-11.5:-9;f.vx=a.rollAt!=null?a.rollFace*(dt-a.rollAt<8?8:5):clamp(i.x,-1,1)*4;}
   else if(dt<27){f.vx=moveToward(f.vx,i.x*4,.4);f.vy=-5;a.gravityMultiplier=0;}
   else{a.gravityMultiplier=.85;f.vx=moveToward(f.vx,i.x*4,.35);}
   a.specialWas=!!i.special;
  }
 },
 boxes(f,a,w){
  const shape=w.shape,reach=a.c621Blade?(w.pose===42?145:122):({jab:78,jab2:76,jab3:90,heavy:122,low:106,dashAttack:98,smash:150,fair:130,bair:112})[a.type]??100;
  if(a.type==='downsmash'){const x=f.x+f.face*(shape==='back'?-85:85);return[{x1:f.x,y1:f.y-16,x2:x,y2:f.y-16,radius:32,window:w,modifiers:w}];}
  const p=shape==='up'?[-8,-45,12,-138]:shape==='down'?[0,-45,24,35]:shape==='back'?[0,-52,-reach,-52]:shape==='low'?[0,-16,reach,-16]:shape==='spin'?[-55,-52,55,-52]:[0,-52,reach,-52];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?28:a.type.includes('smash')?21:18,window:w,modifiers:w}];
 },
 projectile(q,f,o,r){
  if(!['missile','blast'].includes(q.kind))return false;
  if(f.respawn||q.age>=q.life){q.dead=true;return true;}
  if(q.kind==='blast'){if(q.age>3)return true;for(const target of BattlePlayers.targets(f))c4621ObjectHit(q,f,target,{x1:q.x,y1:q.y,x2:q.x,y2:q.y,radius:q.radius});return true;}
  q.previousX=q.x;q.previousY=q.y;
  // Lock turns gently for a finite period; the last flight phase is ballistic.
  const target=fighters.find(v=>v.id===q.targetId&&!v.respawn&&!BattlePlayers.out(v));
  if(q.age>=q.lockAt&&q.age<65&&target){const dx=target.x-q.x,dy=target.y-45-q.y,len=Math.max(1,Math.hypot(dx,dy));q.vx=moveToward(q.vx,dx/len*5.2,.16);q.vy=moveToward(q.vy,dy/len*5.2,.16);}
  else if(q.age<q.lockAt)q.vy=moveToward(q.vy,-.5,.18);
  q.x+=q.vx;q.y+=q.vy;
  const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  const floor=platforms.some(p=>q.x>=p.x&&q.x<=p.x+p.w&&q.previousY<=p.y&&q.y>=p.y&&q.vy>0),body=platforms.some(p=>p.main&&q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90);
  if(floor||body||BattlePlayers.targets(f).some(target=>CombatSystem.contact(b,target)||['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b))){q.dead=true;r.spawn(f,{kind:'blast',x:q.x,y:q.y,vx:0,vy:0,face:q.face,sourceType:q.sourceType,stale:q.stale,damage:q.damage,radius:32,life:12});}
  return true;
 },
 hurtboxes(f){const low=[3,11,22,32,36,47].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?49:95),r:15},{part:'torso',x:f.x,y:f.y-(low?30:59),r:24},{part:'legs',x:f.x,y:f.y-15,r:18}];},
 cpu(f,o,i,clear){
  const a=f.attack,d=Math.abs(o.x-f.x);
  if(a?.c621Blade){if(f.timer===22){i.special=true;i.specialHeld=false;}return;}
  if(a?.c621Boost){i.x=Math.sign(720-f.x);return;}
  if(!a&&f.grounded&&d>150&&frame%29===f.id){clear();i.special=true;i.x=0;i.y=d>280&&c4621Gate(f,'gale')?1:0;}
 }
});
function c4621ObjectHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn||CombatSystem.protection(o).intangible)return false;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);CombatSystem.hit(f,o,{...C4621Moves.gale,type:'c621'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,baseKnockback:18,knockbackGrowth:.035},b,touch);return true;}
function c4621Pose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
