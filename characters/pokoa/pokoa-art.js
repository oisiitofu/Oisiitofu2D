'use strict';
// The user-supplied sheet is retained unchanged. Production-only extraction is
// baked by build-art; the selection screen uses the packed ready images.
function extractPokoaForms(sheet){
 const ditto={rect:[578,101,53,46]},lapras={rect:[505,608,78,65],outline:[[0,35],[7,28],[15,23],[20,27],[24,20],[27,5],[33,3],[36,9],[42,3],[48,5],[49,14],[52,18],[57,20],[58,25],[55,30],[47,32],[45,39],[51,29],[61,29],[69,34],[76,46],[75,52],[65,57],[45,58],[25,64],[0,65]]},dragon={rect:[817,608,96,72],component:true},hammer={rect:[999,52,39,52],outline:[[9,0],[38,10],[33,27],[23,21],[9,51],[0,49],[12,16],[5,14]]},planter={rect:[1048,50,34,59]};
 return [ditto,ditto,lapras,lapras,dragon,dragon,hammer,planter].map(spec=>{
  const [sx,sy,w,h]=spec.rect,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});
  if(spec.outline){g.beginPath();spec.outline.forEach(([x,y],n)=>n?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.clip();}g.drawImage(sheet,sx,sy,w,h,0,0,w,h);
  const image=g.getImageData(0,0,w,h),d=image.data,seen=new Uint8Array(w*h),queue=[];
  // Edge-connected paper only; keep white/cream interiors inside dark outlines.
  const visit=p=>{if(p<0||p>=w*h||seen[p])return;seen[p]=1;const j=p*4,r=d[j],green=d[j+1],b=d[j+2];if(!d[j+3]||Math.min(r,green,b)>(spec.component?185:205)&&Math.max(r,green,b)-Math.min(r,green,b)<(spec.component?70:35)){queue.push(p);d[j+3]=0;}};
  for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x);}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1);}for(let n=0;n<queue.length;n++){const p=queue[n],x=p%w,y=Math.floor(p/w);if(x)visit(p-1);if(x<w-1)visit(p+1);if(y)visit(p-w);if(y<h-1)visit(p+w);}
  if(spec.component){const visited=new Uint8Array(w*h),parts=[];for(let k=0;k<w*h;k++){if(visited[k]||d[k*4+3]<30)continue;const stack=[k],ids=[];visited[k]=1;while(stack.length){const p=stack.pop(),x=p%w,y=Math.floor(p/w);ids.push(p);for(const n of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(n>=0&&!visited[n]&&d[n*4+3]>=30){visited[n]=1;stack.push(n);}}parts.push(ids);}parts.sort((a,b)=>b.length-a.length);const keep=new Set(parts[0]||[]);for(let k=0;k<w*h;k++)if(!keep.has(k))d[k*4+3]=0;}
  g.putImageData(image,0,0);const out=document.createElement('canvas');out.width=w+4;out.height=h+4;out.getContext('2d').drawImage(c,2,2);return out;
 });
}
