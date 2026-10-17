'use strict';
const AlucardMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['横斬り','連続斬り','突き','薙ぎ払い','上段斬り','下段薙ぎ','滑り斬り','ソードクラッシュ','シールドバッシュ','闇の波動','斬り下ろし','空中突き','後ろ薙ぎ','シールド打ち上げ','下方斬り'],{
  dragon:m('ソウルスティール',14,[],16,0,{...opt,alucardSoul:true,projectile:true,pose:40,damage:7,rangedInterval:48,rangedRearm:26}),
  dash:m('使い魔召喚 / オオカミ変身',12,[],24,0,{...opt,alucardSummon:true,pose:41,damage:6,airControlMultiplier:.2}),
  rise:m('ミスト化 / コウモリ飛行',8,[],62,16,{...opt,alucardFlight:true,pose:42,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:18}),
  gale:m('シールドロッド',12,[],16,0,{...opt,alucardShield:true,pose:43,damage:9}),
  airDrop:m('空中シールドロッド',12,[],16,12,{...opt,alucardShield:true,aerial:true,pose:43,damage:9})
 },'sword',134),poses={jab:6,jab2:7,jab3:8,heavy:6,up:10,low:11,dashAttack:9,smash:44,upsmash:15,downsmash:11,air:12,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:10,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}
 a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function alucardShield(f){return AlucardRules.objects.find(q=>q.owner===f.id&&q.kind==='shield'&&!q.dead);}
function alucardWolf(f){return f.alucardWolfTime>0&&!f.ledge&&!['LedgeCatch','LedgeHang','LedgeGetup','Grabbed'].includes(f.mode)&&!f.hitstun&&!f.respawn;}
function alucardGate(f,type){return !(type==='dragon'&&(f.alucardSoulCooldown>0||AlucardRules.objects.some(q=>q.owner===f.id&&q.kind==='soul'&&!q.dead))||['gale','airDrop'].includes(type)&&!alucardShield(f)&&f.alucardShieldCooldown>0);}
function alucardDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function alucardFireShield(q,face=q.face){Object.assign(q,{kind:'shieldShot',vx:face*10,face,age:0,life:40,damage:9,radius:23});}
function alucardFlightStart(f,a,t){a.flightAt=t;a.phase='mist';f.grounded=false;f.recovered=true;f.fastFall=false;alucardDuration(f,a,t+56);}
function alucardDetach(f,a,t){if(a.phase==='fall')return;a.phase='fall';a.detachAt=t;a.gravityMultiplier=.8;a.pose=35;f.vy=Math.min(f.vy,-3);alucardDuration(f,a,t+16);}
const AlucardRules=NewcomerCore.create('alucard',AlucardMoves,{
 reset(){for(const f of fighters)if(f.characterId==='alucard')Object.assign(f,{alucardSoulCooldown:0,alucardFamiliarCooldown:0,alucardShieldCooldown:0,alucardWolfTime:0,alucardFamiliar:0,alucardBlockFlash:0});},
 status(f){
  for(const key of['alucardSoulCooldown','alucardFamiliarCooldown','alucardShieldCooldown','alucardWolfTime','alucardBlockFlash'])f[key]=f.respawn?0:Math.max(0,(f[key]||0)-1);
  if(f.hitstun||f.respawn)f.alucardWolfTime=0;
  const base=CharacterData.alucard,wolf=alucardWolf(f);f.character.walkSpeed=wolf?4.2:base.walkSpeed;f.character.runSpeed=wolf?9.2:base.runSpeed;f.character.initialDashSpeed=wolf?9.7:base.initialDashSpeed;
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.wolf=alucardWolf(f);
  if(a.wolf&&!a.special){a.soundFamily='punch';a.damage*=.9;}
  if(a.alucardSoul){f.alucardSoulCooldown=48;a.motionLastEvent=14;}
  if(a.alucardSummon){a.familiar=f.alucardFamiliar||0;a.decided=false;a.motionLastEvent=24;}
  if(a.alucardShield){a.shieldId=alucardShield(f)?.id;a.motionLastEvent=12;f.alucardWolfTime=0;}
  if(a.alucardFlight)f.alucardWolfTime=0;
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.alucardSoul&&t===14&&!a.fired){a.fired=true;r.spawn(f,{kind:'soul',bodyOrigin:true,x:f.x+f.face*12,y:f.y-49,vx:f.face*11,vy:0,radius:16,damage:7,life:36});}
  if(a.alucardSummon){
   f.buffer=null;f.vx=moveToward(f.vx,0,.8);
   if(!a.decided&&t<24&&i.specialHeld){if(i.y<-.4)a.familiar=0;else if(i.y>.4)a.familiar=2;else if(Math.abs(i.x)>.4)a.familiar=1;}
   if(!a.decided&&t>=12&&!i.specialHeld){a.decided=true;f.alucardFamiliar=a.familiar;
    const ready=!(f.alucardFamiliarCooldown>0)&&!r.objects.some(q=>q.owner===f.id&&q.kind==='familiar'&&!q.dead);
    if(ready){r.spawn(f,{kind:'familiar',variant:a.familiar,x:f.x+f.face*22,y:f.y-(a.familiar===1?25:60),baseY:f.y-(a.familiar===1?25:60),vx:f.face*(a.familiar===0?7:a.familiar===1?8:2),vy:0,radius:a.familiar===2?35:20,damage:a.familiar===2?6:8,life:a.familiar===2?70:48});f.alucardFamiliarCooldown=100;}
    else{a.pose=8;a.activeFrames=[CombatData.window(t,t+3,'front',{pose:8,damage:6})];}
    a.motionLastEvent=t;alucardDuration(f,a,t+10);
   }else if(!a.decided&&t===24){a.decided=true;f.alucardWolfTime=120;a.wolf=true;a.pose=44;a.motionLastEvent=t;}
  }
  if(a.alucardShield&&t===12&&!a.fired){a.fired=true;const shield=r.objects.find(q=>q.id===a.shieldId&&!q.dead);
   if(shield){alucardFireShield(shield,a.originFace);f.alucardShieldCooldown=Math.max(50,f.alucardShieldCooldown);}
   else if(!(f.alucardShieldCooldown>0)){r.spawn(f,{kind:'shield',x:f.x+a.originFace*55,y:f.y-46,vx:0,vy:0,damage:0,radius:31,life:100,hp:2});f.alucardShieldCooldown=80;}
  }
  if(a.alucardFlight){
   f.buffer=null;f.fastFall=false;
   if(t<8){f.vx*=.6;f.vy=0;return;}
   if(a.flightAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);alucardDuration(f,a,t+100);}else alucardFlightStart(f,a,t);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);a.phase='mist';if(!a.escapeSide)alucardFlightStart(f,a,t);return;}
   const dt=t-a.flightAt;
   if(a.phase!=='fall'&&((dt>=12&&(i.jump||i.special&&!a.specialWas))||dt>=42))alucardDetach(f,a,t);
   if(a.phase==='fall'){a.gravityMultiplier=.8;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.3);}
   else if(dt<10){a.phase='mist';f.intangible=Math.max(f.intangible,2);f.vx=clamp(i.x,-1,1)*6;f.vy=-12;a.gravityMultiplier=0;}
   else{a.phase='bat';a.gravityMultiplier=0;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*7,.8);f.vy=moveToward(f.vy,i.y>.3?i.y*5:-8.6,.8);if(Math.abs(i.x)>.2)f.face=Math.sign(i.x);}
   a.specialWas=!!i.special;
  }
 },
 boxes(f,a,w){const s=w.shape,reach=a.wolf?83:({jab:105,jab2:110,jab3:124,heavy:131,low:116,dashAttack:124,smash:160,fair:135,bair:125})[a.type]??125,h=a.wolf?27:51;
  const p=s==='up'?[0,-28,0,a.wolf?-96:-142]:s==='down'?[0,-32,8,37]:s==='back'?[0,-h,-reach,-h]:s==='low'?[0,-16,reach,-16]:s==='spin'?[-56,-h,56,-h]:[0,-h,reach,-h];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='spin'?27:a.type.includes('smash')?21:17,window:w,modifiers:w}];
 },
 hurtboxes(f){if(alucardWolf(f))return[{part:'head',x:f.x+f.face*30,y:f.y-31,r:19},{part:'torso',x:f.x,y:f.y-25,r:24},{part:'legs',x:f.x-f.face*25,y:f.y-13,r:16}];const bat=f.attack?.phase==='bat',low=[3,11,22,32,36].includes(alucardPose(f));if(bat)return[{part:'head',x:f.x,y:f.y-35,r:15},{part:'torso',x:f.x,y:f.y-25,r:21}];return[{part:'head',x:f.x,y:f.y-(low?45:94),r:15},{part:'torso',x:f.x,y:f.y-(low?25:55),r:22},{part:'legs',x:f.x,y:f.y-14,r:16}];},
 projectile(q,f,o,r){
  if(f.respawn||q.age>=q.life){q.dead=true;return true;}
  if(q.kind==='shield'){if(q.age>=54)alucardFireShield(q);return true;}
  q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;
  if(q.kind==='familiar'&&q.variant===0)q.y=q.baseY+Math.sin(q.age*.22)*18;
  const p=platforms.find(p=>p.main);if(q.x<-900||q.x>2340||q.y>1400||q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90){q.dead=true;return true;}
  for(const target of BattlePlayers.targets(f)){if(q.dead)break;alucardObjectHit(q,f,target,{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius});}
  return true;
 },
 cpu(f,o,i,clear){const a=f.attack;if(a?.alucardFlight){i.x=Math.sign(720-f.x);i.y=-1;i.special=false;return;}if(a?.alucardSummon)i.specialHeld=false;if(!a&&f.grounded&&Math.abs(o.x-f.x)>160&&Math.abs(o.x-f.x)<420&&frame%89===f.id){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}}
});
function alucardObjectHit(q,f,o,b){
 if(q.hits.has(o.id)||o.respawn)return false;const protect=CombatSystem.protection(o);if(protect.intangible||protect.invincible)return false;
 const touch=CombatSystem.contact(b,o),mode=o.mode==='Hitlag'?o.frozen?.mode:o.mode,guard=['ShieldStart','ShieldHold','ShieldDrop'].includes(mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!guard)return false;q.hits.add(o.id);
 if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;q.dead=true;return true;}
 const old=o.damage;CombatSystem.hit(f,o,{...AlucardMoves.dragon,type:'alucard'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,baseKnockback:3.1,knockbackGrowth:.055},b,touch);
 if(q.kind==='soul'&&o.damage>old){f.damage=Math.max(0,f.damage-1);q.healed=true;}
 q.dead=true;return true;
}
// The placed shield blocks two frontal projectiles near its owner. It never
// stops a melee attack, a rear hit, or attacks after the owner has moved away.
function alucardField(source,f,hit,box){
 if(f.characterId!=='alucard'||!hit.projectile||!box||f.respawn)return false;const q=alucardShield(f);if(!q||Math.abs(q.x-f.x)>110||Math.abs(q.y-(f.y-46))>55||(source.x-f.x)*q.face<=0)return false;
 q.hp--;if(q.hp<=0)q.dead=true;f.alucardBlockFlash=8;GameAudio.cue('shield-hit',.6,f);return true;
}
function alucardPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
