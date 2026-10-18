'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.addInitScript(()=>navigator.getGamepads=()=>[]);
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-training');await page.click('#start');await page.waitForFunction(()=>state==='battle');
 const result=await page.evaluate(()=>{
  state='pause';training=false;countdown=hitstop=0;setupStage('0');StageRules.oneOnOne=false;
  const coverage=MeleeBalance.coverage,failed=[],metrics=[],grazes=[],counts={},check=(name,ok,detail)=>{checks++;if(!ok)failed.push({name,detail});};let checks=0,windows=0,changed=0,protectedBoxes=0;
  const key=b=>JSON.stringify([b.x1,b.y1,b.x2,b.y2,b.hitID,b.window?.index,b.modifiers]);
  function previous(f){try{MeleeBalance.coverage=(f,a,b)=>b;return attackBoxes(f);}finally{MeleeBalance.coverage=coverage;}}
  function reset(id,type,face=1,patch={}){for(const r of Object.values(NewcomerCore.registry))r.reset();const f=makeFighter(0,0,id),o=makeFighter(1,0,'moogle'),data=movesFor(f)[type];fighters=[f,o];Object.assign(f,{x:650,y:360,face,inv:0,intangible:0,grounded:!data.aerial,...patch});Object.assign(o,{x:1100,y:360,inv:0,intangible:0,grounded:true});if(id==='kurabe'&&patch.kurabeMechTime)kurabeApply(f);attack(f,type);return[f,o];}
  const types=['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'];
  for(const{id}of Roster.definitions){counts[id]=0;for(const[type,data]of Object.entries(movesFor(makeFighter(0,0,id))))for(const face of[1,-1]){
   const[f,o]=reset(id,type,face),a=f.attack;if(!a)continue;const snapshots=[];let widestBefore=0,widestAfter=0;
   for(const w of a.activeFrames)for(const t of new Set([w.start,Math.round((w.start+w.end)/2),w.end])){
    f.timer=t;const before=previous(f),saved=JSON.stringify(before),after=attackBoxes(f),outer=after.filter(b=>!b.coverageBridge);windows++;
    check(`${id}:${type}:${face}:${t}:count`,outer.length===before.length);
    check(`${id}:${type}:${face}:${t}:no-mutation`,JSON.stringify(before)===saved);
    check(`${id}:${type}:${face}:${t}:idempotent`,JSON.stringify(coverage(f,a,after))===JSON.stringify(after));
    before.forEach((b,n)=>{const next=outer[n],eligible=MeleeBalance.coverageApplies(a,b);if(eligible)changed++;else protectedBoxes++;
     check(`${id}:${type}:${face}:${t}:${n}:line`,key(b)===key(next));
     check(`${id}:${type}:${face}:${t}:${n}:radius`,Number.isFinite(next.radius)&&next.radius>0&&(eligible?next.radius>b.radius:next.radius===b.radius));
     if(eligible)check(`${id}:${type}:${face}:${t}:${n}:bounded`,next.radius-b.radius<=11*MorphieRules.scale(f)*BattleSize.geometry(f)+1e-7);
    });
    for(const b of after.filter(b=>b.coverageBridge))check(`${id}:${type}:${face}:${t}:bridge-id`,b.meleeInner&&before.some(v=>(v.hitID??v.window?.index)===(b.hitID??b.window?.index)));
    if(before.length){const width=bs=>Math.max(...bs.map(b=>Math.max(b.x1,b.x2)+b.radius))-Math.min(...bs.map(b=>Math.min(b.x1,b.x2)-b.radius));widestBefore=Math.max(widestBefore,width(before));widestAfter=Math.max(widestAfter,width(after));snapshots.push({t,before,after});}
   }
   for(const t of[0,a.activeStart-1,a.activeEnd+1,a.totalFrames+1]){if(CombatData.activeWindow(a,t))continue;f.timer=t;check(`${id}:${type}:${face}:${t}:inactive`,attackBoxes(f).length===0);}
   if(!snapshots.length)continue;counts[id]++;metrics.push({id,type,face,before:widestBefore,after:widestAfter});
   // Use real hurt circles and CombatSystem.contact/resolve at a grazing
   // position that missed EVERY old capsule, including existing inner ones.
   if(types.includes(type)&&!a.projectile){let found=false;
    for(const s of snapshots){if(found)break;for(const box of s.before){if(found)break;for(const end of[0,1]){if(found)break;for(let k=0;k<16;k++){
     const h=hurtboxes(o).find(h=>h.part==='torso')||hurtboxes(o)[0],ang=k*Math.PI/8,pad=MeleeBalance.margins[UpAttackTuning.family(f)]*MorphieRules.scale(f)*BattleSize.geometry(f),r=box.radius+h.r+pad*.55;
     const x=box[end?'x2':'x1']+Math.cos(ang)*r,y=box[end?'y2':'y1']+Math.sin(ang)*r;
     o.x+=x-h.x;o.y+=y-h.y;
     if(s.before.some(b=>CombatSystem.contact(b,o))||!s.after.some(b=>CombatSystem.contact(b,o)))continue;
     f.timer=s.t;resolveCombat();check(`${id}:${type}:${face}:grazing-hit`,o.damage>0||o.shield<o.character.shieldHP);const damage=o.damage;f.hitlag=o.hitlag=0;resolveCombat();check(`${id}:${type}:${face}:single-hit`,o.damage===damage);
     grazes.push({id,type,face});found=true;break;
    }}}}
    check(`${id}:${type}:${face}:grazing-case`,found);
   }
  }}
  for(const id of['ryofu','eve','laharl','agumon','greymon','metalgreymon','wargreymon','omegamon','tifa','chiikawa'])for(const face of[-1,1])for(const type of['heavy','smash','fair']){
   const[f,o]=reset(id,type,face);f.timer=f.attack.activeStart;o.x=f.x+face*(f.character.ecb.radius+o.character.ecb.radius);o.y=f.y;const all=[];for(const w of f.attack.activeFrames)for(let t=w.start;t<=w.end;t++){f.timer=t;all.push(...attackBoxes(f));}check(`${id}:${type}:${face}:close-small`,all.some(b=>CombatSystem.contact(b,o)));
   const sf=reset(id,type,face),g=sf[0],d=sf[1];g.timer=g.attack.activeStart;const box=attackBoxes(g).find(b=>!b.meleeInner);d.x=box.x2;d.y=box.y2+35;PlayerStates.enter(d,'ShieldHold');resolveCombat();check(`${id}:${type}:${face}:guard`,d.damage===0&&d.shield<d.character.shieldHP);
  }
  for(const[id,patch]of[['eve',{eveTachyTime:360}],['hinako',{hinakoMaskTime:600}],['hayabusa',{hayaGleamTime:600}],['kurabe',{kurabeMechTime:600}]])for(const type of types){const[f]=reset(id,type,1,patch);check(`${id}:${type}:form-active`,Object.entries(patch).every(([k,v])=>f[k]===v));for(const w of f.attack.activeFrames){f.timer=w.start;check(`${id}:${type}:form`,attackBoxes(f).every(b=>[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)));}}
  for(const size of[.65,1.5])for(const id of['ryofu','tifa','morphie']){const[f]=reset(id,'smash');f.timer=f.attack.activeStart;const base=attackBoxes(f);const[g]=reset(id,'smash');MorphieRules.resize(g,size);g.timer=g.attack.activeStart;const scaled=attackBoxes(g);check(`${id}:${size}:scale-count`,base.length===scaled.length);base.forEach((b,k)=>check(`${id}:${size}:${k}:scale`,Math.abs(scaled[k].radius-b.radius*size)<1e-7&&Math.abs(scaled[k].x1-g.x-(b.x1-f.x)*size)<1e-7&&Math.abs(scaled[k].y1-g.y-(b.y1-f.y)*size)<1e-7));}
  // Independently reviewed native weapon tips, including the former vertically
  // misplaced claws/sword. Their perimeter must retain a few pixels of grace.
  for(const[id,type,n,x,y]of[['wargreymon','jab',6,.99,.24],['wargreymon','heavy',9,.99,.39],['wargreymon','dashAttack',12,.99,.30],['wargreymon','fair',13,.99,.28],['wargreymon','bair',14,.02,.25],['metalgreymon','fair',13,.99,.81],['metalgreymon','bair',14,.02,.34],['greymon','bair',14,.02,.27],['omegamon','jab',6,.99,.74],['omegamon','fair',13,.99,.20]])for(const face of[-1,1]){
   const[f]=reset(id,type,face);f.timer=f.attack.activeStart;const cap=id[0].toUpperCase()+id.slice(1),rect=eval(cap+'ArtRects').frames[n],scale=BattleSize.native(id,n)*FIGHTER_SCALE,tip={x:f.x+(x-NewcomerArtAnchors[id][n])*rect[2]*scale*face,y:f.y+(y-1)*rect[3]*scale};
   const bs=attackBoxes(f);for(let k=0;k<8;k++){const point={x:tip.x+Math.cos(k*Math.PI/4)*5,y:tip.y+Math.sin(k*Math.PI/4)*5};check(`${id}:${type}:${face}:${k}:native-tip`,bs.some(b=>{const dx=b.x2-b.x1,dy=b.y2-b.y1,t=clamp(((point.x-b.x1)*dx+(point.y-b.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1);return Math.hypot(point.x-b.x1-t*dx,point.y-b.y1-t*dy)<=b.radius;}));}
  }
  // The projectile special also has a separate physical follow-up window.
  {const[f]=reset('eve','dash');f.attack.specialWas=false;f.timer=16;EveRules.action(f,{...emptyInput(),special:true});f.timer=18;check('eve:hybrid-followup',attackBoxes(f).some(b=>b.coveragePadding>0));check('eve:projectile-radius',EveRules.objects.every(q=>q.kind!=='cross'||q.radius===25));}
  fighters=[];return{characters:Object.keys(counts).length,checks,windows,changed,protectedBoxes,grazes:grazes.length,failed,metrics,counts};
 });
 fs.writeFileSync('.tools/attack-coverage-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,metrics:undefined,counts:undefined,failed:result.failed.slice(0,25),errors},null,2));assert.equal(result.characters,135);assert.deepEqual(result.failed,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
