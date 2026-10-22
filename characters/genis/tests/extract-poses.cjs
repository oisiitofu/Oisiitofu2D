'use strict';
// Genis's authored full bodies cross the nominal grid gutters. Assign complete
// painted components, rather than cropping a cell (which imports a neighbour's
// feet and clips this pose's hair). Detached kendama balls have explicit owners.
const ballOwners={
 basic:[[992,742,14],[1439,688,11],[687,830,13],[711,357,5],[79,664,8],[1078,663,10],[1049,402,6],[719,608,9],[1218,390,7],[1400,728,15],[1005,203,2],[1389,185,3],[642,187,1],[263,459,4]],
 attacks:[[1322,970,15],[830,83,2],[1483,209,3],[719,88,1],[1489,603,11],[1483,341,7],[1090,444,6],[38,825,12],[415,330,4],[744,618,9],[934,976,14],[170,498,8],[552,260,5],[942,525,10]],
 specials:[[1058,946,14],[701,718,9],[1202,859,15],[682,926,13],[282,940,12],[990,518,10],[232,471,4],[1444,333,7],[1044,270,6]],
 defense:[[1463,756,15],[1017,619,10],[380,934,12],[1017,473,6],[1476,81,3],[48,316,4],[48,597,8],[1492,694,11],[704,55,1],[648,800,13],[658,247,5],[1035,563,10],[1035,839,14]],
 'aerial-fix':[[746,885,2],[1198,594,3],[1179,10,1]]
};
module.exports=function(r,cols,rows,name){
 const {data:p,info:{width:w,height:h}}=r,total=w*h,seen=new Uint8Array(total),groups=[],owners=new Int16Array(total).fill(-1),bodyCounts=Array(cols*rows).fill(0);
 const neighbours=n=>{const x=n%w,y=n/w|0;return[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1];};
 for(let i=0;i<total;i++){
  if(seen[i]||p[i*4+3]<220)continue;
  const ids=[i];seen[i]=1;let sx=0,sy=0,x1=w,y1=h;
  for(let j=0;j<ids.length;j++){const n=ids[j],x=n%w,y=n/w|0;sx+=x;sy+=y;x1=Math.min(x1,x);y1=Math.min(y1,y);for(const a of neighbours(n))if(a>=0&&!seen[a]&&p[a*4+3]>=220){seen[a]=1;ids.push(a);}}
  groups.push({ids,x1,y1,x:sx/ids.length,y:sy/ids.length});
 }
 for(const g of groups)if(g.ids.length>5000){
  // Two unused special poses touch. Their frame slots are replaced below by
  // the dedicated aerial/defense poses, but still isolate their source bodies.
  if(name==='specials'&&g.ids.length>40000){for(const n of g.ids)owners[n]=(n/w|0)<838?11:15;bodyCounts[11]++;bodyCounts[15]++;continue;}
  const n=Math.min(rows-1,Math.floor(g.y/h*rows))*cols+Math.min(cols-1,Math.floor(g.x/w*cols));bodyCounts[n]++;for(const a of g.ids)owners[a]=n;
 }
 if(bodyCounts.some(n=>n!==1))throw Error(name+' missing/duplicate whole body '+JSON.stringify(bodyCounts));
 for(const [x,y,owner]of ballOwners[name]){
  const g=groups.find(g=>Math.abs(g.x1-x)<=1&&Math.abs(g.y1-y)<=1);
  if(!g||g.ids.length<100||g.ids.length>5000)throw Error(name+' missing kendama '+x+','+y);
  for(const a of g.ids)owners[a]=owner;
 }
 // Remaining fine paint, including cords and antialiasing, follows the nearest
 // owned opaque paint. It cannot become a second fragment from another body.
 const nearest=owners.slice(),queue=new Int32Array(total);let head=0,tail=0;
 for(let i=0;i<total;i++)if(nearest[i]>=0)queue[tail++]=i;
 while(head<tail){const n=queue[head++];for(const a of neighbours(n))if(a>=0&&nearest[a]<0){nearest[a]=nearest[n];queue[tail++]=a;}}
 for(const g of groups)if(owners[g.ids[0]]<0){const votes=Array(cols*rows).fill(0);for(const a of g.ids)votes[nearest[a]]++;const owner=votes.indexOf(Math.max(...votes));for(const a of g.ids)owners[a]=owner;}
 const boxes=Array.from({length:cols*rows},()=>({x1:w,y1:h,x2:0,y2:0}));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;if(!p[i*4+3])continue;
  if(owners[i]<0){let best=-1,dist=99;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy,d=dx*dx+dy*dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&p[(yy*w+xx)*4+3]>=220&&d<dist){best=owners[yy*w+xx];dist=d;}}if(best<0)continue;owners[i]=best;}
  const b=boxes[owners[i]];b.x1=Math.min(b.x1,x);b.y1=Math.min(b.y1,y);b.x2=Math.max(b.x2,x);b.y2=Math.max(b.y2,y);
 }
 return boxes.map((b,n)=>{const nw=b.x2-b.x1+7,nh=b.y2-b.y1+7,out=Buffer.alloc(nw*nh*4);for(let y=b.y1;y<=b.y2;y++)for(let x=b.x1;x<=b.x2;x++){const i=y*w+x;if(owners[i]===n)p.copy(out,((y-b.y1+3)*nw+x-b.x1+3)*4,i*4,i*4+4);}return{pixels:out,w:nw,h:nh};});
};
