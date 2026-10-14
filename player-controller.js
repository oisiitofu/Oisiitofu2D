'use strict';
const PlayerController=(()=>{
 const enter=(f,n,d)=>PlayerStates.enter(f,n,d),is=(f,...n)=>n.includes(f.mode);
 const dodgeData={SpotDodge:{duration:25,inv:[3,17],speed:0,attackCancel:21},ForwardRoll:{duration:29,inv:[4,15],speed:11},BackwardRoll:{duration:34,inv:[5,16],speed:10.5},NeutralAirDodge:{duration:36,inv:[3,25],speed:0,landing:10},DirectionalAirDodge:{duration:45,inv:[3,21],speed:14,landing:19,earlyLanding:11}};
 // The entry frame places the fighter at the lip without running physics.
 // Preserve the former 29 moving frames * 4 units while shortening recovery.
 const ledgeRoll={duration:26,distance:116};
 const ledgeRollSpeed=ledgeRoll.distance/(ledgeRoll.duration-1);
 function beginDodge(f,i){let air=!f.grounded;if(air&&f.airDodged)return;let groundDirection=i.dodgeDirection||InputFrames.dodgeDirection(i),dir=air?Math.sign(i.x):groundDirection?.x||0,name=air?(Math.hypot(i.x,i.y)>.3?'DirectionalAirDodge':'NeutralAirDodge'):groundDirection?.y?'SpotDodge':dir===f.face?'ForwardRoll':'BackwardRoll';let d=dodgeData[name],stale=f.dodgeStale;
  f.dodge={...d,inv:[d.inv[0]+stale,Math.max(d.inv[0]+stale+1,d.inv[1]-stale)],direction:dir,stale};f.dodgeStale=Math.min(5,stale+1);f.dodgeRest=0;f.airDodged ||= air;f.tumbling=false;f.fastFall=false;enter(f,name,d.duration+(air?0:Math.min(6,stale*2)));
  if(air&&name==='DirectionalAirDodge'){let length=Math.max(.01,Math.hypot(i.x,i.y)),speed=d.speed*(1-stale*.08);f.vx=i.x/length*speed;f.vy=i.y/length*speed;f.fastFall=false;}else if(!air)f.vx=dir*d.speed*(1-stale*.05);
 }
 // Spot-dodge attack cancellation consumes a still-valid 9F buffer. Guard
 // remains held for defense after the dodge, but cannot swallow the attack.
 function spotDodgeAttack(f,i){
  const attacks=['jab','heavy','smash','special'],queued=attacks.includes(f.buffer?.key);
  if(!queued&&!attacks.some(key=>i[key]))return false;
  const next={...(queued?InputFrames.consume(f,i):i),guard:false,grab:false};
  if(!selectAttack(f,next))return false;
  advanceAttack(f,next);return true;
 }
 function launchJump(f,short=false,ledge=false){const c=f.character;if(!f.grounded&&!ledge&&f.airJumps<=0)return false;
  let air=!f.grounded&&!ledge;f.vy=air?-c.doubleJumpVelocity:short?-c.shortHopVelocity:-c.fullHopVelocity;if(air)f.airJumps--;f.jumps=air?2:1;f.grounded=false;f.fastFall=false;f.tumbling=false;f.shortHop=short;f.shortHopGrace=air||ledge||short?0:MovementTuning.shortHopReleaseGraceFrames;f.attack=null;enter(f,ledge?'LedgeJump':'Jump');if(air)ring(f.x,f.y-16,colors[f.color],34);else emit(f.x,f.y,'#e0dcd4',5,1.5);sound(air?'double-jump':'jump',.65,f);return true;
 }
 function beginJump(f,i){if(!f.grounded){if(launchJump(f)&&i.jumpAerial)selectAttack(f,i.jumpAerial);return;}f.jumpShort=!!(i.twoJumps||i.shortHopAttack);f.jumpAerial=i.jumpAerial||null;enter(f,'JumpSquat',f.character.jumpSquatFrames);f.buffer=null;}
 function airControl(f,i,mult=1){let c=f.character;if(Math.abs(i.x)>.1){let accel=f.vx*i.x<0?c.airBrake:c.airAcceleration;if(f.vx*i.x>0&&Math.abs(f.vx)>Math.abs(i.x*c.airSpeed))f.vx=moveToward(f.vx,i.x*c.airSpeed,c.airFriction);else f.vx=moveToward(f.vx,i.x*c.airSpeed,accel*mult);}else f.vx=moveToward(f.vx,0,c.airFriction);}
 function groundMove(f,i){let c=f.character,x=i.x,dir=Math.sign(x),mode=f.mode;
  // Use held stick strength for locomotion. A gradual push can miss the
  // one-frame smash flick, but must still start running. Hysteresis avoids
  // alternating walk/run when the stick hovers around the run threshold.
  const wantsRun=Math.abs(x)>=.6||is(f,'InitialDash','Run','RunTurn')&&Math.abs(x)>=.5;
  if(mode==='InitialDash'&&f.stateFrame<=c.initialDashFrames){
   if(dir&&dir!==f.face&&wantsRun){f.face=dir;enter(f,'InitialDash',c.initialDashFrames);f.vx=dir*c.initialDashSpeed;return;}
   f.vx=moveToward(f.vx,f.face*c.initialDashSpeed,c.runAcceleration);return;
  }
  if(Math.abs(x)<.1){if(is(f,'Run','InitialDash'))enter(f,'RunBrake',8);f.vx=moveToward(f.vx,0,c.traction);if(f.mode==='RunBrake'&&f.stateFrame<=f.stateDuration)return;if(Math.abs(f.vx)<.05)enterIf(f,i.y>.5?'Crouch':'Idle');return;}
  if(is(f,'RunTurn','Turn')){if(f.stateFrame===f.turnFrame)f.face=f.turnTarget;f.vx=moveToward(f.vx,wantsRun?dir*c.runSpeed:x*c.walkSpeed,c.traction);if(f.stateFrame>f.stateDuration)enter(f,wantsRun?'Run':'Walk');return;}
  if(dir!==f.face&&Math.abs(f.vx)>2){f.turnTarget=dir;f.turnFrame=4;enter(f,wantsRun?'RunTurn':'Turn',wantsRun?8:4);f.vx=moveToward(f.vx,wantsRun?dir*c.runSpeed:x*c.walkSpeed,c.traction);return;}
  f.face=dir;if(wantsRun&&!is(f,'InitialDash','Run')){enter(f,'InitialDash',c.initialDashFrames);f.vx=dir*c.initialDashSpeed;return;}
  if(f.mode==='InitialDash')enter(f,wantsRun?'Run':'Walk');
  if(f.mode==='Run'&&wantsRun)f.vx=moveToward(f.vx,dir*c.runSpeed,c.runAcceleration);
  else{enterIf(f,'Walk');f.vx=moveToward(f.vx,x*c.walkSpeed,c.walkAcceleration);}
 }
 function enterIf(f,name){if(f.mode!==name)enter(f,name);}
 // A held direction can start running in a tiny gap between normal attacks.
 // Keep the existing 9F input-buffer interval available for another tilt;
 // running longer or deliberately flicking the stick again restores dash attacks.
 function finishNormalAttack(f){if(f.grounded&&f.attack&&!f.attack.special&&f.attack.type!=='dashAttack')f.dashAttackResumeUntil=frame+9;}
 // Cancel residual launch momentum only once the fighter can act. A mash
 // during hitlag/hitstun must never erase the queued or ongoing knockback.
 function stopLaunchOnPress(f,i){
  if(f.pendingLaunch||f.hitlag>0||f.hitstun>0||hitstop>0||!f.tumbling||!['jump','jab','heavy','smash','special'].some(key=>i[key]))return;
  f.vx=f.vy=0;f.tumbling=false;
 }
 function releaseGrab(f){let o=f.grabbed;if(o){o.grabImmunity=60;o.grabOwner=null;enter(o,o.grounded?'Idle':'Fall');}f.grabbed=null;enter(f,f.grounded?'Idle':'Fall');}
 function tech(f,i,surface){if(!f.tumbling)return false;if(f.techBuffer>0&&f.techLock<=0){f.techBuffer=0;f.techLock=40;f.hitstun=0;f.tumbling=false;f.intangible=20;f.attack=null;
   if(surface==='floor'){let roll=Math.abs(i.x)>.4;enter(f,roll?'TechRoll':'Tech',roll?26:20);f.vx=roll?Math.sign(i.x)*6:0;f.vy=0;}
   else{enter(f,surface==='wall'?'WallTech':'CeilingTech',16);f.vx=surface==='wall'?-f.vx*.4:0;f.vy=surface==='wall'&&(i.jump||i.jumpHeld)?-f.character.doubleJumpVelocity:0;}
   ring(f.x,f.y-25,'#ffe9ae',60);sound('parry',.8,f);return true;
  }return false;
 }
 function catchLedge(f,anchor){if(f.ledgeGrabs>=f.character.ledgeRegrabLimit)return;let other=fighters.find(o=>o!==f&&o.ledge===anchor&&is(o,'LedgeCatch','LedgeHang'));
  if(other){other.ledge=null;other.ledgeCooldown=45;other.vx=-anchor.face*3;other.vy=-2;other.intangible=0;enter(other,'LedgeTrump',16);}
  f.ledgeGrabs++;f.ledge=anchor;f.snapFrom=[f.x,f.y];f.face=anchor.face;f.vx=f.vy=0;f.attack=null;f.helpless=false;f.recovered=false;f.airDodged=false;f.airJumps=f.character.airJumpCount;f.jumps=0;f.fastFall=false;f.specialLandingLag=0;f.intangible=f.ledgeGrabs===1?Math.max(20,55-Math.floor(f.damage/10)):0;enter(f,'LedgeCatch',f.character.ledgeCatchFrames);
 }
 function ledgeAction(f,i){const l=f.ledge;if(!l)return;f.vx=f.vy=0;
  if(f.mode==='LedgeCatch'){let t=Math.min(1,f.stateFrame/4);let grip=ledgeHangPosition(f,l);f.x=lerp(f.snapFrom[0],grip.x,t);f.y=lerp(f.snapFrom[1],grip.y,t);if(f.stateFrame>f.stateDuration)enter(f,'LedgeHang');return;}
  i=InputFrames.consume(f,i);let name=i.guard?'LedgeRoll':i.jab||i.heavy||i.smash?'LedgeAttack':i.jump?'LedgeJump':i.y>.5||i.x*l.face<-.5?'LedgeDrop':i.y<-.5||i.x*l.face>.5||f.stateFrame>300?'LedgeGetup':null;if(!name)return;
  f.ledgeCooldown=45;f.ledge=null;f.intangible=f.ledgeGrabs===1?({LedgeGetup:15,LedgeRoll:20,LedgeAttack:10,LedgeJump:8}[name]||0):0;
  if(name==='LedgeDrop'){enter(f,name,1);f.x=l.x-l.face*(f.character.ecb.radius+3);f.vy=1;return;}
  if(name==='LedgeJump'){f.x=l.x-l.face*(f.character.ecb.radius+3);launchJump(f,false,true);return;}
  f.x=l.x+l.face*25;f.y=l.y;f.grounded=true;
  if(name==='LedgeAttack'){attack(f,'ledge');f.mode='LedgeAttack';return;}
  enter(f,name,name==='LedgeRoll'?ledgeRoll.duration:23);f.vx=name==='LedgeRoll'?l.face*ledgeRollSpeed:0;
 }
 function shield(f,i){let c=f.character;if(f.shieldStun>0){f.shieldStun--;return true;}if(['ShieldStart','ShieldHold'].includes(f.mode))i=InputFrames.consume(f,i);if(is(f,'ShieldStart','ShieldHold')){
   f.shieldHeldFrames++;f.shieldOffset=[i.x*9,i.y*7];f.shield=Math.max(0,f.shield-c.shieldDrain);if(f.shield<=0){breakShield(f);return true;}
   if(i.jump){beginJump(f,i);return true;}
   if(InputFrames.attackDirection(i).y<-.5&&i.smash){attack(f,'upsmash');return true;}
   if(i.grab){attack(f,'grab');return true;}
   if(InputFrames.attackDirection(i).y<-.5&&i.special){attack(f,'rise');return true;}
   if(i.dodgePressed&&i.guard){beginDodge(f,i);return true;}
   if(i.jab||i.heavy||i.special||i.smash){f.committedDrop={...i,guard:false};f.parryEligible=false;enter(f,'ShieldDrop',11);return true;}
   if(!i.guard){f.parryEligible=f.shieldHeldFrames>=3;enter(f,'ShieldDrop',11);return true;}
   enterIf(f,'ShieldHold');f.vx=moveToward(f.vx,0,c.traction);return true;
  }return false;
 }
 function breakShield(f){f.shield=0;f.hitstun=0;f.attack=null;f.grounded=false;f.vy=-9;f.vx=0;enter(f,'ShieldBreak');label(f.x,f.y-90,'SHIELD BREAK');}
 function ready(f,i){i=InputFrames.consume(f,i);stopLaunchOnPress(f,i);const order=InputFrames.priority[f.grounded?'ground':'air'];
  if(i.jump&&i.jumpAerial){beginJump(f,i);return;}
  if(f.grounded&&i.shieldUpSmash&&i.smash&&InputFrames.attackDirection(i).y<-.5){attack(f,'upsmash');return;}
  if(f.grounded&&!i.guard&&i.y>.65&&Math.abs(i.y)>Math.abs(i.x)&&!['jump','jab','heavy','smash','special'].some(key=>i[key])&&platforms.some(p=>!p.main&&Math.abs(p.y-f.y)<2&&f.x>p.x&&f.x<p.x+p.w)){f.drop=18;f.y+=8;f.vy=2;f.grounded=false;enter(f,'Fall');}
  for(let cmd of order){if(!i[cmd])continue;
   if(cmd==='guard'){if(f.grounded){if(i.grab){attack(f,'grab');return;}f.shieldHeldFrames=0;enter(f,'ShieldStart',1);if(i.dodgePressed)beginDodge(f,i);return;}if(i.guardPressed&&!f.airDodged){beginDodge(f,i);return;}continue;}
   if(cmd==='jump'){beginJump(f,i);return;}
   if(selectAttack(f,i)){advanceAttack(f,i);return;}
  }
  if(f.grounded){groundMove(f,i);if(i.y>.5&&Math.abs(i.x)<.1)enterIf(f,'Crouch');}else{airControl(f,i);enterIf(f,f.fastFall?'FastFall':f.vy<0?'Jump':'Fall');}
 }
 function tick(f,raw){if(!f.mode)prepareFighter(f);const c=f.character,i=InputFrames.sample(f,raw);for(let key of ['inv','intangible','grabImmunity','techBuffer','techLock','drop','ledgeCooldown'])f[key]=Math.max(0,(f[key]||0)-1);if(i.guardPressed)f.techBuffer=11;if(++f.dodgeRest>=180){f.dodgeStale=Math.max(0,f.dodgeStale-1);f.dodgeRest=0;}InputFrames.queue(f,i);
  stopLaunchOnPress(f,i);
  f.shadowTimeSlowed=ShadowRules.slowSkip(f,i);if(f.shadowTimeSlowed){f.stateEnd++;f.faf++;return;}
  if(f.hitlag>0){CombatSystem.hitlag(f,i);return;}if(f.attack?.hauntDelay>0&&!f.hitstun&&!f.tumbling&&!f.respawn){f.attack.hauntDelay--;f.stateEnd++;f.faf++;physics(f,i);return;}if(f.laytonThink>0&&!f.hitstun&&!f.tumbling&&!f.respawn){f.laytonThink=Math.max(0,f.laytonThink-i.mash*2);f.buffer=null;f.vx*=.75;physics(f,i);return;}f.timer++;f.stateFrame++;f.landingLag=['NormalLanding','HardLanding','AerialLanding','SpecialLanding'].includes(f.mode)?Math.max(0,f.stateDuration-f.stateFrame+1):0;
  if(f.respawn>0){enterIf(f,'Dead');if(f.squad&&f.stocks<=0)return;if(--f.respawn===0){let oldStocks=f.stocks,stats=f.stats,color=f.color,id=f.id,team=f.team,control=f.control,evolution=AgumonEvolution.preserve(f);if(!SquadBattle.respawn(f))Object.assign(f,prepareFighter(makeFighterBase(id,color,f.characterId)),evolution);f.stocks=oldStocks;f.stats=stats;f.team=team;f.control=control;f.x=BattlePlayers.spawnX(f);f.y=120;f.grounded=false;f.intangible=150;enter(f,'Respawn',1);}return;}
  if(f.mode==='Respawn')enter(f,'Fall');
  if(f.mode==='Grabbed'){f.vx=f.vy=0;f.grabEscape-=1+i.mash*7;if(f.grabEscape<=0&&f.grabOwner)releaseGrab(f.grabOwner);return;}
  if(is(f,'GrabHold','Pummel')){let o=f.grabbed;if(!o){enter(f,'Idle');return;}o.x=f.x+f.face*35;o.y=f.y-8;if(f.mode==='Pummel'){if(f.stateFrame===2){o.damage+=movesFor(f).pummel.damage;f.stats.damage+=movesFor(f).pummel.damage;CombatVFX.impact(o.x,o.y-35,f.color,2,f.face);}if(f.stateFrame>movesFor(f).pummel.totalFrames)enter(f,'GrabHold');return;}if(i.jab||i.heavy){enter(f,'Pummel',movesFor(f).pummel.totalFrames);return;}if(f.stateFrame>=5&&(Math.abs(i.x)>.4||Math.abs(i.y)>.4||i.grab)){throwTarget(f,i);o.grabImmunity=60;o.grabOwner=null;return;}return;}
  if(is(f,'LedgeCatch','LedgeHang')){ledgeAction(f,i);return;}
  if(f.attack&&f.timer>f.attack.totalFrames){let helpless=f.attack.helpless;finishNormalAttack(f);f.attack=null;f.gravityOff=false;f.helpless=!!helpless;enter(f,helpless?'Helpless':f.grounded?'Idle':'Fall');}
  // Accept a brief release just after takeoff without delaying full hops.
  // Subtract only the full/short launch difference, preserving elapsed gravity.
  if(f.shortHopGrace>0){
   if(f.grounded||f.mode!=='Jump'||f.attack||f.hitstun||f.tumbling||f.vy>=0)f.shortHopGrace=0;
   else if(i.jumpReleased){f.vy+=c.fullHopVelocity-c.shortHopVelocity;f.shortHop=true;f.shortHopGrace=0;}
   else f.shortHopGrace--;
  }
  // Input precedes physics: include the frame that gravity crosses zero so a
  // down flick at the apex is not discarded while vy is still slightly negative.
  const reachesApex=!f.gravityOff&&PlayerStates.defs[f.mode].gravity&&f.vy+c.gravity*(f.attack?.gravityMultiplier??1)>=0;
  const downSpecial=(i.special&&InputFrames.attackDirection(i).y>.5)||f.attack?.downSpecialInput;
  if(!f.grounded&&(f.vy>=0||reachesApex)&&i.downFlick&&!downSpecial&&!f.fastFall&&!f.hitstun&&!f.tumbling){f.fastFall=true;ring(f.x,f.y,colors[f.color],26);}
  if(f.hitstun>0){f.hitstun--;f.vx=moveToward(f.vx,0,f.launchDecay??.075);if(!f.hitstun)enter(f,f.grounded?'Idle':f.tumbling?'Tumble':'Fall');}
  else if(f.mode==='JumpSquat'){f.jumpShort ||= i.jumpReleased||i.twoJumps;if(f.buffer?.key==='jump'&&f.buffer.shortHopAttack){f.jumpAerial=InputFrames.consume(f,i).jumpAerial;f.jumpShort=true;}else if(!f.jumpAerial&&['jab','heavy','smash'].includes(f.buffer?.key))f.jumpAerial=InputFrames.jumpAttack(InputFrames.consume(f,i));if(f.stateFrame>c.jumpSquatFrames){let aerial=f.jumpAerial;f.jumpAerial=null;launchJump(f,f.jumpShort);if(aerial)selectAttack(f,aerial);}}
  else if(f.attack){if(f.grounded){if(!f.attack.horse)f.vx=moveToward(f.vx,0,c.groundFriction*DashAttackTuning.friction(f));}else airControl(f,i,f.attack.airControlMultiplier);const pending=f.buffer;advanceAttack(f,i);DashAttackTuning.motion(f);if(CombatData.finishedMotion(f)){finishNormalAttack(f);f.attack=null;f.gravityOff=false;f.buffer??=pending;enter(f,f.grounded?'Idle':'Fall');ready(f,i);}}
  else if(shield(f,i)){}
  else if(f.mode==='ShieldBreak'){}
  else if(f.mode==='Stunned'){f.stateDuration-=i.mash*4;if(f.stateFrame>f.stateDuration){f.shield=c.shieldHP;enter(f,'Idle');}}
  else if(f.mode==='Knockdown'){f.vx=moveToward(f.vx,0,c.traction);if(f.stateFrame>10){if(i.jab||i.heavy){attack(f,'getupAttack');f.mode='GetupAttack';}else if(Math.abs(i.x)>.5){enter(f,'GetupRoll',30);f.vx=Math.sign(i.x)*5;f.intangible=16;}else if(i.jump||i.y<-.5||f.stateFrame>120){enter(f,'Getup',24);f.intangible=12;}}}
  else if(dodgeData[f.mode]){const d=f.dodge;if(f.stateFrame>=d.inv[0]&&f.stateFrame<=d.inv[1])f.intangible=Math.max(f.intangible,1);if(f.mode==='SpotDodge'&&f.stateFrame>=d.attackCancel+Math.min(6,d.stale*2)&&spotDodgeAttack(f,i)){}else if(f.stateFrame>f.stateDuration){if(f.mode==='ForwardRoll')f.face=-d.direction;let next=InputFrames.consume(f,f.committedDrop||i);f.committedDrop=null;if(next.jump||next.grab||next.jab||next.heavy||next.smash||next.special)next={...next,guard:false};enter(f,f.grounded?'Idle':'Fall');ready(f,next);}else if(f.grounded)f.vx*=.97;}
  else if(f.mode==='Helpless'){airControl(f,i);}
  else if(f.mode==='LedgeRoll'){if(f.stateFrame>f.stateDuration){f.vx=0;enter(f,'Idle');ready(f,InputFrames.consume(f,i));}else f.vx=f.face*ledgeRollSpeed;}
  else if(['NormalLanding','HardLanding','AerialLanding','SpecialLanding','ShieldDrop','Tech','TechRoll','WallTech','CeilingTech','Getup','GetupRoll','LedgeGetup','LedgeRoll','LedgeTrump','Clank','Throw'].includes(f.mode)){if(f.stateFrame>f.stateDuration){let next=f.committedDrop||i;f.committedDrop=null;enter(f,f.grounded?'Idle':'Fall');ready(f,next);}else if(f.grounded)f.vx=moveToward(f.vx,0,c.groundFriction);}
  else ready(f,i);
  if(f.grounded&&!is(f,'LedgeGetup','LedgeRoll','LedgeAttack'))f.ledgeGrabs=0;
  if(!is(f,'ShieldStart','ShieldHold','ShieldBreak','Stunned')&&!f.shieldStun)f.shield=Math.min(c.shieldHP,f.shield+c.shieldRegen);
  physics(f,i);
 }
 function physics(f,i){let c=f.character,oldX=f.x,oldY=f.y,wasAir=!f.grounded,oldVx=f.vx,oldVy=f.vy,def=PlayerStates.defs[f.mode];
  const dodgeFloor=f.grounded&&is(f,'SpotDodge','ForwardRoll','BackwardRoll','TechRoll','GetupRoll','LedgeRoll')?platforms.find(p=>Math.abs(oldY-p.y)<6&&oldX>=p.x-9&&oldX<=p.x+p.w+9):null;
  if(def.gravity&&!f.gravityOff&&!BattleFeel.dodgeMotion(f)){let gravity=c.gravity*(f.attack?.gravityMultiplier??1);if(f.fastFall&&!f.tumbling&&!f.hitstun)gravity=Math.max(gravity,MovementTuning.fastFallAcceleration);let next=f.vy+gravity;f.vy=f.tumbling||f.hitstun?next:Math.min(f.attack?.glideStart&&f.timer>=f.attack.glideStart&&f.timer<=f.attack.glideEnd?f.attack.glideFallSpeed:f.attack?.diveSpeed&&f.timer>=f.attack.startupFrames?f.attack.diveSpeed:f.fastFall?c.fastFallSpeed:c.fallSpeed,next);}f.x+=f.vx*(!f.hitstun&&!f.tumbling?(f.logicSlow??1)*JibanyanRules.hauntScale(f)*PiposaruRules.speed(f)*TwinbeeRules.speed(f):1);f.y+=f.vy;
  if(dodgeFloor){const x=clamp(f.x,dodgeFloor.x+1,dodgeFloor.x+dodgeFloor.w-1);if(x!==f.x)f.vx=0;f.x=x;f.y=dodgeFloor.y;f.vy=0;}
  f.grounded=false;
  let p=platforms.find(p=>p.main),dy=f.y-oldY;
  // Sweep the whole body against the tapered underside, including fast recoveries.
  const terrain=oldY>p.y+1?StageGeometry.sweep(p,f,{x:oldX,y:oldY},{x:f.x,y:f.y}):null;
  if(terrain){
   if(terrain.wall){f.x=terrain.side<0?p.x-c.ecb.radius:p.x+p.w+c.ecb.radius;if(!tech(f,i,'wall'))f.vx=f.tumbling?-oldVx*.5:0;}
   else{const proposedY=f.y;f.x=terrain.x;f.y=terrain.bottom+c.ecb.height+.001;
    if(dy<0&&terrain.slope&&!f.tumbling&&!f.hitstun&&!f.attack?.tether){
     // Rising into a slant nudges us toward its lip instead of killing the rise.
     // Keep natural gravity/recovery duration; no extra jump or upward impulse.
     f.x+=terrain.side*Math.min(10,-dy*.55);
     f.y=f.x+c.ecb.radius>p.x&&f.x-c.ecb.radius<p.x+p.w?Math.max(proposedY,StageGeometry.bottom(p,f.x,c.ecb.radius)+c.ecb.height+.001):proposedY;
    }else if(!tech(f,i,'ceiling')){const nx=terrain.side*terrain.slope,length=Math.hypot(nx,1),normalX=nx/length,normalY=1/length,dot=f.vx*normalX+f.vy*normalY;
     if(f.tumbling&&dot<0){f.vx-=1.35*dot*normalX;f.vy-=1.35*dot*normalY;}else f.vy=0;
    }
   }
  }
  if(f.vy>=0)for(let floor of platforms){if(!floor.main&&f.drop)continue;if(f.x>floor.x-9&&f.x<floor.x+floor.w+9&&oldY<=floor.y+6&&f.y>=floor.y){f.y=floor.y;f.vy=0;f.grounded=true;if(wasAir)land(f,i,oldVy);break;}}
  if(f.characterId==='hunter')HunterRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(f.characterId==='adol')AdolRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(f.characterId==='valkyrie')ValkyrieRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(f.characterId==='terry')TerryRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(f.characterId==='agumon')AgumonRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(f.characterId==='pawapuro')PawapuroRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(f.characterId==='headmaster')HeadmasterRules.collision(f,i,{oldX,oldY,oldVx,oldVy});if(NewcomerCore.ids.includes(f.characterId))NewcomerCore.registry[f.characterId].collision(f,i,{oldX,oldY,oldVx,oldVy});
  AruruRules.platform(f,i,{oldX,oldY,oldVx,oldVy,wasAir});
  // Leaving the top lip is an outbound movement, not a recovery attempt.
  // Re-enable grabs after clearing that ledge's grab region. Recovery moves
  // approaching from below can still grab while rising.
  if(f.grounded)f.ledgeExitSide=0;
  else if(oldX>=p.x-9&&oldX<=p.x+p.w+9&&(f.x<p.x-9||f.x>p.x+p.w+9)&&oldY<=p.y+8)f.ledgeExitSide=f.x<p.x?1:-1;
  const exited=StageRules.ledges.find(l=>l.face===f.ledgeExitSide);
  if(exited&&(Math.abs(f.x-exited.x)>c.ledgeGrabRange[0]+12||f.y>exited.y+c.ledgeGrabRange[1]+12))f.ledgeExitSide=0;
  let canLedge=!f.attack?.tether&&(PlayerStates.defs[f.mode].ledge||f.attack?.ledgeGrabStart&&f.timer>=f.attack.ledgeGrabStart);
  if(!f.grounded&&canLedge&&!f.hitstun&&!f.ledgeCooldown&&i.y<.65)for(let l of StageRules.ledges)if(l.face!==f.ledgeExitSide&&Math.abs(f.x-l.x)<c.ledgeGrabRange[0]&&(f.x-l.x)*l.face<35&&f.y>l.y+8&&f.y<l.y+c.ledgeGrabRange[1]){catchLedge(f,l);break;}
  if(blastZoneSide(f))ko(f);
 }
 function land(f,i,landingSpeed=Math.abs(f.vy)){if(NewcomerCore.ids.includes(f.characterId)&&NewcomerCore.land(f,i))return;if(f.characterId==='adol'&&AdolRules.land(f,i))return;let c=f.character,a=f.attack,wasFast=f.fastFall;BattleFeel.landing(f,Math.abs(landingSpeed),wasFast);f.shortHop=false;f.airJumps=c.airJumpCount;f.jumps=0;f.airDodged=false;f.ledgeGrabs=0;f.recovered=false;f.fastFall=false;f.helpless=false;
  if(f.mode==='ShieldBreak'){enter(f,'Stunned',180);return;}
  if(f.tumbling){f.attack=null;if(!tech(f,i,'floor')){f.hitstun=0;f.tumbling=false;enter(f,'Knockdown');f.vx*=.4;}return;}
  if(f.hitstun>0){f.vx*=.6;return;}
  if(a?.surf&&a.mounted&&f.timer<=65){a.gravityMultiplier=1;f.vy=0;f.grounded=true;return;}
  if(a?.horse&&a.mounted&&f.timer<=a.rideEnd){a.gravityMultiplier=1;f.vy=0;f.grounded=true;return;}
  if(a?.landingMove&&f.timer>=a.startupFrames){f.gravityOff=false;f.specialLandingLag=0;attack(f,a.landingMove);CombatVFX.landingBurst(f.x,f.y,f.color);shake=12;flash=.14;sound('land-heavy',1,f);return;}
  let lag=wasFast?c.hardLandingFrames:c.normalLandingFrames,name=wasFast?'HardLanding':'NormalLanding';
  if(f.dodge?.landing&&['NeutralAirDodge','DirectionalAirDodge'].includes(f.mode)){lag=f.dodge.earlyLanding&&f.stateFrame<=BattleFeel.tuning.directionalDodgeFloat?f.dodge.earlyLanding:f.dodge.landing;name='AerialLanding';}
  else if(f.specialLandingLag){lag=f.specialLandingLag;name='SpecialLanding';}
  else if(a&&a.landingLagFrames&&f.timer>=a.landingFlag[0]&&f.timer<=a.landingFlag[1]&&!a.autoCancelWindow.some(([x,y])=>f.timer>=x&&f.timer<=y)){lag=a.landingLagFrames;name='AerialLanding';}
  f.attack=null;f.gravityOff=false;f.specialLandingLag=0;f.lastLandingLag=lag;f.landingLag=lag;enter(f,name,lag);
 }
 return{tick,physics,land,tech,catchLedge,releaseGrab,breakShield,beginDodge,launchJump,dodgeData,stopLaunchOnPress};
})();
