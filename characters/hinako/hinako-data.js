'use strict';
const HinakoMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'staff'};
 const a=NewcomerCore.moves(['パイプ横振り','踏み込み逆振り','回し打ち','横払い','跳び上げ斬り','低姿勢なぎ払い','開突き・打ち払い','渾身の横振り','連突き・打ち上げ','根の衝撃','パイプ振り回し','斜め斬り下ろし','後方なぎ払い','真上への突き上げ','急降下斬り'],{
  dragon:m('フォーカスアタック',12,[w(12,16,'front',{pose:9})],12,0,{...opt,hinakoFocus:true,pose:40,damage:11,reach:175,chargeFrame:6,chargeButton:'special',chargeMaxFrames:50}),
  dash:m('鎌・彼岸巡り',12,[w(12,15,'front',{pose:41,damage:5}),w(24,28,'low',{pose:11,damage:8})],11,0,{...opt,hinakoHook:true,pose:41,damage:5,reach:165,gravityMultiplier:.7,airControlMultiplier:0}),
  rise:m('薙刀・飛翔',8,[w(8,16,'up',{pose:43,damage:5}),w(20,25,'up',{pose:44,damage:6})],16,12,{...opt,hinakoVault:true,pose:42,damage:5,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
  gale:m('仮面の少女',18,[],12,0,{...opt,hinakoMask:true,pose:0,damage:0}),
  airDrop:m('空中・仮面の少女',18,[],12,10,{...opt,hinakoMask:true,aerial:true,pose:45,damage:0,gravityMultiplier:.6})
 },'staff',140),poses={jab:6,jab2:7,jab3:12,heavy:9,up:8,low:11,dashAttack:12,smash:12,upsmash:13,downsmash:11,air:10,fair:6,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;
 a.jab2.pose=9;for(const v of a.jab2.activeFrames)v.pose=9;a.downsmash.activeFrames[1].pose=7;a.getupAttack.activeFrames[1].pose=7;
 for(const v of Object.values(a)){v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};}
 a.jab2.animation.anticipationPose=7;return a;
})();
const HinakoRules=NewcomerCore.create('hinako',HinakoMoves,{
 reset(){for(const f of fighters)if(f.characterId==='hinako'){f.hinakoMaskTime=0;f.hinakoMaskCooldown=0;}},
 status(f){f.hinakoMaskCooldown=Math.max(0,(f.hinakoMaskCooldown||0)-1);if(f.respawn){f.hinakoMaskTime=0;return;}if(f.hinakoMaskTime>0&&--f.hinakoMaskTime===0){f.hinakoMaskCooldown=480;ring(f.x,f.y-42,'#d1c7ba',60);}},
 prepare(f,a){a.hinakoBeast=!!f.hinakoMaskTime;a.activeFrames=a.activeFrames.map(v=>({...v}));a.hinakoStrikeScale=a.hinakoBeast?1.18:1;
  if(a.hinakoBeast&&!a.hinakoMask){a.damage*=1.12;for(const v of a.activeFrames)if(v.damage!==undefined)v.damage*=1.12;a.soundFamily='punch';}
  if(a.hinakoFocus){a.chargeHoldFrames=a.chargeMaxFrames=a.hinakoBeast?30:50;a.pose=40;if(a.hinakoBeast)a.name='異腕・集中打';}
  if(a.hinakoHook&&a.hinakoBeast){a.name='異腕・引き寄せ';a.raimentGrab=true;a.tether=true;a.victimId=null;a.activeFrames=[CombatData.window(12,16,'front',{pose:41,damage:3})];a.pose=41;}
  if(a.hinakoVault&&a.hinakoBeast)a.name='異腕・跳躍';
 },
 action(f,i){const a=f.attack,t=f.timer;
  if(a.hinakoFocus)a.pose=t<a.startupFrames?40:9;
  if(a.hinakoMask&&t===18&&!a.eventsDone.has('mask')){a.eventsDone.add('mask');f.hinakoMaskTime=720;f.fastFall=false;ring(f.x,f.y-42,'#d9b8ad',85);}
  if(a.hinakoHook){f.face=a.originFace;a.pose=41;
   if(a.hinakoBeast){
    if(f.grabbed){const o=f.grabbed,age=t-a.captureFrame;f.vx=f.vy=0;a.gravityMultiplier=0;o.x=f.x+f.face*45;o.y=f.y-12;a.pose=age<5?17:18;
     if(age>=12){f.grabbed=null;o.grabOwner=null;o.grabImmunity=60;o.hitlag=0;PlayerStates.enter(o,o.grounded?'Idle':'Fall');CombatSystem.hit(f,o,{...HinakoMoves.forwardThrow,type:'hinakoBeastThrow',sourceType:'dash',damage:9,charge:0,staleMultiplier:a.staleMultiplier,launchDirection:f.face,angle:-.45,soundFamily:'punch'});a.activeFrames=[];a.released=true;a.tether=false;a.gravityMultiplier=1;a.pose=19;a.releaseAt=t;}}
    if(a.released)a.pose=19;
    else if(t>16&&!f.grabbed){a.tether=false;a.gravityMultiplier=.8;}
   }else if(a.orbit){const u=clamp((t-a.orbitAt)/9,0,1),center=a.orbit,desired=center.x+a.originFace*(-50+100*u);f.vx=clamp(desired-f.x,-11,11);if(!a.originGrounded){const y=center.y-22*Math.sin(u*Math.PI);f.vy=clamp(y-f.y,-5,5);}a.pose=u<.6?41:11;if(u>=1){f.face=-a.originFace;f.vx=0;a.pose=11;}}
   else if(t>=12&&t<=15)f.vx=a.originFace*3;
  }
  if(a.hinakoVault){if(t<8){f.vx=f.vy=0;return;}if(!a.vaultStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(t===8&&f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){a.totalFrames=a.motionEndFrames=t+44;return;}}
   if(!a.vaultStarted){a.vaultStarted=true;a.vaultAt=t;a.direction=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.direction;f.vx=a.direction*(a.hinakoBeast?7:6);f.vy=a.hinakoBeast?-16:-15.5;f.grounded=false;f.recovered=true;f.fastFall=false;a.gravityMultiplier=.45;a.totalFrames=a.motionEndFrames=t+36;a.activeFrames=[CombatData.window(t,t+8,'up',{pose:43,damage:5}),CombatData.window(t+12,t+17,'up',{pose:44,damage:6})];}
   const dt=t-a.vaultAt;a.pose=dt<10?43:44;a.gravityMultiplier=dt<18?.45:1;if(dt>8)f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.3);
  }
 },
 onHit(f,o,strike){const a=f.attack;if(a?.hinakoHook&&!a.hinakoBeast&&!a.orbit){a.orbit={x:o.x,y:f.y};a.orbitAt=f.timer;}},
 collision(f,i,v){const a=f.attack;if(!a?.hinakoVault||!a.vaultStarted||a.wallRebound||f.ledge||f.grounded)return;const p=platforms.find(p=>p.main),side=f.x<=p.x-f.character.ecb.radius+.01?-1:f.x>=p.x+p.w+f.character.ecb.radius-.01?1:0;
  if(side&&v.oldVx*side<0&&f.vx===0&&f.y>p.y+8&&f.y<p.y+180){a.wallRebound=true;f.vx=side*8;f.vy=-14;a.gravityMultiplier=.65;ring(f.x,f.y-42,'#d9c5bd',50);}
 },
 boxes(f,a,w){const shape=w.shape,reach=(a.hinakoFocus?98:a.hinakoHook?90:82)*(a.hinakoStrikeScale||1),h=44;let p=shape==='up'?[0,-30,6,-112]:shape==='down'?[0,-36,16,38]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-12,reach,-12]:shape==='spin'?[-35,-h,35,-h]:[0,-h,reach,-h];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?24:a.hinakoBeast?16:12,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[3,11,22,32,36,37].includes(hinakoPose(f));return[{part:'head',x:f.x,y:f.y-(low?40:80),r:13},{part:'torso',x:f.x,y:f.y-(low?25:48),r:18},{part:'legs',x:f.x,y:f.y-13,r:14}];},
 cpu(f,o,i,clear){if(f.attack?.hinakoVault){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded&&!(f.hinakoMaskTime>0)&&!(f.hinakoMaskCooldown>0)&&Math.abs(o.x-f.x)>220){clear();i.x=0;i.y=1;i.special=true;}else if(!f.attack&&Math.abs(o.x-f.x)>80&&Math.abs(o.x-f.x)<200&&frame%45===f.id){clear();i.x=Math.sign(o.x-f.x);i.special=true;}}
});
function hinakoBeast(f){return !!(f.hinakoMaskTime>0||f.attack?.hinakoBeast);}
function hinakoPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
