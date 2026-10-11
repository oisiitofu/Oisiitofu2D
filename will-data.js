'use strict';
// One-based, inclusive 60 Hz frames. The same clock drives poses, hitboxes and branches.
const WillMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'sword',...opts});
 const moves={
  jab:cut('素早い斬り',5,6,3,128,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('逆手斬り',4,5,4,139,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('薙ぎ払い',7,9,8,164,9),heavy:cut('水平斬り',8,11,10,177),up:cut('すくい上げ',6,12,8,149,8,'up',{angle:-1.4}),low:cut('足払い',7,8,7,155,17,'low',{angle:-.2}),
  dashAttack:m('滑り込み斬り',12,[w(12,15)],13,0,{damage:11,reach:173,pose:15,impulse:4,soundFamily:'sword'}),
  smash:m('英雄の一閃',13,[w(13,16)],24,0,{damage:21,reach:219,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.3,knockbackGrowth:.1,archetype:45,soundFamily:'sword'}),
  upsmash:m('ライダー・オブ・ザ・ブレイド',13,[w(13,17,'up')],24,0,{damage:18,reach:205,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,archetype:44,soundFamily:'light'}),
  downsmash:m('ラウンドスラッシュ',10,[w(10,12,'low'),w(20,23,'back',{pose:17})],22,0,{damage:16,reach:190,pose:17,chargeFrame:4,chargeMaxFrames:60,soundFamily:'sword'}),
  air:m('回転斬り',6,[w(6,9,'spin')],12,7,{damage:8,reach:151,pose:10,aerial:true,soundFamily:'sword'}),
  fair:m('斜め斬り',6,[w(6,8)],12,10,{damage:10,reach:172,pose:9,aerial:true,soundFamily:'sword'}),
  bair:m('後ろ薙ぎ',7,[w(7,11,'back')],12,10,{damage:11,reach:164,pose:7,aerial:true,soundFamily:'wind'}),
  uair:m('突き上げ',5,[w(5,9,'up')],13,8,{damage:9,reach:152,pose:8,aerial:true,angle:-1.5,soundFamily:'sword'}),
  dair:m('急降下突き',9,[w(9,13,'down')],16,14,{damage:13,reach:144,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.15,soundFamily:'sword'}),
  dragon:m('サイク → サイクロ',9,[],15,12,{pose:13,spellShots:[9],chargeFrame:4,chargeButton:'special',chargeMaxFrames:55,windSpell:true,shotSpeed:11,shotLife:48,shotRadius:16,chargedSpeed:7,chargedLife:60,chargedRadius:32,soundFamily:'wind'}),
  dash:m('ホースアタック・騎乗',9,[],120,12,{pose:16,horse:true,mountFrame:9,dismountStart:15,rideEnd:119,rideSpeed:10.5,rideAcceleration:.55,rideBrake:.8,horseJump:12.5,horseJumpCount:1,riderHeight:154,riderHurtboxes:[{part:'head',x:5,y:-136,radius:12},{part:'torso',x:5,y:-112,radius:16},{part:'arm',x:20,y:-114,radius:10},{part:'legs',x:0,y:-68,radius:17}],airRideFrames:28,airRideGravity:.36,airControlMultiplier:0,soundFamily:'wind',animationWindows:[{start:9,end:119,pose:16}],animation:{anticipationEnd:3,anticipationPose:3,accelerationPose:16,followThroughFrames:4,recoveryPose:0,lean:0,lunge:0,impactScale:1}}),
  horseSlash:m('ホースアタック・降り斬り',6,[w(6,9)],16,14,{damage:14,reach:196,pose:9,special:true,soundFamily:'sword',baseKnockback:5,knockbackGrowth:.081,velocityMultiplier:.55,dismountLift:5,airControlMultiplier:.6}),
  horseBrake:m('ホースアタック・下馬',1,[],7,8,{pose:3,special:true,preserveVelocity:false,soundFamily:'wind'}),
  rise:m('ライダー・オブ・ザ・ブレイド・標的跳躍',5,[w(41,44,'spin')],15,22,{damage:11,reach:182,pose:8,bladeRide:true,aimStart:5,aimEnd:15,lockStart:8,launchFrame:16,flightEnd:40,range:420,defaultLift:360,defaultForward:140,aimSpeed:9,pathBow:24,airControlMultiplier:0,ledgeGrabStart:16,canClank:false,helpless:true,soundFamily:'light',animationWindows:[{start:5,end:15,pose:13},{start:16,end:40,pose:4}],animation:{anticipationEnd:2,anticipationPose:14,accelerationPose:8,followThroughFrames:5,recoveryPose:5,lean:0,lunge:0,impactScale:1.12}}),
  gale:m('アーキタイプ・シフト',8,[],10,10,{pose:14,activationFrame:8,formDuration:360,cancelFrame:9,shiftCooldown:28,preserveVelocity:false,soundFamily:'light'}),
  mageSpell:m('メイジ・属性魔法',12,[],18,12,{pose:13,special:true,windSpell:true,spellShots:[12,18],chargeFrame:4,chargeButton:'special',chargeMaxFrames:55,shotSpeed:9,shotLife:58,shotRadius:18,chargedSpeed:8,chargedLife:66,chargedRadius:26,soundFamily:'fire'}),
  warriorSpell:m('ウォリアー・一刀',15,[w(15,18)],24,12,{damage:19,reach:212,pose:9,special:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:55,baseKnockback:6.2,knockbackGrowth:.095,archetype:45,soundFamily:'sword'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:id==='pummel'?'punch':'sword'};}
 for(const[id,name]of Object.entries({grab:'片手つかみ',pummel:'柄打ち',forwardThrow:'前方斬り投げ',backThrow:'旋回投げ',upThrow:'光の打ち上げ',downThrow:'地面への叩きつけ'}))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(!a.horse&&!a.bladeRide)a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const WillRules=(()=>{
 const forms=[{name:'シーカー',color:'#72e6cf',speed:1.13,damage:.95,reach:1,gravity:.94,archetype:44},{name:'ウォリアー',color:'#ffbb7b',speed:.92,damage:1.2,reach:1.12,gravity:1,archetype:45},{name:'メイジ',color:'#a7d9ff',speed:1,damage:.9,reach:1,gravity:1,archetype:46}];
 let objects=[];
 const speedKeys=['walkSpeed','initialDashSpeed','runSpeed','airSpeed','airAcceleration'];
 function form(f){return f.willFormTime>0?forms[f.willForm||0]:null;}
 function tune(f){const c=form(f);for(const k of speedKeys)f.character[k]=CharacterData.will[k]*(c?.speed||1);f.character.gravity=CharacterData.will.gravity*(c?.gravity||1);const a=f.attack;f.character.ecb=a?.horse&&a.mounted?{radius:CharacterData.will.ecb.radius,height:a.riderHeight}:CharacterData.will.ecb;}
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='will'){f.willForm=-1;f.willFormTime=0;f.willShiftCooldown=0;f.willSideUsed=false;tune(f);}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;tune(f);a.formIndex=f.willFormTime>0?f.willForm:-1;
  if(a.horse){a.rideDirection=f.face;a.jumpsLeft=a.horseJumpCount;if(!f.grounded)f.willSideUsed=true;}
  if(a.bladeRide){const p=platforms.find(p=>p.main);a.aimOrigin={x:f.x,y:f.y};const direction=Math.abs(f.input?.x||0)>.2?Math.sign(f.input.x):f.x<p.x?1:f.x>p.x+p.w?-1:f.face;a.flightTarget={x:f.x+direction*a.defaultForward,y:f.y-a.defaultLift};a.markerDirection=direction;}
  const c=form(f);if(c&&!['gale','dash','horseBrake','grab','pummel','rise'].includes(a.type)&&!a.type.endsWith('Throw')&&!a.windSpell){a.formBoost=true;a.damage*=c.damage;a.reach*=c.reach;a.activeFrames=a.activeFrames.map(w=>({...w,...(w.damage===undefined?{}:{damage:w.damage*c.damage}),...(w.reach===undefined?{}:{reach:w.reach*c.reach})}));if(f.willForm===1)a.knockbackGrowth*=1.08;}
  if(a.type==='horseSlash'){f.grounded=false;f.vy=-a.dismountLift;f.fastFall=false;}
 }
 function fresh(f,i,key='special'){return !!i[key]||f.buffer?.key===key;}
 function slideStep(f,target){const q=NaegiRules.safeStep(f,target);if(!q.blocked)return q;const vertical=NaegiRules.safeStep(f,{x:f.x,y:target.y}),horizontal=NaegiRules.safeStep({...f,x:vertical.x,y:vertical.y},{x:target.x,y:vertical.y});return{...horizontal,blocked:true};}
 function marker(f){const a=f.attack;if(!a?.bladeRide)return null;const p=platforms.find(p=>p.main),e=f.character.ecb,q={...a.flightTarget};let dx=q.x-a.aimOrigin.x,dy=q.y-a.aimOrigin.y,len=Math.hypot(dx,dy);if(len>a.range){q.x=a.aimOrigin.x+dx/len*a.range;q.y=a.aimOrigin.y+dy/len*a.range;}
  if(q.x>p.x-e.radius&&q.x<p.x+p.w+e.radius&&q.y>p.y+1&&q.y-e.height<p.y+90){q.x=a.aimOrigin.x<p.x+p.w/2?p.x-e.radius-12:p.x+p.w+e.radius+12;}
  return q;
 }
 function releaseHorse(f,type='horseSlash'){attack(f,type);GameAudio.cue(type==='horseSlash'?'jump':'land-light',.6,f);}
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;let t=f.timer;
  if(a.horse){if(t===a.mountFrame){const p=platforms.find(p=>p.main),e=f.character.ecb;if(f.x>p.x-e.radius&&f.x<p.x+p.w+e.radius&&f.y>p.y+1&&f.y-a.riderHeight<p.y+90){releaseHorse(f,'horseBrake');return;}a.mounted=true;a.rideOriginFrame=t;tune(f);GameAudio.cue('dash',.65,f);}
   if(a.mounted&&t<=a.rideEnd){if(t>=a.dismountStart&&(fresh(f,i)||fresh(f,i,'jab')||fresh(f,i,'heavy'))){releaseHorse(f);return;}if(t>=a.dismountStart&&i.guardPressed){releaseHorse(f,'horseBrake');return;}
    const direction=Math.abs(i.x)>.2?Math.sign(i.x):0,target=direction*a.rideSpeed;f.vx=moveToward(f.vx,target,direction?a.rideAcceleration:a.rideBrake);if(direction&&Math.abs(f.vx)<1)a.rideDirection=direction;f.face=a.rideDirection;if(f.vx*a.rideDirection<-.8){a.rideDirection=Math.sign(f.vx);f.face=a.rideDirection;}
    if(fresh(f,i,'jump')&&a.jumpsLeft>0){a.jumpsLeft--;f.buffer=null;f.grounded=false;f.vy=-a.horseJump;f.fastFall=false;GameAudio.cue('jump',.7,f);}
    if(!f.grounded)a.gravityMultiplier=a.originGrounded?1:a.airRideGravity;f.fastFall=false;
    if(!a.originGrounded&&t>=a.mountFrame+a.airRideFrames){releaseHorse(f);return;}
   }else if(t>a.rideEnd&&a.mounted){releaseHorse(f);return;}
  }
  if(a.bladeRide){if(t>=a.aimStart&&t<=a.aimEnd){a.gravityMultiplier=0;f.vx=0;f.vy=-.25;f.grounded=false;f.fastFall=false;if(t>a.aimStart){a.flightTarget.x+=(i.x||0)*a.aimSpeed;a.flightTarget.y+=(i.y||0)*a.aimSpeed;}a.flightTarget=marker(f);if(t>=a.lockStart&&fresh(f,i)){f.timer=a.launchFrame;t=f.timer;f.buffer=null;}}
   if(t===a.launchFrame&&!a.launched){a.launched=true;a.flightOrigin={x:f.x,y:f.y};a.flightTarget=marker(f);f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.face=Math.sign(a.flightTarget.x-f.x)||f.face;const p=platforms.find(p=>p.main);a.skirtStage=f.y>p.y+1&&(f.x<p.x||f.x>p.x+p.w);GameAudio.cue('double-jump',.8,f);}
   if(a.launched&&t>=a.launchFrame&&t<=a.flightEnd){const u=(t-a.launchFrame+1)/(a.flightEnd-a.launchFrame+1),p=platforms.find(p=>p.main),from=a.flightOrigin,to=a.flightTarget;let target={x:lerp(from.x,to.x,u),y:lerp(from.y,to.y,u)-Math.sin(u*Math.PI)*a.pathBow};if(a.skirtStage&&f.y>p.y-2)target.x=from.x;const q=slideStep(f,target);f.vx=q.x-f.x;f.vy=q.y-f.y;a.flightBlocked ||= q.blocked;a.gravityMultiplier=0;f.grounded=false;f.fastFall=false;}
   if(t>a.flightEnd){a.gravityMultiplier=1;f.vx*=.8;}
  }
  if(a.type==='gale'&&t===a.activationFrame&&!a.activated){a.activated=true;f.willForm=((f.willForm??-1)+1)%forms.length;f.willFormTime=a.formDuration;f.willShiftCooldown=a.shiftCooldown;f.willFormFlash=frame+24;tune(f);label(f.x,f.y-115,forms[f.willForm].name,forms[f.willForm].color);if(f.willForm===0)f.damage=Math.max(0,f.damage-2);}
  if(a.type==='gale'&&t>=a.cancelFrame&&(fresh(f,i,'jab')||fresh(f,i,'heavy')||fresh(f,i,'jump'))){const next=InputFrames.consume(f,i);f.attack=null;PlayerStates.enter(f,f.grounded?'Idle':'Fall');if(next.jump)PlayerController.launchJump(f);else selectAttack(f,next);return;}
  if(a.windSpell&&a.spellShots.includes(t)&&!a.eventsDone.has('spell:'+t)){a.eventsDone.add('spell:'+t);if(a.type==='mageSpell'&&t!==a.spellShots[0]&&a.charge<.5)return;const charged=a.charge>=.5,mage=a.type==='mageSpell',second=t!==a.spellShots[0];objects.push({owner:f.id,kind:mage?'element':'wind',face:f.face,x:f.x+f.face*35,y:f.y-37,previousX:f.x+f.face*35,previousY:f.y-37,vx:f.face*(charged?a.chargedSpeed:a.shotSpeed),vy:second?-.6:0,age:0,life:charged?a.chargedLife:a.shotLife,radius:charged?a.chargedRadius:a.shotRadius,damage:mage?(second?9:11)+(charged?3:0):charged?13:7,charged,stale:a.staleMultiplier,hits:new Set(),family:mage?(second?'ice':'fire'):'wind'});}
 }
 function box(q){return{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};}
 function collide(q){for(const o of BattlePlayers.targets(fighters[q.owner])){if(q.dead)break;collideOne(q,o);}}
 function collideOne(q,o){const f=fighters[q.owner];if(o.respawn||o.hitlag||q.hits.has(o.id))return;const b=box(q),contact=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!(contact||shield)||CombatSystem.protection(o).intangible)return;q.hits.add(o.id);const a=o.attack;if(a?.counterWindow&&o.timer>=a.counterWindow[0]&&o.timer<=a.counterWindow[1]){attack(o,a.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...WillMoves.dragon,type:q.kind==='element'?'mageSpell':'dragon',damage:q.damage,charge:0,projectile:true,soundFamily:q.family,element:q.family==='ice'?'ice':null,staleMultiplier:q.stale,launchDirection:q.face,angle:-.5,baseKnockback:q.charged?4.5:3,knockbackGrowth:q.charged?.078:.06},b,contact);q.dead=true;}
 function tick(){for(const f of fighters)if(f.characterId==='will'){if(f.grounded||f.ledge||f.respawn)f.willSideUsed=false;if(f.respawn){f.willForm=-1;f.willFormTime=0;f.willShiftCooldown=0;}else if(!f.hitlag){if(f.willFormTime>0&&--f.willFormTime===0)f.willForm=-1;f.willShiftCooldown=Math.max(0,(f.willShiftCooldown||0)-1);}tune(f);}
  for(const q of objects){const f=fighters[q.owner];if(!f||f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;const p=platforms.find(p=>p.main),n=Math.max(1,Math.ceil(Math.hypot(q.vx,q.vy)/5));for(let j=0;j<n;j++){q.x+=q.vx/n;q.y+=q.vy/n;if(q.x>p.x&&q.x<p.x+p.w&&q.y>p.y&&q.y<p.y+90){q.dead=true;break;}}if(!q.dead)collide(q);if(q.age>=q.life)q.dead=true;}objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.bladeRide){i.special=i.jump=i.jab=i.heavy=i.smash=i.guard=false;i.x=0;i.y=0;}
  else if(f.attack?.horse){i.special=f.timer>=f.attack.dismountStart&&(Math.abs(o.x-f.x)<165||f.x<p.x+80||f.x>p.x+p.w-80);i.jump=f.grounded&&f.timer>f.attack.mountFrame&&((o.attack&&Math.abs(o.x-f.x)<210)||platforms.some(q=>!q.main&&Math.abs(f.x-(q.x+q.w/2))<80));i.x=Math.sign(o.x-f.x);i.y=0;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-100&&(f.x<p.x||f.x>p.x+p.w)){const inward=Math.sign(p.x+p.w/2-f.x);i.x=f.y>p.y+90+f.character.ecb.height+8?-inward*.2:inward;i.special=f.airJumps<=0&&f.vy>=-2;i.y=i.special?-1:0;i.jump=f.airJumps>0&&f.vy>=0;if(i.special)i.x=inward;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&f.grounded&&!f.willShiftCooldown&&Math.abs(o.x-f.x)>250&&frame%180===0){i.special=true;i.x=0;i.y=1;i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  if(f.attack?.windSpell)i.specialHeld=Math.abs(o.x-f.x)>230&&f.attack.chargeFrames<40;return i;
 }
 return{forms,form,tune,reset,prepare,action,tick,marker,slideStep,box,cpu,get objects(){return objects;}};
})();
