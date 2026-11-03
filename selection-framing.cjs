'use strict';
// Authoring/build-time geometry. This never runs during a game or alters source pixels.
function project(crop,guide,{aspect=1.4930875576036866,fit='cover',position=[.5,.2]}={}){
 const[x,y,w,h]=crop,fw=1,fh=1/aspect,k=(fit==='contain'?Math.min:Math.max)(fw/w,fh/h),ox=(fw-w*k)*position[0],oy=(fh-h*k)*position[1];
 return{x:(guide.eye[0]-x)*k+ox,eye:((guide.eye[1]-y)*k+oy)/fh,span:guide.span*k,top:((guide.top-y)*k+oy)/fh};
}
function align(crop,guide,policy){
 if(guide.crop)return{crop:guide.crop.slice(),reasons:['元絵の横位置を固定したズーム']};
 const [sourceWidth,sourceHeight]=guide.sourceSize;
 const [,oldTop,oldWidth,oldHeight]=crop;
 const target=policy.targets[guide.profile];
 const span=guide.span/oldWidth;
 let width=oldWidth;
 if(guide.zoomFactor)width*=guide.zoomFactor;
 else if(target&&!guide.locked&&!guide.regenerated&&(span<target.span*.87||span>target.maxSpan)){
  width=Math.max(oldWidth*.82,guide.span/target.span);
 }
 if(guide.faceBounds){
  const [left,top,right,bottom]=guide.faceBounds;
  const protectedWidth=2*Math.max(sourceWidth/2-left,right-sourceWidth/2)/.98;
  width=Math.max(width,protectedWidth,(bottom-top)*policy.canonicalAspect*1.035);
 }
 width=Math.min(sourceWidth,Math.round(width));
 const height=Math.min(sourceHeight,Math.round(width/1.4));
 let y=oldTop+(oldHeight-height)*.45;
 if(guide.faceBounds){
  const visibleHeight=Math.min(height,width/policy.canonicalAspect);
  const overflow=(height-visibleHeight)*.2;
  const [,top,,bottom]=guide.faceBounds;
  y=Math.max(bottom-visibleHeight-overflow,Math.min(top-overflow,y));
 }
 const x=Math.round((sourceWidth-width)/2);
 return{crop:[x,Math.round(Math.max(0,Math.min(sourceHeight-height,y))),width,height],reasons:['元絵の横位置を固定したズーム']};
}
module.exports={project,align};
