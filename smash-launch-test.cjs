const fs=require('fs'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true}),errors=[];try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-training');await p.click('#start');const result=await p.evaluate(()=>{
 state='pause';setupStage('0');const failed=[],samples=[],trajectories=[];let checks=0;const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
 const reset=id=>{fighters=[makeFighter(0,0,id),makeFighter(1,0,'dragoon')];for(const f of fighters)Object.assign(f,{x:f.id?720:550,y:560,vx:0,vy:0,inv:0,intangible:0,hitlag:0,hitstun:0,grounded:true});return fighters;};
 StageRules.oneOnOne=true;
 for(const {id}of Roster.definitions){for(const type of ['smash','upsmash','downsmash']){
  let[f,o]=reset(id);const move=movesFor(f)[type];let prior=0;
  for(const percent of [0,50,100,150]){const a={...move,type},preview=CombatData.launch(a,percent);check(id+' '+type+' grows with percent '+percent,preview.knockback>prior);prior=preview.knockback;
   check(id+' '+type+' heavy target resists '+percent,CombatData.launch(a,percent,0,120).knockback<CombatData.launch(a,percent,0,70).knockback);
   check(id+' '+type+' charge increases '+percent,CombatData.launch(a,percent,1).knockback>preview.knockback);
   check(id+' '+type+' rage preserved '+percent,CombatData.launch(a,percent,0,90,150).knockback>preview.knockback);
   for(const charge of [0,1]){[f,o]=reset(id);o.damage=percent;const strike={...move,type,charge,launchDirection:1};CombatSystem.hit(f,o,strike);const launch=o.pendingLaunch;check(id+' '+type+' finite launch '+percent+'/'+charge,launch&&Number.isFinite(launch.speed)&&launch.speed>0,launch);check(id+' '+type+' speed calibrated '+percent+'/'+charge,Math.abs(launch.speed-launch.raw*.12)<1e-8);check(id+' '+type+' hitstun preserved '+percent+'/'+charge,launch.hitstun===Math.max(4,Math.floor(launch.raw*.4)-1));
    const preview=CombatData.launch({...strike,damage:strike.damage*(id==='omegamon'&&f.digiMode!==1?1.1:1)},percent,charge,o.character.weight,f.damage);check(id+' '+type+' preview equals hit '+percent+'/'+charge,Math.abs(preview.knockback-launch.speed)<1e-8,{preview,launch});
    o.hitlag=1;CombatSystem.hitlag(o,emptyInput());check(id+' '+type+' releases at correct speed '+percent+'/'+charge,Math.abs(o.lastLaunchSpeed-launch.speed)<1e-8);const before=o.vx;frame++;PlayerController.tick(o,emptyInput());check(id+' '+type+' horizontal launch brakes '+percent+'/'+charge,Math.abs(o.vx)<=Math.abs(before)+1e-8);
    if(percent===100&&charge===0)samples.push({id,type,speed:launch.speed,legacySpeed:launch.raw*.24,hitstun:launch.hitstun});
   }
  }
  check(id+' '+type+' raw move preview detected',Math.abs(CombatData.launch(move,100).knockback-CombatData.launch({...move,type},100).knockback)<1e-8);
 }
 let[f,o]=reset(id);const a={...movesFor(f).heavy,type:'heavy'};CombatSystem.hit(f,o,a);check(id+' normal attack unchanged',Math.abs(o.pendingLaunch.speed-o.pendingLaunch.raw*.24)<1e-8);
 }
 // Compare actual simulated trajectories with the former launch conversion.
 for(const id of ['dragoon','nier','edelgard','chiikawa','ryofu'])for(const type of ['smash','upsmash','downsmash'])for(const percent of [0,50,100,150]){
  const runs=[];for(const legacy of [false,true]){const[f,o]=reset(id);o.damage=percent;CombatSystem.hit(f,o,{...movesFor(f)[type],type,launchDirection:1});if(legacy){o.pendingLaunch.speed=o.pendingLaunch.raw*.24;o.pendingLaunch.smash=false;}o.hitlag=1;CombatSystem.hitlag(o,emptyInput());let maxX=0,maxHeight=0,koFrame=null;for(let n=1;n<=120;n++){frame++;PlayerController.tick(o,emptyInput());maxX=Math.max(maxX,Math.abs(o.x-720));maxHeight=Math.max(maxHeight,560-o.y);if(o.respawn){koFrame=n;break;}}runs.push({legacy,maxX,maxHeight,koFrame});}
  trajectories.push({id,type,percent,runs});check(id+' '+type+' shorter travel '+percent,runs[0].maxX<=runs[1].maxX+10||runs[1].koFrame!==null,{runs});if(percent===0)check(id+' '+type+' no zero-percent center KO',runs[0].koFrame===null,runs);
 }
 const projectileCases=[];
 for(const [id,type,at]of [['metabee','smash',23],['metabee','upsmash',20],['elma','downsmash',22],['kitten','downsmash',22],['sans','smash',12],['bomberman','upsmash',14],['bomberman','downsmash',15]]){
  const[f,o]=reset(id),rules=eval(id[0].toUpperCase()+id.slice(1)+'Rules');rules.reset();attack(f,type);f.timer=at;rules.action(f,emptyInput());let q=rules.objects[0];check(id+' '+type+' spawns actual object',!!q);if(!q)continue;
  check(id+' '+type+' records smash origin',q.sourceType===type,q);o.damage=100;
  if(id==='sans'){o.x=q.x+100;o.y=q.y+50;}else{o.x=q.x;o.y=560;q.x=o.x;q.y=510;q.vx=q.vy=0;if(id==='kitten')q.age=18;if(id==='elma'){q.y=555;q.vy=10;}if(id==='bomberman')q.y=525;}
  const hit=CombatSystem.hit,records=[];CombatSystem.hit=function(f,o,a,...rest){hit(f,o,a,...rest);if(o.pendingLaunch)records.push({source:a.sourceType,type:a.type,speed:o.pendingLaunch.speed,raw:o.pendingLaunch.raw});};
  try{for(let n=0;n<9&&!records.length;n++)rules.tick();}finally{CombatSystem.hit=hit;}
  check(id+' '+type+' actual projectile uses smash conversion',records.some(v=>v.source===type&&Math.abs(v.speed-v.raw*.12)<1e-8),records);projectileCases.push({id,type,records});
  if(id==='metabee'&&type==='upsmash'){const missile=rules.objects.find(v=>v.kind==='missile');if(missile){o.hitlag=0;o.pendingLaunch=null;missile.age=missile.life;rules.tick();check('metabee missile explosion retains smash origin',rules.objects.some(v=>v.kind==='blast'&&v.sourceType==='upsmash'));}}
 }
 return{characters:Roster.definitions.length,checks,failed,samples,trajectories,projectileCases};
 });fs.writeFileSync('.tools/smash-launch-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({characters:result.characters,checks:result.checks,failed:result.failed,errors,examples:result.samples.filter(v=>['dragoon','edelgard'].includes(v.id)),trajectories:result.trajectories.filter(v=>v.id==='dragoon')},null,2));if(result.failed.length||errors.length)process.exitCode=1;}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
