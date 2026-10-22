'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('../../karateka/tests/extract-grid.cjs'),loose=require('../../fiora/tests/remove-loose-parts.cjs'),root='characters/billy';
const raw=async f=>sharp(root+'/assets/billy-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
(async()=>{const sheets={};for(const name of['basic','attacks','specials','defense']){const r=await raw(name);sheets[name]=extract(r.data,r.info.width,r.info.height,4,4).map(loose);}
 // The specials calibration has complete hair tips and level soles. Freeze it
 // before assembling the intermediate whole-body movement/attack images.
 const base=sheets.specials[0],poses=[base],scales={};
 for(const name of['basic','attacks','specials','defense']){const items=sheets[name],k=(base.h-6)/(items[0].h-6);scales[name]=k;for(const g of items.slice(1))poses.push(await scale(g,k));}
 if(poses.length!==61)throw Error('Expected 61 whole-body poses');
 const tiles=await Promise.all(poses.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));
 await sharp({create:{width:1920,height:2160,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/all-poses.png');
 const selection=await raw('selection');poses.push(await scale({pixels:selection.data,w:selection.info.width,h:selection.info.height},420/selection.info.width));
 const fm=await sharp(root+'/assets/billy-effects.png').metadata(),effects=[];
 for(let n=0;n<16;n++){const col=n%4,row=n/4|0,left=Math.round(col*fm.width/4),top=Math.round(row*fm.height/4),width=Math.round((col+1)*fm.width/4)-left,height=Math.round((row+1)*fm.height/4)-top;
  let cell=await sharp(root+'/assets/billy-effects.png').extract({left,top,width,height}).png().toBuffer();cell=await sharp(cell).trim({threshold:12}).png().toBuffer();
  // Authored downward fan13 actually points UP. Normalize only this source.
  if(n===13)cell=await sharp(cell).rotate(180).png().toBuffer();
  const g=await sharp(cell).ensureAlpha().raw().toBuffer({resolveWithObject:true});effects.push({pixels:g.data,w:g.info.width,h:g.info.height});}
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];for(const[g,n]of [...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/billy-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors:poses.map(()=>.5),grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/billy-art.js',`'use strict';\nconst BillyArtRects=${JSON.stringify(meta)};\nasync function loadBillyArt(){if(ArtLoader.enabled&&await ArtLoader.load('billy'))return;const sheet=new Image();sheet.src='characters/billy/assets/billy-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=BillyArtRects.frames.map(crop),effects=BillyArtRects.effects.map(crop);characterArt.billy={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'billy',ci)))};}\nfunction billyNativeScale(n){return 98/(BillyArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
