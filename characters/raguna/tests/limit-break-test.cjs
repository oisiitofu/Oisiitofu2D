'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const fighter=process.env.LIMIT_FIGHTER||'raguna';
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4181');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  assert.equal(await page.locator('#limit-break').isChecked(),true);
  await page.click('#enter-roster');
  await page.click('[data-library-scope="limit"]');
  const filtered=await page.locator('.fighter-card:visible').evaluateAll(cards=>cards.map(card=>card.dataset.id));
  assert.deepEqual(filtered,await page.evaluate(()=>Roster.selectable.filter(d=>LimitBreak.hasCinematic(d.id)).map(d=>d.id)));
  assert.ok(['dragoon','roxas'].every(id=>filtered.includes(id)));
  await page.click('[data-library-scope="all"]');
  await page.evaluate(async fighter=>{
   const players=Array.from({length:4},(_,n)=>({character:fighter,color:n,control:'primary'}));
   await start({artPrepared:true,participants:{players,format:'free',stocks:3,timeLimit:240,limitBreak:true},squads:{size:1},stage:'0'});
   countdown=0;simulationSpeed=0;acc=0;state='pause';
  },fighter);
  assert.equal(await page.evaluate(id=>LimitBreak.artPrepared([{character:id}],true)&&LimitBreak.enabled,fighter),true);
  if(["laharl","raguna"].includes(fighter))await page.evaluate(async()=>{GameAudio.unlock();await GameAudio.preload();});
  const results=await page.evaluate(fighter=>{
   const profile=LimitBreak.profile(fighter);
   const main=platforms.find(p=>p.main);
   const reset=(on,distance,damage=70)=>{
    LimitBreak.begin(on);countdown=hitstop=0;
    fighters.forEach((f,n)=>{
     Object.assign(f,{x:660+[0,distance,-280,320][n],y:main.y,face:n===0?1:-1,damage:n===1?damage:0,vx:0,vy:0,grounded:true,inv:0,intangible:0,hitlag:0,hitstun:0,pendingLaunch:null,frozen:null,attack:null,buffer:null,input:null,stocks:3,respawn:0,tumbling:false});
     PlayerStates.enter(f,'Idle');
    });
    return fighters;
   };
   const chord={...emptyInput(),shareStock:true,jab:true,special:true,attackHeld:true,specialHeld:true};
   const step=(f,raw=emptyInput())=>{frame++;updateFighter(f,raw);};
   const raise=f=>LimitBreak.charge(f,100);
   const check=(value,message)=>{if(!value)throw Error(message);};
   const limitButton=document.querySelector('#training-limit-max');
   training=true;LimitBreak.begin(true);limitButton.click();
   check(LimitBreak.ready(fighters[0]),'training button fills the selected supported fighter');
   training=false;
   let [a,b,c,d]=reset(false,65);
   raise(a);step(a,chord);check(!LimitBreak.ready(a)&&a.attack?.type!=='limitBreak','default OFF keeps existing attack');
   [a,b,c,d]=reset(true,65);
   step(a,chord);check(a.attack?.type!=='limitBreak','empty meter keeps normal inputs');
   [a,b,c,d]=reset(true,65);
   const chip={...movesFor(b).jab,damage:25,damageOnly:true,type:'jab',staleMultiplier:1};
   for(let n=0;n<3;n++)CombatSystem.hit(b,a,chip);
   check(!LimitBreak.ready(a)&&LimitBreak.meter(a).value===75,'meter charges from actual hits');
   CombatSystem.hit(b,a,chip);check(LimitBreak.ready(a),'meter caps at 100');
   step(a,{...emptyInput(),jab:true,attackHeld:true});step(a,chord);
   check(a.attack?.type==='limitBreak','slightly staggered input enters opener');
   check(LimitBreak.meter(a).value===0&&!LimitBreak.meter(a).used,'attempt spends gauge without using the match entitlement');
   for(let n=0;n<13&&!LimitBreak.active;n++){step(a);resolveCombat();}
   check(LimitBreak.active&&LimitBreak.scene.target===b&&LimitBreak.meter(a).used,'real capsule contact captures one victim and marks it used');
   const elapsed=frame,clock=matchTime,others=JSON.stringify([c,d]);
   render();check(!canvas.classList.contains('limit-cinematic'),'initial contact remains visible on the original stage');
   for(let n=0;n<profile.contactHold;n++)update(true);
   render();check(canvas.classList.contains('limit-cinematic'),'cut-in follows the contact freeze');
   for(let n=profile.contactHold+1;n<profile.duration;n++)update(true);
   check(frame===elapsed&&matchTime===clock&&JSON.stringify([c,d])===others,'cinematic freezes other players and clock');
   update(true);
   check(!LimitBreak.active&&b.damage===70+profile.finalStrike.damage+[...(profile.combo?.values()??[])].reduce((sum,hit)=>sum+hit,0)&&b.pendingLaunch,'finisher damage and launch once');
   check(JSON.stringify([c,d])===others,'finisher leaves third and fourth fighters alone');
   const launch={raw:b.pendingLaunch.raw,speed:b.pendingLaunch.speed,angle:b.pendingLaunch.angle};
   check(Math.sign(Math.cos(launch.angle))===(profile.finalStrike.reverseLaunch?-1:1),'right-facing release follows the authored direction');
   for(let n=0;n<140&&!b.respawn;n++)step(b);
   check(b.respawn>0&&blastZoneSide(b)===(profile.finalStrike.reverseLaunch?'left':'right'),'70% middleweight reaches the authored blast zone from center without DI');
   raise(a);check(!LimitBreak.ready(a),'remaining stocks cannot recharge');
   [a,b]=reset(true,-65);a.face=-1;b.face=1;raise(a);step(a,chord);
   for(let n=0;n<13&&!LimitBreak.active;n++){step(a);resolveCombat();}
   check(LimitBreak.active&&LimitBreak.scene.face===-1,'left-facing opener captures');
   for(let n=0;n<profile.duration;n++)update(true);
   const expectedDirection=profile.finalStrike.reverseLaunch?1:-1;
   check(Math.sign(Math.cos(b.pendingLaunch.angle))===expectedDirection,'left-facing release follows the authored direction');
   [a,b]=reset(true,430);raise(a);step(a,chord);
   for(let n=0;n<60;n++){step(a);resolveCombat();}
   check(!LimitBreak.active&&!LimitBreak.meter(a).used&&LimitBreak.meter(a).value===0,'miss spends only the gauge');
   for(let n=0;n<4;n++)CombatSystem.hit(b,a,chip);
   check(LimitBreak.ready(a),'real damage recharges the gauge after a whiff');
   step(a,chord);
   check(CombatSystem.protection(a).intangible,'opener is invulnerable from frame one');
   CombatSystem.hit(b,a,chip);
   check(a.damage===100&&LimitBreak.meter(a).value===0,'opener immunity prevents damage and charging');
   while(a.timer<22){step(a);resolveCombat();}
   b.x=a.x+135;
   step(a);resolveCombat();
   check(LimitBreak.active&&LimitBreak.scene.target===b,'wider opener reaches on the final active frame after a retry');
   [a,b]=reset(true,65);raise(a);PlayerStates.enter(b,'ShieldHold');step(a,chord);
   for(let n=0;n<24;n++){step(a);resolveCombat();}
   check(!LimitBreak.active&&b.damage===70&&b.shield<b.character.shieldHP,'shield blocks opener');
   check(!LimitBreak.meter(a).used,'guard preserves the match entitlement');
   [a,b]=reset(true,65);raise(a);b.inv=60;step(a,chord);
   for(let n=0;n<15;n++){step(a);resolveCombat();}
   check(!LimitBreak.active&&b.damage===70,'invincible victim is protected');
   [a,b]=reset(true,65);raise(a);step(a,chord);
   for(let n=0;n<13&&!LimitBreak.active;n++){step(a);resolveCombat();}
   if(["laharl","raguna"].includes(fighter)){const scene=LimitBreak.scene,original=state;state="battle";for(const [frame,name] of (fighter==="laharl"?[[52,"laharl-limit-blade"],[95,"laharl-limit-lift"],[144,"laharl-limit-rock"],[270,"laharl-limit-fist"],[334,"laharl-limit-impact"]]:[[57,"raguna-limit-shield"],[100,"raguna-limit-plant"],[145,"raguna-limit-sprout"],[271,"raguna-limit-fire"],[337,"raguna-limit-finish"]])){const previous=GameAudio.diagnostics.counts[name]||0;const cue=scene.profile.cues.get(frame);check(cue[0]===name,"cue at "+frame);GameAudio.cue(...cue,scene.attacker,{interval:0});check((GameAudio.diagnostics.counts[name]||0)===previous+1,"played "+name);}state=original;console.log("custom samples played");}
   return launch;
  },fighter);
  if(process.argv.includes('--review')){
   const directory='previews/'+fighter+'/limit-break';fs.mkdirSync(directory,{recursive:true});
   for(const frame of (fighter==="laharl"?[25,90,113,133,155,182,199,225,244,267,286,308,342,372,397,429]:[25,95,116,138,161,183,204,231,253,270,291,309,339,375,398,429])){
    await page.evaluate(t=>{LimitBreak.scene.time=Math.min(t,LimitBreak.scene.profile.duration-1);render();},frame);
    await page.locator('#game').screenshot({path:directory+'/'+frame+'.png'});
    await page.evaluate(()=>{LimitBreak.scene.face=-1;render();});
    await page.locator('#game').screenshot({path:directory+'/left-'+frame+'.png'});
    await page.evaluate(()=>{LimitBreak.scene.face=1;});
   }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,launch:results}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
