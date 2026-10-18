const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge',args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']}),contexts=await Promise.all([browser.newContext(),browser.newContext()]),pages=await Promise.all(contexts.map(c=>c.newPage())),errors=[],checks=[];
 const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
 for(const p of pages){p.on('pageerror',e=>errors.push(e.stack));await p.goto((process.env.GAME_URL||'http://localhost:4173'));await p.waitForFunction(()=>AstralEdge.assetsLoaded,{},{timeout:60000});await p.click('#enter-online');}
 await pages[0].click('#open-room-create');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);
 await pages[1].click('.room-code-entry summary');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);for(const p of pages)await p.click('[data-id="dragoon"]');
 if(process.env.MORPHIE_ONLINE)await pages[0].click('[data-id="morphie"]');else if(process.env.AKIRA_ONLINE)await pages[0].click('[data-id="akira"]');else if(process.env.CHEF_ONLINE)await pages[0].click('[data-id="chef"]');else if(process.env.HORSE_ONLINE)await pages[0].click('[data-id="horse"]');else if(process.env.SAKUNA_ONLINE)await pages[0].click('[data-id="sakuna"]');else if(process.env.HASEO_ONLINE)await pages[0].click('[data-id="haseo"]');else if(process.env.TERRARIAN_ONLINE)await pages[0].click('[data-id="terrarian"]');else if(process.env.HEADMASTER_ONLINE)await pages[0].click('[data-id="headmaster"]');else if(process.env.PAWAPURO_ONLINE)await pages[0].click('[data-id="pawapuro"]');else if(process.env.AGUMON_ONLINE)await pages[0].click('[data-id="agumon"]');else if(process.env.TERRY_ONLINE)await pages[0].click('[data-id="terry"]');else if(process.env.VALKYRIE_ONLINE)await pages[0].click('[data-id="valkyrie"]');else if(process.env.ADOL_ONLINE)await pages[0].click('[data-id="adol"]');else if(process.env.HUNTER_ONLINE)await pages[0].click('[data-id="hunter"]');else if(process.env.POKOA_ONLINE)await pages[0].click('[data-id="pokoa"]');else if(process.env.SHIREN_ONLINE)await pages[0].click('[data-id="shiren"]');else if(process.env.LLOYD_ONLINE)await pages[0].click('[data-id="lloyd"]');else if(process.env.SANS_ONLINE)await pages[0].click('[data-id="sans"]');else if(process.env.BOMBERMAN_ONLINE)await pages[0].click('[data-id="bomberman"]');else if(process.env.MIDNA_ONLINE)await pages[0].click('[data-id="midna"]');else if(process.env.NOAH_ONLINE)await pages[0].click('[data-id="noah"]');else if(process.env.RYZA_ONLINE)await pages[0].click('[data-id="ryza"]');else if(process.env.EMMA_ONLINE)await pages[0].click('[data-id="emma"]');else if(process.env.FAYT_ONLINE)await pages[0].click('[data-id="fayt"]');else if(process.env.KOSMOS_ONLINE)await pages[0].click('[data-id="kosmos"]');else if(process.env.WILL_ONLINE)await pages[0].click('[data-id="will"]');else if(process.env.LUKE_ONLINE)await pages[0].click('[data-id="luke"]');else if(process.env.REX_ONLINE)await pages[0].click('[data-id="rex"]');else if(process.env.NAEGI_ONLINE)await pages[0].click('[data-id="naegi"]');else if(process.env.NARUKAMI_ONLINE)await pages[0].click('[data-id="narukami"]');else if(process.env.NEKU_ONLINE)await pages[0].click('[data-id="neku"]');else if(process.env.MAKOTO_ONLINE)await pages[0].click('[data-id="makoto"]');else if(process.env.CLIVE_ONLINE)await pages[0].click('[data-id="clive"]');else if(process.env.NOCTIS_ONLINE)await pages[0].click('[data-id="noctis"]');else if(process.env.ESTELLE_ONLINE)await pages[0].click('[data-id="estelle"]');else if(process.env.REAN_ONLINE)await pages[0].click('[data-id="rean"]');else if(process.env.COLETTE_ONLINE)await pages[0].click('[data-id="colette"]');else if(process.env.LIGHTNING_ONLINE)await pages[0].click('[data-id="lightning"]');else if(process.env.NIA_ONLINE)await pages[0].click('[data-id="nia"]');else if(process.env.RIN_ONLINE)await pages[0].click('[data-id="rin"]');else if(process.env.ZERO_ONLINE)await pages[0].click('[data-id="zero"]');else if(process.env.VIVI_ONLINE)await pages[0].click('[data-id="vivi"]');else if(process.env.GUNDAM_ONLINE)await pages[0].click('[data-id="gundam"]');else if(process.env.OKAMI_ONLINE)await pages[0].click('[data-id="okami"]');else if(process.env.TWOB_ONLINE)await pages[0].click('[data-id="twob"]');else if(process.env.ROXAS_ONLINE)await pages[0].click('[data-id="roxas"]');else if(process.env.RIKI_ONLINE)await pages[0].click('[data-id="riki"]');else if(process.env.MONOKUMA_ONLINE)await pages[0].click('[data-id="monokuma"]');else if(process.env.CHOCOBO_ONLINE)await pages[0].click('[data-id="chocobo"]');else if(process.env.CHIIKAWA_ONLINE)await pages[0].click('[data-id="chiikawa"]');else if(process.env.ULGRIM_ONLINE)await pages[0].click('[data-id="ulgrim"]');else if(process.env.ISAAC_ONLINE)await pages[0].click('[data-id="isaac"]');
 for(const p of pages)await p.click('#open-room');check('room pairs two separate sessions',await pages[1].evaluate(()=>Net.slot===1));
 for(let n=0;n<2;n++)await pages[n].evaluate(n=>{window.networkSnapshots={};addEventListener('online-frame',e=>{const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));if(e.detail===180)key(n?'ArrowLeft':'ArrowRight',true);if(e.detail===285)key(n?'ArrowLeft':'ArrowRight',false);if(e.detail===320&&n===0)key('KeyZ',true);if(e.detail===350)key('KeyZ',false);if([180,240,360].includes(e.detail))networkSnapshots[e.detail]=fighters.map(f=>({x:f.x,y:f.y,vx:f.vx,vy:f.vy,damage:f.damage,stocks:f.stocks,mode:f.mode,timer:f.timer,hitlag:f.hitlag,attack:f.attack?.type}));});},n);
 await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&state==='battle')));check('both players begin match',true);
 await Promise.all(pages.map(p=>p.waitForFunction(()=>networkSnapshots[360],{},{timeout:15000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>networkSnapshots)));for(const frame of [180,240,360])check('identical simulation at frame '+frame,JSON.stringify(snapshots[0][frame])===JSON.stringify(snapshots[1][frame]),snapshots.map(s=>s[frame]));check('both players can move',snapshots[0][240][0].x>550&&snapshots[0][240][1].x<900);check('network attacks deal damage',snapshots[0][360].some(f=>f.damage>0),snapshots[0][360]);
 if(process.env.ESTELLE_ONLINE)for(const p of pages)check('online preserves Estelle',await p.evaluate(()=>fighters[0].characterId==='estelle'&&fighters[0].character.weight===88));
 if(process.env.REAN_ONLINE)for(const p of pages)check('online preserves Rean',await p.evaluate(()=>fighters[0].characterId==='rean'&&fighters[0].character.weight===96));
 if(process.env.COLETTE_ONLINE)for(const p of pages)check('online preserves Colette',await p.evaluate(()=>fighters[0].characterId==='colette'&&fighters[0].character.weight===81));
 if(process.env.LIGHTNING_ONLINE)for(const p of pages)check('online preserves Lightning',await p.evaluate(()=>fighters[0].characterId==='lightning'&&fighters[0].character.weight===94));
 if(process.env.NIA_ONLINE)for(const p of pages)check('online preserves Nia',await p.evaluate(()=>fighters[0].characterId==='nia'&&fighters[0].character.weight===85));
 if(process.env.RIN_ONLINE)for(const p of pages)check('online preserves Lyn',await p.evaluate(()=>fighters[0].characterId==='rin'&&fighters[0].character.weight===86));
 if(process.env.ZERO_ONLINE)for(const p of pages)check('online preserves Zero',await p.evaluate(()=>fighters[0].characterId==='zero'&&fighters[0].character.weight===94));
 if(process.env.VIVI_ONLINE)for(const p of pages)check('online preserves Vivi',await p.evaluate(()=>fighters[0].characterId==='vivi'&&fighters[0].character.weight===78));
 if(process.env.GUNDAM_ONLINE)for(const p of pages)check('online preserves Gundam',await p.evaluate(()=>fighters[0].characterId==='gundam'&&fighters[0].character.weight===112));
 if(process.env.OKAMI_ONLINE)for(const p of pages)check('online preserves Okami',await p.evaluate(()=>fighters[0].characterId==='okami'&&fighters[0].character.weight===89));
 if(process.env.TWOB_ONLINE)for(const p of pages)check('online preserves 2B',await p.evaluate(()=>fighters[0].characterId==='twob'&&fighters[0].character.weight===95));
 if(process.env.ROXAS_ONLINE)for(const p of pages)check('online preserves Roxas',await p.evaluate(()=>fighters[0].characterId==='roxas'&&fighters[0].character.weight===92));
 if(process.env.RIKI_ONLINE)for(const p of pages)check('online preserves Riki',await p.evaluate(()=>fighters[0].characterId==='riki'&&fighters[0].character.weight===88));
 if(process.env.MONOKUMA_ONLINE||process.env.RIKI_ONLINE||process.env.ROXAS_ONLINE||process.env.TWOB_ONLINE||process.env.OKAMI_ONLINE||process.env.GUNDAM_ONLINE||process.env.VIVI_ONLINE||process.env.ZERO_ONLINE||process.env.RIN_ONLINE||process.env.NIA_ONLINE||process.env.LIGHTNING_ONLINE||process.env.COLETTE_ONLINE||process.env.REAN_ONLINE){if(process.env.MONOKUMA_ONLINE)for(const p of pages)check('online preserves Monokuma',await p.evaluate(()=>fighters[0].characterId==='monokuma'&&fighters[0].character.weight===96));
 const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
 for(const p of pages)await p.evaluate(target=>{window.objectSnapshots={};addEventListener('online-frame',e=>{const rules=fighters[0].characterId==='rean'?ReanRules:fighters[0].characterId==='colette'?ColetteRules:fighters[0].characterId==='lightning'?LightningRules:fighters[0].characterId==='nia'?NiaRules:fighters[0].characterId==='rin'?RinRules:fighters[0].characterId==='zero'?ZeroRules:fighters[0].characterId==='vivi'?ViviRules:fighters[0].characterId==='gundam'?GundamRules:fighters[0].characterId==='okami'?OkamiRules:fighters[0].characterId==='twob'?TwoBRules:fighters[0].characterId==='roxas'?RoxasRules:fighters[0].characterId==='riki'?RikiRules:MonokumaRules;if(e.detail===target){rules.reset();const f=fighters[0];if(f.characterId==='nia')f.damage=40;if(['twob','okami','gundam','vivi','zero','rin','nia','lightning','colette','rean'].includes(f.characterId)){f.x=500;f.face=1;fighters[1].x=1000;}attack(f,'dragon');f.timer=f.attack.startupFrames;rules.action(f,emptyInput());f.attack=null;}if([target+1,target+45,target+110].includes(e.detail))objectSnapshots[e.detail]={objects:rules.objects.map(o=>({kind:o.kind,x:o.x,y:o.y,age:o.age,burst:o.burst,bounces:o.bounces})),damage:fighters.map(f=>f.damage)};});},target);
 await Promise.all(pages.map(p=>p.waitForFunction(t=>objectSnapshots[t+110],target,{timeout:10000})));const objects=await Promise.all(pages.map(p=>p.evaluate(()=>objectSnapshots)));for(const t of [target+1,target+45,target+110])check('persistent objects synchronized '+t,JSON.stringify(objects[0][t])===JSON.stringify(objects[1][t]));check('network projectile exists',objects[0][target+1].objects.length===(process.env.ROXAS_ONLINE?3:1));if(process.env.NIA_ONLINE)check('network healing applied',objects[0][target+110].damage[0]===39);}
 if(process.env.COLETTE_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.coletteSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   if(n===0){ColetteRules.reset();f.x=500;f.y=560;f.face=1;f.hitlag=f.inv=0;f.grounded=true;o.x=650;o.y=560;o.hitlag=o.inv=0;f.damage=20;attack(f,'dash');}
   if(n===55){f.x=100;f.y=450;f.hitlag=0;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n>62&&n<105&&f.attack?.type==='rise')ColetteRules.action(f,{...emptyInput(),x:n<82?1:-1,y:-.5});
   if([12,26,80,98,115].includes(n))coletteSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,attack:f.attack?.type,damage:f.damage,steals:f.coletteSteals||0,objects:ColetteRules.objects.map(o=>({kind:o.kind,x:o.x,y:o.y,phase:o.phase,age:o.age}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>coletteSnapshots[115],{},{timeout:10000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>coletteSnapshots)));
  check('orbit and flight simulations synchronized',JSON.stringify(snapshots[0])===JSON.stringify(snapshots[1]),snapshots);
  check('network theft heals once',snapshots[0][26].steals===1&&snapshots[0][26].damage===17,snapshots[0][26]);
  check('network flight responds to steering',snapshots[0][80].vx>0&&snapshots[0][98].vx<0,snapshots[0]);
 }
 if(process.env.LIGHTNING_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.roleSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target;if([0,40,80].includes(n)){const f=fighters[0];if(!n)f.damage=40;attack(f,'gale');f.timer=8;LightningRules.action(f);}if([1,41,81].includes(n))roleSnapshots[n]={role:fighters[0].paradigm,ready:fighters[0].paradigmReady,damage:fighters[0].damage};});},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>roleSnapshots[81],{},{timeout:10000})));
  const roles=await Promise.all(pages.map(p=>p.evaluate(()=>roleSnapshots)));
  check('all three paradigms synchronized',JSON.stringify(roles[0])===JSON.stringify(roles[1]),roles);
  check('network paradigm sequence and healing',roles[0][1].role===1&&roles[0][41].role===2&&roles[0][41].damage===38&&roles[0][81].role===0&&roles[0][81].ready,roles[0]);
 }
 if(process.env.ESTELLE_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.estelleSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   if(n===0){EstelleRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=620;f.stats.hits=0;attack(f,'dash');}
   if(n===80){f.attack=null;f.x=100;f.y=500;f.hitlag=f.inv=0;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n===90)dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight'}));
   if(n===110)dispatchEvent(new KeyboardEvent('keyup',{code:'ArrowRight'}));
   if(n===120){f.attack=null;f.x=100;f.y=350;f.vx=f.vy=f.hitlag=0;f.grounded=false;f.recovered=false;f.estelleWheelUsed=false;attack(f,'gale');}
   if(n===135)window.estelleRepeatDenied=!attack(f,'gale');
   if([22,38,65,99,136].includes(n))estelleSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,attack:f.attack?.type,timer:f.timer,hits:f.stats.hits,damage:o.damage,pole:f.attack?.poleReleased,direction:f.attack?.poleDirection,wheel:f.estelleWheelUsed,denied:window.estelleRepeatDenied};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>estelleSnapshots[136],{},{timeout:12000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>estelleSnapshots)));
  for(const n of [22,38,65,99,136])check('Estelle special state synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network side confirms three hits',snapshots[0][65].hits>=3&&snapshots[0][65].damage>15,snapshots[0][65]);
  check('network vault uses release direction',snapshots[0][99].pole&&snapshots[0][99].direction===1&&snapshots[0][99].vx>0,snapshots[0][99]);
  check('network air wheel cannot repeat',snapshots[0][136].wheel&&snapshots[0][136].denied,snapshots[0][136]);
 }
 if(process.env.REAN_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.reanSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   if(n===0){ReanRules.reset();f.attack=null;f.hitlag=f.inv=0;f.x=500;f.y=560;f.grounded=true;attack(f,'gale');f.timer=f.attack.activationFrame;ReanRules.action(f);}
   if(n===20){f.attack=null;f.hitlag=0;f.x=500;f.y=560;f.grounded=true;o.x=600;o.y=560;o.vx=o.vy=o.hitlag=o.inv=0;o.damage=0;o.attack=null;PlayerStates.enter(o,'Idle');attack(f,'dash');}
   if(n===75){f.attack=null;f.x=100;f.y=420;f.hitlag=f.inv=0;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n>=81&&n<=102&&f.attack?.type==='rise')ReanRules.action(f,{...emptyInput(),x:n<92?1:-1});
   if(n===125){f.attack=null;attack(f,'gale');f.timer=16;ReanRules.action(f);}
   if([1,55,83,99,126].includes(n))reanSnapshots[n]={x:f.x,y:f.y,vx:f.vx,face:f.face,attack:f.attack?.type,demon:f.reanDemonTime,cooldown:f.reanDemonCooldown,speed:f.character.runSpeed};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>reanSnapshots[126],{},{timeout:10000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>reanSnapshots)));
  for(const n of [1,55,83,99,126])check('Rean special state synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network demon mode active',snapshots[0][1].demon>0&&snapshots[0][1].cooldown>0);
  check('network side crosses and turns',snapshots[0][55].x>600&&snapshots[0][55].face===-1,snapshots[0][55]);
  check('network spiral responds to direction change',snapshots[0][83].vx>0&&snapshots[0][99].vx<0,snapshots[0]);
  check('network finisher consumes demon mode',snapshots[0][126].demon===0&&snapshots[0][126].cooldown>0);
 }
 if(process.env.CHOCOBO_ONLINE)for(const p of pages)check('online preserves Chocobo',await p.evaluate(()=>fighters[0].characterId==='chocobo'&&fighters[1].characterId==='dragoon'&&fighters[0].character.weight===84));
 if(process.env.CHIIKAWA_ONLINE)for(const p of pages)check('online preserves Chiikawa',await p.evaluate(()=>fighters[0].characterId==='chiikawa'&&fighters[1].characterId==='dragoon'&&fighters[0].character.weight===76));
 if(process.env.ULGRIM_ONLINE)for(const p of pages)check('online preserves Ulgrim',await p.evaluate(()=>fighters[0].characterId==='ulgrim'&&fighters[1].characterId==='dragoon'&&fighters[0].character.weight===104));
 if(process.env.ISAAC_ONLINE)for(const p of pages)check('online preserves different characters',await p.evaluate(()=>fighters[0].characterId==='isaac'&&fighters[1].characterId==='dragoon'&&fighters[0].character.weight===98));

 if(process.env.NAEGI_ONLINE){
  for(const p of pages)check('online preserves Naegi',await p.evaluate(()=>fighters[0].characterId==='naegi'&&fighters[0].character.weight===84));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let index=0;index<2;index++)await pages[index].evaluate(({target,index})=>{window.naegiSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   const place=()=>{NaegiRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;q.recovered=false;q.buffer=null;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=590;f.stats.hits=0;};
   if(n===0){place();o.x=1000;attack(f,'dragon');f.attack.charge=1;f.timer=11;NaegiRules.action(f);f.attack=null;}
   if(n===70){place();attack(f,'dash');}
   if(n===98&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'KeyX'}));if(n===100&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'KeyX'}));
   if(n===150){place();f.x=150;f.y=450;f.grounded=false;attack(f,'rise');}
   if(n===148&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight'}));if(n===184&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'ArrowRight'}));
   if(n===166&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'KeyX'}));if(n===168&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'KeyX'}));
   for(const [t,type] of [[220,0],[280,1],[340,2]])if(n===t){place();f.naegiSupport=type;f.shield=25;o.x=610;attack(f,'gale');f.timer=12;NaegiRules.action(f);f.attack=null;}
   if([1,40,96,108,130,162,178,200,221,241,281,301,341,365].includes(n))naegiSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,attack:f.attack?.type,confirmed:f.attack?.debateConfirmed,second:f.attack?.secondRequested,hits:f.stats.hits,next:f.naegiSupport,cooldown:f.naegiSupportCooldown,shield:f.shield,damage:fighters.map(q=>q.damage),objects:NaegiRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age,type:q.type,vx:q.vx}))};
  });},{target,index});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>naegiSnapshots[365],null,{timeout:15000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>naegiSnapshots)));
  for(const n of [1,40,96,108,130,162,178,200,221,241,281,301,341,365])check('Naegi actions synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network charged evidence projectile',snapshots[0][1].objects.some(q=>q.kind==='shot'&&q.vx===13));
  check('network evidence confirms debate',snapshots[0][96].confirmed===true,snapshots[0][96]);
  check('real network X triggers debate finish',snapshots[0][108].attack==='debateFinish',snapshots[0][108]);
  check('network debate finish hits twice',snapshots[0][130].hits>=2,snapshots[0][130]);
  check('real network X triggers second hop',snapshots[0][178].second===true&&snapshots[0][178].x>290&&snapshots[0][178].y<240,snapshots[0][178]);
  check('network hammer deals damage',snapshots[0][241].damage[1]>0);
  check('network megaphone deals damage',snapshots[0][301].damage[1]>0);
  check('network guard support restores shield',snapshots[0][365].shield>32&&snapshots[0][365].damage[1]===0);
  check('support ordering agrees on both clients',[221,281,341].map(n=>snapshots[0][n].next).join(',')==='1,2,0');
 }
 if(process.env.NARUKAMI_ONLINE){
  for(const p of pages)check('online preserves Narukami',await p.evaluate(()=>fighters[0].characterId==='narukami'&&fighters[0].character.weight===92));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let index=0;index<2;index++)await pages[index].evaluate(({target,index})=>{window.narukamiSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   const place=()=>{NarukamiRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;q.recovered=false;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=710;f.stats.hits=0;};
   if(n===0){place();attack(f,'dragon');f.attack.charge=1;for(const t of [13,19]){f.timer=t;NarukamiRules.action(f);}f.attack=null;}
   if(n===70){place();o.x=710;attack(f,'dash');}
   if(n===98&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'KeyZ'}));if(n===100&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'KeyZ'}));
   if(n===150){place();f.x=150;f.y=550;f.grounded=false;attack(f,'rise');}
   if(n===158&&index===0)for(const code of ['ArrowRight','ArrowUp'])dispatchEvent(new KeyboardEvent('keydown',{code}));if(n===176&&index===0)for(const code of ['ArrowRight','ArrowUp'])dispatchEvent(new KeyboardEvent('keyup',{code}));
   if(n===220){place();attack(f,'gale');f.timer=8;NarukamiRules.action(f);f.attack=null;}
   if(n===250){attack(f,'dragon');for(const t of [13,19]){f.timer=t;NarukamiRules.action(f);}f.attack=null;}
   if(n===310){place();f.narukamiForm=2;f.narukamiFormTime=360;attack(f,'dragon');f.timer=13;NarukamiRules.action(f);f.attack=null;}
   if([1,40,85,103,125,162,177,198,221,251,311,360].includes(n))narukamiSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,attack:f.attack?.type,target:f.attack?.warpTarget,lock:f.attack?.chainConfirmed,hits:f.stats.hits,form:f.narukamiForm,formTime:f.narukamiFormTime,damage:fighters.map(q=>q.damage),objects:NarukamiRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age,family:q.family}))};
  });},{target,index});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>narukamiSnapshots[360],null,{timeout:15000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>narukamiSnapshots)));
  for(const n of [1,40,85,103,125,162,177,198,221,251,311,360])check('Narukami special actions synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network charged Garu launches twice',snapshots[0][1].objects.filter(q=>q.kind==='spell').length===2);
  check('network chain confirms hit',snapshots[0][85].lock===true,snapshots[0][85]);
  check('real network Z triggers chase slash',snapshots[0][103].attack==='chainSlash',snapshots[0][103]);
  check('network chase slash damages twice',snapshots[0][125].hits===2,snapshots[0][125]);
  check('real direction input chooses reappearance',snapshots[0][177].x>250&&snapshots[0][177].y<390,snapshots[0][177]);
  check('network Persona change activates wind',snapshots[0][221].form===1&&snapshots[0][221].formTime>350);
  check('network wind Persona sends two blades',snapshots[0][251].objects.filter(q=>q.kind==='spell').length===2);
  check('network fire Persona changes projectile',snapshots[0][311].objects.some(q=>q.family==='fire'));
 }
 if(process.env.NEKU_ONLINE){
  for(const p of pages)check('online preserves Neku',await p.evaluate(()=>fighters[0].characterId==='neku'&&fighters[0].character.weight===83));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let index=0;index<2;index++)await pages[index].evaluate(({target,index})=>{window.nekuSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   const place=()=>{NekuRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;q.recovered=false;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=710;};
   if(n===0){place();attack(f,'dragon');f.attack.charge=1;f.timer=12;NekuRules.action(f);f.attack=null;}
   if(n===70){place();o.x=680;attack(f,'dash');}
   if(n===94&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'KeyX'}));if(n===96&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'KeyX'}));
   if(n===150){place();f.x=150;f.y=550;f.grounded=false;attack(f,'rise');}
   if(n===152&&index===0)for(const code of ['ArrowRight','ArrowUp'])dispatchEvent(new KeyboardEvent('keydown',{code}));if(n===170&&index===0)for(const code of ['ArrowRight','ArrowUp'])dispatchEvent(new KeyboardEvent('keyup',{code}));
   if([220,280].includes(n)){place();o.x=n===220?580:770;attack(f,'gale');f.attack.charge=n===220?0:1;f.timer=15;NekuRules.action(f);f.attack=null;}
   if([1,40,82,99,105,130,160,174,195,235,295,320].includes(n))nekuSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,attack:f.attack?.type,target:f.attack?.warpTarget,lock:f.attack?.lockedTarget,hits:f.stats.hits,damage:fighters.map(q=>q.damage),objects:NekuRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age,charge:q.charge}))};
  });},{target,index});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>nekuSnapshots[320],null,{timeout:15000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>nekuSnapshots)));
  for(const n of [1,40,82,99,105,130,160,174,195,235,295,320])check('Neku psychic actions synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network charged fire path',snapshots[0][1].objects.filter(q=>q.kind==='flame').length===5);
  check('network lock confirms target',snapshots[0][82].lock===1,snapshots[0][82]);
  check('real network X branches to throw',snapshots[0][105].attack==='psyThrow'||snapshots[0][99].attack==='psyThrow',snapshots[0][105]);
  check('real network directions adjust teleport target',snapshots[0][160].target?.x>150,snapshots[0][160]);
  check('network teleport changes position',snapshots[0][174].x>200&&snapshots[0][174].y<400,snapshots[0][174]);
  check('network near and far lightning hit',snapshots[0][235].damage[1]>0&&snapshots[0][295].damage[1]>0);
 }
 if(process.env.MAKOTO_ONLINE){
  for(const p of pages)check('online preserves Makoto',await p.evaluate(()=>fighters[0].characterId==='makoto'&&fighters[0].character.weight===86));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let index=0;index<2;index++)await pages[index].evaluate(({target,index})=>{window.makotoSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   const place=()=>{MakotoRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=710;};
   if(n===0){place();attack(f,'dragon');f.attack.charge=1;f.timer=13;MakotoRules.action(f);f.attack=null;}
   if(n===70){place();o.x=650;f.stats.hits=0;attack(f,'dash');}
   if(n===150){place();f.x=720;f.y=450;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n===154&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight'}));if(n===178&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'ArrowRight'}));
   if(n===175)MakotoRules.action(f,{...emptyInput(),special:true,x:1});
   if([220,280].includes(n)){place();o.x=n===220?580:760;attack(f,'gale');f.attack.charge=n===220?0:1;f.timer=17;MakotoRules.action(f);f.attack=null;}
   if([1,40,82,112,130,170,176,235,295,320].includes(n))makotoSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,attack:f.attack?.type,angle:f.attack?.flightAngle,hits:f.stats.hits,damage:fighters.map(q=>q.damage),objects:MakotoRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age,charge:q.charge,target:q.contactTarget}))};
  });},{target,index});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>makotoSnapshots[320],null,{timeout:15000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>makotoSnapshots)));
  for(const n of [1,40,82,112,130,170,176,235,295,320])check('Makoto summon and flight synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network fire spell launched',snapshots[0][1].objects.some(q=>q.kind==='fire'&&q.charge===1));
  check('network summon appears',snapshots[0][82].objects.some(q=>q.kind==='jack'));
  check('network Jack brothers hit twice',snapshots[0][130].hits===2,snapshots[0][130]);
  check('network flight curves to right',snapshots[0][170].vx>5,snapshots[0][170]);
  check('network fresh input ends flight early',snapshots[0][176].timer>=37,snapshots[0][176]);
  check('network close and distant pillars hit',snapshots[0][235].damage[1]>0&&snapshots[0][295].damage[1]>0);
 }
 if(process.env.CLIVE_ONLINE){
  for(const p of pages)check('online preserves Clive',await p.evaluate(()=>fighters[0].characterId==='clive'&&fighters[0].character.weight===101));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.cliveSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   const place=()=>{CliveRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=780;};
   if(n===0){place();attack(f,'dragon');f.attack.charge=1;for(const t of [12,18]){f.timer=t;CliveRules.action(f);}f.attack=null;}
   if([70,130,190].includes(n)){place();o.x=680;attack(f,'dash');}
   if([84,144,204].includes(n)){f.timer=14;CliveRules.action(f,{...emptyInput(),jab:n===84,special:n===144,guardPressed:n===204});}
   if(n===250){place();f.x=720;f.y=250;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n===320){place();f.x=185;f.y=680;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n===395){place();f.x=700;f.y=400;f.grounded=false;o.x=760;attack(f,'gale');}
   if([1,45,85,145,205,277,360,412,425,460].includes(n))cliveSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,attack:f.attack?.type,hook:!!f.attack?.hookConfirmed,ledge:!!f.ledge,damage:fighters.map(q=>q.damage),objects:CliveRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>cliveSnapshots[460],null,{timeout:20000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>cliveSnapshots)));
  for(const n of [1,45,85,145,205,277,360,412,425,460])check('Clive branches, tether, spells synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network charged magic creates two shots',snapshots[0][1].objects.length===2);
  for(const[n,type]of [[85,'sideSlash'],[145,'sideMagic'],[205,'sideBackstep']])check('network side branch '+type,snapshots[0][n].attack===type,snapshots[0][n]);
  check('network upper transitions to wheel',snapshots[0][277].attack==='garudaWheel',snapshots[0][277]);
  check('network tether grabs ledge',snapshots[0][360].ledge,snapshots[0][360]);
  check('network air pile produces shock damage',snapshots[0][460].damage[1]>0,snapshots[0][460]);
 }
 if(process.env.NOCTIS_ONLINE){
  for(const p of pages)check('online preserves Noctis',await p.evaluate(()=>fighters[0].characterId==='noctis'&&fighters[0].character.weight===93));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let index=0;index<2;index++)await pages[index].evaluate(({target,index})=>{window.noctisSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1];
   const place=()=>{for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=560;q.grounded=true;PlayerStates.enter(q,'Idle');}f.x=500;f.face=1;o.x=780;};
   if(n===0){NoctisRules.reset();place();attack(f,'dragon');f.attack.charge=1;f.timer=12;NoctisRules.action(f);f.attack=null;}
   if(n===70){place();o.x=680;attack(f,'dash');}
   if(n===98){f.attack=null;attack(f,'dash');}
   if(n===160){place();f.x=150;f.y=450;f.grounded=false;f.recovered=false;attack(f,'rise');}
   if(n===162&&index===0)dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight'}));
   if(n===185&&index===0)dispatchEvent(new KeyboardEvent('keyup',{code:'ArrowRight'}));
   if([200,240,280].includes(n)){place();attack(f,'gale');f.timer=16;NoctisRules.action(f);f.attack=null;}
   if([1,45,94,106,176,201,241,281,310].includes(n))noctisSnapshots[n]={x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,timer:f.timer,attack:f.attack?.type,anchor:f.attack?.anchorIndex,element:f.noctisElementIndex,side:f.noctisSideUsed,damage:fighters.map(q=>q.damage),objects:NoctisRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,age:q.age,target:q.target,element:q.elementIndex,burst:q.burst}))};
  });},{target,index});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>noctisSnapshots[310],null,{timeout:15000})));
  const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>noctisSnapshots)));
  for(const n of [1,45,94,106,176,201,241,281,310])check('Noctis objects and warps synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network summons five phantom swords',snapshots[0][1].objects.filter(o=>o.kind==='sword').length===5);
  check('network marker anchors to enemy',snapshots[0][94].objects.some(o=>o.kind==='marker'&&o.target===1));
  check('network side recalls and moves',snapshots[0][106].x>590&&!snapshots[0][106].objects.some(o=>o.kind==='marker'),snapshots[0][106]);
  check('network upper chooses right anchor',snapshots[0][176].anchor===2&&snapshots[0][176].x>320,snapshots[0][176]);
  check('network flask cycles all elements',snapshots[0][201].element===1&&snapshots[0][241].element===2&&snapshots[0][281].element===0);
 }

 if(process.env.REX_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.rexSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{RexRules.reset();for(const q of fighters){q.attack=null;q.buffer=null;q.hitlag=q.hitstun=q.intangible=q.inv=q.respawn=q.landingLag=0;q.frozen=q.pendingLaunch=q.ledge=null;q.recovered=q.fastFall=q.tumbling=q.gravityOff=false;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=x;f.y=y;f.face=1;f.grounded=y===560;o.x=1000;};
   if(n===0){place();attack(f,'dash');}
   if(n===30){place();attack(f,'dash');}
   if(n===60){place();attack(f,'dash');}
   if(n===100){place(160,700);attack(f,'rise');}
   if(n===150){place();o.x=705;attack(f,'dragon');}
   if(n===200){place();attack(f,'gale');}
   if(slot===0){if([9,39,69].includes(n))key('KeyX',true);if([11,41,71].includes(n))key('KeyX',false);if(n===36)key('ArrowLeft',true);if(n===43)key('ArrowLeft',false);if(n===66)key('ArrowUp',true);if(n===73)key('ArrowUp',false);if(n===102)key('ArrowRight',true);if(n===121)key('KeyX',true);if(n===123)key('KeyX',false);if(n===134)key('ArrowRight',false);}
   if([7,17,26,47,56,77,86,113,124,130,143,162,170,180,209,223,236].includes(n))rexSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,hitlag:q.hitlag,attack:q.attack?.type,hook:q.attack?.hook,theta:q.attack?.swingAngle,rope:q.attack?.ropeLength,confirm:q.attack?.anchorConfirmed})),side:f.rexSideUsed,roll:f.rexRollUsed};
  });},{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>rexSnapshots[236],null,{timeout:12000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>rexSnapshots)));
  for(const n of Object.keys(snapshots[0]))check('Rex physics and combat synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('network forward combo',snapshots[0][17].fighters[0].attack==='edgeChase',snapshots[0][17]);check('network reversed combo',snapshots[0][47].fighters[0].attack==='edgeReverse',snapshots[0][47]);check('network upward combo',snapshots[0][77].fighters[0].attack==='edgeLift',snapshots[0][77]);
  check('network pendulum attached',snapshots[0][113].fighters[0].rope>0&&snapshots[0][113].fighters[0].hook.x===320);check('network X releases tether',snapshots[0][130].fighters[0].attack!=='rise');check('network anchor pulls opponent',snapshots[0][170].fighters[1].damage>0);check('network rolling arc',snapshots[0][209].fighters[0].y<560);
 }
 if(process.env.LUKE_ONLINE){
  for(const p of pages)check('online preserves Luke',await p.evaluate(()=>fighters[0].characterId==='luke'&&fighters[0].character.weight===96));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.lukeSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{LukeRules.reset();for(const q of fighters){q.attack=null;q.buffer=null;q.hitlag=q.hitstun=q.intangible=q.inv=q.respawn=q.landingLag=0;q.frozen=q.pendingLaunch=q.ledge=null;q.recovered=q.fastFall=q.tumbling=q.gravityOff=false;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=x;f.y=y;f.face=1;f.grounded=y===560;o.x=1000;};
   if(n===0){place();attack(f,'dash');}
   if(n===35){place();attack(f,'dash');}
   if(n===110){place(100,400);attack(f,'rise');}
   if(n===160){place(500,300);attack(f,'rise');}
   if(n===240){place();attack(f,'gale');}
   if(n===280){f.attack=null;f.hitlag=0;f.y=560;f.grounded=true;PlayerStates.enter(f,'Idle');attack(f,'gale');}
   if(n===310){place();o.x=735;attack(f,'dragon');f.attack.charge=1;f.timer=9;LukeRules.action(f);f.attack=null;}
   if(slot===0){if([9,39,58,125,177].includes(n))key('KeyX',true);if([11,41,60,127,179].includes(n))key('KeyX',false);if(n===36)key('ArrowLeft',true);if(n===48)key('ArrowLeft',false);if(n===108)key('ArrowRight',true);if(n===142)key('ArrowRight',false);if(n===176)key('ArrowDown',true);if(n===188)key('ArrowDown',false);}
   if([7,17,26,52,61,68,80,118,129,135,149,173,186,218,235,253,268,285,311,330,345].includes(n))lukeSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,hitlag:q.hitlag,attack:q.attack?.type,direction:q.attack?.flightDirection})),side:f.lukeSideUsed,demon:f.lukeDemonTime,cooldown:f.lukeDemonCooldown,speed:f.character.runSpeed,objects:LukeRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,vx:q.vx,age:q.age}))};
  });},{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>lukeSnapshots[345],null,{timeout:16000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>lukeSnapshots)));
  for(const n of Object.keys(snapshots[0]))check('Luke branches, flight and waves synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('real network X advances combo',snapshots[0][17].fighters[0].attack==='lionAdvance',snapshots[0][17]);
  check('network feint retreats facing forward',snapshots[0][52].fighters[0].attack==='lionFeint'&&snapshots[0][52].fighters[0].x<500,snapshots[0][52]);
  check('third real network X creates roar',snapshots[0][68].fighters[0].attack==='lionFinish',snapshots[0][68]);
  check('upper recovery follows diagonal trajectory',snapshots[0][118].fighters[0].x>120&&snapshots[0][118].fighters[0].y<340,snapshots[0][118]);
  check('real network X adds a horizontal kick',snapshots[0][135].fighters[0].attack==='falconKick'&&snapshots[0][135].fighters[0].vx===10,snapshots[0][135]);
  check('real network down X adds fall branch',snapshots[0][186].fighters[0].attack==='falconFall',snapshots[0][186]);
  check('network demon actually speeds movement',snapshots[0][253].demon>0&&snapshots[0][253].speed>7.3,snapshots[0][253]);
  check('network deactivation restores base speed',snapshots[0][285].demon===0&&snapshots[0][285].speed===7.3&&snapshots[0][285].cooldown>0,snapshots[0][285]);
  check('network charge creates travelling tiger wave',snapshots[0][311].objects.some(q=>q.kind==='tiger'&&q.vx===11),snapshots[0][311]);
  check('network wave hits distant opponent',snapshots[0][345].fighters[1].damage>0,snapshots[0][345]);
 }

 if(process.env.WILL_ONLINE){
  for(const p of pages)check('online preserves Will',await p.evaluate(()=>fighters[0].characterId==='will'&&fighters[0].character.weight===88));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.willSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{WillRules.reset();for(const q of fighters){q.attack=null;q.buffer=null;q.hitlag=q.hitstun=q.intangible=q.inv=q.respawn=q.landingLag=0;q.frozen=q.pendingLaunch=q.ledge=null;q.recovered=q.fastFall=q.tumbling=q.gravityOff=false;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=x;f.y=y;f.face=1;f.grounded=y===560;o.x=1100;};
   if(n===0){place();attack(f,'dash');}
   if(n===70){place(100,430);attack(f,'rise');}
   if(n===135){place();attack(f,'gale');}
   if(n===170){f.attack=null;f.willShiftCooldown=0;attack(f,'gale');}
   if(n===205){f.attack=null;f.willShiftCooldown=0;attack(f,'gale');}
   if(n===240){f.attack=null;attack(f,'dragon');f.attack.charge=1;}
   if(n===290){place();o.x=780;attack(f,'dragon');f.attack.charge=1;}
   if(slot===0){if(n===1)key('ArrowRight',true);if(n===17)key('Space',true);if(n===19)key('Space',false);if(n===39)key('KeyX',true);if(n===41)key('KeyX',false);if(n===48)key('ArrowRight',false);if(n===70)key('ArrowRight',true);if(n===71)key('ArrowUp',true);if(n===77)key('KeyX',true);if(n===79)key('KeyX',false);if(n===85){key('ArrowRight',false);key('ArrowUp',false);}}
   if([7,15,25,37,48,59,79,86,99,119,144,179,214,253,261,276,300,322,340].includes(n))willSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,hitlag:q.hitlag,attack:q.attack?.type,target:q.attack?.flightTarget,mounted:q.attack?.mounted,jumps:q.attack?.jumpsLeft})),side:f.willSideUsed,form:f.willForm,time:f.willFormTime,speed:f.character.runSpeed,objects:WillRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,vx:q.vx,age:q.age,family:q.family,radius:q.radius}))};
  });},{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>willSnapshots[340],null,{timeout:16000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>willSnapshots)));
  for(const n of Object.keys(snapshots[0]))check('Will horse, marker and archetypes synchronized '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));
  check('real network direction accelerates horse',snapshots[0][15].fighters[0].mounted&&snapshots[0][15].fighters[0].vx>2,snapshots[0][15]);
  check('real network jump raises mounted rider',snapshots[0][25].fighters[0].jumps===0&&snapshots[0][25].fighters[0].vy<0,snapshots[0][25]);
  check('real network X dismounts into slash',snapshots[0][48].fighters[0].attack==='horseSlash',snapshots[0][48]);
  check('real network direction moves target',snapshots[0][79].fighters[0].target?.x>240,snapshots[0][79]);
  check('real network X locks target early',snapshots[0][86].fighters[0].timer>16&&snapshots[0][86].fighters[0].y<400,snapshots[0][86]);
  check('network blade flight changes position',snapshots[0][99].fighters[0].x>210&&snapshots[0][99].fighters[0].y<200,snapshots[0][99]);
  check('network Seeker boosts actual movement',snapshots[0][144].form===0&&snapshots[0][144].speed>7.2);
  check('network Warrior slows movement',snapshots[0][179].form===1&&snapshots[0][179].speed<7.2);
  check('network Mage changes neutral action',snapshots[0][253].form===2&&snapshots[0][253].fighters[0].attack==='mageSpell');
  check('network charged Mage casts two elements',snapshots[0][261].objects.length===2&&snapshots[0][261].objects.some(q=>q.family==='ice'),snapshots[0][261]);
  check('network Cyclo is a wide slow wind projectile',snapshots[0][300].objects.some(q=>q.kind==='wind'&&q.radius===32&&q.vx===7),snapshots[0][300]);
  check('network Cyclo hits distant opponent',snapshots[0][340].fighters[1].damage>0,snapshots[0][340]);
 }

 if(process.env.KOSMOS_ONLINE){
  for(const p of pages)check('online preserves KOS-MOS',await p.evaluate(()=>fighters[0].characterId==='kosmos'&&fighters[0].character.weight===106));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.kosmosSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{KosmosRules.reset();for(const q of fighters){q.attack=null;q.buffer=null;q.hitlag=q.hitstun=q.intangible=q.inv=q.respawn=q.landingLag=0;q.frozen=q.pendingLaunch=q.ledge=null;q.recovered=q.fastFall=q.tumbling=q.gravityOff=false;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=x;f.y=y;f.face=1;f.grounded=y===560;o.x=1000;};
   if(n===0){place();o.x=750;attack(f,'dash');}
   if(n===90){place(100,430);attack(f,'rise');}
   if(n===175){place();attack(f,'dragon');f.attack.charge=1;}
   if(n===240){place(500,400);attack(f,'gale');}
   if(n===295){place(500,300);o.x=515;o.y=400;o.grounded=false;attack(f,'gale');}
   if(n===350){place();attack(f,'upsmash');}
   if(slot===0){if(n===25)key('KeyX',true);if(n===27)key('KeyX',false);if(n===91){key('ArrowRight',true);key('ArrowUp',true);}if([106,124].includes(n))key('KeyX',true);if([108,126].includes(n))key('KeyX',false);if(n===137){key('ArrowRight',false);key('ArrowUp',false);}}
   if([10,18,34,45,59,101,110,123,132,141,159,187,195,220,250,262,282,306,316,340,362,379,410].includes(n))kosmosSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,hitlag:q.hitlag,attack:q.attack?.type,confirmed:q.attack?.chainConfirmed,nodes:q.attack?.nodeTargets,steps:q.attack?.stepConfirmed,index:q.attack?.stepIndex})),side:f.kosmosSideUsed,drill:f.kosmosDrillUsed,objects:KosmosRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,vx:q.vx,age:q.age,radius:q.radius,charge:q.charge})),boxes:attackBoxes(f).length};
  });},{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>kosmosSnapshots[410],null,{timeout:18000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>kosmosSnapshots)));
  for(const n of Object.keys(snapshots[0]))check('KOS-MOS chain, nodes, beam and drill synchronize '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));const s=snapshots[0];
  check('network chain confirms contact',s[18].fighters[0].confirmed&&s[18].fighters[1].damage>0,s[18]);
  check('network fresh X selects reel',s[34].fighters[0].attack==='chainReel',s[34]);
  check('network reel pulls and damages target',s[59].fighters[1].damage>10,s[59]);
  check('network input aims first gravity warp',s[110].fighters[0].x>220&&s[110].fighters[0].y<310,s[110]);
  check('network fresh X confirms second node',s[123].fighters[0].steps?.[1]&&s[123].fighters[0].x>320,s[123]);
  check('network fresh X confirms third node',s[141].fighters[0].steps?.[2]&&s[141].fighters[0].x>410,s[141]);
  check('network full charge changes beam hitbox',s[195].objects.some(q=>q.kind==='beam'&&q.radius===19&&q.vx===27),s[195]);
  check('network beam reaches distant target',s[220].fighters[1].damage>20,s[220]);
  check('network air drill falls diagonally',s[250].fighters[0].vx>3&&s[250].fighters[0].vy>10,s[250]);
  check('network drill landing becomes impact',s[262].fighters[0].attack==='drillImpact',s[262]);
  check('network air drill contact bounces attacker',s[306].fighters[1].damage>0&&s[306].fighters[0].vy<0,s[306]);
  check('network G-shell smash has three hitboxes',s[362].boxes===3,s[362]);
 }

 if(process.env.FAYT_ONLINE){
  for(const p of pages)check('online preserves Fayt',await p.evaluate(()=>fighters[0].characterId==='fayt'&&fighters[0].character.weight===92));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.faytSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{FaytRules.reset();for(const q of fighters){q.attack=null;q.buffer=null;q.hitlag=q.hitstun=q.intangible=q.inv=q.respawn=q.landingLag=0;q.frozen=q.pendingLaunch=q.ledge=null;q.recovered=q.fastFall=q.tumbling=q.gravityOff=q.helpless=false;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=x;f.y=y;f.face=1;f.grounded=y===560;o.x=1000;};
   if(n===0){place();attack(f,'dash');}
   if(n===70){place();attack(f,'dash');}
   if(n===130){place(100,430);attack(f,'rise');}
   if(n===220){place();o.x=800;attack(f,'dragon');f.attack.charge=1;}
   if(n===290){place();o.x=630;attack(f,'gale');}
   if(n===350){place(500,350);o.x=585;o.y=370;o.grounded=false;attack(f,'gale');}
   if(n===410){place();attack(f,'downsmash');}
   if(slot===0){if(n===1)key('ArrowRight',true);if(n===9)key('ArrowRight',false);if(n===74)key('KeyA',true);if(n===76)key('KeyA',false);if(n===131)key('ArrowRight',true);if(n===150){key('ArrowRight',false);key('ArrowLeft',true);}if(n===168)key('ArrowLeft',false);}
   if([8,13,18,38,55,80,86,100,118,142,154,166,180,205,230,240,253,265,280,300,304,313,335,360,364,376,400,421,433,470].includes(n))faytSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,hitlag:q.hitlag,attack:q.attack?.type,feint:q.attack?.portalFeint,target:q.attack?.portalTarget,drift:q.attack?.raidVelocity,recoil:q.attack?.kickRecoil,volleys:q.attack?.spellShots})),side:f.faytSideUsed,kick:f.faytKickUsed,objects:FaytRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,radius:q.radius})),boxes:attackBoxes(f).length};
  });},{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>faytSnapshots[470],null,{timeout:18000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>faytSnapshots)));
  for(const n of Object.keys(snapshots[0]))check('Fayt portals, rain, shotgun and kick synchronize '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));const s=snapshots[0];
  check('network door teleports and turns',s[18].fighters[0].x>750,s[18]);
  check('network guard selects feint',s[86].fighters[0].feint&&Math.abs(s[86].fighters[0].x-500)<1&&s[86].boxes===0,s[86]);
  check('network feint returns control',!s[118].fighters[0].attack,s[118]);
  check('network Air Raid rises while steering right',s[154].fighters[0].x>180&&s[154].fighters[0].y<240,s[154]);
  check('network Air Raid changes direction',s[166].fighters[0].vx<0,s[166]);
  check('network Air Raid shoots actual downward energy',s[142].objects.some(q=>q.kind==='rain'&&q.vy>0),s[142]);
  check('network full shotgun has three volleys',s[240].fighters[0].volleys?.length===3,s[240]);
  check('network shotgun hits a distant target',s[280].fighters[1].damage>0,s[280]);
  check('network grounded kick contact causes retreat',s[304].fighters[0].recoil&&s[304].fighters[1].damage>0&&s[304].fighters[0].vx<0,s[304]);
  check('network air kick contact causes recoil bounce',s[364].fighters[0].recoil&&s[364].fighters[1].damage>0&&s[364].fighters[0].vy<0,s[364]);
  check('network Stone Rain has three separate pillars',s[421].boxes===3,s[421]);
 }

 if(process.env.EMMA_ONLINE){
  for(const p of pages)check('online preserves Emma',await p.evaluate(()=>fighters[0].characterId==='emma'&&fighters[0].character.weight===89));
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({target,slot})=>{window.emmaSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{EmmaRules.reset();for(const q of fighters){q.attack=null;q.buffer=null;q.hitlag=q.hitstun=q.intangible=q.inv=q.respawn=q.landingLag=0;q.frozen=q.pendingLaunch=q.ledge=null;q.recovered=q.fastFall=q.tumbling=q.gravityOff=q.helpless=false;q.vx=q.vy=0;q.y=560;q.grounded=true;q.damage=0;PlayerStates.enter(q,'Idle');}f.x=x;f.y=y;f.face=1;f.grounded=y===560;o.x=1000;};
   if(n===0){place();o.x=800;attack(f,'dash');}
   if(n===80){place();attack(f,'dash');}
   if(n===140){place(160,700);attack(f,'rise');}
   if(n===240){place();o.x=810;attack(f,'dragon');f.attack.charge=1;}
   if(n===310){place(720,350);o.x=720;o.y=490;o.grounded=false;attack(f,'gale');}
   if(n===380){place();attack(f,'upsmash');}
   if(n===430){place(720,420);attack(f,'dair');}
   if(n===500){place(100,620);attack(f,'dragon');}
   if(slot===0){if(n===84)key('KeyA',true);if(n===86)key('KeyA',false);if(n===141)key('ArrowLeft',true);if(n===160){key('ArrowLeft',false);key('ArrowRight',true);}if(n===168)key('KeyX',true);if(n===170)key('KeyX',false);if(n===185)key('ArrowRight',false);}
   if([8,15,25,35,56,72,90,96,120,132,150,158,169,177,195,218,250,260,275,295,320,330,335,360,392,405,423,450,459,480,514,529,550].includes(n))emmaSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,hitlag:q.hitlag,attack:q.attack?.type,recall:q.attack?.recalled,hook:q.attack?.hook,rope:q.attack?.ropeLength,omega:q.attack?.swingOmega})),side:f.emmaSideUsed,helm:f.emmaHelmUsed,cooldown:f.emmaKooCooldown,objects:EmmaRules.objects.map(q=>({kind:q.kind,x:q.x,y:q.y,face:q.face,age:q.age,pose:q.pose,recalled:q.recalled,radius:q.radius,damage:q.damage})),boxes:attackBoxes(f).length};
  });},{target,slot});
  await Promise.all(pages.map(p=>p.waitForFunction(()=>emmaSnapshots[550],null,{timeout:20000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>emmaSnapshots)));
  for(const n of Object.keys(snapshots[0]))check('Emma companion, vine, bolt and slam synchronize '+n,JSON.stringify(snapshots[0][n])===JSON.stringify(snapshots[1][n]),snapshots.map(s=>s[n]));const s=snapshots[0];
  check('network Koo flanks without moving Emma',s[15].fighters[0].x===500&&s[15].objects.some(q=>q.kind==='koo'&&q.x>800),s[15]);
  check('network Koo hits distant enemy',s[35].fighters[1].damage>0,s[35]);
  check('network Koo cooldown prevents instant recast',s[56].cooldown>0&&!s[56].fighters[0].attack,s[56]);
  check('network guard recalls Koo',s[96].fighters[0].recall&&s[96].boxes===0,s[96]);
  check('network recalled wolf returns fully',!s[120].objects.length,s[120]);
  check('network vine attaches at stage corner',s[158].fighters[0].hook?.x===320&&s[158].fighters[0].rope>0,s[158]);
  check('network pendulum responds to direction',s[158].fighters[0].omega!==s[169].fighters[0].omega,s[169]);
  check('network fresh X releases to slash or ledge',s[177].fighters[0].attack==='vineFinish'||s[177].fighters[0].mode.startsWith('Ledge'),s[177]);
  check('network charged bolt changes real hitbox',s[250].objects.some(q=>q.kind==='shot'&&q.radius===12&&q.damage===14),s[250]);
  check('network charged bolt damages distant target',s[295].fighters[1].damage>=14,s[295]);
  check('network air Helm rebounds on contact',s[335].fighters[1].damage>0&&s[335].fighters[0].vy<0,s[335]);
  check('network Sakura Storm has tall active hitbox',s[392].boxes===1,s[392]);
  check('network aerial slash landing becomes petal impact',s[450].fighters[0].attack==='petalImpact',s[450]);
  check('network bolt stops at solid stage wall',!s[529].objects.length,s[529]);
 }

 if(process.env.RYZA_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.ryzaSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{RyzaRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?750:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dragon');}
   if(n===45){place();f.ryzaItem={index:1,charged:true};attack(f,'gale');}
   if(n===120){place();f.ryzaItem={index:2,charged:true};attack(f,'gale');}
   if(n===200){place();f.damage=20;f.ryzaItem={index:3,charged:true};attack(f,'gale');}
   if(n===230&&RyzaRules.objects.length){const q=RyzaRules.objects[0];q.y=560;RyzaRules.burst(q);f.x=q.x;f.y=q.y;}
   if(n===275){place();f.ryzaItem={index:0,charged:true};attack(f,'gale');}
   if(n===350){place();o.x=660;attack(f,'dash');f.attack.charge=1;}
   if(n===405){place();o.x=1100;attack(f,'dash');key('KeyX',true);}
   if(n===415)key('KeyA',true);
   if(n===422){key('KeyX',false);key('KeyA',false);}
   if(n===455){place(100,650);attack(f,'rise');}
   if(n===466)key('ArrowRight',true);
   if(n===490){key('ArrowRight',false);key('ArrowLeft',true);}
   if(n===508){key('ArrowLeft',false);key('KeyA',true);}
   if(n===514)key('KeyA',false);
   if(n===560){place(720,320);attack(f,'dair');}
   if([1,23,35,55,78,88,100,130,165,185,210,232,261,285,316,336,362,390,412,416,430,460,475,488,510,519,535,570,605,625].includes(n))ryzaSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,item:q.ryzaItem,selection:q.ryzaSelection,charge:q.attack?.charge,helpless:q.helpless,recovered:q.recovered,serial:q.ryzaFieldSerial})),objects:RyzaRules.objects.map(q=>({kind:q.kind,index:q.index,charged:q.charged,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,life:q.life,bounces:q.bounces,radius:q.radius,healed:q.healed})),boxes:attackBoxes(f).length};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>ryzaSnapshots[625],{},{timeout:20000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>ryzaSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Ryza network simulation '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Ryza',await pages[0].evaluate(()=>fighters[0].characterId==='ryza'));
  check('network synthesis inventory',s[23].fighters[0].item?.index===0,s[23]);
  check('network consumes ice item',!s[55].fighters[0].item&&s[55].objects[0]?.index===1,s[55]);
  check('network ice becomes persistent field',s[100].objects.some(q=>q.kind==='field'&&q.index===1),s[100]);
  check('network flame damages target',s[185].fighters[1].damage>0,s[185]);
  check('network healing reduces damage',s[261].fighters[0].damage<20,s[261]);
  check('network charged swing has active capsule',s[362].boxes===1,s[362]);
  check('network guard cancels held swing',s[416].fighters[0].attack==='swingCancel',s[416]);
  check('network glide responds to both directions',s[488].fighters[0].vx>0&&s[510].fighters[0].vx<0,s[510]);
  check('network fresh guard ends glide',s[519].fighters[0].attack==='glideEnd'||s[519].fighters[0].helpless,s[519]);
  check('network airborne bomb independent',s[570].objects.some(q=>q.kind==='item'&&q.index===0),s[570]);
 }

 if(process.env.NOAH_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.noahSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{NoahRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?660:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dash');}
   if(n===80){place();attack(f,'dash');key('KeyA',true);}
   if(n===88)key('KeyA',false);
   if(n===110){place();o.x=1100;attack(f,'dragon');key('KeyX',true);}
   if(n===157)key('KeyX',false);
   if(n===210){place(100,650);attack(f,'rise');key('ArrowRight',true);}
   if(n===244)key('ArrowRight',false);
   if(n===285){place(302,620);attack(f,'rise');}
   if(n===335){place(500,400);o.x=550;o.y=370;o.grounded=false;attack(f,'rise');}
   if(n===390){place();attack(f,'gale');}
   if(n===440){place(720,320);attack(f,'gale');}
   if(n===535){place(500,400);o.x=550;o.y=420;o.grounded=false;attack(f,'dair');}
   if([1,10,18,22,26,45,60,83,92,120,151,171,190,215,230,250,289,301,315,343,355,380,402,417,451,459,475,500,544,558,585].includes(n))noahSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,charge:q.attack?.charge,tier:q.attack?.tier,lock:q.attack?.lock,target:q.attack?.target,face:q.face,helpless:q.helpless,recovered:q.recovered,rebounds:q.noahRebounds,side:q.noahSideUsed,beat:q.noahBeatUsed})),boxes:attackBoxes(f).length};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>noahSnapshots[585],{},{timeout:20000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>noahSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Noah network simulation '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Noah',await pages[0].evaluate(()=>fighters[0].characterId==='noah'));
  check('network flank crosses locked opponent',s[18].fighters[0].x>s[18].fighters[1].x,s[18]);
  check('network flank turns and hits',s[26].fighters[0].face===-1&&s[26].fighters[1].damage>0,s[26]);
  check('network startup guard feints',s[83].fighters[0].attack==='flankCancel',s[83]);
  check('network hold has no early hit',s[151].fighters[0].charge>.5&&s[151].boxes===0,s[151]);
  check('network overclock tier follows synchronized charge',s[171].fighters[0].tier===(s[171].fighters[0].charge>=.75?2:1),s[171]);
  check('network diagonal up has no free second boost',s[230].fighters[0].rebounds===0&&s[230].fighters[0].recovered,s[230]);
  check('network terrain contact rebounds',s[289].fighters[0].rebounds===1&&s[289].fighters[0].vy<0,s[289]);
  check('network enemy contact rebounds',s[343].fighters[0].rebounds===1&&s[343].fighters[1].damage>0,s[343]);
  check('network ground shockwave active',s[402].boxes===1,s[402]);
  check('network air beat becomes landing impact',s[459].fighters[0].attack==='beatLanding'||s[475].fighters[0].attack==='beatLanding',s[459]);
  check('network dair gives real hit rebound',s[544].fighters[0].attack==='airRebound'&&s[544].fighters[1].damage>0,s[544]);
 }

 if(process.env.MIDNA_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.midnaSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
   const place=(x=500,y=560)=>{MidnaRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?720:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dash');}
   if(n===90){place();attack(f,'dash');key('KeyA',true);}if(n===98)key('KeyA',false);
   if(n===125){place(180,650);attack(f,'dash');}if(n===147)key('Space',true);if(n===155)key('Space',false);
   if(n===205){place(160,700);attack(f,'rise');key('ArrowUp',true);key('ArrowRight',true);}if(n===218){key('ArrowUp',false);key('ArrowRight',false);}
   if(n===275){place(1280,700);attack(f,'rise');key('ArrowUp',true);key('ArrowLeft',true);}if(n===288){key('ArrowUp',false);key('ArrowLeft',false);}
   if(n===345){place();attack(f,'dragon');key('KeyX',true);}if(n===391)key('KeyX',false);
   if(n===450){place();attack(f,'gale');}
   if(n===510){place(720,300);o.x=1100;attack(f,'gale');}
   if([1,10,18,30,48,70,93,103,139,149,165,190,212,219,226,250,282,289,296,320,355,385,400,420,469,482,527,540,560,585].includes(n))midnaSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,charge:q.attack?.charge,target:q.attack?.target,hook:q.attack?.hook,targetId:q.attack?.targetId,aim:q.attack?.warpDirection,face:q.face,helpless:q.helpless,recovered:q.recovered,side:q.midnaSideUsed,crush:q.midnaCrushUsed})),boxes:attackBoxes(f).length};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>midnaSnapshots[585],{},{timeout:20000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>midnaSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Midna network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Midna',await pages[0].evaluate(()=>fighters[0].characterId==='midna'));
  check('network grapple catches foe',s[18].fighters[0].targetId===1&&s[18].fighters[1].damage>0,s[18]);
  check('network startup feint',s[93].fighters[0].attack==='grappleCancel',s[93]);
  check('network terrain tether',!!s[139].fighters[0].hook,s[139]);
  check('network warp vanishes before movement',s[219].fighters[0].x===160&&s[219].fighters[0].recovered,s[219]);
  check('network right warp reaches high destination',s[226].fighters[0].x>320&&s[226].fighters[0].y<560,s[226]);
  check('network left warp reaches high destination',s[296].fighters[0].x<1120&&s[296].fighters[0].y<560,s[296]);
  check('network field holds before damage',s[385].fighters[0].charge>.5&&s[385].boxes===0,s[385]);
  check('network down ground active',s[469].boxes===1,s[469]);
  check('network air crush lands',s[540].fighters[0].attack==='crushLanding'||s[560].fighters[0].attack==='crushLanding',s[540]);
 }

 if(process.env.LLOYD_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.lloydSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down)=>{if(Net.slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{LloydRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?900:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();o.x=700;attack(f,'dragon');}
   if(n===60){place();attack(f,'dash');}if([72,83,96].includes(n))key('KeyX',true);if([74,85,98].includes(n))key('KeyX',false);
   if(n===135){place();attack(f,'dash');key('KeyA',true);}if(n===140)key('KeyA',false);
   if(n===155)key('KeyX',true);if(n===165){place();attack(f,'dash');}if(n===201)key('KeyX',false);
   if(n===220){place(160,700);attack(f,'rise');key('ArrowRight',true);}if(n===243)key('KeyX',true);if(n===249)key('KeyX',false);if(n===275)key('ArrowRight',false);
   if(n===285){place(720,470);o.x=1100;attack(f,'rise');key('ArrowDown',true);}if(n===308)key('KeyX',true);if(n===314){key('KeyX',false);key('ArrowDown',false);}
   if(n===360){place();f.damage=40;attack(f,'gale');}
   if(n===465){place(500,790);attack(f,'rise');key('ArrowLeft',true);}if(n===515){key('ArrowLeft',false);key('ArrowRight',true);}if(n===562)key('ArrowRight',false);
   if([1,11,15,27,45,61,72,75,83,87,96,102,110,128,139,148,168,181,195,205,222,230,242,249,255,270,286,300,312,322,340,361,378,390,410,450,468,480,499,514,531,548,562].includes(n))lloydSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,face:q.face,helpless:q.helpless,recovered:q.recovered,rhythm:q.attack?.rhythm,direction:q.attack?.direction,shifted:q.attack?.shifted,ceiling:q.attack?.ceilingFrames,side:q.lloydSideUsed,cooldown:q.lloydCircleCooldown})),objects:LloydRules.objects.map(q=>({id:q.id,kind:q.kind,owner:q.owner,x:q.x,y:q.y,vx:q.vx,age:q.age,charge:q.charge,healed:q.healed,hits:[...q.hits],hitTimes:q.hitTimes?[...q.hitTimes]:[]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>lloydSnapshots[562],{},{timeout:25000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>lloydSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Lloyd network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Lloyd',await pages[0].evaluate(()=>fighters[0].characterId==='lloyd'));
  check('network ground wave hits',s[27].fighters[1].damage>0,s[27]);
  check('network four fresh rhythm inputs',[75,87,102].every(n=>s[n].fighters[0].rhythm>0)&&s[102].fighters[0].attack==='tigerFinish',[s[75],s[87],s[102]]);
  check('network guard feint',s[139].fighters[0].attack==='tigerCancel',s[139]);
  check('network hold cannot chain',!s[195].fighters[0].attack,s[195]);
  check('network up top branch sails',s[249].fighters[0].attack==='tempestSail'&&s[249].fighters[0].y<560,s[249]);
  check('network up down branch falls',s[312].fighters[0].attack==='tempestDrop',s[312]);
  check('network circle heals once',s[410].fighters[0].damage===36&&s[410].objects.some(q=>q.healed),s[410]);
  check('network underside returns to stage',s[562].fighters[0].y===560,s[562]);
  check('network underside rotation',s[480].fighters[0].ceiling>0&&s[480].fighters[0].y===728&&s[499].fighters[0].y<728,[s[480],s[499]]);
 }

 if(process.env.SANS_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.sansSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down)=>{if(Net.slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{SansRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?760:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dragon');}
   if(n===65)key('KeyX',true);if(n===80){place();attack(f,'dragon');}if(n===155)key('KeyX',false);
   if(n===180){place();attack(f,'dash');}if(n===197)key('KeyX',true);if(n===204)key('KeyX',false);
   if(n===230){place(160,700);attack(f,'rise');}if(n===250){key('ArrowRight',true);key('ArrowUp',true);}if(n===290){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===300)key('KeyX',true);if(n===315){place(1280,700);attack(f,'rise');}if(n===330){key('ArrowLeft',true);key('ArrowUp',true);key('KeyX',false);}if(n===370){key('ArrowLeft',false);key('ArrowUp',false);}
   if(n===385){place();o.x=625;attack(f,'gale');}
   if(n===430){o.vx=4;}
   if([1,12,18,26,40,82,92,98,122,146,155,181,188,194,199,201,205,215,232,240,253,258,275,317,328,332,336,340,360,386,403,415,429,431,437,470].includes(n))sansSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,face:q.face,helpless:q.helpless,recovered:q.recovered,side:q.sansSideUsed,cooldown:q.sansLockCooldown,soul:q.sansSoulTime,target:q.attack?.target,direction:q.attack?.warpDirection,committed:q.attack?.committed,warpFrame:q.attack?.warpFrame,returned:q.attack?.returned})),objects:SansRules.objects.map(q=>({id:q.id,owner:q.owner,kind:q.kind,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,angle:q.angle,hits:[...q.hits],hitTimes:q.hitTimes?[...q.hitTimes]:[]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>sansSnapshots[470],{},{timeout:20000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>sansSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Sans network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Sans',await pages[0].evaluate(()=>fighters[0].characterId==='sans'));
  check('network blaster telegraphs',s[12].objects[0]?.kind==='beam'&&s[12].fighters[1].damage===0,s[12]);
  check('network blaster damage',s[18].fighters[1].damage>0,s[18]);
  check('network channel three shots',[98,122,146].every(n=>s[n].objects.some(q=>q.kind==='beam'&&q.age>6)),[s[98],s[122],s[146]]);
  check('network shortcut horizontal',s[194].fighters[0].x===690&&s[194].fighters[0].y===560,s[194]);
  check('network fresh shortcut returns',[205,215].some(n=>s[n].fighters[0].returned&&s[n].fighters[0].x===500),s[205]);
  check('network soul warp aims right',s[258].fighters[0].x>160&&s[258].fighters[0].y<560,s[258]);
  check('network held up delays',!s[328].fighters[0].committed,s[328]);
  check('network up release aims left',s[340].fighters[0].x<1280&&s[340].fighters[0].y<560,s[340]);
  check('network stationary field safe',s[429].fighters[1].damage===0&&s[429].objects[0]?.kind==='field',s[429]);
  check('network moving soul marked',[431,437].some(n=>s[n].fighters[1].damage>0&&s[n].fighters[1].soul>0),s[437]);
 }

 if(process.env.BOMBERMAN_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.bombermanSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down)=>{if(Net.slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{BombermanRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?720:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dragon');}
   if(n===135){place();BombermanRules.spawn(f,{x:540,y:548});attack(f,'dash');}
   if(n===190)key('KeyX',true);if(n===200){place();attack(f,'dragon');}if(n===255)key('KeyX',false);
   if(n===285){key('ArrowRight',true);key('ArrowUp',true);}if(n===300){place(100,850);attack(f,'rise');}if(n===326)key('KeyX',true);if(n===333)key('KeyX',false);if(n===355){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===375){place();const wall=BombermanRules.spawn(f,{x:300,y:600,vx:12,kicked:true,kickDamage:5,kickHits:new Set()});BombermanRules.spawn(f,{x:230,y:600});}
   if(n===405){place();const q=BombermanRules.spawn(f,{x:600,y:548});BombermanRules.spawn(f,{x:690,y:548});BombermanRules.burst(q);}
   if(n===430){place(720,300);o.x=1100;attack(f,'gale');}
   if([1,12,25,35,75,103,110,115,138,147,161,170,205,220,249,260,270,290,304,312,317,327,333,345,365,376,380,406,412,430,446,455,465,469,490].includes(n))bombermanSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,charge:q.attack?.charge,aim:q.attack?.aim,dropped:q.attack?.dropped,face:q.face,helpless:q.helpless,recovered:q.recovered,side:q.bomberSideUsed,punch:q.bomberPunchUsed})),objects:BombermanRules.objects.map(q=>({id:q.id,owner:q.owner,kind:q.kind,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,life:q.life,power:q.power,kicked:q.kicked,returns:q.returns,hits:[...q.hits],kickHits:q.kickHits?[...q.kickHits]:[]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>bombermanSnapshots[490],{},{timeout:20000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>bombermanSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Bomberman network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Bomberman',await pages[0].evaluate(()=>fighters[0].characterId==='bomberman'));
  check('network bomb persists after action',s[35].objects[0]?.kind==='bomb'&&!s[35].fighters[0].attack,s[35]);
  check('network bomb fuse becomes blast',s[110].objects[0]?.kind==='blast',s[110]);
  check('network kick moves bomb only',s[147].objects[0]?.kicked&&s[147].fighters[0].x===500,s[147]);
  check('network kicked bomb hits and returns',s[161].fighters[1].damage>0&&s[161].objects[0]?.returns===1,s[161]);
  check('network long hold charges without throw',s[249].fighters[0].charge>.5&&!s[249].objects.length,s[249]);
  check('network power throw',s[270].objects[0]?.power,s[270]);
  check('network Louie angle launches',s[317].fighters[0].recovered&&s[317].fighters[0].vy<0&&s[317].fighters[0].x>100,s[317]);
  check('network spring fresh drop',s[333].fighters[0].dropped&&s[333].objects.length===1,s[333]);
  check('network wall reverses',s[376].objects[0]?.returns===1&&s[376].objects[0].vx<0,s[376]);
  check('network chain blast',s[406].objects.filter(q=>q.kind==='blast').length===2,s[406]);
  check('network air down landing explosion',[455,465,469].some(n=>s[n].fighters[0].attack==='punchLanding'&&s[n].objects.some(q=>q.kind==='blast')),s[455]);
 }

 if(process.env.SHIREN_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.shirenSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{ShirenRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?900:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();o.x=720;attack(f,'dragon');}
   if(n===70){place();o.x=720;attack(f,'dash');}
   if(n===150){place();o.x=720;PlayerStates.enter(o,'ShieldHold');attack(f,'dash');key('KeyA',true,1);}if(n===205)key('KeyA',false,1);
   if(n===220){place(160,700);attack(f,'rise');key('ArrowRight',true);}if(n===280)key('ArrowRight',false);
   if(n===300){place();o.x=650;attack(f,'gale');}
   if(n===360){place(500,790);attack(f,'rise');key('ArrowLeft',true);}if(n===390){key('ArrowLeft',false);key('ArrowRight',true);}if(n===465)key('ArrowRight',false);
   if([1,11,16,28,40,71,80,87,95,105,120,140,151,165,180,210,221,233,240,260,280,301,316,320,342,361,375,385,400,420,440,465].includes(n))shirenSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,face:q.face,helpless:q.helpless,recovered:q.recovered,target:q.attack?.targetId,aim:q.attack?.aim,ceiling:q.attack?.ceilingFrames,side:q.shirenSideUsed})),objects:ShirenRules.objects.map(q=>({id:q.id,kind:q.kind,owner:q.owner,x:q.x,y:q.y,vx:q.vx,age:q.age,radius:q.radius,damage:q.damage,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>shirenSnapshots[465],{},{timeout:20000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>shirenSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Shiren network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Shiren',await pages[0].evaluate(()=>fighters[0].characterId==='shiren'));
  check('network herb hits',s[40].fighters[1].damage>0,s[40]);
  check('network staff self pull',[87,95,105].some(n=>s[n].fighters[0].attack==='staffPull'),[s[87],s[95],s[105]]);
  check('network staff moves caster',s[120].fighters[0].x>600,s[120]);
  check('network guard prevents pull',s[180].fighters[0].x===500&&s[180].fighters[1].damage===0,s[180]);
  check('network pot launch direction',s[240].fighters[0].recovered&&s[240].fighters[0].vy<0&&s[240].fighters[0].x>160,s[240]);
  check('network vacuum damages',s[342].fighters[1].damage>0,s[342]);
  check('network underside escaped',s[440].fighters[0].y<560,s[440]);
 }

 if(process.env.POKOA_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.pokoaSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{PokoaRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?900:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();o.x=720;attack(f,'dragon');}
   if(n===70){place();o.x=720;attack(f,'dash');key('ArrowRight',true);}if(n===108){key('Space',true);}if(n===110){key('Space',false);key('ArrowRight',false);}
   if(n===170){place();o.x=720;PlayerStates.enter(o,'ShieldHold');attack(f,'dragon');key('KeyA',true,1);}if(n===225)key('KeyA',false,1);
   if(n===240){place(160,700);attack(f,'rise');key('ArrowRight',true);}if(n===273)key('Space',true);if(n===275)key('Space',false);if(n===338)key('ArrowRight',false);
   if(n===350){place(500,300);attack(f,'gale');key('ArrowRight',true);}if(n===430)key('ArrowRight',false);
   if(n===450){place(500,790);attack(f,'rise');key('ArrowLeft',true);}if(n===480){key('ArrowLeft',false);key('ArrowRight',true);}if(n===580)key('ArrowRight',false);
   if([1,11,16,28,40,71,82,95,108,110,120,140,171,185,200,225,241,252,270,274,286,315,338,351,365,390,415,430,451,464,477,490,510,540,580].includes(n))pokoaSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,mode:q.mode,face:q.face,helpless:q.helpless,recovered:q.recovered,form:PokoaRules.form(q),flap:q.attack?.flapUsed,budget:q.attack?.floatBudget,ceiling:q.attack?.ceilingFrames,side:q.pokoaSideUsed,float:q.pokoaFloatUsed})),objects:PokoaRules.objects.map(q=>({id:q.id,kind:q.kind,owner:q.owner,x:q.x,y:q.y,vx:q.vx,vy:q.vy,ridden:q.ridden,age:q.age,radius:q.radius,damage:q.damage,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>pokoaSnapshots[580],{},{timeout:25000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>pokoaSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Pokoa network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Pokoa',await pages[0].evaluate(()=>fighters[0].characterId==='pokoa'));
  check('network water hits',s[40].fighters[1].damage>0,s[40]);
  check('network Lapras transformation',s[95].fighters[0].form==='lapras',s[95]);
  check('network surf damages',s[108].fighters[1].damage>0,s[108]);
  check('network detached wave',s[110].objects.some(q=>q.kind==='surf'&&!q.ridden)&&!s[110].fighters[0].attack,s[110]);
  check('network shield stops water',s[225].fighters[1].damage===0,s[225]);
  check('network Dragonite ascent',s[270].fighters[0].form==='dragonite'&&s[270].fighters[0].y<550,s[270]);
  check('network single flap',s[286].fighters[0].flap===true,s[286]);
  check('network magnet moves with budget',s[390].fighters[0].budget<40&&s[390].fighters[0].x>550,s[390]);
  check('network magnet ends',s[430].fighters[0].attack!=='gale',s[430]);
  check('network underside escaped',s[540].fighters[0].y<=560,s[540]);
 }

 if(process.env.HUNTER_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.hunterSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{HunterRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?1050:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();o.x=600;attack(f,'dragon');key('KeyX',true);}if(n===25)key('KeyX',false);
   if(n===90){place();o.x=590;attack(f,'dash');}if(n===100){HunterRules.spawn(o,{x:570,y:520,vx:-12,damage:12});}if(n===123)key('KeyX',true);if(n===127)key('KeyX',false);
   if(n===170){place(160,700);attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===225){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===270){place(500,790);attack(f,'rise');key('ArrowLeft',true);key('ArrowUp',true);}if(n===315){key('ArrowLeft',false);key('ArrowRight',true);}if(n===360){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===390){place(160,650);attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===411){key('ArrowRight',false);key('ArrowLeft',true);key('KeyX',true);}if(n===414)key('KeyX',false);if(n===417)key('Space',true);if(n===421){key('ArrowLeft',false);key('ArrowUp',false);key('Space',false);}
   if(n===460){place();o.x=660;attack(f,'gale');key('KeyX',true);key('ArrowRight',true);}if(n===476){key('KeyX',false);key('ArrowRight',false);}
   if(n===530){place();o.x=730;key('KeyA',true,1);}if(n===542)HunterRules.spawn(f,{x:680,y:520,vx:12});if(n===555)key('KeyA',false,1);
   if([1,7,20,26,40,50,70,91,100,106,114,119,136,154,171,180,190,208,226,250,271,283,300,315,330,350,360,391,409,414,421,438,461,470,479,490,510,531,545,555,580].includes(n))hunterSnapshots[n]={fighters:fighters.map(q=>({x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,shield:q.shield,mode:q.mode,face:q.face,helpless:q.helpless,recovered:q.recovered,charge:q.attack?.charge,blocked:q.attack?.blocked,confirmed:q.attack?.confirmed,tether:q.attack?.tether,node:q.attack?.node,route:q.attack?.route?.map(p=>({...p})),reaimed:q.attack?.reaimed,released:q.attack?.released,wall:q.attack?.wall,side:q.hunterSideUsed,pod:q.hunterPod})),objects:HunterRules.objects.map(q=>({id:q.id,kind:q.kind,owner:q.owner,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,radius:q.radius,damage:q.damage,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>hunterSnapshots[580],{},{timeout:25000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>hunterSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Hunter network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Hunter',await pages[0].evaluate(()=>fighters[0].characterId==='hunter'));
  check('network charge grows',s[20].fighters[0].charge>0,s[20]);check('network charged slash hits',s[70].fighters[1].damage>0,s[70]);
  check('network tackle confirms front block',s[106].fighters[0].confirmed&&s[106].fighters[0].blocked,s[106]);check('network tackle followup',s[136].fighters[0].attack==='tackleFinish',s[136]);
  check('network aimed tether',s[190].fighters[0].tether&&s[190].fighters[0].node.x>160,s[190]);check('network wirebug recovery',s[226].fighters[0].y<560,s[226]);
  check('network underside route',s[283].fighters[0].route.length>0,s[283]);check('network underside escapes',s[350].fighters[0].y<=560,s[350]);
  check('network reaim',s[414].fighters[0].reaimed,s[414]);check('network jump release',s[421].fighters[0].released&&!s[421].fighters[0].tether,s[421]);
  check('network slinger ammo selection',s[470].fighters[0].pod===3,s[470]);check('network slinger hit',s[510].fighters[1].damage>0,s[510]);check('network shield rejects pod',s[555].fighters[1].damage===0,s[555]);
 }

 if(process.env.ADOL_ONLINE||process.env.TERRY_ONLINE||process.env.VALKYRIE_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.threeSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],id=f.characterId,rules={adol:AdolRules,terry:TerryRules,valkyrie:ValkyrieRules}[id],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560)=>{rules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?650:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dragon');key('KeyX',true);}if(n===25)key('KeyX',false);
   if(n===90){place();attack(f,'dash');}if(n===120)key('KeyX',true);if(n===125)key('KeyX',false);
   if(n===180){place(500,790);attack(f,'rise');key('ArrowLeft',true);key('ArrowUp',true);}if(n===230){key('ArrowLeft',false);key('ArrowRight',true);}if(n===265){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===280){place(500,400);attack(f,'gale');}if(n===340){place(160,700);if(id==='terry')f.terryMonster=1;attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===395){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===410){place();o.x=730;key('KeyA',true,1);}if(n===422)rules.spawn(f,{x:680,y:520,vx:12});if(n===437)key('KeyA',false,1);
   if([1,10,20,26,40,55,70,91,105,115,124,130,145,160,181,190,205,220,235,250,265,281,295,310,330,341,355,375,395,411,423,437,460].includes(n))threeSnapshots[n]={fighters:fighters.map(q=>({id:q.characterId,x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,shield:q.shield,mode:q.mode,face:q.face,recovered:q.recovered,helpless:q.helpless,charge:q.attack?.charge,origin:q.attack?.origin?{...q.attack.origin}:null,route:q.attack?.route?.map(p=>({...p})),returning:q.attack?.returning,rebounded:q.attack?.rebounded,rebound:q.attack?.reboundKind,escape:q.attack?.escapeSide,confirmed:q.attack?.confirmed,mount:q.attack?.mount,fuel:q.attack?.fuel,gliding:q.attack?.gliding,glide:q.attack?.glideFrames,monster:q.terryMonster,bonus:q.terryScoutBonus})),objects:rules.objects.map(q=>({id:q.id,kind:q.kind,monster:q.monster,owner:q.owner,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,radius:q.radius,damage:q.damage,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>threeSnapshots[460],{},{timeout:25000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>threeSnapshots))),s=all[0],id=await pages[0].evaluate(()=>fighters[0].characterId);
  for(const n of Object.keys(s))check(id+' network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selected '+id,['adol','terry','valkyrie'].includes(id));check('network neutral real hit',s[70].fighters[1].damage>0,s[70]);check('network underside recovery',s[265].fighters[0].y<=560,s[265]);check('network left recovery',s[395].fighters[0].y<=560,s[395]);check('network projectile shield',s[437].fighters[1].damage===0,s[437]);
  if(id==='adol'){check('network pentagram route',s[105].fighters[0].route.length===6,s[105]);check('network early return',s[124].fighters[0].returning,s[124]);check('network earth landing',s[310].fighters[0].y===388&&s[310].fighters[0].attack==='earthImpact',s[310]);}
  if(id==='terry'){check('network scout bonus',s[145].fighters[0].bonus>0,s[145]);check('network change monster',s[295].fighters[0].monster===1,s[295]);check('network panther ride',s[355].fighters[0].mount===1,s[355]);}
  if(id==='valkyrie'){check('network wind confirm',s[115].fighters[0].confirmed,s[115]);check('network trick followup',s[124].fighters[0].attack==='trickFinish',s[124]);check('network feather glide',s[395].fighters[0].gliding,s[395]);}
 }

 if(process.env.AGUMON_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.agumonSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560,ox=650)=>{AgumonRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=q.grabbed=q.grabOwner=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=q.grabImmunity=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?ox:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place();attack(f,'dragon');key('KeyX',true);}if(n===25)key('KeyX',false);
   if(n===90){place(500,560,570);attack(f,'dash');}if(n===115)key('KeyX',true);if(n===118)key('KeyX',false);
   if(n===180){place(500,790);attack(f,'rise');key('ArrowLeft',true);key('ArrowUp',true);}if(n===230){key('ArrowLeft',false);key('ArrowRight',true);}if(n===265){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===280){place(500,400);attack(f,'gale');}if(n===340){place(160,700);attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===395){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===410){place(500,560,730);key('KeyA',true,1);}if(n===422)AgumonRules.spawn(f,{x:680,y:520,vx:12});if(n===437)key('KeyA',false,1);
   if(n===465){place(500,560,540);attack(f,'gale');}
   if([1,10,20,26,40,55,70,91,99,105,112,116,120,135,160,181,190,193,198,205,220,235,250,265,281,295,298,310,330,341,355,375,395,411,423,437,460,480,494,520].includes(n))agumonSnapshots[n]={fighters:fighters.map(q=>({id:q.characterId,x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,shield:q.shield,mode:q.mode,face:q.face,recovered:q.recovered,helpless:q.helpless,charge:q.attack?.charge,aim:q.attack?.aim,launched:q.attack?.launched,escape:q.attack?.escapeSide,ceiling:q.attack?.ceilingUsed,captured:q.attack?.victimId,captureFrame:q.attack?.captureFrame,released:q.attack?.released,grabbed:q.grabbed?.id,owner:q.grabOwner?.id,escapeCount:q.grabEscape,sideUsed:q.agumonSideUsed,airVolcanoUsed:q.agumonAirVolcanoUsed})),objects:AgumonRules.objects.map(q=>({id:q.id,kind:q.kind,owner:q.owner,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,radius:q.radius,damage:q.damage,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>agumonSnapshots[520],{},{timeout:30000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>agumonSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Agumon network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Agumon',s[1].fighters[0].id==='agumon');check('network charged burner hit',s[70].fighters[1].damage>0,s[70]);check('network true bite capture',s[105].fighters[0].grabbed===1&&s[105].fighters[1].owner===0,s[105]);check('network backward throw',s[135].fighters[1].damage>14&&s[135].fighters[1].vx<0,s[135]);check('network underside recovery',s[265].fighters[0].y<=560,s[265]);check('network left recovery',s[395].fighters[0].y<=560,s[395]);check('network air volcano variant',s[281].fighters[0].attack==='airVolcano',s[281]);check('network projectile shield',s[437].fighters[1].damage===0,s[437]);check('network ground volcano hit',s[494].fighters[1].damage>17,s[494]);
 }

 if(process.env.PAWAPURO_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.pawaSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560,ox=900)=>{PawapuroRules.reset();AgumonRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=q.grabbed=q.grabOwner=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=q.grabImmunity=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?ox:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place(500,560,700);attack(f,'dragon');key('KeyX',true);}if(n===28)key('KeyX',false);
   if(n===90){place();attack(f,'dash');key('KeyX',true);}if(n===105)AgumonRules.spawn(o,{x:535,y:510,vx:-10});if(n===116)key('KeyX',false);
   if(n===170){place(160,700);attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===195||n===210)key('KeyX',true);if(n===197||n===212)key('KeyX',false);if(n===245){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===260){place();attack(f,'gale');}if(n===265)AgumonRules.spawn(o,{x:535,y:510,vx:-10});
   if(n===320){place();attack(f,'gale');}if(n===333)AgumonRules.spawn(o,{x:535,y:510,vx:-10});if(n===367)attack(f,'dragon');
   if(n===420){place(500,790);attack(f,'rise');key('ArrowLeft',true);key('ArrowUp',true);}if(n===470){key('ArrowLeft',false);key('ArrowRight',true);}if(n===505){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===520){place(500,560,730);key('KeyA',true,1);}if(n===532)PawapuroRules.spawn(f,{x:680,y:520,vx:12});if(n===547)key('KeyA',false,1);
   // Rules are advanced by the shared engine, never by this observer.
   if([1,10,26,30,45,70,91,100,106,115,120,130,145,160,171,185,196,205,211,230,245,261,266,280,300,321,334,345,368,381,395,421,435,450,475,505,521,533,547,560].includes(n))pawaSnapshots[n]={fighters:fighters.map(q=>({id:q.characterId,x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,shield:q.shield,mode:q.mode,face:q.face,recovered:q.recovered,helpless:q.helpless,charge:q.attack?.charge,aimX:q.attack?.aimX,aimY:q.attack?.aimY,pitchAim:q.attack?.pitchAim,launched:q.attack?.launched,escape:q.attack?.escapeSide,ceiling:q.attack?.ceilingUsed,fuel:q.attack?.fuel,lastBoost:q.attack?.lastBoost,fieldUsed:q.attack?.fieldUsed,stored:q.attack?.storedBall,reserve:q.pawaReserve,cooldown:q.pawaFieldCooldown})),objects:PawapuroRules.objects.map(q=>({id:q.id,kind:q.kind,owner:q.owner,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,radius:q.radius,damage:q.damage,bounces:q.bounces,hits:[...q.hits]})),incoming:AgumonRules.objects.map(q=>({id:q.id,x:q.x,y:q.y,age:q.age,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>pawaSnapshots[560],{},{timeout:30000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>pawaSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Pawapuro network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Pawapuro',s[1].fighters[0].id==='pawapuro');check('network charged pitch hit',s[70].fighters[1].damage>0,s[70]);check('network bat holds real projectile',s[106].fighters[0].stored>0&&s[106].fighters[0].damage===0,s[106]);check('network bat returns projectile',s[130].objects.some(q=>q.kind==='return'),s[130]);check('network two manual rocket boosts',s[230].fighters[0].fuel===0,s[230]);check('network left recovery',s[245].fighters[0].y<=560,s[245]);check('network perfect glove return',s[266].objects.some(q=>q.kind==='return'),s[266]);check('network late glove stock',s[334].fighters[0].reserve===1,s[334]);check('network stock consumed',s[395].fighters[0].reserve===0,s[395]);check('network underside recovery',s[505].fighters[0].y<=560,s[505]);check('network projectile shield',s[547].fighters[1].damage===0,s[547]);
 }

 const newcomerId=process.env.MORPHIE_ONLINE?'morphie':process.env.AKIRA_ONLINE?'akira':process.env.CHEF_ONLINE?'chef':process.env.HORSE_ONLINE?'horse':process.env.SAKUNA_ONLINE?'sakuna':process.env.HASEO_ONLINE?'haseo':process.env.TERRARIAN_ONLINE?'terrarian':null;
 if(newcomerId){const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;for(const p of pages)await p.evaluate(({target,id})=>{window.newSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],r=NewcomerCore.registry[id],key=(code,down)=>{if(Net.slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};const place=(x=500,y=560,ox=700)=>{r.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=q.grabbed=q.grabOwner=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=q.grabImmunity=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?ox:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
 if(n===0){place();attack(f,'dragon');key('KeyX',true);}if(n===44)key('KeyX',false);
 if(n===140){place(800,560,900);attack(f,'dash');key('ArrowUp',true);}if(['akira','morphie'].includes(id)&&n===165)key('KeyX',true);if(['akira','morphie'].includes(id)&&n===166)key('KeyX',false);if(n===170)key('ArrowUp',false);
 if(id==='chef'&&n===285)key('KeyX',false);if(n===250){if(['chef','morphie'].includes(id))key('KeyX',true);place(160,700,900);attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(id==='morphie'&&n===290)key('KeyX',false);if(id==='morphie'&&n===300)key('KeyX',true);if(n===340){if(id==='morphie')key('KeyX',false);key('ArrowRight',false);key('ArrowUp',false);}
 if(n===360){place(500,['horse','chef','akira','morphie'].includes(id)?560:400,700);attack(f,'gale');}
 if(id==='akira'&&n===378)key('KeyX',true);if(id==='akira'&&n===379)key('KeyX',false);if(n===440){if(id==='morphie')key('KeyX',true);place(500,790,900);attack(f,'rise');key('ArrowLeft',true);key('ArrowUp',true);}if(n===490){key('ArrowLeft',false);key('ArrowRight',true);}if(n===535){if(id==='morphie')key('KeyX',false);key('ArrowRight',false);key('ArrowUp',false);}
 if(n>=0&&n<=540&&(n%10===0||id==='horse'&&n===438))newSnapshots[n]={fighters:fighters.map(q=>({id:q.characterId,x:q.x,y:q.y,vx:q.vx,vy:q.vy,damage:q.damage,mode:q.mode,timer:q.timer,attack:q.attack?.type,recovered:q.recovered,helpless:q.helpless,side:q.newSideUsed,down:q.newDownUsed,cooldown:q.newCooldown,size:q.morphSize,massTime:q.morphTime,fuel:q.attack?.fuel,thrusting:q.attack?.thrusting,weight:q.character.weight,ecb:q.character.ecb,legion:q.akiraLegion,syncOK:q.attack?.syncOK,released:q.attack?.released,pullFrames:q.attack?.pullFrames,aim:q.attack?.aim,ceilingUsed:q.attack?.ceilingUsed,steamFrames:q.attack?.steamFrames,ejected:q.attack?.ejected,mounted:q.attack?.mounted,ingredient:q.attack?.ingredient,mealDropped:q.attack?.mealDropped,clearing:q.attack?.clearing,anchor:q.attack?.anchor,route:q.attack?.route,pivot:q.attack?.pivot,warped:q.attack?.warped,launched:q.attack?.launched,rebounded:q.attack?.rebounded,grabbed:q.grabbed?.id,grabOwner:q.grabOwner?.id})),objects:r.objects.map(q=>({id:q.id,kind:q.kind,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,damage:q.damage,reversed:q.reversed,legion:q.legion,returning:q.returning,pass:q.pass,bounced:q.bounced,ingredient:q.ingredient,settled:q.settled,hits:[...q.hits]}))};});},{target,id:newcomerId});await Promise.all(pages.map(p=>p.waitForFunction(()=>newSnapshots[540],{},{timeout:30000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>newSnapshots))),s=all[0];for(const n of Object.keys(s))check(newcomerId+' synchronized specials '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));check('newcomer retained online',s[0].fighters[0].id===newcomerId);check('newcomer left recovery online',s[320].fighters[0].y<=560,s[320]);check('newcomer underside recovery online',s[530].fighters[0].y<=560,s[530]);check('newcomer neutral special online',newcomerId==='akira'?s[60].fighters[0].legion===1:s[60].objects.length>0||s[60].fighters[1].damage>0,s[60]);if(newcomerId==='morphie'){check('morphie online mass transfer',s[70].fighters[0].size>1&&s[70].fighters[1].size<1,s[70]);check('morphie roller reversal online',s[170].objects.some(q=>q.kind==='roller'&&q.reversed),s[170]);check('morphie paint floor online',s[180].objects.some(q=>q.kind==='paintFloor'),s[180]);check('morphie rocket fuel online',s[280].fighters[0].fuel<36,s[280]);check('morphie size shift online',s[390].fighters[0].size===1.5,s[390]);}if(newcomerId==='akira'){check('akira arrow legion fires online',s[170].objects.some(q=>q.kind==='arrow'),s[170]);check('akira remote recall online',s[170].objects.some(q=>q.kind==='remote'&&q.returning),s[170]);check('akira chain anchor online',s[270].fighters[0].anchor&&s[270].fighters[0].pullFrames>0,s[270]);check('akira sync timing online',s[390].fighters[0].syncOK,s[390]);}if(newcomerId==='chef'){check('chef meal settles online',s[180].objects.some(q=>q.kind==='meal'&&q.settled),s[180]);check('chef steam holding online',s[270].fighters[0].mounted&&!s[270].fighters[0].ejected,s[270]);check('chef pot release synchronized',s[290].fighters[0].ejected&&s[290].objects.some(q=>q.kind==='pot'),s[290]);check('chef water puddle synchronized',s[410].objects.some(q=>q.kind==='puddle'),s[410]);}if(newcomerId==='horse'){check('horse reflected puck synchronized',s[180].objects.some(q=>q.kind==='puck'&&q.pass===1&&q.bounced),s[180]);check('horse hole burst synchronized',s[438].fighters[1].damage>0,s[438]);check('horse hole cooldown synchronized',s[430].fighters[0].cooldown>0,s[430]);}} 

 if(process.env.HEADMASTER_ONLINE){
  const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+60;
  for(const p of pages)await p.evaluate(target=>{window.headSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,f=fighters[0],o=fighters[1],key=(code,down,slot=0)=>{if(Net.slot===slot)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));};
   const place=(x=500,y=560,ox=900)=>{HeadmasterRules.reset();for(const q of fighters){q.attack=q.pendingLaunch=q.frozen=q.buffer=q.grabbed=q.grabOwner=null;q.hitlag=q.inv=q.hitstun=q.intangible=q.landingLag=q.grabImmunity=0;q.ledge=null;q.ledgeCooldown=100;q.vx=q.vy=0;q.y=q.id?560:y;q.x=q.id?ox:x;q.grounded=q.y===560;q.damage=0;q.recovered=q.helpless=false;q.respawn=0;q.face=q.id?-1:1;PlayerStates.enter(q,q.grounded?'Idle':'Fall');}};
   if(n===0){place(500,560,700);attack(f,'dragon');key('KeyX',true);}if(n===35)key('KeyX',false);
   if(n===100){place();attack(f,'dash');key('ArrowUp',true);}if(n===120){key('ArrowUp',false);key('ArrowDown',true);}if(n===137)key('ArrowDown',false);
   if(n===185){place(160,700);attack(f,'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===260){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===280){place();attack(f,'gale');}
   if(n===365){place(500,790);attack(f,'rise');key('ArrowLeft',true);key('ArrowUp',true);}if(n===415){key('ArrowLeft',false);key('ArrowRight',true);}if(n===450){key('ArrowRight',false);key('ArrowUp',false);}
   if(n===470){place(500,560,730);key('KeyA',true,1);}if(n===482)HeadmasterRules.spawn(f,{x:680,y:520,vx:12});if(n===498)key('KeyA',false,1);
   if(n===520){place(500,400);attack(f,'dash');}if(n===545)key('KeyX',true);if(n===552)key('KeyX',false);
   if([1,10,26,36,45,60,80,101,110,116,125,137,150,165,186,199,215,235,249,260,281,300,315,330,350,366,380,400,420,450,471,483,498,510,521,535,545,553,565,580].includes(n))headSnapshots[n]={fighters:fighters.map(q=>({id:q.characterId,x:q.x,y:q.y,vx:q.vx,vy:q.vy,attack:q.attack?.type,timer:q.timer,damage:q.damage,shield:q.shield,mode:q.mode,face:q.face,recovered:q.recovered,helpless:q.helpless,charge:q.attack?.charge,route:q.attack?.route,bounce:q.attack?.bounce,launched:q.attack?.launched,escape:q.attack?.escapeSide,ceiling:q.attack?.ceilingUsed,side:q.headSideUsed,block:q.headBlockUsed,cooldown:q.headBlockCooldown})),objects:HeadmasterRules.objects.map(q=>({id:q.id,kind:q.kind,panel:q.panel,owner:q.owner,x:q.x,y:q.y,vx:q.vx,vy:q.vy,age:q.age,radius:q.radius,damage:q.damage,hits:[...q.hits]}))};
  });},target);
  await Promise.all(pages.map(p=>p.waitForFunction(()=>headSnapshots[580],{},{timeout:30000})));const all=await Promise.all(pages.map(p=>p.evaluate(()=>headSnapshots))),s=all[0];
  for(const n of Object.keys(s))check('Headmaster network '+n,JSON.stringify(all[0][n])===JSON.stringify(all[1][n]),all.map(q=>q[n]));
  check('network selects Headmaster',s[1].fighters[0].id==='headmaster');check('network charged quiz hits',s[80].fighters[1].damage>0,s[80]);check('network up branch selected',s[116].fighters[0].route?.[1].y===465,s[116]);check('network down second branch selected',s[137].fighters[0].route?.[2].y>s[137].fighters[0].route?.[1].y,s[137]);check('network automatic 3 balloons',s[249].fighters[0].bounce===3,s[249]);check('network left recovery',s[260].fighters[0].y<=560,s[260]);check('network block falls',s[300].objects.some(q=>q.kind==='block'),s[300]);check('network opposing fragments',s[315].objects.some(q=>q.kind==='fragment'&&q.vx<0)&&s[315].objects.some(q=>q.kind==='fragment'&&q.vx>0),s[315]);check('network finite block cooldown',s[350].fighters[0].cooldown===0,s[350]);check('network underside recovery',s[450].fighters[0].y<=560,s[450]);check('network projectile shield',s[498].fighters[1].damage===0,s[498]);check('network maze cancel by fresh input',!s[553].fighters[0].attack&&s[553].fighters[0].side,s[553]);
 }

 await pages[0].evaluate(()=>pause());check('online cannot locally pause',await pages[0].evaluate(()=>state==='battle'&&Net.active));
 const third=await browser.newPage();await third.goto((process.env.GAME_URL||'http://localhost:4173'));await third.waitForFunction(()=>AstralEdge.assetsLoaded,{},{timeout:60000});await third.click('#enter-online');await third.click('.room-code-entry summary');await third.fill('#room-code',code);await third.click('#join-room');await third.waitForFunction(()=>document.querySelector('#online-status').textContent.includes('満員'));check('third player cannot join active room',true);await third.close();
 const endFrame=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+30;for(const p of pages)await p.evaluate(endFrame=>addEventListener('online-frame',e=>{if(e.detail===endFrame){fighters[1].stocks=1;ko(fighters[1]);}}),endFrame);await Promise.all(pages.map(p=>p.waitForFunction(()=>state==='result')));check('KO resolves both result screens',true);await pages[0].click('#result .restart');await pages[1].click('#result .restart');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&state==='battle')));check('both players can rematch',true);await pages[1].evaluate(()=>Net.leave());await pages[0].waitForFunction(()=>!Net.active&&state==='result');check('disconnect ends match explicitly',await pages[0].locator('#resultdetail').textContent()==='相手がルームを退出しました。');
 console.log(JSON.stringify({total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));await browser.close();if(errors.length||checks.some(c=>!c.pass))process.exit(1);
})();
