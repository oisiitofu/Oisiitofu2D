'use strict';
const MetabeeVFX=(()=>{
 // Directional sources 0,1,2,3,5 point RIGHT. Translation, horizontal
 // reflection, then local rotation sends that axis along the actual shot.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,anchor=.5){const img=characterArt.metabee?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w*anchor,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,anchor=.5){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face),anchor);}
 function draw(f){const a=f.attack;if(!a)return;if(a.medaforce&&f.timer<26)stamp(6,f.x,f.y-56,125,125,1,.25+f.timer/60,frame*.04);for(const q of a.flashShots||[]){const dt=f.timer-q.at;if(dt>=0&&dt<4){const p=metabeeMuzzle(f,q.poseIndex,q.index);directed(q.kind,p.x,p.y,q.kind===5?70:58,40,p.angle+q.angleOffset,(4-dt)/4,0);}}
  if(a.ballistic)return;const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);directed(5,d.x,d.y,d.len+12,28,Math.atan2(b.y2-b.y1,b.x2-b.x1),.65);}}
 function drawObjects(){for(const q of MetabeeRules.objects){if(q.kind==='blast')stamp(4,q.x,q.y,q.radius*2,q.radius*2,1,Math.min(1,(q.life-q.age)/4));else directed(q.kind==='missile'?3:2,q.x,q.y,q.kind==='missile'?53:31,q.kind==='missile'?29:12,Math.atan2(q.vy,q.vx));}}
 function impact(v){stamp(7,v.x,v.y,48+v.power*4,48+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='metabee')return;text('MEDAFORCE '+Math.floor(f.medaforce||0)+'%',x+245,y+27,9,'#ffdb78','right');if(f.attack?.recoilBoost)text('RECOIL '+(3-f.attack.pulses),x+52,y+54,9,'#b3ebff','left');else if(f.medaforceCooldown>0)text('COOLDOWN '+Math.ceil(f.medaforceCooldown/60)+'s',x+52,y+54,8,'#b3c2db','left');}
 return{draw,drawObjects,impact,hud,stamp,directed};
})();
