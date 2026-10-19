'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
  await page.addInitScript(()=>{requestAnimationFrame=()=>0;navigator.getGamepads=()=>[];});
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100});
  await page.click('#enter-training');await page.click('#start');await page.waitForFunction(()=>state==='battle',null,{polling:100});
  const oldMelia=execFileSync('git',['show','94c6f7a:characters/melia/melia-data.js'],{encoding:'utf8'});
  const result=await page.evaluate(async oldMelia=>{
   state='pause';training=false;countdown=hitstop=0;const checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
   const terrain=platforms,blast=blastZoneSide;platforms=[{...terrain.find(p=>p.main),x:-10000,w:20000,y:10000}];blastZoneSide=()=>null;
   function reset(id,x=600,y=300){const f=makeFighter(0,0,id),o=makeFighter(1,1,'vivi');fighters=[f,o];Object.assign(f,{x,y,grounded:false,face:1,inv:0,intangible:0,hitlag:0,hitstun:0,respawn:0,ledgeCooldown:999});Object.assign(o,{x:9000,y:300,grounded:false,gravityOff:true});return f;}
   const step=(f,i={})=>{frame++;updateFighter(f,{...emptyInput(),...i});};
   try{
    const windups={};
    for(const id of['krystal','melia','noctis','agumon','riki','colette','kosmos','bomberman','hanajd','pneuma','alucard','ryza']){
     const f=reset(id);Object.assign(f,{vx:12,vy:20,fastFall:true});attack(f,'rise');let maxDrop=0,held=0;
     for(let n=0;n<Math.max(5,movesFor(f).rise.startupFrames-2);n++){step(f,{specialHeld:true});maxDrop=Math.max(maxDrop,f.y-300);held+=!!f.attack?.hold;}
     windups[id]={maxDrop,held};check(id+' brakes incoming fastfall',maxDrop<25&&!f.fastFall,windups[id]);
    }
    {const f=reset('krystal');Object.assign(f,{vy:20,fastFall:true});attack(f,'rise');for(let n=0;n<27;n++)step(f,{specialHeld:true});check('charged rocket stays near its cast height',f.y-300<8&&f.attack?.chargeFrames>=20,{y:f.y,timer:f.timer,charge:f.attack?.chargeFrames});for(let n=0;n<15;n++)step(f);check('rocket launches after release',f.attack?.rocketStarted&&f.vy<0&&f.recovered);}
    for(const id of['krystal','noctis','melia']){
     const f=reset(id);Object.assign(f,{hitstun:15,tumbling:true,vx:12,vy:10});PlayerStates.enter(f,'Hitstun');step(f,{special:true,y:-1});check(id+' cannot brake hitstun launch',!f.attack&&f.vx>10&&f.vy>9,{vx:f.vx,vy:f.vy});
     const g=reset(id);g.hitlag=4;g.vx=12;g.vy=10;step(g,{special:true,y:-1});check(id+' cannot start recovery in hitstop',!g.attack&&g.hitlag===3);
    }
    for(let n=0;n<16;n++){
     const angle=n*Math.PI/8,x=Math.cos(angle),y=Math.sin(angle),f=reset('noctis');attack(f,'rise');for(let j=0;j<14;j++)step(f,{x,y});const a=f.attack,o=a.anchorOrigin,target=a.warpTarget;
     check('Noctis analog heading '+n,Math.abs(target.x-o.x-x*210)<1e-7&&Math.abs(target.y-o.y-y*210)<1e-7,target);step(f);check('Noctis uses chosen destination '+n,a.warped&&Math.hypot(f.x-target.x,f.y-target.y)<4&&f.recovered);check('Noctis no recovery repeat '+n,!attack(f,'rise'));
    }
    {const f=reset('noctis');attack(f,'rise');for(let n=0;n<8;n++)step(f,{x:1,y:0});const target={...f.attack.warpTarget};for(let n=0;n<4;n++)step(f);check('Noctis neutral retains last direction',JSON.stringify(f.attack.warpTarget)===JSON.stringify(target));}
    for(const [x,y]of[[1,0],[-1,0],[0,-1],[.3,-.95],[-.8,.4],[.5,0]]){const f=reset('neku');attack(f,'rise');for(let n=0;n<9;n++)step(f,{x,y});const a=f.attack,dx=a.warpTarget.x-a.warpOrigin.x,dy=a.warpTarget.y-a.warpOrigin.y,len=Math.hypot(x,y),distance=Math.hypot(dx,dy);check('Neku direct aim '+x+'/'+y,Math.abs(dx/distance-x/len)<1e-7&&Math.abs(dy/distance-y/len)<1e-7);check('Neku analog warp distance '+x+'/'+y,len<.7?distance<200:distance>270);}
    for(const id of['kasane','terrarian'])for(const [x,y]of[[1,0],[-1,0],[.3,-.95],[-.8,.4],[0,-1]]){
     const f=reset(id);attack(f,'rise');for(let n=0;n<(id==='kasane'?6:12);n++)step(f,{x,y});const a=f.attack,len=Math.hypot(x,y);
     const dx=id==='kasane'?a.exit.x-a.origin.x:a.aimX,dy=id==='kasane'?a.exit.y-a.origin.y:a.aimY,l=Math.hypot(dx,dy);
     check(id+' analog direction '+x+'/'+y,Math.abs(dx/l-x/len)<1e-7&&Math.abs(dy/l-y/len)<1e-7,{dx,dy});
    }
    const current=NewcomerCore.registry.melia,previous=eval(oldMelia+';MeliaRules');NewcomerCore.registry.melia=current;
    function flight(rules,held,y=0){NewcomerCore.registry.melia=rules;const f=reset('melia');attack(f,'rise');let top=f.y,frames=0;for(let n=0;n<130&&f.attack;n++){step(f,{x:1,y,specialHeld:held});top=Math.min(top,f.y);if(f.attack?.flightStarted)frames++;}return{height:300-top,distance:f.x-600,frames,mode:f.mode};}
    const before=flight(previous,false),after=flight(current,false),held=flight(current,true),climb=flight(current,false,-1);NewcomerCore.registry.melia=current;
    check('Melia larger tap recovery',after.height>before.height*2&&after.distance>before.distance*2,{before,after});check('Melia tap keeps full flight',after.frames===held.frames&&after.frames>=80,{after,held});check('Melia steers upward with wings',climb.height>after.height+100,{after,climb});
    {const f=reset('melia');attack(f,'rise');for(let n=0;n<48;n++)step(f);step(f,{special:true});check('Melia second press folds wings',f.attack?.ending);check('Melia cannot chain recoveries',!attack(f,'rise'));}
    {const f=reset('melia');f.attack=null;f.state='walk';const seen=[];for(let n=0;n<48;n++){frame=n;seen.push(meliaPose(f));}check('Melia walk excludes dash-start frame',seen.every(n=>[24,25,26].includes(n))&&new Set(seen).size===3);}
    {const f=reset('hanajd');for(const type of['jab','jab2','jab3','heavy','up','smash','upsmash','downsmash','air','fair','bair','uair','dair']){attack(f,type);const a=f.attack;for(let t=1;t<=a.totalFrames;t++){f.timer=t;check('Hanajd finite '+type+'/'+t,attackBoxes(f).every(b=>[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)));if(type==='upsmash')check('Hanajd rising blades not knee '+t,CombatData.sample(a,t).pose!==10);if(type==='smash')check('Hanajd grounded slash not aerial '+t,CombatData.sample(a,t).pose!==13);}}}
    platforms=terrain;blastZoneSide=blast;setupStage('0');
    {const main=platforms.find(p=>p.main),f=reset('noctis',main.x+main.w/2,main.y+180);attack(f,'rise');for(let n=0;n<17;n++)step(f,{y:-1});check('Noctis warp blocked by solid stage',f.attack?.warpBlocked&&!StageGeometry.overlaps(main,f.x,f.y,f.character.ecb.radius,f.character.ecb.height));}
    const recoveries=[];
    for(const id of['melia','krystal'])for(const side of[-1,1])for(const bot of[false,true]){
     const main=platforms.find(p=>p.main),f=reset(id,side<0?main.x-150:main.x+main.w+150,main.y+160);if(!bot)attack(f,'rise');let success=false;
     for(let n=0;n<230;n++){step(f,bot?cpu(f,fighters[1]):{x:-side,y:-1});NewcomerCore.registry[id].tick();if(f.grounded||f.ledge){success=true;break;}if(f.respawn)break;}
     recoveries.push({id,side,bot,success,x:f.x,y:f.y});check('stage recovery '+id+'/'+side+'/'+bot,success,recoveries.at(-1));
    }
    setupStage('0');const a=makeFighter(0,0,'melia'),b=makeFighter(1,1,'hanajd');fighters=[a,b];for(const[f,n]of fighters.map((f,n)=>[f,n]))Object.assign(f,{x:500+n*320,y:560,grounded:true,stocks:99,inv:0,intangible:0});
    for(let n=0;n<1800;n++){frame++;for(const f of fighters)updateFighter(f,cpu(f,fighters[1-f.id]));resolveCombat();MeliaRules.tick();HanajdRules.tick();}
    const cpuFight=fighters.map(f=>({id:f.characterId,stats:f.stats,finite:[f.x,f.y,f.vx,f.vy,f.damage].every(Number.isFinite)}));check('one CPU fight finite and hits',cpuFight.every(f=>f.finite)&&cpuFight.some(f=>f.stats.hits>0),cpuFight);
    return{checks:checks.length,windups,melia:{before,after,held,climb},recoveries,cpuFight,failures:checks.filter(c=>!c.pass)};
   }finally{platforms=terrain;blastZoneSide=blast;}
  },oldMelia);
  fs.writeFileSync('previews/recovery-control-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,windups:undefined,recoveries:undefined,cpuFight:undefined,errors},null,2));assert.deepEqual(result.failures,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
