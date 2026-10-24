'use strict';
// Install a real normal-grab release probe into a paused game page. No direct
// velocity injection, no removed platforms, no counting unrecovered falls as KOs.
module.exports=async page=>page.evaluate(()=>{
 state='pause';simulationSpeed=0;training=false;countdown=hitstop=0;StageRules.oneOnOne=false;GameAudio.setMuted(true);
 window.throwFlight=(id,type,pct=0,options={})=>{
  setupStage(options.stage||'0');const main=platforms.find(p=>p.main),side=options.side||1,edge=options.edge??type!=='upThrow';fighters=[makeFighter(0,0,id),makeFighter(1,0,options.victim||'tifa')];const[f,o]=fighters;
  for(const v of fighters)Object.assign(v,{x:edge?(side>0?main.x+main.w-65:main.x+65):main.x+main.w/2,y:main.y,grounded:true,vx:0,vy:0,inv:0,intangible:0,hitlag:0,hitstun:0,respawn:0,stocks:99,ledgeCooldown:999});
  o.character={...o.character,weight:options.weight??90};f.face=type==='backThrow'?-side:side;o.x=f.x+f.face*35;o.damage=pct;f.staleQueue=options.stale?[type]:[];f.grabbed=o;o.grabOwner=f;PlayerStates.enter(f,'GrabHold');PlayerStates.enter(o,'Grabbed');f.stateFrame=5;
  const a=ThrowTuning.move(f,type),start={x:o.x,y:o.y};updateFighter(f,{...emptyInput(),...(type==='upThrow'?{y:-1}:type==='downThrow'?{y:1}:{x:type==='backThrow'?-f.face:f.face})});const launch={...o.pendingLaunch},released=!!o.pendingLaunch&&!f.grabbed&&!o.grabOwner,bounce=!a.throwBounce||o.y===main.y&&o.state==='down';let zone=null,range=0,height=0,landed=false,finite=true,launched=false,actionableAt=null,stunnedKO=false;
  for(let n=0;n<300&&!o.respawn;n++){frame++;const input=o.hitlag&&options.di?{...emptyInput(),...options.di}:emptyInput();const wasStunned=!!o.hitlag||o.hitstun>0;updateFighter(o,input);if(!o.hitlag&&!o.hitstun&&actionableAt===null)actionableAt=n;if(o.respawn&&wasStunned)stunnedKO=true;range=Math.max(range,Math.abs(o.x-start.x));height=Math.max(height,start.y-o.y);zone=blastZoneSide(o)||zone;finite&&=[o.x,o.y,o.vx,o.vy].every(Number.isFinite);launched||=o.vy<0;if(o.grounded&&!o.hitlag&&n>12){landed=true;break;}}
  return{id,type,pct,role:a.throwRole,group:a.throwGroup,reference:a.throwKOReference,side,weight:o.character.weight,launch,released,bounce,launched,finite,range,height,landed,zone,direct:!!zone&&zone!=='bottom',stunnedKO,actionableAt,unrecoveredFall:zone==='bottom'};
 };
});
