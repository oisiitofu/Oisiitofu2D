'use strict';
const AlainVFX=(()=>{
 // The sword arc is authored rightwards. Reflection precedes local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.alain?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(f.alainOrderTime>0)stamp(6,f.x,f.y-44,90,110,f.face,.25+.08*Math.sin(frame*.15));if(a?.alainOrder&&f.timer>=15)stamp(5,f.x,f.y-45,90,100,f.face,.75);for(const b of attackVisualBoxes(f)){if(a?.alainSpin){stamp(3,f.x,f.y-43,150,95,f.face,.8);break;}const vx=b.x2-b.x1,vy=b.y2-b.y1,face=vx<0?-1:1;stamp(a?.type==='jab2'?1:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(vx,vy)+35,48,face,.85,Math.atan2(vy,vx*face));}}
 function drawObjects(){}
 function impact(v){stamp(7,v.x,v.y,40+v.power*2,40+v.power*2,1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='alain')return;text(f.alainOrderTime>0?'ORDER '+(f.alainOrderTime/60).toFixed(1):f.alainOrderCooldown>0?'ORDER '+Math.ceil(f.alainOrderCooldown/60)+'s':'ORDER READY',x+242,y+18,9,f.alainOrderTime>0?'#ffe5a5':'#b9d6ff','right');}
 return{draw,drawObjects,impact,hud};
})();
