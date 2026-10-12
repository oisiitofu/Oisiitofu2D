const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await page.evaluate(()=>{
  state='pause';setupStage('0');let count=0;const failures=[],check=(name,ok,data)=>{count++;if(!ok)failures.push({name,data});};
  function reset(face=1){fighters=[makeFighter(0,0,'sukapon'),makeFighter(1,0,'chiikawa')];SukaponRules.reset();const f=fighters[0];Object.assign(f,{x:700,y:560,grounded:true,face,inv:0,respawn:0,hitlag:0,hitstun:0,ledgeCooldown:100});Object.assign(fighters[1],{x:1900,y:560,inv:0,respawn:0});return f;}
  const types=['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair','grab','pummel','ledge','getupAttack','forwardThrow','backThrow','upThrow','downThrow','dragon','dash','rise','gale','airDrop'];
  check('12 parts baked',characterArt.sukapon.frames.length===61);
  const timings={};
  for(const face of[-1,1])for(const type of types){const f=reset(face);attack(f,type);const a=f.attack;timings[type]={startup:a.startupFrames,active:a.activeFrames.map(w=>[w.start,w.end]),total:a.totalFrames};
   let previous=null,unique=new Set();
   for(let t=1;t<=a.totalFrames;t++){
    f.timer=t;const before=JSON.stringify([f.timer,f.stateFrame,a.activeFrames,a.totalFrames]),s=SukaponAnimation.sample(f),again=SukaponAnimation.sample(f),active=CombatData.activeWindow(a,t);
    check('pure sample '+type+face+t,JSON.stringify(s)===JSON.stringify(again)&&before===JSON.stringify([f.timer,f.stateFrame,a.activeFrames,a.totalFrames]));
    check('finite parts '+type+face+t,Object.values(s.parts).every(v=>v.length===3&&v.every(Number.isFinite)));
    if(t<a.startupFrames)check('startup has no hit '+type+face+t,s.phase==='startup'&&!active);
    if(active){check('active phase '+type+face+t,s.phase==='active');const n=active.pose??a.pose,p=sukaponStrike({...f,x:0,y:0,face:1},n);if(p){const k=[11,14,16].includes(n)?n===14?'backFoot':'frontFoot':'frontHand',v=s.parts[k];check('striking part follows hitbox '+type+face+t,Math.hypot(v[0]-p[1].x,v[1]-p[1].y)<.001,{v,p:p[1]});}}
    const serialized=JSON.stringify(s.parts);unique.add(serialized);if(previous&&t<a.startupFrames)check('continuous startup '+type+face+t,Math.max(...Object.keys(s.parts).map(k=>Math.hypot(s.parts[k][0]-previous[k][0],s.parts[k][1]-previous[k][1])))<45);previous=s.parts;
   }
   check('real intermediate poses '+type+face,unique.size>Math.min(4,a.totalFrames-1),unique.size);
   f.timer=a.totalFrames;check('return reaches stance '+type+face,JSON.stringify(SukaponAnimation.sample(f).parts)===JSON.stringify(SukaponAnimation.base));
  }
  for(const stateName of ['idle','walk','run','crouch','jump','double','fall','land','guard','dodge','hit','fly','down','getup','grab','throw']){
   const f=reset();f.state=stateName;f.stateDuration=24;for(let t=1;t<=32;t++){f.stateFrame=t;check('state finite '+stateName+t,Object.values(SukaponAnimation.sample(f).parts).flat().every(Number.isFinite));}
   f.stateFrame=7;const s=JSON.stringify(SukaponAnimation.sample(f));frame+=100;check('hitstop freezes clock '+stateName,JSON.stringify(SukaponAnimation.sample(f))===s);
  }
  for(const face of[-1,1]){const f=reset(face);PlayerStates.enter(f,'LedgeHang');f.ledge={x:500,y:560,face};Object.assign(f,ledgeHangPosition(f,f.ledge));const s=SukaponAnimation.sample(f),p=s.parts.frontHand;check('ledge anchor '+face,Math.abs(f.x+p[0]*face-500)<.001&&Math.abs(f.y+p[1]-560)<.001);}
  const f=reset();attack(f,'rise');f.timer=7;SukaponRules.action(f,{...emptyInput(),x:1,y:-1});const poses=new Set();for(let t=7;t<30;t++){f.timer=t;const s=SukaponAnimation.sample(f);check('rolling active '+t,s.phase==='active');poses.add(JSON.stringify(s.parts));}check('rolling intermediate frames',poses.size===23);
  const art=characterArt.sukapon;check('color variants differ',art.tints[0][49].toDataURL()!==art.tints[2][49].toDataURL());
  return{count,failures,timings};
 });
 fs.writeFileSync('.tools/sukapon-animation-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({checks:result.count,failures:result.failures.slice(0,30),failedCount:result.failures.length,errors}));assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
