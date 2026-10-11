'use strict';
const CharlottaVFX=(()=>{
 // FX0 convex RIGHT opens LEFT; FX6 leads RIGHT. translate → facing reflection → local rotation.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.charlotta?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}

 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackBoxes(f)){if(a.charlottaSpin||b.window?.shape==='spin')stamp(3,f.x,f.y-30,135,70,1,.8);else{const d=AdolVFX.direction(b),n=b.window?.pose??a.pose;if([6,9,14].includes(n))stamp(1,b.x2,b.y2,45,45,1,.8);else directed([8,46].includes(n)?6:0,d.x,d.y,d.len+30,45,Math.atan2(b.y2-b.y1,b.x2-b.x1),.8);}}if(a.charlottaLadder&&f.timer>=9&&f.timer<28)stamp(2,f.x,f.y-43,45,65,1,.6);if(a.charlottaLanding&&f.timer<6)stamp(5,f.x,f.y-10,80,35,1,.7);}
 function drawObjects(){}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId==='charlotta')text('横B 着地で振り向き / 上B 一度リバウンド',x+52,y+54,8,'#a3ceff','left');}return{stamp,directed,draw,drawObjects,impact,hud};
})();
