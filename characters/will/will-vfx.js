'use strict';
const WillVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.will?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('will',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function summon(n,x,y,height,face=1,alpha=1){const img=characterArt.will?.frames[n];if(!img||alpha<=0)return;const width=height*img.width/img.height;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.scale(face,1);AttackEffects.image(img,-width/2,-height,width,height);ctx.restore();}
 function body(f,alpha){const a=f.attack;if(!a?.horse||!a.mounted||f.timer>a.rideEnd)return false;const n=f.grounded?40+Math.floor(f.timer/5)%2:f.vy<0?42:43,horseHeight=108,rider=spriteFor(f,16);ctx.save();ctx.globalAlpha*=alpha;summon(n,f.x,f.y,horseHeight,f.face);if(rider){const scale=.72*FIGHTER_SCALE;ctx.translate(f.x+f.face*5,f.y-42);ctx.scale(f.face,1);AttackEffects.image(rider,-rider.width*scale/2,-rider.height*scale,rider.width*scale,rider.height*scale);}ctx.restore();return true;}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(3,v.x,v.y,95+v.power*16,95+v.power*16,1,(1-u)**1.6);}
 function drawObjects(){for(const q of WillRules.objects){const fade=Math.min(1,(q.life-q.age+1)/5),size=q.charged?130:80;stamp(q.kind==='element'?7:q.charged?2:1,q.x,q.y,size,q.radius*3.4,q.face,fade,q.kind==='element'&&q.family==='ice'?Math.PI:0);}
  for(const f of fighters)if(f.characterId==='will'){const a=f.attack,c=WillRules.form(f);if(c){const pulse=Math.max(0,(f.willFormFlash-frame)/24);if(pulse>0){summon(c.archetype,f.x-f.face*45,f.y,185,f.face,pulse*.8);stamp(f.willForm===1?6:2,f.x,f.y-45,130,130,1,pulse*.8);}else stamp(f.willForm===1?6:f.willForm===2?5:2,f.x,f.y-6,70,25,1,.18*Math.min(1,f.willFormTime/30));}
   if(a?.bladeRide){const q=WillRules.marker(f);if(q&&f.timer>=a.aimStart&&f.timer<=a.flightEnd){const locked=!!a.launched;summon(47,q.x,q.y,locked?95:80,1,.88);stamp(5,q.x,q.y-37,90,90,1,.7,locked?0:frame*.015);ctx.save();ctx.globalAlpha=.4;ctx.strokeStyle=locked?'#ffd383':'#8edfff';ctx.lineWidth=1.5;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(f.x,f.y-45);ctx.lineTo(q.x,q.y-45);ctx.stroke();ctx.restore();}}
  }
 }
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(a.type==='warriorSpell'?6:a.type==='mageSpell'?7:2,f.x,f.y-40,65+a.charge*75,65+a.charge*75,1,.55,t*.035);
  if(a.horse&&a.mounted){if(Math.abs(f.vx)>4)stamp(4,f.x-f.face*35,f.y-24,135,85,f.face,.3);return;}
  if(a.bladeRide&&a.launched&&t<=a.flightEnd){stamp(0,f.x,f.y-40,150,70,f.face,.6,-.7);return;}
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.6;if(!alpha)return;
  const up=w.shape==='up',low=['low','down','plunge'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',x=f.x+(up||spin?0:back?-45:45)*f.face,y=f.y-(up?65:low?20:40),size=(w.reach??a.reach)*FIGHTER_SCALE*1.7;
  if(a.archetype)summon(a.archetype,f.x-f.face*45,f.y,185,f.face,alpha*.65);
  if(a.type==='smash'||a.type==='warriorSpell')stamp(6,x,y,size,140,f.face,alpha);
  else if(a.type==='upsmash')SlashVFX.melee(f,w,0,alpha);
  else {const slashIndex=back?2:0;if([0].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(back?2:0,x,y,size,spin?130:up?150:low?80:100,back?-f.face:f.face,alpha,up?-Math.PI/2:low&&w.shape!=='low'?.9:0);}
 }
 function hud(f,x,y){if(f.characterId!=='will')return;const a=f.attack,c=WillRules.form(f),status=a?.horse?'←→: 騎乗 / Jump: 跳躍 / X・Z: 降り斬り':a?.bladeRide&&f.timer<a.launchFrame?'←↑↓→: 照準 / X: 確定':c?c.name+' '+Math.ceil(f.willFormTime/60)+'s / ↓X: 次の型':'WIND / HORSE / ARCHETYPE';text(status,x+52,y+54,8,c?.color||'#acdcff','left');}
 return{stamp,summon,body,impact,drawObjects,draw,hud};
})();
