'use strict';
const SlashVFX=(()=>{
 // Audited against the baked, transparent source textures. +X is the leading
 // convex edge, with the open side / trailing tips behind it. Rings have no nose.
 const sources={lightning:{0:'left'},nier:{0:'left'},colette:{0:'left'},
  luke:{0:'left'},will:{0:'left'},kosmos:{0:'left'},emma:{0:'left'},
  akira:{1:'left'},goemon:{1:'left'},rin:{0:'down',1:'left'},narukami:{0:'left'},ulgrim:{4:'left'},
  kisuke:{0:'left',1:'left'},odio:{0:'left'},shizuna:{0:'left'},
  wargreymon:{4:'left'},omegamon:{0:'left'},karateka:{6:'left'}};
 function image(id,n,img,x,y,w,h){
  const source=sources[id]?.[n];if(!source){AttackEffects.image(img,x,y,w,h);return;}
  // Normalize the source around the destination center, keeping anchors intact.
  // This is inside the caller's translate -> world-facing mirror -> local turn.
  ctx.save();ctx.translate(x+w/2,y+h/2);
  if(source==='left'){ctx.scale(-1,1);AttackEffects.image(img,-w/2,-h/2,w,h);}
  else{ctx.rotate(-Math.PI/2);AttackEffects.image(img,-h/2,-w/2,h,w);}
  ctx.restore();
 }
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;
  return{face,rot:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,len:Math.hypot(dx,dy)};}
 // A two-sided sweep has two outward edges, not one fixed world-right nose.
 // Split only its visual segment; collision, timing and damage stay untouched.
 function outward(f,b){
  if(b.window?.shape!=='spin'||(b.x1-f.x)*(b.x2-f.x)>=0)return[b];
  const t=(f.x-b.x1)/(b.x2-b.x1),y=b.y1+(b.y2-b.y1)*t;
  return[{...b,x1:f.x,y1:y},{...b,x1:f.x,y1:y,x2:b.x1,y2:b.y1}];
 }
 function melee(f,w,n,alpha=1){
  const img=characterArt[f.characterId]?.effects[n];if(!img)return;
  const t=Math.min(f.timer,w.end),boxes=attackVisualBoxes(f,f.attack,t);
  for(const b of boxes){const d=direction(b),width=d.len+24,height=Math.max(42,Math.min(110,d.len*.6+b.radius*2));
   ctx.save();ctx.translate(d.x,d.y);ctx.scale(d.face,1);ctx.rotate(d.rot);
   ctx.globalAlpha*=alpha;
   image(f.characterId,n,img,-width/2,-height/2,width,height);ctx.restore();
  }
 }
 return{sources,image,direction,outward,melee};
})();
