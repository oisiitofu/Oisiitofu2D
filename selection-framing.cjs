'use strict';
// Authoring/build-time geometry. This never runs during a game or alters source pixels.
function project(crop,guide,{aspect=1.4930875576036866,fit='cover',position=[.5,.2]}={}){
 const[x,y,w,h]=crop,fw=1,fh=1/aspect,k=(fit==='contain'?Math.min:Math.max)(fw/w,fh/h),ox=(fw-w*k)*position[0],oy=(fh-h*k)*position[1];
 return{x:(guide.eye[0]-x)*k+ox,eye:((guide.eye[1]-y)*k+oy)/fh,span:guide.span*k,top:((guide.top-y)*k+oy)/fh};
}
function align(crop,guide,policy){
 if(guide.crop)return{crop:guide.crop.slice(),reasons:['顔の寄り・輪郭を含む目視調整']};
 if(!Number.isFinite(guide.faceCenterX))throw Error('Review the whole-face center before proposing a crop');
 const target=policy.targets[guide.profile];if(!target||guide.locked)return{crop:crop.slice(),reasons:[]};
 if(guide.regenerated){
  const current=project(crop,guide),span=Math.max(current.span,target.span),w=Math.round(guide.span/span),h=Math.round(w/1.5);
  const x=Math.round(guide.faceCenterX-w*.5)||0;let y=guide.eye[1]-target.eye*h;
  if(guide.sourceSize)y=Math.min(y,guide.sourceSize[1]-h);
  return{crop:[x,Math.round(y)||0,w,h],reasons:['承認済みの絵柄・大きい顔を保って目線を調整']};
 }
 const view={aspect:policy.canonicalAspect},current=project(crop,{...guide,eye:[guide.faceCenterX,guide.eye[1]]},view),human=['human','chibi','pixel'].includes(guide.profile),reasons=[];
 if(Math.abs(current.x-.5)>(human?.08:.10))reasons.push('横位置');
 const small=current.span<(human?target.span*.86:target.minSpan),large=current.span>target.maxSpan+.005;
 if(small||large)reasons.push('顔の大きさ');
 const badEye=current.eye<target.minEye||current.eye>target.maxEye||Math.abs(current.eye-target.eye)>(guide.profile==='tall'?.14:.13);
 if(badEye)reasons.push('目線');if(!reasons.length)return{crop:crop.slice(),reasons};
 // Preserve the visible face size when converting a square or very wide crop
 // into the shared landscape frame. Its old height is not its visible width.
 const baseHeight=guide.span/current.span/1.4;
 let h=small||large?guide.span/target.span/1.4:baseHeight;h=Math.max(baseHeight*.45,Math.min(baseHeight*1.25,h));
 // Hair tips/accessories may cross the card edge. Do not zoom out merely to
 // enclose their complete silhouette; the face scale is the priority.
 const ratio=policy.canonicalAspect/1.4,eyeNative=(target.eye+(ratio-1)*.2)/ratio;
 if(!large)h=Math.min(h,baseHeight*1.03);
 const w=Math.round(h*1.4);h=Math.round(h);let y=badEye||small||large?guide.eye[1]-eyeNative*h:crop[1];
 if(guide.sourceSize)y=Math.min(y,guide.sourceSize[1]-h);
 const x=Math.round(guide.faceCenterX-w*.5)||0,next=[x,Math.round(y)||0,w,h];return{crop:next,reasons};
}
module.exports={project,align};
