'use strict';
const LeonVFX=(()=>{
 // Assets0..3 point RIGHT, slash3 convex RIGHT/open LEFT.
 // Transform order: translate, final facing reflection, then local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.leon?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1,rot=Math.atan2(Math.sin(angle),Math.cos(angle)*face);stamp(n,x,y,w,h,face,alpha,rot);}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.leonMarked>0)stamp(7,f.x,f.y-48,125,125,1,.3);if(!a)return;
  if(a.leonGrapple&&a.tip&&a.phase!=='release'){const rr=LeonArtRects.frames[38],ss=leonNativeScale(38)*FIGHTER_SCALE,p=a.phase==='pull'?{x:f.x+LeonArtRects.grip[0]*rr[2]*ss*f.face,y:f.y-LeonArtRects.grip[1]*rr[3]*ss}:leonWeapon(f,43)[1],tip=a.tip;ctx.save();ctx.strokeStyle='#cedbec';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);if(a.route||a.tipRoute){const route=a.anchor.route;ctx.lineTo(route.x,route.y);}ctx.lineTo(tip.x,tip.y);ctx.stroke();ctx.fillStyle='#d6e5f7';ctx.beginPath();ctx.arc(tip.x,tip.y,5,0,TAU);ctx.fill();ctx.restore();}
  if(a.leonGun){const shots=a.weapon===0?[12,20,28]:a.weapon===2?[12,15,18,21,24,27,30,33]:[12];if(shots.includes(f.timer)){const p=leonWeapon(f,pose(f))[1];directed(a.weapon===1?1:a.weapon===3?2:0,p.x+f.face*18,p.y,65,32,f.face>0?0:Math.PI,.8);}return;}
  for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b),angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),n=b.window.pose??a.pose;if(a.grenadeSmash)stamp(5,d.x,d.y,110,110,1,.8);else directed([6,7,12,40].includes(n)?n===40?1:0:3,d.x,d.y,d.len+35,55,angle,.75);}
 }
 function drawObjects(){for(const q of LeonRules.objects){const alpha=Math.min(1,(q.life-q.age)/8);if(q.kind==='bullet')directed(q.weapon===3?2:q.weapon===1?1:0,q.x,q.y,q.weapon===3?60:35,14,Math.atan2(q.vy,q.vx),alpha);else if(q.kind==='heal')stamp(6,q.x,q.y,115,115,1,alpha*.65);else if(q.kind==='sensor'){ctx.save();ctx.fillStyle='#b5c2d0';ctx.fillRect(q.x-9,q.y-5,18,10);ctx.restore();if(q.age%45<10)stamp(7,q.x,q.y,240,160,1,.2);}else if(q.burst)stamp(q.kind==='flash'?5:4,q.x,q.y,q.radius*2,q.radius*2,1,alpha*(q.kind==='flash'?.8:.55));else{ctx.save();ctx.fillStyle=q.kind==='flash'?'#e2e8f0':'#bd642f';ctx.beginPath();ctx.arc(q.x,q.y,7,0,TAU);ctx.fill();ctx.restore();}}}
 function impact(v){stamp(0,v.x,v.y,45+v.power*2,45+v.power*2,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='leon')return;text('B '+LeonWeapons[f.leonWeapon||0],x+245,y+27,9,'#adcaff','right');text(f.leonItemCooldown>0?'アイテム '+Math.ceil(f.leonItemCooldown/60)+'s':'↓B '+LeonItems[f.leonItem||0],x+52,y+54,9,'#b9c9dc','left');if(f.attack?.leonTackle&&f.attack.followVictim!==null&&f.timer<=f.attack.followWindow)text('必殺を押し直して体術',f.x,f.y-120,11,'#f9dfa2');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
