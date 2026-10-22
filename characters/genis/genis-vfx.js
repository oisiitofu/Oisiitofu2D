'use strict';
const GenisVFX=(()=>{
 // Source red arc0 bulges right,water dome1 up. Non-curved spells stay distinct.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.genis?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);if(a?.genisFire&&!a.released&&f.timer>20)stamp(2,f.x+f.face*26,f.y-38,25+f.timer*.4,20+f.timer*.3,f.face,.65,0,true);if(a?.genisSpread&&!a.released)stamp(5,a.aimX||f.x,f.y-4,65,20,1,.55,0,true);if(a?.genisCyclone&&a.phase==='cyclone')stamp(8,f.x,f.y-35,95,115,1,.75,0,true);
  if(!a||!boxes.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(['smash','upsmash','downsmash','dair'].includes(a.type)){const x1=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),x2=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),y1=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),y2=Math.max(...boxes.flatMap(b=>[b.y1+b.radius,b.y2+b.radius]));stamp(a.indignation||a.type==='smash'?10:a.type==='downsmash'?3:9,(x1+x2)/2,(y1+y2)/2,x2-x1,y2-y1,f.face,.85,a.type==='dair'?Math.PI:0);return;}
  if(['up','uair'].includes(a.type)){const x1=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),x2=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),y1=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius]));stamp(1,(x1+x2)/2,y1+30,x2-x1,60,f.face);return;}
  for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;stamp(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+25,Math.max(35,b.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){for(const q of GenisRules.objects){if(q.age<=(q.delay||0)){stamp(5,q.x,q.y+30,90,28,1,.5,0,true);continue;}const d=q.age-(q.delay||0),alpha=Math.min(1,(q.life-q.age)/7);if(q.kind==='gravity')stamp(11,q.x,q.y,130+Math.sin(d*.2)*7,130,1,alpha,0,true);else if(q.kind==='laser')stamp(13,q.x,q.y,220,58,q.face,alpha,0,true);else if(['pillar','ice'].includes(q.kind))stamp(q.fx,q.x,q.y-15,95,150,1,alpha,0,true);else stamp(q.fx,q.x,q.y,q.kind==='blast'?155:45,q.kind==='blast'?155:34,q.face,alpha,0,true);}}
 function impact(v){stamp(14,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='genis')return;const tp=genisTP(f);text('TP '+Math.floor(tp)+'/100',x+150,y+14,9,tp>=100?'#ffe49c':'#9adfff');ctx.fillStyle='#153252';ctx.fillRect(x+151,y+25,78,8);ctx.fillStyle=tp>=100?'#ffe3a0':'#63cfff';ctx.fillRect(x+151,y+25,78*tp/100,8);if(tp>=100)text('INDIGNATION',x+151,y+46,8,'#ffe3a0');}
 return{stamp,draw,drawObjects,impact,hud};
})();
