'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('../../karateka/tests/extract-grid.cjs'),loose=require('../../fiora/tests/remove-loose-parts.cjs');
(async()=>{const root='characters/zero3',src=await sharp(root+'/assets/zero3-poses.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const poses=extract(src.data,src.info.width,src.info.height,8,6).map(loose);
 // A neighbouring spear tip touches cell 13's left margin. Remove only the
 // reviewed foreign pixels, keeping the head, hands and original canvas fixed.
 for(let yy=62;yy<=91;yy++)for(let xx=0;xx<79;xx++)poses[13].pixels.fill(0,(yy*poses[13].w+xx)*4,(yy*poses[13].w+xx)*4+4);
 // The horizontal down pose crosses the nominal row boundary. Use reviewed
 // source rectangles for these two cells rather than letting its core shift.
 for(const[n,box]of [[22,[1136,365,260,195]],[23,[1370,355,166,215]]]){const cell=await sharp(root+'/assets/zero3-poses.png').extract({left:box[0],top:box[1],width:box[2],height:box[3]}).png().toBuffer(),g=await sharp(cell).trim({threshold:18}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses[n]=loose({pixels:g.data,w:g.info.width,h:g.info.height});}
 const portrait=await sharp(root+'/assets/zero3-selection.png').resize({width:420}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const source=await sharp(root+'/assets/zero3-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),fx=[];
 const edges=[0,250,510,730,1024];for(let row=0;row<4;row++)for(let col=0;col<4;col++){const n=row*4+col,box=n===12?[0,700,446,324]:n===13?[446,730,448,294]:n===14?[875,730,350,294]:[col*384,edges[row],384,edges[row+1]-edges[row]];const cell=await sharp(root+'/assets/zero3-effects.png').extract({left:box[0],top:box[1],width:box[2],height:box[3]}).png().toBuffer(),g=await sharp(cell).trim({threshold:18}).ensureAlpha().raw().toBuffer({resolveWithObject:true});fx.push([12,13].includes(n)?loose({pixels:g.data,w:g.info.width,h:g.info.height}):{pixels:g.data,w:g.info.width,h:g.info.height});}

 let x=2,y=2,rh=0;const frames=[],effects=[],packed=[];
 for(const[g,n]of [...poses,...fx].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:effects).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/zero3-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const meta={frames,effects,anchors:poses.map(()=>.5),grip:[0,.96],pads:measures.map(g=>g.pad)};
 const hand=poses[38];let hx=0,hy=0,hn=0;for(let yy=0;yy<15;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}meta.grip=[hx/hn/hand.w-.5,1-hy/hn/hand.h];
 const flowers=poses.map((g,n)=>{if(n===48||n===30)return null;let x=0,y=0,count=0;for(let yy=0;yy<g.h;yy++)for(let xx=0;xx<g.w;xx++){const p=(yy*g.w+xx)*4,r=g.pixels[p],green=g.pixels[p+1],b=g.pixels[p+2];if(g.pixels[p+3]>150&&r>135&&b>90&&r>green*1.1&&b>green*1.04){x+=xx;y+=yy;count++;}}return count>=3?[x/count,y/count]:null;});meta.flowers=flowers;
 Object.assign(flowers,{4:[121,48],27:[158,26],28:[137,33],38:[31,45],44:[194,24]});
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/zero3-art.js',`'use strict';\nconst Zero3ArtRects=${JSON.stringify(meta)};\nasync function loadZero3Art(){if(ArtLoader.enabled&&await ArtLoader.load('zero3'))return;const sheet=new Image();sheet.src='characters/zero3/assets/zero3-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=Zero3ArtRects.frames.map(crop),effects=Zero3ArtRects.effects.map(crop);characterArt.zero3={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'zero3',ci)))};}\nfunction zero3NativeScale(n){return 94/(Zero3ArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 const tiles=await Promise.all(poses.slice(0,48).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(215,220,{fit:'inside'}).png().toBuffer(),left:n%8*240+10,top:Math.floor(n/8)*245+10})));
 await sharp({create:{width:1920,height:1470,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/all-poses.png');
 console.log(JSON.stringify({frames:frames.length,effects:effects.length,base:measures[0]}));
})().catch(e=>{console.error(e);process.exitCode=1;});
