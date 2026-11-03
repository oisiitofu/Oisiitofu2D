'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({channel:'msedge'});
 try{
  const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto(process.env.GAME_URL||'http://localhost:4182');
  await p.waitForFunction(()=>window.AstralEdge?.assetsLoaded,null,{polling:100,timeout:60000});
  await p.click('#enter-roster');
  await p.click('[data-library-scope="limit"]');
  const filtered=await p.locator('.fighter-card:visible').evaluateAll(cards=>cards.map(card=>card.dataset.id));
  assert.deepEqual(filtered,await p.evaluate(()=>Roster.selectable.filter(d=>LimitBreak.hasCinematic(d.id)).map(d=>d.id)));
  assert.ok(['dragoon','roxas'].every(id=>filtered.includes(id)));
  const checked=await p.evaluate(async()=>{
   await ArtLoader.prepare([{character:'vivi'},{character:'cubivore'},{character:'diana'},{character:'nargacuga'},{character:'nightraven'}]);
   const check=(ok,message)=>{if(!ok)throw Error(message);};
   state='pause';training=false;setupStage('0');
   const floor=platforms.find(p=>p.main);
   function reset(id,distance=30,extra=false,air=false,on=true){
    fighters=[makeFighter(0,0,id),makeFighter(1,0,'vivi')];
    if(extra)fighters.push(makeFighter(2,0,'vivi'));
    fighters.forEach((f,n)=>{
     Object.assign(f,{x:690+(n===1?distance:n===2?distance+8:0),y:floor.y-(air?100:0),face:n?-1:1,
      damage:n?70:0,vx:0,vy:0,grounded:!air,inv:0,intangible:0,hitlag:0,hitstun:0,respawn:0,stocks:3});
     PlayerStates.enter(f,air?'Fall':'Idle');
    });
    LimitBreak.begin(on);
    return fighters;
   }
   const chord={...emptyInput(),shareStock:true,jab:true,special:true,attackHeld:true,specialHeld:true};
   function attempt(f){LimitBreak.charge(f,100);frame++;updateFighter(f,chord);check(f.attack?.standardLimit,f.characterId+' activated standard move');}
   function resolve(f){f.timer=f.attack.activeStart;resolveCombat();}
   check(LimitBreak.artPrepared([{character:'vivi',team:['diana','cubivore']}],true),'standard roster requests no cinematic assets');
   let n=0;
   for(const {id} of Roster.definitions){
    if(LimitBreak.hasCinematic(id))continue;
    for(const air of [false,true]){
     const [a,b]=reset(id,-19,false,air);a.face=-1;
     attempt(a);check(CombatSystem.protection(a).intangible,id+' initial invulnerability');resolve(a);
     check(!LimitBreak.active&&LimitBreak.meter(a).used&&b.damage===98&&Math.cos(b.pendingLaunch?.angle)<-.5,id+' instant leftward launch '+air+' '+JSON.stringify({face:a.face,used:LimitBreak.meter(a),damage:b.damage,launch:b.pendingLaunch,x:a.x,bx:b.x,y:a.y,by:b.y,boxes:attackBoxes(a)}));
     LimitBreak.charge(a,100);check(!LimitBreak.ready(a),id+' cannot use twice');
     n++;
    }
   }
   {
    const [a,b,c]=reset('cubivore',40,true);
    attempt(a);resolve(a);
    check(b.damage===98&&c.damage===70&&!c.pendingLaunch,'first connected opponent only');
   }
   {
    const [a,b]=reset('diana',440);
    attempt(a);resolve(a);
    check(!LimitBreak.meter(a).used&&LimitBreak.meter(a).value===0&&b.damage===70,'whiff spends meter and preserves entitlement');
    a.attack=null;LimitBreak.charge(a,100);check(LimitBreak.ready(a),'can recharge after whiff');
    b.x=a.x+40;PlayerStates.enter(b,'ShieldHold');frame++;updateFighter(a,chord);resolve(a);
    check(!LimitBreak.meter(a).used&&b.damage===70&&b.shield<b.character.shieldHP,'shield blocks the standard opener');
   }
   {
    const [a]=reset('nargacuga',40,false,false,false);
    LimitBreak.charge(a,100);frame++;updateFighter(a,chord);
    check(!LimitBreak.ready(a)&&a.attack?.type!=='limitBreak','setting off disables the shared move');
   }
   {
    const [a]=reset('nightraven');training=true;LimitBreak.begin(true);
    const button=document.getElementById('training-limit-max');
    check(!button.classList.contains('hidden'),'training gauge button visible');
    button.click();check(LimitBreak.ready(a),'training gauge fills a non-cinematic fighter');
   }
   return n;
  });
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({standardGroundAndAirChecks:checked,filtered,errors}));
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
