const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await page.evaluate(()=>{
  setupStage('0');state='pause';const checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
  function reset(id,face=1,air=false){fighters=[makeFighter(0,0,id),makeFighter(1,1,'dragoon')];for(const r of Object.values(NewcomerCore.registry))r.reset();const f=fighters[0];Object.assign(f,{x:700,y:air?-200:560,grounded:!air,gravityOff:air,face,inv:0,respawn:0,hitlag:0,hitstun:0,shizunaCP:100});Object.assign(fighters[1],{x:1900,y:560,grounded:true,inv:0,respawn:0});return f;}
  function tick(f,input={}){frame++;updateFighter(f,{...emptyInput(),...input});NewcomerCore.registry[f.characterId]?.tick();}
  for(const {id}of Roster.definitions)for(const face of[-1,1])for(const type of['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair']){
   let f=reset(id,face),data=movesFor(f)[type];if(!data||data.helpless||data.diveSpeed||data.landingMove)continue;const air=!!data.aerial;f=reset(id,face,air);attack(f,type);const original=f.attack,expected=original.activeFrames.map(w=>[w.start,w.end]),seen=new Set();let end=0;
   for(let n=0;n<180;n++){if(f.attack===original)for(let k=0;k<expected.length;k++)if(f.timer>=expected[k][0]&&f.timer<=expected[k][1])seen.add(k);tick(f);if(f.attack!==original){end=n+1;break;}}
   check('all hit windows survive '+id+' '+type+' '+face,seen.size===expected.length,{expected,seen:[...seen],end});
   check('finite motion '+id+' '+type+' '+face,end>0,end);
   if(!end)continue;
   for(const command of['heavy','jump','guard']){
    f=reset(id,face,air);attack(f,type);const old=f.attack;
    for(let n=0;n<end;n++){const raw=command==='guard'?{guard:n>=end-3}:n===Math.max(0,end-3)?{[command]:true,forceTilt:command==='heavy'}:{};tick(f,raw);}
    const good=command==='heavy'?f.attack!==old&&!!f.attack:command==='jump'?['JumpSquat','Jump'].includes(f.mode):air?['NeutralAirDodge','DirectionalAirDodge'].includes(f.mode):['ShieldStart','ShieldHold'].includes(f.mode);
    check('first actionable '+id+' '+type+' '+face+' '+command,good,{mode:f.mode,type:f.attack?.type,timer:f.timer,end});
   }
  }
  // A standing recovery authored into a special must accept input in that same
  // simulation frame, including hooks that normally clear their input buffer.
  for(const [id,type,end]of[['goemon','dragon',24],['elma','dragon',28],['elma','dash',33],['nier','dragon',17],['sans','dragon',26],['ryofu','dash',44]])for(const command of['heavy','jump','guard']){
   const f=reset(id);attack(f,type);for(let t=2;t<=end;t++)tick(f,t===end?{[command]:true,forceTilt:command==='heavy'}:{});
   check('authored idle accepts '+id+' '+type+' '+command,command==='heavy'?f.attack?.type==='heavy':command==='jump'?f.mode==='JumpSquat':f.mode==='ShieldStart',{mode:f.mode,type:f.attack?.type,timer:f.timer});
  }
  for(const type of['dragon','dash','gale'])for(const command of['heavy','jump','guard']){
   let f=reset('shizuna');attack(f,type);let end=0;while(f.attack&&end<120){tick(f);end++;}
   f=reset('shizuna');attack(f,type);for(let n=0;n<end;n++)tick(f,command==='guard'?{guard:n>=end-3}:n===end-3?{[command]:true,forceTilt:command==='heavy'}:{});
   check('Shizuna special buffered '+type+' '+command,command==='heavy'?f.attack?.type==='heavy':command==='jump'?f.mode==='JumpSquat':f.mode==='ShieldStart',{end,mode:f.mode,type:f.attack?.type});
  }
  // A charge must not be cut off by the shortened uncharged return duration.
  let f=reset('shizuna');attack(f,'smash');for(let n=0;n<35;n++)tick(f,{smashHeld:true,charge:true});check('held smash still charging',f.attack?.type==='smash'&&f.attack.chargeFrames>=25,{timer:f.timer,charge:f.attack?.chargeFrames});for(let n=0;n<80&&f.attack;n++)tick(f);check('released charge ends',!f.attack);
  // Ending the caster's motion does not remove the delayed independent hit.
  f=reset('shizuna');attack(f,'dragon');for(let n=0;n<19;n++)tick(f);const shadow=ShizunaRules.objects.find(q=>q.kind==='shadow');check('shadow survives actionable caster',!f.attack&&!!shadow);if(shadow){const o=fighters[1];Object.assign(o,{x:shadow.x+95,y:shadow.y,grounded:true,inv:0,intangible:0});for(let n=0;n<10;n++)tick(f);check('delayed shadow still damages',o.damage>0,o.damage);}
  const elma=reset('elma');attack(elma,'gale');for(let n=0;n<18;n++)tick(elma);check('idle-looking activation still applies buff',elma.ocgTime>0,elma.ocgTime);
  return {characters:Roster.definitions.length,checks};
 });
 fs.writeFileSync('.tools/motion-actionability-results.json',JSON.stringify({...result,errors},null,2));const failed=result.checks.filter(c=>!c.pass);console.log(JSON.stringify({characters:result.characters,checks:result.checks.length,failedCount:failed.length,failed:failed.slice(0,20),errors},null,2));assert.equal(failed.length,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
