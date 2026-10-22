'use strict';
const ArthurVFX=(()=>{
 // Source0 straight glint and1 shield chips point RIGHT;7 arrows and9 lightning
 // point UP. Normalize the painted source, rotate locally, then mirror facing.
 const goldCache=new WeakMap();
 function gold(f,n,img){if(!img||n===61)return img;const hit=goldCache.get(img);if(hit)return hit;const base=characterArt.arthur?.frames[n];if(!base)return img;const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(base,0,0);const raw=g.getImageData(0,0,c.width,c.height),p=raw.data,total=c.width*c.height,mask=new Uint8Array(total),seen=new Uint8Array(total);
  for(let j=0;j<total;j++){const k=j*4,r=p[k],v=p[k+1],b=p[k+2];mask[j]=p[k+3]>=128&&r>=35&&v>=35&&b>=r*.92&&b>=v*.95&&Math.max(r,v,b)-Math.min(r,v,b)<45?1:0;}
  const keep=new Uint8Array(total);for(let j=0;j<total;j++){if(!mask[j]||seen[j])continue;const ids=[j];seen[j]=1;for(let z=0;z<ids.length;z++){const a=ids[z],x=a%c.width,y=a/c.width|0;for(const b of[x?a-1:-1,x<c.width-1?a+1:-1,y?a-c.width:-1,y<c.height-1?a+c.width:-1])if(b>=0&&mask[b]&&!seen[b]){seen[b]=1;ids.push(b);}}if(ids.length>=200)for(const a of ids)keep[a]=1;}
  g.clearRect(0,0,c.width,c.height);g.drawImage(img,0,0);const painted=g.getImageData(0,0,c.width,c.height);for(let j=0;j<total;j++)if(keep[j]){const k=j*4,l=(p[k]+p[k+1]+p[k+2])/3;painted.data[k]=Math.min(255,l*1.22+28);painted.data[k+1]=Math.min(240,l*.91+14);painted.data[k+2]=Math.min(170,l*.39+6);}g.putImageData(painted,0,0);goldCache.set(img,c);return c;
 }
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.arthur?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
 function contact(n,v){const source=characterArt.arthur?.effects[n];if(!source)return;const c=AttackEffects.normalized(source,AttackEffectData.axes.arthur[n]||[1,0]),ink=c.bounds;if(!ink)return;const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,w=Math.hypot(dx,dy)+2*v.radius,h=2*v.radius,sx=w/ink.w,sy=h/ink.h;ctx.save();ctx.translate((v.x1+v.x2)/2,(v.y1+v.y2)/2);ctx.scale(face,1);ctx.rotate(Math.atan2(dy,dx*face));AttackEffects.image(c.img,-w/2-ink.x*sx,-h/2-ink.y*sy,c.img.width*sx,c.img.height*sy);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.arthurArmorFlash>0)stamp(5,f.x,f.y-43,105,100,1,f.arthurArmorFlash/18);if(a?.arthurMend)stamp(12,f.x,f.y-40,100,115,1,Math.min(.7,f.timer/90));if(a?.arthurJump&&a.phase==='second')stamp(15,f.x,f.y+5,75,35,1,.4);
  const b=attackVisualBoxes(f);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const parts=b.filter(v=>!v.meleeInner);const all=parts.length?parts:b;
  if(['upsmash','uair'].includes(a.type)){const x1=Math.min(...all.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),x2=Math.max(...all.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top=Math.min(...all.flatMap(v=>[v.y1-v.radius,v.y2-v.radius]));stamp(7,(x1+x2)/2,(top+f.y-30)/2,x2-x1,f.y-30-top,f.face,.95);return;}
  if(a.type==='downsmash'){for(const v of all)stamp(6,v.x2,f.y-45,65,105,1,.95);return;}
  if(a.arthurJump){for(const v of all)contact(0,v);return;}
  if(['smash','dair'].includes(a.type)){for(const v of all)stamp(8,v.x2,v.y2,2*v.radius+75,2*v.radius+45,f.face,.9);return;}
  for(const v of all)contact(AttackEffectData.types.arthur[a.type]??0,v);
 }
 function drawObjects(){for(const q of ArthurRules.objects){const alpha=Math.min(1,(q.life-q.age)/6);if(q.kind==='ball')stamp(4,q.x,q.y,q.radius*2+6,q.radius*2+6,q.face,alpha,q.age*.1*q.face);else if(q.kind==='thunder')stamp(9,q.x,q.y-20,110,240,1,alpha);else stamp(q.fx,q.x,q.y,q.kind==='lance'?95:48,q.kind==='lance'?22:16,q.face,alpha,Math.atan2(q.vy,q.vx*q.face));}}
 function impact(v){stamp(14,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){const n=arthurArmor(f);text(['UNDERWEAR','SILVER ARMOR','GOLD ARMOR'][n],x+147,y+14,8,n===2?'#ffe59a':'#d7e4ee');ctx.fillStyle='#354459';ctx.fillRect(x+151,y+24,78,9);ctx.fillStyle=n===2?'#ffd360':'#b9d3ea';ctx.fillRect(x+151,y+24,n?78*(1-(f.arthurWear||0)/(n===2?20:14)):0,9);text(n<2?'下B長押し：鎧修復':'黄金の力',x+149,y+48,8,'#d7e4ee');}
 return{gold,stamp,draw,drawObjects,impact,hud};
})();
