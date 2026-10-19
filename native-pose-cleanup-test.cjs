'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
 const result=await p.evaluate(async()=>{const failures=[],rows=[];let checks=0,bodyPixels=0,removedPixels=0;const check=(name,ok)=>{checks++;if(!ok)failures.push(name);};
 for(const [id,changed]of[['hanajd',[45]],['melia',[25,26,27]]]){
  await ArtLoader.load(id);const rects=id==='hanajd'?HanajdArtRects:MeliaArtRects,sheet=new Image();sheet.src='characters/'+id+'/assets/'+id+'-native.png';await sheet.decode();
  for(let n=0;n<rects.frames.length;n++){
   const [x,y,w,h]=rects.frames[n],original=document.createElement('canvas');original.width=w;original.height=h;const g=original.getContext('2d',{willReadFrequently:true});g.drawImage(sheet,x,y,w,h,0,0,w,h);const before=g.getImageData(0,0,w,h).data,img=characterArt[id].frames[n],c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d',{willReadFrequently:true});q.drawImage(img,0,0);const after=q.getImageData(0,0,w,h).data;
   check(id+'/'+n+' original dimensions',img.width===w&&img.height===h);
   if(!changed.includes(n)){let same=true;for(let k=0;k<before.length;k+=4)if(before[k+3]!==after[k+3]||before[k+3]===255&&[0,1,2].some(j=>before[k+j]!==after[k+j])){same=false;break;}check(id+'/'+n+' unchanged original pose',same);continue;}
   const seen=new Uint8Array(w*h);let largest=[];for(let k=0;k<w*h;k++){if(seen[k]||before[k*4+3]<=12)continue;const stack=[k],part=[];seen[k]=1;while(stack.length){const v=stack.pop(),xx=v%w,yy=Math.floor(v/w);part.push(v);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const a=xx+dx,z=yy+dy,i=z*w+a;if(a<0||a>=w||z<0||z>=h||seen[i]||before[i*4+3]<=12)continue;seen[i]=1;stack.push(i);}}if(part.length>largest.length)largest=part;}
   const body=new Set(largest);let preserved=true,stray=0,remaining=0;for(let k=0;k<w*h;k++){const a=k*4;if(body.has(k)){bodyPixels++;if(before[a+3]!==after[a+3]||before[a+3]===255&&[0,1,2].some(j=>before[a+j]!==after[a+j]))preserved=false;}else if(before[a+3]>12){stray++;if(after[a+3])remaining++;}if(before[a+3]&&!after[a+3])removedPixels++;}
   check(id+'/'+n+' body alpha and opaque colors preserved',preserved);check(id+'/'+n+' foreign pose removed',stray>100&&remaining===0);rows.push({id,pose:n,body:largest.length,stray,remaining});
  }
 }
 return{checks,bodyPixels,removedPixels,rows,failures};});fs.writeFileSync('previews/native-pose-cleanup-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,errors},null,2));assert.deepEqual(result.failures,[]);assert.deepEqual(errors,[]);
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
