'use strict';
const CojicojiVFX=(()=>{
 // Art travels RIGHT in local coordinates: mirror locally, then rotate to
 // the hit segment; up/down/rear hits derive their direction from the box.
 function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.cojicoji?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(a?.cojiSleep&&f.timer>=20&&!a.cojiWake)stamp(5,f.x+f.face*25,f.y-55,36,36,f.face,.75);if(a?.cojiFloat&&a.floatStarted){stamp(2,f.x,f.y-15,80,35,f.face,.6);stamp(6,f.x,f.y-52,65,65,f.face,.35);}
  for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);stamp(2,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+25,32,face,.55,angle);stamp(3,b.x2,b.y2,30,30,face,.65);}}
 function drawObjects(){for(const q of CojicojiRules.objects)stamp(q.kind==='bun'?0:1,q.x,q.y,q.kind==='bun'?28:30,q.kind==='bun'?23:36,q.face,1,q.kind==='bun'?q.age*.07:Math.sin(q.age*.18)*.2);}
 function impact(v){stamp(3,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='cojicoji')return;text(f.cojiSleepCooldown>0?'おひるね '+Math.ceil(f.cojiSleepCooldown/60)+'s':'おひるね READY',x+242,y+18,9,'#ffdf83','right');}
 return{draw,drawObjects,impact,hud};
})();
