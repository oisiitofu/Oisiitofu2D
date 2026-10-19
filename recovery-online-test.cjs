'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=await Promise.all([b.newContext(),b.newContext()].map(async c=>(await c).newPage())),errors=[];
 for(const p of pages){p.on('pageerror',e=>errors.push(e.stack));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-online');}
 await pages[0].click('#open-room-create');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('.room-code-entry summary');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);
 for(const p of pages){await p.click('[data-id="krystal"]');await p.click('#open-room');}await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown<=0)));
 for(const p of pages)await p.evaluate(async()=>{await ArtLoader.prepare(['krystal','noctis','kasane','neku','melia','hanajd'].map(character=>({character,color:0})));});
 const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
 for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{
  window.recoverySnapshots={};const key=(code,down)=>{if(slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
  const place=(id,x=80,y=300)=>{for(const k of['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyX','ShiftLeft'])key(k,false);setupStage('0');fighters=[makeFighter(0,0,id),makeFighter(1,1,id)];for(const f of fighters)Object.assign(f,{x:f.id?1700:x,y,grounded:false,vx:0,vy:0,inv:0,intangible:0,hitlag:0,hitstun:0,respawn:0,ledgeCooldown:1000,stocks:99});fighters[1].gravityOff=true;hitstop=0;};
  addEventListener('online-frame',e=>{const n=e.detail-target;
   if(n===0){place('krystal');fighters[0].vy=18;fighters[0].fastFall=true;attack(fighters[0],'rise');key('KeyX',true);}if(n===28){key('KeyX',false);key('ArrowRight',true);}
   if(n===100){place('noctis');attack(fighters[0],'rise');key('ArrowRight',true);}
   if(n===160){place('kasane');attack(fighters[0],'rise');key('ArrowRight',true);}
   if(n===190){place('neku');attack(fighters[0],'rise');key('ArrowRight',true);}if(n===220){place('melia',80,700);attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===290)key('ArrowUp',false);
   if(n===330){place('melia',700,560);fighters[0].grounded=true;key('ArrowRight',true);key('ShiftLeft',true);}
   if(n===360){place('hanajd',700,300);attack(fighters[0],'rise');key('ArrowUp',true);}
   if(n>=0&&n<=405&&n%5===0)recoverySnapshots[n]=fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,pose:pose(f),attack:f.attack?.type,hold:f.attack?.hold,charge:f.attack?.chargeFrames,phase:f.attack?.phase,warpTarget:f.attack?.warpTarget,exit:f.attack?.exit,rocket:!!f.attack?.rocketStarted,flight:!!f.attack?.flightStarted,recovered:f.recovered}));if(slot===0)Net.capture();
  });
 },{target,slot});
 await pages[0].bringToFront();await Promise.all(pages.map(p=>p.waitForFunction(()=>recoverySnapshots[405],null,{timeout:25000})));const data=await Promise.all(pages.map(p=>p.evaluate(()=>recoverySnapshots))),checks=[],check=(name,pass)=>checks.push({name,pass:!!pass});
 for(const n of Object.keys(data[0]))check('independent clients agree '+n,JSON.stringify(data[0][n])===JSON.stringify(data[1][n]));const s=data[0];check('Krystal charge does not drop',s[20][0].hold&&s[20][0].y<310);check('Krystal launches',s[50][0].rocket&&s[50][0].vy<0);check('Noctis horizontal target',Math.abs(s[110][0].warpTarget.y-s[110][0].y)<1);check('Noctis arrives sideways',s[120][0].x>280&&s[120][0].y>290);check('Kasane horizontal target',Math.abs(s[165][0].exit.y-s[165][0].y)<1);check('Neku horizontal target',Math.abs(s[200][0].warpTarget.y-s[200][0].y)<1);check('Melia tap continues flying',s[275][0].flight&&s[275][0].y<400);check('Melia walk uses only walk poses',[335,340,345,350,355].every(n=>[24,25,26].includes(s[n][0].pose)));check('Hanajd ascent uses cleaned art',Object.values(s).some(v=>v[0].id==='hanajd'&&v[0].pose===45));
 const result={checks:checks.length,failures:checks.filter(c=>!c.pass),errors};fs.writeFileSync('previews/recovery-online-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));assert.deepEqual(result.failures,[]);assert.deepEqual(errors,[]);
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
