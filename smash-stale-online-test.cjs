'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const fighter=process.env.LIMIT_FIGHTER||'dragoon';
const evolutionStage=Number(process.env.LIMIT_EVOLUTION_STAGE||0);
assert.ok(evolutionStage===0||fighter==='agumon'&&Number.isInteger(evolutionStage)&&evolutionStage>=1&&evolutionStage<=4);
(async()=>{
 const browser=await chromium.launch({channel:'msedge',args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 const pages=[],errors=[];
 try{
  for(let n=0;n<2;n++){
   const page=await(await browser.newContext()).newPage();pages.push(page);
   page.setDefaultTimeout(25000);page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.GAME_URL||'http://localhost:4181');
   await page.waitForFunction(()=>AstralEdge.assetsLoaded);
   await page.click('#enter-online');
  }
  const [host,guest]=pages;
  await host.click('#open-room-create');assert.equal(await host.locator('#create-limit-break').isChecked(),true);
  await host.check('#create-limit-break');await host.click('#create-room');
  await host.waitForFunction(()=>Net.code.length===6);
  const code=await host.evaluate(()=>Net.code);
  await guest.click('.join-listed-room[data-code="'+code+'"]');
  for(const page of pages){
   await page.waitForFunction(()=>Net.code.length===6&&document.querySelector('#limit-break').checked);
   await page.click('[data-id="'+fighter+'"]');
   await page.click('#open-room');
   await page.click('#ready-room');
  }
  await Promise.all(pages.map(page=>page.waitForFunction(id=>Net.active&&countdown===0&&LimitBreak.artPrepared([{character:id}],true),fighter)));


  const moment=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
  for(const p of pages)await p.evaluate(moment=>{window.smashSync={};addEventListener('online-frame',e=>{const n=e.detail-moment;
   if(n>=0&&n<=300&&n%30===0){const prior=n?fighters[1].damage:120,queue=n?fighters[0].staleQueue:[];fighters=[makeFighter(0,0,'dragoon'),makeFighter(1,1,'dragoon')];hitstop=0;fighters.forEach((f,k)=>{Object.assign(f,{x:680+k*40,y:560,vx:0,vy:0,grounded:true,inv:0,intangible:0,hitlag:0,hitstun:0,attack:null,respawn:0,stocks:99});PlayerStates.enter(f,'Idle');});fighters[0].staleQueue=queue;fighters[1].damage=prior;attack(fighters[0],'upsmash');fighters[0].timer=fighters[0].attack.activeStart;resolveCombat();}
   if(n>=0&&n<=325)smashSync[n]=fighters.map(f=>[f.damage,f.x,f.y,f.vx,f.vy,f.pendingLaunch?.speed??null,f.hitstun,f.hitlag,...f.staleQueue]);
  });},moment);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>smashSync[325])));const frames=await Promise.all(pages.map(p=>p.evaluate(()=>smashSync)));assert.deepEqual(frames[0],frames[1]);assert.deepEqual(errors,[]);console.log(JSON.stringify({matchingFrames:Object.keys(frames[0]).length,repeatedUpSmash:true,errors}));
 }finally{for(const p of pages)await p.evaluate(()=>Net.leave()).catch(()=>{});await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
