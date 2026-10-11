const fs=require('node:fs'),assert=require('node:assert/strict'),sharp=require('sharp'),{chromium}=require('playwright');
(async()=>{
 const before=JSON.parse(fs.readFileSync('.tools/roster-sampling-before-manifest.json','utf8')),after=JSON.parse(fs.readFileSync('assets/ready/manifest.json','utf8'));
 for(const [id,entry]of Object.entries(before.characters)){const current={...after.characters[id]};delete current.selectionThumbnails;assert.deepEqual(current,entry,'Native art unchanged: '+id);for(const level of after.characters[id].selectionThumbnails){assert.equal(level.urls.length,5);for(const url of level.urls){const meta=await sharp(url).metadata();assert.equal(meta.width,level.width);assert.equal(meta.height,level.height);assert.ok(meta.hasAlpha);}}}
 const browser=await chromium.launch({channel:'msedge',headless:true}),checks=[],quality=[];try{
  for(const deviceScaleFactor of [1,2,3]){
   const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor}),page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(new URL(r.url()).pathname));
   await page.addInitScript(()=>{HTMLCanvasElement.prototype.toDataURL=function(){throw Error('Runtime thumbnail encoding');};});
   await page.goto(process.env.GAME_URL||'http://localhost:4173',{waitUntil:'domcontentloaded'});await page.click('#enter-roster');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
   for(const [width,height]of [[1440,900],[1920,1080],[375,667]]){
    await page.setViewportSize({width,height});
    const cards=await page.locator('.fighter-card img').evaluateAll(async imgs=>{const out=[];for(const img of imgs){await img.decode();out.push({src:img.currentSrc,natural:Number(img.currentSrc.match(/-selection-thumb-(\d+)-/)[1]),required:Math.max(img.clientWidth,img.clientHeight*ArtLoader.thumbnail(img.parentElement.dataset.id).aspect)*devicePixelRatio});}return out;});
    assert.equal(cards.length,64);assert.ok(cards.every(c=>c.src.includes('-selection-thumb-')&&c.natural<=560));assert.ok(cards.every(c=>c.natural>=Math.min(280,c.required)*.95));checks.push({deviceScaleFactor,width,height,thumbnailCards:cards.length});
    if(deviceScaleFactor===1&&width===1440)await page.screenshot({path:'.tools/roster-sampling-after.png'});
   }
   await page.click('[data-id="roxas"]');await page.locator('#swatches button').nth(2).click();await page.locator('#selected-portrait').evaluate(img=>img.decode());assert.ok((await page.locator('#selected-portrait').getAttribute('src')).includes('roxas-selection-2-'));assert.deepEqual(errors,[]);
   if(deviceScaleFactor===1){
    await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>Roster.open('training'));
    // Compare actual browser resampling against a high-quality reference at tile size.
    // The old path sends a 1434px portrait directly to this same 112px wide, cropped image box.
    for(const id of ['dragoon','isaac','roxas','lightning']){
     const thumbnail=await page.locator(`[data-id="${id}"] img`).evaluate(img=>img.currentSrc),native=after.characters[id].selectionPortraits[0];
     await page.evaluate(({thumbnail,native})=>{document.querySelector('#sampling-probe')?.remove();const host=document.createElement('div');host.id='sampling-probe';host.style.cssText='position:fixed;left:0;top:0;z-index:99999;display:flex;background:#172030';for(const [name,src]of [['baseline',native],['current',thumbnail]]){const img=document.createElement('img');img.id='sampling-'+name;img.src=src;img.style.cssText='display:block;width:112px;height:50px;object-fit:cover;image-rendering:auto';host.append(img);}document.body.append(host);},{thumbnail,native});
     for(const name of ['baseline','current'])await page.locator('#sampling-'+name).evaluate(img=>img.decode());
     const reference=await sharp(native).resize({width:112,height:50,fit:'cover',kernel:sharp.kernel.lanczos3}).flatten({background:'#172030'}).removeAlpha().raw().toBuffer();
     const score=async name=>{const bytes=await page.locator('#sampling-'+name).screenshot();const actual=await sharp(bytes).removeAlpha().raw().toBuffer();assert.equal(actual.length,reference.length);let sum=0;for(let n=0;n<actual.length;n++)sum+=(actual[n]-reference[n])**2;return Math.sqrt(sum/actual.length);};
     const baseline=await score('baseline'),current=await score('current');quality.push({id,baseline,current});assert.ok(current<baseline*.8,JSON.stringify(quality.at(-1)));
    }
    await page.evaluate(()=>document.querySelector('#sampling-probe').remove());
   }
   await context.close();
  }
  const result={nativeArtUnchanged:true,checks,quality};fs.writeFileSync('.tools/roster-sampling-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
