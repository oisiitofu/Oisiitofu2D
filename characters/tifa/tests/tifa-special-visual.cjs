const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const dir=path.resolve(__dirname,'../previews');fs.mkdirSync(dir,{recursive:true});
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage();await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const grid=await p.evaluate(()=>{state='pause';render=()=>{};document.querySelector('#stage').value='0';setupStage();canvas.width=2300;canvas.height=1400;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#142137';ctx.fillRect(0,0,2300,1400);const f=makeFighter(0,0,'tifa');f.inv=0;
  for(const [row,[label,ns]]of [['RUSH',[106,107,108,109,110,111]],['BEAT',[112,113,114,115,116,117]],['AERIAL',[118,119,120,121,122,123]],['KI',[124,125,126,127]]].entries()){
   for(const [col,n]of [40,...ns].entries()){f.x=150+col*300;f.y=310+row*350;TifaRasterAnimation.drawFrame(f,n,1,2.5);ctx.fillStyle='white';ctx.font='19px system-ui';ctx.fillText(label+' / '+n,f.x-85,f.y+25);}
  }return canvas.toDataURL();});fs.writeFileSync(path.join(dir,'tifa-special-poses-v1.png'),Buffer.from(grid.split(',')[1],'base64'));
 const fx=await p.evaluate(()=>{canvas.width=1400;canvas.height=2760;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#142137';ctx.fillRect(0,0,1400,2760);const cases=[['RUSH / RIGHT','dragon',6],['RUSH / LEFT','dragon',12],['RUSH / FINISH','dragon',21],['BEAT / PALM','dash',9],['BEAT / ELBOW','dash',19,'combo'],['BEAT / RISE','dash',19,'upcombo'],['BEAT / FINISH','dash',34,'combo'],['AERIAL / LAUNCH','rise',9,'up'],['AERIAL / UPPERCUT','rise',21,'up'],['AERIAL / UP KICK','rise',25,'up'],['AERIAL / SIDE','rise',22,'side'],['AERIAL / DOWN','rise',22,'down']];
  for(const [row,[label,type,target,kind]]of cases.entries()){const f=makeFighter(0,0,'tifa');Object.assign(f,{x:500,y:200,grounded:false,inv:0});TifaRules.reset();attack(f,type);
   for(let t=1;t<=target;t++){f.timer=t;const i=emptyInput();if(type==='dash'&&(t===13||t===28)){f.attack.hitStage=f.attack.stage;f.attack.followUntil=t+17;i.special=true;i.y=kind==='upcombo'?-1:0;}if(type==='rise'){i.special=t===18;i.x=kind==='side'?1:0;i.y=kind==='side'?0:kind==='down'?1:-1;}TifaRules.action(f,i);}
   const floor=220+row*230;for(const face of[1,-1]){f.face=face;f.x=face===1?430:1050;f.y=floor;ctx.save();ctx.translate(f.x,f.y);ctx.scale(2,2);ctx.translate(-f.x,-f.y);drawSprite(f);TifaVFX.draw(f);ctx.restore();}ctx.fillStyle='white';ctx.font='16px system-ui';ctx.fillText(label+' / '+TifaRasterAnimation.sample(f).pose,20,floor-80);
  }return canvas.toDataURL();});fs.writeFileSync(path.join(dir,'tifa-special-fx-v1.png'),Buffer.from(fx.split(',')[1],'base64'));
 const movie=await p.evaluate(async()=>{state='pause';render=()=>{};GameAudio.setMuted(true);canvas.width=1200;canvas.height=440;const stream=canvas.captureStream(30),rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'}),chunks=[];rec.ondataavailable=e=>chunks.push(e.data);const done=new Promise(r=>rec.onstop=r);rec.start();
  const cases=[['NORMAL JAB','jab'],['NORMAL FAIR','fair'],['RUSH / TAP','dragon','tap'],['RUSH / HOLD','dragon','hold'],['RUSH / RELEASE','dragon','release'],['BEAT / WHIFF','dash','whiff'],['BEAT / HIT CONFIRM','dash','combo'],['BEAT / UP BRANCH','dash','upcombo'],['AERIAL / UP','rise','up'],['AERIAL / SIDE','rise','side'],['AERIAL / DOWN','rise','down'],['KI','gale']];
  for(const [label,type,kind]of cases){const f=makeFighter(0,0,'tifa');Object.assign(f,{inv:0,x:500,y:200,grounded:false,face:1,hitlag:0,hitstun:0});TifaRules.reset();attack(f,type);const a=f.attack;
   for(let t=1;t<=a.totalFrames+5;t++){
    f.timer=t;f.face=1;if(t<=a.totalFrames){const i={...emptyInput(),specialHeld:kind==='hold'||kind==='release'&&t<21};
     if(type==='dash'&&kind!=='whiff'&&(t===13||t===28)){a.hitStage=a.stage;a.followUntil=t+17;i.special=true;i.y=kind==='upcombo'?-1:0;}
     if(type==='rise'){i.special=t===18;i.x=kind==='side'?1:0;i.y=kind==='side'?0:kind==='down'?1:-1;}
     TifaRules.action(f,i);
    }else{f.attack=null;f.state='idle';f.mode='Idle';}
    ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#142137';ctx.fillRect(0,0,1200,440);ctx.fillStyle='white';ctx.font='22px system-ui';ctx.fillText(label+' / '+t+'F / visual '+TifaRasterAnimation.sample(f).pose,30,35);ctx.fillStyle='#61728a';ctx.fillRect(0,380,1200,1);
    for(const face of[1,-1]){f.face=face;f.x=face===1?320:880;f.y=380;ctx.save();ctx.translate(f.x,f.y);ctx.scale(2.7,2.7);ctx.translate(-f.x,-f.y);drawSprite(f);TifaVFX.draw(f);ctx.restore();}
    await new Promise(r=>setTimeout(r,1000/30));
   }
  }
  rec.stop();await done;stream.getTracks().forEach(t=>t.stop());return new Promise(r=>{const fr=new FileReader;fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(new Blob(chunks,{type:'video/webm'}));});
 });fs.writeFileSync(path.join(dir,'tifa-special-comparison-v1.webm'),Buffer.from(movie,'base64'));console.log(JSON.stringify({grid:path.join(dir,'tifa-special-poses-v1.png'),video:path.join(dir,'tifa-special-comparison-v1.webm')}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
