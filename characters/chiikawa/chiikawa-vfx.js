'use strict';
const ChiikawaVFX=(()=>{
 function stamp(n,x,y,width,height,face=1,alpha=1){const img=characterArt.chiikawa?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;AttackEffects.image(img,-width/2,-height,width,height);ctx.restore();}
 function star(x,y,r,t){ctx.save();ctx.translate(x,y);ctx.rotate(t);const points=[];for(let j=0;j<10;j++){let a=-Math.PI/2+j*Math.PI/5,rr=j%2?r*.45:r;points.push([Math.cos(a)*rr,Math.sin(a)*rr]);}path(points,'#fff5a5','#efb949',1);ctx.restore();}
 function guard(f){stamp(7,f.x,f.y+8,87,87,1,.65);}
 function draw(f){let a=f.attack;if(!a)return;const t=f.timer;
  if(a.helperAttack&&t>=7&&t<=37){const p=clamp((t-7)/16,0,1),x=f.x+f.face*(20+p*82),fade=Math.min(1,(t-6)/4,(38-t)/6);stamp(t<21?0:1,x,f.y,110,84,f.face,fade);}
  if(a.hold){const glow=.5+.5*Math.sin(frame*.2);star(f.x+f.face*32,f.y-52,5+glow*3,frame*.04);return;}
  let w=CombatData.activeWindow(a,t),live=!!w;if(!w)w=a.activeFrames.filter(v=>v.end<t).at(-1);if(!w)return;const age=live?0:t-w.end,fade=live?1:Math.max(0,1-age/7)*.45;if(!fade)return;
  if(a.type==='grab'||a.type.endsWith('Throw'))return;
  if(a.type==='gale'){if(w.shape==='shockwave'){stamp(5,f.x,f.y+13,a.reach*FIGHTER_SCALE*2,126,1,fade);}else stamp(4,f.x+f.face*37,f.y+5,98,87,f.face,fade);}
  else if(a.type==='rise'){stamp(6,f.x,f.y+28,118,171,f.face,fade);}
  else SlashVFX.melee(f,w,3,fade);
  for(let j=0;j<4;j++){const a0=j*1.7+t*.09;star(f.x+Math.cos(a0)*60,f.y-32+Math.sin(a0)*40,3+j%2,t*.05);}
 }
 function impact(v){const t=(v.max-v.life)/v.max,size=(70+v.power*40)*(1+t*.35);ctx.save();ctx.globalCompositeOperation='source-over';stamp(2,v.x,v.y+size/2,size,size,1,(1-t)**1.5);ctx.restore();}
 return{draw,guard,impact};
})();
