'use strict';
const MeliaVFX=(()=>{
// Native slash sweeps RIGHT: mirror in local space, then rotate to the real
// hit segment. Attribute orbs retain their authored fire/ice/thunder/wind art.
function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.melia?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
function draw(f){if(f.respawn)return;const a=f.attack,e=meliaElement(f);stamp(3+e,f.x+f.face*24,f.y-77,18,18,1,.55);if(a?.meliaChange&&f.timer>=6&&f.timer<17)stamp(10,f.x,f.y-45,90,100,f.face,.75);if(a?.meliaFlight&&a.flightStarted)stamp(7,f.x,f.y-47,160,105,f.face,.65);if(a?.hold&&a.meliaSummon)stamp(3+a.meliaElement,f.x+f.face*35,f.y-51,24+a.charge*20,24+a.charge*20,1,.7);
for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);if(['low','down'].includes(b.window?.shape))stamp(2,b.x2,b.y2,70,65,face,.65);else stamp(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+32,46,face,.8,angle);}}
function drawObjects(){for(const q of MeliaRules.objects){if(q.kind==='field'){stamp(1,q.x,q.y-10,q.radius*2.4,82,1,.7);stamp(3+q.element,q.x,q.y-40,24,24,1,.6);}else{const size=q.kind==='summon'?26:q.kind==='ice'&&q.groundY!==undefined?35:q.radius*2.8;stamp(q.kind==='ice'&&q.groundY!==undefined?2:3+q.element,q.x,q.y,size,size,q.face,.9);}}}
function impact(v){stamp(9,v.x,v.y,32+v.power*2,32+v.power*2,1,v.life/v.max);}
function hud(f,x,y){if(f.characterId!=='melia')return;text('元素：'+MeliaElements[meliaElement(f)],x+242,y+18,9,MeliaColors[meliaElement(f)],'right');}
return{draw,drawObjects,impact,hud};
})();
