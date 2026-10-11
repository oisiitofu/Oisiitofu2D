const fs=require('fs'),{chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try{
  const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:4173');
  await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  const immediate=await p.evaluate(()=>Roster.definitions.map(d=>({name:'portrait available before first HUD frame '+d.id,pass:!!ArtLoader.hudPortrait(d.id,0)})));
  await p.evaluate(()=>Roster.definitions.forEach(d=>{for(let color=0;color<5;color++)ArtLoader.hudPortrait(d.id,color);}));
  await p.waitForFunction(()=>Roster.definitions.every(d=>Array.from({length:5},(_,color)=>{const img=ArtLoader.hudPortrait(d.id,color);return img?.src.endsWith(ArtLoader.portrait(d.id,color,d.pose,true));}).every(Boolean)),null,{timeout:30000});
  const checks=immediate.concat(await p.evaluate(()=>Roster.definitions.flatMap(d=>Array.from({length:5},(_,color)=>{const img=ArtLoader.hudPortrait(d.id,color),url=ArtLoader.portrait(d.id,color,d.pose,true);return{name:'selection framing in HUD '+d.id+' '+color,pass:img.src.endsWith(url)&&Math.abs(img.width/img.height-1.4)<.05};}))));
  fs.writeFileSync('.tools/hud-portrait-results.json',JSON.stringify({checks,errors},null,2));
  console.log({checks:checks.length,failed:checks.filter(c=>!c.pass),errors});
  if(checks.some(c=>!c.pass)||errors.length)process.exitCode=1;
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
