'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/sakura';
const raw=async f=>sharp(root+'/assets/sakura-'+f+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const scale=async(g,k)=>{const p=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*k)}).raw().toBuffer({resolveWithObject:true});return{pixels:p.data,w:p.info.width,h:p.info.height};};
(async()=>{const sheets={};for(const name of['basic','attacks','specials','defense']){const r=await raw(name);sheets[name]=extract(r,4,4,name);}
 const g=sheets.basic[4];sheets.basic[4]={...g,pixels:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).flop().raw().toBuffer()};
 const fixes=extract(await raw('motion-fix'),2,2,'motion-fix'),originalAttacks=sheets.attacks,originalSpecials=sheets.specials;const ak=(originalAttacks[0].h-6)/(fixes[0].h-6),sk=(originalSpecials[0].h-6)/(fixes[0].h-6);sheets.attacks=[...originalAttacks.slice(0,4),await scale(fixes[1],ak),...originalAttacks.slice(4,15)];sheets.specials=[...originalSpecials.slice(0,4),await scale(fixes[2],sk),...originalSpecials.slice(4,15)];
 // Freeze the first basic whole-body pose before assembling movement/attacks.
 const base=sheets.basic[0],poses=[base],scales={};if(!fs.existsSync(root+'/assets/sakura-neutral-locked.png'))await sharp(base.pixels,{raw:{width:base.w,height:base.h,channels:4}}).png().toFile(root+'/assets/sakura-neutral-locked.png');
 for(const name of['basic','attacks','specials','defense']){const items=sheets[name],k=(base.h-6)/(items[0].h-6);scales[name]=k;for(const g of items.slice(1))poses.push(await scale(g,k));if(name==='specials'&&root.endsWith('ellen')){const g=await raw('victory');const trimmed=await sharp(g.data,{raw:{width:g.info.width,height:g.info.height,channels:4}}).trim().raw().toBuffer({resolveWithObject:true});poses.push(await scale({pixels:trimmed.data,w:trimmed.info.width,h:trimmed.info.height},(base.h-6)/trimmed.info.height));}}
 if(poses.length!==61)throw Error('Expected 61 whole-body poses');
 const tiles=await Promise.all(poses.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%8*240+15,top:Math.floor(n/8)*270+15})));
 await sharp({create:{width:1920,height:2160,channels:4,background:'#24324a'}}).composite(tiles).png().toFile(root+'/previews/all-poses.png');
 const selection=await raw('selection');poses.push(await scale({pixels:selection.data,w:selection.info.width,h:selection.info.height},420/selection.info.width));poses.push(await scale(fixes[3],(base.h-6)/(fixes[0].h-6)));
 if(poses.length!==63)throw Error('Missing dedicated air dance frame');
 const crops=JSON.parse(fs.readFileSync(root+'/tests/effect-crops.json'));const fm=await sharp(root+'/assets/sakura-effects.png').metadata(),effects=[];
 for(let n=0;n<16;n++){const[left,top,width,height]=crops[n];
  let cell=await sharp(root+'/assets/sakura-effects.png').extract({left,top,width,height}).png().toBuffer();cell=await sharp(cell).trim({threshold:12}).png().toBuffer();
  // Actual source axes are recorded per image; no blanket flip.
  const g=await sharp(cell).ensureAlpha().raw().toBuffer({resolveWithObject:true});effects.push({pixels:g.data,w:g.info.width,h:g.info.height});}
 let x=2,y=2,rh=0;const frames=[],fx=[],packed=[];for(const[g,n]of [...poses,...effects].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 const atlas=await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).raw().toBuffer({resolveWithObject:true});
 // Avoid a second premultiply/unpremultiply round trip on the locked neutral.
 const [bx,by]=frames[0];for(let yy=0;yy<base.h;yy++)base.pixels.copy(atlas.data,((by+yy)*2048+bx)*4,yy*base.w*4,(yy+1)*base.w*4);
 await sharp(atlas.data,{raw:{width:2048,height:atlas.info.height,channels:4}}).png().toFile(root+'/assets/sakura-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let n=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)n++;if(n>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const hand=poses[58];let hx=0,hy=0,hn=0;for(let yy=0;yy<14;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>128){hx+=xx;hy+=yy;hn++;}if(!hn)throw Error('Missing ledge hand');
 const meta={frames,effects:fx,anchors:poses.map(()=>.5),grip:[hx/hn/hand.w-.5,1-hy/hn/hand.h],pads:measures.map(v=>v.pad),scales};fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/sakura-art.js',`'use strict';\nconst SakuraArtRects=${JSON.stringify(meta)};\nasync function loadSakuraArt(){if(ArtLoader.enabled&&await ArtLoader.load('sakura'))return;const sheet=new Image();sheet.src='characters/sakura/assets/sakura-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=SakuraArtRects.frames.map(crop),effects=SakuraArtRects.effects.map(crop);characterArt.sakura={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'sakura',ci)))};}\nfunction sakuraNativeScale(n){return 94/(SakuraArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,base:measures[0],grip:meta.grip,scales}));
})().catch(e=>{console.error(e);process.exitCode=1;});
