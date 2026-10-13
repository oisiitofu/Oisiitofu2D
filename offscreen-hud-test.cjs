'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000,polling:100});await p.click('#enter-training');await p.click('#start');
 const result=await p.evaluate(()=>{state='pause';training=false;matchTime=83;countdown=hitstop=shake=flash=0;setupStage('0');let checks=0;const failed=[],check=(name,ok,detail)=>{checks++;if(!ok)failed.push({name,detail});};
  function reset(id='dragoon'){fighters=[makeFighter(0,0,id),makeFighter(1,1,'shizuna')];for(const f of fighters)Object.assign(f,{x:700+f.id*60,y:560,inv:0,stocks:3,respawn:0,grounded:false,vx:0,vy:0});camera={x:720,y:395,z:1};return fighters[0];}
  function screen(f,x,feet){f.x=camera.x+(x-W/2)/camera.z;f.y=camera.y+(feet-H*.47)/camera.z;}
  for(const{id}of Roster.definitions)for(const zoom of[.614,1,1.5])for(const face of[-1,1]){
   const f=reset(id);camera.z=zoom;f.face=face;
   for(const feet of[690,740,H-1]){screen(f,250,feet);check(id+'/'+zoom+'/'+face+'/'+feet+' visible below HUD never wipes',loupePosition(f)===null);}
   screen(f,250,760);check(id+'/'+zoom+'/'+face+' overlaps damage panel',battleHudOpacity(185,691)<.2);check(id+'/'+zoom+'/'+face+' other panel remains readable',battleHudOpacity(975,691)===1);
   const height=(fighterScreenBody(f).bottom-fighterScreenBody(f).top);
   screen(f,250,H+height-1);check(id+'/'+zoom+'/'+face+' last visible body strip has no wipe',loupePosition(f)===null&&!battleWorldHidden(f));
   screen(f,250,H+height+1);check(id+'/'+zoom+'/'+face+' fully below viewport has wipe',!!loupePosition(f));check(id+'/'+zoom+'/'+face+' offscreen body no longer fades HUD',battleHudOpacity(185,691)===1);
   screen(f,700,560);check(id+'/'+zoom+'/'+face+' leaving panel restores opacity',battleHudOpacity(185,691)===1);
  }
  for(const side of['left','right','top','bottom']){const f=reset(),b=fighterScreenBody(f),h=b.bottom-b.top,r=(b.right-b.left)/2;
   screen(f,side==='left'?-r+1:side==='right'?W+r-1:720,side==='top'?1:side==='bottom'?H+h-1:560);check(side+' still partly visible has no wipe',loupePosition(f)===null);
   screen(f,side==='left'?-r-1:side==='right'?W+r+1:720,side==='top'?-1:side==='bottom'?H+h+1:560);check(side+' outside viewport has wipe',!!loupePosition(f));
  }
  const f=reset();screen(f,250,760);const physics=()=>JSON.stringify(fighters.map(f=>({x:f.x,y:f.y,vx:f.vx,vy:f.vy,stocks:f.stocks,damage:f.damage,mode:f.mode,hitstun:f.hitstun,ecb:f.character.ecb}))),before=physics();
  const oldText=text,alphas=[];text=function(value,x,y,...args){if(value==='0'&&y===773)alphas.push({x,alpha:ctx.globalAlpha});return oldText(value,x,y,...args);};try{hud();}finally{text=oldText;}
  check('actual damage number is transparent only in overlapping panel',alphas.length===2&&alphas[0].alpha<.2&&alphas[1].alpha===1,alphas);check('HUD rendering preserves context opacity',ctx.globalAlpha===1);check('HUD rendering preserves physics',physics()===before);
  f.respawn=50;check('respawn body does not fade HUD',battleHudOpacity(185,691)===1);f.respawn=0;f.stocks=0;check('eliminated body does not fade HUD',battleHudOpacity(185,691)===1);
  reset();fighters=Array.from({length:4},(_,i)=>Object.assign(makeFighter(i,i,'dragoon'),{stocks:3,inv:0,respawn:0}));for(const [i,f]of fighters.entries())screen(f,92+i*350+80,760);check('four player overlapping panels all fade',fighters.every((_,i)=>battleHudOpacity(92+i*350,691)<.2));
  for(const f of fighters)screen(f,720,560);check('all four panels restore',fighters.every((_,i)=>battleHudOpacity(92+i*350,691)===1));
  const m=reset('morphie');MorphieRules.resize(m,2);screen(m,250,760);const mb=fighterScreenBody(m);check('intentional size shift is counted once',Math.abs((mb.bottom-mb.top)-Math.max(m.character.ecb.height,BattleSize.heights.morphie*2))<.001);
  reset('yuffie');particles=[];waves=[];texts=[];ghosts=[];burstEffects=[];CombatVFX.reset();screen(fighters[0],250,H+40);render();const scale=Math.min(canvas.width/W,canvas.height/H),barY=Math.ceil((canvas.height-H*scale)/2+H*scale);
  if(barY<canvas.height){const a=ctx.getImageData(0,barY,canvas.width,canvas.height-barY).data;fighters[0].x=-5000;render();const b=ctx.getImageData(0,barY,canvas.width,canvas.height-barY).data;check('world body cannot spill into letterbox below viewport',a.every((v,i)=>v===b[i]));}
  return{checks,characters:Roster.definitions.length,failed};
 });
 for(const name of['overlap','outside','restored']){await p.evaluate(name=>{state='pause';training=false;countdown=hitstop=shake=flash=0;CombatVFX.reset();particles=[];waves=[];texts=[];ghosts=[];burstEffects=[];fighters=[makeFighter(0,0,'yuffie'),makeFighter(1,1,'shizuna')];camera={x:720,y:395,z:1};Object.assign(fighters[0],{x:name==='restored'?720:250,y:395+((name==='outside'?H+120:name==='overlap'?772:560)-H*.47),inv:0,grounded:false,stocks:3,damage:87});Object.assign(fighters[1],{x:760,y:560,inv:0,stocks:3});document.querySelector('#training-tools').classList.add('hidden');render();},name);await p.locator('#game').screenshot({path:'.tools/offscreen-hud-'+name+'.png'});}
 fs.writeFileSync('.tools/offscreen-hud-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,failed:result.failed.slice(0,12),failureCount:result.failed.length,errors},null,2));assert.equal(result.failed.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
