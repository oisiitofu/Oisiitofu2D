'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.addInitScript(()=>navigator.getGamepads=()=>[]);
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-training');await page.click('#start');await page.waitForFunction(()=>state==='battle');
 const result=await page.evaluate(()=>{
  state='pause';training=false;countdown=hitstop=0;setupStage('0');platforms=platforms.filter(p=>p.main);const failed=[],rows=[],trajectories=[];let checks=0;
  const check=(name,pass,detail)=>{checks++;if(!pass&&failed.length<50)failed.push({name,detail});};
  const fresh=(id,face=1,percent=0,x=720)=>{fighters=[makeFighter(0,0,id),makeFighter(1,0,'tifa')];const[f,o]=fighters;for(const v of fighters)Object.assign(v,{x,y:560,vx:0,vy:0,grounded:true,inv:0,intangible:0,hitlag:0,hitstun:0,stocks:99,respawn:0,ledgeCooldown:999});o.character.weight=90;f.face=face;o.x=x+face*35;o.damage=percent;return[f,o];};
  const release=(f,o,type,baseline=false)=>{f.grabbed=o;o.grabOwner=f;PlayerStates.enter(f,'GrabHold');PlayerStates.enter(o,'Grabbed');f.stateFrame=5;const tuning=ThrowTuning.move;if(baseline)ThrowTuning.move=(f,type)=>movesFor(f)[type];try{updateFighter(f,{...emptyInput(),...(type==='upThrow'?{y:-1}:type==='downThrow'?{y:1}:{x:type==='backThrow'?-f.face:f.face})});}finally{ThrowTuning.move=tuning;}return o.pendingLaunch;};
  const tick=f=>{frame++;updateFighter(f,emptyInput());};
  for(const{id}of Roster.definitions){
   check(id+' explicit assignment',!!ThrowTuning.assignments[id]);let ko=0;const roles={};
   for(const type of ThrowTuning.directions){const f=makeFighter(0,0,id),original=movesFor(f)[type],a=ThrowTuning.move(f,type);roles[type]=a.throwRole;if(a.throwRole==='ko')ko++;
    check(id+'/'+type+' preserves source data',original.baseKnockback===4.8||original.baseKnockback==={backThrow:5,upThrow:4.6,downThrow:3.6}[type]);
    check(id+'/'+type+' bounded power',a.baseKnockback<=original.baseKnockback&&(a.throwRole==='ko'&&type==='upThrow'||a.knockbackGrowth<original.knockbackGrowth)&&a.damage<=original.damage);
    for(const weight of[65,90,130]){let prior=0;for(const percent of[0,60,100,160,240]){const launch=CombatData.launch(a,percent,0,weight);check(id+'/'+type+' finite/scaling '+weight+'/'+percent,Number.isFinite(launch.knockback)&&launch.knockback>=prior);prior=launch.knockback;}}
    for(const face of[-1,1]){let[f,o]=fresh(id,face,100);const launch=release(f,o,type);check(id+'/'+type+' real release '+face,!!launch&&!f.grabbed&&!o.grabOwner&&o.damage>100);if(!launch)continue;
     const expected=type==='backThrow'?-face:face;check(id+'/'+type+' release direction '+face,Math.sign(Math.cos(launch.angle))===expected&&Math.sin(launch.angle)<0);
     const old=CombatData.launch(original,100).knockback;check(id+'/'+type+' calibrated actual launch '+face,a.throwRole==='ko'&&type==='upThrow'?launch.speed>old:launch.speed<old,{speed:launch.speed,old});
     o.hitlag=1;CombatSystem.hitlag(o,emptyInput());check(id+'/'+type+' launch survives mash '+face,!!o.hitstun&&Number.isFinite(o.vx)&&Number.isFinite(o.vy));
     const vx=o.vx,vy=o.vy;PlayerController.stopLaunchOnPress(o,{jump:true,jab:true});check(id+'/'+type+' no stun cancel '+face,o.vx===vx&&o.vy===vy);
     if(a.throwRole==='combo'){while(f.hitlag)tick(f);for(let n=1;n<a.totalFrames;n++)tick(f);check(id+'/'+type+' followup window '+face,launch.hitstun>a.totalFrames&&a.totalFrames<original.totalFrames);}
    }
    // Full flight on a flat stage. No DI/escape input; these are diagnostics,
    // not guaranteed human-match KO percents. Compare exactly the same spots.
    for(const percent of[120,180])for(const edge of[false,true])for(const baseline of[true,false]){
     const face=type==='backThrow'?-1:1,x=edge?platforms[0].x+platforms[0].w-65:720,[f,o]=fresh(id,face,percent,x),launch=release(f,o,type,baseline);let side=null;
     for(let n=0;n<180;n++){if(o.respawn)break;tick(o);side=blastZoneSide(o)||side;}
     trajectories.push({id,type,role:a.throwRole,percent,edge,baseline,ko:!!o.respawn,side,speed:launch?.speed});
    }
   }
   check(id+' at most one KO direction',ko<=1);check(id+' differentiated throws',new Set(Object.values(roles)).size>=3);rows.push({id,group:ThrowTuning.assignments[id],roles});
   for(const face of[-1,1]){const[f,o]=fresh(id,face);attack(f,'ledge');const a=f.attack;
    check(id+' dedicated ledge '+face,a.ledgeStrike&&!a.special&&a.damage===7&&a.activeFrames.length===1&&a.totalFrames===44&&a.recoveryFrames===34);
    f.mode='LedgeAttack';f.timer=8;o.x=f.x+face*45;resolveCombat();const damage=o.damage;check(id+' ledge actually hits '+face,damage>0&&!!o.pendingLaunch);
    while(f.hitlag)tick(f);for(const t of[8,9,10]){f.timer=t;resolveCombat();}check(id+' ledge single hit '+face,o.damage===damage);
    check(id+' ledge modest high-percent power '+face,CombatData.launch(a,160).knockback<14);
    while(f.hitlag)tick(f);f.timer=11;for(let n=0;n<33;n++){tick(f);check(id+' ledge endlag '+face+'/'+n,f.attack?.ledgeStrike&&f.mode==='LedgeAttack');}tick(f);check(id+' ledge releases at FAF '+face,!f.attack&&f.mode==='Idle');
   }
  }
  const stats={};for(const baseline of[true,false])for(const percent of[120,180])for(const edge of[false,true]){const set=trajectories.filter(v=>v.baseline===baseline&&v.percent===percent&&v.edge===edge);stats[(baseline?'before':'after')+'/'+percent+'/'+(edge?'edge':'center')]={ko:set.filter(v=>v.ko).length,directBlast:set.filter(v=>v.ko&&v.side!=='bottom').length,unrecoveredFalls:set.filter(v=>v.ko&&v.side==='bottom').length,total:set.length};}
  check('up KO identity works',trajectories.some(v=>!v.baseline&&v.type==='upThrow'&&v.role==='ko'&&v.percent===180&&v.side==='top'));
  check('forward KO identity works',trajectories.some(v=>!v.baseline&&v.type==='forwardThrow'&&v.role==='ko'&&v.percent===180&&v.side==='right'));
  for(const percent of[120,180])for(const edge of['center','edge'])check('fewer overall throw KOs '+percent+'/'+edge,stats['after/'+percent+'/'+edge].ko<stats['before/'+percent+'/'+edge].ko,stats);
  return{forms:rows.length,checks,failed,rows,stats,trajectories};
 });
 fs.writeFileSync('.tools/throw-ledge-role-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({forms:result.forms,checks:result.checks,stats:result.stats,failed:result.failed,errors},null,2));assert.deepEqual(result.failed,[]);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
