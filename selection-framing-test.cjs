'use strict';
// Actual baked portraits and actual card styles; no source-sheet parsing.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{chromium}=require('playwright'),{align,project}=require('./selection-framing.cjs');
const policy=require('./selection-framing-guides.json'),sources=require('./.tools/selection-portrait-sources.json'),manifest=require('./assets/ready/manifest.json');
const ids=process.env.ART_IDS?.split(',').filter(Boolean)||Object.keys(policy.characters),out='previews/selection-framing',url=process.env.GAME_URL||'http://localhost:4181';
(async()=>{fs.mkdirSync(out,{recursive:true});let protectedBounds=0;
 for(const id of ids){const g=policy.characters[id],s=sources[id],m=manifest.characters[id];assert.ok(g&&s&&m,id+' has reviewed art');assert.equal(g.source,s.source,id+' source requires a new review after replacement');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(s.source)).digest('hex'),g.sourceSha256,id+' reviewed source pixels');assert.deepEqual(align(g.referenceCrop,g,policy).crop,s.crop,id+' stable authored crop');assert.deepEqual(m.selectionCrop,s.crop,id+' distribution matches authoring');assert.equal(m.selectionPortraits.length,5);assert.ok(g.eye.every(Number.isFinite)&&g.span>0&&Number.isFinite(g.top));}
 if(process.env.ART_BASELINE_MANIFEST){const before=JSON.parse(fs.readFileSync(process.env.ART_BASELINE_MANIFEST));for(const id of ids){const old=before.characters[id],now=manifest.characters[id],strip=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!k.startsWith('selection')&&!k.startsWith('presentation')));assert.deepEqual(strip(now),strip(old),id+' combat art is unchanged');assert.deepEqual(now.presentationPortraits||now.selectionPortraits,old.presentationPortraits||old.selectionPortraits,id+' victory art is unchanged');assert.equal(now.presentationFocus??.5,old.presentationFocus??.5,id+' victory focus is unchanged');}}
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function checkSquareCards(){
  const cards=await page.locator('.fighter-card:not([hidden])').evaluateAll(elements=>elements.map(card=>{
   const {width,height}=card.getBoundingClientRect(),img=card.querySelector('img');
   return {id:card.dataset.id,width,height,fit:img&&getComputedStyle(img).objectFit};
  }));
  assert.ok(cards.length>0);
  for(const {id,width,height,fit} of cards){
   assert.ok(width>0&&Math.abs(width-height)<1,id+' has a square frame');
   if(fit)assert.equal(fit,'contain',id+' displays the full authored portrait');
  }
 }
 try{await page.goto(url);await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');
  for(const [width,height] of [[1280,720],[1920,1080],[1440,900]]){
   await page.setViewportSize({width,height});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await checkSquareCards();
  }
  if(!process.env.ART_IDS)assert.deepEqual((await page.evaluate(()=>Roster.selectable.map(v=>v.id))).sort(),ids.slice().sort(),'each selectable character has a reviewed face guide');
  const rows=await page.evaluate(({ids,paths})=>ids.map(id=>{const el=document.querySelector('.fighter-card[data-id="'+id+'"] img'),r=el.getBoundingClientRect(),style=getComputedStyle(el),d=Roster.selectable.find(v=>v.id===id);return{id,name:d.name,number:d.displayNumber,ratio:r.width/r.height,fit:style.objectFit,position:style.objectPosition,src:paths[id]};}),{ids,paths:Object.fromEntries(ids.map(id=>[id,manifest.characters[id].selectionPortraits[0]]))});
  for(const row of rows){const g=policy.characters[row.id],p=project(sources[row.id].crop,{...g,eye:[g.faceCenterX,g.eye[1]]},{aspect:row.ratio,fit:row.fit,position:row.position.split(' ').map(v=>parseFloat(v)/100)});assert.ok(Math.abs(p.x-.5)<.005,row.id+' uses the whole-face center instead of eye X');}
  for(const row of rows){const g=policy.characters[row.id];if(!g.faceBounds)continue;const [l,t,r,b]=g.faceBounds,position=row.position.split(' ').map(v=>parseFloat(v)/100);for(const point of [[l,t],[r,b]]){const p=project(sources[row.id].crop,{eye:point,span:1,top:point[1]},{aspect:row.ratio,fit:row.fit,position});assert.ok(p.x>=-.01&&p.x<=1.01&&p.eye>=-.01&&p.eye<=1.01,row.id+' reviewed eyes/cheeks/chin fit the default card (hair tips may cross its edge)');}protectedBounds++;}
  if(process.argv.includes('--review')){await page.screenshot({path:out+'/after-roster.png'});for(let start=0;start<rows.length;start+=36){const data=await page.evaluate(async rows=>{const c=document.createElement('canvas');c.width=1440;c.height=1200;const g=c.getContext('2d');g.fillStyle='#0b1523';g.fillRect(0,0,c.width,c.height);for(let n=0;n<rows.length;n++){const d=rows[n],img=new Image();img.src=d.src;await img.decode();const x=n%6*240+8,y=Math.floor(n/6)*200+26,w=224,h=w/d.ratio,[px,py]=d.position.split(' ').map(v=>parseFloat(v)/100),k=(d.fit==='contain'?Math.min:Math.max)(w/img.width,h/img.height);g.fillStyle='#28364c';g.fillRect(x,y,w,h);g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.drawImage(img,x+(w-img.width*k)*px,y+(h-img.height*k)*py,img.width*k,img.height*k);g.restore();g.strokeStyle='#8bdfff55';g.setLineDash([3,4]);g.beginPath();g.moveTo(x+w/2,y);g.lineTo(x+w/2,y+h);g.moveTo(x,y+h*.48);g.lineTo(x+w,y+h*.48);g.stroke();g.setLineDash([]);g.font='14px sans-serif';g.fillStyle='#fff';g.fillText(d.number+' '+d.id,x,y-7);g.font='12px sans-serif';g.fillText(d.name,x,y+h+17);}return c.toDataURL();},rows.slice(start,start+36));fs.writeFileSync(out+'/after-'+(start/36+1)+'.png',Buffer.from(data.split(',')[1],'base64'));}}
  // Filtering should keep the same square shape as the full grid.
  await page.evaluate(()=>{for(const id of ['astro','nargacuga','presea'])FighterLibrary.toggleFavorite(id);});await page.click('[data-library-scope="favorites"]');await page.waitForTimeout(100);
  await checkSquareCards();
  const filteredCards=await page.locator('.fighter-card:not([hidden]) img').count();
  if(process.argv.includes('--review'))await page.screenshot({path:out+'/after-filtered.png'});assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,characters:ids.length,protectedBounds,filteredCards,review:process.argv.includes('--review')}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
