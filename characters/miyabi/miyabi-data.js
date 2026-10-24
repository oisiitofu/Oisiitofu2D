'use strict';
const MiyabiMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['風花・横斬り','風花・返し斬り','鞘払い','刀の突き','斬り上げ','低薙ぎ','滑り斬り','踏み込み一閃','跳び上がり回転斬り','地を薙ぐ霜刃','空中斬り下ろし','空中前薙ぎ','返し刃','見上げ斬り','急降下斬り'],{
  dragon:m('落霜・五連',6,[w(6,9,'front',{pose:40,damage:3,index:0,throwHitstun:18,fixedKnockback:9})],11,0,{...opt,miyabiChain:true,tether:true,pose:40,damage:3,gravityMultiplier:.35,airControlMultiplier:.2}),
  dash:m('氷雪',9,[w(9,20,'front',{pose:12,damage:9,index:0})],23,0,{...opt,miyabiSide:true,tether:true,pose:12,damage:9,gravityMultiplier:.5,airControlMultiplier:0,angle:-.65}),
  rise:m('水鳥',8,[w(8,15,'up',{pose:42,damage:7,index:0})],55,15,{...opt,miyabiRise:true,pose:42,damage:7,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12}),
  gale:m('霜月',26,[],24,0,{...opt,miyabiIaido:true,tether:true,pose:43,damage:20,gravityMultiplier:.3,airControlMultiplier:0}),
  airDrop:m('空中霜月',26,[],24,15,{...opt,miyabiIaido:true,tether:true,pose:43,damage:20,aerial:true,gravityMultiplier:.3,airControlMultiplier:0})
 },'sword',145),p={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:37,getupAttack:37,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function miyabiGainFrost(f,n){if(!f.respawn)f.miyabiFrost=clamp((f.miyabiFrost||0)+n,0,6);}
function miyabiGate(f,type){return !(['gale','airDrop'].includes(type)&&(f.miyabiFrost||0)<1);}
function miyabiLand(f){if(!f.attack?.miyabiChain&&!f.attack?.miyabiIaido)return false;f.grounded=true;f.vy=0;f.shortHop=false;f.airJumps=f.character.airJumpCount;f.jumps=0;f.airDodged=false;f.ledgeGrabs=0;f.recovered=f.helpless=f.fastFall=false;f.mode='GroundSpecial';f.state=PlayerStates.visual.GroundSpecial;f.gravityOff=false;f.specialLandingLag=f.landingLag=0;return true;}
function miyabiDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function miyabiNextCut(a,n){const start=[6,13,21,30,41][n],end=start+(n===4?5:3),pose=[40,48,49,50,51][n];return CombatData.window(start,end,n===4||n===2?'spin':'front',{pose,damage:[3,3,4,5,11][n],index:n,...(n===4?{baseKnockback:4.7,knockbackGrowth:.065,angle:-.8}:{throwHitstun:18,fixedKnockback:9,pull:true})});}
// Six frost stocks are six power steps; keep the three authored release poses.
const MiyabiIaido=Object.freeze({targets:[0,130,120,110,100,90,70],damage:[0,14,18,22,26,30,34],growth:[0,.074404,.063132,.05438,.049198,.044429,.045497]});
// Sample before hitlag returns, so a released-and-repressed button is kept
// through hitstop. The 9F queue uses action time, not frozen wall-clock frames.
function miyabiFollowInput(f,i){const a=f.attack;if(!a||!a.miyabiSide&&!a.miyabiRise||f.hitstun||f.pendingLaunch||f.respawn||a.escapeSide||a.followClosed||a.followAt||a.secondAt)return;
 if(!i.buttons.special.value){a.followReleased=true;return;}if(!a.followReleased||!i.buttons.special.press)return;
 if(a.miyabiRise&&a.launchAt===undefined)return;const point=a.miyabiRise?a.launchAt+14:21;
 if(f.timer<point-9||f.timer>(a.miyabiRise?point:a.followUntil))return;
 a.followQueued={x:i.x,y:i.y,at:f.timer};a.followReleased=false;
}
const MiyabiRules=NewcomerCore.create('miyabi',MiyabiMoves,{
 reset(){for(const f of fighters)if(f.characterId==='miyabi')Object.assign(f,{miyabiFrost:0,miyabiClock:0});},
 status(f){if(f.respawn){f.miyabiFrost=f.miyabiClock=0;return;}if(!f.hitlag&&(f.miyabiFrost||0)<6){f.miyabiClock=(f.miyabiClock||0)+1;if(f.miyabiClock>=600){f.miyabiClock=0;miyabiGainFrost(f,1);}}},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));
  if(a.miyabiChain){a.activeFrames=[miyabiNextCut(a,0)];a.nbStage=0;a.nbDecide=10;a.nbMasks={};a.motionLastEvent=10;}
  if(a.miyabiSide){a.followUntil=30;a.motionLastEvent=30;}
  if(a.miyabiIaido){a.level=Math.min(6,Math.floor(f.miyabiFrost||0));a.visualLevel=Math.ceil(a.level/2);a.cost=a.level;f.miyabiFrost-=a.cost;a.releaseAt=22+a.visualLevel*4;a.damage=MiyabiIaido.damage[a.level];a.activeFrames=[CombatData.window(a.releaseAt,a.releaseAt+5,'front',{pose:51+a.visualLevel,damage:a.damage,index:0,baseKnockback:5+a.visualLevel,knockbackGrowth:MiyabiIaido.growth[a.level],angle:-.8})];a.activeStart=a.releaseAt;a.activeEnd=a.releaseAt+5;a.motionLastEvent=a.activeEnd;miyabiDuration(f,a,a.activeEnd+24);}
 },
 action(f,i){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);
  if(a.miyabiChain){if(!a.nbEnded&&a.nbStage<4&&t>=a.nbDecide){if(held){a.nbStage++;a.activeFrames.push(miyabiNextCut(a,a.nbStage));a.activeEnd=a.activeFrames.at(-1).end;a.nbDecide=[10,18,27,37,52][a.nbStage];a.motionLastEvent=a.nbStage===4?a.activeEnd:a.nbDecide;miyabiDuration(f,a,a.activeEnd+11);}else{a.nbEnded=true;a.motionLastEvent=a.activeFrames.at(-1).end;}}
   const w=a.activeFrames.filter(w=>t>=w.start).at(-1);a.pose=w?.pose??43;f.vx=t>=6&&t<=a.activeEnd?a.originFace*.7:moveToward(f.vx,0,.7);}
  if(a.miyabiSide){if(!a.followAt&&t>=21&&t<=a.followUntil&&a.followQueued&&t-a.followQueued.at<=9){a.followAt=t;a.ex=(f.miyabiFrost||0)>=1;if(a.ex)f.miyabiFrost--;a.followFace=-a.originFace;f.face=a.followFace;a.followQueued=null;f.buffer=null;a.activeFrames.push(CombatData.window(t,t+11,'front',{pose:49,damage:a.ex?18:11,index:1,baseKnockback:a.ex?6:4,knockbackGrowth:a.ex?.095:.065}));a.activeEnd=t+11;a.motionLastEvent=a.activeEnd;miyabiDuration(f,a,a.activeEnd+13);}
   const dt=a.followAt?t-a.followAt:-1;f.fastFall=false;if(t<9){f.vx*=.5;f.vy*=.4;}else if(dt>=0&&dt<12){f.vx=a.followFace*(a.ex?20:18);if(!f.grounded)f.vy=Math.min(f.vy,2);a.pose=49;}else if(!a.followAt&&t<=20){f.vx=a.originFace*18;f.vy=Math.min(f.vy,0);a.pose=12;}else f.vx*=.75;}
  if(a.miyabiRise){f.fastFall=false;if(t<8){f.vx*=.55;f.vy=0;return;}if(a.launchAt===undefined&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];miyabiDuration(f,a,t+110);}else{a.launchAt=t;f.grounded=false;f.recovered=true;a.launchX=Math.abs(i.x)>.2?Math.sign(i.x):f.face;a.activeFrames=[CombatData.window(t,t+8,'up',{pose:42,damage:7,index:0})];miyabiDuration(f,a,t+58);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);return;}const dt=t-a.launchAt;
   if(!a.followClosed&&dt>=14){a.followClosed=true;const q=a.followQueued;a.followQueued=null;if(q&&t-q.at<=9){a.secondAt=t;a.ex=false;a.cost=0;a.secondX=Math.abs(q.x)>.2?Math.sign(q.x):f.face;a.secondY=clamp(q.y,-1,1)*.6;f.face=a.secondX;a.pose=55;f.buffer=null;a.activeFrames.push(CombatData.window(t,t+8,'front',{pose:55,damage:9,index:1,baseKnockback:3.5,knockbackGrowth:.05}));a.activeEnd=t+8;a.motionLastEvent=a.activeEnd;miyabiDuration(f,a,t+31);}else{a.motionLastEvent=t-1;miyabiDuration(f,a,t+20);}}
   if(a.secondAt){const d=t-a.secondAt;a.gravityMultiplier=d<11?0:1;f.vx=d<11?a.secondX*8:f.vx*.98;f.vy=d<11?a.secondY*8:f.vy;a.pose=d<=8?55:35;}
   else if(dt<14){a.gravityMultiplier=0;f.vy=-14+dt*.22;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.8);a.pose=42;}
   else{a.gravityMultiplier=1;a.pose=35;}
  }
  if(a.miyabiIaido){f.vx=moveToward(f.vx,0,1);if(t<a.releaseAt){f.vy*=.35;a.pose=43;}else{a.pose=51+a.visualLevel;if(t===a.releaseAt)f.vx=a.originFace*(3+a.visualLevel);}}
 },
 onHit(f,o,strike){const a=f.attack;if(!a?.miyabiChain||strike.type!=='dragon')return;const n=strike.index;if(n<0||n>4)return;a.nbMasks[o.id]=(a.nbMasks[o.id]||0)|(1<<n);if(n===4&&a.nbMasks[o.id]===31&&!a.nbReward){a.nbReward=true;miyabiGainFrost(f,1);}},
 boxes(f,a,w){const s=w.shape;let reach=({jab:96,jab2:98,jab3:86,heavy:123,dashAttack:110,smash:152,fair:125,bair:118,dragon:125,dash:a.ex?163:132,rise:a.ex?162:122,gale:125+a.visualLevel*40,airDrop:125+a.visualLevel*40})[a.type]||112;
  if(a.miyabiChain&&w.index===4)return[{x1:f.x-126,y1:f.y-45,x2:f.x+126,y2:f.y-45,radius:38,window:w,modifiers:w}];
  if(a.miyabiChain&&w.index===3)return[{x1:f.x,y1:f.y-44,x2:f.x+f.face*reach,y2:f.y-44,radius:50,window:w,modifiers:w}];
  const p=s==='up'?[0,-34,0,-118]:s==='down'?[0,-34,12,40]:s==='back'?[0,-44,-reach,-44]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-65,-44,65,-44]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:a.miyabiIaido?24+a.visualLevel*3:s==='up'?29:s==='spin'?25:19,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36,43,52].includes(miyabiPose(f));return[{part:'head',x:f.x,y:f.y-(low?39:78),r:14},{part:'torso',x:f.x,y:f.y-(low?24:47),r:18},{part:'legs',x:f.x,y:f.y-12,r:13}];},
 cpu(f,o,i,clear){const a=f.attack;if(a?.miyabiChain){i.specialHeld=true;return;}if(a?.miyabiRise){i.x=Math.sign(720-f.x);if(f.timer-a.launchAt>=6&&!a.followClosed){i.special=true;i.specialHeld=true;}return;}if(a?.miyabiSide&&f.timer>=18){i.special=true;i.specialHeld=true;return;}if(!a&&f.grounded){const d=Math.abs(o.x-f.x);if(f.miyabiFrost>=2&&d<180&&frame%41===f.id){clear();i.x=0;i.y=1;i.special=true;}else if(d<145&&frame%29===f.id){clear();i.x=i.y=0;i.special=i.specialHeld=true;}}}
});
function miyabiPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:34,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('miyabi',{jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},heavy:{windup:3,strike:[41],recovery:31},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46],recovery:3},air:{windup:34,strike:[10],recovery:5},fair:{windup:34,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:34,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}});
