'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('../../karateka/tests/extract-grid.cjs'),loose=require('../../fiora/tests/remove-loose-parts.cjs');
(async()=>{const root='characters/dana',src=await sharp(root+'/assets/dana-poses.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const poses=extract(src.data,src.info.width,src.info.height,8,6).map(loose);
 // The horizontal down pose crosses the nominal row boundary. Use reviewed
 // source rectangles for these two cells rather than letting its core shift.
 for(const[n,box]of [[22,[1152,370,192,190]],[23,[1344,370,192,190]]]){const cell=await sharp(root+'/assets/dana-poses.png').extract({left:box[0],top:box[1],width:box[2],height:box[3]}).png().toBuffer(),g=await sharp(cell).trim({threshold:18}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses[n]=loose({pixels:g.data,w:g.info.width,h:g.info.height});}
 const portrait=await sharp(root+'/assets/dana-selection.png').resize({width:420}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const source=await sharp(root+'/assets/dana-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),fx=[];
 for(let row=0;row<4;row++)for(let col=0;col<3;col++){const left=Math.round(col*source.info.width/3),top=Math.round(row*source.info.height/4),width=Math.round((col+1)*source.info.width/3)-left,height=Math.round((row+1)*source.info.height/4)-top;const cell=await sharp(root+'/assets/dana-effects.png').extract({left,top,width,height}).png().toBuffer();const g=await sharp(cell).trim({threshold:18}).ensureAlpha().raw().toBuffer({resolveWithObject:true});fx.push({pixels:g.data,w:g.info.width,h:g.info.height});}
 let x=2,y=2,rh=0;const frames=[],effects=[],packed=[];
 for(const[g,n]of [...poses,...fx].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:effects).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/dana-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const meta={frames,effects,anchors:poses.map(()=>.5),grip:[0,.96],pads:measures.map(g=>g.pad)};
 const hand=poses[38];let hx=0,hy=0,hn=0;for(let yy=0;yy<15;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}meta.grip=[hx/hn/hand.w-.5,1-hy/hn/hand.h];
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/dana-art.js',`'use strict';\nconst DanaArtRects=${JSON.stringify(meta)};\nasync function loadDanaArt(){if(ArtLoader.enabled&&await ArtLoader.load('dana'))return;const sheet=new Image();sheet.src='characters/dana/assets/dana-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=DanaArtRects.frames.map(crop),effects=DanaArtRects.effects.map(crop);characterArt.dana={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'dana',ci)))};}\nfunction danaNativeScale(n){return 94/(DanaArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 const tiles=await Promise.all(poses.slice(0,48).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(215,220,{fit:'inside'}).png().toBuffer(),left:n%8*240+10,top:Math.floor(n/8)*245+10})));
 await sharp({create:{width:1920,height:1470,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/all-poses.png');
 console.log(JSON.stringify({frames:frames.length,effects:effects.length,base:measures[0]}));
})().catch(e=>{console.error(e);process.exitCode=1;});
