'use strict';
const Zero3VFX=(()=>{
 // Reviewed paint: sword/spear arcs 0/2 convex RIGHT; overhead 1 convex UP.
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0,prop=false){const im=characterArt.zero3?.effects[n];if(!im)return;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.rotate(rot);ctx.globalAlpha*=alpha;if(prop)ctx.drawImage(im,-w/2,-h/2,w,h);else AttackEffects.image(im,-w/2,-h/2,w,h);ctx.restore();}
 function mount(f){const a=f.attack,n=12+Math.floor(frame/6)%2,im=characterArt.zero3?.effects[n];if(a?.zero3Flight&&a.launchAt!==undefined&&!a.dismounted&&im)stamp(n,f.x+f.face*24,f.y+12,215,215*im.height/im.width,f.face,1,0,true);}
 function flower(f){const n=pose(f),im=spriteFor(f,n),p=Zero3ArtRects.flowers[n];if(!im||!p)return;const k=BattleSize.native('zero3',n)*FIGHTER_SCALE*BattleSize.art('zero3'),rot=f.state==='fly'?Math.sin(f.timer*.2)*.3:f.state==='run'&&!f.grounded?-.055:0,px=(p[0]-im.width/2)*k,py=(-im.height+p[1]+BattleSize.baseline(f,n))*k,x=f.x+(px*Math.cos(rot)-py*Math.sin(rot))*f.face,y=f.y+px*Math.sin(rot)+py*Math.cos(rot);stamp(14,x,y,15,15,f.face,.98,rot,true);}
 function draw(f){if(f.respawn)return;const a=f.attack,boxes=attackVisualBoxes(f);
  if(a&&boxes.length&&!['grab','pummel'].includes(a.type)&&!a.type.endsWith('Throw')){if(a.zero3Flight&&!a.dismounted)stamp(4,f.x+f.face*76,f.y-6,55,45,f.face,.6);else if(boxes.some(b=>b.window?.shape==='up'))stamp(1,f.x,f.y-105,145,83,f.face,.92);else if(boxes.some(b=>b.window?.shape==='spin'))stamp(8,f.x,f.y-45,165,95,f.face,.9);else for(const b of boxes.flatMap(b=>SlashVFX.outward(f,b))){const dx=b.x2-b.x1,dy=b.y2-b.y1,face=dx<0?-1:1,index=['heavy','smash','fair'].includes(a.type)||a.zero3Spear?2:a.type==='jab3'||a.type==='low'?4:0;stamp(index,(b.x1+b.x2)/2,(b.y1+b.y2)/2,Math.hypot(dx,dy)+28,Math.max(40,b.radius*2),face,.92,Math.atan2(dy,dx*face));}}
  if(a?.zero3Awaken&&f.timer>=7)stamp(15,f.x,f.y-46,115,130,1,.6,0,true);
  if(f.zero3IntonerTime>0){stamp(6,f.x,f.y-44,100,110,1,.17,0,true);flower(f);}
 }
 function drawObjects(){for(const q of Zero3Rules.objects)if(!q.dead)stamp(3,q.x,q.y,43,35,q.face,1,q.age*.25,true);}
 function impact(v){stamp(7,v.x,v.y,35+v.power*2,35+v.power*2,v.face||1,v.life/v.max);}
 function hud(f,x,y){if(f.characterId!=='zero3')return;const powered=f.zero3IntonerTime>0;text(powered?'インテナー':f.zero3Blood>=100?'血 MAX・下B':'血 '+Math.floor(f.zero3Blood||0)+'%',x+151,y+19,10,powered?'#ff7e9a':'#eed5d8');ctx.fillStyle='#542c39';ctx.fillRect(x+151,y+24,86,5);ctx.fillStyle=powered?'#ff5d8e':'#de465f';ctx.fillRect(x+151,y+24,86*(powered?f.zero3IntonerTime/480:(f.zero3Blood||0)/100),5);}
 return{stamp,mount,flower,draw,drawObjects,impact,hud};
})();
