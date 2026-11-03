'use strict';
// Package the complete painted figures at a uniform scale per source sheet.
const fs=require('node:fs'),sharp=require('sharp'),extract=require('../../elza/tests/extract-poses.cjs');
const id=process.argv[2]||'cubivore',cap=id[0].toUpperCase()+id.slice(1),root='characters/'+id;
const configs={
 cubivore:{height:66,sheets:[['poses',6,4,1],['motion',4,3,.83],['attacks',4,4,.9]],grip:[.23,.71]},
 diana:{height:78,sheets:[['poses',6,4,1],['attacks',4,4,.79]],grip:[.12,.9]}
};
const {height,sheets,grip}=configs[id],path=name=>root+'/assets/'+id+'-'+name+'.png';
async function raw(name){return sharp(path(name)).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
async function tile(name,cols,rows){
 const {data,info}=await raw(name);
 const w=info.width/cols,h=info.height/rows;
 return Promise.all(Array.from({length:cols*rows},async(_,n)=>{
  const piece=await sharp(data,{raw:info}).extract({left:n%cols*w+4,top:Math.floor(n/cols)*h+4,width:w-8,height:h-8}).raw().toBuffer({resolveWithObject:true});
  for(let p=0;p<piece.data.length;p+=4){
   const white=Math.min(...piece.data.subarray(p,p+3));
   piece.data[p+3]=Math.min(piece.data[p+3],Math.max(0,255*(241-white)/32));
  }
  const image=await sharp(piece.data,{raw:piece.info}).trim({background:'#00000000',threshold:10}).resize({width:240,height:240,fit:'inside'}).raw().toBuffer({resolveWithObject:true});
  return {pixels:image.data,w:image.info.width,h:image.info.height};
 }));
}
(async()=>{
 const poses=[];
 for(const [name,cols,rows,scale] of sheets){
  const input=await raw(name);
  if(id==='diana'&&name==='poses'){
   for(let p=3;p<input.data.length;p+=4){
    const alpha=input.data[p];
    input.data[p]=Math.max(0,Math.min(255,(alpha-220)*11));
   }
  }
  const source=extract(input,cols,rows,name);
  for(const g of source){
   if(scale===1){poses.push(g);continue;}
   const v=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*scale)}).raw().toBuffer({resolveWithObject:true});
   poses.push({pixels:v.data,w:v.info.width,h:v.info.height});
  }
 }
 const portrait=poses.length,p=await sharp(path('selection')).resize({width:600}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 poses.push({pixels:p.data,w:p.info.width,h:p.info.height});
 const effects=id==='cubivore'?await tile('effects',3,2):[];
 const frames=[],fx=[],packed=[];
 let x=2,y=2,row=0;
 for(const [n,g] of [...poses,...effects].entries()){
  if(x+g.w+2>2048){x=2;y+=row+4;row=0;}
  packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});
  (n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;row=Math.max(row,g.h);
 }
 await sharp({create:{width:2048,height:y+row+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(path('native'));
 const pads=poses.map((_,n)=>n===portrait?0:3),anchors=poses.map(()=>.5),body=poses[0].h-6;
 const meta={frames,effects:fx,anchors,pads,grip,portrait,body,height};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta)+'\n');
 fs.writeFileSync(root+'/'+id+'-art.js',`'use strict';
const ${cap}ArtRects=${JSON.stringify(meta)};
async function load${cap}Art(){
 if(ArtLoader.enabled&&await ArtLoader.load('${id}'))return;
 const sheet=new Image();sheet.src='${path('native')}';await sheet.decode();
 const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;};
 const frames=${cap}ArtRects.frames.map(crop),effects=${cap}ArtRects.effects.map(crop);
 characterArt.${id}={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'${id}',ci)))};
}
function ${id}NativeScale(){return ${height}/(${body}*FIGHTER_SCALE);}
`);
 fs.mkdirSync('previews/'+id,{recursive:true});
 const tiles=await Promise.all(poses.slice(0,portrait).map(async(g,n)=>{
  const input=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(145,150,{fit:'inside'}).png().toBuffer();
  return {input,left:n%8*160+5,top:Math.floor(n/8)*160+5};
 }));
 await sharp({create:{width:1280,height:Math.ceil(portrait/8)*160,channels:4,background:'#253851'}}).composite(tiles).png().toFile('previews/'+id+'/poses.png');
 console.log(id,portrait,body);
})().catch(e=>{console.error(e);process.exitCode=1;});
