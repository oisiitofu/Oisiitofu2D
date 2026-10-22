'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/onionknight';
const raw=f=>sharp(root+'/assets/onionknight-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{if(Math.abs(k-1)<.0001)return g;const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
(async()=>{
 const poses=[],scales={},locked=[];let referenceHeight;
 for(const job of['knight','ninja','sage']){
  const sheets={};for(const part of['basic','attacks','specials','defense'])sheets[part]=extract(await raw(job+'-'+part),4,4,job+'-'+part);
  const base=sheets.basic[0];referenceHeight??=base.h-6;
  // The first approved game neutral is frozen. Normalize each sheet once,
  // preserving its complete bodies, original proportions and pose dimensions.
  const lock=root+'/assets/onionknight-'+job+'-neutral-locked.png';if(!fs.existsSync(lock))await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).png().toFile(lock);
  const own=[await scale(base,referenceHeight/(base.h-6))];
  for(const part of['basic','attacks','specials','defense']){
   let items=sheets[part],k=referenceHeight/(items[0].h-6);scales[job+'-'+part]=k;
   if(job==='knight'&&part==='specials')items=[...items.slice(0,9),items[8],...items.slice(9,15)];
   if(job==='knight'&&part==='attacks'){
    const fix=await sharp(root+'/assets/onionknight-knight-thrust-fix.png').trim().ensureAlpha().raw().toBuffer({resolveWithObject:true});
    // Match this replacement's body height to the original thrust. Its blade
    // now ends inside the frame, rather than at the source sheet's edge.
    items[3]=await scale({pixels:fix.data,w:fix.info.width,h:fix.info.height},(items[3].h-6)/fix.info.height);
   }
   for(const g of items.slice(1))own.push(await scale(g,k));
  }
  if(own.length!==61)throw Error(job+' expected 61 bodies');
  locked.push({index:poses.length,body:own[0]});poses.push(...own);
  if(job==='knight'){
   const r=await raw('selection'),g=await sharp(r.data,{raw:{width:r.info.width,height:r.info.height,channels:4}}).extract({left:300,top:0,width:1236,height:1024}).raw().toBuffer({resolveWithObject:true});
   poses.push(await scale({pixels:g.data,w:g.info.width,h:g.info.height},420/g.info.width));
  }
 }
 const effects=[],crops=[];
 for(let bank=0;bank<2;bank++){
  const p=root+'/assets/onionknight-effects-'+bank+'.png',m=await sharp(p).metadata();
  for(let i=0;i<16;i++){
   let x=Math.round(i%4*m.width/4),y=Math.round(Math.floor(i/4)*m.height/4),w=Math.round((i%4+1)*m.width/4)-x,h=Math.round((Math.floor(i/4)+1)*m.height/4)-y;
   // Reviewed wind ribbon has beige dust from its left neighbour crossing
   // the nominal gutter. Its own green paint starts at x448.
   if(bank===1&&i===13){x=448;w=300;}
   crops.push([x,y,w,h]);let cell=await sharp(p).extract({left:x,top:y,width:w,height:h}).png().toBuffer();
   // The meteor's painted head is down-left. Normalize it to DOWN before any
   // display stretching, then apply the fighter's horizontal mirror at draw.
   if(bank===1&&i===14)cell=await sharp(cell).rotate(-45,{background:'#00000000'}).png().toBuffer();
   const g=await sharp(cell).trim({threshold:12}).ensureAlpha().raw().toBuffer({resolveWithObject:true});effects.push({pixels:g.data,w:g.info.width,h:g.info.height});
  }
 }
 fs.writeFileSync(root+'/tests/effect-crops.json',JSON.stringify(crops));
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];
 for(const[g,n]of[...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 const atlas=await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).raw().toBuffer({resolveWithObject:true});
 for(const{index,body:g}of locked){const[bx,by]=frames[index];for(let yy=0;yy<g.h;yy++)g.pixels.copy(atlas.data,((by+yy)*2048+bx)*4,yy*g.w*4,(yy+1)*g.w*4);}
 await sharp(atlas.data,{raw:{width:2048,height:atlas.info.height,channels:4}}).png().toFile(root+'/assets/onionknight-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors:poses.map(()=>.5),grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/onionknight-art.js',`'use strict';\nconst OnionKnightArtRects=${JSON.stringify(meta)};\nasync function loadOnionKnightArt(){if(ArtLoader.enabled&&await ArtLoader.load('onionknight'))return;const sheet=new Image();sheet.src='characters/onionknight/assets/onionknight-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=OnionKnightArtRects.frames.map(crop),effects=OnionKnightArtRects.effects.map(crop);characterArt.onionknight={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'onionknight',ci)))};}\nfunction onionknightNativeScale(n){return 78/(OnionKnightArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 for(let job=0;job<3;job++){
  const offset=[0,62,123][job],tiles=await Promise.all(poses.slice(offset,offset+61).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));
  await sharp({create:{width:1920,height:2160,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/poses-'+job+'.png');
 }
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
