'use strict';
const KrystalVFX=(()=>{
// Slashes are authored opening to the RIGHT. Mirror local X before rotation;
// atan2 uses the mirrored segment so back/up/down all follow the actual hitbox.
function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.krystal?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
function draw(f){if(f.respawn)return;const a=f.attack;if(f.state==='guard')stamp(7,f.x,f.y-40,95,100,1,.5);if(a?.krystalRocket&&a.rocketStarted)stamp(6,f.x-f.face*22,f.y+5,90,45,f.face,.7);if(a?.krystalQuake&&(a.originGrounded&&f.timer>=22||a.type==='krystalImpact'||a.quakeLanded))stamp(8,f.x,f.y-8,210,60,1,.75);for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);stamp(a?.type.includes('smash')?1:0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+36,50,face,.8,angle);}}
function drawObjects(){for(const q of KrystalRules.objects)stamp(q.kind==='ice'?5:q.charged?4:3,q.x,q.y,q.kind==='ice'?85:q.charged?88:48,q.kind==='ice'?45:q.charged?60:28,q.face,.9);}
function impact(v){stamp(9,v.x,v.y,32+v.power*2,32+v.power*2,1,v.life/v.max);}
function hud(){}
return{draw,drawObjects,impact,hud};
})();
