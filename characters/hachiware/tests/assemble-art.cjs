'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/hachiware';
const raw=f=>sharp(root+'/assets/hachiware-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{if(Math.abs(k-1)<.0001)return g;const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
function bodyMeasure(g){
 let sx=0,n=0,top=g.h,bottom=0,left=g.w,right=0;
 for(let y=0;y<g.h;y++){let row=0;for(let x=0;x<g.w;x++){const i=(y*g.w+x)*4,[r,bg,b,a]=g.pixels.subarray(i,i+4);if(a>220&&r>185&&bg>180&&b>160&&Math.max(r,bg,b)-Math.min(r,bg,b)<65){sx+=x;n++;row++;left=Math.min(left,x);right=Math.max(right,x);}}if(row>=g.w*.05){top=Math.min(top,y);bottom=y+1;}}
 if(!n)throw Error('Missing white cat body');
 for(let y=0;y<top;y++){let row=0;for(let x=left;x<=right;x++){const i=(y*g.w+x)*4;if(g.pixels[i+3]>220)row++;}if(row>Math.max(4,(right-left)*.06)){top=y;break;}}
 return{body:bottom-top,pad:g.h-bottom,anchor:sx/n/g.w};
}

(async()=>{
 const sheets={};for(const p of['basic','attacks','specials','defense','extra'])sheets[p]=extract(await raw(p),4,4,p);
 const base=sheets.basic[0],referenceHeight=bodyMeasure(base).body,poses=[base],scales={};
 const lock=root+'/assets/hachiware-neutral-locked.png';if(!fs.existsSync(lock))await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).png().toFile(lock);
 for(const p of['basic','attacks','specials','defense','extra']){const k=referenceHeight/bodyMeasure(sheets[p][0]).body;scales[p]=k;for(const g of sheets[p].slice(1))poses.push(await scale(g,k));}
 const fix=await sharp(root+'/assets/hachiware-upsmash.png').trim().ensureAlpha().raw().toBuffer({resolveWithObject:true}),fg={pixels:fix.data,w:fix.info.width,h:fix.info.height};poses[24]=await scale(fg,referenceHeight/bodyMeasure(fg).body);
 const r=await raw('selection'),portrait=await sharp(r.data,{raw:{width:r.info.width,height:r.info.height,channels:4}}).resize({width:420}).raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const crops=Array.from({length:16},(_,n)=>[n%4*384,Math.floor(n/4)*256,384,256]),effects=[];
 for(const [x,y,w,h]of crops){const cell=await sharp(root+'/assets/hachiware-effects.png').extract({left:x,top:y,width:w,height:h}).png().toBuffer(),g=await sharp(cell).trim({threshold:12}).ensureAlpha().raw().toBuffer({resolveWithObject:true});effects.push({pixels:g.data,w:g.info.width,h:g.info.height});}
 fs.writeFileSync(root+'/tests/effect-crops.json',JSON.stringify(crops));
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];
 for(const[g,n]of[...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 const atlas=await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).raw().toBuffer({resolveWithObject:true});
 for(let yy=0;yy<base.h;yy++)base.pixels.copy(atlas.data,((frames[0][1]+yy)*2048+frames[0][0])*4,yy*base.w*4,(yy+1)*base.w*4);
 await sharp(atlas.data,{raw:{width:2048,height:atlas.info.height,channels:4}}).png().toFile(root+'/assets/hachiware-native.png');
 const measures=poses.map(bodyMeasure);
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors:measures.map(v=>v.anchor),grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/hachiware-art.js',`'use strict';\nconst HachiwareArtRects=${JSON.stringify(meta)};\nasync function loadHachiwareArt(){if(ArtLoader.enabled&&await ArtLoader.load('hachiware'))return;const sheet=new Image();sheet.src='characters/hachiware/assets/hachiware-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=HachiwareArtRects.frames.map(crop),effects=HachiwareArtRects.effects.map(crop);characterArt.hachiware={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'hachiware',ci)))};}\nfunction hachiwareNativeScale(n){return 76/(HachiwareArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 const tiles=await Promise.all(poses.slice(0,76).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));await sharp({create:{width:1920,height:2700,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/poses.png');
 const eff=await Promise.all(effects.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(260,210,{fit:'inside'}).png().toBuffer(),left:n%4*300+20,top:Math.floor(n/4)*240+15})));await sharp({create:{width:1200,height:960,channels:4,background:'#24324a'}}).composite(eff).png().toFile(root+'/previews/effects.png');
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
