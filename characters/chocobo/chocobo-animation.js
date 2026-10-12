'use strict';
// Connected bird rig in world pixels. Only simulation clocks drive poses;
// rendering cannot advance an animation or change any combat state.
const ChocoboAnimation=(()=>{
 const {copy,mix,transform,leg}=AnimationRig;
 const base={body:[0,-49,0],head:[13,-67,0],wing:[1,-59,0],farWing:[-7,-59,.1],tail:[-23,-45,0],foot:[18,-18,0],farFoot:[-13,-21,0]};
 const key=changes=>({...copy(base),...changes});
 const crouch=key({body:[3,-36,.15],head:[17,-54,.12],wing:[4,-46,.15],farWing:[-4,-46,.2],tail:[-20,-32,.15]}),
  jump=key({body:[1,-52,-.1],head:[15,-70,-.08],wing:[3,-62,-.6],farWing:[-5,-62,-.8],tail:[-22,-48,-.1],foot:[21,-28,.4],farFoot:[-13,-29,.3]}),
  fall=key({wing:[1,-59,-.35],farWing:[-7,-59,-.5],foot:[21,-22,.25],farFoot:[-12,-24,.3]}),
  hurt=key({body:[-7,-47,-.2],head:[3,-65,-.3],wing:[-7,-56,.4],farWing:[-15,-56,.2],tail:[-30,-43,-.2],foot:[15,-16,.2]});
 const neutral=f=>copy(f.grounded?base:jump);
 function shape(f,w){const t=f.attack.type;return w?.shape??({up:'up',upsmash:'up',uair:'up',dair:'down',bair:'back',low:'low',downsmash:'low'}[t]||'front');}
 function strike(f,w){
  const a=f.attack,t=a.type,s=shape(f,w),p=key({body:[14,-47,.22],head:[32,-63,.25],wing:[15,-56,-2.15],farWing:[5,-56,-.35],tail:[-9,-44,.2]});
  if(['jab','jab3','pummel'].includes(t)){p.head=[39,-62,.3];p.wing=[12,-55,-.25];}
  if(t==='pummel')p.head[0]=30;
  if(t==='jab2'||t==='heavy'){p.head=[27,-65,.16];p.wing=[18,-56,-2.6];}
  if(s==='up'){Object.assign(p,key({body:[-3,-54,-.25],head:[2,-74,-.45],wing:[2,-66,1.15],farWing:[-9,-65,1],tail:[-25,-50,-.2],foot:[18,-18,-.1]}));}
  if(['smash','fair'].includes(t)){Object.assign(p,key({body:[18,-48,-.2],head:[27,-67,-.13],wing:[18,-59,-.45],farWing:[7,-59,-.4],tail:[-5,-44,-.2],foot:[53,-48,-.4],farFoot:[8,-21,0]}));}
  if(s==='back'){Object.assign(p,key({body:[-10,-48,.18],head:[6,-65,.1],wing:[-9,-59,-.5],farWing:[-18,-59,-.4],tail:[-33,-44,-.25],foot:[9,-23,.25],farFoot:[-49,-44,Math.PI]}));}
  if(s==='low'){Object.assign(p,crouch);p.body=[14,-34,.18];p.head=[31,-51,.2];p.wing=[17,-44,-1.8];p.farWing=[7,-44,-.2];p.tail=[-9,-30,.18];p.foot=[44,-18,0];p.farFoot=[5,-21,.1];}
  if(s==='down'){Object.assign(p,key({body:[0,-30,.3],head:[9,-48,.4],wing:[-1,-43,-.9],farWing:[-11,-43,-.8],tail:[-24,-25,.3],foot:[24,6,.2],farFoot:[-1,5,.2]}));}
  if(t==='air'){Object.assign(p,jump);p.wing=[3,-62,-2.1];p.farWing=[-5,-62,-2];p.foot=[28,-29,-.4];p.farFoot=[-24,-31,.5];}
  if(a.targetedMeteor){Object.assign(p,key({head:[7,-71,-.35],body:[-3,-50,-.08],wing:[3,-62,-1.5],farWing:[-7,-62,-1.25],tail:[-26,-46,-.08]}));}
  if(a.chocoDash){Object.assign(p,key({body:[11,-43,.38],head:[32,-57,.4],wing:[6,-55,.25],farWing:[-5,-55,.4],tail:[-12,-41,.35],foot:[34,-16,-.2],farFoot:[-9,-23,.4]}));}
  if(a.glideStart){Object.assign(p,jump);p.wing=[3,-62,1.1];p.farWing=[-5,-62,.9];}
  if(t==='gale'){Object.assign(p,key({body:[-4,-50,-.08],head:[9,-68,-.1],wing:[-1,-61,-1.95],farWing:[-11,-61,-.3],tail:[-27,-46,-.08]}));}
  if(/Throw$/.test(t)||t==='grab'){p.head=[26,-66,.12];p.wing=[12,-56,-2.3];p.farWing=[5,-56,-1.8];}
  return p;
 }
 function windup(f,w){const p=mix(neutral(f),crouch,.35),s=shape(f,w);p.head[0]-=8;p.head[2]=-.15;p.wing[2]=.5;p.tail[2]=-.2;if(s==='up'){p.head[1]+=5;p.wing[2]=.3;}if(s==='back'){p.body[0]+=7;p.head[0]+=10;p.farFoot=[-4,-26,.4];}if(s==='down')Object.assign(p,jump);return p;}
 function glidePose(t){const p=copy(jump),flap=Math.sin(t*.28);p.wing[2]=1.05+flap*.55;p.farWing[2]=.9+flap*.5;p.head[2]=.05;p.tail[2]=flap*.06;return p;}
 function attackSample(f){
  const a=f.attack,t=f.timer,windows=a.activeFrames,w=CombatData.activeWindow(a,t),first=windows[0],last=windows.at(-1),start=a.startupFrames,idle=neutral(f),wind=windup(f,first),hit=strike(f,first);
  if(t<start){const split=Math.max(1,Math.floor(start*.55));return{parts:t<=split?mix(idle,wind,t/split):mix(wind,hit,(t-split)/(start-split)),phase:'startup',head:a.type==='gale'?3:0,spread:!['jab','jab3','pummel'].includes(a.type)?AnimationRig.smooth(t/start):0};}
  if(a.glideStart&&t>=a.glideStart&&t<=a.glideEnd)return{parts:glidePose(t-a.glideStart),phase:'glide',head:0,spread:true};
  if(w)return{parts:strike(f,w),phase:'active',head:a.type==='gale'?3:1,spread:!['jab','jab3','pummel'].includes(a.type)};
  const next=windows.find(v=>v.start>t),prior=windows.filter(v=>v.end<t).at(-1);
  if(next){const u=(t-(prior?.end??start-1))/(next.start-(prior?.end??start-1)),from=prior?strike(f,prior):hit;return{parts:u<.5?mix(from,wind,u*2):mix(wind,strike(f,next),(u-.5)*2),phase:'between',head:0,spread:true};}
  const end=Math.max(last?.end??start,a.glideEnd??0),u=(t-end)/Math.max(1,a.totalFrames-end),from=a.glideStart?glidePose(a.glideEnd-a.glideStart):strike(f,last);
  return{parts:mix(from,idle,u),phase:'recovery',head:a.type==='gale'&&u<.7?3:0,spread:(f.grounded?(!['jab','jab3','pummel'].includes(a.type)?1-AnimationRig.smooth(u):0):1)};
 }
 function sample(f){
  if(f.attack){const s=attackSample(f);if(f.attack.type==='air'&&f.timer>=7&&f.timer<=18)s.rotation=(f.timer-7)/11*Math.PI*2;return s;}
  const t=Math.max(0,(f.stateFrame||1)-1),p=copy(base),result={parts:p,phase:f.state||'idle',head:0,spread:false};
  if(['LedgeCatch','LedgeHang'].includes(f.mode)){
   // A bird holds the ledge with its near claw. The IK ankle and foot keep
   // this anchor fixed while the connected body hangs underneath it.
   const x=((f.ledge?.x??f.x)-f.x)*f.face,y=(f.ledge?.y??f.y)-f.y,sway=Math.sin(t*.08);
   result.parts=key({body:[x-12,y+15,0],head:[x+1,y-3,.1],wing:[x-11,y+5,-.2],farWing:[x-20,y+5,-.3],tail:[x-35,y+19,.1],foot:[x,y+2,-.45],farFoot:[x-24,y+47,.2]});result.phase='ledge';return result;
  }
  if(['Turn','RunTurn','RunBrake'].includes(f.mode)){result.parts=mix(base,key({body:[-5,-46,-.18],head:[4,-64,-.2],wing:[-4,-56,.2],tail:[-28,-42,-.18],foot:[25,-18,.1]}),Math.sin(Math.PI*Math.min(1,(t+1)/Math.max(1,f.stateDuration||8))));return result;}
  if(['walk','run'].includes(f.state)){
   const run=f.state==='run',angle=t*Math.PI*2/(run?18:32),step=Math.sin(angle),lift=Math.cos(angle),q=key(),bob=(1-Math.cos(angle*2))*(run?2:1);
   q.body=[run?5:1,-49+bob,run?.15:.04];q.head=[run?21:15,-67+bob,run?.2:.04];q.wing=[run?6:2,-59+bob,.12+step*.12];q.farWing=[run?-2:-6,-59+bob,.15-step*.1];q.tail=[run?-18:-22,-45+bob,run?.15:.04];q.foot=[12+step*(run?24:17),-18-Math.max(0,lift)*(run?16:9),step*.2];q.farFoot=[-6-step*(run?24:17),-21-Math.max(0,-lift)*(run?16:9),-step*.2];result.parts=mix(base,q,t/4);return result;
  }
  if(f.mode==='JumpSquat'){result.parts=mix(base,crouch,(t+1)/Math.max(1,f.stateDuration||4));return result;}
  if(['jump','double'].includes(f.state)){result.parts=mix(crouch,jump,(t+1)/5);result.spread=AnimationRig.smooth((t+1)/5);return result;}
  if(f.state==='fall'){result.parts=mix(jump,fall,(t+1)/8);result.spread=true;return result;}
  if(f.state==='land'||/Landing$/.test(f.mode)){result.parts=mix(crouch,base,(t+1)/Math.max(4,f.stateDuration||6));return result;}
  if(f.state==='crouch'){result.parts=mix(base,crouch,(t+1)/5);return result;}
  if(f.state==='guard'){result.parts=mix(base,key({head:[7,-64,-.13],wing:[0,-61,-.9],farWing:[-8,-61,-.8]}),(t+1)/4);return result;}
  if(f.state==='dodge'){const u=Math.min(1,(t+1)/Math.max(1,f.stateDuration||24));result.parts=mix(base,crouch,Math.sin(Math.PI*u));result.rotation=/Roll/.test(f.mode)?u*Math.PI*2:0;return result;}
  if(['hit','caught','fly'].includes(f.state)){result.parts=mix(base,hurt,(t+1)/3);result.head=2;result.rotation=f.state==='fly'?Math.sin(t*.13)*.2:0;return result;}
  if(f.state==='down'){result.parts=key({body:[0,-27,-.9],head:[-10,-27,-1.2],wing:[0,-28,-.8],farWing:[-8,-28,-.9],tail:[-14,-10,-.9],foot:[28,-17,.4],farFoot:[16,-19,.4]});result.head=2;return result;}
  if(f.state==='getup'||f.mode==='LedgeGetup'){result.parts=mix(crouch,base,(t+1)/Math.max(1,f.stateDuration||18));return result;}
  if(f.state==='grab'||f.state==='throw'){result.parts=mix(base,key({head:[26,-66,.15],wing:[8,-58,-2.2],farWing:[0,-58,-1.8]}),(t+1)/5);result.spread=true;return result;}
  const breathe=Math.sin(t*Math.PI*2/100)*1.2;p.body[1]+=breathe*.4;p.head[1]+=breathe;p.wing[1]+=breathe*.4;p.farWing[1]+=breathe*.4;p.tail[1]+=breathe*.4;return result;
 }
 function joints(p){const hip=transform(p.body,5,11),farHip=transform(p.body,-7,9);return{near:leg(hip,p.foot,19,22,-1),far:leg(farHip,p.farFoot,19,22,-1)};}
 async function loadParts(frames){const data={"image":"characters/chocobo/assets/chocobo-animation-parts-v1.png","rects":[[34,27,270,300],[351,27,259,295],[644,34,265,293],[944,17,298,314],[27,352,276,262],[334,375,270,213],[620,333,312,294],[980,388,272,208],[48,641,208,259],[415,654,143,236],[657,707,271,196],[1026,649,191,250],[92,967,134,225],[345,994,219,207],[624,923,295,290],[944,950,308,245]]},img=new Image();img.src=data.image;await img.decode();for(const [x,y,w,h]of data.rects){const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,x,y,w,h,0,0,w,h);frames.push(c);}}
 function draw(f,alpha=1,scale=1){
  const art=characterArt.chocobo;if(!art?.frames[58])return false;
  const s=sample(f),p=s.parts,bones=joints(p),factor=MorphieRules.scale(f)*scale,imgs=art.tints[f.color||0];
  ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.face*factor,factor);ctx.globalAlpha*=alpha;if(f.inv>0&&alpha===1)ctx.globalAlpha*=.64+Math.sin((f.stateFrame||0)*.5)*.24;
  if(s.rotation){ctx.translate(0,-45);ctx.rotate(s.rotation);ctx.translate(0,45);}
  function part(index,point,width,anchor=[.5,.5],flip=false){const img=imgs[43+index],h=width*img.height/img.width;ctx.save();ctx.translate(point[0],point[1]);ctx.rotate(point[2]||0);if(flip)ctx.scale(-1,1);ctx.drawImage(img,-width*anchor[0],-h*anchor[1],width,h);ctx.restore();}
  function segment(index,a,b,from,to){const img=imgs[43+index],dx=(to[0]-from[0])*img.width,dy=(to[1]-from[1])*img.height,unit=Math.hypot(b[0]-a[0],b[1]-a[1])/Math.hypot(dx,dy);ctx.save();ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(b[1]-a[1],b[0]-a[0])-Math.atan2(dy,dx));ctx.drawImage(img,-from[0]*img.width*unit,-from[1]*img.height*unit,img.width*unit,img.height*unit);ctx.restore();}
  function limb(b,far){segment(far?11:8,b.hip,b.knee,far?[.75,.4]:[.24,.36],far?[.59,.91]:[.75,.9]);segment(far?12:9,b.knee,b.ankle,far?[.75,.12]:[.23,.14],far?[.3,.88]:[.7,.87]);const foot=p[far?'farFoot':'foot'];part(far?13:10,[...b.ankle,foot[2]],far?26:28,far?[.6,.16]:[.27,.12],far);}
  part(14,p.tail,43,[.86,.7]);if(s.head===3)part(15,[p.body[0]-10,p.body[1]-13,p.body[2]],64,[.5,.1]);
  limb(bones.far,true);part(7,p.farWing,32+19*Number(s.spread),[.1,.23],true);
  limb(bones.near,false);part(4,p.body,59);part(s.head,p.head,s.head===3?49:44,[.57,.93]);part(6,p.wing,37+20*Number(s.spread),[.88,.25]);
  ctx.restore();return true;
 }
 return{base,sample,joints,draw,loadParts};
})();
