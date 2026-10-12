'use strict';
const ArusMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'},a=NewcomerCore.moves(['横斬り','盾打ち','突き','雷の斬り','見上げ斬り','低い薙ぎ払い','跳び斬り','ギガスラッシュ','真空斬り','剣の舞','全身回転斬り','ファルコン斬り','振り向き斬り','上昇斬り','ブーメラン斬り'],{
 dragon:m('ギガスラッシュ',14,[],10,12,{...opt,arusGiga:true,pose:41,projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:45,airControlMultiplier:.15}),
 dash:m('剣の舞',8,[w(8,11,'front',{pose:41,hitID:0})],70,12,{...opt,arusDance:true,pose:41,tether:true,damage:3,baseKnockback:1.2,knockbackGrowth:.02,angle:-.15,airControlMultiplier:0,canClank:false}),
 rise:m('マエルストロムライド',7,[w(7,29,'spin',{pose:45})],50,18,{...opt,arusRide:true,pose:45,tether:true,damage:6,baseKnockback:2,knockbackGrowth:.03,angle:-1.4,airControlMultiplier:0,gravityMultiplier:0,helpless:true,ledgeGrabStart:8}),
 gale:m('ディスラプティヴウェーブ',14,[],10,12,{...opt,arusWave:true,pose:47,projectile:true,airControlMultiplier:0}),
 airDrop:m('ディスラプティヴウェーブ・空中',14,[],10,14,{...opt,arusWave:true,pose:47,projectile:true,aerial:true,airControlMultiplier:0})
 },'sword',125),poses={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:9,smash:41,upsmash:15,downsmash:43,air:12,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:15,downThrow:16};for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=v.shape==='back'&&['downsmash','getupAttack'].includes(k)?14:n;}a.grab.newcomerHit=false;for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};}return a;})();
// Coordinates authored from cropped source: rear14 LEFT; up8/15 UP; down16 DOWN.
const ArusStrikePoints={6:[.66,.37,.99,.37],7:[.70,.44,.97,.34],8:[.37,.30,.37,.02],9:[.66,.47,.99,.46],11:[.63,.74,.99,.94],12:[.30,.36,.02,.10],13:[.59,.65,.99,.98],14:[.30,.38,.02,.23],15:[.23,.24,.23,.02],16:[.49,.60,.65,.98],18:[.73,.38,.96,.25],19:[.61,.25,.97,.21],41:[.66,.48,.995,.48],42:[.62,.28,.99,.02],43:[.65,.67,.99,.89],44:[.35,.25,.55,.02],45:[.65,.30,.99,.02],46:[.71,.51,.995,.51],47:[.50,.55,.50,.99]};
function arusStrike(f,n){const p=ArusStrikePoints[n];if(!p)return null;const r=ArusArtRects.frames[n],s=arusNativeScale(n)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.arus[n];return[0,2].map(j=>({x:f.x+(p[j]-anchor)*r[2]*s*f.face,y:f.y+(p[j+1]-1)*r[3]*s}));}
function arusDuration(f,a,total){const d=total-a.totalFrames;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;f.faf+=d;f.stateEnd+=d;}
function arusStartRide(f,a){a.phase='ride';a.anchor={x:f.x,y:f.y};a.rideAt=f.timer;a.pose=45;a.gravityMultiplier=0;a.animationWindows=[{start:f.timer,end:f.timer+23,pose:45,phase:'ride'}];a.activeFrames=[CombatData.window(f.timer,f.timer+22,'spin',{pose:45})];f.grounded=false;arusDuration(f,a,f.timer+40);}
function arusExitRide(f,a,i,r){a.phase='burst';a.burstAt=f.timer;a.tether=false;a.pose=46;a.activeFrames=[];a.animationWindows=[{start:f.timer,end:f.timer+9,pose:46,phase:'burst'},{start:f.timer+10,end:f.timer+16,pose:35,phase:'fall'}];a.gravityMultiplier=.7;f.face=Math.abs(i.x)>.2?Math.sign(i.x):a.launchFace;f.vx=f.face*10;f.vy=-4;const tip=arusStrike(f,46)[1];r.spawn(f,{kind:'exit',x:tip.x,y:tip.y,vx:f.face*13,vy:0,radius:14,damage:8,life:18});arusDuration(f,a,f.timer+16);}
const ArusRules=NewcomerCore.create('arus',ArusMoves,{
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.phase='startup';a.launchFace=f.face;if(a.arusDance){a.comboStage=0;a.comboStart=8;a.comboEnd=11;a.phase='dance';}if(a.arusRide)f.vy=0;},
 action(f,i,r){const a=f.attack,t=f.timer,p=platforms.find(p=>p.main);
  if(a.arusGiga){a.pose=41;f.vx*=.7;if(t===14&&!a.fired){a.fired=true;const c=a.charge||0,tip=arusStrike(f,41)[1];r.spawn(f,{kind:'giga',x:tip.x,y:tip.y,vx:f.face*(12+7*c),vy:0,radius:8+8*c,damage:7+10*c,life:18+20*c,charge:c});}}
  if(a.arusDance){const fresh=i.special||i.specialHeld&&!a.specialWas;if(a.phase==='dance'){
    a.pose=[41,42,43,44][a.comboStage];f.vx=t>=a.comboStart&&t<=a.comboEnd?f.face*2.2:f.vx*.5;
    if(a.comboStage<3&&t>a.comboEnd&&t<=a.comboEnd+9&&fresh){a.comboStage++;a.comboStart=t+5;a.comboEnd=a.comboStart+(a.comboStage===3?4:3);a.pose=[41,42,43,44][a.comboStage];a.activeFrames=[CombatData.window(a.comboStart,a.comboEnd,a.comboStage===3?'up':'front',{pose:a.pose,damage:[3,3,4,7][a.comboStage],angle:a.comboStage===3?-1.2:-.15,baseKnockback:a.comboStage===3?3.5:1.2,hitID:a.comboStage})];arusDuration(f,a,a.comboEnd+19);}
    else if(t>a.comboEnd+(a.comboStage===3?0:9)){a.phase='recover';a.tether=false;a.activeFrames=[];a.motionLastEvent=t;}
   }else f.vx*=.7;a.specialWas=!!(i.specialHeld||i.special);
  }
  if(a.arusRide){f.fastFall=false;if(t===7){f.recovered=true;f.specialLandingLag=18;if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89){NewcomerCore.escape(f,a);a.phase='escape';a.animationWindows=[{start:t,end:t+36,pose:45}];}else arusStartRide(f,a);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide){a.clearingWall=true;arusStartRide(f,a);}return;}
   if(a.phase==='ride'){const age=t-a.rideAt+1;if(age>=24)arusExitRide(f,a,i,r);else{if(!(a.clearingWall&&f.y>p.y-10))a.anchor.x+=clamp(i.x,-1,1)*.8;const x=a.anchor.x+a.launchFace*(Math.cos(age*.28)-1)*32,y=a.anchor.y-age*9.5,safe=AdolRules.clearPath(f.x,f.y,x,y,f);f.vx=safe.x-f.x;f.vy=safe.y-f.y;a.pose=45;}}
   if(a.phase==='burst'){if(t-a.burstAt<10)f.vx=f.face*10;else{a.phase='fall';a.pose=35;a.airControlMultiplier=.7;}}
  }
  if(a.arusWave){a.pose=47;f.vx*=.6;if(t===14&&!a.fired){a.fired=true;for(const face of[-1,1])r.spawn(f,{kind:'purify',face,x:f.x+face*25,y:f.y-35,vx:face*12,vy:0,radius:22,damage:8,life:16});}}
 },
 collision(f,i,v){const a=f.attack;if(a?.arusRide&&a.phase==='ride'&&v.oldVy<-2&&f.vy===0&&!f.grounded&&!a.wallEscapeUsed){a.wallEscapeUsed=true;NewcomerCore.escape(f,a);a.phase='escape';a.animationWindows=[{start:f.timer,end:f.timer+36,pose:45}];}},
 boxes(f,a,w){if(a.arusRide||w.shape==='spin')return[{x1:f.x-28,y1:f.y-38,x2:f.x+28,y2:f.y-38,radius:22,window:w,modifiers:w}];const p=arusStrike(f,w.pose??a.pose);if(p)return[{x1:p[0].x,y1:p[0].y,x2:p[1].x,y2:p[1].y,radius:11,window:w,modifiers:w,...(w.hitID!==undefined?{hitID:w.hitID}:{})}];},
 hurtboxes(f){const low=[3,11,22,32,36,37].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?32:65),r:13},{part:'torso',x:f.x,y:f.y-(low?20:38),r:17},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 projectile(q,f){if(q.kind!=='purify')return false;if(f.respawn||q.age>=q.life){q.dead=true;return true;}for(const rules of Object.values(NewcomerCore.registry))for(const shot of rules.objects){if(shot===q||shot.owner===q.owner||shot.dead||Math.hypot(shot.vx||0,shot.vy||0)<.1)continue;const dx=shot.x-(q.x+q.vx*.5),dy=shot.y-q.y;if(Math.hypot(dx,dy)<q.radius+(shot.radius||10)+Math.abs(q.vx)*.5)shot.dead=true;}return false;},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.arusRide){clear();i.x=a.escapeSide||Math.sign(p.x+p.w/2-f.x);i.y=-1;i.specialHeld=false;}if(a?.arusGiga){clear();i.specialHeld=Math.abs(o.x-f.x)>300&&a.chargeFrames<30;}if(a?.arusDance){clear();i.x=a.launchFace;i.specialHeld=false;i.special=a.phase==='dance'&&a.comboStage<3&&f.timer===a.comboEnd+2&&Math.abs(o.x-f.x)<150;}if(!a&&f.grounded&&Math.abs(o.x-f.x)<115&&Math.abs(o.y-f.y)<75&&frame%75===f.id){clear();i.special=true;i.x=Math.sign(o.x-f.x)||f.face;i.y=0;}}
});
function arusPose(f){const a=f.attack;if(a?.arusGiga||a?.arusDance||a?.arusRide||a?.arusWave)return a.pose;if(a)return CombatData.sample(a,f.timer).pose;if(['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:5,fly:21,down:22,getup:37,ledge:38,grab:17,caught:5,throw:19})[f.state]??0;}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(ArusMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(ArusMoves.gale,{rangedInterval:60,rangedRearm:30});
if(ArusMoves.airDrop)Object.assign(ArusMoves.airDrop,{rangedInterval:60,rangedRearm:30});
