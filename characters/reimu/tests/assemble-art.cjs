'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/reimu';
const raw=f=>sharp(root+'/assets/reimu-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{if(Math.abs(k-1)<.0001)return g;const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
(async()=>{
 const sheets={};for(const p of['basic','attacks','specials','defense','extra'])sheets[p]=extract(await raw(p),4,4,p);
 const base=sheets.basic[0],referenceHeight=base.h-6,poses=[base],scales={};
 const lock=root+'/assets/reimu-neutral-locked.png';if(!fs.existsSync(lock))await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).png().toFile(lock);
 for(const p of['basic','attacks','specials','defense','extra']){const k=referenceHeight/(sheets[p][0].h-6);scales[p]=k;for(const g of sheets[p].slice(1))poses.push(await scale(g,k));}
 poses[60]=poses[75];
 const r=await raw('selection'),portrait=await sharp(r.data,{raw:{width:r.info.width,height:r.info.height,channels:4}}).resize({width:420}).raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const effects=require('./extract-effects.cjs')(await raw('effects'));
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];
 for(const[g,n]of[...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 const atlas=await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).raw().toBuffer({resolveWithObject:true});
 for(let yy=0;yy<base.h;yy++)base.pixels.copy(atlas.data,((frames[0][1]+yy)*2048+frames[0][0])*4,yy*base.w*4,(yy+1)*base.w*4);
 await sharp(atlas.data,{raw:{width:2048,height:atlas.info.height,channels:4}}).png().toFile(root+'/assets/reimu-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const anchors=poses.map((im,n)=>{if(n===76)return .5;let sx=0,count=0;for(let y=0;y<im.h;y++)for(let x=0;x<im.w;x++){const i=(y*im.w+x)*4,[r,g,b,a]=im.pixels.subarray(i,i+4);if(a>220&&(r>g*1.45&&r>b*1.3&&r>80)){sx+=x;count++;}}return count>100?sx/count/im.w:.5;});
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors,grip:[hx/hn/hand.w-anchors[58],1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/reimu-art.js',`'use strict';\nconst ReimuArtRects=${JSON.stringify(meta)};\nasync function loadReimuArt(){if(ArtLoader.enabled&&await ArtLoader.load('reimu'))return;const sheet=new Image();sheet.src='characters/reimu/assets/reimu-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=ReimuArtRects.frames.map(crop),effects=ReimuArtRects.effects.map(crop);characterArt.reimu={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'reimu',ci)))};}\nfunction reimuNativeScale(n){return 94/(ReimuArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 const tiles=await Promise.all(poses.slice(0,76).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));await sharp({create:{width:1920,height:2700,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/poses.png');
 const eff=await Promise.all(effects.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(260,210,{fit:'inside'}).png().toBuffer(),left:n%4*300+20,top:Math.floor(n/4)*240+15})));await sharp({create:{width:1200,height:960,channels:4,background:'#24324a'}}).composite(eff).png().toFile(root+'/previews/effects.png');
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
