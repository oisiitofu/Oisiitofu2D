'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']}),pages=[],errors=[],tag=process.env.RESULT_TAG||'local',names=['漢'.repeat(20),'🐈'.repeat(20),'Lickey','おいしいとうふ'];let checks=0;
 const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
 const waitCount=(p,n)=>p.waitForFunction(n=>document.querySelector('#result-ready-title').textContent===`準備完了 ${n}/4人`,n);
 try{
  for(let n=0;n<4;n++){
   const p=await(await browser.newContext({viewport:{width:1280,height:720}})).newPage();pages.push(p);p.setDefaultTimeout(60000);p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(()=>{navigator.getGamepads=()=>[];window.transport={sockets:[],sent:[],rooms:[]};const Base=WebSocket;window.WebSocket=class extends Base{constructor(...a){super(...a);transport.sockets.push(this);this.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.type==='room')transport.rooms.push(m);});}send(raw){transport.sent.push(JSON.parse(raw));super.send(raw);}};});
   await p.goto(process.env.GAME_URL||'http://localhost:4179');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.evaluate(name=>PlayerNames.choose(name),names[n]);if(!await p.locator('#online-room').evaluate(e=>e.open))await p.click('#enter-online');
   await p.evaluate(()=>{window.resultFrames={};addEventListener('online-frame',e=>{const id=Net.config.matchId;if(e.detail<=60)(resultFrames[id]??={})[e.detail]=fighters.map(f=>({x:f.x,y:f.y,character:f.characterId,stocks:f.stocks,mode:f.mode,team:f.team}));});});
  }
  const[a,b,c,d]=pages;
  await a.click('#open-room-create');await a.selectOption('#create-player-count','4');await a.click('#create-room');await a.waitForFunction(()=>Net.code.length===6);const code=await a.evaluate(()=>Net.code);
  async function join(p){await p.waitForFunction(code=>document.querySelector('.join-listed-room[data-code="'+code+'"]'),code);await p.click('.join-listed-room[data-code="'+code+'"]');await p.waitForFunction(()=>Net.code.length===6);}
  for(const p of[b,c,d])await join(p);
  async function ready(p){await p.evaluate(()=>{if(!document.querySelector('#online-room').open)document.querySelector('#online-room').showModal();});await p.click('#ready-room');}
  for(const p of pages)await ready(p);await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&frame>=60)));
  for(const p of pages)eq(await p.locator('#result-readiness').isVisible(),false,'hidden during match');
  const first=await a.evaluate(()=>Net.config.matchId);
  await a.evaluate(()=>finish());eq(await a.locator('#result-ready-title').textContent(),'全員の終了を確認中…');
  eq(await a.locator('#result-ready-players .ready').count(),0,'old ready flags ignored');
  await a.click('#result .restart');eq(await a.locator('#result .restart').isDisabled(),true);eq(await a.locator('#result-ready-players li').first().locator('b').textContent(),'再戦予約済み');
  await a.evaluate(()=>Net.ready());eq(await a.evaluate(()=>transport.sent.filter(m=>m.type==='ready').length),1,'queue does not send early or twice');
  for(const p of[b,c,d])await p.evaluate(()=>finish());await waitCount(a,1);
  eq(await a.evaluate(()=>transport.sent.filter(m=>m.type==='ready').length),2,'one queued rematch request');
  for(const p of pages){await waitCount(p,1);eq(await p.locator('#result-ready-players span').allTextContents(),names.map((name,n)=>name+(n===pages.indexOf(p)?'（あなた）':'')));}
  fs.mkdirSync('previews/quality',{recursive:true});
  for(const[width,height]of[[1280,720],[1440,900]]){
   await a.setViewportSize({width,height});await a.locator('#result .restart').scrollIntoViewIfNeeded();await a.screenshot({path:`previews/quality/result-ready-${tag}-${width}.png`});
   eq(await a.locator('#result-readiness').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}),true,'readiness fits '+width);
   eq(await a.locator('#result .modal').evaluate(e=>e.scrollHeight<=e.clientHeight+1),true,'whole result fits without scrolling '+width);
   eq(await a.locator('#result-ready-players span').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1&&parseFloat(getComputedStyle(e).fontSize)>=12)),true,'long names wrap '+width);
  }
  await b.click('#result .restart');await waitCount(a,2);await b.click('#result .back');await waitCount(a,1);eq(await b.evaluate(()=>state),'menu');await b.click('[data-id="isaac"]');
  await d.evaluate(()=>Net.leave());await a.waitForFunction(()=>document.querySelector('#result-ready-count').textContent==='参加 3/4人');await waitCount(a,0);
  eq(await a.locator('#result-ready-players li').last().locator('b').textContent(),'参加待ち');eq(await d.locator('#result .restart').isDisabled(),false);
  await a.click('#result .restart');await waitCount(a,1);await d.click('#result .restart');eq(await d.locator('#result').isVisible(),false,'rejoin clears result overlay');eq(await d.locator('#online-room').evaluate(e=>e.open),true);
  await join(d);await waitCount(a,1);
  for(const p of[b,c,d]){if(await p.locator('#result').isVisible())await p.click('#result .restart');else await ready(p);}
  await Promise.all(pages.map(p=>p.waitForFunction(old=>Net.active&&Net.config.matchId>old&&frame>=60,first)));
  const second=await a.evaluate(()=>Net.config.matchId),frames=await Promise.all(pages.map(p=>p.evaluate(id=>resultFrames[id],second)));
  for(const f of frames)eq(f,frames[0],'60 rematch frames agree');for(const p of pages){eq(await p.evaluate(()=>Net.code),code);eq(await p.locator('#result-readiness').isVisible(),false);}
  for(const p of pages)await p.evaluate(()=>finish());await waitCount(a,0);await a.click('#result .back');await a.click('#open-match-settings');await a.selectOption('#squad-size','3');await a.click('#close-match-settings');
  for(const p of[b,c,d])await p.click('#result .back');
  for(const p of pages)for(const[n,id]of['dragoon','isaac','tifa'].entries()){await p.click('#squad-lineup [data-slot="'+n+'"]');await p.click('[data-id="'+id+'"]');}
  for(const p of pages)await ready(p);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&Net.config.squadSize===3&&frame>=60)));
  const squad=await a.evaluate(()=>Net.config.players.map(p=>p.team));for(const p of pages)eq(await p.evaluate(()=>Net.config.players.map(p=>p.team)),squad,'squad preserved');
  for(const p of pages)await p.evaluate(()=>finish());await waitCount(a,0);for(const p of pages)await p.click('#result .restart');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&frame>=60)));for(const p of pages)eq(await p.evaluate(()=>Net.config.players.map(p=>p.team)),squad,'same squad rematch');
  for(const p of pages)await p.evaluate(()=>finish());await waitCount(a,0);await a.evaluate(()=>Net.leave());await b.waitForFunction(()=>!Net.code);eq(await b.locator('#result-readiness').isVisible(),false);eq(await b.locator('#result .restart').textContent(),'ルームを選んで再戦 →');
  for(const p of pages)await p.evaluate(()=>Net.leave());for(const p of[a,b]){await p.click('#result .restart');if(!await p.locator('#online-room').evaluate(e=>e.open))await p.click('#enter-online');}
  await a.click('#open-room-create');await a.selectOption('#create-match-kind','bingo');await a.selectOption('#create-player-count','2');await a.selectOption('#create-battle-format','free');await a.click('#create-room');await a.waitForFunction(()=>!!BingoBattle.online);const bingoCode=await a.evaluate(()=>Net.code);
  await b.waitForFunction(code=>document.querySelector('.join-listed-room[data-code="'+code+'"]'),bingoCode);await b.click('.join-listed-room[data-code="'+bingoCode+'"]');await b.waitForFunction(()=>!!BingoBattle.online);
  for(const p of[a,b])await p.evaluate(()=>{addEventListener('online-frame',e=>{if(Net.config.ruleSet==='bingo'&&e.detail===240){fighters[1].stocks=0;}});});
  await a.locator('#bingo-grid .bingo-cell:not(:disabled)').first().click();await a.click('#bingo-confirm');await b.waitForFunction(()=>!!BingoBattle.online.picks[0]);
  eq(await b.evaluate(()=>Object.hasOwn(transport.rooms.at(-1).players[0],'character')),false,'bingo selection remains private');
  await b.locator('#bingo-grid .bingo-cell:not(:disabled)').first().click();await b.click('#bingo-confirm');
  for(const p of[a,b])await p.waitForFunction(()=>BingoBattle.online?.round===2&&state==='menu'&&BingoBattle.isOpen(),null,{timeout:90000});
  for(const p of[a,b]){eq(await p.locator('#result-readiness').isVisible(),false,'next bingo card hides strip');eq(await p.locator('#bingo-grid .bingo-cell').count(),25);}
  eq(errors,[],'client errors');const report={checks,clients:4,sameRoomRematch:true,squadSize:3,identicalRematchFrames:60,queuedReadiness:true,unready:true,leaveRejoin:true,bingoNextRound:true,privateChoices:true,errors};fs.writeFileSync(`previews/quality/result-readiness-online-${tag}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{for(const p of pages)await p.evaluate(()=>Net.leave()).catch(()=>{});await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
