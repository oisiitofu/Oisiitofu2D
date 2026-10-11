'use strict';
const RyofuVFX=(()=>{
 // FX0 convex RIGHT opens LEFT; FX1/2 lead RIGHT. FX3 is upright and remains unrotated. translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.ryofu?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}

 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackBoxes(f)){if(b.window?.shape==='spin')stamp(0,f.x,f.y-50,150,80,f.face,.85);else if(a.ryofuImpact)stamp(4,f.x,f.y-42,155,100,1,.9);else{const d=AdolVFX.direction(b),n=b.window?.pose??a.pose;directed([7,9,13,41,42].includes(n)?1:0,d.x,d.y,d.len+35,45,Math.atan2(b.y2-b.y1,b.x2-b.x1),.85);}}if(a.ryofuRide&&a.mounted&&f.timer>=14&&f.timer<=34)directed(2,f.x-f.face*30,f.y-40,100,70,f.face===1?0:Math.PI,.6);if(a.ryofuLeap&&a.phase==='rise'&&f.timer-a.launchFrame<20)stamp(3,f.x,f.y-35,45,120,1,.55);if(a.ryofuCounter&&f.timer<12)stamp(5,f.x,f.y-55,70,70,1,.8);if(a.ryofuStance&&f.timer>=6&&f.timer<=40)stamp(5,f.x,f.y-54,65,65,1,.18);}
 function drawObjects(){for(const q of RyofuRules.objects)stamp(4,q.x,q.y-20,55,60,q.face,.7);}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='ryofu')text(f.ryofuMusou>0?'無双 '+Math.ceil(f.ryofuMusou/60)+'秒':'横B 赤兎 / 上B 押し直しで叩きつけ',x+52,y+54,9,'#ff9696','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();
