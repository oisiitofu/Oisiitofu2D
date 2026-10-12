'use strict';
const TifaVFX=(()=>{
 // FX0 impact is radial; FX1 punch trail and FX2 kick crescent point RIGHT.
 // FX2 has its convex edge RIGHT, opening LEFT. Translate, reflect facing,
 // then rotate the local RIGHT axis onto the measured strike segment.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.tifa?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1,rot=Math.atan2(Math.sin(angle),Math.cos(angle)*face);stamp(n,x,y,w,h,face,alpha,rot);}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.tifaKiTime>0)stamp(3,f.x,f.y-43,116,127,1,.27);if(a?.tifaKi&&f.timer>8)stamp(3,f.x,f.y-40,130,145,1,Math.min(.65,f.timer/50));if(!a)return;
  for(const v of segments(f)){const dx=v.to.x-v.from.x,dy=v.to.y-v.from.y,len=Math.hypot(dx,dy);
   // Trail ends at the actual fist/boot. Hit flashes belong to impact(), not
   // every active frame of a whiff. Reflection precedes local rotation.
   directed(v.pose===42?1:2,(v.from.x+v.to.x)/2,(v.from.y+v.to.y)/2,len+10,v.pose===42?16:24,Math.atan2(dy,dx),v.alpha);
  }
 }
 function segments(f){const a=f.attack;if(!a||a.type==='grab'||a.tifaKi)return[];
  const active=CombatData.activeWindow(a,f.timer);if(!active)return[];
  const raster=TifaRasterAnimation.strike(f);if(!raster)return[];
  const age=f.timer-active.start,span=active.end-active.start+1;
  return[{...raster,alpha:.70*(1-.4*age/Math.max(1,span-1))}];
 }
 function drawObjects(){}
 function impact(v){stamp(v.power>14?4:0,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='tifa')return;text(f.tifaKiTime>0?'気合 '+Math.ceil(f.tifaKiTime/60)+'s':f.tifaKiCooldown>0?'気合 再使用 '+Math.ceil(f.tifaKiCooldown/60)+'s':'↓B 気合',x+52,y+54,9,'#9bdaff','left');if(f.attack?.tifaBeat&&f.attack.hitStage===f.attack.stage&&f.attack.stage<3&&f.timer<=f.attack.followUntil)text('必殺を押し直して '+(f.attack.stage+1)+'段目',f.x,f.y-124,11,'#ffbd96');}
 return{stamp,directed,draw,segments,drawObjects,impact,hud};
})();
