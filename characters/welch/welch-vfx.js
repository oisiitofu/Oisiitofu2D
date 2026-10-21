'use strict';
const WelchVFX=(()=>{
 // Inspected source convex sides: 0/7 RIGHT, 1 UP, 11/13 DOWN.
 // Local asset orientation is normalized before rotation and facing mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.welch?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.welchSpin&&a.dizzy)stamp(9,f.x,f.y-108,70,30,1,.9,0,true);if(a?.welchSwing&&a.launchAt!=null&&f.timer-a.launchAt<34)stamp(8,f.x,f.y-38,136,50,f.face,.35,0,true);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(b.some(v=>v.window?.shape==='up')){stamp(a.type==='upsmash'?6:1,f.x,f.y-120,158,92,f.face,.95);return;}
  if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,195,74,1,.95);return;}
  if(['jab','jab3','low','smash','dragon'].includes(a.type)){const v=b.find(v=>!v.meleeInner)||b[0];stamp(a.type==='smash'?2:a.type==='jab3'?12:5,v.x2,v.y2,60,56,f.face,.95);return;}
  if(a.type==='downsmash'){const v=b.find(v=>!v.meleeInner)||b[0];stamp(10,v.x2,v.y2,105,68,1,.95);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1;stamp(a.type==='heavy'||a.welchLaw?7:0,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+30,Math.max(44,v.radius*2),face,.9,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){}
 function impact(v){stamp(4,v.x,v.y,34+v.power*2,34+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){const a=f.attack;if(a?.welchSlap)text('ビンタ '+(a.stage+1)+' / 5',x+151,y+14,8,'#ffe6b4');if(a?.welchSpin)text(a.dizzy?'まわしすぎ！':'ぐるぐる '+Math.min(100,Math.floor(f.timer/74*100))+'%',x+151,y+14,8,a.dizzy?'#ffb6d3':'#b5deff');}
 return{stamp,draw,drawObjects,impact,hud};
})();
