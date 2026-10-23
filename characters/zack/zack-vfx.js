'use strict';
const ZackVFX=(()=>{
 // Extracted source paint: 0/2/3/15 convex RIGHT, 1 convex UP;
 // 5/6 fire heads RIGHT; 7/13 impact noses RIGHT; 8 UP-RIGHT,
 // 10 tornado UP, 12 DOWN-RIGHT. Rotate locally before facing mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.zack?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.zackHealing>0)stamp(11,f.x,f.y-35,88,105,f.face,f.zackHealing/35,0,true);if(a?.zackFire&&!a.released)stamp(5,f.x+f.face*43,f.y-57,20+Math.min(22,f.timer*.4),20+Math.min(22,f.timer*.4),f.face,.8,0,true);if(a?.zackStrong&&!a.released&&f.timer>=25)stamp(14,f.x-f.face*20,f.y-65,25,25,f.face,.7,0,true);
  const b=attackVisualBoxes(f).filter(v=>!v.meleeInner&&!v.upAttackExtra);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const left=Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right=Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top=Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom=Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top,active=CombatData.activeWindow(a,f.timer);
  if(a.zackStrong){stamp(a.punch?13:3,x,y,w,h,f.face,.95,0,!!a.punch);return;}
  if(a.zackTwister&&!a.zackRush){if(active?.index===2)stamp(12,x,y,w,h,f.face,.95,0,true);else stamp(10,x,y,w,h,f.face,.9,0,true);return;}
  if(a.type==='upsmash'){stamp(4,x,y,Math.max(w,90),h,f.face,.95,0,true);return;}
  if(a.type==='jab2'){stamp(8,x,y,w,h,f.face,.95);return;}
  if(a.zackJump&&active?.index===1||['fair','dair'].includes(a.type)){stamp(12,x,y,w,h,f.face,.95,0,true);return;}
  if(['up','jab3','uair'].includes(a.type)||a.zackJump){stamp(1,x,top+39,Math.max(130,w),78,f.face,.95);return;}
  if(a.type==='air'){stamp(2,x,y,w,h,f.face,.95);return;}
  const back=a.type==='bair'||a.type==='downsmash'&&active?.index===1||a.zackOcta&&active?.index===5;stamp(a.zackRush?7:a.zackOcta?3:a.type==='smash'?15:0,x,y,w,h,back?-f.face:f.face,.95);
 }
 function drawObjects(){for(const q of ZackRules.objects)stamp(q.level?6:5,q.x,q.y,q.radius*3.7,q.radius*2,q.face,Math.min(1,(q.life-q.age)/6),0,true);}
 function impact(v){stamp(7,v.x,v.y,30+v.power*2,30+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const mp=zackMP(f),dmw=clamp(f.zackDmw||0,0,100);ctx.save();ctx.fillStyle='#10233b';ctx.fillRect(x+150,y+22,118,7);ctx.fillStyle='#62baff';ctx.fillRect(x+151,y+23,116*mp/100,5);ctx.fillStyle='#241e35';ctx.fillRect(x+150,y+34,118,6);ctx.fillStyle='#e0b6ff';ctx.fillRect(x+151,y+35,116*dmw/100,4);ctx.restore();text('MP '+Math.floor(mp),x+150,y+17,9,'#bce8ff');const n=f.zackReel>0?String((Math.floor(frame/3)+f.id)%10).repeat(3):['777','666','555'][f.zackResult??0];const portrait=characterArt.zack?.frames[76];ctx.save();for(let k=0;k<3;k++){const sx=x+150+k*19,sy=y+42;ctx.fillStyle='#080b14';ctx.fillRect(sx,sy,18,20);if(portrait){ctx.save();ctx.beginPath();ctx.rect(sx+1,sy+1,16,18);ctx.clip();const offset=f.zackReel>0?(frame*3+k*7)%20:0;for(const dy of[offset-20,offset])ctx.drawImage(portrait,195,30,135,175,sx+1,sy+1+dy,16,18);ctx.restore();}}ctx.restore();text('D.M.W. '+(f.zackReel>0?n:f.zackCritical>0?'777':Math.floor(dmw)+'%'),x+210,y+53,9,f.zackCritical>0?'#ffe59b':'#ead8ff');if(f.zackLimitReady)text('LIMIT: NB斬撃 / 横B突撃 / 下B回復',x+150,y+64,8,'#fff2bb');else if(f.zackCritical>0)text('クリティカル '+(f.zackCritical/60).toFixed(1)+'s',x+150,y+64,8,'#ffe8c1');}
 return{stamp,draw,drawObjects,impact,hud};
})();
