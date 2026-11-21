'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const fighter=process.env.LIMIT_FIGHTER||'lid';
const evolutionStage=Number(process.env.LIMIT_EVOLUTION_STAGE||0);
assert.ok(evolutionStage===0||fighter==='agumon'&&Number.isInteger(evolutionStage)&&evolutionStage>=1&&evolutionStage<=4);
(async()=>{
 const browser=await chromium.launch({channel:'msedge',args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 const pages=[],errors=[];
 try{
  for(let n=0;n<2;n++){
   const page=await(await browser.newContext()).newPage();pages.push(page);
   page.setDefaultTimeout(25000);page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.GAME_URL||'http://localhost:4181');
   await page.waitForFunction(()=>AstralEdge.assetsLoaded);
   await page.click('#enter-online');
  }
  const [host,guest]=pages;
  await host.click('#open-room-create');assert.equal(await host.locator('#create-limit-break').isChecked(),true);
  await host.check('#create-limit-break');await host.click('#create-room');
  await host.waitForFunction(()=>Net.code.length===6);
  const code=await host.evaluate(()=>Net.code);
  await guest.click('.join-listed-room[data-code="'+code+'"]');
  for(const page of pages){
   await page.waitForFunction(()=>Net.code.length===6&&document.querySelector('#limit-break').checked);
   await page.click('[data-id="'+fighter+'"]');
   await page.click('#open-room');
   await page.click('#ready-room');
  }
  await Promise.all(pages.map(page=>page.waitForFunction(id=>Net.active&&countdown===0&&LimitBreak.artPrepared([{character:id}],true),fighter)));

  const moment=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({moment,slot})=>{
   window.lidSync={};const key=(code,down)=>{if(slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   addEventListener('online-frame',e=>{const n=e.detail-moment;
    const place=(air=false)=>{for(const c of ['KeyX','ArrowUp','ArrowRight'])key(c,false);LidRules.reset();hitstop=0;fighters.forEach((f,k)=>{Object.assign(f,{x:k?1600:650,y:air?300:560,vx:0,vy:0,damage:0,grounded:!air,inv:0,intangible:0,hitlag:0,hitstun:0,respawn:0,recovered:false,attack:null,ledge:null,ledgeCooldown:120,pendingLaunch:null,frozen:null});PlayerStates.enter(f,air?'Fall':'Idle');});};
    if(n===0){place();attack(fighters[0],'dragon');key('KeyX',true);}if(n===35)key('KeyX',false);
    if(n===70){place();attack(fighters[0],'dash');key('KeyX',true);key('ArrowUp',true);}if(n===100){key('ArrowUp',false);key('KeyX',false);}if(n===115){fighters[0].attack=null;attack(fighters[0],'gale');}
    if(n===150){place(true);attack(fighters[0],'rise');key('ArrowRight',true);}if(n===180){key('ArrowRight',false);key('KeyX',true);}if(n===181)key('KeyX',false);
    if(n>=0&&n<=225)lidSync[n]={f:fighters.map(f=>[f.x,f.y,f.vx,f.vy,f.mode,f.timer,f.attack?.type??null,f.lidInvent||0]),objects:LidRules.objects.map(q=>[q.id,q.kind,q.x,q.y,q.age,q.phase??null,q.steer??0])};
   });
  },{moment,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>lidSync[225])));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>lidSync)));assert.deepEqual(snapshots[0],snapshots[1]);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({fighter:'lid',matchingFrames:Object.keys(snapshots[0]).length,scenes:['charged hammer','remote mechabo','linked stonga','steerable escape'],errors}));
 }finally{for(const p of pages)await p.evaluate(()=>Net.leave()).catch(()=>{});await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
