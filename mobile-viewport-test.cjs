'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],checks=[];
 try{
  const p=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true,deviceScaleFactor:2});p.on('pageerror',e=>errors.push(e.stack));
  await p.addInitScript(()=>{requestAnimationFrame=()=>0;window.testNativeFullscreen=null;Object.defineProperty(document,'fullscreenElement',{get:()=>testNativeFullscreen});Element.prototype.requestFullscreen=function(){testNativeFullscreen=this;document.dispatchEvent(new Event('fullscreenchange'));return Promise.resolve();};document.exitFullscreen=()=>{testNativeFullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));return Promise.resolve();};});
  await p.goto(process.env.GAME_URL||'http://localhost:4181');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:90000});
  const guards=await p.evaluate(()=>{
   const canvas=document.getElementById('game'),menu=document.getElementById('app');
   const gesture=type=>{const e=new Event(type,{cancelable:true,bubbles:true});canvas.dispatchEvent(e);return e.defaultPrevented;};
   const touch=(target,n)=>{const touches=Array.from({length:n},(_,i)=>new Touch({identifier:i,target,clientX:30+i*40,clientY:70})),e=new TouchEvent('touchmove',{cancelable:true,bubbles:true,touches,changedTouches:touches});target.dispatchEvent(e);return e.defaultPrevented;};
   return{gestures:['gesturestart','gesturechange','gestureend'].map(gesture),canvas:touch(canvas,1),pinch:touch(menu,2),menuScroll:touch(menu,1)};
  });assert.deepEqual(guards,{gestures:[true,true,true],canvas:true,pinch:true,menuScroll:false});checks.push('Safari gesture cancellation with menu scrolling preserved');
  await p.locator('#enter-training').tap();await p.locator('[data-id=dragoon]').tap();await p.selectOption('#stage','0',{force:true});await p.locator('#start').tap();await p.waitForFunction(()=>state==='battle',null,{polling:100,timeout:90000});await p.evaluate(()=>{countdown=hitstop=0;render();});
  await p.locator('#fullscreen').tap();assert.equal(await p.evaluate(()=>!!document.fullscreenElement),true);
  const cdp=await p.context().newCDPSession(p);
  const dimensions=()=>p.evaluate(()=>({scale:visualViewport.scale,visible:[visualViewport.width,visualViewport.height],canvas:canvas.getBoundingClientRect().toJSON(),backing:[canvas.width,canvas.height],stick:document.getElementById('touch-stick').getBoundingClientRect().toJSON()}));
  const before=await dimensions();await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:2});await p.waitForFunction(()=>document.body.classList.contains('touch-zoom-recovery'),null,{polling:100});const zoomed=await dimensions();
  assert.ok(Math.abs(zoomed.canvas.width*zoomed.scale-844)<2);assert.ok(Math.abs(zoomed.canvas.height*zoomed.scale-390)<2);assert.deepEqual(zoomed.backing,before.backing,'zoom recovery retains canvas resolution');assert.ok(Math.abs(zoomed.stick.width*zoomed.scale-before.stick.width)<1);checks.push('already-zoomed canvas and controls restored without reloading');
  // CDP touch coordinates use CSS viewport pixels.
  const points=[];for(const[id,selector,dx]of[[1,'#touch-stick',44],[2,'[data-touch-action=jump]',0],[3,'[data-touch-action=attack]',0]]){const pos=await p.locator(selector).evaluate((e,dx)=>{const r=e.getBoundingClientRect(),v=visualViewport;return{x:r.x+r.width/2+dx/v.scale,y:r.y+r.height/2};},dx);points.push({id,...pos});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});}
  const input=await p.evaluate(()=>Controls.read());assert.ok(input.x>.95&&input.jumpHeld&&input.attackHeld);await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});checks.push('three-finger input after zoom recovery');
  await p.evaluate(()=>{pause();document.getElementById('settings').showModal();});const dialog=await p.locator('#settings').boundingBox();const vv=await p.evaluate(()=>({w:visualViewport.width,h:visualViewport.height,x:visualViewport.offsetLeft,y:visualViewport.offsetTop}));assert.ok(dialog.width<=vv.w+2&&dialog.height<=vv.h+2);assert.ok(dialog.x>=vv.x-2&&dialog.y>=vv.y-2);await p.evaluate(()=>{document.getElementById('settings').close();pause();});checks.push('top-layer dialog remains reachable while zoomed');
  await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:1});await p.waitForFunction(()=>!document.body.classList.contains('touch-zoom-recovery'),null,{polling:100});
  // Lock: viewport changes while hidden and native fullscreen is lost. Resume:
  // Safari's visual viewport update can arrive after visibility/pageshow.
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));testNativeFullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));});
  await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});await p.setViewportSize({width:844,height:390});await p.waitForTimeout(1000);
  assert.equal(await p.evaluate(()=>document.body.classList.contains('fullscreen-view')),true);const resumed=await dimensions();assert.deepEqual([resumed.canvas.width,resumed.canvas.height],[844,390]);assert.deepEqual(resumed.backing,before.backing);assert.equal(await p.evaluate(()=>state),'pause','resume does not restart a paused match');await p.locator('#resume').tap();await p.evaluate(()=>render());await p.screenshot({path:'previews/mobile/viewport-resume-landscape.png'});checks.push('screen lock/fullscreen loss/delayed landscape viewport, match preserved');
  await p.locator('#exit-fullscreen').tap();assert.equal(await p.evaluate(()=>document.body.classList.contains('fullscreen-view')),false);await p.evaluate(()=>TouchControls.setMode('off'));assert.equal(await p.evaluate(()=>document.body.style.getPropertyValue('--mobile-viewport-height')),'');checks.push('explicit fullscreen exit and desktop mode cleanup');
  assert.deepEqual(errors,[]);fs.writeFileSync('previews/mobile/viewport-results.json',JSON.stringify({checks,guards,before,zoomed,resumed,errors},null,2));console.log(JSON.stringify({passed:true,checks,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
