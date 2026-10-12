'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=[],errors=[];let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 for(let slot=0;slot<2;slot++){const context=await browser.newContext(),page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.stack));await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await page.click('#enter-online');}
 await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);
 await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown===0)));const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
 for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{
  window.rangedSnapshots={};window.rangedStarts={};window.rangedShots={};window.rangedInputs=0;let fixture=null,previous=null,seen=new Set();
  const fixtures=[['metalgreymon','dash',false],['nier','dragon',true],['metabee','dragon',true],['horse','dash',false],['moogle','dragon',false],['elma','gale',false]],rules=[...[...new Set(update.toString().match(/\b\w+Rules(?=\.tick\()/g))].map(n=>eval(n)),...Object.values(NewcomerCore.registry)];
  Controls.read=()=>fixture&&slot===0?{...emptyInput(),special:true,specialHeld:fixture[2],x:fixture[1]==='dash'?1:0,y:fixture[1]==='gale'?1:0}:fixture&&slot===1&&fixture[0]==='horse'?{...emptyInput(),guard:true}:emptyInput();
  addEventListener('online-frame',event=>{const n=event.detail-target;
   if(n>=0&&n<1080&&n%180===0){fixture=fixtures[n/180];setupStage('0');hitstop=0;fighters=[makeFighter(0,0,fixture[0]),makeFighter(1,1,'dragoon')];for(const r of rules)r.reset?.();for(const f of fighters)Object.assign(f,{x:f.id?740:500,y:560,grounded:true,face:f.id?-1:1,inv:0,stocks:99,control:'keyboard'});if(fixture[0]==='elma')fighters[0].ocgTime=900;previous=null;seen=new Set();rangedStarts[fixture[0]]=[];rangedShots[fixture[0]]=0;}
   if(n>=0&&n<=1080){const f=fighters[0];if(Net.inputs[0].special)rangedInputs++;if(n<1080){if(f.attack&&f.attack!==previous){previous=f.attack;if(f.attack.rangedInterval)rangedStarts[fixture[0]].push({frame:n,interval:f.attack.rangedInterval});}for(const q of NewcomerCore.registry[fixture[0]].objects)if(!seen.has(q.id)){seen.add(q.id);rangedShots[fixture[0]]++;}}
    if(n%10===0)rangedSnapshots[n]={fighters:fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,damage:f.damage,shield:f.shield,hitlag:f.hitlag,hitstun:f.hitstun,shieldStun:f.shieldStun,mode:f.mode,attack:f.attack?.type,timer:f.timer,ready:f.rangedReadyFrame})),objects:NewcomerCore.registry[f.characterId].objects.map(q=>({id:q.id,x:q.x,y:q.y,age:q.age,kind:q.kind}))};Net.capture();}
  });
 },{target,slot});
 await Promise.all(pages.map(p=>p.waitForFunction(()=>rangedSnapshots[1080],null,{timeout:60000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>({snapshots:rangedSnapshots,starts:rangedStarts,shots:rangedShots,inputFrames:rangedInputs}))));
 for(const [frame,snapshot]of Object.entries(all[0].snapshots))eq(all[1].snapshots[frame],snapshot);eq(all[1].starts,all[0].starts);eq(all[1].shots,all[0].shots);eq(all[0].inputFrames>900,true);
 for(const[id,starts]of Object.entries(all[0].starts)){eq(starts.length>=2,true);eq(starts.every((v,k)=>!k||v.frame-starts[k-1].frame>=v.interval),true);eq(all[0].shots[id]>0,true);}eq(errors,[]);
 fs.writeFileSync('.tools/projectile-online-results.json',JSON.stringify({checks,...all[0],errors},null,2));console.log(JSON.stringify({checks,matchingSnapshots:Object.keys(all[0].snapshots).length,inputFrames:all[0].inputFrames,starts:all[0].starts,shots:all[0].shots,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
