const fs=require('fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GRAB_TEST_URL||'http://localhost:4173');await page.click('#enter-training');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';countdown=0;
   const ids=Roster.definitions.map(c=>c.id),misses=[],lost=[],failures=[],ranges=[],counts={contacts:0,holds:0};
   const pair=(id,target,face,distance,mode='Idle')=>{
    const f=makeFighter(0,0,id),o=makeFighter(1,0,target);fighters=[f,o];
    for(const v of fighters){v.y=560;v.inv=v.intangible=v.hitlag=v.hitstun=v.grabImmunity=0;v.grounded=true;v.vx=v.vy=0;}
    f.x=720;f.face=face;o.face=-face;o.x=f.x+face*distance;PlayerStates.enter(o,mode);attack(f,'grab');return[f,o];
   };
   for(const id of ids){
    let [f]=pair(id,'dragoon',1,40);const a=f.attack;
    ranges.push({id,reach:a.reach,offset:a.hitboxOffset,size:a.hitboxSize,windows:a.activeFrames});
    for(const target of ids)for(const face of [-1,1])for(const mode of ['Idle','Crouch','ShieldHold'])for(const gap of [0,12,24]){
     const distance=CharacterData[id].ecb.radius+CharacterData[target].ecb.radius+gap;
     const [f,o]=pair(id,target,face,distance,mode);let touched=false;
     for(const w of f.attack.activeFrames)for(let t=w.start;t<=w.end;t++){f.timer=t;if(attackBoxes(f).some(b=>CombatSystem.contact(b,o)))touched=true;}
     counts.contacts++;if(!touched)misses.push({id,target,face,mode,gap,distance});
    }
    for(const target of ids)for(const face of [-1,1]){
     const distance=CharacterData[id].ecb.radius+CharacterData[target].ecb.radius+8;
     const [f,o]=pair(id,target,face,distance);f.timer=f.attack.activeFrames[0].start;CombatSystem.resolve();
     let captured=f.grabbed===o;
     for(let t=0;t<6;t++){frame++;updateFighter(f,emptyInput());updateFighter(o,emptyInput());if(f.characterId==='agumon')AgumonRules.tick();if(NewcomerCore.ids.includes(f.characterId))NewcomerCore.registry[f.characterId].tick();}
     counts.holds++;if(!captured||f.grabbed!==o||o.grabOwner!==f||o.mode!=='Grabbed')lost.push({id,target,face,captured,owner:o.grabOwner?.id,mode:f.mode,targetMode:o.mode});
    }
   }
   const check=(name,pass)=>{if(!pass)failures.push(name);};
   for(const id of ids)for(const face of [-1,1]){
    for(const condition of ['rear','far','startup','recovery','dodge','immunity']){
     const [f,o]=pair(id,'dragoon',face,condition==='rear'?-100:condition==='far'?300:40);
     f.timer=condition==='startup'?f.attack.activeStart-1:condition==='recovery'?f.attack.activeEnd+1:f.attack.activeStart;
     if(condition==='dodge')o.intangible=10;if(condition==='immunity')o.grabImmunity=60;
     CombatSystem.resolve();check(id+' cannot grab '+condition+' '+face,!f.grabbed);
    }
    const [f,o]=pair(id,'dragoon',face,40);f.timer=f.attack.activeStart;CombatSystem.resolve();
    for(let n=0;n<2;n++){frame++;updateFighter(f,emptyInput());updateFighter(o,emptyInput());}
    updateFighter(f,{...emptyInput(),jab:true});for(let n=0;n<3;n++){frame++;updateFighter(f,emptyInput());updateFighter(o,emptyInput());if(id==='agumon')AgumonRules.tick();if(NewcomerCore.ids.includes(id))NewcomerCore.registry[id].tick();}
    check(id+' pummel maintains hold '+face,f.grabbed===o&&o.damage>0);
    PlayerStates.enter(f,'GrabHold');f.stateFrame=5;updateFighter(f,{...emptyInput(),y:-1});check(id+' up throw releases '+face,!f.grabbed&&!o.grabOwner&&o.damage>movesFor(f).pummel.damage);
   }
   for(const size of [.65,1.5,2])for(const id of ids)for(const face of [-1,1])for(const role of ['attacker','target']){
    const [f,o]=pair(role==='attacker'?'morphie':id,role==='attacker'?id:'morphie',face,40);
    MorphieRules.resize(role==='attacker'?f:o,size);
    o.x=f.x+face*(f.character.ecb.radius+o.character.ecb.radius+8);
    f.timer=f.attack.activeStart;CombatSystem.resolve();
    check('size '+size+' '+role+' versus '+id+' '+face,f.grabbed===o);
   }
   // Use the full frame loop, including every character's post-processing.
   for(const id of ids)for(const face of [-1,1]){
    const [f,o]=pair(id,'pawapuro',face,CharacterData[id].ecb.radius+CharacterData.pawapuro.ecb.radius+8);
    for(let n=0;n<12;n++)update(true);
    check(id+' full-loop grab '+face,f.grabbed===o&&o.grabOwner===f);
    for(let n=0;n<80;n++)update(true);
    check(id+' escape clears both owners '+face,!f.grabbed&&!o.grabOwner&&o.mode!=='Grabbed');
   }
   return{characters:ids.length,counts,misses,lost,failures,ranges};
  });
  const label=process.argv[2]||'after';fs.writeFileSync(`.tools/grab-${label}.json`,JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({characters:result.characters,counts:result.counts,misses:result.misses.length,missExamples:result.misses.slice(0,8),lost:result.lost.length,lostCharacters:[...new Set(result.lost.map(c=>c.id))],failures:result.failures.slice(0,20),failureCount:result.failures.length,errors},null,2));
  if(label!=='before'&&(result.misses.length||result.lost.length||result.failures.length||errors.length))process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
