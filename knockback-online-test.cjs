'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=[],errors=[];let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 for(let slot=0;slot<2;slot++){const context=await browser.newContext(),page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.stack));await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await page.click('#enter-online');}
 await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);
 await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown===0)));const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
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
 await Promise.all(pages.map(p=>p.waitForFunction(()=>launchSnapshots[210],null,{timeout:30000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>({snapshots:launchSnapshots,mashFrames:launchInputs}))));
 for(const [frame,snapshot]of Object.entries(all[0].snapshots))eq(all[1].snapshots[frame],snapshot);eq(all[0].mashFrames>100,true);eq(all[1].mashFrames,all[0].mashFrames);
 const right=all[0].snapshots[25][1],left=all[0].snapshots[95][1],flat=all[0].snapshots[165][1],action=all[0].snapshots[210][1];eq(right.x>1200&&right.vx>0&&right.hitstun>0&&!right.grounded,true);eq(left.x<160&&left.vx<0&&left.hitstun>0&&!left.grounded,true);eq(flat.x>800&&flat.hitstun>0&&flat.mode!=='Knockdown',true);eq(Math.abs(action.vx)<1&&!!action.attack,true);eq(errors,[]);
 fs.writeFileSync('.tools/knockback-online-results.json',JSON.stringify({checks,...all[0],errors},null,2));console.log(JSON.stringify({checks,matchingSnapshots:Object.keys(all[0].snapshots).length,mashFrames:all[0].mashFrames,stunKeepsLaunch:true,leftAndRightExit:true,actionableCancel:true,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
