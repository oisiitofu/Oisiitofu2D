'use strict';
// Inclusive 60 Hz attack windows also drive the anticipation/impact/return poses.
const EmmaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=6,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'sword',...opts});
 const moves={
  jab:cut('抜刀斬り',5,6,3,133,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('逆手の斬り込み',4,5,4,141,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('跳ね上げ斬り',7,9,7,158,8,'up',{angle:-1.1,petals:true}),
  heavy:cut('蔦の横薙ぎ',8,11,10,185,6,'front',{petals:true}),
  up:cut('蔦の上昇斬り',6,12,8,149,8,'up',{angle:-1.4}),
  low:cut('低い薙ぎ払い',7,8,7,148,15,'low',{angle:-.2}),
  dashAttack:m('滑り込み斬り',12,[w(12,15)],13,0,{damage:11,reach:162,pose:15,impulse:4,soundFamily:'sword'}),
  smash:m('Blade Art: Sakura',12,[w(12,15)],25,0,{damage:21,reach:221,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.102,petals:true,soundFamily:'sword'}),
  upsmash:m('Sakura Storm',13,[w(13,17,'up')],24,0,{damage:19,reach:181,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,thornStorm:true,thornHeight:142,thornRadius:24,soundFamily:'earth'}),
  downsmash:m('Chimeric Flow',10,[w(10,12,'low'),w(20,22,'back')],25,0,{damage:18,reach:199,pose:10,chargeFrame:3,chargeMaxFrames:60,petals:true,soundFamily:'sword'}),
  air:m('回転斬りと花弁',6,[w(6,7,'spin',{damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(15,20,'spin',{damage:7})],12,7,{damage:7,reach:157,pose:10,aerial:true,petals:true,soundFamily:'sword'}),
  fair:m('前方の斜め斬り',6,[w(6,8)],12,10,{damage:10,reach:177,pose:6,aerial:true,petals:true,soundFamily:'sword'}),
  bair:m('蔦の振り返り斬り',7,[w(7,11,'back')],12,10,{damage:11,reach:171,pose:7,aerial:true,soundFamily:'sword'}),
  uair:m('クーと追撃上昇斬り',5,[w(5,9,'up')],13,8,{damage:9,reach:168,pose:8,aerial:true,kooUpper:true,angle:-1.5,soundFamily:'sword'}),
  dair:m('絶隠下降斬り',9,[w(9,30,'plunge')],12,14,{damage:13,reach:116,pose:11,aerial:true,diveSpeed:11.5,airControlMultiplier:.3,gravityMultiplier:0,landingMove:'petalImpact',bounceOnHit:-6,meteorFrame:11,meteorAngle:1.45,petals:true,soundFamily:'sword'}),
  petalImpact:m('花弁・着地衝撃',1,[w(1,4,'shockwave')],12,0,{damage:7,reach:192,pose:3,petals:true,special:true,canClank:false,soundFamily:'earth'}),
  dragon:m('Track Shot',10,[],17,12,{pose:13,trackShot:true,projectile:true,spellShots:[10],chargeFrame:4,chargeButton:'special',chargeMaxFrames:50,shotSpeed:19,chargedSpeed:13,shotDamage:7,chargedDamage:14,shotRadius:6,chargedRadius:12,shotLife:26,chargedLife:40,aimScale:.18,canClank:false,soundFamily:'gun'}),
  dash:m('Koo Pounce',12,[w(28,31)],16,16,{damage:12,reach:184,pose:9,kooCommand:true,callFrame:6,pounceDelay:10,pounceDuration:12,landingDuration:8,returnDuration:12,range:340,flankOffset:90,pounceHeight:105,kooDamage:7,kooRadius:25,cooldown:75,recallEnd:24,feintTotal:30,finisherStep:28,animationWindows:[{start:5,end:27,pose:13}],soundFamily:'sword'}),
  rise:m('Vine Vault',5,[],14,18,{pose:13,vineVault:true,tether:true,hookFrame:10,swingEnd:68,anchorReach:480,handOffset:127.1124705882353,handX:11.640352941176472,reelSpeed:4.2,minRope:64,pumpAcceleration:.006,angularGravity:.6,releaseMin:14,releaseBoost:15,releaseSpeed:7,missBoost:11,gravityMultiplier:0,airControlMultiplier:0,soundFamily:'chain',animationWindows:[{start:5,end:9,pose:13},{start:10,end:68,pose:16}],animation:{anticipationEnd:2,anticipationPose:14,accelerationPose:13,followThroughFrames:4,recoveryPose:5,lean:0,lunge:0,impactScale:1}}),
  vineFinish:m('蔦・跳躍斬り',5,[w(5,8,'up')],12,18,{damage:9,reach:157,pose:8,aerial:true,special:true,helpless:true,angle:-1.4,soundFamily:'sword'}),
  gale:m('Helm Splitter',18,[w(18,22,'shockwave')],19,0,{damage:15,reach:214,pose:17,helmSlam:true,petals:true,soundFamily:'earth'}),
  airHelm:m('Helm Splitter・空中',16,[w(16,45,'plunge')],12,18,{damage:15,reach:125,pose:11,special:true,helmDive:true,petals:true,diveSpeed:13,airControlMultiplier:.2,gravityMultiplier:0,landingMove:'helmImpact',bounceOnHit:-7,meteorFrame:18,meteorAngle:1.48,soundFamily:'sword'}),
  helmImpact:m('Helm Splitter・地面衝撃',1,[w(1,5,'shockwave')],17,0,{damage:11,reach:228,pose:17,helmSlam:true,petals:true,special:true,canClank:false,soundFamily:'earth'})
 };
 moves.rise.totalFrames=moves.rise.swingEnd+moves.rise.recoveryFrames;moves.rise.FAF=moves.rise.totalFrames+1;
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:id==='pummel'?'staff':'sword'};}
 moves.grab.name='蔦つかみ';moves.grab.reach=105;moves.pummel.name='柄の打撃';moves.forwardThrow.name='蔦の引き寄せ投げ';moves.backThrow.name='蔦の背面投げ';moves.upThrow.name='クーの打ち上げ';moves.downThrow.name='足払い';
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(!a.vineVault)a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const EmmaRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='emma'){f.emmaKooCooldown=0;f.emmaSideUsed=f.emmaHelmUsed=false;}}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y+1&&y<p.y+90+r;}
 function anchorTarget(f,a,i={x:0,y:-1}){const hand={x:f.x+f.face*a.handX,y:f.y-a.handOffset},points=platforms.flatMap(p=>[{x:p.x,y:p.y},{x:p.x+p.w,y:p.y}]);
  return points.filter(p=>p.y<hand.y+30&&Math.hypot(p.x-hand.x,p.y-hand.y)<=a.anchorReach&&!Array.from({length:24},(_,n)=>terrain(lerp(hand.x,p.x,(n+1)/25),lerp(hand.y,p.y,(n+1)/25))).some(Boolean)).sort((p,q)=>Math.hypot(p.x-hand.x,p.y-hand.y)-i.x*(p.x-hand.x)*.55-(Math.hypot(q.x-hand.x,q.y-hand.y)-i.x*(q.x-hand.x)*.55))[0]||null;
 }
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.kooCommand&&!f.grounded)f.emmaSideUsed=true;if(a.helmDive)f.emmaHelmUsed=true;
  if(a.trackShot){a.aim=0;a.animation={...a.animation,anticipationPose:13,accelerationPose:13};}
  if(a.vineVault){a.hook=anchorTarget(f,a);a.castOrigin={x:f.x+f.face*28,y:f.y-38};a.swingAngle=a.swingOmega=0;f.vx=f.vy=0;}
 }
 function release(f,i={},automatic=false){const a=f.attack;if(!a?.vineVault)return;const tangent={x:Math.cos(a.swingAngle)*(a.ropeLength||0)*a.swingOmega,y:-Math.sin(a.swingAngle)*(a.ropeLength||0)*a.swingOmega},dir=Math.abs(i.x)>.15?Math.sign(i.x):a.hook?Math.sign(a.hook.x-f.x)||f.face:f.face;
  const vx=clamp(tangent.x*.75+dir*a.releaseSpeed,-14,14)*(automatic?.85:1),vy=Math.min(-a.releaseBoost,tangent.y-a.releaseBoost*.7);f.gravityOff=false;f.fastFall=false;f.recovered=true;f.grounded=false;f.face=dir;attack(f,'vineFinish');f.vx=vx;f.vy=vy;f.specialLandingLag=a.landingLagFrames;GameAudio.cue('double-jump',.8,f);
 }
 function callKoo(f,a){const o=BattlePlayers.target(f),side=Math.sign(o.x-f.x)||f.face,target={x:f.x+clamp(o.x-f.x,-a.range,a.range),y:o.y},flank=NaegiRules.safeStep({...f,x:target.x,y:target.y},{x:target.x+side*a.flankOffset,y:target.y});
  objects.push({kind:'koo',owner:f.id,age:0,life:a.pounceDelay+a.pounceDuration+a.landingDuration+a.returnDuration,origin:{x:f.x-side*65,y:f.y},target,flank:{x:flank.x,y:flank.y},x:f.x-side*65,y:f.y,previousX:f.x-side*65,previousY:f.y,face:side,attackFace:-side,pose:1,delay:a.pounceDelay,duration:a.pounceDuration,landing:a.landingDuration,returning:a.returnDuration,height:a.pounceHeight,damage:a.kooDamage,radius:a.kooRadius,stale:a.staleMultiplier,hits:new Set(),intangible:false});f.emmaKooCooldown=a.cooldown;GameAudio.cue('wing-swing',.7,f);
 }
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.trackShot){a.aim=clamp(i.y*a.aimScale,-a.aimScale,a.aimScale);if(t===a.startupFrames&&!a.eventsDone.has('shot')){a.eventsDone.add('shot');const charged=a.charge>=.5,speed=charged?a.chargedSpeed:a.shotSpeed;objects.push({kind:'shot',owner:f.id,face:f.face,x:f.x+f.face*38,y:f.y-40,previousX:f.x+f.face*38,previousY:f.y-40,vx:Math.cos(a.aim)*speed*f.face,vy:Math.sin(a.aim)*speed,age:0,life:charged?a.chargedLife:a.shotLife,radius:charged?a.chargedRadius:a.shotRadius,damage:charged?a.chargedDamage:a.shotDamage,charged,stale:a.staleMultiplier,hits:new Set()});f.vx-=f.face*(charged?1.5:.7);}}
  if(a.kooCommand){if(t===a.callFrame&&!a.eventsDone.has('koo')){a.eventsDone.add('koo');callKoo(f,a);}if(t<=a.recallEnd&&i.guardPressed){a.recalled=true;a.activeFrames=[];a.activeStart=a.activeEnd=null;a.totalFrames=a.feintTotal;a.FAF=a.totalFrames+1;a.motionEndFrames=a.totalFrames;f.buffer=null;for(const q of objects)if(q.kind==='koo'&&q.owner===f.id){q.recalled=true;q.returnOrigin={x:q.x,y:q.y};q.returnStart=q.age;}GameAudio.cue('dodge',.55,f);}if(t===a.finisherStep&&!a.recalled){const q=NaegiRules.safeStep(f,{x:f.x+f.face*32,y:f.y});f.x=q.x;}}
  if(a.vineVault){f.fastFall=false;if(t<a.hookFrame){a.hook=anchorTarget(f,a,i);f.vx=f.vy=0;}
   if(t===a.hookFrame){f.recovered=true;f.grounded=false;f.specialLandingLag=a.landingLagFrames;f.vy=-3;if(a.hook){const dx=f.x+f.face*a.handX-a.hook.x,dy=f.y-a.handOffset-a.hook.y;a.ropeLength=Math.max(a.minRope,Math.hypot(dx,dy));a.swingAngle=Math.atan2(dx,dy);GameAudio.cue('chain',.7,f);}else{a.ropeLength=0;f.vy=-a.missBoost;}}
   if(t>a.hookFrame&&t<=a.swingEnd){if(a.hook){a.ropeLength=Math.max(a.minRope,a.ropeLength-a.reelSpeed);a.swingOmega=clamp(a.swingOmega-Math.sin(a.swingAngle)*a.angularGravity/a.ropeLength+i.x*a.pumpAcceleration,-.12,.12);a.swingAngle+=a.swingOmega;const desired={x:a.hook.x+Math.sin(a.swingAngle)*a.ropeLength-f.face*a.handX,y:a.hook.y+Math.cos(a.swingAngle)*a.ropeLength+a.handOffset},q=NaegiRules.safeStep(f,desired);f.vx=q.x-f.x;f.vy=q.y-f.y;f.grounded=false;if(q.blocked){a.swingOmega*=-.5;a.swingAngle=Math.atan2(q.x+f.face*a.handX-a.hook.x,q.y-a.handOffset-a.hook.y);}}
    else{f.vx=i.x*3.5;f.vy+=f.character.gravity;}
    if(t>=a.releaseMin&&(i.special||i.jump||i.guardPressed)){release(f,i);return;}}
   if(t===a.swingEnd+1){release(f,i,true);return;}}
 }
 function onHit(f,o,a){if(a.bounceOnHit&&!f.grounded&&f.attack){const vy=a.bounceOnHit;f.attack=null;f.gravityOff=false;f.vy=vy;f.fastFall=false;f.specialLandingLag=0;PlayerStates.enter(f,'Fall');}}
 function thornBox(f,a,w){return[{x1:f.x,y1:f.y-8,x2:f.x,y2:f.y-a.thornHeight,radius:a.thornRadius,window:w}];}
 function collide(q){for(const o of BattlePlayers.targets(fighters[q.owner])){if(q.dead)break;collideOne(q,o);}}
 function collideOne(q,o){const f=fighters[q.owner];if(o.respawn||o.hitlag||q.hits.has(o.id))return;const b={x1:q.previousX,y1:q.previousY-(q.kind==='koo'?32:0),x2:q.x,y2:q.y-(q.kind==='koo'?32:0),radius:q.radius},contact=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!(contact||shield)||CombatSystem.protection(o).intangible)return;q.hits.add(o.id);const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...EmmaMoves.dragon,type:q.kind==='koo'?'dash':'dragon',damage:q.damage,charge:0,staleMultiplier:q.stale,projectile:true,soundFamily:q.kind==='koo'?'claw':'gun',launchDirection:q.kind==='koo'?q.attackFace:q.face,angle:-.65,baseKnockback:q.charged?4:2,knockbackGrowth:q.charged?.07:.035},b,contact);if(q.kind==='shot')q.dead=true;}
 function tick(){for(const f of fighters)if(f.characterId==='emma'){if(f.grounded||f.ledge||f.respawn)f.emmaSideUsed=f.emmaHelmUsed=false;if(!f.hitlag)f.emmaKooCooldown=Math.max(0,(f.emmaKooCooldown||0)-1);if(f.respawn)f.emmaKooCooldown=0;}
  for(const q of objects){const f=fighters[q.owner];if(!f||f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;
   if(q.kind==='shot'){const n=Math.max(1,Math.ceil(Math.hypot(q.vx,q.vy)/5));for(let j=0;j<n;j++){q.x+=q.vx/n;q.y+=q.vy/n;if(terrain(q.x,q.y,q.radius)){q.dead=true;break;}}if(!q.dead)collide(q);}
   if(q.kind==='koo'){let next;if(q.recalled){const u=clamp((q.age-q.returnStart)/q.returning,0,1);next={x:lerp(q.returnOrigin.x,f.x-q.face*70,u),y:lerp(q.returnOrigin.y,f.y,u)};q.pose=0;q.face=Math.sign(next.x-q.x)||q.face;if(u===1)q.dead=true;}
    else if(q.age<=q.delay){const u=q.age/q.delay;next={x:lerp(q.origin.x,q.flank.x,u),y:lerp(q.origin.y,q.flank.y,u)-Math.sin(Math.PI*u)*q.height};q.pose=q.age<q.delay*.3?1:2;}
    else if(q.age<=q.delay+q.duration){const u=(q.age-q.delay)/q.duration;next={x:lerp(q.flank.x,q.target.x-q.attackFace*25,u),y:lerp(q.flank.y,q.target.y,u)-Math.sin(Math.PI*u)*q.height*.45};q.pose=u<.55?2:3;q.face=q.attackFace;}
    else if(q.age<=q.delay+q.duration+q.landing){next={x:q.x,y:q.target.y};q.pose=4;}
    else{const u=(q.age-q.delay-q.duration-q.landing)/q.returning;next={x:lerp(q.target.x-q.attackFace*25,f.x-f.face*65,u),y:lerp(q.target.y,f.y,u)};q.pose=0;}
    const safe=NaegiRules.safeStep({...f,x:q.x,y:q.y,character:{...f.character,ecb:{radius:18,height:64}}},next);q.x=safe.x;q.y=safe.y;if(!q.recalled&&q.age>q.delay&&q.age<=q.delay+q.duration)collide(q);}
   if(q.age>=q.life)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.vineVault){const a=f.attack,hook=a.hook,side=hook&&hook.x<720?-1:1,outside=hook?(f.x-hook.x)*side>f.character.ecb.radius+2:true,release=f.timer>=a.releaseMin&&(outside&&f.y<=(hook?.y??p.y)+165||f.timer>=a.swingEnd-2);i.x=release&&hook?-side:hook?Math.sign(side*1.25-a.swingAngle-a.swingOmega*14):f.x<720?1:-1;i.y=0;i.special=release;i.jump=i.guard=i.jab=i.smash=i.heavy=false;}
  else if(f.attack?.kooCommand){i.x=0;i.y=0;i.special=i.jump=i.guard=i.jab=i.smash=i.heavy=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=i.jab=i.heavy=i.smash=i.guard=false;i.jump=f.airJumps>0&&f.vy>=0;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-80&&(f.x<p.x||f.x>p.x+p.w)){i.x=0;i.y=-1;i.special=true;i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  if(f.attack?.trackShot)i.specialHeld=Math.abs(o.x-f.x)>240&&f.attack.chargeFrames<35;return i;
 }
 return{reset,terrain,anchorTarget,prepare,release,callKoo,action,onHit,thornBox,collide,tick,cpu,get objects(){return objects;}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(EmmaMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('emma',{"heavy":{"strike":[7,9],"windup":14},"fair":{"strike":[13],"windup":14},"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"jab3":{"strike":[6,9],"windup":14},"downsmash":{"strike":[17,7],"windup":14},"dashAttack":{"strike":[2,9],"windup":14}});
