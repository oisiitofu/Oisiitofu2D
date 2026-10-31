'use strict';
// Whole-body generated paintings only. Each source sheet has ONE physical
// scale measured from its shared neutral crown/boots; crouches are not fitted.
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-art.cjs');
const root='characters/magus';
const raw=g=>({raw:{width:g.w,height:g.h,channels:4}});
const load=async path=>{const v=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{pixels:v.data,w:v.info.width,h:v.info.height};};
(async()=>{
 const neutralMeasurements=JSON.parse(fs.readFileSync(root+'/tests/sheet-neutral-measurements.json')),points=JSON.parse(fs.readFileSync(root+'/tests/native-points.json'));
 const poses=[],sourcePoses=[],scales={};
 for(const name of ['basic','attacks','specials','defense','extra','windup','recovery']){
  const list=extract(await sharp(root+'/assets/magus-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),4,4,name),scale=226/neutralMeasurements[name].body;scales[name]=scale;
  for(const[cell,g]of list.entries()){
   if(!cell&&name!=='basic')continue;
   const n=poses.length;let v;
   if(n===0)v=await load(root+'/assets/magus-neutral-locked.png');
   else if(n>=16&&n<=30)v=await load(root+'/assets/magus-normal-'+(n-16)+'-locked.png');
   else {const s=await sharp(g.pixels,raw(g)).resize({width:Math.round(g.w*scale)}).ensureAlpha().raw().toBuffer({resolveWithObject:true});v={pixels:s.data,w:s.info.width,h:s.info.height};}
   poses.push(v);sourcePoses.push({sheet:n===16?'jab-correction':name,cell:n===16?1:cell});
  }
 }
 scales['jab-correction']=226/neutralMeasurements['jab-correction'].body;
 if(poses.length!==106||points.pelvis.length!==106)throw Error('Expected106 body paintings');
 const portrait=await sharp(root+'/assets/magus-selection.png').resize({width:600}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const effects=extract(await sharp(root+'/assets/magus-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}));
 // Raw2 and3 both bulge down. Normalize ONLY2 vertically so it bulges up.
 {const g=effects[2],p=Buffer.alloc(g.pixels.length);for(let y=0;y<g.h;y++)g.pixels.copy(p,(g.h-1-y)*g.w*4,y*g.w*4,(y+1)*g.w*4);effects[2]={...g,pixels:p};}
 const frames=[],fx=[],packed=[];let x=2,y=2,row=0;
 for(const[n,g]of [...poses,...effects].entries()){
  if(x+g.w+2>2048){x=2;y+=row+4;row=0;}packed.push({...g,x,y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;row=Math.max(row,g.h);
 }
 const height=y+row+2,pixels=Buffer.alloc(2048*height*4);
 // Direct RGBA copy preserves every locked antialias pixel (no compositing).
 for(const g of packed)for(let yy=0;yy<g.h;yy++)g.pixels.copy(pixels,((g.y+yy)*2048+g.x)*4,yy*g.w*4,(yy+1)*g.w*4);
 await sharp(pixels,{raw:{width:2048,height,channels:4}}).png().toFile(root+'/assets/magus-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let count=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)count++;if(count>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{visible:bottom-top,pad:g.h-bottom};});
 measures[0].body=226;measures[0].crown=48;measures[0].boots=274;
 const meta={frames,effects:fx,anchors:points.anchors,grip:points.ledge.grip,pads:measures.map(m=>m.pad),scales,bodyHeight:226,portrait:106,sourcePoses};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures,null,2));
 fs.writeFileSync(root+'/magus-art.js',`'use strict';\nconst MagusArtRects=${JSON.stringify(meta)};\nasync function loadMagusArt(){if(ArtLoader.enabled&&await ArtLoader.load('magus'))return;const sheet=new Image();sheet.src='characters/magus/assets/magus-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;};const frames=MagusArtRects.frames.map(crop),effects=MagusArtRects.effects.map(crop);characterArt.magus={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'magus',ci)))};}\nfunction magusNativeScale(n){return 98/(MagusArtRects.bodyHeight*FIGHTER_SCALE);}\n`);
 fs.mkdirSync('previews/magus',{recursive:true});
 const tile=420,displayScale=196/226;
 async function contact(list,file,cols=4,indices){const rows=Math.ceil(list.length/cols),tiles=[];for(const[n,g]of list.entries()){const ix=indices?.[n]??n,w=Math.round(g.w*displayScale),h=Math.round(g.h*displayScale),ox=n%cols*tile,oy=Math.floor(n/cols)*tile,left=ox+Math.round(tile/2-points.anchors[ix]*w),top=oy+320-h+Math.round(measures[ix].pad*displayScale);if(w>tile-8||h>320)throw Error('Contact overflow '+file+' '+n);tiles.push({input:await sharp(g.pixels,raw(g)).resize(w,h).png().toBuffer(),left,top});const waist=points.pelvis[ix],cx=left-ox+waist[0]*w,cy=top-oy+waist[1]*h;tiles.push({input:Buffer.from(`<svg width="420" height="420"><text x="8" y="24" fill="white" font-size="18">${ix}</text><path d="M0 320H420M210 25V340" stroke="#526178"/><circle cx="${cx}" cy="${cy}" r="4" fill="#62f6e3"/></svg>`),left:ox,top:oy});}await sharp({create:{width:cols*tile,height:rows*tile,channels:4,background:'#24324a'}}).composite(tiles).png().toFile('previews/magus/'+file+'.png');}
 for(let start=0;start<106;start+=24)await contact(poses.slice(start,Math.min(start+24,106)),'constant-native-'+start,6,poses.slice(start,Math.min(start+24,106)).map((_,n)=>start+n));
 for(let start=0;start<15;start+=5){const list=[],ix=[];for(let j=start;j<Math.min(start+5,15);j++)for(const n of[0,76+j,16+j,91+j]){list.push(poses[n]);ix.push(n);}await contact(list,'transitions-'+start,4,ix);}
 for(const[n,g]of effects.entries())await sharp(g.pixels,raw(g)).png().toFile('previews/magus/effect-'+n+'.png');
 const sel=await sharp(root+'/assets/magus-selection.png').extract({left:305,top:20,width:920,height:920}).resize(120,120).png().toBuffer();await sharp({create:{width:360,height:200,channels:4,background:'#24324a'}}).composite([{input:sel,left:20,top:20},{input:await sharp(sel).resize(180,180).png().toBuffer(),left:160,top:0}]).png().toFile('previews/magus/selection-small.png');
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,portrait:106,bodyHeight:226,grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
