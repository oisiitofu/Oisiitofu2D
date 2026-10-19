'use strict';
const OctolingVFX=(()=>{
 // Reviewed actual textures: stroke0 convex RIGHT; overhead splash1 convex UP.
 // AttackEffects normalizes these source axes before world rotation/reflection.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.octoling?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;const d=AdolVFX.direction(b),upper=['up','upsmash','uair'].includes(a.type),n=upper?1:a.octoSplash?8:['jab','jab2','jab3'].includes(a.type)?0:a.type==='air'?2:0;stamp(n,d.x,d.y,d.len+2*b.radius,upper?70:2*b.radius,d.face,.86,d.rot+(upper?Math.PI/2:0));}
  if(a.octoBomb&&f.timer<13)stamp(4,f.x+f.face*32,f.y-57,27,30,f.face);
  if(a.octoRoller&&f.timer>=8&&!a.ending)stamp(9,f.x-f.face*24,f.y-3,60,12,1,.6);
  if(a.octoJump&&a.launched!=null&&f.timer-a.launched<23)stamp(8,f.x,f.y+15,30,70,1,.7);
  if(a.octoSplash&&!a.splashed&&f.timer<16)stamp(12,f.x,f.y-35,88,65,1,.5);
 }
 function drawObjects(){for(const q of OctolingRules.objects){const n=q.kind==='bomb'?4:q.kind==='splash'?2:10,size=q.kind==='bomb'?28:q.radius*2.1;stamp(n,q.x,q.y-(q.kind==='bomb'?0:20),size,q.kind==='splash'?size*.65:size,q.face,Math.min(1,(q.life-q.age)/3));}}
 function impact(v){stamp(11,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='octoling')return;ctx.fillStyle='#34243e';ctx.fillRect(x+157,y+20,83,7);ctx.fillStyle=octolingInk(f)<25?'#8e658f':'#ff35bd';ctx.fillRect(x+157,y+20,83*octolingInk(f)/100,7);text('INK '+Math.floor(octolingInk(f)),x+240,y+15,10,'#ffc2ef','right');}
 return{stamp,draw,drawObjects,impact,hud};
})();
