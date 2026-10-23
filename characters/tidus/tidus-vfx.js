'use strict';
const TidusVFX=(()=>{
 // Paint direction reviewed on the extracted images: 0/8 convex RIGHT,
 // 1/9 convex UP; hook2 rises toward RIGHT; cut12 travels DOWN-RIGHT.
 // Source-local rotation is applied before the fighter's horizontal mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.tidus?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function extent(b){return{left:Math.min(...b.flatMap(v=>[v.x1-v.radius,v.x2-v.radius])),right:Math.max(...b.flatMap(v=>[v.x1+v.radius,v.x2+v.radius])),top:Math.min(...b.flatMap(v=>[v.y1-v.radius,v.y2-v.radius])),bottom:Math.max(...b.flatMap(v=>[v.y1+v.radius,v.y2+v.radius]))};}
 function draw(f){if(f.respawn)return;const a=f.attack;
  if(f.tidusHaste>0&&f.state==='run')stamp(11,f.x-f.face*26,f.y-30,65,35,f.face,.45,0,true);
  if(a?.tidusNB&&!a.released){const charge=f.timer>=30;stamp(5,f.x-f.face*12,f.y-66,charge?29:23,charge?29:23,f.face,1,0,true);if(charge)stamp(6,f.x-f.face*22,f.y-66,40,26,f.face,.6,0,true);}
  if(a?.tidusSide&&a.phase==='throw')stamp(5,f.x+f.face*24,f.y-35,23,23,f.face,1,0,true);
  const b=attackVisualBoxes(f);if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  const outer=b.filter(v=>!v.meleeInner&&!v.upAttackExtra),box=extent(outer.length?outer:b),x=(box.left+box.right)/2,y=(box.top+box.bottom)/2,w=box.right-box.left,h=box.bottom-box.top;
  const active=CombatData.activeWindow(a,f.timer),blue=a.overdrive?8:0;
  if(a.type==='air'){stamp(2,x,y,w,h,f.face,.95);return;}
  if(a.type==='bair'){stamp(3,x,y,w,h,-f.face,.95);return;}
  if(a.type==='uair'){stamp(1,x,box.top+38,Math.max(124,w),76,f.face,.95);return;}
  if(a.type==='dair'){stamp(12,x,y,w,h,f.face,.95,0,true);return;}
  if(['up','upsmash'].includes(a.type)||a.tidusSide&&a.phase==='finish'||a.tidusQuick&&active?.index===1||a.tidusRise&&active?.index===0){stamp(a.overdrive?9:1,x,box.top+Math.min(80,h)/2,Math.max(120,w),Math.min(80,h),f.face,.95);if(a.type==='upsmash')stamp(4,f.x,f.y-18,75,45,f.face,.55,0,true);return;}
  if(a.tidusRise&&active?.index===3){const v=a.launchVector||{x:f.face*.65,y:-1},rot=Math.atan2(v.y,v.x*f.face)+Math.PI/4;stamp(10,x,y,w,h,f.face,.9,rot,true);return;}
  if(a.tidusRise&&active?.index===2||a.tidusQuick&&active?.index===2){stamp(0,f.x+f.face*45,y,w*.57,h,f.face,.9);stamp(0,f.x-f.face*45,y,w*.57,h,-f.face,.9);return;}
  if(a.type==='dashAttack'){stamp(3,x,y,w,h,f.face,.9);return;}
  const back=a.type==='downsmash'&&active?.index===1;stamp(blue,x,y,w,h,back?-f.face:f.face,.95);
 }
 function drawObjects(){for(const q of TidusRules.objects){const alpha=Math.min(1,(q.life-q.age)/5),angle=Math.atan2(q.vy,q.vx*q.face),size=q.radius*2;stamp(q.charged?15:6,q.x-q.vx*1.3,q.y-q.vy*1.3,size*2.1,size*1.2,q.face,alpha*.85,angle,true);stamp(5,q.x,q.y,size,size,q.face,alpha,q.age*.16,true);}}
 function impact(v){stamp(7,v.x,v.y,28+v.power*2,28+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const v=tidusGauge(f)/100;ctx.save();ctx.fillStyle='#132944';ctx.fillRect(x+151,y+27,112,10);const g=ctx.createLinearGradient(x+152,0,x+262,0);g.addColorStop(0,'#71dcff');g.addColorStop(.6,'#919aff');g.addColorStop(1,'#ff80f1');ctx.fillStyle=g;ctx.fillRect(x+152,y+28,110*v,8);ctx.restore();stamp(14,x+274,y+32,20,20,1,v>=1?1:.35,0,true);text('OVERDRIVE '+Math.floor(v*100)+'%',x+151,y+18,9,v>=1?'#ffb3f5':'#c5f2ff');text(f.tidusHaste>0?'ヘイスト '+(f.tidusHaste/60).toFixed(1)+'s':v>=1?'次のスマッシュ強化':'攻撃命中で蓄積',x+151,y+52,9,'#dfecff');}
 return{stamp,draw,drawObjects,impact,hud};
})();
