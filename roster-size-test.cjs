const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.stack));page.on('request',r=>requests.push(new URL(r.url()).pathname));
 await page.addInitScript(()=>{HTMLCanvasElement.prototype.toDataURL=function(){throw Error('Runtime portrait generation');};});
 await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');
 const pixels=await page.evaluate(async()=>{
  const results=[],manifest=await(await fetch('assets/ready/manifest.json')).json();
  for(const def of Roster.definitions){await ArtLoader.load(def.id);const entry=manifest.characters[def.id];let dedicated=null;
   if(entry.selectionSource){dedicated=new Image();dedicated.src=entry.selectionSource;await dedicated.decode();}
   for(let color=0;color<5;color++){
   let source=dedicated?ArtLoader.tint(dedicated,def.id,color):characterArt[def.id].tints[color][def.pose];
   if(!source.getContext){const copy=document.createElement('canvas');copy.width=source.width;copy.height=source.height;copy.getContext('2d').drawImage(source,0,0);source=copy;}
   const img=new Image();img.src=ArtLoader.portrait(def.id,color,def.pose,true);await img.decode();
   const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const dst=ctx.getImageData(0,0,c.width,c.height).data,src=source.getContext('2d').getImageData(0,0,source.width,source.height).data;
   const rect=manifest.characters[def.id].selectionCrop,[left,top,w,h]=rect;let mismatches=0,visible=0;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const inSource=x+left>=0&&x+left<source.width&&y+top>=0&&y+top<source.height,a=((y+top)*source.width+x+left)*4,b=(y*w+x)*4,alpha=inSource?src[a+3]:0;
    if(alpha!==dst[b+3])mismatches++;
    if(alpha===255){for(let k=0;k<3;k++)if(src[a+k]!==dst[b+k])mismatches++;}
    else if(dedicated&&alpha>32){for(let k=0;k<3;k++)if(Math.abs(src[a+k]-dst[b+k])>Math.ceil(255/alpha)*2)mismatches++;}
    visible+=dst[b+3]>32;
   }
   results.push({id:def.id,color,mismatches,rect,expected:dedicated?rect:ArtLoader.selectionCrop(source,def.id),dedicated:!!dedicated,dimensions:[c.width,c.height],aspect:c.width/c.height,zoom:source.height/c.height,visible});
  }}return results;
 });
 // A closer native crop may be below 768px high. It still exceeds the largest
 // 560px-wide roster thumbnail; never upscale it merely to satisfy a pixel count.
 for(const v of pixels){assert.equal(v.mismatches,0,v.id+' color '+v.color);assert.deepEqual(v.rect,v.expected,'Authored face crop: '+v.id);assert.deepEqual(v.dimensions,v.rect.slice(2),'Native crop dimensions: '+v.id);assert.ok(Math.abs(v.aspect-1.4)<.01,JSON.stringify(v));assert.ok((v.dedicated?v.dimensions[0]>=560:v.zoom>1.4)&&v.visible>200,JSON.stringify(v));}
 const home=await page.evaluate(async()=>{const out=[];for(const img of document.querySelectorAll('[data-home-fighter]')){await img.decode();const source=characterArt[img.dataset.homeFighter].frames[0];out.push({id:img.dataset.homeFighter,actual:[img.naturalWidth,img.naturalHeight],expected:[source.width,source.height]});}return out;});for(const v of home)assert.deepEqual(v.actual,v.expected,'Original home portrait: '+v.id);
 const layouts=[];for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,640],[820,1180],[390,844],[375,667],[844,390]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>Roster.open('training'));
  const sizes=await page.evaluate(async()=>{const cards=[];for(const el of document.querySelectorAll('.fighter-card:not(.random-fighter)')){const img=el.querySelector('img');await img.decode();const r=img.getBoundingClientRect(),card=el.getBoundingClientRect(),label=el.querySelector('b').getBoundingClientRect();cards.push({id:el.dataset.id,height:r.height,fit:getComputedStyle(img).objectFit,filled:Math.abs(r.width-el.clientWidth)<1&&Math.abs(r.top-card.top-parseFloat(getComputedStyle(el).borderTopWidth))<1&&Math.abs(r.bottom-label.top)<1,inLibraryHorizontally:card.left>=0&&card.right<=innerWidth+1});}return cards;});
  const min=Math.min(...sizes.map(s=>s.height)),max=Math.max(...sizes.map(s=>s.height));assert.equal(sizes.length,113);assert.ok(sizes.every(s=>s.inLibraryHorizontally&&s.height>0&&s.fit==='cover'&&s.filled),JSON.stringify({width,height,sizes}));assert.ok(max-min<1,JSON.stringify({width,height,min,max}));layouts.push({width,height,min,max,spread:max-min});
  await page.locator('#selected-portrait').evaluate(img=>img.decode());
  if(width===375||width===390||width===844)await page.screenshot({path:`roster-size-${width}x${height}.png`});
  if(width===844){assert.equal(await page.locator('.topbar').evaluate(el=>el.offsetHeight),56);await page.click('#start');assert.equal(await page.locator('.topbar').evaluate(el=>el.offsetHeight),76);await page.click('#pausebutton');await page.click('#pause .back');assert.equal(await page.locator('.topbar').evaluate(el=>el.offsetHeight),56);}
 }
 await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>Roster.open('training'));await page.screenshot({path:'roster-size-after.png'});
 const banner=[];for(const id of ['dragoon','naegi','okami','morphie']){await page.click(`[data-id="${id}"]`);banner.push(await page.locator('#selected-portrait').evaluate(async img=>{await img.decode();return {id:Roster.selected,box:[img.clientWidth,img.clientHeight],aspect:img.naturalWidth/img.naturalHeight,fit:getComputedStyle(img).objectFit};}));}assert.ok(banner.every(v=>v.box[0]===banner[0].box[0]&&v.box[1]===banner[0].box[1]&&v.fit==='contain'));
 assert.ok(!requests.some(p=>/^\/assets\/[a-z0-9_-]+-(atlas|locomotion|effects)\.png$/.test(p)));assert.deepEqual(errors,[]);
 const result={portraits:pixels.length,lossless:true,layouts,banner,home,errors};fs.writeFileSync('.tools/roster-size-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});


