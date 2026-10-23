'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/terra';
const raw=f=>sharp(root+'/assets/terra-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{if(Math.abs(k-1)<.0001)return g;const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
(async()=>{
 const poses=[],scales={},locked=[];let referenceHeight;
 for(const job of['normal','trance']){
  const sheets={};for(const part of['basic','attacks','specials','defense'])sheets[part]=extract(await raw(job+'-'+part),4,4,job+'-'+part);
  const base=sheets.basic[0];referenceHeight??=base.h-6;
  // The first approved game neutral is frozen. Normalize each sheet once,
  // preserving its complete bodies, original proportions and pose dimensions.
  const lock=root+'/assets/terra-'+job+'-neutral-locked.png';if(!fs.existsSync(lock))await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).png().toFile(lock);
  const own=[await scale(base,referenceHeight/(base.h-6))];
  for(const part of['basic','attacks','specials','defense']){
   let items=sheets[part],k=referenceHeight/(items[0].h-6);scales[job+'-'+part]=k;
   if(job==='normal'&&part==='attacks'){
    const fix=await sharp(root+'/assets/terra-normal-dair-fix.png').trim().ensureAlpha().raw().toBuffer({resolveWithObject:true});
    // Preserve the original body dimensions: blade completion only adds width.
    items[15]=await scale({pixels:fix.data,w:fix.info.width,h:fix.info.height},(items[15].h-6)/fix.info.height);
   }
   for(const g of items.slice(1))own.push(await scale(g,k));
  }
  if(own.length!==61)throw Error(job+' expected 61 bodies');
  locked.push({index:poses.length,body:own[0]});poses.push(...own);
  if(job==='normal'){
   const r=await raw('selection'),g=await sharp(r.data,{raw:{width:r.info.width,height:r.info.height,channels:4}}).extract({left:560,top:0,width:960,height:1024}).raw().toBuffer({resolveWithObject:true});
   poses.push(await scale({pixels:g.data,w:g.info.width,h:g.info.height},420/g.info.width));
  }
 }
 const effects=[],crops=[
 [0,0,384,215],[384,0,384,215],[768,0,384,215],[1152,0,384,215],
 [0,215,390,280],[392,215,376,280],[768,215,384,280],[1152,215,384,280],
 [0,500,350,165],[350,500,380,170],[730,495,458,207],[1200,460,336,245],
 [0,700,390,324],[395,690,385,334],[780,700,372,324],[1152,700,384,324],
 [0,0,350,238],[350,0,385,238],[735,0,425,240],[1180,0,356,253],
 [0,250,384,268],[340,240,430,285],[780,240,372,292],[1152,254,384,282],
 [0,519,384,219],[384,533,384,200],[768,542,384,198],[1152,540,384,195],
 [0,739,384,285],[384,690,384,334],[755,744,405,280],[1158,737,378,287]];
 for(let n=0;n<32;n++){
  const [x,y,w,h]=crops[n],g=await sharp(root+'/assets/terra-effects-'+Math.floor(n/16)+'.png').extract({left:x,top:y,width:w,height:h}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(n===7&&x+xx>1352&&y+yy>450||n===11&&y+yy<495&&x+xx<1355||n===12&&x+xx>365&&y+yy>945||n===13&&x+xx>750&&y+yy<720||n===21&&x+xx<390&&y+yy<330||n===25&&(y+yy>720||y+yy>687&&x+xx<615)||n===29&&x+xx>620&&y+yy<744)g.data[(yy*w+xx)*4+3]=0;
  const cell=await sharp(g.data,{raw:{width:w,height:h,channels:4}}).png().toBuffer(),t=await sharp(cell).trim({threshold:12}).ensureAlpha().raw().toBuffer({resolveWithObject:true});effects.push({pixels:t.data,w:t.info.width,h:t.info.height});
 }
 fs.writeFileSync(root+'/tests/effect-crops.json',JSON.stringify(crops));
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];
 for(const[g,n]of[...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 const atlas=await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).raw().toBuffer({resolveWithObject:true});
 for(const{index,body:g}of locked){const[bx,by]=frames[index];for(let yy=0;yy<g.h;yy++)g.pixels.copy(atlas.data,((by+yy)*2048+bx)*4,yy*g.w*4,(yy+1)*g.w*4);}
 await sharp(atlas.data,{raw:{width:2048,height:atlas.info.height,channels:4}}).png().toFile(root+'/assets/terra-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors:poses.map(()=>.5),grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/terra-art.js',`'use strict';\nconst TerraArtRects=${JSON.stringify(meta)};\nasync function loadTerraArt(){if(ArtLoader.enabled&&await ArtLoader.load('terra'))return;const sheet=new Image();sheet.src='characters/terra/assets/terra-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=TerraArtRects.frames.map(crop),effects=TerraArtRects.effects.map(crop);characterArt.terra={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'terra',ci)))};}\nfunction terraNativeScale(n){return 94/(TerraArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 for(let job=0;job<2;job++){
  const offset=[0,62][job],tiles=await Promise.all(poses.slice(offset,offset+61).map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));
  await sharp({create:{width:1920,height:2160,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/poses-'+job+'.png');
 }
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
