'use strict';
const AnubisVFX=(()=>{const k=CharacterVFXKit.create('anubis'),{stamp}=k;
// Actual visible sources: 0/4/10 convex RIGHT, 1 convex UP. Normalize first,
// rotate into the attack direction second, reflect into fighter facing last.
function draw(f){if(f.respawn)return;const a=f.attack,e=k.envelope(f);if(e){if(['up','upsmash','uair','rise'].includes(a.type))stamp(1,e.x,e.t+Math.min(27,e.h*.34),e.w,Math.min(65,e.h),1,.95);else if(a.type==='downsmash'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,48,-1,.9);stamp(10,e.r-e.w*.25,e.y,e.w*.5,48,1,.9);}else{const thrust=['jab','jab3','dashAttack','smash','fair','dair','dash'].includes(a.type),n=a.type==='low'?10:thrust?4:0;stamp(n,e.x,e.y,e.w,Math.min(64,e.h),['bair','low'].includes(a.type)?-f.face:f.face,.95,a.type==='dair'?Math.PI/2:a.type==='jab3'?-.6:a.type==='fair'?.55:0);}}
if(!a)return;if(a.type==='dragon'&&!a.fired){stamp(8,f.x+f.face*38,f.y-80,35,35,1,.65,0,true);for(const o of anubisTargets(f).slice(0,3))stamp(8,o.x,o.y-50,48,48,1,.65,0,true);}
if(a.type==='dash'){if(f.timer<12){stamp(11,a.origin.x,a.origin.y-66,94,136,a.originFace,.35,0,true);stamp(3,a.shiftPoint.x,a.shiftPoint.y-63,68,120,1,.35+f.timer*.025,0,true);}else if(f.timer-a.shiftAt<8){stamp(11,a.shiftFrom.x,a.shiftFrom.y-66,94,136,a.originFace,(8-f.timer+a.shiftAt)/12,0,true);stamp(3,f.x,f.y-63,72,120,1,.55,0,true);}}
if(a.type==='rise'&&['flight','escape'].includes(a.phase))stamp(12,f.x-f.face*8,f.y+12,32,68,1,.8,a.phase==='flight'?a.heading+Math.PI/2:0,true);
if(['gale','airDrop'].includes(a.type)&&!a.fired){const size=22+(a.charge||0)*38;stamp(5,f.x+f.face*32,f.y-80,size,size,1,.8,frame*.02,true);}}
function drawObjects(){for(const q of AnubisRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/4);if(q.kind==='homing')stamp(2,q.x,q.y,42,22,1,fade,Math.atan2(q.vy,q.vx),true);else if(q.kind==='burst')stamp(5,q.x,q.y,38,38,1,fade,q.age*.06,true);else if(q.kind==='explosion')stamp(15,q.x,q.y,q.radius*2.3,q.radius*2.3,1,fade,0,true);}}
function impact(v){stamp(13,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max);}
function hud(f,x,y){const n=Math.max(f.anubisShiftCooldown||0,f.anubisBurstCooldown||0);if(n>0)k.bar(100*(1-Math.min(130,n)/130),'RECHARGE',x,y,'#ff7d64');}
return{draw,drawObjects,impact,hud};})();
