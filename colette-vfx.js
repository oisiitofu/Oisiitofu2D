'use strict';
const ColetteVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.colette?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('colette',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max,size=(72+v.power*35)*(1+t*.4);stamp(7,v.x,v.y,size,size,1,(1-t)**1.5);}
 function draw(f){
  for(const o of ColetteRules.objects)if(o.owner===f.id&&o.age>=0){
   if(o.kind==='chakram'){for(let j=3;j>0;j--)stamp(1,o.x-(o.x-o.previousX||o.vx)*j*.5,o.y-(o.y-o.previousY||0)*j*.5,42,42,1,.13,o.age*.35-j*.4);stamp(1,o.x,o.y,42,42,1,1,o.age*.35);}
   else if(o.kind==='feather')stamp(6,o.x,o.y,55,28,1,1,Math.atan2(o.vy,o.vx));
   else if(o.burst)stamp(7,o.x,o.y,65+o.tier*22,65+o.tier*22,1,1-o.burst/9);
   else stamp(4,o.x,o.y,o.tier?53:35,o.tier?53:35,1,1,o.age*.24*o.face);
  }
  if(f.coletteItemFlash>frame)stamp(5,f.x,f.y-45,95,120,1,(f.coletteItemFlash-frame)/36);
  const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(1,f.x+f.face*35,f.y-38,35+a.charge*30,35+a.charge*30,1,.7,t*.3);
  if(a.type==='rise'&&t>=a.flightStart&&t<=a.flightExitFrame+5){const flap=1+Math.sin(t*.5)*.12;stamp(3,f.x,f.y-65,145*flap,95,1,t<=a.flightEnd?1:Math.max(0,1-(t-a.flightEnd)/7));drawSprite(f);}
  if(a.type==='dash'&&a.orbitOrigin&&t>=a.orbitStart&&t<=a.activeEnd){stamp(1,f.x-f.face*30,f.y-35,48,48,1,.75,t*.4);stamp(0,f.x,f.y-32,130,90,f.face,.45,t*.12);}
  if(a.spellShots)return;
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;
  const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.6;
  if(!alpha||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
  if(a.type==='upsmash'){stamp(2,f.x,f.y-70,160,195,1,alpha);drawSprite(f);return;}
  const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin';
  if(w.shape!=='spin')SlashVFX.melee(f,w,0,alpha);else stamp(0,f.x+(spin||up?0:back?-45:45)*f.face,f.y-(up?65:down?12:35),(a.reach||150)*FIGHTER_SCALE*1.4,up?138:spin?120:88,back?-f.face:f.face,alpha,up?-Math.PI/2:down?Math.PI/2:0);
  const b=attackBoxes(f)[0];if(b)stamp(1,b.x2,b.y2,35,35,1,alpha,t*.4);
 }
 return{draw,impact};
})();
