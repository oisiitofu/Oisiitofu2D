'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(process.env.TEST_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  await page.click('#enter-training');await page.click('#start');
  const result=await page.evaluate(()=>{
   // Exercise the entire battle frame, including stage/body resolution after
   // updateFighter. Controller-only tests cannot catch velocity erased here.
   state='pause';training=true;matchTime=Infinity;countdown=hitstop=0;
   const checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
   const originalRead=Controls.read,originalLocalInput=BattlePlayers.localInput;let input={};
   Controls.read=device=>({...emptyInput(),...(device==='keyboard'?input:{})});
   // These are locomotion probes. An autonomous CPU hit must not turn an
   // apex/fast-fall check into an unrelated randomized combat test.
   BattlePlayers.localInput=f=>f.control==='cpu'?emptyInput():originalLocalInput(f);
   function reset(id='dragoon',count=2,stage='0'){
    setupStage(stage);
    const main=platforms.find(p=>p.main);
    fighters=Array.from({length:count},(_,seat)=>{
     const f=makeFighter(seat,seat,seat?'dragoon':id);
     return Object.assign(f,{x:main.x+main.w*(seat+1)/(count+1),y:main.y,grounded:true,control:seat?'cpu':'keyboard',inv:0,intangible:0,respawn:0});
    });
    input={};hitstop=0;return fighters[0];
   }
   function tick(next={},frames=1){input=next;for(let n=0;n<frames;n++)update(true);}
   function launch(id,short,count=2){const f=reset(id,count),main=platforms.find(p=>p.main);f.x=main.x+main.w/2;tick({jump:true,jumpHeld:true,twoJumps:short});tick({jumpHeld:true},f.character.jumpSquatFrames);return f;}
   try{
    for(const id of Object.keys(CharacterData)){
     for(const short of [false,true]){
      const f=launch(id,short),startY=platforms.find(p=>p.main).y;
      check(`${id} launch ${short}`,!f.grounded&&f.vy<0&&f.shortHop===short,{y:f.y,vy:f.vy,mode:f.mode});
      const vy=f.vy;tick({jumpHeld:true});
      check(`${id} upward momentum ${short}`,f.vy<0&&Math.abs(f.vy-(vy+f.character.gravity))<1e-8,{before:vy,after:f.vy});
      let steps=0;while(!f.grounded&&f.vy+f.character.gravity<0&&steps++<120)tick({jumpHeld:true});
      check(`${id} reaches apex ${short}`,steps<120&&!f.grounded&&f.y<startY-20);
      tick({y:1,jumpHeld:true});
      check(`${id} apex fast fall ${short}`,f.fastFall&&f.vy>0,{vy:f.vy,mode:f.mode});
      steps=0;while(!f.grounded&&steps++<180)tick();
      check(`${id} lands ${short}`,f.grounded&&steps<180&&!f.fastFall,{y:f.y,vy:f.vy,mode:f.mode});
     }
     let f=reset(id);f.y=100;f.grounded=false;PlayerStates.enter(f,'Fall');
     tick({},5);
     check(`${id} falling accelerates`,f.vy>f.character.gravity*4.9&&f.y>100,{vy:f.vy,y:f.y});
     let steps=0;while(!f.grounded&&steps++<180)tick();
     check(`${id} falling lands`,f.grounded&&steps<180);
     f=launch(id,false);tick({jumpHeld:true},5);tick();
     tick({jump:true,jumpHeld:true});
     check(`${id} air jump momentum`,!f.grounded&&f.vy<0&&Math.abs(f.vy-(-f.character.doubleJumpVelocity+f.character.gravity))<1e-8,{vy:f.vy,mode:f.mode});
    }
    for(const count of [2,3,4]){
     const f=launch('dragoon',false,count);tick({jumpHeld:true},8);
     check(`${count} player jump continues`,!f.grounded&&f.vy<0&&f.y<500,{y:f.y,vy:f.vy});
    }
    for(const vy of [-8,8]){
     const f=reset('dragoon',4);f.grounded=false;f.y=100;f.vy=vy;f.hitstun=20;PlayerStates.enter(f,'Hitstun');
     tick();check(`knockback vertical momentum ${vy}`,Math.abs(f.vy-(vy+f.character.gravity))<1e-8,{vy:f.vy});
    }
    for(const vy of [-8,0,8]){
     const f=reset();f.grounded=false;f.y=100;f.vy=vy;
     resolveFighterBodies(fighters.map(o=>({x:o.x,y:o.y})));
     check(`airborne body resolution preserves ${vy}`,f.vy===vy&&!f.grounded);
    }
    for(const count of [2,4]){
     const f=reset('dragoon',count),main=platforms.find(p=>p.main);
     fighters.forEach((o,n)=>{o.x=main.x-8+n*5;o.y=main.y;});
     resolveFighterBodies(fighters.map(o=>({x:o.x,y:o.y})));
     check(`${count} bodies pushed off ledge lose support`,!f.grounded&&f.vy===0,{x:f.x,grounded:f.grounded});
     f.ledgeCooldown=60;tick();
     check(`${count} bodies pushed off ledge fall`,!f.grounded&&f.vy>0&&f.y>main.y,{x:f.x,y:f.y,vy:f.vy});
    }
    for(const stage of StageCatalog.stages.filter(s=>s.platforms.some(p=>p.motion))){
     const f=reset('dragoon',2,stage.id),platform=platforms.find(p=>p.motion);
     f.x=platform.x+platform.w/2;f.y=platform.y;tick({},30);
     check(`${stage.id} moving platform carries grounded fighter`,f.grounded&&Math.abs(f.y-platform.y)<1e-8&&f.x>platform.x&&f.x<platform.x+platform.w);
     tick({jump:true,jumpHeld:true});tick({jumpHeld:true},f.character.jumpSquatFrames+3);
     check(`${stage.id} jump leaves moving platform`,!f.grounded&&f.vy<0,{y:f.y,vy:f.vy});
    }
   }finally{Controls.read=originalRead;BattlePlayers.localInput=originalLocalInput;}
   return{characters:Object.keys(CharacterData).length,checks};
  });
  const failed=result.checks.filter(c=>!c.pass);
  console.log(JSON.stringify({characters:result.characters,checks:result.checks.length,failed,errors},null,2));
  assert.deepEqual(failed,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
