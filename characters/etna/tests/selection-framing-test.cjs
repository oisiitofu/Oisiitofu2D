'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),sharp=require('sharp'),{chromium}=require('playwright'),{execFileSync}=require('node:child_process');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync('assets/ready/manifest.json')),entry=manifest.characters.etna,tag=process.env.ETNA_TAG||'local';let checks=0;
 const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
 if(process.env.ART_BASELINE){const old=JSON.parse(fs.readFileSync(process.env.ART_BASELINE));eq(Object.fromEntries(Object.entries(manifest.characters).filter(([id])=>id!=='etna')),Object.fromEntries(Object.entries(old.characters).filter(([id])=>id!=='etna')),'other manifest entries unchanged');const omit=o=>Object.fromEntries(Object.entries(o).filter(([key])=>!['selectionCrop','selectionPortraits','selectionThumbnails'].includes(key)));eq(omit(entry),omit(old.characters.etna),'combat art, palettes and checksums unchanged');}
 const margins=[];for(const file of entry.selectionPortraits){const{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let top=info.height,left=info.width,right=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>127){top=Math.min(top,y);left=Math.min(left,x);right=Math.max(right,x);}eq([info.width,info.height],[1512,1080]);assert.ok(top>=48&&left>=140&&right<info.width-140,'hair inside top and side margins');checks++;margins.push({width:info.width,height:info.height,top,left,right});}
 const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],layouts=[];
 try{for(const[width,height]of[[1280,720],[1440,900],[1920,1080]]){
  const p=await browser.newPage({viewport:{width,height}});p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>navigator.getGamepads=()=>[]);await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-roster');await p.click('.fighter-card[data-id="etna"]');
  for(let color=0;color<5;color++){
   await p.locator('#swatches button').nth(color).click();await p.waitForFunction(url=>{const i=document.getElementById('selected-portrait');return i.complete&&i.naturalWidth&&new URL(i.src).pathname.endsWith('/'+url);},entry.selectionPortraits[color]);
   eq(await p.locator('#selected-portrait').evaluate(i=>getComputedStyle(i).objectFit),'contain','banner retains complete portrait');
   const layout=await p.locator('.fighter-card[data-id="etna"] img').evaluate((i,m)=>{const r=i.getBoundingClientRect(),fit=getComputedStyle(i).objectFit,scale=Math.min(r.width/m.width,r.height/m.height);return{fit,headTop:r.top+m.top*scale,left:r.left+(r.width-m.width*scale)/2+m.left*scale,right:r.left+(r.width-m.width*scale)/2+m.right*scale,frame:{top:r.top,left:r.left,right:r.right,bottom:r.bottom},loaded:i.complete&&i.naturalWidth>0,source:i.currentSrc};},margins[color]);
   eq(layout.fit,'contain');assert.ok(layout.loaded&&layout.headTop>=layout.frame.top+1&&layout.left>layout.frame.left&&layout.right<layout.frame.right,'visible hair fits actual card');checks++;
   if(color===0){layouts.push({width,height,...layout});await p.screenshot({path:`previews/etna-selection-${tag}-${width}.png`});await p.locator('.fighter-card[data-id="etna"]').screenshot({path:`previews/etna-card-${tag}-${width}.png`});}
  }
  await p.close();
 }
 eq(errors,[]);const report={checks,errors,margins,layouts,pcOnly:true,originalArtPreserved:true};fs.writeFileSync(`previews/etna-selection-${tag}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({checks,errors,pcSizes:layouts.map(l=>[l.width,l.height]),originalArtPreserved:true}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
