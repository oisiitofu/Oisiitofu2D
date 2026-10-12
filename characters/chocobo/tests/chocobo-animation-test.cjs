// Guard the approved design, not the proportions of a newly generated rig.
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const old=JSON.parse(fs.readFileSync('characters/chocobo/tests/legacy-art-checks.json'));
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const manifest=await page.evaluate(async()=>await(await fetch('assets/ready/manifest.json')).json()),now=manifest.characters.chocobo;
 assert.deepEqual(now.checks,old.checks,'all original poses, effects and costume pixels');
 for(const k of ['portraits','selectionPortraits','selectionThumbnails','selectionCrop'])assert.deepEqual(now[k],old[k],k+' unchanged');
 const result=await page.evaluate(()=>{
  state='pause';setupStage('0');const failures=[],timings={};let checks=0;
  const check=(name,ok,detail)=>{checks++;if(!ok)failures.push({name,detail});};
  const f=makeFighter(0,0,'chocobo');fighters=[f,makeFighter(1,0,'chiikawa')];
  Object.assign(f,{x:180,y:220,grounded:true,face:1,inv:0,respawn:0,hitstun:0,hitlag:0});
  const art=characterArt.chocobo,original=ctx.drawImage;
  check('only approved 43 poses loaded',art.frames.length===43);
  check('original standing dimensions',art.frames[0].width===213&&art.frames[0].height===240);
  const render=override=>{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,360,260);drawSprite(f,1,override,1.5);return ctx.getImageData(0,0,360,260).data;};
  for(const color of [0,1,2,3,4])for(const face of [-1,1]){
   Object.assign(f,{color,face,state:'idle',mode:'Idle',attack:null,timer:0,stateFrame:1});
   // Warm readback first: Chromium may migrate its first GPU draw to a
   // software canvas, rounding a few premultiplied channels by one unit.
   render(0);const approved=render(0);
   for(const t of [1,2,30,60,100]){f.stateFrame=t;const actual=render(null);check('standing matches original pixels '+color+'/'+face+'/'+t,actual.every((v,i)=>v===approved[i]));}
  }
  // Every motion stays on the original artwork, including entry/active/return.
  let draws=0,foreign=0;ctx.drawImage=function(img,...args){draws++;if(!art.tints[f.color].includes(img))foreign++;return original.call(this,img,...args);};
  try{
   for(const face of [-1,1])for(const type of Object.keys(ChocoboMoves)){
    Object.assign(f,{face,color:0,grounded:!['air','fair','bair','uair','dair'].includes(type),attack:null,state:'idle',mode:'Idle',timer:0});
    attack(f,type);const a=f.attack;check('attack exists '+type+face,!!a);if(!a)continue;
    timings[type]={startup:a.startupFrames,active:a.activeFrames.map(w=>[w.start,w.end]),total:a.totalFrames,damage:a.damage,landing:a.landingLag};
    for(let t=1;t<=a.totalFrames;t++){f.timer=t;const before=JSON.stringify(f,(k,v)=>v instanceof Set?[...v]:v);draws=foreign=0;drawSprite(f);check('approved art '+type+face+t,draws>0&&foreign===0);check('render does not mutate fighter '+type+face+t,before===JSON.stringify(f,(k,v)=>v instanceof Set?[...v]:v));}
   }
   for(const face of [-1,1])for(const stateName of ['idle','walk','run','crouch','jump','double','fall','land','guard','dodge','hit','fly','down','getup','grab','throw']){
    Object.assign(f,{face,attack:null,state:stateName,mode:'Idle',stateDuration:24,timer:0,grounded:!['jump','double','fall','fly'].includes(stateName)});
    for(const t of [1,4,12,24]){f.stateFrame=t;draws=foreign=0;drawSprite(f);check('approved state art '+stateName+face+t,draws>0&&foreign===0);}
   }
   for(const face of [-1,1]){Object.assign(f,{face,attack:null,grounded:false});PlayerStates.enter(f,'LedgeHang');f.ledge={x:500,y:560,face};Object.assign(f,ledgeHangPosition(f,f.ledge));draws=foreign=0;drawSprite(f);check('original ledge art '+face,draws>0&&foreign===0);}
  }finally{ctx.drawImage=original;}
  return{checks,failures,timings};
 });
 fs.writeFileSync('.tools/chocobo-animation-results.json',JSON.stringify({...result,errors},null,2));
 console.log(JSON.stringify({checks:result.checks,failed:result.failures.length,failures:result.failures.slice(0,20),errors}));
 assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
