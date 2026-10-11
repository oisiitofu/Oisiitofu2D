const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  await page.screenshot({path:'ui-blue-home-preview.png'});
  await page.click('#enter-training');await page.screenshot({path:'ui-blue-roster-preview.png'});await page.click('#start');
  const result=await page.evaluate(()=>{
   simulationSpeed=0;acc=0;
   const movement=Roster.definitions.map(({id})=>{
    const f=makeFighter(0,0,id);f.grounded=false;f.x=1250;f.y=0;f.vy=2;f.inv=0;
    fighters=[f,makeFighter(1,0,'dragoon')];
    frame++;updateFighter(f,{...emptyInput(),y:1});const first=f.vy,activated=f.fastFall;
    for(let n=0;n<20;n++){frame++;updateFighter(f,{...emptyInput(),y:1});}
    return{id,activated,first,cap:f.character.fastFallSpeed,normal:f.character.fallSpeed,end:f.vy};
   });
   const art=['roxas','lightning'].map(id=>({id,poses:characterArt[id].frames.map(c=>{
    const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let pixels=0;
    for(let n=3;n<d.length;n+=4)if(d[n]>30)pixels++;
    return{w:c.width,h:c.height,pixels};
   })}));
   return{movement,art,accent:getComputedStyle(document.documentElement).getPropertyValue('--lime').trim()};
  });
  for(const row of result.movement){
   assert.ok(row.activated&&row.first>2&&row.first<row.cap,row.id+' ramps into fast fall');
   assert.ok(Math.abs(row.cap/row.normal-1.25)<1e-9,row.id+' fast fall cap');
   assert.equal(row.end,row.cap,row.id+' reaches cap');
  }
  for(const {id,poses}of result.art){
   assert.equal(poses.length,40);
   poses.forEach((p,n)=>assert.ok(p.pixels>1000,id+' visible pose '+n));
   if(id==='roxas')for(const n of [14,15,16,17])assert.ok(poses[n].w<315,'Roxas single figure region '+n);
   if(id==='lightning'){assert.equal(poses[0].h,265);assert.ok(poses[17].h<230&&poses[23].h<290,'Lightning low stance and ledge separated');}
  }
  assert.match(result.accent,/68baff/i,'UI accent is blue');
  for(const variant of [1,2,3]){
   const b=fs.readFileSync('assets/audio/se/menu-'+variant+'.wav'),duration=(b.length-44)/(48000*4);
   assert.ok(duration<.15,'Menu cue is a short click');
   let energy=0,count=0;for(let p=44+Math.floor(48000*.08)*4;p<b.length;p+=2){energy+=(b.readInt16LE(p)/32768)**2;count++;}
   assert.ok(Math.sqrt(energy/count)<.01,'Menu cue has no ringing tail');
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({characters:result.movement.length,visiblePoses:80,accent:result.accent,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
