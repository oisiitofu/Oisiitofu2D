const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const signature=name=>{const bytes=fs.readFileSync('assets/audio/se/'+name+'-1.wav');return{duration:(bytes.length-44)/192000,bytes};};
 const sounds=['dash','footstep','jump','double-jump','land-light','land-heavy','dodge'].map(signature),slash=signature('slash-light');
 assert.ok(sounds.every(s=>s.duration<.36&&!s.bytes.equals(slash.bytes)),'Movement cues stay short and distinct from the revised blade cue');assert.equal(new Set(sounds.map(s=>s.bytes.toString('base64'))).size,7);
 const browser=await chromium.launch({headless:true,channel:'msedge'});try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://localhost:4173',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-training');await page.click('#start');await page.evaluate(()=>GameAudio.preload());await page.waitForFunction(()=>GameAudio.buffers.size===180&&GameAudio.context.state==='running');
  const result=await page.evaluate(async()=>{
   simulationSpeed=0;acc=0;const counts=GameAudio.diagnostics.counts,previous={...counts};const wait=()=>new Promise(r=>setTimeout(r,35));let rows=[];
   for(const {id}of Roster.definitions){const f=makeFighter(0,0,id);f.inv=0;frame+=100;PlayerStates.enter(f,'InitialDash');GameAudio.movement(f);await wait();f.mode='Run';f.grounded=true;f.vx=4;frame+=25;GameAudio.movement(f);await wait();f.attack=null;PlayerController.launchJump(f);GameAudio.movement(f);await wait();PlayerController.launchJump(f);GameAudio.movement(f);await wait();rows.push({id,airborne:!f.grounded});}
   const deltas=Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,v-(previous[k]||0)]));simulationSpeed=1;return{rows,deltas};
  });
  assert.ok(result.rows.every(r=>r.airborne));for(const key of ['dash','footstep','jump','double-jump'])assert.ok(result.deltas[key]>0,key+' must play');assert.ok(!result.deltas['slash-light']&&!result.deltas['slash-heavy']&&!result.deltas['spear-thrust']&&!result.deltas['saber-swing'],'Moving and jumping must never trigger a weapon swing');assert.deepEqual(errors,[]);console.log(JSON.stringify({all19:result.rows.length,played:result.deltas,distinctShortSounds:true,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
