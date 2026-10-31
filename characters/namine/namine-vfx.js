'use strict';
const NamineVFX=(()=>{
 const k=CharacterVFXKit.create('namine'),{stamp}=k;
 // Actual source: paper 0 convex RIGHT, 2 arch convex UP, 3 convex DOWN.
 // Source correction -> local rotation -> facing reflection -> world.
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);
  if(e){if(e.upper)stamp(2,e.x,e.t+Math.min(e.h,35)/2,e.w,Math.min(e.h,35),1,.88);else if(a.type==='dair')stamp(3,e.x,e.y,e.w,Math.min(e.h,40),1,.84);else if(a.type==='air'){stamp(7,e.l+e.w*.25,e.y,e.w*.5,24,-1,.85);stamp(7,e.r-e.w*.25,e.y,e.w*.5,24,1,.85);}else if(a.type==='downsmash'){const back=a.activeFrames.some(w=>w.shape==='back'&&f.timer>=w.start&&f.timer<=w.end);stamp(0,e.x,e.y,e.w,Math.min(e.h,35),back?-f.face:f.face,.85);}else if(['jab','jab2','dashAttack'].includes(a.type))stamp(1,e.x,e.y,e.w,Math.min(e.h,25),f.face,.85);else stamp(0,e.x,e.y,e.w,Math.min(e.h,37),e.back?-f.face:f.face,.85);}
  if(a.namineSketch&&!a.released)stamp(13+(a.choice||0),f.x+f.face*45,f.y-58,25,27,f.face,.65,0,true);
  if(a.namineCorridor&&a.exit&&['wind','transit'].includes(a.phase)){stamp(6,a.exit.x,a.exit.y-40,35,82,1,.5,0,true);ctx.save();ctx.strokeStyle='#dbc3ff77';ctx.lineWidth=1;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(f.x,f.y-40);ctx.lineTo(a.exit.x,a.exit.y-40);ctx.stroke();ctx.restore();}
 }
 function drawObjects(){for(const q of NamineRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/12);if(q.kind==='drawing'){const n={fox:13,rabbit:14,cat:15}[q.drawing],w=q.drawing==='fox'?43:33,h=q.drawing==='fox'?30:38;stamp(n,q.x,q.y,w,h,q.face,fade,0,true);}else if(q.kind==='phantom')stamp(9,q.x,q.y,49,91,q.face,fade*.6,0,true);else if(q.kind==='shatter')stamp(8,q.x,q.y,q.radius*2,q.radius*2,1,fade,0,true);else if(q.kind==='thread')stamp(10,q.x,q.y,q.radius*2,q.radius*1.3,1,(q.age<q.delay?.25+q.age/q.delay*.3:.85)*fade,0,true);else if(q.kind==='corridor'){stamp(6,q.x,q.y,43,94,1,fade,0,true);stamp(6,q.exit.x,q.exit.y,43,94,1,fade,0,true);}}
  for(const f of fighters)if(f.characterId==='namine'&&!f.respawn)for(const e of namineMarked(f))stamp(4,e.x,e.y-100,17,22,1,.7,Math.sin(frame*.06)*.15,true);
 }
 function impact(v){stamp(11,v.x,v.y,29+v.power*2,29+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){text('DRAW '+namineOwned(f,'drawing').length+'/3  印 '+namineMarked(f).length,x+148,y+27,8,'#edd5ff','left');if(f.attack?.namineSketch&&!f.attack.released)text(['キツネ：走る','ウサギ：待つ','ネコ：印を付ける'][f.attack.choice||0],x+148,y+42,8,'#fff0cf','left');}
 return{draw,drawObjects,impact,hud};
})();
