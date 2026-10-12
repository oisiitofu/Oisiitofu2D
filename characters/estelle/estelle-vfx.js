'use strict';
const EstelleVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.estelle?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max,size=(76+v.power*37)*(1+t*.4);stamp(5,v.x,v.y,size,size,1,(1-t)**1.5);}
 function pole(f,a){const q=a.poleAnchor,hand={x:f.x+f.face*8,y:f.y-56},dx=hand.x-q.x,dy=hand.y-q.y,length=Math.hypot(dx,dy);
  stamp(7,(hand.x+q.x)/2,(hand.y+q.y)/2,length*.95,length*.95,1,1,Math.atan2(dy,dx)+Math.PI/4);
  stamp(6,q.x,q.y-6,70,40,1,.35);
 }
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(1,f.x+f.face*35,f.y-35,45+a.charge*45,45+a.charge*45,f.face,.5);
  if(a.type==='rise'&&a.poleAnchor&&t<=a.poleEnd){pole(f,a);stamp(3,f.x,f.y-30,120,100,a.poleFace,.6);drawSprite(f);}
  if(a.type==='rise'&&a.poleReleased&&t<=a.poleReleaseFrame+8)stamp(3,f.x-f.vx*2,f.y+18,100,150,f.face,.8*(1-(t-a.poleReleaseFrame)/9));
  if(a.type==='dash'&&t>=a.rushStart&&t<=a.rushEnd)stamp(6,f.x-f.face*35,f.y-8,125,55,f.face,.65);
  if(a.type==='sideLift'&&t<=a.activeEnd+4)stamp(2,f.x,f.y-40,125,160,f.face,.6);
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;
  const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/6)*.55;
  if(!alpha||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin';
  if(a.type==='dragon'||a.type==='smash'||a.type==='sideFinish'){stamp(1,f.x+f.face*57,f.y-34,(w.reach??a.reach)*FIGHTER_SCALE*1.5,100,f.face,alpha);return;}
  const n=a.type==='gale'||a.type==='downsmash'?4:a.type==='upsmash'?2:0,size=(w.reach??a.reach)*FIGHTER_SCALE*1.5;
  {const slashIndex=n;if([0].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(n,f.x+(spin||up?0:back?-43:43)*f.face,f.y-(up?65:down?12:35),size,up?145:spin?120:90,back?-f.face:f.face,alpha,up?-Math.PI/2:down?Math.PI/2:0);}
 }
 return{draw,impact};
})();
