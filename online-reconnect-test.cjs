'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

(async()=>{
 const browser=await chromium.launch({channel:'msedge',args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{
  const pages=[],errors=[];
  for(const name of ['Lickey','えだ']){
   const page=await(await browser.newContext()).newPage();pages.push(page);
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(()=>{
    window.WebSocket=class extends WebSocket{
     constructor(...args){super(...args);window.testSocket=this;}
    };
   });
   await page.goto(process.env.GAME_URL||'http://localhost:4173',{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>window.AstralEdge?.assetsLoaded,null,{polling:100,timeout:120000});
   if(!await page.locator('#online-room').evaluate(dialog=>dialog.open))await page.click('#enter-online');
   await page.click('[data-online-name="'+name+'"]');
  }
  const [host,guest]=pages;
  await host.click('#open-room-create');await host.click('#create-room');
  await host.waitForFunction(()=>Net.code.length===6);
  const code=await host.evaluate(()=>Net.code);
  await guest.click('.room-code-entry summary');await guest.fill('#room-code',code);await guest.click('#join-room');
  await guest.waitForFunction(()=>Net.code.length===6);
  await host.click('#open-room');await host.click('#ready-room');
  await host.waitForFunction(()=>document.querySelector('#ready-room').textContent.includes('待っています'));
  await host.click('#edit-online-lineup');
  const stage=await host.locator('#stage').inputValue();
  await host.click('.stage-card[data-stage="'+stage+'"]');
  await host.click('#open-room');
  assert.match(await host.locator('#ready-room').textContent(),/待っています/);
  await host.click('#edit-online-lineup');
  await host.click('.stage-card[data-stage="'+(stage==='0'?'1':'0')+'"]');
  await host.waitForFunction(()=>document.querySelector('#roster-online-status').textContent.includes('準備解除 · ステージの希望を変更'));
  await guest.click('#open-room');
  await guest.locator('.room-ready-reason').getByText('準備解除 · ステージの希望を変更').waitFor();
  for(const page of pages){
   if(!await page.locator('#online-room').evaluate(dialog=>dialog.open))await page.click('#open-room');
   await page.click('#ready-room');
  }
  await Promise.all(pages.map(page=>page.waitForFunction(()=>Net.active&&countdown===0)));
  for(const page of pages)await page.evaluate(()=>{
   window.beforeReconnect={round,slot:Net.slot,code:Net.code,matchId:Net.config.matchId};
   window.reconnectFrames=[];
   addEventListener('online-frame',event=>{
    reconnectFrames.push([event.detail,matchTime,fighters.map(f=>[f.x,f.y,f.damage,f.stocks])]);
   });
  });
  await guest.evaluate(()=>testSocket.close(4001,'Test interruption'));
  await host.waitForFunction(()=>document.querySelector('#network-wait b').textContent.includes('相手の再接続'));
  await guest.waitForFunction(()=>document.querySelector('#network-wait b').textContent.includes('再接続しています'));
  await guest.waitForFunction(()=>document.querySelector('#network-wait').classList.contains('hidden'));
  const resumeFrame=await guest.evaluate(()=>Net.quality.appliedFrames);
  await Promise.all(pages.map(page=>page.waitForFunction(f=>Net.quality.appliedFrames>=f+15,resumeFrame)));
  const results=await Promise.all(pages.map(page=>page.evaluate(()=>({
   before:beforeReconnect,after:{round,slot:Net.slot,code:Net.code,matchId:Net.config.matchId},frames:reconnectFrames
  }))));
  for(const {before,after,frames} of results){
   assert.deepEqual(before,after);
   for(let i=1;i<frames.length;i++)assert.equal(frames[i][0],frames[i-1][0]+1);
  }
  const hostFrames=new Map(results[0].frames.map(packet=>[packet[0],packet]));
  const common=results[1].frames.filter(packet=>hostFrames.has(packet[0]));
  assert(common.length>=15);
  for(const packet of common)assert.deepEqual(hostFrames.get(packet[0]),packet);
  await host.evaluate(()=>Net.leave());
  await guest.waitForFunction(()=>!Net.code&&!Net.active);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({sameRoomAndMatch:true,matchingFrames:common.length,explicitLeaveEndsSession:true,stageChangeReasonVisible:true}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
