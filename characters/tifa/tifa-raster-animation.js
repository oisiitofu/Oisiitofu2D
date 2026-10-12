'use strict';
// Whole painted frames only. Logical poses, attack clocks and collision data stay
// in tifa-data.js; these extra visual poses never enter the simulation or Net.
const TifaRasterAnimation=(()=>{
 const sources=[
  ['arsenal-jab',3,1,[0,1,2]],['arsenal-highkick',3,1,[0,1,2]],
  ['arsenal-backkick',3,1,[0,1,2]],['arsenal-knee',3,1,[0,1,2]],
  ['arsenal-heel',3,1,[0,1,2]],['arsenal-ground',4,3,[1,2,3,5,6,7,9,10,11]],
  ['locomotion',4,2,[0,1,2,3,4,5,6,7]],['reaction',3,3,[0,1,2,3,4,5,6,7,8]],
  ['walk-cycle',4,2,[0,1,2,3,4,5,6,7]],['run-cycle',4,2,[0,1,2,3,4,5,6,7]]
 ];
 const tracks={punch:{end:42,mids:[49,50,51]},high:{end:43,mids:[52,53,54]},
  back:{end:44,mids:[55,56,57]},knee:{end:46,mids:[58,59,60]},
  heel:{start:41,end:45,mids:[61,62,63]},tackle:{end:9,mids:[64,65,66]},
  low:{end:11,mids:[67,68,69]},forward:{end:13,mids:[70,71,72]},
  grab:{end:17,mids:[81,82,83]},guard:{end:20,mids:[84,85,86]},hit:{end:21,mids:[87,88,89]}};
 const families={6:'punch',7:'punch',8:'high',9:'tackle',10:'knee',11:'low',12:'knee',13:'forward',14:'back',15:'high',16:'heel',17:'grab',18:'grab',41:'knee',42:'punch',43:'high',44:'back',45:'heel',46:'knee'};
 // Relative to the untouched arsenal standing sprite. Uniform scale only:
 // bent poses keep their head/body dimensions instead of being fitted to a height.
 const sizes=[...Array(3).fill(.65),...Array(3).fill(.65),...Array(3).fill(.65),
  ...Array(3).fill(.65),...Array(3).fill(.65),...Array(9).fill(1.28),
  .9448,.9576,.9626,.9610, .9585,.9519,.9638,.9832,...Array(9).fill(1.26),
  ...Array(16).fill(.90)];
 const roots=[.5,.5,.5, .42,.42,.42, .69,.69,.69, .47,.47,.47,
  .5,.5,.5, .52,.52,.52, .5,.5,.5, .5,.5,.5,
  .56,.56,.56,.56, .60,.60,.60,.60, .48,.48,.48, .5,.5,.5, .52,.52,.52,
  ...Array(8).fill(.60),...Array(8).fill(.60)];
 async function append(art){
  if(art.frames.length!==49)return; // Production already contains baked middles.
  for(const [name,cols,rows,indices]of sources){const sheet=new Image();sheet.src='characters/tifa/assets/tifa-'+name+(name.endsWith('-cycle')?'-v2.png':'-inbetweens-v1.png');await sheet.decode();
   const cells=extractAtlas(sheet,cols,rows,'alpha');
   for(const n of indices){if(!cells[n]||cells[n].width<20||cells[n].height<20)throw Error('Missing Tifa raster '+name+':'+n);art.frames.push(cells[n]);}
  }
  art.tints=Array.from({length:5},(_,ci)=>art.frames.map(img=>ArtLoader.tint(img,'tifa',ci)));
 }
 function step(track,p){if(p<=0)return track.start??40;if(p>=1)return track.end;return track.mids[Math.min(2,Math.floor(p*3))];}
 function family(n){return tracks[families[n]];}
 function sample(f){
  if(['LedgeCatch','LedgeHang','LedgeGetup'].includes(f.mode)||['ledge','getup','down','caught'].includes(f.state))return null;
  const a=f.attack,t=f.timer;
  if(a){
   if(a.tifaKi)return {pose:t<24?step(tracks.guard,Math.min(.99,t/24)):40};
   const windows=a.activeFrames||[],active=windows.find(w=>t>=w.start&&t<=w.end);
   const next=windows.find(w=>w.start>t),prior=windows.filter(w=>w.end<t).at(-1);
   let track=family(active?.pose??next?.pose??prior?.pose??a.pose);
   if(!track)return null;
   let p;
   if(a.hold)p=.30;
   else if(active)p=1;
   else if(next){const begin=prior?.end??0,gap=next.start-begin;
    if(prior&&t-begin<=Math.floor(gap/2)){track=family(prior.pose)??track;p=1-(t-begin)/Math.max(1,Math.floor(gap/2));}
    else{const start=prior?begin+Math.floor(gap/2):1;p=(t-start)/Math.max(1,next.start-start);}
   }else if(prior)p=1-Math.max(0,t-prior.end-1)/Math.max(1,a.totalFrames-prior.end-1);
   else p=Math.min(1,t/Math.max(1,a.startupFrames));
   return {pose:step(track,p),family:families[track.end]||track.end,progress:p};
  }
  const s=Math.max(0,(f.stateFrame||1)-1);
  if(f.state==='idle')return{pose:40};
  if(f.state==='walk'||f.state==='run'){const run=f.state==='run',part=Math.floor(s/(run?2:4))%8;return{pose:(run?98:90)+part};}
  if(f.state==='guard')return{pose:s<3?tracks.guard.mids[s]:20};
  if(f.state==='hit'||f.state==='fly')return{pose:s<3?tracks.hit.mids[s]:21};
  if(f.mode==='JumpSquat'||f.state==='crouch')return{pose:s<2?tracks.low.mids[s]:f.mode==='JumpSquat'?32:3};
  if(f.state==='jump')return{pose:s<2?tracks.knee.mids[s]:33};
  return{pose:pose(f)};
 }
 function placement(f,n){
  if(n>=90){const img=characterArt.tifa.frames[n],run=n>=98,i=n-(run?98:90),unit=BattleSize.native('tifa',n),
   chest=run?[266.187,221.536,280.884,241.940,265.683,219.945,281.041,241.905]:[223.580,214.848,217.695,210.540,222.750,214.104,215.137,216.222],
   ref=run?28:24,refOffset=run?205.657-275*.60:141.420-209*.56;
   // Cropping widths change as the boots pass. Anchor the torso, not a fraction
   // of each frame's silhouette width. Every frame remains a single intact image.
   return{unit,root:(chest[i]-refOffset*BattleSize.native('tifa',ref)/unit)/img.width,floor:img.height-3};
  }
  if(n>=49){const img=characterArt.tifa.frames[n],i=n-49;return{unit:BattleSize.native('tifa',n),root:roots[i],floor:img.height-3};}
  const originalRoots={9:.52,13:.5,17:.48,20:.5,21:.52,24:.56,25:.56,26:.56,27:.56,28:.60,29:.60,30:.60,31:.60,34:.53,35:.60,40:.5,42:.5},size={20:1.08,21:1.10};
  return{unit:BattleSize.native('tifa',n)*(size[n]??1),root:originalRoots[n]??NewcomerArtAnchors.tifa[n]??.5,floor:characterArt.tifa.frames[n].height-BattleSize.baseline(f,n)};
 }
 function drawFrame(f,n,alpha=1,scale=1){
  const img=spriteFor(f,n);if(!img)return false;
  const p=placement(f,n);ctx.save();ctx.globalAlpha*=alpha;ctx.imageSmoothingEnabled=true;
  ctx.translate(f.x,f.y);const unit=scale*FIGHTER_SCALE*MorphieRules.scale(f)*BattleSize.art('tifa')*p.unit;
  ctx.scale(f.face*unit,unit);
  if(f.inv>0&&alpha===1)ctx.globalAlpha*=.64+Math.sin(frame*.5)*.24;
  // A single intact raster, no rotation, squash, crossfade or body-part transform.
  ctx.drawImage(img,-img.width*p.root,-p.floor,img.width,img.height);ctx.restore();return true;
 }
 function draw(f,alpha,scale){const v=sample(f);return v?drawFrame(f,v.pose,alpha,scale):false;}
 function native(n){return BattleSize.native('tifa',40)*sizes[n-49];}
 // Contacts measured on the DISPLAYED full sprite, not the old logical pose.
 // Same root, floor and uniform scale as drawFrame; no simulation mutation.
 const contacts={9:[.66,.43,.95,.30],11:[.53,.69,.975,.80],13:[.59,.57,.98,.60],
  17:[.65,.34,.97,.23],42:[.62,.25,.98,.22],43:[.65,.58,.91,.035],
  44:[.61,.48,.025,.26],45:[.57,.63,.89,.97],46:[.58,.64,.83,.45]};
 function strike(f){const v=sample(f),n=v?.pose,p=contacts[n];if(!p)return null;
  const im=characterArt.tifa.frames[n],pl=placement(f,n),s=FIGHTER_SCALE*MorphieRules.scale(f)*BattleSize.art('tifa')*pl.unit;
  const point=(x,y)=>({x:f.x+(x-pl.root)*im.width*s*f.face,y:f.y+(y*im.height-pl.floor)*s});
  return{pose:n,from:point(p[0],p[1]),to:point(p[2],p[3])};
 }
 return{append,sample,placement,draw,drawFrame,native,tracks,strike,contacts,sourceCount:57};
})();
