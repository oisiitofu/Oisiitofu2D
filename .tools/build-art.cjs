// Bake the existing production art once, instead of segmenting it in every browser.
// Run from the project root with the game server running: node .tools/build-art.cjs
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const sharp=require('sharp');
const {bakeThumbnails}=require('./selection-thumbnails.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets','ready');
const selectionSourcesPath=path.join(__dirname,'selection-portrait-sources.json');
const selectionSources=fs.existsSync(selectionSourcesPath)?JSON.parse(fs.readFileSync(selectionSourcesPath,'utf8')):{};
const hash=data=>crypto.createHash('sha256').update(data).digest('hex').slice(0,16);
async function save(name,data,webp=false){let bytes=Buffer.from(data.split(',')[1],'base64');if(webp)bytes=await sharp(bytes).webp({lossless:true,effort:4}).toBuffer();const file=name+'-'+hash(bytes)+(webp?'.webp':'.png');fs.writeFileSync(path.join(out,file),bytes);return 'assets/ready/'+file;}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 if(process.env.ART_THUMBNAILS_ONLY==='1'){
  const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8')),ids=process.env.ART_IDS?.split(',').filter(Boolean)||Object.keys(manifest.characters);
  for(const id of ids){if(!manifest.characters[id])throw Error('Unknown ART_IDS character');manifest.characters[id].selectionThumbnails=await bakeThumbnails(root,id,manifest.characters[id]);}
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest));console.log(JSON.stringify({thumbnailCharacters:ids.length,output:out}));return;
 }
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const portraitsOnly=process.env.ART_PORTRAITS_ONLY==='1',requested=process.env.ART_IDS?.split(',').filter(Boolean),began=Date.now();
  // A framing-only bake copies the existing lossless native frames. It does not
  // need to parse source sheets or rebuild full-body portraits/combat textures.
  // Incremental bakes parse only the requested source art. Keep other fighters
  // on their existing baked assets, including their exact palette checksums.
  if(requested&&!portraitsOnly){const existing=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));for(const id of requested)delete existing.characters[id];await page.route('**/assets/ready/manifest.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(existing)}));}
  await page.goto((process.env.GAME_URL||'http://localhost:4173')+'/'+(portraitsOnly||requested?'':'?rawArt=1'),{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.AstralEdge?.assetsLoaded,null,{timeout:180000});
  const baselineMs=Date.now()-began;
  const ids=await page.evaluate(()=>Roster.definitions.map(d=>d.id));
  if(requested?.some(id=>!ids.includes(id)))throw Error('Unknown ART_IDS character');
  const manifest=requested||portraitsOnly?JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8')):{version:1,characters:{},baselineMs};
  if(manifest.version!==1)throw Error('Cannot incrementally bake an incompatible manifest');
  for(const id of requested||ids){
   const entry=await page.evaluate(async ({id,portraitsOnly,selectionSource})=>{
    if(ArtLoader.enabled&&!await ArtLoader.load(id)){if(id==='dragoon')await loadRaw();else await loadIsaacArt(id);}
    const art=characterArt[id],items=[...art.frames,...(art.effects||[])];
    const pose=Roster.definitions.find(d=>d.id===id).pose;
    const portraits=portraitsOnly?null:art.tints.map(v=>v[pose].toDataURL());
    let selectionPortraits,selectionCrop,selectionMetadata={};
    if(selectionSource){
     const image=new Image();image.src=selectionSource.source;await image.decode();
     selectionCrop=selectionSource.crop||[0,0,image.width,image.height];
     const [x,y,w,h]=selectionCrop;
     selectionPortraits=Array.from({length:5},(_,color)=>{
      const tinted=ArtLoader.tint(image,id,color),canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
      canvas.getContext('2d').drawImage(tinted,-x,-y);return canvas.toDataURL();
     });
     selectionMetadata={selectionKind:'dedicated',selectionSource:selectionSource.source};
    }else{
     selectionPortraits=art.tints.map(v=>ArtLoader.portraitCanvas(v[pose],id).toDataURL());
     selectionCrop=ArtLoader.selectionCrop(art.frames[pose],id);
    }
    if(portraitsOnly)return{portraits,selectionPortraits,selectionCrop,...selectionMetadata};
    let extra=[];
    if(id==='isaac'){
     const sheet=new Image();sheet.src='characters/isaac/assets/isaac-effects.png';await sheet.decode();
     extra=Array.from({length:8},(_,n)=>{const c=document.createElement('canvas');c.width=sheet.width/4;c.height=sheet.height/2;c.getContext('2d').drawImage(sheet,n%4*c.width,Math.floor(n/4)*c.height,c.width,c.height,0,0,c.width,c.height);return c;});
     items.push(...extra);
    }
    // Integer rectangles, transparent gutters, no scaling or lossy compression.
    const width=Math.max(2048,...items.map(c=>c.width+4));
    let x=2,y=2,row=0;const rects=[];
    for(const c of items){if(x+c.width+2>width){x=2;y+=row+4;row=0;}rects.push([x,y,c.width,c.height]);x+=c.width+4;row=Math.max(row,c.height);}
    const packed=document.createElement('canvas');packed.width=width;packed.height=y+row+2;
    const g=packed.getContext('2d');items.forEach((c,n)=>g.drawImage(c,rects[n][0],rects[n][1]));
    // Keep the original palette masks and luminance. Recomputing a color threshold
    // after PNG/WebP premultiplication can change individual antialiased pixels.
    const palette=document.createElement('canvas');palette.width=packed.width;palette.height=packed.height;
    const pg=palette.getContext('2d'),red=['okami','zero','lightning','rean','estelle','clive','makoto','ryza','noah','shiren','hunter','adol','pawapuro','goemon','jibanyan','dante','tifa'].includes(id),gold=['chocobo','nia','agumon','metabee'].includes(id);
    if(id!=='dragoon')art.frames.forEach((img,n)=>{if(['goemon','metabee','nier','miku','naruhodo','jibanyan','layton'].includes(id)&&n>=40&&n<43)return;if(['headmaster','sakuna','haseo','terrarian','horse','chef','akira','morphie','human','kitten','elma'].includes(id)&&n>=(id==='elma'?56:40)&&!(id==='kitten'&&n===43||id==='elma'&&n===59))return;
     const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);
     const d=g.getImageData(0,0,c.width,c.height).data,map=pg.createImageData(c.width,c.height);const zackMask=id==='zack'?zackPaletteMask(d,c.width,c.height):null;const karateMask=id==='karateka'?karatekaPaletteMask(d,c.width,c.height):null;
     for(let p=0;p<d.length;p+=4){const r=d[p],green=d[p+1],b=d[p+2],mask=id==='layton'?(r>110&&r>green*1.8&&r>b*2&&green<140):id==='yuffie'?(green>r*1.3&&green>b*1.18&&green>40):id==='vincent'?(r>green*1.55&&r>b*1.3&&r>45):id==='kiryu'?(r>green*1.5&&r>b*1.2&&r>45):id==='crash'?(b>r*1.25&&b>green*1.15&&b>45):id==='charlotta'?(b>r*1.2&&b>green*1.05&&b>50):id==='ryofu'?(r>green*1.35&&r>b*1.3&&r>50):id==='mametchi'?(b>r*1.3&&b>green*1.15&&r<100):id==='piposaru'?(r>green*1.7&&r>b*1.5&&r>95):id==='twinbee'?(b>r*1.4&&b>green*1.15&&b>65):id==='aruru'?(b>r*1.35&&b>green*1.15&&b>75):id==='maruku'?(b>r*1.25&&b>green*1.25&&b>80):id==='dietrich'?(b>r*1.12&&b>green*1.18&&b>35):id==='edf'?(r>g*1.25&&r>b*1.5&&r>55):id==='edelgard'?(r>green*1.55&&r>b*1.4&&r>55):id==='guile'?(green>r*1.12&&green>b*1.2&&green>30):id==='sukapon'?(n>=49?r>green*1.22&&b>green*1.15&&r>85:r>g*1.22&&b>g*1.15&&r>85):id==='pneuma'?(green>r*1.12&&b>r*1.08&&green>60):id==='arus'?(green>r*.78&&r>b*1.1&&green>b*1.2):id==='knight'?(b>r*1.2&&b>green*1.05&&r<120):id==='maelle'?(b>r*1.02&&b>green*1.01&&r>70):id==='sumino'?(r>green*1.35&&r>b*1.1):id==='rocbouquet'?(b>r*1.05&&b>green*1.05):id==='frog'?(green>r*1.12&&green>b*1.1):id==='tressa'?(green>r*1.08&&green>b*1.12):id==='eve'?(green>r*1.15&&green>b*1.08&&green>25):id==='odio'?(b>green*1.2&&r>green*1.2&&b>45):id==='laharl'?(r>green*1.5&&r>b*1.35&&r>50):id==='deemo'?(Math.max(r,green,b)<105&&Math.max(r,green,b)-Math.min(r,green,b)<26):id==='kasane'?(r>35&&r>green*1.5&&r>b*1.2):id==='shadow'?(r>65&&r>green*1.6&&r>b*1.3):id==='saki'?(r>100&&green>65&&r>green*1.1&&green>b*1.7&&b<110):id==='aerith'?(r>80&&r>green*1.5&&r>b*1.3):id==='doshin'?(r>100&&green>60&&r>green*1.05&&green>b*1.4&&b<150):id==='moogle'?(r>100&&r>green*1.4&&r>b*1.15):id==='greymon'?(r>100&&r>green*1.3&&green>b*1.2):id==='metalgreymon'?(r>100&&r>green*1.3&&green>b*1.2):id==='wargreymon'?(r>100&&r>green*1.3&&green>b*1.2):id==='omegamon'?(r>90&&r>green*1.5&&r>b*1.25):id==='donchan'?(r>110&&r>green*1.6&&r>b*1.5):id==='shizuna'?(b>r*1.08&&b>green*1.02&&b>60):id==='hanajs'?(r>60&&r>green*1.45&&r>b*1.15):id==='hanajk'?(r>60&&r>green*1.45&&r>b*1.15):id==='hanajd'?(r>60&&r>green*1.45&&r>b*1.15):id==='melia'?(r<120&&b>r*1.08&&b>green*1.15&&b>70):id==='hornet'?(r>green*1.3&&r>b*1.15&&r>50):id==='c4621'?(Math.min(r,green,b)>65&&Math.max(r,green,b)-Math.min(r,green,b)<55):id==='malenia'?(r>55&&r<135&&r>green*1.5&&r>b*1.4):id==='hayabusa'?(r<105&&green<105&&b<120&&Math.max(r,green,b)-Math.min(r,green,b)<35):id==='klonoa'?(b>60&&b>r*1.35&&b>green*1.1):id==='chibirobo'?(Math.max(r,green,b)-Math.min(r,green,b)<30&&Math.min(r,green,b)>70):id==='octoling'?(r>100&&r>green*1.7&&b>green*1.3):id==='viridi'?(r>70&&r>green*1.3&&b>green*1.1):id==='dana'?(b>65&&b>r*1.2&&b>green*.95):id==='zero3'?(r<85&&green<85&&b<85&&Math.max(r,green,b)-Math.min(r,green,b)<18):id==='rion'?(r>60&&r>green*1.3&&b>green*1.15):id==='judas'?(r>20&&b>green*1.4&&r>green*1.25&&b>r*1.05):id==='ash'?(r>55&&r>green*1.5&&r>b*1.2):id==='alphen'?(b>50&&b>r*1.2&&b>green*1.1):id==='ky'?(b>45&&b>r*1.25&&b>green*1.1):id==='zoe'?(r>145&&green>90&&b<120&&r>green*.98):id==='welch'?(b>60&&b>r*1.2&&b>green*1.05):id==='gran'?(b>70&&b>r*1.2&&b>green*1.04):id==='rena'?(b>45&&b>r*1.25&&b>green*1.08):id==='wonder'?(r>170&&green<90&&b<100&&r>green*2.4&&r>b*2.2):id==='narmaya'?(b>65&&b>r*.8&&r>green*1.12):id==='billy'?(r>110&&r>green*1.5&&r>b*1.45&&green<150&&b<155):id==='ellen'?(r>90&&r>green*1.45&&r>b*1.25&&green<140):id==='genis'?(b>80&&b>r*1.2&&b>green*1.08):id==='shionne'?(r>90&&r>green*1.35&&r>b*1.08&&green<140):id==='viewtifuljoe'?(r>100&&r>green*1.5&&r>b*1.35&&green<140):id==='sakura'?(r>90&&r>green*1.5&&r>b*1.1&&green<140):id==='arthur'?(r>45&&r<210&&green>50&&b>=r*.97&&b>=green*.98&&Math.max(r,green,b)-Math.min(r,green,b)<45):id==='onionknight'?((r>90&&r>green*1.45&&r>b*1.25)||(b>35&&b>r*1.5&&b>green*1.15)):id==='terra'?(r>70&&green<r*.65&&b<r*.78):id==='tidus'?(r>90&&green>75&&green>r*.66&&b<green*.3):id==='hachiware'?(r<170&&b>r*1.2&&b>green*1.05&&b>60):id==='presea'?(b>r*1.04&&b>green*1.12&&b>40):id==='zack'?!!zackMask[p/4]:id==='reimu'?(r>green*1.45&&r>b*1.3&&r>80&&(p/4/img.width)>img.height*.34):id==='jett'?(b>r*1.2&&green>r*1.15&&b>55):id==='octane'?(green>r*.92&&green>b*1.3&&green>45):id==='parappa'?(b>r*1.3&&b>green*1.1&&b>45):id==='sam'?(b>r*1.15&&b>green*1.05&&b>30):id==='enoch'?(b>r*1.1&&b>green*1.03&&b>35):id==='astro'?(b>r*1.3&&b>green*1.15&&b>80):id==='ratchet'?(b>r*1.1&&b>green*.95&&b>35):id==='django'?(r>green*1.6&&r>b*1.4&&r>75):id==='etna'?(r>green*1.45&&r>b*1.2&&r>65):id==='tails'?(r>130&&green>75&&green>r*.4&&b<green*.65):id==='nahobino'?(b>r*1.6&&b>green*1.15&&b>50):id==='ryoku'?(green>r*.8&&green>b*1.45&&green>70):id==='lip'?(r>green*1.6&&r>b*.95&&r>90):id==='ashley'?(r>green*1.6&&r>b*.95&&r>90):id==='veronica'?(r>green*1.6&&r>b*.95&&r>90):id==='mallow'?(green>r*1.4&&b>r*1.4&&green>50):id==='estark'?(r>green*1.1&&green>b*1.25&&green>50):id==='qbby'?(r>170&&green>170&&b>170):id==='ringfit'?(r>145&&green>50&&green<r*.8&&b<green*.85):id==='elza'?(r>125&&green>115&&b>95&&Math.max(r,green,b)-Math.min(r,green,b)<75):id==='nightraven'?(b>r*1.12&&b>green*1.05&&Math.max(r,green,b)>24):id==='jehuty'?(b>r*1.12&&green>r*1.1&&b>35):id==='anubis'?(r>95&&green>55&&b<green*.82):id==='raguna'?(r>70&&r>green*1.3&&green>b*1.05&&b<145):id==='io'?(r>65&&r>green*1.3&&r>b*1.25):id==='battlecat'?(r>150&&green>150&&b>150):id==='aloy'?(r>70&&r>green*1.2&&green>b*1.1):id==='quote'?(r>85&&r>green*1.4&&r>b*1.3):id==='shovelknight'?(b>r*1.2&&b>green*.95&&b>70):id==='rayman'?(r>b*.8&&b>green*1.2&&b>60):id==='sackboy'?(r>65&&r>green*1.12&&green>b*1.05):id==='felyne'?(r>65&&green>55&&r>green*.9&&green>b*1.1):id==='nargacuga'?(b>r*1.2&&b>green*.9&&b>30):id==='mono'?(r>140&&green>100&&b<green*.65):id==='ryuta'?(r>85&&r>green*1.4&&r>b*1.3):id==='nights'?(b>r*.82&&b>green*1.3&&r>45):id==='sol'?(r>65&&r>green*1.6&&r>b*1.35):id==='miyabi'?(b>45&&green>r*1.2&&b>r*1.15&&r<115):id==='riesz'?green>60&&green>r*1.15&&green>b*1.15:id==='edea'?r>70&&r>green*1.6&&r>b*1.35:id==='aiai'?(r>150&&green>45&&green<155&&r>green*1.4&&green>b*1.5&&b<90):id==='karateka'?!!karateMask[p/4]:id==='battlemage'?(r>70&&r>green*1.6&&r>b*1.2):id==='kurabe'?(Math.max(r,green,b)<180&&Math.min(r,green,b)>20&&Math.max(r,green,b)-Math.min(r,green,b)<18):id==='alucard'?(r>55&&r>green*1.6&&r>b*1.3):id==='kingbonby'?(b>r*1.15&&b>green*1.3&&r>30):id==='katamari'?(green>55&&green>r*1.25&&green>b*1.2):id==='toro'?(r>green*1.25&&r>b*1.25&&r>55):id==='cojicoji'?(r>green*2.4&&r>b*1.8&&r>70):id==='hinako'?(b>r*1.1&&b>green*1.03&&b>25):['ray','alain'].includes(id)?(b>r*1.2&&b>green*1.08&&b>40):id==='kisuke'?(green>r*1.25&&b>r*1.2&&green>45):id==='zidane'?(green>r*1.2&&b>r*1.2&&b>55):id==='miku'?(green>r*1.35&&b>r*1.2&&green>40):id==='nier'?(Math.max(r,green,b)<120&&Math.min(r,green,b)>15&&Math.max(r,green,b)-Math.min(r,green,b)<28):id==='bayleef'?bayleefTintMask(r,green,b):id==='elma'?(r>100&&r>green*1.6&&r>b*1.5):id==='kitten'?(Math.max(r,green,b)<90&&Math.min(r,green,b)>8&&Math.max(r,green,b)-Math.min(r,green,b)<25):id==='human'?(r>105&&green>105&&b>105&&Math.max(r,green,b)-Math.min(r,green,b)<32):id==='fei'?(green>r*1.14&&green>b*1.08&&green>25&&green<145):['akira','morphie'].includes(id)?(b>r*1.2&&b>green*1.1&&b>65):id==='chef'?(b>r*1.2&&b>green*1.15&&b>75):id==='horse'?(r>75&&r>green*1.2&&green>b*1.15&&green>35):id==='sakuna'?(r>90&&r>green*1.6&&r>b*1.5):id==='haseo'?(Math.max(r,green,b)<105&&Math.min(r,green,b)>25&&Math.max(r,green,b)-Math.min(r,green,b)<24):id==='terrarian'?(green>r*1.08&&green>b*1.1&&green>40&&green<180):id==='headmaster'?(r>140&&green>125&&b<green*.78&&green>r*.78):id==='pawapuro'?(r>110&&r>green*2.4&&r>b*1.6):id==='pokoa'?(r>50&&b>70&&b>green*1.3&&r>green*1.15):id==='midna'?(green>r*1.3&&b>r*1.3&&green>65):red?(r>90&&r>green*1.6&&r>b*1.5):['twob','noctis','narukami','naegi','luke','will','kosmos','fayt','emma'].includes(id)?(Math.max(r,green,b)<95&&d[p+3]>30):id==='monokuma'?(r>90&&r>green*1.6&&r>b*1.3):gold?(r>b*1.4&&green>b*1.35&&green>75&&(id!=='metabee'||r>green*.85)&&(id!=='agumon'||r>green*1.1)):(b>r*1.2&&b>green*1.08);if(mask){const sum=r+green+b;map.data[p]=1;map.data[p+1]=sum%256;map.data[p+2]=Math.floor(sum/256);map.data[p+3]=255;}}
     pg.putImageData(map,rects[n][0],rects[n][1]);
    });
    // Alpha and fully opaque colors are byte exact; translucent RGB may differ
    // by canvas GPU premultiplication rounding without a change in the artwork.
    const checksum=c=>{const copy=document.createElement('canvas');copy.width=c.width;copy.height=c.height;const cg=copy.getContext('2d',{willReadFrequently:true});cg.drawImage(c,0,0);const bytes=cg.getImageData(0,0,c.width,c.height).data;let h=2166136261;for(let p=0;p<bytes.length;p+=4){h=Math.imul(h^bytes[p+3],16777619);if(bytes[p+3]===255)for(let k=0;k<3;k++)h=Math.imul(h^bytes[p+k],16777619);}return(h>>>0).toString(16);};
    return{portraitPose:pose,png:packed.toDataURL(),palettePng:id==='dragoon'?null:palette.toDataURL(),frames:rects.slice(0,art.frames.length),effects:rects.slice(art.frames.length,art.frames.length+(art.effects?.length||0)),isaacVfx:extra.length?rects.slice(-extra.length):[],portraits,selectionPortraits,selectionCrop,...selectionMetadata,checks:{frames:art.frames.map(checksum),effects:(art.effects||[]).map(checksum),tints:art.tints.map(v=>v.map(checksum))}};
   },{id,portraitsOnly,selectionSource:selectionSources[id]||null});
   const {png,palettePng,portraits,selectionPortraits,...info}=entry;
   const selectionUrls=await Promise.all(selectionPortraits.map((data,n)=>save(id+'-selection-'+n,data,!!info.selectionSource)));
   if(portraitsOnly){Object.assign(manifest.characters[id],info,{selectionPortraits:selectionUrls});manifest.characters[id].selectionThumbnails=await bakeThumbnails(root,id,manifest.characters[id]);console.log('Baked '+id+': selection portraits');continue;}
   info.image=await save(id+'-atlas',png,true);
   info.portraits=await Promise.all(portraits.map((data,n)=>save(id+'-portrait-'+n,data)));
   info.selectionPortraits=selectionUrls;
   info.selectionThumbnails=await bakeThumbnails(root,id,info);
   if(palettePng)info.palette=await save(id+'-palette',palettePng,true);
   manifest.characters[id]=info;
   console.log('Baked '+id+': '+info.frames.length+' poses, '+info.effects.length+' effects');
  }
  if(!portraitsOnly&&!requested){const platform=await page.evaluate(()=>platformArt.toDataURL());manifest.platform=await save('sanctum-platform',platform);}
  if(errors.length)throw Error(errors.join('\n'));
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest));
  console.log(JSON.stringify({baselineMs,characters:Object.keys(manifest.characters).length,output:out}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
