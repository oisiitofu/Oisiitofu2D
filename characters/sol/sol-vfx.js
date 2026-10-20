'use strict';
const SolVFX=(()=>{
 // Reviewed native crescents: 0/6 convex RIGHT, 1/13 convex UP, 7 convex DOWN.
 // Rotate in local coordinates first, then apply facing mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.sol?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(b.some(v=>v.window?.shape==='up')){stamp(a.type==='upsmash'?13:1,f.x,f.y-135,175,95,f.face,.95);return;}
  if(a.solViper&&a.sideAt){stamp(3,f.x+f.face*85,f.y-50,145,115,f.face,.95);return;}
  if(a.solBandit&&a.bringer){stamp(7,f.x+f.face*60,f.y-35,135,110,f.face,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.solBandit?6:['jab','jab2','jab3','heavy'].includes(a.type)?9:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(47,v.radius*2),face,.93,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of SolRules.objects){if(q.dead)continue;const alpha=Math.min(1,(q.life-q.age)/8);if(q.kind==='flame')stamp(4,q.x,q.y-5,95,105,q.face,alpha,0,true);else if(q.kind==='feint')stamp(5,q.x,q.y,65,38,q.face,alpha,0,true);else if(q.kind==='roman')stamp(8,q.x,q.y,145+q.age*10,60+q.age*2,1,alpha,0,true);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='sol')return;const n=solTension(f);text('TENSION '+Math.floor(n)+'%',x+150,y+13,9,n>=50?'#ffe291':'#bba89e');ctx.fillStyle='#261815';ctx.fillRect(x+150,y+20,83,12);const g=ctx.createLinearGradient(x+150,0,x+233,0);g.addColorStop(0,'#be2416');g.addColorStop(.6,'#ff7832');g.addColorStop(1,'#ffe66e');ctx.fillStyle=g;ctx.fillRect(x+152,y+22,79*n/100,8);ctx.fillStyle='#fff2c0';ctx.fillRect(x+191,y+21,1,10);text('RC 50%',x+150,y+42,8,'#edb59e');}
 return{stamp,draw,drawObjects,impact,hud};
})();
