'use strict';
const TifaVFX=(()=>{
 // FX0 impact is radial; FX1 punch trail and FX2 kick crescent point RIGHT.
 // FX2 has its convex edge RIGHT, opening LEFT. Translate, reflect facing,
 // then rotate the local RIGHT axis onto the measured strike segment.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.tifa?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1,rot=Math.atan2(Math.sin(angle),Math.cos(angle)*face);stamp(n,x,y,w,h,face,alpha,rot);}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.tifaKiTime>0)stamp(3,f.x,f.y-43,116,127,1,.27);if(a?.tifaKi&&f.timer>8)stamp(3,f.x,f.y-40,130,145,1,Math.min(.65,f.timer/50));if(!a)return;
  for(const b of attackBoxes(f)){const d=AdolVFX.direction(b),n=b.window.pose??a.pose,angle=Math.atan2(b.y2-b.y1,b.x2-b.x1);if([6,7,42].includes(n)){directed(1,d.x,d.y,d.len+25,28,angle,.7);stamp(0,b.x2,b.y2,32,32,1,.45);}else directed(2,d.x,d.y,d.len+28,48,angle,.75);}
 }
 function drawObjects(){}
 function impact(v){stamp(v.power>14?4:0,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='tifa')return;text(f.tifaKiTime>0?'気合 '+Math.ceil(f.tifaKiTime/60)+'s':f.tifaKiCooldown>0?'気合 再使用 '+Math.ceil(f.tifaKiCooldown/60)+'s':'↓B 気合',x+52,y+54,9,'#9bdaff','left');if(f.attack?.tifaBeat&&f.attack.hitStage===f.attack.stage&&f.attack.stage<3&&f.timer<=f.attack.followUntil)text('必殺を押し直して '+(f.attack.stage+1)+'段目',f.x,f.y-124,11,'#ffbd96');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
