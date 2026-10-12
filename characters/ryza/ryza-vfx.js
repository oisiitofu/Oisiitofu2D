'use strict';
const RyzaVFX=(()=>{
 // FX0 is authored pointing RIGHT. Reflect in local fighter space BEFORE
 // rotating, so its nose tracks the capsule for either facing direction.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.ryza?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,h,face=1,alpha=1,rot=0){const img=characterArt.ryza?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-h*img.width/img.height/2,-h/2,h*img.width/img.height,h);ctx.restore();}
 function direction(box){const dx=box.x2-box.x1,dy=box.y2-box.y1,face=dx<0?-1:1;return{face,rotation:Math.atan2(dy,dx*face),x:(box.x1+box.x2)/2,y:(box.y1+box.y2)/2,length:Math.hypot(dx,dy)};}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,90+v.power*13,90+v.power*13,1,(1-u)**1.7);}
 function drawObjects(){for(const q of RyzaRules.objects){const d=RyzaRules.items[q.index],alpha=Math.min(1,(q.life-q.age+1)/8);if(q.kind==='item'){prop(q.charged&&q.index<3?5+q.index:q.index,q.x,q.y,q.charged?40:30,q.face,alpha,q.age*.09);continue;}const n=[2,3,4,5][q.index],height=q.index===0?q.radius*1.6:q.index===3?62:84;stamp(n,q.x,q.y-height*.4,q.radius*2,height,1,alpha);if(q.index===3)stamp(1,q.x,q.y-8,q.radius*1.7,24,1,.35*alpha);}
  for(const f of fighters){if(f.characterId!=='ryza')continue;const a=f.attack;if(a?.synthesis&&f.timer<=a.craftFrame){prop(4,f.x+f.face*26,f.y-22,42,f.face,.85);prop(a.selected,f.x+f.face*26,f.y-67,30,f.face);stamp(1,f.x+f.face*26,f.y-48,65+a.charge*30,52,1,.55);text(RyzaRules.items[a.selected].name+(a.charge>=.5?' ★':''),f.x,f.y-115,11,'#ffdc95');}if(a?.glideStep&&f.timer>=a.launchFrame&&f.timer<=a.glideEnd){stamp(6,f.x,f.y-18,110,90,1,.65);if(f.timer>=a.glideStart)text('←→ / ↑↓ / X・Aで解除',f.x,f.y-120,10,'#c4e9ff');}}
 }
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.hold&&a.swingCharge)stamp(1,f.x,f.y-35,60+a.charge*55,65+a.charge*45,1,.55);if(a.glideStep||a.synthesis||a.itemThrow||a.dropBomb)return;
  const w=CombatData.activeWindow(a,t);if(!w)return;
  if(a.corePillar){stamp(1,f.x,f.y-a.pillarHeight*.5,90,a.pillarHeight,1,1);stamp(7,f.x,f.y-a.pillarHeight,95,80);return;}
  if(a.barrelCrash){prop(0,f.x-55,f.y-18,42);prop(5,f.x+55,f.y-18,45);stamp(2,f.x,f.y-32,a.reach*FIGHTER_SCALE*2,100);return;}
  const boxes=attackVisualBoxes(f);for(const b of boxes){const d=direction(b);stamp(0,d.x,d.y,d.length+b.radius*2,b.radius*4,d.face,1,d.rotation);}
 }
 function hud(f,x,y){if(f.characterId!=='ryza')return;const item=f.ryzaItem;text(item?'ITEM / '+RyzaRules.items[item.index].name+(item.charged?' ★':''):'ALCHEMY / Xで調合',x+52,y+54,8,'#ffdc95','left');}
 return{stamp,prop,direction,impact,drawObjects,draw,hud};
})();
