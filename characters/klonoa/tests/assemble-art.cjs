const fs=require('node:fs'),sharp=require('sharp'),extract=require('./extract-grid.cjs');
const root=require('node:path').resolve(__dirname,'..');
(async()=>{
 for(const d of['assets','tests','docs','previews'])fs.mkdirSync(root+'/'+d,{recursive:true});
 const files={'poses':'exec-305c5598-2edc-4b4b-9bcd-c1336c99a022.png','motion':'exec-219646b2-7ae2-47c4-92f5-c3a50590f3b1.png','effects':'exec-4cb2f9ce-38fd-40f4-acb8-d2b00f2dafc0.png','selection':'exec-39043ddb-224e-42e9-b355-2ffaa14ccb58.png'},poses=[],fx=[];
 for(const[k,file]of Object.entries(files)){const dest=root+'/assets/klonoa-'+k+'.png';if(k==='selection')continue;const{data,info}=await sharp(dest).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(k!=='effects')poses.push(...extract(data,info.width,info.height,6,4));
  else fx.push(...require('./extract-effects-grid.cjs')(data,info.width,info.height,3,4));
 }

 const baseline=await sharp(root+'/assets/klonoa-poses-baseline.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});poses[0]=extract(baseline.data,baseline.info.width,baseline.info.height,6,4)[0];
 const portrait=await sharp(root+'/assets/klonoa-selection.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const frames=[],effects=[],packed=[];let x=2,y=2,row=0;
 for(const[g,n]of[...poses,...fx].map((g,n)=>[g,n])){if(x+g.w+2>2048){x=2;y+=row+4;row=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<49?frames:effects).push([x,y,g.w,g.h]);x+=g.w+4;row=Math.max(row,g.h);}
 await sharp({create:{width:2048,height:y+row+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/klonoa-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0,area=0;for(let yy=0;yy<g.h;yy++){let count=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150){count++;area++;}if(count>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom,area};});
 const hand=poses[38];let hy=hand.h,hx=0,hn=0;for(let k=0;k<hand.w*hand.h;k++)if(hand.pixels[k*4+3]>150)hy=Math.min(hy,k/hand.w|0);for(let yy=hy;yy<hy+7;yy++)for(let xx=0;xx<hand.w;xx++)if(hand.pixels[(yy*hand.w+xx)*4+3]>150){hx+=xx;hn++;}
 const grip=[hx/hn/hand.w-.5,(hand.h-hy)/hand.h],meta={frames,effects,anchors:Array(49).fill(.5),grip,pads:measures.map(m=>m.pad)};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/klonoa-art.js',`'use strict';\nconst KlonoaArtRects=${JSON.stringify(meta)};\nasync function loadKlonoaArt(){if(ArtLoader.enabled&&await ArtLoader.load('klonoa'))return;const sheet=new Image();sheet.src='characters/klonoa/assets/klonoa-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=KlonoaArtRects.frames.map(crop),effects=KlonoaArtRects.effects.map(crop);characterArt.klonoa={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'klonoa',ci)))};}\nfunction klonoaNativeScale(n){return 90/(KlonoaArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 console.log(JSON.stringify({frames:frames.length,effects:effects.length,grip,base:measures[0]}));
})().catch(e=>{console.error(e);process.exitCode=1;});
