'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
// Filter once at build time. Native selection portraits and combat pixels stay intact.
async function bakeThumbnails(root,id,entry){
 const originals=entry.selectionPortraits||entry.portraits;
 const meta=await sharp(path.join(root,originals[0])).metadata();
 const widths=[...new Set([140,280,560].map(w=>Math.min(w,meta.width)))].sort((a,b)=>a-b);
 const levels=[];
 for(const width of widths){
  const urls=await Promise.all(originals.map(async(url,color)=>{
   const bytes=await sharp(path.join(root,url)).resize({width,kernel:sharp.kernel.lanczos3,withoutEnlargement:true}).webp({lossless:true,effort:4}).toBuffer();
   const hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16),file=`${id}-selection-thumb-${width}-${color}-${hash}.webp`;
   fs.writeFileSync(path.join(root,'assets/ready',file),bytes);return 'assets/ready/'+file;
  }));
  const size=await sharp(path.join(root,urls[0])).metadata();levels.push({width:size.width,height:size.height,urls});
 }
 return levels;
}
module.exports={bakeThumbnails};
