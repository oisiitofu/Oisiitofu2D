'use strict';
const NightravenVFX=(()=>{const k=CharacterVFXKit.create('nightraven'),{stamp}=k;
// Generated gun/laser/missile ink faces RIGHT; bomb points DOWN, jet points DOWN.
// Banking crescents 10/11 face RIGHT. Apply local rotation before facing reflection.
function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){const upper=['up','upsmash','uair'].includes(a.type),down=['low','downsmash','dair'].includes(a.type),back=a.type==='bair'||e.back;if(upper)stamp(a.type==='uair'?12:7,e.x,e.y,e.w,e.h,1,.8,a.type==='uair'?Math.PI:0);else if(down)stamp(a.type==='low'?0:7,e.x,e.y,e.w,e.h,f.face,.85,a.type==='low'?.28:0);else if(['jab','jab2','jab3','air'].includes(a.type))stamp(0,e.x,e.y,e.w,Math.min(36,e.h),f.face,.9);else if(['heavy','smash','fair'].includes(a.type))stamp(1,e.x,e.y,e.w,Math.min(40,e.h),f.face,.95);else stamp(11,e.x,e.y,e.w,e.h,back?-f.face:f.face,.8);}
if(a.type==='dragon'&&!a.fired)stamp(4,f.x+f.face*65,f.y-31,35+Math.min(35,f.timer),40+Math.min(35,f.timer),f.face,.85);
if(a.type==='dash'&&a.phase==='pass')stamp(3,f.x-f.face*95,f.y-28,80,30,f.face,.8,0,true);
if(a.type==='rise'&&['climb','escape'].includes(a.phase))stamp(12,f.x,f.y+28,33,90,1,.85,0,true);
if(a.type==='rise'&&a.phase==='glide')stamp(10,f.x-f.face*72,f.y-20,80,42,f.face,.6,0,true);
if(['gale','airDrop'].includes(a.type)&&!a.locked){stamp(8,a.lockX,a.lockY-15,64,64,1,.85,0,true);text('LOCK ON',a.lockX,a.lockY-56,10,'#ff6c8a');}}
function drawObjects(){for(const q of NightravenRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/4);if(q.kind==='laser'){stamp(5,q.x+q.face*q.length/2,q.y,q.length,q.radius*3.1,q.face,fade);stamp(6,q.x+q.face*q.length,q.y,q.radius*3,q.radius*3,1,fade);}else if(q.kind==='bomb')stamp(2,q.x,q.y,18,40,1,.95,0,true);else if(q.kind==='explosion')stamp(7,q.x,q.y-22,125,95,1,fade);else if(q.kind==='tls'){if(q.age<q.warning){stamp(8,q.x,q.y-12,68,68,1,.55+q.age/q.warning*.4,0,true);line([[q.x,q.y-35],[q.x,q.y-110]],'#ff4c77',1);text(String(Math.ceil((q.warning-q.age)/12)),q.x,q.y-79,12,'#ff8bb1');}else stamp(9,q.x,(q.y-250)/2,75,q.y+250,1,fade);}}}
function impact(v){stamp(13,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max);}
function hud(f,x,y){k.bar(100-clamp(f.ravenLaserCooldown||0,0,95)/.95,'LASER',x,y,'#82d8ff');if(f.ravenTLSCooldown>0)text('TLS '+Math.ceil(f.ravenTLSCooldown/60)+'s',x+148,y+42,8,'#ff87b0','left');}
return{draw,drawObjects,impact,hud};})();
