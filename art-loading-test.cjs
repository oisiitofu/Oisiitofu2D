const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.stack));page.on('request',r=>requests.push(new URL(r.url()).pathname));
  // The production menu must never segment a sheet, or encode a portrait PNG.
  await page.addInitScript(()=>{HTMLCanvasElement.prototype.toDataURL=function(){throw Error('Unexpected runtime portrait encoding');};});
  const began=Date.now();await page.goto('http://localhost:4173',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('.fighter-card img').length===Roster.selectable.length&&[...document.querySelectorAll('.fighter-card img')].every(i=>i.complete&&i.naturalWidth),null,{timeout:10000});
  const portraitsMs=Date.now()-began;
  await page.click('#enter-training');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:10000});
  const readyMs=Date.now()-began;
  const checks=await page.evaluate(async()=>{
   const manifest=await(await fetch('assets/ready/manifest.json')).json(),mismatches=[];
   const checksum=c=>{const copy=document.createElement('canvas');copy.width=c.width;copy.height=c.height;const cg=copy.getContext('2d',{willReadFrequently:true});cg.drawImage(c,0,0);const d=cg.getImageData(0,0,c.width,c.height).data;let h=2166136261;for(let p=0;p<d.length;p+=4){h=Math.imul(h^d[p+3],16777619);if(d[p+3]===255)for(let k=0;k<3;k++)h=Math.imul(h^d[p+k],16777619);}return(h>>>0).toString(16);};
   let poses=0,effects=0,costumes=0;
   for(const {id}of Roster.definitions){
    const art=characterArt[id],expected=manifest.characters[id];
    for(const [kind,items]of [['frames',art.frames],['effects',art.effects]])items.forEach((c,n)=>{if(checksum(c)!==expected.checks[kind][n])mismatches.push(id+':'+kind+':'+n);if(kind==='frames')poses++;else effects++;});
    art.tints.forEach((v,color)=>v.forEach((c,n)=>{if(checksum(c)!==expected.checks.tints[color][n])mismatches.push(id+':color'+color+':'+n);costumes++;}));
   }
   for(const card of document.querySelectorAll('.fighter-card')){card.click();for(const button of document.querySelectorAll('#swatches button'))button.click();}
   return{poses,effects,costumes,mismatches};
  });
  assert.equal(checks.mismatches.length,0,'Alpha / opaque pixel mismatches: '+checks.mismatches.slice(0,20).join(', '));
  assert.equal(requests.filter(p=>/^\/characters\/[a-z0-9-]+\/assets\//.test(p)).length,0,'Original production sheets must not be requested');
  assert.deepEqual(requests.filter(p=>p.endsWith('.js')),['/game-bundle.js'],'Game scripts must use one ordered bundle');
  await page.click('#swatches button:first-child');await page.click('[data-id="estelle"]');await page.click('#start');
  assert.equal(await page.evaluate(()=>fighters[0].characterId),'estelle');
  const hashed=Object.values(JSON.parse(fs.readFileSync('assets/ready/manifest.json','utf8')).characters)[0].image;
  const response=await page.request.get('http://localhost:4173/'+hashed);
  assert.match(response.headers()['cache-control'],/immutable/);
  assert.equal((await page.request.get('http://localhost:4173/assets/ready/manifest.json')).headers()['cache-control'],'no-cache');
  assert.equal((await page.request.get('http://localhost:4173/assets/ready/private.txt')).status(),404);
  const bundle=await page.request.get('http://localhost:4173/game-bundle.js');
  assert.match(bundle.headers()['content-type'],/javascript/);
  assert.equal((await page.request.get('http://localhost:4173/game-bundle.js',{headers:{'If-None-Match':bundle.headers().etag}})).status(),304);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({portraitsMs,readyMs,...checks,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
