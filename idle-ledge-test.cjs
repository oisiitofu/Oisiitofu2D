const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.stack));await page.addInitScript(()=>{requestAnimationFrame=()=>0;navigator.getGamepads=()=>[];});
 await page.goto(process.env.GAME_URL||'http://localhost:4181');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:120000});
 const mechanics=await page.evaluate(()=>{
  state='pause';training=false;GameAudio.setMuted(true);const blank=(i={})=>({...emptyInput(),...i}),checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
  function fresh(id='leanne',face=1){setupStage('0');fighters=[makeFighter(0,0,id),makeFighter(1,0,'vivi')];for(const f of fighters){PlayerStates.enter(f,'Idle');Object.assign(f,{x:720,y:platforms.find(p=>p.main).y,grounded:true,inv:0,intangible:0,respawn:0,hitlag:0,hitstun:0,ledgeCooldown:0,ledgeExitSide:0,vx:0,vy:0,face,stocks:99});}LeanneRules.reset();return fighters;}
  const idle=Roster.definitions.map(d=>{const f=makeFighter(0,0,d.id);Object.assign(f,{state:'idle',mode:'Idle',attack:null,respawn:0});const samples=[0,17,35,70,111,155].map(t=>{frame=t;f.stateFrame=t;return pose(f);});return{id:d.id,samples};});
  check('all registered idle selectors are stable',idle.every(v=>new Set(v.samples).size===1),idle.filter(v=>new Set(v.samples).size>1));
  for(const form of[0,1,2]){const[f]=fresh('toro');f.toroForm=form;check('Toro retains idle form '+form,pose(f)===[0,48,72][form]);}
  for(const id of['leanne','dragoon','nargacuga'])for(const face of[-1,1]){
   const setup=(label,options={},input={})=>{const[f]=fresh(id,face),l=StageRules.ledges.find(l=>l.face===face);PlayerStates.enter(f,'Fall');Object.assign(f,{x:l.x-face*20,y:l.y-18,grounded:false,gravityOff:true,vy:34,...options});if(options.attack){f.attack=null;attack(f,'rise');Object.assign(f.attack,{tether:true,ledgeGrabStart:1});f.timer=2;f.vy=34;}PlayerController.physics(f,blank(input));return{f,l,label};};
   let q=setup('descent');check(id+' catches descending '+face,!!q.f.ledge);
   // Start above and slightly inside the lip, cross outward while descending.
   {const[f]=fresh(id,face),l=StageRules.ledges.find(l=>l.face===face);PlayerStates.enter(f,'Fall');Object.assign(f,{x:l.x+face*5,y:l.y-12,grounded:false,gravityOff:true,vx:-face*20,vy:26});PlayerController.physics(f,blank());check(id+' airborne outward crossing is not ground run-off '+face,!!f.ledge&&!f.ledgeExitSide);}
   {const[f]=fresh(id,face),l=StageRules.ledges.find(l=>l.face===face);PlayerStates.enter(f,'Fall');Object.assign(f,{x:l.x-face*20,y:l.y-20,grounded:false,gravityOff:true,vy:f.character.ledgeGrabRange[1]+100});PlayerController.physics(f,blank());check(id+' sweeps fast descent '+face,!!f.ledge);}
   for(const [label,opts,input]of[['down',{}, {y:1}],['cooldown',{ledgeCooldown:10},{}],['hitstun',{hitstun:10},{}],['tether',{attack:{tether:true}},{}],['limit',{ledgeGrabs:6},{}]]){q=setup(label,opts,input);check(id+' blocks '+label+' '+face,!q.f.ledge);}
   {const[f]=fresh(id,face),l=StageRules.ledges.find(l=>l.face===face);Object.assign(f,{x:l.x+face*5,y:l.y,grounded:true,vx:-face*20,vy:0});PlayerController.physics(f,blank({x:-face}));check(id+' ground run-off remains free '+face,!f.ledge&&f.ledgeExitSide===face&&!f.grounded,{exit:f.ledgeExitSide,grounded:f.grounded});for(let t=0;t<4;t++)PlayerController.physics(f,blank());check(id+' run-off latch persists '+face,!f.ledge);}
   {const[f]=fresh(id,face),l=StageRules.ledges.find(l=>l.face===face);PlayerStates.enter(f,'Fall');Object.assign(f,{x:l.x-face*30,y:l.y+100,grounded:false,gravityOff:true,vy:-8});PlayerController.physics(f,blank());check(id+' rising recovery still catches '+face,!!f.ledge);}
   {const[f]=fresh(id,face),l=StageRules.ledges.find(l=>l.face===face);PlayerStates.enter(f,'Fall');Object.assign(f,{x:l.x-face*(f.character.ledgeGrabRange[0]+12),y:l.y-18,grounded:false,gravityOff:true,vy:34});PlayerController.physics(f,blank());check(id+' unchanged horizontal range '+face,!f.ledge);}
  }
  {const[f,o]=fresh();leanneConfirmed(f,o,{leanneMG:true,projectile:true});check('confirmed MG gives eight IS',leanneIS(f)===68);leanneConfirmed(f,o,{projectile:true,leanneConverted:true});check('HG conversion gives 24 IS',leanneIS(f)===92);leanneConfirmed(f,o,{projectile:true,leanneConverted:true});check('IS stays capped at100',leanneIS(f)===100);}
  for(const face of[-1,1]){const[f]=fresh('leanne',face);f.leanneIS=0;frame=127;const i=blank();LeanneRules.cpu(f,{x:f.x+face*200},i,()=>{});check('CPU considers zero IS route '+face,i.special&&i.x===face);}
  return{checks,idle,failed:checks.filter(v=>!v.pass)};
 });
 const visual=[];for(const id of['elliot','hydaelyn','leanne','magus','yuma','nights','namine','velvet','nargacuga','anubis','sukapon','chocobo','tifa']){
  await page.evaluate(async id=>{ArtLoader.retain([]);await ArtLoader.prepare([{character:id,color:0}]);},id);
  visual.push(...await page.evaluate(id=>{const out=[];state='pause';setupStage('0');const f=makeFighter(0,0,id);fighters=[f];PlayerStates.enter(f,'Idle');Object.assign(f,{x:160,y:220,grounded:true,respawn:0,inv:0,intangible:0});for(const face of[-1,1]){f.face=face;const images=[0,17,35,70,111].map(t=>{frame=t;f.stateFrame=t;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);drawSprite(f);ctx.restore();return canvas.toDataURL();});out.push({id,face,stable:images.every(v=>v===images[0])});}return out;},id));
 }
 fs.mkdirSync('previews/idle-ledge',{recursive:true});const report={...mechanics,visual,errors};fs.writeFileSync('previews/idle-ledge/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checks:mechanics.checks.length,idle:mechanics.idle.length,visual:visual.length,failed:mechanics.failed,visualFailed:visual.filter(v=>!v.stable),errors},null,2));assert.deepEqual(mechanics.failed,[]);assert.ok(visual.every(v=>v.stable));assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
