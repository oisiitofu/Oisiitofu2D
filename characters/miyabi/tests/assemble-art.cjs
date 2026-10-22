'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('../../karateka/tests/extract-grid.cjs'),loose=require('../../fiora/tests/remove-loose-parts.cjs');
(async()=>{const root='characters/miyabi',src=await sharp(root+'/assets/miyabi-poses.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const poses=extract(src.data,src.info.width,src.info.height,8,6).map(loose),ext=await sharp(root+'/assets/miyabi-specials.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),extra=extract(ext.data,ext.info.width,ext.info.height,4,2).map(loose);
 // Cell25's eroded core was a neighbouring glove; take its complete reviewed body.
 {const cell=await sharp(root+'/assets/miyabi-poses.png').extract({left:200,top:550,width:180,height:180}).png().toBuffer(),g=await sharp(cell).trim({threshold:18}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses[25]=loose({pixels:g.data,w:g.info.width,h:g.info.height});}
 // The authored rear cut points right; normalize this ONE rear pose to the left.
 {const g=poses[14],im=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).flop().raw().toBuffer();g.pixels=im;}
 // Original ledge drawing lacked legs. Use generated WHOLE-BODY replacements,
 // scaled once against their neutral calibration figure, never a joint rig.
 if(fs.existsSync(root+'/assets/miyabi-ledge.png')){const raw=await sharp(root+'/assets/miyabi-ledge.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),repair=extract(raw.data,raw.info.width,raw.info.height,2,2).map(loose),k=(poses[0].h-6)/(repair[3].h-6);for(let n=0;n<3;n++){const g=repair[n],im=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses[37+n]={pixels:im.data,w:im.info.width,h:im.info.height};}}
 const scale=(poses[0].h-6)/(extra[3].h-6);
 for(const g of extra){const im=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*scale)}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:im.data,w:im.info.width,h:im.info.height});}
 // Replace only idle, after the original calibration of all other full bodies.
 // Match its existing 182px body and 5px sole pad; never resize other poses.
 if(fs.existsSync(root+'/assets/miyabi-idle-side.png')){
  const rows=g=>{let top=g.info.height,bottom=0;for(let y=0;y<g.info.height;y++){let n=0;for(let x=0;x<g.info.width;x++)if(g.data[(y*g.info.width+x)*4+3]>150)n++;if(n>=Math.max(3,g.info.width*.012)){top=Math.min(top,y);bottom=y+1;}}return{top,bottom,body:bottom-top};};
  const source=await sharp(root+'/assets/miyabi-idle-side.png').trim({threshold:1}).ensureAlpha().raw().toBuffer({resolveWithObject:true}),box=rows(source);
  let resized=await sharp(source.data,{raw:{width:source.info.width,height:source.info.height,channels:4}}).resize({width:Math.round(source.info.width*182/box.body)}).raw().toBuffer({resolveWithObject:true}),b=rows(resized);
  for(let n=0;n<3&&b.body!==182;n++){resized=await sharp(source.data,{raw:{width:source.info.width,height:source.info.height,channels:4}}).resize({height:resized.info.height+182-b.body}).raw().toBuffer({resolveWithObject:true});b=rows(resized);}
  if(b.body!==182)throw Error('Idle body calibration must stay 182px');
  const pixels=await sharp({create:{width:resized.info.width+10,height:192,channels:4,background:'#00000000'}}).composite([{input:resized.data,raw:{width:resized.info.width,height:resized.info.height,channels:4},left:5,top:187-b.bottom}]).raw().toBuffer();poses[0]={pixels,w:resized.info.width+10,h:192};
 }
 const tiles=await Promise.all(poses.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(215,220,{fit:'inside'}).png().toBuffer(),left:n%8*240+10,top:Math.floor(n/8)*245+10})));
 await sharp({create:{width:1920,height:1715,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/all-poses.png');
 if(!fs.existsSync(root+'/assets/miyabi-selection.png')||!fs.existsSync(root+'/assets/miyabi-effects.png')){console.log(JSON.stringify({poseReview:poses.length,base:[poses[0].w,poses[0].h],extraScale:scale}));return;}
 const portrait=await sharp(root+'/assets/miyabi-selection.png').resize({width:420}).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const source=await sharp(root+'/assets/miyabi-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),fx=[];
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){const cell=await sharp(root+'/assets/miyabi-effects.png').extract({left:col*(source.info.width/4),top:row*(source.info.height/4),width:source.info.width/4,height:source.info.height/4}).png().toBuffer(),g=await sharp(cell).trim({threshold:12}).ensureAlpha().raw().toBuffer({resolveWithObject:true});fx.push({pixels:g.data,w:g.info.width,h:g.info.height});}
 // Reference2 uses a ROUND red core; keep the dedicated icon rather than the
 // star-core motif in the main effect sheet. It is a HUD prop, never a slash.
 if(fs.existsSync(root+'/assets/miyabi-gauge.png')){const trimmed=await sharp(root+'/assets/miyabi-gauge.png').trim({threshold:12}).png().toBuffer(),g=await sharp(trimmed).resize({width:128}).ensureAlpha().raw().toBuffer({resolveWithObject:true});fx[8]={pixels:g.data,w:g.info.width,h:g.info.height};}
 let x=2,y=2,rh=0;const frames=[],effects=[],packed=[];for(const[g,n]of [...poses,...fx].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:effects).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/miyabi-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const meta={frames,effects,anchors:poses.map(()=>.5),grip:[0,.96],pads:measures.map(g=>g.pad),extraScale:scale};const hand=poses[38];let hx=0,hy=0,hn=0;for(let yy=0;yy<15;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}meta.grip=[hx/hn/hand.w-.5,1-hy/hn/hand.h];
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/miyabi-art.js',`'use strict';\nconst MiyabiArtRects=${JSON.stringify(meta)};\nasync function loadMiyabiArt(){if(ArtLoader.enabled&&await ArtLoader.load('miyabi'))return;const sheet=new Image();sheet.src='characters/miyabi/assets/miyabi-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=MiyabiArtRects.frames.map(crop),effects=MiyabiArtRects.effects.map(crop);characterArt.miyabi={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'miyabi',ci)))};}\nfunction miyabiNativeScale(n){return 94/(MiyabiArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 console.log(JSON.stringify({frames:frames.length,effects:effects.length,base:measures[0],grip:meta.grip}));
})().catch(e=>{console.error(e);process.exitCode=1;});
