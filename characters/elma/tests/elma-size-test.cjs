'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4173');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  await page.click('#enter-training');await page.click('[data-id="elma"]');await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';setupStage('0');frame=0;
   let checks=0;const failures=[],check=(name,ok,detail)=>{checks++;if(!ok)failures.push({name,detail});};
   const near=(a,b)=>Math.abs(a-b)<.01,art=characterArt.elma,opaque=new WeakMap();
   const body=img=>{if(opaque.has(img))return opaque.get(img);const d=img.getContext('2d').getImageData(0,0,img.width,img.height).data;let top=img.height,bottom=0;for(let y=0;y<img.height;y++){let count=0;for(let x=0;x<img.width;x++)if(d[(y*img.width+x)*4+3]>150)count++;if(count>=Math.max(3,img.width*.012)){top=Math.min(top,y);bottom=y+1;}}const b={top,bottom,height:bottom-top};opaque.set(img,b);return b;};
   const original=ctx.drawImage;let draws=[];
   ctx.drawImage=function(img,...a){if(a.length!==4)return;const m=ctx.getTransform(),sx=Math.hypot(m.a,m.b)*a[2]/img.width,sy=Math.hypot(m.c,m.d)*a[3]/img.height;draws.push({pose:art.tints[current.color].indexOf(img),height:body(img).height*sy,sx,sy,alpha:ctx.globalAlpha,foot:m.d*(a[1]+a[3]*body(img).bottom/img.height)+m.f});};
   let current;
   const capture=(f,n=null)=>{current=f;draws=[];ctx.save();ctx.setTransform(1,0,0,1,0,0);drawSprite(f,1,n);ctx.restore();return draws.filter(d=>d.alpha>.0001);};
   const reset=(active=false,color=0,face=1)=>{const f=makeFighter(0,color,'elma');Object.assign(f,{x:500,y:560,face,grounded:true,inv:0,ledgeCooldown:100,ocgTime:active?360:0,ocgCooldown:0,input:emptyInput()});fighters=[f,makeFighter(1,0,'dragoon')];fighters[1].x=1200;applyElmaOCG(f);return f;};
   const tick=(f,n)=>{for(let j=0;j<n;j++){frame++;updateFighter(f,emptyInput());ElmaRules.tick();}};
   let humanHeight,ocgHeight;
   try{
    for(const color of [0,1,2,3,4])for(const face of [-1,1]){
     let f=reset(false,color,face);humanHeight=capture(f)[0].height;
     const normalPhysics={height:f.character.ecb.height,weight:f.character.weight};
     check('human remains 110px '+color+'/'+face,near(humanHeight,110));
     attack(f,'gale');tick(f,16);check('human before boarding '+color+'/'+face,capture(f).every(d=>d.pose<40));
     tick(f,1);const boarded=capture(f);ocgHeight=boarded[0].height;
     check('boarding retains large model '+color+'/'+face,f.ocgTime>0&&boarded.every(d=>d.pose===40)&&near(ocgHeight,135)&&ocgHeight>humanHeight*1.2,{humanHeight,ocgHeight});
     check('existing larger collider retained '+color+'/'+face,near(f.character.ecb.height,145*BattleSize.geometry(f))&&f.character.weight===118);
     tick(f,30);check('idle after summon same height '+color+'/'+face,near(capture(f)[0].height,ocgHeight));
     for(let n=40;n<=55;n++){const d=capture(f,n)[0];check('uniform OCG scale '+color+'/'+face+'/'+n,near(d.sx,d.sy)&&d.height>100&&d.height<210,d);if([40,41,42,43].includes(n))check('OCG feet stay grounded '+color+'/'+face+'/'+n,Math.abs(d.foot-f.y)<2,d);}
     for(const type of Object.keys(ElmaOCGMoves)){
      f=reset(true,color,face);f.grounded=!['air','fair','bair','uair','dair','airDrop'].includes(type);attack(f,type);
      const a=f.attack;check('OCG move available '+type,!!a);if(!a)continue;
      for(let t=1;t<=a.totalFrames;t++){
       f.timer=t;if(a.ocgGrenades&&t>=24){a.ejected=true;f.ocgTime=0;applyElmaOCG(f);}
       const ds=capture(f),ejected=a.ocgGrenades&&a.ejected;
       check('form stable through '+color+'/'+face+'/'+type+'/'+t,ds.length>0&&ds.every(d=>ejected?d.pose<40:d.pose>=40&&d.pose<=55),ds);
       check('no stretching '+color+'/'+face+'/'+type+'/'+t,ds.every(d=>near(d.sx,d.sy)&&Number.isFinite(d.height)&&d.height>0),ds);
      }
     }
     for(const aerial of [false,true]){
      f=reset(true,color,face);f.grounded=!aerial;if(aerial){f.x=100;f.y=100;}attack(f,aerial?'airDrop':'gale');tick(f,24);
      check('ejection restores human '+color+'/'+face+'/'+aerial,!f.ocgTime&&(!f.attack||f.attack.ejected)&&near(f.character.ecb.height,normalPhysics.height)&&f.character.weight===normalPhysics.weight);
      for(let t=24;f.attack&&t<=f.attack.totalFrames;t++){f.timer=t;check('no OCG return ghost '+color+'/'+face+'/'+aerial+'/'+t,capture(f).every(d=>d.pose<40));}
     }
     f=reset(true,color,face);f.ocgTime=1;ElmaRules.tick();check('expiry restores human size '+color+'/'+face,near(capture(f)[0].height,humanHeight));
     f=reset(true,color,face);f.respawn=60;ElmaRules.tick();f.respawn=0;check('KO restores human size '+color+'/'+face,near(capture(f)[0].height,humanHeight));
    }
   }finally{ctx.drawImage=original;}
   return{checks,failures,humanHeight,ocgHeight};
  });
  fs.writeFileSync('.tools/elma-size-results.json',JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({...result,failures:result.failures.slice(0,12),failedCount:result.failures.length,errors},null,2));
  // Native game rendering, with normal and boarded Elma side by side.
  await page.evaluate(()=>{state='pause';setupStage('0');fighters=[makeFighter(0,0,'elma'),makeFighter(1,0,'elma')];for(const f of fighters){f.x=f.id?850:580;f.y=560;f.inv=0;f.face=1;f.ocgTime=f.id?360:0;applyElmaOCG(f);}render();});
  fs.mkdirSync('characters/elma/previews',{recursive:true});await page.screenshot({path:'characters/elma/previews/elma-ocg-size.png'});
  assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
