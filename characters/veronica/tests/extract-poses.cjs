'use strict';
// Assign complete body components across grid gutters. Preserve staff tips,
// braids and antialiasing without importing adjacent figures.
module.exports=function(r,cols,rows,name){
 const rowCounts=Array.isArray(rows)?rows:Array(rows).fill(cols);rows=rowCounts.length;const cells=rowCounts.reduce((a,b)=>a+b,0),cellAt=(x,y)=>{const row=Math.min(rows-1,Math.floor(y/h*rows));return rowCounts.slice(0,row).reduce((a,b)=>a+b,0)+Math.min(rowCounts[row]-1,Math.floor(x/w*rowCounts[row]));};const {data:p,info:{width:w,height:h}}=r,total=w*h,seen=new Uint8Array(total),groups=[],owners=new Int16Array(total).fill(-1),bodyCounts=Array(cells).fill(0);
 const neighbours=n=>{const x=n%w,y=n/w|0;return[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1];};
 for(let i=0;i<total;i++){
  if(seen[i]||p[i*4+3]<220)continue;
  const ids=[i];seen[i]=1;let sx=0,sy=0,x1=w,y1=h;
  for(let j=0;j<ids.length;j++){const n=ids[j],x=n%w,y=n/w|0;sx+=x;sy+=y;x1=Math.min(x1,x);y1=Math.min(y1,y);for(const a of neighbours(n))if(a>=0&&!seen[a]&&p[a*4+3]>=220){seen[a]=1;ids.push(a);}}
  groups.push({ids,x1,y1,x:sx/ids.length,y:sy/ids.length});
 }
 const main=new Map();for(const g of groups)if(g.ids.length>5000){const n=cellAt(g.x,g.y);if(!main.has(n)||main.get(n).ids.length<g.ids.length)main.set(n,g);}
 for(const g of main.values()){
  const n=cellAt(g.x,g.y);bodyCounts[n]++;for(const a of g.ids)owners[a]=n;
 }
 if(bodyCounts.some(n=>n>1))throw Error(name+' missing/duplicate whole body '+JSON.stringify(bodyCounts));

 // Remaining fine paint, including cords and antialiasing, follows the nearest
 // owned opaque paint. It cannot become a second fragment from another body.
 const distance=new Uint16Array(total),nearest=owners.slice(),queue=new Int32Array(total);let head=0,tail=0;
 for(let i=0;i<total;i++)if(nearest[i]>=0)queue[tail++]=i;
 while(head<tail){const n=queue[head++];for(const a of neighbours(n))if(a>=0&&nearest[a]<0){nearest[a]=nearest[n];distance[a]=distance[n]+1;queue[tail++]=a;}}
 for(const g of groups)if(owners[g.ids[0]]<0){if(g.ids.every(i=>distance[i]>6))continue;const votes=Array(cells).fill(0);for(const a of g.ids)votes[nearest[a]]++;const owner=votes.indexOf(Math.max(...votes));for(const a of g.ids)owners[a]=owner;}
 const boxes=Array.from({length:cells},()=>({x1:w,y1:h,x2:0,y2:0}));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;if(!p[i*4+3])continue;
  if(owners[i]<0){let best=-1,dist=99;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy,d=dx*dx+dy*dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&p[(yy*w+xx)*4+3]>=220&&d<dist){best=owners[yy*w+xx];dist=d;}}if(best<0)continue;owners[i]=best;}
  const b=boxes[owners[i]];b.x1=Math.min(b.x1,x);b.y1=Math.min(b.y1,y);b.x2=Math.max(b.x2,x);b.y2=Math.max(b.y2,y);
 }
 return boxes.map((b,n)=>{if(!bodyCounts[n])return null;const nw=b.x2-b.x1+7,nh=b.y2-b.y1+7,out=Buffer.alloc(nw*nh*4);for(let y=b.y1;y<=b.y2;y++)for(let x=b.x1;x<=b.x2;x++){const i=y*w+x;if(owners[i]===n)p.copy(out,((y-b.y1+3)*nw+x-b.x1+3)*4,i*4,i*4+4);}return{pixels:out,w:nw,h:nh,cell:n};}).filter(Boolean);
};
