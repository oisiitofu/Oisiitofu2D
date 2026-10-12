'use strict';
const CliveVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.clive?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max;stamp(2,v.x,v.y,(85+v.power*33)*(1+t*.4),(85+v.power*33)*(1+t*.4),1,(1-t)**1.5);}
 function drawObjects(){for(const o of CliveRules.objects)stamp(1,o.x-o.face*15,o.y,o.charged?95:72,o.charged?55:40,o.face);}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(a.type==='gale'?7:2,f.x+f.face*32,f.y-35,55+a.charge*70,55+a.charge*70,1,.5);
  if(a.type==='dash'&&t>=a.shiftStart&&t<=a.shiftEnd)stamp(3,f.x-f.face*40,f.y-32,180,105,f.face,.9);
  if(a.garudaClaw&&t>=a.clawStart){const p=a.clawOrigin,q=t<=a.clawEnd?CliveRules.claw(f):a.hookLedge?{x:a.hookLedge.x,y:a.hookLedge.y}:a.hookTarget!==undefined?{x:fighters[a.hookTarget].x,y:fighters[a.hookTarget].y-37}:a.clawTarget;const alpha=t<=a.clawEnd||a.hookConfirmed?1:Math.max(0,1-(t-a.clawEnd)/8);ctx.save();ctx.globalAlpha*=alpha;ctx.strokeStyle='#72e7cea0';ctx.shadowBlur=12;ctx.shadowColor='#72e7ce';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.x+f.face*10,f.y-50);ctx.quadraticCurveTo((f.x+q.x)/2,(f.y-50+q.y)/2+20,q.x,q.y);ctx.stroke();ctx.restore();stamp(4,q.x,q.y,85,85,1,alpha,Math.atan2(q.y-p.y,q.x-p.x)+Math.PI/4);return;}
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/6)*.55;if(!alpha)return;
  if(['gale','airPile','pileLanding'].includes(a.type)){const size=a.reach*FIGHTER_SCALE*1.6;stamp(7,f.x,f.y-45,size,135,1,alpha);return;}
  if(a.type==='garudaWheel'){stamp(5,f.x,f.y-40,150,190,1,alpha);return;}
  if(a.type==='magicBurst'){stamp(2,f.x+f.face*55,f.y-34,90,90,1,alpha);return;}
  if(a.type==='smash'||a.type==='dair'){stamp(6,f.x+(a.type==='smash'?f.face*65:0),f.y-25,150,130,1,alpha);}
  const up=w.shape==='up',back=w.shape==='back',spin=w.shape==='spin',down=['plunge','low','down'].includes(w.shape),size=(w.reach??a.reach)*FIGHTER_SCALE*1.55;
  if(w.shape!=='spin')SlashVFX.melee(f,w,0,alpha);else stamp(0,f.x+(up||spin?0:back?-45:45)*f.face,f.y-(up?65:down?14:35),size,up?150:spin?125:90,back?-f.face:f.face,alpha,up?-Math.PI/2:w.shape==='plunge'?Math.PI/2:0);
 }
 return{draw,impact,drawObjects};
})();
