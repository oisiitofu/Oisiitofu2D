'use strict';
const ElliotVFX=(()=>{const k=CharacterVFXKit.create('elliot'),{stamp}=k;
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){if(e.upper)stamp(2,e.x,e.t+Math.min(42,e.h)/2,e.w,Math.min(42,e.h),1,.9);else if(a.type==='dair')stamp(3,e.x,e.y,e.w,Math.min(42,e.h),1,.9);else if(['heavy','dashAttack','downsmash','low'].includes(a.type))stamp(11,e.x,e.y,e.w,e.h,f.face,.85);else if(a.type==='jab'){// Rising blade ends up-left in the authored pose: convex paint follows its actual edge.
 stamp(0,e.x,e.y,e.w,e.h,f.face,.9,-Math.PI*.75);
 }else stamp(0,e.x,e.y,e.w,Math.min(42,e.h),e.back?-f.face:f.face,.9);}
 if(a.elliotArrow&&a.phase==='aim'){const q=elliotFei(f);if(q)stamp(12,q.x+a.aimX*45,q.y+a.aimY*45,19,19,1,.65,0,true);}
 if(a.elliotMap&&!a.placed&&a.goal)stamp(13,a.goal.x,a.goal.y-8,53,28,1,.6,0,true);
 if(a.elliotAnchor&&['route','ready'].includes(a.phase)){const q=elliotFei(f);if(q){ctx.save();ctx.strokeStyle='#99eaff99';ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(f.x,f.y-40);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();if(a.phase==='ready')stamp(12,q.x,q.y,40,40,1,.8,0,true);}}
 }
 function drawObjects(){for(const q of ElliotRules.objects){if(q.dead)continue;const f=fighters[q.owner];if(q.kind==='fei'){const n=q.phase==='carry'?8:q.tired?9:q.phase==='aim'?6:q.phase==='fire'?7:q.reactUntil>q.age?7:Math.floor(frame/9)%2?5:4,r=ElliotArtRects.effects[n],s=29/ElliotArtRects.effects[4][3]*BattleSize.art('elliot');stamp(n,q.x,q.y,r[2]*s,r[3]*s,q.face||f.face,1,0,true);}else if(q.kind==='beacon'){const fade=Math.min(1,(q.life-q.age)/20);stamp(13,q.x,q.y-8,51,29,1,fade,0,true);stamp(12,q.x,q.y-22,18,18,1,(q.age>=30?.85:.4)*fade,0,true);}else if(q.kind==='arrow')stamp(10,q.x,q.y,43,17,1,1,Math.atan2(q.vy,q.vx),true);}}
 function impact(v){stamp(11,v.x,v.y,28+v.power*2,28+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){text('地図 '+elliotBeacons(f).length+' / 2',x+147,y+23,9,'#c0ecff','left');text('FEI '+Math.max(0,42-(f.elliotCarrySpent||0))+' / 42',x+147,y+41,8,'#fff1b7','left');}
 return{draw,drawObjects,impact,hud};})();
