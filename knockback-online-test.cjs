'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=[],errors=[];let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 for(let slot=0;slot<2;slot++){
  const context=await browser.newContext(),page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(process.env.GAME_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:180000});
  if(!await page.locator('#online-room').evaluate(dialog=>dialog.open))await page.click('#enter-online');
  await page.click('[data-online-name="'+(slot?'えだ':'Lickey')+'"]');
 }
 const [host,guest]=pages;
 await host.click('#open-room-create');await host.click('#create-room');await host.waitForFunction(()=>Net.code.length===6);
 const code=await host.evaluate(()=>Net.code);
 await guest.click('.room-code-entry summary');await guest.fill('#room-code',code);await guest.click('#join-room');await guest.waitForFunction(()=>Net.code.length===6);
 for(const page of pages)if(!await page.locator('#online-room').evaluate(dialog=>dialog.open))await page.click('#open-room');
 await host.click('#ready-room');await guest.click('#ready-room');
 await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown===0,null,{timeout:120000})));
 await Promise.all(pages.map(p=>p.evaluate(async()=>{
  const participants=['dragoon','shizuna'].map(character=>({character,color:0}));
  await ArtLoader.prepare(participants);
  ArtLoader.retain(participants);
 })));
 const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
 for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{
  window.launchSnapshots={};window.launchInputs=0;let mash=false;Controls.read=()=>({...emptyInput(),jab:slot===1&&mash});
  addEventListener('online-frame',event=>{const n=event.detail-target;
   if([0,70,140].includes(n)){
    setupStage(n===70?'1':'0');hitstop=0;for(const r of Object.values(NewcomerCore.registry))r.reset();fighters=[makeFighter(0,0,'dragoon'),makeFighter(1,1,n===70?'shizuna':'dragoon')];const[a,f]=fighters,main=platforms.find(p=>p.main),side=n===70?-1:1;
    Object.assign(a,{x:720,y:main.y,grounded:true,inv:0,damage:0,stocks:99,control:'keyboard'});Object.assign(f,{x:n===140?720:side<0?main.x+35:main.x+main.w-35,y:main.y,grounded:true,inv:0,damage:120,stocks:99,control:'keyboard'});a.x=f.x-side*200;
    hit(a,f,{...movesFor(a)[n===140?'heavy':'smash'],type:n===140?'heavy':'smash',fixedKnockback:100,angle:n===140?0:-.45,launchDirection:side});mash=true;
   }
   if(n>=0&&n<=210){if(Net.inputs[1].jab)launchInputs++;if(n%5===0)launchSnapshots[n]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,hitlag:f.hitlag,hitstun:f.hitstun,grounded:f.grounded,mode:f.mode,attack:f.attack?.type,pending:f.pendingLaunch,stocks:f.stocks}));Net.capture();}
  });
 },{target,slot});
 await host.bringToFront();
 try{
  await Promise.all(pages.map(p=>p.waitForFunction(()=>launchSnapshots[210],null,{polling:100,timeout:30000})));
 }catch(error){
  console.error({target,errors,peers:await Promise.all(pages.map(p=>p.evaluate(()=>({frame,state,active:Net.active,samples:Object.keys(launchSnapshots)}))))});
  throw error;
 }
 const all=await Promise.all(pages.map(p=>p.evaluate(()=>({snapshots:launchSnapshots,mashFrames:launchInputs}))));
 for(const [frame,snapshot]of Object.entries(all[0].snapshots))eq(all[1].snapshots[frame],snapshot);eq(all[0].mashFrames>100,true);eq(all[1].mashFrames,all[0].mashFrames);
 const right=all[0].snapshots[25][1],left=all[0].snapshots[95][1],flat=all[0].snapshots[165][1],action=all[0].snapshots[210][1];eq(right.x>1200&&right.vx>0&&right.hitstun>0&&!right.grounded,true);eq(left.x<160&&left.vx<0&&left.hitstun>0&&!left.grounded,true);eq(flat.x>800&&flat.hitstun>0&&flat.mode!=='Knockdown',true);eq(Math.abs(action.vx)<1&&!!action.attack,true);eq(errors,[]);
 fs.writeFileSync('.tools/knockback-online-results.json',JSON.stringify({checks,...all[0],errors},null,2));console.log(JSON.stringify({checks,matchingSnapshots:Object.keys(all[0].snapshots).length,mashFrames:all[0].mashFrames,stunKeepsLaunch:true,leftAndRightExit:true,actionableCancel:true,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
