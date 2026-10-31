'use strict';
const VelvetVFX=(()=>{
 const k=CharacterVFXKit.create('velvet'),{stamp}=k;
 // Extracted material is checked before registration:0/9 convex RIGHT,
 // 2 convex UP,3 convex DOWN. Source -> rotation -> facing -> world.
 function line(n,b,face,alpha=.9,prop=false){const dx=(b.x2-b.x1)*face,dy=b.y2-b.y1;stamp(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+b.radius*2,b.radius*2.4,face,alpha,Math.atan2(dy,dx),prop);}
 function drawBehind(f,alpha=1,scale=1){if(f.respawn||pose(f)===69||!(f.velvetTherionTime>0||f.attack?.velvetForm))return;ctx.save();ctx.globalAlpha*=alpha;stamp(13,f.x-f.face*9*scale,f.y-48*scale,116*scale,101*scale,f.face,.5,0,true);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);
  if(e){if(a.velvetArm){const b=attackVisualBoxes(f).find(b=>!b.meleeInner);if(b)line(4,b,a.originFace,.96);}else if(e.upper||a.type==='jab3')stamp(2,e.x,e.t+Math.min(e.h,36)/2,e.w,Math.min(e.h,36),1,.9);else if(a.type==='air'){stamp(0,e.x,e.y,e.w*.85,28,f.face,.83,-.48);stamp(9,e.x,e.y,e.w*.85,28,f.face,.83,.48);}else if(a.type==='dair')stamp(3,e.x,e.y,e.w,Math.min(42,e.h),1,.9);else if(a.type==='downsmash')stamp(8,e.x,e.y,e.w,Math.max(34,e.h),1,.88);else if(['jab2','dashAttack','bair'].includes(a.type))stamp(1,e.x,e.y,e.w,Math.min(30,e.h),e.back?-f.face:f.face,.9);else stamp(a.type==='smash'?9:0,e.x,e.y,e.w,Math.min(43,e.h),e.back?-f.face:f.face,.88);}
  if(a.velvetSnare&&['cast','reel'].includes(a.phase)){const p=velvetHand(f),o=f.grabbed,end=o?{x:o.x,y:o.y-40}:{x:f.x+a.originFace*a.armLength,y:p.y};line(12,{x1:p.x,y1:p.y,x2:end.x,y2:end.y,radius:15},a.originFace,.9,true);if(o)stamp(6,o.x,o.y-48,31,45,1,.55,0,true);}
  if(a.velvetWing){if(a.phase==='aim'){if(a.anchor){const p=velvetHand(f);line(12,{x1:p.x,y1:p.y,x2:a.anchor.x,y2:a.anchor.y,radius:6},a.anchor.x>=p.x?1:-1,.7,true);}const n=Math.hypot(a.aimX,a.aimY)||1,dx=a.aimX/n,dy=a.aimY/n;ctx.save();ctx.strokeStyle='#ff6e9188';ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(f.x,f.y-42);ctx.lineTo(f.x+dx*90,f.y-42+dy*90);ctx.stroke();ctx.restore();stamp(6,f.x+dx*90,f.y-42+dy*90,19,24,1,.75,0,true);}if(['launch','burst','glide'].includes(a.phase))stamp(15,f.x-f.vx*2,f.y-40-f.vy,60,31,f.face,.65,Math.atan2(f.vy,f.vx*f.face||1),true);}
  if(a.velvetRelease&&!a.unleashed&&f.timer>=7&&f.timer<=21)stamp(14,f.x,f.y-45,72,86,1,.5,0,true);
  if(a.blocked&&f.timer-a.endAt<8)stamp(11,a.blocked.x,a.blocked.y,28,28,1,.8,0,true);
 }
 function drawObjects(){for(const q of VelvetRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/8);if(q.kind==='release')stamp(10,q.x,q.y,q.radius*2,q.radius*2,1,fade,0,true);else if(q.kind==='soul')stamp(5,q.x,q.y,23,23,1,fade,0,true);}for(const f of fighters)if(f.characterId==='velvet'&&!f.respawn)for(const o of BattlePlayers.targets(f))if(velvetMarked(f,o))stamp(6,o.x,o.y-99,18,22,1,.75,0,true);}
 function impact(v){stamp(11,v.x,v.y,32+v.power*2,32+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){k.bar(velvetSoul(f),'SOUL',x,y,'#ff426c');if(f.velvetTherionTime>0)text('喰魔解放 '+Math.ceil(f.velvetTherionTime/60),x+148,y+43,8,'#ffb0c0','left');else if(velvetSoul(f)>=100)text('下B長押しで解放',x+148,y+43,8,'#ffc2cf','left');}
 return{drawBehind,draw,drawObjects,impact,hud};
})();
