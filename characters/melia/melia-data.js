'use strict';
const MeliaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'magic'};
const a=NewcomerCore.moves(['ステッキ連撃','横薙ぎ','魔波弾','突き払い','サモンエレメント','地面から結晶','ステッキ突進','エレメントレイ','召喚陣展開','大地の結晶','回転薙ぎ','風の刃','後方魔法弾','上方結晶','落下魔法陣'],{
dragon:m('エレメントサモン',14,[],24,0,{...opt,meliaSummon:true,projectile:true,pose:40,damage:7,chargeFrame:6,chargeButton:'special',chargeMaxFrames:36,rangedInterval:50,rangedRearm:25}),
dash:m('マインドブラスト',20,[],16,0,{...opt,meliaField:true,projectile:true,pose:41,damage:3}),
rise:m('サモンフライト',10,[w(10,17,'spin',{pose:42,damage:4})],64,14,{...opt,meliaFlight:true,pose:42,damage:4,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
gale:m('エレメントチェンジ',10,[],10,0,{...opt,meliaChange:true,pose:45,damage:0}),
airDrop:m('空中エレメントチェンジ',10,[],10,10,{...opt,meliaChange:true,aerial:true,pose:45,damage:0})
},'staff',145),poses={jab:6,jab2:7,jab3:9,heavy:9,up:8,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:6,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
const MeliaElements=['炎','氷','雷','風'],MeliaColors=['#ff8247','#7bcdff','#ffe27e','#75efb9'];
function meliaElement(f){return f.meliaElement??0;}
function meliaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
const MeliaRules=NewcomerCore.create('melia',MeliaMoves,{
reset(){for(const f of fighters)if(f.characterId==='melia'){f.meliaElement=0;f.meliaSummonCooldown=f.meliaFieldCooldown=f.meliaChangeCooldown=0;}},
status(f){for(const k of['meliaSummonCooldown','meliaFieldCooldown','meliaChangeCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);if(f.respawn)f.meliaElement=0;},
prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.meliaElement=meliaElement(f);},
action(f,i,r){const a=f.attack,t=f.timer;
if(a.meliaSummon&&t===14&&!a.fired){a.fired=true;const e=a.meliaElement,power=a.charge||0;r.spawn(f,{kind:'summon',element:e,x:f.x+f.face*35,y:f.y-51,vx:0,vy:0,radius:12+power*5,damage:[9,6,6,5][e]+power*3,life:80,power,air:!a.originGrounded});f.meliaSummonCooldown=[60,54,46,60][e];}
if(a.meliaField&&t===20&&!a.fired){a.fired=true;const x=f.x+f.face*(100+clamp(i.x*f.face,0,1)*100),support=platforms.filter(p=>x>p.x&&x<p.x+p.w&&p.y>=f.y-10&&p.y<f.y+85).sort((a,b)=>a.y-b.y)[0];r.spawn(f,{kind:'field',element:a.meliaElement,x,y:support?support.y-2:f.y-20,vx:0,vy:0,radius:76,damage:3,life:90,pulse:-1});f.meliaFieldCooldown=150;}
if(a.meliaChange&&t===10&&!a.eventsDone.has('element')){a.eventsDone.add('element');f.meliaElement=(meliaElement(f)+1)%4;f.meliaChangeCooldown=0;f.fastFall=false;ring(f.x,f.y-44,MeliaColors[f.meliaElement],65);}
if(a.meliaFlight){f.fastFall=false;if(a.ending){a.gravityMultiplier=1;return;}if(t<10){f.vx*=.8;return;}if(!a.flightStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){meliaDuration(f,a,t+64);return;}}
if(!a.flightStarted){a.flightStarted=true;a.flightAt=t;f.recovered=true;f.grounded=false;f.fastFall=false;meliaDuration(f,a,t+60);a.activeFrames=[CombatData.window(t,t+7,'spin',{pose:42,damage:4})];}
const dt=t-a.flightAt;a.pose=dt<18?42:dt<48?43:44;a.gravityMultiplier=0;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*(a.meliaElement===3?7.2:6),.32);f.vy=dt<18?-9+dt*.22:dt<38?.45:1.4;if(dt>=26&&!i.specialHeld){a.ending=true;a.gravityMultiplier=1;meliaDuration(f,a,t+5);}
}
},
projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}
if(q.kind==='summon'){q.x=f.x+q.face*(35+Math.sin(q.age*.3)*7);q.y=f.y-51-Math.sin(q.age*.25)*5;if(q.age>=10){q.kind=['fire','ice','thunder','wind'][q.element];q.age=0;q.life=[58,65,28,50][q.element];q.vx=q.face*[7,8,16,10][q.element];q.vy=q.air?[1.5,4,0,0][q.element]:[-.7,2.5,0,0][q.element];q.radius=[16,13,9,14][q.element]+q.power*5;}return true;}
if(q.kind==='field'){const pulse=[8,28,48,68].indexOf(q.age);if(pulse>=0&&q.pulse!==pulse){q.pulse=pulse;q.hits.clear();q.damage=pulse===3?5:3;const b={x1:q.x-55,y1:q.y-28,x2:q.x+55,y2:q.y-28,radius:26};for(const target of BattlePlayers.targets(f))meliaObjectHit(q,f,target,b);}return true;}
q.previousX=q.x;q.previousY=q.y;if(q.kind==='fire')q.vy+=.045;
if(q.kind==='wind'&&q.age>=18){const dx=f.x-q.x,dy=f.y-45-q.y,dist=Math.max(1,Math.hypot(dx,dy));q.vx=dx/dist*11;q.vy=dy/dist*11;q.face=Math.sign(q.vx)||q.face;if(dist<20){q.dead=true;return true;}}
q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main),floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y);
if(q.kind==='ice'&&floor){q.groundY=floor.y-10;q.y=q.groundY;q.vy=0;}else if(q.kind==='ice'&&q.groundY!==undefined){if(platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&Math.abs(p.y-10-q.groundY)<1))q.y=q.groundY;else{delete q.groundY;q.vy=3;}}
else if(floor||q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90){q.dead=true;return true;}
if(q.x<-900||q.x>2340||q.y>1400){q.dead=true;return true;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f))if(meliaObjectHit(q,f,target,b)&&q.kind!=='wind'){q.dead=true;break;}return true;
},
boxes(f,a,w){const shape=w.shape,h=44,reach=a.type.includes('smash')?107:88;let p=shape==='up'?[0,-30,0,-110]:shape==='down'?[0,-30,8,35]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-12,reach,-12]:shape==='spin'?[-30,-h,30,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?24:13,window:w,modifiers:w}];},
hurtboxes(f){const low=[3,11,22,32,36].includes(meliaPose(f));return[{part:'head',x:f.x,y:f.y-(low?39:81),r:13},{part:'torso',x:f.x,y:f.y-(low?26:48),r:18},{part:'legs',x:f.x,y:f.y-13,r:13}];},
cpu(f,o,i,clear){if(f.attack?.meliaFlight){clear();i.x=Math.sign(720-f.x);i.y=-1;i.specialHeld=f.y>490;return;}if(f.attack?.meliaSummon){clear();i.specialHeld=Math.abs(o.x-f.x)>240&&f.attack.chargeFrames<20;return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if(d>180&&!(f.meliaChangeCooldown>0)&&frame%180===f.id){clear();i.x=0;i.y=1;i.special=true;}else if(d>120&&d<250&&!(f.meliaFieldCooldown>0)){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d>140&&d<400&&!(f.meliaSummonCooldown>0)){clear();i.x=0;i.y=0;i.special=true;}}}
});
function meliaObjectHit(q,f,o,b){if(q.hits.has(o.id)||o.respawn||CombatSystem.protection(o).intangible)return false;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...MeliaMoves.dragon,type:'melia'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,baseKnockback:q.kind==='field'?1.8:q.kind==='fire'?3.5:2.4,knockbackGrowth:q.kind==='field'?.025:.05,staleMultiplier:q.stale,launchDirection:q.face,angle:q.kind==='field'?-.9:-.45},b,touch);return true;}
function meliaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('melia',{"fair":{"strike":[12,13],"windup":3},"jab3":{"strike":[6,7],"windup":3},"heavy":{"strike":[7,6],"windup":3},"uair":{"strike":[10,15],"windup":3}});
