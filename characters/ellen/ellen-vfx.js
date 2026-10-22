'use strict';
const EllenVFX=(()=>{
 // Actual source0 bulges right,1 up,2 down. Rotate locally, then face-mirror.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.ellen?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);if(a?.ellenDrift&&!a.released&&f.timer>12)stamp(8,f.x+f.face*20,f.y-43,24,30,1,.6,0,true);
  if(!a||!boxes.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;
  if(['up','upsmash','uair'].includes(a.type)){const x1=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),x2=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),y1=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius]));stamp(1,(x1+x2)/2,y1+36,x2-x1,72,f.face);return;}
  if(boxes.some(b=>['spin','shockwave'].includes(b.window?.shape))){stamp(a.ellenTrim&&a.trimStage===3?11:3,f.x,f.y-38,a.ellenTrim?330:230,105,f.face);return;}
  for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1;stamp(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+28,Math.max(45,b.radius*2),face,.95,Math.atan2(dy,dx*face));}
 }
 function drawObjects(){}
 function impact(v){stamp(5,v.x,v.y,38+v.power*2,38+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){if(f.characterId!=='ellen')return;text('FLASH FREEZE',x+149,y+14,8,'#a5edff');for(let n=0;n<6;n++)stamp(8,x+155+n*13,y+31,13,19,1,n<ellenCharge(f)?1:.17,0,true);}
 return{stamp,draw,drawObjects,impact,hud};
})();
