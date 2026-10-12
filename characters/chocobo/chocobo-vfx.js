'use strict';
const ChocoboVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1){const img=characterArt.chocobo?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h,w,h);ctx.restore();}
 function feather(x,y,size,angle,alpha=1){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.beginPath();ctx.moveTo(-size,0);ctx.quadraticCurveTo(0,-size*.65,size,0);ctx.quadraticCurveTo(0,size*.35,-size,0);ctx.fillStyle='#ffdd7b';ctx.fill();ctx.strokeStyle='#fff2bd';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(size,0);ctx.stroke();ctx.restore();}
 function guard(f){stamp(7,f.x,f.y+9,103,103,1,.7);}
 function impact(v){const t=(v.max-v.life)/v.max,size=(68+v.power*36)*(1+t*.3);ctx.save();ctx.globalCompositeOperation='source-over';stamp(4,v.x,v.y+size/2,size,size,1,(1-t)**1.5);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.targetedMeteor){const ball=ChocoboRules.meteor(f),target=ball.target;ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle='#ffcf85';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(target.x,target.y-2,27+16*a.charge,8,0,0,TAU);ctx.stroke();ctx.restore();if(t>=a.meteorFallStart&&t<a.meteorImpactStart)stamp(3,ball.x,ball.y+ball.radius,ball.radius*3.5,ball.radius*5.5);else if(t>=a.meteorImpactStart){const fade=Math.max(0,1-(t-a.meteorImpactStart)/12),size=110+70*a.charge;stamp(4,target.x,target.y+7,size*1.35,size,1,fade);}return;}
  const live=CombatData.activeWindow(a,t),w=live||a.activeFrames.filter(w=>w.end<t).at(-1),age=live?0:w?t-w.end:99,fade=live?1:Math.max(0,1-age/7)*.4;
  if(a.glideStart&&t>=a.glideStart&&t<=a.glideEnd){stamp(5,f.x,f.y+35,112,85,f.face,.25+.12*Math.sin(t*.4));for(let j=0;j<3;j++)feather(f.x+Math.sin(t*.13+j*2)*35,f.y+8+j*7,5,t*.1+j,.6);return;}
  if(a.type==='gale'&&t<16){stamp(6,f.x+f.face*35,f.y-29,35+t*2,35+t*2,f.face,.35);return;}
  if(!w||!fade||a.type==='grab'||a.type.endsWith('Throw'))return;
  if(a.type==='gale'){const r=a.reach*FIGHTER_SCALE;stamp(6,f.x+f.face*r*.6,f.y+24,r*1.2,r*1.2,f.face,fade);return;}
  const r=(w.reach??a.reach)*FIGHTER_SCALE,up=w.shape==='up',back=w.shape==='back',side=back?-f.face:f.face;ctx.save();ctx.globalAlpha*=fade;ctx.translate(f.x+(up?0:side*r*.45),f.y-(up?65:31));ctx.rotate((w.shape==='down'?1.4:up?-.8:0)*side);stamp(5,0,r*.47,r*1.65,r*1.45,side);ctx.restore();for(let j=0;j<5;j++){const ang=j*1.4+t*.08;feather(f.x+Math.cos(ang)*r*.75,f.y-35+Math.sin(ang)*r*.55,6+j%2,ang,fade);}
 }
 return{draw,guard,impact};
})();
