// Visual regressions: real strike contacts, active-time FX, both facings,
// identical raster ghosts, cyclic locomotion and no combat mutation.
const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
 const r=await p.evaluate(()=>{state='pause';render=()=>{};let checks=0;const failed=[];
  const check=(n,v)=>{checks++;if(!v)failed.push(n);},f=makeFighter(0,0,'tifa');Object.assign(f,{inv:0,x:500,y:500,grounded:true});
  for(const type of Object.keys(TifaMoves))for(const face of[-1,1]){
   f.attack=null;f.faf=0;f.state='idle';f.mode='Idle';f.timer=0;f.face=face;attack(f,type);const a=f.attack;if(!a)continue;
   for(let t=1;t<=a.totalFrames;t++){f.timer=t;const before=JSON.stringify({attack:a,x:f.x,y:f.y,vx:f.vx,vy:f.vy,boxes:attackBoxes(f)}),v=TifaVFX.segments(f),w=CombatData.activeWindow(a,t);
    check('no premature/late FX '+type+face+t,!!w||v.length===0);
    if(v.length){const s=TifaRasterAnimation.sample(f),c=TifaRasterAnimation.contacts[s.pose],im=characterArt.tifa.frames[s.pose],pl=TifaRasterAnimation.placement(f,s.pose),unit=FIGHTER_SCALE*MorphieRules.scale(f)*BattleSize.art('tifa')*pl.unit;
     check('FX displayed raster '+type+face+t,v[0].pose===s.pose);
     check('FX touches displayed contact '+type+face+t,Math.abs(v[0].to.x-(f.x+(c[2]-pl.root)*im.width*unit*face))<1e-7&&Math.abs(v[0].to.y-(f.y+(c[3]*im.height-pl.floor)*unit))<1e-7);
     const mirror={...f,face:-face},m=TifaVFX.segments(mirror)[0];check('reflected FX '+type+face+t,Math.abs(v[0].to.x+m.to.x-2*f.x)<1e-7&&v[0].to.y===m.to.y);
    }
    TifaVFX.draw(f);check('FX leaves combat unchanged '+type+face+t,before===JSON.stringify({attack:a,x:f.x,y:f.y,vx:f.vx,vy:f.vy,boxes:attackBoxes(f)}));
   }
  }
  for(const [s,start,duration]of[['walk',90,32],['run',98,16]]){
   f.attack=null;f.mode=s;f.state=s;const seq=[];for(let t=1;t<=duration*3;t++){f.stateFrame=t;const n=TifaRasterAnimation.sample(f).pose;seq.push(n);check('coherent cycle '+s+t,n===start+Math.floor((t-1)/(duration/8))%8);}
   check('8 distinct loop frames '+s,new Set(seq).size===8);check('loop seam '+s,seq[duration]===seq[0]);
   for(let n=start;n<start+8;n++){const pl=TifaRasterAnimation.placement(f,n),im=characterArt.tifa.frames[n];check('valid full frame '+n,im.width>50&&im.height>50&&pl.floor>0&&pl.unit>0);}
   // Measure visible white tank-top center independently from placement data.
   // The silhouette crop gets narrower at passing poses; the torso must not jump.
   const centers=[],widths=[];for(let i=0;i<8;i++){
    f.stateFrame=1+i*duration/8;const im=characterArt.tifa.frames[start+i],d=im.getContext('2d').getImageData(0,0,im.width,im.height).data,w=im.width,h=im.height,mask=new Uint8Array(w*h),parts=[];
    for(let y=0;y<h*.55;y++)for(let x=0;x<w;x++){const k=(y*w+x)*4,lo=Math.min(d[k],d[k+1],d[k+2]),hi=Math.max(d[k],d[k+1],d[k+2]);if(d[k+3]>180&&lo>130&&hi/lo<1.15)mask[y*w+x]=1;}
    for(let k=0;k<mask.length;k++){if(!mask[k])continue;const q=[k];mask[k]=0;let count=0,cx=0;while(q.length){const j=q.pop(),x=j%w,y=Math.floor(j/w);count++;cx+=x;for(const v of[x?j-1:-1,x<w-1?j+1:-1,y?j-w:-1,y<h-1?j+w:-1])if(v>=0&&mask[v]){mask[v]=0;q.push(v);}}parts.push({count,cx:cx/count});}
    const shirt=parts.sort((a,b)=>b.count-a.count)[0],saved=ctx.drawImage;let center;
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage=function(img,x,y,ww,hh){const m=ctx.getTransform();center=m.a*(x+shirt.cx*ww/img.width)+m.e;};
    try{drawSprite(f);}finally{ctx.drawImage=saved;ctx.restore();}centers.push(center);widths.push(w);
   }
   check('visible torso has no side jump '+s,Math.max(...centers)-Math.min(...centers)<.1);
   check('legs have passing and extended poses '+s,Math.max(...widths)/Math.min(...widths)>1.20);
  }
  f.state='idle';f.mode='Idle';f.faf=0;attack(f,'jab');f.timer=5;ghosts=[];frame=2;advanceAttack(f,{x:0,y:0});const g=ghosts.at(-1);check('ghost records displayed original',g?.rasterPose===42);
  check('unchanged neutral',TifaRasterAnimation.sample({...f,attack:null,state:'idle'}).pose===40);
  return{checks,failed};
 });assert.deepEqual(r.failed,[]);assert.deepEqual(errors,[]);console.log(JSON.stringify({...r,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
