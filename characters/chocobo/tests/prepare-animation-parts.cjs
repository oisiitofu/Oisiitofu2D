'use strict';
// Extract alpha-bounded rectangles, preserving the source pixels and alpha.
const fs=require('node:fs'),sharp=require('sharp');
(async()=>{
 const image='characters/chocobo/assets/chocobo-animation-parts-v1.png',{data,info}=await sharp(image).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const xs=[0,318,617,944,info.width],ys=[0,333,634,919,info.height],rects=[];
 for(let n=0;n<16;n++){
  const l=xs[n%4],r=xs[n%4+1],t=ys[n>>2],b=ys[(n>>2)+1],w=r-l,h=b-t,seen=new Uint8Array(w*h);let best=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=y*w+x;if(seen[i]||data[((y+t)*info.width+x+l)*4+3]<48)continue;
   const q=[i];seen[i]=1;for(let k=0;k<q.length;k++){const v=q[k],vx=v%w,vy=Math.floor(v/w);for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=vx+dx,yy=vy+dy,j=yy*w+xx;if(xx<0||yy<0||xx>=w||yy>=h||seen[j]||data[((yy+t)*info.width+xx+l)*4+3]<48)continue;seen[j]=1;q.push(j);}}if(q.length>best.length)best=q;
  }
  if(best.length<1000)throw Error('Missing atlas part '+n);
  let x0=w,y0=h,x1=0,y1=0;for(const v of best){const x=v%w,y=Math.floor(v/w);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  x0=Math.max(0,x0-3);y0=Math.max(0,y0-3);x1=Math.min(w-1,x1+3);y1=Math.min(h-1,y1+3);rects.push([l+x0,t+y0,x1-x0+1,y1-y0+1]);
 }
 const p='characters/chocobo/assets/chocobo-animation-parts-v1.json';fs.writeFileSync(p,JSON.stringify({image,rects},null,2));
 const promptFile='characters/chocobo/assets/chocobo-animation-prompts-v1.json',prompts=JSON.parse(fs.readFileSync(promptFile));prompts.refinement={prompt:'Remove the attached wing from the torso in row 2, column 1; preserve all other parts and transparent background.',source:'built-in image_gen edit'};fs.writeFileSync(promptFile,JSON.stringify(prompts,null,2)+'\n');
 const runtime='characters/chocobo/chocobo-animation.js';if(fs.existsSync(runtime)){const code=fs.readFileSync(runtime,'utf8').replace(/const data=\{[^;]+?,img=new Image\(\);/, 'const data='+JSON.stringify({image,rects})+',img=new Image();');fs.writeFileSync(runtime,code);}
 console.log(JSON.stringify({image,size:[info.width,info.height],rects}));
})().catch(e=>{console.error(e);process.exitCode=1;});
