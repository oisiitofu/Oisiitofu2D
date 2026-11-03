'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{
  const pages=[],errors=[],ids=['cubivore','diana'];
  for(let n=0;n<2;n++){
   const c=await b.newContext(),p=await c.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.message));
   await p.goto(process.env.GAME_URL||'http://localhost:4182');
   await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:90000,polling:100});
   if(!await p.locator('#online-room').evaluate(d=>d.open))await p.click('#enter-online');
   await p.click('[data-online-name="'+(n?'えだ':'Lickey')+'"]');
  }
  await pages[0].click('#open-room-create');await pages[0].click('#create-room');
  await pages[0].waitForFunction(()=>Net.code.length===6);
  const code=await pages[0].evaluate(()=>Net.code);
  await pages[1].click('.room-code-entry summary');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');
  await pages[1].waitForFunction(()=>Net.code.length===6);
  for(const [n,p] of pages.entries()){
   await p.click('[data-id="'+ids[n]+'"]');
   await p.evaluate(()=>{document.querySelector('#stage').value='0';document.querySelector('#stage').dispatchEvent(new Event('change'));if(!document.querySelector('#online-room').open)document.querySelector('#online-room').showModal();});
  }
  for(const p of pages)await p.click('#ready-room');
  await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown===0,null,{timeout:30000,polling:100}))).catch(async error=>{ console.error(errors,await Promise.all(pages.map(p=>p.evaluate(()=>({state,countdown,active:Net.active,room:Net.room,status:document.querySelector('#online-room').innerText.slice(-900)})))));throw error;});
  for(const p of pages)assert.deepEqual(await p.evaluate(()=>fighters.map(f=>f.characterId)),ids);
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+65;
  for(const [slot,p] of pages.entries())await p.evaluate(({target,slot})=>{
   window.cubDianaTrace=[];
   const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
   addEventListener('online-frame',e=>{
    const n=e.detail-target;
    if(n===0){
     fighters.forEach((f,i)=>{
      f.attack=null;PlayerStates.enter(f,'Idle');
      Object.assign(f,{x:i?765:720,y:platforms.find(p=>p.main).y,face:i?-1:1,grounded:true,vx:0,vy:0,inv:0,intangible:0,hitlag:0,hitstun:0,damage:0});
     });
     if(slot===0)key('KeyX',true);
    }
    if(n===8&&slot===0)key('KeyX',false);
    if(n===43){
     fighters.forEach((f,i)=>{
      f.attack=null;PlayerStates.enter(f,'Idle');
      Object.assign(f,{x:i?880:720,y:platforms.find(p=>p.main).y,face:i?-1:1,grounded:true,vx:0,vy:0,inv:0,intangible:0,hitlag:0,hitstun:0});
     });
     if(slot===1)key('KeyX',true);
    }
    if(n===51&&slot===1)key('KeyX',false);
    if(n===68&&slot===1)key('KeyX',true);
    if(n===77&&slot===1)key('KeyX',false);
    if(n>=0&&n<=108)cubDianaTrace[n]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,damage:f.damage,meat:f.cubivoreMeat?.slice(),marks:{...f.dianaMarks},attack:f.attack?.type,timer:f.timer}));
    if(slot===0)Net.capture();
   });
  },{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>window.cubDianaTrace?.[108],null,{timeout:50000})));
  const [a,c]=await Promise.all(pages.map(p=>p.evaluate(()=>cubDianaTrace)));
  assert.deepEqual(a,c);assert.ok(a.some(f=>f[0].meat?.length),'bite earned meat');
  assert.ok(a.some(f=>Object.keys(f[1].marks).length),'scan exposed the opponent');
  assert.deepEqual(errors,[]);
  console.log('109 synchronized frames for bite, meat and grid hack');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
