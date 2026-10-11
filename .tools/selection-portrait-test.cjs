const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),sharp=require('sharp'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const before=JSON.parse(fs.readFileSync(path.join(__dirname,'selection-portrait-before.json'),'utf8')),after=JSON.parse(fs.readFileSync(path.join(root,'assets/ready/manifest.json'),'utf8')),sources=JSON.parse(fs.readFileSync(path.join(__dirname,'selection-portrait-sources.json'),'utf8'));
 if(process.env.REQUIRE_COMPLETE){const inventory=JSON.parse(fs.readFileSync(path.join(__dirname,'selection-portrait-inventory.json'),'utf8'));assert.equal(inventory.length,56);assert.deepEqual(Object.keys(sources).sort(),inventory.map(r=>r.id).sort());assert.ok(inventory.every(r=>r.status==='applied'));}
 for(const [id,entry]of Object.entries(before.characters)){
  const previous={...entry},current={...after.characters[id]};
  for(const key of ['selectionPortraits','selectionCrop','selectionKind','selectionSource','selectionThumbnails']){delete previous[key];delete current[key];}
  assert.deepEqual(current,previous,'Combat art and home portrait unchanged: '+id);
  if(!sources[id]){const originalEntry={...after.characters[id]};delete originalEntry.selectionThumbnails;assert.deepEqual(originalEntry,entry,'Existing selection art unchanged: '+id);}
 }
 for(const [id,record]of Object.entries(sources)){
  const entry=after.characters[id],metadata=await sharp(path.join(root,record.source)).metadata();
  assert.equal(entry.selectionKind,'dedicated');assert.equal(entry.selectionSource,record.source);assert.deepEqual(entry.selectionCrop,record.crop);
  assert.ok(metadata.hasAlpha&&metadata.height>=768);assert.equal(entry.selectionPortraits.length,5);
  for(const url of entry.selectionPortraits){assert.match(url,/[a-f0-9]{16}\.(png|webp)$/);const meta=await sharp(path.join(root,url)).metadata();assert.deepEqual([meta.width,meta.height],record.crop.slice(2));assert.equal(meta.hasAlpha,true);}
 }
 const browser=await chromium.launch({channel:'msedge',headless:true});try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(new URL(r.url()).pathname));
  await page.addInitScript(()=>{HTMLCanvasElement.prototype.toDataURL=function(){throw Error('Runtime portrait encoding');};});
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');
  for(const id of Object.keys(sources)){await page.click('[data-id="'+id+'"]');for(const color of [0,1,2,3,4]){await page.locator('#swatches button').nth(color).click();assert.ok((await page.locator('#selected-portrait').getAttribute('src')).includes(id+'-selection-'+color+'-'));await page.locator('#selected-portrait').evaluate(img=>img.decode());}}
  await page.click('[data-id="dragoon"]');await page.locator('#swatches button').first().click();await page.screenshot({path:path.join(__dirname,'selection-portraits-current.png')});
  assert.ok(!requests.some(url=>Object.values(sources).some(s=>url==='/'+s.source)),'Source portraits are baked offline, never fetched by menu');assert.deepEqual(errors,[]);
  console.log(JSON.stringify({dedicated:Object.keys(sources).length,existingPreserved:64-Object.keys(sources).length,combatUnchanged:true,runtimeEncoding:false,errors}));
 }finally{await browser.close();}
})();
