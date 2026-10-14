'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await p.evaluate(()=>{state='pause';training=true;setupStage('0');GameAudio.setMuted(true);let checks=0;const failed=[],check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
  const reset=(id,face)=>{fighters=[makeFighter(0,0,id),makeFighter(1,0,'vivi')];for(const r of Object.values(NewcomerCore.registry))r.reset();const f=fighters[0];Object.assign(f,{x:720,y:560,grounded:true,face,inv:0,respawn:0});InputFrames.sample(f,{...emptyInput(),x:face});f.smashFlickAge=99;return f;};
  const tick=(f,i={})=>{frame++;updateFighter(f,{...emptyInput(),...i});f.x=720;};
  for(const{id}of Roster.definitions)for(const face of[-1,1]){
   for(const gap of[1,4,8,10]){const f=reset(id,face);tick(f,{x:face,heavy:true,attackHeld:true});check(id+'/'+face+'/'+gap+' first tilt',f.attack?.type==='heavy',f.attack?.type);let n=0;while(f.attack&&n++<180)tick(f,{x:face});check(id+' finite tilt',n<180);
    for(let t=0;t<gap;t++)tick(f,{x:face});tick(f,{x:face,heavy:true,attackHeld:true});check(id+'/'+face+'/'+gap+' repeated intent',f.attack?.type===(gap<9?'heavy':'dashAttack'),{type:f.attack?.type,mode:f.mode,frame,until:f.dashAttackResumeUntil});
   }
   let f=reset(id,face);for(let t=0;t<12;t++)tick(f,{x:face});tick(f,{x:face,heavy:true,attackHeld:true});check(id+'/'+face+' normal running dash attack',f.attack?.type==='dashAttack');
   f=reset(id,face);for(let t=0;t<12;t++)tick(f,{x:face});tick(f,{x:face,heavy:true,forceTilt:true,attackHeld:true});check(id+'/'+face+' auxiliary tilt stays tilt',f.attack?.type==='heavy');
   f=reset(id,face);Object.assign(f,{y:200,grounded:false,gravityOff:true});tick(f,{x:face,heavy:true,forceTilt:true});check(id+'/'+face+' air direction unchanged',f.attack?.type==='fair');
  }
  for(const period of[20,22,24,26,28]){const f=reset('estelle',1),starts=[];let previous;for(let t=0;t<240;t++){tick(f,{x:1,heavy:t%period===0,attackHeld:t%period===0});if(f.attack&&f.attack!==previous)starts.push(f.attack.type);previous=f.attack;}check('Estelle mash period '+period,starts.length>4&&starts.every(type=>type==='heavy'),starts);}
  return{characters:Roster.definitions.length,checks,failed};
 });console.log(JSON.stringify({...result,failed:result.failed.slice(0,12),failureCount:result.failed.length,errors}));assert.equal(result.failed.length,0);assert.deepEqual(errors,[]);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
