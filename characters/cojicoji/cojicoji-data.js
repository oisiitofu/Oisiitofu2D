'use strict';
const CojicojiMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch'};
 const a=NewcomerCore.moves(['まんじゅうパンチ','べしべし','頭突き','おしりアタック','まんじゅう振り上げ','足払い','すべり込み','テストの束でなぐる','まんじゅう山盛り','ころころまんじゅう転がし','足バタバタ','まんじゅうキック','後ろ向きキック','くるくる回転','おしりドロップ'],{
 dragon:m('まんじゅう投げ',14,[],17,0,{...opt,cojiBun:true,projectile:true,pose:40,damage:7,rangedInterval:50,rangedRearm:28}),
 dash:m('テストの答案投げ',18,[],18,0,{...opt,cojiPaper:true,projectile:true,pose:41,damage:3,rangedInterval:90,rangedRearm:60}),
 rise:m('ふわふわ飛ぶ',9,[w(9,16,'spin',{pose:42,damage:4})],58,14,{...opt,cojiFloat:true,pose:42,damage:4,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:9}),
 gale:m('おひるね',20,[],130,0,{...opt,cojiSleep:true,pose:45,damage:0}),
 airDrop:m('空中おひるね',20,[],130,12,{...opt,cojiSleep:true,aerial:true,pose:45,damage:0})
 },'punch',100),poses={jab:6,jab2:7,jab3:9,heavy:9,up:8,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:6,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;
 a.downsmash.activeFrames[1].pose=14;a.getupAttack.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function cojiDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
const CojicojiRules=NewcomerCore.create('cojicoji',CojicojiMoves,{
 reset(){for(const f of fighters)if(f.characterId==='cojicoji')f.cojiBunCooldown=f.cojiPaperCooldown=f.cojiSleepCooldown=0;},
 status(f){for(const k of['cojiBunCooldown','cojiPaperCooldown','cojiSleepCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));if(a.cojiSleep)f.cojiSleepCooldown=720;},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.cojiBun&&t===14&&!a.fired){a.fired=true;r.spawn(f,{kind:'bun',x:f.x+f.face*25,y:f.y-38,vx:f.face*8,vy:-4.8,radius:12,damage:7,life:72});f.cojiBunCooldown=50;}
  if(a.cojiPaper&&t===18&&!a.fired){a.fired=true;for(const lane of[-1,0,1])r.spawn(f,{kind:'paper',x:f.x+f.face*27,y:f.y-38,vx:f.face*7.2,vy:lane*2.7,lane,originY:f.y-38,radius:10,damage:3,life:44});f.cojiPaperCooldown=90;}
  if(a.cojiSleep){f.vx*=.7;a.pose=t<20?3:45;if(!a.cojiWake&&t>=45&&(i.jump||i.jab||i.heavy||i.smash||i.grab||Math.abs(i.x)>.6)){a.pose=37;cojiDuration(f,a,t+6);a.cojiWake=true;}
   if(a.cojiWake){a.pose=37;return;}if(a.originGrounded&&f.grounded&&[60,90,120].includes(t)&&!a.eventsDone.has('heal'+t)){a.eventsDone.add('heal'+t);f.damage=Math.max(0,f.damage-1);ring(f.x,f.y-25,'#ffdf83',35);}}
  if(a.cojiFloat){f.fastFall=false;if(t<9){f.vx*=.8;return;}if(!a.floatStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){cojiDuration(f,a,t+62);return;}}
   if(!a.floatStarted){a.floatStarted=true;a.floatAt=t;f.recovered=true;f.grounded=false;f.fastFall=false;cojiDuration(f,a,t+58);a.activeFrames=[CombatData.window(t,t+7,'spin',{pose:42,damage:4})];}
   const dt=t-a.floatAt;a.pose=dt<12?42:dt<28?43:44;a.gravityMultiplier=0;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*(dt<20?3:6),.35);f.vy=dt<20?-7.2:dt<34?-2.5:1.2;
   if(dt>=34&&i.y>.6&&!a.ended){a.ended=true;a.gravityMultiplier=1;cojiDuration(f,a,t+4);}
  }
 },
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;
  q.x+=q.vx;if(q.kind==='bun'){q.vy+=.23;q.y+=q.vy;}else{q.y=q.originY+q.vy*q.age+Math.sin(q.age*.23)*5;}
  const p=platforms.find(p=>p.main),floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y);if(floor||q.x<-900||q.x>2340||q.y>1400||q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90){q.dead=true;return true;}
  const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||target.respawn||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(!touch&&!shield)continue;q.hits.add(target.id);if(target.attack?.counterWindow&&target.timer>=target.attack.counterWindow[0]&&target.timer<=target.attack.counterWindow[1]){attack(target,target.attack.counterMove);target.inv=target.attack.totalFrames;}else CombatSystem.hit(f,target,{...CojicojiMoves.dragon,type:'coji'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,baseKnockback:q.kind==='paper'?1.8:3.4,knockbackGrowth:q.kind==='paper'?.025:.055,hitstunBase:3,hitstunScale:1.3,staleMultiplier:q.stale,launchDirection:q.face,angle:q.kind==='bun'?-.65:-.25},b,touch);q.dead=true;break;}return true;
 },
 boxes(f,a,w){const h=32,reach=a.type.includes('smash')?70:57,shape=w.shape;let p=shape==='up'?[0,-25,0,-80]:shape==='down'?[0,-25,5,28]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-10,reach,-10]:shape==='spin'?[-22,-h,22,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?23:15,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,22,32,36,45].includes(cojicojiPose(f));return[{part:'head',x:f.x,y:f.y-(low?23:48),r:23},{part:'torso',x:f.x,y:f.y-(low?15:22),r:15},{part:'legs',x:f.x,y:f.y-7,r:10}];},
 cpu(f,o,i,clear){if(f.attack?.cojiFloat){clear();i.x=Math.sign(720-f.x);i.y=-1;return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if(f.damage>40&&d>330&&!(f.cojiSleepCooldown>0)){clear();i.x=0;i.y=1;i.special=true;}else if(d>140&&d<350&&!(f.cojiBunCooldown>0)){clear();i.x=0;i.y=0;i.special=true;}else if(d>180&&d<320&&!(f.cojiPaperCooldown>0)){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}}}
});
function cojicojiPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('cojicoji',{"fair":{"strike":[12,13],"windup":3},"jab3":{"strike":[6,7],"windup":3}});
