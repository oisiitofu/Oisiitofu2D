'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const result=await p.evaluate(()=>{
  state='pause';training=false;setupStage('0');StageRules.oneOnOne=false;
  const failed=[],rows=[];let checks=0;const check=(name,ok,detail)=>{checks++;if(!ok)failed.push({name,detail});};
  function run(id,face,percent,edge,before,type='smash'){
   const a=makeFighter(0,0,id),f=makeFighter(1,1,'dragoon'),main=platforms.find(p=>p.main);fighters=[a,f];burstEffects=[];
   Object.assign(a,{face,inv:0});Object.assign(f,{x:edge?face>0?main.x+main.w-100:main.x+100:720,y:560,damage:percent,inv:0,grounded:false});
   const attack={...movesFor(a)[type],type,launchDirection:face};hit(a,f,attack);
   const pending={...f.pendingLaunch};f.hitlag=1;CombatSystem.hitlag(f,emptyInput());
   const actual={vx:f.vx,vy:f.vy,stun:f.hitstun};if(before&&Math.abs(Math.cos(pending.angle))>=Math.SQRT1_2)f.vx/=1.5;
   let ticks=0,maxX=0;while(!f.respawn&&ticks++<180){frame++;PlayerController.tick(f,emptyInput());maxX=Math.max(maxX,Math.abs(f.x-720));}
   return{side:burstEffects.at(-1)?.side||null,ticks,maxX,actual,pending};
  }
  for(const {id}of Roster.definitions)for(const face of [-1,1])for(const percent of [0,80,120,160]){
   const old=run(id,face,percent,false,true),now=run(id,face,percent,false,false);
   rows.push({id,face,percent,before:{side:old.side,ticks:old.ticks},after:{side:now.side,ticks:now.ticks}});
   check(id+'/'+face+'/'+percent+' finite',Number.isFinite(now.actual.vx)&&Number.isFinite(now.actual.vy));
   check(id+'/'+face+'/'+percent+' vertical component preserved',now.actual.vy===old.actual.vy);
   check(id+'/'+face+'/'+percent+' stun preserved',now.actual.stun===old.actual.stun);
   check(id+'/'+face+'/'+percent+' horizontal component corrected',Math.abs(now.actual.vx-old.pending.speed*Math.cos(old.pending.angle)*(Math.abs(Math.cos(old.pending.angle))>=Math.SQRT1_2?1.5:1))<1e-8);
   if(percent===0)check(id+'/'+face+' zero percent center survives',!now.side,now);
  }
  for(const face of [-1,1])for(const percent of [80,120,160]){
   const old=run('dragoon',face,percent,false,true),now=run('dragoon',face,percent,false,false),edge=run('dragoon',face,percent,true,false);
   check('horizontal KO '+face+'/'+percent,now.side===(face>0?'right':'left'),{old,now});
   check('edge KOs sooner '+face+'/'+percent,edge.ticks<now.ticks,{edge,now});
  }
  for(const type of ['heavy','fair','upsmash']){const r=run('dragoon',1,120,false,false,type);check(type+' original vertical launch',Math.abs(r.actual.vy-Math.sin(r.pending.angle)*r.pending.speed)<1e-8);if(type!=='upsmash')check(type+' unchanged horizontal',Math.abs(r.actual.vx-Math.cos(r.pending.angle)*r.pending.speed)<1e-8);}
  return{checks,failed,rows};
 });fs.writeFileSync('.tools/horizontal-burst-report.json',JSON.stringify(result,null,2));assert.deepEqual(result.failed,[]);assert.deepEqual(errors,[]);console.log(JSON.stringify({checks:result.checks,errors,examples:result.rows.filter(r=>r.id==='dragoon'&&r.face===1)}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
