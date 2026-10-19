// Extract generated full-body drawings without deforming or regenerating poses.
const fs=require('fs'),path=require('path'),sharp=require('sharp'),extract=require('../../karateka/tests/extract-grid.cjs'),loose=require('../../fiora/tests/remove-loose-parts.cjs');
const id=process.argv[2]||'riesz',cap=id==='riesz'?'Riesz':'Edea',root=path.resolve('characters',id);
(async()=>{
 const {data,info}=await sharp(root+'/assets/'+id+'-poses.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const original=extract(data,info.width,info.height,8,6).map(loose);
 const order=[0,1,2,3,4,5,6,7,10,8,12,11,42,43,14,9,16,17,18,19,22,23,25,32,26,27,28,1,29,30,31,2,33,4,34,5,35,35,36,37,38,39,40,41,13,15,44,45];
 const poses=order.map(n=>original[n]);
 const base=poses[0];await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).resize({height:800}).extend({top:28,bottom:28,left:80,right:80,background:'#00000000'}).png().toFile(root+'/assets/'+id+'-selection.png');
 const portrait=await sharp(root+'/assets/'+id+'-selection.png').raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const extraSource=await sharp(root+'/assets/'+id+'-extra.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),extra=extract(extraSource.data,extraSource.info.width,extraSource.info.height,4,2).map(loose),extraScale=base.h/extra[3].h;
 for(const g of extra){const converted=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(Math.round(g.w*extraScale),Math.round(g.h*extraScale)).raw().toBuffer({resolveWithObject:true});poses.push({pixels:converted.data,w:converted.info.width,h:converted.info.height});}
 const sheet=await sharp(root+'/assets/'+id+'-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),fx=[];
 const rowEdges=(id==='riesz'?[0,242,535,795,1024]:[0,246,535,795,1024]).map(y=>Math.round(y*sheet.info.height/1024));
 for(let row=0;row<4;row++)for(let col=0;col<3;col++){
  const x=Math.round(col*sheet.info.width/3),xEnd=Math.round((col+1)*sheet.info.width/3),y=rowEdges[row],yEnd=rowEdges[row+1],w=xEnd-x,h=yEnd-y;
  const raw=Buffer.alloc(w*h*4);for(let yy=0;yy<h;yy++)sheet.data.copy(raw,yy*w*4,((y+yy)*sheet.info.width+x)*4,((y+yy)*sheet.info.width+xEnd)*4);
  const cut=await sharp(raw,{raw:{width:w,height:h,channels:4}}).trim({threshold:18}).raw().toBuffer({resolveWithObject:true});fx.push({pixels:cut.data,w:cut.info.width,h:cut.info.height});
 }
 let x=2,y=2,rh=0;const frames=[],effects=[],packed=[];
 for(const[g,n]of [...poses,...fx].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:effects).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/'+id+'-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0,area=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150){n++;area++;}if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom,area};});
 const meta={frames,effects,anchors:poses.map(g=>g.anchor??.5),grip:[0,.96],pads:measures.map(g=>g.pad)};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/'+id+'-art.js',`'use strict';\nconst ${cap}ArtRects=${JSON.stringify(meta)};\nasync function load${cap}Art(){if(ArtLoader.enabled&&await ArtLoader.load('${id}'))return;const sheet=new Image();sheet.src='characters/${id}/assets/${id}-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=${cap}ArtRects.frames.map(crop),effects=${cap}ArtRects.effects.map(crop);characterArt.${id}={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'${id}',ci)))};}\nfunction ${id}NativeScale(n){return 94/(${cap}ArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 const list=poses.filter((_,n)=>n!==48),tiles=await Promise.all(list.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(220,230,{fit:'inside'}).png().toBuffer(),left:n%8*240+10,top:Math.floor(n/8)*250+10})));
 await sharp({create:{width:1920,height:1750,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/all-poses.png');
 console.log(JSON.stringify({id,frames:frames.length,effects:effects.length,base:measures[0]}));
})().catch(e=>{console.error(e);process.exitCode=1;});
