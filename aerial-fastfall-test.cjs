'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(process.env.TEST_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  const result=await page.evaluate(()=>{
   state='pause';countdown=hitstop=0;setupStage('0');GameAudio.setMuted(true);
   let checks=0,cases=0;const failed=[],landings=[];
   const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
   function reset(id,type,face,style=0){
    for(const r of Object.values(NewcomerCore.registry))r.reset();
    fighters=[makeFighter(0,0,id),makeFighter(1,1,'dragoon')];
    const f=fighters[0];Object.assign(f,{x:570,y:100,vy:.1,grounded:false,face,inv:0,intangible:0,respawn:0,gravityStyle:style});
    Object.assign(fighters[1],{x:1100,y:560,grounded:true,inv:0,respawn:0});
    PlayerStates.enter(f,'Fall');attack(f,type);return f;
   }
   function tick(f,input={}){frame++;PlayerController.tick(f,{...emptyInput(),...input});}
   for(const {id}of Roster.definitions)for(const type of ['air','fair','bair','uair','dair'])for(const face of [-1,1])for(const style of id==='kitten'?[0,1,2]:[0]){
    let f=reset(id,type,face,style),a=f.attack;
    // A dive owns its descent speed and landing action instead of fast fall.
    if(!a||a.special||a.diveSpeed||a.landingMove)continue;
    for(const existing of [false,true]){
     f=reset(id,type,face,style);a=f.attack;cases++;f.timer=a.activeStart-1;
     f.fastFall=existing;if(existing)f.vy=f.character.fastFallSpeed;
     for(let n=0;n<6;n++){
      tick(f,existing?{}:{y:1});
      check(`${id}:${type}:${face}:${style}:${existing}:fast:${n}`,f.fastFall,{mode:f.mode,vy:f.vy,timer:f.timer});
      check(`${id}:${type}:${face}:${style}:${existing}:action:${n}`,!f.attack||f.attack===a,{type:f.attack?.type});
     }
    }
   }
   // These specials have authored flight, rope, or aiming phases. Their
   // suppression must survive the ordinary-attack fix, including down special.
   for(const id of ['human','kitten'])for(const type of ['dragon','dash','rise','gale'])for(const face of [-1,1]){
    const f=reset(id,type,face),a=f.attack;f.fastFall=true;
    tick(f,{y:1});check(`${id}:${type}:${face}:special`,a.special&&!f.fastFall,{type:a.type,fastFall:f.fastFall});
   }
   // Reproduce the player's falling aerial input with full physics, not only
   // an action-hook call. Compare actual time to the stage and landing lock.
   for(const id of ['human','kitten'])for(const face of [-1,1])for(const fast of [false,true]){
    const f=reset(id,'air',face);f.y=495;f.timer=f.attack.activeStart-1;
    let frames=0;while(!f.grounded&&frames<90){tick(f,fast?{y:1}:{});frames++;}
    check(`${id}:${face}:${fast}:lands`,f.grounded&&frames<90,{frames,y:f.y});
    landings.push({id,face,fast,frames,lag:f.lastLandingLag});
   }
   for(const id of ['human','kitten'])for(const face of [-1,1]){
    const normal=landings.find(q=>q.id===id&&q.face===face&&!q.fast),fast=landings.find(q=>q.id===id&&q.face===face&&q.fast);
    check(`${id}:${face}:faster-landing`,fast.frames<normal.frames,{normal,fast});
   }
   return {characters:Roster.definitions.length,cases,checks,failed,landings};
  });
  fs.writeFileSync('.tools/aerial-fastfall-report.json',JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({...result,failed:result.failed.slice(0,12),failedCount:result.failed.length,errors},null,2));
  assert.deepEqual(errors,[]);assert.equal(result.failed.length,0,'See .tools/aerial-fastfall-report.json');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
