'use strict';
const RingfitVFX=(()=>{const k=CharacterVFXKit.create('ringfit'),{stamp}=k;
// Source-visible axes are normalized before local rotation, then facing reflection.
// Air pressure and exercise columns keep their authored shapes; no sword curves.
function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){if(['up','upsmash','uair'].includes(a.type))stamp(1,e.x,e.t+Math.min(30,e.h*.4),e.w,48,1,.85);else if(a.type==='downsmash'||a.type==='air'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,38,-f.face,.85);stamp(0,e.r-e.w*.25,e.y,e.w*.5,38,f.face,.85);}else stamp(0,e.x,e.y,e.w,Math.min(58,e.h),a.type==='bair'?-f.face:f.face,.9,a.type==='dair'?Math.PI/2:0);}
if(a.type==='dragon'&&!a.fired)stamp(9,f.x+f.face*24,f.y-48,38,44,f.face,.5,0,true);if(a.type==='dash'&&!a.fired&&a.aimX)stamp(5,a.aimX,a.aimY,55,55,1,.45,0,true);if(a.type==='rise'&&a.phase==='flight')stamp(11,f.x,f.y+15,36,60,1,.6,0,true);}
function drawObjects(){for(const q of RingfitRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/9);
if(q.kind==='air')stamp(q.skill===1?3:q.skill===3?4:2,q.x,q.y,q.radius*2.7,q.radius*2.1,q.face,fade,0,true);if(q.kind==='pressure'||q.kind==='exercise')stamp(q.skill===0?6:q.skill===1?3:q.skill===2?15:4,q.x,q.y,q.radius*2.5,q.radius*2,1,fade,0,true);if(q.kind==='yoga')stamp(8,q.x,q.y,105,90,1,.6*fade,0,true);}}
function impact(v){stamp(14,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max,0,true);}
function hud(f,x,y){k.bar(f.ringfitEnergy||0,['SQUAT','PLANK','CHEST PRESS','YOGA'][f.ringfitSkill||0],x,y,'#ffbb42');}
return{draw,drawObjects,impact,hud};})();
