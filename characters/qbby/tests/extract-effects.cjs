'use strict';
// Own complete FX components before cropping: the tall barrier and broad
// double seal cross nominal grid gutters, so a rectangular grid cuts them.
module.exports=({data:p,info:{width:w,height:h}})=>{
 const centers=Array.from({length:16},(_,n)=>[(n%4+.5)*w/4,(Math.floor(n/4)+.5)*h/4]),seen=new Uint8Array(w*h),owner=new Int16Array(w*h).fill(-1),groups=[];
 const adj=n=>{const x=n%w,y=n/w|0;return[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1];};
 for(let n=0;n<w*h;n++){if(seen[n]||p[n*4+3]<180)continue;const ids=[n];seen[n]=1;let sx=0,sy=0;for(let j=0;j<ids.length;j++){const i=ids[j];sx+=i%w;sy+=i/w|0;for(const v of adj(i))if(v>=0&&!seen[v]&&p[v*4+3]>=180){seen[v]=1;ids.push(v);}}const x=sx/ids.length,y=sy/ids.length,ds=centers.map(c=>(x-c[0])**2+(y-c[1])**2),o=ds.indexOf(Math.min(...ds));groups.push({ids,o});for(const i of ids)owner[i]=o;}
 // Only preserve low-alpha edge paint near a solid FX component. This
 // removes transparent RGB mattes and isolated neighboring glints.
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(owner[i]>=0||!p[i*4+3])continue;let best=-1,d=10;for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const nx=x+xx,ny=y+yy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const v=ny*w+nx,dist=xx*xx+yy*yy;if(p[v*4+3]>=180&&dist<d){best=owner[v];d=dist;}}if(best>=0)owner[i]=best;}
 return centers.map((c,n)=>{const ids=[];for(let i=0;i<w*h;i++)if(owner[i]===n)ids.push(i);if(!ids.length&&n===5)return{pixels:Buffer.alloc(4),w:1,h:1};if(!ids.length)throw Error('missing FX '+n);let x1=w,y1=h,x2=0,y2=0;for(const i of ids){x1=Math.min(x1,i%w);x2=Math.max(x2,i%w);y1=Math.min(y1,i/w|0);y2=Math.max(y2,i/w|0);}const nw=x2-x1+7,nh=y2-y1+7,out=Buffer.alloc(nw*nh*4);for(const i of ids)p.copy(out,(((i/w|0)-y1+3)*nw+i%w-x1+3)*4,i*4,i*4+4);return{pixels:out,w:nw,h:nh};});
};
