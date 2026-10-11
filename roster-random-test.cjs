const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],checks=[];
 const url=process.env.GAME_URL||'http://localhost:4173';
 async function open(){const p=await browser.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>errors.push(e.stack));await p.goto(url);await p.waitForFunction(()=>AstralEdge.assetsLoaded);return p;}
 try{
  const p=await open();await p.click('#enter-roster');
  const ids=await p.evaluate(()=>Roster.selectable.map(d=>d.id));
  assert.equal(await p.locator('.fighter-card').count(),ids.length+1);
  assert.equal(await p.locator('.fighter-card img').count(),ids.length);
  // Every equal-width random interval maps to exactly one real fighter.
  const pool=await p.evaluate(()=>{const original=Math.random;try{return Roster.selectable.map((d,i)=>{Math.random=()=>(i+.5)/Roster.selectable.length;return[Roster.resolve('random'),Roster.resolve(d.id)];});}finally{Math.random=original;}});
  assert.deepEqual(pool,ids.map(id=>[id,id]));
  await p.click('[data-id="random"]');await p.locator('#swatches button').nth(1).click();
  await p.click('#select-cpu');await p.click('[data-id="random"]');await p.locator('#swatches button').nth(4).click();
  assert.deepEqual(await p.evaluate(()=>[Roster.selected,document.querySelector('#cpu-character').value]),['random','random']);
  assert.equal(await p.locator('#selected-character-name').textContent(),'おまかせ');
  assert.ok(await p.locator('[data-id="random"] .player-mark').isVisible());assert.ok(await p.locator('[data-id="random"] .cpu-mark').isVisible());
  assert.ok(await p.locator('#selected-portrait').evaluate(i=>i.complete&&i.naturalWidth>0));
  for(const [width,height]of [[1440,900],[375,667],[844,390]]){
   await p.setViewportSize({width,height});await p.waitForTimeout(60);await p.locator('[data-id="random"]').scrollIntoViewIfNeeded();
   const visible=await p.locator('[data-id="random"]').evaluate(el=>{const r=el.getBoundingClientRect(),g=el.parentElement.getBoundingClientRect(),s=el.querySelector('.random-symbol').getBoundingClientRect(),b=el.querySelector('b').getBoundingClientRect();return r.top>=g.top-1&&r.bottom<=g.bottom+1&&r.right<=innerWidth&&s.height>0&&s.bottom<=b.top+1;});assert.ok(visible);
   await p.screenshot({path:`.tools/roster-random-${width}.png`});
  }
  await p.setViewportSize({width:1440,height:900});
  await p.click('#start');assert.deepEqual(await p.evaluate(()=>fighters.map(f=>f.color)),[1,4]);assert.ok((await p.evaluate(()=>fighters.map(f=>f.characterId))).every(id=>ids.includes(id)));
  await p.click('#pausebutton');await p.click('#pause .back');
  assert.deepEqual(await p.evaluate(()=>[Roster.selected,document.querySelector('#cpu-character').value]),['random','random']);
  // A new match rerolls both slots; resetting training retains the current draw.
  for(const value of [0,.999999]){
   await p.evaluate(()=>Roster.open('training'));
   const actual=await p.evaluate(value=>{const original=Math.random;Math.random=()=>value;try{start();return fighters.map(f=>f.characterId);}finally{Math.random=original;}},value);
   assert.deepEqual(actual,[value?ids.at(-1):ids[0],value?ids.at(-1):ids[0]]);
   assert.deepEqual(await p.evaluate(()=>{resetTraining();return fighters.map(f=>f.characterId);}),actual);
   await p.click('#pausebutton');await p.click('#pause .back');
  }
  await p.click('#open-match-settings');await p.selectOption('#cpu-character','vivi');await p.click('#close-match-settings');assert.equal(await p.locator('#select-cpu b').textContent(),'ビビ');
  await p.click('#select-player');await p.click('[data-id="tressa"]');await p.click('#start');assert.deepEqual(await p.evaluate(()=>fighters.map(f=>f.characterId)),['tressa','vivi']);await p.click('#pausebutton');await p.click('#pause .back');
  checks.push('all fighters eligible, player/CPU selection, colors, responsive tile, reroll on new match, stable training reset, fixed selection');
  // Use independent browser sessions and forbid client-side random resolution.
  const q=await open(),pages=[p,q];
  for(const page of pages){await page.evaluate(()=>Roster.open('online'));await page.click('[data-id="random"]');await page.evaluate(()=>{const original=Roster.resolve;Roster.resolve=id=>{if(id==='random')throw Error('Online random must be drawn by the server');return original(id);};});}
  await p.click('#open-room');await p.click('#create-room');await p.waitForFunction(()=>Net.code.length===6);const code=await p.evaluate(()=>Net.code);
  await q.click('#open-room');await q.fill('#room-code',code);await q.click('#join-room');await q.waitForFunction(()=>Net.code===document.querySelector('#room-code').value);
  for(let round=0;round<2;round++){
   if(round)for(const page of pages)await page.evaluate(()=>document.querySelector('#online-room').showModal());
   await p.click('#ready-room');await q.click('#ready-room');await Promise.all(pages.map(page=>page.waitForFunction(()=>Net.active&&state==='battle')));
   const results=await Promise.all(pages.map(page=>page.evaluate(()=>({config:Net.config,ids:fighters.map(f=>f.characterId),chosen:Roster.selected}))));
   assert.deepEqual(results[0],results[1]);assert.equal(results[0].chosen,'random');assert.ok(results[0].ids.every(id=>ids.includes(id)));assert.deepEqual(results[0].ids,results[0].config.players.map(f=>f.character));
   for(const page of pages)await page.evaluate(()=>{window.randomSnapshots={};addEventListener('online-frame',e=>{if([30,60].includes(e.detail))randomSnapshots[e.detail]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,damage:f.damage}));});});
   await Promise.all(pages.map(page=>page.waitForFunction(()=>randomSnapshots[60])));assert.deepEqual(await p.evaluate(()=>randomSnapshots),await q.evaluate(()=>randomSnapshots));
   await Promise.all(pages.map(page=>page.evaluate(()=>{Net.finished();state='result';})));
   checks.push({onlineRound:round+1,characters:results[0].ids,synchronized:true});
   await p.waitForTimeout(100);
  }
  await Promise.all(pages.map(page=>page.evaluate(()=>Net.leave())));
  assert.deepEqual(errors,[]);const result={fighters:ids.length,checks,errors};fs.writeFileSync('.tools/roster-random-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
