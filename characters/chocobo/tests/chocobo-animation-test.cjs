const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const old=JSON.parse(fs.readFileSync('characters/chocobo/tests/legacy-art-checks.json')),now=JSON.parse(fs.readFileSync('assets/ready/manifest.json')).characters.chocobo;
 assert.deepEqual(now.checks.frames.slice(0,43),old.checks.frames);assert.deepEqual(now.checks.effects,old.checks.effects);
 for(let color=0;color<5;color++)assert.deepEqual(now.checks.tints[color].slice(0,43),old.checks.tints[color]);
 for(const k of ['portraits','selectionPortraits','selectionThumbnails','selectionCrop'])assert.deepEqual(now[k],old[k],k+' unchanged');
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await page.evaluate(()=>{
  state='pause';setupStage('0');let checks=0;const failures=[],timings={},check=(name,ok,detail)=>{checks++;if(!ok)failures.push({name,detail});};
  function reset(face=1){const f=makeFighter(0,0,'chocobo');Object.assign(f,{x:700,y:560,grounded:true,face,inv:0,respawn:0,hitstun:0,hitlag:0});fighters=[f,makeFighter(1,0,'chiikawa')];return f;}
  check('16 parts baked',characterArt.chocobo.frames.length===59);
  for(const face of [-1,1])for(const type of Object.keys(ChocoboMoves)){
   const f=reset(face);if(['air','fair','bair','uair','dair'].includes(type))f.grounded=false;attack(f,type);const a=f.attack;check('attack exists '+type,!!a);if(!a)continue;
   timings[type]={startup:a.startupFrames,active:a.activeFrames.map(w=>[w.start,w.end]),total:a.totalFrames,damage:a.damage,landing:a.landingLag};let prior=null;const unique=new Set();
   for(let t=1;t<=a.totalFrames;t++){
    f.timer=t;const before=JSON.stringify(f,(k,v)=>v instanceof Set?[...v]:v),s=ChocoboAnimation.sample(f),again=ChocoboAnimation.sample(f),active=CombatData.activeWindow(a,t),bones=ChocoboAnimation.joints(s.parts);
    check('pure '+type+face+t,JSON.stringify(s)===JSON.stringify(again)&&before===JSON.stringify(f,(k,v)=>v instanceof Set?[...v]:v));
    check('finite '+type+face+t,Object.values(s.parts).flat().every(Number.isFinite));
    for(const [name,b]of Object.entries(bones))check('fixed leg lengths '+type+face+t+name,Math.abs(Math.hypot(b.knee[0]-b.hip[0],b.knee[1]-b.hip[1])-19)<.00001&&Math.abs(Math.hypot(b.ankle[0]-b.knee[0],b.ankle[1]-b.knee[1])-22)<.00001);
    if(t<a.startupFrames)check('startup phase '+type+face+t,s.phase==='startup'&&!active);
    if(active)check('active phase '+type+face+t,s.phase==='active');
    if(prior)check('continuous positions '+type+face+t,Math.max(...Object.keys(s.parts).map(k=>Math.hypot(s.parts[k][0]-prior[k][0],s.parts[k][1]-prior[k][1])))<32);
    unique.add(JSON.stringify(s.parts));prior=s.parts;
   }
   check('intermediate poses '+type+face,unique.size>Math.min(4,a.totalFrames-1),unique.size);
   if(f.grounded)check('ends at stance '+type+face,JSON.stringify(ChocoboAnimation.sample(f).parts)===JSON.stringify(ChocoboAnimation.base));
  }
  for(const stateName of ['idle','walk','run','crouch','jump','double','fall','land','guard','dodge','hit','fly','down','getup','grab','throw']){
   const f=reset();f.state=stateName;f.stateDuration=24;for(let t=1;t<=32;t++){f.stateFrame=t;check('state finite '+stateName+t,Object.values(ChocoboAnimation.sample(f).parts).flat().every(Number.isFinite));}
   const before=JSON.stringify(ChocoboAnimation.sample(f));frame+=200;check('simulation clock freezes '+stateName,before===JSON.stringify(ChocoboAnimation.sample(f)));
  }
  for(const face of [-1,1]){const f=reset(face);PlayerStates.enter(f,'LedgeHang');f.ledge={x:500,y:560,face};Object.assign(f,ledgeHangPosition(f,f.ledge));const s=ChocoboAnimation.sample(f),b=ChocoboAnimation.joints(s.parts);check('ledge claw anchored '+face,Math.abs(f.x+b.near.ankle[0]*face-500)<.001&&Math.abs(f.y+b.near.ankle[1]-562)<.001);}
  const original=ctx.drawImage,draws=[];ctx.drawImage=function(img,x,y,w,h){const m=ctx.getTransform();draws.push({index:characterArt.chocobo.tints[0].indexOf(img),w,h,x:m.e,y:m.f,scale:Math.abs(m.a*m.d-m.b*m.c)});original.call(this,img,x,y,w,h);};
  try{const f=reset();for(const type of ['idle','run',...Object.keys(ChocoboMoves)]){f.attack=null;f.state=type==='run'?'run':'idle';if(type!=='idle'&&type!=='run')attack(f,type);const total=f.attack?.totalFrames||24;for(let t=1;t<=total;t++){f.timer=t;f.stateFrame=t;draws.length=0;ctx.setTransform(1,0,0,1,0,0);drawSprite(f);const body=draws.find(d=>d.index===47);check('constant torso scale '+type+t,!!body&&Math.abs(body.w-59)<.001&&Math.abs(body.w/body.h-276/262)<.001&&Math.abs(body.scale-MorphieRules.scale(f)**2)<.001,body);}}
   for(const color of [0,1,2,3,4])for(const face of [-1,1]){f.attack=null;f.state='idle';f.color=color;f.face=face;drawSprite(f);check('costume draw '+color+face,true);}
  }finally{ctx.drawImage=original;}
  const f=reset();attack(f,'dragon');f.timer=27;const s=ChocoboAnimation.sample(f);check('meteor caster stays at body',Math.abs(s.parts.head[0])<50);attack(f,'gale');f.timer=18;check('mage hat active',ChocoboAnimation.sample(f).head===3);
  return{checks,failures,timings};
 });
 fs.writeFileSync('.tools/chocobo-animation-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({checks:result.checks,failed:result.failures.length,failures:result.failures.slice(0,20),errors}));assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
