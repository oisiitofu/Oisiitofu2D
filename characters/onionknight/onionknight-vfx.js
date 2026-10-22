'use strict';
const OnionKnightVFX=(()=>{
 // Reviewed source paint: 0/5 bulge RIGHT; 1/4 are UP canopies; 3 is X;
 // 30 originally travelled DOWN-LEFT, normalized DOWN during assembly;
 // 31 actually travels RIGHT despite its brief.
 // Normalize the source locally, then rotate, then mirror by the fighter.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.onionknight?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function extent(b){return{left:Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right:Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top:Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom:Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius]))};}
 function draw(f){if(f.respawn)return;const a=f.attack,job=a?.onionJob??onionknightJob(f);
  if(a?.onionRise&&a.phase==='flight'&&job===2)stamp(22,f.x,f.y-5,104,36,f.face,.85,0,true);
  if(a?.onionNB&&!a.released&&f.timer>15)stamp(job===2?18:job===1?10:8,f.x+f.face*24,f.y-35,15+f.timer*.25,15+f.timer*.25,f.face,.65,job===1?frame*.1:0,true);
  const b=attackVisualBoxes(f);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const outer=b.filter(v=>!v.meleeInner&&!v.upAttackExtra),box=extent(outer.length?outer:b),x=(box.left+box.right)/2,y=(box.top+box.bottom)/2,w=box.right-box.left,h=box.bottom-box.top;
  if(a.type==='air'){
   if(job===0){stamp(0,f.x+f.face*48,y,88,h,f.face,.95);stamp(5,f.x-f.face*48,y,88,h,-f.face,.9);}
   else if(job===1)stamp(3,x,y,w,Math.max(h,76),f.face,.95,0,true);
   else stamp(7,x,y,w,Math.max(h,76),f.face,.95,0,true);
   return;
  }
  if(['up','upsmash','uair'].includes(a.type)||a.onionRise){
   if(job===2)stamp(a.type==='uair'?29:16,x,y,w,h,f.face,.95,0,true);
   else stamp(job===0?1:4,x,box.top+Math.min(h,84)/2,Math.max(w,112),Math.min(h,84),f.face,.95);
   return;
  }
  if(a.type==='downsmash'&&job===2){stamp(17,x,y,w,h,1,.95,0,true);return;}
  if(a.type==='smash'&&job===2){stamp(15,x,y,w,h,f.face,.95,0,true);return;}
  if(a.type==='smash'&&job===1){stamp(11,f.x+f.face*(w*.65),y,76,76,f.face,.95,frame*.18,true);return;}
  if(a.type==='dair'){
   if(job===2)stamp(30,x,y,w,h,f.face,.95,0,true);
   else stamp(job===0?0:5,x,y,h,w,f.face,.95,Math.PI/2);
   return;
  }
  const back=a.type==='bair'||a.onionSide&&a.stage===3||a.type==='downsmash'&&CombatData.activeWindow(a,f.timer)?.index===1,face=back?-f.face:f.face;
  if(job===2){stamp(a.type==='bair'?31:a.type==='low'?17:a.type==='fair'?8:6,x,y,w,h,face,.95,0,true);return;}
  const n=a.type==='jab3'||a.onionNB?2:job===1&&a.type==='jab2'?12:job===0?0:5;
  stamp(n,x,y,w,h,face,.95);
 }
 function drawObjects(){for(const q of OnionKnightRules.objects){if(q.age<=(q.delay||0))continue;const alpha=Math.min(1,(q.life-q.age)/6);if(q.kind==='job')stamp(23,q.x,q.y,90,90,1,alpha,0,true);else if(q.kind==='shuriken')stamp(q.fx,q.x,q.y,q.radius*2.5,q.radius*2.5,1,alpha,q.age*.24,true);else if(q.kind==='tornado')stamp(20,q.x,q.y,q.radius*2+12,90,q.face,alpha,0,true);else if(q.kind==='burst')stamp(9,q.x,q.y,q.radius*2,q.radius*2,1,alpha,0,true);else stamp(q.kind==='holy'?18:q.fx,q.x,q.y,q.radius*3,q.radius*2.4,q.face,alpha,0,true);}}
 function impact(v){stamp(27,v.x,v.y,28+v.power*2,28+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const job=onionknightJob(f);text(['たまねぎ剣士','忍者','賢者'][job],x+150,y+15,10,['#ffac9c','#a4cfff','#e5ffd1'][job]);for(let n=0;n<3;n++)stamp(24+n,x+163+n*27,y+34,23,23,1,n===job?1:.3,0,true);text('下B ジョブ切替',x+150,y+54,8,'#d4e1ee');}
 return{stamp,draw,drawObjects,impact,hud};
})();
