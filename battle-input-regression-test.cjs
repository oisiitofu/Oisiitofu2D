'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));
  await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await p.click('#enter-training');await p.click('#start');
  const result=await p.evaluate(()=>{
   state='pause';countdown=hitstop=0;const failures=[];let checks=0;
   const check=(name,ok,detail)=>{checks++;if(!ok)failures.push({name,detail});};
   const read=Controls.read;let input={};Controls.read=()=>({...emptyInput(),...input});
   function reset(id='dragoon',stage='0'){
    setupStage(stage);for(const r of Object.values(NewcomerCore.registry))r.reset();
    const main=platforms.find(p=>p.main);fighters=[makeFighter(0,0,id),makeFighter(1,1,'dragoon')];
    for(const [n,f]of fighters.entries())Object.assign(f,{x:main.x+main.w*(n?.85:.35),y:main.y,grounded:true,control:n?'dummy':'keyboard',inv:0,intangible:0,respawn:0});
    input={};hitstop=0;return fighters[0];
   }
   function tick(i={},n=1){input=i;for(let k=0;k<n;k++)update(true);}
   const snap=f=>({mode:f.mode,x:f.x,y:f.y,vx:f.vx,vy:f.vy,face:f.face,hitstun:f.hitstun,attack:f.attack?.type,fastFall:f.fastFall});
   try{
    for(const stage of ['0','1']){
     const f=reset('dragoon',stage),main=platforms.find(p=>p.main),sides=platforms.filter(p=>!p.main).slice(0,2);
     check(stage+' ground widened',main.w===(stage==='0'?960:1120));
     check(stage+' lower separated platforms',sides[0].y>=412&&sides[1].x-sides[0].x-sides[0].w>=(stage==='0'?290:360));
     check(stage+' ledges match art/collision',StageRules.ledges[0].x===main.x&&StageRules.ledges[1].x===main.x+main.w);
    }
    for(const {id}of Roster.definitions)for(const side of [-1,1]){
     // Begin each dodge through real input. Once released, its momentum alone
     // must never carry the actor off either kind of supporting platform.
     for(const kind of ['main','floating'])for(const roll of ['forward','backward','spot']){
      let f=reset(id),floor=platforms.find(p=>kind==='main'?p.main:!p.main);
      Object.assign(f,{x:side<0?floor.x+3:floor.x+floor.w-3,y:floor.y,face:roll==='backward'?-side:side});
      const originalFace=f.face;tick(roll==='spot'?{guard:true,y:1}:{guard:true,x:side});
      const expected=roll==='spot'?'SpotDodge':roll==='forward'?'ForwardRoll':'BackwardRoll';
      check(id+'/'+side+'/'+kind+'/'+roll+' starts',f.mode===expected,snap(f));
      let supported=true,steps=0;while(f.mode===expected&&steps++<60){tick();supported&&=f.grounded&&f.x>=floor.x&&f.x<=floor.x+floor.w;}
      check(id+'/'+side+'/'+kind+'/'+roll+' stays on platform',supported&&steps<60,snap(f));
      check(id+'/'+side+'/'+kind+'/'+roll+' final facing',f.face===(roll==='forward'?-originalFace:originalFace),snap(f));
     }
     // Walking and jumping out retain control without an automatic ledge grab.
     for(const jump of [false,true]){
      let f=reset(id),main=platforms.find(p=>p.main);Object.assign(f,{x:side<0?main.x+1:main.x+main.w-1,face:side});
      tick(jump?{x:side,jump:true,jumpHeld:true}:{x:side});let grabbed=false;
      for(let n=0;n<30;n++){tick({x:side,jumpHeld:jump});grabbed||=['LedgeCatch','LedgeHang'].includes(f.mode);}
      check(id+'/'+side+'/'+jump+' exits freely',!grabbed&&!f.grounded&&(side<0?f.x<main.x:f.x>main.x+main.w),snap(f));
     }
     for(const vy of [-2,2]){
      const f=reset(id),ledge=StageRules.ledges.find(l=>l.face===-side);Object.assign(f,{x:ledge.x+side*22,y:ledge.y+24,grounded:false,vy,face:-side});PlayerStates.enter(f,'Fall');tick();
      check(id+'/'+side+'/'+vy+' recovery grabs below',f.mode==='LedgeCatch',snap(f));
     }
     // Hitstun owns momentum until it ends, even when attack/jump is mashed.
     for(const button of ['jump','jab','heavy','smash','special']){
      const f=reset(id);Object.assign(f,{x:720,y:80,grounded:false,vx:12*side,vy:-8,hitstun:20,tumbling:true});PlayerStates.enter(f,'Tumble');tick({[button]:true});
      check(id+'/'+side+'/'+button+' keeps launch during stun',Math.abs(f.vx-(12-.075)*side)<1e-8&&Math.abs(f.vy-(-8+f.character.gravity))<1e-8,snap(f));
      check(id+'/'+side+'/'+button+' retains stun without action',f.hitstun===19&&!f.attack&&f.airJumps===1,snap(f));
     }
     for(const fast of [false,true]){
      const f=reset(id);Object.assign(f,{x:720,y:80,grounded:false,vy:2,face:side,fastFall:fast,eveEnergy:100,donSoul:100});PlayerStates.enter(f,'Fall');tick({y:1,special:true});
      check(id+'/'+side+'/'+fast+' down special suppresses fast fall',!f.fastFall&&!!f.attack?.downSpecialInput,snap(f));
     }
    }
    // A button during hitlag cannot erase the queued launch or skip the stun.
    for(const button of ['jump','jab','special']){
     const f=reset();Object.assign(f,{grounded:false,y:80});CombatSystem.freeze(f,4);f.pendingLaunch={angle:-.7,speed:15,raw:70,hitstun:24};tick({[button]:true});
     check(button+' hitlag keeps freeze and launch',f.hitlag===3&&f.pendingLaunch.speed===15,snap(f));tick({},3);
     check(button+' queued launch releases',f.hitlag===0&&f.hitstun===24&&f.vx>10&&f.vy<-9&&!f.attack,snap(f));
    }
    // Ordinary down flicks and down-special's authored dive remain distinct.
    for(const button of ['jump','jab','special']){
     const f=reset();Object.assign(f,{grounded:false,y:80,vx:12,vy:-8,hitstun:20,tumbling:true});PlayerStates.enter(f,'Tumble');hitstop=2;tick({[button]:true});
     check(button+' KO freeze keeps momentum',hitstop===1&&f.hitstun===20&&f.vx===12&&f.vy===-8,snap(f));tick({},2);
     check(button+' KO freeze does not execute forbidden action',f.hitstun===19&&!f.attack&&f.airJumps===1,snap(f));
    }
    // A nearby opponent and a moving platform must not defeat the edge guard.
    for(const stage of ['0','2'])for(const side of [-1,1])for(const mode of ['SpotDodge','ForwardRoll','BackwardRoll','TechRoll','GetupRoll','LedgeRoll']){
     const f=reset('dragoon',stage),floor=platforms.find(p=>!p.main)||platforms[0],other=fighters[1];
     Object.assign(f,{x:side<0?floor.x+2:floor.x+floor.w-2,y:floor.y,face:side,vx:side*7});
     Object.assign(other,{x:f.x-side*12,y:floor.y});
     if(PlayerController.dodgeData[mode]){f.face=mode==='BackwardRoll'?-side:side;PlayerController.beginDodge(f,{x:mode==='SpotDodge'?0:side,y:mode==='SpotDodge'?1:0});f.stateFrame=20;}
     else PlayerStates.enter(f,mode,30);
     tick();
     check(stage+'/'+side+'/'+mode+' opponent cannot push dodge off',f.grounded&&f.x>=floor.x&&f.x<=floor.x+floor.w,snap(f));
    }
    let f=reset();Object.assign(f,{y:80,grounded:false,vy:2});PlayerStates.enter(f,'Fall');tick({y:1});check('ordinary fast fall remains',f.fastFall&&f.vy>2,snap(f));
    f=reset('knight');Object.assign(f,{y:80,grounded:false,vy:2});PlayerStates.enter(f,'Fall');tick({y:1,special:true});let dove=false;for(let n=0;n<30&&f.attack;n++){tick({y:1});dove||=f.vy>10;}check('authored down-special dive remains',dove&&!f.fastFall,snap(f));
    // A down-special from a floating platform attacks instead of dropping first.
    f=reset();const floor=platforms.find(p=>!p.main);Object.assign(f,{x:floor.x+floor.w/2,y:floor.y});tick({y:1,special:true});check('ground down-special does not drop through',f.drop===0&&!!f.attack?.downSpecialInput,snap(f));
   }finally{Controls.read=read;}
   return{characters:Roster.definitions.length,checks,failures};
  });
  fs.writeFileSync('.tools/battle-input-regression-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,failures:result.failures.slice(0,25),failedCount:result.failures.length,errors},null,2));assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
