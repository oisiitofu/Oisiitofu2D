'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4181');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  for(const id of ['diana']){
   const result=await page.evaluate(async id=>{
    const players=[{character:id,color:0,control:'cpu'},{character:id,color:1,control:'cpu'}];
    await start({artPrepared:true,participants:{players,format:'free',stocks:1,timeLimit:60,limitBreak:true},squads:{size:1},stage:'0'});
    countdown=0;simulationSpeed=0;acc=0;
    const main=platforms.find(p=>p.main);fighters.forEach((f,n)=>Object.assign(f,{x:660+n*140,y:main.y,grounded:true,inv:0}));let steps=0;
    while(state==='battle'&&steps<12000){update(true);if(steps%120===0)render();steps++;}
    render();
    return {id,state,steps,controls:fighters.map(f=>f.control),positions:fighters.map(f=>[f.x,f.y]),hits:fighters.map(f=>f.stats.hits),stocks:fighters.map(f=>f.stocks),finite:fighters.every(f=>[f.x,f.y,f.damage].every(Number.isFinite))};
   },id);
   console.log(JSON.stringify(result));assert.equal(result.state,'result');assert.ok(result.hits.some(n=>n>0));assert.ok(result.finite);
   console.log(JSON.stringify(result));
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
