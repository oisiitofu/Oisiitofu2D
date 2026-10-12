'use strict';
const MidnaVFX=(()=>{
 // Sprites are authored RIGHT: translate, reflect by facing, then rotate locally.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const a=characterArt.midna,img=prop?a?.frames[40+n]:a?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function direction(b){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;return{face,rotation:Math.atan2(dy,dx*face),x:(b.x1+b.x2)/2,y:(b.y1+b.y2)/2,length:Math.hypot(dx,dy)};}
 function hair(f,p,fist=false,prop=0){const start={x:f.x+f.face*7,y:f.y-64},d=direction({x1:start.x,y1:start.y,x2:p.x,y2:p.y});ctx.save();ctx.strokeStyle='#ff9b25';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.quadraticCurveTo(d.x,d.y-20,p.x,p.y);ctx.stroke();ctx.strokeStyle='#ffd265';ctx.lineWidth=2;ctx.stroke();ctx.restore();stamp(fist?1:prop,p.x,p.y,fist?80:54,fist?74:50,d.face,1,d.rotation,true);}
 function draw(f){if(f.grabbed){hair(f,{x:f.grabbed.x,y:f.grabbed.y-35},false,2);return;}const a=f.attack;if(!a)return;const t=f.timer,w=CombatData.activeWindow(a,t);
  if(a.midnaWarp){if(t<=12){stamp(2,a.target.x,a.target.y-35,80,95,1,.55);stamp(2,f.x,f.y-35,58,65,1,.5);}if(t>=13&&t<=22){stamp(2,a.origin.x,a.origin.y-35,75,95,1,.9);stamp(2,a.target.x,a.target.y-35,85,105,1,.9);}}
  if(a.midnaField){const r=a.fieldRadius+a.fieldGrowth*a.charge;stamp(1,f.x,f.y-35,r*2.25,r*1.7,1,a.hold?.65:.9);if(a.hold)stamp(5,f.x+f.face*25,f.y-55,52,45,f.face,.8,0,true);}
  if(a.hairGrapple&&t>=4&&t<=a.reelEnd){hair(f,MidnaRules.handPoint(f,a,t),false,a.hook||a.targetId!==null?2:0);if(!w)return;}
  if(a.hold&&!a.midnaField)stamp(1,f.x,f.y-38,70+60*a.charge,80,1,.65);
  if(!w)return;
  if(a.shadowCrush){const b=attackVisualBoxes(f)[0];stamp(3,f.x,f.y-30,Math.abs(b.x2-b.x1)+30,110);stamp(4,f.x,f.y-25,100,95,1,1,0,true);return;}
  if(a.midnaPillar){for(const b of attackVisualBoxes(f))stamp(3,b.x1,f.y-65,64,150);return;}
  for(const b of attackVisualBoxes(f)){const d=direction(b);if(a.midnaHand||a.midnaWarp){hair(f,{x:b.x2,y:b.y2},a.type==='smash',a.midnaWarp?7:w.shape==='back'||w.shape==='low'?3:a.type==='grab'?2:0);stamp(0,d.x,d.y,d.length+30,55,d.face,.85,d.rotation);}else if(a.hairGrapple&&t>=28)stamp(7,b.x2,b.y2,80,80);}
 }
 function impact(v){stamp(7,v.x,v.y,80+v.power*12,80+v.power*12,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId==='midna')text('HAIR GRAPPLE / WARP',x+52,y+54,8,'#fcb66b','left');}
 return{stamp,direction,hair,draw,impact,hud};
})();
