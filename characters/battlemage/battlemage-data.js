'use strict';
const BattlemageMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'staff'},a=NewcomerCore.moves(['槍突き','天撃','回転槍','大薙ぎ','槍打ち上げ','足元払い','ドラゴンダッシュ','チェイサー大薙ぎ','昇竜槍','円舞棍','空中円舞','飛槍突き','後方薙ぎ','上空突き','落花槍'],{
 dragon:m('チェイサーシュート',12,[],36,0,{...opt,bmShot:true,tether:true,projectile:true,pose:40,damage:5,rangedInterval:42,rangedRearm:24}),
 dash:m('ドラゴンファング',10,[w(10,18,'front',{pose:41,damage:9})],16,0,{...opt,bmFang:true,pose:41,damage:9,reach:155,airControlMultiplier:0,gravityMultiplier:.55}),
 rise:m('チェイサーテレポ・ライジングスピン',8,[],52,18,{...opt,bmTeleport:true,pose:42,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:18}),
 gale:m('テアナ変身',22,[],12,0,{...opt,bmTransform:true,pose:43,damage:0}),
 airDrop:m('空中テアナ変身',22,[],12,16,{...opt,bmTransform:true,aerial:true,pose:43,damage:0})
 },'staff',138),poses={jab:6,jab2:7,jab3:8,heavy:6,up:10,low:11,dashAttack:9,smash:9,upsmash:10,downsmash:11,air:12,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:10,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function battlemageTeana(f){return(f.bmTeanaTime||0)>0;}
function battlemageGauge(f){return clamp(f.bmGauge||0,0,100);}
function battlemageGate(f,type){return !(type==='dragon'&&(f.bmShotCooldown>0||BattlemageRules.objects.some(q=>q.owner===f.id&&q.kind==='chaser'&&!q.dead))||['gale','airDrop'].includes(type)&&(battlemageTeana(f)||battlemageGauge(f)<100));}
function battlemageDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function battlemageApply(f){const c=CharacterData.battlemage,s=battlemageTeana(f)?1.08:1;f.character.walkSpeed=c.walkSpeed*s;f.character.runSpeed=c.runSpeed*s;f.character.initialDashSpeed=c.initialDashSpeed*s;}
function battlemageRise(f,a,t,i){a.launchAt=t;f.grounded=false;f.recovered=true;f.fastFall=false;const dx=clamp(i.x,-1,1),dy=i.y>.3?-.35:-1;f.x+=dx*80;f.y+=dy*60;f.vx=dx*5;f.vy=-12;a.activeFrames=[CombatData.window(t+2,t+10,'up',{pose:42,damage:6})];a.motionLastEvent=t+10;battlemageDuration(f,a,t+48);ring(f.x,f.y-35,'#ef8cff',65);}
const BattlemageRules=NewcomerCore.create('battlemage',BattlemageMoves,{
 reset(){for(const f of fighters)if(f.characterId==='battlemage'){Object.assign(f,{bmOrbs:3,bmOrbTimer:0,bmGauge:0,bmTeanaTime:0,bmShotCooldown:0,bmSeenDamage:f.damage});battlemageApply(f);}},
 status(f){if(f.respawn){Object.assign(f,{bmOrbs:3,bmOrbTimer:0,bmGauge:0,bmTeanaTime:0,bmShotCooldown:0,bmSeenDamage:f.damage});battlemageApply(f);return;}const d=Math.max(0,f.damage-(f.bmSeenDamage??f.damage));f.bmSeenDamage=f.damage;
  if(!f.hitlag){f.bmShotCooldown=Math.max(0,(f.bmShotCooldown||0)-1);f.bmTeanaTime=Math.max(0,(f.bmTeanaTime||0)-1);if(++f.bmOrbTimer>=90){f.bmOrbTimer=0;f.bmOrbs=Math.min(3,(f.bmOrbs||0)+1);}if(!battlemageTeana(f))f.bmGauge=clamp(battlemageGauge(f)+.045+d*.3,0,100);}else if(!battlemageTeana(f))f.bmGauge=clamp(battlemageGauge(f)+d*.3,0,100);battlemageApply(f);
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.bmAwake=battlemageTeana(f);a.bmFinisher=['jab3','heavy','smash','upsmash','downsmash','fair','bair','dair'].includes(a.type);if(a.bmAwake&&a.bmFinisher)a.damage*=1.15;
  if(a.bmShot){a.motionLastEvent=32;a.decided=false;f.vx*=.3;}if(a.bmTransform)a.motionLastEvent=22;
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.bmShot){f.buffer=null;f.fastFall=false;f.vx=moveToward(f.vx,0,.6);if(t>=12&&!a.decided&&(!i.specialHeld||t>=32)){a.decided=true;a.tether=false;const charged=t>=28,powered=(f.bmOrbs||0)>0,cost=charged?2:1;f.bmOrbs=Math.max(0,(f.bmOrbs||0)-cost);f.bmShotCooldown=42;a.motionLastEvent=t;battlemageDuration(f,a,t+10);r.spawn(f,{kind:'chaser',bodyOrigin:true,x:f.x+a.originFace*30,y:f.y-44,vx:a.originFace*(charged?8:11),vy:clamp(i.y,-1,1)*1.2,radius:charged?23:13,damage:charged?11:powered?7:5,life:charged?42:34,charged});}}
  if(a.bmFang){if(t>=10&&t<=18){f.vx=a.originFace*7.6;if(a.originGrounded&&f.grounded){const p=platforms.find(p=>Math.abs(p.y-f.y)<3&&f.x>=p.x&&f.x<=p.x+p.w);if(p)f.vx=clamp(f.vx,p.x+3-f.x,p.x+p.w-3-f.x);}}else f.vx=moveToward(f.vx,0,.8);}
  if(a.bmTransform&&t===22&&!a.changed){a.changed=true;f.bmGauge=0;f.bmTeanaTime=600;f.bmOrbs=3;battlemageApply(f);ring(f.x,f.y-40,'#ffcf59',100);}
  if(a.bmTeleport){f.buffer=null;f.fastFall=false;if(t<8){a.aimX=clamp(i.x,-1,1);a.aimY=i.y;f.vx*=.5;f.vy=0;return;}
   if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x-20&&f.x<p.x+p.w+20&&f.y>p.y+80){NewcomerCore.escape(f,a);battlemageDuration(f,a,t+100);}else battlemageRise(f,a,t,{x:a.aimX??i.x,y:a.aimY??i.y});}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)battlemageRise(f,a,t,{x:Math.sign(720-f.x),y:-1});return;}
   const dt=t-a.launchAt;if(dt<2)f.intangible=Math.max(f.intangible,2);a.gravityMultiplier=dt<10?0:.7;if(dt<10)f.vy=-10;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.3);
  }
 },
 collision(f,i,v){const a=f.attack;if(a?.bmTeleport&&!a.ceilingEscaped&&v.oldVy<-1&&f.vy===0&&!f.grounded){a.ceilingEscaped=true;NewcomerCore.escape(f,a);a.launchAt=null;battlemageDuration(f,a,f.timer+100);}},
 onHit(f,o,hit,r){const a=f.attack;if(!a||a!==hit&&hit.projectile)return;if(!a.bmCredited){a.bmCredited=true;f.bmOrbs=Math.min(3,(f.bmOrbs||0)+1);if(!battlemageTeana(f))f.bmGauge=clamp(battlemageGauge(f)+Math.min(16,(hit.damage||a.damage)*.8),0,100);}
  if((a.bmFang||a.bmAwake&&a.bmFinisher)&&!a.bmExploded){a.bmExploded=true;if((f.bmOrbs||0)>0){f.bmOrbs--;r.spawn(f,{kind:'echo',x:o.x,y:o.y-35,vx:0,vy:0,radius:a.bmAwake?39:32,damage:a.bmFang?4:3,life:16,delay:8,face:a.originFace});}}
  if(a.type==='dair'&&!a.bmBounced){a.bmBounced=true;f.vy=-5.5;f.fastFall=false;}
 },
 boxes(f,a,w){const s=w.shape,h=42,reach=(({jab:118,jab2:121,jab3:130,heavy:140,low:124,dashAttack:137,smash:157,fair:140,bair:130,dash:148})[a.type]??126)*(a.bmAwake?1.08:1),p=s==='up'?[0,-24,0,-130]:s==='down'?[0,-29,10,37]:s==='back'?[0,-h,-reach,-h]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-58,-h,58,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='spin'?25:a.type.includes('smash')?21:17,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36].includes(battlemagePose(f));return[{part:'head',x:f.x,y:f.y-(low?38:78),r:14},{part:'torso',x:f.x,y:f.y-(low?22:44),r:18},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.kind==='echo'&&q.age<q.delay)return true;q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;
  const p=platforms.find(p=>p.main);if(q.kind==='chaser'&&(q.x<-900||q.x>2340||q.y>1400||q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90)){q.dead=true;return true;}for(const target of BattlePlayers.targets(f)){if(q.dead)break;battlemageObjectHit(q,f,target,{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius});}return true;
 },
 cpu(f,o,i,clear){const a=f.attack;if(a?.bmShot)i.specialHeld=f.timer<28&&Math.abs(o.x-f.x)>250;if(a?.bmTeleport){i.x=Math.sign(720-f.x);i.y=-1;return;}if(!a&&f.grounded&&battlemageGauge(f)>=100&&frame%20===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
function battlemageObjectHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn)return false;const protect=CombatSystem.protection(o);if(protect.intangible||protect.invincible)return false;const touch=CombatSystem.contact(b,o),mode=o.mode==='Hitlag'?o.frozen?.mode:o.mode,guard=['ShieldStart','ShieldHold','ShieldDrop'].includes(mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!guard)return false;q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;q.dead=true;return true;}CombatSystem.hit(f,o,{...BattlemageMoves.dragon,type:'battlemage'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,baseKnockback:q.kind==='echo'?2.8:3.2,knockbackGrowth:q.kind==='echo'?.045:.055,angle:-.35},b,touch);if(q.kind==='chaser')q.dead=true;return true;}
function battlemagePose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
