'use strict';
const fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];await page.addInitScript(()=>{navigator.getGamepads=()=>[];});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  const result=await page.evaluate(baseline=>{
   state='pause';countdown=hitstop=0;let checks=0;const failures=[],samples=[];
   const check=(name,pass,detail)=>{checks++;if(!pass)failures.push({name,detail});};
   function reset(face=1,target='tifa',percent=0){setupStage('0');fighters=[makeFighter(0,0,'ray'),makeFighter(1,0,target)];RayRules.reset();for(const f of fighters)Object.assign(f,{x:f.id?900:500,y:560,vx:0,vy:0,damage:f.id?percent:0,grounded:true,inv:0,intangible:0,respawn:0,hitlag:0,hitstun:0,stocks:99,face,control:'keyboard'});return fighters;}
   for(const face of[-1,1])for(const target of['chiikawa','tifa','gundam'])for(const percent of[0,60,120,180])for(const kind of['direct','blast']){
    const[f,o]=reset(face,target,percent);const q=RayRules.spawn(f,{kind:'bomb',sourceType:'dash',x:o.x-face*8,y:o.y-40,vx:face*3,vy:0,damage:10,radius:12,life:100,bounces:0,age:kind==='blast'?78:0});
    RayRules.tick();const damage=o.damage-percent,launch=o.pendingLaunch&&{raw:o.pendingLaunch.raw,speed:o.pendingLaunch.speed,angle:o.pendingLaunch.angle};
    if(!baseline){check('one 10% hit '+[face,target,percent,kind],Math.abs(damage-10)<.001,damage);check('scaled launch '+[face,target,percent,kind],launch&&launch.speed<30,launch);check('low percent stays moderate '+[face,target,percent,kind],percent!==0||launch?.speed<9,launch);check('correct direction '+[face,target,percent,kind],launch&&Math.cos(launch.angle)*face>0,launch);}
    if(target==='tifa'&&face===1)samples.push({target,percent,kind,damage,...launch});
    for(let n=0;n<5;n++)RayRules.tick();if(!baseline)check('blast never repeats '+[face,target,percent,kind],Math.abs(o.damage-percent-10)<.001,o.damage-percent);
   }
   for(const face of[-1,1]){
    let[f,o]=reset(face);PlayerStates.enter(o,'ShieldHold');const shield=o.shield;RayRules.spawn(f,{kind:'bomb',sourceType:'dash',x:o.x-face*8,y:o.y-40,vx:face*3,vy:0,damage:10,radius:12,life:100,bounces:0});RayRules.tick();for(let n=0;n<5;n++)RayRules.tick();if(!baseline){check('one shield hit '+face,Math.abs(shield-o.shield-10)<.001,shield-o.shield);check('shield prevents launch '+face,o.damage===0&&!o.pendingLaunch,o.damage);}
    [f,o]=reset(face);o.x=2000;attack(f,'dash');for(let n=0;n<18;n++){frame++;updateFighter(f,emptyInput());RayRules.tick();}const bomb=RayRules.objects.find(q=>q.kind==='bomb');check('throw keeps arc '+face,bomb&&bomb.vx*face===6&&bomb.vy<0,bomb&&{vx:bomb.vx,vy:bomb.vy});
    for(let n=0;n<105;n++){frame++;updateFighter(f,emptyInput());RayRules.tick();}check('bomb expires '+face,!RayRules.objects.length,RayRules.objects.length);
   }
   const[f,o]=reset();RayRules.spawn(f,{kind:'bomb',sourceType:'dash',x:o.x-8,y:o.y-40,vx:3,vy:0,damage:10,radius:12,life:100,bounces:0});RayRules.tick();const start=o.x;
   for(let n=0;n<40;n++){frame++;updateFighter(o,emptyInput());}
   const travel={x:o.x-start,y:560-o.y,stocks:o.stocks};if(!baseline)check('zero percent is not sent off stage',Math.abs(travel.x)<220&&travel.stocks===99,travel);
   const cpu=[];if(!baseline){reset();training=false;state='battle';countdown=hitstop=0;matchTime=Infinity;GameAudio.setMuted(true);for(const f of fighters){f.x=650+f.id*160;f.control='cpu';f.stocks=99;}for(let n=0;n<1800;n++)update(true);check('Ray CPU battle finite',fighters.every(f=>[f.x,f.y,f.vx,f.vy,f.damage].every(Number.isFinite)));check('Ray CPU attacks connect',fighters[0].stats.hits>0,fighters[0].stats);cpu.push(...fighters.map(f=>({id:f.characterId,hits:f.stats.hits,damage:f.stats.damage})));state='pause';}
   return{checks,failures,samples,travel,cpu};
  },!!process.env.RAY_BOMB_BASELINE);
  fs.writeFileSync('.tools/ray-bomb-'+(process.env.RAY_BOMB_BASELINE?'before':'after')+'.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,errors}));if(result.failures.length||errors.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
