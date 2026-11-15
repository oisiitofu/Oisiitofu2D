'use strict';
const assert=require('node:assert/strict');
const {mkdirSync,writeFileSync}=require('node:fs');
const {chromium}=require('playwright');

(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4181');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  const review=process.argv.includes('--review');
  const cases=await page.evaluate(async review=>{
   const players=Array.from({length:2},()=>({character:'onionknight',color:0,control:'primary'}));
   await start({participants:{players,format:'free',stocks:3,timeLimit:240},squads:{size:1},stage:'0'});
   countdown=0;state='pause';
   const profile=LimitBreak.profile('onionknight');
   await profile.visual().load();
   const shotFrames=Array.from({length:profile.duration},(_,time)=>profile.shotTime(time));
   const originalImage=ctx.drawImage,originalSprite=drawSprite;
   const results=[];
   try{
    for(const face of [1,-1]){
     for(const job of [0,1,2]){
      const costumes=[],portraits=[];
      drawSprite=function(fighter,...args){
       if(fighter.id===fighters[0].id)costumes.push(fighter.onionJob);
       return originalSprite(fighter,...args);
      };
      ctx.drawImage=function(source,...args){
       const path=source.src?.split('?')[0];
       if(path?.includes('/onionknight/assets/limit-cutin')){
        const [,,width,height]=args;
        portraits.push({file:path.split('/').at(-1),error:Math.abs(width/height-source.naturalWidth/source.naturalHeight)});
       }
       return originalImage.call(this,source,...args);
      };
      let screenshot;
      for(const shot of [14,26,27,69,70,105,106,225,226]){
       ctx.resetTransform();
       const scale=Math.min(canvas.width/W,canvas.height/H);
       ctx.setTransform(scale,0,0,scale,(canvas.width-W*scale)/2,(canvas.height-H*scale)/2);
       LimitBreak.draw({profile,attacker:{...fighters[0],onionJob:job},target:fighters[1],face,time:shotFrames.indexOf(shot)});
       if(shot===14&&review)screenshot=canvas.toDataURL('image/png').split(',')[1];
      }
      results.push({face,job,costumes,portraits,screenshot});
     }
    }
   }finally{ctx.drawImage=originalImage;drawSprite=originalSprite;}
   return results;
  },review);
  for(const {face,job,costumes,portraits,screenshot} of cases){
   assert.deepEqual(costumes,[job,job,0,0,1,1,2,2,job],`costumes for job ${job}, facing ${face}`);
   const file=['limit-cutin.webp','limit-cutin-ninja.webp','limit-cutin-sage.webp'][job];
   assert.ok(portraits.length&&portraits.every(p=>p.file===file&&p.error<1e-9),`cut-in for job ${job}, facing ${face}`);
   if(review){
    const directory='previews/onionknight/limit-break';
    mkdirSync(directory,{recursive:true});
    writeFileSync(`${directory}/job-${job}-${face}.png`,Buffer.from(screenshot,'base64'));
   }
  }
  assert.deepEqual(errors,[]);
  console.log('All three starting jobs preserve their cut-in proportions and return in both directions.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
