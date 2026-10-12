'use strict';
const PokoaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const hit=(name,s,e,d,r,p=6,shape='front',fx=0,extra={})=>m(name,s,[w(s,e,shape)],12,0,{damage:d,reach:r,pose:p,pokoaHit:true,pokoaEffect:fx,soundFamily:fx===1||fx===3?'water':fx===2?'earth':fx===0?'wind':'punch',...extra});
 const moves={
  jab:hit('ぺちっ',4,5,3,110,6,'front',7,{soundFamily:'punch',cancel:{start:6,end:14,input:'jab',next:'jab2'}}),jab2:hit('くるっ',5,7,4,125,10,'spin',0,{cancel:{start:8,end:17,input:'jab',next:'jab3'}}),jab3:hit('このはフィニッシュ',8,11,8,170),heavy:hit('クラフトスイング',10,13,11,170,9,'front',7,{soundFamily:'staff'}),up:hit('このはアッパー',6,10,8,160,8,'up',0,{angle:-1.5}),low:hit('みずはらい',7,10,7,155,17,'low',1),dashAttack:hit('ころがる',10,14,10,155,15,'low',5,{impulse:4,soundFamily:'punch'}),
  smash:hit('いわくだき',15,19,21,195,9,'front',2,{chargeFrame:5,chargeMaxFrames:60,totalFrames:44,recoveryFrames:25}),upsmash:hit('ぐんぐんのびる',12,18,18,205,8,'up',0,{chargeFrame:4,chargeMaxFrames:60,angle:-1.5}),downsmash:m('みずでっぽうスピン',12,[w(12,16,'front',{pose:17}),w(22,26,'back',{pose:7})],22,0,{damage:16,reach:185,pose:17,pokoaHit:true,pokoaEffect:1,chargeFrame:4,chargeMaxFrames:60,soundFamily:'water'}),
  air:hit('メタモンスピン',6,11,8,135,10,'spin',5,{aerial:true,landingLagFrames:9}),fair:hit('このはスラッシュ',8,11,10,165,9,'front',0,{aerial:true,landingLagFrames:11}),bair:hit('のびーるキック',7,10,11,160,7,'back',5,{aerial:true,landingLagFrames:10}),uair:hit('みずでっぽうアッパー',6,10,9,160,8,'up',1,{aerial:true,landingLagFrames:9,angle:-1.5}),dair:hit('ふうせんプレス',11,15,12,160,11,'down',3,{aerial:true,landingLagFrames:14,meteorFrame:13,meteorAngle:1.5}),
  dragon:m('みずでっぽう',12,[],19,12,{pose:13,waterGun:true,spellShots:[12],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:45,soundFamily:'water'}),
  dash:m('なみのり・ラプラス変身',12,[],60,17,{pose:16,surf:true,gravityMultiplier:1,airControlMultiplier:0,ledgeGrabStart:12,soundFamily:'water'}),
  rise:m('かっくう・カイリュー変身',12,[w(12,21,'up')],79,20,{pose:16,damage:8,reach:130,pokoaHit:true,pokoaEffect:0,dragonGlide:true,gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:18,soundFamily:'wing'}),
  gale:m('でんじふゆう',12,[w(12,15,'spin')],62,16,{pose:16,damage:7,reach:125,pokoaHit:true,pokoaEffect:4,magnetRise:true,gravityMultiplier:0,airControlMultiplier:0,soundFamily:'thunder'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'punch'};}
 moves.ledge.pose=6;moves.getupAttack.pose=17;moves.getupAttack.activeFrames[1].pose=7;
 moves.forwardThrow.soundFamily=moves.backThrow.soundFamily='water';moves.upThrow.soundFamily='wind';moves.downThrow.soundFamily='earth';
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;a.animation={...a.animation,anticipationPose:14,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}}
 return moves;
})();
const PokoaRules=(()=>{
 let objects=[],serial=0;
 function reset(){objects=[];serial=0;for(const f of fighters)if(f.characterId==='pokoa')f.pokoaSideUsed=f.pokoaFloatUsed=false;}
 function solid(x,y){const p=platforms.find(p=>p.main);return x>p.x&&x<p.x+p.w&&y>p.y+1&&y<p.y+90;}
 // Sample the complete ECB along the route. A glide or wave cannot tunnel through the main slab.
 function safePoint(f,x,y){const p=platforms.find(p=>p.main),c=f.character.ecb,from={x:f.x,y:f.y},steps=Math.max(1,Math.ceil(Math.hypot(x-from.x,y-from.y)/4));let q=from;for(let n=1;n<=steps;n++){const next={x:lerp(from.x,x,n/steps),y:lerp(from.y,y,n/steps)};if(next.x+c.radius>p.x&&next.x-c.radius<p.x+p.w&&next.y>p.y+1&&next.y-c.height<p.y+90)break;q=next;}return q;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.surf){if(!f.grounded)f.pokoaSideUsed=true;a.waveId=null;a.mounted=false;a.speed=f.face*4;a.jumpWas=false;}if(a.dragonGlide){const p=platforms.find(p=>p.main);a.flapUsed=false;a.flapFrames=0;a.ceilingFrames=0;a.jumpWas=false;a.escapeSide=f.y>p.y+30&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):0;}if(a.magnetRise){a.floatBudget=60;f.pokoaFloatUsed=true;}}
 function spawn(f,v={}){const q={id:++serial,owner:f.id,kind:'water',x:f.x+f.face*28,y:f.y-37,face:f.face,vx:f.face*12,vy:0,radius:11,damage:6,age:0,life:38,hits:new Set(),stale:f.attack?.staleMultiplier||1,...v};q.previousX=q.x;q.previousY=q.y;objects.push(q);return q;}
 function dismount(f,a,jump){const q=objects.find(q=>q.id===a.waveId);if(q){q.ridden=false;q.life=q.age+32;q.vx=a.speed||f.face*5;q.vy=0;}a.mounted=false;f.attack=null;f.buffer=null;f.fastFall=false;f.vy=jump?-9:0;f.grounded=false;f.specialLandingLag=17;PlayerStates.enter(f,'Fall');GameAudio.cue('water-cast',.6,f);}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.waterGun){a.aim=clamp(i.y,-1,1)*.48;if(t===12&&!a.eventsDone.has('water')){a.eventsDone.add('water');spawn(f,{vx:Math.cos(a.aim)*f.face*(12+4*a.charge),vy:Math.sin(a.aim)*(12+4*a.charge),radius:11+9*a.charge,damage:6+6*a.charge,life:38+12*a.charge,aim:a.aim});}}
  if(a.surf){f.buffer=null;f.fastFall=false;if(t===12&&!a.waveId){const q=spawn(f,{kind:'surf',x:f.x,y:f.y-17,vx:0,vy:0,radius:25,damage:10,life:100,ridden:true});a.waveId=q.id;a.mounted=true;f.specialLandingLag=17;}
   if(a.mounted){const q=objects.find(q=>q.id===a.waveId);if(!q){dismount(f,a,false);return;}if(t>=18&&(i.jump&&!a.jumpWas||i.special)){dismount(f,a,!!i.jump);return;}a.jumpWas=!!i.jump;
    // Braking and reversing steer the wave; neutral input retains momentum. No fixed rush velocity.
    a.speed=moveToward(a.speed,Math.abs(i.x)>.15?i.x*7:a.speed,.35);if(Math.abs(a.speed)>.2)f.face=Math.sign(a.speed);f.vx=a.speed;f.vy=f.grounded?0:Math.min(5,f.vy);a.gravityMultiplier=f.grounded?1:.25;
    if(i.y<-.5&&a.originGrounded&&!a.hopped){a.hopped=true;f.grounded=false;f.vy=-6;}
    const next=safePoint(f,f.x+f.vx,f.y+f.vy);if(Math.abs(next.x-f.x)<Math.abs(f.vx)*.3){a.speed=-a.speed*.65;f.vx=a.speed;}
    q.x=f.x;q.y=f.y-17;q.face=f.face;if(t>=65){dismount(f,a,false);return;}
   }
  }
  if(a.dragonGlide){f.buffer=null;f.fastFall=false;
   if(t<12){f.vy=0;f.vx=a.escapeSide?clamp(i.x,-1,1)*4:0;}
   if(t===12&&!a.launched){a.launched=true;f.grounded=false;f.recovered=true;f.specialLandingLag=20;f.vx=i.x*5;f.vy=-16;GameAudio.cue('wing-swing',.8,f);}
   if(t>=12){const p=platforms.find(p=>p.main),ceil=p.y+90+f.character.ecb.height,blocked=f.y>=ceil&&f.y-18<ceil&&f.x>p.x-f.character.ecb.radius&&f.x<p.x+p.w+f.character.ecb.radius;
    if(blocked&&a.ceilingFrames<28&&Math.abs(i.x)>.2){a.ceilingFrames++;f.vx=Math.sign(i.x)*10;f.vy=-10;f.timer=12;}
    else if(t<28){if(a.ceilingFrames&&!a.clearedCeiling){a.clearedCeiling=true;f.vy=-16;}f.vx=moveToward(f.vx,i.x*6,.6);f.vy+=.6;}
    else {if(i.jump&&!a.jumpWas&&!a.flapUsed){a.flapUsed=true;a.flapFrames=12;GameAudio.cue('wing-swing',.8,f);}a.jumpWas=!!i.jump;
     f.vx=moveToward(f.vx,i.x*8,.6);if(Math.abs(f.vx)>.3)f.face=Math.sign(f.vx);
     if(a.flapFrames>0){a.flapFrames--;f.vy=-7;}else f.vy=moveToward(f.vy,i.y<-.3?.8:i.y>.3?5:2,.55);
    }
   }
  }
  if(a.magnetRise){f.buffer=null;f.fastFall=false;f.vy=0;if(t>=12){f.grounded=false;f.specialLandingLag=16;f.vx=moveToward(f.vx,i.x*4,.35);f.vy=t<=16?-2:i.y*.65;a.floatBudget--;if(a.floatBudget<=0||t>17&&(i.jump||i.special)){f.attack=null;f.vy=i.jump?-4:1;PlayerStates.enter(f,'Fall');return;}}else f.vx=0;}
 }
 const geometry={6:[9,-40,0],7:[-10,-35,Math.PI],8:[0,-47,-Math.PI/2],9:[13,-40,.12],10:[8,-32,0],11:[8,-28,1.15],15:[12,-18,0],17:[12,-14,0],16:[0,-38,-Math.PI/2]};
 function boxes(f,a,w){const g=geometry[w.pose??a.pose]||geometry[6],r=(w.reach??a.reach)*FIGHTER_SCALE*.72;if(w.shape==='spin')return[{x1:f.x-r*.55,y1:f.y-32,x2:f.x+r*.55,y2:f.y-32,radius:16,window:w}];return[{x1:f.x+g[0]*f.face,y1:f.y+g[1],x2:f.x+(g[0]+Math.cos(g[2])*r)*f.face,y2:f.y+g[1]+Math.sin(g[2])*r,radius:a.pokoaEffect===2?17:10,window:w}];}
 function form(f){const a=f.attack;if(!a)return null;if((a.surf||a.dragonGlide)&&f.timer>=3&&f.timer<12)return'ditto';if(a.surf&&a.mounted)return'lapras';if(a.dragonGlide&&a.launched)return'dragonite';return null;}
 function box(q){return{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};}
 function tick(){for(const f of fighters)if(f.characterId==='pokoa'&&(f.grounded||f.ledge||f.respawn)){f.pokoaSideUsed=false;if(!f.attack?.magnetRise)f.pokoaFloatUsed=false;}
  for(const q of objects){const f=fighters[q.owner],o=BattlePlayers.projectileTarget(q);if(f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;
   if(q.ridden){if(f.attack?.surf&&f.attack.waveId===q.id&&f.attack.mounted){q.x=f.x;q.y=f.y-17;q.face=f.face;q.damage=10;}else {q.ridden=false;q.life=q.age+20;q.vx=q.face*6;}}
   if(!q.ridden){q.x+=q.vx;q.y+=q.vy;if(q.kind==='surf'){q.vy=Math.min(5,q.vy+.2);for(const p of platforms)if(q.x>=p.x&&q.x<=p.x+p.w&&q.previousY+17<=p.y+6&&q.y+17>=p.y){q.y=p.y-17;q.vy=0;break;}}}
   if(solid(q.x,q.y)){q.dead=true;continue;}
   for(const o of BattlePlayers.targets(f)){if(q.dead)break;if(!q.hits.has(o.id)&&!o.respawn&&!o.hitlag&&!CombatSystem.protection(o).intangible){const b=box(q),touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...PokoaMoves.dragon,type:q.kind==='surf'?'dash':'dragon',projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,soundFamily:'water',baseKnockback:q.kind==='surf'?4.5:3.4,knockbackGrowth:.065,angle:q.kind==='surf'?-.85:-.35,launchDirection:q.face};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;if(q.kind==='surf'&&q.ridden)dismount(f,f.attack,false);}else CombatSystem.hit(f,o,a,b,touch);if(q.kind!=='surf')q.dead=true;}}}
   if(q.age>=q.life||q.x<-900||q.x>2340)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main);if(f.attack?.dragonGlide){i.x=f.attack.escapeSide&&f.y>p.y?f.attack.escapeSide:Math.sign(720-f.x);i.y=0;i.special=i.guard=i.jab=i.heavy=i.smash=i.grab=false;i.jump=f.timer>=32&&!f.attack.flapUsed&&f.y>p.y-120;}else if(f.attack?.surf){i.x=Math.sign(o.x-f.x);i.y=0;i.special=false;i.jump=f.timer>35&&(f.x<p.x+60||f.x>p.x+p.w-60);i.guard=i.jab=i.heavy=i.smash=i.grab=false;}else if(f.attack?.magnetRise){i.x=Math.sign(720-f.x);i.y=0;i.special=false;i.jump=f.timer>35;i.guard=i.jab=i.heavy=i.smash=i.grab=false;}else if(!f.attack&&!f.grounded&&!f.recovered&&(f.y>p.y-90&&(f.x<p.x||f.x>p.x+p.w)||f.y>p.y+35)){i.x=f.y>p.y+35&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):Math.sign(720-f.x);i.y=-1;i.special=true;i.specialHeld=false;i.jump=i.guard=i.jab=i.heavy=i.smash=i.grab=false;}if(f.attack?.waterGun)i.specialHeld=Math.abs(o.x-f.x)>220&&f.attack.chargeFrames<25;return i;}
 return{reset,prepare,action,spawn,solid,safePoint,geometry,boxes,box,tick,cpu,form,get objects(){return objects;}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(PokoaMoves.dragon,{rangedInterval:40,rangedRearm:20});
