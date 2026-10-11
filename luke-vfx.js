'use strict';
const LukeVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.luke?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('luke',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(3,v.x,v.y,100+v.power*17,90+v.power*17,1,(1-u)**1.6);}
 function drawObjects(){for(const q of LukeRules.objects){const fade=Math.min(1,(q.life-q.age+1)/4);stamp(q.kind==='roar'?4:1,q.x,q.y,q.kind==='roar'?135:110+q.charge*60,q.radius*3,q.face,fade);}
  for(const f of fighters)if(f.characterId==='luke'&&f.lukeDemonTime){const fade=Math.min(1,f.lukeDemonTime/30);stamp(6,f.x,f.y-52,110,160,1,(.5+Math.sin(frame*.17)*.12)*fade);}}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(1,f.x,f.y-38,60+70*a.charge,45+55*a.charge,1,.6,t*.06);if(a.type==='gale'&&t>=a.activationFrame)stamp(6,f.x,f.y-50,145,185,1,Math.max(0,1-(t-a.activationFrame)/12));
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.6;if(!alpha)return;
  const up=w.shape==='up',low=['low','plunge','shockwave','down'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',x=f.x+(up||spin||w.shape==='shockwave'?0:back?-40:40)*f.face,y=f.y-(up?63:low?18:37),size=(w.reach??a.reach)*FIGHTER_SCALE*1.65;
  if(a.falcon||a.falconKick)stamp(2,x,y,size,125,f.face,alpha,-.25);
  else if(a.type==='upsmash')stamp(2,f.x,f.y-70,110,210,1,alpha,-.45);
  else if(a.type==='falconImpact'||a.type==='downsmash')stamp(5,x,y,size,100,back?-f.face:f.face,alpha);
  else if(a.type==='dragon')stamp(1,x,y,size,95,f.face,alpha);
  else if(spin||a.lionRoar)stamp(4,x,y,size,110,f.face,alpha);
  else if(w.shape!=='spin')SlashVFX.melee(f,w,0,alpha);else stamp(0,x,y,size,up?150:low?85:95,back?-f.face:f.face,alpha,up?-Math.PI/2:low&&w.shape!=='low'?.65:0);
 }
 function hud(f,x,y){if(f.characterId!=='luke')return;const a=f.attack;const status=f.lukeDemonTime?'魔神剣 '+Math.ceil(f.lukeDemonTime/60)+'s':f.lukeDemonCooldown?'再使用 '+Math.ceil(f.lukeDemonCooldown/60)+'s':'TIGER / LION / FALCON';text(a?.falcon&&f.timer>=a.branchStart?'X: 横蹴り / ↓X: 落星':a?.lionChain?'獅子戦吼 '+a.step+' → X / ←X':status,x+52,y+54,8,f.lukeDemonTime?'#ff8f9e':'#a7dcff','left');}
 return{stamp,impact,drawObjects,draw,hud};
})();
