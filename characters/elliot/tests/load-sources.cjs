'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-poses.cjs'),root='characters/elliot';
const regular=(n,c=4,r=4)=>Array.from({length:n},(_,i)=>[(i%c+.5)/c,(Math.floor(i/c)+.5)/r]);
const layouts={specials:[...regular(12),[.12,.875],[.43,.875],[.72,.875]],windup:[...regular(12),[.16,.875],[.49,.875],[.82,.875]]};
async function read(name,c=4,r=4){return extract(await sharp(root+'/assets/elliot-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),c,r,name,layouts[name]);}
async function scaled(g,scale){const v=scale===1?{data:g.pixels,info:{width:g.w,height:g.h}}:await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*scale)}).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{pixels:v.data,w:v.info.width,h:v.info.height};}
module.exports=async()=>{const names=['basic-v2','specials','defense','extra','windup','recovery'],sheets={};for(const n of names)sheets[n]=await read(n);sheets['windup-completion']=await read('windup-completion',2,1);const base=sheets['basic-v2'][0].h-6,scales={};for(const[n,g]of Object.entries(sheets))scales[n]=base/(g[0].h-6);const poses=[],sourcePoses=[];async function add(name,cell){poses.push(await scaled(sheets[name][cell],scales[name]));sourcePoses.push({sheet:name,cell});}
for(let n=0;n<16;n++)await add('basic-v2',n);const locks=JSON.parse(fs.readFileSync(root+'/tests/originals-lock.json'));for(let n=1;n<=15;n++){const file=root+'/assets/elliot-strike-'+String(n).padStart(2,'0')+'-locked.png',v=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});poses.push({pixels:v.data,w:v.info.width,h:v.info.height});sourcePoses.push(locks.sources[n]);}
for(const c of[1,2,0,3,4,5,6,7,8,9,10,11,12,13,14])await add('specials',c);for(let c=1;c<16;c++)await add('defense',c);for(let c=1;c<16;c++)await add('extra',c);for(const c of[1,2,3,4,-1,5,6,7,8,9,10,11,12,13,14])await add(c===-1?'windup-completion':'windup',c===-1?1:c);for(let c=1;c<16;c++)await add('recovery',c);
return{poses,sourcePoses,scales,base,sheets};};
module.exports.read=read;module.exports.scaled=scaled;
