const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});try{
 const p=await b.newPage(),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
 const sizes=[[1920,1080],[1440,900],[1366,768],[1280,720],[1024,640],[820,1180],[390,844],[375,667],[844,390]];
 const layout=()=>p.evaluate(()=>{const g=document.querySelector('#fighter-grid'),rect=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];};return{columns:g.style.getPropertyValue('--roster-columns'),rows:g.style.getPropertyValue('--roster-rows'),cards:[...g.children].map(c=>({card:rect(c),image:rect(c.querySelector('img')||c.querySelector('.random-symbol')),src:c.querySelector('img')?.src||''})),selected:Roster.selected,color:selected,mode:document.querySelector('#battle-mode').value,live:document.querySelector('.live').textContent,summary:document.querySelector('#match-summary').textContent};});
 for(const mode of ['training','battle'])for(const [width,height]of sizes){
  await p.setViewportSize({width,height});await p.evaluate(mode=>Roster.open(mode),mode);await p.click('[data-id="akira"]');await p.click('#swatches button:nth-child(4)');
  const before=await layout();
  for(let repeat=0;repeat<2;repeat++){
   await p.click('#start');await p.click('#pausebutton');await p.click('#pause .back');assert.deepEqual(await layout(),before,mode+' pause return '+width+'x'+height);checks.push({mode,width,height,path:'pause',repeat});
  }
  await p.click('#start');await p.evaluate(()=>{countdown=0;finish();});await p.click('#result .back');assert.deepEqual(await layout(),before,mode+' result return '+width+'x'+height);checks.push({mode,width,height,path:'result'});
  // A resize while the roster is hidden must not replace its dimensions with zero-width values.
  await p.click('#start');await p.setViewportSize({width:width===1440?1024:1440,height:900});await p.waitForTimeout(40);
  assert.deepEqual(await p.locator('#fighter-grid').evaluate(g=>[g.style.getPropertyValue('--roster-columns'),g.style.getPropertyValue('--roster-rows')]),[before.columns,before.rows]);
  await p.click('#pausebutton');await p.click('#pause .back');const resized=await layout();await p.evaluate(mode=>Roster.open(mode),mode);assert.deepEqual(await layout(),resized,mode+' hidden resize return');checks.push({mode,width,height,path:'hidden resize'});
 }
 await p.setViewportSize({width:1440,height:900});await p.evaluate(()=>Roster.open('training'));await p.click('#start');await p.click('#pausebutton');await p.click('#pause .back');await p.screenshot({path:'roster-return-preview.png'});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({total:checks.length,checks,errors},null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
