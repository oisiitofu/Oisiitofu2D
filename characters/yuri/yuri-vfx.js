'use strict';
const YuriVFX=(()=>{
function stamp(n,x,y,w,h,face=1,alpha=1,angle=0){const im=characterArt.yuri?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
function draw(f){if(f.respawn)return;const a=f.attack;if(yuriGuarding(f))stamp(7,f.x,f.y-40,110,115,1,.7);if(a?.yuriStance&&a.released&&f.timer<=26)stamp(8,f.x,f.y-40,175,125,1,.8);if(a?.yuriLift&&a.liftStarted){stamp(2,f.x,f.y-70,45,90,f.face,.55);stamp(6,f.x-f.face*15,f.y,75,70,f.face,.5);}for(const b of attackVisualBoxes(f)){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=Math.abs(dx)<.01?f.face:Math.sign(dx),angle=Math.atan2(dy,dx*face);if(a?.yuriPhoto){stamp(1,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+30,70,-face,.85);stamp(5,b.x2,b.y2,48,48,1,.8);}else stamp(0,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+30,48,face,.75,angle);}}
// Native spirit faces RIGHT; reflect its local X without rotating its upright body.
function drawObjects(){for(const q of YuriRules.objects)stamp(3,q.x,q.y,78,78,q.face,.8);}
function impact(v){stamp(9,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max);}
function hud(){}return{draw,drawObjects,impact,hud};})();
