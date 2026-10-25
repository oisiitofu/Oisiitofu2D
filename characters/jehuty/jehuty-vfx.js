'use strict';
const JehutyVFX=(()=>{const k=CharacterVFXKit.create('jehuty'),{stamp}=k;
// Blade 0 is convex RIGHT; canopy 1 convex UP. Beam/bolt/cannon face RIGHT.
// Source normalization -> local rotation -> facing reflection. The cannon prop
// has one rigid image/transform for the entire move; only its inner rifling spins.
function rifling(c,phase,charge){ctx.save();ctx.translate(c.muzzleX,c.muzzleY);ctx.scale(c.face*.38,1);ctx.beginPath();ctx.arc(0,0,13,0,Math.PI*2);ctx.clip();ctx.rotate(phase);ctx.fillStyle='#021e3d';ctx.fillRect(-15,-15,30,30);for(let n=0;n<8;n++){const a=n*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*12,Math.sin(a)*12);ctx.quadraticCurveTo(Math.cos(a+.45)*10,Math.sin(a+.45)*10,Math.cos(a+.8)*5,Math.sin(a+.8)*5);ctx.strokeStyle=n%2?'#efffff':'#29d9ff';ctx.lineWidth=1.2+charge*.8;ctx.stroke();}ctx.restore();}
function cannon(c,phase,charge){stamp(c.image,c.x,c.y,c.width,c.height,c.face,1,0,true);rifling(c,phase,charge);}
function draw(f){if(f.respawn)return;const a=f.attack,e=k.envelope(f);if(e){if(['up','upsmash','uair','rise'].includes(a.type))stamp(1,e.x,e.t+Math.min(27,e.h*.34),e.w,Math.min(62,e.h),1,.95);else if(a.type==='downsmash'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,48,-1,.9);stamp(0,e.r-e.w*.25,e.y,e.w*.5,48,1,.9);}else stamp(0,e.x,e.y,e.w,Math.min(62,e.h),a.type==='bair'?-f.face:f.face,.95,a.type==='dair'?Math.PI/2:a.type==='low'?.15:0);}
if(!a)return;if(a.type==='dragon'&&!a.fired){stamp(6,f.x+f.face*30,f.y-76,26,26,1,.65,0,true);for(const id of a.locks||[]){const o=fighters.find(o=>o.id===id);if(o)stamp(8,o.x,o.y-45,54,54,1,.8,0,true);}}
if(a.type==='dash'){if(f.timer<12){stamp(11,a.origin.x,a.origin.y-63,70,128,a.originFace,.45,0,true);stamp(3,a.shiftPoint.x,a.shiftPoint.y-60,62,115,1,.4+f.timer*.03,0,true);}else if(f.timer-a.shiftAt<8){stamp(11,a.shiftFrom.x,a.shiftFrom.y-63,70,128,a.originFace,(8-f.timer+a.shiftAt)/12,0,true);stamp(3,f.x,f.y-60,70,115,1,.6,0,true);}}
if(a.type==='rise'&&['boost','escape'].includes(a.phase))stamp(12,f.x-f.face*8,f.y+12,34,76,1,.8,0,true);
if(['gale','airDrop'].includes(a.type)){const c=a.cannon;cannon(c,a.riflingPhase,a.cannonCharge);if(!a.fired)stamp(6,c.muzzleX,c.muzzleY,18+a.cannonCharge*20,18+a.cannonCharge*20,1,.35+a.cannonCharge*.4,0,true);}}
function drawObjects(){for(const q of JehutyRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/4);if(q.kind==='homing'){const rot=Math.atan2(q.vy,q.vx);stamp(2,q.x,q.y,43,24,1,fade,rot,true);}else if(q.kind==='vector'){const length=Math.abs(q.x+q.face*q.length-q.muzzleX);stamp(5,q.muzzleX+q.face*length/2,q.y,length,q.radius*2.5,q.face,fade);}}}
function impact(v){stamp(13,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max);}
function hud(f,x,y){k.bar(f.jehutyEN??100,'EN',x,y,'#78ecff');if(f.jehutyLockTime>0)text('LOCK / ZERO SHIFT',x+148,y+42,8,'#ffb16c','left');}
return{draw,drawObjects,impact,hud,rifling,cannon};})();
