const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']}),errors=[];try{
 const pages=[],ids=['leanne','nargacuga'];
 for(let slot=0;slot<2;slot++){const c=await b.newContext(),p=await c.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.stack));await p.goto(process.env.GAME_URL||'http://localhost:4181');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:120000});await p.click('#enter-online');await p.click('[data-online-name="'+['Lickey','えだ'][slot]+'"]');}
 await pages[0].click('#open-room-create');await pages[0].selectOption('#create-player-count','2');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);
 await pages[1].click('.room-code-entry summary');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);
 for(let slot=0;slot<2;slot++){await pages[slot].click('[data-id="'+ids[slot]+'"]');await pages[slot].evaluate(()=>{document.querySelector('#stage').value='0';document.querySelector('#stage').dispatchEvent(new Event('change'));if(!document.querySelector('#online-room').open)document.querySelector('#online-room').showModal();});}
 for(const p of pages)await p.click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown===0,null,{timeout:120000})));
 const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
 for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({slot,target})=>{
  window.routeLedgeSnapshots={};const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
  function actors(kind='ground'){
   fighters.forEach((f,k)=>{f.attack=null;f.buffer=null;f.ledge=null;PlayerStates.enter(f,kind==='descend'?'Fall':'Idle');const face=k?-1:1,l=StageRules.ledges.find(l=>l.face===face);Object.assign(f,{x:kind==='ground'?500+k*400:l.x+face*5,y:kind==='descend'?l.y-12:l.y,face,grounded:kind!=='descend',vx:kind==='ground'?0:-face*20,vy:kind==='descend'?26:0,gravityOff:kind==='descend',inv:0,intangible:0,respawn:0,hitlag:0,hitstun:0,pendingLaunch:null,stocks:99,recovered:false,helpless:false,ledgeCooldown:0,ledgeExitSide:0,ledgeGrabs:0,newSideUsed:false,newDownUsed:false});});fighters[0].leanneIS=0;
  }
  addEventListener('online-frame',e=>{const n=e.detail-target;if(n===0){LeanneRules.reset();NargacugaRules.reset();actors();}
   if(n===20&&slot===0){key('ArrowRight',true);key('KeyX',true);}if(n===33&&slot===0)key('KeyX',false);if(n===38&&slot===0)key('KeyX',true);if(n===42&&slot===0){key('KeyX',false);key('ArrowRight',false);}
   if(n===80)actors('descend');if(n===120)actors('runoff');
   if(n>=0&&n<=155)routeLedgeSnapshots[n]={fighters:fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,grounded:f.grounded,ledge:!!f.ledge,exit:f.ledgeExitSide,is:f.leanneIS,attack:f.attack&&{type:f.attack.type,phase:f.attack.phase,timer:f.timer,goal:f.attack.goal}})),objects:LeanneRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age}))};Net.capture();
  });
 },{slot,target});
 await pages[0].bringToFront();await Promise.all(pages.map(p=>p.waitForFunction(()=>routeLedgeSnapshots[155],null,{timeout:70000})));
 const traces=await Promise.all(pages.map(p=>p.evaluate(()=>routeLedgeSnapshots)));for(let n=0;n<=155;n++)assert.deepEqual(traces[0][n],traces[1][n],'synchronized frame '+n);
 const trace=Object.values(traces[0]);assert(trace.some(s=>s.fighters[0].attack?.phase==='route'&&s.fighters[0].is===0),'actual free zero IS route');assert(trace.slice(81,86).some(s=>s.fighters.every(f=>f.ledge)),'both descending catches');assert(trace.slice(121,125).every(s=>s.fighters.every(f=>!f.ledge&&f.exit)),'ground run-off remains free');assert.deepEqual(errors,[]);
 fs.mkdirSync('previews/idle-ledge',{recursive:true});fs.writeFileSync('previews/idle-ledge/online-trace.json',JSON.stringify(traces[0]));const report={peers:2,identicalFrames:156,characters:ids,zeroISRoute:true,descendingCatch:true,freeRunoff:true,errors};fs.writeFileSync('previews/idle-ledge/online.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));for(const p of pages)await p.evaluate(()=>Net.leave());
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
