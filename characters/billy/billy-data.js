'use strict';
const BillyMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch',tether:true},a=NewcomerCore.moves(['リボルバージャブ','ガンバット','至近距離連射','クイックドロー','ガンアッパー','ロースピンキック','スターライト・サンシャイン','クリアランス・タイム','スターライト乱射','スピニングショット','スピンショット','ツインショット','バックショット','逆さクロスファイア','リコイルバウンスショット'],{
 dragon:m('フルファイアパワー',10,[],70,0,{...opt,billyVolley:true,pose:31,damage:5,projectile:true,rangedInterval:24,gravityMultiplier:.8,airControlMultiplier:.25}),
 dash:m('ローリングショット',6,[w(6,12,'spin',{pose:34,index:0,damage:5,meleeCoverage:true,angle:-.8})],39,0,{...opt,billyRoll:true,pose:34,damage:5,gravityMultiplier:0,airControlMultiplier:0}),
 rise:m('フラッシュスピン',8,[],70,14,{...opt,tether:false,billyFlash:true,pose:37,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12}),
 gale:m('スタンディスティル',12,[],65,0,{...opt,billyClearance:true,pose:40,damage:4,projectile:true,rangedInterval:32,gravityMultiplier:.75,airControlMultiplier:.15}),
 airDrop:m('空中クリアランス',12,[],65,12,{...opt,billyClearance:true,pose:40,damage:4,projectile:true,rangedInterval:32,aerial:true,gravityMultiplier:.75,airControlMultiplier:.15})
 },'punch',112),p={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;
 a.downsmash.activeFrames[1].pose=25;a.downsmash.activeFrames[1].shape='front';
 for(const type of['jab3','heavy','smash','upsmash','downsmash','air','fair','bair','uair','dair','dragon','dash','rise','gale','airDrop'])a[type].soundFamily='gun';
 a.upsmash.authoredEffectCoverage=true;a.uair.authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:11,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function billyHero(f){return Math.min(5,Math.floor((f.billyHits||0)/4));}
function billyGate(f,type){if(type==='dash'&&!f.grounded&&f.newSideUsed)return false;return !(['dragon','gale','airDrop'].includes(type)&&BillyRules.objects.filter(q=>q.owner===f.id&&q.kind==='bullet'&&!q.dead).length>=6);}
function billyLand(){return false;} // Common landing continuation keeps the action/hit IDs.
function billyDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function billyFire(f,r,{angle=0,damage=5,strong=false,x=58,y=-54,speed=14,...extra}={}){if(r.objects.filter(q=>q.owner===f.id&&q.kind==='bullet'&&!q.dead).length>=6)return false;
 const face=f.face;r.spawn(f,{kind:'bullet',x:f.x+face*x*(Math.cos(angle)<0?-1:1),y:f.y+y,vx:face*Math.cos(angle)*speed,vy:Math.sin(angle)*speed,face,radius:strong?12:7,life:strong?32:26,damage,strong,angle,sourceType:f.attack?.type,...extra});r.spawn(f,{kind:'muzzle',x:f.x+face*x,y:f.y+y,vx:0,vy:0,life:4,damage:0,face,strong,angle});return true;}
function billyFlashStart(f,a,t,i){a.launchAt=t;a.entryX=Math.abs(i.x)>.2?Math.sign(i.x):a.originFace;a.exitX=a.entryX;f.face=a.entryX;f.grounded=false;f.recovered=true;a.activeFrames=[CombatData.window(t,t+6,'spin',{pose:37,index:0,damage:6,meleeCoverage:true,angle:-1.1})];a.activeStart=t;a.activeEnd=t+6;a.motionLastEvent=a.motionCommitEnd=t+25;billyDuration(f,a,t+53);}
const BillyRules=NewcomerCore.create('billy',BillyMoves,{
 reset(){for(const f of fighters)if(f.characterId==='billy')f.billyHits=0;},
 status(f){if(f.respawn)f.billyHits=0;},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.hero=billyHero(f);
  if(a.billyVolley){a.shots=0;a.nextShot=10;a.interval=9-Math.floor(a.hero*.6);a.motionLastEvent=a.motionCommitEnd=70;}
  if(a.billyRoll){a.motionLastEvent=a.motionCommitEnd=34;if(a.hero)a.intangibleFrames=[[8,8+Math.min(4,a.hero)]];}
  if(a.billyFlash)a.motionLastEvent=a.motionCommitEnd=38;
  if(a.billyClearance)a.motionLastEvent=a.motionCommitEnd=49;if(a.special)a.animationWindows=[{start:a.startupFrames,end:a.totalFrames,pose:a.pose,phase:'follow-through'}];
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);
  if(a.type==='downsmash')f.face=t>=a.activeFrames[1].start&&t<=a.activeEnd?-a.originFace:a.originFace;
  if(a.type==='dair'&&a.bouncedAt&&t<a.bouncedAt+5){f.fastFall=false;f.vy=-6;}
  if(a.billyVolley){f.vx*=.65;if(t>=8&&a.holding==null)a.holding=held;
   if(a.holding&&!held&&a.shots&&!a.finishAt&&!a.done){a.finishAt=Math.max(t+4,a.lastShot+6);a.motionLastEvent=a.motionCommitEnd=a.finishAt;billyDuration(f,a,a.finishAt+17);}
   if(!a.done&&!a.finishAt&&t>=a.nextShot){const crouch=a.holding;a.pose=crouch?32:31;billyFire(f,r,{damage:crouch?2.4:6,y:crouch?-31:-54});a.shots++;a.lastShot=t;a.nextShot=t+a.interval;
    if(!a.holding){a.done=true;a.motionLastEvent=a.motionCommitEnd=t;billyDuration(f,a,t+17);}else if(a.shots>=6){a.finishAt=t+6;a.motionLastEvent=a.motionCommitEnd=a.finishAt;billyDuration(f,a,a.finishAt+17);}}
   if(a.finishAt&&t>=a.finishAt&&!a.done){a.done=true;a.recoilAt=t;a.pose=32;billyFire(f,r,{damage:10+a.hero*.4,strong:true,y:-31,speed:18});}
   if(a.recoilAt&&t>a.recoilAt+1)a.pose=33;else if(a.holding&&a.shots&&!a.recoilAt)a.pose=32;
  }
  if(a.billyRoll){f.fastFall=false;const speed=7+a.hero*.2;if(t<6){f.vx*=.5;f.vy*=.3;}
   else if(t<=18){a.pose=34;f.vx=a.originFace*speed;if(!f.grounded)f.vy=2;}
   else if(t<=30){const theta=(t-19)/12*Math.PI;f.grounded=false;f.vx=a.originFace*speed*Math.cos(theta);f.vy=-speed*Math.sin(theta);a.pose=35;}
   else{a.gravityMultiplier=1;a.pose=36;f.vx*=.6;if(t===31){a.finishFace=Math.abs(i.x)>.25?Math.sign(i.x):a.originFace;f.face=a.finishFace;}if(t===34)billyFire(f,r,{damage:9,strong:true,y:-30,speed:17});}
   if(t===10||t===22)billyFire(f,r,{damage:3,x:42,y:-26,angle:t===22?Math.PI:0});
  }
  if(a.billyFlash){f.fastFall=false;if(t<8){f.vx*=.5;f.vy=0;return;}
   if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);billyDuration(f,a,t+120);}else billyFlashStart(f,a,t,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)billyFlashStart(f,a,t,i);return;}
   const d=t-a.launchAt;if(d>=5&&d<13&&Math.abs(i.x)>.2)a.exitX=Math.sign(i.x);
   if(d<13){a.pose=37;f.vx=a.entryX*5.8;f.vy=-13+d*.25;}
   else if(d<18){a.pose=38;f.vx=lerp(a.entryX*5.8,a.exitX*8,(d-12)/5);f.vy=-6;f.face=a.exitX;}
   else if(d<30){a.pose=39;f.face=a.exitX;f.vx=a.exitX*8;f.vy=-6+(d-18)*.36;if(d===24)billyFire(f,r,{damage:10,strong:true,angle:-.15,y:-42,speed:17});}
   else{a.pose=60;a.gravityMultiplier=1;f.vx*=.98;}
  }
  if(a.billyClearance){f.fastFall=false;f.vx*=.65;if(a.chargeMode==null&&t>=9)a.chargeMode=held;
   if(!a.chargeMode){a.pose=40;if([12,18,24].includes(t))billyFire(f,r,{angle:[-.5,0,.5][(t-12)/6],damage:4,x:45,y:-48});if(t===24){a.motionLastEvent=a.motionCommitEnd=t;billyDuration(f,a,t+20);}}
   else if(!a.released){a.pose=41;if(t>=12&&(!held||t>=48)){a.released=t;a.level=t>=40?2:t>=24?1:0;a.motionLastEvent=a.motionCommitEnd=t;billyDuration(f,a,t+24);billyFire(f,r,{damage:[10,15,21][a.level],strong:true,x:62,y:-38,speed:18+a.level*2,pierce:a.level===2});}}
  }
  if(a.special)a.animationWindows=[{start:a.startupFrames,end:a.totalFrames,pose:a.pose,phase:'follow-through'}];
 },
 onHit(f,o,a){f.billyHits=clamp((f.billyHits||0)+1,0,20);if(f.attack?.type==='dair'&&!f.attack.bouncedAt){f.attack.bouncedAt=f.timer;f.fastFall=false;f.vy=-6;}},
 collision(f,i,v){if(f.attack?.type==='dair'&&f.grounded&&!f.attack.bouncedAt&&f.timer>=f.attack.activeStart){f.attack.bouncedAt=f.timer;f.grounded=false;f.fastFall=false;f.vy=-6;}},
 projectile(q,f){if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y<-700||q.y>1400){q.dead=true;return true;}if(q.kind!=='bullet')return true;
  q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,q.radius,q.radius*2)){q.dead=true;return true;}
  const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const o of BattlePlayers.targets(f)){if(q.dead||q.hits.has(o.id)||CombatSystem.protection(o).intangible)continue;const touch=CombatSystem.contact(b,o),mode=o.mode==='Hitlag'?o.frozen?.mode:o.mode,shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)continue;q.hits.add(o.id);const priorHits=f.stats.hits;CombatSystem.hit(f,o,{...BillyMoves.dragon,type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,damageOnly:q.damage<3,staleMultiplier:q.stale,launchDirection:q.vx<0?-1:1,angle:-.7,baseKnockback:q.strong?4:2.5,knockbackGrowth:q.strong?.075:.04},b,touch);if(q.damage<3&&f.stats.hits>priorHits)f.billyHits=clamp((f.billyHits||0)+1,0,20);if(!q.pierce||shield)q.dead=true;}return true;
 },
 boxes(f,a,w){if(a.billyVolley||a.billyClearance)return[];const s=w.shape,reach=({jab:75,jab2:82,jab3:108,heavy:130,low:88,dashAttack:134,smash:160,fair:140,bair:145})[a.type]||118;
  if(a.type==='upsmash')return[-1,0,1].map(dir=>({x1:f.x,y1:f.y-50,x2:f.x+dir*68,y2:f.y-168+Math.abs(dir)*24,radius:24,window:w,modifiers:w}));
  if(a.type==='uair')return[-25,25].map(dx=>({x1:f.x+dx,y1:f.y-48,x2:f.x+dx,y2:f.y-154,radius:24,window:w,modifiers:w}));
  const p=s==='up'?[0,-35,0,-128]:s==='down'?[0,-32,20,44]:s==='back'?[0,-45,-reach,-45]:s==='low'?[0,-16,reach,-16]:s==='spin'?[-62,-42,62,-42]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?27:s==='spin'?27:20,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[11,13,21,22,25,32,34,35,36,41,43,44,45,51,52,53,56,57].includes(billyPose(f));return[{part:'head',x:f.x,y:f.y-(low?38:82),r:14},{part:'torso',x:f.x,y:f.y-(low?22:48),r:18},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 cpu(f,o,i){const a=f.attack;if(a?.billyVolley)i.specialHeld=f.timer<56;if(a?.billyClearance)i.specialHeld=a.hero>=3&&f.timer<42;if(a?.billyFlash){i.x=Math.sign(720-f.x);i.y=-1;}if(a?.billyRoll)i.x=Math.sign(o.x-f.x);}
});
function billyPose(f){if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;}
MoveMotion.define('billy',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:['low','smash','upsmash','downsmash'].includes(k)?11:0,strike:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));
