'use strict';
// Offline calibration: the bulky OCG uses its own color/mass reference.
// Human poses and every other character remain byte-for-byte unchanged.
const fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();await page.goto(process.env.GAME_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  const result=await page.evaluate(()=>{
   const frames=characterArt.elma.frames,reference=40,height=135;
   const hist=n=>{const img=frames[n],d=img.getContext('2d').getImageData(0,0,img.width,img.height).data,h=Array(64).fill(0);for(let k=0;k<d.length;k+=4)h[(d[k]>>6)*16+(d[k+1]>>6)*4+(d[k+2]>>6)]+=d[k+3]/255;return h;};
   const h=hist(reference),area=h.reduce((s,v)=>s+v,0),weights=h.map(v=>Math.min(1,v/area/.005));
   const mass=n=>hist(n).reduce((s,v,k)=>s+v*weights[k],0),referenceMass=mass(reference);
   const img=frames[reference],d=img.getContext('2d').getImageData(0,0,img.width,img.height).data;
   let top=img.height,bottom=0;
   for(let y=0;y<img.height;y++){let count=0;for(let x=0;x<img.width;x++)if(d[(y*img.width+x)*4+3]>150)count++;if(count>=Math.max(3,img.width*.012)){top=Math.min(top,y);bottom=y+1;}}
   const worldScale=height/(bottom-top),factor=n=>worldScale*Math.sqrt(referenceMass/mass(n))/(BattleSize.baseNative('elma',n)*FIGHTER_SCALE*BattleSize.art('elma'));
   return{form:{first:40,last:55,reference,height},scales:Array.from({length:16},(_,i)=>+factor(40+i).toFixed(5))};
  });
  const file='motion-size.js',source=fs.readFileSync(file,'utf8'),context={};
  vm.runInNewContext(source+';this.metadata=MotionSize',context);
  const meta=context.metadata.characters.elma;meta.forms=[result.form];meta.scale.splice(40,16,...result.scales);
  fs.writeFileSync(file,source.slice(0,source.indexOf('const MotionSize='))+'const MotionSize='+JSON.stringify(context.metadata,null,1)+';\n');
  console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
