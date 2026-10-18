'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.addInitScript(()=>navigator.getGamepads=()=>[]);await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-training');await p.click('#start');await p.waitForFunction(()=>state==='battle');
 const selected=process.env.EFFECT_TEST_IDS?.split(','),result=await p.evaluate(async selected=>{state='pause';training=false;setupStage('0');const failed=[],counts={},check=(name,ok,detail)=>{checks++;if(!ok&&failed.length<60)failed.push({name,detail});};let checks=0,cases=0,overheads=0,paints=0,extensions=0;
  for(const{id}of Roster.definitions.filter(v=>!selected||selected.includes(v.id))){fighters=[];ArtLoader.retain([]);await ArtLoader.load(id);counts[id]=0;
   for(const[type,data]of Object.entries(movesFor({characterId:id}))){if(type==='grab'||type==='pummel'||type.endsWith('Throw'))continue;
    for(const w of data.activeFrames)for(const t of new Set([w.start,Math.round((w.start+w.end)/2),w.end]))for(const face of[-1,1]){
     const f=makeFighter(0,0,id);fighters=[f];Object.assign(f,{x:650,y:400,face,grounded:!data.aerial,inv:0});if(!attack(f,type))continue;f.timer=t;let boxes;try{boxes=attackBoxes(f);}catch{continue;}
     const plan=AttackEffects.plan(f);if(!plan)continue;const before=JSON.stringify(boxes);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);try{CombatVFX.slash(f);}catch(e){check(id+'/'+type+'/'+t+'/'+face+' renders',false,e.message);continue;}const seen=AttackEffects.diagnostics;cases++;counts[id]++;
     check(id+'/'+type+' no collision mutation',JSON.stringify(attackBoxes(f))===before);
     if(id==='dragoon'){check('Lalafell uses original renderer',seen.length===0);continue;}
     if(plan.upper)check(id+'/'+type+' exactly one upper arc',seen.length===1&&seen[0].box.upperArc);
     for(const box of(plan.upper?[AttackEffects.upperBox(plan)]:[...plan.boxes,...plan.overhead])){const paint=seen.find(v=>v.box.x1===box.x1&&v.box.y1===box.y1&&v.box.x2===box.x2&&v.box.y2===box.y2&&!!v.overhead===!!box.upAttackExtra);check(id+'/'+type+'/'+t+'/'+face+' paints calibrated box',!!paint);if(!paint)continue;paints++;if(box.visibleWeaponExtra)extensions++;
      const len=Math.hypot(box.x2-box.x1,box.y2-box.y1),over=!!box.upAttackExtra;check(id+'/'+type+' visible extents include radius',Math.abs(paint.width-(over?2*box.radius:len+2*box.radius))<.01&&Math.abs(paint.height-(over?len+2*box.radius:2*box.radius))<.01);
      if(!paint.procedural)check(id+'/'+type+' native character texture',characterArt[id].effects[paint.n]===paint.source);
      if(over){overheads++;const x=Math.max(0,Math.floor(box.x1-box.radius)),y=Math.max(0,Math.floor(box.y1-box.radius)),width=Math.ceil(len+2*box.radius),height=Math.ceil(2*box.radius),pixels=ctx.getImageData(x,y,width,height).data;let lo=width,hi=-1,ink=0;for(let j=0;j<height;j++)for(let i=0;i<width;i++)if(pixels[(j*width+i)*4+3]>=48){lo=Math.min(lo,i);hi=Math.max(hi,i);ink++;}check(id+'/'+type+'/'+t+'/'+face+' raster spans overhead width',hi-lo>=width*.68&&ink>12,{width,lo,hi,ink});}
     }
     // Source transforms are query-local: effects/weapon helpers invoked later
     // cannot retain native-world calibration after this hitbox request.
     check(id+'/'+type+' deterministic repeat',JSON.stringify(attackBoxes(f))===before);
    }
   }
  }
  let variants=0;for(const[id,patch,effect]of[['eve',{eveTachyTime:300},5],['hinako',{hinakoMaskTime:300},3],['kurabe',{kurabeMechTime:900},2]]){fighters=[];ArtLoader.retain([]);await ArtLoader.load(id);for(const type of['heavy','upsmash','uair'])for(const face of[-1,1]){const f=makeFighter(0,0,id);fighters=[f];Object.assign(f,{x:650,y:400,inv:0,face,...patch});if(id==='kurabe')kurabeApply(f);attack(f,type);f.timer=f.attack.activeStart;CombatVFX.slash(f);const paints=AttackEffects.diagnostics;check(id+' transformed native style '+type+'/'+face,paints.length>0&&paints.every(v=>v.n===effect));variants++;}}
  // Independent source-pixel landmarks, transformed by the ACTUAL sprite draw,
  // rather than calculating expectations with NativeStrikes/BattleSize again.
  const landmarks={ryofu:[.99,.45],eve:[.99,.40],laharl:[.99,.53],greymon:[.99,.50],metalgreymon:[.99,.50],wargreymon:[.99,.39],omegamon:[.99,.50]};let weaponPixels=0;
  for(const[id,tip]of Object.entries(landmarks)){fighters=[];ArtLoader.retain([]);await ArtLoader.load(id);for(const face of[-1,1]){const f=makeFighter(0,0,id);fighters=[f];Object.assign(f,{x:650,y:400,inv:0,face});attack(f,'heavy');f.timer=f.attack.activeStart;const img=characterArt[id].frames[pose(f)],old=ctx.drawImage;let point;ctx.setTransform(1,0,0,1,0,0);ctx.drawImage=function(source,x,y,w,h){if(source===img){const m=ctx.getTransform(),px=x+w*tip[0],py=y+h*tip[1];point={x:m.a*px+m.c*py+m.e,y:m.b*px+m.d*py+m.f};}return old.apply(this,arguments);};try{drawSprite(f);}finally{ctx.drawImage=old;}check(id+' actual source draw located '+face,!!point);if(!point)continue;
   const boxes=attackBoxes(f).filter(b=>!b.meleeInner),distance=b=>{const dx=b.x2-b.x1,dy=b.y2-b.y1,t=clamp(((point.x-b.x1)*dx+(point.y-b.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1);return Math.hypot(point.x-b.x1-t*dx,point.y-b.y1-t*dy);},box=boxes.sort((a,b)=>distance(a)-distance(b))[0];check(id+' real weapon tip inside strike '+face,distance(box)<box.radius*.6,{point,box});
   ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);CombatVFX.slash(f);const radius=Math.ceil(box.radius+12),x=Math.floor(point.x-radius),y=Math.floor(point.y-radius),size=radius*2,pixels=ctx.getImageData(x,y,size,size).data,dx=box.x2-box.x1,dy=box.y2-box.y1,len=Math.hypot(dx,dy);let ahead=-Infinity;for(let j=0;j<size;j++)for(let i=0;i<size;i++)if(pixels[(j*size+i)*4+3]>=48){const px=x+i-point.x,py=y+j-point.y;if(Math.abs(px*dy-py*dx)/len<box.radius)ahead=Math.max(ahead,(px*dx+py*dy)/len);}check(id+' visible effect extends beyond real weapon '+face,ahead>5,{ahead,point});weaponPixels++;
   for(const age of[1,4,7]){f.timer=f.attack.activeEnd+age;check(id+' afterglow has no collision '+age,attackBoxes(f).length===0);CombatVFX.slash(f);check(id+' afterglow retains calibrated paint '+age,AttackEffects.diagnostics.length>0&&AttackEffects.diagnostics.every(v=>(v.alpha??1)<.56));}
  }}
  return{forms:Object.keys(counts).length,checks,cases,paints,overheads,extensions,weaponPixels,variants,counts,failed};
 },selected);
 fs.writeFileSync(process.env.EFFECT_REPORT||'.tools/attack-effect-fit-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,counts:undefined,errors},null,2));assert.deepEqual(result.failed,[]);assert.deepEqual(errors,[]);assert.equal(result.forms,selected?.length||135);
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
