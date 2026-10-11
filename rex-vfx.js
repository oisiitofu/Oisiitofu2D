'use strict';
const RexVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.rex?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,h,face=1,alpha=1,rot=0){const img=characterArt.rex?.frames[40+n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-h*img.width/img.height/2,-h/2,h*img.width/img.height,h);ctx.restore();}
 function rope(x,y,p,alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.lineCap='round';ctx.lineWidth=3.2;ctx.strokeStyle='#3c2518';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.lineWidth=1.3;ctx.strokeStyle='#ddbd77';ctx.stroke();const len=Math.hypot(p.x-x,p.y-y);for(let n=7;n<len;n+=9){const u=n/len,dx=(p.x-x)/len,dy=(p.y-y)/len,px=lerp(x,p.x,u),py=lerp(y,p.y,u);ctx.strokeStyle='#826448';ctx.beginPath();ctx.moveTo(px-dy*2-dx,py+dx*2-dy);ctx.lineTo(px+dy*2+dx,py-dx*2+dy);ctx.stroke();}ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(3,v.x,v.y,95+v.power*18,90+v.power*18,1,(1-u)**1.6);}
 function drawObjects(){for(const f of fighters){const a=f.attack;if(f.characterId!=='rex'||!a)continue;const t=f.timer;if(a.tether&&a.hook){const hand=t<a.hookFrame?{x:f.x+f.face*28,y:f.y-38}:{x:f.x+f.face*a.handX,y:f.y-a.handOffset},p=t<a.hookFrame?{x:lerp(a.castOrigin.x,a.hook.x,clamp((t-a.startupFrames+1)/(a.hookFrame-a.startupFrames+1),0,1)),y:lerp(a.castOrigin.y,a.hook.y,clamp((t-a.startupFrames+1)/(a.hookFrame-a.startupFrames+1),0,1))}:a.hook;if(t>=a.startupFrames){rope(hand.x,hand.y,p);prop(1,p.x,p.y,37,1,1,Math.atan2(p.y-hand.y,p.x-hand.x)+Math.PI/4);stamp(7,p.x,p.y,45,45,1,.45);}if(t>=a.releaseMin)text('X / ジャンプで離す',f.x,f.y-112,10,'#c7eeff');}
  if(a.anchorShot&&t>=a.startupFrames&&t<=a.returnEnd){const p=RexRules.anchorTip(f,a);rope(f.x+f.face*20,f.y-38,p);prop(0,p.x,p.y,34,f.face);stamp(7,p.x-f.face*12,p.y,52,28,f.face,.6);}
 }}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(4,f.x,f.y-36,70+70*a.charge,55+55*a.charge,1,.65,t*.1);if(a.anchorShot||a.tether)return;
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.6;if(!alpha)return;
  const up=w.shape==='up',low=['low','plunge','shockwave'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',x=f.x+(up||spin||w.shape==='shockwave'?0:back?-40:40)*f.face,y=f.y-(up?60:low?15:36),size=(w.reach??a.reach)*FIGHTER_SCALE*1.6;
  if(a.type==='upsmash')stamp(2,f.x,f.y-72,115,210,1,alpha);
  else if(a.type==='anchorImpact')stamp(5,f.x,f.y-25,size,90,1,alpha);
  else if(a.type==='rollImpact')stamp(6,f.x,f.y-30,size,110,1,alpha);
  else if(a.anchorDive){prop(3,f.x,f.y-3,42,1,alpha);stamp(7,f.x,f.y-29,75,120,1,.75*alpha,Math.PI/2);}
  else if(spin||a.rollDive){stamp(4,x,y,size,115,1,alpha);prop(7,x,y,105,1,.55*alpha,t*.2);}
  else {const slashIndex=a.type==='edgeFinish'||a.type==='smash'?1:0;if([0,1].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(a.type==='edgeFinish'||a.type==='smash'?1:0,x,y,size,up?145:85,back?-f.face:f.face,alpha,up?-Math.PI/2:0);}
  if(a.perfect)stamp(3,x,y,85,85,1,alpha);
 }
 function hud(f,x,y){if(f.characterId!=='rex')return;const a=f.attack;text(a?.tether?'ANCHOR / '+(a.hook?'SWING':'MISS'):a?.edgeCombo?'EDGE / '+a.comboStep+' → X':'AEGIS / SALVAGER',x+52,y+54,8,'#a7dcff','left');}
 return{stamp,prop,rope,impact,drawObjects,draw,hud};
})();
