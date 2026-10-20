'use strict';
const DanaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['月刃一閃','返し月','双月交差','双月薙ぎ','弧月上げ','足元の月','滑り月','蒼月大輪','月天昇','月華裂波','双月回転','前方双刃','背月斬','空の月','蒼月落とし'],{
  dragon:m('双月連舞',9,[w(9,12,'front',{pose:6,damage:3,fixedKnockback:12,angle:-1.1}),w(18,21,'spin',{pose:40,damage:3,fixedKnockback:12,angle:-1.3}),w(29,33,'front',{pose:9,damage:7})],12,0,{...opt,danaDance:true,pose:40,damage:7,angle:-.7}),
  dash:m('星渡り',20,[w(20,25,'front',{pose:14,damage:12})],14,0,{...opt,danaPass:true,pose:41,damage:12,angle:-.72,gravityMultiplier:0,airControlMultiplier:0}),
  rise:m('蒼月旋昇',8,[w(10,12,'up',{pose:42,damage:3,fixedKnockback:10}),w(18,20,'up',{pose:33,damage:3,fixedKnockback:10}),w(29,33,'up',{pose:45,damage:7})],25,14,{...opt,danaRise:true,pose:42,damage:7,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12}),
  gale:m('古代の祈り',24,[],14,0,{...opt,danaPrayer:true,pose:43,damage:0}),
  airDrop:m('空中・古代の祈り',24,[],14,12,{...opt,danaPrayer:true,pose:43,damage:0,aerial:true,gravityMultiplier:.65})
 },'sword',135),p={jab:6,jab2:7,jab3:9,heavy:12,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 // The grounded cross-step slash differs from the jab's reverse arm swing.
 p.heavy=41;
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function danaGate(){return true;}
function danaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
const DanaRules=NewcomerCore.create('dana',DanaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='dana')f.danaMoonTime=0;},
 status(f){if(!f.hitlag)f.danaMoonTime=f.respawn?0:Math.max(0,(f.danaMoonTime||0)-1);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.motionLastEvent=a.danaPrayer?24:a.activeEnd;if(f.danaMoonTime>0&&!a.danaPrayer){a.damage*=1.12;a.danaPowered=true;for(const w of a.activeFrames)if(w.damage)w.damage*=1.12;}if(a.danaPass){a.startX=f.x;a.startY=f.y;}},
 action(f,i){const a=f.attack,t=f.timer;
  if(a.danaPrayer&&t===24&&!a.prayed){a.prayed=true;f.danaMoonTime=480;}
  if(a.danaPass){f.fastFall=false;if(t<8){f.vx=moveToward(f.vx,0,1.4);f.vy=0;return;}
   if(!a.passStarted){a.passStarted=true;a.startX=f.x;a.startY=f.y;const targets=BattlePlayers.targets(f).filter(o=>!o.respawn&&Math.abs(o.y-f.y)<80&&(o.x-f.x)*a.originFace>5&&(o.x-f.x)*a.originFace<190).sort((u,v)=>Math.abs(u.x-f.x)-Math.abs(v.x-f.x));const o=targets[0];a.flanked=!!o;a.goalX=o?o.x+a.originFace*62:f.x+a.originFace*96;}
   if(t<20){const u=(t-7)/13,next=a.startX+(a.goalX-a.startX)*u;f.vx=clamp(next-f.x,-18,18);f.vy=-(Math.sin(u*Math.PI)-Math.sin((u-1/13)*Math.PI))*32;}
   else{f.vx*=.45;f.vy=0;if(!a.turned){a.turned=true;f.face=a.flanked?-a.originFace:a.originFace;a.launchDirection=f.face;}a.pose=a.flanked?7:44;a.gravityMultiplier=1;}
  }
  if(a.danaRise){f.fastFall=false;if(t<8){f.vx*=.65;f.vy=0;return;}
   if(a.launchAt===undefined&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];danaDuration(f,a,t+110);}else{a.launchAt=t;f.grounded=false;f.recovered=true;f.vy=-14.5;f.vx=clamp(i.x,-1,1)*4.5;a.activeFrames=[CombatData.window(t+2,t+4,'up',{pose:42,damage:3*(a.danaPowered?1.12:1),fixedKnockback:10}),CombatData.window(t+10,t+12,'up',{pose:33,damage:3*(a.danaPowered?1.12:1),fixedKnockback:10}),CombatData.window(t+21,t+25,'up',{pose:45,damage:7*(a.danaPowered?1.12:1)})];danaDuration(f,a,t+51);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);return;}const dt=t-a.launchAt;if(dt<28){a.gravityMultiplier=0;f.vy=-13.3+dt*.22;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*4.7+Math.sin(dt*.5)*1.2,.7);a.pose=[42,33,45][Math.floor(dt/4)%3];}else{a.gravityMultiplier=.85;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*3.5,.2);a.pose=35;}
  }
 },
 boxes(f,a,w){const s=w.shape,power=a.danaPowered?1.12:1,reach=(({jab:78,jab2:86,jab3:93,heavy:100,dashAttack:105,smash:119,fair:105,bair:101,dragon:105,dash:110})[a.type]||100)*power,p=s==='up'?[0,-37,0,-112*power]:s==='down'?[0,-35,7,26]:s==='back'?[0,-46,-reach,-46]:s==='low'?[0,-15,reach,-15]:s==='spin'?[-58,-45,58,-45]:[0,-46,reach,-46];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?29:s==='spin'?25:19,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36].includes(danaPose(f));return[{part:'head',x:f.x,y:f.y-(low?39:78),r:14},{part:'torso',x:f.x,y:f.y-(low?23:47),r:18},{part:'legs',x:f.x,y:f.y-12,r:13}];},
 cpu(f,o,i,clear){if(f.attack?.danaRise){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if(d>75&&d<185&&frame%37===f.id){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d<100&&frame%43===f.id){clear();i.x=i.y=0;i.special=true;}else if(d>250&&!f.danaMoonTime&&frame%71===f.id){clear();i.x=0;i.y=1;i.special=true;}}}
});
function danaPose(f){if(f.attack){const a=f.attack;if(a.special){if(a.danaDance)return f.timer<17?6:f.timer<27?40:9;return a.pose;}return CombatData.sample(a,f.timer).pose;}if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:34,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
// Authored whole-body anticipation/strike/return drawings; no joint deformation.
MoveMotion.define('dana',{
 jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},
 heavy:{windup:3,strike:[41],recovery:31},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},
 dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46],recovery:3},
 air:{windup:34,strike:[10],recovery:5},fair:{windup:34,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:34,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}
});
