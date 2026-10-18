'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.addInitScript(()=>navigator.getGamepads=()=>[]);await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await page.evaluate(()=>{
  state='pause';training=false;countdown=hitstop=0;setupStage('0');StageRules.oneOnOne=false;
  let checks=0,moves=0;const failed=[],flights=[],projectiles=[],check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});},close=(a,b)=>Math.abs(a-b)<1e-7;
  const types=['dair','bair','fair','uair','dashAttack'];
  for(const id of Object.keys(CharacterData))for(const type of types){
   const a=movesFor({characterId:id})[type];if(!a)continue;moves++;const signature=JSON.stringify(a);
   const windows=a.activeFrames.length?a.activeFrames:[{}];
   for(const w of windows){const s={...a,...w,type},k=AerialLaunchTuning.knockback(s),t=CombatSystem.launchTrajectory(s),link=AerialLaunchTuning.linking(s);
    check(id+'/'+type+' finite trajectory',[t.angle,t.horizontalScale,t.velocityScale].every(Number.isFinite));
    const oldMagnitude=Math.hypot(Math.cos(s.angle),Math.sin(s.angle)),newMagnitude=Math.hypot(Math.cos(t.angle)*t.horizontalScale,Math.sin(t.angle))*t.velocityScale;
    check(id+'/'+type+' no angular speed boost',close(oldMagnitude,newMagnitude));
    if(!link&&!AerialLaunchTuning.meteor(s)){
     const deg=Math.atan2(-Math.sin(t.angle),Math.abs(Math.cos(t.angle)*t.horizontalScale))*180/Math.PI;
     if(type==='dair'){check(id+' dair near vertical',deg>=72-1e-7,{deg});check(id+' dair reduced strength',k.baseKnockback<s.baseKnockback&&k.knockbackGrowth<s.knockbackGrowth);}
     if(type==='dashAttack')check(id+' dash launches diagonally up',deg>=50-1e-7,{deg});
     if(type==='fair'||type==='bair')check(id+'/'+type+' growth never reduced',k.knockbackGrowth>=s.knockbackGrowth&&k.baseKnockback>=s.baseKnockback);
    }
    if(link||AerialLaunchTuning.meteor(s))check(id+'/'+type+' linking/meteor retained',k===s&&t.angle===s.angle);
    for(const weight of[65,90,130]){let previous=0;for(const percent of[0,100,120,160,200,240]){const launch=CombatData.launch(s,percent,0,weight);check(id+'/'+type+' grows past 100% '+weight+'/'+percent,Number.isFinite(launch.knockback)&&launch.knockback>previous,{previous,speed:launch.knockback});previous=launch.knockback;}}
   }
   check(id+'/'+type+' authored move unchanged',JSON.stringify(a)===signature);
  }
  for(const type of['heavy','up','smash','upsmash','downsmash','air','rise','dragon','dash','gale']){const a={...CombatData.moves[type],type};check('unrelated '+type,AerialLaunchTuning.knockback(a)===a&&AerialLaunchTuning.trajectory(a,{angle:a.angle,horizontalScale:1,velocityScale:1})===null);}
  for(const type of types)for(const extra of[{fixedKnockback:18},{pull:true},{rehitRate:4},{rehitFrames:5},{cancel:{next:'jab2'}},{end:5,activeEnd:12},{damageOnly:true}]){const a={...CombatData.moves.fair,type,...extra};check('preserve linking '+type+'/'+JSON.stringify(extra),AerialLaunchTuning.knockback(a)===a&&AerialLaunchTuning.trajectory(a,{angle:a.angle,horizontalScale:1,velocityScale:1})===null);}
  for(const extra of[{isMeteor:true,angle:1.4},{angle:1.48}]){const a={...CombatData.moves.dair,type:'dair',...extra};check('meteor remains downward',AerialLaunchTuning.knockback(a)===a&&CombatSystem.launchTrajectory(a).angle===a.angle);}
  function pair(id,percent=100,face=1,y=400){for(const r of Object.values(NewcomerCore.registry))r.reset();BombermanRules.reset();SansRules.reset();fighters=[makeFighter(0,0,id),makeFighter(1,0,'tifa')];for(const f of fighters)Object.assign(f,{x:720,y,grounded:false,face,inv:0,intangible:0,respawn:0,vx:0,vy:0,stocks:99,control:'keyboard'});fighters[1].damage=percent;return fighters;}
  for(const id of['tifa','dragoon','ryofu','vivi','hayabusa','chiikawa'])for(const type of types)for(const face of[-1,1]){
   const[f,o]=pair(id,100,face),a=movesFor(f)[type],s={...a,...a.activeFrames.at(-1),type,staleMultiplier:1,charge:0,launchDirection:face};CombatSystem.hit(f,o,s);check(id+'/'+type+' real launch',!!o.pendingLaunch);if(!o.pendingLaunch)continue;
   const expectedDamage=s.damage;check(id+'/'+type+' damage retained',close(o.damage,100+expectedDamage));o.hitlag=1;CombatSystem.hitlag(o,emptyInput());
   const degree=Math.atan2(-o.vy,Math.abs(o.vx))*180/Math.PI;check(id+'/'+type+' left/right mirrored',o.vx*face>0);
   if(type==='dair'&&!AerialLaunchTuning.meteor(s))check(id+' real dair angle',degree>=72-1e-7,degree);if(type==='dashAttack')check(id+' real dash angle',degree>=50-1e-7,degree);
   const x=o.x;for(let n=0;n<30&&!o.respawn;n++){frame++;PlayerController.tick(o,emptyInput());}check(id+'/'+type+' finite real flight',[o.x,o.y,o.vx,o.vy].every(Number.isFinite));if(type==='dair'&&!AerialLaunchTuning.meteor(s))check(id+' limited dair side travel',Math.abs(o.x-x)<260,o.x-x);
  }
  for(const id of['tifa','dragoon','ryofu','vivi','hayabusa','chiikawa'])for(const percent of[0,100,120,160,200]){
   const[f,o]=pair(id,percent),a=movesFor(f).uair;CombatSystem.hit(f,o,{...a,...a.activeFrames.at(-1),type:'uair',staleMultiplier:1});const speed=o.pendingLaunch.speed;o.hitlag=1;CombatSystem.hitlag(o,emptyInput());let n=0;while(n++<180&&!o.respawn){frame++;PlayerController.tick(o,emptyInput());}flights.push({id,percent,speed,ko:!!o.respawn});if(percent===0)check(id+' no zero percent uair KO',!o.respawn);if(percent>=160)check(id+' uair can KO at high damage',!!o.respawn);
  }
  for(const[id,type]of[['metabee','uair'],['metabee','fair'],['sans','uair'],['sans','fair'],['bomberman','dair']]){
   const[f,o]=pair(id,120);const rules=id==='metabee'?MetabeeRules:id==='sans'?SansRules:BombermanRules;rules.reset();attack(f,type);f.timer=id==='sans'&&type==='uair'?3:f.attack.startupFrames;rules.action(f,emptyInput());const q=rules.objects[0];check(id+'/'+type+' projectile exists',!!q);if(!q)continue;
   if(id==='sans'){Object.assign(o,{x:q.x,y:q.y+30});}else Object.assign(o,{x:q.x,y:q.y+35});q.vx=q.vy=0;if(id==='bomberman')rules.burst(q);
   for(let n=0;n<10&&!o.pendingLaunch;n++)rules.tick();check(id+'/'+type+' actual projectile hit',!!o.pendingLaunch);if(o.pendingLaunch){const launch=o.pendingLaunch;o.hitlag=1;CombatSystem.hitlag(o,emptyInput());const degrees=Math.atan2(-o.vy,Math.abs(o.vx))*180/Math.PI;if(type==='uair')check(id+' projectile up angle',degrees>=69,{degrees});if(type==='dair')check(id+' projectile dair pop',degrees>=72-1e-7,{degrees});projectiles.push({id,type,degrees,speed:launch.speed});}
  }
  const meteors=[];for(const id of Object.keys(CharacterData)){const a=movesFor({characterId:id}).dair;if(!a?.meteorFrame)continue;const[f,o]=pair(id,100);attack(f,'dair');f.timer=a.meteorFrame;const b=attackBoxes(f)[0];if(!b)continue;Object.assign(o,{x:b.x2,y:b.y2+35,grounded:false});CombatSystem.resolve();check(id+' actual meteor remains finite/downward',o.pendingLaunch&&Number.isFinite(o.pendingLaunch.speed)&&Math.sin(o.pendingLaunch.angle)>0,o.pendingLaunch);meteors.push({id,speed:o.pendingLaunch?.speed});}
  const finishes=[];
  for(const id of['tifa','dragoon','vivi','hayabusa'])for(const type of['bair','fair'])for(const side of[-1,1])for(const percent of[0,120,160]){
   const[f,o]=pair(id,percent,type==='bair'?-side:side,350);f.x=side===1?1000:440;attack(f,type);f.timer=f.attack.activeStart;const b=attackBoxes(f).find(b=>!b.meleeInner)||attackBoxes(f)[0];Object.assign(o,{x:b.x2,y:b.y2+40,grounded:false});CombatSystem.resolve();check(id+'/'+type+' actual contact',!!o.pendingLaunch);if(!o.pendingLaunch)continue;o.hitlag=1;CombatSystem.hitlag(o,emptyInput());check(id+'/'+type+' contact sends away',o.vx*side>0);
   let n=0;while(n++<180&&!o.respawn){frame++;PlayerController.tick(o,emptyInput());}const zone=o.respawn?blastZoneSide(o):null;finishes.push({id,type,side,percent,zone});if(percent===0)check(id+'/'+type+' no zero percent lateral KO',zone!=='left'&&zone!=='right',zone);if(type==='bair'&&percent>=120)check(id+' bair is a lateral finisher',zone==='left'||zone==='right',zone);
  }
  const cpu=[];GameAudio.setMuted(true);for(const ids of[['tifa','dragoon'],['vivi','hayabusa']]){pair(ids[0],0);fighters[1]=makeFighter(1,0,ids[1]);for(const f of fighters)Object.assign(f,{x:650+f.id*160,y:560,grounded:true,control:'cpu',inv:0,stocks:99});state='battle';countdown=hitstop=0;matchTime=Infinity;for(let n=0;n<1800;n++)update(true);check('CPU finite '+ids.join('/'),fighters.every(f=>[f.x,f.y,f.vx,f.vy,f.damage].every(Number.isFinite)));check('CPU hits '+ids.join('/'),fighters.some(f=>f.stats.hits>0));cpu.push(fighters.map(f=>({id:f.characterId,hits:f.stats.hits})));state='pause';}
  for(const target of['fair','bair','uair','dashAttack']){const[f,o]=pair('tifa');PlayerStates.enter(o,'ShieldHold');const shield=o.shield;CombatSystem.hit(f,o,{...movesFor(f)[target],type:target});check(target+' guard stops damage',o.damage===100&&o.shield<shield&&!o.pendingLaunch);}
  return{moves,checks,failed,flights,projectiles,finishes,cpu,meteors};
 });fs.writeFileSync('.tools/aerial-launch-balance-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,failed:result.failed.slice(0,20),failedCount:result.failed.length,errors}));assert.equal(result.failed.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
