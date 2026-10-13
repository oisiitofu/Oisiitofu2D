'use strict';
const CombatSystem=(()=>{
 const inWindow=(list,t)=>list.some(w=>t>=(w.start??w[0])&&t<=(w.end??w[1]));
 // Smash launch conversion is calibrated to this stage's world scale (4 px
 // per reference unit). Keep knockback/hitstun, weight and charge relationships.
 const isSmash=a=>/smash/i.test([a.type,a.sourceType].join(' '))||!a.type&&Roster.definitions.some(({id})=>['smash','upsmash','downsmash'].some(key=>movesFor({characterId:id})[key]===a));
 const launchSpeed=(a,raw)=>raw*(isSmash(a)?.12:.24);
 function stale(f,id){let weights=[.09,.085,.075,.065,.055,.045,.035,.025,.015],penalty=f.staleQueue.reduce((n,m,i)=>n+(m===id?weights[i]:0),0);return penalty?Math.max(.55,1-penalty):1.05;}
 function calculateKnockback(a,percent,weight=90,attackerPercent=0,damage=a.damage){let growth=(a.knockbackGrowth??.06)*10,base=(a.baseKnockback??3)*3;let raw=a.fixedKnockback||(((percent/10+percent*damage/20)*200/(weight+100)*1.4+18)*growth+base);let rage=1+Math.max(0,Math.min(1,(attackerPercent-35)/115))*.1;return raw*rage;}
 function freeze(f,frames){if(frames<=0)return;if(!f.frozen)f.frozen={mode:f.mode,state:f.state,stateFrame:f.stateFrame,stateStart:f.stateStart,stateEnd:f.stateEnd,stateDuration:f.stateDuration,faf:f.faf,timer:f.timer};f.hitlag=Math.max(f.hitlag||0,frames);f.mode='Hitlag';}
 function hitlag(f,i){if(f.pendingLaunch&&(i.flickX||i.flickY)){let ox=f.x,oy=f.y,m=f.pendingLaunch.SDIMultiplier??1;f.x+=i.x*3*m;f.y+=i.y*3*m;let main=platforms.find(p=>p.main),ecb=f.character.ecb;if(f.x>main.x-ecb.radius&&f.x<main.x+main.w+ecb.radius&&f.y>main.y&&f.y-ecb.height<main.y+90){f.x=ox;f.y=oy;}}
  if(--f.hitlag>0)return;let frozen=f.frozen;f.frozen=null;if(frozen)Object.assign(f,frozen);
  if(f.pendingLaunch){let p=f.pendingLaunch;f.pendingLaunch=null;let base=p.angle,cross=Math.cos(base)*i.y-Math.sin(base)*i.x,angle=base+(p.raw>=50&&Math.abs(Math.sin(base))>Math.sin(BattleFeel.tuning.diAngle)?clamp(cross,-1,1)*BattleFeel.tuning.diAngle:0),speed=p.speed;if(p.raw>=50&&Math.abs(Math.sin(angle))<=Math.sin(65*Math.PI/180))speed*=i.y<0?1-i.y*.095:1-i.y*.08;
   // Only the horizontal component was underpowered. Keep vertical KOs,
   // raw knockback, hitstun and vertical launch relationships intact.
   f.vx=Math.cos(angle)*speed*(p.smash&&Math.abs(Math.cos(base))>=Math.SQRT1_2?1.5:1);f.vy=Math.sin(angle)*speed;f.launchDecay=p.smash?.204*Math.abs(Math.cos(angle)):.075;f.hitstun=p.hitstun;f.lastLaunchAngle=angle;f.lastLaunchSpeed=speed;f.lastKnockback=p.raw;f.tumbling=p.raw>=50;
   // A flat ground hit has not landed from the air. Keep its support until
   // physics actually lifts it or carries it past the lip; otherwise the
   // first gravity step turns it into a knockdown and discards its launch.
   f.grounded=f.grounded&&f.vy+f.character.gravity>=0;PlayerStates.enter(f,f.tumbling?'Tumble':'Hitstun');}
 }
 function protection(f,part){let a=f.attack,t=f.timer;return{intangible:f.intangible>0||a&&inWindow(a.intangibleFrames,t),invincible:f.inv>0||a&&inWindow(a.invincibleFrames,t),armor:a?.armorFrames.find(w=>t>=(w.start??w[0])&&t<=(w.end??w[1])&&(!w.part||w.part===part))};}
 function contact(box,f){let best=null;const dx=box.x2-box.x1,dy=box.y2-box.y1,ll=dx*dx+dy*dy;for(let h of hurtboxes(f)){let t=clamp(((h.x-box.x1)*dx+(h.y-box.y1)*dy)/Math.max(1,ll),0,1),x=box.x1+dx*t,y=box.y1+dy*t;if(Math.hypot(h.x-x,h.y-y)<=h.r+box.radius)best={part:h.part,x,y};}return best;}
 function shieldCovers(o,box){let c=o.character,ratio=Math.max(.15,o.shield/c.shieldHP),r=c.shieldSize*(.3+.7*ratio),x=o.x+c.shieldOffset[0]+o.shieldOffset[0],y=o.y+c.shieldOffset[1]+o.shieldOffset[1],dx=box.x2-box.x1,dy=box.y2-box.y1,t=clamp(((x-box.x1)*dx+(y-box.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1);return Math.hypot(x-box.x1-t*dx,y-box.y1-t*dy)<=r+box.radius;}
 function releaseOnHit(o){if(o.grabbed)PlayerController.releaseGrab(o);o.attack=null;o.buffer=null;o.landingLag=0;o.recovered=false;o.helpless=false;o.specialLandingLag=0;o.ledge=null;o.ledgeExitSide=0;o.ledgeGrabs=0;o.fastFall=false;o.airDodged=false;o.gravityOff=false;o.committedDrop=null;}
 function hit(f,o,a,box=null,touch=null){if(f===o||o.respawn||BattlePlayers.out(o))return;if(!o.mode)prepareFighter(o);if(!f.mode)prepareFighter(f);
  if(a.type==='grab'){if(f.grabbed||o.grabImmunity||o.mode==='Grabbed')return;f.attack=null;f.grabbed=o;o.grabOwner=f;o.grabEscape=65+o.damage*.7;o.attack=null;o.hitstun=0;o.buffer=null;PlayerStates.enter(f,'GrabHold');PlayerStates.enter(o,'Grabbed');return;}
  let protect=protection(o,touch?.part);if(protect.intangible)return;if(protect.invincible){ring(o.x,o.y-35,'#fff4ba',35);return;}
  if(o.mode==='ShieldDrop'&&o.parryEligible&&o.stateFrame<=5){PlayerStates.enter(o,'Idle');o.buffer=null;freeze(f,Math.min(30,Math.floor(a.damage*.65+12)));ring(o.x,o.y-36,'#fff1a1',95);CombatVFX.impact(o.x,o.y-36,4,12,1);label(o.x,o.y-100,'PARRY');sound('parry',1,o);return;}
  if(TwinbeeRules.barrier(o,a))return;
  if(HunterRules.guard(f,o,a,box))return;
  if(PawapuroRules.field(f,o,a,box,touch))return;
  if(ChefRules.field(f,o,a,box,touch))return;
  let modifier=a.staleMultiplier??stale(f,a.type),charge=1+(a.charge||0)*(f.character.smashMultiplier-1),dmg=(a.damage??a.dmg??0)*(f.characterId==='morphie'&&!a.projectile?clamp(.8+.2*MorphieRules.scale(f),.85,1.2):1)*modifier*charge*(a.shortHopMultiplier||1)*(StageRules.oneOnOne?1.2:1)*(o.characterId==='goemon'&&o.impactTime>0?1.25:1)*(o.characterId==='rean'&&o.reanDemonTime>0?ReanMoves.gale.demonIncomingMultiplier:1)*(f.characterId==='omegamon'&&f.digiMode!==1?1.1:1)*(o.characterId==='omegamon'&&o.digiMode===1?.85:1),lag=BattleFeel.hitlag({...a,damage:(a.damage??a.dmg??0)*charge});
  if(f.attack&&f.attack.type===a.type&&!f.attack.staleRecorded){f.staleQueue.unshift(a.type);f.staleQueue.length=Math.min(9,f.staleQueue.length);f.attack.staleRecorded=true;}
  // Closely spaced projectiles can arrive during shield hitlag. The saved
  // shield state still blocks them until its hitlag has finished.
  if(['ShieldStart','ShieldHold'].includes(o.mode==='Hitlag'?o.frozen?.mode:o.mode)&&(!box||shieldCovers(o,box))){o.shield=Math.max(0,o.shield-dmg-(a.shieldDamage||0));if(a.damageOnly){if(o.shield<=0)PlayerController.breakShield(o);ring(o.x,o.y-36,'#9affff',18,3);sound('shield-hit',.3,o);return;}o.shieldStun=BattleFeel.shieldStun(a,dmg);o.vx=(a.launchDirection||f.face)*Math.min(3,dmg*.12);if(o.shield<=0)PlayerController.breakShield(o);let shieldLag=BattleFeel.hitlag({...a,hitlagMultiplier:Math.max(1,a.hitlagMultiplier??1)*BattleFeel.tuning.shieldHitlag});if(!a.projectile)freeze(f,shieldLag);freeze(o,shieldLag);ring(o.x,o.y-36,'#9affff',45,shieldLag);sound('shield-hit',.8,o);return;}
  // Rifle chip damage must not launch, interrupt attacks, or pin the victim in hitlag.
  if(a.damageOnly){o.damage=Math.min(999,o.damage+dmg);f.stats.damage+=dmg;f.stats.hits++;o.lastHit=f.id;CombatVFX.impact(touch?.x??o.x,touch?.y??o.y-40,f.color,dmg,f.face,f.characterId);GameAudio.strike(f,a,dmg);return;}
  let raw=calculateKnockback(a,o.damage+dmg,o.character.weight,f.damage,dmg),crouch=o.mode==='Crouch';if(crouch){raw*=o.character.crouchKnockback;lag=Math.floor(lag*o.character.crouchHitlag);}
  o.damage=Math.min(999,o.damage+dmg);f.stats.damage+=dmg;f.stats.hits++;o.lastHit=f.id;let armored=protect.armor&&((protect.armor.damageThreshold??Infinity)>=dmg)&&((protect.armor.knockbackThreshold??Infinity)>=raw)&&((protect.armor.hitCount??Infinity)>(o.armorHits||0));
  if(a.healOnHit&&f.characterId==='nia')NiaRules.heal(f,a.healOnHit);
  if(NewcomerCore.ids.includes(f.characterId)&&(!armored||f.characterId==='jibanyan'&&a.ghostRush))NewcomerCore.registry[f.characterId].onHit(f,o,a);if(f.characterId==='adol')AdolRules.onHit(f,o,a);if(f.characterId==='valkyrie')ValkyrieRules.onHit(f,o,a);if(f.characterId==='hunter'&&!armored)HunterRules.onHit(f,o,a);if(f.characterId==='lloyd'&&!armored)LloydRules.onHit(f,o,a);if(f.characterId==='shiren'&&!armored)ShirenRules.onHit(f,o,a);if(f.characterId==='sans'&&!armored)SansRules.onHit(f,o,a);if(f.characterId==='bomberman'&&!armored)BombermanRules.onHit(f,o,a);if(f.characterId==='midna'&&!armored)MidnaRules.onHit(f,o,a);if(f.characterId==='noah'&&!armored)NoahRules.onHit(f,o,a);if(f.characterId==='emma'&&!armored)EmmaRules.onHit(f,o,a);if(f.characterId==='fayt'&&!armored)FaytRules.onHit(f,o,a);if(f.characterId==='kosmos'&&!armored)KosmosRules.onHit(f,o,a);if(f.characterId==='rex'&&!armored)RexRules.onHit(f,o,a);if(f.characterId==='narukami'&&!armored)NarukamiRules.onHit(f,o,a);if(f.characterId==='neku'&&!armored)NekuRules.onHit(f,o,a);if(f.characterId==='clive'&&!armored)CliveRules.onHit(f,o,a);if(f.characterId==='colette')ColetteRules.onHit(f,o,a);if(f.characterId==='estelle'&&!armored)EstelleRules.onHit(f,o,a);
  if(armored){GameAudio.cue('shield-hit',.7,o);o.armorHits=(o.armorHits||0)+1;freeze(o,lag);if(!a.projectile)freeze(f,lag);return;}
  if(NewcomerCore.ids.includes(f.characterId)&&NewcomerCore.capture(f,o,a,armored)){freeze(f,6);CombatVFX.impact(o.x,o.y-32,f.color,dmg,f.face,f.characterId);GameAudio.strike(f,a,dmg);return;}
  if(f.characterId==='agumon'&&AgumonRules.capture(f,o,a,armored)){freeze(f,6);CombatVFX.impact(o.x,o.y-32,f.color,dmg,f.face,f.characterId);GameAudio.strike(f,a,dmg);return;}
  releaseOnHit(o);let direction=a.launchDirection||f.face,angle=direction<0?Math.PI-a.angle:a.angle;
  o.pendingLaunch={raw,speed:launchSpeed(a,raw),angle,hitstun:Math.max(4,Math.floor(raw*.4)-1),SDIMultiplier:a.SDIMultiplier??1,smash:isSmash(a)};o.meteor=!!a.isMeteor;o.hitstun=0;
  if(a.bounceOnHit&&!f.grounded){f.vy=a.bounceOnHit;f.fastFall=false;}
  if(a.pull){o.pendingLaunch.speed=clamp((Math.abs(o.x-f.x)-40)/8,2,16);o.pendingLaunch.angle=direction<0?Math.PI+.08:-.08;o.pendingLaunch.hitstun=19;}
  if(!a.projectile)freeze(f,lag);freeze(o,lag);if(a.element)RikiRules.onHit(f,o,a);
  if(o.pendingLaunch){o.state='hit';if(!lag){o.hitlag=1;hitlag(o,emptyInput());}}BattleFeel.impact(f,o,a,dmg,raw,lag,touch);
 }
 function overlap(a,b){let proxy={x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2};const dx=a.x2-a.x1,dy=a.y2-a.y1;for(let t of [0,.25,.5,.75,1]){let x=lerp(b.x1,b.x2,t),y=lerp(b.y1,b.y2,t),q=clamp(((x-a.x1)*dx+(y-a.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1);if(Math.hypot(x-a.x1-q*dx,y-a.y1-q*dy)<=a.radius+b.radius)return true;}return false;}
 function resolve(){
  const sets=fighters.map(f=>f.hitlag||f.respawn||BattlePlayers.out(f)?[]:attackBoxes(f));
  for(let i=0;i<fighters.length;i++)for(let j=i+1;j<fighters.length;j++){
   const a=fighters[i],b=fighters[j],aa=a.attack,bb=b.attack;
   if(!aa||!bb||!sets[i].some(x=>sets[j].some(y=>overlap(x,y))))continue;
   if(aa.type==='grab'&&bb.type==='grab'){a.attack=b.attack=null;sets[i]=[];sets[j]=[];for(const f of [a,b]){f.grabImmunity=60;PlayerStates.enter(f,'Clank',12);}ring((a.x+b.x)/2,(a.y+b.y)/2-35,'#ffe0aa',60);continue;}
   if(aa.type!=='grab'&&bb.type!=='grab'&&aa.canClank&&bb.canClank&&!aa.transcendent&&!bb.transcendent&&aa.clangMode!=='none'&&bb.clangMode!=='none'&&a.grounded&&b.grounded){const difference=aa.damage-bb.damage,losers=Math.abs(difference)<=9?[a,b]:difference>0?[b]:[a];for(const f of losers){if(f.attack.reboundOnClank){f.attack=null;PlayerStates.enter(f,'Clank',12);freeze(f,5);}sets[f.id]=[];}ring((a.x+b.x)/2,a.y-35,'#fff2af',55);sound('parry',.7,a);}
  }
  const contacts=[];
  for(const f of fighters){const a=f.attack;if(!a||f.respawn||BattlePlayers.out(f))continue;
   for(const o of BattlePlayers.targets(f)){if(o.mode==='Grabbed'||protection(o).intangible)continue;
    for(const box of [...sets[f.id]].sort((x,y)=>(y.modifiers?.damage??a.damage)-(x.modifiers?.damage??a.damage))){
     if(a.groundOnly&&!o.grounded||a.airOnly&&o.grounded)continue;
     const touch=contact(box,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&shieldCovers(o,box);if(!touch&&!shield)continue;
     const key=(box.hitID??box.window.index)+':'+o.id,last=a.hitTimes.get(key),rehit=box.rehitFrames??a.rehitRate;if(last!==undefined&&(!rehit||f.timer-last<rehit))continue;a.hitTimes.set(key,f.timer);
     const strike={...a,...box.window,...box.modifiers};if(a.meteorFrame){strike.isMeteor=f.timer===a.meteorFrame;strike.angle=strike.isMeteor&&!o.grounded?a.meteorAngle:a.angle;if(strike.isMeteor&&!o.grounded)strike.baseKnockback*=a.meteorMultiplier;}
     strike.launchDirection=strike.pull?(Math.sign(f.x-o.x)||-f.face):box.window.shape==='back'?-f.face:['spin','shockwave'].includes(box.window.shape)?Math.sign(o.x-f.x)||f.face:f.face;contacts.push({f,o,a:strike,box,touch});break;
    }
   }
  }
  for(const c of contacts){const counter=c.o.attack;if(c.a.type!=='grab'&&counter?.counterWindow&&c.o.timer>=counter.counterWindow[0]&&c.o.timer<=counter.counterWindow[1]){c.o.face=Math.sign(c.f.x-c.o.x)||c.o.face;attack(c.o,counter.counterMove);c.o.attack.damage=Math.max(c.o.attack.damage,c.a.damage*1.2);c.o.inv=c.o.attack.totalFrames;ring(c.o.x,c.o.y-35,colors[c.o.color],90);label(c.o.x,c.o.y-90,'COUNTER');sound('parry',1,c.o);continue;}hit(c.f,c.o,c.a,c.box,c.touch);}
 }
 function timeline(f){let a=f.attack;if(!a)return;for(let e of a.timeline){if(e.frame!==f.timer||a.eventsDone.has(e))continue;a.eventsDone.add(e);switch(e.type){case 'SetVelocity':if(e.x!==undefined)f.vx=e.x*f.face;if(e.y!==undefined)f.vy=e.y;break;case 'AddVelocity':f.vx+=(e.x||0)*f.face;f.vy+=e.y||0;break;case 'EnableGravity':f.gravityOff=false;break;case 'DisableGravity':f.gravityOff=true;break;case 'SetIntangible':f.intangible=e.frames;break;case 'ClearIntangible':f.intangible=0;break;case 'EnableHitbox':a.extraHitboxes.push(e.hitbox);break;case 'DisableHitbox':a.extraHitboxes=a.extraHitboxes.filter(h=>h.id!==e.id);break;case 'ChangeHitbox':Object.assign(a.extraHitboxes.find(h=>h.id===e.id)||{},e.values);break;case 'EnableArmor':a.armorFrames=[{start:f.timer,end:e.end||a.totalFrames,...e.armor}];break;case 'DisableArmor':a.armorFrames=[];break;case 'EnableLandingFlag':a.autoCancelWindow=[];break;case 'DisableLandingFlag':a.autoCancelWindow=[[f.timer,Infinity]];break;case 'PlaySFX':sound(e.sound||'swing',1,f);break;case 'SpawnVFX':ring(f.x,f.y-32,colors[f.color],e.size||70);break;case 'CameraShake':shake=e.amount||5;break;}}
 }
 return{stale,calculateKnockback,launchSpeed,freeze,hitlag,protection,contact,shieldCovers,hit,resolve,timeline,inWindow};
})();
