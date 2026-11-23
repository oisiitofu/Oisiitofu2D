'use strict';
// Reproducible movement/combat smoke runs. CPU results are diagnostic, not a
// ranking of human matchups; preserve the per-match measurements for follow-up.
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
  await page.addInitScript(()=>{requestAnimationFrame=()=>0;navigator.getGamepads=()=>[];});
  await page.goto(process.env.TEST_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:180000});
  const result=await page.evaluate(async({seedOffset,pairOffset})=>{
   const nativeRandom=Math.random,nativeBegin=GameAudio.begin;
   const ids=Roster.selectable.map(({id})=>id).filter(id=>id!=='random'),matches=[],failed=[];
   GameAudio.begin=()=>Promise.resolve();GameAudio.setMuted(true);
   $('#battle-mode').value='battle';$('#difficulty').value='hard';
   const unchanged=MeleeBalance.boxes;
   if(window.balanceBaseline)MeleeBalance.boxes=(f,a,raw)=>raw;
   try{
    for(let n=0;n<ids.length;n++){
     let seed=0x8193+n+seedOffset;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
     const pair=[ids[n],ids[(n+pairOffset)%ids.length]];
     await start({artPrepared:true,participants:{players:pair.map((character,color)=>({character,color,control:'cpu'})),format:'free',stocks:3,timeLimit:240,limitBreak:false,oneOnOne:false},squads:{size:1},stage:'0'});
     if(state!=='battle'||fighters.length!==2||fighters.some((f,k)=>f.characterId!==pair[k])){
      failed.push({pair,issue:'match did not start as configured',actual:fighters.map(f=>f.characterId),state});
      continue;
     }
     countdown=hitstop=0;frame=0;
     fighters.forEach((f,k)=>Object.assign(f,{stocks:99,inv:0,x:650+k*140}));
     const bounds=fighters.map(f=>({lo:f.x,hi:f.x}));
     for(let t=0;t<1800;t++){
      update(true);effects();
      fighters.forEach((f,k)=>{bounds[k].lo=Math.min(bounds[k].lo,f.x);bounds[k].hi=Math.max(bounds[k].hi,f.x);
       if(![f.x,f.y,f.vx,f.vy,f.damage,f.stocks].every(Number.isFinite))failed.push({pair,t,id:f.characterId,issue:'non-finite combat state'});});
     }
     matches.push({pair,frames:1800,results:fighters.map((f,k)=>({id:f.characterId,hits:f.stats.hits,damage:Math.round(f.stats.damage),kos:f.stats.kos,deaths:99-f.stocks,movement:Math.round(bounds[k].hi-bounds[k].lo)}))});
     state='pause';
    }
   }finally{Math.random=nativeRandom;GameAudio.begin=nativeBegin;MeleeBalance.boxes=unchanged;state='pause';}
   return{characters:ids.length,seedOffset,pairOffset,matches,failed};
  },{seedOffset:Number(process.env.SPARRING_SEED_OFFSET||0),pairOffset:Number(process.env.SPARRING_PAIR_OFFSET||37)});
  fs.mkdirSync('.tools',{recursive:true});fs.writeFileSync('.tools/balance-sparring-report'+(result.seedOffset?'-'+result.seedOffset:'')+'.json',JSON.stringify(result,null,2));
  const hits=result.matches.reduce((n,m)=>n+m.results.reduce((sum,f)=>sum+f.hits,0),0);
  console.log(JSON.stringify({characters:result.characters,matches:result.matches.length,frames:result.matches.length*1800,hits,failed:result.failed.slice(0,15),errors},null,2));
  assert.deepEqual(errors,[]);assert.deepEqual(result.failed,[]);assert(hits>0,'CPU matches must resolve actual hits');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
