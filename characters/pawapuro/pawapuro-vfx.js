'use strict';
const PawapuroVFX=(()=>{
 // Native directional effects lead RIGHT: translate -> horizontal reflect -> local rotate.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.pawapuro?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;if(a.rocketBat&&a.launched&&f.timer-a.boostFrame<8){const face=Math.sign(a.thrustX)||1;stamp(6,f.x-a.thrustX*38,f.y-35-a.thrustY*38,100,45,face,.8,Math.atan2(a.thrustY,a.thrustX*face));}if((a.powerBat&&a.storedBall)||(a.gloveField&&a.fieldUsed))stamp(4,f.x+a.originFace*32,f.y-45,55,55,1,.75);const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){const d=AdolVFX.direction(b);stamp(a.type.includes('smash')||a.powerBat?2:a.type==='low'?5:1,d.x,d.y,d.len+30,w.shape==='spin'?85:48,d.face,.85,d.rot);}}
 function drawObjects(){for(const q of PawapuroRules.objects){const face=Math.sign(q.vx)||q.face;stamp(0,q.x,q.y,q.radius*4,q.radius*2.3,face,Math.min(1,(q.life-q.age)/6),Math.atan2(q.vy,q.vx*face));}}
 function impact(v){stamp(7,v.x,v.y,55+v.power*5,55+v.power*5,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='pawapuro')return;text('→B BAT RETURN / ↑B ROCKET '+(f.attack?.rocketBat?f.attack.fuel+'/2':'')+' / ↓B GLOVE '+(f.pawaReserve?'BALL READY':f.pawaFieldCooldown>0?'WAIT':'READY'),x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,draw,drawObjects,impact,hud};
})();
