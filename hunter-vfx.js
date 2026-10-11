'use strict';
const HunterVFX=(()=>{
 // All directional sprites are authored to the RIGHT. World reflection precedes local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.hunter?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1){const img=characterArt.hunter?.frames[40+n];if(!img)return;const s=Math.min(w/img.width,h/img.height);ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.drawImage(img,-img.width*s/2,-img.height*s/2,img.width*s,img.height*s);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rot:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,len:Math.hypot(dx,dy)};}
 function draw(f){const a=f.attack;if(!a)return;if(a.hunterCharge&&a.hold)stamp(1,f.x+f.face*25,f.y-48,80,48,f.face,.3+.5*a.charge);if(a.tackle&&f.timer>=5&&f.timer<=17&&!a.blocked)stamp(6,f.x+f.face*27,f.y-43,48,74,f.face,.6);if(a.tackle&&a.confirmed)stamp(7,f.x+f.face*30,f.y-47,45,45,f.face,.6);
  if(a.wirebug&&a.tether&&a.node){const x=f.x,y=f.y-48,dx=a.node.x-x,dy=a.node.y-y,d=direction({x1:x,y1:y,x2:a.node.x,y2:a.node.y});stamp(3,d.x,d.y,d.len,18,d.face,.85,d.rot);prop(5,a.node.x,a.node.y,28,28);}
  if(a.slinger&&f.timer<12)prop(a.pod??0,f.x+f.face*31,f.y-52,16,16,f.face);
  const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackBoxes(f)){const d=direction(b),fx=a.hunterEffect??(a.tackle?2:0);stamp(fx,d.x,d.y,d.len+26,w.shape==='spin'?84:49,d.face,.95,w.shape==='spin'?0:d.rot);}
 }
 function drawObjects(){for(const q of HunterRules.objects){const alpha=Math.min(1,(q.life-q.age)/5);if(q.kind==='pulse')stamp(q.pod==='flash'?4:5,q.x,q.y,q.radius*2,q.radius*2,1,alpha);else prop(q.kind==='stone'?0:q.kind==='flash'?1:q.kind==='sonic'?2:3,q.x,q.y,q.radius*2.5,q.radius*2.5,q.face);}}
 function impact(v){stamp(7,v.x,v.y,55+v.power*8,55+v.power*8,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='hunter')return;const a=f.attack;const title=a?.wirebug?'WIREBUG: AIM / B: RE-AIM / JUMP: RELEASE':a?.tackle?(a.confirmed?'GUARD CONFIRM: B TO COUNTER':'TACKLE: FRONT GUARD'):a?.slinger?'SLINGER: ↓ STONE / ← FLASH / ↑ SONIC / → PARA':'GREAT SWORD / TACKLE / WIREBUG / SLINGER';text(title,x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,prop,direction,draw,drawObjects,impact,hud};
})();
