'use strict';
const JudasMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword',tether:true};
 const a=NewcomerCore.moves(['右短剣斬り','左長剣斬り','双連撃','双刃の水平斬り','飛燕斬','低姿勢の交差斬り','風塵斬抜','瞬神裂破剣','千層虚空閃','風華地爆衝','四連旋刃','空中二段斬り','背面突き','月閃の廻','休めるき一閃'],{
  dragon:m('月閃光 → 月閃光法',9,[w(9,13,'front',{pose:40,damage:6,index:0})],31,0,{...opt,judasMoon:true,pose:40,damage:6,rangedInterval:30}),
  dash:m('幻影刃 → 幻影回帰',8,[w(8,13,'front',{pose:48,damage:7,index:0}),w(22,27,'front',{pose:49,damage:9,index:1})],21,8,{...opt,judasReturn:true,pose:48,damage:7,gravityMultiplier:.3,airControlMultiplier:0}),
  rise:m('飛連衝 → 萬葬展開',7,[w(7,14,'up',{pose:33,damage:6,index:0})],50,15,{...opt,tether:false,judasAscent:true,pose:33,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:16}),
  gale:m('ネガティブゲイト → イビルスフィア',34,[],22,0,{...opt,judasGate:true,pose:43,damage:0,gravityMultiplier:.6}),
  airDrop:m('空中ネガティブゲイト',34,[],22,8,{...opt,judasGate:true,pose:43,damage:0,aerial:true,gravityMultiplier:.6})
 },'sword',135),p={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:37,getupAttack:37,forwardThrow:19,backThrow:14,upThrow:8,downThrow:11};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
const judasCosts={dragon:12,dash:16,rise:18,gale:30,airDrop:30};
function judasSP(f){return clamp(f.judasSP??100,0,100);}
function judasGate(f,type){if(type==='rise')return true;if(judasSP(f)<(judasCosts[type]||0))return false;return !(type==='dragon'&&JudasRules.objects.some(q=>q.owner===f.id&&q.kind==='moon'&&!q.dead)||['gale','airDrop'].includes(type)&&JudasRules.objects.some(q=>q.owner===f.id&&q.kind==='gate'&&!q.dead));}
function judasDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function judasLaunch(f,a,t,i){a.launchAt=t;a.launchX=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.grounded=false;f.recovered=true;a.activeFrames=[CombatData.window(t,t+7,'up',{pose:33,damage:6,index:0})];if(a.funded)a.activeFrames.push(CombatData.window(t+13,t+19,'spin',{pose:42,damage:7,index:1}));a.activeStart=t;a.activeEnd=a.activeFrames.at(-1).end;a.motionLastEvent=a.funded?t+34:a.activeEnd;judasDuration(f,a,t+(a.funded?59:40));}
const JudasRules=NewcomerCore.create('judas',JudasMoves,{
 reset(){for(const f of fighters)if(f.characterId==='judas')f.judasSP=100;},
 status(f){if(f.respawn){f.judasSP=100;return;}if(!f.hitlag&&!f.hitstun&&!f.grabOwner)f.judasSP=Math.min(100,judasSP(f)+(f.attack?.judasGate ? .1 : f.attack ? .25 : .8));},
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));const cost=judasCosts[a.type]||0;a.funded=judasSP(f)>=cost;f.judasSP=Math.max(0,judasSP(f)-(a.special?Math.min(cost,judasSP(f)):['grab','pummel','ledge','getupAttack'].includes(a.type)||a.type.endsWith('Throw')?0:2));
  if(a.judasMoon)a.motionLastEvent=a.motionCommitEnd=30;
  if(a.judasReturn){a.startX=f.x;a.startY=f.y;a.motionLastEvent=a.motionCommitEnd=29;}
  if(a.judasAscent)a.motionLastEvent=41;
  if(a.judasGate)a.motionLastEvent=a.motionCommitEnd=34;
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld),pressed=held&&!a.specialWas;a.specialWas=held;
  if(a.judasMoon){f.vx*=.75;if(t>=21&&t<=29)a.pose=52;if(!a.shot&&t>=25){a.shot=true;r.spawn(f,{kind:'moon',x:f.x+f.face*58,y:f.y-40,vx:f.face*7.5,vy:-2.9,radius:23,damage:9,life:45,sourceType:'dragon'});}}
  if(a.judasReturn){f.fastFall=false;f.vx=0;const forward=t>=8&&t<=13,returning=t>=22&&t<=27;a.pose=t>=28?51:t>=22?49:48;f.face=t>=22?-a.originFace:a.originFace;
   if(t<8){f.vy*=.4;}else if(forward){const nx=f.x+a.originFace*20,p=platforms.find(p=>p.main);if(!a.originGrounded||nx>p.x+12&&nx<p.x+p.w-12)f.x=nx;f.vy=Math.min(f.vy,0);}else if(returning){const d=28-t;f.x+=(a.startX-f.x)/d;if(!a.originGrounded)f.y+=(a.startY-f.y)/d;f.vy=0;}else if(t===28){f.face=a.originFace;}
  }
  if(a.judasAscent){f.fastFall=false;if(t<7){f.vx*=.45;f.vy=0;return;}
   if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];judasDuration(f,a,t+110);}else judasLaunch(f,a,t,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)judasLaunch(f,a,t,i);return;}const dt=t-a.launchAt;
   if(a.funded&&!a.finishAt&&dt>=22&&dt<=34&&pressed){a.finishAt=t;f.face=Math.abs(i.x)>.2?Math.sign(i.x):a.launchX;a.finishX=f.face;a.pose=50;a.activeFrames.push(CombatData.window(t+1,t+8,'up',{pose:50,damage:12,index:2,angle:-1.18,baseKnockback:4.8,knockbackGrowth:.075}));a.activeEnd=t+8;a.motionLastEvent=a.activeEnd;judasDuration(f,a,t+30);}
   if(a.finishAt){const d=t-a.finishAt;a.pose=d<12?50:35;a.gravityMultiplier=d<12?0:1;if(d<12){f.vx=a.finishX*5;f.vy=-9.5+d*.35;}else f.vx*=.98;}
   else if(dt<(a.funded?23:15)){a.pose=dt<13?33:42;a.gravityMultiplier=0;f.vx=a.launchX*(dt<13?3.3:1.6);f.vy=dt<13?-13.2+dt*.3:-6+(dt-13)*.35;}
   else{a.pose=35;a.gravityMultiplier=1;f.vx*=.97;}
  }
  if(a.judasGate){f.vx*=.65;if(!a.opened&&t>=34){a.opened=true;r.spawn(f,{kind:'gate',x:f.x+f.face*145,y:f.y-44,vx:0,vy:0,damage:0,radius:74,life:68,sourceType:a.type,pulse:-1});}}
 },
 onHit(f,o,hit){if(!hit.projectile&&!hit.special)f.judasSP=Math.min(100,judasSP(f)+6);},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.kind==='moon'){q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.vy+=.15;q.y+=q.vy;const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(touch||shield){q.hits.add(target.id);CombatSystem.hit(f,target,{...JudasMoves.dragon,type:'dragon',sourceType:'dragon',projectile:true,charge:0,damage:q.damage,launchDirection:q.face,angle:-.9,staleMultiplier:q.stale},b,touch);q.dead=true;break;}}return true;}
  if(q.kind!=='gate')return true;const pulse=[12,28,44,60].indexOf(q.age),burst=q.age>=60,b={x1:q.x,y1:q.y,x2:q.x,y2:q.y,radius:burst?90:74};
  for(const target of BattlePlayers.targets(f)){if(CombatSystem.protection(target).intangible)continue;const dx=q.x-target.x,dy=q.y-(target.y-40),dist=Math.hypot(dx,dy);if(!burst&&dist<155&&dist>18&&!target.hitlag&&!target.hitstun&&!target.pendingLaunch&&!target.grabOwner&&!['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)){target.vx=clamp(target.vx+dx/dist*.3,-3.5,3.5);}
   if(pulse<0)continue;const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(touch||shield)CombatSystem.hit(f,target,{...JudasMoves.gale,type:'gale',sourceType:q.sourceType,projectile:true,charge:0,damage:burst?11:2.5,launchDirection:target.x<q.x?-1:1,angle:burst?-1.15:-1.4,baseKnockback:burst?4.8:1,knockbackGrowth:burst?.075:.005,staleMultiplier:q.stale},b,touch);
  }return true;
 },
 boxes(f,a,w){if(a.judasGate)return[];const s=w.shape,reach=({jab:110,jab2:121,jab3:124,heavy:143,low:124,dashAttack:145,smash:165,fair:143,bair:134,dash:145,rise:123})[a.type]||124,p=s==='up'?[0,-34,0,-127]:s==='down'?[0,-34,14,42]:s==='back'?[0,-45,-reach,-45]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-64,-45,64,-45]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?30:s==='spin'?27:19,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36,40,46,52].includes(judasPose(f));return[{part:'head',x:f.x,y:f.y-(low?39:78),r:14},{part:'torso',x:f.x,y:f.y-(low?22:47),r:18},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 cpu(f,o,i,clear){if(f.attack?.judasAscent&&f.timer-f.attack.launchAt>=24&&!f.attack.finishAt){i.special=true;i.specialHeld=true;i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded&&judasSP(f)>=30&&!JudasRules.objects.some(q=>q.owner===f.id&&q.kind==='gate'&&!q.dead)&&Math.abs(o.x-f.x)>150&&Math.abs(o.x-f.x)<280&&frame%113===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
function judasPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:34,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('judas',{jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},heavy:{windup:3,strike:[41],recovery:0},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46,14],recovery:3},air:{windup:34,strike:[10],recovery:5},fair:{windup:34,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:34,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}});
