'use strict';
const AiaiVFX=(()=>{
 // Trail0 and crescent1 lead RIGHT. Rotate source locally, reflect for facing,
 // then translate to world space, matching the actual attack capsule.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.aiai?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,vx,vy,w,h,alpha=1){const face=vx<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;directed(1,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.x2-b.x1,b.y2-b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+b.radius,42,.62);stamp(8,b.x2,b.y2,32,32,1,.85);}
  if(a?.aiaiRoll&&f.timer>=8&&f.timer<=30&&!a.rebounded)stamp(0,f.x-a.rollFace*40,f.y-43,115,60,a.rollFace,.65);
  if(a?.aiaiGoal&&a.gateAt!=null){const dt=f.timer-a.gateAt;if(dt<15)stamp(4,a.gateX,a.gateY,82,104,1,dt>8?Math.max(0,(15-dt)/7):1);if(a.launchAt!=null&&f.timer-a.launchAt<14)directed(9,(a.gateX+f.x)/2,(a.gateY+f.y-42)/2,f.x-a.gateX,f.y-42-a.gateY,120,105,.7);}
  if(a?.aiaiBox&&f.timer>=12&&f.timer<=19)stamp(11,f.x+a.originFace*52,f.y-28,65,65,1,.8);
  if(f.aiaiSpeedTime>0)stamp(0,f.x-f.face*35,f.y-23,74,35,f.face,.22);
 }
 function drawObjects(){for(const q of AiaiRules.objects){if(q.dead)continue;const n={banana:2,bunch:3,box:5,speed:6,spring:7}[q.kind],sz={banana:[27,19],bunch:[40,37],box:[45,45],speed:[37,34],spring:[36,40]}[q.kind];if(n!=null)stamp(n,q.x,q.y,sz[0],sz[1],q.face||1,1,q.kind==='banana'?q.age*.1:0);}}
 function impact(v){stamp(8,v.x,v.y,30+v.power*1.7,30+v.power*1.7,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='aiai')return;text(f.aiaiSpeedTime>0?'スピードUP '+Math.ceil(f.aiaiSpeedTime/60)+'秒':f.aiaiBoxCooldown>0?'ボックス '+Math.ceil(f.aiaiBoxCooldown/60)+'秒':'ボックス 準備OK',x+240,y+15,9,'#ffea86','right');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
