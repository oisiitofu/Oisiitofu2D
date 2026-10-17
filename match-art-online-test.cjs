'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{
  const pages=[],errors=[];for(let n=0;n<2;n++){
   const p=await(await browser.newContext({viewport:{width:1440,height:1000}})).newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.stack));
   await p.addInitScript(()=>{navigator.getGamepads=()=>[];});await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-online');
   await p.evaluate(()=>{window.artRounds={};addEventListener('online-frame',e=>{const c=Net.config,r=artRounds[c.matchId]??={snapshots:{}};
    if(e.detail===1){r.resident=ArtLoader.diagnostics.resident.slice().sort();r.ready=ArtLoader.prepared(matchArtPlayers(c));}
    if([1,185,215,245].includes(e.detail))r.snapshots[e.detail]=fighters.map(f=>({character:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,stocks:f.stocks}));
    if(e.detail===250){fighters[1].stocks=1;fighters[1].respawn=0;fighters[1].x=StageRules.blast.right+20;ko(fighters[1]);}
   });});
  }
  await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);
  await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);
  const records=[];
  for(const [round,characters]of [['1',['tifa','battlemage']],['2',['agumon','hanajs']]]){
   for(let n=0;n<2;n++)await pages[n].evaluate(({character,n})=>{Roster.closePanels();Roster.chooseForSlot(character);document.querySelector('#stage').value=n?'2':'0';}, {character:characters[n],n});
   // One peer deliberately holds its load acknowledgement. No simulation frames
   // may arrive until the real preparation and this peer's acknowledgement finish.
   if(round==='1')await pages[1].evaluate(()=>{const prepare=ArtLoader.prepare;ArtLoader.prepare=async players=>{await prepare(players);await new Promise(r=>setTimeout(r,600));};});
   for(const p of pages)await p.evaluate(()=>Net.ready());
   await Promise.all(pages.map(p=>p.waitForFunction(round=>state==='result'&&artRounds[round]?.snapshots[245],round,{timeout:30000})));
   const rows=await Promise.all(pages.map(p=>p.evaluate(round=>artRounds[round],round)));assert.deepEqual(rows[0],rows[1]);assert.equal(rows[0].ready,true);assert.deepEqual(rows[0].snapshots[1].map(f=>f.character),characters);records.push(rows[0]);
   for(const p of pages){await p.bringToFront();await p.click('#result .back');assert.equal(await p.evaluate(()=>Net.code),code);}
  }
  assert.deepEqual(records[0].resident,['battlemage','tifa']);assert.deepEqual(records[1].resident,['agumon','greymon','hanajd','hanajk','hanajs','metalgreymon','omegamon','wargreymon']);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({rounds:2,matchingSnapshots:8,sameRoom:true,preloadedAndReleased:true,delayedPeer:true,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
