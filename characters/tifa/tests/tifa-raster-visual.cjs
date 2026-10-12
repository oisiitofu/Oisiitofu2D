const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const dir=path.resolve(__dirname,'../previews');fs.mkdirSync(dir,{recursive:true});
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1600,height:1000}});await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
 const r=await p.evaluate(()=>{state='pause';const f=makeFighter(0,0,'tifa');Object.assign(f,{inv:0,face:1,grounded:true});canvas.width=1600;canvas.height=3100;
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#142137';ctx.fillRect(0,0,1600,3100);
 const measures=[];Object.entries(TifaRasterAnimation.tracks).forEach(([name,tr],row)=>{
  const frames=[tr.start??40,...tr.mids,tr.end],floor=270+row*280;ctx.fillStyle='#61728a';ctx.fillRect(0,floor,1600,1);
  frames.forEach((n,col)=>{f.x=160+col*320;f.y=floor;TifaRasterAnimation.drawFrame(f,n,1,2);ctx.fillStyle='#fff';ctx.font='18px system-ui';ctx.fillText(name+' '+n,f.x-70,floor+24);
   const pl=TifaRasterAnimation.placement(f,n),im=characterArt.tifa.frames[n];measures.push({name,n,w:im.width,h:im.height,...pl});});
 });return{png:canvas.toDataURL(),measures};});
 fs.writeFileSync(path.join(dir,'tifa-raster-contact.png'),Buffer.from(r.png.split(',')[1],'base64'));fs.writeFileSync(path.join(dir,'tifa-raster-measures.json'),JSON.stringify(r.measures,null,2));
 const palette=await p.evaluate(()=>{state='pause';canvas.width=1500;canvas.height=1300;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#142137';ctx.fillRect(0,0,1500,1300);const f=makeFighter(0,0,'tifa');f.inv=0;for(let c=0;c<5;c++){f.color=c;for(const face of[1,-1])for(let j=0;j<3;j++){f.face=face;f.x=125+(j+(face===1?0:3))*250;f.y=230+c*260;TifaRasterAnimation.drawFrame(f,[40,50,42][j],1,2);}}return canvas.toDataURL();});fs.writeFileSync(path.join(dir,'tifa-raster-colors.png'),Buffer.from(palette.split(',')[1],'base64'));
 const video=await p.evaluate(async()=>{
  state='pause';render=()=>{};canvas.width=1200;canvas.height=380;GameAudio.setMuted(true);
  const stream=canvas.captureStream(30),rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'}),chunks=[];rec.ondataavailable=e=>chunks.push(e.data);const done=new Promise(r=>rec.onstop=r);rec.start();
  const f=makeFighter(0,0,'tifa');Object.assign(f,{inv:0,hitlag:0,hitstun:0,face:1,grounded:true});
  const scene=(label,t)=>{ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#142137';ctx.fillRect(0,0,1200,380);ctx.fillStyle='#61728a';ctx.fillRect(0,330,1200,1);ctx.fillStyle='white';ctx.font='22px system-ui';ctx.fillText(label+' / '+t+' F',30,30);for(const face of[1,-1]){f.face=face;f.x=face===1?320:880;f.y=330;drawSprite(f,1,null,2.5);}};
  for(const type of ['jab','jab3','up','low','dashAttack','fair','bair','dair','dragon']){
   f.attack=null;f.faf=0;f.state='idle';f.mode='Idle';f.timer=0;f.grounded=!['fair','bair','dair'].includes(type);TifaRules.reset();attack(f,type);const a=f.attack;if(!a)continue;
   for(let t=0;t<=a.totalFrames+4;t++){f.timer=Math.min(t,a.totalFrames);if(t>a.totalFrames){f.attack=null;f.state='idle';}scene(type,t);await new Promise(r=>setTimeout(r,1000/30));}
  }
  for(const s of ['walk','run','guard']){f.attack=null;f.state=s;f.mode=s;for(let t=1;t<=48;t++){f.stateFrame=t;scene(s,t);await new Promise(r=>setTimeout(r,1000/30));}}
  rec.stop();await done;stream.getTracks().forEach(t=>t.stop());return new Promise(r=>{const fr=new FileReader;fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(new Blob(chunks,{type:'video/webm'}))});
 });fs.writeFileSync(path.join(dir,'tifa-raster-gameplay.webm'),Buffer.from(video,'base64'));
 console.log(JSON.stringify({contact:path.join(dir,'tifa-raster-contact.png'),video:path.join(dir,'tifa-raster-gameplay.webm'),frames:r.measures.length}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
