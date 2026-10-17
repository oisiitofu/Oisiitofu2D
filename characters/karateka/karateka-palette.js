'use strict';
// Closed black outlines separate the white face, hands, feet and gi panels.
// Recolor only sizable cloth panels, keeping the largest white face and the
// black outlines unchanged in every costume, including the portrait.
function karatekaPaletteMask(d,w,h){const seen=new Uint8Array(w*h),groups=[],white=n=>d[n*4+3]>100&&Math.min(d[n*4],d[n*4+1],d[n*4+2])>190;for(let p=0;p<w*h;p++){if(seen[p]||!white(p))continue;const q=[p];seen[p]=1;for(let k=0;k<q.length;k++){const n=q[k],x=n%w,y=n/w|0;for(const t of[x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(t>=0&&!seen[t]&&white(t)){seen[t]=1;q.push(t);}}groups.push(q);}const largest=Math.max(0,...groups.map(g=>g.length)),mask=new Uint8Array(w*h);let faceSkipped=false;for(const g of groups){if(g.length===largest&&!faceSkipped){faceSkipped=true;continue;}if(g.length<largest*.3)continue;for(const n of g)mask[n]=1;}return mask;}
