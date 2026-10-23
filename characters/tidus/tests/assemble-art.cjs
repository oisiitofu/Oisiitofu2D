'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/tidus';
const raw=f=>sharp(root+'/assets/tidus-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{if(Math.abs(k-1)<.0001)return g;const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
(async()=>{
 const sheets={};for(const p of['basic','attacks','specials','defense','extra'])sheets[p]=extract(await raw(p),4,4,p);
 const base=sheets.basic[0],referenceHeight=base.h-6,poses=[base],scales={};
 const lock=root+'/assets/tidus-neutral-locked.png';if(!fs.existsSync(lock))await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).png().toFile(lock);
 // The painted heel in the original back-air pose points RIGHT while its
 // face points LEFT. Normalize this one whole pose before facing mirroring.
 const back=sheets.attacks[13],flop=await sharp(back.pixels,{raw:{width:back.w,height:back.h,channels:4}}).flop().raw().toBuffer();sheets.attacks[13]={...back,pixels:flop};
 const fix=await sharp(root+'/assets/tidus-quick-first-fix.png').trim().ensureAlpha().raw().toBuffer({resolveWithObject:true});sheets.extra[1]=await scale({pixels:fix.data,w:fix.info.width,h:fix.info.height},(sheets.extra[1].h-6)/fix.info.height);
 for(const p of['basic','attacks','specials','defense','extra']){const k=referenceHeight/(sheets[p][0].h-6);scales[p]=k;for(const g of sheets[p].slice(1))poses.push(await scale(g,k));}
 // The unapproved source fall has a third boot. Use the corrected complete
 // ordinary fall, preserving its own sheet's calibration scale.
 poses[42]=poses[75];
 const r=await raw('selection-final'),portrait=await sharp(r.data,{raw:{width:r.info.width,height:r.info.height,channels:4}}).resize({width:420}).raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const crops=[[0,0,384,256],[384,0,384,256],[768,0,384,256],[1152,0,384,256],[0,256,384,256],[384,256,345,256],[730,256,435,256],[1165,256,371,256],[0,512,380,256],[380,512,425,256],[805,507,347,261],[1152,512,384,256],[0,768,390,256],[390,768,378,256],[768,768,332,256],[1100,768,436,256]],effects=[];
 for(const [x,y,w,h]of crops){const cell=await sharp(root+'/assets/tidus-effects.png').extract({left:x,top:y,width:w,height:h}).png().toBuffer(),g=await sharp(cell).trim({threshold:12}).ensureAlpha().raw().toBuffer({resolveWithObject:true});effects.push({pixels:g.data,w:g.info.width,h:g.info.height});}
 fs.writeFileSync(root+'/tests/effect-crops.json',JSON.stringify(crops));
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];
 for(const[g,n]of[...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 const atlas=await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).raw().toBuffer({resolveWithObject:true});
 for(let yy=0;yy<base.h;yy++)base.pixels.copy(atlas.data,((frames[0][1]+yy)*2048+frames[0][0])*4,yy*base.w*4,(yy+1)*base.w*4);
 await sharp(atlas.data,{raw:{width:2048,height:atlas.info.height,channels:4}}).png().toFile(root+'/assets/tidus-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors:poses.map(()=>.5),grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/tidus-art.js',`'use strict';\nconst TidusArtRects=${JSON.stringify(meta)};\nasync function loadTidusArt(){if(ArtLoader.enabled&&await ArtLoader.load('tidus'))return;const sheet=new Image();sheet.src='characters/tidus/assets/tidus-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=TidusArtRects.frames.map(crop),effects=TidusArtRects.effects.map(crop);characterArt.tidus={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'tidus',ci)))};}\nfunction tidusNativeScale(n){return 98/(TidusArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 const tiles=await Promise.all(poses.slice(0,76).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));await sharp({create:{width:1920,height:2700,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/poses.png');
 const eff=await Promise.all(effects.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(260,210,{fit:'inside'}).png().toBuffer(),left:n%4*300+20,top:Math.floor(n/4)*240+15})));await sharp({create:{width:1200,height:960,channels:4,background:'#24324a'}}).composite(eff).png().toFile(root+'/previews/effects.png');
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
