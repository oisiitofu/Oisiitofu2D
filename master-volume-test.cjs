'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.addInitScript(()=>{if(!localStorage.getItem('tofu-audio-v1'))localStorage.setItem('tofu-audio-v1',JSON.stringify({bgm:.23,se:.61}));});
 await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
 assert.deepEqual(await p.evaluate(()=>GameAudio.levels),{master:1,bgm:.23,se:.61});assert.equal(await p.locator('.open-audio').count(),0);
 await p.click('#enter-roster');await p.waitForFunction(()=>GameAudio.context?.state==='running');await p.locator('#volume-master').fill('40');await p.waitForTimeout(150);
 let gains=await p.evaluate(()=>GameAudio.gains);assert.ok(Math.abs(gains.master-.82*.4)<.002);assert.ok(Math.abs(gains.bgm-.23)<.001&&Math.abs(gains.se-.61)<.001);
 assert.equal(await p.locator('[data-volume-value="master"]').textContent(),'40%');
 await p.click('#sound');await p.waitForTimeout(120);assert.equal(await p.locator('#sound').getAttribute('aria-pressed'),'true');assert.ok(await p.locator('#sound .sound-muted').isVisible());assert.ok((await p.evaluate(()=>GameAudio.gains.master))<.001);
 await p.click('#sound');assert.equal(await p.locator('#volume-master').inputValue(),'40');assert.equal(await p.locator('#sound').getAttribute('aria-pressed'),'false');
 await p.locator('#volume-master').fill('0');assert.equal(await p.locator('#sound').getAttribute('aria-pressed'),'true');await p.click('#sound');assert.equal(await p.locator('#volume-master').inputValue(),'40');
 await p.click('#sound');await p.locator('#volume-master').fill('50');assert.equal(await p.locator('#sound').getAttribute('aria-pressed'),'false');
 await p.click('.roster-toolbar .open-settings');assert.ok(await p.locator('#settings #volume-bgm').isVisible());await p.locator('#volume-bgm').fill('18');await p.locator('#volume-se').fill('54');await p.waitForTimeout(150);gains=await p.evaluate(()=>GameAudio.gains);assert.ok(Math.abs(gains.bgm-.18)<.002&&Math.abs(gains.se-.54)<.002&&Math.abs(gains.master-.41)<.002);
 await p.screenshot({path:'.tools/audio-detailed-settings.png'});await p.click('#close-settings');await p.locator('#volume-master').fill('25');await p.waitForTimeout(150);assert.deepEqual(await p.evaluate(()=>GameAudio.levels),{master:.25,bgm:.18,se:.54});assert.ok(Math.abs((await p.evaluate(()=>GameAudio.gains.master))-.205)<.002);
 for(const [width,height]of [[1920,1080],[1366,768],[1024,640],[390,844],[375,667],[320,568],[844,390]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(50);const layout=await p.evaluate(()=>{const r=e=>e.getBoundingClientRect(),brand=r(document.querySelector('.brand')),box=r(document.querySelector('.master-volume')),bar=r(document.querySelector('#volume-master')),mute=r(document.querySelector('#sound')),end=r(document.querySelector('#fullscreen'));return brand.right<=box.left&&bar.width>=60&&box.right<=innerWidth&&end.right<=innerWidth&&bar.right<=mute.left&&box.top>=0;});assert.ok(layout,`${width}x${height}`);
  if([1366,375,844].includes(width))await p.screenshot({path:`.tools/master-volume-${width}.png`});
 }
 await p.setViewportSize({width:1440,height:900});await p.click('#start');await p.locator('#volume-master').fill('32');assert.equal(await p.evaluate(()=>state),'battle');await p.click('#pausebutton');await p.click('#pause .open-settings');assert.ok(await p.locator('#settings #volume-se').isVisible());await p.click('#close-settings');await p.click('#resume');
 await p.locator('#volume-master').blur();await p.keyboard.press('m');assert.equal(await p.locator('#sound').getAttribute('aria-pressed'),'true');await p.keyboard.press('m');assert.equal(await p.locator('#sound').getAttribute('aria-pressed'),'false');
 await p.reload();await p.waitForFunction(()=>AstralEdge.assetsLoaded);assert.deepEqual(await p.evaluate(()=>GameAudio.levels),{master:.32,bgm:.18,se:.54});assert.equal(await p.locator('#volume-master').inputValue(),'32');assert.deepEqual(errors,[]);
 console.log('PASS: legacy settings migration, shared gain, independent balance, mute icons/button/M, zero-volume restore, slider unmute, persistence, seven viewport layouts and battle/pause controls');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
