'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[],errors=[],tag=process.env.DEMO_TAG||'local';const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});fs.mkdirSync('previews/quality',{recursive:true});
 try{for(const[width,height]of[[1280,720],[1440,900]]){
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);await page.goto(process.env.TEST_URL||'http://localhost:4179');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:60000});await page.click('#enter-training');
  for(const[character,key]of[['dragoon','jab'],['dragoon','fair'],['noctis','dragon']]){
   if(await page.evaluate(()=>state!=='menu')){await page.evaluate(()=>pause());await page.locator('#pause .back').click();}
   await page.locator('#fighter-grid [data-id="'+character+'"]').click();await page.click('#start');await page.waitForFunction(()=>state==='battle',null,{polling:100,timeout:60000});await page.click('#open-frames');
   const heading=await page.locator('#frame-guide').evaluate(e=>{const r=e.getBoundingClientRect();return{fits:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&e.scrollWidth<=e.clientWidth+1,hasAction:!document.getElementById('frame-demo-heading').hidden};});check('PC table fits and offers demo '+width+'/'+character+'/'+key,heading.fits&&heading.hasAction,heading);
   if(character==='dragoon'&&key==='jab'){
    check('counter and chain entries explain prerequisites '+width,await page.evaluate(()=>['gale','counter','jab2','forwardThrow'].every(key=>{const row=document.querySelector('#frame-rows [data-move="'+key+'"]');return row?.querySelector('button').disabled&&row.querySelector('small').textContent.length>0;})));
    await page.screenshot({path:`previews/quality/demo-${tag}-${width}-table.png`});
   }
   await page.locator('#frame-rows [data-move="'+key+'"] button').click();
   check('demo closes table and starts actual move '+width+'/'+character+'/'+key,await page.evaluate(key=>!document.getElementById('frame-guide').open&&TrainingDemo.status?.running&&fighters[0].attack?.type===key&&fighters[0].timer===1&&state==='battle',key));
   const result=await page.evaluate(key=>{
    const dataBefore=JSON.stringify(movesFor(fighters[0])),storage=JSON.stringify({...localStorage}),config=JSON.stringify(BattlePlayers.seats),seen=[],trace=[];let objects=false;
    for(let n=0;n<240;n++){
     const f=fighters[0],a=f.attack;if(a){const phase=CombatData.sample(a,f.timer).phase;seen.push(phase);trace.push([f.timer,pose(f),phase,f.mode,attackBoxes(f).length,f.x,f.y,f.vx,f.vy]);}objects||=NoctisRules.objects.length>0;
     update();effects();
    }
    const first={x:fighters[0].x,y:fighters[0].y,damage:fighters[0].damage,attack:!!fighters[0].attack};const completed=!TrainingDemo.status?.running;
    document.getElementById('demo-replay').click();const replayInitial=fighters[0].timer===1&&fighters[0].attack?.type===key&&fighters.every(f=>f.damage===0),again=[];
    for(let n=0;n<240;n++){const f=fighters[0],a=f.attack;if(a)again.push([f.timer,pose(f),CombatData.sample(a,f.timer).phase,f.mode,attackBoxes(f).length,f.x,f.y,f.vx,f.vy]);update();effects();}
    return{phases:[...new Set(seen)],poses:[...new Set(trace.map(t=>t[1]))],active:trace.some(t=>t[4]>0),objects,completed,replayInitial,replayStable:JSON.stringify(trace)===JSON.stringify(again),unchanged:dataBefore===JSON.stringify(movesFor(fighters[0]))&&storage===JSON.stringify({...localStorage})&&config===JSON.stringify(BattlePlayers.seats),movesUnchanged:dataBefore===JSON.stringify(movesFor(fighters[0])),storageUnchanged:storage===JSON.stringify({...localStorage}),seatsUnchanged:config===JSON.stringify(BattlePlayers.seats),first,finite:fighters.every(f=>Number.isFinite(f.x+f.y+f.vx+f.vy))};
   },key);
   check('existing startup and recovery advance '+width+'/'+character+'/'+key,result.phases.includes('anticipation')&&result.phases.includes('recovery'),result);
   check('whole-body poses change '+width+'/'+character+'/'+key,result.poses.length>=2,result.poses);
   check('real hitboxes or projectile appear '+width+'/'+character+'/'+key,key==='dragon'?result.objects:result.active,result);
   check('one-shot ends and replay is stable '+width+'/'+character+'/'+key,result.completed&&result.replayInitial&&result.replayStable,result);
   check('move data and saved setup stay unchanged '+width+'/'+character+'/'+key,result.unchanged&&result.finite,result);
   await page.click('#demo-replay');await page.evaluate(key=>{for(let n=0;n<(key==='dragon'?14:7);n++){update();effects();}render();},key);await page.screenshot({path:`previews/quality/demo-${tag}-${width}-${character}-${key}.png`});
   check('demo panel leaves the actor visible '+width+'/'+character+'/'+key,await page.evaluate(()=>{const b=fighterScreenBody(fighters[0]),c=canvas.getBoundingClientRect(),p=document.getElementById('training-tools').getBoundingClientRect(),left=c.left+b.left*c.width/W,right=c.left+b.right*c.width/W,top=c.top+b.top*c.height/H,bottom=c.top+b.bottom*c.height/H;return right<=p.left||left>=p.right||bottom<=p.top||top>=p.bottom;}));
   await page.click('#demo-cancel');check('cancel clears attack and injected input '+width+'/'+character+'/'+key,await page.evaluate(()=>!TrainingDemo.status?.running&&TrainingDemo.input()===null&&fighters.every(f=>!f.attack&&f.damage===0)&&!Controls.read().special));
   await page.keyboard.down('ArrowRight');const oldX=await page.evaluate(()=>fighters[0].x);await page.evaluate(()=>{for(let n=0;n<10;n++)update();});await page.keyboard.up('ArrowRight');check('ordinary controls work after cancel '+width+'/'+character+'/'+key,await page.evaluate(oldX=>fighters[0].x>oldX,oldX));
  }
  const extra=await page.evaluate(()=>{
   const checks=[],check=(name,pass)=>checks.push({name,pass});resetTraining();
   fighters=[makeFighter(0,0,'dragoon'),makeFighter(1,1,'noctis'),makeFighter(2,2,'isaac'),makeFighter(3,3,'tails')];fighters.forEach((f,n)=>{f.control=['keyboard','cpu','pad2','keyboard2'][n];f.team=n%2;});const roster=fighters.map(f=>[f.characterId,f.control,f.team]);resetTraining();
   check('four-player reset preserves participants and devices',JSON.stringify(roster)===JSON.stringify(fighters.map(f=>[f.characterId,f.control,f.team]))&&new Set(fighters.map(f=>f.x)).size===4);
   check('four-player demo starts',TrainingDemo.start('jab'));check('all four demo inputs neutral',fighters.length===4&&fighters.every(f=>!BattlePlayers.localInput(f).jab&&!BattlePlayers.localInput(f).special&&BattlePlayers.localInput(f).x===0));
   resetTraining();check('reset clears session and replay',TrainingDemo.status===null&&TrainingDemo.input()===null&&fighters.length===4);
   fighters[0]=makeFighter(0,0,'onionknight');fighters[0].onionJob=1;const changed=fighters[0];check('changed equipment is explained without resetting it',TrainingDemo.reason('jab').includes('形態・装備')&&!TrainingDemo.start('jab')&&fighters[0]===changed);resetTraining();
   const originalAttack=attack;try{attack=()=>false;check('failed real move gate restores manual control',!TrainingDemo.start('jab')&&TrainingDemo.input()===null&&!fighters[0].attack&&document.getElementById('training-demo-status').textContent.includes('使用条件'));}finally{attack=originalAttack;}
   TrainingDemo.start('jab');fighters[0].attack.totalFrames=1e9;for(let n=0;n<1201;n++)TrainingDemo.tick();check('bounded playback cannot hold input forever',!TrainingDemo.status.running&&TrainingDemo.input()===null&&document.getElementById('training-demo-status').textContent.includes('自動操作を終了'));fighters[0]=makeFighter(0,0,'dragoon');resetTraining();
   state='pause';check('frame step can advance active demo',TrainingDemo.start('jab'));state='pause';const before=fighters[0].timer;frameAdvance();check('frame step preserves demo and advances move',fighters[0].timer>before&&TrainingDemo.status.running&&state==='pause');
   resetTraining();state='battle';training=false;const beforeF=fighters[0];check('normal battle cannot start or inject',!TrainingDemo.start('jab')&&TrainingDemo.input()===null&&fighters[0]===beforeF);renderFrameTable(movesFor(fighters[0]));check('normal table has no demo column or actions',document.getElementById('frame-demo-heading').hidden&&!document.querySelector('#frame-rows button'));
   training=true;state='menu';check('menu cannot start stale training demo',!TrainingDemo.start('jab'));state='battle';TrainingDemo.start('jab');document.querySelector('#pause .back').click();check('leaving clears demo',TrainingDemo.status===null&&TrainingDemo.input()===null);
   return checks;
  });for(const c of extra)check(c.name+' '+width,c.pass);
  await page.close();
 }
 const report={checks:checks.length,failed:checks.filter(c=>!c.pass),errors,resolutions:[[1280,720],[1440,900]]};fs.writeFileSync(`previews/quality/training-demo-${tag}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));assert.deepEqual(report.failed,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
