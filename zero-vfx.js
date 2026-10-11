'use strict';
const ZeroVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.zero?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();}
 function chain(x,y,tx,ty,alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.strokeStyle='#273247';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle='#dbeaff';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.stroke();ctx.restore();stamp(3,tx,ty,55,24,1,alpha,Math.atan2(ty-y,tx-x));}
 function impact(v){const t=(v.max-v.life)/v.max,r=(80+v.power*32)*(1+t*.4);stamp(4,v.x,v.y,r,r,1,(1-t)**1.5);}
 function draw(f){for(const o of ZeroRules.objects){if(o.owner!==f.id)continue;const size=o.kind==='buster'?44+o.tier*26:66;stamp(o.kind==='buster'?1:2,o.x,o.y,size*1.3,size,o.face,1,o.kind==='shield'?o.age*.3:0);}
 if(['ShieldStart','ShieldHold'].includes(f.mode))stamp(7,f.x,f.y-35,90,100,1,.55);
 const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(1,f.x+f.face*48,f.y-60,35+a.charge*50,35+a.charge*50,f.face,.8);
 if(a.type==='rise'&&t<=18){const p=ZeroRules.hook(f);chain(f.x,f.y-35,p.x,p.y,t<=10?1:(19-t)/9);}
 if(a.type==='dash'&&t>=7&&t<=19)stamp(6,f.x-f.face*65,f.y-32,180,70,f.face,.8);
 if(a.spellShots)return;const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.6;if(!alpha)return;
 if(['grab','low','dashAttack'].includes(a.type)){const box=attackBoxes(f)[0];if(box)chain(box.x1,box.y1,box.x2,box.y2,alpha);return;}
 if(a.type.endsWith('Throw')||a.type==='pummel')return;
 const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin';{const slashIndex=up?5:0;if([0].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(up?5:0,f.x+(spin||up?0:back?-45:45)*f.face,f.y-(up?65:down?10:35),(a.reach||150)*FIGHTER_SCALE*1.35,up?150:spin?125:95,back?-f.face:f.face,alpha,down?Math.PI/2:0);}
 }
 return{draw,impact};
})();
