'use strict';
const NoctisVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.noctis?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max;stamp(2,v.x,v.y,(90+v.power*34)*(1+t*.35),(90+v.power*34)*(1+t*.35),1,(1-t)**1.5);}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(a.type==='gale'?5+a.elementIndex:3,f.x+f.face*35,f.y-38,65+a.charge*50,65+a.charge*50,1,.5);
  if(a.type==='rise'&&a.anchorPoints&&t<=a.selectionEnd){ctx.save();for(let n=0;n<3;n++){const p=a.anchorPoints[n],blocked=NoctisRules.safeWarp(f,p).blocked,selected=n===a.anchorIndex;ctx.strokeStyle=blocked?'#c997aa88':selected?'#b3eaffbb':'#7babff44';ctx.lineWidth=selected?2:1;ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(f.x,f.y-36);ctx.lineTo(p.x,p.y-36);ctx.stroke();stamp(4,p.x,p.y-36,selected?82:52,selected?82:52,1,blocked?.25:selected?.95:.38);}ctx.restore();}
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/6)*.55;if(!alpha)return;
  const up=w.shape==='up',down=['plunge','down','low'].includes(w.shape),back=w.shape==='back',spin=w.shape==='spin',size=(w.reach??a.reach)*FIGHTER_SCALE*1.55;
  {const slashIndex=a.type==='upsmash'?3:a.type==='warpStrike'||a.type==='jab'?1:0;if([0,1].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(a.type==='upsmash'?3:a.type==='warpStrike'||a.type==='jab'?1:0,f.x+(up||spin?0:back?-43:43)*f.face,f.y-(up?65:down?14:35),size,up?150:spin?125:90,back?-f.face:f.face,alpha,up?-Math.PI/2:w.shape==='plunge'?Math.PI/2:0);}
 }
 function drawObjects(){ctx.save();ctx.globalCompositeOperation='lighter';for(const o of NoctisRules.objects){
  if(o.kind==='warpFlash'){const t=o.age/o.life;stamp(2,o.x,o.y,110+t*80,130+t*80,1,(1-t)**1.5);}
  else if(o.kind==='sword'){const angle=Math.atan2(o.vy,o.vx);stamp(1,o.x,o.y,90,35,1,.95,angle);stamp(0,o.x-o.vx*2,o.y-o.vy*2,80,30,1,.25,angle);}
  else if(o.kind==='marker'){stamp(4,o.x,o.y,64,64,o.face,.8);if(o.anchored){ctx.strokeStyle='#9ddeff';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(o.x,o.y,22+Math.sin(o.age*.15)*3,0,TAU);ctx.stroke();}}
  else if(o.kind==='flask'){const size=o.burst?o.radius*2*(1+o.burst/o.burstLife*.25):24+o.charge*8;stamp(5+o.elementIndex,o.x,o.y,size,size,1,o.burst?(1-o.burst/o.burstLife)**.6:.95,o.burst?0:o.age*.1);}
 }ctx.restore();}
 return{draw,impact,drawObjects};
})();
