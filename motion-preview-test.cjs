'use strict';

const assert=require('node:assert/strict');
const {chromium}=require('playwright');

async function main(){
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const fixture of [
   {id:'chocobo',ticks:[2,3,4],reference:14},
   {id:'onionknight',ticks:[6,7,8],reference:0},
   {id:'terra',ticks:[6,7,8],reference:0},
   {id:'tifa',ticks:[6,7,8],reference:49},
   {id:'zack',ticks:[6,7,8],reference:69}
  ])await verify(browser,fixture);
 }finally{await browser.close();}
}

async function verify(browser,{id,ticks,reference}){
  const page=await browser.newPage();
  try{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:4251');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  await page.locator('#home-screen .open-settings').click();
  const toggle=page.locator('#motion-preview-enabled');
  assert.equal(await toggle.isChecked(),false);
  await page.click('#close-settings');
  await page.click('#enter-training');
  await page.locator(`.fighter-card[data-id="${id}"]`).click();
  await page.click('#start');
  await page.waitForFunction(()=>state==='battle'&&training&&!countdown);
  await page.evaluate(async id=>{
   await ArtLoader.prepare(Array.from({length:5},(_,color)=>({character:id,color})));
   state='pause';
   const f=makeFighter(0,0,id);
   Object.assign(f,{x:160,y:160,grounded:true,face:1,inv:0});
   fighters[0]=f;
   window.previewFixture=f;
   const ids=new WeakMap();
   const originalDraw=ctx.drawImage;
   let nextId=1;
   window.capturePreviewDraw=(tick,color,face,override=null)=>{
    Object.assign(f,{timer:tick,color,face});
    const drawFrame=frame;
    const calls=[];
    frame=0;
    ctx.reset();
    ctx.drawImage=function(img,...args){
     if(!ids.has(img))ids.set(img,nextId++);
     calls.push([ids.get(img),...args,ctx.globalAlpha,...ctx.getTransform().toFloat64Array()]);
     originalDraw.call(this,img,...args);
    };
    try{drawSprite(f,1,override,1.25);}
    finally{ctx.drawImage=originalDraw;frame=drawFrame;}
    return JSON.stringify(calls);
   };
   attack(f,'smash');
   document.querySelector('#settings').showModal();
  },id);
  await toggle.check();
  await page.click('#close-settings');
  await page.waitForFunction(times=>times.every(timer=>MotionPreview.draw(Object.assign(previewFixture,{timer}),1,null,1)),ticks);
  const runs=await page.evaluate(({ticks,reference})=>{
   const f=previewFixture;
   const setPreview=(checked,inTraining)=>{
    training=false;
    const checkbox=document.querySelector('#motion-preview-enabled');
    checkbox.checked=checked;
    checkbox.dispatchEvent(new Event('change'));
    training=inTraining;
   };
   const sample=(checked,inTraining,face,color)=>{
    setPreview(checked,inTraining);
    return {
     frames:Array.from({length:f.attack.totalFrames},(_,i)=>capturePreviewDraw(i+1,color,face)),
     explicit:capturePreviewDraw(ticks[0],color,face,reference)
    };
   };
   const serialize=value=>JSON.stringify(value,(_,part)=>part instanceof Set?[...part]:part);
   const before=serialize(f);
   drawSprite(f);
   const pure=serialize(f)===before;
   const variants=[];
   for(const face of [-1,1])for(let color=0;color<5;color++){
    const baseline=sample(false,true,face,color);
    const preview=sample(true,true,face,color);
    const change=preview.frames.flatMap((hash,index)=>hash===baseline.frames[index]?[]:[index+1]);
    const unique=new Set(ticks.map(tick=>preview.frames[tick-1])).size;
    const localOff=sample(false,false,face,color);
    const localOn=sample(true,false,face,color);
    const reverted=sample(false,true,face,color);
    variants.push({change,unique,explicit:preview.explicit===baseline.explicit,local:JSON.stringify(localOff)===JSON.stringify(localOn),reverted:JSON.stringify(baseline)===JSON.stringify(reverted)});
   }
   setPreview(true,true);
   document.querySelector('#settings').showModal();
   return {variants,pure};
  },{ticks,reference});
  for(const variant of runs.variants)assert.deepEqual(variant,{change:ticks,unique:ticks.length,explicit:true,local:true,reverted:true});
  assert(runs.pure);
  await toggle.uncheck();
  await page.click('#close-settings');
  assert.equal(await toggle.isChecked(),false);
  assert.deepEqual(errors,[]);
  console.log(id+': 5 colors, both directions, original endpoints, render-only and opt-in.');
  }finally{await page.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
