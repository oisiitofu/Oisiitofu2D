'use strict';
const ElzaVFX=(()=>{const k=CharacterVFXKit.create('elza'),{stamp}=k;
// Source-visible axes are normalized before local rotation, then facing reflection.
// Crescent 0 is convex RIGHT; canopy 1 convex UP. Chain/field are not curves.
function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){if(['up','upsmash','uair'].includes(a.type))stamp(1,e.x,e.t+Math.min(30,e.h*.4),e.w,48,1,.85);else if(a.type==='downsmash'||a.type==='air'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,38,-f.face,.85);stamp(0,e.r-e.w*.25,e.y,e.w*.5,38,f.face,.85);}else stamp(0,e.x,e.y,e.w,Math.min(58,e.h),a.type==='bair'?-f.face:f.face,.9,a.type==='dair'?Math.PI/2:0);}
if(a.type==='dash'&&a.phase==='ledge'||a.type==='rise'&&a.hookX!==undefined){line([[f.x,f.y-50],[a.hookX,a.hookY]],'#bbc7d3',3);stamp(2,(f.x+a.hookX)/2,(f.y-50+a.hookY)/2,Math.hypot(a.hookX-f.x,a.hookY-f.y+50),18,1,.85,Math.atan2(a.hookY-f.y+50,a.hookX-f.x),true);}if(['gale','airDrop'].includes(a.type)&&f.timer<18)stamp(4,f.x,f.y-38,95,40,1,.5,0,true);}
function drawObjects(){for(const q of ElzaRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/9);
if(q.kind==='gather')stamp(4,q.x,q.y+27,105,42,1,(q.absorbed?.9:.55)*fade,0,true);if(q.kind==='hook'){const f=fighters[q.owner];if(f)line([[f.x,f.y-48],[q.x,q.y]],'#b9c3d3',3);stamp(2,q.x,q.y,65,22,q.face,fade,0,true);}if(q.kind==='wind')stamp(3,q.x,q.y,88,60,q.face,fade,0,true);}}
function impact(v){stamp(14,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max,0,true);}
function hud(f,x,y){const g=ElzaRules.objects.find(q=>q.owner===f.id&&q.kind==='gather');text(g?(g.absorbed?'GATHER / CHARGED':'GATHER / SET'):'CHAIN & SWORD',x+149,y+24,8,'#badfff','left');}
return{draw,drawObjects,impact,hud};})();
