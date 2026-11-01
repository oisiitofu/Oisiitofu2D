'use strict';
// Contact material and weight are shared by simulation, sound and sparks.
// No clocks, audio state, randomness or fighter mutation enter this resolver.
const HitFeedback=(()=>{
 const profiles=Object.freeze({
  light:{stop:.72,bias:0,life:10,shake:.3,camera:.3,rate:1.12,duration:.13,release:.018,gain:.9},
  heavy:{stop:1.25,bias:.5,life:20,shake:1.25,camera:1.1,rate:.88,duration:.34,release:.05,gain:1.08},
  slash:{stop:.9,bias:0,life:12,shake:.65,camera:.65,rate:1.07,duration:.21,release:.025,gain:1},
  gun:{stop:.52,bias:0,life:7,shake:.2,camera:.25,rate:1.18,duration:.095,release:.012,gain:.94},
  magic:{stop:1.05,bias:0,life:18,shake:.7,camera:.75,rate:.97,duration:.36,release:.06,gain:.96}
 });
 const blades=new Set(['sword','spear','saber','claw']),shots=new Set(['gun','beam']);
 const spells=new Set(['fire','ice','thunder','wind','water','earth','light','dark','magic','electric','lightning','burn','poison']);
 const colors={fire:'#ff9c42',ice:'#95efff',thunder:'#ffe47a',wind:'#9eeec1',water:'#70caff',earth:'#e9bb79',light:'#caafff',dark:'#cd7eff',beam:'#84eaff'};
 function profile(f,a={},damage=a.damage??a.dmg??0){
  const family=GameAudio.family(f,a),strength=a.feedbackDamage??damage,linking=strength<=6||a.damageOnly||a.pull||a.fixedKnockback;
  const heavy=!linking&&(a.contactKind==='heavy'||a.contactKind!=='light'&&(strength>=13||strength>=7&&(/smash|Finish|Throw/i.test(a.sourceType||a.type||'')||(a.charge||0)>.45)));
  // Authored physical material can coexist with an elemental sound/colour.
  const material=a.soundFamily||family;
  const category=Object.hasOwn(profiles,a.contactKind)?a.contactKind:blades.has(material)?'slash':shots.has(material)?'gun':spells.has(family)?'magic':heavy||!linking&&['hammer','explosion','rocket','engine'].includes(family)?'heavy':'light';
  return{...profiles[category],category,family,heavy,color:colors[family]||(category==='slash'?'#9edfff':category==='gun'?'#ffe5a1':'#ffc06b')};
 }
 function hitlag(f,a){
  if(a.damageOnly||a.hitlagMultiplier===0)return 0;
  const damage=a.damage??a.dmg??0,p=profile(f,a,damage),electric=['thunder','electric'].includes(a.element);
  const result=Math.floor(((damage*.65+6)*p.stop+p.bias)*(electric?1.5:1)*(a.hitlagMultiplier??1));
  return clamp(result,0,30);
 }
 function contact(f,a,damage,box){const p=profile(f,a,damage),dx=(box?.x2??0)-(box?.x1??0),dy=(box?.y2??0)-(box?.y1??0);return{...p,angle:Math.hypot(dx,dy)>1?Math.atan2(dy,dx):(a.launchDirection||f.face)<0?Math.PI:0};}
 function draw(v){
  const p=v.feedback;if(!p)return;const age=v.max-v.life,t=clamp(age/v.max,0,1),power=v.power,col=p.color;
  ctx.save();ctx.translate(v.x,v.y);ctx.rotate(p.angle);ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=Math.pow(1-t,1.45);ctx.lineCap='round';
  const line=(points,c,w)=>{ctx.beginPath();points.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();};
  const polygon=(points,c)=>{ctx.beginPath();points.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=c;ctx.fill();};
  const ray=(a,inner,r,w,c)=>{const x=Math.cos(a),y=Math.sin(a);polygon([[x*inner-y*w,y*inner+x*w],[x*r,y*r],[x*inner+y*w,y*inner-x*w]],c);};
  if(p.category==='light'){
   const r=(16+power*10)*(1+t*.6);for(let j=0;j<5;j++)ray(j*TAU/5+.25,5+t*8,r*(j%2?.75:1),2*(1-t),j%2?col:'#fff8dc');
   polygon([[-5,0],[0,-4],[6,0],[0,5]],'#fffbed');
  }else if(p.category==='heavy'){
   const r=(31+power*17)*(1+t*.42);for(let j=0;j<8;j++)ray(j*TAU/8+.12,8+t*15,r*(.75+.25*Math.sin(j*7+1)**2),5*(1-t),j%3?col:'#fff3d6');
   ctx.strokeStyle=col;ctx.lineWidth=3*(1-t);ctx.beginPath();ctx.ellipse(0,0,r*(.35+t*.6),r*(.18+t*.34),0,0,TAU);ctx.stroke();
   for(let j=0;j<5;j++){const a=j*2.4,x=Math.cos(a)*(13+t*35),y=Math.sin(a)*(8+t*25);polygon([[x-3,y],[x,y-4],[x+5,y+2],[x-2,y+3]],col);}
   polygon([[-12,0],[-4,-4],[0,-13],[5,-4],[14,0],[4,5],[0,12],[-5,4]],'#fff8e7');
  }else if(p.category==='slash'){
   ctx.rotate(-.55);const r=(29+power*16)*(1+t*.3),gap=t*9;
   polygon([[-r,-3-gap],[-8,-5-gap],[r*.9,-gap],[6,2-gap]],col);
   polygon([[-r*.7,-1-gap],[-5,-2-gap],[r,0-gap],[4,1-gap]],'#ffffff');
   for(let j=0;j<4;j++){const x=(j-1.5)*r*.35;line([[x,-5-gap],[x+9+t*11,-12-j*3-gap]],j%2?col:'#f3fdff',1.6*(1-t));}
   line([[-12,8+gap],[7,4+gap],[r*.65,5+gap]],col,1.2*(1-t));
  }else if(p.category==='gun'){
   const r=(12+power*7)*(1+t*.5);ray(0,2,r*1.3,2,col);ray(Math.PI,2,r*.6,1.5,'#fff2ce');ray(-1.15,2,r*.8,1.2,'#ffffff');ray(1.15,2,r*.8,1.2,'#ffffff');
   ctx.fillStyle='#ffffff';ctx.fillRect(-2.5,-2.5,5,5);for(let j=0;j<3;j++){const x=-5-t*(12+j*5),y=(j-1)*(5+t*9);line([[x,y],[x-3,y-2]],col,1.5*(1-t));}
  }else{
   const r=(21+power*12)*(1+t*.55),g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,col+'75');g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.fillRect(-r,-r,r*2,r*2);
   if(p.family==='thunder')for(let j=0;j<4;j++){const a=j*TAU/4+.3,x=Math.cos(a)*r,y=Math.sin(a)*r;line([[0,0],[x*.4-y*.1,y*.4+x*.1],[x*.5+y*.1,y*.5-x*.1],[x,y]],col,2*(1-t));}
   else if(p.family==='fire')for(let j=0;j<6;j++){const x=(j-2.5)*7,y=-t*(10+j*4);polygon([[x-3,y+6],[x+2,y-r*(.25+j*.06)],[x+6,y+4]],j%2?col:'#ffeac7');}
   else if(p.family==='ice')for(let j=0;j<6;j++){const a=j*TAU/6+.2;ray(a,7+t*8,r*(j%2?.7:1),3*(1-t),j%2?col:'#eaffff');}
   else if(['wind','water'].includes(p.family)){for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,(j-1)*6,r*(.55+j*.1),r*.25,j*.5+t*.4,.2,4.6);ctx.strokeStyle=col;ctx.lineWidth=(3-j*.6)*(1-t);ctx.stroke();}}
   else if(p.family==='earth')for(let j=0;j<5;j++){const x=(j-2)*10,y=-t*(12+j*3);polygon([[x-4,y+5],[x-2,y-8],[x+4,y-5],[x+6,y+4]],col);}
   else for(let j=0;j<5;j++){const a=j*TAU/5+t*.4,x=Math.cos(a)*r*.65,y=Math.sin(a)*r*.65,s=(3+power)*(1-t);polygon([[x-s,y],[x,y-s*2],[x+s,y],[x,y+s*2]],j%2?col:'#faf4ff');}
   polygon([[-5,0],[0,-8],[5,0],[0,8]],'#ffffff');
  }
  ctx.restore();
 }
 return{profile,hitlag,contact,draw,profiles};
})();
