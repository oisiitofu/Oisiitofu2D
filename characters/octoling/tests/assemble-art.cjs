const fs=require('fs'),path=require('path'),sharp=require('sharp'),extract=require('../../karateka/tests/extract-grid.cjs'),loose=require('../../fiora/tests/remove-loose-parts.cjs');
async function assemble(id,cap,height){
 const root=path.resolve('characters',id),read=async file=>sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const source=await read(root+'/assets/'+id+'-poses.png'),poses=(id==='viridi'?require('../../viridi/tests/extract-grid.cjs'):extract)(source.data,source.info.width,source.info.height,8,6).map(loose),fx=[];
 const effect=await read(root+'/assets/'+id+'-effects.png');
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const x=Math.round(col*effect.info.width/4),y=Math.round(row*effect.info.height/4),w=Math.round((col+1)*effect.info.width/4)-x,h=Math.round((row+1)*effect.info.height/4)-y,pixels=Buffer.alloc(w*h*4);
  for(let yy=0;yy<h;yy++)effect.data.copy(pixels,yy*w*4,((y+yy)*effect.info.width+x)*4,((y+yy)*effect.info.width+x+w)*4);
  let l=w,t=h,r=0,b=0;for(let p=0;p<w*h;p++)if(pixels[p*4+3]>35){l=Math.min(l,p%w);r=Math.max(r,p%w);t=Math.min(t,p/w|0);b=Math.max(b,p/w|0);}
  l=Math.max(0,l-2);t=Math.max(0,t-2);r=Math.min(w-1,r+2);b=Math.min(h-1,b+2);const nw=r-l+1,nh=b-t+1,out=Buffer.alloc(nw*nh*4);for(let yy=t;yy<=b;yy++)pixels.copy(out,(yy-t)*nw*4,(yy*w+l)*4,(yy*w+r+1)*4);fx.push({pixels:out,w:nw,h:nh});
 }
 // A selection portrait uses the already approved full standing body, with
 // transparent headroom. No new pose or altered face is generated here.
 const standing=poses[0],pw=standing.w+24,ph=standing.h+24,portrait=Buffer.alloc(pw*ph*4);
 for(let y=0;y<standing.h;y++)standing.pixels.copy(portrait,((y+12)*pw+12)*4,y*standing.w*4,(y+1)*standing.w*4);
 poses.push({pixels:portrait,w:pw,h:ph});await sharp(portrait,{raw:{width:pw,height:ph,channels:4}}).png().toFile(root+'/assets/'+id+'-selection.png');
 const frames=[],effects=[],packed=[];let x=2,y=2,rh=0;
 for(const [n,g]of [...poses,...fx].entries()){if(x+g.w+2>2048){x=2;y+=rh+4;rh=0;}packed.push({input:g.pixels,raw:{width:g.w,height:g.h,channels:4},left:x,top:y});(n<49?frames:effects).push([x,y,g.w,g.h]);x+=g.w+4;rh=Math.max(rh,g.h);}
 await sharp({create:{width:2048,height:y+rh+2,channels:4,background:'#00000000'}}).composite(packed).png().toFile(root+'/assets/'+id+'-native.png');
 const measures=poses.map(g=>{let top=g.h,bottom=0,area=0;for(let yy=0;yy<g.h;yy++){let count=0;for(let xx=0;xx<g.w;xx++)if(g.pixels[(yy*g.w+xx)*4+3]>150){count++;area++;}if(count>=Math.max(3,g.w*.012)){top=Math.min(top,yy);bottom=yy+1;}}return{body:bottom-top,pad:g.h-bottom,area};});
 const grip=id==='octoling'?[91/112-.5,1-12/170]:[116/152-.5,1-27/161],meta={frames,effects,anchors:Array(49).fill(.5),grip,pads:measures.map(m=>m.pad)};
 fs.writeFileSync(root+'/tests/art-layout.json',JSON.stringify(meta));fs.writeFileSync(root+'/tests/body-measurements.json',JSON.stringify(measures));
 fs.writeFileSync(root+'/'+id+'-art.js',`'use strict';\nconst ${cap}ArtRects=${JSON.stringify(meta)};\nasync function load${cap}Art(){if(ArtLoader.enabled&&await ArtLoader.load('${id}'))return;const sheet=new Image();sheet.src='characters/${id}/assets/${id}-native.png';await sheet.decode();const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;},frames=${cap}ArtRects.frames.map(crop),effects=${cap}ArtRects.effects.map(crop);characterArt.${id}={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'${id}',ci)))};}\nfunction ${id}NativeScale(n){return ${height}/(${measures[0].body}*FIGHTER_SCALE);}\n`);
 const grid=async(list,file,cols,cw,ch)=>{const images=await Promise.all(list.map(async(g,n)=>({input:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(cw-12,ch-12,{fit:'inside'}).png().toBuffer(),left:n%cols*cw,top:Math.floor(n/cols)*ch})));await sharp({create:{width:cols*cw,height:Math.ceil(list.length/cols)*ch,channels:4,background:'#26334d'}}).composite(images).png().toFile(root+'/previews/'+file);};await grid(poses.slice(0,48),'all-poses.png',8,240,250);await grid(fx,'effects.png',4,300,300);console.log(id,JSON.stringify({frames:49,effects:16,base:measures[0],grip}));
}
if(require.main===module)assemble('octoling','Octoling',78).catch(e=>{console.error(e);process.exitCode=1;});module.exports=assemble;
