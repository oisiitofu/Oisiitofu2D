'use strict';
const LidArtRects={"frames":[[0,0,181,181],[181,0,181,181],[362,0,181,181],[543,0,181,181],[724,0,181,181],[905,0,181,181],[1086,0,181,181],[1267,0,181,181],[0,181,181,181],[181,181,181,181],[362,181,181,181],[543,181,181,181],[724,181,181,181],[905,181,181,181],[1086,181,181,181],[1267,181,181,181],[0,362,181,181],[181,362,181,181],[362,362,181,181],[543,362,181,181],[724,362,181,181],[905,362,181,181],[1086,362,181,181],[1267,362,181,181],[0,543,181,181],[181,543,181,181],[362,543,181,181],[543,543,181,181],[724,543,181,181],[905,543,181,181],[1086,543,181,181],[1267,543,181,181],[0,724,181,181],[181,724,181,181],[362,724,181,181],[543,724,181,181],[724,724,181,181],[905,724,181,181],[1086,724,181,181],[1267,724,181,181],[0,905,181,181],[181,905,181,181],[362,905,181,181],[543,905,181,181],[724,905,181,181],[905,905,181,181],[1086,905,181,181],[1267,905,181,181]],"anchors":[0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55],"grip":[0,0.97]};
NewcomerArtAnchors.lid=LidArtRects.anchors;
async function loadLidArt(){
 if(ArtLoader.enabled&&await ArtLoader.load('lid'))return;
 const sheet=new Image(),fx=new Image();sheet.src='characters/lid/assets/lid-native.png';fx.src='characters/lid/assets/lid-effects.webp';await Promise.all([sheet.decode(),fx.decode()]);
 const crop=(image,[x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(image,x,y,w,h,0,0,w,h);return c;};
 const frames=LidArtRects.frames.map(r=>crop(sheet,r)),effects=Array.from({length:8},(_,n)=>crop(fx,[(n%4)*fx.width/4,Math.floor(n/4)*fx.height/2,fx.width/4,fx.height/2]));
 characterArt.lid={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'lid',ci)))};
}
function lidNativeScale(n){return 94/(LidArtRects.frames[0][3]*FIGHTER_SCALE);}
