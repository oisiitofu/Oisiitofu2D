const fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  await page.click('#enter-training');await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';const checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
   const reset=id=>{const f=makeFighter(0,0,id);fighters=[f,makeFighter(1,0,'dragoon')];Object.assign(f,{x:720,y:560,vx:0,vy:0,grounded:true,inv:0,intangible:0,hitlag:0,hitstun:0,respawn:0});return f;};
   const tick=(f,i={},n=1)=>{for(let j=0;j<n;j++){frame++;updateFighter(f,{...emptyInput(),...i});}};
   const jump=(id,heldFrames)=>{const f=reset(id);tick(f,{jump:true,jumpHeld:true});tick(f,{jumpHeld:true},heldFrames-1);tick(f,{jumpHeld:false});return f;};
   for(const id of Object.keys(CharacterData)){
    for(const held of [4,5]){const f=jump(id,held);check(id+' short release '+held+'F',!f.grounded&&f.shortHop&&f.vy<0&&f.shortHopGrace===0);}
    let f=jump(id,6);check(id+' held beyond grace remains full',!f.shortHop&&!f.grounded&&f.vy<0);
    // Exercise real trajectories, not a fixed velocity: each fighter has its own gravity.
    for(const short of [false,true]){
     f=reset(id);tick(f,{jump:true,jumpHeld:true,twoJumps:short});tick(f,{jumpHeld:true},f.character.jumpSquatFrames);
     check(id+' immediate launch '+short,!f.grounded&&f.shortHop===short);
     let steps=0;while(f.vy+f.character.gravity<0&&steps++<120)tick(f,{jumpHeld:true});
     const before=f.vy;tick(f,{jumpHeld:true,y:1});
     check(id+' apex fast fall '+short,before<=0&&f.fastFall&&f.vy>0,{before,vy:f.vy,mode:f.mode});
     tick(f,{y:1},120);check(id+' landing resets fast fall '+short,f.grounded&&!f.fastFall&&!f.shortHop);
    }
    f=reset(id);f.grounded=false;f.y=100;f.vy=0;PlayerStates.enter(f,'Fall');tick(f,{y:1});check(id+' exact zero apex',f.fastFall&&f.vy>0);
    f=reset(id);f.grounded=false;f.y=100;f.vy=-6;PlayerStates.enter(f,'Jump');tick(f,{y:1},18);check(id+' early held down does not auto fast fall',!f.fastFall);
    f=jump(id,4);tick(f,{jump:true,jumpHeld:true});const vy=f.vy;tick(f,{});check(id+' air jump release stays full',!f.shortHop&&f.shortHopGrace===0&&f.vy>vy&&f.vy<0);
   }
   for(const kind of ['hitstun','tumbling']){const f=reset('dragoon');f.grounded=false;f.y=100;f.vy=0;f[kind]=kind==='hitstun'?10:true;PlayerStates.enter(f,kind==='hitstun'?'Hitstun':'Tumble');tick(f,{y:1});check(kind+' cannot fast fall',!f.fastFall);}
   let f=jump('dragoon',4);tick(f,{jab:true});check('late release aerial uses short-hop damage',f.attack?.shortHopMultiplier===.85);
   f=reset('dragoon');tick(f,{guard:true},4);tick(f,{guard:true,jump:true,jumpHeld:true});tick(f,{jumpHeld:true},4);tick(f,{});check('shield jump gets release grace',f.shortHop);
   return{characters:Object.keys(CharacterData).length,checks};
  });
  fs.writeFileSync('.tools/jump-apex-results.json',JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({characters:result.characters,checks:result.checks.length,failed:result.checks.filter(c=>!c.pass),errors},null,2));
  if(errors.length||result.checks.some(c=>!c.pass))process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
