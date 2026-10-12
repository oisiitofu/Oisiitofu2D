// Dedicated special identity with live held/released and hit-confirm branches.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'pre-special-art-checks.json'))),m=JSON.parse(fs.readFileSync('assets/ready/manifest.json')).characters.tifa;
 assert.deepEqual(m.checks.frames.slice(0,106),baseline.frames);
 for(let c=0;c<5;c++)assert.deepEqual(m.checks.tints[c].slice(0,106),baseline.tints[c]);
 const b=await chromium.launch({channel:'msedge',headless:true});try{
  const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  const r=await p.evaluate(()=>{state='pause';render=()=>{};document.querySelector('#stage').value='0';setupStage();let checks=0;const failed=[],seen={rush:new Set,beat:new Set,aerial:new Set,ki:new Set},check=(n,v)=>{checks++;if(!v)failed.push(n);};
   const make=(type,face,color)=>{const f=makeFighter(0,color,'tifa');Object.assign(f,{x:500,y:200,inv:0,hitlag:0,hitstun:0,grounded:false,face,state:'idle',mode:'Idle',faf:0});TifaRules.reset();attack(f,type);return f;};
   const inspect=f=>{const a=f.attack,t=f.timer,before=JSON.stringify({a,boxes:attackBoxes(f),x:f.x,y:f.y,vx:f.vx,vy:f.vy,faf:f.faf}),s=TifaRasterAnimation.sample(f),pl=TifaRasterAnimation.placement(f,s.pose),v=TifaVFX.segments(f),w=CombatData.activeWindow(a,t);
    seen[s.family]?.add(s.pose);check('own special frames '+a.type+t,s.pose===40||s.pose>=106&&s.pose<128);check('finite scale/root '+s.pose,Number.isFinite(pl.root)&&Number.isFinite(pl.unit)&&pl.unit>0);
    check('every special hit has a painted contact '+a.type+t,!w||v.length===1);check('no FX outside windows '+a.type+t,!!w||v.length===0);
    if(v.length){const mirror=TifaVFX.segments({...f,face:-f.face})[0];check('mirrored contact '+s.pose,Math.abs(v[0].to.x+mirror.to.x-2*f.x)<1e-7&&v[0].to.y===mirror.to.y);check('special FX family '+a.type,v[0].family===s.family);}
    drawSprite(f);TifaVFX.draw(f);check('draw does not change mechanics '+a.type+t,before===JSON.stringify({a,boxes:attackBoxes(f),x:f.x,y:f.y,vx:f.vx,vy:f.vy,faf:f.faf}));
    const frozen=JSON.stringify(s);frame+=30;check('simulation clock only '+a.type+t,JSON.stringify(TifaRasterAnimation.sample(f))===frozen);
   };
   for(const face of[-1,1])for(let color=0;color<5;color++){
    for(const release of[-1,0,21]){const f=make('dragon',face,color);for(let t=1;t<=f.attack.totalFrames;t++){f.timer=t;TifaRules.action(f,{...emptyInput(),specialHeld:release>=0&&(release===0||t<release)});inspect(f);}check('rush tap/hold/release '+release,release===-1?!f.attack.extended:release?f.attack.released:f.attack.extended);}
    for(const up of[false,true]){const f=make('dash',face,color);for(let t=1;t<=90&&t<=f.attack.totalFrames;t++){f.timer=t;const a=f.attack;if(t===13||t===28){a.hitStage=a.stage;a.followUntil=t+17;TifaRules.action(f,{...emptyInput(),special:true,y:up?-1:0});}else TifaRules.action(f,emptyInput());inspect(f);}check('three combo stages '+up,f.attack.stage===3);check('upper elbow branch '+up,f.attack.activeFrames[1].pose===(up?41:7));}
    const whiff=make('dash',face,color);for(let t=1;t<=whiff.attack.totalFrames;t++){whiff.timer=t;TifaRules.action(whiff,{...emptyInput(),specialHeld:true});inspect(whiff);}check('whiff stays first stage',whiff.attack.stage===1);
    for(const branch of['up','side','down','none']){const f=make('rise',face,color);for(let t=1;t<=f.attack.totalFrames;t++){f.timer=t;TifaRules.action(f,{...emptyInput(),x:branch==='side'?face:0,y:branch==='side'?0:branch==='down'?1:-1,special:branch!=='none'&&t===18});inspect(f);}check('requested aerial branch '+branch,branch==='none'?!f.attack.followed:f.attack.branch===branch);}
    const ki=make('gale',face,color);for(let t=1;t<=ki.attack.totalFrames;t++){ki.timer=t;TifaRules.action(ki,emptyInput());inspect(ki);}check('ki activates at existing timing',ki.attack.activated&&ki.tifaKiTime===360);
   }
   check('all four ki gestures',seen.ki.has(124)&&seen.ki.has(125)&&seen.ki.has(126)&&seen.ki.has(127));
   check('all three aerial branches',[120,121,122,123].every(n=>seen.aerial.has(n)));
   check('all side combo contacts',[113,114,115,117].every(n=>seen.beat.has(n)));
   check('alternating rush and finish',[107,108,110].every(n=>seen.rush.has(n)));
   for(let n=106;n<128;n++){const im=characterArt.tifa.frames[n],d=im.getContext('2d').getImageData(0,0,im.width,im.height).data;let alpha=0,solid=0;for(let k=3;k<d.length;k+=4){if(!d[k])alpha++;if(d[k]>180)solid++;}check('full transparent sprite '+n,alpha>100&&solid>1000);}
   return{checks,failed,poses:Object.fromEntries(Object.entries(seen).map(([k,v])=>[k,[...v].sort((a,b)=>a-b)]))};
  });assert.deepEqual(r.failed,[]);assert.deepEqual(errors,[]);console.log(JSON.stringify({...r,errors,previousFramesUnchanged:106}));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
