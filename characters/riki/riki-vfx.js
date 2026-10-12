'use strict';
const RikiVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1){const img=characterArt.riki?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h,w,h);ctx.restore();}
 function body(f,alpha=1){const a=f.attack;if(a?.sneakStart&&f.timer>=a.sneakStart&&f.timer<=a.sneakEnd){stamp(4,f.x,f.y+5,140,100,f.face,alpha);return true;}return false;}
 function guard(f){stamp(7,f.x,f.y+9,112,112,1,.7);}
 function impact(v){const t=(v.max-v.life)/v.max,r=(80+v.power*30)*(1+t*.3);stamp(6,v.x,v.y+r*.5,r,r,v.direction,(1-t)**1.5);}
 function status(f){if(!f.rikiStatus)return;stamp(f.rikiStatus.kind==='burn'?0:3,f.x,f.y-12,63,68,1,.22+.1*Math.sin(frame*.2));}
 function draw(f){for(const o of RikiRules.objects){if(o.owner!==f.id)continue;if(o.kind==='fire'){const r=65+o.charge*35;stamp(o.burst?1:0,o.x,o.y+r*.5,r*(o.burst?1.5:1.3),r,o.face,o.burst?1-o.burst/15:1);}else stamp(3,o.x,o.y+42,145,125,1,Math.min(1,o.age/12,(181-o.age)/24)*.78);}
 const a=f.attack;if(!a)return;if(a.type==='rise'&&f.timer>=a.startupFrames){stamp(5,f.x,f.y+35,130,150,1,.8);return;}if(a.spawnObject)return;const t=f.timer,w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.5;if(!alpha||a.type==='grab'||a.type.endsWith('Throw'))return;if(a.element==='ice'){stamp(2,f.x,f.y+12,146,160,f.face,alpha);return;}
 SlashVFX.melee(f,w,6,alpha);}
 return{draw,guard,impact,body,status};
})();
