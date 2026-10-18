'use strict';
const NierVFX=(()=>{
 // Slash 0 leads LEFT and is normalized by SlashVFX; shots 1..3 lead RIGHT. Pillar 4 points UP. The order is translation,
 // horizontal reflection, then local rotation. Book props stay unrotated.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,anchor=.5){const img=characterArt.nier?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;SlashVFX.image('nier',n,img,-w*anchor,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,anchor=.5){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face),anchor);}
 function draw(f){if(f.respawn)return;const a=f.attack,casting=a&&(a.magicBullet||a.spellLance||a.spellClaw||a.spellWave||a.darkLance||a.magicChange||a.darkHand),book=characterArt.nier?.frames[casting?41:40];if(book){ctx.save();const p=BattleSize.point(f,{x:f.x-f.face*35,y:f.y-82}),s=BattleSize.geometry(f);ctx.translate(p.x,p.y+Math.sin(frame*.06)*3);AttackEffects.image(book,-18*s,-18*s,36*s,36*s);ctx.restore();}
  if(!a)return;if(a.hold||a.magicChange)stamp(5,f.x,f.y-58,105,105,1,.35,frame*.025);
  if(a.darkHand&&f.timer>=9&&!a.released&&a.castOrigin){const start={x:f.x,y:f.y-65},end=a.latched?a.anchor:nierHandEnd(f,a),dx=end.x-start.x,dy=end.y-start.y,len=Math.hypot(dx,dy);directed(3,start.x,start.y,len+15,49,Math.atan2(dy,dx),.9,0);return;}
  const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){if(a.magicPillar){stamp(4,(b.x1+b.x2)/2,(b.y1+b.y2)/2,72,Math.abs(b.y2-b.y1)+38,f.face,.9);continue;}if(w.shape==='spin'){stamp(a.spellWave?6:0,f.x,f.y-60,a.spellWave?190:160,a.spellWave?190:95,f.face,.85);continue;}directed(a.spellClaw?3:a.darkSmash?2:0,b.x1,b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+20,a.spellClaw?48:42,Math.atan2(b.y2-b.y1,b.x2-b.x1),.85,0);}}
 function drawObjects(){for(const q of NierRules.objects)directed(q.kind==='lance'?2:1,q.x,q.y,q.kind==='lance'?92:44,q.kind==='lance'?40:24,Math.atan2(q.vy,q.vx));}
 function impact(v){stamp(7,v.x,v.y,48+v.power*4,48+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='nier')return;text(NierSpellNames[f.nierMagic||0],x+245,y+27,10,'#f8c3d7','right');if(f.nierMagicTime>0)text('MAGIC '+Math.ceil(f.nierMagicTime/60)+'s',x+52,y+54,9,'#cfd2dd','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
