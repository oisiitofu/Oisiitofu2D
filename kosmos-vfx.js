'use strict';
const KosmosVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.kosmos?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('kosmos',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function weapon(n,x,y,height,face=1,alpha=1,rot=0){const img=characterArt.kosmos?.frames[n];if(!img||alpha<=0)return;const width=height*img.width/img.height;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-width/2,-height/2,width,height);ctx.restore();}
 function beam(box,n=1,alpha=1){const dx=box.x2-box.x1,dy=box.y2-box.y1;stamp(n,(box.x1+box.x2)/2,(box.y1+box.y2)/2,Math.hypot(dx,dy)+box.radius*2,box.radius*2.8,1,alpha,Math.atan2(dy,dx));}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,100+v.power*13,100+v.power*13,1,(1-u)**1.7);}
 function drawObjects(){for(const q of KosmosRules.objects){const alpha=Math.min(1,(q.life-q.age+1)/5);if(q.kind==='beam'){beam(KosmosRules.beamBox(q),1,alpha);stamp(2,q.x,q.y,q.radius*3,q.radius*3,1,alpha*.5);}else stamp(5,q.x,q.y,120,165,1,alpha);}
  for(const f of fighters){if(f.characterId!=='kosmos')continue;const a=f.attack;if(!a?.gravityStep||f.timer<a.nodeDeployFrame||a.stepsStopped)continue;for(let n=0;n<3;n++){const q=a.nodeTargets[n];if(!q||a.nodeStatus[n]==='used')continue;const fade=n===a.stepIndex?1:.5;weapon(43,q.x,q.y-40,70,1,fade);stamp(3,q.x,q.y-40,90,90,1,fade*.75,frame*.012);}
   const orbit=f.timer*.1;for(let n=0;n<2;n++)weapon(42,f.x+Math.cos(orbit+n*Math.PI)*55,f.y-65+Math.sin(orbit+n*Math.PI)*25,42,f.face,.9);
  }
 }
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold){stamp(a.beamShot?1:3,f.x+f.face*34,f.y-42,60+a.charge*95,45+a.charge*65,f.face,.5);weapon(a.beamShot?46:40,f.x+f.face*25,f.y-40,a.beamShot?60:55,f.face,.9);}
  if(a.energyChain&&t>=a.chainStart&&t<=a.chainReturn){const q=KosmosRules.tip(f),from=a.chainOrigin;beam({x1:from.x,y1:from.y,x2:q.x,y2:q.y,radius:5},4,Math.min(1,(a.chainReturn-t+1)/5));weapon(44,q.x,q.y,30,f.face,1);return;}
  if(a.reel||a.swing){const o=fighters[a.chainTarget];if(o&&!o.respawn&&t<a.startupFrames)beam({x1:f.x,y1:f.y-40,x2:o.x,y2:o.y-40,radius:4},4,.65);if(a.swing&&t<=a.swingEnd)stamp(5,f.x,f.y-40,95,110,f.face,.6);}
  if(a.feint){stamp(5,f.x+f.face*30,f.y-40,120,90,f.face,Math.max(0,1-t/a.totalFrames)*.6);return;}
  if(a.beamShot){if(t>=a.startupFrames&&t<=a.startupFrames+5){stamp(2,f.x+f.face*45,f.y-42,85+a.charge*55,85+a.charge*55,f.face,1-(t-a.startupFrames)/6);if(a.charge<.75)weapon(41,f.x+f.face*18,f.y-40,56,f.face,.8);}return;}
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.6;if(!alpha)return;
  const boxes=attackVisualBoxes(f,a,Math.min(t,w.end));
  if(a.nodeArray){for(const b of boxes){weapon(42,b.x1,b.y1,40,1,alpha);beam(b,1,alpha);stamp(3,b.x2,b.y2,45,45,1,alpha);}return;}
  if(a.cannonMelee||a.type==='jab3'){for(const b of boxes){beam(b,1,alpha);stamp(2,b.x1,b.y1,55,55,1,alpha*.7);}return;}
  if(a.drill){const b=boxes[0];if(b){beam(b,6,alpha);weapon(45,(b.x1+b.x2)/2,(b.y1+b.y2)/2,70,1,alpha,Math.atan2(b.y2-b.y1,b.x2-b.x1));}return;}
  if(a.type==='drillImpact'){stamp(7,f.x,f.y-18,a.reach*FIGHTER_SCALE*2.1,130,1,alpha);return;}
  const up=w.shape==='up',low=['low','down','plunge'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',x=f.x+(up||spin?0:back?-45:45)*f.face,y=f.y-(up?65:low?20:40),size=(w.reach??a.reach)*FIGHTER_SCALE*1.7;
  if(a.nodeOrbit){for(let n=0;n<3;n++){const angle=t*.5+n*TAU/3;weapon(42,f.x+Math.cos(angle)*65,f.y-42+Math.sin(angle)*38,35,1,alpha);}}
  if(w.shape!=='spin')SlashVFX.melee(f,w,0,alpha);else stamp(0,x,y,size,spin?125:up?150:low?65:95,back?-f.face:f.face,alpha,up?-Math.PI/2:low&&w.shape!=='low'?.9:0);
 }
 function hud(f,x,y){if(f.characterId!=='kosmos')return;const a=f.attack,status=a?.gravityStep&&!a.stepsStopped?'方向: ノード / X: 次のワープ '+(a.stepIndex+1)+'/3':a?.energyChain&&a.chainConfirmed?'X: 引き寄せ / ↑X: スイング / A: 離脱':'BLADE / CHAIN / GRAVITY';text(status,x+52,y+54,8,'#b8eaff','left');}
 return{stamp,weapon,beam,impact,drawObjects,draw,hud};
})();
