'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 if(process.env.KNOCKBACK_BASELINE==='1')await page.route('**/game-bundle.js',async route=>{const response=await route.fetch();let body=await response.text();for(const file of ['combat-system.js','player-controller.js']){const current=fs.readFileSync(file,'utf8'),old=execFileSync('git',['show',(process.env.KNOCKBACK_BASE_REF||'c7de64e')+':'+file],{encoding:'utf8'});assert.ok(body.includes(current),file+' registered in bundle');body=body.replace(current,old);}await route.fulfill({response,body});});
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const result=await page.evaluate(()=>{
  state='pause';training=false;countdown=hitstop=0;StageRules.oneOnOne=false;
  let checks=0;const failed=[],examples=[],check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});},snap=f=>({x:f.x,y:f.y,vx:f.vx,vy:f.vy,mode:f.mode,hitstun:f.hitstun,grounded:f.grounded,attack:f.attack?.type});
  function pair(id='dragoon',stage='0'){setupStage(stage);for(const r of Object.values(NewcomerCore.registry))r.reset();const main=platforms.find(p=>p.main);fighters=[makeFighter(0,0,'dragoon'),makeFighter(1,1,id)];for(const [n,f]of fighters.entries())Object.assign(f,{x:main.x+main.w*(n?.7:.3),y:main.y,grounded:true,inv:0,intangible:0,damage:120,control:'dummy'});return fighters;}
  function step(f,input={}){frame++;PlayerController.tick(f,{...emptyInput(),...input});}
  function release(f,input={}){let n=0;while(f.hitlag&&n++<40)step(f,input);return n;}
  // Actual authored smashes, every receiving body and both horizontal directions.
  // Mashing through hitlag and hitstun must match a neutral input trajectory.
  for(const {id}of Roster.definitions)for(const side of [-1,1]){
   const runs=[];for(const mash of [false,true]){const [a,f]=pair(id);a.characterId=id;prepareFighter(a);Object.assign(a,{face:side,inv:0});const main=platforms.find(p=>p.main);Object.assign(f,{x:side<0?main.x+35:main.x+main.w-35,face:-side});const start=f.x;hit(a,f,{...movesFor(a).smash,type:'smash',launchDirection:side});const speed=f.pendingLaunch?.speed;
    release(f,mash?{jump:true,jab:true,special:true}:{});check(id+'/'+side+'/'+mash+' releases nonzero hit',f.hitstun>0&&Math.abs(f.vx)>0&&speed>0,snap(f));const ticks=Math.min(18,f.hitstun-1);for(let n=0;n<ticks;n++){step(f,mash?{jump:true,jab:true,special:true}:{});check(id+'/'+side+'/'+mash+'/'+n+' cannot act in stun',!f.attack&&f.airJumps===1&&f.hitstun>0,snap(f));}runs.push(snap(f));check(id+'/'+side+'/'+mash+' exits ledge',side*(f.x-(side<0?main.x:main.x+main.w))>20&&side*(f.x-start)>55&&!f.grounded&&!f.ledge,snap(f));
   }check(id+'/'+side+' mashing preserves full trajectory',JSON.stringify(runs[0])===JSON.stringify(runs[1]),runs);
  }
  // Flat hits on supported feet must not count as an airborne floor impact.
  // Fixed knockback isolates stage geometry from damage/weight tuning.
  for(const {id}of Roster.definitions)for(const side of [-1,1])for(const kind of ['main','floating']){
   const [a,f]=pair(id),floor=platforms.find(p=>kind==='main'?p.main:!p.main),edge=side<0?floor.x:floor.x+floor.w;
   Object.assign(f,{x:edge-side*40,y:floor.y,grounded:true});hit(a,f,{...movesFor(a).heavy,type:'heavy',fixedKnockback:100,angle:0,launchDirection:side});release(f);const start=f.x,stun=f.hitstun;for(let n=0;n<6;n++)step(f);
   check(id+'/'+side+'/'+kind+' flat hit keeps stun',f.hitstun===stun-6&&!f.attack&&f.mode!=='Knockdown',snap(f));check(id+'/'+side+'/'+kind+' slides past lip',side*(f.x-edge)>65&&side*(f.x-start)>100&&!f.grounded&&!f.ledge,snap(f));
  }
  // Every stage, both lips, low-angle launch and a hit interrupting a ground roll.
  for(const stage of StageCatalog.stages)for(const side of [-1,1])for(const angle of [0,-.45,.08]){
   const [a,f]=pair('dragoon',stage.id),main=platforms.find(p=>p.main),edge=side<0?main.x:main.x+main.w;Object.assign(f,{x:edge-side*35,face:side});PlayerController.beginDodge(f,{x:side,y:0});f.intangible=0;f.stateFrame=25;
   hit(a,f,{...movesFor(a).smash,type:'smash',fixedKnockback:100,angle,launchDirection:side});release(f);for(let n=0;n<12;n++)step(f);
   check(stage.id+'/'+side+'/'+angle+' hit roll exits stage',side*(f.x-edge)>100&&f.hitstun>0&&!f.grounded&&!f.ledge,snap(f));
  }
  for(const button of ['jump','jab','heavy','smash','special']){
   let [a,f]=pair();Object.assign(f,{x:720,y:100,grounded:false,vx:12,vy:-8,tumbling:true,hitstun:2});PlayerStates.enter(f,'Tumble');step(f,{[button]:true});check(button+' remains locked on penultimate stun frame',f.hitstun===1&&f.vx>11&&!f.attack,snap(f));step(f);check(button+' last stun frame retains momentum',f.hitstun===0&&f.vx>11&&!f.attack,snap(f));step(f);check(button+' buffered action cancels residual velocity when actionable',Math.abs(f.vx)<1&&!f.tumbling&&(button==='jump'?f.airJumps===0:button==='smash'?f.mode==='Fall':!!f.attack),snap(f));
   [a,f]=pair();Object.assign(f,{x:720,y:100,grounded:false,vx:12,vy:-8,tumbling:true,hitstun:0});PlayerStates.enter(f,'Tumble');step(f,{[button]:true});check(button+' fresh action cancels residual velocity',Math.abs(f.vx)<1&&!f.tumbling&&(button==='jump'?f.airJumps===0:button==='smash'?f.mode==='Fall':!!f.attack),snap(f));
  }
  // Real floor/wall/ceiling impacts and defensive techs still work.
  for(const side of [-1,1]){
   let [a,f]=pair(),main=platforms.find(p=>p.main);Object.assign(f,{x:720,y:main.y-3,grounded:false,vx:12*side,vy:8,tumbling:true,hitstun:30});PlayerStates.enter(f,'Tumble');step(f);check(side+' true floor impact knocks down',f.mode==='Knockdown'&&f.grounded&&f.hitstun===0,snap(f));
   [a,f]=pair();main=platforms.find(p=>p.main);Object.assign(f,{x:720,y:main.y-3,grounded:false,vx:12*side,vy:8,tumbling:true,hitstun:30});PlayerStates.enter(f,'Tumble');step(f,{guard:true});check(side+' floor tech remains',f.mode==='Tech'&&f.grounded&&!f.tumbling,snap(f));
   [a,f]=pair();main=platforms.find(p=>p.main);Object.assign(f,{x:side<0?main.x-35:main.x+main.w+35,y:main.y+35,grounded:false,vx:-side*35,vy:0,tumbling:true,hitstun:30});PlayerStates.enter(f,'Tumble');step(f);check(side+' incoming wall blocks and reflects',side*f.vx>0&&(side<0?f.x<main.x:f.x>main.x+main.w),snap(f));
  }
  // Representative before/after measurement: flat center hit and masked launch.
  for(const button of [null,'jab']){const[a,f]=pair();Object.assign(f,{x:720,y:560});hit(a,f,{...movesFor(a).heavy,type:'heavy',fixedKnockback:100,angle:0,launchDirection:1});release(f,button?{[button]:true}:{});for(let n=0;n<12;n++)step(f);examples.push({button,...snap(f)});}
  return{characters:Roster.definitions.length,checks,failed,examples};
 });fs.writeFileSync('.tools/knockback-motion-'+(process.env.KNOCKBACK_BASELINE==='1'?'before':'after')+'.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,failed:result.failed.slice(0,8),failedCount:result.failed.length,errors}));assert.equal(result.failed.length,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
