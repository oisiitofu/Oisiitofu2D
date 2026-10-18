'use strict';
const NekuVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.neku?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,85+v.power*28,85+v.power*28,1,(1-u)**1.5);}
 function drawObjects(){for(const o of NekuRules.objects){const alpha=Math.min(1,(o.life-o.age)/8);
  if(o.kind==='warpFlash')stamp(5,o.x,o.y,120,155,1,alpha);
  if(o.kind==='spark')stamp(7,o.x,o.y,95,95,1,alpha);
  if(o.kind==='rock')stamp(4,o.x,o.y,95,75,o.face,alpha,Math.sin(o.age*.18)*.12);
  if(o.kind==='bolt')stamp(3,o.x,o.y,60,110,o.face,alpha,-.55*o.face);
  if(o.kind==='flame'&&o.age>=o.delay)stamp(2,o.x,o.y-12,80+o.charge*30,95+o.charge*45,o.face,alpha*Math.min(1,(o.age-o.delay+1)/2));
  if(o.kind==='lightning'){if(o.age<o.delay){stamp(5,o.x,o.y,75,30,1,.45);stamp(1,o.x,o.y-o.height,40,40,1,.55);}else stamp(3,o.x,o.y-o.height/2,90+o.charge*30,o.height+40,1,alpha);}
 }for(const f of fighters){const a=f.attack;if(f.characterId!=='neku'||!a)continue;
  if(a.type==='rise'&&f.timer<a.warpFrame){const q=NekuRules.safeWarp(f,a.warpTarget);ctx.save();ctx.strokeStyle=q.blocked?'#ff8fae':'#9eddff';ctx.globalAlpha=.4;ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(f.x,f.y-35);ctx.lineTo(q.x,q.y-35);ctx.stroke();ctx.restore();stamp(5,q.x,q.y-35,95,100,1,.8);stamp(1,f.x,f.y-38,65,65,1,.65);}
  if(a.type==='dash'||a.type==='psyThrow'&&f.timer<a.startupFrames){const q=a.lockPoint;stamp(4,f.x+f.face*42,f.y-45,90,85,f.face,.7);if(a.type==='dash'&&q){stamp(1,q.x,q.y,75,75,1,f.timer<=a.activeEnd?.7:.35);if(a.lockedTarget!==undefined){const e=fighters[a.lockedTarget];ctx.save();ctx.strokeStyle='#c1a0ff';ctx.lineWidth=2;ctx.globalAlpha=.55;ctx.beginPath();ctx.moveTo(f.x,f.y-35);ctx.quadraticCurveTo((e.x+f.x)/2,f.y-100,e.x,e.y-35);ctx.stroke();ctx.restore();}}}
 }}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(a.type==='dragon'?2:a.type==='gale'?3:1,f.x+f.face*30,f.y-38,45+a.charge*35,45+a.charge*35,f.face,.7);
  if(a.type==='rise'){if(t>=a.warpFrame&&t<=a.activeEnd+4)stamp(5,f.x,f.y-35,155,155,1,Math.max(0,1-(t-a.activeEnd)/5));return;}
  if(a.type==='dash'||a.type==='psyThrow')return;
  if(a.type==='gale'&&t>=a.startupFrames-2&&t<=a.startupFrames+5)stamp(7,f.x+f.face*35,f.y-55,70,70,1,.75);
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.5;if(!alpha)return;
  const up=w.shape==='up',down=['low','plunge'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',size=(w.reach??a.reach)*FIGHTER_SCALE*1.6;
  if(a.type==='downsmash'){stamp(6,f.x+(back?-55:55)*f.face,f.y-35,140,110,f.face,alpha);return;}
  if(['upsmash','uair'].includes(a.type)){stamp(3,f.x,f.y-70,100,170,1,alpha);return;}
  if(a.type==='up')stamp(4,f.x,f.y-70,100,140,1,.7*alpha);
  const n=['fair','dragon'].includes(a.type)?2:['jab3','dair'].includes(a.type)?1:0;
  {const slashIndex=n;if([0].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(n,f.x+(up||spin?0:back?-45:45)*f.face,f.y-(up?65:down?18:35),size,up?150:spin?125:85,back?-f.face:f.face,alpha,up?-Math.PI/2:w.shape==='plunge'?Math.PI/2:0);}
 }
 return{draw,drawObjects,impact};
})();
