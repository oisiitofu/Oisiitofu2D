'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright'),catalog=require('./stage-data.js');
(async()=>{
 assert.equal(catalog.chooseOnline(['0','1'],()=>0),'0');assert.equal(catalog.chooseOnline(['0','1'],n=>n-1),'1');
 for(const slot of [0,1])for(let stage=0;stage<catalog.stages.length;stage++){const draws=[slot,stage];assert.equal(catalog.chooseOnline(['random','random'],()=>draws.shift()),catalog.stages[stage].id);}
 assert.equal(catalog.normalize('invalid'),'0');assert.equal(catalog.resolve('1'),'1');
 catalog.stages.push({...catalog.stages[0],id:'future'});try{assert.equal(catalog.resolve('random',n=>n-1),'future');}finally{catalog.stages.pop();}
 const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],checks=['both player choices and every random stage reachable; new stages enter pool'];
 async function open(){const p=await browser.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);return p;}
 try{
  const p=await open();await p.click('#enter-roster');assert.equal(await p.locator('.stage-card').count(),catalog.stages.length+1);
  await p.click('[data-stage="1"]');assert.equal(await p.locator('#stage').inputValue(),'1');assert.equal(await p.locator('[data-stage="1"]').getAttribute('aria-pressed'),'true');
  await p.click('#open-match-settings');await p.selectOption('#stage','0');await p.click('#close-match-settings');assert.equal(await p.locator('[data-stage="0"]').getAttribute('aria-pressed'),'true');
  await p.click('[data-stage="random"]');await p.evaluate(()=>Roster.open('training'));const result=await p.evaluate(()=>{const original=Math.random;Math.random=()=>.999999;try{start();return{stage:activeStage,choice:document.querySelector('#stage').value,platforms};}finally{Math.random=original;}});assert.equal(result.stage,catalog.stages.at(-1).id);assert.equal(result.choice,'random');assert.deepEqual(result.platforms,catalog.stages.at(-1).platforms);assert.match(await p.locator('#battlelabel').textContent(),new RegExp(catalog.stages.at(-1).name));await p.waitForFunction(()=>GameAudio.currentStage===StageCatalog.stages.at(-1).id);
  await p.evaluate(()=>resetTraining());assert.equal(await p.evaluate(()=>activeStage),catalog.stages.at(-1).id);await p.click('#pausebutton');await p.click('#pause .back');assert.equal(await p.locator('#stage').inputValue(),'random');checks.push('picker/settings sync, local random, actual geometry/label/music, choice retained on return');
  for(const [width,height]of [[1920,1080],[1440,900],[1024,640],[820,1180],[375,667],[844,390],[1024,480]]){
   await p.setViewportSize({width,height});await p.waitForTimeout(70);
   const layout=await p.evaluate(()=>{const r=e=>e.getBoundingClientRect(),strip=r(document.querySelector('#stage-strip')),heading=r(document.querySelector('.roster-heading')),footer=r(document.querySelector('.roster-footer'));return strip.width>70&&strip.height>=26&&strip.left>=heading.left&&strip.right<=heading.right+1&&strip.top>=heading.top&&strip.bottom<=heading.bottom+1&&footer.bottom<=innerHeight+1&&document.documentElement.scrollHeight<=innerHeight+1;});assert.ok(layout,`${width}x${height}`);
   if([1440,375,844].includes(width))await p.screenshot({path:`.tools/stage-picker-${width}.png`});
  }
  const q=await open(),pages=[p,q];await p.setViewportSize({width:1440,height:900});for(const page of pages)await page.evaluate(()=>Roster.open('online'));
  await p.click('#open-room');await p.click('#create-room');await p.waitForFunction(()=>Net.code.length===6);const code=await p.evaluate(()=>Net.code);await q.click('#open-room');await q.fill('#room-code',code);await q.click('#join-room');await q.waitForFunction(()=>Net.code.length===6);
  for(const choices of [['0','1'],['1','1'],['random','random'],['random','0']]){
   for(let n=0;n<2;n++)await pages[n].evaluate(id=>{document.querySelector('#stage').value=id;document.querySelector('#stage').dispatchEvent(new Event('change'));if(!document.querySelector('#online-room').open)document.querySelector('#online-room').showModal();},choices[n]);
   await p.click('#ready-room');await q.click('#ready-room');await Promise.all(pages.map(page=>page.waitForFunction(()=>Net.active&&state==='battle')));
   const data=await Promise.all(pages.map(page=>page.evaluate(()=>({stage:Net.config.stage,active:activeStage,choice:document.querySelector('#stage').value,platforms,ledges:StageRules.ledges,label:document.querySelector('#battlelabel').textContent}))));
   assert.equal(data[0].stage,data[1].stage);assert.equal(data[0].active,data[0].stage);assert.equal(data[1].active,data[0].stage);assert.deepEqual(data[0].platforms,data[1].platforms);assert.deepEqual(data[0].platforms,catalog.get(data[0].stage).platforms);const main=data[0].platforms.find(p=>p.main);assert.deepEqual(data[0].ledges,[{x:main.x,y:main.y,face:1},{x:main.x+main.w,y:main.y,face:-1}]);assert.deepEqual(data[0].ledges,data[1].ledges);assert.equal(data[0].choice,choices[0]);assert.equal(data[1].choice,choices[1]);assert.equal(data[0].label,data[1].label);assert.ok(catalog.stages.some(s=>s.id===data[0].stage));if(choices.every(c=>c==='1'))assert.equal(data[0].stage,'1');
   await Promise.all(pages.map(page=>page.waitForFunction(()=>GameAudio.currentStage===Net.config.stage)));checks.push({online:choices,stage:data[0].stage,sameGeometryAndMusic:true,choicesRetained:true});
   await Promise.all(pages.map(page=>page.evaluate(()=>{Net.finished();state='result';})));await p.waitForTimeout(100);
  }
  for(const page of pages)await page.evaluate(()=>Net.leave());
  // Simulate a later release adding 24 stages to the shared catalog.
  await p.route('**/game-bundle.js',async route=>{const response=await route.fetch(),source=await response.text(),marker='const draw=n=>Math.floor(Math.random()*n);';assert.ok(source.includes(marker));await route.fulfill({response,body:source.replace(marker,"for(let i=0;i<24;i++)stages.push({...stages[0],id:'future-'+i,name:'追加ステージ '+(i+1)});"+marker)});});await p.reload();await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-roster');
  for(const [width,height]of [[1440,900],[375,667]]){await p.setViewportSize({width,height});await p.waitForTimeout(70);assert.ok(await p.locator('#stage-strip').evaluate(e=>e.scrollWidth>e.clientWidth));await p.click('#stage-next');await p.waitForTimeout(350);assert.ok(await p.locator('#stage-strip').evaluate(e=>e.scrollLeft>0));await p.locator('[data-stage="future-23"]').focus();await p.waitForTimeout(80);const reachable=await p.locator('[data-stage="future-23"]').evaluate(e=>{const b=e.getBoundingClientRect(),s=e.parentElement.getBoundingClientRect();return b.left>=s.left-1&&b.right<=s.right+1;});assert.ok(reachable);await p.locator('[data-stage="future-23"]').click();assert.equal(await p.locator('#stage').inputValue(),'future-23');}
  checks.push('24 future stages stay in one horizontal strip and are reachable by arrows and keyboard');assert.deepEqual(errors,[]);fs.writeFileSync('.tools/stage-selection-results.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
