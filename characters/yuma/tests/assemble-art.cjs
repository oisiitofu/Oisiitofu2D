'use strict';
// Pack intact generated whole figures; no articulated parts or posture warping.
const fs=require('fs'),crypto=require('crypto'),sharp=require('sharp'),extract=require('../../elza/tests/extract-poses.cjs'),fxExtract=require('../../sam/tests/extract-effects.cjs');
const root='characters/yuma';
(async()=>{
 const sheets={},poses=[],sourcePoses=[],scales={};
 for(const name of ['basic','attacks','specials','defense','extra','windup','recovery'])sheets[name]=extract(await sharp(root+'/assets/yuma-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),4,4,name);
 const reference=sheets.basic[0],height=reference.h-6;
 for(const [name,list]of Object.entries(sheets)){
  const scale=height/(list[0].h-6);scales[name]=scale;
  for(const [cell,g]of list.entries()){
   if(cell===0&&name!=='basic')continue;
   const v=name==='basic'&&cell===0?{data:g.pixels,info:{width:g.w,height:g.h}}:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.max(1,Math.round(g.w*scale))}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   poses.push({pixels:v.data,w:v.info.width,h:v.info.height});sourcePoses.push({sheet:name,cell});
  }
 }
 for(let j=0;j<16;j++){const ix=j===0?0:15+j,p=root+'/assets/locked/'+j+'.png',v=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses[ix]={pixels:v.data,w:v.info.width,h:v.info.height};}const locked=root+'/assets/yuma-neutral-locked.png';if(fs.existsSync(locked)){if(!(await sharp(locked).ensureAlpha().raw().toBuffer()).equals(reference.pixels))throw Error('Approved neutral changed');}else await sharp(reference.pixels,{raw:{width:reference.w,height:reference.h,channels:4}}).png().toFile(locked);
 const portrait=await sharp(root+'/assets/yuma-selection.png').resize({width:600}).ensureAlpha().raw().toBuffer({resolveWithObject:true}),portraitIndex=poses.length;
 poses.push({pixels:portrait.data,w:portrait.info.width,h:portrait.info.height});
 const effects=fxExtract(await sharp(root+'/assets/yuma-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true})),frames=[],fx=[],packed=[];
 let x=2,y=2,row=0;for(const [n,g]of [...poses,...effects].entries()){if(x+g.w+2>2048){x=2;y+=row+4;row=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<poses.length?frames:fx).push([x,y,g.w,g.h]);x+=g.w+4;row=Math.max(row,g.h);}
 // Copy unpremultiplied pixels directly; alpha-over composition rounds RGB at
 // translucent edges and would modify the approved locked whole-body keys.
 const atlasHeight=y+row+2,atlas=Buffer.alloc(2048*atlasHeight*4);
 for(const part of packed)for(let yy=0;yy<part.raw.height;yy++)part.input.copy(atlas,((part.top+yy)*2048+part.left)*4,yy*part.raw.width*4,(yy+1)*part.raw.width*4);
 await sharp(atlas,{raw:{width:2048,height:atlasHeight,channels:4}}).png().toFile(root+'/assets/yuma-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0;for(let yy=0;yy<g.h;yy++){let count=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150)count++;if(count>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom};});
 const coordinateEvidence=JSON.parse(fs.readFileSync(root+'/tests/body-axis-evidence.json')),anchors=[...coordinateEvidence.poses.map(p=>p.waist[0]),.5],handContact=coordinateEvidence.ledge.normalized;
 sourcePoses[29]={sheet:'upair-correction',cell:0,scale:.373};
 const meta={frames,effects:fx,anchors,grip:[handContact[0]-anchors[55],1-handContact[1]],pads:measures.map(m=>m.pad),scales,portrait:portraitIndex,sourcePoses};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/yuma-art.js',`'use strict';\nconst YumaArtRects=${JSON.stringify(meta)};\nasync function loadYumaArt(){if(ArtLoader.enabled&&await ArtLoader.load('yuma'))return;const sheet=new Image();sheet.src='characters/yuma/assets/yuma-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;};const frames=YumaArtRects.frames.map(crop),effects=YumaArtRects.effects.map(crop);characterArt.yuma={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'yuma',ci)))};}\nfunction yumaNativeScale(n){return 78/(YumaArtRects.frames[0][3]*FIGHTER_SCALE);}\n`);
 fs.mkdirSync('previews/yuma',{recursive:true});for(const [kind,list,cols]of [['poses',poses.slice(0,portraitIndex),8],['effects',effects,4]]){const tiles=await Promise.all(list.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(210,240,{fit:'inside'}).png().toBuffer(),left:n%cols*240+15,top:Math.floor(n/cols)*270+15})));await sharp({create:{width:cols*240,height:Math.ceil(list.length/cols)*270,channels:4,background:'#24324a'}}).composite(tiles).png().toFile('previews/yuma/'+kind+'.png');}
 // Native-scale contacts keep one physical scale across every pose; no fit-to-tile resizing.
 const displayScale=156/(reference.h-6),cols=8,tile=340;
 for(let start=0;start<106;start+=32){const list=poses.slice(start,Math.min(106,start+32)),tiles=[];for(const[n,g]of list.entries()){const w=Math.round(g.w*displayScale),h=Math.round(g.h*displayScale);tiles.push({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(w,h).png().toBuffer(),left:n%cols*tile+Math.round((tile-w)/2),top:Math.floor(n/cols)*tile+300-h});tiles.push({input:Buffer.from(`<svg width="340" height="30"><text x="8" y="22" fill="white" font-size="18">${start+n}</text></svg>`),left:n%cols*tile,top:Math.floor(n/cols)*tile});}await sharp({create:{width:cols*tile,height:Math.ceil(list.length/cols)*tile,channels:4,background:'#24324a'}}).composite(tiles).png().toFile('previews/yuma/constant-native-'+start+'.png');}
 // Each normal is shown as the locked neutral, new windup, locked strike and new recovery.
 for(let start=0;start<15;start+=5){const tiles=[];for(let j=start;j<Math.min(15,start+5);j++){for(const[k,ix]of[0,76+j,16+j,91+j].entries()){const g=poses[ix],w=Math.round(g.w*displayScale),h=Math.round(g.h*displayScale);tiles.push({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(w,h).png().toBuffer(),left:k*tile+Math.round((tile-w)/2),top:(j-start)*tile+300-h});}tiles.push({input:Buffer.from(`<svg width="340" height="30"><text x="8" y="22" fill="white" font-size="18">normal ${j} / ${16+j}</text></svg>`),left:0,top:(j-start)*tile});}await sharp({create:{width:4*tile,height:Math.min(5,15-start)*tile,channels:4,background:'#24324a'}}).composite(tiles).png().toFile('previews/yuma/transitions-'+start+'.png');}
 for(const[n,g]of effects.entries())await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).png().toFile('previews/yuma/effect-'+n+'.png');
 console.log(JSON.stringify({frames:frames.length,effects:fx.length,portraitIndex,scales,grip:meta.grip}));
})().catch(e=>{console.error(e);process.exitCode=1;});
