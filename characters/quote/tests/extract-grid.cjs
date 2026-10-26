'use strict';
// Crop complete cells, including deliberately detached hands/feet. Never rig.
module.exports=({data:p,info:{width:w,height:h}},cols,rows,name)=>Array.from({length:cols*rows},(_,cell)=>{
 const x0=Math.round(cell%cols*w/cols),x9=Math.round((cell%cols+1)*w/cols),y0=Math.round(Math.floor(cell/cols)*h/rows),y9=Math.round((Math.floor(cell/cols)+1)*h/rows);let x1=x9,y1=y9,x2=x0,y2=y0;
 for(let y=y0;y<y9;y++)for(let x=x0;x<x9;x++)if(p[(y*w+x)*4+3]>=180){x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);}
 if(x2<x1||y2<y1)throw Error(name+' missing pose '+cell);x1=Math.max(x0,x1-2);y1=Math.max(y0,y1-2);x2=Math.min(x9-1,x2+2);y2=Math.min(y9-1,y2+2);const nw=x2-x1+7,nh=y2-y1+7,out=Buffer.alloc(nw*nh*4);
 for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++){const n=(y*w+x)*4;p.copy(out,((y-y1+3)*nw+x-x1+3)*4,n,n+4);}
 return{pixels:out,w:nw,h:nh,cell};
});
