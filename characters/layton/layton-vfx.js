'use strict';
const LaytonVFX=(()=>{
 // The coin texture leads LEFT (coin at left, trailing light on right).
 // Other moving artwork is symmetric or leads RIGHT. Apply translation,
 // source-facing reflection, then local rotation onto the world hit segment.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.layton?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const source=n===0?-1:1,worldFace=Math.cos(angle)<0?-1:1,face=worldFace*source,rot=source*Math.atan2(Math.sin(angle),Math.cos(angle)*worldFace);stamp(n,x,y,w,h,face,alpha,rot);}
 function prop(n,x,y,w,h,face=1,alpha=1){const img=characterArt.layton?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;if(a.hold){const p=laytonPoint(f,13);stamp(0,p.x,p.y,40+a.charge*35,30+a.charge*25,-f.face,.75);}if(a.puzzleJump&&a.stepRest)stamp(1,f.x,f.y+5,64,24,1,.85);const w=CombatData.activeWindow(a,f.timer);if(!w)return;if(a.bookStack){for(let n=0;n<3;n++)stamp(3,f.x+f.face*20,f.y-60-n*38,70,45,f.face,.9);return;}if(a.bulbBurst){stamp(4,f.x,f.y-50,170,145,1,.85);return;}for(const b of attackVisualBoxes(f)){if(w.shape==='spin'){stamp(5,f.x,f.y-52,135,105,1,.7);continue;}const d=AdolVFX.direction(b);if(a.type==='smash')stamp(3,d.x,d.y,d.len+70,65,d.face,.85,d.rot);else stamp(5,d.x,d.y,d.len+35,35,d.face,.45,d.rot);}}
 function drawObjects(){for(const q of LaytonRules.objects){const alpha=Math.min(1,(q.life-q.age)/10);if(q.kind==='coin')directed(0,q.x,q.y,q.radius*5,q.radius*3.8,Math.atan2(q.vy,q.vx),alpha);else if(q.kind==='panel')stamp(2,q.x,q.y,56,85,q.face,alpha);else if(q.kind==='step')stamp(1,q.x,q.y,64,24,1,alpha*.7);else if(q.kind==='piece')stamp(1,q.x,q.y-8*Math.sin(q.age*.04),22,16,1,alpha);else if(q.kind==='luke')prop(q.support===2?2:0,q.x,q.y,52,66,q.face,alpha);else if(q.kind==='apple')prop(1,q.x,q.y+12,25,26,1,alpha);}for(const f of fighters)if(f.laytonThink>0&&!f.respawn)stamp(2,f.x,f.y-115,25,34,1,.75);}
 function impact(v){stamp(7,v.x,v.y,45+v.power*4,45+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='layton')return;text('↓B '+['コイン','回復りんご','ヒントパネル'][f.laytonSupport||0]+(f.laytonSupportCooldown>0?' '+Math.ceil(f.laytonSupportCooldown/60)+'s':''),x+245,y+27,9,'#ffd985','right');if(f.attack?.puzzleJump&&!f.attack.finished)text('↑B '+f.attack.stepCount+'/3段・必殺を押し直して次の足場',x+52,y+54,9,'#9decff','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
