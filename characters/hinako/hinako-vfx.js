'use strict';
const HinakoVFX=(()=>{
 // Native arcs sweep RIGHT. Mirror in local space before rotating to the
 // actual world-space hit segment, so back/up/down attacks use their hitboxes.
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const im=characterArt.hinako?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rotation);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(hinakoBeast(f))stamp(6,f.x,f.y-38,90,100,f.face,.12+.04*Math.sin(frame*.1));if(a?.hinakoMask&&f.timer>=12&&f.timer<=22)stamp(2,f.x,f.y-50,95,100,f.face,.65);
  if(a?.hold&&a.hinakoFocus)stamp(1,f.x+f.face*25,f.y-43,30+a.charge*35,30+a.charge*35,f.face,.5);
  for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),rotation=Math.atan2(dy,dx*face);stamp(a?.hinakoBeast?3:a?.hinakoVault?4:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+30,a?.hinakoBeast?55:44,face,.82,rotation);if(a?.hinakoFocus&&a.charge>.2)stamp(1,b.x2,b.y2,40+a.charge*45,40+a.charge*45,face,.65);}
 }
 function drawObjects(){}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='hinako')return;text(f.hinakoMaskTime>0?'異腕 '+(f.hinakoMaskTime/60).toFixed(1)+'s':f.hinakoMaskCooldown>0?'仮面 '+Math.ceil(f.hinakoMaskCooldown/60)+'s':'仮面 READY',x+242,y+18,9,hinakoBeast(f)?'#e9c9c0':'#b9d6ff','right');}
 return{draw,drawObjects,impact,hud};
})();
