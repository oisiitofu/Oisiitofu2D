require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../../previews'),{recursive:true});
const fs=require('fs'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});try{
 const pages=await Promise.all([b.newContext(),b.newContext()].map(async c=>(await c).newPage())),errors=[];
 for(const p of pages){p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await p.click('#enter-online');await p.click('[data-id="donchan"]');}
 await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);
 const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);
 await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown<=0)));
 const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
 for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{
  window.donSnapshots={};addEventListener('online-frame',e=>{
   const n=e.detail-target,key=(code,down)=>{if(slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));},place=(x=500,y=560)=>{
    for(const c of['KeyX','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])key(c,false);
    fighters=[makeFighter(0,0,'donchan'),makeFighter(1,2,'donchan')];DonchanRules.reset();MoogleRules.reset();
    for(const f of fighters)Object.assign(f,{x:f.id?1800:x,y:f.id?560:y,vx:0,vy:0,inv:0,intangible:0,hitstun:0,hitlag:0,respawn:0,stocks:99,grounded:!!f.id||y===560,ledgeCooldown:0,face:f.id?-1:1,gravityOff:!!f.id});hitstop=0;
   };
   if(n===0){place();attack(fighters[0],'dragon');key('KeyX',true);}if(n===45)key('KeyX',false);
   if(n===100){place();attack(fighters[0],'dash');}
   if(n===200){place(170,690);attack(fighters[0],'rise');key('ArrowUp',true);}
   if(n>=200&&n<325){const f=fighters[0],a=f.attack,p=platforms.find(p=>p.main),right=a?.escapeSide?a.escapeSide>0:f.x<p.x+p.w/2;key('ArrowRight',right);key('ArrowLeft',!right);key('KeyX',a?.phase==='ride'&&f.y<p.y-35&&f.timer-a.rideAt>14);}
   if(n===350){place();fighters[0].donSoul=100;attack(fighters[0],'gale');}
   if(n===400){place(700,250);attack(fighters[0],'rise');key('ArrowRight',true);}if(n===424)key('KeyX',true);if(n===425)key('KeyX',false);
   if(n===440){place(700,250);attack(fighters[0],'rise');}
   if(n===451){const q=DonchanRules.objects.find(q=>q.kind==='balloon');if(q)MoogleRules.spawn(fighters[1],{kind:'fire',x:q.x,y:q.y,vx:0,vy:0,radius:8,damage:8,life:20});}
   if(n===480){fighters[0].donSoul=80;fighters[0].donMaxTime=200;fighters[0].stocks=98;ko(fighters[0]);}
   if(n>=0&&n<=500)donSnapshots[n]={fighters:fighters.map(f=>({id:f.characterId,x:f.x,y:f.y,vx:f.vx,vy:f.vy,damage:f.damage,shield:f.shield,stocks:f.stocks,mode:f.mode,grounded:f.grounded,ledge:!!f.ledge,pose:pose(f),soul:f.donSoul,max:f.donMaxTime,attack:f.attack&&{type:f.attack.type,timer:f.timer,phase:f.attack.phase,pose:f.attack.pose,punctured:f.attack.punctured,chargeFrames:f.attack.chargeFrames,total:f.attack.totalFrames}})),objects:[...DonchanRules.objects.map(q=>({...q,hits:[...q.hits]})),...MoogleRules.objects.map(q=>({...q,hits:[...q.hits]}))]};
   if(slot===0)Net.capture();
  });
 },{target,slot});
 await pages[0].bringToFront();await Promise.all(pages.map(p=>p.waitForFunction(()=>donSnapshots[500],null,{timeout:45000})));
 const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>donSnapshots))),checks=[],check=(name,pass)=>checks.push({name,pass:!!pass}),all=Object.values(snapshots[0]);
 for(const[n,s]of Object.entries(snapshots[0]))check('lockstep frame '+n,JSON.stringify(s)===JSON.stringify(snapshots[1][n]));
 check('server accepts donchan',snapshots[0][0].fighters.every(f=>f.id==='donchan'));
 check('charged note online',all.some(s=>s.objects.some(q=>q.kind==='note'&&q.big)));
 check('distant rhythm pulse after owner recovers',all.some(s=>!s.fighters[0].attack&&s.objects.some(q=>q.kind==='laneNote'&&q.ordinal===2)));
 check('real recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<330&&(s.fighters[0].grounded||s.fighters[0].ledge)));
 check('soul maximum activation online',all.some(s=>s.fighters[0].max>550&&s.fighters[0].soul===0));
 check('manual balloon pop online',Object.entries(snapshots[0]).some(([n,s])=>n>=424&&n<440&&s.fighters[0].attack?.phase==='eject'&&s.fighters[0].soul===10));
 check('opponent punctures balloon online',all.some(s=>s.fighters[0].attack?.punctured));
 check('KO clears soul and buff online',snapshots[0][500].fighters[0].soul===0&&snapshots[0][500].fighters[0].max===0);
 fs.writeFileSync('.tools/donchan-online-results.json',JSON.stringify({checks,errors,snapshots},null,2));console.log(JSON.stringify({checks:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
