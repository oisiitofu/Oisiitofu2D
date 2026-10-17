'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{
  const pages=[],errors=[],records=[];let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
  for(let n=0;n<4;n++){
   const p=await(await browser.newContext({viewport:{width:1440,height:1000}})).newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.stack));
   await p.addInitScript(()=>{navigator.getGamepads=()=>[];window.socketCount=0;window.lineupReveals=[];const Base=WebSocket;window.WebSocket=class extends Base{constructor(...args){super(...args);socketCount++;this.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.type==='room'&&m.revealed)lineupReveals.push(m.players.map(p=>p.team));});}};});
   await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-online');
   await p.evaluate(()=>{window.squadRounds={};addEventListener('online-frame',e=>{const c=Net.config,r=squadRounds[c.matchId]??={config:c,snapshots:{}};
    if(e.detail===1){const names=[],fill=ctx.fillText;ctx.fillText=function(t,...args){if(/^\d+\. /.test(String(t)))names.push(t);return fill.call(this,t,...args);};try{r.revealVisible=SquadBattle.drawReveal();}finally{ctx.fillText=fill;}r.revealNames=names;const t=countdown;countdown=0;r.revealEndsAtZero=!SquadBattle.drawReveal();countdown=t;}
    if([1,195,345,505,665,825].includes(e.detail))r.snapshots[e.detail]=fighters.map(f=>({character:f.characterId,squad:f.squad,index:f.squadIndex,x:f.x,y:f.y,face:f.face,team:f.team,control:f.control,stocks:f.stocks}));
    if([200,360,520,680,840].slice(0,c.squadSize).includes(e.detail))for(const f of fighters.filter(f=>f.team===1)){f.respawn=0;f.x=StageRules.blast.right+20;ko(f);}
   });});
  }
  const [host,...guests]=pages;
  eq(await host.locator('#online-lineup-size').isVisible(),true);await host.selectOption('#online-lineup-size','3');eq(await host.locator('#squad-lineup .squad-slot').count(),3);
  await host.click('#open-match-settings');await host.selectOption('#player-count','4');await host.selectOption('#battle-format','teams');await host.click('#close-match-settings');eq(await host.evaluate(()=>BattlePlayers.count()),4);
  await host.click('#open-room');await host.click('#create-room');await host.waitForFunction(()=>Net.code.length===6);const code=await host.evaluate(()=>Net.code);
  for(const p of guests){await p.bringToFront();await p.click('#open-room');await p.fill('#room-code',code);await p.click('#join-room');await p.waitForFunction(()=>Net.code.length===6);await p.click('#edit-online-lineup');eq(await p.locator('#online-lineup-size').inputValue(),'3');eq(await p.locator('#online-lineup-size').isDisabled(),true);}
  await host.click('#edit-online-lineup');
  const base=['tifa','isaac','chiikawa','chocobo','ulgrim'];
  for(const size of [3,5]){
   if(size===5){
    await host.selectOption('#online-lineup-size','5');await guests[0].waitForFunction(()=>SquadBattle.size()===5);
    await host.click('#squad-lineup [data-slot="4"]');await host.selectOption('#online-lineup-size','3');eq(await host.locator('#squad-lineup .active').getAttribute('data-slot'),'2');await host.selectOption('#online-lineup-size','5');
   }
   const lineups=pages.map((_,n)=>Array.from({length:size},(_,i)=>base[(i+n)%base.length]));
   for(let n=0;n<4;n++){
    const p=pages[n];await p.bringToFront();await p.waitForFunction(size=>SquadBattle.size()===size,size);
    eq(await p.locator('#squad-lineup').getAttribute('aria-label'),(n+1)+'Pの出場順');
    for(let slot=0;slot<size;slot++){await p.click(`#squad-lineup [data-slot="${slot}"]`);await p.click(`[data-id="${lineups[n][slot]}"]`);}
    eq(await p.evaluate(size=>SquadBattle.teams.player.slice(0,size),size),lineups[n]);
   }
   await host.screenshot({path:'.tools/online-squad-'+size+'-roster.png'});
   // Editing one's lineup revokes ready, and only that player's roster changes.
   await guests[0].click('#open-room');await guests[0].click('#ready-room');await host.waitForFunction(()=>document.querySelectorAll('#room-players .room-player')[1].textContent.includes('準備完了'));eq(await host.locator('#room-players .room-player:nth-child(2) .room-lineup').textContent(),'出場キャラは全員の準備完了後に公開');eq(await host.locator('#room-players .room-player:nth-child(2) img').count(),0);eq((await guests[0].locator('#room-players .room-player:nth-child(2) .room-lineup').textContent()).includes('公開'),false);await guests[0].click('#edit-online-lineup');await guests[0].click('#squad-lineup [data-slot="0"]');await guests[0].click(`[data-id="${lineups[1][0]}"]`);await host.waitForFunction(()=>document.querySelectorAll('#room-players .room-player')[1].textContent.includes('キャラ選択中'));checks++;
   for(const p of pages){await p.bringToFront();await p.click('#open-room');eq((await p.locator('#room-match-rule').textContent()).includes(size+'キャラ団体戦'),true);await p.click('#ready-room');}
   await host.bringToFront();await host.waitForFunction(()=>Net.active&&countdown>0);await host.screenshot({path:'.tools/squad-reveal-'+size+'.png'});for(const p of pages)eq(await p.evaluate(()=>lineupReveals.at(-1)),lineups);
   const id=size===3?1:2;
   await Promise.all(pages.map(p=>p.waitForFunction(id=>state==='result'&&squadRounds[id],id,{timeout:45000})));
   const all=await Promise.all(pages.map(p=>p.evaluate(id=>squadRounds[id],id)));for(let n=1;n<4;n++)eq(all[n],all[0]);const r=all[0];records.push(r);
   eq(r.revealVisible,true);eq(r.revealEndsAtZero,true);eq(r.revealNames,lineups.flatMap(team=>team.map((id,n)=>(n+1)+'. '+({'tifa':'ティファ','isaac':'ロビン','chiikawa':'ちいかわ','chocobo':'チョコボ','ulgrim':'ウルグリム'}[id]))));eq(r.config.squadSize,size);eq(r.config.players.map(p=>p.team),lineups);eq(r.snapshots[1].map(f=>f.stocks),[size,size,size,size]);eq(r.snapshots[1].map(f=>f.team),[0,1,0,1]);eq(new Set(r.snapshots[1].map(f=>f.x)).size,4);
   for(let member=1;member<size;member++){const snap=r.snapshots[185+member*160];for(let n=0;n<4;n++){eq(snap[n].character,lineups[n][n%2?member:0]);eq(snap[n].index,n%2?member:0);eq(snap[n].team,n%2);eq(snap[n].control,'online');eq(snap[n].stocks,n%2?size-member:size);}}
   for(const p of pages){eq(await p.locator('#winner').textContent(),'RED TEAM VICTORY');await p.bringToFront();await p.click('#result .back');eq(await p.evaluate(()=>Net.code),code);eq(await p.evaluate(()=>socketCount),1);}
  }
  // The quick selector remains reachable without the settings dialog on mobile.
  await host.setViewportSize({width:390,height:844});await host.screenshot({path:'.tools/online-squad-mobile.png'});eq(await host.locator('#online-lineup-size').isVisible(),true);eq(await host.evaluate(()=>{const r=document.querySelector('#online-lineup-size').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),true);
  eq(errors,[]);fs.writeFileSync('.tools/online-squad-selection-results.json',JSON.stringify({checks,records,errors},null,2));console.log(JSON.stringify({checks,clients:4,lineups:[3,5],sameRoom:true,allMembersVerified:true,teamAndControlPreserved:true,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
