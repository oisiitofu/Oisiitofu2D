'use strict';
function attack(f,type){
 if(NewcomerCore.ids.includes(f.characterId)){if(type==='gale'&&!f.grounded)type='airDrop';if(!NewcomerCore.gate(f,type))return false;}
 if(f.characterId==='headmaster'&&(type==='gale'&&f.headBlockCooldown>0||!f.grounded&&(type==='dash'&&f.headSideUsed||type==='gale'&&f.headBlockUsed)))return false;
 if(f.characterId==='pawapuro'&&type==='gale'&&f.pawaFieldCooldown>0)return false;
 if(f.characterId==='agumon'){if(type==='gale'&&!f.grounded)type='airVolcano';if(!f.grounded&&(type==='dash'&&f.agumonSideUsed||type==='airVolcano'&&f.agumonAirVolcanoUsed))return false;}
 if(f.characterId==='terry'&&type==='dash'&&f.terryScoutCooldown>0)return false;
 if(f.characterId==='valkyrie'){if(type==='gale'&&!f.grounded)type='airScarlet';if(!f.grounded&&type==='dash'&&f.valkSideUsed)return false;}
 if(f.characterId==='adol'){if(type==='gale'&&!f.grounded)type='airShaker';if(!f.grounded&&type==='dash'&&f.adolSideUsed)return false;}
 if(f.characterId==='hunter'&&!f.grounded&&type==='dash'&&f.hunterSideUsed)return false;

 if(f.characterId==='pokoa'&&!f.grounded&&(type==='dash'&&f.pokoaSideUsed||type==='gale'&&f.pokoaFloatUsed))return false;
 if(f.characterId==='shiren'){if(type==='gale'&&!f.grounded)type='airScroll';if(type==='dash'&&!f.grounded&&f.shirenSideUsed)return false;}
 if(f.characterId==='lloyd'&&(type==='dash'&&!f.grounded&&f.lloydSideUsed||type==='gale'&&f.lloydCircleCooldown>0))return false;
 if(f.characterId==='sans'&&(type==='dash'&&!f.grounded&&f.sansSideUsed||type==='gale'&&f.sansLockCooldown>0))return false;
 if(f.characterId==='bomberman'){if(type==='gale'&&!f.grounded)type='airPunch';if(!f.grounded&&(type==='dash'&&f.bomberSideUsed||type==='airPunch'&&f.bomberPunchUsed)||type==='dragon'&&BombermanRules.bombs(f).length>=4)return false;}
 if(f.characterId==='midna'){if(type==='gale'&&!f.grounded)type='airCrush';if(!f.grounded&&(type==='dash'&&f.midnaSideUsed||type==='airCrush'&&f.midnaCrushUsed))return false;}
 if(f.characterId==='noah'){if(type==='gale'&&!f.grounded)type='airBeat';if(!f.grounded&&(type==='dash'&&f.noahSideUsed||type==='airBeat'&&f.noahBeatUsed))return false;}
 if(f.characterId==='emma'){if(type==='gale'&&!f.grounded)type='airHelm';if(type==='dash'&&(f.emmaKooCooldown>0||!f.grounded&&f.emmaSideUsed)||type==='airHelm'&&f.emmaHelmUsed)return false;}
 if(f.characterId==='fayt'){if(type==='gale'&&!f.grounded)type='airKick';if(!f.grounded&&(type==='dash'&&f.faytSideUsed||type==='airKick'&&f.faytKickUsed))return false;}
 if(f.characterId==='kosmos'){if(type==='gale'&&!f.grounded)type='airDrill';if(!f.grounded&&(type==='dash'&&f.kosmosSideUsed||type==='airDrill'&&f.kosmosDrillUsed))return false;}
 if(f.characterId==='will'){if(type==='dragon'&&f.willFormTime>0)type=f.willForm===1?'warriorSpell':f.willForm===2?'mageSpell':type;if(type==='dash'&&!f.grounded&&f.willSideUsed||type==='gale'&&f.willShiftCooldown>0)return false;}
 if(f.characterId==='luke'){if(type==='gale'&&f.lukeDemonTime)type='demonStop';if(type==='gale'&&f.lukeDemonCooldown>0||type==='dash'&&!f.grounded&&f.lukeSideUsed)return false;}
 if(f.characterId==='rex'&&!f.grounded&&(type==='dash'&&f.rexSideUsed||type==='gale'&&f.rexRollUsed))return false;
 if(f.characterId==='naegi'&&(type==='dash'&&!f.grounded&&f.naegiSideUsed||type==='gale'&&f.naegiSupportCooldown>0))return false;
 if(f.characterId==='narukami'&&type==='dash'&&!f.grounded&&f.narukamiSideUsed)return false;
 if(f.characterId==='neku'&&type==='dash'&&!f.grounded&&f.nekuSideUsed)return false;
 if(f.characterId==='makoto'&&type==='dash'&&!f.grounded&&f.makotoSideUsed)return false;
 if(f.characterId==='clive'){if(type==='gale'&&!f.grounded)type='airPile';if(!f.grounded&&(type==='dash'&&f.cliveShiftUsed||type==='airPile'&&f.clivePileUsed))return false;}
 if(f.characterId==='noctis'){if(type==='dash'&&NoctisRules.marker(f))type='warpStrike';if(!f.grounded&&['dash','warpStrike'].includes(type)&&f.noctisSideUsed)return false;}
 if(f.characterId==='rean'){if(type==='gale'&&f.reanDemonTime>0)type='demonFinish';if(type==='dash'&&!f.grounded&&f.reanSideUsed)return false;}
 if(f.characterId==='estelle'&&!f.grounded&&(type==='dash'&&f.estelleSideUsed||type==='gale'&&f.estelleWheelUsed))return false;
 const data=movesFor(f)[type];if(f.zidaneSilenced>0&&data?.special&&type!=='rise'&&!data.tether&&(data.projectile||['dragon','gale','airDrop'].includes(type)))return false;if(!data||type==='rise'&&f.recovered)return false;
 if(data.aerial&&!data.verticalImpulse)f.specialLandingLag=0;
 let special=data.special||['rise','dragon','dash','gale','counter'].includes(type)||type.startsWith('side');PlayerStates.enter(f,type==='grab'?'Grab':special?(f.grounded?'GroundSpecial':'AirSpecial'):(f.grounded?'GroundAttack':'AerialAttack'),data.totalFrames);f.timer=1;f.attack={...data,type,hits:new Set(),hitTimes:new Map(),eventsDone:new Set(),extraHitboxes:[],staleMultiplier:CombatSystem.stale(f,type),shortHopMultiplier:f.shortHop&&!f.grounded?.85:1,charge:0,chargeFrames:0,hold:false,hauntDelay:f.jibanyanHaunt>0?6:0};if(!data.preserveVelocity)f.vx=f.vy=0;f.vx*=data.velocityMultiplier;if(data.velocityXOverride!==null)f.vx=data.velocityXOverride*f.face;if(data.velocityYOverride!==null)f.vy=data.velocityYOverride;f.buffer=null;f.tumbling=false;if(data.targetedMeteor){f.attack.targetOffset=145;f.attack.meteorTarget=ChocoboRules.target(f);}
 if(f.characterId==='lightning')LightningRules.prepare(f);if(f.characterId==='rean')ReanRules.prepare(f);if(f.characterId==='estelle')EstelleRules.prepare(f);if(f.characterId==='noctis')NoctisRules.prepare(f);if(f.characterId==='clive')CliveRules.prepare(f);if(f.characterId==='makoto')MakotoRules.prepare(f);if(f.characterId==='neku')NekuRules.prepare(f);if(f.characterId==='narukami')NarukamiRules.prepare(f);if(f.characterId==='naegi')NaegiRules.prepare(f);if(f.characterId==='rex')RexRules.prepare(f);if(f.characterId==='luke')LukeRules.prepare(f);if(f.characterId==='will')WillRules.prepare(f);if(f.characterId==='kosmos')KosmosRules.prepare(f);if(f.characterId==='fayt')FaytRules.prepare(f);if(f.characterId==='emma')EmmaRules.prepare(f);if(f.characterId==='ryza')RyzaRules.prepare(f);if(f.characterId==='noah')NoahRules.prepare(f);if(f.characterId==='midna')MidnaRules.prepare(f);if(f.characterId==='bomberman')BombermanRules.prepare(f);if(f.characterId==='sans')SansRules.prepare(f);if(f.characterId==='shiren')ShirenRules.prepare(f);if(f.characterId==='pokoa')PokoaRules.prepare(f);if(f.characterId==='hunter')HunterRules.prepare(f);if(f.characterId==='adol')AdolRules.prepare(f);if(f.characterId==='valkyrie')ValkyrieRules.prepare(f);if(f.characterId==='terry')TerryRules.prepare(f);if(f.characterId==='agumon')AgumonRules.prepare(f);if(f.characterId==='pawapuro')PawapuroRules.prepare(f);if(f.characterId==='headmaster')HeadmasterRules.prepare(f);if(NewcomerCore.ids.includes(f.characterId))NewcomerCore.registry[f.characterId].prepare(f);if(f.characterId==='lloyd')LloydRules.prepare(f);
 const before=f.attack.totalFrames;CombatData.alignRecovery(f.attack);const delta=f.attack.totalFrames-before;f.faf+=delta;f.stateEnd+=delta;f.stateDuration=f.attack.totalFrames;
 return true;
}
function grabBoxes(f,a,w){
 // Grabs cover the body from feet to chest, rather than sweeping the generic
 // sword capsule upward. Reach still comes from the character's move data;
 // wide bodies need the hand to extend beyond their own collision boundary.
 const bodyRadius=f.character.ecb.radius/MorphieRules.scale(f);
 const reach=Math.max((w.reach??a.reach)*FIGHTER_SCALE,bodyRadius+34);
 const x=f.x+a.hitboxOffset[0]*f.face,y=f.y+a.hitboxOffset[1];
 return[14,32,50].map(height=>({x1:x,y1:y-height,x2:x+reach*f.face,y2:y-height,radius:14,window:w}));
}
function baseAttackBoxes(f,a=f.attack,t=f.timer){
 if(!a||a.hauntDelay>0)return[];let w=CombatData.activeWindow(a,t);if(!w)return[];if(a.type==='grab')return grabBoxes(f,a,w);if(a.lloydBlade)return LloydRules.bladeBoxes(f,a,w,t);if(a.newcomerHit)return NewcomerCore.registry[f.characterId].boxes(f,a,w,t);if(a.headHit)return HeadmasterRules.boxes(f,a,w,t);if(a.pawaBat)return PawapuroRules.boxes(f,a,w,t);if(a.agumonClaw)return AgumonRules.boxes(f,a,w,t);if(a.terryHit)return TerryRules.boxes(f,a,w,t);if(a.valkBlade)return ValkyrieRules.boxes(f,a,w,t);if(a.adolBlade)return AdolRules.boxes(f,a,w,t);if(a.hunterBlade)return HunterRules.boxes(f,a,w,t);if(a.pokoaHit)return PokoaRules.boxes(f,a,w,t);if(a.shirenBlade)return ShirenRules.boxes(f,a,w,t);if(a.sansBone||a.sansPillars)return SansRules.boxes(f,a,w,t);if(a.bomberMelee)return BombermanRules.meleeBoxes(f,a,w,t);if(a.midnaHand||a.hairGrapple||a.midnaPillar||a.midnaField||a.midnaWarp)return MidnaRules.boxes(f,a,w,t);if(a.noahBlade)return NoahRules.bladeBoxes(f,a,w,t);if(a.staffSweep)return RyzaRules.staffBoxes(f,a,w,t);if(a.corePillar)return RyzaRules.pillarBox(f,a,w);if(a.thornStorm)return EmmaRules.thornBox(f,a,w);if(a.stoneRain)return FaytRules.stoneBoxes(f,a,w);if(a.sideKick)return FaytRules.kickBox(f,a,w);if(a.energyChain)return KosmosRules.chainBox(f,a,w,t);if(a.nodeArray)return KosmosRules.arrayBoxes(f,a,w);if(a.anchorShot)return RexRules.anchorBox(f,a,w,t);if(a.spectralChain)return NarukamiRules.chainBox(f,a,w,t);if(a.psychicLock)return NekuRules.lockBox(f,a,w);if(a.garudaClaw){const p=CliveRules.claw(f,t),q=CliveRules.claw(f,Math.max(w.start-1,t-1));return[{x1:q.x,y1:q.y,x2:p.x,y2:p.y,radius:a.clawRadius,window:w}];}if(a.chainHammer){const p=GundamRules.hammer(f,t),prev=GundamRules.hammer(f,Math.max(w.start,t-1));return[{x1:prev.x,y1:prev.y,x2:p.x,y2:p.y,radius:21,window:w}];}
 if(a.targetedMeteor){const ball=ChocoboRules.meteor({...f,attack:a},t);if(t<a.meteorImpactStart)return[{x1:ball.x,y1:ball.y,x2:ball.x,y2:ball.y,radius:ball.radius,window:w}];const r=42+(a.charge||0)*30;return[{x1:ball.target.x-r,y1:ball.target.y-20,x2:ball.target.x+r,y2:ball.target.y-20,radius:23,window:w}];}
 if(w.helper){const x=f.x+f.face*90;return[{x1:x,y1:f.y-29,x2:x+f.face*65,y2:f.y-29,radius:13,window:w}];}
 if(a.earthSpikes){const count=1+Math.floor((a.charge||0)*2),height=92*(1+(a.charge||0)*.3);return Array.from({length:count},(_,n)=>{const x=f.x+f.face*(62+n*48);return{x1:x,y1:f.y-8,x2:x+f.face*12,y2:f.y-height,radius:18,window:w};});}
 if(w.shape==='shockwave'){let reach=a.reach*FIGHTER_SCALE,spread=lerp(reach*.4,reach,(t-w.start)/Math.max(1,w.end-w.start));return[{x1:f.x-spread,y1:f.y-14,x2:f.x+spread,y2:f.y-14,radius:17*FIGHTER_SCALE,window:w}];}
 let g=CombatData.geometry[w.shape],progress=(t-w.start)/Math.max(1,w.end-w.start),angle=lerp(g.angles[0],g.angles[1],progress),reach=(w.reach??a.reach)*FIGHTER_SCALE;
 let x=f.x+(g.origin[0]*FIGHTER_SCALE+a.hitboxOffset[0])*f.face,y=f.y+g.origin[1]*FIGHTER_SCALE+a.hitboxOffset[1];
 let base={x1:x,y1:y,x2:x+Math.cos(angle)*reach*f.face,y2:y+Math.sin(angle)*reach,radius:g.radius*FIGHTER_SCALE*a.hitboxSize,window:w};let custom=[...a.hitboxes,...a.extraHitboxes];if(!custom.length)return[base];return custom.filter(h=>t>=(h.start??w.start)&&t<=(h.end??w.end)).map(h=>({...base,x1:lerp(base.x1,base.x2,h.from??0)+(h.offset?.[0]||0)*f.face,y1:lerp(base.y1,base.y2,h.from??0)+(h.offset?.[1]||0),x2:lerp(base.x1,base.x2,h.to??1)+(h.offset?.[0]||0)*f.face,y2:lerp(base.y1,base.y2,h.to??1)+(h.offset?.[1]||0),radius:h.size??base.radius,hitID:h.hitID??h.id,rehitFrames:h.rehitFrames,modifiers:h}));
}
function capsuleHits(box,o){return !!CombatSystem.contact(box,o);}
function bufferInput(f,i){
 const key=['smash','special','grab','heavy','jab','jump'].find(k=>i[k]);
 if(key)f.buffer={key,x:i.x,y:i.y,frames:CombatData.movement.bufferFrames};
 else if(f.buffer&&--f.buffer.frames<=0)f.buffer=null;
}
function consumeBuffered(f,i){if(!f.buffer)return i;let b=f.buffer;f.buffer=null;return{...i,[b.key]:true,x:b.x,y:b.y};}
function advanceAttack(f,i){
 let a=f.attack;if(!a||a.hauntDelay>0)return;if(f.characterId==='pawapuro')PawapuroRules.aim(f,i);if(f.characterId==='hunter')HunterRules.aim(f,i);if(f.characterId==='ryza'&&RyzaRules.holding(f,i))return;if(f.characterId==='chocobo')ChocoboRules.tick(f,i);
 if(a.chargeFrame&&f.timer===a.chargeFrame&&(a.chargeButton==='special'?i.specialHeld||i.buttons?.special?.value:i.charge)&&a.chargeFrames<(a.chargeHoldFrames||180)){a.hold=true;a.chargeFrames++;if(a.chargeFrames===1)GameAudio.cue('charge',.45,f);f.stateEnd++;f.faf++;a.charge=Math.min(1,a.chargeFrames/a.chargeMaxFrames);f.timer--;if(frame%5===0)emit(f.x,f.y-36,colors[f.color],2,2);return;}
 a.hold=false;CombatSystem.timeline(f);if(f.characterId==='monokuma')MonokumaRules.action(f);if(f.characterId==='riki')RikiRules.action(f,i);if(f.characterId==='roxas')RoxasRules.action(f);if(f.characterId==='twob')TwoBRules.action(f,i);if(f.characterId==='okami')OkamiRules.action(f,i);if(f.characterId==='gundam')GundamRules.action(f);if(f.characterId==='vivi')ViviRules.action(f);if(f.characterId==='zero')ZeroRules.action(f);if(f.characterId==='rin')RinRules.action(f);if(f.characterId==='nia')NiaRules.action(f);if(f.characterId==='lightning')LightningRules.action(f);if(f.characterId==='colette')ColetteRules.action(f,i);if(f.characterId==='rean')ReanRules.action(f,i);if(f.characterId==='estelle'){EstelleRules.action(f,i);a=f.attack;if(!a)return;}
 if(f.characterId==='lloyd'){LloydRules.action(f,i);a=f.attack;if(!a)return;}if(NewcomerCore.ids.includes(f.characterId)){NewcomerCore.registry[f.characterId].action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='headmaster'){HeadmasterRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='pawapuro'){PawapuroRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='agumon'){AgumonRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='terry'){TerryRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='valkyrie'){ValkyrieRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='adol'){AdolRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='hunter'){HunterRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='pokoa'){PokoaRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='shiren'){ShirenRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='sans'){SansRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='bomberman'){BombermanRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='midna'){MidnaRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='noah'){NoahRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='ryza'){RyzaRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='emma'){EmmaRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='fayt'){FaytRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='kosmos'){KosmosRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='will'){WillRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='luke'){LukeRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='rex'){RexRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='naegi'){NaegiRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='narukami'){NarukamiRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='neku'){NekuRules.action(f,i);a=f.attack;if(!a)return;}if(f.characterId==='makoto')MakotoRules.action(f,i);if(f.characterId==='noctis')NoctisRules.action(f,i);if(f.characterId==='clive'){CliveRules.action(f,i);a=f.attack;if(!a)return;}
 if(a.actionCancelFrame&&f.timer>=a.actionCancelFrame&&f.buffer&&['jab','heavy','smash'].includes(f.buffer.key)){let next=InputFrames.consume(f,i);if(next.smash)next.jab=true;f.specialLandingLag=0;if(selectAttack(f,next)){a=f.attack;CombatSystem.timeline(f);}}
 if(a.rushSpeed&&CombatData.activeWindow(a,f.timer)){f.vx=f.face*a.rushSpeed;f.vy=0;}
 if(a.diveSpeed&&CombatData.activeWindow(a,f.timer)){f.fastFall=false;f.vy=a.diveSpeed;}
 const cancel=a.cancel,b=f.buffer;if(cancel&&b&&f.timer>=cancel.start&&f.timer<=cancel.end&&(b.key===cancel.input||cancel.input==='jab'&&b.key==='heavy')){let next=cancel.next||cancel.branch+(b.y<0?'Up':b.y>0?'Down':'');attack(f,next);a=f.attack;}
 GameAudio.attackTick(f);if(f.timer===a.startupFrames){if(a.verticalImpulse){f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;ring(f.x,f.y,colors[f.color],90);}}
 if(CombatData.activeWindow(a,f.timer)&&frame%2===0&&!(f.characterId==='pokoa'&&PokoaRules.form(f))){ghosts.push({x:f.x,y:f.y,face:f.face,pose:CombatData.sample(a,f.timer).pose,characterId:f.characterId,color:f.color,morphSize:f.morphSize,life:14});}
}
function resolveCombat(){CombatSystem.resolve();}
function hit(f,o,a){CombatSystem.hit(f,o,a);}
function selectAttack(f,i){
 i=InputFrames.attackDirection(i);
 const aerial=()=>i.y<0?'uair':i.y>0?'dair':i.x?(i.x*f.face<0?'bair':'fair'):'air';
 if(i.grab)return attack(f,'grab');
 if(f.grounded&&i.x&&(i.smash||i.jab||i.heavy))f.face=Math.sign(i.x);
 if(i.special){if(i.x&&Math.abs(i.y)<.5)f.face=Math.sign(i.x);return attack(f,i.y<0?'rise':i.y>0?'gale':i.x?'dash':'dragon');}
 if((i.smash||(i.jab||i.heavy)&&i.smashFlick&&!i.forceTilt)&&f.grounded)return attack(f,i.y<0?'upsmash':i.y>0?'downsmash':'smash');
 if(i.jab||i.heavy){if(!f.grounded)return attack(f,aerial());if(['Run','InitialDash'].includes(f.mode)&&!i.forceTilt&&Math.abs(i.y)<.2)return attack(f,'dashAttack');return attack(f,i.heavy?(i.y<0?'up':i.y>0?'low':'heavy'):'jab');}
 return false;
}

function updateFighter(f,i){PlayerController.tick(f,i);}

function attackBoxes(f,a=f.attack,t=f.timer){
 const morph=MorphieRules.scale(f),body=a?.type==='grab'?1:BattleSize.geometry(f),boxes=baseAttackBoxes(f,a,t),y=BattleSize.originY(f);
 // Keep special-move coverage while moving its center with the resized body.
 // Ordinary weapon segments shrink with the sprite; grab reach has its own tuning.
 const scaled=boxes.map(b=>{const cx=(b.x1+b.x2)/2,cy=(b.y1+b.y2)/2,shape=a?.special?1:body,dx=(b.x2-b.x1)/2*shape*morph,dy=(b.y2-b.y1)/2*shape*morph,x=f.x+(cx-f.x)*body*morph,yy=y+(cy-y)*body*morph;return{...b,x1:x-dx,y1:yy-dy,x2:x+dx,y2:yy+dy,radius:b.radius*shape*morph};});
 return MeleeBalance.boxes(f,a,scaled);
}
// Extra body coverage follows the swing but must not pull the weapon's visual
// cutting edge down to the fighter's feet or draw duplicate energy trails.
function attackVisualBoxes(f,a=f.attack,t=f.timer){return attackBoxes(f,a,t).filter(b=>!b.meleeInner);}
