'use strict';
const NaegiVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.naegi?.effects[n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function prop(n,x,y,height,face=1,alpha=1,rot=0){const img=characterArt.naegi?.frames[40+n];if(!img||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;const w=height*img.width/img.height;ctx.drawImage(img,-w/2,-height/2,w,height);ctx.restore();}
 function impact(v){const u=(v.max-v.life)/v.max;stamp(1,v.x,v.y,85+v.power*24,85+v.power*24,1,(1-u)**1.5);}
 function drawObjects(){for(const o of NaegiRules.objects){const fade=Math.min(1,(o.life-o.age)/8);
  if(o.kind==='shot'){stamp(2,o.x-o.face*12,o.y,90+o.charged*55,55+o.charged*25,o.face,fade,Math.atan2(o.vy,Math.abs(o.vx)));prop(7,o.x,o.y,30+o.charged*8,o.face,fade,o.age*.12);}
  if(o.kind==='evidence'){const live=o.age>=o.warning&&o.age<o.warning+o.active;stamp(6,o.x,o.y,live?78:48,live?78:48,1,fade*(live?1:.45));prop(7,o.x,o.y,live?50:32,o.face,fade,o.age*.06);if(live)stamp(1,o.x,o.y,90,90,1,fade);}
  if(o.kind==='foothold'){stamp(3,o.x,o.y+2,90,45,1,fade);stamp(7,o.x,o.y+7,55,30,1,.3*fade);}
  if(o.kind==='spark')stamp(1,o.x,o.y,90,90,1,fade);
  if(o.kind==='support'){const ready=o.age>=o.warning;prop(o.type===0&&ready?1:NaegiRules.supports[o.type].pose,o.x,o.y,100,o.face,fade*(ready?1:.65));if(!ready)stamp(6,o.x,o.y-25,45,45,1,.4*fade);else if(o.type===2)stamp(4,o.x+o.face*24,o.y,105,110,1,.6*fade);else if(o.age<o.warning+o.active){stamp(o.type===0?1:2,o.x+o.face*15,o.y,110,100,o.face,fade);}}
 }for(const f of fighters){if(f.characterId!=='naegi'||!f.attack)continue;const a=f.attack,t=f.timer;if(a.hopeStep&&t<a.firstStart){stamp(3,a.firstTarget.x,a.firstTarget.y,75,36,1,.55);ctx.save();ctx.strokeStyle='#ff8dda';ctx.globalAlpha=.4;ctx.lineWidth=1.5;ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(a.firstTarget.x,a.firstTarget.y);ctx.stroke();ctx.restore();}if(a.hopeStep&&t>=a.secondInputStart&&t<=a.secondInputEnd){stamp(3,f.x,f.y,100,45,1,.9);text('必殺をもう一度',f.x,f.y-112,11,'#ffe6f8');}}}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hold)stamp(6,f.x+f.face*35,f.y-38,40+a.charge*35,40+a.charge*35,1,.8,t*.07);
  if(a.type==='dragon'&&t>=a.startupFrames-2&&t<=a.startupFrames+3)stamp(6,f.x+f.face*34,f.y-36,60,60,1,.8);
  if(a.debate||a.type==='gale')return;
  const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/5)*.5;if(!alpha)return;
  const up=w.shape==='up',down=['low','plunge'].includes(w.shape),spin=w.shape==='spin',back=w.shape==='back',x=f.x+(up||spin?0:back?-40:40)*f.face,y=f.y-(up?63:down?18:36),size=(w.reach??a.reach)*FIGHTER_SCALE*1.6;
  {const slashIndex=a.type==='debateFinish'?2:a.hopeStep?3:0;if([0,2].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(a.type==='debateFinish'?2:a.hopeStep?3:0,x,y,size,spin?115:up?130:80,back?-f.face:f.face,alpha,up?-Math.PI/2:w.shape==='plunge'?Math.PI/2:0);}
  if(a.prop!==undefined){prop(a.prop,x,y,a.prop===5?50:38,f.face,alpha,t*.13);stamp(5,x,y,75,55,f.face,.65*alpha);}
  if(a.companion!==undefined)prop(a.companion,x,y-12,90,f.face,.8*alpha);
  if(a.type==='smash'||a.type==='debateFinish')stamp(1,x+f.face*20,y,90,100,1,alpha);
 }
 function hud(f,x,y){if(f.characterId!=='naegi')return;const n=f.naegiSupport||0;text('NEXT / '+NaegiRules.supports[n].name,x+52,y+54,8,'#9ccbf5','left');ctx.fillStyle='#45516b';ctx.fillRect(x+192,y+46,50,3);ctx.fillStyle='#68baff';ctx.fillRect(x+192,y+46,50*(1-(f.naegiSupportCooldown||0)/NaegiMoves.gale.supportCooldown),3);}
 return{stamp,prop,impact,drawObjects,draw,hud};
})();
