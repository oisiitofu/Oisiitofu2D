const fs=require('fs'),assert=require('assert/strict'),sharp=require('sharp'),{chromium}=require('playwright');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync('.tools/stage-art-manifest.json','utf8')),checks=[];
 const check=(name,pass)=>checks.push({name,pass:!!pass});
 for(const [theme,d]of Object.entries(manifest.themes)){
  for(const kind of ['background','main','small']){
   const source=kind==='background'?d.backgroundSource:d[kind].nativeImage,url=kind==='background'?d.background:d[kind].image;
   const a=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(url).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   check('native dimensions '+theme+' '+kind,a.info.width===b.info.width&&a.info.height===b.info.height);
   let mismatch=false;for(let p=0;p<a.data.length;p+=4){if(a.data[p+3]!==b.data[p+3])mismatch=true;if(a.data[p+3])for(let c=0;c<3;c++)if(a.data[p+c]!==b.data[p+c])mismatch=true;}
   check('lossless RGBA '+theme+' '+kind,!mismatch);
   if(kind!=='background')check('genuine alpha '+theme+' '+kind,a.data.some((v,p)=>p%4===3&&v===0)&&a.data.some((v,p)=>p%4===3&&v===255));
  }
 }
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await page.click('#enter-training');await page.click('#start');
  const browserChecks=await page.evaluate(()=>{
   const result=[],check=(name,pass)=>result.push({name,pass:!!pass});state='pause';training=false;countdown=hitstop=flash=shake=0;document.querySelector('#training-tools').classList.add('hidden');document.querySelector('#training-reset').classList.add('hidden');
   check('all 27 stage images decoded',StageVisuals.ready);
   const widths={'3':1040,'7':1020,'9':1060};for(const [id,w]of Object.entries(widths)){setupStage(id);check('expanded main '+id,platforms[0].w===w);}
   for(const stage of StageCatalog.stages.filter(d=>d.theme)){
    setupStage(stage.id);for(const p of platforms){const d=StageVisuals.geometry(p);check('painted collision top '+stage.id+' '+p.x,Math.abs(d.y+d.art.walkY*d.scaleY-p.y)<.00001);check('painted ledge left '+stage.id+' '+p.x,Math.abs(d.x+d.art.surfaceLeft*d.scaleX-p.x)<.00001);check('painted ledge right '+stage.id+' '+p.x,Math.abs(d.x+d.art.surfaceRight*d.scaleX-p.x-p.w)<.00001);}
    check('ledge updates '+stage.id,StageRules.ledges[0].x===platforms[0].x&&StageRules.ledges[1].x===platforms[0].x+platforms[0].w);
   }
   return result;
  });checks.push(...browserChecks);
  for(const stage of require('../stage-data.js').stages.filter(d=>d.theme)){
   await page.evaluate(id=>{setupStage(id);fighters=[makeFighter(0,0,'shizuna'),makeFighter(1,0,'hanajs')];for(const f of fighters)Object.assign(f,{y:560,inv:0,grounded:true});camera={x:720,y:395,z:1};state='pause';document.querySelector('#battlelabel').textContent=StageCatalog.name(id);render();},stage.id);
   await page.locator('#game').screenshot({path:'.tools/stage-v2-'+stage.theme+'-battle.png'});
  }
  for(const [theme,d]of Object.entries(manifest.themes)){const response=await page.request.get('http://localhost:4173/'+d.background);check('hashed immutable stage asset '+theme,response.ok()&&response.headers()['cache-control'].includes('immutable'));}
  check('no page errors',!errors.length);check('runtime loads packed assets',requests.some(u=>/stage-v2-sky-background-[a-f0-9]{16}\.webp/.test(u))&&!requests.some(u=>u.includes('platforms-a-source')));
  fs.writeFileSync('.tools/stage-v2-results.json',JSON.stringify({checks,errors},null,2));console.log({checks:checks.length,failed:checks.filter(c=>!c.pass),errors});assert.ok(checks.every(c=>c.pass));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
