'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const result=await page.evaluate(()=>{
  state='pause';training=false;countdown=hitstop=0;const rules=[...[...new Set(update.toString().match(/\b\w+Rules(?=\.tick\()/g))].map(n=>eval(n)),...Object.values(NewcomerCore.registry)],failed=[],samples=[],pressure=[];let checks=0;
  const check=(name,ok,detail)=>{checks++;if(!ok)failed.push({name,detail});};
  function reset(id,side=1,target='dragoon',variant=0){setupStage('0');fighters=[makeFighter(0,0,id),makeFighter(1,1,target)];for(const r of rules)r.reset?.();const[f,o]=fighters;Object.assign(f,{x:700,y:560,grounded:true,face:side,inv:0,stocks:99,control:'keyboard'});Object.assign(o,{x:side<0?-500:1900,y:560,grounded:true,face:-side,inv:0,stocks:99,control:'keyboard'});if(id==='nier')f.nierMagic=variant;if(id==='elma'&&variant)f.ocgTime=900;return f;}
  function step(f,i={}){frame++;PlayerController.tick(f,{...emptyInput(),...i});for(const r of rules)r.tick();}
  const profiles=[];
  for(const {id}of Roster.definitions){const f=reset(id);for(const[type,data]of Object.entries(movesFor(f)))if(data.rangedInterval)profiles.push({id,type});}
  profiles.push({id:'nier',type:'dragon',variant:1},{id:'elma',type:'dragon',variant:1},{id:'elma',type:'gale',variant:1},{id:'elma',type:'airDrop',variant:1});
  for(const p of profiles)for(const side of[-1,1]){
   let f=reset(p.id,side,'dragoon',p.variant),data=movesFor(f)[p.type],start=frame;
   check(p.id+'/'+p.type+' first cast',attack(f,p.type),p);const a=f.attack;let n=0;while(f.attack&&n++<220)step(f);check(p.id+'/'+p.type+' finite motion',n<220,{timer:f.timer,mode:f.mode});
   if(n>=220)continue;const end=frame,ready=f.rangedReadyFrame;
   check(p.id+'/'+p.type+' stays freely actionable',!f.attack&&['Idle','Fall','Jump','NormalLanding','HardLanding','AerialLanding','SpecialLanding'].includes(f.mode),{mode:f.mode,end:n});
   check(p.id+'/'+p.type+' rearm outlives animation',ready>frame,{ready,frame});
   if(p.id==='noctis'&&p.type==='dash'){check('Noctis marker followup stays available',attack(f,p.type)&&f.attack?.type==='warpStrike');f.attack=null;}
   check(p.id+'/'+p.type+' cannot immediately recast',!attack(f,p.type),{ready,frame});
   // Alternating another ranged special cannot bypass the shared rearm.
   const other=Object.entries(movesFor(f)).find(([key,v])=>v.rangedInterval&&key!==p.type);if(other)check(p.id+' alternate cast is gated',!attack(f,other[0]),other[0]);
   // The cooldown neither extends the visible return nor blocks melee/recovery.
   for(const command of ['jab','jump','guard']){f=reset(p.id,side,'dragoon',p.variant);attack(f,p.type);const first=f.attack;let ticks=0;while(f.attack&&ticks++<220)step(f);const until=f.rangedReadyFrame;step(f,command==='guard'?{guard:true}:{[command]:true});check(p.id+'/'+p.type+' free '+command,command==='jab'?!!f.attack&&!f.attack.rangedInterval:command==='jump'?['JumpSquat','Jump'].includes(f.mode):['ShieldStart','ShieldHold','NeutralAirDodge','DirectionalAirDodge'].includes(f.mode),{mode:f.mode,type:f.attack?.type,until,frame});}
   f=reset(p.id,side,'dragoon',p.variant);attack(f,p.type);const first=f.attack;let ticks=0;while(f.attack&&ticks++<220)step(f);f.attack=null;f.recovered=false;check(p.id+'/'+p.type+' recovery remains available',attack(f,'rise'),f.mode);
   // Raw button mashing must obey measured cast-start spacing in both faces.
   f=reset(p.id,side,'dragoon',p.variant);let prior=null;const starts=[];for(let t=0;t<200;t++){step(f,{special:true,x:p.type==='dash'?side:0,y:p.type==='gale'||p.type==='airDrop'?1:0});if(f.attack&&f.attack!==prior){prior=f.attack;if(f.attack.rangedInterval)starts.push(frame);}}
   check(p.id+'/'+p.type+' bounded repetition',starts.every((v,k)=>!k||v-starts[k-1]>=data.rangedInterval),{starts,interval:data.rangedInterval});samples.push({...p,side,motionFrames:end-start,interval:data.rangedInterval,starts});
  }
  // Actual projectile transport, collision, hitlag, stun, guard and escape.
  const oldInput=BattlePlayers.localInput;GameAudio.begin=()=>Promise.resolve();try{
   for(const[id,type,held]of[['metalgreymon','dash',false],['nier','dragon',true],['metabee','dragon',true],['zero','gale',false],['horse','dash',false],['aerith','dash',false]])for(const side of[-1,1])for(const target of['chiikawa','dragoon','greymon'])for(const defense of['none','guard','escape']){
    const f=reset(id,side,target),o=fighters[1];f.x=side>0?500:940;o.x=f.x+side*240;matchTime=10000;let locked=0,maxLocked=0,free=0;
    BattlePlayers.localInput=v=>v===f?{...emptyInput(),special:true,specialHeld:held,x:type==='dash'?side:0,y:type==='gale'?1:0}:defense==='guard'?{...emptyInput(),guard:true}:defense==='escape'?{...emptyInput(),jump:true,guard:true,jab:true}:emptyInput();
    for(let n=0;n<360;n++){update(true);if(o.hitlag>0||o.hitstun>0||o.shieldStun>0){maxLocked=Math.max(maxLocked,++locked);}else{locked=0;free++;}}
    check([id,side,target,defense].join('/')+' no sustained lock',maxLocked<120,{maxLocked,free,damage:o.damage,mode:o.mode});pressure.push({id,type,held,side,target,defense,maxLocked,free,damage:o.damage});
   }
  }finally{BattlePlayers.localInput=oldInput;state='pause';}
  // Existing bursts stay distinct and complete, rather than losing late shots.
  for(const[id,expected]of[['nier',[12,30,48]],['metabee',[10,24,38]]]){const f=reset(id),r=NewcomerCore.registry[id],shots=[],seen=new Set();attack(f,'dragon');const a=f.attack;for(let n=0;n<120&&f.attack===a;n++){step(f,{specialHeld:true});for(const q of r.objects)if(!seen.has(q)){seen.add(q);shots.push(f.timer);}}check(id+' all held burst shots survive',JSON.stringify(shots)===JSON.stringify(expected),shots);}
  // Hiding a form or changing magic must not reset the ranged rearm.
  let f=reset('hanajs');attack(f,'dragon');f.attack=null;f.characterId='hanajd';prepareFighter(f);check('Hana form switch keeps rearm',!attack(f,'dragon'));
  f=reset('nier');attack(f,'dragon');f.attack=null;f.nierMagic=1;check('Nier magic switch keeps rearm',!attack(f,'dragon'));
  return{characters:Roster.definitions.length,profiles:profiles.length,checks,failed,samples,pressure};
 });fs.writeFileSync('.tools/projectile-balance-report.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({characters:result.characters,profiles:result.profiles,checks:result.checks,failed:result.failed.slice(0,20),failureCount:result.failed.length,errors},null,2));assert.deepEqual(errors,[]);assert.equal(result.failed.length,0);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
