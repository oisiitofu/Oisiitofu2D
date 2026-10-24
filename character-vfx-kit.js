'use strict';
// Visible paint is fitted to the final hit envelope, not the transparent cell.
// Local source correction -> local rotation -> facing reflection -> translation.
const CharacterVFXKit=(()=>{
 function create(id){const cache=new WeakMap();function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt[id]?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else{let ink=cache.get(im);if(!ink){ink=AttackEffects.bounds(im);if(ink)cache.set(im,ink);}if(ink){const sx=w/ink.w,sy=h/ink.h;AttackEffects.image(im,-w/2-ink.x*sx,-h/2-ink.y*sy,im.width*sx,im.height*sy);}}ctx.restore();}
 function envelope(f){const a=f.attack;if(!a||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return null;const upper=['up','upsmash','uair'].includes(a.type),b=attackVisualBoxes(f).filter(b=>!b.meleeInner&&(upper||!b.upAttackExtra));if(!b.length)return null;const l=Math.min(...b.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),r=Math.max(...b.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),t=Math.min(...b.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),d=Math.max(...b.flatMap(b=>[b.y1+b.radius,b.y2+b.radius]));return{x:(l+r)/2,y:(t+d)/2,w:r-l,h:d-t,l,r,t,d,upper,back:a.type==='bair',down:['low','downsmash','dair'].includes(a.type)};}
 function bar(value,label,x,y,color){ctx.save();ctx.fillStyle='#152534';ctx.fillRect(x+147,y+21,70,8);ctx.fillStyle=color;ctx.fillRect(x+148,y+22,68*clamp(value/100,0,1),6);ctx.restore();text(label,x+148,y+14,8,color);}
 return{stamp,envelope,bar};}return{create};
})();
