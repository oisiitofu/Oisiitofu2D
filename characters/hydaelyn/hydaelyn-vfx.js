'use strict';
const HydaelynVFX=(()=>{
 const k=CharacterVFXKit.create('hydaelyn'),{stamp}=k;
 // Extracted paint: 0/9 convex RIGHT; 2 convex UP; 3 convex DOWN.
 // Local source correction -> local rotation -> facing -> world translation.
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);
  if(e){if(a.type==='jab2'){const b=attackVisualBoxes(f).find(v=>!v.meleeInner&&!v.upAttackExtra),dx=b.x2-b.x1,dy=b.y2-b.y1;stamp(1,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+b.radius*2,30,f.face,.86,Math.atan2(dy,dx*f.face));}else if(a.type==='upsmash')stamp(15,e.x,e.y,e.w,e.h,1,.88);else if(e.upper)stamp(2,e.x,e.t+Math.min(e.h,38)/2,e.w,Math.min(e.h,38),1,.88);else if(a.type==='dair')stamp(3,e.x,e.y,e.w,Math.min(e.h,42),1,.86);else if(a.type==='air'){stamp(9,e.l+e.w*.25,e.y,e.w*.5,40,-1,.85);stamp(9,e.r-e.w*.25,e.y,e.w*.5,40,1,.85);}else if(a.type==='downsmash')stamp(8,e.x,e.y,e.w,Math.max(35,e.h),1,.88);else if(['jab','dashAttack','fair'].includes(a.type))stamp(1,e.x,e.y,e.w,Math.min(e.h,30),f.face,.85);else stamp(a.hydaelynWing||['heavy','smash'].includes(a.type)?9:a.type==='jab3'?1:0,e.x,e.y,e.w,Math.min(e.h,45),e.back?-f.face:f.face,.85);}
  if(a.hydaelynWing&&a.phase==='fly')stamp(7,f.x-f.face*45,f.y-53,90,32,f.face,.65,0,true);
  if(a.hydaelynRay&&!a.released)stamp(10,f.x+a.originFace*24,f.y-58,20+f.timer*.35,20+f.timer*.35,1,.8,0,true);
  if(a.hydaelynCrystal&&f.timer<14)stamp(6,a.aimX,f.y-2,46,17,1,.4,0,true);
 }
 function drawObjects(){for(const q of HydaelynRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/13);if(q.kind==='ray'){const w=q.length;stamp(q.charged||q.amplified?5:4,q.x+q.face*w/2,q.y,w,q.radius*2,q.face,fade,0,true);}else if(q.kind==='crystal'){if(q.age<q.delay)stamp(6,q.x,q.y-3,48,18,1,(.3+q.age/q.delay*.6)*fade,0,true);else if(q.age<q.delay+8)stamp(15,q.x,q.y-90,54,180,1,fade,0,true);else stamp(12,q.x,q.y-32,39,59,1,fade*.9,0,true);}else if(q.kind==='tracer'){stamp(13,q.x,q.y,38,23,q.face,fade,0,true);ctx.save();ctx.strokeStyle='#c7efff77';ctx.lineWidth=1;ctx.setLineDash([4,6]);const owner=fighters[q.owner];ctx.beginPath();ctx.moveTo(owner.x,owner.y-54);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();}else if(q.kind==='circle')stamp(14,q.x,q.y+3,61,18,1,fade,0,true);}}
 function impact(v){stamp(11,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){text('CRYSTAL '+hydaelynOwned(f,'crystal').length+'/2',x+148,y+27,8,'#bceaff','left');if(f.attack?.hydaelynWing&&f.attack.phase==='aim')text('離す→必殺で飛ぶ',x+148,y+42,8,'#e1f8ff','left');}
 return{draw,drawObjects,impact,hud};
})();
