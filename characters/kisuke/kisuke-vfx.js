'use strict';
const KisukeVFX=(()=>{
 // Crescents 0/1 lead LEFT; SlashVFX normalizes their convex edge first.
 // Reflect in local space, then rotate
 // with the reflected angle so the resulting world vector follows the blade.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.kisuke?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;SlashVFX.image('kisuke',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,b,alpha=.85){const angle=Math.atan2(b.y2-b.y1,b.x2-b.x1),face=Math.cos(angle)<0?-1:1;stamp(n,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(b.x2-b.x1,b.y2-b.y1)+28,44,face,alpha,Math.atan2(Math.sin(angle),Math.cos(angle)*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;for(const b of attackVisualBoxes(f)){if(a?.kisukeArt&&!a.weak&&a.blade===0)stamp(2,f.x,f.y-42,125,80,f.face,.85);else if(a?.kisukeSwitch)stamp(7,f.x,f.y-40,105,85,f.face,.7);else directed(a?.kisukeArt?[0,3,4][a.blade]:0,b);}}
 function drawObjects(){for(const q of KisukeRules.objects){if(q.kind==='night')stamp(3,q.x,q.y,110,80,q.face,q.age<6?.25:.9);else if(q.kind==='flame')stamp(4,q.x,q.y,75,45,q.face,1-q.age/q.life);else if(q.kind==='switch')stamp(7,q.x,q.y,110,90,1,1-q.age/q.life);}}
 function impact(v){stamp(6,v.x,v.y,40+v.power*2,40+v.power*2,1,(v.life/v.max)**1.5);}
 function hud(f,x,y){if(f.characterId!=='kisuke')return;const spirit=kisukeResource(f),colors=['#55d9ff','#c18cff','#ff9461'];text(KisukeBlades[f.kisukeBlade],x+242,y+15,10,colors[f.kisukeBlade],'right');for(let n=0;n<3;n++){ctx.fillStyle='#293542';ctx.fillRect(x+160+n*28,y+22,24,4);ctx.fillStyle=colors[n];ctx.fillRect(x+160+n*28,y+22,24*spirit[n]/100,4);}}
 return{stamp,directed,draw,drawObjects,impact,hud};
})();
