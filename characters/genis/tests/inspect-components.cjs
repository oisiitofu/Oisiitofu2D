'use strict';
const sharp=require('sharp'),fs=require('fs');
async function components(name){
 const {data,info}=await sharp(`characters/genis/assets/genis-${name}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{width:w,height:h}=info;
 const seen=new Uint8Array(w*h),groups=[];
 for(let p=0;p<w*h;p++){
  if(seen[p]||data[p*4+3]<220)continue;
  const q=[p];seen[p]=1;let x1=w,y1=h,x2=0,y2=0;
  for(let j=0;j<q.length;j++){const n=q[j],x=n%w,y=n/w|0;x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);for(const a of[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(a>=0&&!seen[a]&&data[a*4+3]>=220){seen[a]=1;q.push(a);}}
  if(q.length>100)groups.push({count:q.length,box:[x1,y1,x2,y2]});
 }
 groups.sort((a,b)=>b.count-a.count);return{name,w,h,groups};
}
(async()=>{const all=await Promise.all(['basic','attacks','specials','defense','aerial-fix'].map(components));fs.writeFileSync('characters/genis/previews/components.json',JSON.stringify(all,null,2));for(const v of all)console.log(JSON.stringify(v));})();
