'use strict';
const KatamariVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.katamari?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function drawBall(f){if(f.respawn)return;const p=katamariBall(f),g=katamariGrowth(f),a=f.attack,alpha=f.inv>0?.65:1,compress=a?.kataBounce&&a.bounceAt==null?.84:1;const stage=g<40?0:g<75?1:2;stamp(stage,p.x,p.y,p.r*2,p.r*2*compress,1,alpha,f.kataSpin||0);}
 function draw(f){if(f.respawn)return;const p=katamariBall(f),a=f.attack;
  for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;stamp(4,b.x2,b.y2,b.radius*2.1,b.radius*2.1,1,.6,f.kataSpin||0);}
  if(a?.kataSuction&&f.timer>=14&&f.timer<=26)stamp(6,p.x+f.face*58,p.y,125,64,-f.face,.65);
  if(a?.kataItems&&f.timer>=16&&f.timer<=28){stamp(5,p.x,p.y-p.r-15,120,85,1,.8);stamp(6,p.x,p.y-65,100,65,1,.45,Math.PI/2);}
  if(a?.kataBounce&&a.bounceAt!=null&&f.timer-a.bounceAt<24)stamp(7,f.x-f.vx*2,f.y+20,75,50,f.face,.6);
  if(f.kataShed>0)stamp(11,p.x,p.y,p.r*2.3,p.r*1.7,1,f.kataShed/18);
 }
 function drawObjects(){for(const q of KatamariRules.objects)if(q.kind==='pickup')stamp(3,q.x,q.y,29,17,1,Math.min(1,(q.life-q.age)/3),q.age*.06);}
 function impact(v){stamp(8,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='katamari')return;ctx.fillStyle='#283d22';ctx.fillRect(x+163,y+20,78,6);ctx.fillStyle='#a4eb53';ctx.fillRect(x+163,y+20,78*katamariGrowth(f)/100,6);text('塊 '+Math.round(katamariGrowth(f))+'%',x+240,y+16,8,'#e0ffc1','right');}
 return{stamp,drawBall,draw,drawObjects,impact,hud};
})();
