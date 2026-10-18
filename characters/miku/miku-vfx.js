'use strict';
const MikuVFX=(()=>{
 // Directional sources 0,1,2,3,6 point RIGHT. Apply translation, reflection,
 // then local rotation. Lift ring 4 and stage 5 are centered, unrotated.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,anchor=.5){const img=characterArt.miku?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(img,-w*anchor,-h/2,w,h);ctx.restore();}
 function directed(n,x,y,w,h,angle,alpha=1,anchor=.5){const face=Math.cos(angle)<0?-1:1;stamp(n,x,y,w,h,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face),anchor);}
 function prop(n,x,y,w,h,face=1,rot=0){const img=characterArt.miku?.frames[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);AttackEffects.image(img,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){const a=f.attack;if(!a||f.respawn)return;if(a.hold)stamp(4,f.x,f.y-65,100,65,1,.45);if(a.virtualStage&&f.timer<24)stamp(5,f.x,f.y-50,150,100,1,f.timer/50);if(a.musicSlide&&f.timer>=11&&f.timer<=37&&!a.braked)directed(3,f.x-f.face*45,f.y-24,100,35,f.face<0?Math.PI:0,.8);const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackVisualBoxes(f)){if(a.vocalLift||w.shape==='spin'){stamp(4,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.abs(b.x2-b.x1)+b.radius*2,75,f.face,.85);if(a.speakerPulse)for(const side of[-1,1])prop(42,f.x+side*75,f.y-36,45,60);continue;}if(a.stagePillar){stamp(5,f.x,f.y-78,120,175,1,.85);continue;}if(a.musicSlide)continue;const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),len=Math.hypot(b.x2-b.x1,b.y2-b.y1);directed(a.leek?6:0,b.x1,b.y1,len+20,45,angle,.85,0);if(a.leek){const face=Math.cos(angle)<0?-1:1,img=characterArt.miku.frames[40];prop(40,(b.x1+b.x2)/2,(b.y1+b.y2)/2,80,80*img.height/img.width,face,Math.atan2(Math.sin(angle),Math.cos(angle)*face)+.75);}}}
 function drawObjects(){for(const q of MikuRules.objects){if(q.kind==='stage'){stamp(5,q.x,q.y-67,260,145,1,Math.min(1,(q.life-q.age)/30));continue;}directed(q.charged?2:1,q.x,q.y,q.charged?58:32,q.charged?54:32,Math.atan2(q.vy,q.vx));}}
 function impact(v){stamp(7,v.x,v.y,50+v.power*4,50+v.power*4,1,(v.life/v.max)**1.6);}
 function hud(f,x,y){if(f.characterId!=='miku')return;text(f.mikuStageActive?'ステージ内：移動・ジャンプ強化':f.mikuStageCooldown>0?'ステージ待機 '+Math.ceil(f.mikuStageCooldown/60)+'s':'↓B バーチャルステージ',x+245,y+27,9,'#9bf9ee','right');if(f.attack?.vocalLift)text('VOCAL HOP '+f.attack.pulses+'/3',x+52,y+54,9,'#ffc0f5','left');}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
