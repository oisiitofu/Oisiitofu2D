'use strict';
const JibanyanVFX=(()=>{
 // Sources 0..3 point RIGHT. Translation -> horizontal reflection -> local
 // rotation maps that direction onto the actual world hit segment. Rings are centered.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,anchor=.5){const img=characterArt.jibanyan?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w*anchor,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,anchor=.5){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face),anchor);}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;if(a.hold){const p=jibanyanPoint(f,13);stamp(1,p.x,p.y,30+a.charge*40,30+a.charge*40,f.face,.7);}if(a.tailFlight&&a.launched&&!a.escapeSide)stamp(4,f.x,f.y-45,a.gliding?105:135,a.gliding?65:85,1,a.gliding?.4:.7,frame*.08);const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackBoxes(f)){if(a.tailFlight)continue;if(a.ghostBurst){stamp(4,f.x,f.y-35,190,90,1,.9);continue;}if(a.ghostVortex){stamp(4,f.x,f.y-85,110,150,1,.9);continue;}if(w.shape==='spin'){stamp(4,f.x,f.y-40,140,100,1,.75);continue;}directed(a.ghostRush?3:0,b.x1,b.y1,Math.hypot(b.x2-b.x1,b.y2-b.y1)+30,55,Math.atan2(b.y2-b.y1,b.x2-b.x1),.85,0);}}
 function drawObjects(){for(const q of JibanyanRules.objects)if(q.kind==='haunt')stamp(5,q.x,q.y,48,48,1,.8,q.age*.07);else directed(q.charged?2:1,q.x,q.y,q.radius*5,q.radius*3.6,Math.atan2(q.vy,q.vx),.95,.75);for(const f of fighters)if(f.jibanyanHaunt>0&&!f.respawn)stamp(5,f.x,f.y-50,105,115,1,.32+.08*Math.sin(frame*.18),frame*.035);}
 function impact(v){stamp(7,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='jibanyan')return;text(f.jibanyanHauntCooldown>0?'とりつき待機 '+Math.ceil(f.jibanyanHauntCooldown/60)+'s':'↓B とりつき',x+245,y+27,9,'#c9b5ff','right');if(f.attack?.tailFlight)text(f.attack.gliding?'滑空中':'長押し：上昇／離す：滑空',x+52,y+54,9,'#a4efff','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
