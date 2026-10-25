'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.addInitScript(()=>{requestAnimationFrame=()=>0;navigator.getGamepads=()=>[];});
 await p.goto(process.env.GAME_URL||'http://localhost:4179',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:120000,polling:100});
 const result=await p.evaluate(()=>{
  state='pause';training=false;GameAudio.setMuted(true);setupStage('0');const checks=[];
  const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
  const fresh=(id,extra={})=>{const f=makeFighter(0,0,id);fighters=[f,makeFighter(1,0,'vivi')];Object.assign(f,{x:720,y:100,grounded:false,vy:3,vx:0,inv:0,intangible:0,hitstun:0,hitlag:0,respawn:0,...extra});PlayerStates.enter(f,'Fall');f.input={...emptyInput(),buttons:{jump:{value:true,hold:10}}};return f;};
  const tick=(f,input={},n=1)=>{for(let k=0;k<n;k++){frame++;updateFighter(f,{...emptyInput(),...input});}};
  const rows=Roster.definitions.map(d=>({id:d.id,name:d.name,profile:CharacterData[d.id]?.airMobility||null}));
  for(const[id,profile]of Object.entries(AirMobility.profiles)){
   let f=fresh(id);check(id+' registered',!!CharacterData[id]);
   if(profile.extraJumps){const total=1+profile.extraJumps;check(id+' initial budget',f.airJumps===total,f.airJumps);for(let k=0;k<total;k++)check(id+' jump '+(k+1),PlayerController.launchJump(f)&&f.vy<0&&f.airJumps===total-k-1);const vy=f.vy;check(id+' exhausted',!PlayerController.launchJump(f)&&f.vy===vy);f.airHoverSpent=40;f.grounded=true;PlayerController.land(f,emptyInput());check(id+' land restores',f.airJumps===total&&f.airHoverSpent===0);}
   else{
    if(profile.condition){tick(f,{jumpHeld:true});check(id+' base form no hover',!f.airHoverActive&&f.airHoverSpent===0);f[profile.condition]=200;}
    tick(f,{jumpHeld:true});check(id+' held hover',f.airHoverActive&&f.vy===profile.fallSpeed&&f.airHoverSpent===1,{vy:f.vy,spent:f.airHoverSpent});
    tick(f,{});check(id+' release falls',!f.airHoverActive&&f.vy>profile.fallSpeed&&f.airHoverSpent===1);
    f.airJumps=1;tick(f,{jump:true,jumpHeld:true});check(id+' air jump no refill',f.airHoverSpent===1&&f.vy<0);f.y=100;f.vy=3;
    tick(f,{jumpHeld:true},profile.frames-1);check(id+' finite budget',f.airHoverSpent===profile.frames&&AirMobility.remaining(f)===0);tick(f,{jumpHeld:true});check(id+' exhaustion falls',!f.airHoverActive&&f.vy>profile.fallSpeed);
    f.grounded=true;PlayerController.land(f,emptyInput());check(id+' landing refills',f.airHoverSpent===0);
   }
  }
  for(const id of ['dragoon','vivi','elza','agumon','greymon']){const f=fresh(id);tick(f,{jumpHeld:true},5);check(id+' ordinary jump unchanged',f.airJumps===1&&!f.airHoverActive&&f.airHoverSpent===0&&f.vy>3);}
  for(const mode of ['Tumble','Hitstun','Helpless','Grabbed','Throw','DirectionalAirDodge']){const f=fresh('reimu');PlayerStates.enter(f,mode,30);if(mode==='Tumble')f.tumbling=true;if(mode==='Hitstun')f.hitstun=10;if(mode==='Helpless')f.helpless=true;const vy=f.vy;AirMobility.physics(f,{jumpHeld:true,y:0});check(mode+' cannot hover',!f.airHoverActive&&f.vy===vy&&f.airHoverSpent===0);}
  for(const key of ['hitlag','hitstun','pendingLaunch','recovered','helpless','tumbling','gravityOff','respawn','fastFall']){const f=fresh('reimu');f[key]=key==='pendingLaunch'?{vx:12,vy:6}:1;const vy=f.vy;AirMobility.physics(f,{jumpHeld:true,y:0});check(key+' preserves launch',!f.airHoverActive&&f.vy===vy&&f.airHoverSpent===0);}
  let f=fresh('reimu');tick(f,{jumpHeld:true,y:1});check('down flick cancels hover',f.fastFall&&!f.airHoverActive&&f.vy>.6);
  f=fresh('reimu');attack(f,'air');tick(f,{jumpHeld:true});check('aerial attack does not gain hover',!f.airHoverActive&&f.airHoverSpent===0);
  f=fresh('reimu');f.airHoverSpent=90;f.airJumps=0;PlayerController.catchLedge(f,StageRules.ledges[0]);check('ledge restores budgets',f.airHoverSpent===0&&f.airJumps===1);
  f=fresh('terra',{terraTrance:200});tick(f,{jumpHeld:true},5);f.terraTrance=0;tick(f,{jumpHeld:true});f.terraTrance=200;tick(f,{jumpHeld:true});check('form toggling does not refill',f.airHoverSpent===6);
  f=fresh('agumon');f.airJumps=0;AgumonEvolution.change(f,2);check('evolution no free midair jumps',f.airJumps===0&&f.character.airJumpCount===4);f.grounded=true;PlayerController.land(f,emptyInput());check('evolved landing restores wing jumps',f.airJumps===4);
  const custom={airJumpCount:1,airMobility:{extraJumps:9}};AirMobility.configure(custom,'future');AirMobility.configure(custom,'future');check('future metadata capped and idempotent',custom.airJumpCount===4);
  f=fresh('maruku',{x:100,vy:4});frame=160;const ci=AirMobility.cpu(f,{...emptyInput(),special:true,y:-1},platforms.find(p=>p.main));check('CPU spends additional jumps',ci.jump&&!ci.special&&ci.y===0);
  f=fresh('reimu',{x:100,vy:3});const hi=AirMobility.cpu(f,emptyInput(),platforms.find(p=>p.main));check('CPU uses hover to return',hi.jumpHeld);
  return{reviewed:rows.length,profiles:rows.filter(r=>r.profile).length,rows,checks};
 });
 fs.mkdirSync('.tools/flight',{recursive:true});fs.writeFileSync('.tools/flight/results.json',JSON.stringify({...result,errors},null,2));
 console.log(JSON.stringify({reviewed:result.reviewed,profiles:result.profiles,checks:result.checks.length,failed:result.checks.filter(c=>!c.pass),errors}));assert.deepEqual(errors,[]);assert.ok(result.checks.every(c=>c.pass));
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
