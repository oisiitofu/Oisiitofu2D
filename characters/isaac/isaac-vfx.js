'use strict';
const IsaacVFX=(()=>{
 let art=[];
 function load(sheet){art=Array.from({length:8},(_,n)=>{const c=document.createElement('canvas');c.width=sheet.width/4;c.height=sheet.height/2;c.getContext('2d').drawImage(sheet,n%4*c.width,Math.floor(n/4)*c.height,c.width,c.height,0,0,c.width,c.height);return c;});}
 function stamp(n,x,y,width,height,face=1){if(!art[n])return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.drawImage(art[n],-width/2,-height,width,height);ctx.restore();}
 function rock(x,y,size,seed=0){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(seed)*.23);const g=ctx.createLinearGradient(-size,-size,size,size);g.addColorStop(0,'#fff4b1');g.addColorStop(.28,'#d7ad65');g.addColorStop(.6,'#866441');g.addColorStop(1,'#39383e');path([[-size*.6,size*.5],[-size*.85,-size*.05],[-size*.25,-size],[size*.45,-size*.73],[size*.72,size*.2],[size*.25,size*.65]],g,'#322e36',1.7);path([[-size*.25,-size],[size*.05,-size*.15],[size*.72,size*.2]],null,'#ffe0a0',1.2);path([[-size*.85,-size*.05],[size*.05,-size*.15],[size*.25,size*.65]],null,'#654b38',1.2);ctx.restore();}
 function ribbon(f,w,fade){const a=f.attack,g=CombatData.geometry[w.shape],r=(w.reach??a.reach)*FIGHTER_SCALE,p=clamp((f.timer-w.start)/Math.max(1,w.end-w.start),0,1),angle=lerp(g.angles[0],g.angles[1],p);ctx.save();ctx.translate(f.x+g.origin[0]*f.face*FIGHTER_SCALE,f.y+g.origin[1]*FIGHTER_SCALE);ctx.scale(f.face,1);ctx.rotate(angle);ctx.globalAlpha*=fade;ctx.globalCompositeOperation='lighter';const outer=[],inner=[];for(let j=0;j<=28;j++){const t=j/28,theta=-1.3+t*1.9,tip=Math.sin(t*Math.PI);outer.push([Math.cos(theta)*r,Math.sin(theta)*r*.65]);inner.unshift([Math.cos(theta)*(r-28*tip),Math.sin(theta)*(r-28*tip)*.65]);}const glow=ctx.createLinearGradient(-r,-r,r,r);glow.addColorStop(0,'#ffe19500');glow.addColorStop(.5,'#eb9f39a0');glow.addColorStop(1,'#fffbd8');ctx.shadowColor='#ffc557';ctx.shadowBlur=11;path([...outer,...inner],glow);ctx.beginPath();outer.forEach((v,n)=>n?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle='#fffad4';ctx.lineWidth=2;ctx.stroke();for(let j=0;j<11;j++){let theta=j*.67+f.timer*.17,dist=r*(.55+j*.045);ctx.globalAlpha=fade*(1-j/14);path([[Math.cos(theta)*dist,Math.sin(theta)*dist*.6],[Math.cos(theta)*dist-6,Math.sin(theta)*dist*.6+1],[Math.cos(theta)*dist-11,Math.sin(theta)*dist*.6+5]],'#ffe2a4');}ctx.restore();}
 function pulse(f,r,age){stamp(6,f.x,f.y+15,r*2.25,r*.85);ctx.save();ctx.translate(f.x,f.y-5);ctx.scale(1,.25);ctx.globalCompositeOperation='lighter';for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(0,0,r-k*9,r-k*9,0,0,TAU);ctx.strokeStyle=k===0?'#fff0b9':'#eab64e';ctx.lineWidth=k===0?3:1;ctx.stroke();}ctx.restore();for(let n=0;n<12;n++){let t=n/11,side=n%2?1:-1;rock(f.x+side*r*t,f.y-Math.sin(t*Math.PI)*26-age*2,5+(n%3)*3,n);}}
 function hand(f,p){stamp(2,f.x+f.face*(52+p*100),f.y+6,140,116,f.face);}
 function vine(f,t){const height=Math.min(250,90+t*9);stamp(4,f.x,f.y+height*.68,100,height);}
 function draw(f){const a=f.attack;if(!a)return;let w=CombatData.activeWindow(a,f.timer),live=!!w,age=0;if(!w){w=a.activeFrames.filter(q=>q.end<f.timer).at(-1);age=w?f.timer-w.end:0;}const fade=live?1:Math.max(0,1-age/8)*.55;ctx.save();
  if(a.earthEffect==='vine'&&f.timer>=a.startupFrames)vine(f,f.timer-a.startupFrames);
  if(a.earthEffect==='hand'&&f.timer<=18&&f.timer>=5)hand(f,clamp((f.timer-5)/6,0,1));
  if(a.earthEffect==='granite'&&f.timer<=27){stamp(3,f.x-f.face*44,f.y+Math.sin(frame*.09)*3,73,89,f.face);}
  if(a.hold){pulse(f,26+32*a.charge,0);ctx.restore();return;}
  if(!w||fade<=0){ctx.restore();return;}ctx.globalAlpha*=fade;
  if(a.earthSpikes){for(const b of attackVisualBoxes(f,a,live?f.timer:w.end)){const height=b.y1-b.y2;stamp(0,b.x1,f.y+3,68,height+15,f.face);}}
  else if(w.shape==='shockwave'){pulse(f,a.reach*FIGHTER_SCALE*(.4+.6*clamp((f.timer-w.start)/(w.end-w.start||1),0,1)),age);}
  else {ribbon(f,w,1);if(['gaia','rock','orbit'].includes(a.earthEffect)){for(let n=0;n<7;n++){const ang=n/7*TAU+f.timer*.2,r=(w.reach??a.reach)*FIGHTER_SCALE*.78;rock(f.x+Math.cos(ang)*r,f.y-38+Math.sin(ang)*r,9+n%3,n);}}if(a.earthEffect==='ragnarok'){stamp(5,f.x+f.face*83,f.y+5,110,190,f.face);}}
  ctx.restore();
 }
 return{draw,load,loadFrames:frames=>{art=frames;}};
})();
