'use strict';
// Pack intact generated whole figures; no articulated parts or posture warping.
const fs=require('fs'),sharp=require('sharp'),extract=require('../../elza/tests/extract-poses.cjs'),fxExtract=require('../../sam/tests/extract-effects.cjs');
const root='characters/hydaelyn';
(async()=>{
 const sheets={},poses=[],sourcePoses=[],scales={};
 for(const name of ['basic','attacks','specials','defense','extra','windup','recovery'])sheets[name]=extract(await sharp(root+'/assets/hydaelyn-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),4,4,name);
 const reference=sheets.basic[0],height=reference.h-6;
 for(const [name,list]of Object.entries(sheets)){
  const scale=height/(list[0].h-6);scales[name]=scale;
  for(const [cell,g]of list.entries()){
   if(cell===0&&name!=='basic')continue;
   const v=name==='basic'&&cell===0?{data:g.pixels,info:{width:g.w,height:g.h}}:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.max(1,Math.round(g.w*scale))}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   poses.push({pixels:v.data,w:v.info.width,h:v.info.height});sourcePoses.push({sheet:name,cell});
  }
 }
 const completion=extract(await sharp(root+'/assets/hydaelyn-strike-completion.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),2,1,'strike-completion');
 const cg=completion[1],cs=height/(completion[0].h-6),ci=await sharp(cg.pixels,{raw:{width:cg.w,height:cg.h,channels:4}}).resize({width:Math.round(cg.w*cs)}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 poses[22]={pixels:ci.data,w:ci.info.width,h:ci.info.height};sourcePoses[22]={sheet:'strike-completion',cell:1,scale:cs};
 const locked=root+'/assets/hydaelyn-neutral-locked.png';if(fs.existsSync(locked)){if(!(await sharp(locked).ensureAlpha().raw().toBuffer()).equals(reference.pixels))throw Error('Approved neutral changed');}else await sharp(reference.pixels,{raw:{width:reference.w,height:reference.h,channels:4}}).png().toFile(locked);
 const portrait=await sharp(root+'/assets/hydaelyn-selection.png').resize({width:600}).ensureAlpha().raw().toBuffer({resolveWithObject:true}),portraitIndex=poses.length;
 poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const effects=fxExtract(await sharp(root+'/assets/hydaelyn-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true})),frames=[],fx=[],packed=[];
 let x=2,y=2,row=0;for(const [n,g]of [...poses,...effects].entries()){if(x+g.w+2>2048){x=2;y+=row+4;row=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;row=Math.max(row,g.h);}
 await sharp({create:{width:2048,height:y+row+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/hydaelyn-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let count=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)count++;if(count>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const anchors=poses.map(()=>.5),hand=poses[55];let hx=0,hy=0,hn=0;for(let yy=3;yy<Math.min(24,hand.h);yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>180){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hands');
 const meta={frames,effects:fx,anchors,grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(m=>m.pad),scales,portrait:portraitIndex,sourcePoses};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/hydaelyn-art.js',`'use strict';\nconst HydaelynArtRects=${JSON.stringify(meta)};\nasync function loadHydaelynArt(){if(ArtLoader.enabled&&await ArtLoader.load('hydaelyn'))return;const sheet=new Image();sheet.src='characters/hydaelyn/assets/hydaelyn-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;};const frames=HydaelynArtRects.frames.map(crop),effects=HydaelynArtRects.effects.map(crop);characterArt.hydaelyn={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'hydaelyn',ci)))};}\nfunction hydaelynNativeScale(n){return 116/(HydaelynArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 fs.mkdirSync('previews/hydaelyn',{recursive:true});for(const [kind,list,cols]of [['poses',poses.slice(0,portraitIndex),8],['effects',effects,4]]){const tiles=await Promise.all(list.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%cols*240+15,top:Math.floor(n/cols)*270+15})));await sharp({create:{width:cols*240,height:Math.ceil(list.length/cols)*270,channels:4,background:'#24324a'}}).composite(tiles).png().toFile('previews/hydaelyn/'+kind+'.png');}
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,portraitIndex,scales,grip:meta.grip}));
})().catch(e=>{console.error(e);process.exitCode=1;});
