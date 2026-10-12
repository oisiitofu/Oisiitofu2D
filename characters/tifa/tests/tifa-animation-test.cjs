const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{chromium}=require('playwright');
(async()=>{
 let checks=0;const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'legacy-art-checks.json'))),actual=JSON.parse(fs.readFileSync('assets/ready/manifest.json')).characters.tifa;
 const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'pre-inbetween-baseline.json'))),sharp=require('sharp'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
 assert.equal(baseline.source,'characters/tifa/assets/tifa-arsenal.png');assert.equal(sha(fs.readFileSync(baseline.source)),baseline.sha256);assert.deepEqual(baseline.poses.map(v=>v.pose),[40,42]);checks+=3;
 for(const v of baseline.poses){assert.equal(sha(fs.readFileSync(v.file)),v.sha256);const[x,y,w,h]=v.rect;assert.deepEqual(await sharp('characters/tifa/assets/tifa-native.png').extract({left:x,top:y,width:w,height:h}).ensureAlpha().raw().toBuffer(),await sharp(v.file).ensureAlpha().raw().toBuffer());checks+=2;}
 for(const key of ['frames','effects']){assert.deepEqual(actual.checks[key].slice(0,expected.checks[key].length),expected.checks[key]);checks++;}
 for(let c=0;c<5;c++){assert.deepEqual(actual.checks.tints[c].slice(0,49),expected.checks.tints[c]);checks++;}
 for(const key of ['portraits','selectionPortraits']){assert.deepEqual(actual[key],expected[key]);checks++;}
 for(const[p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(__dirname,'legacy-combat-hashes.json'))))){assert.equal(sha(Buffer.from(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'))),h);checks++;}
 assert(!fs.readFileSync('index.html','utf8').includes('tifa-animation.js'));assert(!fs.readFileSync('game.js','utf8').includes('TifaAnimation'));checks+=2;
 const b=await chromium.launch({channel:'msedge',headless:true});try{
  const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
  const r=await p.evaluate(()=>{
   state='pause';const failures=[];let n=0;const check=(name,yes)=>{n++;if(!yes)failures.push(name);};
   check('128 full raster poses',characterArt.tifa.frames.length===128);check('8 effects and 5 colors',characterArt.tifa.effects.length===8&&characterArt.tifa.tints.length===5);check('no rejected rig',typeof TifaAnimation==='undefined');
   const f=makeFighter(0,0,'tifa');Object.assign(f,{inv:0,grounded:true,face:1,hitlag:0});
   for(const face of[-1,1])for(let color=0;color<5;color++){
    f.face=face;f.color=color;f.attack=null;f.state='idle';check('immutable neutral '+face+color,TifaRasterAnimation.sample(f).pose===40);
    for(const type of Object.keys(TifaMoves)){
     f.attack=null;f.faf=0;f.state='idle';f.mode='Idle';f.timer=0;TifaRules.reset();attack(f,type);const a=f.attack;if(!a)continue;
     const snapshot=JSON.stringify(a),fields=JSON.stringify({vx:f.vx,vy:f.vy,mode:f.mode,state:f.state,faf:f.faf});
     for(let t=0;t<=a.totalFrames;t++){
      f.timer=t;const before=JSON.stringify(attackBoxes(f)),s=TifaRasterAnimation.sample(f);drawSprite(f);
      check('collision '+type+face+color+t,before===JSON.stringify(attackBoxes(f)));
      if(s){const im=spriteFor(f,s.pose),pl=TifaRasterAnimation.placement(f,s.pose);check('raster '+type+face+color+t,!!im&&Number.isFinite(pl.unit)&&pl.unit>0&&pl.floor>0);}
     }
     check('attack unchanged '+type+face+color,JSON.stringify(a)===snapshot);check('fighter unchanged '+type+face+color,fields===JSON.stringify({vx:f.vx,vy:f.vy,mode:f.mode,state:f.state,faf:f.faf}));
    }
   }
   f.attack=null;f.state='idle';f.mode='Idle';f.timer=0;f.faf=0;attack(f,'jab');const a=f.attack;
   check('jab startup unchanged',a.startupFrames===5);check('jab active unchanged',a.activeFrames[0].start===5&&a.activeFrames[0].end===7);check('jab end unchanged',a.totalFrames===15);
   const sequence=[];for(let t=1;t<=15;t++){f.timer=t;sequence.push(TifaRasterAnimation.sample(f).pose);}
   check('three drawn startup middles',[49,50,51].every(v=>sequence.slice(0,4).includes(v)));check('original impact held',sequence.slice(4,7).every(v=>v===42));check('returns original stand',sequence.at(-1)===40);
   f.timer=3;f.hitlag=4;const frozen=JSON.stringify(TifaRasterAnimation.sample(f));frame+=90;check('attack freezes in hitlag',frozen===JSON.stringify(TifaRasterAnimation.sample(f)));
   f.attack=null;f.mode='Walk';f.state='walk';f.stateFrame=5;const walk=JSON.stringify(TifaRasterAnimation.sample(f));frame+=90;check('walk freezes with fighter clock',walk===JSON.stringify(TifaRasterAnimation.sample(f)));
   for(const mode of ['LedgeCatch','LedgeHang','LedgeGetup']){f.mode=mode;check('ledge hand retained '+mode,TifaRasterAnimation.sample(f)===null);}
   const body=n=>{const im=characterArt.tifa.frames[n],d=im.getContext('2d').getImageData(0,0,im.width,im.height).data,pl=TifaRasterAnimation.placement(f,n);let mass=0,cx=0;for(let k=0;k<d.length;k+=4){const r=d[k],g=d[k+1],b=d[k+2];if(Math.min(r,g,b)>120||r>110&&g>65&&b>35&&r>g*1.10&&g>b*1.10||r>90&&r>g*1.6&&r>b*1.5){const a=d[k+3]/255;mass+=a;cx+=(k/4%im.width)*a;}}return{mass:mass*pl.unit**2,cx:(cx/mass-im.width*pl.root)*pl.unit*FIGHTER_SCALE*BattleSize.art('tifa')};};
   for(let k=0;k<8;k++){const start=k<4?24:28,i=k%4,ref=(body(start+i).mass+body(start+(i+1)%4).mass)/2;check('locomotion middle anatomy size '+k,Math.abs(Math.sqrt(body(73+k).mass/ref)-1)<.03);}
   for(const start of[24,28]){const xs=Array.from({length:8},(_,i)=>body(i%2?(start===24?73:77)+Math.floor(i/2):start+Math.floor(i/2)).cx);check('locomotion root continuity '+start,Math.max(...xs)-Math.min(...xs)<(start===24?12:18));}
   for(let pose=49;pose<90;pose++){const im=characterArt.tifa.frames[pose],g=im.getContext('2d',{willReadFrequently:true}),d=g.getImageData(0,0,im.width,im.height).data;let transparent=0,solid=0;for(let k=3;k<d.length;k+=4){if(!d[k])transparent++;if(d[k]>200)solid++;}check('transparent intact middle '+pose,transparent>0&&solid>1000);}
   return{checks:n,failures,sequence};
  });assert.deepEqual(r.failures,[]);assert.deepEqual(errors,[]);checks+=r.checks+2;
  console.log(JSON.stringify({checks,failed:[],originalPoses:49,generatedMiddles:79,rasterRegistered:true,jab:r.sequence,errors}));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
