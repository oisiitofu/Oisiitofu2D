'use strict';
const ReanVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.rean?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max,size=(75+v.power*38)*(1+t*.4);stamp(5,v.x,v.y,size,size,1,(1-t)**1.5);}
 function draw(f){
  for(const o of ReanRules.objects)if(o.owner===f.id){const s=1+o.tier*.3;for(let j=3;j>0;j--)stamp(1,o.x-o.vx*j*.65,o.y,83*s,86*s,o.face,.12/j);stamp(1,o.x,o.y,83*s,86*s,o.face,1);}
  if(f.reanDemonTime>0){const pulse=1+Math.sin(frame*.16)*.055;stamp(4,f.x,f.y-47,112*pulse,147*pulse,1,.65);drawSprite(f);}
  const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(a.type==='dragon'?1:0,f.x+f.face*28,f.y-36,42+a.charge*42,42+a.charge*42,f.face,.6);
  if(a.type==='gale'){if(t>=a.activationFrame){stamp(4,f.x,f.y-47,165,180,1,Math.max(0,1-(t-a.activationFrame)/19));drawSprite(f);}return;}
  if(a.type==='dragon')return;
  if(a.type==='dash'&&t>=a.phaseStart&&t<=a.phaseEnd){stamp(6,f.x-f.face*65,f.y-27,170,70,f.face,.55);stamp(2,f.x-f.face*35,f.y-30,148,85,f.face,.7);}
  if(a.type==='rise'&&t>=a.spiralStart&&t<=a.spiralEnd){stamp(3,f.x,f.y-38,132,174,1,.8);drawSprite(f);}
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;
  const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/6)*.55;if(!alpha||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin';
  const n=a.type==='demonFinish'||a.type==='downsmash'?7:a.type==='dash'?2:f.reanDemonTime?7:0;
  const size=(w.reach??a.reach)*FIGHTER_SCALE*1.5;
  {const slashIndex=n;if([0].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(n,f.x+(spin||up?0:back?-44:42)*f.face,f.y-(up?68:down?12:35),size,up?149:spin?128:90,back?-f.face:f.face,alpha,up?-Math.PI/2:down?Math.PI/2:0);}
 }
 function hud(f,x,y){const active=f.reanDemonTime>0,cooldown=f.reanDemonCooldown||0;
  const label=active?'鬼気解放 '+(f.reanDemonTime/60).toFixed(1)+'s':cooldown?'鬼気解放 あと'+(cooldown/60).toFixed(1)+'s':'鬼気解放 使用可';
  text(label,x+52,y-10,11,active?'#ff778b':cooldown?'#a9bdd6':'#dfe9ff','left');
  const ratio=active?f.reanDemonTime/ReanMoves.gale.demonDuration:1-cooldown/ReanMoves.gale.demonCooldown;
  line([[x+52,y-4],[x+230,y-4]],'#3b465c',2);line([[x+52,y-4],[x+52+178*ratio,y-4]],active?'#ff4d6a':'#8ba4ca',2);
 }
 return{draw,impact,hud};
})();

// Reserve the existing gauge above the panel when placing the player-name row.
if(typeof BattleHud!=='undefined')BattleHud.reserve('rean',20);
