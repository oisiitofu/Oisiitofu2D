'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.goto(process.env.TEST_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:60000});
 const result=await page.evaluate(()=>{
  state='pause';const checks=[],scenarios=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
  const make=(stage,floor,face)=>{setupStage(stage);fighters=[makeFighter(0,0,'midna'),makeFighter(1,1,'dragoon')];const f=fighters[0],p=platforms[floor];Object.assign(f,{x:p.x+p.w/2,y:p.y,grounded:true,vx:0,vy:0,inv:0,intangible:0,face,ledgeCooldown:100});Object.assign(fighters[1],{x:1800,y:150,grounded:false,gravityOff:true});MidnaRules.reset();return f;};
  const step=(f,i={},moving=false)=>{frame++;if(moving)StageVisuals.tick();updateFighter(f,{...emptyInput(),...i});MidnaRules.tick();};
  for(const stage of StageCatalog.stages)for(let floor=0;floor<stage.platforms.length;floor++)for(const face of [-1,1])for(const direction of [{x:0,y:-1},{x:-1,y:-1},{x:1,y:-1},{x:-1,y:0},{x:1,y:0}]){
   const f=make(stage.id,floor,face),name=stage.id+'/'+floor+'/'+face+'/'+direction.x+','+direction.y;
   // Start through real input selection, then aim through the complete controller/physics path.
   step(f,{special:true,y:-1});check(name+' input starts up special',f.attack?.midnaWarp);
   const a=f.attack,origin={x:f.x,y:f.y};let firstCancelled=null;
   while(f.timer<a.warpFrame-1&&f.attack===a){const nextFrame=f.timer+1;step(f,direction,true);if(f.attack!==a)firstCancelled=nextFrame;}
   check(name+' survives disappearance through 19F',f.attack===a&&f.timer===19&&CombatSystem.protection(f).intangible,{firstCancelled,mode:f.mode,t:f.timer,x:f.x,y:f.y});
   const target=MidnaRules.destination(f,a);step(f,{},true);
   check(name+' reaches authored destination on 20F',Math.abs(f.x-target.x)<.001&&Math.abs(f.y-target.y)<=f.character.gravity+.001,{target,x:f.x,y:f.y,mode:f.mode});
   if(direction.y<0){check(name+' resource used after upward warp',f.recovered&&!f.grounded&&!attack(f,'rise'));for(let n=0;n<85&&f.attack;n++)step(f);check(name+' remains helpless until actual landing',f.helpless||f.grounded||!!f.ledge||f.respawn>0);}
   scenarios.push({stage:stage.id,floor,face,direction,origin,target,firstCancelled});
  }
  // Airborne aiming and occupied destinations keep their original rules.
  for(const face of [-1,1])for(const direction of [{x:0,y:-1},{x:face,y:-1},{x:face,y:0},{x:0,y:1}]){
   const f=make('0',0,face);Object.assign(f,{x:face===1?140:1300,y:690,grounded:false});attack(f,'rise');const a=f.attack;for(let n=0;n<18;n++)step(f,direction);const target=MidnaRules.destination(f,a);check('air disappearance '+face+JSON.stringify(direction),f.attack===a&&f.timer===19&&CombatSystem.protection(f).intangible);step(f);check('air destination '+face+JSON.stringify(direction),Math.abs(f.x-target.x)<.001&&Math.abs(f.y-target.y)<=f.character.gravity+.001,{target,x:f.x,y:f.y});
  }
  const f=make('0',0,1);Object.assign(f,{x:140,y:620,grounded:false});attack(f,'rise');f.attack.warpDirection={x:1,y:0};const q=MidnaRules.destination(f,f.attack);check('solid endpoint is backed out',q.blocked&&!MidnaRules.solid(f,q.x,q.y));
  return{scenarios,checks};
 });
 if(process.env.WARP_REPORT_FILE)fs.writeFileSync(process.env.WARP_REPORT_FILE,JSON.stringify({...result,errors},null,2));const failed=result.checks.filter(c=>!c.pass);console.log(JSON.stringify({scenarios:result.scenarios.length,checks:result.checks.length,failed:failed.slice(0,12),failedCount:failed.length,errors},null,2));assert.equal(failed.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
