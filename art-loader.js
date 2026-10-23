'use strict';
// Production sheets are segmented by .tools/build-art.cjs, never by the menu.
const ArtLoader=(()=>{
 let manifest=null,initializing=null;
 const raw=new URLSearchParams(location.search).has('rawArt');
 const images=new Map(),decodedImages=new Map(),portraits=new Map(),hudImages=new Map(),pendingLoads=new Map(),resident=new Map();
 // Physics needs native pose dimensions before a fighter's textures are resident.
 // These records are deliberately not drawable and keep hitbox sizing stable.
 function describe(id){const e=manifest?.characters[id];if(!e)return;const frames=e.frames.map(([, ,width,height])=>({width,height}));characterArt[id]={pending:true,frames,tints:Array(5).fill(frames),effects:e.effects.map(([, ,width,height])=>({width,height}))};}
 function family(id){return ['agumon','greymon','metalgreymon','wargreymon','omegamon'].includes(id)?['agumon','greymon','metalgreymon','wargreymon','omegamon']:['hanajs','hanajk','hanajd'].includes(id)?['hanajs','hanajk','hanajd']:[id];}
 function requests(players){const wanted=new Map();for(const p of players)for(const root of[p.character,...(Array.isArray(p.team)?p.team:[])])for(const id of family(root)){if(!manifest?.characters[id])continue;if(!wanted.has(id))wanted.set(id,new Set());wanted.get(id).add(Number(p.color)||0);}return wanted;}
 function prepared(players){if(!manifest)return true;return [...requests(players)].every(([id,colors])=>resident.has(id)&&[...colors].every(c=>resident.get(id).warmed.has(c)));}
 async function prepare(players){if(!manifest)return;for(const[id,colors]of requests(players)){await load(id);const r=resident.get(id),a=characterArt[id];for(const color of colors){if(r.warmed.has(color))continue;for(let n=0;n<a.frames.length;n++){void a.tints[color][n];if(n%8===7)await new Promise(resolve=>setTimeout(resolve,0));}for(const im of a.effects)void im;for(const im of r.extra)void im;const e=manifest.characters[id],portrait=e.selectionPortraits?.[color]||e.portraits?.[color];if(portrait)hudImages.set(portrait,await image(portrait));r.warmed.add(color);}}}
 function retain(players){if(!manifest)return;const keep=requests(players);for(const[id,r]of resident){if(keep.has(id))continue;for(const c of r.surfaces){c.width=c.height=1;}for(const url of r.urls){images.delete(url);decodedImages.delete(url);}resident.delete(id);describe(id);if(id==='dragoon'){spriteFrames=[];tints=[];}if(id==='isaac')IsaacVFX.loadFrames([]);}}
 async function image(url){
  if(!images.has(url))images.set(url,(async()=>{const img=new Image();img.src=url;await img.decode();decodedImages.set(url,img);return img;})().catch(e=>{images.delete(url);throw e;}));
  return images.get(url);
 }
 function cropped(sheet,rect){const [x,y,w,h]=rect,c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;}
 function lazy(count,make){const values=new Array(count);for(let n=0;n<count;n++)Object.defineProperty(values,n,{configurable:true,enumerable:true,get(){const value=make(n);Object.defineProperty(values,n,{configurable:true,enumerable:true,writable:true,value});return value;}});return values;}
 function tint(img,id,ci,palette){
  if(!ci)return img;
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
  const g=c.getContext('2d');g.drawImage(img,0,0);
  const data=g.getImageData(0,0,c.width,c.height),d=data.data;const zackMask=id==='zack'&&!palette?zackPaletteMask(d,c.width,c.height):null;const karateMask=id==='karateka'&&!palette?karatekaPaletteMask(d,c.width,c.height):null;
  const targets=id==='dragoon'?[[178,234,255],[62,72,98],[239,75,97],[67,151,241],[224,200,148]]:[[70,130,240],[65,54,99],[220,48,67],[49,195,173],[216,219,236]];
  const red=['okami','zero','lightning','rean','estelle','clive','makoto','ryza','noah','shiren','hunter','adol','pawapuro','goemon','jibanyan','dante','tifa'].includes(id),gold=['chocobo','nia','agumon','metabee'].includes(id);
  for(let p=0;p<d.length;p+=4){
   const r=d[p],green=d[p+1],b=d[p+2];
   if(id==='dragoon'){
    const y=Math.floor(p/4/c.width),blue=b>r*1.16&&b>green*1.02,neutral=Math.max(r,green,b)-Math.min(r,green,b)<26&&y>c.height*.37;
    if(blue||neutral){const amount=blue?.73:ci===1?.7:.32,lum=(r+green+b)/765;for(let k=0;k<3;k++)d[p+k]=d[p+k]+(targets[ci][k]*lum-d[p+k])*amount;}
   }else{
    const mask=palette?palette[p]===1:id==='layton'?(r>110&&r>green*1.8&&r>b*2&&green<140):id==='yuffie'?(green>r*1.3&&green>b*1.18&&green>40):id==='vincent'?(r>green*1.55&&r>b*1.3&&r>45):id==='kiryu'?(r>green*1.5&&r>b*1.2&&r>45):id==='crash'?(b>r*1.25&&b>green*1.15&&b>45):id==='charlotta'?(b>r*1.2&&b>green*1.05&&b>50):id==='ryofu'?(r>green*1.35&&r>b*1.3&&r>50):id==='mametchi'?(b>r*1.3&&b>green*1.15&&r<100):id==='piposaru'?(r>green*1.7&&r>b*1.5&&r>95):id==='twinbee'?(b>r*1.4&&b>green*1.15&&b>65):id==='aruru'?(b>r*1.35&&b>green*1.15&&b>75):id==='maruku'?(b>r*1.25&&b>green*1.25&&b>80):id==='dietrich'?(b>r*1.12&&b>green*1.18&&b>35):id==='edf'?(r>g*1.25&&r>b*1.5&&r>55):id==='edelgard'?(r>green*1.55&&r>b*1.4&&r>55):id==='guile'?(green>r*1.12&&green>b*1.2&&green>30):id==='sukapon'?(r>g*1.22&&b>g*1.15&&r>85):id==='pneuma'?(green>r*1.12&&b>r*1.08&&green>60):id==='arus'?(green>r*.78&&r>b*1.1&&green>b*1.2):id==='knight'?(b>r*1.2&&b>green*1.05&&r<120):id==='maelle'?(b>r*1.02&&b>green*1.01&&r>70):id==='sumino'?(r>green*1.35&&r>b*1.1):id==='rocbouquet'?(b>r*1.05&&b>green*1.05):id==='frog'?(green>r*1.12&&green>b*1.1):id==='tressa'?(green>r*1.08&&green>b*1.12):id==='eve'?(green>r*1.15&&green>b*1.08&&green>25):id==='odio'?(b>green*1.2&&r>green*1.2&&b>45):id==='laharl'?(r>green*1.5&&r>b*1.35&&r>50):id==='deemo'?(Math.max(r,green,b)<105&&Math.max(r,green,b)-Math.min(r,green,b)<26):id==='kasane'?(r>35&&r>green*1.5&&r>b*1.2):id==='shadow'?(r>65&&r>green*1.6&&r>b*1.3):id==='saki'?(r>100&&green>65&&r>green*1.1&&green>b*1.7&&b<110):id==='aerith'?(r>80&&r>green*1.5&&r>b*1.3):id==='doshin'?(r>100&&green>60&&r>green*1.05&&green>b*1.4&&b<150):id==='moogle'?(r>100&&r>green*1.4&&r>b*1.15):id==='greymon'?(r>100&&r>green*1.3&&green>b*1.2):id==='metalgreymon'?(r>100&&r>green*1.3&&green>b*1.2):id==='wargreymon'?(r>100&&r>green*1.3&&green>b*1.2):id==='omegamon'?(r>90&&r>green*1.5&&r>b*1.25):id==='donchan'?(r>110&&r>green*1.6&&r>b*1.5):id==='shizuna'?(b>r*1.08&&b>green*1.02&&b>60):id==='hanajs'?(r>60&&r>green*1.45&&r>b*1.15):id==='hanajk'?(r>60&&r>green*1.45&&r>b*1.15):id==='hanajd'?(r>60&&r>green*1.45&&r>b*1.15):id==='melia'?(r<120&&b>r*1.08&&b>green*1.15&&b>70):id==='hornet'?(r>green*1.3&&r>b*1.15&&r>50):id==='c4621'?(Math.min(r,green,b)>65&&Math.max(r,green,b)-Math.min(r,green,b)<55):id==='malenia'?(r>55&&r<135&&r>green*1.5&&r>b*1.4):id==='hayabusa'?(r<105&&green<105&&b<120&&Math.max(r,green,b)-Math.min(r,green,b)<35):id==='klonoa'?(b>60&&b>r*1.35&&b>green*1.1):id==='chibirobo'?(Math.max(r,green,b)-Math.min(r,green,b)<30&&Math.min(r,green,b)>70):id==='octoling'?(r>100&&r>green*1.7&&b>green*1.3):id==='viridi'?(r>70&&r>green*1.3&&b>green*1.1):id==='dana'?(b>65&&b>r*1.2&&b>green*.95):id==='zero3'?(r<85&&green<85&&b<85&&Math.max(r,green,b)-Math.min(r,green,b)<18):id==='rion'?(r>60&&r>green*1.3&&b>green*1.15):id==='judas'?(r>20&&b>green*1.4&&r>green*1.25&&b>r*1.05):id==='ash'?(r>55&&r>green*1.5&&r>b*1.2):id==='alphen'?(b>50&&b>r*1.2&&b>green*1.1):id==='ky'?(b>45&&b>r*1.25&&b>green*1.1):id==='zoe'?(r>145&&green>90&&b<120&&r>green*.98):id==='welch'?(b>60&&b>r*1.2&&b>green*1.05):id==='gran'?(b>70&&b>r*1.2&&b>green*1.04):id==='rena'?(b>45&&b>r*1.25&&b>green*1.08):id==='wonder'?(r>170&&green<90&&b<100&&r>green*2.4&&r>b*2.2):id==='narmaya'?(b>65&&b>r*.8&&r>green*1.12):id==='billy'?(r>110&&r>green*1.5&&r>b*1.45&&green<150&&b<155):id==='ellen'?(r>90&&r>green*1.45&&r>b*1.25&&green<140):id==='genis'?(b>80&&b>r*1.2&&b>green*1.08):id==='shionne'?(r>90&&r>green*1.35&&r>b*1.08&&green<140):id==='viewtifuljoe'?(r>100&&r>green*1.5&&r>b*1.35&&green<140):id==='sakura'?(r>90&&r>green*1.5&&r>b*1.1&&green<140):id==='arthur'?(r>45&&r<210&&green>50&&b>=r*.97&&b>=green*.98&&Math.max(r,green,b)-Math.min(r,green,b)<45):id==='onionknight'?((r>90&&r>green*1.45&&r>b*1.25)||(b>35&&b>r*1.5&&b>green*1.15)):id==='terra'?(r>70&&green<r*.65&&b<r*.78):id==='tidus'?(r>90&&green>75&&green>r*.66&&b<green*.3):id==='hachiware'?(r<170&&b>r*1.2&&b>green*1.05&&b>60):id==='presea'?(b>r*1.04&&b>green*1.12&&b>40):id==='zack'?!!zackMask[p/4]:id==='sol'?(r>65&&r>green*1.6&&r>b*1.35):id==='miyabi'?(b>45&&green>r*1.2&&b>r*1.15&&r<115):id==='riesz'?green>60&&green>r*1.15&&green>b*1.15:id==='edea'?r>70&&r>green*1.6&&r>b*1.35:id==='aiai'?(r>150&&green>45&&green<155&&r>green*1.4&&green>b*1.5&&b<90):id==='karateka'?!!karateMask[p/4]:id==='battlemage'?(r>70&&r>green*1.6&&r>b*1.2):id==='kurabe'?(Math.max(r,green,b)<180&&Math.min(r,green,b)>20&&Math.max(r,green,b)-Math.min(r,green,b)<18):id==='alucard'?(r>55&&r>green*1.6&&r>b*1.3):id==='kingbonby'?(b>r*1.15&&b>green*1.3&&r>30):id==='katamari'?(green>55&&green>r*1.25&&green>b*1.2):id==='toro'?(r>green*1.25&&r>b*1.25&&r>55):id==='cojicoji'?(r>green*2.4&&r>b*1.8&&r>70):id==='hinako'?(b>r*1.1&&b>green*1.03&&b>25):['ray','alain'].includes(id)?(b>r*1.2&&b>green*1.08&&b>40):id==='kisuke'?(green>r*1.25&&b>r*1.2&&green>45):id==='zidane'?(green>r*1.2&&b>r*1.2&&b>55):id==='miku'?(green>r*1.35&&b>r*1.2&&green>40):id==='nier'?(Math.max(r,green,b)<120&&Math.min(r,green,b)>15&&Math.max(r,green,b)-Math.min(r,green,b)<28):id==='bayleef'?bayleefTintMask(r,green,b):id==='elma'?(r>100&&r>green*1.6&&r>b*1.5):id==='kitten'?(Math.max(r,green,b)<90&&Math.min(r,green,b)>8&&Math.max(r,green,b)-Math.min(r,green,b)<25):id==='human'?(r>105&&green>105&&b>105&&Math.max(r,green,b)-Math.min(r,green,b)<32):id==='fei'?(green>r*1.14&&green>b*1.08&&green>25&&green<145):['akira','morphie'].includes(id)?(b>r*1.2&&b>green*1.1&&b>65):id==='chef'?(b>r*1.2&&b>green*1.15&&b>75):id==='horse'?(r>75&&r>green*1.2&&green>b*1.15&&green>35):id==='sakuna'?(r>90&&r>green*1.6&&r>b*1.5):id==='haseo'?(Math.max(r,green,b)<105&&Math.min(r,green,b)>25&&Math.max(r,green,b)-Math.min(r,green,b)<24):id==='terrarian'?(green>r*1.08&&green>b*1.1&&green>40&&green<180):id==='headmaster'?(r>140&&green>125&&b<green*.78&&green>r*.78):id==='pawapuro'?(r>110&&r>green*2.4&&r>b*1.6):id==='pokoa'?(r>50&&b>70&&b>green*1.3&&r>green*1.15):id==='midna'?(green>r*1.3&&b>r*1.3&&green>65):red?(r>90&&r>green*1.6&&r>b*1.5):['twob','noctis','narukami','naegi','luke','will','kosmos','fayt','emma'].includes(id)?(Math.max(r,green,b)<95&&d[p+3]>30):id==='monokuma'?(r>90&&r>green*1.6&&r>b*1.3):gold?(r>b*1.4&&green>b*1.35&&green>75&&(id!=='metabee'||r>green*.85)&&(id!=='agumon'||r>green*1.1)):(b>r*1.2&&b>green*1.08);
    if(mask){const sum=palette?palette[p+1]+palette[p+2]*256:r+green+b,lum=(['twob','noctis','narukami','naegi','luke','will','kosmos','fayt','emma'].includes(id)?.35:0)+sum/500;for(let k=0;k<3;k++)d[p+k]=Math.min(255,targets[ci][k]*lum);}
   }
  }
  g.putImageData(data,0,0);return c;
 }
 async function init(){
  if(raw)return false;
  if(!initializing)initializing=(async()=>{
   try{const res=await fetch('assets/ready/manifest.json');if(!res.ok)return false;manifest=await res.json();if(manifest.version!==1){manifest=null;return false;}}
   catch{manifest=null;return false;}
   for(const id of Object.keys(manifest.characters))describe(id);
   Roster.artReady();
   // Give small selection portraits priority over full combat textures.
   try{await Promise.all(Roster.definitions.map(d=>thumbnail(d.id)?.src||portrait(d.id,0,d.pose,true)).filter(Boolean).map(url=>image(url)));}
   catch{/* A failed thumbnail must not trigger parsing every full source sheet. */}
   return true;
  })();
  return initializing;
 }
 function load(id){
  if(resident.has(id))return Promise.resolve(true);
  if(pendingLoads.has(id))return pendingLoads.get(id);
  const promise=loadCharacter(id).finally(()=>pendingLoads.delete(id));pendingLoads.set(id,promise);return promise;
 }
 async function loadCharacter(id){
  const entry=manifest?.characters[id];if(!entry)return false;
  const [sheet,paletteSheet]=await Promise.all([image(entry.image),entry.palette?image(entry.palette):null]);
  const surfaces=new Set(),track=c=>{surfaces.add(c);return c;};
  const frames=lazy(entry.frames.length,n=>track(cropped(sheet,entry.frames[n])));
  const palettes=lazy(frames.length,n=>{if(!paletteSheet)return null;const [x,y,w,h]=entry.frames[n],c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(paletteSheet,x,y,w,h,0,0,w,h);return g.getImageData(0,0,w,h).data;});
  const variants=Array.from({length:5},(_,ci)=>ci?lazy(frames.length,n=>['goemon','metabee','nier','miku','naruhodo','jibanyan','layton'].includes(id)&&n>=40&&n<43?frames[n]:['headmaster','sakuna','haseo','terrarian','horse','chef','akira','morphie','human','kitten','elma'].includes(id)&&n>=(id==='elma'?56:40)&&!(id==='kitten'&&n===43||id==='elma'&&n===59)?frames[n]:track(tint(frames[n],id,ci,palettes[n]))):frames);
  characterArt[id]={frames,tints:variants,effects:lazy(entry.effects.length,n=>track(cropped(sheet,entry.effects[n])))};
  const extra=lazy(entry.isaacVfx?.length||0,n=>track(cropped(sheet,entry.isaacVfx[n])));
  resident.set(id,{urls:[entry.image,entry.palette].filter(Boolean),surfaces,extra,warmed:new Set()});
  if(id==='dragoon'){spriteFrames=frames;tints=variants;}
  if(id==='isaac')IsaacVFX.loadFrames(extra);
  return true;
 }
 // Face/upper-body framing is authored per fighter; weapons never decide zoom.
 // [head center X / source width, crop top / source height, crop height / height].
 const framing={
  dragoon:[.32,.01,.48],isaac:[.55,0,.40],ulgrim:[.58,0,.31],chiikawa:[.34,.08,.67],chocobo:[.63,.04,.55],monokuma:[.53,0,.61],riki:[.66,.31,.55],
  roxas:[.48,0,.32],twob:[.50,0,.32],okami:[.82,.02,.50],gundam:[.49,0,.37],vivi:[.60,.03,.57],zero:[.70,0,.38],rin:[.67,0,.33],
  nia:[.57,0,.42],lightning:[.68,0,.32],colette:[.57,0,.36],rean:[.66,0,.32],estelle:[.59,0,.39],noctis:[.59,0,.31],clive:[.66,0,.32],
  makoto:[.68,0,.32],neku:[.56,0,.37],narukami:[.69,0,.32],naegi:[.61,0,.32],rex:[.55,0,.35],luke:[.63,0,.34],will:[.68,0,.32],
  kosmos:[.56,0,.37],fayt:[.60,0,.34],emma:[.60,0,.42],ryza:[.65,0,.41],noah:[.55,0,.33],midna:[.68,.10,.56],bomberman:[.51,.09,.59],
  sans:[.44,0,.62],lloyd:[.50,0,.35],shiren:[.55,0,.52],pokoa:[.50,.02,.69],hunter:[.59,0,.38],adol:[.59,0,.33],terry:[.60,0,.61],
  valkyrie:[.60,0,.39],agumon:[.60,0,.63],pawapuro:[.54,0,.62],headmaster:[.57,0,.53],sakuna:[.60,.13,.55],haseo:[.60,.03,.43],terrarian:[.50,0,.48],
  // These six portraits already contain only the head and shoulders. Keep their
  // full height; cropping them a second time removes the shoulders.
  layton:[.45,.25,.70],miku:[.50,0,1.00],jibanyan:[.61,.08,.68],naruhodo:[.50,0,1.00],nier:[.50,0,1.00],metabee:[.54,.12,.65],bayleef:[.57,0,.70],goemon:[.50,0,1.00],elma:[.50,0,1.00],kitten:[.50,0,1.00],human:[.5,0,.55],fei:[.60,0,.35],horse:[.66,0,.60],chef:[.44,.10,.65],akira:[.53,0,.33],morphie:[.57,0,.39]
 };
 function selectionCrop(img,id){
  const [x,top,height]=framing[id]||[.5,0,.38],h=Math.round(img.height*height),w=Math.round(h*1.4);
  return[Math.round(img.width*x-w/2),Math.round(img.height*top),w,h];
 }
 function portraitCanvas(img,id){
  const [x,y,w,h]=selectionCrop(img,id),c=document.createElement('canvas');c.width=w;c.height=h;
  // Copy native pixels exactly, retaining alpha and leaving out the legs.
  c.getContext('2d').drawImage(img,-x,-y);return c;
 }
 function portrait(id,color,pose,selection=false){
  const entry=manifest?.characters[id],baked=(selection?entry?.selectionPortraits||entry?.portraits:entry?.portraits)?.[color];if(baked&&(pose===0||pose===(entry.portraitPose??0))){if(selection)hudPortrait(id,color);return baked;}
  if(!loaded||characterArt[id]?.pending)return null;
  const key=id+':'+color+':'+pose+':'+selection;
  if(!portraits.has(key)){const img=spriteFor({characterId:id,color},pose);if(img)portraits.set(key,(selection?portraitCanvas(img,id):img).toDataURL());}
  return portraits.get(key);
 }
 function hudPortrait(id,color=0){
  const entry=manifest?.characters[id],url=entry?.selectionPortraits?.[color]||entry?.portraits?.[color];
  if(url){if(!hudImages.has(url)){hudImages.set(url,null);image(url).then(img=>hudImages.set(url,img)).catch(()=>hudImages.delete(url));}return hudImages.get(url)||decodedImages.get(thumbnail(id,color)?.src);}
  const key=id+':'+color;if(!hudImages.has(key)){const img=spriteFor({characterId:id,color},entry?.portraitPose??0);if(img)hudImages.set(key,portraitCanvas(img,id));}return hudImages.get(key);
 }
 async function platform(){return manifest?.platform?image(manifest.platform):null;}
 function thumbnail(id,color=0){const levels=manifest?.characters[id]?.selectionThumbnails;if(!levels?.length)return null;return{src:levels[0].urls[color],srcset:levels.map(level=>level.urls[color]+' '+level.width+'w').join(', '),aspect:levels[0].width/levels[0].height};}
 return{init,load,prepare,prepared,retain,platform,portrait,hudPortrait,thumbnail,portraitCanvas,selectionCrop,tint,get enabled(){return!!manifest},get raw(){return raw},get diagnostics(){return{resident:[...resident.keys()],warmed:[...resident].map(([id,r])=>({id,colors:[...r.warmed]})),surfaces:[...resident.values()].reduce((n,r)=>n+r.surfaces.size,0)};}};
})();
