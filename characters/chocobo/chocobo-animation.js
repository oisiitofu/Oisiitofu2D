'use strict';
// Skin the APPROVED standing pixels. The head, neck, backpack and torso share
// one rigid bone. No replacement head, head scaling or neck translation.
const ChocoboAnimation=(()=>{
 const {smooth,copy,mix,leg}=AnimationRig;
 const root=[132,168],hips={near:[145,188],far:[102,188]},lengths={near:[21,21],far:[20,20]};
 const base={body:[...root,0],wing:[0,0,0],tail:[0,0,0],near:[149,225,0],far:[99,225,0]};
 const key=(changes={})=>({...copy(base),...changes});
 const crouch=key({body:[137,183,.12],wing:[0,0,.14],tail:[0,0,-.12]}),
  jump=key({body:[134,165,-.06],wing:[0,0,.65],tail:[0,0,.1],near:[157,209,.22],far:[95,211,-.12]}),
  fall=key({wing:[0,0,.45],tail:[0,0,.08],near:[155,219,.12],far:[95,219,.1]}),
  hurt=key({body:[123,168,-.16],wing:[0,0,-.4],tail:[0,0,.15],near:[155,225,.1]});
 const neutral=f=>copy(f.grounded?base:jump);
 function strike(f,w){
  const a=f.attack,t=a.type,shape=w?.shape||({up:'up',upsmash:'up',uair:'up',low:'low',downsmash:'low',bair:'back',dair:'down'}[t]||'front');
  let p=key({body:[148,169,.15],wing:[0,0,-1.65],tail:[0,0,-.18]});
  if(['jab','jab3','pummel'].includes(t))p=key({body:[151,169,.2],wing:[0,0,-.15],tail:[0,0,-.09]});
  if(t==='pummel')p.body=[142,169,.15];
  if(['jab2','heavy'].includes(t))p.wing=[0,0,-1.95];
  if(shape==='up')p=key({body:[130,159,-.13],wing:[0,0,1.2],tail:[0,0,-.13],near:[149,219,-.1]});
  if(['smash','fair'].includes(t))p=key({body:[138,164,-.28],wing:[0,0,1.05],tail:[0,0,.16],near:[225,177,-.1],far:[108,225,0]});
  if(shape==='back')p=key({body:[126,168,.12],wing:[0,0,.4],tail:[0,0,-.45],near:[150,218,.15],far:[62,193,Math.PI]});
  if(shape==='low')p=key({body:[149,185,.18],wing:[0,0,-1.25],tail:[0,0,-.18],near:[181,229,0],far:[108,225,.12]});
  if(shape==='down')p=key({body:[132,155,.19],wing:[0,0,.5],tail:[0,0,.1],near:[159,218,.15],far:[111,215,.1]});
  if(t==='air')p=key({body:[132,164,0],wing:[0,0,-.6],tail:[0,0,-.2],near:[162,207,-.25],far:[88,209,.2]});
  if(a.targetedMeteor)p=key({body:[130,166,-.06],wing:[0,0,1],tail:[0,0,-.1]});
  if(a.chocoDash)p=key({body:[151,174,.24],wing:[0,0,.2],tail:[0,0,-.16],near:[169,224,-.15],far:[101,216,.2]});
  if(a.glideStart)p=key({...jump,wing:[0,0,1.15]});
  if(t==='gale')p=key({body:[131,167,-.04],wing:[0,0,-.12],tail:[0,0,-.05]});
  if(/Throw$/.test(t)||t==='grab')p=key({body:[142,169,.13],wing:[0,0,-1.65],tail:[0,0,-.13]});
  return p;
 }
 function windup(f,w){const p=mix(neutral(f),crouch,.5);p.body[0]-=8;p.body[2]=-.1;p.wing[2]=.22;p.tail[2]=.12;if(w?.shape==='back'){p.body[0]+=13;p.body[2]=.12;}return p;}
 function glide(t){const p=copy(jump);p.wing[2]=.85+Math.sin(t*.28)*.48;p.tail[2]=Math.sin(t*.28-.6)*.12;return p;}
 function attackSample(f){
  const a=f.attack,t=f.timer,windows=a.activeFrames,start=a.startupFrames,idle=neutral(f),first=windows[0],last=windows.at(-1),wind=windup(f,first),hit=strike(f,first),w=CombatData.activeWindow(a,t);
  let s;
  // Start on precisely the standing shape; move individual limbs during the
  // existing startup. Combat's active windows and actionability are unchanged.
  if(t<start){const age=Math.max(0,t-1),split=Math.max(1,(start-1)*.5);s={parts:age<=split?mix(idle,wind,age/split):mix(wind,hit,(age-split)/Math.max(1,start-1-split)),phase:'startup'};}
  else if(a.glideStart&&t>=a.glideStart&&t<=a.glideEnd)s={parts:glide(t-a.glideStart),phase:'glide'};
  else if(w){const p=strike(f,w),u=(t-w.start)/Math.max(1,w.end-w.start);p.tail[2]+=.035*u;s={parts:p,phase:'active'};}
  else{
   const next=windows.find(v=>v.start>t),prior=windows.filter(v=>v.end<t).at(-1);
   if(next){const u=(t-(prior?.end??start-1))/(next.start-(prior?.end??start-1)),from=prior?strike(f,prior):hit;s={parts:u<.5?mix(from,wind,u*2):mix(wind,strike(f,next),(u-.5)*2),phase:'between'};}
   else{const end=Math.max(last?.end??start,a.glideEnd??0),u=(t-end)/Math.max(1,a.totalFrames-end),from=a.glideStart?glide(a.glideEnd-a.glideStart):strike(f,last);s={parts:mix(from,idle,u),phase:'recovery'};}
  }
  if(a.type==='air'&&t>=7&&t<=18)s.rotation=smooth((t-7)/11)*Math.PI*2;
  return s;
 }
 function samplePose(f){
  if(f.attack)return attackSample(f);
  const t=Math.max(0,(f.stateFrame||1)-1);
  if(['LedgeCatch','LedgeHang'].includes(f.mode)){
   const unit=FIGHTER_SCALE*BattleSize.art('chocobo')*BattleSize.native('chocobo',0)*MorphieRules.scale(f),angle=-.45,tip=[20,8],dx=Math.cos(angle)*tip[0]-Math.sin(angle)*tip[1],dy=Math.sin(angle)*tip[0]+Math.cos(angle)*tip[1],x=106.5+((f.ledge?.x??f.x)-f.x)*f.face/unit-dx,y=236+((f.ledge?.y??f.y)-f.y)/unit-dy;
   return{parts:key({body:[x-12,y+18,0],near:[x,y,angle],far:[x-28,y+57,.15],wing:[0,0,.15],tail:[0,0,Math.sin(t*.08)*.06]}),phase:'ledge'};
  }
  if(['Turn','RunTurn','RunBrake'].includes(f.mode))return{parts:mix(base,key({body:[126,170,-.14],wing:[0,0,.15],tail:[0,0,.18],near:[158,225,.1]}),Math.sin(Math.PI*Math.min(1,t/Math.max(1,f.stateDuration||8)))),phase:'turn'};
  if(['walk','run'].includes(f.state)){
   const run=f.state==='run',angle=t*Math.PI*2/(run?18:32),step=Math.sin(angle),lift=Math.cos(angle),bob=(1-Math.cos(angle*2))*(run?3:1.5);
   return{parts:mix(base,key({body:[run?140:134,168+bob,run?.13:.035],wing:[0,0,step*(run?.25:.12)],tail:[0,0,-step*.13],near:[149+step*(run?28:17),225-Math.max(0,lift)*(run?22:11),step*.15],far:[99-step*(run?28:17),225-Math.max(0,-lift)*(run?22:11),-step*.15]}),t/4),phase:f.state};
  }
  if(f.mode==='JumpSquat')return{parts:mix(base,crouch,t/Math.max(1,(f.stateDuration||4)-1)),phase:'jump-squat'};
  if(['jump','double'].includes(f.state))return{parts:mix(crouch,jump,(t+1)/5),phase:'jump'};
  if(f.state==='fall')return{parts:mix(jump,fall,t/8),phase:'fall'};
  if(f.state==='land'||/Landing$/.test(f.mode))return{parts:mix(crouch,base,t/Math.max(4,f.stateDuration||6)),phase:'landing'};
  if(f.state==='crouch')return{parts:mix(base,crouch,t/5),phase:'crouch'};
  if(f.state==='guard')return{parts:mix(base,key({body:[129,173,-.08],wing:[0,0,-.65],tail:[0,0,.12]}),t/4),phase:'shield'};
  if(f.state==='dodge'){const u=Math.min(1,t/Math.max(1,f.stateDuration||24));return{parts:mix(base,crouch,Math.sin(Math.PI*u)),rotation:/Roll/.test(f.mode)?u*Math.PI*2:0,phase:'dodge'};}
  if(['hit','caught','fly'].includes(f.state))return{parts:mix(base,hurt,t/3),rotation:f.state==='fly'?Math.sin(t*.13)*.18:0,phase:'hurt'};
  if(f.state==='down')return{parts:copy(crouch),rotation:-1.35*smooth(t/5),groundAnchor:true,phase:'down'};
  if(f.mode==='LedgeGetup')return{parts:mix(crouch,base,t/Math.max(1,f.stateDuration||18)),phase:'getup'};
  if(f.state==='getup'){const u=t/Math.max(1,f.stateDuration||18);return{parts:mix(crouch,base,u),rotation:-1.35*(1-smooth(u)),groundAnchor:true,phase:'getup'};}
  if(f.state==='grab'||f.state==='throw')return{parts:mix(base,key({body:[141,170,.12],wing:[0,0,-1.55]}),t/5),phase:f.state};
  return{parts:copy(base),phase:'idle'};
 }
 function matrix(from,to,angle){const c=Math.cos(angle),s=Math.sin(angle);return[c,s,-s,c,to[0]-c*from[0]+s*from[1],to[1]-s*from[0]-c*from[1]];}
 const apply=(m,p)=>[m[0]*p[0]+m[2]*p[1]+m[4],m[1]*p[0]+m[3]*p[1]+m[5]];
 const rest={};for(const name of ['near','far'])rest[name]=leg(hips[name],base[name],...lengths[name],1);
 function skeleton(p){
  const body=matrix(root,p.body,p.body[2]),bones=[body],joints={};
  for(const [pivot,angle]of [[[145,132],p.wing[2]],[[88,136],p.tail[2]]])bones.push(matrix(pivot,apply(body,pivot),p.body[2]+angle));
  for(const name of ['near','far']){
   const b=leg(apply(body,hips[name]),p[name],...lengths[name],1),r=rest[name];joints[name]=b;
   for(const [a,z,ra,rz]of [[b.hip,b.knee,r.hip,r.knee],[b.knee,b.ankle,r.knee,r.ankle]])bones.push(matrix(ra,a,Math.atan2(z[1]-a[1],z[0]-a[0])-Math.atan2(rz[1]-ra[1],rz[0]-ra[0])));
   bones.push(matrix(r.ankle,b.ankle,p[name][2]));
  }
  return{bones,joints};
 }

 function sample(f){
  const s=samplePose(f),a=f.attack;
  s.spread=s.phase==='glide'?1:f.attack||['jump','double','fall','guard'].includes(f.state)?Math.min(1,Math.abs(s.parts.wing[2])/.35):0;
  if(a&&['jab','jab3','pummel'].includes(a.type))s.spread=0;
  return s;
 }
 const outlines={
  head:[[83,0],[213,0],[213,114],[183,135],[153,131],[141,116],[110,112],[84,97]],
  body:[[70,113],[119,106],[148,111],[180,130],[197,158],[184,185],[148,202],[100,195],[75,176]],
  tail:[[0,45],[93,45],[111,101],[108,122],[88,149],[59,182],[0,182]],
  wing:[[140,119],[158,130],[149,158],[132,180],[105,189],[79,174],[74,158],[89,140],[114,128]],
  nearThigh:[[127,180],[159,180],[161,210],[150,217],[131,214],[124,203]],
  nearShin:[[134,202],[155,202],[162,226],[147,233],[135,225]],
  nearFoot:[[137,219],[170,219],[192,238],[139,240],[125,231]],
  farThigh:[[83,181],[113,181],[117,208],[110,215],[89,214],[82,201]],
  farShin:[[89,201],[112,201],[113,226],[102,233],[87,225]],
  farFoot:[[85,218],[114,218],[133,238],[76,240],[72,230]],
  spread:[[123,98],[150,104],[194,96],[238,59],[244,97],[239,121],[239,153],[225,169],[205,177],[171,175],[137,159],[117,137]]
 };
 const paths={};
 function path(name){if(paths[name])return paths[name];const p=new Path2D();outlines[name].forEach((v,i)=>p[i?'lineTo':'moveTo'](...v));p.closePath();return paths[name]=p;}
 let groundBounds;
 const bodyFills=new WeakMap();
 function bodyFill(image){let c=bodyFills.get(image);if(c)return c;c=document.createElement('canvas');c.width=119;c.height=100;c.getContext('2d').drawImage(image,0,0,119,119*image.height/image.width);bodyFills.set(image,c);return c;}
 function groundPoints(source){
  if(groundBounds)return groundBounds;
  // Alpha bounds of small already-loaded textures, cached once per character.
  // Transparent corners of the clip polygons must not make a fallen bird float.
  const c=document.createElement('canvas');c.width=source.width;c.height=source.height;const g=c.getContext('2d',{willReadFrequently:true});groundBounds={};
  for(const name of ['head','body','tail','wing','nearThigh','nearShin','nearFoot','farThigh','farShin','farFoot']){
   g.clearRect(0,0,c.width,c.height);g.save();g.clip(path(name));g.drawImage(source,0,0);g.restore();const pixels=g.getImageData(0,0,c.width,c.height).data,points=[];
   for(let y=0;y<c.height;y++){let lo=c.width,hi=-1;for(let x=0;x<c.width;x++)if(pixels[(y*c.width+x)*4+3]>=8){lo=Math.min(lo,x);hi=x;}if(hi>=lo)points.push([lo,y],[hi+1,y+1]);}groundBounds[name]=points;
  }return groundBounds;
 }
 async function loadParts(frames){const img=new Image();img.src='characters/chocobo/assets/chocobo-torso-underpaint-v2.png';await img.decode();const c=document.createElement('canvas');c.width=958;c.height=805;c.getContext('2d').drawImage(img,210,187,958,805,0,0,958,805);frames.push(c);}
 function draw(f,alpha=1,scale=1,assembleBase=false){
  const art=characterArt.chocobo;if(!art?.frames[43])return false;
  // Keep the original intentional black-mage outfit transformation.
  if(f.attack?.type==='gale')return false;
  const s=sample(f),p=s.parts,identity=!s.rotation&&JSON.stringify(p)===JSON.stringify(base);
  if(identity&&s.phase==='idle'&&!assembleBase)return false;
  const images=art.tints[f.color||0],source=images[0],unit=FIGHTER_SCALE*BattleSize.art('chocobo')*BattleSize.native('chocobo',0)*MorphieRules.scale(f)*scale,sk=skeleton(p),b=sk.bones;
  ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.face*unit,unit);ctx.globalAlpha*=alpha;if(f.inv>0&&alpha===1)ctx.globalAlpha*=.64+Math.sin((f.stateFrame||0)*.5)*.24;
  ctx.translate(-106.5,-236);
  if(s.groundAnchor){
   // Topple the connected body onto the floor, without sinking its tail or
   // changing its size. Use transformed part bounds, not an arbitrary offset.
   const c=Math.cos(s.rotation||0),v=Math.sin(s.rotation||0),bounds=groundPoints(art.frames[0]),names=['head','body','tail','wing','nearThigh','nearShin','nearFoot','farThigh','farShin','farFoot'],indices=[0,0,2,1,3,4,5,6,7,8];let bottom=-Infinity;
   names.forEach((name,i)=>bounds[name].forEach(point=>{const q=apply(b[indices[i]],point);bottom=Math.max(bottom,root[1]+v*(q[0]-root[0])+c*(q[1]-root[1]));}));ctx.translate(0,236-bottom);
  }
  if(s.rotation){ctx.translate(...root);ctx.rotate(s.rotation);ctx.translate(-root[0],-root[1]);}
  if(identity&&!assembleBase){ctx.drawImage(source,0,0);ctx.restore();return true;}
  function clipped(name,bone,img=source){ctx.save();ctx.transform(...bone);ctx.clip(path(name));ctx.drawImage(img,0,0);ctx.restore();}
  function limb(name,start){
   const j=sk.joints[name];
   // Small rounded joints sit behind the original scaled-leg textures. Their
   // centers follow the fixed-length IK bones; no disconnected cut edges.
   ctx.save();ctx.fillStyle='#604a31';for(const [point,r]of [[j.knee,5],[j.ankle,4]]){ctx.beginPath();ctx.arc(point[0],point[1],r,0,Math.PI*2);ctx.fill();}ctx.restore();
   clipped(name+'Thigh',b[start]);clipped(name+'Shin',b[start+1]);clipped(name+'Foot',b[start+2]);
  }
  function spreadWing(far){
   ctx.save();ctx.transform(...b[0]);ctx.translate(far?125:145,far?130:132);ctx.rotate(-p.wing[2]*.6+(far?-.15:0));if(far)ctx.scale(-.74,.74);ctx.scale(.95809,.95809);ctx.translate(-128,-110);ctx.globalAlpha*=s.spread*(far?.85:1);ctx.clip(path('spread'));ctx.drawImage(images[7],0,0);ctx.restore();
  }
  clipped('tail',b[2]);if(s.spread)spreadWing(true);limb('far',6);
  ctx.save();ctx.transform(...b[0]);ctx.clip(path('body'));
  // Only the area originally hidden under a wing is filled. Original visible
  // leather, chest and belly pixels remain above this underpainting.
  ctx.drawImage(bodyFill(images[43]),77,109);
  const visible=new Path2D(path('body'));visible.addPath(path('wing'));ctx.clip(visible,'evenodd');ctx.drawImage(source,0,0);ctx.restore();
  clipped('head',b[0]);
  if(s.spread<1){ctx.save();ctx.globalAlpha*=1-s.spread;clipped('wing',b[1]);ctx.restore();}
  if(s.spread)spreadWing(false);limb('near',3);
  ctx.restore();return true;
 }
 return{base,sample,skeleton,draw,loadParts,lengths,apply,outlines};
})();
