'use strict';
const AkiraVFX=(()=>{
 // Slash 1 leads LEFT and is normalized by SlashVFX. Other directional sprites lead RIGHT: translate -> horizontal reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.akira?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;SlashVFX.image('akira',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,w,h,face=1,rot=0){const img=characterArt.akira?.frames[40+n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function legion(n,x,y,size=85,face=1,rot=0){const img=characterArt.akira?.frames[40+n];if(!img)return;const s=size/Math.max(img.width,img.height);prop(n,x,y,img.width*s,img.height*s,face,rot);}
 function chain(f,p){const dx=p.x-f.x,dy=p.y-(f.y-62),len=Math.hypot(dx,dy),face=dx<0?-1:1;prop(6,(f.x+p.x)/2,(f.y-62+p.y)/2,len,12,face,Math.atan2(dy,dx*face));}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.legionChange){const n=t<12?a.selection:a.legion;legion(n,f.x+f.face*65,f.y-85,90,f.face);stamp(6,f.x+f.face*65,f.y-20,65,90,1,.45);}if(a.legionLift&&a.launched){const p=a.anchor&&!a.released?a.anchor:{x:f.x,y:f.y-100};if(!a.released)chain(f,p);legion(a.legion,p.x,p.y,95,f.face);if(a.released&&t-a.releaseFrame<8)stamp(8,f.x-f.vx*2,f.y-55,100,45,Math.sign(f.vx)||f.face,.6,-.6);}
 if(a.syncAttack&&t>=17&&t<=24)stamp(10,f.x,f.y-65,85,85,1,.7);const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b),n=a.syncAttack&&a.syncOK&&t>=28?9:a.legion===1?2:a.legion===2?3:a.legion===3?4:w.shape==='spin'?5:w.shape==='back'?0:1;stamp(n,d.x,d.y,d.len+28,w.shape==='spin'?95:55,d.face,.87,d.rot);if(!a.legionLift){const p={x:b.x2,y:b.y2};chain(f,p);legion(a.legion,p.x,p.y,82,d.face,d.rot);}}}
 function drawObjects(){for(const q of AkiraRules.objects){const f=fighters[q.owner],face=Math.sign(q.vx)||q.face,rot=Math.atan2(q.vy,q.vx*face);if(q.kind==='remote'){chain(f,q);legion(q.legion,q.x,q.y,q.legion===2?105:90,face);stamp(q.returning?15:q.legion===3?4:8,q.x-face*22,q.y,65,35,face,.5,rot);}else stamp(2,q.x,q.y,48,20,face,.9,rot);}}
 function impact(v){stamp(11,v.x,v.y,50+v.power*5,50+v.power*5,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId==='akira')text('LEGION '+AkiraRules.legions[f.akiraLegion||0].name+' / ↑B CHAIN LIFT / ↓B SYNC',x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,prop,legion,chain,draw,drawObjects,impact,hud};
})();
