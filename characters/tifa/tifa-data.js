'use strict';
const TifaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch'},a=NewcomerCore.moves(['ジャブ','ストレート','回し蹴り','掌底','打ち上げ膝','低空スイープ','肩タックル','拳打ラッシュ','昇竜拳','旋風蹴り','ニールキック','フライングキック','後ろ回し蹴り','スピンキック','メテオストライク'],{
 dragon:m('拳打ラッシュ・かかと落とし',6,[w(6,8,'front',{pose:6,damage:3}),w(12,14,'front',{pose:7,damage:3}),w(20,23,'down',{pose:45,damage:9,baseKnockback:4,knockbackGrowth:.07})],20,20,{...opt,tifaRush:true,pose:6,damage:3,baseKnockback:1,knockbackGrowth:.01,hitstunBase:12,preserveVelocity:false,airControlMultiplier:.2}),
 dash:m('ライズビート・命中派生',8,[w(8,12,'front',{pose:42,damage:5})],23,23,{...opt,tifaBeat:true,pose:42,damage:5,baseKnockback:1,knockbackGrowth:.008,hitstunBase:18,preserveVelocity:false,airControlMultiplier:0,gravityMultiplier:.5}),
 rise:m('エアリアルコンビネーション',7,[],85,25,{...opt,tifaAerial:true,pose:41,helpless:true,ledgeGrabStart:12,preserveVelocity:false,airControlMultiplier:.35,gravityMultiplier:.8}),
 gale:m('気合',24,[],20,22,{...opt,tifaKi:true,pose:40,preserveVelocity:false,airControlMultiplier:.2}),
 airDrop:m('気合・空中',24,[],20,22,{...opt,tifaKi:true,pose:40,aerial:true,preserveVelocity:false,airControlMultiplier:.2})
 },'punch',105);
 const poses={jab:6,jab2:7,jab3:8,heavy:7,up:10,low:11,dashAttack:9,smash:7,upsmash:10,downsmash:8,air:12,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:6,ledge:8,getupAttack:11,forwardThrow:7,backThrow:14,upThrow:10,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=v.shape==='back'&&k==='getupAttack'?14:n;}
 a.downsmash.activeFrames=[w(22,26,'front',{pose:8}),w(30,34,'back',{pose:14})];a.grab.newcomerHit=false;
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};}return a;
})();
// Source poses face RIGHT. Pose14/44 already kick LEFT; pose16/45 kicks DOWN.
// Reflect the measured body segment once, using the same native anchor as art.
const TifaStrikePoints={6:[.62,.2,.985,.2],7:[.63,.17,.985,.17],8:[.45,.56,.985,.04],9:[.67,.38,.97,.30],10:[.5,.52,.78,.27],11:[.55,.7,.975,.8],12:[.48,.5,.91,.52],13:[.5,.5,.98,.5],14:[.55,.56,.025,.26],15:[.5,.60,.36,.025],16:[.58,.69,.89,.97],41:[.58,.6,.97,.36],42:[.59,.25,.98,.22],43:[.53,.62,.89,.04],44:[.55,.56,.025,.26],45:[.58,.69,.89,.97]};
function tifaStrike(f,n){const p=TifaStrikePoints[n];if(!p)return null;const r=TifaArtRects.frames[n],s=NativeStrikes.scale(f,n,tifaNativeScale(n),false)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.tifa[n],point=(x,y)=>({x:f.x+(x-anchor)*r[2]*s*f.face,y:f.y+(y-1)*r[3]*s});return[point(p[0],p[1]),point(p[2],p[3])];}
function tifaDuration(f,a,total){const d=total-a.totalFrames;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;f.faf+=d;f.stateEnd+=d;}
function tifaWindow(a,start,end,shape,n,damage,extra={}){return CombatData.window(start,end,shape,{pose:n,damage:damage*(a.powered?1.15:1),...extra});}
function tifaLaunch(f,a,i,follow=false){
 a.phase='flight';a.launchFrame=f.timer;a.launched=true;f.grounded=false;f.recovered=true;f.fastFall=false;f.specialLandingLag=25;a.gravityMultiplier=.8;
 if(!follow){a.branch='knee';f.vx=clamp(i.x,-1,1)*6;f.vy=-17.5;a.pose=41;a.followStart=f.timer+9;a.followEnd=f.timer+23;a.activeFrames=[tifaWindow(a,f.timer,f.timer+8,'up',41,6,{baseKnockback:1.3,knockbackGrowth:.015})];}
 else{a.followed=true;const horizontal=Math.abs(i.x)>Math.abs(i.y),down=!horizontal&&i.y>.4;a.branch=horizontal?'side':down?'down':'up';a.pose=horizontal?13:down?45:43;a.gravityMultiplier=horizontal?.45:down?1.25:.8;if(horizontal){f.face=Math.sign(i.x)||a.originFace;f.vx=f.face*10;f.vy=-7;}else{f.vx=clamp(i.x,-1,1)*5;f.vy=down?8:-16;}a.activeFrames.push(tifaWindow(a,f.timer+2,f.timer+11,horizontal?'front':down?'down':'up',a.pose,10,{baseKnockback:4,knockbackGrowth:.065,...(down?{meteorFrame:f.timer+5,meteorAngle:1.5}: {})}));}
 a.activeStart=a.activeFrames[0].start;a.activeEnd=a.activeFrames.at(-1).end;tifaDuration(f,a,f.timer+(follow?38:49));
}
const TifaRules=NewcomerCore.create('tifa',TifaMoves,{
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));f.tifaKiTime??=0;f.tifaKiCooldown??=0;if(f.tifaKiTime>0&&!a.tifaKi){a.powered=true;a.damage*=1.15;a.hitlagMultiplier=1.25;a.activeFrames=a.activeFrames.map(w=>({...w,...(w.damage!==undefined?{damage:w.damage*1.15}:{})}));}
  if(a.tifaBeat){a.stage=1;a.stageStart=1;a.hitStage=0;a.followUntil=0;a.specialWas=true;}
  if(a.tifaAerial){a.phase='startup';a.launched=a.followed=false;a.specialWas=true;}
 },
 action(f,i){const a=f.attack,t=f.timer;
  if(a.tifaRush){f.vx*=.7;if(t===17&&i.specialHeld){a.extended=true;a.activeFrames=[...a.activeFrames.slice(0,2),tifaWindow(a,20,22,'front',6,3),tifaWindow(a,28,30,'front',7,3),tifaWindow(a,37,40,'down',45,11,{baseKnockback:4.5,knockbackGrowth:.075})];a.activeEnd=40;tifaDuration(f,a,60);}if(a.extended&&!i.specialHeld&&!a.released&&t>=18&&t<34){a.released=true;a.activeFrames=a.activeFrames.filter(w=>w.end<t);a.activeFrames.push(tifaWindow(a,t+3,t+6,'down',45,9,{baseKnockback:4,knockbackGrowth:.07}));a.activeEnd=t+6;tifaDuration(f,a,t+26);}}
  if(a.tifaBeat){f.buffer=null;f.face=a.originFace;const held=!!i.specialHeld,fresh=!!i.special||held&&!a.specialWas;a.specialWas=held;const age=t-a.stageStart;f.vx=a.hitStage===a.stage?0:(a.stage===1?age>=7&&age<=11:age>=2&&age<=9)?a.originFace*(a.originGrounded?8:6):f.vx*.6;
   if(a.stage<3&&a.hitStage===a.stage&&fresh&&t<=a.followUntil){a.stage++;a.stageStart=t;a.hitStage=0;const up=a.stage===2&&i.y<-.4&&Math.abs(i.y)>=Math.abs(i.x);a.pose=a.stage===3?13:up?41:7;a.activeFrames.push(tifaWindow(a,t+5,t+9,up?'up':'front',a.pose,a.stage===3?11:5,{baseKnockback:a.stage===3?4.8:1,knockbackGrowth:a.stage===3?.075:.008,hitstunBase:a.stage===3?5:18,angle:up?-1.3:0}));a.activeEnd=t+9;tifaDuration(f,a,t+34);if(up){f.grounded=false;f.vy=-7;} }
  }
  if(a.tifaAerial){f.buffer=null;f.fastFall=false;const held=!!i.specialHeld,fresh=!!i.special||held&&!a.specialWas;a.specialWas=held;
   if(t<7)f.vx*=.7;if(t===7){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89){f.recovered=true;NewcomerCore.escape(f,a);}else tifaLaunch(f,a,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,.8);if(!a.escapeSide)tifaLaunch(f,a,{...i,x:Math.sign(720-f.x)});return;}
   if(a.launched&&!a.followed&&fresh&&t>=a.followStart&&t<=a.followEnd)tifaLaunch(f,a,i,true);
   if(a.branch==='side'&&t-a.launchFrame>12)f.vx*=.91;
  }
  if(a.tifaKi){f.vx*=.65;if(t===24&&!a.activated){a.activated=true;f.tifaKiTime=360;f.tifaKiCooldown=0;}}
 },
 collision(f,i,v){const a=f.attack;if(a?.tifaAerial&&a.phase==='flight'&&v.oldVy<-2&&f.vy===0&&!f.grounded&&!a.escapedCollision){a.escapedCollision=true;a.launched=false;a.activeFrames=[];a.phase='startup';NewcomerCore.escape(f,a);}},
 onHit(f,o,strike){const a=f.attack;if(a?.tifaBeat&&strike.tifaBeat){a.hitStage=a.stage;a.followUntil=f.timer+17;f.vx=0;}},
 boxes(f,a,w){if(a.tifaKi)return[];const n=w.pose??a.pose,back=w.shape==='back',up=w.shape==='up',down=w.shape==='down',low=w.shape==='low';
  if(w.shape==='spin')return[{x1:f.x-44,y1:f.y-46,x2:f.x+44,y2:f.y-46,radius:14,window:w}];
  const points=tifaStrike(f,n);if(points)return[{x1:points[0].x,y1:points[0].y,x2:points[1].x,y2:points[1].y,radius:a.powered?14:12,window:w,...(w.meteorFrame&&f.timer>=w.meteorFrame&&f.timer<=w.meteorFrame+2?{modifiers:{isMeteor:true,angle:1.5}}:{})}];
  return[{x1:f.x,y1:f.y-(low?18:48),x2:f.x+f.face*(back?-65:up||down?8:65),y2:f.y-(up?118:down?-20:low?18:48),radius:13,window:w}];
 },
 hurtboxes(f){const low=[3,11,22,32,36,37].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?35:82),r:16},{part:'torso',x:f.x,y:f.y-(low?24:46),r:20},{part:'legs',x:f.x,y:f.y-14,r:16}];},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.tifaBeat&&a.hitStage===a.stage&&a.stage<3){clear();i.specialHeld=false;i.special=!a.specialWas;i.y=a.stage===1&&o.y<f.y-35?-1:0;}if(a?.tifaAerial){clear();i.x=a.escapeSide||Math.sign(p.x+p.w/2-f.x);i.y=-1;i.specialHeld=false;i.special=a.launched&&!a.followed&&f.timer>=a.followStart&&f.timer<=a.followEnd;}if(a?.tifaRush){clear();i.specialHeld=Math.abs(o.x-f.x)<110;}if(!a&&f.grounded&&!f.tifaKiTime&&!f.tifaKiCooldown&&Math.abs(o.x-f.x)>230&&frame%150===f.id){clear();i.y=1;i.special=true;}}
});
(()=>{const reset=TifaRules.reset,tick=TifaRules.tick,stats=f=>{const c=CharacterData.tifa,p=f.tifaKiTime>0;f.character={...c,...(p?{runSpeed:c.runSpeed*1.1,initialDashSpeed:c.initialDashSpeed*1.1}: {})};f.tifaPoweredState=p;};TifaRules.reset=()=>{reset();for(const f of fighters)if(f.characterId==='tifa'){f.tifaKiTime=f.tifaKiCooldown=0;stats(f);}};TifaRules.tick=()=>{tick();for(const f of fighters)if(f.characterId==='tifa'){f.tifaKiTime??=0;f.tifaKiCooldown??=0;if(f.respawn)f.tifaKiTime=f.tifaKiCooldown=0;else{if(f.tifaKiCooldown>0)f.tifaKiCooldown--;if(f.tifaKiTime>0&&!--f.tifaKiTime)f.tifaKiCooldown=240;}if(f.tifaPoweredState!==(f.tifaKiTime>0))stats(f);}};})();
function tifaPose(f){const a=f.attack;if(a?.tifaAerial)return a.launched?a.pose:a.escapeSide?13:3;if(a?.tifaBeat)return a.pose;if(a?.tifaKi)return 40;if(a)return CombatData.sample(a,f.timer).pose;if(['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,ledge:38,grab:17,caught:21,throw:7})[f.state]??0;}
