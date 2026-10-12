'use strict';
const FaytVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.fayt?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,95+v.power*13,95+v.power*13,1,(1-u)**1.7);}
 function drawObjects(){for(const q of FaytRules.objects){const alpha=Math.min(1,(q.life-q.age+1)/5);if(q.kind==='portal'){const pulse=Math.sin(Math.PI*Math.min(1,(q.age+1)/q.life));stamp(4,q.x,q.y,130*pulse,150*pulse,1,alpha*.9,q.age*.1);}else if(q.kind==='pellet'){stamp(1,q.x,q.y,q.radius*6,q.radius*4,q.face,alpha,Math.atan2(q.vy,Math.abs(q.vx)));}else if(q.kind==='rain')stamp(5,q.x,q.y,q.radius*4.5,q.radius*8,1,alpha,Math.atan2(q.vx,q.vy));else stamp(7,q.x,q.y,75,75,1,alpha);}
  for(const f of fighters){if(f.characterId!=='fayt')continue;const a=f.attack;if(a?.dimensionDoor&&f.timer>=a.aimFrames[0]&&f.timer<a.warpFrame&&!a.portalFeint){const q=a.portalTarget;stamp(4,q.x,q.y-42,70,85,1,.45,f.timer*.12);ctx.save();ctx.globalAlpha=.4;ctx.strokeStyle=q.blocked?'#ffc47a':'#bdaaff';ctx.lineWidth=1.5;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(f.x,f.y-42);ctx.lineTo(q.x,q.y-42);ctx.stroke();ctx.restore();}}
 }
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.hold){stamp(a.shotgun?1:0,f.x+f.face*32,f.y-40,55+a.charge*70,55+a.charge*70,f.face,.5,frame*.045);}
  if(a.airRaid&&t>=a.flightFrames[0]&&t<=a.flightFrames[1])stamp(5,f.x-f.face*20,f.y-25,170,140,f.face,.65,-.35);
  if(a.dimensionDoor&&a.portalFeint&&t>=a.warpFrame&&t<=a.warpFrame+5){stamp(4,f.x,f.y-42,100,125,1,1-(t-a.warpFrame)/6,t*.12);return;}
  if(a.shotgun&&a.shotConfigured&&a.spellShots.some(s=>t>=s&&t<=s+3)){const last=a.spellShots.filter(s=>s<=t).at(-1);stamp(7,f.x+f.face*40,f.y-40,65,65,f.face,(1-(t-last)/4)*.75);}
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.6;if(!alpha)return;
  const up=w.shape==='up',low=['low','down','plunge'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',x=f.x+(up||spin?0:back?-45:45)*f.face,y=f.y-(up?65:low?20:40),size=(w.reach??a.reach)*FIGHTER_SCALE*1.7;
  if(a.stoneRain){for(const dx of a.stoneOffsets)stamp(3,f.x+dx,f.y-a.stoneHeight*.5,85,a.stoneHeight*1.4,1,alpha);return;}
  if(a.lightning){stamp(2,f.x,f.y-90,130,215,1,alpha);return;}
  if(a.sideKick){stamp(6,f.x+f.face*a.reach*FIGHTER_SCALE*.5,f.y-a.kickHeight,size,95,f.face,alpha);return;}
  if(a.dimensionDoor){stamp(4,f.x,f.y-40,95,115,1,alpha*.4,-t*.1);stamp(0,x,y,size,120,back?-f.face:f.face,alpha);return;}
  if(a.divine){stamp(0,x,y,size,140,f.face,alpha);stamp(1,x+f.face*15,y,size*.8,100,f.face,alpha*.35);return;}
  {const slashIndex=a.blazing||a.shotgun?1:a.airRaid?5:0;if([0,1].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(a.blazing||a.shotgun?1:a.airRaid?5:0,x,y,size,spin?130:up?150:low?75:105,back?-f.face:f.face,alpha,up?-Math.PI/2:low&&w.shape!=='low'?.9:0);}
 }
 function hud(f,x,y){if(f.characterId!=='fayt')return;const a=f.attack,status=a?.dimensionDoor&&f.timer<a.warpFrame?'方向: 再出現位置 / A: フェイント':a?.airRaid?'←→: 上昇軌道 / 下方へエネルギー射撃':a?.shotgun?'SHOTGUN '+(a.shotTier?.shots.length||1)+' VOLLEY':'SWORD / DIMENSION / AIR RAID';text(status,x+52,y+54,8,'#a9dfff','left');}
 return{stamp,impact,drawObjects,draw,hud};
})();
