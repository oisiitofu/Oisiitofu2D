'use strict';
// All coordinates are world pixels at normal size. Pose sampling is pure: no
// wall clock, render counters, previous draw state or simulation mutations.
// This produces actual intermediate limb positions, rather than image fades.
const SukaponAnimation=(()=>{
 const base={head:[0,-74,0],body:[0,-39,0],backHand:[-29,-35,0],frontHand:[29,-36,0],backFoot:[-17,-6,0],frontFoot:[18,-6,0]};
 const names=Object.keys(base),copy=p=>Object.fromEntries(names.map(k=>[k,[...p[k]]])),
  smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);},
  mix=(a,b,t)=>{t=smooth(t);if(t===0)return copy(a);if(t===1)return copy(b);return Object.fromEntries(names.map(k=>[k,a[k].map((v,n)=>{const d=b[k][n]-v;return v+(n===2?Math.atan2(Math.sin(d),Math.cos(d)):d)*t;})]));};
 function key(changes={}){return{...copy(base),...changes};}
 const crouch=key({head:[6,-49,.08],body:[3,-25,.1],backHand:[-25,-18,0],frontHand:[28,-20,0]}),
  jump=key({head:[3,-77,-.06],body:[0,-42,-.1],backHand:[-30,-50,-.5],frontHand:[29,-57,-.7],backFoot:[-17,-17,.5],frontFoot:[17,-16,-.5]}),
  fall=key({head:[1,-73,.09],backHand:[-31,-51,.5],frontHand:[31,-50,-.4],backFoot:[-17,-8,.4],frontFoot:[17,-7,-.3]}),
  guard=key({head:[-2,-69,-.05],frontHand:[23,-62,-.6],backHand:[-23,-58,.6]}),
  hurt=key({head:[-13,-68,-.28],body:[-7,-36,-.2],frontHand:[23,-26,.5],backHand:[-34,-42,-.4],frontFoot:[25,-6,.15]});
 function neutral(f){return f.grounded?copy(base):copy(jump);}
 function strike(f,n){
  const p=key(),pair=sukaponStrike({...f,x:0,y:0,face:1},n),type=f.attack?.type;
  if(pair){const q=pair[1],foot=[11,14,16].includes(n);p[foot?(n===14?'backFoot':'frontFoot'):'frontHand']=[q.x,q.y,foot?(n===16?Math.PI/2:0):Math.atan2(q.y+38,q.x)];}
  p.head=[8,-72,.08];p.body=[5,-38,.1];p.backHand=[-25,-43,-.5];
  if([10,15,47].includes(n)){p.head=[-5,-72,-.1];p.body=[0,-39,-.12];p.backHand=[-24,-37,.4];}
  if([11].includes(n)){Object.assign(p,crouch);p.frontFoot=[pair[1].x,pair[1].y,0];p.frontHand=[20,-26,0];}
  if(n===14){p.head=[-9,-69,-.18];p.body=[-4,-39,-.15];p.frontFoot=[22,-10,.35];}
  if(n===16){p.body=[-4,-41,.25];p.head=[-13,-70,.35];p.backFoot=[-24,-24,-.5];}
  if(n===12||type==='air'){p.frontHand=[34,-55,-.7];p.backHand=[-33,-28,.5];p.frontFoot=[25,-20,-.45];p.backFoot=[-23,-18,.4];}
  if(n===17||n===46){p.frontHand=[pair?.[1].x??43,pair?.[1].y??-41,-.1];p.backHand=[17,-54,-.2];}
  if(n===18){p.frontHand=[37,-48,-.2];p.head=[11,-70,.14];}
  if(n===19){p.frontHand=[53,-48,-.2];p.backHand=[38,-55,-.1];p.body=[9,-38,.18];}
  return p;
 }
 function windup(f,n){
  const p=neutral(f),up=[10,15,47].includes(n),down=[11,16].includes(n),back=n===14;
  p.head=[back?7:-7,down?-59:-71,back?.12:-.13];p.body=[back?4:-5,down?-31:-38,-.16];
  p.frontHand=[up?12:-21,up?-30:-43,up?.6:-.7];p.backHand=[-29,-48,-.6];
  if(down)p.frontFoot=[5,-24,-.8];if(back)p.backFoot=[-6,-19,.8];return p;
 }
 function rollPose(age){
  const p=key(),angle=age*.4,ring=names.filter(k=>k!=='body');
  names.forEach(k=>{const r=k==='body'?0:k==='head'?23:32,theta=angle+ring.indexOf(k)*Math.PI*2/5;p[k]=[Math.cos(theta)*r,-42+Math.sin(theta)*r,k==='body'?0:theta];});return p;
 }
 function attackSample(f){
  const a=f.attack,t=f.timer,start=a.startupFrames,windows=a.activeFrames,last=windows.at(-1),n=CombatData.activeWindow(a,t)?.pose??a.pose;
  const idle=neutral(f),wind=windup(f,n),hit=strike(f,n);
  if(a.sukaponShot||a.sukaponHead){hit.head=[a.sukaponShot?42:44,a.sukaponShot?-48:-49,0];hit.body=[3,-35,.15];}
  if(a.sukaponRoll&&a.phase==='roll'){
   const age=t-(a.rollStart??7),p=rollPose(age);
   return{parts:mix(wind,p,Math.min(1,(age+1)/3)),phase:'active',head:0};
  }
  if(a.sukaponRoll&&a.phase==='fall'){const end=a.totalFrames-12;return{parts:mix(rollPose(end-(a.rollStart??7)),fall,(t-end)/10),phase:'recovery',head:0};}
  if(a.sukaponRoll&&a.phase==='escape')return{parts:jump,phase:'recovery',head:0};
  if(a.sukaponNage&&f.grabbed){const p=key(),age=t-a.captureFrame,theta=age*.35;p.frontHand=[Math.cos(theta)*42,-42-Math.sin(theta)*32,theta];p.backHand=[p.frontHand[0]-12,p.frontHand[1]-8,theta];return{parts:p,phase:'active',head:2};}
  if(t<start){const split=Math.max(1,Math.floor(start*.55)),parts=t<=split?mix(idle,wind,t/split):mix(wind,hit,(t-split)/(start-split));return{parts,phase:'startup',head:2};}
  const window=CombatData.activeWindow(a,t);
  if(window){const previous=windows[windows.indexOf(window)-1],from=previous?.end??start-1,progress=(t-window.start)/Math.max(1,window.end-window.start),p=strike(f,window.pose??a.pose);
   // The striking part stays at the authored hit endpoint for the whole active
   // window. Only supporting parts settle; no oscillating/repeated-hit hands.
   p.head[2]+=.045*progress;p.body[0]+=1.5*progress;
   return{parts:p,phase:'active',head:2,window,from};
  }
  const next=windows.find(w=>w.start>t),prior=windows.filter(w=>w.end<t).at(-1);
  if(next){const begin=prior?.end??start-1,u=(t-begin)/(next.start-begin),from=prior?strike(f,prior.pose??a.pose):hit,target=strike(f,next.pose??a.pose);return{parts:u<.5?mix(from,wind,u*2):mix(wind,target,(u-.5)*2),phase:'between',head:2};}
  // Projectile/command events have no melee window; their release is startup.
  const end=last?.end??a.motionLastEvent??start,recovery=Math.max(1,a.totalFrames-end),u=(t-end)/recovery;
  return{parts:mix(hit,idle,u),phase:'recovery',head:u>.7?0:2};
 }
 function sample(f){
  if(f.attack)return attackSample(f);
  const t=Math.max(0,(f.stateFrame||1)-1),p=copy(base);let head=0;
  if(['LedgeCatch','LedgeHang'].includes(f.mode)){
   // Anchor the front hand to the same world ledge as collision. The other
   // floating parts sway around it; facing reflection is applied once in draw.
   const x=(f.ledge?.x??f.x)-f.x,y=(f.ledge?.y??f.y-74)-f.y,w=Math.sin(t*.09);
   return{parts:key({frontHand:[x*f.face,y,0],backHand:[x*f.face-33,y+55+w,0],head:[x*f.face-19,y+28+w,.04*w],body:[x*f.face-24,y+61+w,0],frontFoot:[x*f.face-10,y+99+w,.1],backFoot:[x*f.face-35,y+100+w,-.1]}),phase:'ledge',head};
  }
  if(['Turn','RunTurn','RunBrake'].includes(f.mode)){const q=key({head:[-7,-72,-.15],body:[-4,-38,-.2],frontHand:[16,-49,-.3],frontFoot:[28,-6,.12]});return{parts:mix(base,q,Math.sin(Math.PI*Math.min(1,(t+1)/Math.max(1,f.stateDuration||8)))),phase:'turn',head:1};}
  if(f.state==='walk'||f.state==='run'){
   const period=f.state==='run'?18:32,angle=t*Math.PI*2/period,step=Math.sin(angle),lift=Math.cos(angle),run=f.state==='run';
   const enter=smooth(t/4);p.head=[run?9:3,-74+(1-Math.cos(angle*2))*(run?1.8:1.1),run?.15:.05];p.body=[run?4:1,-39,run?.18:.05];
   p.frontFoot=[18+step*(run?21:12),-6-Math.max(0,lift)*(run?13:8),step*.4];p.backFoot=[-17-step*(run?21:12),-6-Math.max(0,-lift)*(run?13:8),-step*.4];
   p.frontHand=[29-step*9,-36-lift*5,-step*.3];p.backHand=[-29+step*9,-35+lift*5,step*.3];return{parts:mix(base,p,enter),phase:f.state,head:1};
  }
  if(f.mode==='JumpSquat')return{parts:mix(base,crouch,(t+1)/Math.max(1,f.stateDuration||4)),phase:'jump-squat',head};
  if(['jump','double'].includes(f.state))return{parts:mix(crouch,jump,Math.min(1,(t+1)/5)),phase:'jump',head};
  if(f.state==='fall')return{parts:mix(jump,fall,(t+1)/8),phase:'fall',head};
  if(f.state==='land'||/Landing$/.test(f.mode))return{parts:mix(crouch,base,(t+1)/Math.max(4,f.stateDuration||6)),phase:'landing',head};
  if(f.state==='crouch')return{parts:mix(base,crouch,(t+1)/5),phase:'crouch',head};
  if(f.state==='guard')return{parts:mix(base,guard,(t+1)/4),phase:'shield',head:2};
  if(f.state==='dodge'){
   const u=Math.min(1,(t+1)/Math.max(1,f.stateDuration||24)),q=mix(base,crouch,Math.sin(Math.PI*u));
   return{parts:q,phase:'dodge',head:1,rotation:/Roll/.test(f.mode)?u*Math.PI*2:0};
  }
  if(['hit','caught','fly'].includes(f.state))return{parts:mix(base,hurt,Math.min(1,(t+1)/3)),phase:'hurt',head:3,rotation:f.state==='fly'?Math.sin(t*.13)*.25:0};
  if(f.state==='down'){const q=key({head:[19,-16,.2],body:[-10,-14,.4],frontHand:[39,-8,0],backHand:[-35,-9,0],frontFoot:[5,-5,0],backFoot:[-18,-5,0]});return{parts:q,phase:'down',head:3};}
  if(f.state==='getup'||f.mode==='LedgeGetup')return{parts:mix(crouch,base,(t+1)/Math.max(1,f.stateDuration||18)),phase:'getup',head};
  if(f.state==='grab'||f.state==='throw')return{parts:mix(base,strike(f,f.state==='grab'?17:19),(t+1)/5),phase:f.state,head:2};
  const breathe=Math.sin(t*Math.PI*2/100)*1.4;p.head[1]+=breathe;p.body[1]+=breathe*.5;p.frontHand[1]-=breathe*.5;p.backHand[1]-=breathe*.5;
  return{parts:p,phase:'idle',head};
 }
 function draw(f,alpha=1,scale=1){
  const art=characterArt.sukapon;if(!art?.frames[60])return false;
  const s=sample(f),factor=MorphieRules.scale(f)*scale;
  ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.face*factor,factor);ctx.globalAlpha*=alpha;
  if(f.inv>0&&alpha===1)ctx.globalAlpha*=.64+Math.sin((f.stateFrame||0)*.5)*.24;
  if(s.rotation){ctx.translate(0,-40);ctx.rotate(s.rotation);ctx.translate(0,40);}
  const parts={backFoot:[9,23],backHand:[6,20],body:[4,29],frontFoot:[8,23],head:[s.head,49],frontHand:[5,20]};
  for(const [name,[index,w]]of Object.entries(parts)){
   if(name==='head'&&(f.sukaponHeadAway||rHead(f)||f.attack?.sukaponShot&&f.attack.fired))continue;
   const img=art.tints[f.color||0][49+index],h=w*img.height/img.width,p=s.parts[name];ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(p[2]);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();
  }
  ctx.restore();return true;
 }
 return{sample,draw,base,mix};
})();
