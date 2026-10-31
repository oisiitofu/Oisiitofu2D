'use strict';
const fs=require('fs'),sharp=require('sharp'),extract=require('./extract-art.cjs');
const root='characters/magus',name=process.argv[2];
(async()=>{const raw=await sharp(root+'/assets/magus-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),list=extract(raw),tiles=[];fs.mkdirSync('previews/magus',{recursive:true});
 for(const[n,g]of list.entries()){await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).png().toFile('previews/magus/'+name+'-'+n+'.png');const img=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize(280,300,{fit:'inside'}).png().toBuffer();tiles.push({input:img,left:n%4*320+20,top:Math.floor(n/4)*350+35});let svg='<svg width="320" height="350">';svg+='<text x="4" y="24" fill="white" font-size="20">'+n+' '+g.w+'x'+g.h+'</text>';svg+='</svg>';tiles.push({input:Buffer.from(svg),left:n%4*320,top:Math.floor(n/4)*350});}
 await sharp({create:{width:1280,height:1400,channels:4,background:'#24324a'}}).composite(tiles).png().toFile('previews/magus/'+name+'-contact.png');console.log(JSON.stringify(list.map(({pixels,...g})=>g)));
})().catch(e=>{console.error(e);process.exitCode=1;});
