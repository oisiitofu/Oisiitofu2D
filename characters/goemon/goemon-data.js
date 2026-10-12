'use strict';
const GoemonMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,a=NewcomerCore.moves(['キセル突き','キセル振り回し','回転キセル','追尾突き','キセル打ち上げ','足払い','すべり込み','大キセル振り','連続打ち上げ','回転振り回し','回転キセル','前方二連撃','後ろ蹴り・キセル','上方回転','斜め下叩きつけ'],{
 dragon:m('両替コイン・火のコイン',9,[],29,15,{special:true,coinThrow:true,projectile:true,pose:13,chargeFrame:5,chargeButton:'special',chargeMaxFrames:50,soundFamily:'staff',animationWindows:[{start:1,end:8,pose:12},{start:9,end:23,pose:13},{start:24,end:38,pose:0}]}),
 dash:m('キセルスピン',10,[w(10,32,'spin',{pose:10,damage:3}),w(36,40,'spin',{pose:10,damage:9})],20,22,{special:true,kiseruSpin:true,newcomerHit:true,pose:10,damage:3,baseKnockback:2.5,knockbackGrowth:.045,rehitRate:10,reach:160,airControlMultiplier:0,gravityMultiplier:.7,soundFamily:'staff',animationWindows:[{start:1,end:9,pose:3},{start:10,end:40,pose:10},{start:41,end:60,pose:0}]}),
 rise:m('キセルフック',9,[],99,24,{special:true,kiseruHook:true,tether:true,pose:14,helpless:true,airControlMultiplier:0,gravityMultiplier:0,soundFamily:'chain',animationWindows:[{start:1,end:8,pose:3},{start:9,end:75,pose:14},{start:76,end:108,pose:5}]}),
 gale:m('スーダンインパクト',24,[],25,18,{special:true,sudaImpact:true,pose:12,soundFamily:'saber',animationWindows:[{start:1,end:23,pose:12},{start:24,end:40,pose:22},{start:41,end:49,pose:0}]}),
 airDrop:m('スーダンインパクト・空中',24,[],25,18,{special:true,sudaImpact:true,aerial:true,pose:12,soundFamily:'saber'})
 },'staff',160);
 for(const[k,n]of Object.entries({jab2:7,jab3:10,heavy:6,dashAttack:15,smash:6,fair:16,bair:7,grab:18})){a[k].pose=n;a[k].animation.accelerationPose=n;}
 a.jab3.activeFrames=[w(9,13,'spin',{pose:10})];a.fair.activeFrames=[w(10,12,'front',{pose:16,damage:6}),w(17,19,'front',{pose:16,damage:6})];a.fair.activeEnd=19;a.fair.totalFrames=38;a.downsmash.activeFrames=[w(22,30,'spin',{pose:10})];a.downsmash.activeEnd=30;a.downsmash.totalFrames=50;a.downsmash.pose=10;
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:3,accelerationPose:v.pose,lean:0,lunge:0,impactScale:1};}
 return a;
})();
const GoemonPoweredMoves=Object.fromEntries(Object.entries(GoemonMoves).map(([k,v])=>[k,{...v,powered:true,damage:v.damage*1.25,knockbackGrowth:v.knockbackGrowth*1.1,timeline:v.timeline.map(e=>({...e})),activeFrames:v.activeFrames.map(w=>({...w,...(w.damage!==undefined?{damage:w.damage*1.25}:{})})),animation:{...v.animation}}]));
function goemonHookAnchor(f,i){const candidates=[];for(const p of platforms){for(const side of [-1,1]){const x=side<0?p.x:p.x+p.w,y=p.y,dist=Math.hypot(x-f.x,y-(f.y-45));if(y<f.y-25&&dist<=450)candidates.push({x,y,side,p,score:dist+(Math.abs(i.x)>.3&&Math.sign(x-f.x)!==Math.sign(i.x)?90:0)});}}return candidates.sort((a,b)=>a.score-b.score)[0]||null;}
function goemonRelease(f,a,early=false){a.released=true;a.releaseFrame=f.timer;a.tether=false;a.gravityMultiplier=.8;a.totalFrames=f.timer+24;a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;a.animationWindows=[{start:1,end:f.timer-1,pose:14},{start:f.timer,end:a.totalFrames,pose:4}];f.vx=early?clamp(f.input?.x||a.swingSide,-1,1)*9:-a.anchor.side*7;f.vy=early?-12:-8;f.specialLandingLag=24;}
const GoemonRules=NewcomerCore.create('goemon',GoemonMoves,{
 prepare(f,a){f.impactTime??=0;f.impactCooldown??=0;if(a.kiseruHook){a.anchor=null;a.latched=false;a.released=false;a.specialWas=true;a.swingSide=a.originFace;}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.coinThrow&&t===9&&!a.eventsDone.has('coin')){a.eventsDone.add('coin');const fire=a.chargeFrames>=12;r.spawn(f,{bodyOrigin:true,kind:fire?'firecoin':'coin',x:f.x+a.originFace*52,y:f.y-48,vx:a.originFace*(fire?13:15),vy:clamp(i.y,-1,1)*2,radius:fire?19:11,damage:(fire?10+8*a.charge:6)*(a.powered?1.25:1),life:80});}
  if(a.kiseruSpin){f.buffer=null;f.face=a.originFace;if(t>=10&&t<=32){f.vx=moveToward(f.vx,clamp(i.x,-1,1)*3.5,.6);if(!f.grounded){f.vy=moveToward(f.vy,clamp(i.y,-1,1)*2,.5);a.gravityMultiplier=0;}a.spinAngle=(t-10)*.48*a.originFace;}else if(t>32){a.gravityMultiplier=.7;f.vx*=.7;}}
  if(a.sudaImpact&&t===24&&!a.eventsDone.has('impact')){a.eventsDone.add('impact');f.impactTime=420;}
  if(a.kiseruHook){f.buffer=null;f.fastFall=false;if(t<9)f.vx=f.vy=0;if(t===9){a.anchor=goemonHookAnchor(f,i);a.latched=!!a.anchor;f.recovered=true;f.grounded=false;f.specialLandingLag=24;if(!a.anchor){a.whiff=true;a.tether=false;a.gravityMultiplier=1;a.totalFrames=42;a.motionEndFrames=42;a.FAF=43;a.animationWindows=[{start:1,end:25,pose:14},{start:26,end:42,pose:5}];}else{a.swingSide=-a.anchor.side;const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89)NewcomerCore.escape(f,a);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);a.specialWas=!!i.special;return;}
   if(a.latched&&!a.released){const p=a.anchor.p,outX=a.anchor.x+a.anchor.side*(f.character.ecb.radius+12),outside=f.y>a.anchor.y-18;
    // Stay outside the solid wall until the feet clear the selected ledge.
    const nx=outside?outX:a.anchor.x-a.anchor.side*22,ny=a.anchor.y-48;
    f.grounded=false;f.vx=clamp((nx-f.x)*.28,-13,13);f.vy=outside&&Math.abs(f.x-outX)>14?-.5:clamp((ny-f.y)*.22,-17,5);a.swingVX=f.vx;a.swingVY=f.vy;a.gravityMultiplier=0;
    if(t>=17&&i.special&&!a.specialWas){goemonRelease(f,a,true);}else if(!outside&&Math.abs(nx-f.x)<18||t>=82){goemonRelease(f,a,false);}
   }else if(a.released){f.vx=moveToward(f.vx,clamp(i.x,-1,1)*6,.15);}a.specialWas=!!i.special;
  }
 },
 collision(f,i,v){const a=f.attack;if(a?.kiseruHook&&!a.released&&a.latched&&f.grounded){goemonRelease(f,a,false);}},
 boxes(f,a,w,t){const back=w.shape==='back',up=w.shape==='up',down=w.shape==='down',low=w.shape==='low',x=up?-5:down?15:back?-17:17,y=up?-82:down?-36:low?-20:a.type==='dashAttack'?-22:-53,angle=up?-Math.PI/2:down?Math.PI/2:back?Math.PI:0,reach=(w.reach??a.reach)*FIGHTER_SCALE*.65;
  if(w.shape==='spin')return[{x1:f.x-58,y1:f.y-50,x2:f.x+58,y2:f.y-50,radius:25,window:w,modifiers:w}];return[{x1:f.x+x*f.face,y1:f.y+y,x2:f.x+(x+Math.cos(angle)*reach)*f.face,y2:f.y+y+Math.sin(angle)*reach,radius:15,window:w,modifiers:w}];},
 hurtboxes(f){const n=goemonBasePose(pose(f)),low=[3,15,17,21,32,36].includes(n);return[{part:'head',x:f.x+f.face*5,y:f.y-(low?48:83),r:21},{part:'torso',x:f.x,y:f.y-(low?27:44),r:20},{part:'legs',x:f.x,y:f.y-14,r:17}];},
 projectile(q,f,o,r){if(!['coin','firecoin'].includes(q.kind))return false;if(q.dead||f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main),floor=platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y);if(floor||q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90){q.dead=true;return true;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...GoemonMoves.dragon,type:q.kind,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:-.3};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,a,b,touch);q.dead=true;}}return true;},
 cpu(f,o,i,clear){const a=f.attack;if(a?.coinThrow){i.specialHeld=Math.abs(o.x-f.x)>240&&a.chargeFrames<30;i.y=clamp((o.y-f.y)/150,-1,1);}if(a?.kiseruSpin){clear();i.x=clamp((o.x-f.x)/90,-1,1);i.y=clamp((o.y-f.y)/100,-1,1);}if(a?.kiseruHook){clear();i.x=a.anchor?-a.anchor.side:Math.sign(720-f.x);i.y=-1;i.special=false;}if(!a&&f.grounded&&!f.impactTime&&(f.impactCooldown||0)<=0&&Math.abs(o.x-f.x)>180&&frame%240===f.id){clear();i.special=true;i.y=1;}}
});
(()=>{const reset=GoemonRules.reset,tick=GoemonRules.tick;GoemonRules.reset=()=>{reset();for(const f of fighters)if(f.characterId==='goemon')f.impactTime=f.impactCooldown=0;};GoemonRules.tick=()=>{tick();for(const f of fighters)if(f.characterId==='goemon'){f.impactTime??=0;f.impactCooldown??=0;if(f.respawn){f.impactTime=f.impactCooldown=0;}else{if(f.impactCooldown>0)f.impactCooldown--;if(f.impactTime>0&&! --f.impactTime)f.impactCooldown=180;}}};})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(GoemonMoves.dragon,{rangedInterval:40,rangedRearm:20});
