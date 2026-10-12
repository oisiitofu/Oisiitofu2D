'use strict';
require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});

const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=[],errors=[];
 for(let slot=0;slot<2;slot++){const context=await browser.newContext(),page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:60000});await page.click('#enter-online');await page.click('[data-id="midna"]');}
 await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.slot===1);
 for(const page of pages)await page.evaluate(()=>{
  window.midnaWarpSnapshots={};const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
  addEventListener('online-frame',e=>{
   const t=e.detail;
   if([185,245,305].includes(t)){
    setupStage('0');fighters=[makeFighter(0,0,'midna'),makeFighter(1,1,'midna')];MidnaRules.reset();
    fighters.forEach((f,n)=>{const air=t===305,p=platforms[n?2:1];Object.assign(f,{x:air?(n?1300:140):t===245?p.x+p.w/2:500+n*440,y:air?690:t===245?p.y:560,grounded:!air,vx:0,vy:0,inv:0,intangible:0,respawn:0,face:n?-1:1,ledgeCooldown:100});PlayerStates.enter(f,air?'Fall':'Idle');});
    key('ArrowUp',true);key('KeyX',true);
   }
   if([190,250,310].includes(t))key('KeyX',false);
   if(t===310)key(Net.slot?'ArrowLeft':'ArrowRight',true);
   if([210,270,330].includes(t)){key('ArrowUp',false);key('ArrowLeft',false);key('ArrowRight',false);}
   if([203,218,263,278,323,338].includes(t))midnaWarpSnapshots[t]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,grounded:f.grounded,recovered:f.recovered,mode:f.mode,attack:f.attack?.type,timer:f.timer,intangible:CombatSystem.protection(f).intangible}));
  });
 });
 for(const page of pages)await page.click('#ready-room');await Promise.all(pages.map(page=>page.waitForFunction(()=>midnaWarpSnapshots[338],null,{timeout:25000})));
 const snapshots=await Promise.all(pages.map(page=>page.evaluate(()=>midnaWarpSnapshots)));assert.deepEqual(snapshots[0],snapshots[1],'Both clients must agree on grounding, disappearance and warp destination');
 for(const t of [203,263,323])for(const f of snapshots[0][t]){assert.equal(f.attack,'rise','Warp must survive disappearance at '+t);assert(f.intangible);}
 for(const [t,maxY]of [[218,400],[278,250],[338,600]])for(const f of snapshots[0][t]){assert.equal(f.attack,'rise');assert(f.y<maxY);assert(!f.grounded&&f.recovered);}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({clients:2,matchingSnapshots:6,mainFloorWarp:true,floatingPlatformWarp:true,airRecovery:true,realKeyboardInputs:true,errors},null,2));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
