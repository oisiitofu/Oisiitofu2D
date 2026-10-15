'use strict';
const MegaManExeMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'magic'};
const a=NewcomerCore.moves(['バスター','連射','アッパー','ワイドソード','リフレクトソード','ローリング','ショルダー','ワイドソード','フルカスタム','インビジブルブレード','バスター連射','エアシュート','リフレクトソード','ソード回転','メテオソード'],{
dragon:m('バスターショット',9,[],15,0,{...opt,exeBuster:true,projectile:true,pose:40,damage:3,chargeFrame:4,chargeButton:'special',chargeMaxFrames:45,rangedInterval:28,rangedRearm:16}),
dash:m('エリアスチール',18,[w(19,23,'front',{pose:9,damage:9})],13,0,{...opt,exeArea:true,pose:41,damage:9,airControlMultiplier:0}),
rise:m('リフレクトジャンプ',9,[w(9,16,'spin',{pose:43,damage:5})],48,14,{...opt,exeReflect:true,pose:42,damage:5,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:9}),
gale:m('プログラムアドバンス',18,[],14,0,{...opt,exePA:true,pose:45,damage:0}),
airDrop:m('空中プログラムアドバンス',18,[],14,10,{...opt,exePA:true,aerial:true,pose:45,damage:0})
},'sword',125),poses={jab:6,jab2:7,jab3:8,heavy:9,up:15,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:10,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:9,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.jab3.activeFrames[0].shape='up';a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
const ExeStyleNames=['カスタム','ガッツ','シールド','スピード'],ExeStyleColors=['#5ee9ff','#ff7444','#ffe16c','#63ffac'];
function exeStyle(f){return f.exeStyleTime>0?f.exeStyle:-1;}
function exeOnArea(f){return MegaManExeRules.objects.some(q=>q.kind==='ownedPanel'&&q.owner===f.id&&!q.dead&&Math.abs(q.x-f.x)<85&&Math.abs(q.y-f.y)<22);}
function exeDuration(f,a,total){const d=total-a.totalFrames;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=total;}
const MegaManExeRules=NewcomerCore.create('megamanexe',MegaManExeMoves,{
 reset(){for(const f of fighters)if(f.characterId==='megamanexe'){f.exeStyleTime=f.exePACooldown=f.exeBusterCooldown=f.exeAreaCooldown=0;f.exeNextStyle=0;f.exeStyle=-1;}},
 status(f){for(const k of['exePACooldown','exeBusterCooldown','exeAreaCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);if(f.respawn){f.exeStyleTime=0;f.exeStyle=-1;}else if(f.exeStyleTime>0&&--f.exeStyleTime===0){f.exeStyle=-1;f.exePACooldown=480;}
 const c=CharacterData.megamanexe,m=exeStyle(f)===3?1.12:exeStyle(f)===1?.94:1;for(const k of['walkSpeed','runSpeed','initialDashSpeed','airSpeed','airAcceleration'])f.character[k]=c[k]*m;
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.exeStyle=exeStyle(f);if(a.exeStyle===1&&!a.exePA){a.damage*=1.15;for(const w of a.activeFrames)if(w.damage!==undefined)w.damage*=1.15;}
 if(a.exeBuster){a.chargeHoldFrames=a.chargeMaxFrames=a.exeStyle===0?30:exeOnArea(f)?36:45;}
 if(a.exeArea){a.marker=null;a.targetX=null;}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
 if(a.exeBuster){a.pose=t<9?40:f.grounded?6:10;if(t===9&&!a.fired){a.fired=true;const power=a.charge||0,big=power>.25;r.spawn(f,{kind:'buster',x:f.x+f.face*39,y:f.y-43,vx:f.face*(big?13:15),vy:0,radius:big?15+power*5:8,damage:(big?8+power*5:3)*(a.exeStyle===1?1.15:1),life:big?44:36,charged:big,style:a.exeStyle});f.exeBusterCooldown=big?46:28;}}
 if(a.exeArea){f.vx*=.5;if(t===8&&!a.marker){const p=platforms.find(p=>p.main),o=BattlePlayers.target(f),distance=clamp((o.x-f.x)*f.face-48,130,210);a.targetX=f.x+f.face*distance;if(a.originGrounded)a.targetX=clamp(a.targetX,p.x+25,p.x+p.w-25);a.marker=r.spawn(f,{kind:'areaMark',x:a.targetX,y:f.y,vx:0,vy:0,damage:0,life:16});}
 if(t===18&&!a.transferred){a.transferred=true;const p=platforms.find(p=>p.main),blocked=a.targetX>p.x&&a.targetX<p.x+p.w&&f.y>p.y+8&&f.y-f.character.ecb.height<p.y+90;if(!blocked)f.x=a.targetX;f.vx=0;f.exeAreaCooldown=100;a.pose=9;}
 if(t>=18)a.pose=9;
 }
 if(a.exePA&&t===18&&!a.eventsDone.has('pa')){a.eventsDone.add('pa');f.exeStyle=f.exeNextStyle??0;f.exeNextStyle=(f.exeStyle+1)%4;f.exeStyleTime=720;f.fastFall=false;ring(f.x,f.y-40,ExeStyleColors[f.exeStyle],85);}
 if(a.exeReflect){f.fastFall=false;if(t<9){f.vx*=.5;return;}if(!a.reflectStarted&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89)NewcomerCore.escape(f,a);}
 if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(a.escapeSide){exeDuration(f,a,t+54);return;}}
 if(!a.reflectStarted){a.reflectStarted=true;a.reflectAt=t;a.direction=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.recovered=true;f.grounded=false;f.fastFall=false;f.vx=a.direction*3.5;a.gravityMultiplier=.6;exeDuration(f,a,t+48);a.activeFrames=[CombatData.window(t,t+7,'spin',{pose:43,damage:5})];r.spawn(f,{kind:'reflectPanel',x:f.x,y:f.y+5,vx:0,vy:0,damage:0,life:20});}
 const dt=t-a.reflectAt;a.pose=dt<16?43:44;
 if(!a.rebounded){f.vy=-9+dt*.35;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.2);if(dt>=16||dt>=10&&i.special&&!a.specialWas){a.rebounded=true;a.reboundAt=t;a.direction=Math.abs(i.x)>.2?Math.sign(i.x):a.direction;f.face=a.direction;f.vx=a.direction*7.5;f.vy=-9;a.gravityMultiplier=.8;exeDuration(f,a,t+28);a.activeFrames.push(CombatData.window(t,t+5,'up',{pose:44,damage:4}));r.spawn(f,{kind:'reflectPanel',x:f.x,y:f.y+5,vx:0,vy:0,damage:0,life:20});}}
 else f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.16);a.specialWas=!!i.special;
 }
 },
 onHit(f,o,strike,r){const a=f.attack;if(a?.exeArea&&!a.claimed){a.claimed=true;for(const q of r.objects)if(q.kind==='ownedPanel'&&q.owner===f.id)q.dead=true;r.spawn(f,{kind:'ownedPanel',x:f.x,y:f.y,vx:0,vy:0,damage:0,life:180});}},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.kind!=='buster')return true;q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;const p=platforms.find(p=>p.main);if(q.x<-900||q.x>2340||q.y>1400||q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90){q.dead=true;return true;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||target.respawn||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(!touch&&!shield)continue;q.hits.add(target.id);if(target.attack?.counterWindow&&target.timer>=target.attack.counterWindow[0]&&target.timer<=target.attack.counterWindow[1]){attack(target,target.attack.counterMove);target.inv=target.attack.totalFrames;}else CombatSystem.hit(f,target,{...MegaManExeMoves.dragon,type:'exeBusterHit',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,baseKnockback:q.charged?3.5:1.8,knockbackGrowth:q.charged?.06:.025,hitstunBase:3,hitstunScale:1.2,staleMultiplier:q.stale,launchDirection:q.face,angle:-.4},b,touch);q.dead=true;break;}return true;},
 boxes(f,a,w){const shape=w.shape,h=42,reach=a.type.includes('smash')?96:75;let p=shape==='up'?[0,-30,0,-100]:shape==='down'?[0,-28,8,32]:shape==='back'?[0,-h,-reach,-h]:shape==='low'?[0,-12,reach,-12]:shape==='spin'?[-26,-h,26,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:shape==='spin'?24:14,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36,42].includes(megamanexePose(f));return[{part:'head',x:f.x,y:f.y-(low?38:69),r:17},{part:'torso',x:f.x,y:f.y-(low?23:42),r:18},{part:'legs',x:f.x,y:f.y-12,r:13}];},
 cpu(f,o,i,clear){if(f.attack?.exeReflect){clear();i.x=Math.sign(720-f.x);i.y=-1;return;}if(f.attack?.exeBuster){clear();i.specialHeld=Math.abs(o.x-f.x)>230&&f.attack.chargeFrames<25;return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if(d>280&&!f.exeStyleTime&&!(f.exePACooldown>0)){clear();i.x=0;i.y=1;i.special=true;}else if(d>120&&d<280&&!(f.exeAreaCooldown>0)&&frame%90===f.id){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d>150&&d<400&&!(f.exeBusterCooldown>0)){clear();i.x=0;i.y=0;i.special=true;}}}
});
function megamanexePose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
