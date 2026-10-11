'use strict';
const TerryVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.terry?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function monster(n,x,y,w,h,face=1,alpha=1){const img=characterArt.terry?.frames[40+n];if(!img)return;const s=Math.min(w/img.width,h/img.height);ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-img.width*s/2,-img.height*s/2,img.width*s,img.height*s);ctx.restore();}
 function draw(f){const a=f.attack;if(!a)return;if(a.ride&&a.launched&&!a.dismounted)monster(a.mount,f.x,f.y+8,135,a.mount===1?75:100,f.face);if(a.change)monster(a.choice,f.x+f.face*60,f.y-45,55,55,f.face,.85);if(a.scout&&f.timer<16)stamp(4,f.x+f.face*35,f.y-43,55,55,f.face,.7);const w=CombatData.activeWindow(a,f.timer);if(!w)return;for(const b of attackBoxes(f)){const d=AdolVFX.direction(b),fx=a.monster!==undefined?[0,1,2,3,3,2][a.monster]:0;if(a.monster!==undefined)monster(a.monster,d.x,d.y,100,85,d.face);stamp(fx,d.x,d.y,d.len+20,w.shape==='spin'?85:42,d.face,.9,w.shape==='spin'?0:d.rot);}}
 function drawObjects(){for(const q of TerryRules.objects){if(q.kind==='scout')stamp(4,q.x,q.y,50,50,q.face,Math.min(1,(q.life-q.age)/5));else monster(q.monster,q.x,q.y,q.radius*4,q.radius*3,q.face,Math.min(1,(q.life-q.age)/5));}}
 function impact(v){stamp(7,v.x,v.y,50+v.power*7,50+v.power*7,1,(v.life/v.max)**1.7);}
 function hud(f,x,y){if(f.characterId!=='terry')return;text(TerryRules.names[f.terryMonster||0]+(f.terryScoutBonus?' / SCOUT ALLY READY':' / ↓B CHANGE / →B SCOUT'),x+52,y+54,8,'#bfe6ff','left');}
 return{stamp,monster,draw,drawObjects,impact,hud};
})();
