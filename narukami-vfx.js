'use strict';
const NarukamiVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rotation=0){const img=characterArt.narukami?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('narukami',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function persona(n,x,y,height,face=1,alpha=.65){const img=characterArt.narukami?.frames[40+n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;const w=height*img.width/img.height;ctx.drawImage(img,-w/2,-height,w,height);ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(7,v.x,v.y,80+v.power*30,80+v.power*30,1,(1-u)**1.5);}
 function drawObjects(){for(const o of NarukamiRules.objects){const alpha=Math.min(1,(o.life-o.age)/8);
  if(o.kind==='spell')stamp(o.effect,o.x-o.face*10,o.y,o.charged?125:95,o.charged?85:60,o.face,alpha);
  if(o.kind==='portal')stamp(6,o.x,o.y,100,145,1,alpha);
  if(o.kind==='spark')stamp(7,o.x,o.y,85,85,1,alpha);
  if(o.kind==='change'){const c=NarukamiRules.forms[o.formIndex];persona(c.persona,o.x-30*o.face,o.y+38,145,o.face,.65*alpha);stamp(6,o.x,o.y,105,140,1,.6*alpha);}
 }for(const f of fighters){if(f.characterId!=='narukami')continue;const a=f.attack;if(!a)continue;const t=f.timer;
  if(a.hold)persona(a.type==='dragon'?NarukamiRules.forms[a.formIndex].persona:0,f.x-f.face*30,f.y+4,150,f.face,.45);
  if(a.type==='dragon'&&t>=a.startupFrames-2&&t<=a.spellShots.at(-1)+4)persona(NarukamiRules.forms[a.formIndex].persona,f.x-f.face*40,f.y+8,155,f.face,.65);
  if(a.spectralChain&&t>=a.chainStart-3){persona(2,f.x-f.face*32,f.y+3,150,f.face,.7);const q=a.chainConfirmed?fighters[a.chainTarget]:null,p=q?{x:q.x,y:q.y-38}:NarukamiRules.chain(f,Math.min(t,a.chainEnd)),from=a.chainOrigin,dx=p.x-from.x,dy=p.y-from.y,angle=Math.atan2(dy,dx);stamp(5,(from.x+p.x)/2,(from.y+p.y)/2,Math.max(30,Math.hypot(dx,dy)),55,1,t<=a.chainEnd?1:.5,angle+.65);}
  if(a.type==='rise'){const alpha=t>a.activeEnd?Math.max(0,1-(t-a.activeEnd)/7):.55;persona(1,f.x-f.face*25,f.y+10,160,f.face,alpha);if(a.warpTarget&&t<a.warpFrame){const q=NarukamiRules.safeWarp(f,a.warpTarget);stamp(6,q.x,q.y-38,95,130,1,q.blocked?.4:.75);ctx.save();ctx.strokeStyle=q.blocked?'#ff96ac':'#8ed5ff';ctx.globalAlpha=.4;ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(f.x,f.y-38);ctx.lineTo(q.x,q.y-38);ctx.stroke();ctx.restore();}}
  const w=CombatData.activeWindow(a,t);if(w&&a.persona!==undefined&&a.type!=='rise')persona(a.rushForm?.persona??a.persona,f.x-f.face*35,f.y+4,155,f.face,.65);
 }}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(a.type==='dragon'?NarukamiRules.forms[a.formIndex].effect:1,f.x+f.face*32,f.y-40,45+a.charge*35,45+a.charge*35,f.face,.7);
  if(a.spectralChain||a.type==='gale')return;
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.5;if(!alpha)return;
  const up=w.shape==='up',down=['low','plunge'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',size=(w.reach??a.reach)*FIGHTER_SCALE*1.6;
  let effect=a.rushForm?.effect??(['fair','smash'].includes(a.type)?1:['bair','uair','upsmash'].includes(a.type)?2:['downsmash','dair'].includes(a.type)?3:0);
  if(a.type==='rise'&&t<a.selectionStart||a.type==='chainSlash')effect=0;
  {const slashIndex=effect;if([0].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(effect,f.x+(up||spin?0:back?-45:45)*f.face,f.y-(up?65:down?18:35),size,up?155:spin?130:85,back?-f.face:f.face,alpha,up?-Math.PI/2:w.shape==='plunge'?Math.PI/2:0);}
  if(a.type==='smash')stamp(0,f.x+f.face*55,f.y-35,175,90,f.face,.7*alpha);
  if(a.type==='upsmash')stamp(6,f.x,f.y-65,100,165,1,.6*alpha);
 }
 function hud(f,x,y){if(f.characterId!=='narukami')return;const active=f.narukamiFormTime>0,c=NarukamiRules.form(f);text(active?c.name:'IZANAGI',x+52,y+54,8,active?'#f9da73':'#8aa5c9','left');ctx.fillStyle='#45516b';ctx.fillRect(x+192,y+46,50,3);ctx.fillStyle='#68baff';ctx.fillRect(x+192,y+46,50*(f.narukamiFormTime||0)/NarukamiMoves.gale.formDuration,3);}
 return{draw,drawObjects,impact,hud};
})();
