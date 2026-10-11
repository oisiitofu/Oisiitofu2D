'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=[],errors=[];for(const id of ['isaac','rex']){const context=await b.newContext(),p=await context.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:60000});await p.click('#enter-online');await p.click(`[data-id="${id}"]`);}
 await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);
 await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.slot===1);
 for(const p of pages)await p.evaluate(()=>{window.linkSnapshots={};addEventListener('online-frame',e=>{
  if([185,270].includes(e.detail)){const attacker=e.detail===185?0:1;window.linkExpectedDamage=70+10*1.05*(StageRules.oneOnOne?1.2:1);fighters=[makeFighter(0,0,'isaac'),makeFighter(1,1,'rex')];fighters.forEach((f,n)=>{Object.assign(f,{x:700+n*40,y:50,face:n?-1:1,grounded:false,inv:0,intangible:0,respawn:0,damage:n===attacker?0:70});PlayerStates.enter(f,'Fall');});attack(fighters[attacker],'air');}
  if([230,315].includes(e.detail))linkSnapshots[e.detail]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,damage:f.damage,hits:f.stats.hits,attack:f.attack?.type,hitlag:f.hitlag,mode:f.mode}));
 });});
 await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>linkSnapshots[315],null,{timeout:20000})));
 const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>({frames:linkSnapshots,expected:linkExpectedDamage}))));assert.deepEqual(snapshots[0],snapshots[1],'Clients must resolve both links identically');
 for(const [frame,attacker]of [[230,0],[315,1]]){const pair=snapshots[0].frames[frame];assert.equal(pair[attacker].hits,2,`${pair[attacker].id} online hits`);assert(Math.abs(pair[1-attacker].damage-snapshots[0].expected)<1e-7,'Original 3+7 damage, including match rules/freshness');}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({clients:2,characters:['isaac','rex'],linkedHits:[2,2],matchingSnapshots:true,errors},null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
