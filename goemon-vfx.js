'use strict';
const GoemonVFX=(()=>{
 // Source1 leads LEFT and is normalized by SlashVFX; sources 0/2/3/5 lead RIGHT. World translate -> face reflection -> local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.goemon?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;SlashVFX.image('goemon',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function chain(from,to){const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy),steps=Math.max(1,Math.ceil(len/10)),angle=Math.atan2(dy,dx);ctx.save();ctx.strokeStyle='#dbe4f2';ctx.lineWidth=3;ctx.shadowColor='#111b2d';ctx.shadowBlur=2;for(let j=0;j<steps;j++){ctx.save();ctx.translate(from.x+dx*j/steps,from.y+dy*j/steps);ctx.rotate(angle);ctx.beginPath();ctx.ellipse(0,0,6,j%2?2.5:4,0,0,TAU);ctx.stroke();ctx.restore();}ctx.restore();}
 function draw(f){const a=f.attack;if(f.impactTime>0)stamp(6,f.x,f.y-54,105,143,1,.25+Math.sin(frame*.2)*.04);if(!a)return;const t=f.timer;
  if(a.sudaImpact&&t>=15&&t<=32)stamp(6,f.x,f.y-57,125,155,1,.55);
  if(a.coinThrow&&a.hold)stamp(2,f.x+f.face*44,f.y-48,26+a.charge*24,30+a.charge*25,f.face,.8);
  if(a.kiseruHook&&a.anchor&&!a.released){const sprite=characterArt.goemon.frames[38],grip=f.character.ledgeGrip,scale=.57*FIGHTER_SCALE,from={x:f.x+f.face*sprite.width*scale*grip[0],y:f.y-sprite.height*scale*grip[1]},main=platforms.find(p=>p.main);if(a.escapeSide){const edge={x:a.escapeSide<0?main.x-25:main.x+main.w+25,y:main.y+104};chain(from,edge);chain(edge,a.anchor);}else chain(from,a.anchor);const img=characterArt.goemon.frames[41];const dx=a.anchor.x-from.x,dy=a.anchor.y-from.y,face=Math.sign(dx)||f.face;ctx.save();ctx.translate(a.anchor.x,a.anchor.y);ctx.scale(face,1);ctx.rotate(Math.atan2(dy,dx*face));ctx.drawImage(img,-30,-7,40,14);ctx.restore();}
  const w=CombatData.activeWindow(a,t);if(!w)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b);if(w.shape==='spin'){stamp(4,d.x,d.y,151,81,f.face,.85,(a.kiseruSpin?(t-10):t)*.12);continue;}stamp(a.type.includes('smash')?1:0,d.x,d.y,d.len+25,45,d.face,.85,d.rot);}
 }
 function drawObjects(){for(const q of GoemonRules.objects){const face=Math.sign(q.vx)||q.face;stamp(q.kind==='firecoin'?3:2,q.x,q.y,q.kind==='firecoin'?95:57,q.kind==='firecoin'?51:35,face,1,Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(7,v.x,v.y,48+v.power*4,48+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId==='goemon')text(f.impactTime>0?'強化 '+Math.ceil(f.impactTime/60)+'s / 被ダメージ増':f.impactCooldown>0?'強化 待機 '+Math.ceil(f.impactCooldown/60)+'s':'↓B スーダンインパクト',x+245,y+27,8,'#ffe69b','right');}
 return{stamp,draw,drawObjects,impact,hud};
})();
