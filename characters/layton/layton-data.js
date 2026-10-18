'use strict';
const LaytonMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opts={special:true,newcomerHit:true,soundFamily:'staff'},support=air=>m('ルークのサポート',22,[],25,21,{...opts,lukeSupport:true,aerial:air,pose:22}),a=NewcomerCore.moves(['指差し','ステッキ','本で殴る','重い本','本の上段振り','足払い','突進・肩ぶつかり','巨大な本で薙ぎ払い','積み上げた本','ひらめきのランプ','回転ステッキ','本の扇ぎ','カバン殴り','紙吹雪','謎解きパネル'],{
 dragon:m('ひらめきのヒント',15,[],21,16,{...opts,hintCoin:true,projectile:true,pose:13,chargeFrame:5,chargeButton:'special',chargeMaxFrames:36,airControlMultiplier:.35,preserveVelocity:false}),
 dash:m('謎解きパネル',19,[],26,20,{...opts,puzzlePanel:true,projectile:true,pose:9,airControlMultiplier:.25,preserveVelocity:false}),
 rise:m('ひらめきジャンプ',14,[],146,23,{...opts,puzzleJump:true,pose:14,helpless:true,gravityMultiplier:0,airControlMultiplier:0,preserveVelocity:false,ledgeGrabStart:14}),gale:support(false),airDrop:support(true)
 },'staff',120);
 a.jab2.pose=10;a.jab3.pose=9;a.heavy.pose=9;a.upsmash.bookStack=true;a.downsmash.bulbBurst=true;a.downsmash.activeFrames=[w(22,29,'shockwave',{pose:12})];a.downsmash.pose=12;a.downsmash.activeEnd=29;a.downsmash.totalFrames=50;a.uair.pose=16;
 for(const[k,v]of Object.entries(a)){if(k.endsWith('Throw'))v.pose=({forwardThrow:9,backThrow:7,upThrow:8,downThrow:17})[k];v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:12,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};}return a;})();
// Source pose 7 swings LEFT already. Draw and measured endpoints use only the
// final fighter-facing reflection; no second local reflection is applied.
const LaytonOrigins={6:[.98,.32],7:[.07,.66],8:[.50,.07],9:[.95,.32],10:[.90,.37],11:[.92,.86],13:[.92,.40],15:[.92,.67],16:[.50,.18],17:[.93,.63]};
function laytonPoint(f,n,point=LaytonOrigins[n]||[.7,.3]){const r=LaytonArtRects.frames[n],s=NativeStrikes.scale(f,n,laytonNativeScale(n),false)*FIGHTER_SCALE;return{x:f.x+(point[0]-NewcomerArtAnchors.layton[n])*r[2]*s*f.face,y:f.y+(point[1]-1)*r[3]*s};}
function laytonDuration(f,a,total){const d=total-a.totalFrames;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;f.faf+=d;f.stateEnd+=d;}
function laytonHop(f,a,i,r){a.launched=true;a.stepCount++;a.stepAge=0;a.stepRest=0;a.requestNext=false;a.hopX=clamp(i.x,-1,1)*5.8;a.gravityMultiplier=1;f.face=Math.sign(a.hopX)||f.face;f.grounded=false;f.vx=a.hopX;f.vy=-11.8;f.fastFall=false;r.spawn(f,{kind:'step',x:f.x,y:f.y+5,vx:0,vy:0,life:50});}
function laytonFinish(f,a){if(a.finished)return;a.finished=true;a.stepRest=0;a.gravityMultiplier=1;f.vx=a.hopX*.6;f.vy=0;laytonDuration(f,a,f.timer+18);}
const LaytonRules=NewcomerCore.create('layton',LaytonMoves,{
 prepare(f,a){f.laytonSupport??=0;if(a.puzzleJump){a.stepCount=0;a.launched=a.finished=false;a.stepRest=0;a.requestNext=false;a.specialWas=true;}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.hintCoin){f.vx*=.8;if(t===15&&!a.fired){a.fired=true;const p=laytonPoint(f,13);r.spawn(f,{kind:'coin',x:p.x,y:p.y,vx:f.face*(a.chargeFrames>=12?8:12),vy:clamp(i.y,-1,1)*2,damage:6+6*a.charge,radius:11+8*a.charge,life:65});}}
  if(a.puzzlePanel){f.vx*=.7;if(t===19&&!a.fired){a.fired=true;r.spawn(f,{kind:'panel',x:f.x+f.face*104,y:f.y-43,vx:0,vy:0,radius:25,damage:3,life:100});f.laytonPanelCooldown=180;}}
  if(a.puzzleJump){f.buffer=null;f.fastFall=false;const held=!!i.specialHeld,fresh=held&&!a.specialWas||!!i.special;a.specialWas=held;if(fresh&&a.launched&&a.stepAge>=10)a.requestNext=true;
   if(t<14){f.vx=f.vy=0;}if(t===14){f.recovered=true;f.specialLandingLag=23;const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89)NewcomerCore.escape(f,a);else laytonHop(f,a,i,r);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)laytonHop(f,a,i,r);return;}
   if(a.launched&&!a.finished){f.grounded=false;if(a.stepRest){f.vx=f.vy=0;a.gravityMultiplier=0;a.stepRest++;if(a.stepRest>=6&&a.requestNext&&a.stepCount<3)laytonHop(f,a,i,r);else if(a.stepRest>=14||a.stepCount>=3&&a.stepRest>=6)laytonFinish(f,a);}else{f.vx=a.hopX;a.stepAge++;if(a.stepAge>=18){a.stepRest=1;f.vx=f.vy=0;a.gravityMultiplier=0;r.spawn(f,{kind:'step',x:f.x,y:f.y+5,vx:0,vy:0,life:35});}}}
  }
  if(a.lukeSupport){f.vx*=.75;if(t===22&&!a.fired){a.fired=true;const kind=f.laytonSupport;r.spawn(f,{kind:'luke',x:f.x+f.face*62,y:f.y,vx:0,vy:0,life:65,support:kind});f.laytonSupport=(kind+1)%3;f.laytonSupportCooldown=360;}}
 },
 collision(f,i,v,r){const a=f.attack;if(a?.puzzleJump&&a.launched&&!a.finished&&!a.escapeSide&&v.oldVy<-2&&f.vy===0&&!f.grounded){a.launched=false;NewcomerCore.escape(f,a);}},
 onHit(f,o,a,r){if(a.thinkPanel){o.laytonThink=36;o.laytonThinkOwner=f.id;}if(a.coinProjectile)r.spawn(f,{kind:'piece',x:o.x,y:o.y-42,vx:0,vy:0,life:55});},
 boxes(f,a,w){if(a.bookStack)return[{x1:f.x+f.face*20,y1:f.y-35,x2:f.x+f.face*20,y2:f.y-155,radius:25,window:w,modifiers:w}];if(a.bulbBurst)return[{x1:f.x-74,y1:f.y-37,x2:f.x+74,y2:f.y-37,radius:27,window:w,modifiers:w}];if(w.shape==='spin')return[{x1:f.x-52,y1:f.y-52,x2:f.x+52,y2:f.y-52,radius:17,window:w,modifiers:w}];const n=w.pose??a.pose,p=laytonPoint(f,n),angle=w.shape==='up'?-Math.PI/2:w.shape==='down'?.85:w.shape==='back'?Math.PI:0,len=a.type==='smash'?62:22;return[{x1:p.x,y1:p.y,x2:p.x+Math.cos(angle)*len*f.face,y2:p.y+Math.sin(angle)*len,radius:12,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,15,17,21,32,36,37].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?34:70),r:16},{part:'torso',x:f.x,y:f.y-(low?23:43),r:20},{part:'legs',x:f.x,y:f.y-13,r:16}];},
 projectile(q,f,o,r){
  if(f.respawn||q.age>=q.life){q.dead=true;return true;}
  if(['step','piece'].includes(q.kind))return true;
  if(q.kind==='luke'){if(q.age===12){if(q.support===0)r.spawn(f,{kind:'coin',x:q.x+q.face*20,y:q.y-40,vx:q.face*11,vy:0,damage:6,radius:12,life:55});else if(q.support===1)r.spawn(f,{kind:'apple',x:q.x,y:q.y-50,vx:-q.face*2,vy:-4,life:100,radius:15});else r.spawn(f,{kind:'panel',x:q.x+q.face*55,y:q.y-42,vx:0,vy:0,damage:3,radius:25,life:80});}return true;}
  q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;
  if(q.kind==='apple'){q.vy+=.25;const floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y-8&&q.y>=p.y-8);if(floor){q.y=floor.y-8;q.vx=q.vy=0;}for(const target of fighters)if(!target.respawn&&Math.hypot(target.x-q.x,target.y-30-q.y)<38){target.damage=Math.max(0,target.damage-5);q.dead=true;break;}return true;}
  const main=platforms.find(p=>p.main);if(q.kind==='coin'&&(platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<p.y&&q.y>=p.y)||q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90)){q.dead=true;return true;}
  const b=q.kind==='panel'?{x1:q.x,y1:q.y-18,x2:q.x,y2:q.y+18,radius:q.radius}:{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...LaytonMoves.dragon,type:q.kind,projectile:true,thinkPanel:q.kind==='panel',coinProjectile:q.kind==='coin',charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,a,b,touch);q.dead=true;}}return true;
 },
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main),dx=o.x-f.x;if(a?.hintCoin){clear();i.x=0;i.y=clamp((o.y-f.y)/220,-1,1);i.specialHeld=Math.abs(dx)>270&&a.chargeFrames<24;}if(a?.puzzleJump){clear();i.x=a.escapeSide||Math.sign(p.x+p.w/2-f.x);i.y=-1;i.specialHeld=false;i.special=!!(a.stepRest>=5&&a.stepCount<3);}if(!a&&f.grounded){if(!f.laytonSupportCooldown&&frame%150===f.id){clear();i.x=0;i.y=1;i.special=true;}else if(!f.laytonPanelCooldown&&Math.abs(dx)>90&&Math.abs(dx)<170&&frame%45===f.id){clear();i.x=Math.sign(dx);i.y=0;i.special=true;}}}
});
(()=>{const reset=LaytonRules.reset,tick=LaytonRules.tick;LaytonRules.reset=()=>{reset();for(const f of fighters){f.laytonThink=0;f.laytonThinkOwner=null;if(f.characterId==='layton')f.laytonSupport=f.laytonPanelCooldown=f.laytonSupportCooldown=0;}};LaytonRules.tick=()=>{tick();for(const f of fighters){if(f.laytonThink>0){const owner=fighters[f.laytonThinkOwner];if(f.respawn||f.grabOwner||!owner||owner.respawn||owner.characterId!=='layton')f.laytonThink=0;else f.laytonThink--;if(!f.laytonThink)f.laytonThinkOwner=null;}if(f.characterId==='layton')for(const key of['laytonPanelCooldown','laytonSupportCooldown']){f[key]??=0;if(f.respawn)f[key]=0;else if(f[key]>0)f[key]--;}}};})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(LaytonMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('layton',{"fair":{"strike":[13],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[6,7],"windup":14},"jab2":{"strike":[7,6],"windup":14}});
