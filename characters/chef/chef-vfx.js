'use strict';
const ChefVFX=(()=>{
 // Texture direction is native RIGHT. Apply translation, reflection, then local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.chef?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,rot=0){const img=characterArt.chef?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.ingredientThrow&&t<14)prop(4+a.ingredient,f.x+f.face*35,f.y-85,28,26,f.face);if(a.extinguisher){prop(8,f.x+f.face*22,f.y-39,38,65,f.face);}if(a.steamLift&&a.mounted){stamp(10,f.x,f.y+25,95,80,1,.8,Math.PI/2);if(t%6<3)stamp(6,f.x,f.y+12,65,40,1,.45);}if(a.dishDelivery&&!a.mealDropped&&t>=10&&t<=35)stamp(4,f.x-f.face*28,f.y-18,75,22,f.face,.4);
 const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b),n=a.extinguisher?7:a.steamLift?6:w.shape==='back'?4:a.type==='heavy'||a.type==='fair'?1:w.shape==='spin'?3:w.shape==='up'?8:a.type==='downsmash'?2:0;stamp(n,d.x,d.y,d.len+28,w.shape==='spin'?88:a.extinguisher?60:45,d.face,.86,d.rot);if(a.potToss)prop(3,f.x,f.y-96,55,55);if(a.type==='up')prop(4,f.x,f.y-98,25,25);if(a.type==='downsmash')prop(11,d.x,d.y,65,25,d.face);}}
 function drawObjects(){for(const q of ChefRules.objects){if(q.dead)continue;const face=Math.sign(q.vx)||q.face,rot=Math.atan2(q.vy,q.vx*face);if(q.kind==='puddle'){stamp(9,q.x,q.y,95,24,1,Math.min(1,(q.life-q.age)/15));continue;}if(q.kind==='meal'){stamp(12,q.x,q.y+10,75,40,1,Math.min(1,(q.life-q.age)/15));prop(9,q.x,q.y,65,35);continue;}if(q.kind==='pot'){stamp(6,q.x,q.y-25,50,65,1,.7);prop(3,q.x,q.y,48,48);continue;}stamp(5,q.x-face*10,q.y,35,16,face,.55,rot);prop(4+(q.ingredient||0),q.x,q.y,q.ingredient===3?35:27,26,face,q.age*.045);}}
 function impact(v){stamp(11,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='chef')text('FOOD '+['TOMATO','LETTUCE','MEAT','FISH'][f.attack?.ingredient??f.chefIngredient??0]+' / ↑B HOLD + RELEASE POT',x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,prop,draw,drawObjects,impact,hud};
})();
