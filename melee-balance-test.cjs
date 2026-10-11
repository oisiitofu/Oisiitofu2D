'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(process.env.TEST_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  await page.click('#enter-training');await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';countdown=hitstop=0;setupStage('0');
   let checks=0;const failed=[],metrics=[],check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
   const forward=new Set(['jab','jab2','jab3','heavy','low','dashAttack','air','fair','bair']),ids=Object.keys(CharacterData);
   function reset(id,type,face=1,target='dragoon'){
    const f=makeFighter(0,0,id),o=makeFighter(1,1,target),data=movesFor(f)[type];
    fighters=[f,o];Object.assign(f,{x:650,y:360,face,grounded:!data.aerial,inv:0,respawn:0});
    Object.assign(o,{x:1100,y:f.y,grounded:true,inv:0,intangible:0,respawn:0});attack(f,type);return[f,o];
   }
   for(const id of ids)for(const type of MeleeBalance.types){
    const data=movesFor({characterId:id})[type];if(!data)continue;
    const [f,o]=reset(id,type),a=f.attack,first=a.activeStart,last=a.activeEnd,all=[];
    for(let t=1;t<=a.totalFrames;t++){
     f.timer=t;const boxes=attackBoxes(f),active=!!CombatData.activeWindow(a,t);
     check(`${id}:${type}:inactive:${t}`,active||boxes.length===0);
     for(const b of boxes){all.push(b);check(`${id}:${type}:finite:${t}`,[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)&&b.radius>0);}
     // Reflect around the physics origin. Art anchors must not introduce a
     // one-sided reach advantage; y and collision thickness stay unchanged.
     f.face=-1;const mirrored=attackBoxes(f);f.face=1;
     check(`${id}:${type}:mirror-count:${t}`,boxes.length===mirrored.length);
     boxes.forEach((b,k)=>{const same=(m,swap)=>Math.abs(b.x1+m[swap?'x2':'x1']-2*f.x)<1e-7&&Math.abs(b.x2+m[swap?'x1':'x2']-2*f.x)<1e-7&&Math.abs(b.y1-m[swap?'y2':'y1'])<1e-7&&Math.abs(b.y2-m[swap?'y1':'y2'])<1e-7&&Math.abs(b.radius-m.radius)<1e-7&&b.hitID===m.hitID;
      check(`${id}:${type}:mirror:${t}:${k}`,mirrored.some(m=>same(m,false)||same(m,true)),{b,mirrored});});
    }
    check(`${id}:${type}:damage`,a.damage===data.damage);
    if(all.length&&MeleeBalance.applies(a)&&forward.has(type)){
     const dir=type==='bair'?-1:1,reach=Math.max(...all.flatMap(b=>[b.x1,b.x2].map(x=>(x-f.x)*dir+b.radius)));
     metrics.push({id,type,damage:a.damage,startup:a.startupFrames,recovery:a.recoveryFrames,landing:a.landingLagFrames,reach:Math.round(reach)});
     for(const target of ids)for(const face of [-1,1])for(const targetFace of [-1,1]){const d=makeFighter(1,1,target);Object.assign(d,{x:f.x+dir*face*(f.character.ecb.radius+d.character.ecb.radius),y:f.y,face:targetFace,grounded:true,inv:0,respawn:0});
      const reflected=face===1?all:all.map(b=>({...b,x1:2*f.x-b.x1,x2:2*f.x-b.x2}));
      check(`${id}:${type}:close:${target}:${face}:${targetFace}`,reflected.some(b=>CombatSystem.contact(b,d)),{reach,distance:Math.abs(d.x-f.x)});
     }
     for(const target of ['dragoon','moogle','greymon']){
      const d=makeFighter(1,1,target);Object.assign(d,{y:f.y,grounded:true,inv:0,respawn:0});let sawHit=false,sawGap=false;
      for(let distance=Math.ceil(f.character.ecb.radius+d.character.ecb.radius);distance<280;distance+=2){d.x=f.x+dir*distance;const hit=all.some(b=>CombatSystem.contact(b,d));if(hit){check(`${id}:${type}:no-hole:${target}:${distance}`,!sawGap);sawHit=true;}else if(sawHit)sawGap=true;}
     }
    }
    if(all.length){
     // Resolve real damage at the cutting edge, then attempt to hit again in
     // the same window: geometry changes may not create duplicate hits.
     const b=all[0];f.timer=first;o.x=b.x2;o.y=b.y2+42;resolveCombat();
     check(`${id}:${type}:resolves`,o.damage>0||o.shield<o.character.shieldHP,{box:b,mode:o.mode});
     const damage=o.damage;f.hitlag=o.hitlag=0;resolveCombat();
     check(`${id}:${type}:single-hit`,o.damage===damage,{before:damage,after:o.damage});
    }
    // All actions, including authored projectile normals without a capsule,
    // still have their original inclusive active window and finite recovery.
    check(`${id}:${type}:finite-motion`,a.totalFrames>=last&&a.FAF===a.totalFrames+1);
   }
   // Point-blank shielding must continue to block; opening a root hitbox may
   // not add free damage, extra hit IDs, or a new cancel after hitting shields.
   for(const id of ['tifa','shizuna','laharl','leon','omegamon','miku'])for(const face of [-1,1]){
    const [f,o]=reset(id,'heavy',face);o.x=f.x+face*30;PlayerStates.enter(o,'ShieldHold');f.timer=f.attack.activeStart;resolveCombat();
    check(`${id}:shield:${face}`,o.damage===0&&o.shield<o.character.shieldHP);
   }
   // Shrinking/growing must scale both the outer edge and inner coverage.
   for(const id of ['dragoon','tifa','miku','haseo','moogle','morphie'])for(const type of MeleeBalance.types){
    if(!movesFor({characterId:id})[type])continue;
    const [base]=reset(id,type);base.timer=base.attack.activeStart;const original=attackBoxes(base);
    for(const size of [.65,1.5]){
     const [f]=reset(id,type);MorphieRules.resize(f,size);f.timer=f.attack.activeStart;const scaled=attackBoxes(f);
     check(`${id}:${type}:size-count:${size}`,original.length===scaled.length);
     original.forEach((b,k)=>{const s=scaled[k];check(`${id}:${type}:size:${size}:${k}`,s&&Math.abs(s.x1-f.x-(b.x1-base.x)*size)<1e-6&&Math.abs(s.x2-f.x-(b.x2-base.x)*size)<1e-6&&Math.abs(s.y1-f.y-(b.y1-base.y)*size)<1e-6&&Math.abs(s.y2-f.y-(b.y2-base.y)*size)<1e-6&&Math.abs(s.radius-b.radius*size)<1e-6);});
    }
   }
   // A powered Eve used to reference nonexistent atlas frames 49..56. Test
   // the mode's actual poses and collisions, not just her unpowered moves.
   for(const type of MeleeBalance.types)for(const face of [-1,1]){
    const [f]=reset('eve',type,face);f.attack=null;f.eveTachyTime=360;attack(f,type);
    for(let t=f.attack.activeStart;t<=f.attack.activeEnd;t++){
     f.timer=t;const n=pose(f),boxes=attackBoxes(f);
     check(`eve:powered:${type}:${face}:${t}`,!!EveArtRects.frames[n]&&boxes.length>0&&boxes.every(b=>[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)));
    }
   }
   return{characters:ids.length,moves:metrics.length,checks,failed,metrics};
  });
  fs.mkdirSync('.tools',{recursive:true});fs.writeFileSync('.tools/melee-balance-report.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify({...result,failed:result.failed.map(x=>x.name).slice(0,60),failureCount:result.failed.length,metrics:undefined,errors},null,2));
  assert.deepEqual(errors,[]);assert.equal(result.failed.length,0,'See .tools/melee-balance-report.json');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
