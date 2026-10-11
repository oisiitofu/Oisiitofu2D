'use strict';
const MakotoVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.makoto?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function persona(n,x,y,height,face=1,alpha=.75){const img=characterArt.makoto?.frames[40+n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;const width=height*img.width/img.height;ctx.drawImage(img,-width/2,-height,width,height);ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,75+v.power*30,75+v.power*30,1,(1-u)**1.5);}
 function drawObjects(){for(const o of MakotoRules.objects){const alpha=Math.min(1,(o.life-o.age)/8);
  if(o.kind==='fire'){if(o.burst)stamp(2,o.x,o.y,90+o.charge*65,90+o.charge*65,1,alpha*(1-o.burst/11));else stamp(1,o.x-o.face*14,o.y,75+o.charge*50,40+o.charge*35,o.face,alpha);}
  if(o.kind==='jack'){persona(2,o.x,o.y+24,64,o.face,alpha);if(o.age<=o.delay)stamp(3,o.x-o.face*25,o.y+9,85,45,o.face,.65*alpha);}
  if(o.kind==='flame'){persona(3,o.x,o.y-30,85,o.face,alpha);if(o.age>=o.delay)stamp(2,o.x,o.y-30,135,115,1,alpha);else stamp(7,o.x,o.y-30,60,60,1,.5);}
  if(o.kind==='king'){persona(o.charge>=.5?4:5,o.x,o.y,110+o.charge*30,o.face,alpha*.65);}
  if(o.kind==='pillar'){if(o.age<o.delay)stamp(7,o.x,o.y,70+o.charge*40,30,1,.35);else{const grow=clamp((o.age-o.delay+1)/3,0,1);stamp(3,o.x,o.y-o.height*grow/2,(o.radius*2+30)*grow,o.height*grow+25,1,alpha);}}
 }for(const f of fighters){const a=f.attack;if(f.characterId!=='makoto'||!a||a.type!=='rise'||f.timer<a.flightStart)continue;const alpha=f.timer>a.activeEnd?Math.max(0,1-(f.timer-a.activeEnd)/8):.75;persona(0,f.x-f.face*25,f.y+20,140,f.face,.45*alpha);stamp(5,f.x,f.y-20,125,160,f.face,alpha,a.flightAngle+Math.PI/2);}}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold){persona(0,f.x-f.face*40,f.y+6,135,f.face,.45);stamp(a.type==='gale'?7:1,f.x+f.face*35,f.y-35,35+a.charge*40,35+a.charge*40,f.face,.6);}
  if(['dragon','dash','gale'].includes(a.type)&&t>=a.startupFrames-3&&t<=a.startupFrames+7)stamp(7,f.x,f.y-38,90,110,1,.75);
  if(a.type==='dragon'&&t>=a.startupFrames-2&&t<=a.startupFrames+6)persona(0,f.x-f.face*38,f.y+4,150,f.face,.65);
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/6)*.55;if(!alpha)return;
  if(a.type==='smash'){persona(6,f.x-f.face*30,f.y,155,f.face,.8*alpha);stamp(2,f.x+f.face*70,f.y-40,150,120,1,alpha);}
  if(a.type==='upsmash'){persona(0,f.x-f.face*30,f.y,140,f.face,.6*alpha);stamp(6,f.x,f.y-70,100,180,1,alpha);return;}
  if(a.type==='downsmash'){persona(7,f.x,f.y+10,175,f.face,.7*alpha);stamp(4,f.x,f.y-25,220,110,f.face,alpha);return;}
  if(['uair','dair','jab3','up'].includes(a.type))persona(1,f.x-f.face*35,f.y+4,130,f.face,.55*alpha);
  if(a.type==='rise')return;const up=w.shape==='up',back=w.shape==='back',spin=w.shape==='spin',down=['low','plunge'].includes(w.shape),size=(w.reach??a.reach)*FIGHTER_SCALE*1.5;
  if(w.shape!=='spin')SlashVFX.melee(f,w,0,alpha);else stamp(0,f.x+(up||spin?0:back?-45:45)*f.face,f.y-(up?65:down?15:35),size,up?150:spin?125:85,back?-f.face:f.face,alpha,up?-Math.PI/2:w.shape==='plunge'?Math.PI/2:0);
 }
 return{draw,drawObjects,impact};
})();
