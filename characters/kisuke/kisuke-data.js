'use strict';
const KisukeBlades=['朧村正','真名','八雲'];
const KisukeMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['抜刀斬り','返し斬り','薙払い','大振り','逆袈裟斬り','居合い下段','滑り込み斬り','斬下ろし','十字斬り','地獄車','螺旋','飛天斬り','逆旋斬り','昇り斬り','急降下斬り'],{
  dragon:m('妖刀奥義',10,[w(10,12,'spin',{pose:41,damage:3}),w(16,18,'spin',{pose:41,damage:3}),w(22,24,'spin',{pose:41,damage:6})],6,0,{...opt,kisukeArt:true,pose:41,damage:3,reach:130}),
  dash:m('滑走・飛天返し',7,[w(7,10,'front',{pose:42,damage:5})],18,0,{...opt,kisukeSlide:true,pose:42,damage:5,reach:130,airControlMultiplier:0}),
  rise:m('飛天三連斬',8,[w(8,12,'up',{pose:44,damage:5})],16,10,{...opt,kisukeRise:true,pose:44,damage:5,reach:120,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
  gale:m('朧流・刀替え',8,[w(8,11,'spin',{pose:47,damage:3})],6,0,{...opt,kisukeSwitch:true,pose:47,damage:3,reach:95}),
  airDrop:m('空中・刀替え',8,[w(8,11,'spin',{pose:47,damage:3})],6,8,{...opt,kisukeSwitch:true,aerial:true,pose:47,damage:3,reach:95})
 },'sword',125),poses={jab:6,jab2:7,jab3:9,heavy:9,up:8,low:11,dashAttack:42,smash:9,upsmash:8,downsmash:11,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:7,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=v.shape==='back'&&['downsmash','getupAttack'].includes(k)?7:n;}
 a.grab.newcomerHit=false;
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};}
 return a;
})();
function kisukeResource(f){f.kisukeBlade??=0;f.kisukeSpirit??=[100,100,100];return f.kisukeSpirit;}
function kisukeDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function kisukeFlip(f,n){return n===43||n===7&&!(CombatData.activeWindow(f.attack,f.timer)?.shape==='back'||f.attack?.type==='backThrow');}
function kisukePoint(f,n,x,y){const r=KisukeArtRects.frames[n],s=kisukeNativeScale(n)*FIGHTER_SCALE*BattleSize.art(f.characterId),flip=kisukeFlip(f,n)?-1:1;return{x:f.x+(x-NewcomerArtAnchors.kisuke[n])*r[2]*s*f.face*flip,y:f.y+(y-1)*r[3]*s};}
// Coordinates follow the generated blade from the grip to its tip, before reflection.
const KisukeStrikes={6:[.55,.61,.99,.59],7:[.46,.58,.02,.90],8:[.65,.46,.92,.02],9:[.62,.52,.99,.68],10:[.65,.42,.8,.05],11:[.56,.72,.99,.8],14:[.44,.25,.02,.48],15:[.6,.07,.08,.42],16:[.5,.62,.98,.98],18:[.45,.4,.92,.45],19:[.45,.4,.97,.35],41:[.55,.6,.99,.56],42:[.62,.75,.99,.9],43:[.4,.3,.02,.2],44:[.6,.4,.98,.02],45:[.7,.25,.75,.02],46:[.6,.05,.99,.19]};
function kisukeRiseStep(f,a,i){
 if(Math.abs(i.x)>.2)f.face=Math.sign(i.x);a.step=(a.step||0)+1;a.stepAt=f.timer;a.pose=43+a.step;
 a.activeFrames.push(CombatData.window(f.timer,f.timer+4,'up',{pose:a.pose,damage:a.step===3?8:5}));
 a.gravityMultiplier=0;f.grounded=false;f.recovered=true;f.fastFall=false;f.vx=(Math.abs(i.x)>.2?i.x:f.face*.3)*7.5;f.vy=-[12.2,13,13.5][a.step-1];kisukeDuration(f,a,f.timer+20);
}
const KisukeRules=NewcomerCore.create('kisuke',KisukeMoves,{
 reset(){for(const f of fighters)if(f.characterId==='kisuke'){f.kisukeBlade=0;f.kisukeSpirit=[100,100,100];f.kisukeSwitchCooldown=0;}},
 status(f){const spirit=kisukeResource(f);if(f.respawn){f.kisukeBlade=0;f.kisukeSpirit=[100,100,100];f.kisukeSwitchCooldown=0;return;}for(let n=0;n<3;n++)if(n!==f.kisukeBlade)spirit[n]=Math.min(100,spirit[n]+.12);if(f.kisukeSwitchCooldown>0)f.kisukeSwitchCooldown--;},
 prepare(f,a){
  const spirit=kisukeResource(f);a.activeFrames=a.activeFrames.map(w=>({...w}));a.blade=f.kisukeBlade;
  if(a.kisukeArt){a.cost=[22,28,34][a.blade];a.weak=spirit[a.blade]<a.cost;
   if(a.weak){a.cost=0;a.damage=4;a.activeFrames=[CombatData.window(10,12,'front',{pose:41,damage:4})];a.totalFrames=a.motionEndFrames=18;a.FAF=19;}
   else if(a.blade===1){a.damage=10;a.activeFrames=[CombatData.window(12,15,'front',{pose:41,damage:10})];a.totalFrames=a.motionEndFrames=21;a.FAF=22;}
   else if(a.blade===2){a.damage=5;a.activeFrames=[CombatData.window(12,14,'front',{pose:41,damage:5}),CombatData.window(20,23,'front',{pose:41,damage:8})];a.totalFrames=a.motionEndFrames=29;a.FAF=30;}
  }
  if(a.kisukeSlide){a.followUntil=22;a.phase='slide';}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.kisukeArt){a.pose=41;f.vx=moveToward(f.vx,0,.8);if(!a.spent&&t>=a.startupFrames){a.spent=true;kisukeResource(f)[a.blade]=Math.max(0,f.kisukeSpirit[a.blade]-a.cost);}
   if(!a.weak&&a.blade===1&&t===12)r.spawn(f,{kind:'night',x:f.x+f.face*142,y:f.y-45,vx:0,vy:0,damage:6,radius:17,life:16,face:f.face});
   if(!a.weak&&a.blade===2&&[12,20].includes(t))r.spawn(f,{kind:'flame',x:f.x+f.face*65,y:f.y-(t===12?55:30),vx:f.face*9,vy:0,damage:4,radius:14,life:22});
  }
  if(a.kisukeSwitch){a.pose=47;f.vx*=.7;if(t===8){f.kisukeBlade=(f.kisukeBlade+1)%3;f.kisukeSwitchCooldown=0;r.spawn(f,{kind:'switch',x:f.x,y:f.y-45,vx:0,damage:0,life:12});}}
  if(a.kisukeSlide){
   if(a.phase==='slide'){a.pose=t<15?42:47;f.vx=t>=7&&t<15?f.face*(a.originGrounded?8.5:6.5):moveToward(f.vx,0,1.2);
    if(t>=14&&t<=a.followUntil&&i.special&&!a.specialWas){const o=BattlePlayers.target(f),near=Math.abs(o.x-f.x)<220&&Math.abs(o.y-f.y)<110;a.phase='cross';a.crossAt=t;a.crossFace=f.face;a.targetX=near?o.x+a.crossFace*55:f.x+a.crossFace*90;f.vx=a.crossFace*11;kisukeDuration(f,a,t+22);}
   }
   if(a.phase==='cross'){a.pose=42;const dt=t-a.crossAt,dx=a.targetX-f.x;f.vx=clamp(dx,-11,11);if(Math.abs(dx)<12||dt>=10){const o=BattlePlayers.target(f);a.phase='finish';a.finishAt=t;f.face=Math.abs(o.x-f.x)<240?Math.sign(o.x-f.x)||-a.crossFace:-a.crossFace;a.pose=43;f.vx=0;a.activeFrames.push(CombatData.window(t+1,t+5,'front',{pose:43,damage:9}));kisukeDuration(f,a,t+11);}}
   if(a.phase==='finish'){a.pose=43;f.vx*=.3;}a.specialWas=!!i.special;
  }
  if(a.kisukeRise){const p=platforms.find(p=>p.main);if(t===8){if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);kisukeDuration(f,a,t+100);}else kisukeRiseStep(f,a,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)kisukeRiseStep(f,a,{...i,x:Math.sign(p.x+p.w/2-f.x)});return;}
   if(a.step){const dt=t-a.stepAt;if(dt>=6&&dt<=13&&a.step<3&&i.special&&!a.specialWas)kisukeRiseStep(f,a,i);if(t-a.stepAt>5){a.gravityMultiplier=.6;f.vx=moveToward(f.vx,i.x*4.5,.18);}if(t-a.stepAt>=14)a.pose=35;}a.specialWas=!!i.special;
  }
 },
 onHit(f,o,a){if(!a.special){const spirit=kisukeResource(f);spirit[f.kisukeBlade]=Math.min(100,spirit[f.kisukeBlade]+3);}},
 boxes(f,a,w){const n=w.pose??a.pose;if(w.shape==='spin')return[{x1:f.x-40,y1:f.y-40,x2:f.x+40,y2:f.y-40,radius:a.kisukeSwitch?15:24,window:w,modifiers:w}];const p=KisukeStrikes[n];if(!p)return;const b=kisukePoint(f,n,p[0],p[1]),tip=kisukePoint(f,n,p[2],p[3]);
  if(w.shape==='up')tip.y=Math.min(b.y-55,tip.y);if(w.shape==='down')tip.y=Math.max(b.y+50,tip.y);
  if(w.shape==='back'&&(tip.x-f.x)*f.face>0)tip.x=f.x-f.face*65;
  return[{x1:b.x,y1:b.y,x2:tip.x,y2:tip.y,radius:a.type.includes('smash')?16:11,window:w,modifiers:w}];
 },
 projectile(q,f,o){if(q.kind==='switch'){q.dead=q.age>=q.life;return true;}if(q.kind!=='night')return false;if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.age<6||q.age>9)return true;const b={x1:q.x-q.face*30,y1:q.y+15,x2:q.x+q.face*35,y2:q.y-25,radius:17};if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);CombatSystem.hit(f,o,{...KisukeMoves.dragon,type:'kisukeNight',sourceType:q.sourceType,damage:q.damage,charge:0,launchDirection:q.face,staleMultiplier:q.stale,projectile:true},b,touch);}}return true;},
 hurtboxes(f){const low=[3,11,12,32,36,42].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?39:78),r:16},{part:'torso',x:f.x,y:f.y-(low?25:46),r:19},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.kisukeRise){clear();i.x=Math.sign(p.x+p.w/2-f.x)*.9;i.y=-1;i.special=a.step<3&&f.timer-a.stepAt===9;}else if(a?.kisukeSlide&&a.phase==='slide'&&f.timer===17&&Math.abs(o.x-f.x)<210){clear();i.special=true;}else if(!a&&f.grounded&&kisukeResource(f)[f.kisukeBlade]<25&&frame%60===f.id){clear();i.y=1;i.special=true;}}
});
function kisukePose(f){const a=f.attack;if(a?.special)return a.pose;if(a)return CombatData.sample(a,f.timer).pose;if(['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:5,fly:21,down:22,getup:37,ledge:38,grab:17,caught:5,throw:19})[f.state]??0;}
