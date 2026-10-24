'use strict';
const ParappaVFX=(()=>{
 // Extracted paint: 0 points RIGHT; 1 has its convex crown UP; 2 points
 // DOWN; 3 convex LEFT. Rotate locally, then mirror facing, then translate.
 // Paper comic bursts belong to fists/feet, not a shared circular sword aura.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.parappa?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function draw(f){if(f.respawn)return;if(f.parappaFeedback>0&&f.parappaGood)stamp(f.parappaGood===2?14:13,f.x,f.y-108,65,30,1,f.parappaFeedback/36,0,true);const a=f.attack;if(!a||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
  const boxes=attackVisualBoxes(f).filter(b=>!b.meleeInner&&!b.upAttackExtra);if(!boxes.length)return;const left=Math.min(...boxes.flatMap(b=>[b.x1-b.radius,b.x2-b.radius])),right=Math.max(...boxes.flatMap(b=>[b.x1+b.radius,b.x2+b.radius])),top=Math.min(...boxes.flatMap(b=>[b.y1-b.radius,b.y2-b.radius])),bottom=Math.max(...boxes.flatMap(b=>[b.y1+b.radius,b.y2+b.radius])),x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top;
  if(a.parappaAcrobat&&f.timer<14){stamp(5,x,y,w,h,f.face);return;}if(['up','upsmash','uair'].includes(a.type)){stamp(1,x,y,Math.max(45,w),Math.min(55,Math.max(28,h)),f.face);return;}if(a.type==='dair'||a.parappaSkate&&a.route==='stomp'){stamp(2,x,y,w,h,f.face);return;}if(a.type==='bair'){stamp(3,x,y,w,h,f.face);return;}
  if(a.type==='air'){// Two separate shoe impacts follow the split-leg dance.
   stamp(0,left+12,y,28,27,-1);stamp(0,right-12,y,28,27,1);return;
  }stamp(0,x,y,Math.max(28,w),Math.max(24,h),a.type==='downsmash'&&CombatData.activeWindow(a,f.timer)?.index===1?-f.face:f.face);if(a.parappaSkate)stamp(4,f.x-f.face*23,f.y-8,70,20,f.face,.7,0,true);
 }
 function drawObjects(){for(const q of ParappaRules.objects){const a=Math.min(1,(q.life-q.age)/8);if(q.kind==='mic'){const f=fighters[q.owner];ctx.save();ctx.strokeStyle='#111925';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x+f.face*10,f.y-31);ctx.quadraticCurveTo((f.x+q.x)/2,f.y-13,q.x,q.y);ctx.stroke();ctx.restore();stamp(8,q.x,q.y,30,14,q.face,1,0,true);}else if(q.kind==='box'){stamp(9,q.x,q.y-18,47,35,1,1,0,true);if(q.flash>0)stamp(12,q.x,q.y-53,46,30,1,q.flash/8,0,true);}else if(q.kind==='note'){stamp(12,q.x,q.y-12,64,48,1,a,0,true);stamp(11,q.x-25,q.y,46,q.radius*1.5,1,a*.75,0,true);stamp(11,q.x+25,q.y,46,q.radius*1.5,-1,a*.75,0,true);}else if(q.kind==='wave')stamp(11,q.x,q.y,q.radius*2,q.radius*1.7,q.face,a,Math.PI,true);}}
 function impact(v){stamp(15,v.x,v.y,25+v.power*2,25+v.power*2,v.face||1,v.life/v.max,0,true);}
 function hud(f,x,y){const meter=f.parappaRhythm||0,grade=parappaGrade(f),distance=parappaBeat(f);ctx.save();ctx.fillStyle='#101723';ctx.fillRect(x+150,y+19,110,10);ctx.fillStyle=grade===2?'#31d9ff':grade===1?'#a2e849':'#ffa527';ctx.fillRect(x+151,y+20,meter*1.08,8);ctx.strokeStyle='#f2f5ff';ctx.lineWidth=1;ctx.strokeRect(x+150,y+19,110,10);text(['RAPPIN’','GOOD','COOL'][grade]+' '+Math.floor(meter),x+150,y+12,9,'#fff0ad');for(let n=0;n<4;n++){ctx.fillStyle=Math.floor(((frame-(f.parappaBeatOrigin||0))%120+120)%120/30)===n?'#ffe637':'#49586b';ctx.fillRect(x+150+n*28,y+34,21,4);}if(distance<=5)text('♪',x+264,y+29,14,'#ffe637');ctx.restore();}
 return{stamp,draw,drawObjects,impact,hud};
})();
