'use strict';
const WonderVFX=(()=>{
 // Texture0/2 convex RIGHT; texture1 convex UP; texture13 convex DOWN.
 // Local rotation follows normalization, then fighter facing mirrors the result.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.wonder?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function persona(f,x,y,size=130,alpha=.75,slot=f.wonderSlot||0){const im=characterArt.wonder?.frames[53+slot];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(f.face,1);ctx.globalAlpha*=alpha;ctx.drawImage(im,-size*.43,-size,size*.86,size);ctx.restore();}
 function draw(f){if(f.respawn)return;const a=f.attack,b=attackVisualBoxes(f);if(a?.wonderShot&&f.timer>=8&&f.timer<17)persona(f,f.x-f.face*22,f.y,126,.85,a.slot);if(a?.wonderChange&&f.timer>9)persona(f,f.x-f.face*24,f.y,130,.65);
  if(a?.wonderWire&&a.hook&&!a.wireReleased){ctx.save();ctx.strokeStyle='#ff4773';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(f.x+f.face*9,f.y-86);ctx.lineTo(a.hook.x,a.hook.y);ctx.stroke();ctx.restore();stamp(7,a.hook.x,a.hook.y,32,32,1,1,0,true);}
  if(!a||!b.length||['grab','pummel'].includes(a.type)||a.type.endsWith('Throw'))return;if(a.type==='smash'||a.type==='upsmash'){persona(f,f.x-f.face*24,f.y,145,.85);if(a.type==='upsmash'){const x1=Math.min(...b.map(v=>Math.min(v.x1,v.x2)-v.radius)),x2=Math.max(...b.map(v=>Math.max(v.x1,v.x2)+v.radius)),y1=Math.min(...b.map(v=>Math.min(v.y1,v.y2)-v.radius)),y2=Math.max(...b.map(v=>Math.max(v.y1,v.y2)+v.radius));stamp(6,(x1+x2)/2,(y1+y2)/2,x2-x1,y2-y1,1,.95);return;}}
  if(a.type==='fair'||a.type==='low'){const v=b.find(v=>!v.meleeInner)||b[0];stamp(12,v.x2,v.y2,54,54,1,.95);return;}
  if(b.some(v=>v.window?.shape==='up')){stamp(1,f.x,f.y-116,170,100,f.face,.95);return;}if(b.some(v=>v.window?.shape==='spin')){stamp(3,f.x,f.y-44,190,90,1,.9);return;}
  for(const v of b.flatMap(v=>SlashVFX.outward(f,v))){const dx=v.x2-v.x1,dy=v.y2-v.y1,face=dx<0?-1:1,n=a.type==='smash'?2:0;stamp(n,(v.x1+v.x2)/2,(v.y1+v.y2)/2,Math.hypot(dx,dy)+28,Math.max(48,v.radius*2),face,.95,Math.atan2(dy,dx*face));}}
 function drawObjects(){for(const q of WonderRules.objects){if(q.dead)continue;if(q.kind==='summon'){const f=fighters[q.owner];if(f)persona(f,q.x,q.y+50,145,Math.min(1,(q.life-q.age)/8),q.slot);}else stamp(q.slot===1?5:q.slot===2?4:2,q.x,q.y,75,q.slot===2?40:24,q.face,Math.min(1,(q.life-q.age)/5),0,true);}for(const f of fighters)if(f.wonderMarkTime>0&&!f.respawn)stamp(8,f.x,f.y-f.character.ecb.height-24,34,34,1,.8+.2*Math.sin(frame*.2),0,true);}
 function impact(v){stamp(9,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){text('PERSONA '+['BALANCE','POWER','SUPPORT'][f.wonderSlot||0],x+147,y+16,8,['#8acbff','#ff8ca4','#81edda'][f.wonderSlot||0]);for(let n=0;n<3;n++){ctx.fillStyle=n===(f.wonderSlot||0)?'#a5daff':'#283d58';ctx.fillRect(x+149+n*25,y+24,20,4);}}
 return{stamp,draw,drawObjects,impact,hud};
})();

