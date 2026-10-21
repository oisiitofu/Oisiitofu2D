'use strict';
const JudasVFX=(()=>{
 // Reviewed on transparent source: 0/2/4 RIGHT, 1/7 UP, 13 DOWN.
 // Rotate in character-local coordinates first, then mirror for facing.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.judas?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.judasGate&&f.timer>=8&&!a.opened)stamp(14,f.x+f.face*27,f.y-46,45+f.timer,60+f.timer,1,.65,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(b.some(v=>v.window?.shape==='up')){stamp(a.judasAscent&&a.finishAt?7:1,f.x,f.y-117,170,96,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,215,95,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='jab3'?11:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(45,v.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of JudasRules.objects){if(q.dead)continue;const alpha=Math.min(1,(q.life-q.age)/8);if(q.kind==='moon')stamp(4,q.x,q.y,85,80,q.face,alpha,0,true);if(q.kind==='gate'){const burst=q.age>=60;stamp(burst?10:6,q.x,q.y,burst?185:150,burst?185:150,1,alpha*.9,q.age*.025,true);if(!burst)stamp(12,q.x,q.y+50,155,45,1,.65*alpha,0,true);}}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='judas')return;const sp=judasSP(f);text('SP '+Math.floor(sp)+'%',x+150,y+13,9,'#dcbdff');for(let k=0;k<5;k++)stamp(8,x+160+k*16,y+27,14,17,1,sp>k*20?1:.2,0,true);ctx.fillStyle='#332049';ctx.fillRect(x+152,y+39,80,3);ctx.fillStyle='#b97aff';ctx.fillRect(x+152,y+39,80*sp/100,3);}
 return{stamp,draw,drawObjects,impact,hud};
})();
