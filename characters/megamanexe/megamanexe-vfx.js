'use strict';
const MegaManExeVFX=(()=>{
 // Bullet, sword and boost art point RIGHT. Mirror locally before rotating
 // to the authored world-space segment; rear/up/down all follow hit geometry.
 function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.megamanexe?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,s=exeStyle(f);if(s>=0){stamp(5+s,f.x,f.y-42,85,108,f.face,.23);stamp(5+s,f.x+f.face*2,f.y-47,15,18,f.face,.9);}if(a?.exePA&&f.timer>=12&&f.timer<=24)stamp(5+(s>=0?s:f.exeNextStyle||0),f.x,f.y-44,115,135,f.face,.65);if(a?.hold&&a.exeBuster)stamp(1,f.x+f.face*44,f.y-43,22+a.charge*28,22+a.charge*28,f.face,.65);
 for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face),n=[9,12,14,15,16].includes(b.window?.pose??a?.pose)?2:a?.type==='upsmash'?3:0;stamp(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+28,n===2?48:34,face,.8,angle);}}
 function drawObjects(){for(const q of MegaManExeRules.objects){if(q.kind==='buster')stamp(q.charged?1:0,q.x,q.y,q.charged?58:32,q.charged?43:16,q.face);else if(q.kind==='reflectPanel')stamp(4,q.x,q.y,86,35,1,.8*(1-q.age/q.life));else if(q.kind==='areaMark')stamp(3,q.x,q.y-42,60,90,1,.5);else if(q.kind==='ownedPanel')stamp(4,q.x,q.y,125,25,1,.4);}}
 function impact(v){stamp(10,v.x,v.y,32+v.power*2,32+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='megamanexe')return;const s=exeStyle(f);text(s>=0?ExeStyleNames[s]+' '+(f.exeStyleTime/60).toFixed(1)+'s':f.exePACooldown>0?'PA '+Math.ceil(f.exePACooldown/60)+'s':'次：'+ExeStyleNames[f.exeNextStyle||0],x+242,y+18,9,s>=0?ExeStyleColors[s]:'#b9eaff','right');}
 return{draw,drawObjects,impact,hud};
})();
