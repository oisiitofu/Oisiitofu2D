'use strict';
const ZoeVFX=(()=>{
 // Actual source convex sides:0 RIGHT,1 UP,2 crossed both leadingRIGHT,
 //13 DOWN. Rotate locally then mirror. Lightning/rings/status are props.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.zoe?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.zoeDischarge&&!a.releaseAt)stamp(11,f.x,f.y-65,110+f.timer,130,1,.65,0,true);if(a?.zoeBound&&a.launchAt!=null&&f.timer-a.launchAt<36)stamp(7,f.x,f.y-60,130,140,f.face,.7,0,true);
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(a.zoeDischarge){stamp(8,f.x,f.y-27,[230,316,410][a.level],80+a.level*23,1,.95);return;}
  if(['jab','jab2','up','low','dashAttack','bair'].includes(a.type)){const v=b.find(v=>!v.meleeInner)||b[0];stamp(12,v.x2,v.y2,65,65,1,.95);return;}
  if(a.type==='upsmash'){for(const v of b.filter(v=>!v.meleeInner))stamp(6,(v.x1+v.x2)/2,(v.y1+v.y2)/2,v.radius*2,Math.abs(v.y2-v.y1)+v.radius*2,1,.95);return;}
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-170,205,115,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-68,250,125,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:a.type==='dair'?13:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(55,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 function drawObjects(){for(const q of ZoeRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/4);if(q.kind==='bullet')stamp(q.charged?5:4,q.x,q.y,q.charged?98:48,q.charged?42:12,q.face,fade,0,true);else if(q.kind==='muzzle')stamp(10,q.x,q.y,q.charged?100:60,q.charged?60:35,q.face,fade,0,true);else stamp(8,q.x,q.y,140,55,1,fade,0,true);}
  for(const f of fighters)if((f.zoeCharge>0||f.zoeStunFlash>0)&&!f.respawn){const y=f.y-f.character.ecb.height-22;if(f.zoeCharge>=100||f.zoeStunFlash>0)stamp(11,f.x,f.y-60,110,130,1,.55,0,true);ctx.save();ctx.fillStyle='#302a0e';ctx.fillRect(f.x-24,y,48,5);ctx.fillStyle='#ffe35a';ctx.fillRect(f.x-24,y,48*(f.zoeCharge||0)/100,5);if(f.zoeStunFlash>0){ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('STUN',f.x,y-5);}ctx.restore();}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.attack?.zoeGun)text('MINIGUN '+f.attack.shots,x+151,y+13,8,'#ffe36a');else if(f.attack?.zoeDischarge)text('CHARGE '+Math.min(100,Math.floor(f.timer/48*100))+'%',x+151,y+13,8,'#ffe36a');}
 return{stamp,draw,drawObjects,impact,hud};
})();
