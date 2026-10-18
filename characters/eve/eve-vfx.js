'use strict';
const EveVFX=(()=>{
 // Sources 0/1/2/4/5 lead RIGHT. Reflect in X, then rotate locally so
 // the transformed source axis coincides with the world hitbox or velocity.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.eve?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;stamp(3,f.x-f.face*40,f.y-73,31,25,f.face,.9);if(f.eveTachyTime>0)stamp(5,f.x,f.y-45,65,90,f.face,.13);if(!a)return;for(const b of attackVisualBoxes(f)){directed(f.eveTachyTime>0?5:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(b.x2-b.x1,b.y2-b.y1)+18,35,Math.atan2(b.y2-b.y1,b.x2-b.x1),.7);}if(a.eveDrone){stamp(3,f.x+f.face*42,f.y-51,42,32,f.face);if(a.hold)stamp(6,f.x+f.face*65,f.y-50,15+25*a.charge,15+25*a.charge,1,.75);}if(a.eveBlink){if(a.phase==='aim'){const angle=Math.atan2(a.aimY,a.aimX);directed(4,f.x+a.aimX*65,f.y-38+a.aimY*65,100,45,angle,.5);}if(a.departure&&f.timer-a.arriveAt<8)directed(4,(a.departure.x+a.arrival.x)/2,(a.departure.y+a.arrival.y)/2-40,Math.hypot(a.arrival.x-a.departure.x,a.arrival.y-a.departure.y),70,Math.atan2(a.arrival.y-a.departure.y,a.arrival.x-a.departure.x),(8-f.timer+a.arriveAt)/10);}if(a.eveTachy&&a.fired)stamp(5,f.x,f.y-48,120,105,f.face,.7);}
 function drawObjects(){for(const q of EveRules.objects){if(q.delay&&q.age<=q.delay)continue;directed(q.kind==='cross'?1:q.kind==='laser'?2:0,q.x,q.y,q.kind==='laser'?145:q.kind==='slug'?28:100,q.kind==='laser'?q.radius*2:q.kind==='slug'?9:q.radius*2.5,Math.atan2(q.vy,q.vx),.85);}}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='eve')text(f.eveTachyTime>0?'タキモード '+(f.eveTachyTime/60).toFixed(1)+'s':'タキゲージ '+Math.floor(eveEnergy(f))+'/100',x+52,y+54,11,f.eveTachyTime>0?'#ff99db':'#b5e4ff','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
