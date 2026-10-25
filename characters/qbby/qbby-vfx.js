'use strict';
const QbbyVFX=(()=>{const k=CharacterVFXKit.create('qbby'),{stamp}=k;
// Source-visible axes are normalized before local rotation, then facing reflection.
// Block edges, steps and fragments are rectangular, never upper slash curves.
function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){if(['up','upsmash','uair'].includes(a.type))stamp(1,e.x,e.t+Math.min(30,e.h*.4),e.w,Math.min(e.h,70),1,.85);else if(a.type==='downsmash'||a.type==='air'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,38,-f.face,.85);stamp(0,e.r-e.w*.25,e.y,e.w*.5,38,f.face,.85);}else stamp(0,e.x,e.y,e.w,Math.min(58,e.h),a.type==='bair'?-f.face:f.face,.9,a.type==='dair'?Math.PI/2:0);}
if(a.type==='rise'&&a.phase==='stairs')stamp(11,f.x,f.y+4,28,20,1,.6,0,true);if(a.type==='dash'&&a.phase==='ledge'){line([[f.x,f.y-32],[a.hookX,a.hookY]],'#f8ffff',6);stamp(3,a.hookX,a.hookY,30,30,f.face,.9,0,true);}}
function drawObjects(){for(const q of QbbyRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/9);
if(q.kind==='stair')stamp(0,q.x,q.y,46,46,q.face,.8*fade,0,true);if(q.kind==='shot')stamp(2,q.x,q.y,30+q.blocks*22,36,q.face,fade,0,true);if(q.kind==='hook'){const f=fighters[q.owner];if(f)line([[f.x,f.y-32],[q.x,q.y]],'#f4f7fa',8);stamp(3,q.x,q.y,42,44,q.face,fade,0,true);}if(q.kind==='press')stamp(6,q.x,q.y,115,75,1,fade,0,true);}}
function impact(v){stamp(14,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max,0,true);}
function hud(f,x,y){text('BOX '+QbbyRules.objects.filter(q=>q.owner===f.id&&q.kind==='stair').length,x+149,y+24,8,'#f4f9ff','left');}
return{draw,drawObjects,impact,hud};})();
