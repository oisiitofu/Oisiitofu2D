'use strict';
const YuffieVFX=(()=>{
 // FX0 convex RIGHT, opens LEFT; FX2 kunai RIGHT. translate, reflect, rotate.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.yuffie?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;if(a?.yuffieFlip){if(['hook','latch'].includes(a.phase)&&a.tip){ctx.save();ctx.strokeStyle='#c99a51';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x+f.face*15,f.y-85);ctx.lineTo(a.tip.x,a.tip.y);ctx.stroke();ctx.restore();stamp(2,a.tip.x,a.tip.y,30,15,1,1,-Math.PI/2);}if(a.phase==='flight')stamp(5,f.x,f.y-45,95,95,f.face,.5);}if(!a)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b);directed(0,d.x,d.y,d.len+32,46,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}}
 function drawObjects(){for(const q of YuffieRules.objects){if(q.kind==='smoke')stamp(3,q.x,q.y,q.burst?q.radius*2.4:25,q.burst?q.radius*1.65:25,1,q.burst?Math.min(.55,(q.life-q.age)/25):1);else stamp(1,q.x,q.y,q.kind==='fuma'?90:27,q.kind==='fuma'?90:27,1,1,q.age*.45);}}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='yuffie')return;text(f.yuffieHidden?'煙の中: 移動強化':f.yuffieSmokeCooldown>0?'煙玉 再使用 '+Math.ceil(f.yuffieSmokeCooldown/60)+'s':'↓B 煙玉',x+52,y+54,9,'#9bdaff','left');if(f.attack?.phase==='caught')text('必殺を押し直して追撃',f.x,f.y-126,11,'#ceffad');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
