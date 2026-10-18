'use strict';
const ElmaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,a=NewcomerCore.moves(['ライフル連射','ストック打ち','回し蹴り','銃床打ち','対空射撃','下段キック','スライディング射撃','フルバースト','対空掃射','グレネード設置','回転射撃','ライフル薙ぎ','後方射撃','上方連射','メテオキック'],{
 dragon:m('アサルトライフル',8,[],34,16,{special:true,elmaRifle:true,projectile:true,pose:6,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,airControlMultiplier:.4,soundFamily:'saber',animationWindows:[{start:1,end:7,pose:12},{start:8,end:27,pose:6},{start:28,end:42,pose:0}]}),
 dash:m('バトルステップ',8,[],36,18,{special:true,battleStep:true,pose:13,airControlMultiplier:0,gravityMultiplier:.35,soundFamily:'wind',intangibleFrames:[{start:9,end:10}],animationWindows:[{start:1,end:7,pose:3},{start:8,end:16,pose:13},{start:17,end:32,pose:6},{start:33,end:44,pose:0}]}),
 rise:m('ブーストドッジ・追撃',8,[],92,24,{special:true,boostDodge:true,pose:4,helpless:true,airControlMultiplier:0,gravityMultiplier:.65,soundFamily:'wind',animationWindows:[{start:1,end:7,pose:3},{start:8,end:38,pose:4},{start:39,end:100,pose:5}]}),
 gale:m('OCG召喚・搭乗',18,[],24,18,{special:true,ocgSummon:true,pose:0,soundFamily:'saber'}),
 airDrop:m('OCG召喚・空中搭乗',18,[],24,18,{special:true,ocgSummon:true,aerial:true,pose:5,soundFamily:'saber'})
 },'saber',150);
 for(const[k,n]of Object.entries({jab:6,jab2:7,jab3:9,heavy:7,dashAttack:13,fair:7,smash:6,bair:6,grab:16,downsmash:3})){a[k].pose=n;a[k].animation.accelerationPose=n;}
 a.downsmash.activeFrames=[w(22,26,'shockwave',{pose:3})];a.downsmash.activeEnd=26;a.downsmash.totalFrames=49;
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation.anticipationPose=3;v.animation.lean=0;v.animation.lunge=0;v.animation.impactScale=1;}
 return a;
})();
const ElmaOCGPoseMap=[40,41,42,43,44,45,46,46,48,49,50,51,52,53,44,50,46,43,54,50,43,55,55,23];
const ElmaOCGMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,a={};
 for(const[k,v]of Object.entries(ElmaMoves)){const map=n=>ElmaOCGPoseMap[n]??n;a[k]={...v,ocg:true,damage:v.damage*1.12,pose:map(v.pose),timeline:v.timeline.map(e=>({...e})),activeFrames:v.activeFrames.map(e=>({...e,pose:map(e.pose??v.pose)})),animation:{...v.animation,anticipationPose:43,accelerationPose:map(v.pose),recoveryPose:40},animationWindows:v.animationWindows?.map(e=>({...e,pose:map(e.pose)}))};}
 a.bair.pose=47;a.bair.animation.accelerationPose=47;a.bair.activeFrames=a.bair.activeFrames.map(e=>({...e,pose:47}));
 a.dragon=m('OCG・機爪コンボ',8,[w(8,12,'front',{pose:46}),w(20,24,'spin',{pose:50})],22,18,{ocg:true,special:true,newcomerHit:true,pose:46,damage:8,reach:170,rehitRate:12,soundFamily:'claw'});
 a.dash=m('OCG・格闘ブースト',8,[w(8,17,'front',{pose:53})],28,22,{ocg:true,special:true,clawBoost:true,newcomerHit:true,pose:53,damage:14,reach:165,airControlMultiplier:0,gravityMultiplier:.2,soundFamily:'claw',canClank:false,animationWindows:[{start:1,end:7,pose:43},{start:8,end:33,pose:53},{start:34,end:45,pose:40}]});
 a.rise=m('OCG・上昇ブースト・ホバー',9,[],91,28,{ocg:true,special:true,ocgHover:true,pose:44,helpless:true,airControlMultiplier:0,gravityMultiplier:.65,soundFamily:'wind',animationWindows:[{start:1,end:8,pose:43},{start:9,end:45,pose:44},{start:46,end:100,pose:45}]});
 a.gale=m('OCG・グレネード連射・降機',8,[],36,20,{ocg:true,special:true,ocgGrenades:true,projectile:true,pose:52,soundFamily:'earth'});a.airDrop={...a.gale,aerial:true};
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:43,accelerationPose:v.pose,recoveryPose:40,lean:0,lunge:0,impactScale:1};}
 return a;
})();
function applyElmaOCG(f){f.ocgTime??=0;f.ocgCooldown??=0;const active=f.ocgTime>0,c=f.character;c.weight=active?118:94;c.runSpeed=active?6.2:7.2;c.airSpeed=active?6.2:7.6;c.airAcceleration=active?.45:.65;c.gravity=active?.6:.54;c.fallSpeed=active?15:14;const size=BattleSize.geometry(f);c.ecb={radius:(active?25:17)*size,height:(active?145:118)*size};c.shieldSize=(active?66:53)*size;c.shieldOffset=[0,(active?-72:-60)*size];}
const ElmaRules=NewcomerCore.create('elma',ElmaMoves,{
 prepare(f,a){applyElmaOCG(f);a.originFace=f.face;if(a.battleStep){a.stepX=a.originFace;a.stepY=0;a.stepKind='forward';}if(a.clawBoost){a.latched=false;a.motionX=a.originFace;}if(a.boostDodge||a.ocgHover){a.aim=0;a.launched=false;a.secondBoost=false;a.clearing=false;a.fuel=24;a.specialWas=true;}},
 action(f,i,r){const a=f.attack,t=f.timer,p=platforms.find(p=>p.main);if(a.elmaRifle){if(f.grounded)f.vx=clamp(i.x,-1,1)*f.character.walkSpeed*.65;const charged=a.chargeFrames>=12;if((t===8||!charged&&(t===13||t===18))&&!a.eventsDone.has('rifle'+t)){a.eventsDone.add('rifle'+t);r.spawn(f,{bodyOrigin:true,kind:charged?'beam':'shot',x:f.x+a.originFace*65,y:f.y-94,vx:a.originFace*(charged?18:14),vy:clamp(i.y,-1,1)*3,radius:charged?18:10,damage:charged?12+9*a.charge:4.5,life:75});}}
  if(a.battleStep){f.buffer=null;f.face=a.originFace;if(t===8){if(Math.abs(i.y)>.5&&Math.abs(i.x)<.4){a.stepX=0;a.stepY=Math.sign(i.y);a.stepKind=i.y>0?'slide':'high';}else{a.stepX=Math.abs(i.x)>.25?Math.sign(i.x):a.originFace;a.stepY=clamp(i.y,-1,1)*.25;a.stepKind=a.stepX===a.originFace?'forward':'retreat';}if(a.stepY<0){f.grounded=false;}}
   if(t>=8&&t<=16){f.vx=a.stepX*9;f.vy=a.originGrounded&&a.stepY>=0?0:a.stepY*7;}else if(t>16){a.gravityMultiplier=1;f.vx*=.7;}
   if(t===18||a.stepKind==='retreat'&&t===23){const slide=a.stepKind==='slide';r.spawn(f,{bodyOrigin:true,kind:slide?'beam':'shot',x:f.x+a.originFace*65,y:f.y-(slide?27:94),vx:a.originFace*(a.stepKind==='forward'?17:14),vy:a.stepKind==='high'?-3:0,radius:slide?13:10,damage:slide?9:a.stepKind==='retreat'?5:8,life:55});}
  }
  if(a.clawBoost){f.buffer=null;f.face=a.originFace;if(t>=8&&t<=17){f.vx=a.latched?0:a.motionX*9;f.vy=0;}else if(t>=23&&t<=33&&!a.latched){f.vx=clamp((a.origin.x-f.x)/Math.max(1,34-t),-10,10);}else if(t>=34&&!a.latched)f.vx=0;else f.vx*=.75;}
  if(a.boostDodge||a.ocgHover){f.buffer=null;f.fastFall=false;const launch=a.ocgHover?9:8;if(t<launch){f.vx=f.vy=0;a.aim=clamp(i.x,-1,1);}if(t===launch){a.launched=true;a.boostStart=t;f.grounded=false;f.recovered=true;f.specialLandingLag=a.ocgHover?28:24;f.vx=a.aim*6;f.vy=-18;if(f.y-f.character.ecb.height>=p.y+89&&f.x>p.x&&f.x<p.x+p.w){a.clearing=true;NewcomerCore.escape(f,a);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,.65);if(!a.escapeSide){a.boostStart=t;f.vx=0;f.vy=-19;}a.specialWas=!!i.special;return;}
   if(a.launched){if(f.y<=p.y-5)a.clearing=false;f.vx=moveToward(f.vx,a.clearing?0:clamp(i.x,-1,1)*(a.ocgHover?6:7),.35);
    if(a.boostDodge&&t<a.boostStart+11){f.vy=-15;a.gravityMultiplier=0;}else if(a.ocgHover&&a.fuel>0&&(t<a.boostStart+5||i.specialHeld)){a.fuel--;f.vy=-10;a.gravityMultiplier=0;}else a.gravityMultiplier=.65;
    if(a.boostDodge&&t>=a.boostStart+12&&t<=a.boostStart+34&&!a.secondBoost&&i.special&&!a.specialWas){a.secondBoost=true;a.boostStart=t;f.vy=-17;const dx=i.x||a.originFace,dy=clamp(i.y,-1,.4),len=Math.hypot(dx,dy)||1;r.spawn(f,{bodyOrigin:true,kind:'shot',x:f.x+dx/len*55,y:f.y-65,vx:dx/len*16,vy:dy/len*16,radius:11,damage:7,life:65});}}
   a.specialWas=!!i.special;
  }
  if(a.ocgSummon&&t===18&&!a.eventsDone.has('ocg')){a.eventsDone.add('ocg');f.ocgTime=360;applyElmaOCG(f);}
  if(a.ocgGrenades){if([8,15,22].includes(t))r.spawn(f,{bodyOrigin:true,kind:'grenade',x:f.x+a.originFace*45,y:f.y-80,vx:a.originFace*(3+(t-8)/7*2),vy:-7,gravity:.35,radius:13,damage:9,life:55});if(t===24){a.ejected=true;f.ocgTime=0;f.ocgCooldown=90;applyElmaOCG(f);if(!f.grounded)f.vy=-4;}}
  if(a.type==='downsmash'&&t===22&&!a.eventsDone.has('grenade')){a.eventsDone.add('grenade');for(const side of [-1,1])r.spawn(f,{bodyOrigin:true,kind:'grenade',x:f.x+side*35,y:f.y-20,vx:side*2,vy:-4,gravity:.35,radius:13,damage:8,life:35});}
 },
 collision(f,i,v){const a=f.attack,p=platforms.find(p=>p.main);if(a&&(a.boostDodge||a.ocgHover)&&a.launched&&!a.escapeSide&&v.oldVy<-2&&f.vy===0&&!f.grounded){a.clearing=true;NewcomerCore.escape(f,a);}},
 onHit(f,o,a){if(a.clawBoost)f.attack.latched=true;},
 boxes(f,a,w,t){const ocg=a.ocg,back=w.shape==='back',up=w.shape==='up',down=w.shape==='down',low=w.shape==='low',y=low?-20:up?(ocg?-105:-75):down?-45:ocg?(back?-96:-75):a.type==='dashAttack'?-30:['jab3','fair'].includes(a.type)?-60:-94,x=up?(ocg?55:0):down?8:back?(ocg?-8:-20):ocg?110:20,angle=up?-Math.PI/2:down?Math.PI/2:back?Math.PI:0,reach=ocg&&up?85:ocg&&back?40:(w.reach??a.reach)*FIGHTER_SCALE*.65;
  if(w.shape==='spin')return[{x1:f.x-60,y1:f.y-(ocg?70:62),x2:f.x+60,y2:f.y-(ocg?70:62),radius:ocg?29:23,window:w,modifiers:w}];if(w.shape==='shockwave')return[{x1:f.x-65,y1:f.y-15,x2:f.x+65,y2:f.y-15,radius:22,window:w,modifiers:w}];return[{x1:f.x+x*f.face,y1:f.y+y,x2:f.x+(x+Math.cos(angle)*reach)*f.face,y2:f.y+y+Math.sin(angle)*reach,radius:ocg?23:15,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,13,17,20,32,36,43,53].includes(pose(f)),ocg=f.ocgTime>0;return[{part:'head',x:f.x+f.face*8,y:f.y-(low?45:ocg?121:110),r:ocg?20:15},{part:'torso',x:f.x,y:f.y-(low?26:ocg?77:66),r:ocg?30:21},{part:'legs',x:f.x,y:f.y-18,r:ocg?25:18}];},
 projectile(q,f,o,r){if(!['shot','beam','grenade','blast'].includes(q.kind))return false;if(q.dead||f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;if(q.kind==='grenade')q.vy+=q.gravity;q.x+=q.vx;q.y+=q.vy;const p=platforms.find(p=>p.main),floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y),solid=q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90;
  if(q.kind==='grenade'){if(floor||solid||q.age>=q.life-1){q.dead=true;r.spawn(f,{kind:'blast',sourceType:q.sourceType,x:q.x,y:floor?floor.y-15:q.y,vx:0,vy:0,radius:68,damage:q.damage,life:9});}return true;}
  if(q.kind!=='blast'&&(floor||solid)){q.dead=true;return true;}if(q.kind==='blast'&&q.age>3)return true;const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...ElmaMoves.dragon,type:q.kind,projectile:true,charge:0,damage:q.damage,sourceType:q.sourceType,staleMultiplier:q.stale,launchDirection:q.face,angle:q.kind==='blast'?-1.15:-.3};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;q.dead=true;}else{CombatSystem.hit(f,o,a,b,touch);if(q.kind==='shot'||shield)q.dead=true;}}}return true;},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.elmaRifle){i.specialHeld=Math.abs(o.x-f.x)>270&&a.chargeFrames<35;i.y=clamp((o.y-f.y)/160,-1,1);}if(a?.battleStep){clear();i.x=Math.abs(o.x-f.x)<130?-f.face:f.face;i.y=0;}if(a?.boostDodge||a?.ocgHover){clear();i.x=f.y>p.y+90&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):Math.sign(720-f.x);i.y=-1;i.specialHeld=!!a.ocgHover&&a.fuel>0;if(a.boostDodge&&!a.secondBoost&&!a.escapeSide&&f.timer===a.boostStart+16)i.special=true;}if(!a&&f.grounded&&!f.ocgTime&&f.ocgCooldown<=0&&frame%300===f.id){clear();i.special=true;i.y=1;}}
});
(()=>{const reset=ElmaRules.reset,tick=ElmaRules.tick;ElmaRules.reset=()=>{reset();for(const f of fighters)if(f.characterId==='elma'){f.ocgTime=f.ocgCooldown=0;applyElmaOCG(f);}};ElmaRules.tick=()=>{tick();for(const f of fighters)if(f.characterId==='elma'){if(f.respawn){f.ocgTime=f.ocgCooldown=0;}if(f.ocgCooldown>0)f.ocgCooldown--;if(f.ocgTime>0){f.ocgTime--;if(!f.ocgTime&&f.attack?.ocg&&!f.attack.ejected)f.ocgTime=1;else if(!f.ocgTime)f.ocgCooldown=90;if(f.ledge){f.ocgTime=0;f.ocgCooldown=90;}}applyElmaOCG(f);}};})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(ElmaMoves.dragon,{rangedInterval:48,rangedRearm:24});
Object.assign(ElmaOCGMoves.dragon,{rangedInterval:54,rangedRearm:24});
Object.assign(ElmaOCGMoves.gale,{rangedInterval:54,rangedRearm:24});
Object.assign(ElmaOCGMoves.airDrop,{rangedInterval:54,rangedRearm:24});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('elma',{"bair":{"strike":[7,10],"windup":14},"smash":{"strike":[13,9],"windup":14},"fair":{"strike":[12,13],"windup":14},"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14}});
