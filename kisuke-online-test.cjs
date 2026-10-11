const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']}),errors=[];try{
 const pages=[];for(let n=0;n<2;n++){const c=await b.newContext(),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-online');await p.click('[data-id="kisuke"]');pages.push(p);}
 await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown<=0)));
 const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
 for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.kisukeSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,key=(code,down)=>{if(slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));},place=(x=500,y=560)=>{for(const c of['KeyX','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'])key(c,false);fighters=[makeFighter(0,0,'kisuke'),makeFighter(1,2,'kisuke')];KisukeRules.reset();for(const v of fighters){v.vx=v.vy=v.inv=v.hitlag=v.hitstun=v.intangible=v.respawn=0;v.stocks=99;v.ledgeCooldown=0;}Object.assign(fighters[0],{x,y,grounded:y===560});Object.assign(fighters[1],{x:1800,y:560,grounded:true,gravityOff:true});hitstop=0;};
 if(n===0){place();attack(fighters[0],'dragon');}
 if(n===45){place();attack(fighters[0],'gale');}
 if(n===75)attack(fighters[0],'dragon');
 if(n===115)attack(fighters[0],'gale');
 if(n===145)attack(fighters[0],'dragon');
 if(n===195){place(700,560);fighters[1].x=865;attack(fighters[0],'dash');}
 if(n===212)key('KeyX',true);if(n===213)key('KeyX',false);
 if(n===260){place(170,710);attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if([277,287].includes(n))key('KeyX',true);if([278,288].includes(n))key('KeyX',false);
 if(n===320){place(700,300);attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if([337,349].includes(n))key('KeyX',true);if([340,352].includes(n))key('KeyX',false);
 if(n===370){place(700,300);attack(fighters[0],'airDrop');}
 if(n===410){fighters[0].kisukeSpirit=[10,20,30];fighters[0].respawn=8;}
 if(n>=0&&n<=480)kisukeSnapshots[n]={fighters:fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,damage:f.damage,mode:f.mode,timer:f.timer,attack:f.attack?.type,phase:f.attack?.phase,step:f.attack?.step,pose:pose(f),blade:f.kisukeBlade,spirit:f.kisukeSpirit?.slice(),cooldown:f.kisukeSwitchCooldown,grounded:f.grounded,ledge:!!f.ledge})),objects:KisukeRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age,damage:q.damage,hits:[...q.hits]}))};});},{target,slot});
 await Promise.all(pages.map(p=>p.waitForFunction(()=>kisukeSnapshots[480],null,{timeout:45000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>kisukeSnapshots))),all=Object.values(snapshots[0]);
 fs.writeFileSync('.tools/kisuke-online-results.json',JSON.stringify({frames:all.length,errors,snapshots},null,2));
 for(const[n,s]of Object.entries(snapshots[0]))assert.deepEqual(s,snapshots[1][n],'simulation mismatch '+n);
 assert.ok(all.every(s=>s.fighters.every(f=>f.id==='kisuke')));assert.ok(all.some(s=>s.fighters[0].blade===1));assert.ok(all.some(s=>s.fighters[0].blade===2));assert.ok(all.some(s=>s.objects.some(q=>q.kind==='night')));assert.ok(all.some(s=>s.objects.some(q=>q.kind==='flame')));assert.ok(all.some(s=>s.fighters[0].phase==='finish'));assert.ok(all.some(s=>s.fighters[0].step===3));assert.ok(all.slice(300,365).some(s=>s.fighters[0].ledge||s.fighters[0].grounded));assert.deepEqual(errors,[]);
 fs.writeFileSync('.tools/kisuke-online-results.json',JSON.stringify({frames:all.length,errors,snapshots},null,2));console.log(JSON.stringify({identicalFrames:all.length,bladeSwitch:true,night:true,flame:true,sideReturn:true,rise3:true,recovery:true,errors}));
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
