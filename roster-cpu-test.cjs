const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');
 const card=id=>page.locator(`#fighter-grid [data-id="${id}"]`);
 await card('nier').click();await page.locator('#swatches button').nth(1).click();
 await page.click('#select-cpu');await card('miku').click();await page.locator('#swatches button').nth(4).click();
 assert.deepEqual(await page.evaluate(()=>({player:Roster.selected,cpu:document.querySelector('#cpu-character').value,playerColor:selected,cpuColor:+document.querySelector('#color2').value,target:Roster.target})),{player:'nier',cpu:'miku',playerColor:1,cpuColor:4,target:'cpu'});
 assert.equal(await page.locator('#selected-character-name').textContent(),'初音ミク');assert.equal(await page.locator('#select-player b').textContent(),'ニーア');assert.equal(await page.locator('#select-cpu b').textContent(),'初音ミク');
 assert.ok(await card('nier').locator('.player-mark').isVisible());assert.ok(await card('miku').locator('.cpu-mark').isVisible());
 await page.click('#select-player');assert.equal(await page.locator('#costume-name').textContent(),'黒曜');await page.click('#select-cpu');assert.equal(await page.locator('#costume-name').textContent(),'月白');
 await page.screenshot({path:'.tools/roster-cpu-desktop.png'});
 for(const mode of ['battle','training']){
  await page.evaluate(mode=>Roster.open(mode),mode);await page.click('#start');assert.deepEqual(await page.evaluate(()=>fighters.map(f=>[f.characterId,f.color])),[['nier',1],['miku',4]]);
  await page.click('#pausebutton');await page.click('#pause .back');assert.equal(await page.locator('#select-cpu b').textContent(),'初音ミク');assert.equal(await page.evaluate(()=>Roster.selected),'nier');
 }
 await card('nier').click();assert.ok(await card('nier').locator('.player-mark').isVisible());assert.ok(await card('nier').locator('.cpu-mark').isVisible());
 await page.click('#open-match-settings');await page.selectOption('#cpu-character','morphie');await page.selectOption('#color2','3');await page.click('#close-match-settings');assert.equal(await page.locator('#selected-character-name').textContent(),'モーフィーズロウ');assert.equal(await page.locator('#select-cpu b').textContent(),'モーフィーズロウ');assert.equal(await page.locator('#costume-name').textContent(),'蒼天');
 for(const [width,height]of [[1440,900],[390,844],[375,667],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(50);
  for(const target of ['player','cpu']){
   await page.click('#select-'+target);await card('morphie').click();
   const layout=await page.evaluate(()=>{const box=e=>e.getBoundingClientRect(),grid=box(document.querySelector('#fighter-grid'));return{buttons:[...document.querySelectorAll('.roster-target')].filter(el=>el.getClientRects().length).map(el=>{const r=box(el),range=document.createRange();range.selectNodeContents(el.querySelector('b'));const t=range.getBoundingClientRect();return r.width>0&&r.top>=0&&r.right<=innerWidth&&t.left>=r.left&&t.right<=r.right&&t.bottom<=r.bottom}),footer:box(document.querySelector('.roster-footer')).bottom<=innerHeight+1,grid:grid.height>50,overflow:document.querySelector('#menu').scrollHeight>document.querySelector('#menu').clientHeight+1};});assert.deepEqual(layout,{buttons:[true,true],footer:true,grid:true,overflow:false});
  }
  if(width===390)await page.screenshot({path:'.tools/roster-cpu-mobile.png'});
 }
 await page.evaluate(()=>Roster.open('online'));assert.equal(await page.evaluate(()=>Roster.target),'player');assert.equal(await page.locator('#select-cpu').isVisible(),false);assert.equal(await page.locator('.cpu-mark:visible').count(),0);await card('vivi').click();assert.equal(await page.evaluate(()=>Roster.selected),'vivi');assert.equal(await page.locator('#cpu-character').inputValue(),'morphie');
 await page.evaluate(()=>Roster.open('battle'));assert.equal(await page.locator('#select-cpu').isVisible(),true);assert.equal(await page.locator('#select-cpu b').textContent(),'モーフィーズロウ');
 assert.deepEqual(errors,[]);console.log('PASS: shared CPU/player roster, independent colors, mirror match, settings sync, battle/training return, responsive layouts and online isolation');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
