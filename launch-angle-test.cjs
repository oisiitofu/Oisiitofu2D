'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.addInitScript(()=>navigator.getGamepads=()=>[]);await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const result=await p.evaluate(()=>{
  state='pause';training=false;countdown=hitstop=0;setupStage('0');StageRules.oneOnOne=false;let checks=0;const failed=[],samples=[],trajectories=[],adjusted={};
  const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});},close=(a,b)=>Math.abs(a-b)<1e-8;
  const pair=(id,face,grounded=true)=>{fighters=[makeFighter(0,0,id),makeFighter(1,1,'dragoon')];const[f,o]=fighters;for(const q of fighters)Object.assign(q,{x:720,y:560,vx:0,vy:0,grounded,inv:0,intangible:0,stocks:99});f.face=face;o.damage=100;return[f,o];};
  // Audit all authored hit windows and angle-bearing sub-hitboxes once; no
  // image or hitbox-size sweep is needed for a launch-only common change.
  for(const{id}of Roster.definitions){const[f]=pair(id,1);for(const[type,a]of Object.entries(movesFor(f)))for(const w of a.activeFrames){const strike={...a,...w,type},t=CombatSystem.launchTrajectory(strike),boost=/smash/i.test(type)&&Math.abs(Math.cos(a.angle))>=Math.SQRT1_2?1.5:1;
   check(id+'/'+type+' finite trajectory',Number.isFinite(t.angle)&&Number.isFinite(t.velocityScale));
   const before=Math.hypot(Math.cos(strike.angle)*boost,Math.sin(strike.angle)),after=Math.hypot(Math.cos(t.angle)*t.horizontalScale,Math.sin(t.angle))*t.velocityScale;
   check(id+'/'+type+' velocity magnitude preserved',close(before,after),{before,after});
   if(t.angle!==strike.angle){adjusted[type]=(adjusted[type]||0)+1;const deg=Math.atan2(-Math.sin(t.angle),Math.abs(Math.cos(t.angle)*t.horizontalScale))*180/Math.PI;check(id+'/'+type+' upward floor',deg>=(type==='smash'?40:type==='dashAttack'?50:37)-1e-8,{deg});}
   if(['downsmash','low','downThrow','upsmash','uair'].includes(type)||type==='dair'&&AerialLaunchTuning.meteor(strike)||strike.pull||strike.fixedKnockback||strike.cancel?.next||w.end<a.activeEnd)check(id+'/'+type+' authored exception preserved',t.angle===strike.angle);
  }}
  for(const id of ['dragoon','chiikawa','edelgard','fiora','hayabusa','malenia','metabee'])for(const type of ['smash','heavy','fair','bair','dashAttack','forwardThrow','downsmash','low','upsmash','dair'])for(const face of [-1,1])for(const grounded of [false,true]){
   const[f,o]=pair(id,face,grounded),move=movesFor(f)[type],w=move.activeFrames.at(-1),a={...move,...w,type,launchDirection:face},lag=BattleFeel.hitlag(a),beforePercent=o.damage;
   const raw=CombatSystem.calculateKnockback(a,beforePercent+a.damage*1.05,o.character.weight,f.damage,a.damage*1.05),boost=/smash/i.test(type)&&Math.abs(Math.cos(a.angle))>=Math.SQRT1_2?1.5:1;
   CombatSystem.hit(f,o,a);check(id+'/'+type+' pending launch',!!o.pendingLaunch);if(!o.pendingLaunch)continue;
   check(id+'/'+type+' damage hitstun hitlag preserved',close(o.damage,beforePercent+a.damage*1.05)&&close(o.pendingLaunch.raw,raw)&&o.pendingLaunch.hitstun===Math.max(4,Math.floor(raw*.4)-1)&&o.hitlag===lag);
   const expected=CombatSystem.launchSpeed(a,raw)*Math.hypot(Math.cos(a.angle)*boost,Math.sin(a.angle));o.hitlag=1;CombatSystem.hitlag(o,emptyInput());const speed=Math.hypot(o.vx,o.vy),deg=Math.atan2(-o.vy,Math.abs(o.vx))*180/Math.PI;
   check(id+'/'+type+' actual speed preserved',close(speed,expected),{speed,expected});check(id+'/'+type+' authored launch decay preserved',close(o.launchDecay,/smash/i.test(type)?.204*Math.abs(Math.cos(a.angle)):.075));check(id+'/'+type+' left right direction',o.vx*face>0);
   if(['smash','heavy','fair','bair','dashAttack'].includes(type))check(id+'/'+type+' upward actual flight',deg>=(type==='smash'?40:32)-1e-8,{deg});
   if(id==='dragoon'&&face===1&&grounded)samples.push({id,type,beforeDegrees:Math.atan2(-Math.sin(a.angle),Math.abs(Math.cos(a.angle))*boost)*180/Math.PI,afterDegrees:deg,speed});
   particles=[];waves=[];texts=[];CombatVFX.reset();
  }
  for(const type of ['smash','upsmash','downsmash']){const[f]=pair('dragoon',1),a=movesFor(f)[type];check('untyped authored '+type+' matches attack',JSON.stringify(CombatSystem.launchTrajectory(a))===JSON.stringify(CombatSystem.launchTrajectory({...a,type})));}
  // A real projectile keeps its smash origin and receives the same angle.
  {const[f,o]=pair('metabee',1);MetabeeRules.reset();attack(f,'smash');f.timer=23;MetabeeRules.action(f,emptyInput());const q=MetabeeRules.objects[0];o.x=q.x;o.y=q.y+40;o.grounded=false;q.vx=q.vy=0;MetabeeRules.tick();check('projectile smash contact',!!o.pendingLaunch);if(o.pendingLaunch){o.hitlag=1;CombatSystem.hitlag(o,emptyInput());check('projectile smash 40 degrees',close(Math.atan2(-o.vy,Math.abs(o.vx))*180/Math.PI,40));}}
  // DI remains available in both directions rather than being clamped away.
  const di=[];for(const y of [-1,0,1]){const[f,o]=pair('dragoon',1);CombatSystem.hit(f,o,{...movesFor(f).smash,type:'smash'});o.hitlag=1;CombatSystem.hitlag(o,{...emptyInput(),y});di.push(Math.atan2(-o.vy,Math.abs(o.vx)));}check('DI retains upward and downward influence',di[0]>di[1]&&di[1]>di[2],di);
  for(const face of [-1,1])for(const percent of [0,100,150]){const[f,o]=pair('dragoon',face);o.damage=percent;o.x=face>0?1080:360;CombatSystem.hit(f,o,{...movesFor(f).smash,type:'smash',launchDirection:face});o.hitlag=1;CombatSystem.hitlag(o,emptyInput());const from={x:o.x,y:o.y};let maxHeight=0,exited=false;for(let n=0;n<100&&!o.respawn;n++){frame++;PlayerController.tick(o,emptyInput());maxHeight=Math.max(maxHeight,from.y-o.y);const main=platforms.find(p=>p.main);exited||=o.x<main.x||o.x>main.x+main.w;}trajectories.push({face,percent,maxHeight,exited,ko:!!o.respawn});check('launch rises '+face+'/'+percent,maxHeight>20);if(percent>=100)check('launch exits lip '+face+'/'+percent,exited);}
  return{characters:Roster.definitions.length,checks,failed,adjusted,samples,trajectories};
 });fs.writeFileSync('.tools/launch-angle-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,errors}));assert.equal(result.failed.length,0);assert.deepEqual(errors,[]);
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
