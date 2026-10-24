'use strict';
const SamVFX=(()=>{
 // Source paint: cargo impact 0 leads RIGHT, down impact 2 leads DOWN,
 // kick impact 3 leads LEFT. Local rotation, facing reflection, translation.
 // These industrial impacts are not classified as curved sword canopies.
 const inkCache=new WeakMap();
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.sam?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else{let ink=inkCache.get(im);if(!ink){ink=AttackEffects.bounds(im);if(ink)inkCache.set(im,ink);}if(ink){const sx=w/ink.w,sy=h/ink.h;AttackEffects.image(im,-w/2-ink.x*sx,-h/2-ink.y*sy,im.width*sx,im.height*sy);}}ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a){if(f.samLoad===2&&['idle','walk'].includes(f.state))stamp(7,f.x-f.face*22,f.y-94,25,18,f.face,1,0,true);return;}
  if(a.samCargo&&!a.decided&&f.timer>12)stamp(12,f.x,f.y-55,57,58,f.face,.45,0,true);
  if(a.samBola&&a.hold)stamp(9,f.x+f.face*41,f.y-52,30,24,f.face,.8,0,true);
  if(a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
  const upper=['up','upsmash','uair'].includes(a.type),boxes=attackVisualBoxes(f).filter(b=>!b.meleeInner&&(upper||!b.upAttackExtra));if(!boxes.length)return;
  const x1=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),x2=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),y1=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),y2=Math.max(...boxes.flatMap(b=>[b.y1+b.radius,b.y2+b.radius])),x=(x1+x2)/2,y=(y1+y2)/2,w=x2-x1,h=y2-y1;
  if(['up','upsmash','uair'].includes(a.type)){stamp(15,x,y1+15,Math.max(40,w),34,f.face);return;}
  if(['low','downsmash','dair'].includes(a.type)){stamp(10,x,y2-15,Math.max(42,w),Math.max(28,Math.min(50,h)),f.face);return;}
  if(['jab2','jab3','dashAttack','bair'].includes(a.type)){stamp(15,a.type==='bair'?x1+14:x2-14,y,35,30,f.face);return;}
  stamp(0,x,y,Math.max(40,w),Math.max(28,Math.min(45,h)),f.face);
 }
 function drawObjects(){for(const q of SamRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/20);
  if(q.kind==='carrier'){stamp(6,q.x,q.y+2,84,34,q.face,fade,0,true);if(Math.abs(q.vx)>1)stamp(13,q.x-Math.sign(q.vx)*35,q.y+12,76,18,Math.sign(q.vx),fade*.65,0,true);}
  else if(q.kind==='cargo')stamp(7,q.x,q.y-17,56,34,1,fade,0,true);
  else if(q.kind==='bola')stamp(4,q.x,q.y,54,14,q.face,fade,Math.atan2(q.vy,Math.abs(q.vx)),true);
  else if(q.kind==='hook'){const f=fighters[q.owner];if(!f?.attack?.samAnchor)continue;ctx.save();ctx.strokeStyle='#d5eaff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(f.x+f.face*9,f.y-71);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();stamp(8,q.x,q.y,31,27,q.face,1,-.4,true);if(f.attack.phase==='pull')stamp(9,f.x,f.y-71,22,23,f.face,.65,0,true);}
 }for(const f of fighters)if(f.samBind>0)stamp(5,f.x,f.y-43,52,65,1,Math.min(1,f.samBind/8),0,true);}
 function impact(v){stamp(15,v.x,v.y,30+v.power*3,30+v.power*3,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const load=f.samLoad??1;for(let n=0;n<2;n++){ctx.save();ctx.fillStyle=n<load?'#e2b957':'#354755';ctx.fillRect(x+150+n*20,y+20,15,15);ctx.strokeStyle='#132534';ctx.lineWidth=2;ctx.strokeRect(x+150+n*20,y+20,15,15);ctx.restore();}text(['LIGHT','STANDARD','HEAVY'][load],x+150,y+13,9,'#ffe2a2');text('CARGO '+load+'/2',x+150,y+47,8,'#c2def1');}
 return{stamp,draw,drawObjects,impact,hud};
})();
