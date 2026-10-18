const fs=require('fs'),assert=require('assert/strict'),{chromium}=require('playwright');
const audit=require('./slash-texture-audit.json'),manifest=require('./assets/ready/manifest.json');
// Expected VISIBLE convex edges are independent of production SlashVFX.sources.
// A changed baked image requires another native-pixel review.
for(const[id,v]of Object.entries(audit))assert.equal(manifest.characters[id].image,v.image,id+' source changed: inspect convex edge again');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));await page.addInitScript(()=>navigator.getGamepads=()=>[]);
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  await page.click('#enter-training');await page.click('#start');await page.waitForFunction(()=>state==='battle');
  const result=await page.evaluate(async audit=>{
   state='pause';countdown=hitstop=0;training=false;
   const failures=[],counts={},skips=[],textures=new Set();let cases=0,arcs=0,radial=0;
   for(const{id}of Roster.definitions){
    await ArtLoader.load(id);counts[id]=0;
    const art=characterArt[id],images=new Map(art.effects.map((img,n)=>[img,n]));
    for(const[type,data]of Object.entries(movesFor(makeFighter(0,0,id)))){
     if(type==='grab'||type==='pummel'||type.endsWith('Throw'))continue;
     for(const window of data.activeFrames)for(const time of new Set([window.start,Math.round((window.start+window.end)/2),window.end]))for(const face of[1,-1]){
      const f=makeFighter(0,0,id);f.x=720;f.y=440;f.face=face;f.inv=0;f.grounded=!data.aerial;
      fighters=[f,makeFighter(1,0,'dragoon')];fighters[1].x=1400;
      if(!attack(f,type)){skips.push(id+':'+type);continue;}
      f.timer=time;const active=CombatData.activeWindow(f.attack,time);if(!active)continue;
      let boxes;try{boxes=id==='tifa'?TifaVFX.segments(f).map(v=>({x1:v.from.x,y1:v.from.y,x2:v.to.x,y2:v.to.y})):attackVisualBoxes(f);}catch(e){skips.push(id+':'+type+' (requires preceding move state)');continue;}
      const seen=[],saved=ctx.drawImage;ctx.setTransform(1,0,0,1,0,0);
      ctx.drawImage=function(img,x,y,w,h){
       const n=images.get(img),native=audit[id]?.effects[n];
       if(native){
        const m=ctx.getTransform(),sx=native[0]*w/img.width,sy=native[1]*h/img.height;
        const ax=m.a*sx+m.c*sy,ay=m.b*sx+m.d*sy,len=Math.hypot(ax,ay);
        seen.push({n,x:ax/len,y:ay/len,cx:m.a*(x+w/2)+m.c*(y+h/2)+m.e,cy:m.b*(x+w/2)+m.d*(y+h/2)+m.f});textures.add(id+':'+n);
       }
       return saved.apply(this,arguments);
      };
      try{CombatVFX.slash(f);drawSprite(f);}catch(e){failures.push({id,type,time,face,error:e.message});}finally{ctx.drawImage=saved;}
      cases++;counts[id]++;
      if(active.shape==='spin'){
       if(id==='laharl'){
        radial++;if(seen.length!==2||!seen.some(s=>s.x<-.9&&s.cx<f.x)||!seen.some(s=>s.x>.9&&s.cx>f.x))failures.push({id,type,time,face,radial:seen});
       }
       continue;
      }
      if(active.shape==='shockwave'||f.attack.hold)continue;
      for(const s of seen){
       const dots=boxes.filter(b=>Math.hypot(b.x2-b.x1,b.y2-b.y1)>1).map(b=>{const dx=b.x2-b.x1,dy=b.y2-b.y1,l=Math.hypot(dx,dy);return(s.x*dx+s.y*dy)/l;});
       if(!dots.length)continue;arcs++;
       if(Math.max(...dots)<.7)failures.push({id,type,time,face,n:s.n,dot:Math.max(...dots)});
      }
     }
    }
    fighters=[];ArtLoader.retain([]);
   }
   return{characters:Object.keys(counts).length,cases,arcs,radial,textures:[...textures],counts,skips:[...new Set(skips)],failures};
  },audit);
  fs.writeFileSync('.tools/slash-curve-results.json',JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({...result,counts:undefined,textures:result.textures.length,failures:result.failures.slice(0,40),errors},null,2));
  assert.equal(result.characters,Object.keys(manifest.characters).length);assert.ok(result.radial>0);assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
