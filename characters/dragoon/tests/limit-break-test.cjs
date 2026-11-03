'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4181');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  assert.equal(await page.locator('#limit-break').isChecked(),false);
  await page.click('#enter-roster');
  await page.evaluate(async()=>{
   const players=Array.from({length:4},(_,n)=>({character:'dragoon',color:n,control:'primary'}));
   await start({artPrepared:true,participants:{players,format:'free',stocks:3,timeLimit:240,limitBreak:true},squads:{size:1},stage:'0'});
   countdown=0;simulationSpeed=0;acc=0;state='pause';
  });
  assert.equal(await page.evaluate(()=>DragoonLimitVFX.prepared&&DragoonLimit.enabled),true);
  const results=await page.evaluate(()=>{
   const main=platforms.find(p=>p.main);
   const reset=(on,distance,damage=70)=>{
    DragoonLimit.begin(on);countdown=hitstop=0;
    fighters.forEach((f,n)=>{
     Object.assign(f,{x:660+[0,distance,-280,320][n],y:main.y,face:n===0?1:-1,damage:n===1?damage:0,vx:0,vy:0,grounded:true,inv:0,intangible:0,hitlag:0,hitstun:0,pendingLaunch:null,frozen:null,attack:null,buffer:null,input:null,stocks:3,respawn:0,tumbling:false});
     PlayerStates.enter(f,'Idle');
    });
    return fighters;
   };
   const chord={...emptyInput(),shareStock:true,jab:true,special:true,attackHeld:true,specialHeld:true};
   const step=(f,raw=emptyInput())=>{frame++;updateFighter(f,raw);};
   const raise=f=>DragoonLimit.charge(f,100);
   const check=(value,message)=>{if(!value)throw Error(message);};
   let [a,b,c,d]=reset(false,65);
   raise(a);step(a,chord);check(!DragoonLimit.ready(a)&&a.attack?.type!=='limitBreak','default OFF keeps existing attack');
   [a,b,c,d]=reset(true,65);
   step(a,chord);check(a.attack?.type!=='limitBreak','empty meter keeps normal inputs');
   [a,b,c,d]=reset(true,65);
   const chip={...movesFor(b).jab,damage:25,damageOnly:true,type:'jab',staleMultiplier:1};
   for(let n=0;n<3;n++)CombatSystem.hit(b,a,chip);
   check(!DragoonLimit.ready(a)&&DragoonLimit.meter(a).value===75,'meter charges from actual hits');
   CombatSystem.hit(b,a,chip);check(DragoonLimit.ready(a),'meter caps at 100');
   step(a,{...emptyInput(),jab:true,attackHeld:true});step(a,chord);
   check(a.attack?.type==='limitBreak','slightly staggered input enters opener');
   check(DragoonLimit.meter(a).used&&!DragoonLimit.ready(a),'attempt consumes meter once');
   for(let n=0;n<13&&!DragoonLimit.active;n++){step(a);resolveCombat();}
   check(DragoonLimit.active&&DragoonLimit.scene.target===b,'real capsule contact captures one victim');
   const elapsed=frame,clock=matchTime,others=JSON.stringify([c,d]);
   for(let n=0;n<233;n++)update(true);
   check(frame===elapsed&&matchTime===clock&&JSON.stringify([c,d])===others,'cinematic freezes other players and clock');
   update(true);
   check(!DragoonLimit.active&&b.damage===98&&b.pendingLaunch,'finisher damage and launch once');
   check(JSON.stringify([c,d])===others,'finisher leaves third and fourth fighters alone');
   const launch={raw:b.pendingLaunch.raw,speed:b.pendingLaunch.speed};
   for(let n=0;n<140&&!b.respawn;n++)step(b);
   check(b.respawn>0&&blastZoneSide(b)==='right','70% middleweight reaches the side blast zone from center without DI');
   raise(a);check(!DragoonLimit.ready(a),'remaining stocks cannot recharge');
   [a,b]=reset(true,430);raise(a);step(a,chord);
   for(let n=0;n<60;n++){step(a);resolveCombat();}
   check(!DragoonLimit.active&&DragoonLimit.meter(a).used,'miss does not start a movie');
   [a,b]=reset(true,65);raise(a);PlayerStates.enter(b,'ShieldHold');step(a,chord);
   for(let n=0;n<15;n++){step(a);resolveCombat();}
   check(!DragoonLimit.active&&b.damage===70&&b.shield<b.character.shieldHP,'shield blocks opener');
   [a,b]=reset(true,65);raise(a);b.inv=60;step(a,chord);
   for(let n=0;n<15;n++){step(a);resolveCombat();}
   check(!DragoonLimit.active&&b.damage===70,'invincible victim is protected');
   [a,b]=reset(true,65);raise(a);step(a,chord);
   for(let n=0;n<13&&!DragoonLimit.active;n++){step(a);resolveCombat();}
   return launch;
  });
  if(process.argv.includes('--review')){
   fs.mkdirSync('characters/dragoon/previews/limit-break',{recursive:true});
   for(const frame of [16,37,95,112,148,188,205,217]){
    await page.evaluate(t=>{DragoonLimit.scene.time=t;render();},frame);
    await page.locator('#game').screenshot({path:'characters/dragoon/previews/limit-break/'+frame+'.png'});
   }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,launch:results}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
