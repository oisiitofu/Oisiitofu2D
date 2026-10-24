'use strict';
const EnochVFX=(()=>{const k=CharacterVFXKit.create('enoch'),{stamp}=k;
 // Arch side crescent convex RIGHT; canopy convex UP. Gale blades lead RIGHT.
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const mode=a.enochWeapon??enochWeapon(f),e=k.envelope(f);if(e){if(mode===0){if(e.upper)stamp(1,e.x,e.t+23,e.w,46,f.face);else if(['air','downsmash'].includes(a.type)){stamp(0,e.l+e.w*.25,e.y,e.w*.5,Math.min(e.h,55),-1);stamp(0,e.r-e.w*.25,e.y,e.w*.5,Math.min(e.h,55),1);}else if(e.down)stamp(2,e.x,e.y,e.w,Math.min(e.h,65),f.face);else stamp(0,e.x,e.y,e.w,Math.min(e.h,60),e.back?-f.face:f.face);}else if(mode===1){const face=e.back?-f.face:f.face;stamp(e.upper||e.down?5:4,e.x,e.upper?e.t+25:e.down?e.d-25:e.y,e.w,e.upper||e.down?50:Math.min(e.h,50),face,1,e.down?Math.PI:0);}else stamp(e.upper?9:e.down?10:8,e.x,e.upper?e.t+25:e.down?e.d-20:e.y,e.w,e.upper?50:e.down?40:Math.min(e.h,45),e.back?-f.face:f.face);}
 if(a.enochNB&&a.hold)stamp(12,f.x+f.face*35,f.y-55,40,45,f.face,.7,0,true);
 if(a.enochRise&&mode===1&&a.phase==='flight')stamp(7,f.x,f.y-45,110,65,1,.7,0,true);
 }
 function drawObjects(){for(const q of EnochRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/10),face=Math.sign(q.vx)||q.face,rot=Math.atan2(q.vy,Math.abs(q.vx)||1);if(q.kind==='purify')stamp(12,q.x,q.y,95,90,1,fade,0,true);else if(q.kind==='archwave'||q.kind==='archblade')stamp(3,q.x,q.y,q.radius*3,q.radius*2,face,fade,rot);else stamp(6,q.x,q.y,42,14,face,fade,rot,true);}}
 function impact(v){stamp(14,v.x,v.y,40+v.power*3,40+v.power*3,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){k.bar(f.enochPurity??100,EnochWeaponNames[enochWeapon(f)]+' / PURITY',x,y,['#b5e2ff','#89ffc4','#ffe59a'][enochWeapon(f)]);if(f.enochBoost>0)text('OVERBOOST',x+149,y+44,8,'#fff2b8');}
 return{stamp,draw,drawObjects,impact,hud};})();
