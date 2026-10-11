'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 await page.goto(process.env.TEST_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const result=await page.evaluate(()=>{
  state='pause';setupStage('0');GameAudio.setMuted(true);StageRules.oneOnOne=true;let checks=0;const failed=[],runs=[];
  const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
  function reset(id,target,face=1){
   const f=makeFighter(0,0,id),o=makeFighter(1,1,target);fighters=[f,o];particles=[];waves=[];ghosts=[];texts=[];burstEffects=[];CombatVFX.reset();
   Object.assign(f,{x:700,y:50,grounded:false,face,inv:0,respawn:0});Object.assign(o,{x:740,y:50,grounded:false,face:-face,inv:0,intangible:0,respawn:0});
   PlayerStates.enter(f,'Fall');PlayerStates.enter(o,'Fall');attack(f,'air');return[f,o];
  }
  function simulate(f,o,shield=false){const a=f.attack,hits=[];let finite=true;
   for(let t=0;t<150;t++){
    frame++;PlayerController.tick(f,emptyInput());PlayerController.tick(o,{...emptyInput(),guard:shield});
    const damage=o.damage;resolveCombat();if(o.damage>damage)hits.push({window:CombatData.activeWindow(a,f.timer)?.index,damage:o.damage-damage,timer:f.timer});
    finite&&=[f.x,f.y,f.vx,f.vy,o.x,o.y,o.vx,o.vy,o.damage].every(Number.isFinite);
    if(f.attack!==a&&!f.hitlag)break;
   }return{hits,finite,recorded:[...a.hitTimes.keys()]};
  }
  for(const id of ['isaac','rex'])for(const baseline of [true,false])for(const target of ['dragoon','chiikawa','moogle','greymon'])for(const percent of [0,70])for(const face of [-1,1])for(const speed of [-6,0])for(const distance of ['close','middle']){
   const[f,o]=reset(id,target,face),a=f.attack;
   // Reproduce the previous inherited finisher knockback on the first hit.
   if(baseline)a.activeFrames=a.activeFrames.map((w,k)=>k?w:{...w,baseKnockback:a.baseKnockback,knockbackGrowth:a.knockbackGrowth});
   const d=distance==='close'?f.character.ecb.radius+o.character.ecb.radius+12:70;
   Object.assign(f,{vy:speed});Object.assign(o,{x:f.x+face*d,vy:speed,damage:percent});
   const r=simulate(f,o),name=[id,baseline?'before':'after',target,percent,face,speed,distance].join(':');
   check(name+':finite',r.finite);check(name+':no-duplicate',new Set(r.hits.map(h=>h.window)).size===r.hits.length,r.hits);
   if(!baseline){check(name+':links',r.hits.length===2&&r.hits[0].window===0&&r.hits[1].window===1,r.hits);check(name+':damage',Math.abs(o.damage-percent-12.6)<1e-7,o.damage-percent);}
   runs.push({id,baseline,target,percent,face,speed,distance,...r});
  }
  for(const id of ['isaac','rex']){
   const rs=runs.filter(r=>r.id===id),before=rs.filter(r=>r.baseline&&r.hits.length===2).length,after=rs.filter(r=>!r.baseline&&r.hits.length===2).length;
   check(id+':measured-improvement',after>before,{before,after});
   for(const face of [-1,1])for(const target of ['dragoon','moogle','greymon']){
    const[f,o]=reset(id,target,face);Object.assign(f,{y:528,gravityOff:true});Object.assign(o,{x:f.x+face*35,y:560,grounded:true});PlayerStates.enter(o,'ShieldHold');o.shield=o.character.shieldHP;
    const shield=o.shield,r=simulate(f,o,true);check(id+':shield:'+target+':'+face,o.damage===0&&o.shield<shield,{damage:o.damage,shield:o.shield});
    check(id+':shield-both-windows:'+target+':'+face,r.recorded.some(k=>k==='0:1')&&r.recorded.some(k=>k==='1:1'),r.recorded);
   }
   // A standalone finishing hit still has its original launch and damage.
   for(const face of [-1,1]){
    const[f,o]=reset(id,'dragoon',face),a=f.attack,last=a.activeFrames[1];f.timer=last.start;o.x=f.x+face*40;o.damage=70;resolveCombat();
    check(id+':finisher-damage:'+face,Math.abs(o.damage-78.82)<1e-7,o.damage);
    check(id+':finisher-launch:'+face,Math.abs(o.pendingLaunch?.raw-62.14618336842105)<1e-7,o.pendingLaunch);
   }
  }
  return{checks,failed,runs};
 });fs.mkdirSync('.tools',{recursive:true});fs.writeFileSync('.tools/multihit-balance-report.json',JSON.stringify({...result,errors},null,2));
 const comparisons=['isaac','rex'].map(id=>({id,cases:result.runs.filter(r=>r.id===id&&!r.baseline).length,before:result.runs.filter(r=>r.id===id&&r.baseline&&r.hits.length===2).length,after:result.runs.filter(r=>r.id===id&&!r.baseline&&r.hits.length===2).length}));
 console.log(JSON.stringify({checks:result.checks,comparisons,failed:result.failed.slice(0,15),failureCount:result.failed.length,errors},null,2));
 assert.deepEqual(errors,[]);assert.equal(result.failed.length,0,'See .tools/multihit-balance-report.json');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
