'use strict';
const RinVFX=(()=>{
 function stamp(n,x,y,w,h,face=1,alpha=1,rot=0){const img=characterArt.rin?.effects[n];if(!img)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(face,1);ctx.globalAlpha*=alpha;SlashVFX.image('rin',n,img,-w/2,-h/2,w,h);ctx.restore();}
 function impact(v){const t=(v.max-v.life)/v.max,r=(70+v.power*30)*(1+t*.4);stamp(4,v.x,v.y,r,r,1,(1-t)**1.5);}
 function draw(f){for(const o of RinRules.objects){if(o.owner!==f.id)continue;const size=60+o.tier*28;stamp(2,o.x,o.y,size*1.5,size,o.face);}
 if(['ShieldStart','ShieldHold'].includes(f.mode))stamp(7,f.x,f.y-35,90,100,1,.5);
 const a=f.attack;if(!a)return;const t=f.timer;if(a.hold)stamp(5,f.x,f.y-25,70+a.charge*55,50,1,.6);
 if(a.type==='rise'&&t>=a.startupFrames&&t<=a.activeEnd+5)stamp(3,f.x,f.y-48,125,175,1,.8);
 if((a.type==='dash'||a.type.startsWith('side'))&&t>=a.startupFrames&&t<=a.activeEnd+4)stamp(6,f.x-f.face*60,f.y-30,160,60,f.face,.7);
 if(a.spellShots)return;const w=CombatData.activeWindow(a,t)||a.activeFrames.filter(w=>w.end<t).at(-1);if(!w)return;const alpha=t<=w.end?1:Math.max(0,1-(t-w.end)/7)*.6;if(!alpha||a.type==='grab'||a.type==='pummel'||a.type.endsWith('Throw'))return;
 const up=w.shape==='up',back=w.shape==='back',down=w.shape==='down',spin=w.shape==='spin',strong=a.type.includes('smash')||a.type==='side4'||a.type==='jab3';{const slashIndex=spin?5:strong?1:0;if([0,1].includes(slashIndex)&&w.shape!=='spin')SlashVFX.melee(f,w,slashIndex,alpha);else stamp(spin?5:strong?1:0,f.x+(spin||up?0:back?-45:45)*f.face,f.y-(up?65:down?10:35),(a.reach||150)*FIGHTER_SCALE*1.4,up?140:spin?100:90,back?-f.face:f.face,alpha,up?-Math.PI/2:down?Math.PI/2:0);}
 }
 return{draw,impact};
})();
