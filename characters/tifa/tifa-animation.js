'use strict';
// Approved standing pixels, articulated at fixed lengths. This renderer never
// changes combat data, simulation state or the original idle/portrait images.
const TifaAnimation=(()=>{
 const {copy,mix,leg,smooth}=AnimationRig,root=[113,128],origin=[210*.4987453072515313,283];
 const endpoints={nearArm:{hip:[94,67],knee:[80,99],ankle:[100,86],bend:1},farArm:{hip:[144,68],knee:[160,101],ankle:[157,85],bend:-1},near:{hip:[91,153],knee:[62,200],ankle:[26,251],bend:-1},far:{hip:[130,154],knee:[159,202],ankle:[172,253],bend:-1}};
 const lengths=Object.fromEntries(Object.entries(endpoints).map(([n,j])=>[n,[Math.hypot(j.knee[0]-j.hip[0],j.knee[1]-j.hip[1]),Math.hypot(j.ankle[0]-j.knee[0],j.ankle[1]-j.knee[1])]]));
 const base={body:[...root,0],nearArm:[100,86,0],farArm:[157,85,0],near:[26,251,0],far:[172,253,0],hair:[0,0,0]};
 const key=(v={})=>({...copy(base),...v}),crouch=key({body:[119,151,.12],near:[39,251,.08],far:[174,253,-.06],nearArm:[111,116,-.25],farArm:[161,112,.12]}),jump=key({body:[114,124,-.04],near:[52,225,.18],far:[163,228,-.16],nearArm:[97,78,-.2],farArm:[156,78,.15]}),hurt=key({body:[97,126,-.18],nearArm:[77,111,-.5],farArm:[167,101,.4],near:[31,251,.05]});
 const neutral=f=>copy(f.grounded?base:jump);
 function strike(f,w){
  const a=f.attack,n=w?.pose??a.pose,t=a.type,shape=w?.shape||({up:'up',upsmash:'up',uair:'up',bair:'back',dair:'down',low:'low'}[t]||'front');
  let p=key({body:[133,128,.13],nearArm:[190,75,-.4],farArm:[154,80,0],hair:[0,0,-.055]});
  if(['jab2','heavy','smash'].includes(t)||n===7||n===42)p=key({body:[139,130,.18],nearArm:[204,75,-.4],farArm:[153,84,.15],hair:[0,0,-.09]});
  if(['jab3','downsmash'].includes(t)||n===8||n===43)p=key({body:[106,123,-.16],near:[205,92,-1.05],far:[163,253,0],nearArm:[83,80,-.2],farArm:[146,83,0],hair:[0,0,.1]});
  if(shape==='up')p=key({body:[116,116,-.1],nearArm:[114,14,-.3],farArm:[152,73,.1],near:[67,180,.6],far:[166,253,0],hair:[0,0,.05]});
  if(t==='upsmash'||n===10)p=key({body:[124,115,-.12],nearArm:[133,3,-.25],farArm:[158,81,0],near:[74,186,.3],far:[170,253,0]});
  if(n===13||t==='fair')p=key({body:[103,136,-.24],near:[205,156,-.9],far:[148,228,-.2],nearArm:[87,79,-.3],farArm:[140,88,.2],hair:[0,0,.1]});
  if(shape==='back'||n===14||n===44)p=key({body:[125,125,.24],far:[-33,137,.9],near:[79,232,.3],nearArm:[118,78,-.2],farArm:[167,76,.3],hair:[0,0,-.1]});
  if(shape==='low'||n===11)p=key({body:[133,163,.32],near:[190,251,-.75],far:[109,253,-.25],nearArm:[143,125,-.3],farArm:[161,128,.1],hair:[0,0,-.12]});
  if(shape==='down'||n===16||n===45)p=key({body:[114,107,.28],near:[160,256,.1],far:[119,202,.7],nearArm:[96,68,-.2],farArm:[162,55,.2],hair:[0,0,-.16]});
  if(n===15||t==='uair')p=key({body:[113,147,-.3],near:[131,18,-1.3],far:[153,175,-.7],nearArm:[75,97,-.4],farArm:[141,103,.2]});
  if(t==='air'||n===12)p=key({body:[115,122,.12],near:[90,186,.5],far:[192,196,-.7],nearArm:[172,77,-.2],farArm:[104,111,.25]});
  if(t==='dashAttack')p=key({body:[146,153,.42],near:[74,246,.2],far:[202,214,-.3],nearArm:[150,124,-.4],farArm:[179,126,.1],hair:[0,0,-.18]});
  if(t==='grab'||/Throw$/.test(t))p=key({body:[130,131,.12],nearArm:[184,99,-.3],farArm:[182,100,-.1]});
  if(t==='upThrow')p=key({body:[115,119,-.08],nearArm:[118,14,-.4],farArm:[151,13,-.4]});
  if(t==='downThrow')p=key({...crouch,nearArm:[152,145,-.8],farArm:[168,145,-.8]});
  if(t==='pummel')p=key({body:[132,132,.13],nearArm:[160,93,-.5]});
  if(a.tifaKi)p=key({body:[113,126,0],nearArm:[77,121,-.65],farArm:[169,123,.65],hair:[0,0,-.06]});
  // Store reachable joint targets, so short multi-hit gaps interpolate the
  // actual limb endpoints rather than distant unreachable IK requests.
  const sk=skeleton(p);for(const[n,j]of Object.entries(sk.joints)){p[n][0]=j.ankle[0];p[n][1]=j.ankle[1];}return p;
 }
 function windup(f,w){const p=mix(neutral(f),crouch,.4);p.body[0]-=8;p.body[2]=-.08;p.nearArm=[93,81,.15];p.farArm=[149,86,.1];p.hair[2]=.05;if(w?.shape==='back'){p.body[2]=.12;p.body[0]+=10;}return p;}
 function attackSample(f){
  const a=f.attack,t=f.timer,windows=a.activeFrames,first=windows[0],last=windows.at(-1),start=a.startupFrames,idle=neutral(f),wind=windup(f,first),w=CombatData.activeWindow(a,t);let s;
  if(t<start){const age=Math.max(0,t-1),split=Math.max(1,(start-1)*.5);s={parts:age<=split?mix(idle,wind,age/split):mix(wind,strike(f,first),(age-split)/Math.max(1,start-1-split)),phase:'startup'};}
  else if(w)s={parts:strike(f,w),phase:'active'};
  else{const next=windows.find(v=>v.start>t),prior=windows.filter(v=>v.end<t).at(-1);if(next){const from=prior?.end??start-1,u=(t-from)/Math.max(1,next.start-from);s={parts:next.start-from<=5?mix(prior?strike(f,prior):wind,strike(f,next),u):u<.5?mix(prior?strike(f,prior):wind,wind,u*2):mix(wind,strike(f,next),(u-.5)*2),phase:'between'};}else{s={parts:mix(strike(f,last),idle,(t-(last?.end??start))/Math.max(1,a.totalFrames-(last?.end??start))),phase:'recovery'};}}
  if(a.tifaAerial&&a.escapeSide)s={parts:copy(jump),phase:'escape'};
  if(a.tifaAerial&&a.launched&&!w&&t<a.followEnd)s={parts:mix(strike(f,last),jump,(t-(last?.end??start))/8),phase:'followup'};
  // Keep the original stance exactly at the ends of a grounded motion.
  if(t===1)s.parts=idle;if(t>=a.totalFrames)s.parts=idle;
  return s;
 }
 function sample(f){
  if(f.attack)return attackSample(f);const t=Math.max(0,(f.stateFrame||1)-1),duration=Math.max(1,f.stateDuration||24);
  if(['LedgeCatch','LedgeHang'].includes(f.mode)){
   const p=key({body:[111,186,-.1],nearArm:[98,109,-1.3],farArm:[143,186,.3],near:[103,299,.25],far:[153,300,.15]}),sk=skeleton(p),tip=apply(sk.bones.nearHand,[110,68]),unit=FIGHTER_SCALE*BattleSize.art('tifa')*BattleSize.native('tifa',0)*MorphieRules.scale(f),dx=origin[0]+((f.ledge?.x??f.x)-f.x)*f.face/unit-tip[0],dy=origin[1]+((f.ledge?.y??f.y)-f.y)/unit-tip[1];
   for(const name of ['body','nearArm','farArm','near','far']){p[name][0]+=dx;p[name][1]+=dy;}return{parts:p,phase:'ledge'};
  }
  if(['Turn','RunTurn','RunBrake'].includes(f.mode))return{parts:mix(base,key({body:[106,134,-.1],nearArm:[88,95,.2],farArm:[160,96,.1]}),Math.sin(Math.PI*Math.min(1,t/duration))),phase:'turn'};
  if(['walk','run'].includes(f.state)){const run=f.state==='run',u=t*Math.PI*2/(run?20:34),s=Math.sin(u),c=Math.cos(u),p=key({body:[run?121:115,128+(1-Math.cos(2*u))*(run?3:1),run?.13:.025],near:[26+s*(run?33:18),251-Math.max(0,c)*(run?38:13),s*.17],far:[172-s*(run?33:18),253-Math.max(0,-c)*(run?38:13),-s*.17],nearArm:[100-s*(run?25:11),86+s*(run?21:10),s*.3],farArm:[157+s*(run?25:11),85-s*(run?20:10),-s*.3],hair:[0,0,-.025+s*.025]});return{parts:mix(base,p,t/4),phase:f.state};}
  if(f.mode==='JumpSquat')return{parts:mix(base,crouch,t/Math.max(1,duration-1)),phase:'jump-squat'};
  if(['jump','double'].includes(f.state))return{parts:mix(crouch,jump,(t+1)/5),phase:'jump'};
  if(f.state==='fall')return{parts:mix(jump,key({...jump,near:[44,238,.15],far:[177,236,-.1],hair:[0,0,.04]}),t/8),phase:'fall'};
  if(f.state==='land'||/Landing$/.test(f.mode))return{parts:mix(crouch,base,t/Math.max(4,duration)),phase:'landing'};
  if(f.state==='crouch')return{parts:mix(base,crouch,t/5),phase:'crouch'};
  if(f.state==='guard')return{parts:mix(base,key({body:[110,134,-.06],nearArm:[122,68,-.5],farArm:[130,68,.3]}),t/4),phase:'shield'};
  if(f.state==='dodge'){const u=Math.min(1,t/duration);return{parts:mix(base,crouch,Math.sin(Math.PI*u)),rotation:/Roll/.test(f.mode)?u*Math.PI*2:0,groundAnchor:f.grounded,phase:'dodge'};}
  if(['hit','caught','fly'].includes(f.state))return{parts:mix(base,hurt,t/3),rotation:f.state==='fly'?Math.sin(t*.13)*.18:0,phase:'hurt'};
  if(f.state==='down')return{parts:copy(crouch),rotation:-1.4*smooth(t/5),groundAnchor:true,phase:'down'};
  if(f.mode==='LedgeGetup')return{parts:mix(crouch,base,t/duration),groundAnchor:true,phase:'ledge-getup'};
  if(f.state==='getup')return{parts:mix(crouch,base,t/duration),rotation:-1.4*(1-smooth(t/duration)),groundAnchor:true,phase:'getup'};
  if(f.state==='grab'||f.state==='throw')return{parts:mix(base,key({body:[130,133,.1],nearArm:[180,98,-.3],farArm:[175,100,-.2]}),t/5),phase:f.state};
  return{parts:copy(base),phase:'idle'};
 }
 function matrix(from,to,angle){const c=Math.cos(angle),s=Math.sin(angle);return[c,s,-s,c,to[0]-c*from[0]+s*from[1],to[1]-s*from[0]-c*from[1]];}
 const apply=(m,p)=>[m[0]*p[0]+m[2]*p[1]+m[4],m[1]*p[0]+m[3]*p[1]+m[5]];
 function skeleton(p){const body=matrix(root,p.body,p.body[2]),bones={body,hair:matrix([99,49],apply(body,[99,49]),p.body[2]+p.hair[2])},joints={};for(const[n,r]of Object.entries(endpoints)){const b=leg(apply(body,r.hip),p[n],...lengths[n],r.bend);joints[n]=b;const prefix=n.endsWith('Arm')?n.slice(0,-3):n;for(const[name,a,z,ra,rz]of [[n+'Upper',b.hip,b.knee,r.hip,r.knee],[n+'Lower',b.knee,b.ankle,r.knee,r.ankle]])bones[name]=matrix(ra,a,Math.atan2(z[1]-a[1],z[0]-a[0])-Math.atan2(rz[1]-ra[1],rz[0]-ra[0]));bones[prefix+(n.endsWith('Arm')?'Hand':'Foot')]=matrix(r.ankle,b.ankle,p[n][2]+(n.endsWith('Arm')?p.body[2]*.2:0));}return{bones,joints};}
 const outlines={
  hair:[[106,5],[122,24],[108,52],[97,70],[89,105],[72,132],[23,149],[0,147],[0,80],[51,47],[88,28]],
  head:[[87,0],[155,0],[155,43],[141,56],[135,59],[137,65],[125,72],[114,65],[108,54],[94,54],[84,35]],
  body:[[91,57],[112,57],[141,62],[146,84],[147,97],[134,108],[131,120],[144,130],[154,155],[132,163],[112,161],[92,165],[75,157],[54,155],[72,132],[86,116],[91,100],[87,83]],
  nearArmUpper:[[89,57],[102,60],[98,78],[92,99],[82,109],[68,105],[70,87],[78,66]],
  nearArmLower:[[73,90],[87,88],[104,75],[115,78],[109,97],[92,111],[76,111],[68,103]],
  nearHand:[[94,63],[107,60],[121,66],[123,79],[115,92],[102,96],[90,84]],
  farArmUpper:[[139,62],[153,67],[165,84],[170,101],[164,110],[151,105],[147,90],[136,77]],
  farArmLower:[[150,77],[167,79],[173,101],[168,110],[154,106],[143,91]],
  farHand:[[143,55],[159,55],[168,68],[167,84],[153,87],[140,78]],
  nearUpper:[[71,160],[97,168],[91,178],[76,200],[65,211],[49,203],[55,187],[60,165]],
  nearLower:[[52,190],[73,199],[61,220],[35,250],[17,250],[17,234],[31,210]],
  nearFoot:[[14,231],[38,235],[35,251],[27,262],[30,283],[0,286],[0,267],[9,251]],
  farUpper:[[119,154],[144,151],[151,170],[167,194],[170,207],[152,214],[142,200],[128,180]],
  farLower:[[150,193],[169,193],[178,215],[180,241],[168,253],[153,236],[146,215]],
  farFoot:[[158,235],[180,233],[185,251],[194,264],[210,270],[210,286],[163,286],[159,267]]
 };
 const paths={};function path(n){if(paths[n])return paths[n];const p=new Path2D();outlines[n].forEach((q,i)=>p[i?'lineTo':'moveTo'](...q));p.closePath();return paths[n]=p;}
 const textures=new WeakMap();let groundBounds;
 function textureSet(image,under,arms){let result=textures.get(image);if(result)return result;result={};for(const n of Object.keys(outlines)){const c=document.createElement('canvas');c.width=210;c.height=286;const g=c.getContext('2d');g.save();g.clip(path(n));if(n==='body'){g.drawImage(under,0,0);g.save();const original=document.createElement('canvas');original.width=210;original.height=286;const o=original.getContext('2d');o.drawImage(image,0,0);o.globalCompositeOperation='destination-out';for(const k of ['nearArmUpper','nearArmLower','nearHand','farArmUpper','farArmLower','farHand'])o.fill(path(k));g.drawImage(original,0,0);g.restore();}else if(arms[n]){g.restore();g.drawImage(arms[n],0,0);result[n]=c;continue;}else{g.drawImage(image,0,0);if(n==='hair'||n==='head'){g.globalCompositeOperation='destination-out';for(const k of ['nearHand','farHand','nearArmUpper','farArmUpper'])g.fill(path(k));}}g.restore();result[n]=c;}textures.set(image,result);return result;}
 function bounds(set){if(groundBounds)return groundBounds;groundBounds={};for(const[n,c]of Object.entries(set)){const d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,210,286).data,points=[];for(let y=0;y<286;y++){let lo=210,hi=-1;for(let x=0;x<210;x++)if(d[(y*210+x)*4+3]>=8){lo=Math.min(lo,x);hi=x;}if(hi>=lo)points.push([lo,y],[hi+1,y+1]);}groundBounds[n]=points;}return groundBounds;}
 async function loadParts(frames){
  const image=new Image();image.src='characters/tifa/assets/tifa-rig-underpaint-v1.png';await image.decode();
  const canvas=()=>{const c=document.createElement('canvas');c.width=210;c.height=286;return c;},c=canvas();c.getContext('2d').drawImage(image,8,2,215,292.8);frames.push(c);
  // The generated utility pose supplies clean arm surfaces, free of the torso
  // pixels that overlap the original bent elbows. Normalize them ONCE to the
  // original shoulder/elbow/wrist lengths; runtime bones never stretch.
  const src={nearArm:{hip:[451,328],knee:[279,435],ankle:[166,529]},farArm:{hip:[682,338],knee:[808,433],ankle:[935,513]}},polys={
   nearArmUpper:[[417,282],[500,300],[468,365],[296,484],[233,445],[283,390]],
   nearArmLower:[[267,404],[313,454],[180,559],[123,517],[187,455]],
   nearHand:[[143,507],[200,539],[160,598],[105,626],[22,603],[25,547],[91,515]],
   farArmUpper:[[655,296],[704,294],[780,365],[843,418],[815,473],[757,444],[679,392]],
   farArmLower:[[792,402],[849,429],[966,496],[936,554],[877,527],[804,487]],
   farHand:[[932,490],[988,523],[1069,576],[1072,620],[1010,637],[961,604],[908,548]]
  };
  for(const name of ['nearArmUpper','nearArmLower','nearHand','farArmUpper','farArmLower','farHand']){
   const near=name.startsWith('near'),n=near?'nearArm':'farArm',r=endpoints[n],q=src[n],upper=name.endsWith('Upper'),from=upper?q.hip:q.knee,to=upper?q.knee:q.ankle,dfrom=upper?r.hip:r.knee,dto=upper?r.knee:r.ankle,angle=Math.atan2(dto[1]-dfrom[1],dto[0]-dfrom[0])-Math.atan2(to[1]-from[1],to[0]-from[0]),scale=name.endsWith("Hand")?.20:Math.hypot(dto[0]-dfrom[0],dto[1]-dfrom[1])/Math.hypot(to[0]-from[0],to[1]-from[1]),a=Math.cos(angle)*scale,b=Math.sin(angle)*scale,c=canvas(),g=c.getContext('2d');g.transform(a,b,-b,a,dfrom[0]-a*from[0]+b*from[1],dfrom[1]-b*from[0]-a*from[1]);g.beginPath();polys[name].forEach((p,i)=>g[i?'lineTo':'moveTo'](...p));g.closePath();g.clip();g.drawImage(image,0,0);frames.push(c);
  }
 }
 function draw(f,alpha=1,scale=1){
  const art=characterArt.tifa;if(!art?.frames[49])return false;const s=sample(f),p=s.parts,identity=!s.rotation&&JSON.stringify(p)===JSON.stringify(base);if(identity&&s.phase==='idle')return false;
  const images=art.tints[f.color||0],unit=FIGHTER_SCALE*BattleSize.art('tifa')*BattleSize.native('tifa',0)*MorphieRules.scale(f)*scale,sk=skeleton(p),set=textureSet(images[0],images[49],Object.fromEntries(['nearArmUpper','nearArmLower','nearHand','farArmUpper','farArmLower','farHand'].map((n,i)=>[n,images[50+i]])));
  ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.face*unit,unit);ctx.globalAlpha*=alpha;if(f.inv>0&&alpha===1)ctx.globalAlpha*=.64+Math.sin((f.stateFrame||0)*.5)*.24;ctx.translate(-origin[0],-origin[1]);
  if(identity){ctx.drawImage(images[0],0,0);ctx.restore();return true;}
  if(s.groundAnchor){const c=Math.cos(s.rotation||0),v=Math.sin(s.rotation||0),points=bounds(set);let bottom=-Infinity;for(const[n,ps]of Object.entries(points)){const b=sk.bones[n]||sk.bones.body;for(const q of ps){const z=apply(b,q);bottom=Math.max(bottom,root[1]+v*(z[0]-root[0])+c*(z[1]-root[1]));}}ctx.translate(0,origin[1]-bottom);}
  if(s.rotation){ctx.translate(...root);ctx.rotate(s.rotation);ctx.translate(-root[0],-root[1]);}
  const paint=n=>{ctx.save();ctx.transform(...(sk.bones[n]||sk.bones.body));ctx.drawImage(set[n],0,0);ctx.restore();};
  function limb(n){const j=sk.joints[n],isArm=n.endsWith('Arm'),prefix=isArm?n.slice(0,-3):n;ctx.save();ctx.fillStyle=isArm?'#49302c':'#29272c';ctx.beginPath();ctx.arc(...j.knee,isArm?4.5:7,0,Math.PI*2);ctx.fill();ctx.restore();paint(n+'Upper');paint(n+'Lower');paint(prefix+(isArm?'Hand':'Foot'));}
  paint('hair');limb('far');limb('farArm');paint('body');paint('head');limb('near');limb('nearArm');ctx.restore();return true;
 }
 return{base,origin,root,lengths,endpoints,outlines,sample,skeleton,apply,draw,loadParts};
})();
