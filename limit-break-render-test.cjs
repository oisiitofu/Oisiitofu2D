'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');

(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4182');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  const ids=await page.evaluate(async()=>{
   const players=Array.from({length:2},()=>({character:'vivi',color:0,control:'primary'}));
   await start({artPrepared:true,participants:{players,format:'free',stocks:3,timeLimit:240},squads:{size:1},stage:'0'});
   countdown=0;simulationSpeed=0;state='pause';
   return Roster.selectable.filter(fighter=>LimitBreak.hasCinematic(fighter.id)).map(fighter=>fighter.id);
  });
  assert.ok(ids.length);
  const review=process.argv.includes('--review');
  for(const id of ids){
   const result=await page.evaluate(async({id,review})=>{
    const profile=LimitBreak.profile(id),visual=profile.visual();
    await visual.load();
    const original=ctx.drawImage;
    let portraitDraws=0,maxAspectError=0,opaqueStrikeDraws=0,frameWeight=0,bestWeight=0,bestTime=0;
    ctx.drawImage=function(source,...args){
     if(source.src?.endsWith('/limit-cutin.webp')){
      const [,,width,height]=args;
      portraitDraws++;
      maxAspectError=Math.max(maxAspectError,Math.abs(width/height-source.naturalWidth/source.naturalHeight));
     }
     const strike=source.src?.endsWith('/limit-effects.webp')||source.src?.endsWith('/limit-impact.webp')||source instanceof HTMLCanvasElement;
     if(strike&&ctx.globalCompositeOperation==='source-over'&&ctx.globalAlpha>=.999){
      opaqueStrikeDraws++;
      frameWeight+=args.at(-2)*args.at(-1);
     }
     return original.call(this,source,...args);
    };
    function draw(time){
     const scale=Math.min(canvas.width/W,canvas.height/H);
     ctx.setTransform(scale,0,0,scale,(canvas.width-W*scale)/2,(canvas.height-H*scale)/2);
     visual.draw({attacker:{...fighters[0],characterId:id},target:fighters[1],face:1,time});
    }
    try{
     for(let time=profile.contactHold+4;time<profile.duration;time+=4){
      frameWeight=0;draw(time);
      if(frameWeight>bestWeight){bestWeight=frameWeight;bestTime=time;}
     }
    }finally{ctx.drawImage=original;}
    const screenshots=[];
    if(review){
     for(const time of [profile.contactHold+14,bestTime]){
      draw(time);screenshots.push(canvas.toDataURL('image/png').split(',')[1]);
     }
    }
    return {portraitDraws,maxAspectError,opaqueStrikeDraws,screenshots};
   },{id,review});
   assert.ok(result.portraitDraws>0,id+' displays a cut-in');
   assert.ok(result.maxAspectError<1e-9,id+' preserves original portrait proportions');
   assert.ok(result.opaqueStrikeDraws>0,id+' draws a strike at full opacity');
   if(review){
    const directory='previews/limit-break-render';fs.mkdirSync(directory,{recursive:true});
    result.screenshots.forEach((data,index)=>fs.writeFileSync(directory+'/'+id+'-'+index+'.png',Buffer.from(data,'base64')));
   }
  }
  assert.deepEqual(errors,[]);
  console.log(`${ids.length} cinematic cut-ins and strikes verified`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
