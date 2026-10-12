'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=[],errors=[],records=[];let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 for(let n=0;n<2;n++){
  const context=await browser.newContext(),p=await context.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.stack));
  await p.addInitScript(()=>{window.connections=[];const Base=WebSocket;window.WebSocket=class extends Base{constructor(...args){super(...args);connections.push(this);}};});
  await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await p.click('#enter-online');
  await p.evaluate(()=>{
   window.rounds={};addEventListener('online-frame',event=>{
    const t=event.detail,c=Net.config,id=c.matchId,record=rounds[id]??=( {size:c.squadSize,time:c.timeLimit,characters:c.players.map(p=>p.character),snapshots:{}} );
    if([185,345,505,665,825].includes(t)){
     const f=fighters[1];f.inv=f.intangible=f.hitlag=0;f.respawn=0;if(c.squadSize===1)f.stocks=1;f.x=StageRules.blast.right+20;ko(f);
    }
    if([1,184,325,485,645,805,845].includes(t))record.snapshots[t]={time:matchTime,config:Net.config,players:fighters.map(f=>({id:f.id,character:f.characterId,squad:f.squad,index:f.squadIndex,x:f.x,y:f.y,stocks:f.stocks,mode:f.mode,team:f.team}))};
   });
  });
 }
 const [host,guest]=pages;await host.click('#open-room');await host.click('#create-room');await host.waitForFunction(()=>Net.code.length===6);const code=await host.evaluate(()=>Net.code);
 await guest.click('#open-room');await guest.fill('#room-code',code);await guest.click('#join-room');await guest.waitForFunction(()=>Net.code.length===6);
 async function ready(){for(const p of pages){await p.evaluate(()=>{if(!document.querySelector('#online-room').open)document.querySelector('#online-room').showModal();});await p.click('#ready-room');}}
 async function results(id){await Promise.all(pages.map(p=>p.waitForFunction(id=>state==='result'&&rounds[id],id,{timeout:35000})));const all=await Promise.all(pages.map(p=>p.evaluate(id=>rounds[id],id)));eq(all[0],all[1]);records.push(all[0]);for(const p of pages)eq(await p.evaluate(()=>Net.code),code);}
 async function select(){for(const p of pages){await p.click('#result .back');eq(await p.evaluate(()=>state),'menu');eq(await p.evaluate(()=>connections.length),1);}}
 await host.evaluate(()=>loaded=false);await ready();eq(await host.evaluate(()=>Net.active),false);await host.evaluate(()=>loaded=true);await results(1);await select();
 for(const size of [3,5]){
  await host.click('#open-match-settings');await host.selectOption('#squad-size',String(size));await host.selectOption('#time-limit',size===3?'120':'0');await host.click('#close-match-settings');
  await guest.waitForFunction(size=>SquadBattle.size()===size,size);eq(await guest.locator('#time-limit').inputValue(),size===3?'120':'0');eq(await guest.locator('#time-limit').isDisabled(),true);eq(await guest.locator('#squad-size').isDisabled(),true);
  const teams=[['tifa','shizuna','chocobo','kisuke','dragoon'],['isaac','chiikawa','rean','saki','hanajs']];
  for(let n=0;n<2;n++)for(let slot=0;slot<size;slot++){await pages[n].click(`#squad-lineup [data-slot="${slot}"]`);await pages[n].click(`[data-id="${teams[n][slot]}"]`);}
  await ready();await results(size===3?2:3);
  const r=records.at(-1);eq(r.size,size);eq(r.characters,[teams[0][0],teams[1][0]]);eq(r.snapshots[1].players.map(f=>f.stocks),[size,size]);eq(r.snapshots[325].players[1].character,teams[1][1]);eq(r.snapshots[485].players[1].character,teams[1][2]);eq(r.snapshots[325].players[0].stocks,size);
  if(size===5){eq(r.snapshots[645].players[1].character,teams[1][3]);eq(r.snapshots[805].players[1].character,teams[1][4]);eq(r.snapshots[325].time,Infinity);}
  await select();
 }
 // A character edit revokes ready; changing host rules revokes everyone's ready.
 await guest.click('#open-room');await guest.click('#ready-room');await guest.click('#close-room');await guest.click('[data-id="tifa"]');await host.waitForFunction(()=>document.querySelectorAll('#room-players .room-player')[1].textContent.includes('キャラ選択中'));checks++;
 // Colors and the horizontal stage strip also invalidate an earlier ready.
 for(const selector of ['#swatches button:nth-child(3)','.stage-card[data-stage="1"]']){
  await guest.click('#open-room');await guest.click('#ready-room');await host.waitForFunction(()=>document.querySelectorAll('#room-players .room-player')[1].textContent.includes('準備完了'));await guest.click('#close-room');await guest.click(selector);await host.waitForFunction(()=>document.querySelectorAll('#room-players .room-player')[1].textContent.includes('キャラ選択中'));checks++;
 }
 // Same-character rematch uses the existing connection as well.
 await ready();await results(4);for(const p of pages)eq(await p.evaluate(()=>connections.length),1);
 for(const p of pages)await p.click('#result .restart');await results(5);eq(records[4].characters,records[3].characters);for(const p of pages)eq(await p.evaluate(()=>connections.length),1);
 eq(errors,[]);fs.writeFileSync('.tools/online-rematch-squad-report.json',JSON.stringify({checks,records,errors},null,2));console.log(JSON.stringify({checks,rounds:records.length,sameRoom:code,squads:[3,5],errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
