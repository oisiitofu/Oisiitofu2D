'use strict';
const PokoaVFX=(()=>{
 // All directional source FX face RIGHT. Reflection comes before local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.pokoa?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.pokoa?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rot:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,len:Math.hypot(dx,dy)};}
 function body(f,alpha){const form=PokoaRules.form(f);if(!form)return false;const n=form==='lapras'?2+Math.floor(f.timer/7)%2:form==='dragonite'?(f.timer<28||f.attack.flapFrames>0?4:5):0,img=characterArt.pokoa?.frames[40+n];if(!img)return false;const s=Math.min((form==='lapras'?116:form==='dragonite'?112:55)/img.width,(form==='lapras'?87:form==='dragonite'?96:48)/img.height),w=img.width*s,h=img.height*s;ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.face,1);ctx.globalAlpha*=alpha;if(f.inv)ctx.globalAlpha*=.7;ctx.drawImage(img,-w/2,-h,w,h);ctx.restore();return true;}
 function draw(f){const a=f.attack;if(!a)return;
  if((a.surf||a.dragonGlide)&&f.timer>=3&&f.timer<=12)stamp(5,f.x,f.y-35,75,75,1,.7);
  if(a.magnetRise){stamp(4,f.x,f.y-4,68,30,1,.8);if(f.timer>=12){ctx.save();ctx.strokeStyle='#fff39b';ctx.lineWidth=1.4;ctx.setLineDash([3,5]);ctx.beginPath();ctx.ellipse(f.x,f.y-36,32,42,0,0,TAU);ctx.stroke();ctx.restore();}}
  if(a.dragonGlide&&f.timer>=12&&f.timer%5<3)stamp(6,f.x-f.vx*2,f.y-25,45,22,f.face,.3);
  const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){const d=direction(b),fx=a.pokoaEffect??0;
   if(w.shape==='spin')stamp(fx,d.x,d.y,d.len+25,55,1,.9);
   else if(fx===2)stamp(2,d.x,d.y,d.len+20,70,d.face,.9);
   else stamp(fx,d.x,d.y,d.len+18,fx===7?36:30,d.face,.9,d.rot);
  }
 }
 function drawObjects(){for(const q of PokoaRules.objects){const fade=Math.min(1,(q.life-q.age)/6);if(q.kind==='surf')stamp(3,q.x+q.face*13,q.y,110,58,q.face,fade);else{const d=direction(PokoaRules.box(q));stamp(1,q.x,q.y,q.radius*4,q.radius*2,d.face,fade,d.rot);}}}
 function impact(v){stamp(7,v.x,v.y,48+v.power*8,48+v.power*8,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='pokoa')return;const a=f.attack;text(a?.surf?'SURF: ← → STEER / JUMP: RELEASE':a?.dragonGlide?'GLIDE: ← → / JUMP: ONE FLAP':a?.magnetRise?'MAGNET: '+Math.max(0,a.floatBudget)+'F':'WATER / SURF / GLIDE',x+52,y+54,8,'#d9dbff','left');}
 return{stamp,prop,direction,body,draw,drawObjects,impact,hud};
})();
