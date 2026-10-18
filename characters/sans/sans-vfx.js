'use strict';
const SansVFX=(()=>{
 // Native bone and beam sprites lead RIGHT. Reflection precedes local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.sans?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.sans?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rotation:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,length:Math.hypot(dx,dy)};}
 function drawObjects(){for(const q of SansRules.objects){const fade=Math.min(1,(q.life-q.age)/5);if(q.kind==='bone'){const d=direction({x1:q.x-q.vx*3,y1:q.y-q.vy*3,x2:q.x,y2:q.y});stamp(0,d.x,d.y,55,20,d.face,fade,d.rotation);prop(0,q.x,q.y,45,13,d.face,fade,d.rotation);}else if(q.kind==='beam'){const b=SansRules.beamBox(q),d=direction(b),firing=q.age>q.delay&&q.age<=q.delay+q.active;prop(firing?3:2,q.x,q.y,74,63,q.face,fade,(q.angle-(q.face===1?0:Math.PI))*q.face);if(firing&&d.length>0)stamp(1,d.x,d.y,d.length,26+q.radius,d.face,1,d.rotation);else if(q.age<=q.delay)stamp(5,q.x,q.y,70,65,q.face,.6);}else if(q.kind==='field'){const alpha=q.age<=q.delay?.35+q.age/q.delay*.4:fade;prop(7,q.x,q.y,q.width,q.height,1,alpha);stamp(4,q.x,q.y,q.width+12,q.height+12,1,alpha*.6);if(q.hitTimes.size)prop(5,q.x,q.y,25,25,1,.6+Math.sin(frame*.2)*.2);}}}
 function drawSoul(f){if(f.sansSoulTime>0){stamp(2,f.x,f.y-35,55,90,1,.35);prop(5,f.x,f.y-65,15,15,1,.8);}}
 function draw(f){const a=f.attack;if(!a){if(f.grabbed)prop(5,f.grabbed.x,f.grabbed.y-45,20,20);return;}const t=f.timer;
  if(a.shortcut){if(t>=8&&t<=17){stamp(3,a.origin.x,a.origin.y-40,75,90,1,.55);stamp(3,a.target.x,a.target.y-40,75,90,1,.7);}if(a.returned&&t>=a.returnVanish&&t<=a.returnFrame+3)stamp(3,a.origin.x,a.origin.y-40,80,90,1,.7);}
  if(a.soulWarp){prop(5,f.x,f.y-58,20,20,1,.8);if(!a.committed){stamp(2,f.x,f.y-28,65,95,1,.5);stamp(5,a.target.x,a.target.y-30,42,42,1,.45);}else if(t>=a.vanishStart&&t<=a.warpFrame+3){stamp(3,a.origin.x,a.origin.y-35,85,100,1,.6);stamp(3,a.target.x,a.target.y-35,85,100,1,.75);}}
  if(a.hold)stamp(5,f.x,f.y-45,65+50*a.charge,65+50*a.charge,1,.65);
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=direction(b);if(a.sansPillars){prop(1,d.x,d.y,24,d.length+12,1,.95);stamp(6,d.x,d.y,40,d.length+20,1,.65);}else{stamp(0,d.x,d.y,d.length+16,32,d.face,.8,d.rotation);prop(0,d.x,d.y,d.length,16,d.face,.95,d.rotation);}}
 }
 function hidden(f){const a=f.attack,t=f.timer;return !!a&&(a.shortcut&&(t>=8&&t<=13||a.returned&&t>=a.returnVanish&&t<a.returnFrame)||a.soulWarp&&a.committed&&t>=a.vanishStart&&t<a.warpFrame);}
 function impact(v){stamp(7,v.x,v.y,70+v.power*10,70+v.power*10,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='sans')text(f.sansLockCooldown>0?'SOUL LOCK '+Math.ceil(f.sansLockCooldown/60)+'s':'SOUL LOCK READY',x+52,y+54,8,'#90ddff','left');}
 return{stamp,prop,direction,drawObjects,draw,drawSoul,hidden,impact,hud};
})();
