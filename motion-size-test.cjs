'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.TEST_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  const manifest=JSON.parse(fs.readFileSync('assets/ready/manifest.json'));
  const result=await page.evaluate(manifest=>{
   state='pause';setupStage('0');frame=0;let checks=0,poses=0,attackFrames=0;const failures=[],examples=[];
   const check=(name,ok,detail)=>{checks++;if(!ok)failures.push({name,detail});};
   const original=ctx.drawImage;let draws=[];
   // Inspect the real canvas transform, including per-attack transforms and
   // return blends. Pixel area is measured separately from the generated scale.
   ctx.drawImage=function(img,...a){if(a.length===2||a.length===4){const m=ctx.getTransform(),w=a.length===2?img.width:a[2],h=a.length===2?img.height:a[3];draws.push({img,areaScale:Math.abs(m.a*m.d-m.b*m.c)*w*h/img.width/img.height,widthScale:Math.hypot(m.a,m.b)*w/img.width,heightScale:Math.hypot(m.c,m.d)*h/img.height,alpha:ctx.globalAlpha});}};
   const capture=(f,n=null)=>{draws=[];ctx.save();ctx.setTransform(1,0,0,1,0,0);drawSprite(f,1,n);ctx.restore();return draws;};
   try{
    for(const {id}of Roster.definitions){
     const meta=MotionSize.characters[id],f=makeFighter(0,0,id);Object.assign(f,{x:720,y:560,grounded:true,inv:0,input:emptyInput()});fighters=[f,makeFighter(1,0,'dragoon')];
     check(id+' calibration matches baked atlas',meta.atlas===manifest.characters[id].image);
     const hist=n=>{const img=characterArt[id].frames[n],data=img.getContext('2d').getImageData(0,0,img.width,img.height).data,h=Array(64).fill(0);for(let y=0;y<img.height;y++)for(let x=0;x<img.width;x++){if(meta.exclude?.[n]?.some(([l,t,w,d])=>x>=l&&x<l+w&&y>=t&&y<t+d))continue;const k=(y*img.width+x)*4;h[(data[k]>>6)*16+(data[k+1]>>6)*4+(data[k+2]>>6)]+=data[k+3]/255;}return h;};
     // Transformations with a different body shape must be compared against
     // their own idle, rather than shrunk to the human silhouette's pixel mass.
     const references=new Map();
     const referenceFor=n=>{
      const reference=meta.forms?.find(g=>n>=g.first&&n<=g.last)?.reference??0;
      if(!references.has(reference)){
       const h=hist(reference),area=h.reduce((a,b)=>a+b,0),weights=h.map(a=>Math.min(1,a/area/.005));
       const mass=n=>hist(n).reduce((s,a,k)=>s+a*weights[k],0);
       references.set(reference,{mass,referenceMass:mass(reference)*capture(f,reference)[0].areaScale});
      }
      return references.get(reference);
     };
     for(const n of meta.poses){
      const {mass,referenceMass}=referenceFor(n);
      const bodyMass=mass(n);poses++;
      for(const face of [-1,1]){f.face=face;const d=capture(f,n)[0],ratio=Math.sqrt(bodyMass*d.areaScale/referenceMass);
       check(id+'/'+n+'/'+face+' body size is stable',ratio>=.76&&ratio<=1.12,{ratio});
       check(id+'/'+n+'/'+face+' keeps source aspect ratio',Math.abs(d.widthScale-d.heightScale)<1e-6,{width:d.widthScale,height:d.heightScale});
       if(face===1&&['sumino','luke'].includes(id)&&[6,28,32].includes(n))examples.push({id,pose:n,before:+(ratio/meta.scale[n]).toFixed(3),after:+ratio.toFixed(3)});
      }
     }
     // Every frame of normal / aerial attacks, including their return to idle.
     for(const type of ['jab','jab2','jab3','dashAttack','heavy','up','low','smash','upsmash','downsmash','air','fair','bair','uair','dair']){
      f.attack=null;f.grounded=!['air','fair','bair','uair','dair'].includes(type);attack(f,type);if(!f.attack)continue;
      const a=f.attack;
      for(let timer=1;timer<=a.totalFrames;timer++){f.timer=timer;attackFrames++;const n=BattleSize.imagePose(f,pose(f));
       check(id+'/'+type+'/'+timer+' uses calibrated body pose',meta.poses.includes(n),{n});
       for(const d of capture(f))check(id+'/'+type+'/'+timer+' no attack stretch or invalid size',Math.abs(d.widthScale-d.heightScale)<1e-6&&d.widthScale>0&&Number.isFinite(d.areaScale),{width:d.widthScale,height:d.heightScale});
      }
     }
    }
   }finally{ctx.drawImage=original;}
   return{characters:Roster.definitions.length,poses,attackFrames,checks,failures,examples};
  },manifest);
  fs.writeFileSync('.tools/motion-size-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,failures:result.failures.slice(0,15),failedCount:result.failures.length,errors},null,2));assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
