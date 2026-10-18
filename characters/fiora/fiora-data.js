'use strict';
const FioraMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
const a=NewcomerCore.moves(['右刃ジャブ','左刃返し','双刃突き','ダブルスラスト','ライジングブレード','ローエッジ','スライドカッター','クロスエッジ','ライジングクロス','ツインスイープ','ダブルスピン','エアスラスト','バックエッジ','スカイエッジ','ダイブブレード'],{
dragon:m('ダブルブレード',8,[w(8,10,'front',{pose:6,damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(14,16,'front',{pose:9,damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(22,25,'front',{pose:40,damage:7})],12,0,{...opt,fioraCombo:true,pose:40,damage:7}),
dash:m('ソードドローン',16,[],30,0,{...opt,fioraDrone:true,projectile:true,pose:41,damage:5,airControlMultiplier:0}),
rise:m('ゼログラビティ',9,[w(9,15,'spin',{pose:43,damage:4})],58,14,{...opt,fioraZero:true,pose:42,damage:4,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:9}),
gale:m('スピードシフト',16,[],12,0,{...opt,fioraShift:true,pose:45,damage:0}),
airDrop:m('空中スピードシフト',16,[],12,10,{...opt,fioraShift:true,aerial:true,pose:45,damage:0})
},'sword',135),poses={jab:6,jab2:9,jab3:9,heavy:9,up:8,low:11,dashAttack:9,smash:12,upsmash:13,downsmash:11,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function fioraDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
// Drone transport has its own rearm. A repeat side-special remains a usable
// sword lunge while the previous pair returns, without spawning extra drones.
const FioraLungeMoves={...FioraMoves,dash:CombatData.createMove('ソードドローン・踏み込み斬り',8,[CombatData.window(16,20,'front',{pose:12,damage:7})],10,0,{special:true,newcomerHit:true,soundFamily:'sword',fioraDrone:true,fioraDirect:true,pose:9,damage:7,airControlMultiplier:0})};
function fioraMovesFor(f){return f.fioraDroneCooldown>0||FioraRules.objects.some(q=>q.owner===f.id&&!q.dead)?FioraLungeMoves:FioraMoves;}
function fioraBeginFollow(f,a,at){a.following=true;a.followAt=at;a.followStartX=f.x;a.followStartY=f.y;const p=platforms.find(p=>p.main);a.followX=a.originGrounded?clamp(a.targetX,p.x+22,p.x+p.w-22):a.targetX;a.followY=a.originGrounded?f.y:a.targetY+44;fioraDuration(f,a,at+22);a.motionCommitEnd=at+22;a.activeFrames=[CombatData.window(at+8,at+12,'front',{pose:12,damage:7*(a.fioraBoost?1.12:1)})];}
const FioraRules=NewcomerCore.create('fiora',FioraMoves,{
reset(){for(const f of fighters)if(f.characterId==='fiora')f.fioraShiftTime=f.fioraShiftCooldown=f.fioraDroneCooldown=0;},
status(f){for(const k of['fioraShiftCooldown','fioraDroneCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);if(f.respawn)f.fioraShiftTime=0;else if(f.fioraShiftTime>0&&--f.fioraShiftTime===0)f.fioraShiftCooldown=480;const c=CharacterData.fiora,m=f.fioraShiftTime>0?1.15:1;for(const k of['walkSpeed','runSpeed','initialDashSpeed','airSpeed','airAcceleration'])f.character[k]=c[k]*m;},
prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.fioraBoost=f.fioraShiftTime>0;if(a.fioraBoost&&!a.fioraShift){a.damage*=1.12;for(const w of a.activeFrames)if(w.damage!==undefined)w.damage*=1.12;}if(a.fioraDirect){a.fired=true;a.targetX=a.origin.x+a.originFace*200;a.targetY=a.origin.y-44;fioraBeginFollow(f,a,8);}},
action(f,i,r){const a=f.attack,t=f.timer;
if(a.fioraCombo){a.pose=t<14?6:t<22?9:40;f.vx=t>=8&&t<=24?a.originFace*1.5:0;}
if(a.fioraShift&&t===16&&!a.eventsDone.has('shift')){a.eventsDone.add('shift');f.fioraShiftTime=720;f.fastFall=false;ring(f.x,f.y-42,'#81d9ff',80);}
if(a.fioraDrone){f.fastFall=false;if(!a.following)f.vx*=.6;
if(a.fioraDirect&&t<a.followAt){f.vx=moveToward(f.vx,0,.6);return;}
if(t===16&&!a.fired){a.fired=true;a.targetX=a.origin.x+a.originFace*200;a.targetY=a.origin.y-44;for(const side of[-1,1])r.spawn(f,{kind:'swordDrone',x:f.x,y:f.y-44,vx:0,vy:0,originX:f.x,originY:f.y-44,side,face:a.originFace,targetX:a.targetX,targetY:a.targetY,radius:13,damage:5*(a.fioraBoost?1.12:1),life:45});f.fioraDroneCooldown=110;fioraDuration(f,a,46);a.motionCommitEnd=46;}
// A fresh press commits to a short follow-up; holding the first press only sends drones.
if(a.fired&&!a.following&&t>=22&&t<=35&&i.special&&!a.specialWas)fioraBeginFollow(f,a,t);
if(a.following){const dt=t-a.followAt;if(dt<10){f.vx=(a.followX-a.followStartX)/10;f.vy=a.originGrounded?0:(a.followY-a.followStartY)/10;a.gravityMultiplier=0;a.pose=9;}else{f.vx=0;f.vy=0;a.gravityMultiplier=1;a.pose=12;}}a.specialWas=!!i.special;}
if(a.fioraZero){f.fastFall=false;if(t<9){f.vx*=.5;return;}if(!a.zeroStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){fioraDuration(f,a,t+58);return;}}
if(!a.zeroStarted){a.zeroStarted=true;a.zeroAt=t;f.recovered=true;f.grounded=false;f.fastFall=false;fioraDuration(f,a,t+54);a.activeFrames=[CombatData.window(t,t+6,'spin',{pose:43,damage:4*(a.fioraBoost?1.12:1)})];a.direction=Math.abs(i.x)>.2?Math.sign(i.x):f.face;}
const dt=t-a.zeroAt;a.pose=dt<35?43:44;a.gravityMultiplier=0;
if(dt<35){const turn=Math.abs(i.x)>.2?clamp(i.x,-1,1):a.direction*.4;f.vx=moveToward(f.vx,turn*(3.8+Math.sin(dt*Math.PI/35)*3),.55);f.vy=-10.5+dt*.18;}
else{f.vx=moveToward(f.vx,clamp(i.x,-1,1)*6,.25);f.vy=.4+(dt-35)*.16;}if(dt>=50)a.gravityMultiplier=1;
}
},
projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;const t=q.age;if(t<=25){const u=t/25;q.x=q.originX+(q.targetX-q.originX)*u;q.y=q.originY+q.side*Math.sin(u*Math.PI)*48;}else{const u=(t-25)/20;q.x=q.targetX+(f.x-q.targetX)*u;q.y=q.targetY+(f.y-44-q.targetY)*u;}q.face=Math.sign(q.x-q.previousX)||q.face;const p=platforms.find(p=>p.main);if(q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90){q.dead=true;return true;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))fioraDroneHit(q,f,target,b);return true;},
boxes(f,a,w){const shape=w.shape,h=44,reach=a.type.includes('smash')?103:a.fioraCombo?83:86;const p=shape==='up'?[0,-30,0,-110]:shape==='down'?[0,-30,8,35]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-12,reach,-12]:shape==='spin'?[-32,-h,32,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?24:14,window:w,modifiers:w}];},
hurtboxes(f){const low=[3,11,22,32,36,42].includes(fioraPose(f));return[{part:'head',x:f.x,y:f.y-(low?38:80),r:13},{part:'torso',x:f.x,y:f.y-(low?24:47),r:18},{part:'legs',x:f.x,y:f.y-13,r:13}];},
cpu(f,o,i,clear){if(f.attack?.fioraZero){clear();i.x=Math.sign(720-f.x);i.y=-1;return;}if(f.attack?.fioraDrone){clear();i.x=0;i.y=0;i.special=f.timer===25&&Math.abs(o.x-f.x)>100&&Math.abs(o.x-f.x)<260;return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if(d>260&&!f.fioraShiftTime&&!(f.fioraShiftCooldown>0)){clear();i.x=0;i.y=1;i.special=true;}else if(d>150&&d<330){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d<80&&frame%80===f.id){clear();i.x=0;i.y=0;i.special=true;}}}
});
function fioraDroneHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn||CombatSystem.protection(o).intangible)return false;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...FioraMoves.dash,type:'fioraDroneHit',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,baseKnockback:2.4,knockbackGrowth:.04,staleMultiplier:q.stale,launchDirection:q.face,angle:-.45},b,touch);return true;}
function fioraPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

function fioraFlip(f,n){return n===7||n===14;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('fiora',{"jab2":{"strike":[7],"windup":3},"jab3":{"strike":[6,7],"windup":3},"heavy":{"strike":[9],"windup":3},"dashAttack":{"strike":[2,9],"windup":3},"fair":{"strike":[12,13],"windup":3}});
