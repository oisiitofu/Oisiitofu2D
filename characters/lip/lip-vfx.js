'use strict';
const LipVFX=(()=>{const k=CharacterVFXKit.create('lip'),{stamp}=k;
 // Petal 0 convex RIGHT; canopy 1 convex UP. Panels, hearts and stars are
 // props/bursts, never classify them as sword arcs. Local rotation then face.
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){if(a.type==='upsmash')stamp(3,e.x,e.t+23,46,46,1,.9);else if(a.type==='uair')stamp(3,e.x,e.t+20,42,42,1,.85);else if(e.upper){const h=33;stamp(1,e.x,e.t+h/2,e.w,h,1,.8);}else if(a.type==='bair')stamp(2,e.x,e.y,e.w,44,1,.75);else if(a.type==='smash'){stamp(13,e.x,e.y,e.w,44,f.face,.85);stamp(0,e.x,e.y,e.w,28,f.face,.5);}else if(a.type==='downsmash'){stamp(11,e.l+e.w*.25,e.y,e.w*.5,46,1,.8);stamp(11,e.r-e.w*.25,e.y,e.w*.5,46,1,.8);}else if(a.type==='dair')stamp(11,e.x,e.y,55,50,1,.8);else stamp(0,e.x,e.y,e.w,Math.min(38,e.h),f.face,.8,a.type==='air'?-.4:0);}if(a.lipShot&&!a.fired)stamp(LipColorFX[a.color],f.x+f.face*27,f.y-42,17,17,1,.8,0,true);if(a.lipLift&&a.phase==='arc')stamp(10,f.x,f.y-28,65,87,f.face,.45,0,true);}
 function drawObjects(){for(const q of LipRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/9);if(q.kind==='panel'||q.kind==='shot'){stamp(LipColorFX[q.color],q.x,q.y,q.kind==='panel'?28:26,q.kind==='panel'?28:26,1,fade,0,true);if(q.chainAt)stamp(3,q.x,q.y,34,34,1,.3+Math.sin(frame*.35)*.2,0,true);}if(q.kind==='pop')stamp(q.color===0?2:q.color===1?3:11,q.x,q.y,q.radius*2,q.radius*1.6,1,fade,0,true);if(q.kind==='flower')stamp(9,q.x,q.y-3,77,31,1,fade,0,true);}}
 function impact(v){stamp(3,v.x,v.y,32+v.power*3,32+v.power*3,1,v.life/v.max,0,true);}
 function hud(f,x,y){stamp(LipColorFX[f.lipColor||0],x+158,y+25,23,23,1,1,0,true);text(LipColors[f.lipColor||0],x+174,y+28,9,'#ffc1e8','left');text('SET '+lipPanels(f).length+'/5  CHAIN '+(f.lipChainCount||0)+(f.lipCharged?' ★':''),x+148,y+43,8,'#d5ecff','left');}
 return{draw,drawObjects,impact,hud};})();

