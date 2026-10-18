'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.stack));
 await page.addInitScript(()=>{requestAnimationFrame=()=>0;navigator.getGamepads=()=>[];});
 await page.goto(process.env.GAME_URL||'http://localhost:4173');
 await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100,timeout:90000});
 await page.click('#enter-training');await page.click('#start');
 await page.waitForFunction(()=>state==='battle',null,{polling:100,timeout:90000});
 const result=await page.evaluate(async()=>{
  state='pause';training=false;countdown=hitstop=0;document.querySelector('#training-tools')?.classList.add('hidden');
  const checks=[],check=(name,pass)=>checks.push({name,pass:!!pass});
  // No atlas loading for the roster-wide selector audit; only state/pose routing.
  for(const {id}of Roster.definitions){const f=makeFighter(0,0,id);Object.assign(f,{grounded:false,attack:null,mode:'Helpless',state:'fall',helpless:true,inv:0});
   const before=JSON.stringify([f.mode,f.state,f.vx,f.vy,f.character.ecb,pose(f)]),n=helplessFallPose(f);
   check(id+' airborne reaction',helplessFall(f)&&Number.isInteger(n)&&n>=0&&n<characterArt[id].frames.length&&n===pose({...f,state:'fly',ledge:null}));
   check(id+' simulation unchanged',JSON.stringify([f.mode,f.state,f.vx,f.vy,f.character.ecb,pose(f)])===before);
   for(const mode of['Fall','Jump','AirSpecial','Hitstun','Tumble','LedgeCatch','LedgeHang','SpecialLanding','Idle']){f.mode=mode;check(id+' excludes '+mode,!helplessFall(f));}
  }
  // Exercise the actual end-of-up-special state, input lock, and exit paths.
  for(const id of['fiora','malenia','ray','tifa','sukapon','alucard','chocobo']){
   const f=makeFighter(0,0,id);fighters=[f];Object.assign(f,{x:720,y:100,grounded:false,inv:0});attack(f,'rise');
   if(!f.attack?.helpless)continue;
   check(id+' active recovery excluded',!helplessFall(f));f.timer=f.attack.totalFrames;f.vx=f.vy=0;
   frame++;updateFighter(f,emptyInput());check(id+' recovery enters helpless',helplessFall(f));
   frame++;updateFighter(f,{...emptyInput(),jab:true,heavy:true,jump:true,special:true});
   check(id+' action lock retained',helplessFall(f)&&!f.attack);
   PlayerController.land(f,emptyInput(),3);check(id+' landing restores normal art',!helplessFall(f));
   Object.assign(f,{grounded:false,mode:'Helpless',state:'fall',helpless:true});PlayerStates.enter(f,'LedgeCatch');check(id+' ledge restores art',!helplessFall(f));
   PlayerStates.enter(f,'Hitstun');check(id+' damage restores art',!helplessFall(f));
  }
  const free=makeFighter(0,0,'roxas');Object.assign(free,{mode:'Fall',state:'fall',grounded:false,recovered:true});check('used recovery alone is not helpless',!helplessFall(free));
  canvas.width=1440;canvas.height=1100;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#24364a';ctx.fillRect(0,0,1440,1100);
  const samples=[['fiora',{}],['tifa',{}],['sukapon',{}],['chocobo',{}],['ray',{}],['toro',{toroForm:1}],['hinako',{hinakoMaskTime:120}],['malenia',{maleniaRotTime:120}],['elma',{}],['kurabe',{}],['vivi',{}],['roxas',{}],['toro',{toroForm:2}],['kurabe',{kurabeMechTime:120}],['alucard',{}],['malenia',{}]];
  let k=0;
  for(const[id,form]of samples){await ArtLoader.load(id);for(const face of[-1,1]){
   const f=makeFighter(0,0,id),col=k%4,row=Math.floor(k/4),x=col*360,y=row*270;Object.assign(f,{...form,x:x+(face<0?100:260),y:y+225,grounded:false,mode:'Helpless',state:'fall',helpless:true,attack:null,inv:0,face});
   const expected=spriteFor(f,helplessFallPose(f)),before=JSON.stringify([f.mode,f.state,f.vx,f.vy,f.character.ecb,pose(f)]),draw=ctx.drawImage,calls=[];
   ctx.drawImage=function(...args){calls.push(args[0]);return draw.apply(this,args);};try{drawSprite(f);}finally{ctx.drawImage=draw;}
   check(id+' draws reaction '+face,!!expected&&calls.length===1&&calls[0]===expected);
   check(id+' render leaves state alone '+face,JSON.stringify([f.mode,f.state,f.vx,f.vy,f.character.ecb,pose(f)])===before);
  }ctx.fillStyle='white';ctx.font='14px Arial';ctx.textAlign='center';ctx.fillText(id+' / helpless',k%4*360+180,Math.floor(k/4)*270+255);k++;}
  return{checks,roster: Roster.definitions.length,renderedScenes:samples.length*2};
 });
 await page.locator('#game').screenshot({path:'previews/helpless-fall-both-directions.png'});
 assert.deepEqual(result.checks.filter(c=>!c.pass),[]);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({checks:result.checks.length,roster:result.roster,renderedScenes:result.renderedScenes,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

