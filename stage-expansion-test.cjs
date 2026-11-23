'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
const StageCatalog=require('./stage-data.js');
const stageIds=process.env.STAGE_TEST_IDS?.split(',');
const stages=StageCatalog.stages.filter(stage=>stage.layout&&(!stageIds||stageIds.includes(stage.id)));
const base=process.env.GAME_URL||'http://127.0.0.1:4173';

async function open(browser,viewport,errors,mobile=false){
 const page=await(await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile})).newPage();
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.AstralEdge?.assetsLoaded,{},{timeout:120000});
 return page;
}

async function pick(page,id){
 await page.click('#stage-details');
 await page.locator('.stage-detail-card[data-stage="'+id+'"]').click();
 assert.equal(await page.locator('#stage').inputValue(),id);
 assert.equal(await page.locator('#stage-list-dialog').evaluate(dialog=>dialog.open),false);
 assert.equal(await page.locator('.stage-card.selected').getAttribute('data-stage'),id);
 await page.waitForFunction(()=>{
  const selected=document.querySelector('.stage-card.selected').getBoundingClientRect();
  const strip=document.querySelector('#stage-strip').getBoundingClientRect();
  return selected.left>=strip.left-3&&selected.right<=strip.right+3;
 });
}

async function local(browser,errors){
 const page=await open(browser,{width:1440,height:900},errors);
 await page.click('#enter-training');
 await page.click('#stage-details');
 assert.equal(await page.locator('.stage-detail-card').count(),StageCatalog.stages.length+1);
 assert(await page.locator('#stage-list-dialog').evaluate((dialog,count)=>dialog.scrollWidth<=dialog.clientWidth&&(count>36||dialog.scrollHeight<=dialog.clientHeight),StageCatalog.stages.length+1));
 const workStages=StageCatalog.stages.filter(stage=>stage.origin);
 assert.equal(new Set(workStages.map(stage=>stage.origin)).size,workStages.length);
 const workNames=await page.evaluate(()=>Roster.selectable.map(fighter=>fighter.origin));
 for(const stage of workStages){
  assert(workNames.includes(stage.origin),stage.name);
  const label=page.locator(`.stage-detail-card[data-stage="${stage.id}"] .stage-detail-origin`);
  assert.equal(await label.textContent(),stage.origin);
 }
 const toggles=page.locator('.stage-random-switch');
 assert.equal(await toggles.count(),StageCatalog.stages.length);
 const included=(stages.find(stage=>stage.platforms.some(platform=>platform.motion))??stages[0]).id;
 for(const input of await toggles.all()){
  if(await input.getAttribute('data-stage')!==included)await input.uncheck();
 }
 assert(await page.locator(`.stage-random-switch[data-stage="${included}"]`).isDisabled());
 assert((await page.locator('#stage-random-count').textContent()).includes('1 / '+StageCatalog.stages.length));
 assert(await page.locator('#stage-list-dialog').evaluate(dialog=>dialog.open));
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>document.activeElement.id==='stage-details');
 await pick(page,'18');
 assert.equal(await page.evaluate(()=>Roster.stageChoice()),'18');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.AstralEdge?.assetsLoaded);
 await page.click('#enter-training');
 await page.click('#stage-details');
 assert.equal(await page.locator('.stage-random-switch:checked').count(),1);
 assert.equal(await page.locator('.stage-random-switch:checked').getAttribute('data-stage'),included);
 await page.keyboard.press('Escape');
 for(const viewport of [{width:390,height:700},{width:844,height:390}]){
  const mobile=await open(browser,viewport,errors,true);
  await mobile.click('#enter-training');
  assert(await mobile.evaluate(()=>document.body.classList.contains('touch-mode')));
  await mobile.click('#stage-details');
  const toggle=mobile.locator('.stage-random-switch[data-stage="18"]');
  await toggle.uncheck();
  assert(!(await toggle.isChecked()));
  assert(await mobile.locator('#stage-list-dialog').evaluate(dialog=>dialog.scrollWidth<=dialog.clientWidth));
  await mobile.locator('.stage-detail-card').last().click();
  assert.equal(await mobile.locator('#stage').inputValue(),stages.at(-1).id);
  await mobile.context().close();
 }

 await pick(page,'random');
 await page.click('#start');
 await page.waitForFunction(stage=>state==='battle'&&activeStage===stage&&countdown===0,included);
 assert(await page.evaluate(()=>training&&StageVisuals.prepared()&&fighters.every(fighter=>fighter.grounded)));
 for(const stage of stages){
  const results=await page.evaluate(async id=>{
   state='pause';
   await StageVisuals.load(id);
   setupStage(id);
   StageVisuals.retain(id);
   const main=platforms.find(p=>p.main);
   const fighter=fighters[0];
   const moved=new Set();
   for(let i=0;i<fighters.length;i++)Object.assign(fighters[i],{x:main.x+main.w*(i+1)/(fighters.length+1),y:main.y,vx:0,vy:0,grounded:true,inv:0});
   const align=platforms.every(p=>{
    const d=StageVisuals.geometry(p);
    return Math.abs(d.y+d.art.walkY*d.scaleY-p.y)<.01&&Math.abs(d.x+d.art.surfaceLeft*d.scaleX-p.x)<.01;
   });
   for(const platform of platforms.filter(p=>p.motion)){
    setupStage(id);
    const index=platforms.findIndex(p=>p.x===platform.x&&p.y===platform.y&&p.motion===platform.motion);
    if(index<0)throw Error('Platform disappeared');
    const p=platforms[index],{x,y,w,motion}=p;
    const period=motion.path?.at(-1)[0]??motion.period;
    const samples=new Map();
    Object.assign(fighter,{x:x+w/2,y,grounded:true,ledge:null,respawn:0});
    let carried=true;
    for(let tick=0;tick<period;tick++){
     StageVisuals.tick();
     if(id==='25'&&tick%45===44)samples.set(tick+1,[p.x,p.y]);
     if(Math.abs(fighter.x-p.x-w/2)>.01||Math.abs(fighter.y-p.y)>.01)carried=false;
     if(Math.abs(p.x-x)+Math.abs(p.y-y)>1)moved.add(index);
    }
    if(!carried||Math.abs(p.x-x)+Math.abs(p.y-y)>.01)return {align,carried,loop:false,tracks:0};
    if(id==='25'){
     const [rightLow,rightHigh,leftLow,leftHigh]=[45,225,315,495].map(t=>samples.get(t));
     if(Math.abs(rightLow[0]-rightHigh[0])>.01||Math.abs(leftLow[0]-leftHigh[0])>.01||
       rightLow[1]<=rightHigh[1]||leftLow[1]<=leftHigh[1]||
       Math.abs(samples.get(270)[0]-x)>.01||Math.abs(samples.get(270)[1]-y)>.01)throw Error('The clock hand did not trace both loops');
    }
   }
   setupStage(id);
   if(id==='40'){
    const braking=(stage)=>{
     setupStage(stage);
     const floor=platforms.find(p=>p.main),runner=makeFighter(0,0,'dragoon');
     Object.assign(runner,{x:floor.x+floor.w/2,y:floor.y,vx:runner.character.runSpeed,vy:0,grounded:true});
     PlayerStates.enter(runner,'Run');
     updateFighter(runner,emptyInput());
     return runner.character.runSpeed-runner.vx;
    };
    if(Math.abs(braking(id)-braking('0')*0.72)>.0001)throw Error('Snowdin braking is not reduced');
    setupStage(id);
   }
   let lands=true;
   for(const platform of platforms.filter(p=>!p.main)){
    Object.assign(fighter,{x:platform.x+platform.w/2,y:platform.y-6,vx:0,vy:9,grounded:false,ledge:null,respawn:0,inv:0});
    updateFighter(fighter,emptyInput());
    if(!fighter.grounded||Math.abs(fighter.y-platform.y)>.01)lands=false;
   }
   if(id==='19'){
    const under=platforms[1];
    for(const direction of [-1,1]){
     const traveller=makeFighter(0,0,'doshin');
     const entry=direction>0?main.x-100:main.x+main.w+100;
     const exit=direction>0?main.x+main.w+50:main.x-50;
     Object.assign(traveller,{x:entry,y:under.y,vx:0,vy:0,grounded:true});
     PlayerStates.enter(traveller,'Idle');
     for(let tick=0;tick<240&&direction*(traveller.x-exit)<0;tick++){
      updateFighter(traveller,{...emptyInput(),x:direction});
      if(!traveller.grounded||traveller.y!==under.y)throw Error('Lost footing under the salt pier');
     }
     if(direction*(traveller.x-exit)<0)throw Error('Could not cross under the salt pier');
    }
   }
   fighters.forEach((f,i)=>Object.assign(f,{x:main.x+main.w*(i+1)/(fighters.length+1),y:main.y,vx:0,vy:0,grounded:true,inv:0}));
   if(id==='21')for(let n=0;n<70;n++)StageVisuals.tick();
   render();
   return {align,lands,loop:true,tracks:moved.size};
  },stage.id);
  assert.deepEqual(results,{align:true,lands:true,loop:true,tracks:stage.platforms.filter(p=>p.motion).length},stage.name);
  const response=await page.request.get(new URL('/api/audio/bgm?stage='+stage.id,base).href);
  assert(response.ok());
  const {tracks}=await response.json();
  assert.equal(tracks.length,1);
  const seconds=await page.evaluate(async url=>{
   const context=new OfflineAudioContext(2,1,44100);
   const response=await fetch(url);
   if(!response.ok)throw Error('BGM '+response.status);
   return (await context.decodeAudioData(await response.arrayBuffer())).duration;
  },tracks[0].url);
  assert(seconds>=19);
  if(process.env.STAGE_QA_DIR){
   fs.mkdirSync(process.env.STAGE_QA_DIR,{recursive:true});
   await page.locator('#game').screenshot({path:path.join(process.env.STAGE_QA_DIR,stage.id+'.png')});
  }
 }
 await page.context().close();
}

async function online(browser,errors,id){
 const pages=await Promise.all(['Lickey','えだ'].map(async name=>{
  const page=await open(browser,{width:1280,height:760},errors);
  if(!await page.locator('#online-room').evaluate(dialog=>dialog.open))await page.click('#enter-online');
  await page.click('[data-online-name="'+name+'"]');
  return page;
 }));
 const [host,guest]=pages;
 await host.click('#open-room-create');
 await host.click('#create-room');
 await host.waitForFunction(()=>Net.code.length===6);
 await guest.click('.room-code-entry summary');
 await guest.fill('#room-code',await host.evaluate(()=>Net.code));
 await guest.click('#join-room');
 await guest.waitForFunction(()=>Net.code.length===6);
 for(const page of pages){
  if(await page.locator('#online-room').evaluate(dialog=>dialog.open))await page.click('#edit-online-lineup');
  await page.click('#stage-details');
  const switches=page.locator(id==='13'?'.stage-random-switch:not([data-stage="13"])':'.stage-random-switch[data-stage="18"]');
  for(const input of await switches.all())await input.uncheck();
  await page.keyboard.press('Escape');
  await pick(page,id==='13'?'random':id);
  await page.evaluate(()=>{
   window.stageFrames=[];
   addEventListener('online-frame',event=>stageFrames.push([event.detail,StageVisuals.clock,platforms.map(p=>[p.x,p.y]),fighters.map(f=>[f.x,f.y])]));
  });
  await page.click('#open-room');
  await page.click('#ready-room');
 }
 await Promise.all(pages.map(page=>page.waitForFunction(stage=>Net.active&&activeStage===stage&&countdown===0&&StageVisuals.clock>=75,id,{timeout:60000})));
 const [a,b]=await Promise.all(pages.map(page=>page.evaluate(()=>stageFrames.filter(snapshot=>snapshot[1]>0))));
 const hostFrames=new Map(a.map(row=>[row[0],row]));
 const shared=b.filter(row=>hostFrames.has(row[0]));
 assert(shared.length>=60);
 for(const row of shared)assert.deepEqual(hostFrames.get(row[0]),row);
 await host.evaluate(()=>Net.leave());
 await guest.waitForFunction(()=>!Net.code&&!Net.active);
 await Promise.all(pages.map(page=>page.context().close()));
 return shared.length;
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{
  const errors=[];
  if(process.env.STAGE_TEST_MODE!=='online'){
   await local(browser,errors);
   console.log('Local: '+stages.length+' stages, landing and moving riders, BGM decode, desktop and narrow stage picker.');
  }
  if(process.env.STAGE_TEST_MODE!=='local'){
   for(const id of (process.env.STAGE_ONLINE_IDS?.split(',')||['13','18','20','21','25','28','30','32','33','35','37','39','40','43','44','47','49']))console.log('Online stage '+id+': '+await online(browser,errors,id)+' synchronized frames.');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
