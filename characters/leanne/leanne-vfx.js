'use strict';
const LeanneVFX=(()=>{const k=CharacterVFXKit.create('leanne'),{stamp}=k;
 // Visible source axes: muzzle/bullets0,1,4,9 RIGHT;2 UP;3 DOWN.
 //15 is an exhaust fan opening RIGHT, oriented opposite to the owner's travel.
 function draw(f){if(f.respawn)return;const a=f.attack;if(!a)return;const e=k.envelope(f);if(e){if(['up','upsmash','uair'].includes(a.type))stamp(2,e.x,e.y,e.w,e.h,1,.9);else if(a.type==='dair')stamp(3,e.x,e.y,e.w,e.h,1,.9);else if(a.type==='downsmash')stamp(8,e.x,e.y,e.w,Math.max(38,e.h),1,.85);else stamp(['heavy','air'].includes(a.type)?9:['low','jab3'].includes(a.type)?11:0,e.x,e.y,e.w,Math.min(40,e.h),e.back?-f.face:f.face,.92);}
  if(a.leanneHandgun&&!a.fired&&f.timer>=9){const p=leanneMuzzle(f);stamp(6,p.x+f.face*24,p.y,23+Math.min(24,f.timer-9),23+Math.min(24,f.timer-9),1,.65,0,true);}
  if(a.leanneRoute&&['wind','aim'].includes(a.phase)){ctx.save();ctx.strokeStyle='#72e3ffb0';ctx.lineWidth=2;ctx.setLineDash([6,7]);ctx.beginPath();ctx.moveTo(f.x,f.y-12);ctx.lineTo(a.goal.x,a.goal.y-12);ctx.stroke();ctx.restore();stamp(12,a.goal.x,a.goal.y-20,31,44,Math.sign(a.goal.x-f.x)||1,.8,0,true);}
  if(a.leanneRoute&&a.phase==='route')stamp(7,f.x-f.vx*2,f.y-9,52,25,f.face,.7,0,true);
  if(a.leanneRecoil&&a.phase==='air'){const len=Math.hypot(a.aimX,a.aimY)||1;stamp(6,f.x+a.aimX/len*65,f.y-40+a.aimY/len*65,22,22,1,.65,0,true);if(f.timer-(a.kickAt||-100)<8)stamp(15,f.x-f.vx,f.y-40-f.vy,46,31,1,.7,Math.atan2(-f.vy,-f.vx),true);}
  if(a.leanneGrenade&&!a.thrown)stamp(14,f.x+f.face*23,f.y-50,13,19,f.face,.9,0,true);
 }
 function drawObjects(){for(const q of LeanneRules.objects){if(q.dead)continue;if(q.kind==='grenade'){stamp(14,q.x,q.y,16,22,1,1,q.age*.08,true);const left=Math.max(0,q.life-q.age);if(left<26)stamp(11,q.x,q.y-12,5,5,1,.7,0,true);}else if(q.kind==='blast')stamp(8,q.x,q.y,q.radius*2,q.radius*2,1,Math.min(1,(q.life-q.age)/7),0,true);else if(q.kind==='bullet')stamp(q.gun==='hg'?4:1,q.x,q.y,q.gun==='hg'?42:28,q.radius*2,1,1,Math.atan2(q.vy,q.vx),true);}for(const f of fighters)if(f.characterId==='leanne')for(const o of BattlePlayers.targets(f)){const n=leanneScratch(f,o);if(n){stamp(5,o.x,o.y-50,25+n,34,1,.4,0,true);text('SCRATCH '+n,o.x,o.y-102,8,'#91dcff');}}}
 function impact(v){stamp(11,v.x,v.y,30+v.power*2,30+v.power*2,1,v.life/v.max,0,true);}
 function hud(f,x,y){k.bar(leanneIS(f),'I.S.',x,y,'#79dfff');if(f.attack?.leanneRecoil)text('反動 '+(3-f.leanneRecoilUsed),x+147,y+43,8,'#b8ecff','left');}
 return{draw,drawObjects,impact,hud};})();
