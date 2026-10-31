'use strict';
// Measure uniform whole-figure scale by overlap with the untouched visible source.
const fs=require('fs'),sharp=require('sharp'),extract=require('../../elza/tests/extract-poses.cjs');
const root='characters/namine';
(async()=>{
 const out=[];
 for(const [frame,source,file,sheet]of [[20,'attacks-up-tilt-incomplete','up-tilt-completion','attacks'],[24,'up-smash-incomplete','up-smash-completion','attacks'],[80,'windup-up-tilt-incomplete','up-tilt-windup-completion','windup']]){
  const old=await sharp(`${root}/assets/namine-${source}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true}),g=extract(await sharp(`${root}/assets/namine-${file}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true}),1,1,file)[0],ow=old.info.width,oh=old.info.height,top=oh-10;let best={score:-1};
  for(let width=Math.floor(ow*.84);width<=ow*1.16;width+=2){const im=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width}).ensureAlpha().raw().toBuffer({resolveWithObject:true}),p=im.data,h=im.info.height;
   for(let dy=-12;dy<=12;dy+=3)for(let dx=-15;dx<=15;dx+=3){let both=0,either=0;for(let y=0;y<top;y++)for(let x=Math.min(0,dx);x<Math.max(ow,dx+width);x++){const a=x>=0&&x<ow&&old.data[(y*ow+x)*4+3]>160,xx=x-dx,yy=y-dy,b=xx>=0&&xx<width&&yy>=0&&yy<h&&p[(yy*width+xx)*4+3]>160;if(a||b)either++;if(a&&b)both++;}const score=both/either;if(score>best.score)best={score,width,dx,dy,scale:width/g.w};}
  }
  out.push({frame,sheet,source,file,original:[ow,oh],completion:[g.w,g.h],...best});
 }
 fs.writeFileSync(`${root}/tests/completion-scales.json`,JSON.stringify(out,null,2));console.log(JSON.stringify(out));
})().catch(e=>{console.error(e);process.exitCode=1;});
