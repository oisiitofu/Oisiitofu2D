'use strict';
const ChibiroboVFX=(()=>{
 // Sheet crescent convex edge faces right. Local angle precedes fighter reflection.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const im=characterArt.chibirobo?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function directed(n,b,w,h,alpha=.9){const vx=b.x2-b.x1,vy=b.y2-b.y1,face=vx<0?-1:1;stamp(n,b.x2,b.y2,w,h,face,alpha,n===3?0:Math.atan2(vy,vx*face));}
 function draw(f){if(f.respawn)return;const a=f.attack;for(const b of attackVisualBoxes(f)){if(['grab','pummel'].includes(a.type))continue;const n=a.type==='smash'?1:['fair','heavy'].includes(a.type)?0:a.type==='dair'||a.type==='low'||a.type==='downsmash'?3:0;directed(n,b,Math.max(38,Math.hypot(b.x2-b.x1,b.y2-b.y1)*.8),a.type==='smash'?30:44);}
 if(a?.chibiCopter&&f.timer>=8)stamp(4,f.x,f.y-72,100,35,1,.65,frame*.07);
 if(a?.chibiZip&&f.timer<=15&&a.charge>0)stamp(3,f.x+f.face*22,f.y-50,26+a.charge,26+a.charge,1,.7);
 if(a?.chibiMug&&f.timer>=6)stamp(4,f.x,f.y-34,70,81,1,.3);
 }
 function drawObjects(){for(const q of ChibiroboRules.objects){if(q.dead)continue;const face=Math.sign(q.vx)||q.face,rot=Math.atan2(q.vy,q.vx*face);stamp(5,q.x-q.vx,q.y-q.vy,55,22,face,.6,rot);stamp(2,q.x,q.y,32,26,face,1,rot);}}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,1,v.life/v.max);}
 function hud(){}
 return{stamp,draw,drawObjects,impact,hud};
})();
function chibiroboGuarding(f){return !!(f.characterId==='chibirobo'&&f.attack?.chibiMug&&f.timer>=6&&f.timer<=78);}
