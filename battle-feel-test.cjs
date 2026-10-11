const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-training');await p.click('#start');
 const result=await p.evaluate(()=>{
  simulationSpeed=0;acc=0;const checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
  const reset=(id='dragoon')=>{resetTraining();fighters=[makeFighter(0,0,id),makeFighter(1,2,'dragoon')];for(const f of fighters){f.x=f.id?800:700;f.y=560;f.vx=f.vy=0;f.inv=f.intangible=0;f.grounded=true;}return fighters;};
  const tick=(f,i={},n=1)=>{for(let k=0;k<n;k++){frame++;PlayerController.tick(f,{...emptyInput(),...i});}};
  for(const {id}of Roster.definitions){
   for(const direction of [-1,1]){
    let[f,o]=reset(id);f.grounded=false;f.y=-100;f.vy=2;PlayerController.beginDodge(f,{...emptyInput(),x:direction,y:-1});const start={x:f.x,y:f.y,vx:f.vx,vy:f.vy};
    tick(f,{},20);check(id+' dodge bursts then brakes '+direction,Math.abs(f.vx)<Math.abs(start.vx)*.35&&Math.abs(f.x-start.x)>100&&Math.abs(f.x-start.x)<120&&f.y<start.y,{start,x:f.x,y:f.y,vx:f.vx});
    check(id+' dodge blocks reuse '+direction,f.airDodged&&f.mode==='DirectionalAirDodge');tick(f,{},15);check(id+' dodge resumes gravity '+direction,f.vy>0);
    [f,o]=reset(id);f.grounded=false;f.y=-200;f.vx=6;f.vy=4;PlayerController.beginDodge(f,emptyInput());tick(f,{},20);check(id+' neutral dodge suspends fall '+direction,f.vy<.5&&f.y<-160);
    f.tumbling=true;f.airJumps=1;PlayerController.launchJump(f);check(id+' jump exits tumble '+direction,!f.tumbling&&f.airJumps===0);
    [f,o]=reset(id);const a={...movesFor(f).heavy,type:'heavy',staleMultiplier:1,launchDirection:direction};StageRules.oneOnOne=false;CombatSystem.hit(f,o,a);const lag=o.hitlag;check(id+' hitlag guide '+direction,lag===BattleFeel.hitlag(a));
    const flashWeak=flash;check(id+' defender reacts during freeze '+direction,o.state==='hit');
    [f,o]=reset(id);PlayerStates.enter(o,'ShieldHold');CombatSystem.hit(f,o,a);const damage=a.damage*(id==='omegamon'?1.1:1);check(id+' reduced shield stop '+direction,o.hitlag<=lag&&o.shieldStun===BattleFeel.shieldStun(a,damage));
   }
  }
  let[f,o]=reset();const a={...movesFor(f).jab,type:'jab',staleMultiplier:1};CombatSystem.hit(f,o,a);check('weak hit has no screen flash',flash===0);check('training damage label',texts.some(t=>t.text.includes('%')));
  [f,o]=reset();training=false;CombatSystem.hit(f,o,a);check('battle omits floating percent',texts.length===0);training=true;
  [f,o]=reset();const base={...movesFor(f).smash,type:'smash',staleMultiplier:1};CombatSystem.hit(f,o,base);const ordinary=o.hitlag;
  [f,o]=reset();CombatSystem.hit(f,o,{...base,charge:1});check('charged hit stops longer',o.hitlag>ordinary);
  [f,o]=reset();StageRules.oneOnOne=false;CombatSystem.hit(f,o,base);const lag=o.hitlag;
  [f,o]=reset();StageRules.oneOnOne=true;CombatSystem.hit(f,o,base);check('1v1 bonus does not lengthen hitlag',o.hitlag===lag);StageRules.oneOnOne=false;
  [f,o]=reset();o.damage=140;camera={x:720,y:395,z:StageRules.camera.maxZoom};CombatSystem.hit(f,o,base);effects();check('strong hit has a visible zoom accent',camera.z>StageRules.camera.maxZoom);
  check('electric stop multiplier',BattleFeel.hitlag({...base,element:'thunder'})>BattleFeel.hitlag(base));
  [f,o]=reset();CombatSystem.hit(f,o,{...base,hitlagMultiplier:0});check('zero lag launches immediately',!o.pendingLaunch&&o.hitstun>0&&o.hitlag===0);
  for(const raw of [25,150]){[f,o]=reset();o.pendingLaunch={raw,speed:12,angle:-.6,hitstun:20,SDIMultiplier:0};o.hitlag=2;const x=o.x;CombatSystem.hitlag(o,{...emptyInput(),x:1,y:1,flickX:true});check('zero SDI respected '+raw,o.x===x);CombatSystem.hitlag(o,{...emptyInput(),x:1,y:1});check('DI only in tumble '+raw,raw<50?o.lastLaunchAngle===-.6:Math.abs(o.lastLaunchAngle+.6)<=BattleFeel.tuning.diAngle+.00001);}
  for(const [raw,angle]of [[25,-.6],[150,-Math.PI/2]]){[f,o]=reset();o.pendingLaunch={raw,speed:12,angle,hitstun:20,SDIMultiplier:0};o.hitlag=1;CombatSystem.hitlag(o,{...emptyInput(),y:-1});check('no LSI on weak or vertical launch '+raw,o.lastLaunchSpeed===12);}
  check('shield categories',BattleFeel.shieldStun({type:'heavy'},20)>BattleFeel.shieldStun({type:'smash'},20)&&BattleFeel.shieldStun({type:'smash'},20)>BattleFeel.shieldStun({type:'fair',aerial:true},20)&&BattleFeel.shieldStun({type:'fair',aerial:true},20)>=BattleFeel.shieldStun({type:'bullet',projectile:true},20));
  [f,o]=reset();emit(700,500,'#fff',1,1,4);ring(700,500,'#fff',40,4);const initial={x:particles[0].x,life:particles[0].life,r:waves[0].r};for(let k=0;k<4;k++)effects();check('impact particles held',particles[0].x===initial.x&&particles[0].life===initial.life&&waves[0].r===initial.r);effects();check('impact particles resume',particles[0].life<initial.life&&waves[0].r>initial.r);
  CombatVFX.reset();CombatVFX.impact(700,500,0,10,1,'dragoon',5);CombatVFX.impact(900,500,0,10,1,'dragoon');for(let k=0;k<19;k++)CombatVFX.update();check('each impact freezes independently',CombatVFX.diagnostics.length===1&&CombatVFX.diagnostics[0].life===4);
  // Camera mutations must come only from 60 Hz effects, never from drawing.
  [f,o]=reset();camera={x:720,y:395,z:1};f.x=900;o.x=1100;const before={...camera};render();render();check('render does not move camera',JSON.stringify(before)===JSON.stringify(camera));effects();check('simulation advances camera',camera.x!==before.x);
  camera={x:720,y:395,z:1};f.x=700;o.x=750;f.y=100;o.y=560;for(let k=0;k<60;k++)BattleFeel.updateCamera();const verticalZoom=camera.z;f.y=560;camera={x:720,y:395,z:1};for(let k=0;k<60;k++)BattleFeel.updateCamera();check('camera frames vertical separation',verticalZoom<camera.z,{verticalZoom,horizontalZoom:camera.z});
  [f,o]=reset();o.grounded=false;o.tumbling=true;o.hitstun=20;o.lastKnockback=140;o.vx=15;o.vy=-8;frame=2;BattleFeel.update();check('launch smoke',BattleFeel.diagnostics.trails>0);CombatVFX.reset();check('reset clears presentation',BattleFeel.diagnostics.trails===0&&BattleFeel.diagnostics.cameraKick===0);

  [f,o]=reset();const savedCue=GameAudio.cue,cues=[];GameAudio.cue=(name,...args)=>{cues.push(name);};try{f.x=500;f.y=555;f.grounded=false;f.vy=14;PlayerController.physics(f,emptyInput());check('fast collision plays heavy landing',f.grounded&&cues.includes('land-heavy'));}finally{GameAudio.cue=savedCue;}
  const cameraAt=draws=>{camera={x:720,y:395,z:1};BattleFeel.reset();for(let n=0;n<60;n++){effects();for(let d=0;d<draws;d++)render();}return{...camera};};
  const at60=cameraAt(1),atHighRefresh=cameraAt(3);check('same camera at high refresh',JSON.stringify(at60)===JSON.stringify(atHighRefresh));
  [f,o]=reset();CombatVFX.impact(700,500,0,3,1,'lightning',3);CombatVFX.impact(750,500,0,20,1,'nier',3);const transform=ctx.getTransform(),alpha=ctx.globalAlpha;CombatVFX.drawImpacts();check('custom impact transforms restore',ctx.globalAlpha===alpha&&['a','b','c','d','e','f'].every(k=>ctx.getTransform()[k]===transform[k]));
  // CPU must send an up-sector input when recovering; raw steering is retained.
  for(const {id}of Roster.definitions){[f,o]=reset(id);f.x=160;f.y=700;f.grounded=false;f.airJumps=0;const i=cpu(f,o);if(i.special&&i.y<-.5)check(id+' CPU recovery uses up sector',Math.abs(i.y)>Math.abs(i.x));}
  return{total:checks.length,failed:checks.filter(c=>!c.pass)};
 });assert.deepEqual(errors,[]);console.log(JSON.stringify({...result,errors},null,2));assert.deepEqual(result.failed,[]);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
