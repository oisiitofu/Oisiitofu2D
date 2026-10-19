// Isolate connected silhouettes using eroded solid cores, then assign all native
// RGBA pixels to their nearest core. Thin touching swords never merge bodies.
module.exports=function(data,w,h,cols,rows,rowCounts=Array(rows).fill(cols)){
 const solid=new Uint8Array(w*h),seen=new Uint8Array(w*h),groups=[];
 for(let y=5;y<h-5;y++)for(let x=5;x<w-5;x++){const p=y*w+x;if(data[p*4+3]<220)continue;let count=0;for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++)count+=data[((y+dy)*w+x+dx)*4+3]>=220;solid[p]=count>=115?1:0;}
 for(let p=0;p<solid.length;p++){if(!solid[p]||seen[p])continue;const ids=[],stack=[p];seen[p]=1;let sx=0,sy=0;while(stack.length){const n=stack.pop(),x=n%w,y=n/w|0;ids.push(n);sx+=x;sy+=y;for(const q of[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(q>=0&&solid[q]&&!seen[q]){seen[q]=1;stack.push(q);}}if(ids.length>50)groups.push({ids,x:sx/ids.length,y:sy/ids.length});}
 const offsets=rowCounts.map((_,row)=>rowCounts.slice(0,row).reduce((a,b)=>a+b,0)),count=rowCounts.reduce((a,b)=>a+b,0),main=Array(count);for(const g of groups){const row=Math.min(rows-1,Math.floor(g.y/h*rows)),n=offsets[row]+Math.min(rowCounts[row]-1,Math.floor(g.x/w*rowCounts[row]));if(!main[n]||g.ids.length>main[n].ids.length)main[n]=g;}
 for(let row=0;row<rows;row++)if(main.slice(offsets[row],offsets[row]+rowCounts[row]).filter(Boolean).length<rowCounts[row]){const candidates=groups.filter(g=>Math.floor(g.y/h*rows)===row).sort((a,b)=>b.ids.length-a.ids.length).slice(0,rowCounts[row]).sort((a,b)=>a.x-b.x);if(candidates.length===rowCounts[row])for(let col=0;col<rowCounts[row];col++)main[offsets[row]+col]=candidates[col];}
 if(main.filter(Boolean).length!==count)throw Error('Missing eroded sprite core '+JSON.stringify(Array.from({length:main.length},(_,n)=>({n,core:main[n]&&[main[n].x,main[n].y,main[n].ids.length]})))+' groups '+JSON.stringify(groups.filter(g=>g.ids.length>500).map(g=>[g.x,g.y,g.ids.length])));
 const owners=new Int16Array(w*h).fill(-1),queue=new Int32Array(w*h);let head=0,tail=0;for(let n=0;n<main.length;n++)for(const p of main[n].ids){owners[p]=n;queue[tail++]=p;}
 // Follow the painted silhouette before assigning detached details. Walking
 // through transparent gutters can steal a raised hand or sword from its body.
 while(head<tail){const n=queue[head++],x=n%w,y=n/w|0;for(const q of[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(q>=0&&data[q*4+3]>=128&&owners[q]<0){owners[q]=owners[n];queue[tail++]=q;}}
 // Distance from an actual connected painted pixel, not from torso centroid.
 // Long detached spear tips belong to their near shaft even across a cell edge.
 const nearestPaint=owners.slice(),paintQueue=new Int32Array(w*h);let ph=0,pt=0;
 for(let p=0;p<owners.length;p++)if(owners[p]>=0&&data[p*4+3]>=128)paintQueue[pt++]=p;else nearestPaint[p]=-1;
 while(ph<pt){const n=paintQueue[ph++],x=n%w,y=n/w|0;for(const q of[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(q>=0&&nearestPaint[q]<0){nearestPaint[q]=nearestPaint[n];paintQueue[pt++]=q;}}
 for(let p=0;p<owners.length;p++)if(data[p*4+3]>=128&&owners[p]<0){const ids=[],stack=[p];owners[p]=-2;let sx=0,sy=0;while(stack.length){const n=stack.pop(),x=n%w,y=n/w|0;ids.push(n);sx+=x;sy+=y;for(const q of[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(q>=0&&data[q*4+3]>=128&&owners[q]===-1){owners[q]=-2;stack.push(q);}}const x=sx/ids.length,y=sy/ids.length;const votes=Array(main.length).fill(0);for(const n of ids)if(nearestPaint[n]>=0)votes[nearestPaint[n]]++;let nearest=votes.indexOf(Math.max(...votes));for(const n of ids)owners[n]=nearest;}
 for(let p=0;p<owners.length;p++)if(data[p*4+3]&&owners[p]<0)owners[p]=nearestPaint[p];
 const boxes=main.map(()=>({x1:w,y1:h,x2:0,y2:0}));for(let p=0;p<owners.length;p++)if(data[p*4+3]){const b=boxes[owners[p]],x=p%w,y=p/w|0;b.x1=Math.min(b.x1,x);b.x2=Math.max(b.x2,x);b.y1=Math.min(b.y1,y);b.y2=Math.max(b.y2,y);}
 return boxes.map((b,n)=>{const width=b.x2-b.x1+7,height=b.y2-b.y1+7,pixels=Buffer.alloc(width*height*4);let footX=0,footN=0;for(let y=b.y1;y<=b.y2;y++)for(let x=b.x1;x<=b.x2;x++){const p=y*w+x;if(owners[p]!==n)continue;if(data[p*4+3]<220){let edge=false;for(let dy=-2;dy<=2&&!edge;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&owners[yy*w+xx]===n&&data[(yy*w+xx)*4+3]>=220)edge=true;}if(!edge)continue;}data.copy(pixels,((y-b.y1+3)*width+x-b.x1+3)*4,p*4,p*4+4);if(y>b.y2-8&&data[p*4+3]>=100){footX+=x-b.x1+3;footN++;}}return{pixels,w:width,h:height,anchor:footN?footX/footN/width:.5};});
};
