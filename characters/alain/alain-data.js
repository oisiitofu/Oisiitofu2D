'use strict';
const AlainMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['横斬り','盾打ち','返し斬り','踏み込み突き','シールドアッパー','ロースイープ','盾突進斬り','騎士の一閃','天を衝く剣','スピニングエッジ','シールドスピン','二段斬り','盾の振り向き打ち','半月斬り','下方突き'],{
  dragon:m('リーンエッジ',12,[w(12,16,'front',{pose:9,damage:10})],16,0,{...opt,alainLean:true,pose:9,damage:10,reach:150}),
  dash:m('スピニングエッジ',10,[w(10,12,'spin',{pose:41,damage:4}),w(17,19,'spin',{pose:41,damage:4}),w(24,27,'spin',{pose:41,damage:7})],15,0,{...opt,alainSpin:true,pose:41,damage:4,reach:145}),
  rise:m('ハイロードヴォールト',8,[w(8,19,'up',{pose:42,damage:6}),w(24,28,'up',{pose:44,damage:5})],17,12,{...opt,alainVault:true,pose:42,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
  gale:m('ブレイブオーダー',15,[],18,0,{...opt,alainOrder:true,pose:45,damage:0}),
  airDrop:m('空中ブレイブオーダー',15,[],18,10,{...opt,alainOrder:true,aerial:true,pose:45,damage:0})
 },'sword',136),poses={jab:6,jab2:7,jab3:9,heavy:9,up:8,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:6,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;
})();
const AlainRules=NewcomerCore.create('alain',AlainMoves,{
 status(f){f.alainOrderTime=f.respawn?0:Math.max(0,(f.alainOrderTime||0)-1);f.alainOrderCooldown=f.respawn?0:Math.max(0,(f.alainOrderCooldown||0)-1);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));if(f.alainOrderTime>0){a.damage*=1.12;for(const w of a.activeFrames)if(w.damage!==undefined)w.damage*=1.12;}if(a.alainVault)a.vaultStarted=false;},
 action(f,i){const a=f.attack,t=f.timer;if(a.alainSpin){f.vx=0;if(!f.grounded)a.gravityMultiplier=.7;}
  if(a.alainOrder&&t===15&&!a.eventsDone.has('order')){a.eventsDone.add('order');f.alainOrderTime=300;f.alainOrderCooldown=540;ring(f.x,f.y-45,'#ffe4a3',95);}
  if(a.alainVault){if(t<8){f.vx=f.vy=0;return;}if(!a.vaultStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(t===8&&f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){a.totalFrames=a.motionEndFrames=t+48;return;}}
   if(!a.vaultStarted){a.vaultStarted=true;a.vaultAt=t;f.vx=(Math.abs(i.x)>.2?i.x:f.face*.6)*6.5;f.vy=-16.5;f.recovered=true;f.grounded=false;f.fastFall=false;a.totalFrames=a.motionEndFrames=t+42;a.activeFrames=[CombatData.window(t,t+12,'up',{pose:42,damage:6})];}
   const dt=t-a.vaultAt;a.pose=dt<8?42:dt<20?43:44;a.gravityMultiplier=dt<20?.28:.9;f.vx=moveToward(f.vx,i.x*6.5,.22);
   if(!a.dismounted&&(dt===20||dt>=10&&i.special&&!a.specialWas)){a.dismounted=true;a.pose=44;f.vy=Math.min(f.vy,-10.5);a.activeFrames.push(CombatData.window(t,t+4,'up',{pose:44,damage:5}));}a.specialWas=!!i.special;
  }
 },
 onHit(f,o,a){if(a.alainLean&&!a.alainHealed){a.alainHealed=true;f.damage=Math.max(0,f.damage-3);ring(f.x,f.y-42,'#a0ffd1',55);}},
 boxes(f,a,w){return alainMeleeBox(f,a,w,a.alainLean?84:75);},
 hurtboxes(f){const low=[3,11,22,32,36].includes(pose(f));return[{part:'head',x:f.x,y:f.y-(low?43:84),r:13},{part:'torso',x:f.x,y:f.y-(low?26:50),r:19},{part:'legs',x:f.x,y:f.y-13,r:14}];},
 cpu(f,o,i,clear){if(f.attack?.alainVault){i.x=Math.sign(720-f.x);i.y=-1;return;}if(!f.attack&&f.grounded&&!(f.alainOrderCooldown>0)&&Math.abs(o.x-f.x)>260){clear();i.y=1;i.special=true;}else if(!f.attack&&f.damage>30&&Math.abs(o.x-f.x)<100&&frame%40===f.id){clear();i.special=true;}}
});
function alainMeleeBox(f,a,w,reach){const shape=w.shape,h=45,r=a.type.includes('smash')?17:13;let p=shape==='up'?[0,-32,0,-105]:shape==='down'?[0,-30,10,45]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-12,reach,-12]:shape==='spin'?[-32,-h,32,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?25:r,window:w,modifiers:w}];}
function alainPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
