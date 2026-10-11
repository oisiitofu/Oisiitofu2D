const fs=require('fs'),assert=require('assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));await page.goto(process.env.GAME_URL||'http://localhost:4173');
  await page.click('#enter-training');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';countdown=0;ctx.setTransform(1,0,0,1,0,0);
   const textures={ulgrim:[0,1,2,3,4],chiikawa:[3],riki:[6],okami:[0],gundam:[3],zero:[0],rin:[0,1],lightning:[0],
    colette:[0],rean:[0],estelle:[0],noctis:[0,1],clive:[0],makoto:[0],neku:[0],narukami:[0],naegi:[0,2],rex:[0,1],
    luke:[0],will:[0],kosmos:[0],fayt:[0,1],emma:[0,2],ryza:[0],noah:[0,1,2],lloyd:[0,1],shiren:[0,1],
    hunter:[0,1],adol:[0,1],valkyrie:[0,1],pawapuro:[1,2],headmaster:[0],sakuna:[0,1],haseo:[0,2],
    terrarian:[0,1,5],horse:[0,1],chef:[0,1],akira:[1],fei:[0,6],human:[1,4],kitten:[0,1],elma:[4],
    dante:[0,1,3],leon:[0,1,2,3],tifa:[1,2],zidane:[0,1,4],yuffie:[0,2,4],vincent:[0,1,2],kiryu:[0,1],crash:[1],charlotta:[0,6],ryofu:[0,1,2],mametchi:[0,1],piposaru:[0,6],aruru:[7],maruku:[0,1,2,5],dietrich:[0,1,2],twinbee:[0,2,3,4],goemon:[0,1],bayleef:[0],nier:[0,2],miku:[0,6],jibanyan:[0,3]};
   const failures=[],counts={},skips=[];let cases=0,arcs=0,mirrors=0;
   for(const {id}of Roster.definitions){
    counts[id]=0;
    for(const [type,data]of Object.entries(movesFor(makeFighter(0,0,id)))){
     if(type==='grab'||type==='pummel'||type.endsWith('Throw'))continue;
     for(const window of data.activeFrames){
      for(const time of new Set([window.start,Math.round((window.start+window.end)/2),window.end])){
       const pair=[];
       for(const face of [1,-1]){
        const f=makeFighter(0,0,id);f.x=720;f.y=440;f.face=face;f.inv=0;f.grounded=!data.aerial;
        fighters=[f,makeFighter(1,0,'dragoon')];fighters[1].x=1400;
        if(!attack(f,type)){skips.push(id+':'+type);continue;}
        f.timer=time;const active=CombatData.activeWindow(f.attack,time);if(!active)continue;
        let boxes;try{boxes=attackBoxes(f);}catch(e){skips.push(id+':'+type+' (requires preceding move state)');continue;}
        const seen=[],saved=ctx.drawImage;
        ctx.drawImage=function(img,...args){
         const n=characterArt[id].effects.indexOf(img);
         if(textures[id]?.includes(n)){
          const m=ctx.getTransform(),source=SlashVFX.sources[id]?.[n];
          let ax=source==='down'?m.c:source==='left'?-m.a:m.a,ay=source==='down'?m.d:source==='left'?-m.b:m.b;
          const len=Math.hypot(ax,ay);seen.push({n,x:ax/len,y:ay/len});
         }
         return saved.call(this,img,...args);
        };
        try{CombatVFX.slash(f);drawSprite(f);}catch(e){failures.push({id,type,time,face,error:e.message});}
        finally{ctx.drawImage=saved;}
        counts[id]++;cases++;pair.push({seen,boxes,shape:active.shape});
        if(['spin','shockwave'].includes(active.shape)||f.attack.hold)continue;
        for(const s of seen){
         const dots=boxes.filter(b=>Math.hypot(b.x2-b.x1,b.y2-b.y1)>1).map(b=>{
          const dx=b.x2-b.x1,dy=b.y2-b.y1,l=Math.hypot(dx,dy);return(s.x*dx+s.y*dy)/l;
         });
         if(!dots.length)continue;arcs++;
         if(Math.max(...dots)<.7)failures.push({id,type,time,face,n:s.n,dot:Math.max(...dots)});
        }
       }
       // Radial fields have no facing. World-directed attacks can also keep
       // their heading independently of the body; mirror only mirrored capsules.
       if(pair.length===2&&!['spin','shockwave'].includes(pair[0].shape)&&pair[0].seen.length===pair[1].seen.length&&pair[0].boxes.every((a,j)=>{
        const b=pair[1].boxes[j];return b&&Math.abs(a.x2-a.x1+b.x2-b.x1)<1e-5&&Math.abs(a.y2-a.y1-b.y2+b.y1)<1e-5;
       })){
        for(let j=0;j<pair[0].seen.length;j++){
         const a=pair[0].seen[j],b=pair[1].seen[j];mirrors++;
         if(Math.abs(a.x+b.x)>1e-5||Math.abs(a.y-b.y)>1e-5)failures.push({id,type,time,mirror:[a,b]});
        }
       }
      }
     }
    }
   }
   return{characters:Object.keys(counts).length,cases,arcs,mirrors,counts,skips:[...new Set(skips)],failures};
  });
  fs.writeFileSync('.tools/slash-direction-results.json',JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({...result,counts:undefined,errors},null,2));
  assert.equal(result.characters,113);assert.equal(result.failures.length,0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});



