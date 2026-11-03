'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try{
  const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{requestAnimationFrame=()=>0;navigator.getGamepads=()=>[];});
  await p.goto(process.env.GAME_URL||'http://localhost:4182');
  await p.waitForFunction(()=>window.AstralEdge?.assetsLoaded,null,{polling:100,timeout:90000});
  const output=await p.evaluate(async()=>{
   const checks=[],check=(name,value,detail)=>checks.push({name,pass:!!value,detail});
   for(const id of ['cubivore','diana','vivi'])await loadIsaacArt(id);
   state='pause';training=false;GameAudio.setMuted(true);
   const setup=(id,x=780,y=560)=>{
    setupStage('0');
    fighters=[makeFighter(0,0,id),makeFighter(1,0,'vivi')];
    fighters.forEach((f,n)=>{
     PlayerStates.enter(f,'Idle');
     Object.assign(f,{x:n?x:720,y:n?y:560,grounded:true,inv:0,intangible:0,respawn:0,hitlag:0,hitstun:0,stocks:99,ledgeCooldown:0,gravityOff:n===1,vx:0,vy:0});
    });
    NewcomerCore.registry[id].reset();ViviRules.reset();hitstop=0;
    return fighters;
   };
   const tick=(n,inputs=()=>({}),combat=true)=>{
    for(let j=0;j<n;j++){
     frame++;
     fighters.forEach((f,k)=>updateFighter(f,{...emptyInput(),...(k?{}:inputs(f,j))}));
     if(combat)resolveCombat();
     for(const id of ['cubivore','diana'])NewcomerCore.registry[id].tick();
    }
   };
   for(const [id,after] of [['cubivore','qbby'],['diana','leon']]){
    const list=Roster.selectable.map(d=>d.id);
    check(id+' placement',list.indexOf(id)===list.indexOf(after)+1,list.indexOf(id));
    for(const face of [-1,1])for(const type of ['jab','heavy','up','low','smash','bair','dair']){
     const [f,o]=setup(id,720+face*6);f.face=face;
     attack(f,type);f.timer=f.attack.activeStart;
     const box=attackBoxes(f)[0];if(!box){check(id+' '+type+' hitbox',false);continue;}
     o.x=f.x+face*(type==='bair'?-9:9);o.y=type==='up'?f.y-18:type==='dair'?f.y+15:f.y;
     resolveCombat();
     check(id+' '+type+' close '+face,o.damage>0,o.damage);
    }
    const [f]=setup(id,1800);const floor=platforms.find(p=>p.main);
    Object.assign(f,{x:floor.x-75,y:floor.y+92,grounded:false,face:1});
    attack(f,'rise');let last=f.y,grab=false;
    for(let j=0;j<70;j++){
     tick(1,v=>({x:1,y:-1,special:v.timer===24}),false);
     last=Math.min(last,f.y);if(f.grounded||f.ledge){grab=true;break;}
    }
    check(id+' offstage recovery',grab&&f.stocks===99,{last,x:f.x,y:f.y,mode:f.mode});
   }
   {
    const [f,o]=setup('cubivore',753);o.character.weight=70;
    for(let j=0;j<2;j++){
     Object.assign(o,{x:f.x+33,y:f.y,hitstun:0,hitlag:0,inv:0,grounded:true,vx:0,vy:0,pendingLaunch:null});PlayerStates.enter(o,'Idle');
     attack(f,'dragon');tick(34);
    }
    check('two bites create bird',cubivoreForm(f)==='bird',{meat:f.cubivoreMeat,damage:o.damage});
    check('bird has bounded hover',AirMobility.profile(f)?.frames===60);
    const old=f.cubivoreMeat.length;attack(f,'gale');tick(24,()=>({}),false);
    check('fold spends meat',f.cubivoreMeat.length===old-1&&f.attack?.powered,f.cubivoreMeat);
   }
   {
    const [f,o]=setup('cubivore',797);attack(f,'dash');let hit=false,hop=false;
    tick(39,v=>{hit||=!!v.attack?.pounceHit;hop||=!!v.attack?.hop;return{x:-1,special:!!v.attack?.pounceHit};});
    check('pounce confirms into a new hop',hit&&hop,{hit,hop,damage:o.damage});
   }
   {
    const [f,o]=setup('diana',890);attack(f,'dragon');
    tick(43,v=>({special:v.timer===20}));
    check('grid scan marks target',dianaMarked(f,o),f.dianaMarks);
    attack(f,'dash');let redirected=false;
    tick(49,v=>{redirected||=DianaRules.objects.some(q=>q.redirected);return{special:v.timer===16};});
    check('missile changes course',redirected);
    check('missile hits exposed target and consumes mark',o.damage>=14&&!dianaMarked(f,o),{damage:o.damage,mark:f.dianaMarks});
   }
   {
    const [f,o]=setup('diana',840);f.dianaMarks={[o.id]:frame+300};
    attack(f,'gale');tick(24,()=>({}),false);
    check('marked target hit at longer range by multi hack',o.damage>=13&&!dianaMarked(f,o),o.damage);
   }
   return checks;
  });
  console.log(JSON.stringify({checks:output.length,failed:output.filter(v=>!v.pass),errors},null,2));
  assert.deepEqual(errors,[]);assert.ok(output.every(v=>v.pass));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
