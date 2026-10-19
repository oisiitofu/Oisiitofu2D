'use strict';
const ViridiVFX=(()=>{
 // Reviewed source0 is a C with convex edge LEFT, source1 convex UP. Never
 // assume right-facing source art; AttackEffects receives the original texture.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.viridi?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;const d=AdolVFX.direction(b),upper=['up','upsmash','uair'].includes(a.type),n=upper?1:a.type==='low'||a.type==='downsmash'?10:0;stamp(n,d.x,d.y,d.len+2*b.radius,upper?80:2*b.radius,d.face,.9,d.rot+(upper?Math.PI/2:0));}
  if(a.viridiWarp&&a.warpAt!=null){const dt=f.timer-a.warpAt;if(dt<23){stamp(8,a.warpFrom.x,a.warpFrom.y-12,92,40,1,Math.max(0,1-dt/23));stamp(8,a.warpTo.x,a.warpTo.y-12,92,40,1,.75);stamp(9,f.x,f.y-30,62,88,1,.65);}}
  if(a.viridiCrag&&f.timer<19)stamp(13,f.x+f.face*40,f.y-40,45,45,1,f.timer/30);
  if(a.viridiSeed&&f.timer<18)stamp(6,f.x+f.face*25,f.y-16,30,36,1,.85);
 }
 function drawObjects(){for(const q of ViridiRules.objects){if(q.kind==='crag')stamp(q.age<8?4:5,q.x,q.y,65,63,q.face);else if(q.kind==='seed'){stamp(6,q.x,q.y,30,36,1);if(q.plantedAt!=null){const progress=clamp((q.age-q.plantedAt)/65,0,1);stamp(8,q.x,q.y+12,48+progress*90,16+progress*18,1,.2+progress*.5);}}else if(q.kind==='roots')stamp(7,q.x,q.y-45,150,135,1,Math.min(1,(q.life-q.age)/3));}}
 function impact(v){stamp(3,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='viridi')return;const crag=ViridiRules.objects.some(q=>q.owner===f.id&&q.kind==='crag'),seed=ViridiRules.objects.some(q=>q.owner===f.id&&q.kind==='seed');text(crag?'クラガラン 行進中':f.viridiCragCooldown>0?'クラガラン あと'+Math.ceil(f.viridiCragCooldown/60)+'秒':'クラガラン 準備OK',x+239,y+14,9,'#d4efad','right');if(seed)text('リセットボム 設置中',x+239,y+28,9,'#ffb8d3','right');}
 return{stamp,draw,drawObjects,impact,hud};
})();
