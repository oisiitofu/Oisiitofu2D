'use strict';
const KnightVFX=(()=>{
 // Crescents and Shade Soul lead RIGHT; dive4 DOWN; eruption5 UP.
 // Translate -> facing reflection -> local rotation; source angle includes sprite aspect.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.knight?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,sourceAngle=0){const face=Math.cos(angle)<0?-1:1,img=characterArt.knight?.effects[n],source=sourceAngle&&img?Math.atan2(Math.sin(sourceAngle)*h/img.height,Math.cos(sourceAngle)*w/img.width):0;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face)-source);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;if(a.knightImpact)stamp(5,f.x,f.y-30,180,95,1,.85);else for(const b of attackBoxes(f)){if(a.knightCyclone||b.window.shape==='spin')stamp(2,f.x,f.y-35,125,75,f.face,.8);else if(a.knightWings){}else if(a.knightDive)stamp(4,f.x,f.y-20,60,120,1,.75);else directed(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.max(35,Math.hypot(b.x2-b.x1,b.y2-b.y1)+25),45,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}if(a.knightWings&&['flap1','flap2','rebound'].includes(a.phase))stamp(3,f.x-f.face*25,f.y-25,105,55,f.face,.4);}
 function drawObjects(){for(const q of KnightRules.objects)directed(1,q.x,q.y,95,48,Math.atan2(q.vy,q.vx),Math.min(1,(q.life-q.age)/3));}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='knight')text('ソウル '+knightSoul(f)+'/99  ↑必殺 押し直しで羽ばたき',x+52,y+54,9,'#d6d9fa','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
