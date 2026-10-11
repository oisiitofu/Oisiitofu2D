'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{
  const pages=[],errors=[];
  for(const id of ['human','kitten']){
   const context=await browser.newContext(),page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.stack));
   await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:60000});
   await page.click('#enter-online');await page.click(`[data-id="${id}"]`);
  }
  await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);
  const code=await pages[0].evaluate(()=>Net.code);
  await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.slot===1);
  for(const page of pages)await page.evaluate(()=>{
   window.fastfallSnapshots={};
   addEventListener('online-frame',e=>{
    const t=e.detail,key=down=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code:'ArrowDown'}));
    if([185,217,245].includes(t)){
     for(const r of Object.values(NewcomerCore.registry))r.reset();
     fighters=[makeFighter(0,0,'human'),makeFighter(1,1,'kitten')];
     fighters.forEach((f,n)=>{
      Object.assign(f,{x:500+n*450,y:150,vy:.1,face:t===245?-1:1,grounded:false,inv:0,intangible:0,respawn:0,gravityStyle:t===245?2:0});
      PlayerStates.enter(f,'Fall');attack(f,t===217?(n?'rise':'dragon'):'air');
      if(t===217)f.fastFall=true;else f.timer=f.attack.activeStart-1;
     });
    }
    if([185,245].includes(t))key(true);
    if([205,265].includes(t))key(false);
    if([195,225,255].includes(t))fastfallSnapshots[t]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,fastFall:f.fastFall,style:f.gravityStyle,attack:f.attack?.type,mode:f.mode}));
   });
  });
  for(const page of pages)await page.click('#ready-room');
  await Promise.all(pages.map(p=>p.waitForFunction(()=>fastfallSnapshots[255],null,{timeout:20000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>fastfallSnapshots)));
  assert.deepEqual(snapshots[0],snapshots[1],'Both clients must apply the same aerial inputs and movement');
  for(const t of [195,255])for(const f of snapshots[0][t]){
   assert.equal(f.fastFall,true,`${f.id} falling aerial at ${t}`);assert.equal(f.attack,'air');assert(f.vy>3);
  }
  for(const f of snapshots[0][225])assert.equal(f.fastFall,false,`${f.id} special keeps authored flight`);
  assert.equal(snapshots[0][255][1].style,2);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({clients:2,characters:['human','kitten'],matchingSnapshots:3,aerialFastFall:true,specialFlightPreserved:true,kittenJupiterStyle:true,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
