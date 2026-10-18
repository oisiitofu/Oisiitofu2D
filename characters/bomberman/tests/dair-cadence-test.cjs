'use strict';
const fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage();await page.addInitScript(()=>{navigator.getGamepads=()=>[];});await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await page.evaluate(baseline=>{
  state='pause';countdown=hitstop=0;let checks=0;const failures=[],samples=[];const check=(name,pass,detail)=>{checks++;if(!pass)failures.push({name,detail});};
  function reset(face=1){setupStage('0');frame=100;fighters=[makeFighter(0,0,'bomberman'),makeFighter(1,0,'tifa')];BombermanRules.reset();for(const f of fighters)Object.assign(f,{x:f.id?1800:700,y:200,vx:0,vy:0,face,grounded:false,gravityOff:true,inv:0,intangible:0,respawn:0,stocks:99,control:'keyboard'});return fighters[0];}
  for(const face of[-1,1]){const f=reset(face),seen=new Set(),shots=[];for(let n=0;n<600;n++){frame++;f.y=200;f.vy=0;f.grounded=false;if(!f.attack)attack(f,'dair');updateFighter(f,emptyInput());BombermanRules.tick();for(const q of BombermanRules.objects)if(q.sourceType==='dair'&&!seen.has(q.id)){seen.add(q.id);shots.push(frame);}}samples.push({face,shots,count:shots.length});if(!baseline){check('at most ten drops in 600 frames '+face,shots.length===10,shots);check('60-frame release spacing '+face,shots.every((n,k)=>!k||n-shots[k-1]>=60),shots);}}
  if(!baseline)for(const face of[-1,1]){
   const f=reset(face);check('first drop available '+face,attack(f,'dair'));const start=frame;let finish=0;for(let n=0;n<30;n++){frame++;f.y=200;f.grounded=false;updateFighter(f,emptyInput());BombermanRules.tick();if(!f.attack&&!finish)finish=frame-start;}
   check('return stays short '+face,finish>0&&finish<=25,finish);check('no immediate drop '+face,!attack(f,'dair'));
   for(const type of['fair','uair','dragon','rise']){f.attack=null;f.recovered=false;PlayerStates.enter(f,'Fall');check('other action available '+type+' '+face,attack(f,type));}
   f.attack=null;f.grounded=true;PlayerStates.enter(f,'Idle');BombermanRules.tick();f.grounded=false;PlayerStates.enter(f,'Fall');check('landing cannot bypass cadence '+face,!attack(f,'dair'));
   frame=start+59;check('not ready one frame early '+face,!attack(f,'dair'));frame++;check('ready at sixty '+face,attack(f,'dair'));
  }
  return{checks,failures,samples};
 },!!process.env.BOMBER_DAIR_BASELINE);
 fs.writeFileSync('.tools/bomber-dair-'+(process.env.BOMBER_DAIR_BASELINE?'before':'after')+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(result.failures.length)process.exitCode=1;
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
