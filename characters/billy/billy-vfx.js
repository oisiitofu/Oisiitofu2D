'use strict';
const BillyVFX=(()=>{
 // Gun rays0/2/7 face RIGHT, fan1 and twin14 face UP. Source13 was
 // normalized downward in assembly. Rotate locally, then mirror for facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.billy?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);if(a?.billyClearance&&a.chargeMode&&!a.released)stamp(8,f.x+f.face*49,f.y-40,20+f.timer*.5,20+f.timer*.5,1,.65,0,true);
  if(!a||!boxes.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(['upsmash','uair'].includes(a.type)){const x1=Math.min(...boxes.map(b=>Math.min(b.x1,b.x2)-b.radius)),x2=Math.max(...boxes.map(b=>Math.max(b.x1,b.x2)+b.radius)),y1=Math.min(...boxes.map(b=>Math.min(b.y1,b.y2)-b.radius)),y2=Math.max(...boxes.map(b=>Math.max(b.y1,b.y2)+b.radius));stamp(a.type==='upsmash'?1:14,(x1+x2)/2,(y1+y2)/2,x2-x1,y2-y1,f.face,.95);return;}
  if(boxes.some(b=>b.window?.shape==='spin')){stamp(3,f.x,f.y-44,190,90,1,.9);return;}
  const index=({jab:12,jab2:12,jab3:0,heavy:0,up:12,low:12,dashAttack:2,smash:7,downsmash:3,air:3,fair:2,bair:2,dair:13,ledge:12,getupAttack:12})[a.type]??0;
  for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;if(a.type==='dair')stamp(13,(b.x1+b.x2)/2,(b.y1+b.y2)/2,b.radius*2,Math.hypot(dx,dy)+22,f.face,.95);else stamp(index,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+24,Math.max(40,b.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of BillyRules.objects){if(q.kind==='bullet')stamp(q.strong?7:2,q.x,q.y,q.strong?52:26,q.strong?18:7,q.face,.95,q.angle||0,true);else if(q.kind==='muzzle')stamp(0,q.x,q.y,q.strong?48:27,q.strong?40:22,q.face,Math.max(.15,1-q.age/q.life),q.angle||0,true);}}
 function impact(v){stamp(9,v.x,v.y,32+v.power*2,32+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='billy')return;const hero=billyHero(f);text('STARLIGHT '+hero+'/5',x+149,y+14,9,'#ffd77a');for(let n=0;n<5;n++)stamp(8,x+158+n*15,y+29,13,17,1,n<hero?1:.18,0,true);ctx.fillStyle='#664b29';ctx.fillRect(x+151,y+40,74,2);ctx.fillStyle='#ffe5a0';ctx.fillRect(x+151,y+40,74*(hero===5?1:(f.billyHits||0)%4/4),2);}
 return{stamp,draw,drawObjects,impact,hud};
})();
