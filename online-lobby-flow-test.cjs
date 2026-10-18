'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});const pages=[],errors=[];let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 const base=process.env.GAME_URL||'http://localhost:4173';
 try{
  for(let n=0;n<4;n++){
   const p=await(await browser.newContext({viewport:{width:1440,height:900}})).newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.stack));
   await p.addInitScript(()=>{navigator.getGamepads=()=>[];window.connections=[];window.messages=[];const WS=WebSocket;window.WebSocket=class extends WS{constructor(...args){super(...args);connections.push(this);this.addEventListener('message',e=>messages.push(JSON.parse(e.data)));}};});
   await p.goto(base);await p.waitForFunction(()=>AstralEdge.assetsLoaded);eq(await p.locator('#enter-squad').count(),0);await p.click('#enter-online');await p.waitForFunction(()=>messages.some(m=>m.type==='rooms'));eq(await p.locator('#online-room').isVisible(),true);eq(await p.locator('#character-screen').isVisible(),false);
  }
  const [host,...guests]=pages;await host.click('#open-room-create');await host.selectOption('#create-battle-format','teams');await host.selectOption('#create-squad-size','3');await host.selectOption('#create-time-limit','120');await host.selectOption('#create-team-attack','off');
  await host.screenshot({path:'previews/lobby-create-desktop.png'});await host.click('#create-room');await host.waitForFunction(()=>Net.code.length===6);const code=await host.evaluate(()=>Net.code);eq(await host.locator('#online-room').isVisible(),false);eq(await host.locator('#character-screen').isVisible(),true);
  for(let n=0;n<3;n++){const p=guests[n];await p.waitForFunction(code=>document.querySelector('.join-listed-room[data-code="'+code+'"]'),code);await p.click('.join-listed-room[data-code="'+code+'"]');await p.waitForFunction(()=>Net.code.length===6);eq(await p.evaluate(()=>Net.slot),n+1);eq(await p.evaluate(()=>SquadBattle.size()),3);}
  for(const p of pages){
   eq(await p.locator('#open-match-settings').isVisible(),p===host);eq(await p.locator('#online-lineup-controls').isVisible(),p===host);
   for(const id of ['player-count','battle-format','time-limit','team-attack','squad-size','one-on-one'])eq(await p.locator('#'+id).isDisabled(),p!==host);
   eq(await p.locator('#battle-mode').isDisabled(),true);eq(await p.locator('#online-team').isDisabled(),true);
   await p.click('.stage-card[data-stage="'+(p===host?'0':'1')+'"]');
  }
  // Rule changes clear readiness and only the host can assign teams.
  await guests[0].click('#open-room');await guests[0].click('#ready-room');await host.click('#open-room');await host.waitForFunction(()=>document.querySelectorAll('.room-player')[1].textContent.includes('準備完了'));
  eq((await host.locator('.room-player:nth-child(2) .concealed').textContent()).includes('公開'),true);await host.selectOption('.room-player:nth-child(1) .room-team','1');await host.waitForFunction(()=>document.querySelectorAll('.room-player')[1].textContent.includes('キャラ選択中'));await host.selectOption('.room-player:nth-child(1) .room-team','0');eq(await guests[0].locator('.room-team').count(),0);
  await host.screenshot({path:'previews/lobby-room-desktop.png'});await host.click('#close-room');await guests[0].click('#close-room');
  for(const p of pages)await p.evaluate(()=>{window.snapshots={};addEventListener('online-frame',e=>{if([1,60,180,240].includes(e.detail))snapshots[e.detail]=fighters.map(f=>({id:f.id,character:f.characterId,team:f.team,stocks:f.stocks,x:f.x,y:f.y,mode:f.mode}));});});
  // The same character may appear as random in multiple slots, but draws are unique within a lineup.
  for(const p of pages){await p.click('#open-room');await p.click('#ready-room');}
  await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&snapshots[240],null,{timeout:60000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>({snapshots,config:Net.config}))));for(const s of snapshots){eq(s,snapshots[0]);eq(s.config.players.length,4);eq(s.config.teamAttack,false);eq(s.config.timeLimit,120);s.config.players.forEach(p=>eq(new Set(p.team).size,3));}eq(snapshots[0].config.players.map(p=>p.battleTeam),[0,1,0,1]);eq(['0','1'].includes(snapshots[0].config.stage),true);
  for(const p of pages)await p.evaluate(()=>{state='result';Net.finished();});await Promise.all(pages.map(p=>p.waitForFunction(()=>!document.querySelector('#ready-room').disabled)));
  for(const p of pages)await p.evaluate(()=>document.querySelector('#result .back').click());
  // Same room, selection and connection survive the round.
  for(const p of pages){eq(await p.evaluate(()=>Net.code),code);eq(await p.evaluate(()=>connections.length),1);}
  await host.click('#open-match-settings');await host.selectOption('#squad-size','5');await host.click('#close-match-settings');await guests[0].waitForFunction(()=>SquadBattle.size()===5);
  await host.click('#open-room');await host.click('#leave-room');await Promise.all(guests.map(p=>p.waitForFunction(()=>Net.code==='')));await guests[0].waitForFunction(code=>!document.querySelector('.join-listed-room[data-code="'+code+'"]'),code);
  await guests[0].setViewportSize({width:390,height:844});await guests[0].click('#open-room-create');await guests[0].screenshot({path:'previews/lobby-create-mobile.png'});eq(await guests[0].evaluate(()=>{const r=document.querySelector('#room-create-fields').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),true);
  eq(errors,[]);const result={checks,clients:4,synchronizedFrames:4,sameRoomRematch:true,hostOnlyRules:true,listJoin:true,hiddenSquads:true,errors};fs.writeFileSync('.tools/online-lobby-flow-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
