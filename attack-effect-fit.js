'use strict';
// Fit the VISIBLE native paint to the final world-space strike, after weapon,
// body and coverage tuning. This adapter is active only while melee VFX draw;
// projectile/impact/guard/prop stamps retain their existing placement.
const AttackEffects=(()=>{
 const cache=new WeakMap(),indices=new WeakMap(),origins=new WeakMap();let current=null,last=[];
 function bounds(img){const g=img.getContext?.('2d');if(!g)return{x:0,y:0,w:img.width,h:img.height};const p=g.getImageData(0,0,img.width,img.height).data;let x=img.width,y=img.height,r=-1,b=-1;for(let j=0;j<img.height;j++)for(let i=0;i<img.width;i++)if(p[(j*img.width+i)*4+3]>=48){x=Math.min(x,i);y=Math.min(y,j);r=Math.max(r,i);b=Math.max(b,j);}return r<0?null:{x,y,w:r-x+1,h:b-y+1};}
 function normalized(img,axis){let variants=cache.get(img);if(!variants){variants=new Map();cache.set(img,variants);}const angle=Math.atan2(axis[1],axis[0]),key=Math.round(angle*1000);if(variants.has(key))return variants.get(key);
  let source=img;if(Math.abs(angle)>.001){const mirror=Math.abs(Math.abs(angle)-Math.PI)<.001,size=mirror?{w:img.width,h:img.height}:{w:Math.ceil(Math.abs(Math.cos(angle))*img.width+Math.abs(Math.sin(angle))*img.height),h:Math.ceil(Math.abs(Math.sin(angle))*img.width+Math.abs(Math.cos(angle))*img.height)},c=document.createElement('canvas');c.width=size.w;c.height=size.h;const g=c.getContext('2d');g.translate(c.width/2,c.height/2);if(mirror)g.scale(-1,1);else g.rotate(-angle);g.drawImage(img,-img.width/2,-img.height/2);source=c;}
  const result={img:source,bounds:bounds(source)};if(source!==img)origins.set(source,{source:img,axis});variants.set(key,result);if(variants.size>8)variants.delete(variants.keys().next().value);return result;
 }
 function eligible(f){return !!f.attack&&!f.respawn&&!f.attack.hold&&f.attack.type!=='grab'&&f.attack.type!=='pummel'&&!f.attack.type.endsWith('Throw');}
 function plan(f){if(!eligible(f))return null;let all=attackBoxes(f),trail=0;if(!all.length){const w=f.attack.activeFrames.filter(w=>w.end<f.timer).at(-1),age=w?f.timer-w.end:0;if(age>0&&age<=7){all=attackBoxes(f,f.attack,w.end);trail=.55*(1-age/8)**2;}}const outer=all.filter(b=>!b.meleeInner&&MeleeBalance.coverageApplies(f.attack,b));if(!outer.length)return null;const boxes=outer.flatMap(b=>SlashVFX.outward(f,b));return{f,boxes,trail,overhead:all.filter(b=>b.upAttackExtra),matrix:ctx.getTransform(),seen:new Set(),sample:null,paints:[]};}
 function axisFor(id,n,m,w,h,img,b){const known=AttackEffectData.axes[id]?.[n];if(known)return known;const dx=b.x2-b.x1,dy=b.y2-b.y1,det=m.a*m.d-m.b*m.c;
  if(Math.abs(det)<1e-8)return[1,0];const x=(m.d*dx-m.c*dy)/det/(w/img.width),y=(-m.b*dx+m.a*dy)/det/(h/img.height),len=Math.hypot(x,y);return len>.01?[x/len,y/len]:[1,0];}
 function paint(c,b,source,n,axis,alpha=1,overhead=false){const canonical=normalized(source,axis),ink=canonical.bounds;if(!ink)return;const dx=b.x2-b.x1,dy=b.y2-b.y1,len=Math.hypot(dx,dy),angle=overhead?-Math.PI/2:Math.atan2(dy,dx),face=Math.cos(angle)<-1e-6?-1:1,rot=Math.atan2(Math.sin(angle),Math.cos(angle)*face),width=overhead?2*b.radius:len+2*b.radius,height=overhead?len+2*b.radius:2*b.radius;
  const sx=width/ink.w,sy=height/ink.h,cx=(b.x1+b.x2)/2,cy=(b.y1+b.y2)/2;
  ctx.save();ctx.setTransform(c.matrix);ctx.translate(cx,cy);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha=alpha;
  ctx.drawImage(canonical.img,-width/2-ink.x*sx,-height/2-ink.y*sy,canonical.img.width*sx,canonical.img.height*sy);ctx.restore();
  c.paints.push({n,box:b,overhead,x:cx,y:cy,width,height,angle,alpha,source,axis,canonical:canonical.img});return true;
 }
 function image(img,...args){const c=current;if(!c||args.length!==4||ctx.globalAlpha<.32&&!c.trail){ctx.drawImage(img,...args);return;}
  let n=indices.get(img);if(n===undefined){n=characterArt[c.f.characterId]?.effects.indexOf(img)??-1;indices.set(img,n);}if(n<0){ctx.drawImage(img,...args);return;}
  const id=c.f.characterId,type=c.f.attack.type,selected=AttackEffectData.types[id]?.[type];if(n!==selected&&!AttackEffectData.axes[id]?.[n]){ctx.drawImage(img,...args);return;}
  const[x,y,w,h]=args,m=ctx.getTransform(),relative=c.matrix.inverse().multiply(m),cx=relative.a*(x+w/2)+relative.c*(y+h/2)+relative.e,cy=relative.b*(x+w/2)+relative.d*(y+h/2)+relative.f;
  const ranked=c.boxes.map((b,index)=>({b,index,dist:Math.hypot(cx-(b.x1+b.x2)/2,cy-(b.y1+b.y2)/2)})).sort((a,b)=>a.dist-b.dist),closest=ranked[0];if(!closest||closest.dist>Math.max(100,Math.hypot(closest.b.x2-closest.b.x1,closest.b.y2-closest.b.y1)*.6)){ctx.drawImage(img,...args);return;}
  const axis=axisFor(id,n,relative,w,h,img,closest.b),alpha=ctx.globalAlpha;if(!c.seen.has(closest.index)&&paint(c,closest.b,img,n,axis,alpha)){c.sample??={img,n,axis,alpha};c.seen.add(closest.index);}
 }
 function fallback(c){const id=c.f.characterId,art=characterArt[id],choices=new Set([AttackEffectData.types[id]?.[c.f.attack.type],AttackEffectData.fallback[id],...Object.keys(AttackEffectData.axes[id]||{}).map(Number),0]);for(const n of choices){const img=art?.effects[n],axis=AttackEffectData.axes[id]?.[n]||[1,0];if(img&&normalized(img,axis).bounds)return{img,n,axis,alpha:.85*(c.trail||1)};}return null;}
 function procedural(c,b,overhead=false){const f=c.f,earth=f.characterId==='isaac',col=earth?['#eab64e','#fff5c9']:['#279dff','#d5f8ff'],dx=b.x2-b.x1,dy=b.y2-b.y1,len=Math.hypot(dx,dy),angle=overhead?-Math.PI/2:Math.atan2(dy,dx),width=overhead?2*b.radius:len+2*b.radius,height=overhead?len+2*b.radius:2*b.radius;
  ctx.save();ctx.setTransform(c.matrix);ctx.globalAlpha*=c.trail||1;ctx.translate((b.x1+b.x2)/2,(b.y1+b.y2)/2);ctx.rotate(angle);const r=height/2,gradient=ctx.createLinearGradient(-width*.5,0,width*.5,0);gradient.addColorStop(0,earth?'#84542c00':'#155bff00');gradient.addColorStop(.5,earth?'#d48a39aa':'#279dffaa');gradient.addColorStop(1,col[1]);ctx.shadowColor=col[0];ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(-width*.4,-r);ctx.quadraticCurveTo(width*.5,-r,width*.5,0);ctx.quadraticCurveTo(width*.5,r,-width*.4,r);ctx.quadraticCurveTo(width*.2,r*.32,width*.31,0);ctx.quadraticCurveTo(width*.2,-r*.32,-width*.4,-r);ctx.fillStyle=gradient;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=col[1];ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-width*.4,-r);ctx.quadraticCurveTo(width*.5,-r,width*.5,0);ctx.quadraticCurveTo(width*.5,r,-width*.4,r);ctx.stroke();
  for(let i=0;i<7;i++){const x=width*(.34-i*.11),y=(i%2?1:-1)*r*(.25+i*.07);ctx.strokeStyle=col[i%2];ctx.lineWidth=earth?3:1.3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-width*.06,y+r*.13);ctx.lineTo(x-width*.10,y-r*.07);ctx.stroke();}ctx.restore();c.paints.push({n:null,box:b,overhead,width,height,angle,alpha:c.trail||1,procedural:true});
 }
 function draw(f,legacy){const c=plan(f);if(!c){last=[];legacy();return;}const previous=current;current=c;try{
   // These two renderers are procedural and ignore the calibrated strike
   // segments. Draw their earth/energy ribbons from those segments directly.
   if(!['dragoon','isaac'].includes(f.characterId)||f.attack.special)legacy();
   const sample=c.sample||fallback(c);for(let n=0;n<c.boxes.length;n++)if(!c.seen.has(n)){if(sample)paint(c,c.boxes[n],sample.img,sample.n,sample.axis,sample.alpha);else procedural(c,c.boxes[n]);}
   for(const b of c.overhead){if(sample)paint(c,b,sample.img,sample.n,sample.axis,c.trail?sample.alpha:Math.max(.7,sample.alpha),true);else procedural(c,b,true);}
  }finally{current=previous;last=c.paints;}
 }
 return{image,draw,bounds,normalized,plan,sourceFor:img=>origins.get(img),get diagnostics(){return last;}};
})();
