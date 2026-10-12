'use strict';
const EdelgardVFX=(()=>{
 // Source: FX0 convex edge RIGHT/open LEFT; FX1 convex edge DOWN/open UP.
 // FX2 travels DOWN-RIGHT; FX5 travels RIGHT. Translation -> facing reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.edelgard?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.edelgard?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){const c=b.axeCenter||{x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2},shape=b.window?.shape,up=['up','upsmash','uair'].includes(a.type)||a.edelgardFlight&&a.phase==='ascent',down=a.type==='dair'||a.edelgardFlight&&a.phase==='plunge';if(shape==='shockwave'){stamp(3,f.x,f.y-30,140,70,1,.85);continue;}if(up)directed(1,c.x,c.y,80,55,-Math.PI/2,.8,Math.PI/2);else if(down)directed(2,c.x,c.y,70,55,Math.PI/2,.8,Math.atan2(200,650));else directed(a.edelgardRush&&a.phase==='rush'?5:0,c.x,c.y,85+(a.charge||0)*30,60,shape==='back'?Math.atan2(0,-f.face):Math.atan2(0,f.face),.8);}
  if(a.edelgardAymr&&a.hold)stamp(4,f.x,f.y-48,60+50*a.charge,38+30*a.charge,f.face,.7);if(a.edelgardFlight&&a.phase==='apex')stamp(4,f.x,f.y-55,65,40,f.face,.5);if(a.edelgardRush&&a.phase==='rush')stamp(5,f.x-f.face*30,f.y-40,95,35,f.face,.6);
 }
 function drawObjects(){for(const q of EdelgardRules.objects){const alpha=Math.min(1,(q.life-q.age)/15);if(q.kind==='impact')stamp(3,q.x,q.y-22,140,65,1,alpha);if(q.kind==='flag'){// Cloth comes from the generated imperial flag pose; pole is a narrow game primitive.
   if(!fighters[q.owner]?.attack?.edelgardFlag){ctx.save();ctx.globalAlpha*=alpha;ctx.strokeStyle='#cba75a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x,q.y-85);ctx.stroke();ctx.restore();stamp(8,q.x+q.face*42,q.y-49,90,70,q.face,alpha);}stamp(6,q.x,q.y,q.radius*2,60,1,alpha*(q.phase==='warning'?.3:.7));}}
 }
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='edelgard')text(f.edelgardFlagCooldown>0?'旗 '+Math.ceil(f.edelgardFlagCooldown/60)+'s':'→必殺 命中後に追撃 / ↑必殺 頂点で急降下',x+52,y+54,9,'#ffbdc6','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
