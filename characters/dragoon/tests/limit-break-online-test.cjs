'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const fighter=process.env.LIMIT_FIGHTER||'dragoon';
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
  const moment=Math.max(...await Promise.all(pages.map(page=>page.evaluate(()=>frame))))+100;
  const expected=await host.evaluate(id=>{
   const profile=LimitBreak.profile(id),damageSteps=[];
   let damage=70;
   for(const hit of profile?.combo?.values()??[]){damage+=hit;damageSteps.push(damage);}
   return {damageSteps,damage:damage+(profile?.finalStrike.damage??28)};
  },fighter);
  for(const page of pages)await page.evaluate(({moment,damage})=>{
   window.limitResults={};const base=updateFighter;
   updateFighter=(f,raw)=>{
    if(frame===moment&&f.id===0){
     const main=platforms.find(p=>p.main);
     fighters.forEach((p,i)=>{
      Object.assign(p,{x:660+i*65,y:main.y,face:i?-1:1,damage:i?70:100,grounded:true,inv:0,intangible:0,vx:0,vy:0,hitstun:0,hitlag:0,attack:null});
      PlayerStates.enter(p,'Idle');
     });
     LimitBreak.charge(f,100);
     return base(f,{...emptyInput(),shareStock:true,jab:true,special:true,attackHeld:true,specialHeld:true});
    }
    base(f,raw);
   };
   addEventListener('online-frame',e=>{
    if(LimitBreak.active||fighters[1].pendingLaunch&&fighters[1].damage===damage){
     limitResults[e.detail]=[frame,matchTime,LimitBreak.scene?.time??null,fighters[1].damage,fighters[1].pendingLaunch?.speed??null];
    }
   });
  },{moment,damage:expected.damage});
  await Promise.all(pages.map(page=>page.waitForFunction(damage=>Object.values(limitResults).some(r=>r[3]===damage),expected.damage)));
  const duration=await host.evaluate(id=>LimitBreak.profile(id)?.duration??0,fighter);
  const snapshots=await Promise.all(pages.map(page=>page.evaluate(cinematic=>Object.fromEntries(Object.entries(limitResults).filter(([,v])=>cinematic?v[2]!==null:v[4]!==null)),duration>0)));
  assert.deepEqual(snapshots[0],snapshots[1]);
  if(duration){
   assert.equal(Object.keys(snapshots[0]).length,duration);
   assert.deepEqual([...new Set(Object.values(snapshots[0]).map(v=>v[3]))],[70,...expected.damageSteps]);
   assert.ok(Object.values(snapshots[0]).every(v=>v[4]===null),'cinematic hits keep launch reserved for the finisher');
  }
  else assert.ok(Object.values(snapshots[0]).some(v=>v[2]===null&&v[4]>0),'instant launch without a cinematic');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({fighter,matchingFrames:Object.keys(snapshots[0]).length,hostSettingSynced:true,errors}));
 }finally{for(const page of pages)await page.evaluate(()=>Net.leave()).catch(()=>{});await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
