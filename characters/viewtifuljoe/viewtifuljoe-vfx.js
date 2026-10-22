'use strict';
const ViewtifulJoeVFX=(()=>{
 // These are comic glove/boot streaks, stars, film frames and tyre smoke,
 // not sword crescents. Kick2 points up-right; flame9 down; flame14 down-right.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.viewtifuljoe?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function contact(n,v){const source=characterArt.viewtifuljoe?.effects[n];if(!source)return;const canonical=AttackEffects.normalized(source,AttackEffectData.axes.viewtifuljoe[n]||[1,0]),ink=canonical.bounds;if(!ink)return;const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,width=Math.hypot(dx,dy)+2*v.radius,height=2*v.radius,sx=width/ink.w,sy=height/ink.h;ctx.save();ctx.translate((v.x1+v.x2)/2,(v.y1+v.y2)/2);ctx.scale(face,1);ctx.rotate(Math.atan2(dy,dx*face));ctx.globalAlpha*=.95;AttackEffects.image(canonical.img,-width/2-ink.x*sx,-height/2-ink.y*sy,canonical.img.width*sx,canonical.img.height*sy);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(f.joeZoom>0)stamp(8,f.x,f.y-43,115,115,1,.3,0,true);if(a?.joeControl&&!a.released&&f.timer>14)stamp(12,f.x+f.face*20,f.y-47,38,20,1,.8,0,true);if(a?.joeRescue&&a.phase==='ride'&&!a.civilian)stamp(6,f.x,f.y+12,75,65,1,.6,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const outside=b.filter(v=>!v.meleeInner),parts=outside.length?outside:b;
  if(a.joeRescue){stamp(6,f.x,f.y-50,100,140,1,.75,0,true);return;}
  if(a.joeMach){for(const v of parts)contact(a.stage===4?2:5,v);return;}
  if(['up','upsmash','uair'].includes(a.type)){const left=Math.min(...parts.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right=Math.max(...parts.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top=Math.min(...parts.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom=Math.max(...parts.flatMap(v=>[v.y1+v.radius,v.y2+v.radius])),r=Math.min((right-left)/2,(bottom-top)/2);contact(a.type==='uair'?1:0,{x1:(left+right)/2,x2:(left+right)/2,y1:bottom-r,y2:top+r,radius:r});return;}
  if(a.type==='downsmash'){const x1=Math.min(...parts.map(v=>Math.min(v.x1,v.x2)-v.radius)),x2=Math.max(...parts.map(v=>Math.max(v.x1,v.x2)+v.radius));stamp(3,(x1+x2)/2,f.y-20,x2-x1,80,1,.9,0,true);return;}
  for(const v of parts){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,angle=Math.atan2(dy,dx*face),x=(v.x1+v.x2)/2,y=(v.y1+v.y2)/2,len=Math.hypot(dx,dy)+2*v.radius,height=2*v.radius;
   const upper=['up','upsmash'].includes(a.type)||a.joeMach&&a.stage===4;
   if(upper){contact(0,v);continue;}
   if(a.type==='dair'){contact(a.joeZoom?9:14,v);continue;}
   if(['jab3','low','dashAttack','air','fair','bair'].includes(a.type)||a.joeMach&&a.stage>1){contact(2,v);continue;}
   contact(0,v);
  }
 }
 function drawObjects(){for(const q of ViewtifulJoeRules.objects){const alpha=Math.min(1,(q.life-q.age)/7);if(q.kind==='slow')stamp(7,q.x,q.y,q.radius*2,q.radius*2,1,alpha*.7,Math.sin(q.age*.03)*.04,true);else stamp(4,q.x,q.y,43,38,q.face,alpha,q.age*.35,true);}}
 function impact(v){stamp(10,v.x,v.y,34+v.power*2,34+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const film=viewtifuljoeFilm(f);text(f.joeCivilian>0?'VFX RECHARGE':f.joeZoom>0?'VFX ZOOM':'VFX FILM',x+148,y+14,8,'#ffc6e9');ctx.fillStyle='#361d37';ctx.fillRect(x+150,y+24,78,13);for(let n=0;n<10;n++){ctx.fillStyle=n<film/10?'#ff63bf':'#59405a';ctx.fillRect(x+152+n*7.5,y+27,5,7);}text(Math.floor(film)+'%',x+150,y+48,8,'#ffe0f2');}
 return{stamp,draw,drawObjects,impact,hud};
})();
