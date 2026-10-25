'use strict';
// Find the two enclosed eyes, then the white face containing them. Weapon boxes
// have no eyes and cannot move the body anchor toward the end of a long chain.
module.exports=function(g){const {w,h,pixels:p}=g,seen=new Uint8Array(w*h),groups=[];
 const black=n=>p[n*4+3]>180&&Math.max(p[n*4],p[n*4+1],p[n*4+2])<80;
 for(let n=0;n<w*h;n++){if(seen[n]||!black(n))continue;const q=[n];seen[n]=1;let x1=w,x2=0,y1=h,y2=0;for(let j=0;j<q.length;j++){const k=q[j],x=k%w,y=k/w|0;x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);for(const z of[x>0?k-1:-1,x<w-1?k+1:-1,y>0?k-w:-1,y<h-1?k+w:-1])if(z>=0&&!seen[z]&&black(z)){seen[z]=1;q.push(z);}}const bw=x2-x1+1,bh=y2-y1+1;if(q.length>12&&q.length<1200&&bh>bw*1.1&&bw<45&&bh<65&&q.length>bw*bh*.35)groups.push({x:(x1+x2)/2,y:(y1+y2)/2,w:bw,h:bh,area:q.length,x1,y1});}
 let best=null;for(const a of groups)for(const b of groups){if(b.x<=a.x||Math.abs(a.y-b.y)>Math.max(a.h,b.h)*.6||b.x-a.x<8||b.x-a.x>Math.max(a.h,b.h)*6||Math.max(a.area,b.area)/Math.min(a.area,b.area)>2)continue;const score=a.area+b.area-Math.abs(a.y-b.y)*10;if(!best||score>best.score)best={a,b,score};}if(!best)return null;
 const {a,b}=best,white=n=>p[n*4+3]>180&&Math.min(p[n*4],p[n*4+1],p[n*4+2])>180,start=(Math.round((a.y+b.y)/2)*w+Math.round((a.x+b.x)/2));if(!white(start))return null;
 const q=[start],used=new Uint8Array(w*h);used[start]=1;let x1=w,x2=0,y1=h,y2=0;for(let j=0;j<q.length;j++){const k=q[j],x=k%w,y=k/w|0;x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);for(const z of[x>0?k-1:-1,x<w-1?k+1:-1,y>0?k-w:-1,y<h-1?k+w:-1])if(z>=0&&!used[z]&&white(z)){used[z]=1;q.push(z);}}
 if(x2-x1<25||y2-y1<20)return null;return{x:(x1+x2)/2,width:x2-x1+1,top:y1,bottom:y2+1,eyeHeight:(a.h+b.h)/2,eyesY:(a.y+b.y)/2};
};
