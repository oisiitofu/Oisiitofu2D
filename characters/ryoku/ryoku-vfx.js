'use strict';
const RyokuVFX=(()=>{const k=CharacterVFXKit.create('ryoku'),{stamp}=k;
 // Leaf crescent 0 leads RIGHT, canopy 1 leads UP, tea 4/leaf wind 7 RIGHT.
 // Rotate source locally, then reflect facing. Up canopy stays one wide arc.
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.ryokuTeaTime>0)stamp(13,f.x,f.y-28,72,62,1,.2,0,true);if(!a)return;const e=k.envelope(f);if(e){if(a.type==='upsmash')stamp(6,e.x,e.y,Math.min(68,e.w),e.h,1,.9);else if(e.upper){const h=35;stamp(1,e.x,e.t+h/2,e.w,h,1,.8);}else if(['jab','jab2','fair','low','dair'].includes(a.type))stamp(3,e.back?e.l+10:f.face>0?e.r-12:e.l+12,e.y,29,29,f.face,.8,0,true);else if(['downsmash','air'].includes(a.type)){stamp(0,e.l+e.w*.25,e.y,e.w*.5,30,-1,.7);stamp(0,e.r-e.w*.25,e.y,e.w*.5,30,1,.7);}else stamp(0,e.x,e.y,e.w,Math.min(38,e.h),e.back?-f.face:f.face,.8);}if(a.ryokuLift&&a.phase==='rise')stamp(2,f.x,f.y-55,70,18,1,.45,0,true);if(a.ryokuTea&&a.phase!=='fall'&&!a.done)stamp(6,f.x,f.y-48,35,45,1,.5,0,true);}
 function drawObjects(){for(const q of RyokuRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/10);if(q.kind==='tea')stamp(4,q.x,q.y,q.radius*3,Math.max(23,q.radius*1.4),q.face,fade,Math.atan2(q.vy,Math.abs(q.vx)),true);if(q.kind==='tin')stamp(8,q.x,q.y,37,34,Math.sign(q.vx)||q.face,fade,q.age*.16,true);if(q.kind==='updraft')stamp(7,q.x,q.y-55,110,40,1,fade*.38,-Math.PI/2,true);}}
 function impact(v){stamp(3,v.x,v.y,33+v.power*3,33+v.power*3,1,v.life/v.max,0,true);}
 function hud(f,x,y){k.bar(ryokuWater(f),'お茶 '+Math.floor(ryokuWater(f)),x,y,'#b9ed64');text(f.ryokuTeaTime>0?'お茶パワー':ryokuTin(f)?'茶筒：操作 / 呼戻し':'茶筒：設置',x+148,y+43,8,'#d6f1b0','left');}
 return{draw,drawObjects,impact,hud};})();
