'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-training');await p.click('#start');
 const results=await p.evaluate(()=>{
  state='pause';countdown=0;const results=[];
  for(const id of ['1','0','1']){
   setupStage(id);const main=platforms.find(p=>p.main),ledges=StageRules.ledges;
   for(const anchor of ledges)for(const exit of ['getup','roll','jump','drop']){
    const f=makeFighter(0,0,'dragoon'),other=makeFighter(1,0,'dragoon');other.x=720;fighters=[f,other];
    Object.assign(f,{x:anchor.x-anchor.face*20,y:anchor.y+35,grounded:false,vx:0,vy:0,inv:0});PlayerStates.enter(f,'Fall');
    frame++;updateFighter(f,emptyInput());const caught=f.ledge===anchor&&f.mode==='LedgeCatch';
    for(let n=0;n<f.character.ledgeCatchFrames+4;n++){frame++;updateFighter(f,emptyInput());}
    const grip=ledgeHangPosition(f,anchor),aligned=Math.abs(f.x-grip.x)<.001&&Math.abs(f.y-grip.y)<.001;
    const input=exit==='getup'?{y:-1}:exit==='roll'?{guard:true}:exit==='jump'?{jump:true}:{x:-anchor.face,y:.6};
    frame++;updateFighter(f,{...emptyInput(),...input});
    const validExit=exit==='getup'||exit==='roll'?f.grounded&&f.y===main.y&&f.x>main.x&&f.x<main.x+main.w:!f.grounded&&f.ledge===null&&(exit!=='jump'||f.vy<0);
    results.push({id,edge:anchor.x,exit,caught,aligned,validExit,stableAnchors:StageRules.ledges===ledges});
   }
   // A second fighter must share the same anchor for ledge trump to work.
   const anchor=ledges[0],a=makeFighter(0,0,'dragoon'),c=makeFighter(1,0,'dragoon');fighters=[a,c];PlayerController.catchLedge(a,anchor);PlayerController.catchLedge(c,anchor);
   results.push({id,trump:a.mode==='LedgeTrump'&&a.ledge===null&&c.ledge===anchor});
   if(id==='1')for(const x of [320,1120]){const f=makeFighter(0,0,'dragoon');fighters=[f];Object.assign(f,{x,y:main.y+35,grounded:false,vx:0,vy:0,inv:0});PlayerStates.enter(f,'Fall');frame++;updateFighter(f,emptyInput());results.push({id,oldEdge:x,noPhantomGrab:f.ledge===null});}
  }
  setupStage('1');fighters=[makeFighter(0,0,'dragoon'),makeFighter(1,0,'dragoon')];
  StageRules.ledges.forEach((anchor,n)=>{const f=fighters[n];PlayerController.catchLedge(f,anchor);for(let t=0;t<f.character.ledgeCatchFrames+4;t++){frame++;updateFighter(f,emptyInput());}});camera={x:720,y:435,z:.9};render();
  return results;
 });
 for(const r of results){if('caught'in r)assert.ok(r.caught&&r.aligned&&r.validExit&&r.stableAnchors,JSON.stringify(r));if('trump'in r)assert.ok(r.trump,JSON.stringify(r));if('noPhantomGrab'in r)assert.ok(r.noPhantomGrab,JSON.stringify(r));}
 assert.deepEqual(errors,[]);await p.screenshot({path:'.tools/thunder-ledge-fixed.png'});console.log(JSON.stringify({checks:results.length,results,errors},null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
