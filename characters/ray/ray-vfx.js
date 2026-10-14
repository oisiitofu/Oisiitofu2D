'use strict';
const RayVFX=(()=>{
 // Directional textures face right; reflect first, rotate in reflected local space.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.ray?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;for(const b of attackVisualBoxes(f))directed(6,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+28,40,.75);const a=f.attack;if(a?.rayGun&&[12,18,24].includes(f.timer)&&f.timer<=a.volleyEnd)stamp(1,f.x+42*f.face,f.y-45,48,48,f.face);}
 function drawObjects(){for(const q of RayRules.objects){if(q.kind==='gun')directed(0,q.x,q.y,q.vx,q.vy,q.radius*4.5,q.radius*2.5);else if(q.kind==='bomb')stamp(2,q.x,q.y,30,30,1,1,q.age*.12);else if(q.kind==='pod')directed(4,q.x,q.y,q.vx,q.vy,48,30);else if(q.kind==='blast')stamp(q.cross?5:3,q.x,q.y,q.radius*2.5,q.radius*2.5,1,1-q.age/q.life);}}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='ray')return;for(const[k,n,max]of[['rayGunCooldown','GUN',32],['rayBombCooldown','BOMB',50],['rayPodCooldown','POD',85]].map((v,i)=>[...v,i])){const i=['GUN','BOMB','POD'].indexOf(n);text(n,x+175+i*30,y+17,8,'#c7e9ff','center');ctx.fillStyle='#263c52';ctx.fillRect(x+163+i*30,y+22,24,4);ctx.fillStyle='#61c9ff';ctx.fillRect(x+163+i*30,y+22,24*(1-Math.min(1,(f[k]||0)/max)),4);}}
 return{draw,drawObjects,impact,hud};
})();
