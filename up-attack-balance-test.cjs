'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.addInitScript(()=>navigator.getGamepads=()=>[]);await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const result=await p.evaluate(()=>{
  state='pause';countdown=hitstop=0;setupStage('0');StageRules.oneOnOne=false;
  let checks=0;const failed=[],metrics=[],check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});},close=(a,b)=>Math.abs(a-b)<1e-7;
  const originalBoxes=UpAttackTuning.boxes,originalKnockback=UpAttackTuning.knockback;
  function pair(id,type,face=1){for(const r of Object.values(NewcomerCore.registry))r.reset();fighters=[makeFighter(0,0,id),makeFighter(1,1,'moogle')];const[f,o]=fighters;Object.assign(f,{x:720,y:400,grounded:type!=='uair',face,inv:0});Object.assign(o,{x:720,y:400,grounded:true,inv:0,intangible:0});attack(f,type);return[f,o];}
  const bounds=boxes=>boxes.length?{left:Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),right:Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius]))}:{left:720,right:720};
  for(const id of Object.keys(CharacterData))for(const type of UpAttackTuning.types){
   const[f,o]=pair(id,type),a=f.attack,all=[],old=[];check(id+'/'+type+' starts',!!a);if(!a)continue;
   const signature=JSON.stringify([a.damage,a.activeFrames,a.totalFrames,a.landingLagFrames]);
   for(let t=1;t<=a.totalFrames;t++){
    f.timer=t;const boxes=attackBoxes(f),live=!!CombatData.activeWindow(a,t);check(id+'/'+type+' inactive '+t,live||!boxes.length);all.push(...boxes);
    UpAttackTuning.boxes=(f,a,b)=>b;try{old.push(...attackBoxes(f));}finally{UpAttackTuning.boxes=originalBoxes;}
    for(const b of boxes)check(id+'/'+type+' finite '+t,[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)&&b.radius>0);
    f.face=-1;const mirrored=attackBoxes(f);f.face=1;check(id+'/'+type+' mirror count '+t,boxes.length===mirrored.length);
    for(const b of boxes)check(id+'/'+type+' mirror '+t,mirrored.some(m=>[false,true].some(s=>close(b.x1+m[s?'x2':'x1'],1440)&&close(b.x2+m[s?'x1':'x2'],1440)&&close(b.y1,m[s?'y2':'y1'])&&close(b.y2,m[s?'y1':'y2'])&&close(b.radius,m.radius)&&b.hitID===m.hitID)));
   }
   check(id+'/'+type+' damage timing unchanged',signature===JSON.stringify([a.damage,a.activeFrames,a.totalFrames,a.landingLagFrames]));
   const before=bounds(old),after=bounds(all);check(id+'/'+type+' retains original reach',after.left<=before.left&&after.right>=before.right);
   const s={...a,...a.activeFrames.at(-1)},baseline=(()=>{UpAttackTuning.knockback=a=>a;try{return CombatData.launch(s,100).knockback;}finally{UpAttackTuning.knockback=originalKnockback;}})(),speed=CombatData.launch(s,100).knockback;
   check(id+'/'+type+' never loses launch',speed>=baseline-1e-8,{baseline,speed});
   const envelope=all.find(b=>b.upAttackExtra);
   if(envelope){const p=UpAttackTuning.profiles[UpAttackTuning.family(f)],minimum=p.width+(type==='upsmash'?24:type==='uair'?8:0);check(id+'/'+type+' width floor',after.right-after.left>=minimum-1e-7);
    for(const target of ['moogle','dragoon','greymon'])for(const side of[-1,1]){const d=makeFighter(1,1,target);Object.assign(d,{x:f.x+side*30,y:f.y-45,grounded:false,inv:0,intangible:0});check(id+'/'+type+' above shoulder '+target+'/'+side,all.some(b=>CombatSystem.contact(b,d)));}
    if(type!=='uair')for(const side of[-1,1]){Object.assign(o,{x:f.x+side*30,y:f.y,grounded:true});check(id+'/'+type+' close ground '+side,all.some(b=>CombatSystem.contact(b,o)));}
    // The added lobe shares an existing strike; shields and hit history still
    // permit only one hit during a single window.
    f.timer=a.activeStart;Object.assign(o,{x:f.x+30,y:envelope.y1+32,grounded:false});CombatSystem.resolve();const damage=o.damage;f.hitlag=o.hitlag=0;CombatSystem.resolve();check(id+'/'+type+' no double hit',damage>0&&o.damage===damage);
   }
   metrics.push({id,type,family:UpAttackTuning.family(f),beforeWidth:Math.round(before.right-before.left),afterWidth:Math.round(after.right-after.left),beforeSpeed:baseline,afterSpeed:speed,projectile:!all.length});particles=[];waves=[];texts=[];CombatVFX.reset();
  }
  // Link/pull/fixed hits and all other move families stay authored.
  for(const type of ['heavy','smash','downsmash','rise']){const[f]=pair('dragoon',type),a=f.attack;check('unrelated '+type,UpAttackTuning.knockback(a)===a&&UpAttackTuning.boxes(f,a,[]) .length===0);}
  for(const extra of [{fixedKnockback:12},{pull:true},{rehitRate:4},{rehitFrames:6},{end:5,activeEnd:10}]){const a={...CombatData.moves.upsmash,type:'upsmash',...extra};check('link excluded '+JSON.stringify(extra),UpAttackTuning.knockback(a)===a);}
  // Scaling remains proportional, including the new pickup and overhead cap.
  for(const id of ['tifa','ryofu','vivi'])for(const type of UpAttackTuning.types){const[f]=pair(id,type);f.timer=f.attack.activeStart;const before=attackBoxes(f);MorphieRules.resize(f,.65);const after=attackBoxes(f);check(id+'/'+type+' scale count',before.length===after.length);before.forEach((b,i)=>check(id+'/'+type+' scaling '+i,close((b.x1-f.x)*.65,after[i].x1-f.x)&&close((b.y1-f.y)*.65,after[i].y1-f.y)&&close(b.radius*.65,after[i].radius)));}
  for(const id of ['tifa','ryofu','vivi'])for(const type of UpAttackTuning.types)for(const face of[-1,1]){const[f,o]=pair(id,type,face);f.timer=f.attack.activeStart;Object.assign(o,{x:f.x+30*face,y:f.y-20});PlayerStates.enter(o,'ShieldHold');CombatSystem.resolve();check(id+'/'+type+' shield '+face,o.damage===0&&o.shield<o.character.shieldHP);}
  const projectiles=[];
  for(const [id,type,timer]of [['metabee','upsmash',20],['metabee','uair',8],['sans','uair',3],['bomberman','upsmash',14]]){
   const[f,o]=pair(id,type),rules=id==='metabee'?MetabeeRules:id==='sans'?SansRules:BombermanRules;rules.reset();f.timer=timer;rules.action(f,emptyInput());const q=rules.objects[0];check(id+'/'+type+' projectile spawned',!!q);if(!q)continue;
   if(id==='metabee'){check(type+' wider missile',q.radius===14);for(const other of rules.objects.slice(1))other.dead=true;q.vx=q.vy=0;Object.assign(o,{x:q.x,y:q.y+40,grounded:false});}
   if(id==='sans'){check('wider sky beam',q.radius===23);Object.assign(o,{x:f.x,y:f.y-105,grounded:false});}
   if(id==='bomberman')Object.assign(o,{x:f.x,y:f.y-60,grounded:false});
   for(let n=0;n<9&&!o.pendingLaunch;n++)rules.tick();check(id+'/'+type+' projectile hit',!!o.pendingLaunch);if(o.pendingLaunch){o.hitlag=1;CombatSystem.hitlag(o,emptyInput());const angle=Math.atan2(-o.vy,Math.abs(o.vx))*180/Math.PI;check(id+'/'+type+' projectile launches up',angle>=69,{angle});projectiles.push({id,type,angle,vy:o.vy});}
  }
  const variants=[['toro',{toroForm:1}],['toro',{toroForm:2}],['hinako',{hinakoMaskTime:300}],['malenia',{maleniaRotTime:300}],['kurabe',{kurabeMechTime:300}],['eve',{eveTachyTime:300}],['goemon',{impactTime:300}],['elma',{ocgTime:300}],['nier',{nierMagic:1}],['nier',{nierMagic:2}]];
  for(const[id,variant]of variants)for(const type of UpAttackTuning.types){const[f]=pair(id,type);Object.assign(f,variant);f.attack=null;if(id==='kurabe')kurabeApply(f);attack(f,type);f.timer=f.attack.activeStart;const boxes=attackBoxes(f);check(id+'/'+type+' alternate form finite',boxes.every(b=>[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)));check(id+'/'+type+' alternate form power',CombatData.launch({...f.attack,type},100).knockback>0);}
  const flights=[];
  for(const id of ['dragoon','tifa','ryofu'])for(const type of UpAttackTuning.types){const runs=[];for(const patched of[false,true]){const[f,o]=pair(id,type);o.character=makeFighter(1,1,'dragoon').character;Object.assign(o,{x:720,y:400,grounded:false,damage:60,stocks:99});const a={...f.attack,...f.attack.activeFrames.at(-1)};if(!patched)UpAttackTuning.knockback=a=>a;try{CombatSystem.hit(f,o,a);}finally{UpAttackTuning.knockback=originalKnockback;}o.hitlag=1;CombatSystem.hitlag(o,emptyInput());const initialVy=o.vy;let height=0;for(let n=0;n<40&&!o.respawn;n++){frame++;PlayerController.tick(o,emptyInput());height=Math.max(height,400-o.y);}runs.push({patched,initialVy,height,ko:!!o.respawn});}check(id+'/'+type+' flight height maintained or improved',runs[1].height>=runs[0].height-1e-7);flights.push({id,type,runs});}
  return{characters:Object.keys(CharacterData).length,moves:metrics.length,checks,failed,metrics,projectiles,flights};
 });fs.writeFileSync('.tools/up-attack-balance-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({characters:result.characters,moves:result.moves,checks:result.checks,failed:result.failed.slice(0,15),failedCount:result.failed.length,examples:result.metrics.filter(v=>['tifa','ryofu','vivi'].includes(v.id)),errors}));assert.equal(result.failed.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
