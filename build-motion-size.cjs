'use strict';
// Offline display calibration. Weapons/capes can change bounds without changing
// the actor's scale, so use body-palette-weighted area, not bounding height.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),{chromium}=require('playwright');
const root=__dirname;
// Source-pixel exclusions checked against the actual poses. Large props with
// the same palette as the body need a spatial mask as well as a color weight.
const exclude={piposaru:{0:[[0,0,104,124]],47:[[0,0,503,80],[250,0,253,345]]},aruru:{47:[[286,0,193,355]]},twinbee:{47:[[263,0,185,343],[0,0,448,56],[0,310,448,33]]},kosmos:{9:[[155,0,164,112]]}};
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});let runtime;
 try{
  const p=await browser.newPage();await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  runtime=await p.evaluate(()=>{
   state='pause';setupStage('0');const result=[];
   for(const {id}of Roster.definitions){
    const f=makeFighter(0,0,id),used=new Set(Array.from({length:40},(_,n)=>n));f.input=emptyInput();fighters=[f,makeFighter(1,0,'dragoon')];
    for(const type of ['jab','jab2','jab3','dashAttack','heavy','up','low','smash','upsmash','downsmash','air','fair','bair','uair','dair','dragon','gale','rise','grab']){f.attack=null;f.grounded=true;attack(f,type);if(!f.attack)continue;const a=f.attack;for(let t=1;t<=Math.min(300,a.totalFrames);t++){f.timer=t;used.add(BattleSize.imagePose(f,pose(f)));}if(a.hold){f.timer=1;used.add(BattleSize.imagePose(f,pose(f)));}}
    for(const mode of Object.keys(PlayerStates.defs)){f.attack=null;PlayerStates.enter(f,mode);for(const t of [0,5,12,24,48]){frame=t;used.add(BattleSize.imagePose(f,pose(f)));}}
    // Alternate body atlases; prop/projectile images and selection portraits
    // are deliberately excluded even when they share the same frame array.
    const count=characterArt[id].frames.length;
    if(count===49)for(let n=40;n<48;n++)used.add(n);
    if(id==='goemon')for(let n=44;n<84;n++)used.add(n);
    if(id==='elma')for(let n=40;n<56;n++)used.add(n);
    if(id==='zero'){used.add(44);used.add(46);}
    result.push({id,used:[...used],scales:characterArt[id].frames.map((_,n)=>BattleSize.baseNative(id,n))});
   }return result;
  });
 }finally{await browser.close();}
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/ready/manifest.json'))),characters={};let poses=0;
 for(const {id,used,scales}of runtime){
  const entry=manifest.characters[id],{data,info}=await sharp(path.join(root,entry.image)).ensureAlpha().raw().toBuffer({resolveWithObject:true}),areas=[],pads=[],histograms=[];
  for(const [n,[left,top,width,height]]of entry.frames.entries()){
   let area=0,bottom=0;const histogram=Array(64).fill(0);
   for(let y=0;y<height;y++){let count=0;for(let x=0;x<width;x++){const k=((top+y)*info.width+left+x)*4,a=data[k+3]/255;area+=a;if(!exclude[id]?.[n]?.some(([l,t,w,h])=>x>=l&&x<l+w&&y>=t&&y<t+h))histogram[(data[k]>>6)*16+(data[k+1]>>6)*4+(data[k+2]>>6)]+=a;if(a>.6)count++;}if(count>=Math.max(3,width*.012))bottom=y+1;}
   areas[n]=area;pads[n]=height-bottom;histograms[n]=histogram;
  }
  // Ignore newly introduced prop/effect colors (hammer, crate, spell) that
  // would otherwise make the actor shrink when holding a large object.
  const weights=histograms[0].map(a=>Math.min(1,a/areas[0]/.005));
  const bodyArea=histograms.map(h=>h.reduce((sum,a,k)=>sum+a*weights[k],0));
  const scale=areas.map((a,n)=>used.includes(n)?+(Math.sqrt(bodyArea[0]/Math.max(bodyArea[n],a*.25))*scales[0]/scales[n]).toFixed(5):1);
  characters[id]={atlas:entry.image,poses:used.filter(n=>n<areas.length).sort((a,b)=>a-b),scale,pad:pads,...(exclude[id]?{exclude:exclude[id]}:{})};poses+=used.filter(n=>n<areas.length).length;
 }
 fs.writeFileSync(path.join(root,'motion-size.js'),"'use strict';\n// Generated pose scales; shared weapon/ledge anchors follow the displayed art.\nconst MotionSize="+JSON.stringify({characters},null,1)+';\n');
 console.log(JSON.stringify({characters:runtime.length,poses}));
})().catch(e=>{console.error(e);process.exitCode=1;});
