'use strict';
const CharlottaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'},a=NewcomerCore.moves(['盾小突き','横斬り','踏み込み斬り','ロングスラスト','斬り上げ','低空スイープ','シールドタックル','ブリリアント・ブレイク','斬り上げ追撃','低空回転斬り','全身回転斬り','斜め二段斬り','盾背面打ち','X字斬り','飛び込み斬り'],{
 dragon:m('ソード・オブ・リュミエール',7,[w(7,11,'spin',{pose:47})],45,15,{...opt,charlottaSpin:true,pose:47,damage:4,baseKnockback:1.3,knockbackGrowth:.025,airControlMultiplier:.4}),
 dash:m('ノーブル・ストラテジー',8,[],52,20,{...opt,charlottaHop:true,landingMove:'nobleLanding',pose:41,gravityMultiplier:1.2,airControlMultiplier:0}),
 nobleLanding:m('ノーブル・振り向き斬り',5,[w(5,10,'low',{pose:42})],22,16,{...opt,charlottaLanding:true,pose:42,damage:11,baseKnockback:3.5,knockbackGrowth:.065,angle:-.9}),
 rise:m('ホーリーラダー・リバウンド',9,[w(9,17,'up',{pose:44}),w(22,27,'up',{pose:45})],75,24,{...opt,charlottaLadder:true,pose:44,damage:7,baseKnockback:2.5,knockbackGrowth:.045,gravityMultiplier:.7,airControlMultiplier:0,tether:true,helpless:true,ledgeGrabStart:10}),
 gale:m('グリッターオンスロート・ブレイク',16,[w(16,21,'front',{pose:46})],26,20,{...opt,charlottaBrace:true,pose:43,damage:12,baseKnockback:3.8,knockbackGrowth:.075,counterWindow:[4,12],counterMove:'glitterBreak',airControlMultiplier:0}),
 airDrop:m('グリッターオンスロート・空中',16,[w(16,21,'front',{pose:46})],26,20,{...opt,charlottaBrace:true,pose:43,damage:12,baseKnockback:3.8,knockbackGrowth:.075,counterWindow:[4,12],counterMove:'glitterBreak',aerial:true,airControlMultiplier:0}),
 glitterBreak:m('グリッター・反撃突き',5,[w(5,11,'front',{pose:46})],27,20,{...opt,charlottaThrust:true,pose:46,damage:17,baseKnockback:4.3,knockbackGrowth:.08,airControlMultiplier:0})
 },'sword',120),poses={jab:6,jab2:42,jab3:8,heavy:8,up:10,low:11,dashAttack:9,smash:8,upsmash:10,downsmash:11,air:12,fair:42,bair:14,uair:15,dair:16,grab:17,pummel:6,ledge:6,getupAttack:11,forwardThrow:6,backThrow:14,upThrow:10,downThrow:16};for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=v.shape==='back'&&k==='getupAttack'?14:n;}a.downsmash.activeFrames=[w(22,26,'low',{pose:11}),w(30,34,'back',{pose:14})];a.grab.newcomerHit=false;for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};}return a;})();

// Native sword and shield coordinates. Forward is RIGHT; rear shield bash is LEFT.
const CharlottaStrikePoints={6:[.69,.61,.98,.59],7:[.60,.52,.985,.21],8:[.6,.61,.99,.50],9:[.63,.69,.98,.64],10:[.38,.38,.14,.015],11:[.6,.74,.98,.89],14:[.35,.62,.015,.6],15:[.42,.36,.3,.015],16:[.6,.60,.64,.985],42:[.58,.64,.99,.75],44:[.62,.35,.94,.015],45:[.56,.38,.90,.015],46:[.65,.60,.99,.57]};
function charlottaStrike(f,n){const p=CharlottaStrikePoints[n];if(!p)return null;const r=CharlottaArtRects.frames[n],s=NativeStrikes.scale(f,n,charlottaNativeScale(n),false)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.charlotta[n],point=(x,y)=>({x:f.x+(x-anchor)*r[2]*s*f.face,y:f.y+(y-1)*r[3]*s});return[point(p[0],p[1]),point(p[2],p[3])];}
function charlottaDuration(f,a,total){const d=total-a.totalFrames;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;f.faf+=d;f.stateEnd+=d;}
function charlottaRebound(f,a,face){if(a.charlottaRebounded)return;a.charlottaRebounded=true;f.face=face;f.vx=face*8;f.vy=-21;a.reboundAt=f.timer;a.pose=45;a.activeFrames.push(CombatData.window(f.timer+5,f.timer+10,'up',{pose:45}));a.activeEnd=f.timer+10;charlottaDuration(f,a,Math.max(a.totalFrames,f.timer+42));}
const CharlottaRules=NewcomerCore.create('charlotta',CharlottaMoves,{
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));if(a.charlottaLanding){const o=BattlePlayers.target(f);f.face=Math.sign(o.x-f.x)||-(f.charlottaHopFace||f.face);a.originFace=f.face;f.vx=0;}if(a.charlottaHop)f.charlottaHopFace=f.face;if(a.charlottaLadder)a.phase='startup';},
 action(f,i){const a=f.attack,t=f.timer;
  if(a.charlottaSpin){if([14,21,28,35].includes(t)&&i.specialHeld){a.activeFrames.push(CombatData.window(t,t+4,'spin',{pose:47}));a.activeEnd=t+4;}f.vx=t<=a.activeEnd?clamp(i.x,-1,1)*2.8:f.vx*.8;}
  if(a.charlottaHop){f.buffer=null;if(t===8){f.grounded=false;f.vy=a.originGrounded?-8:-6;f.vx=f.face*6.5;}if(t>=8&&t<=28)f.vx=f.face*6.5;else f.vx*=.9;}
  if(a.charlottaLanding){f.vx*=.5;}
  if(a.charlottaBrace){a.pose=t<16?43:46;f.vx=t>=14&&t<=18?f.face*3:f.vx*.65;}
  if(a.charlottaThrust)f.vx=t<=11?f.face*4:f.vx*.65;
  if(a.charlottaLadder){f.buffer=null;f.fastFall=false;if(t===9){const p=platforms.find(p=>p.main);f.recovered=true;f.specialLandingLag=24;f.grounded=false;if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89){NewcomerCore.escape(f,a);a.phase='escape';}else{a.phase='ladder';a.tether=false;f.face=Math.abs(i.x)>.25?Math.sign(i.x):f.face;f.vx=f.face*8;f.vy=-17.5;}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,.7);if(!a.escapeSide){a.phase='ladder';a.tether=false;a.clearingWall=true;a.charlottaRebounded=false;charlottaDuration(f,a,t+75);}return;}
   if(a.phase==='ladder'){const p=platforms.find(p=>p.main);if(a.clearingWall&&f.y>p.y+5){f.vx=0;a.airControlMultiplier=0;}else{a.clearingWall=false;a.airControlMultiplier=t>=20?.4:0;if(!a.charlottaRebounded&&t<=17)f.vx=f.face*8;if(a.charlottaRebounded&&t-a.reboundAt<8)f.vx=f.face*8;}a.pose=a.charlottaRebounded||t>=22?45:44;}
  }
 },
 collision(f,i,v){const a=f.attack;if(a?.charlottaLadder&&a.phase==='ladder'&&!a.clearingWall&&f.timer>=9){const p=platforms.find(p=>p.main),r=f.character.ecb.radius;if(f.y>p.y+20&&f.y-f.character.ecb.height<p.y+90&&(Math.abs(f.x-(p.x-r))<2||Math.abs(f.x-(p.x+p.w+r))<2))charlottaRebound(f,a,f.x<p.x+p.w/2?-1:1);}},
 onHit(f,o,a){if(a.charlottaLadder&&f.attack?.phase==='ladder')charlottaRebound(f,f.attack,-f.face);},
 boxes(f,a,w){if(a.charlottaSpin||w.shape==='spin')return[{x1:f.x-42,y1:f.y-30,x2:f.x+42,y2:f.y-30,radius:20,window:w}];const p=charlottaStrike(f,w.pose??a.pose);if(p)return[{x1:p[0].x,y1:p[0].y,x2:p[1].x,y2:p[1].y,radius:11,window:w}];},
 hurtboxes(f){const low=[3,9,11,22,32,36,37,42].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?32:53),r:16},{part:'torso',x:f.x,y:f.y-(low?22:32),r:18},{part:'legs',x:f.x,y:f.y-10,r:14}];},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.charlottaLadder){clear();i.x=a.escapeSide||Math.sign(p.x+p.w/2-f.x);i.y=-1;i.specialHeld=false;}if(a?.charlottaSpin){clear();i.specialHeld=f.timer<35;i.x=Math.sign(o.x-f.x);}}
});
function charlottaPose(f){const a=f.attack;if(a?.charlottaSpin&&f.timer<=a.activeEnd)return[47,12,47,12][Math.floor(f.timer/3)%4];if(a?.charlottaHop||a?.charlottaLadder||a?.charlottaBrace||a?.charlottaThrust)return a.pose;if(a)return CombatData.sample(a,f.timer).pose;if(['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,ledge:38,grab:17,caught:21,throw:6})[f.state]??0;}
